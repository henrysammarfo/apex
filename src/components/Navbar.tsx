import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = ['AGENTS', 'ARCHITECTURE', 'ECOSYSTEM', 'DOCS'];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
      {/* Logo */}
      <a href="/" className="font-inter text-foreground text-xl font-bold tracking-tight">
        APEX
      </a>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="font-inter text-[16px] text-foreground/80 hover:text-primary transition-colors duration-200"
          >
            {link}
          </a>
        ))}
      </nav>

      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-foreground z-50"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="font-inter text-2xl text-foreground/80 hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
