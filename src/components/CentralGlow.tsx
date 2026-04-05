const CentralGlow = () => (
  <svg
    className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none opacity-40"
    viewBox="0 0 900 400"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="glow-blur">
        <feGaussianBlur stdDeviation="25" />
      </filter>
    </defs>
    <ellipse
      cx="450"
      cy="180"
      rx="350"
      ry="120"
      fill="hsl(170, 60%, 30%)"
      filter="url(#glow-blur)"
    />
  </svg>
);

export default CentralGlow;
