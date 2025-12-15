import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Camera, Image as ImageIcon, Trash2, Calendar, User, Search, Filter, Download, X, Upload } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption: string;
  uploadedBy: string;
  uploadedAt: Date;
  location?: string;
  tags?: string[];
}

export const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');

  // Upload de foto
  const [uploadForm, setUploadForm] = useState({
    caption: '',
    location: '',
    tags: '',
    uploadedBy: 'Usuário'
  });

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'photos'), orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const photosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
      })) as Photo[];
      
      setPhotos(photosData);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      alert('Erro ao carregar fotos. Verifique se o Firebase está configurado.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande! Máximo 5MB.');
      return;
    }

    try {
      setUploading(true);

      // Upload para Firebase Storage
      const timestamp = Date.now();
      const fileName = `photos/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Salvar metadados no Firestore
      const tags = uploadForm.tags.split(',').map(t => t.trim()).filter(t => t);
      
      await addDoc(collection(db, 'photos'), {
        url: downloadURL,
        caption: uploadForm.caption,
        location: uploadForm.location,
        tags: tags,
        uploadedBy: uploadForm.uploadedBy,
        uploadedAt: Timestamp.now(),
        fileName: fileName
      });

      // Resetar form
      setUploadForm({
        caption: '',
        location: '',
        tags: '',
        uploadedBy: uploadForm.uploadedBy
      });

      await loadPhotos();
      alert('Foto enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao enviar foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Tem certeza que deseja excluir esta foto?')) return;

    try {
      // Deletar do Storage
      const storageRef = ref(storage, photo.url);
      await deleteObject(storageRef);

      // Deletar do Firestore
      await deleteDoc(doc(db, 'photos', photo.id));

      await loadPhotos();
      setSelectedPhoto(null);
      alert('Foto excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir foto.');
    }
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterTag === 'all' || photo.tags?.includes(filterTag);
    
    return matchesSearch && matchesFilter;
  });

  const allTags = Array.from(new Set(photos.flatMap(p => p.tags || [])));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Camera className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Galeria de Fotos da Obra</h1>
              <p className="text-slate-600 mt-1">Registro fotográfico completo do projeto</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-slate-600 text-sm mb-1">Total de Fotos</div>
            <div className="text-2xl font-bold text-slate-800">{photos.length}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="text-blue-600 text-sm mb-1">Esta Semana</div>
            <div className="text-2xl font-bold text-blue-700">
              {photos.filter(p => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return p.uploadedAt >= weekAgo;
              }).length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-green-600 text-sm mb-1">Tags Disponíveis</div>
            <div className="text-2xl font-bold text-green-700">{allTags.length}</div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Enviar Nova Foto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Descrição da foto"
              value={uploadForm.caption}
              onChange={(e) => setUploadForm({...uploadForm, caption: e.target.value})}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Local (ex: Bloco A - 2º Pavimento)"
              value={uploadForm.location}
              onChange={(e) => setUploadForm({...uploadForm, location: e.target.value})}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Tags (separadas por vírgula)"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Seu nome"
              value={uploadForm.uploadedBy}
              onChange={(e) => setUploadForm({...uploadForm, uploadedBy: e.target.value})}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <label className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
            <Camera className="w-5 h-5 mr-2" />
            {uploading ? 'Enviando...' : 'Selecionar e Enviar Foto'}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por descrição, local ou pessoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Carregando fotos...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Nenhuma foto encontrada</p>
          <p className="text-slate-400 text-sm mt-2">Envie a primeira foto da obra!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="relative group cursor-pointer bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="font-semibold text-slate-800 truncate">{photo.caption}</p>
                {photo.location && (
                  <p className="text-xs text-slate-500 mt-1 truncate">{photo.location}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">
                    {photo.uploadedAt.toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-xs text-blue-600">{photo.uploadedBy}</span>
                </div>
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {photo.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-slate-800">{selectedPhoto.caption}</h3>
              <div className="flex gap-2">
                <a
                  href={selectedPhoto.url}
                  download
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Baixar"
                >
                  <Download className="w-5 h-5 text-slate-600" />
                </a>
                <button
                  onClick={() => handleDelete(selectedPhoto)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full rounded-lg mb-4"
              />
              
              <div className="space-y-3">
                {selectedPhoto.location && (
                  <div className="flex items-start">
                    <span className="font-semibold text-slate-700 mr-2">Local:</span>
                    <span className="text-slate-600">{selectedPhoto.location}</span>
                  </div>
                )}
                
                <div className="flex items-start">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2 mt-1" />
                  <span className="text-slate-600">
                    {selectedPhoto.uploadedAt.toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex items-start">
                  <User className="w-4 h-4 text-slate-400 mr-2 mt-1" />
                  <span className="text-slate-600">{selectedPhoto.uploadedBy}</span>
                </div>
                
                {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-700 block mb-2">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhoto.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
