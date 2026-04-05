const GridLines = () => (
  <div className="absolute inset-0 pointer-events-none hidden md:block">
    <div className="absolute left-1/4 top-0 bottom-0 w-px bg-foreground/10" />
    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-foreground/10" />
    <div className="absolute left-3/4 top-0 bottom-0 w-px bg-foreground/10" />
  </div>
);

export default GridLines;
