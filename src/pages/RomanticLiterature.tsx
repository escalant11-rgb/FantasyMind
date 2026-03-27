import React, { useEffect, useState } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot, where } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, BookOpen, Star, ArrowRight, User, Coffee } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../ThemeContext';

export const RomanticLiterature: React.FC = () => {
  const [romanticStories, setRomanticStories] = useState<any[]>([]);
  const { styles } = useTheme();

  useEffect(() => {
    const q = query(
      collection(db, 'stories'), 
      where('category', '==', 'Romance'),
      orderBy('createdAt', 'desc'), 
      limit(6)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRomanticStories(data);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: styles.bg, color: styles.text }}>
      <Helmet>
        <title>Literatura Romántica para Adultos | Historias de Amor y Pasión</title>
        <meta name="description" content="Explora nuestra colección de literatura romántica para adultos. Historias de amor profundo, pasión y conexiones inolvidables. Lee gratis ahora." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=2071&auto=format&fit=crop" 
            alt="Romantic background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] mb-6 block font-bold opacity-60">Historias Sensuales y Románticas</span>
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tighter mb-8 leading-tight" style={{ color: styles.heading }}>
              Literatura Romántica <br />
              <span className="italic opacity-60">Para Adultos</span>
            </h1>
            <p className="text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12 opacity-60">
              Donde el corazón dicta el ritmo y la piel responde al llamado. Descubre relatos que celebran la belleza del amor en todas sus formas.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-opacity-80 transition-all group"
            >
              Explora el romance
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif mb-8 tracking-tight" style={{ color: styles.heading }}>El Despertar de la Literatura Romántica</h2>
            <p className="leading-relaxed mb-6 opacity-60">
              La literatura romántica ha evolucionado para capturar no solo el ideal del amor, sino la cruda y hermosa realidad de la pasión adulta. En nuestra plataforma, cada historia es un testimonio de la complejidad de las relaciones humanas.
            </p>
            <p className="leading-relaxed opacity-60">
              Desde el primer roce hasta la entrega total, nuestras historias sensuales te transportarán a mundos donde el sentimiento es el protagonista absoluto.
            </p>
          </motion.div>
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border" style={{ borderColor: styles.border }}>
            <img 
              src="https://images.unsplash.com/photo-1518131672697-613add492bb1?q=80&w=2070&auto=format&fit=crop" 
              alt="Couple reading" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 opacity-60" style={{ backgroundColor: styles.card }}>
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-serif mb-4" style={{ color: styles.heading }}>Emoción Pura</h3>
            <p className="text-sm leading-relaxed opacity-60">Historias que tocan las fibras más sensibles de tu ser, explorando el amor en su estado más puro.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 opacity-60" style={{ backgroundColor: styles.card }}>
              <Star size={32} />
            </div>
            <h3 className="text-xl font-serif mb-4" style={{ color: styles.heading }}>Calidad Literaria</h3>
            <p className="text-sm leading-relaxed opacity-60">Relatos escritos con esmero, cuidando cada detalle para ofrecerte una experiencia de lectura superior.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 opacity-60" style={{ backgroundColor: styles.card }}>
              <Coffee size={32} />
            </div>
            <h3 className="text-xl font-serif mb-4" style={{ color: styles.heading }}>Momentos de Calma</h3>
            <p className="text-sm leading-relaxed opacity-60">El refugio perfecto para tus tardes de lectura, donde el romance es el mejor compañero.</p>
          </div>
        </div>

        {/* Featured Romance Stories */}
        <div className="mb-32">
          <h2 className="text-4xl font-serif tracking-tight mb-12 text-center" style={{ color: styles.heading }}>Nuestros Relatos Románticos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {romanticStories.map((story) => (
              <Link key={story.id} to={`/story/${story.id}`} className="group p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all border" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                  {story.imageUrl ? (
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10 font-serif italic text-2xl" style={{ backgroundColor: styles.bg }}>Amor</div>
                  )}
                </div>
                <h3 className="text-xl font-serif group-hover:opacity-70 transition-opacity" style={{ color: styles.heading }}>{story.title}</h3>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 border" style={{ borderColor: styles.border }}>
                    {story.authorPhoto ? (
                      <img src={story.authorPhoto} alt={story.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-40"><User size={10} /></div>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest opacity-40">{story.authorName}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-20 rounded-[3rem] bg-black text-white">
          <h2 className="text-4xl font-serif mb-8 tracking-tight">¿Listo para Enamorarte?</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            Nuestra colección de literatura romántica para adultos crece cada día. No te pierdas las historias que están cautivando a miles de lectores.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-opacity-80 transition-all"
          >
            Explora más historias
          </Link>
        </div>
      </section>
    </div>
  );
};

