import React, { useEffect, useState } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Flame, Eye, ArrowRight, Heart, BookOpen, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../ThemeContext';

export const SensualLanding: React.FC = () => {
  const [featuredStories, setFeaturedStories] = useState<any[]>([]);
  const { styles } = useTheme();

  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('views', 'desc'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeaturedStories(data);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: styles.bg, color: styles.text }}>
      <Helmet>
        <title>Relatos Eróticos y Historias Sensuales | Literatura Romántica</title>
        <meta name="description" content="Descubre los mejores relatos eróticos y historias sensuales. Literatura romántica para adultos con un toque elegante y sugerente. Explora tu fantasía hoy." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b" style={{ borderColor: styles.border }}>
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1518131672697-613add492bb1?q=80&w=2070&auto=format&fit=crop" 
            alt="Sensual background" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-red-500 mb-6 block font-bold">Literatura Romántica para Adultos</span>
            <h1 className="text-6xl md:text-8xl font-serif font-light tracking-tighter mb-8 leading-tight text-white">
              Relatos Eróticos y <br />
              <span className="italic opacity-60">Historias Sensuales</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Sumérgete en un universo donde la elegancia se encuentra con el deseo. Nuestra colección de relatos eróticos está diseñada para despertar tus sentidos a través de la palabra escrita.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-red-600 hover:text-white transition-all group"
            >
              Explora más historias
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
            <h2 className="text-4xl font-serif mb-8 tracking-tight" style={{ color: styles.heading }}>Literatura Romántica para Adultos: Un Viaje de Sensaciones</h2>
            <p className="leading-relaxed mb-6 opacity-60">
              La literatura romántica para adultos no se trata solo de lo que se dice, sino de lo que se sugiere. En FantasyMind, creemos que la verdadera sensualidad reside en la conexión emocional y física que se construye página tras página.
            </p>
            <p className="leading-relaxed opacity-60">
              Nuestros autores exploran los matices del deseo humano con una pluma delicada pero firme, creando atmósferas donde el lector puede perderse y encontrarse a la vez.
            </p>
          </motion.div>
          <div className="aspect-square rounded-3xl overflow-hidden grayscale opacity-60 border" style={{ borderColor: styles.border }}>
            <img 
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop" 
              alt="Reading book" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div className="order-2 md:order-1 aspect-square rounded-3xl overflow-hidden grayscale opacity-60 border" style={{ borderColor: styles.border }}>
            <img 
              src="https://images.unsplash.com/photo-1516589174184-c685266e430c?q=80&w=1974&auto=format&fit=crop" 
              alt="Sensual touch" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <h2 className="text-4xl font-serif mb-8 tracking-tight" style={{ color: styles.heading }}>El Arte de los Relatos Eróticos Elegantes</h2>
            <p className="leading-relaxed mb-6 opacity-60">
              Buscamos elevar el género de los relatos eróticos a una forma de arte. Aquí, la narrativa sensual se aleja de lo explícito para centrarse en la tensión, el ritmo y la belleza de la seducción.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-full bg-white/5 text-red-500"><Heart size={16} /></div>
                <div>
                  <h4 className="text-sm uppercase tracking-widest mb-1" style={{ color: styles.heading }}>Pasión Genuina</h4>
                  <p className="text-xs opacity-40">Historias que laten con emociones reales y deseos profundos.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-full bg-white/5 text-red-500"><BookOpen size={16} /></div>
                <div>
                  <h4 className="text-sm uppercase tracking-widest mb-1" style={{ color: styles.heading }}>Narrativa Cuidada</h4>
                  <p className="text-xs opacity-40">Cada palabra es elegida para evocar una imagen, un aroma o un roce.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif mb-8 tracking-tight" style={{ color: styles.heading }}>Historias Sensuales que Despiertan la Imaginación</h2>
            <p className="leading-relaxed max-w-3xl mx-auto mb-12 opacity-60">
              Nuestra plataforma es un refugio para quienes buscan historias sensuales que desafíen la mente y el corazón. Desde encuentros fortuitos hasta romances prohibidos, cada relato es una puerta abierta a una nueva fantasía.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl border hover:border-red-500/50 transition-colors" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                <Sparkles className="mx-auto mb-4 text-red-500" size={32} />
                <h3 className="text-xl font-serif mb-4" style={{ color: styles.heading }}>Fantasía</h3>
                <p className="text-xs leading-relaxed opacity-40">Explora mundos donde lo imposible se vuelve sensual y lo onírico se hace carne.</p>
              </div>
              <div className="p-8 rounded-3xl border hover:border-red-500/50 transition-colors" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                <Heart className="mx-auto mb-4 text-red-500" size={32} />
                <h3 className="text-xl font-serif mb-4" style={{ color: styles.heading }}>Romance</h3>
                <p className="text-xs leading-relaxed opacity-40">La conexión emocional es el preludio perfecto para la entrega física más profunda.</p>
              </div>
              <div className="p-8 rounded-3xl border hover:border-red-500/50 transition-colors" style={{ backgroundColor: styles.card, borderColor: styles.border }}>
                <Flame className="mx-auto mb-4 text-red-500" size={32} />
                <h3 className="text-xl font-serif mb-4" style={{ color: styles.heading }}>Pasión</h3>
                <p className="text-xs leading-relaxed opacity-40">Relatos que queman con la intensidad de un deseo que no conoce fronteras.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Stories (Internal Links) */}
        <div className="mb-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif tracking-tight mb-2" style={{ color: styles.heading }}>Relatos Destacados</h2>
              <p className="text-xs uppercase tracking-widest opacity-40">Selección de nuestra comunidad</p>
            </div>
            <Link to="/" className="text-[10px] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity border-b pb-1" style={{ borderColor: styles.border }}>Ver todos</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStories.map((story) => (
              <Link key={story.id} to={`/story/${story.id}`} className="group">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 mb-4 border" style={{ borderColor: styles.border }}>
                  {story.imageUrl ? (
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10 font-serif italic text-2xl">Sensual</div>
                  )}
                </div>
                <h3 className="text-xl font-serif group-hover:text-red-500 transition-colors" style={{ color: styles.heading }}>{story.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-[10px] uppercase tracking-widest opacity-40">
                  <span className="flex items-center gap-1"><Eye size={12} /> {story.views || 0}</span>
                  <span className="flex items-center gap-1"><Flame size={12} /> {story.likesCount || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-20 rounded-[3rem] bg-gradient-to-r from-red-900/20 to-black border" style={{ borderColor: styles.border }}>
          <h2 className="text-4xl md:text-5xl font-serif mb-8 tracking-tight text-white">Explora el Romance y la Pasión en Cada Palabra</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            No dejes que tu imaginación se detenga. Únete a nuestra comunidad y descubre por qué somos el destino favorito para los amantes de la literatura romántica para adultos.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-red-600 text-white px-12 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all shadow-2xl shadow-red-600/20"
          >
            Explora más historias
          </Link>
        </div>
      </section>
    </div>
  );
};

