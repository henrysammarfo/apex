import { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';

/* ── Code Block Component ── */
export const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-lg border border-border/50 bg-card overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code className="font-mono text-foreground/80">{code}</code>
      </pre>
    </div>
  );
};

/* ── Info Banner ── */
export const InfoBanner = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-3.5 my-6">
    <Info size={16} className="text-primary mt-0.5 shrink-0" />
    <p className="text-[13px] text-foreground/70 leading-relaxed">{children}</p>
  </div>
);

/* ── Feature Card ── */
export const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="group rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border/80 transition-all duration-300 p-5 cursor-pointer">
    <div className="text-muted-foreground group-hover:text-primary transition-colors mb-3">
      {icon}
    </div>
    <h4 className="font-inter font-bold text-[14px] text-foreground mb-1.5">{title}</h4>
    <p className="font-inter text-[12.5px] text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

/* ── Numbered Step ── */
export const Step = ({ num, title, children }: { num: number; title: string; children: React.ReactNode }) => (
  <div className="relative pl-12 pb-10">
    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
      <span className="text-[13px] font-bold text-primary">{num}</span>
    </div>
    <h3 className="font-inter font-bold text-[18px] text-foreground mb-3">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);
