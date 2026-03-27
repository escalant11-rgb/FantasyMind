import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, updateDoc, increment, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, OperationType, handleFirestoreError, deleteDoc } from '../firebase';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, MessageSquare, Eye, Flame, Share2, Send, Trash2, Edit3, RefreshCw, ShieldAlert, Sun, Moon, Coffee, Settings2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { useTheme } from '../ThemeContext';
import { Heart } from 'lucide-react';

export const StoryDetail: React.FC = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { theme, setTheme, styles } = useTheme();
  const [story, setStory] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isRepublishing, setIsRepublishing] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  useEffect(() => {
    if (!storyId) return;

    // Story listener for real-time views/likes
    const storyRef = doc(db, 'stories', storyId);
    const unsubscribeStory = onSnapshot(storyRef, (docSnap) => {
      if (docSnap.exists()) {
        setStory({ id: docSnap.id, ...docSnap.data() });
      } else {
        setStory(null);
      }
      setLoading(false);
    });

    // Increment views once per session (simplified)
    const incrementViews = async () => {
      try {
        await updateDoc(storyRef, { views: increment(1) });
      } catch (error) {
        console.error("Error incrementing views", error);
      }
    };
    incrementViews();

    // Comments listener
    const commentsQuery = query(
      collection(db, 'stories', storyId, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeStory();
      unsubscribeComments();
    };
  }, [storyId]);

  useEffect(() => {
    if (!user || !storyId) return;
    const checkFavorite = async () => {
      const favRef = doc(db, 'users', user.uid, 'favorites', storyId);
      const favSnap = await getDoc(favRef);
      setIsFavorited(favSnap.exists());
    };
    checkFavorite();
  }, [user, storyId]);

  const handleToggleFavorite = async () => {
    if (!user || !storyId || isFavoriting) return;
    setIsFavoriting(true);
    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', storyId);
      if (isFavorited) {
        await deleteDoc(favRef);
        setIsFavorited(false);
        toast.success('Eliminado de favoritos');
      } else {
        await addDoc(collection(db, 'users', user.uid, 'favorites'), {
          storyId,
          title: story.title,
          imageUrl: story.imageUrl || '',
          authorName: story.authorName,
          createdAt: serverTimestamp()
        });
        setIsFavorited(true);
        toast.success('Guardado en favoritos');
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/favorites`);
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleLike = async () => {
    if (!user || !storyId || isLiking) return;
    setIsLiking(true);
    try {
      const storyRef = doc(db, 'stories', storyId);
      await updateDoc(storyRef, { likesCount: increment(1) });
      toast.success('¡Te ha gustado este relato!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!storyId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'stories', storyId));
      toast.success('Relato eliminado');
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `stories/${storyId}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRepublish = async () => {
    if (!storyId || isRepublishing) return;
    setIsRepublishing(true);
    try {
      await updateDoc(doc(db, 'stories', storyId), {
        createdAt: serverTimestamp()
      });
      toast.success('Relato republicado (ahora aparece primero)');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    } finally {
      setIsRepublishing(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    } catch (err) {
      console.error('Error copying to clipboard', err);
      toast.error('No se pudo copiar el enlace');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !storyId) return;

    setIsSubmittingComment(true);
    try {
      await addDoc(collection(db, 'stories', storyId, 'comments'), {
        storyId,
        authorId: user.uid,
        authorName: profile?.displayName || user.displayName || 'Anónimo',
        authorPhoto: profile?.photoURL || user.photoURL || '',
        text: newComment,
        createdAt: serverTimestamp()
      });

      // Trigger notification for author
      if (story.authorId !== user.uid) {
        await addDoc(collection(db, 'notifications'), {
          userId: story.authorId,
          message: `${profile?.displayName || user.displayName || 'Alguien'} comentó en tu relato "${story.title}"`,
          storyId,
          type: 'comment',
          read: false,
          createdAt: serverTimestamp()
        });
      }

      setNewComment('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `stories/${storyId}/comments`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) return (
    <div className="pt-40 flex justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  if (!story) return (
    <div className="pt-40 text-center">
      <h2 className="text-2xl font-serif">Relato no encontrado</h2>
      <Link to="/" className="text-white/40 uppercase tracking-widest text-xs mt-4 inline-block hover:text-white">Volver al inicio</Link>
    </div>
  );

  return (
    <div 
      className="min-h-screen transition-colors duration-500 pt-32 pb-20 px-6"
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      <Helmet>
        <title>{`${story.title} | Relatos Eróticos en FantasyMind`}</title>
        <meta name="description" content={story.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'} />
        <meta property="og:title" content={story.title} />
        <meta property="og:description" content={story.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'} />
        {story.imageUrl && <meta property="og:image" content={story.imageUrl} />}
      </Helmet>
      <div className="max-w-4xl mx-auto relative">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <header className="mb-12">
            <div 
              className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] mb-6"
              style={{ color: styles.text, opacity: 0.4 }}
            >
              <span>{story.category}</span>
              <span>•</span>
              <span>{formatDistanceToNow(story.createdAt?.toDate() || new Date(), { addSuffix: true, locale: es })}</span>
            </div>
            <h1 
              className="text-5xl md:text-7xl font-serif font-light tracking-tighter mb-8 leading-tight"
              style={{ color: styles.heading }}
            >
              {story.title}
            </h1>
            
            <div 
              className="flex items-center justify-between border-y py-6"
              style={{ borderColor: styles.border }}
            >
              <Link to={`/profile/${story.authorId}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
                  {story.authorPhoto ? (
                    <img src={story.authorPhoto} alt={story.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><User size={20} /></div>
                  )}
                </div>
                <div>
                  <p 
                    className="text-sm uppercase tracking-widest transition-colors"
                    style={{ color: styles.heading }}
                  >
                    {story.authorName}
                  </p>
                  <p 
                    className="text-[10px] uppercase tracking-widest opacity-40"
                    style={{ color: styles.text }}
                  >
                    Autor
                  </p>
                </div>
              </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 mr-4 border-r pr-4" style={{ borderColor: styles.border }}>
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-white text-black shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                  title="Modo Claro"
                  style={{ color: theme === 'light' ? undefined : styles.text }}
                >
                  <Sun size={18} />
                </button>
                <button 
                  onClick={() => setTheme('sepia')}
                  className={`p-2 rounded-full transition-all ${theme === 'sepia' ? 'bg-[#F4ECD8] text-[#5B4636] shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                  title="Modo Sepia"
                  style={{ color: theme === 'sepia' ? undefined : styles.text }}
                >
                  <Coffee size={18} />
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-white/10 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                  title="Modo Oscuro"
                  style={{ color: theme === 'dark' ? undefined : styles.text }}
                >
                  <Moon size={18} />
                </button>
              </div>
              {user && (
                  <button 
                    onClick={handleToggleFavorite}
                    disabled={isFavoriting}
                    className={`p-2 rounded-full transition-all ${isFavorited ? 'text-red-500 bg-red-500/10' : 'opacity-40 hover:opacity-100'}`}
                    title={isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>
                )}
                {user?.uid === story.authorId && (
                  <div 
                    className="flex items-center gap-2 mr-4 border-r pr-4"
                    style={{ borderColor: styles.border }}
                  >
                    <button 
                      onClick={handleRepublish}
                      disabled={isRepublishing}
                      title="Republicar (subir al inicio)"
                      className="p-2 rounded-full hover:bg-white/10 transition-all disabled:opacity-50 opacity-40 hover:opacity-100"
                      style={{ color: styles.text }}
                    >
                      <RefreshCw size={18} className={isRepublishing ? 'animate-spin' : ''} />
                    </button>
                    <Link 
                      to={`/edit/${story.id}`}
                      title="Editar relato"
                      className="p-2 rounded-full hover:bg-white/10 transition-all opacity-40 hover:opacity-100"
                      style={{ color: styles.text }}
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeleting}
                      title="Eliminar relato"
                      className="p-2 rounded-full hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
                <button 
                  onClick={handleShare}
                  title="Compartir relato"
                  className="opacity-40 hover:opacity-100 transition-opacity"
                  style={{ color: styles.text }}
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </header>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-serif mb-4">¿Eliminar relato?</h2>
              <p className="text-white/40 text-sm mb-8 leading-relaxed">
                Esta acción es permanente y no se puede deshacer. Tu relato y todos sus comentarios se perderán para siempre.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-4 rounded-full border border-white/10 text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 rounded-full bg-red-500 text-white text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {story.imageUrls && story.imageUrls.length > 0 ? (
          <div className="mb-12 space-y-8">
            {story.imageUrls.map((url: string, idx: number) => (
              <div 
                key={idx}
                className="rounded-[2rem] overflow-hidden aspect-video bg-white/5 border"
                style={{ borderColor: styles.border }}
              >
                <img 
                  src={url} 
                  alt={`${story.title} - ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : story.imageUrl && (
          <div 
            className="mb-12 rounded-[2rem] overflow-hidden aspect-video bg-white/5 border"
            style={{ borderColor: styles.border }}
          >
            <img 
              src={story.imageUrl} 
              alt={story.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
              loading="lazy"
            />
          </div>
        )}

        {story.isCensored ? (
          <div className="bg-red-600/10 border border-red-600/20 rounded-3xl p-12 text-center mb-20">
            <ShieldAlert size={48} className="text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl font-serif mb-4 text-red-600">Contenido Censurado</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              Este relato ha sido retirado automáticamente por nuestro sistema de moderación debido a violaciones graves de nuestros términos legales y de seguridad.
            </p>
          </div>
        ) : (
          <div className="max-w-[700px] mx-auto mb-20">
            <div 
              className="text-lg md:text-xl leading-[1.8] font-serif quill-content"
              style={{ color: styles.text }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }}
            />
            <style>{`
              .quill-content h1, .quill-content h2 { margin-top: 2rem; margin-bottom: 1rem; color: ${styles.heading}; }
              .quill-content p { margin-bottom: 1.5rem; }
              .quill-content blockquote { border-left: 4px solid ${styles.border}; padding-left: 1.5rem; font-style: italic; opacity: 0.8; margin: 2rem 0; }
              .quill-content ul, .quill-content ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
              .quill-content li { margin-bottom: 0.5rem; }
            `}</style>

            <div 
              className="mt-16 flex items-center justify-center gap-12 border-y py-8"
              style={{ borderColor: styles.border }}
            >
              <div className="flex flex-col items-center gap-2 group">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(128,128,128,0.05)' }}
                >
                  <Eye size={24} style={{ color: styles.text, opacity: 0.4 }} />
                </div>
                <span 
                  className="text-xs uppercase tracking-widest opacity-40"
                  style={{ color: styles.text }}
                >
                  {story.views || 0} lecturas
                </span>
              </div>

              <button 
                onClick={handleLike}
                disabled={isLiking}
                className="flex flex-col items-center gap-2 group"
              >
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isLiking ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-orange-500/10 hover:text-orange-500'}`}
                  style={{ 
                    backgroundColor: isLiking ? undefined : 'rgba(128,128,128,0.05)',
                    color: isLiking ? undefined : styles.text
                  }}
                >
                  <Flame size={24} className={isLiking ? 'animate-pulse' : ''} style={{ opacity: isLiking ? 1 : 0.4 }} />
                </div>
                <span 
                  className={`text-xs uppercase tracking-widest transition-colors ${isLiking ? 'text-orange-500' : 'opacity-40 group-hover:text-orange-500'}`}
                  style={{ color: isLiking ? undefined : styles.text }}
                >
                  {story.likesCount || 0} me gusta
                </span>
              </button>
            </div>
          </div>
        )}
      </motion.article>

      <section 
          className="border-t pt-16"
          style={{ borderColor: styles.border }}
        >
          <h3 
            className="text-2xl font-serif mb-8 flex items-center gap-3"
            style={{ color: styles.heading }}
          >
            <MessageSquare size={24} className="opacity-40" />
            Comentarios <span className="opacity-20 font-sans text-sm">({comments.length})</span>
          </h3>

          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-12">
              <div className="relative">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  className="w-full border rounded-2xl p-6 min-h-[120px] text-sm outline-none transition-colors resize-none"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    borderColor: styles.border,
                    color: styles.text
                  }}
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubmittingComment}
                  className="absolute bottom-4 right-4 p-3 rounded-full transition-all disabled:opacity-50"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'white' : 'black',
                    color: theme === 'dark' ? 'black' : 'white'
                  }}
                >
                  {isSubmittingComment ? (
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme === 'dark' ? 'black' : 'white' }}></div>
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div 
              className="rounded-2xl p-8 text-center mb-12 border border-dashed"
              style={{ borderColor: styles.border }}
            >
              <p 
                className="uppercase tracking-widest text-xs"
                style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
              >
                Inicia sesión para comentar
              </p>
            </div>
          )}

          <div className="space-y-8">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-4">
                <Link to={`/profile/${comment.authorId}`} className="shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                    {comment.authorPhoto ? (
                      <img src={comment.authorPhoto} alt={comment.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><User size={16} /></div>
                    )}
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <Link 
                      to={`/profile/${comment.authorId}`} 
                      className="text-xs uppercase tracking-widest hover:opacity-70 transition-colors"
                      style={{ color: theme === 'dark' ? 'white' : 'black' }}
                    >
                      {comment.authorName}
                    </Link>
                    <span 
                      className="text-[10px] uppercase tracking-widest"
                      style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
                    >
                      {formatDistanceToNow(comment.createdAt?.toDate() || new Date(), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <p 
                    className="text-sm leading-relaxed opacity-80"
                    style={{ color: styles.text }}
                  >
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
