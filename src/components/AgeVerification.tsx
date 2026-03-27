import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

export const AgeVerification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified');
    if (!isVerified) {
      setIsVisible(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full text-center space-y-8"
          >
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-red-600/10 flex items-center justify-center">
                <ShieldAlert size={48} className="text-red-600" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-serif font-light tracking-tighter">Advertencia de Contenido</h1>
              <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest">
                “Declaro bajo protesta de decir verdad que soy mayor de 18 años y acepto acceder a contenido para adultos.”
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button
                onClick={handleVerify}
                className="w-full bg-white text-black py-5 rounded-full font-serif text-xl hover:bg-red-600 hover:text-white transition-all duration-500"
              >
                Acepto - Entrar
              </button>
              <button
                onClick={handleExit}
                className="w-full py-4 text-white/20 uppercase tracking-[0.3em] text-[10px] hover:text-white transition-colors"
              >
                No soy mayor de edad - Salir
              </button>
            </div>

            <p className="text-[8px] text-white/10 uppercase tracking-widest">
              FantasyMind promueve el consentimiento y la legalidad en todos sus relatos.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
