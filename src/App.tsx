import React from "react";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import LiveComments from "./components/LiveComments";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream font-body">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-nb-yellow border-b-2 border-charcoal">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-display text-xl font-black text-charcoal tracking-tight">
              ham
            </span>
            <div className="bg-charcoal px-1.5 py-0.5 -rotate-2">
              <span className="font-display text-xl font-black text-nb-yellow tracking-tight">
                mam
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <a href="#projects" className="px-2 py-1.5 text-xs font-semibold text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-nb-yellow transition-all duration-150">Proyek</a>
            <a href="#pendidikan" className="px-2 py-1.5 text-xs font-semibold text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-nb-yellow transition-all duration-150">Pendidikan</a>
            <a href="#comments" className="px-2 py-1.5 text-xs font-semibold text-charcoal border-2 border-charcoal hover:bg-charcoal hover:text-nb-yellow transition-all duration-150">Komentar</a>
          </div>
        </div>
      </nav>

      <Hero />
      <Projects />
      <Skills />
      <LiveComments />

      <footer className="py-8 text-center text-sm font-semibold border-t-2 border-charcoal bg-charcoal text-nb-yellow">
        © 2026 Muhammad Hammam Ghazi
      </footer>
    </div>
  );
};

export default App;