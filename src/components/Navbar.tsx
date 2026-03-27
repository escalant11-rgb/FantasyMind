import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth, signOut, signInWithPopup, googleProvider } from '../firebase';
import { LogIn, LogOut, PlusSquare, User, Home, Bookmark, Shield, Sun, Moon, Coffee, Bell, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../ThemeContext';
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc, writeBatch } from '../firebase';
import { db } from '../firebase';
import { AnimatePresence, motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ADMIN_EMAIL = "escalante.samuel.011@gmail.com";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme, styles } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showThemeSelector, setShowThemeSelector] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      const batch = writeBatch(db);
      notifications.forEach(n => {
        if (!n.read) {
          batch.update(doc(db, 'notifications', n.id), { read: true });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Sesión iniciada correctamente');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('La ventana de inicio de sesión se cerró antes de completar.');
      } else {
        console.error('Login error', error);
        toast.error('Error al iniciar sesión. Inténtalo de nuevo.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada');
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b px-6 py-4 transition-colors duration-500"
      style={{ backgroundColor: `${styles.bg}CC`, borderColor: styles.border }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif tracking-tighter mr-12" style={{ color: styles.heading }}>
          FANTASY<span className="italic font-light opacity-60">MIND</span>
        </Link>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-8 mr-4">
            <Link to="/relatos-eroticos" className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              Relatos Eróticos
            </Link>
            <Link to="/contact" className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              Contacto
            </Link>
          </div>
          
          <div className="flex items-center gap-4 border-l pl-8" style={{ borderColor: styles.border }}>
            {/* Theme Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className="p-2 rounded-full hover:bg-white/5 transition-colors opacity-60 hover:opacity-100"
              >
                {theme === 'light' && <Sun size={18} />}
                {theme === 'sepia' && <Coffee size={18} />}
                {theme === 'dark' && <Moon size={18} />}
              </button>
              <AnimatePresence>
                {showThemeSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 p-2 rounded-2xl border shadow-2xl flex flex-col gap-1 min-w-[140px]"
                    style={{ backgroundColor: styles.card, borderColor: styles.border }}
                  >
                    <button 
                      onClick={() => { setTheme('light'); setShowThemeSelector(false); }}
                      className={`flex items-center gap-3 p-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${theme === 'light' ? 'bg-white text-black' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                    >
                      <Sun size={14} /> Claro
                    </button>
                    <button 
                      onClick={() => { setTheme('sepia'); setShowThemeSelector(false); }}
                      className={`flex items-center gap-3 p-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${theme === 'sepia' ? 'bg-[#F4ECD8] text-[#5B4636]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                    >
                      <Coffee size={14} /> Sepia
                    </button>
                    <button 
                      onClick={() => { setTheme('dark'); setShowThemeSelector(false); }}
                      className={`flex items-center gap-3 p-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${theme === 'dark' ? 'bg-white/10 text-white' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                    >
                      <Moon size={14} /> Oscuro
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors opacity-60 hover:opacity-100 relative"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 p-4 rounded-2xl border shadow-2xl flex flex-col gap-4 min-w-[320px] max-h-[450px] overflow-y-auto"
                        style={{ backgroundColor: styles.card, borderColor: styles.border }}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold">Notificaciones</h4>
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="text-[8px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                            >
                              Marcar todo como leído
                            </button>
                          )}
                        </div>
                        {notifications.length === 0 ? (
                          <p className="text-[10px] uppercase tracking-widest opacity-20 py-4 text-center">Sin notificaciones</p>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {notifications.map(n => (
                              <div 
                                key={n.id} 
                                className={`text-xs border-b pb-3 last:border-0 transition-opacity ${n.read ? 'opacity-40' : 'opacity-100'}`} 
                                style={{ borderColor: styles.border }}
                              >
                                <p className="opacity-80">{n.message}</p>
                                <span className="text-[10px] opacity-30 mt-1 block uppercase tracking-tighter">
                                  {formatDistanceToNow(n.createdAt?.toDate() || new Date(), { addSuffix: true, locale: es })}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to={`/profile/${user.uid}?tab=favorites`} className="p-2 rounded-full hover:bg-white/5 transition-colors opacity-60 hover:opacity-100" title="Favoritos">
                  <Heart size={18} />
                </Link>

                {user.email === ADMIN_EMAIL && (
                  <Link to="/admin" className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors" title="Admin">
                    <Shield size={18} />
                  </Link>
                )}
                
                <Link to="/create" className="p-2 rounded-full hover:bg-white/5 transition-colors opacity-60 hover:opacity-100" title="Publicar">
                  <PlusSquare size={18} />
                </Link>

                <Link to={`/profile/${user.uid}`} className="p-2 rounded-full hover:bg-white/5 transition-colors opacity-60 hover:opacity-100" title="Perfil">
                  <User size={18} />
                </Link>

                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest border px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all"
                style={{ borderColor: styles.border }}
              >
                <LogIn size={14} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
