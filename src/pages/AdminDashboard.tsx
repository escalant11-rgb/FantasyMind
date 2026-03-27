import React, { useEffect, useState } from 'react';
import { db, collection, query, orderBy, onSnapshot, doc, updateDoc, OperationType, handleFirestoreError } from '../firebase';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { Shield, ShieldAlert, ShieldCheck, Eye, Flame, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = "escalante.samuel.011@gmail.com";

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) {
      toast.error("Acceso denegado");
      navigate('/');
      return;
    }

    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return unsubscribe;
  }, [user, navigate]);

  const toggleCensor = async (storyId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'stories', storyId), {
        isCensored: !currentStatus
      });
      toast.success(currentStatus ? 'Relato restaurado' : 'Relato censurado');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    }
  };

  if (!user || user.email !== ADMIN_EMAIL) return null;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-serif font-light tracking-tighter mb-2">Panel de <span className="italic opacity-40">Moderación</span></h1>
          <p className="text-white/40 uppercase tracking-widest text-[10px]">Solo para desarrolladores</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-600 text-[10px] uppercase tracking-widest">
          <Shield size={14} />
          Admin Mode
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                story.isCensored ? 'bg-red-600/5 border-red-600/20' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] uppercase tracking-widest text-white/40 border border-white/10">
                    {story.category}
                  </span>
                  <span className="text-[10px] text-white/20 uppercase tracking-widest">
                    {formatDistanceToNow(story.createdAt?.toDate() || new Date(), { addSuffix: true, locale: es })}
                  </span>
                </div>
                <Link to={`/story/${story.id}`} className="text-xl font-serif hover:text-white/70 transition-colors block mb-1">
                  {story.title}
                </Link>
                <p className="text-xs text-white/40 uppercase tracking-widest">Autor: {story.authorName}</p>
              </div>

              <div className="flex items-center gap-6 text-white/40 text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-1"><Eye size={14} /> {story.views || 0}</span>
                <span className="flex items-center gap-1"><Flame size={14} /> {story.likesCount || 0}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCensor(story.id, story.isCensored)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] uppercase tracking-widest transition-all ${
                    story.isCensored 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {story.isCensored ? (
                    <>
                      <ShieldCheck size={16} />
                      Restaurar
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={16} />
                      Censurar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
