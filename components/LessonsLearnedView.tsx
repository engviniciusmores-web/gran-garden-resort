import React, { useState } from 'react';
import { AlertOctagon, Plus, Filter, Calendar, User, FileText, Trash2, Edit2, Save, X } from 'lucide-react';

interface LessonLearned {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'technical' | 'management' | 'safety' | 'quality' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  actionsTaken: string;
  preventiveMeasures: string;
  status: 'open' | 'in-progress' | 'resolved';
}

export const LessonsLearnedView: React.FC = () => {
  const [lessons, setLessons] = useState<LessonLearned[]>([
    {
      id: '1',
      date: '2025-12-10',
      title: 'Atraso na entrega de concreto',
      description: 'Concretagem da laje do pavimento térreo atrasou 2 dias devido a problemas com fornecedor',
      category: 'management',
      severity: 'high',
      reportedBy: 'Equipe Caio',
      actionsTaken: 'Acionado fornecedor backup para próximas concretagens',
      preventiveMeasures: 'Manter sempre dois fornecedores homologados com contratos',
      status: 'resolved'
    },
    {
      id: '2',
      date: '2025-12-12',
      title: 'Erro na medição de armação',
      description: 'Descoberto erro no dimensionamento da armação do pilar P15 durante fiscalização',
      category: 'technical',
      severity: 'critical',
      reportedBy: 'Coord. Geral',
      actionsTaken: 'Reforço estrutural executado conforme orientação do projetista',
      preventiveMeasures: 'Implementar dupla verificação em todos os elementos estruturais críticos',
      status: 'resolved'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonLearned | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<LessonLearned>>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    category: 'other',
    severity: 'medium',
    reportedBy: '',
    actionsTaken: '',
    preventiveMeasures: '',
    status: 'open'
  });

  const categories = [
    { value: 'technical', label: 'Técnico', color: 'bg-blue-500' },
    { value: 'management', label: 'Gestão', color: 'bg-purple-500' },
    { value: 'safety', label: 'Segurança', color: 'bg-red-500' },
    { value: 'quality', label: 'Qualidade', color: 'bg-green-500' },
    { value: 'other', label: 'Outros', color: 'bg-gray-500' }
  ];

  const severities = [
    { value: 'low', label: 'Baixa', color: 'text-green-600 bg-green-50' },
    { value: 'medium', label: 'Média', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'high', label: 'Alta', color: 'text-orange-600 bg-orange-50' },
    { value: 'critical', label: 'Crítica', color: 'text-red-600 bg-red-50' }
  ];

  const statuses = [
    { value: 'open', label: 'Aberto', color: 'text-red-600 bg-red-50' },
    { value: 'in-progress', label: 'Em Andamento', color: 'text-blue-600 bg-blue-50' },
    { value: 'resolved', label: 'Resolvido', color: 'text-green-600 bg-green-50' }
  ];

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.reportedBy) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (editingLesson) {
      setLessons(lessons.map(l => l.id === editingLesson.id ? { ...formData, id: l.id } as LessonLearned : l));
    } else {
      const newLesson: LessonLearned = {
        ...formData,
        id: Date.now().toString()
      } as LessonLearned;
      setLessons([newLesson, ...lessons]);
    }

    setIsModalOpen(false);
    setEditingLesson(null);
    resetForm();
  };

  const handleEdit = (lesson: LessonLearned) => {
    setEditingLesson(lesson);
    setFormData(lesson);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta lição aprendida?')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      category: 'other',
      severity: 'medium',
      reportedBy: '',
      actionsTaken: '',
      preventiveMeasures: '',
      status: 'open'
    });
  };

  const filteredLessons = lessons.filter(lesson => {
    if (filterCategory !== 'all' && lesson.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && lesson.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && lesson.status !== filterStatus) return false;
    return true;
  });

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-500';
  };

  const getSeverityColor = (severity: string) => {
    return severities.find(s => s.value === severity)?.color || 'text-gray-600 bg-gray-50';
  };

  const getStatusColor = (status: string) => {
    return statuses.find(s => s.value === status)?.color || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertOctagon className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Lições Aprendidas</h1>
              <p className="text-slate-600 mt-1">Registro de problemas e aprendizados da obra</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingLesson(null);
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Lição
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="text-slate-600 text-sm mb-1">Total de Registros</div>
            <div className="text-2xl font-bold text-slate-800">{lessons.length}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <div className="text-red-600 text-sm mb-1">Críticos</div>
            <div className="text-2xl font-bold text-red-700">
              {lessons.filter(l => l.severity === 'critical').length}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="text-blue-600 text-sm mb-1">Em Andamento</div>
            <div className="text-2xl font-bold text-blue-700">
              {lessons.filter(l => l.status === 'in-progress').length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-green-600 text-sm mb-1">Resolvidos</div>
            <div className="text-2xl font-bold text-green-700">
              {lessons.filter(l => l.status === 'resolved').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
          <div className="flex items-center mb-3">
            <Filter className="w-5 h-5 text-slate-600 mr-2" />
            <h3 className="font-semibold text-slate-800">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-2">Categoria</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Severidade</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                {severities.map(sev => (
                  <option key={sev.value} value={sev.value}>{sev.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                {statuses.map(st => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <AlertOctagon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Nenhuma lição aprendida registrada</p>
            <p className="text-slate-400 text-sm mt-2">Clique em "Nova Lição" para adicionar</p>
          </div>
        ) : (
          filteredLessons.map(lesson => (
            <div key={lesson.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${getCategoryColor(lesson.category)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {categories.find(c => c.value === lesson.category)?.label}
                    </span>
                    <span className={`${getSeverityColor(lesson.severity)} px-3 py-1 rounded-full text-xs font-semibold`}>
                      {severities.find(s => s.value === lesson.severity)?.label}
                    </span>
                    <span className={`${getStatusColor(lesson.status)} px-3 py-1 rounded-full text-xs font-semibold`}>
                      {statuses.find(s => s.value === lesson.status)?.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{lesson.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(lesson.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {lesson.reportedBy}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Descrição:</p>
                  <p className="text-slate-600">{lesson.description}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Ações Tomadas:</p>
                  <p className="text-slate-600">{lesson.actionsTaken}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">Medidas Preventivas:</p>
                  <p className="text-slate-600">{lesson.preventiveMeasures}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingLesson ? 'Editar Lição Aprendida' : 'Nova Lição Aprendida'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingLesson(null);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Data *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Reportado Por *</label>
                  <input
                    type="text"
                    value={formData.reportedBy}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    placeholder="Nome da equipe ou responsável"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Resumo do problema ou aprendizado"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Severidade *</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {severities.map(sev => (
                      <option key={sev.value} value={sev.value}>{sev.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {statuses.map(st => (
                      <option key={st.value} value={st.value}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição do Problema *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva detalhadamente o que aconteceu..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ações Tomadas *</label>
                <textarea
                  value={formData.actionsTaken}
                  onChange={(e) => setFormData({ ...formData, actionsTaken: e.target.value })}
                  placeholder="Quais ações foram tomadas para resolver o problema..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Medidas Preventivas *</label>
                <textarea
                  value={formData.preventiveMeasures}
                  onChange={(e) => setFormData({ ...formData, preventiveMeasures: e.target.value })}
                  placeholder="Como evitar que isso aconteça novamente..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingLesson(null);
                  resetForm();
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
