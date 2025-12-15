import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar, FileText, Image, AlertCircle, Download, Search, Filter, User } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'dailyLog' | 'photo' | 'lesson';
  date: Date;
  title: string;
  description: string;
  author: string;
  data: any;
}

export const HistoryView: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const allItems: HistoryItem[] = [];

      // Carregar Diários
      const logsQuery = query(collection(db, 'dailyLogs'), orderBy('createdAt', 'desc'), limit(50));
      const logsSnapshot = await getDocs(logsQuery);
      logsSnapshot.forEach(doc => {
        const data = doc.data();
        allItems.push({
          id: doc.id,
          type: 'dailyLog',
          date: data.createdAt?.toDate() || new Date(),
          title: `Diário de Obra - ${data.date}`,
          description: data.activities?.substring(0, 150) + '...',
          author: data.createdBy || 'Desconhecido',
          data: data
        });
      });

      // Carregar Fotos
      const photosQuery = query(collection(db, 'photos'), orderBy('uploadedAt', 'desc'), limit(50));
      const photosSnapshot = await getDocs(photosQuery);
      photosSnapshot.forEach(doc => {
        const data = doc.data();
        allItems.push({
          id: doc.id,
          type: 'photo',
          date: data.uploadedAt?.toDate() || new Date(),
          title: data.caption || 'Foto sem título',
          description: data.location || 'Local não especificado',
          author: data.uploadedBy || 'Desconhecido',
          data: data
        });
      });

      // Ordenar por data
      allItems.sort((a, b) => b.date.getTime() - a.date.getTime());
      setItems(allItems);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      alert('Erro ao carregar histórico. Verifique se o Firebase está configurado.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    // Filtro de tipo
    if (filterType !== 'all' && item.type !== filterType) return false;

    // Filtro de busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!item.title.toLowerCase().includes(search) &&
          !item.description.toLowerCase().includes(search) &&
          !item.author.toLowerCase().includes(search)) {
        return false;
      }
    }

    // Filtro de data
    if (dateFilter.start) {
      const startDate = new Date(dateFilter.start);
      if (item.date < startDate) return false;
    }
    if (dateFilter.end) {
      const endDate = new Date(dateFilter.end);
      endDate.setHours(23, 59, 59);
      if (item.date > endDate) return false;
    }

    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dailyLog': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'photo': return <Image className="w-5 h-5 text-green-600" />;
      case 'lesson': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'dailyLog': return 'Diário de Obra';
      case 'photo': return 'Foto';
      case 'lesson': return 'Lição Aprendida';
      default: return 'Registro';
    }
  };

  const exportToCSV = () => {
    const headers = ['Data', 'Tipo', 'Título', 'Descrição', 'Autor'];
    const rows = filteredItems.map(item => [
      item.date.toLocaleDateString('pt-BR'),
      getTypeLabel(item.type),
      item.title,
      item.description,
      item.author
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historico_obra_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Histórico Completo</h1>
              <p className="text-slate-600 mt-1">Consulte todos os registros da obra</p>
            </div>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-slate-600 text-sm mb-1">Total de Registros</div>
            <div className="text-2xl font-bold text-slate-800">{items.length}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="text-blue-600 text-sm mb-1">Diários de Obra</div>
            <div className="text-2xl font-bold text-blue-700">
              {items.filter(i => i.type === 'dailyLog').length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-green-600 text-sm mb-1">Fotos</div>
            <div className="text-2xl font-bold text-green-700">
              {items.filter(i => i.type === 'photo').length}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
            <div className="text-orange-600 text-sm mb-1">Lições Aprendidas</div>
            <div className="text-2xl font-bold text-orange-700">
              {items.filter(i => i.type === 'lesson').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Tipos</option>
              <option value="dailyLog">Diários de Obra</option>
              <option value="photo">Fotos</option>
              <option value="lesson">Lições Aprendidas</option>
            </select>

            <input
              type="date"
              placeholder="Data início"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              type="date"
              placeholder="Data fim"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Carregando histórico...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Nenhum registro encontrado</p>
          <p className="text-slate-400 text-sm mt-2">Ajuste os filtros ou aguarde novos registros</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getTypeIcon(item.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-slate-800">
                        {item.date.toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center text-sm text-slate-500">
                    <User className="w-4 h-4 mr-1" />
                    {item.author}
                  </div>

                  {/* Dados específicos por tipo */}
                  {item.type === 'photo' && item.data.url && (
                    <img
                      src={item.data.url}
                      alt={item.title}
                      className="mt-3 w-48 h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  {item.type === 'dailyLog' && item.data.weather && (
                    <div className="mt-2 text-sm text-slate-500">
                      Clima: {item.data.weather === 'sunny' ? '☀️ Ensolarado' : 
                              item.data.weather === 'cloudy' ? '☁️ Nublado' :
                              item.data.weather === 'rainy' ? '🌧️ Chuvoso' : '⛈️ Tempestade'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
