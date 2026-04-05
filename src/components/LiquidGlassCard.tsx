const LiquidGlassCard = () => {
  return (
    <div className="liquid-glass w-[200px] h-[200px] rounded-2xl p-5 flex flex-col justify-between translate-y-[-50px]">
      <span className="font-inter text-[14px] text-muted-foreground tracking-widest">
        [ 2026 ]
      </span>
      <div>
        <h3 className="font-inter text-[18px] leading-snug text-foreground">
          4{' '}
          <span className="font-instrument italic">Autonomous</span>{' '}
          Agent Layers
        </h3>
      </div>
      <p className="font-inter text-[11px] text-foreground/50 leading-relaxed">
        Monitor · Decide · Execute · Settle — on HashKey Chain.
      </p>
    </div>
  );
};

export default LiquidGlassCard;
