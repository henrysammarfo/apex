const order = { error: 0, warn: 1, info: 2, debug: 3 };

function currentLevel() {
  return process.env.LOG_LEVEL || "info";
}

function out(lvl, msg, meta = {}) {
  const level = currentLevel();
  if (order[lvl] > order[level]) return;
  const line = {
    ts: new Date().toISOString(),
    lvl,
    msg,
    svc: "apex-agent",
    ...meta,
  };
  const text = JSON.stringify(line);
  if (lvl === "error") console.error(text);
  else if (lvl === "warn") console.warn(text);
  else console.log(text);
}

export const logger = {
  error: (msg, meta) => out("error", msg, meta),
  warn: (msg, meta) => out("warn", msg, meta),
  info: (msg, meta) => out("info", msg, meta),
  debug: (msg, meta) => out("debug", msg, meta),
};
