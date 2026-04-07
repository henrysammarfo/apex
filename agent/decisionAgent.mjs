/**
 * Decision Agent — OpenAI structured output with Zod validation for production pipeline safety.
 *
 * Env: OPENAI_API_KEY, OPENAI_MODEL (optional)
 *
 * Usage: node agent/decisionAgent.mjs
 */
import OpenAI from "openai";
import { z } from "zod";
import { ethers } from "ethers";

const DecisionSchema = z
  .object({
    action: z.enum(["rebalance", "hold"]),
    asset: z.string().nullable().optional(),
    direction: z.enum(["increase", "reduce"]).nullable().optional(),
    amountPct: z.number().min(0).max(100).nullable().optional(),
    confidence: z.number().min(0).max(100),
    reasoning: z.string().min(1).max(8000),
  })
  .superRefine((val, ctx) => {
    if (val.action === "rebalance") {
      if (!val.asset) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "rebalance requires asset" });
        return;
      }
      try {
        ethers.getAddress(val.asset);
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "rebalance requires valid asset address" });
      }
      if (!val.direction) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "rebalance requires direction" });
      }
    }
  });

export function validateDecision(raw) {
  const d = DecisionSchema.parse(raw);
  if (d.action === "rebalance" && d.asset) {
    return { ...d, asset: ethers.getAddress(d.asset) };
  }
  return d;
}

const modelDefault = "gpt-4o-mini";

const system = `You are the APEX Decision Agent for an RWA portfolio on HashKey Chain.
Respond with ONLY valid JSON (no markdown), shape:
{"action":"rebalance"|"hold","asset":"0x...|null","direction":"increase"|"reduce"|null,"amountPct":number,"confidence":0-100,"reasoning":"short plain text"}
Rules: amountPct is 0-100 (percent of that token vault balance to move) when action is rebalance; use nulls when action is hold.
Prefer smaller amountPct (e.g. 5-15) unless drift is extreme.`;

export async function decide(portfolioContext) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const model = process.env.OPENAI_MODEL || modelDefault;
  const client = new OpenAI({ apiKey });
  const user = typeof portfolioContext === "string" ? portfolioContext : JSON.stringify(portfolioContext, null, 2);

  const res = await client.chat.completions.create({
    model,
    temperature: 0.15,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `Portfolio state:\n${user}\nOutput JSON only.` },
    ],
  });

  const text = res.choices[0]?.message?.content?.trim() || "";
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("OpenAI returned non-JSON");
  }
  return validateDecision(parsed);
}

const isMain = process.argv[1]?.replace(/\\/g, "/").includes("decisionAgent");
if (isMain) {
  const demo = {
    targetsBps: { silver: 3000, mmf: 5000, sec: 2000 },
    currentBps: { silver: 3800, mmf: 4200, sec: 2000 },
    note: "Silver drifted +8% vs target; MMF low.",
  };
  decide(demo)
    .then((out) => {
      console.log(JSON.stringify(out, null, 2));
    })
    .catch((err) => {
      console.error(err.message || err);
      process.exit(1);
    });
}
