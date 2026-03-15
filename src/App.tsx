import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';
import WhatIsORS from '@/components/WhatIsORS';
import HowItWorks from '@/components/HowItWorks';
import EncoderDecoder from '@/components/EncoderDecoder';
import ReferenceClients from '@/components/ReferenceClients';
import Architecture from '@/components/Architecture';
import WebOfTrust from '@/components/WebOfTrust';
import SpamResistance from '@/components/SpamResistance';
import BringYourOwnClient from '@/components/BringYourOwnClient';
import SpecLinks from '@/components/SpecLinks';
import Community from '@/components/Community';
import Footer from '@/components/Footer';

export default function App() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-[#f7931a] tracking-tight">ORS</span>
            <span className="text-border/60">|</span>
            <span className="font-mono text-xs text-muted-foreground tracking-widest hidden sm:block">OP_RETURN SOCIAL</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <a href="#how-it-works" className="font-mono text-xs text-muted-foreground hover:text-foreground tracking-widest transition-colors">HOW IT WORKS</a>
              <span className="text-border/60">|</span>
              <a href="#tools" className="font-mono text-xs text-muted-foreground hover:text-foreground tracking-widest transition-colors">TOOLS</a>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDark(d => !d)}
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <Hero />
      <main className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        <WhatIsORS />
        <HowItWorks />
        <div id="tools"><EncoderDecoder /></div>
        <ReferenceClients />
        <SpecLinks />
        <Architecture />
        <WebOfTrust />
        <SpamResistance />
        <BringYourOwnClient />
        <Community />
      </main>

      <Footer />
    </div>
  );
}
