import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { Navbar } from './components/Navbar';
import { AgeVerification } from './components/AgeVerification';
import { Home } from './pages/Home';
import { StoryDetail } from './pages/StoryDetail';
import { CreateStory } from './pages/CreateStory';
import { Profile } from './pages/Profile';
import { Legal } from './pages/Legal';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { SensualLanding } from './pages/SensualLanding';
import { RomanticLiterature } from './pages/RomanticLiterature';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { ThemeProvider } from './ThemeContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/relatos-eroticos" element={<SensualLanding />} />
          <Route path="/literatura-romantica" element={<RomanticLiterature />} />
          <Route path="/story/:storyId" element={<StoryDetail />} />
          <Route path="/create" element={<CreateStory />} />
          <Route path="/edit/:storyId" element={<CreateStory />} />
          <Route path="/profile/:uid" element={<Profile />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen selection:bg-white selection:text-black">
            <AgeVerification />
            <Toaster position="top-center" theme="dark" />
            <Navbar />
            <main>
              <AnimatedRoutes />
            </main>
            
            <footer className="py-20 border-t border-white/10 mt-20">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-xl font-serif tracking-tighter">
                  FANTASY<span className="italic font-light opacity-60">MIND</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                  © 2026 FantasyMind. Contenido para adultos.
                </div>
                <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/40">
                  <Link to="/relatos-eroticos" className="hover:text-white transition-colors">Relatos Eróticos</Link>
                  <Link to="/legal" className="hover:text-white transition-colors">Privacidad</Link>
                  <Link to="/legal" className="hover:text-white transition-colors">Términos</Link>
                  <Link to="/contact" className="hover:text-white transition-colors">Contacto</Link>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
