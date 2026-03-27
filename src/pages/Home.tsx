import React, { useEffect, useState } from 'react';
import { db, collection, query, orderBy, onSnapshot, where } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Eye, MessageSquare, User, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../ThemeContext';

const CATEGORIES = ["Todos", "Amor Filial", "Bisexuales", "Confesiones", "Voyerismo", "Infidelidad", "Romance", "Fantasía", "Gay", "Tabú", "BDSM", "Otros"];

export const Home: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [category, setCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("recent"); // "recent" or "views"
  const [loading, setLoading] = useState(true);
  const { styles } = useTheme();

  useEffect(() => {
    let sortField = 'createdAt';
    if (sortBy === 'views') sortField = 'views';
    if (sortBy === 'likes') sortField = 'likesCount';

    let q = query(collection(db, 'stories'), orderBy(sortField, 'desc'));
    
    if (category !== "Todos") {
      q = query(
        collection(db, 'stories'), 
        where('category', '==', category), 
        orderBy(sortField, 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStories(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [category, sortBy]);

  return (
    <div className="pb-20">
      <header className="relative h-[70vh] flex flex-col items-center justify-center text-center mb-16 overflow-hidden border-b" style={{ borderColor: styles.border }}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1520182205149-1e5e4e7329b4?q=80&w=2070&auto=format&fit=crop" 
            alt="Sensual background" 
            className="w-full h-full object-cover opacity-75 blur-[1px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black"></div>
        </div>

        <div className="relative z-10 px-6 max-w-7xl mx-auto w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-serif font-light tracking-tighter mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white"
          >
            Fantasía sin <span className="italic opacity-60">límites</span>
          </motion.h1>
          
          <div className="flex flex-col gap-8 mt-12">
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all border ${
                    category === cat 
                    ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20" 
                    : "text-white/40 border-white/10 bg-black/40 backdrop-blur-sm hover:bg-red-600 hover:text-white hover:border-red-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-10 text-[10px] uppercase tracking-[0.3em]">
              <button 
                onClick={() => setSortBy('recent')}
                className={sortBy === 'recent' ? 'text-white border-b border-white pb-2' : 'text-white/40 hover:text-white transition-colors'}
              >
                Recientes
              </button>
              <button 
                onClick={() => setSortBy('views')}
                className={sortBy === 'views' ? 'text-white border-b border-white pb-2' : 'text-white/40 hover:text-white transition-colors'}
              >
                Más Vistos
              </button>
              <button 
                onClick={() => setSortBy('likes')}
                className={sortBy === 'likes' ? 'text-white border-b border-white pb-2' : 'text-white/40 hover:text-white transition-colors'}
              >
                Más Gustados
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 max-w-7xl mx-auto">
        {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/story/${story.id}`}>
                <div className="aspect-[4/5] overflow-hidden bg-white/5 rounded-2xl mb-6 relative border" style={{ borderColor: styles.border }}>
                  {story.imageUrl ? (
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10 font-serif italic text-4xl">
                      Velvet
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest text-white/80 border border-white/10">
                      {story.category}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-serif mb-2 group-hover:opacity-70 transition-opacity" style={{ color: styles.heading }}>{story.title}</h2>
                <div className="flex items-center gap-4 opacity-40 text-xs uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1"><Eye size={14} /> {story.views || 0}</span>
                  <span className="flex items-center gap-1"><Flame size={14} className="text-orange-500/60" /> {story.likesCount || 0}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(story.createdAt?.toDate() || new Date(), { addSuffix: true, locale: es })}</span>
                </div>
              </Link>
              <Link to={`/profile/${story.authorId}`} className="flex items-center gap-3 group/author">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 border" style={{ borderColor: styles.border }}>
                  {story.authorPhoto ? (
                    <img 
                      src={story.authorPhoto} 
                      alt={story.authorName} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-40"><User size={14} /></div>
                  )}
                </div>
                <span className="text-xs uppercase tracking-widest opacity-60 group-hover/author:opacity-100 transition-opacity">{story.authorName}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      </div>

      {/* SEO Content Section */}
      <section className="mt-32 pt-20 border-t" style={{ borderColor: styles.border }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-8 tracking-tight" style={{ color: styles.heading }}>El Arte de los Relatos Eróticos y la Literatura Romántica</h2>
          <p className="text-sm leading-relaxed mb-6 opacity-40">
            Bienvenido a FantasyMind, el destino definitivo para los amantes de la <strong>literatura romántica para adultos</strong> y los <strong>relatos eróticos</strong> de alta calidad. Nuestra plataforma se dedica a ofrecer historias sensuales que exploran la profundidad del deseo humano con elegancia y sofisticación.
          </p>
          <p className="text-sm leading-relaxed mb-12 opacity-40">
            Creemos que las historias sensuales tienen el poder de despertar la imaginación y conectar con nuestras emociones más profundas. Por eso, cada relato en nuestra colección es seleccionado para garantizar una experiencia de lectura envolvente y respetuosa con los estándares de calidad que nuestros lectores esperan.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-[0.2em] opacity-20">
            <Link to="/relatos-eroticos" className="hover:opacity-100 transition-opacity">Historias Sensuales</Link>
            <Link to="/literatura-romantica" className="hover:opacity-100 transition-opacity">Romance para Adultos</Link>
            <Link to="/create" className="hover:opacity-100 transition-opacity">Publicar Relato</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

