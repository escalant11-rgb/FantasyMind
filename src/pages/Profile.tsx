import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, getDocs, serverTimestamp, increment, updateDoc, storage, ref, uploadBytes, getDownloadURL } from '../firebase';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { User, Eye, Calendar, Users, Flame, Edit2, X, Check, Camera, Trash2, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../ThemeContext';
import { Heart } from 'lucide-react';

export const Profile: React.FC = () => {
  const { uid } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'stories';
  const { user: currentUser } = useAuth();
  const { styles } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subId, setSubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editBio, setEditBio] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPhotoRemoveConfirm, setShowPhotoRemoveConfirm] = useState(false);

  useEffect(() => {
    if (!uid) return;

    const profileRef = doc(db, 'profiles', uid);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setEditName(data.displayName || '');
        setEditPhoto(data.photoURL || '');
        setPhotoPreview(data.photoURL || null);
        setEditBio(data.bio || '');
      }
      setLoading(false);
    });

    // Stories listener
    const storiesQuery = query(
      collection(db, 'stories'),
      where('authorId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeStories = onSnapshot(storiesQuery, (snapshot) => {
      setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Favorites listener (only if viewing own profile)
    let unsubscribeFavorites = () => {};
    if (uid && currentUser && uid === currentUser.uid) {
      const favQuery = query(
        collection(db, 'users', uid, 'favorites'),
        orderBy('createdAt', 'desc')
      );
      unsubscribeFavorites = onSnapshot(favQuery, (snapshot) => {
        setFavorites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    }

    // Subscription check
    let unsubscribeSub = () => {};
    if (currentUser && currentUser.uid !== uid) {
      const subQuery = query(
        collection(db, 'subscriptions'),
        where('followerId', '==', currentUser.uid),
        where('followingId', '==', uid)
      );
      unsubscribeSub = onSnapshot(subQuery, (snapshot) => {
        if (!snapshot.empty) {
          setIsSubscribed(true);
          setSubId(snapshot.docs[0].id);
        } else {
          setIsSubscribed(false);
          setSubId(null);
        }
      });
    }

    return () => {
      unsubscribeProfile();
      unsubscribeStories();
      unsubscribeFavorites();
      unsubscribeSub();
    };
  }, [uid, currentUser]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen es demasiado grande (máx 2MB)');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return editPhoto || null;

    try {
      const storageRef = ref(storage, `profiles/${uid}/${Date.now()}_${photoFile.name}`);
      const snapshot = await uploadBytes(storageRef, photoFile);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error("Error uploading photo", error);
      toast.error("Error al subir la foto");
      return null;
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !currentUser || currentUser.uid !== uid) return;
    
    setIsUpdating(true);
    try {
      const finalPhotoUrl = await uploadPhoto();

      await updateDoc(doc(db, 'profiles', uid), {
        displayName: editName,
        photoURL: finalPhotoUrl || '',
        bio: editBio
      });
      setIsEditing(false);
      setPhotoFile(null);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!uid || !currentUser || currentUser.uid !== uid) return;

    try {
      await updateDoc(doc(db, 'profiles', uid), {
        photoURL: ''
      });
      toast.success('Foto de perfil eliminada');
      setShowPhotoRemoveConfirm(false);
    } catch (error) {
      console.error("Error removing photo", error);
      toast.error('Error al eliminar la foto');
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser || !uid) return;

    if (isSubscribed && subId) {
      await deleteDoc(doc(db, 'subscriptions', subId));
      await updateDoc(doc(db, 'profiles', uid), { subscribersCount: increment(-1) });
    } else {
      await addDoc(collection(db, 'subscriptions'), {
        followerId: currentUser.uid,
        followingId: uid,
        createdAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'profiles', uid), { subscribersCount: increment(1) });
    }
  };

  if (loading) return (
    <div className="pt-40 flex justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return (
    <div className="pt-40 text-center">
      <h2 className="text-2xl font-serif">Perfil no encontrado</h2>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Helmet>
        <title>{`${profile.displayName} | Autor de Relatos Eróticos en FantasyMind`}</title>
        <meta name="description" content={`Explora los relatos eróticos y historias sensuales de ${profile.displayName}. Literatura romántica para adultos de alta calidad.`} />
      </Helmet>
      <header className="flex flex-col md:flex-row items-center gap-12 mb-20 border-b pb-20" style={{ borderColor: styles.border }}>
        <div className="relative group/avatar">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-white/5 border-2" style={{ borderColor: styles.border }}>
            {profile.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt={profile.displayName} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><User size={60} className="opacity-20" /></div>
            )}
          </div>
          
          {currentUser && currentUser.uid === uid && profile.photoURL && (
            <button 
              onClick={() => setShowPhotoRemoveConfirm(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity"
              title="Eliminar foto de perfil"
            >
              <Trash2 size={32} className="text-red-500" />
            </button>
          )}
        </div>

        {/* Photo Remove Confirmation Modal */}
        {showPhotoRemoveConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border p-8 rounded-3xl max-w-md w-full shadow-2xl text-center"
              style={{ backgroundColor: styles.card, borderColor: styles.border }}
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-serif mb-4" style={{ color: styles.heading }}>¿Eliminar foto?</h2>
              <p className="text-sm mb-8 leading-relaxed opacity-40">
                ¿Estás seguro de que quieres eliminar tu foto de perfil? Podrás añadir una nueva en cualquier momento.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPhotoRemoveConfirm(false)}
                  className="flex-1 py-4 rounded-full border text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                  style={{ borderColor: styles.border }}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleRemovePhoto}
                  className="flex-1 py-4 rounded-full bg-red-500 text-white text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <h1 className="text-5xl font-serif font-light tracking-tighter" style={{ color: styles.heading }}>{profile.displayName}</h1>
            {currentUser && currentUser.uid === uid && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                style={{ borderColor: styles.border }}
              >
                <Edit2 size={14} />
                Editar Perfil
              </button>
            )}
            {currentUser && currentUser.uid !== uid && (
              <button 
                onClick={handleSubscribe}
                className={`px-8 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all ${
                  isSubscribed 
                  ? "bg-white/10 text-white border border-white/20 hover:bg-white/20" 
                  : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {isSubscribed ? "Suscrito" : "Suscribirse"}
              </button>
            )}
          </div>

          {/* Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border p-8 rounded-3xl max-w-lg w-full shadow-2xl"
                style={{ backgroundColor: styles.card, borderColor: styles.border }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif" style={{ color: styles.heading }}>Editar Perfil</h2>
                  <button onClick={() => setIsEditing(false)} className="opacity-40 hover:opacity-100 transition-opacity">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-40">Nombre de usuario</label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border rounded-xl p-4 text-sm outline-none transition-colors"
                      style={{ backgroundColor: styles.bg, borderColor: styles.border, color: styles.text }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-40">Foto de perfil</label>
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full overflow-hidden border shrink-0" style={{ backgroundColor: styles.bg, borderColor: styles.border }}>
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><User size={24} className="opacity-20" /></div>
                        )}
                      </div>
                      <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed transition-all cursor-pointer text-[10px] uppercase tracking-widest opacity-40 hover:opacity-60" style={{ borderColor: styles.border }}>
                        <Upload size={14} />
                        <span>Subir nueva foto</span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] opacity-40">Biografía</label>
                    <textarea 
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full border rounded-xl p-4 text-sm min-h-[100px] outline-none transition-colors resize-none"
                      style={{ backgroundColor: styles.bg, borderColor: styles.border, color: styles.text }}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 rounded-full border text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                      style={{ borderColor: styles.border }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 py-4 rounded-full text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: styles.heading, color: styles.bg }}
                    >
                      {isUpdating ? (
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: styles.bg }}></div>
                      ) : (
                        <>
                          <Check size={16} />
                          Guardar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
          
          <p className="max-w-2xl mb-8 leading-relaxed italic font-serif text-lg opacity-60">
            {profile.bio || "Este autor aún no ha escrito su biografía."}
          </p>

          <div className="flex justify-center md:justify-start gap-12 uppercase tracking-widest text-[10px] opacity-40">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-serif" style={{ color: styles.heading }}>{stories.length}</span>
              <span>Relatos</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-serif" style={{ color: styles.heading }}>{profile.subscribersCount || 0}</span>
              <span>Suscriptores</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-serif" style={{ color: styles.heading }}>
                {format(profile.createdAt?.toDate() || new Date(), 'MMM yyyy', { locale: es })}
              </span>
              <span>Miembro desde</span>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="flex items-center gap-12 mb-12 border-b" style={{ borderColor: styles.border }}>
          <button 
            onClick={() => setSearchParams({ tab: 'stories' })}
            className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${activeTab === 'stories' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
          >
            Publicaciones
            {activeTab === 'stories' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" style={{ backgroundColor: styles.heading }} />
            )}
          </button>
          <button 
            onClick={() => setSearchParams({ tab: 'favorites' })}
            className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${activeTab === 'favorites' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
          >
            Favoritos
            {activeTab === 'favorites' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" style={{ backgroundColor: styles.heading }} />
            )}
          </button>
        </div>

        {activeTab === 'stories' ? (
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
                  <div className="aspect-[16/9] overflow-hidden bg-white/5 rounded-2xl mb-6 relative border" style={{ borderColor: styles.border }}>
                    {story.imageUrl ? (
                      <img 
                        src={story.imageUrl} 
                        alt={story.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10 font-serif italic text-2xl">
                        Velvet
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-serif mb-2 group-hover:opacity-70 transition-opacity" style={{ color: styles.heading }}>{story.title}</h3>
                  <div className="flex items-center gap-4 opacity-40 text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Eye size={12} /> {story.views || 0}</span>
                    <span className="flex items-center gap-1"><Flame size={12} className="text-orange-500/60" /> {story.likesCount || 0}</span>
                    <span>{story.category}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            {stories.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed rounded-3xl" style={{ borderColor: styles.border }}>
                <p className="opacity-20 uppercase tracking-widest text-[10px]">Aún no hay relatos publicados</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {favorites.map((fav, index) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/story/${fav.storyId}`}>
                  <div className="aspect-[16/9] overflow-hidden bg-white/5 rounded-2xl mb-6 relative border" style={{ borderColor: styles.border }}>
                    {fav.imageUrl ? (
                      <img 
                        src={fav.imageUrl} 
                        alt={fav.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-10 font-serif italic text-2xl">
                        Velvet
                      </div>
                    )}
                    <div className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-red-500">
                      <Heart size={14} fill="currentColor" />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif mb-2 group-hover:opacity-70 transition-opacity" style={{ color: styles.heading }}>{fav.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-40">Por {fav.authorName}</p>
                </Link>
              </motion.div>
            ))}
            {favorites.length === 0 && (
              <div className="col-span-full py-20 text-center border border-dashed rounded-3xl" style={{ borderColor: styles.border }}>
                <p className="opacity-20 uppercase tracking-widest text-[10px]">No has guardado ningún favorito aún</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
