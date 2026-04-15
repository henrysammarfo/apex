import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'AGENTS', href: '#agents' },
  { label: 'ARCHITECTURE', href: '#architecture' },
  { label: 'ECOSYSTEM', href: '#ecosystem' },
  { label: 'FAUCET', href: '/docs/quick-start', isRoute: true },
  { label: 'DOCS', href: '/docs', isRoute: true },
];

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
        {NAV_LINKS.map((link) =>
          link.isRoute ? (
            <Link
              key={link.label}
              to={link.href}
              className="font-inter text-[16px] text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="font-inter text-[16px] text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          )
        )}
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
          {NAV_LINKS.map((link) =>
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setOpen(false)}
                className="font-inter text-2xl text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-inter text-2xl text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
