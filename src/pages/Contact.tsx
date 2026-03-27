import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, MessageSquare, HelpCircle, Lightbulb, ShieldCheck } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { toast } from 'sonner';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tema: '',
    mensaje: '',
    antispam: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple anti-spam check
    const answer = formData.antispam.toLowerCase().trim();
    if (answer !== 'azul' && answer !== 'blue') {
      toast.error('Respuesta anti-spam incorrecta. Inténtalo de nuevo.');
      return;
    }

    if (!formData.tema) {
      toast.error('Por favor, selecciona un tema para tu mensaje.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
      setFormData({
        nombre: '',
        email: '',
        tema: '',
        mensaje: '',
        antispam: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Hubo un error al enviar el mensaje. Por favor, inténtalo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <header className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40">
              <Mail size={32} />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tighter leading-tight">
            Contacto <span className="italic opacity-40">Directo</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] max-w-md mx-auto">
            Estamos aquí para escucharte. Envíanos tus dudas, sugerencias o comentarios.
          </p>
        </header>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-4">Nombre:</label>
                <input 
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Tu nombre o seudónimo"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-white outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-4">E-mail:</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-white outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-4">Tema:</label>
              <div className="relative">
                <select 
                  required
                  value={formData.tema}
                  onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-white outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-[#0a0a0a]">-- Seleccione el tema del mensaje --</option>
                  <option value="comentario" className="bg-[#0a0a0a]">Comentario</option>
                  <option value="ayuda" className="bg-[#0a0a0a]">Ayuda</option>
                  <option value="sugerencia" className="bg-[#0a0a0a]">Sugerencia</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  {formData.tema === 'comentario' && <MessageSquare size={18} />}
                  {formData.tema === 'ayuda' && <HelpCircle size={18} />}
                  {formData.tema === 'sugerencia' && <Lightbulb size={18} />}
                  {!formData.tema && <div className="w-4 h-4 border-r-2 border-b-2 border-white rotate-45 -translate-y-1"></div>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 ml-4">Mensaje:</label>
              <textarea 
                required
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                placeholder="Escribe aquí tu mensaje detallado..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[150px] text-sm focus:border-white outline-none transition-colors resize-none"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-white/40">
                <ShieldCheck size={18} />
                <label className="text-[10px] uppercase tracking-[0.2em]">Anti-Spam:</label>
              </div>
              <div className="space-y-2">
                <p className="text-sm italic ml-4">¿De qué color es el cielo?</p>
                <input 
                  type="text"
                  required
                  value={formData.antispam}
                  onChange={(e) => setFormData({ ...formData, antispam: e.target.value })}
                  placeholder="Respuesta aquí..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-white outline-none transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 rounded-full bg-white text-black font-serif text-xl hover:bg-red-600 hover:text-white transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={20} />
                  Enviar Mensaje
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">O escríbenos directamente a:</p>
          <a href="mailto:alahidal1hida@gmail.com" className="text-xl font-serif text-white/60 hover:text-white transition-colors">
            alahidal1hida@gmail.com
          </a>
        </div>
      </motion.div>
    </div>
  );
};
