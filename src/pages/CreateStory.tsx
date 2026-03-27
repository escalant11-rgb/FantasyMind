import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from '../AuthContext';
import { db, collection, addDoc, serverTimestamp, OperationType, handleFirestoreError, doc, getDoc, updateDoc, storage, ref, uploadBytes, getDownloadURL } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Image as ImageIcon, Send, Save, ShieldAlert, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { analyzeContent } from '../services/moderationService';

const CATEGORIES = ["Amor Filial", "Bisexuales", "Confesiones", "Voyerismo", "Infidelidad", "Romance", "Fantasía", "Gay", "Tabú", "BDSM", "Otros"];

export const CreateStory: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { storyId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Romance');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!storyId);
  const [moderationError, setModerationError] = useState<string | null>(null);

  useEffect(() => {
    if (storyId) {
      const fetchStory = async () => {
        try {
          const docRef = doc(db, 'stories', storyId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.authorId !== user?.uid) {
              toast.error('No tienes permiso para editar este relato');
              navigate('/');
              return;
            }
            setTitle(data.title);
            setContent(data.content);
            setCategory(data.category);
            if (data.imageUrls && Array.from(data.imageUrls).length > 0) {
              setExistingImageUrls(data.imageUrls);
            } else if (data.imageUrl) {
              setExistingImageUrls([data.imageUrl]);
            }
          }
        } catch (error) {
          console.error("Error fetching story for edit", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStory();
    }
  }, [storyId, user, navigate]);

  if (!user) {
    return (
      <div className="pt-40 text-center">
        <h2 className="text-2xl font-serif mb-4">Inicia sesión para publicar</h2>
        <p className="text-white/40 uppercase tracking-widest text-xs">Debes estar autenticado para compartir tus relatos.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-40 flex justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalCount = imageFiles.length + existingImageUrls.length + files.length;
    
    if (totalCount > 7) {
      toast.error('Solo se permite subir 7 fotos máximo');
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`La imagen ${file.name} es demasiado grande (máx 5MB)`);
        return;
      }
      newFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles(prev => [...prev, ...newFiles]);
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAllImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [...existingImageUrls];

    for (const file of imageFiles) {
      try {
        const storageRef = ref(storage, `stories/${user?.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      } catch (error) {
        console.error("Error uploading image", error);
        toast.error(`Error al subir la imagen ${file.name}`);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    setModerationError(null);

    try {
      // Automated Moderation Check
      const moderation = await analyzeContent(title, content);
      
      if (!moderation.isAllowed) {
        setModerationError(moderation.reason || "El contenido viola nuestros términos legales.");
        toast.error('Contenido rechazado por moderación automática');
        setIsSubmitting(false);
        return;
      }

      // Upload all images
      const finalImageUrls = await uploadAllImages();
      const mainImageUrl = finalImageUrls.length > 0 ? finalImageUrls[0] : '';

      if (storyId) {
        const docRef = doc(db, 'stories', storyId);
        await updateDoc(docRef, {
          title,
          content,
          category,
          imageUrl: mainImageUrl,
          imageUrls: finalImageUrls,
          updatedAt: serverTimestamp(),
          isCensored: false // Reset if it was censored before
        });
        toast.success('Relato actualizado correctamente');
        navigate(`/story/${storyId}`);
      } else {
        const storyData = {
          title,
          content,
          category,
          imageUrl: mainImageUrl,
          imageUrls: finalImageUrls,
          authorId: user.uid,
          authorName: profile?.displayName || user.displayName || 'Anónimo',
          authorPhoto: profile?.photoURL || user.photoURL || '',
          views: 0,
          likesCount: 0,
          isCensored: false,
          createdAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'stories'), storyData);
        toast.success('Relato publicado correctamente');
        navigate(`/story/${docRef.id}`);
      }
    } catch (error) {
      handleFirestoreError(error, storyId ? OperationType.UPDATE : OperationType.CREATE, 'stories');
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-serif font-light tracking-tighter mb-12">
          {storyId ? 'Editar' : 'Escribe tu'} <span className="italic opacity-40">{storyId ? 'relato' : 'fantasía'}</span>
        </h1>

        {moderationError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-start gap-4"
          >
            <ShieldAlert className="text-red-600 shrink-0" size={24} />
            <div>
              <p className="text-red-600 font-serif text-lg mb-1">Contenido Rechazado</p>
              <p className="text-white/60 text-sm">{moderationError}</p>
            </div>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Título del relato</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Un encuentro inesperado..."
              className="w-full bg-transparent border-b border-white/10 py-4 text-3xl font-serif focus:border-white outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Categoría</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-4 text-sm uppercase tracking-widest outline-none focus:border-white transition-colors appearance-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Imágenes del relato (Máx 7)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Existing Images */}
                {existingImageUrls.map((url, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
                    <img 
                      src={url} 
                      alt={`Existing ${idx}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {/* New Previews */}
                {imagePreviews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
                    <img 
                      src={preview} 
                      alt={`New ${idx}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/10 backdrop-blur-md rounded text-[8px] uppercase tracking-widest text-white/60">Nuevo</div>
                  </div>
                ))}

                {/* Upload Button */}
                {(existingImageUrls.length + imageFiles.length) < 7 && (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center gap-2 text-white/20 group-hover:text-white/40 transition-colors">
                      <Upload size={24} />
                      <span className="text-[8px] uppercase tracking-widest text-center px-2">Subir foto</span>
                    </div>
                    <input 
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-widest mt-2">
                {existingImageUrls.length + imageFiles.length} de 7 fotos utilizadas
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Contenido del relato</label>
            <div className="quill-container">
              <ReactQuill 
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Había una vez..."
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-h-[400px] text-lg leading-relaxed font-serif focus:border-white outline-none transition-colors"
              />
            </div>
            <style>{`
              .quill-container .ql-toolbar {
                border: none;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.02);
                padding: 1rem;
              }
              .quill-container .ql-container {
                border: none;
                min-height: 350px;
                font-family: inherit;
                font-size: 1.125rem;
              }
              .quill-container .ql-editor {
                padding: 2rem;
                min-height: 350px;
              }
              .quill-container .ql-editor.ql-blank::before {
                color: rgba(255,255,255,0.2);
                font-style: normal;
                left: 2rem;
              }
              .quill-container .ql-stroke {
                stroke: rgba(255,255,255,0.6);
              }
              .quill-container .ql-fill {
                fill: rgba(255,255,255,0.6);
              }
              .quill-container .ql-picker {
                color: rgba(255,255,255,0.6);
              }
            `}</style>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black py-6 rounded-full font-serif text-xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                {storyId ? <Save size={20} /> : <Send size={20} />}
                <span>{storyId ? 'Guardar Cambios' : 'Publicar Relato'}</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
