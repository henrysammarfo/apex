import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroVideo from '@/components/HeroVideo';
import LiquidGlassCard from '@/components/LiquidGlassCard';
import CentralGlow from '@/components/CentralGlow';
import GridLines from '@/components/GridLines';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
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
          {/* Liquid Glass Card */}
          <LiquidGlassCard />

          {/* Eyebrow */}
          <p className="font-jakarta font-bold text-[11px] uppercase tracking-[0.2em] text-primary mb-4">
            Career-Ready Curriculum
          </p>

          {/* Main Headline */}
          <h1 className="font-inter font-extrabold uppercase tracking-tight text-foreground text-[40px] md:text-[56px] lg:text-[72px] leading-[1.05] mb-6">
            LAUNCH YOUR CODING CAREER<span className="text-primary">.</span>
          </h1>

          {/* Description */}
          <p className="font-inter text-[14px] text-foreground/70 max-w-[512px] leading-relaxed mb-10">
            Master in-demand coding skills with hands-on projects, real-world mentorship, and a curriculum designed to get you hired. Join thousands of graduates building the future.
          </p>

          {/* CTA */}
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3.5 font-inter font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
