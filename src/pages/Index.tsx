import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroVideo from '@/components/HeroVideo';
import LiquidGlassCard from '@/components/LiquidGlassCard';
import CentralGlow from '@/components/CentralGlow';
import GridLines from '@/components/GridLines';
import AgentLayersSection from '@/components/AgentLayersSection';
import ArchitectureSection from '@/components/ArchitectureSection';
import TokenomicsSection from '@/components/TokenomicsSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  return (
    <div className="relative bg-background">
      {/* ── HERO ── */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Video Background */}
        <HeroVideo />

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-cn-dark via-cn-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cn-dark via-transparent to-transparent" />

        {/* Grid Lines */}
        <GridLines />

        {/* Central Glow */}
        <CentralGlow />

        {/* Navigation */}
        <Navbar />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 md:px-12 lg:px-24 pt-24">
          <div className="max-w-3xl">
            <LiquidGlassCard />

            <p className="font-jakarta font-bold text-[11px] uppercase tracking-[0.2em] text-primary mb-4">
              Autonomous Portfolio Intelligence
            </p>

            <h1 className="font-inter font-extrabold uppercase tracking-tight text-foreground text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] mb-6">
              AUTONOMOUS RWA PORTFOLIO EXECUTION<span className="text-primary">.</span>
            </h1>

            <p className="font-inter text-[14px] text-foreground/70 max-w-[512px] leading-relaxed mb-10">
              AI agents that monitor Chainlink price feeds, reason about risk, rebalance on-chain positions, and settle payments through HSP — with no human in the loop after setup.
            </p>

            <a
              href="#agents"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3.5 font-inter font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Launch Dashboard
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </div>

      {/* ── AGENT LAYERS ── */}
      <AgentLayersSection />

      {/* Divider glow */}
      <div className="relative h-px max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* ── ARCHITECTURE ── */}
      <ArchitectureSection />

      {/* Divider glow */}
      <div className="relative h-px max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* ── TOKENOMICS & REVENUE ── */}
      <TokenomicsSection />

      {/* ── FOOTER ── */}
      <Footer />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
};

export default Index;
