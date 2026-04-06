import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronRight, Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { SIDEBAR_SECTIONS, TOP_TABS, getAllSlugs, findLabelForSlug } from '@/components/docs/DocsData';
import { DocsPageContent } from '@/components/docs/DocsPageContent';

const Docs = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('guides');
  const { theme, toggleTheme } = useTheme();

  const activeSlug = slug || 'quick-start';

  // Search filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return getAllSlugs()
      .filter(s => {
        const label = findLabelForSlug(s) || '';
        return label.toLowerCase().includes(q) || s.includes(q);
      })
      .slice(0, 8);
  }, [searchQuery]);

  const handleSlugClick = (s: string) => {
    setActiveTab('guides');
    navigate(`/docs/${s}`);
    setSidebarOpen(false);
    setSearchQuery('');
  };

  const handleTabClick = (tabSlug: string) => {
    setActiveTab(tabSlug);
    if (tabSlug === 'guides') {
      navigate(`/docs/${activeSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary">
                <path d="M12 3L20 19H4L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M12 9L16 17H8L12 9Z" fill="currentColor" opacity="0.3" />
              </svg>
              <span className="font-bold text-foreground text-[15px] tracking-tight hidden sm:inline">APEX</span>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 relative">
            <div className={`relative flex items-center rounded-lg border transition-colors ${searchFocused ? 'border-primary/50 bg-card' : 'border-border/40 bg-card/50'}`}>
              <Search size={14} className="absolute left-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground pl-9 pr-12 py-2 outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 rounded border border-border/50 bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>

            {/* Search Results Dropdown */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border/50 bg-card shadow-lg z-50 overflow-hidden">
                {searchResults.length > 0 ? (
                  searchResults.map(s => (
                    <button
                      key={s}
                      onMouseDown={() => handleSlugClick(s)}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Search size={12} className="text-muted-foreground" />
                      {findLabelForSlug(s)}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[13px] text-muted-foreground">No results found</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hidden md:inline text-[13px] text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <a href="https://github.com" target="_blank" rel="noopener" className="hidden md:inline text-[13px] text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-4 md:px-6 overflow-x-auto scrollbar-none">
          {TOP_TABS.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => handleTabClick(tab.slug)}
              className={`px-3 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.slug
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex">
        {/* ── Sidebar (only for Guides tab) ── */}
        {activeTab === 'guides' && (
          <>
            <aside
              className={`${
                sidebarOpen ? 'fixed inset-y-0 left-0 z-40 mt-[105px]' : 'hidden'
              } md:sticky md:top-[105px] md:block w-64 h-[calc(100vh-105px)] overflow-y-auto border-r border-border/30 bg-background px-4 py-6 shrink-0`}
            >
              {SIDEBAR_SECTIONS.map((section) => (
                <div key={section.heading} className="mb-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2.5 px-2">
                    {section.heading}
                  </h3>
                  <ul className="space-y-0.5">
                    {section.links.map((link) => (
                      <li key={link.slug}>
                        <button
                          onClick={() => handleSlugClick(link.slug)}
                          className={`w-full text-left px-2 py-1.5 rounded-md text-[13px] transition-colors ${
                            activeSlug === link.slug
                              ? 'bg-primary/[0.08] text-primary font-medium'
                              : 'text-foreground/60 hover:text-foreground hover:bg-muted/30'
                          }`}
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
          </>
        )}

        {/* ── Main Content ── */}
        <DocsPageContent activeTab={activeTab} activeSlug={activeSlug} />
      </div>
    </div>
  );
};

export default Docs;
