const LiquidGlassCard = () => {
  return (
    <div className="liquid-glass w-[200px] h-[200px] rounded-2xl p-5 flex flex-col justify-between translate-y-[-50px]">
      <span className="font-inter text-[14px] text-muted-foreground tracking-widest">
        [ 2025 ]
      </span>
      <div>
        <h3 className="font-inter text-[18px] leading-snug text-foreground">
          Taught by{' '}
          <span className="font-instrument italic">Industry</span>{' '}
          Professionals
        </h3>
      </div>
      <p className="font-inter text-[11px] text-foreground/50 leading-relaxed">
        Real-world mentors from top tech companies guide your learning journey.
      </p>
    </div>
  );
};

export default LiquidGlassCard;
