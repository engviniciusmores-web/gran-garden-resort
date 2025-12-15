
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  CalendarDays, 
  Package, 
  Users, 
  FileBarChart,
  LogOut,
  Building2,
  HardHat,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  AlertOctagon,
  Hammer,
  FolderOpen,
  FileText,
  UploadCloud,
  Download,
  DollarSign,
  PieChart as PieChartIcon,
  FileCode,
  Ruler,
  Box,
  Image as ImageIcon,
  Menu,
  X,
  MessageCircle,
  Plus,
  Send,
  Layers,
  Eye,
  Database,
  Moon,
  Sun,
  Filter,
  FileSpreadsheet,
  Keyboard,
  HelpCircle
} from 'lucide-react';
import { ViewState, Project, Task, Material, IfcElement } from './types';
import { MOCK_PROJECTS, MOCK_TASKS, ALL_TASKS, MOCK_MATERIALS, MOCK_BUDGET, MOCK_FILES, MOCK_TIMELINE_DATA } from './constants';
import { Button } from './components/ui/Button';
import { DailyLog } from './components/DailyLog';
import { ReportsView } from './components/ReportsView';
import { LessonsLearnedView } from './components/LessonsLearnedView';

// Dados completos: 4.221 tarefas integradas do sistema UNICIFA
console.log(`✅ Sistema integrado com ${ALL_TASKS.length} tarefas do cronograma completo`);
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend, LineChart, Line, Area, AreaChart } from 'recharts';

// --- Components for Modals ---

const NewTaskModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (task: Task) => void }> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [responsible, setResponsible] = useState('');
  const [errors, setErrors] = useState<{name?: string, deadline?: string, responsible?: string}>({});

  const validate = () => {
    const newErrors: {name?: string, deadline?: string, responsible?: string} = {};
    
    if (!name.trim()) newErrors.name = 'Atividade é obrigatória';
    else if (name.length < 3) newErrors.name = 'Atividade deve ter no mínimo 3 caracteres';
    
    if (!deadline) newErrors.deadline = 'Prazo é obrigatório';
    else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.deadline = 'Prazo não pode ser no passado';
    }
    
    if (!responsible.trim()) newErrors.responsible = 'Responsável é obrigatório';
    else if (responsible.length < 3) newErrors.responsible = 'Nome deve ter no mínimo 3 caracteres';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        id: Date.now().toString(),
        name: name.trim(),
        deadline,
        responsible: responsible.trim(),
        status: 'A Fazer'
      });
      setName(''); 
      setDeadline(''); 
      setResponsible('');
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <Plus className="mr-2 text-blue-600" /> Nova Tarefa
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Atividade <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Ex: Concretagem Laje 2"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({...errors, name: undefined});
              }}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Prazo <span className="text-red-500">*</span>
            </label>
            <input 
              type="date" 
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.deadline ? 'border-red-500' : 'border-slate-300'
              }`}
              value={deadline}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setDeadline(e.target.value);
                setErrors({...errors, deadline: undefined});
              }}
            />
            {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Responsável <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.responsible ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Ex: Mestre João"
              value={responsible}
              onChange={(e) => {
                setResponsible(e.target.value);
                setErrors({...errors, responsible: undefined});
              }}
            />
            {errors.responsible && <p className="text-xs text-red-500 mt-1">{errors.responsible}</p>}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" fullWidth onClick={onClose}>Cancelar</Button>
            <Button fullWidth onClick={handleSave}>Salvar Tarefa</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialRequestModal: React.FC<{ isOpen: boolean; onClose: () => void; materials: Material[]; onSuccess: () => void }> = ({ isOpen, onClose, materials, onSuccess }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]?.id || '');
  const [quantity, setQuantity] = useState('');
  const [obs, setObs] = useState('');
  const [errors, setErrors] = useState<{quantity?: string}>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: {quantity?: string} = {};
    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = 'Quantidade deve ser maior que zero';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendEmail = () => {
    if (!validate()) return;
    
    const material = materials.find(m => m.id === selectedMaterial);
    if (!material) return;

    const subject = `Solicitação de Material: ${material.name}`;
    const body = `Olá Almoxarife,%0D%0A%0D%0AFavor providenciar o seguinte material com urgência:%0D%0A%0D%0A- Material: ${material.name}%0D%0A- Quantidade: ${quantity} ${material.unit}%0D%0A- Observações: ${obs || 'Nenhuma'}%0D%0A%0D%0AAtt,%0D%0AEngenharia`;
    
    // Open default mail client
    window.open(`mailto:almoxarife@obracontrol.com?subject=${subject}&body=${body}`);
    onSuccess();
    setQuantity('');
    setObs('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <Package className="mr-2 text-blue-900" /> Solicitar Material
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Material <span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
            >
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantidade <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.quantity ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="0.00"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors({});
              }}
            />
            {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea 
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Detalhes adicionais sobre a solicitação..."
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" fullWidth onClick={onClose}>Cancelar</Button>
            <Button fullWidth onClick={handleSendEmail} icon={<Send size={16}/>}>Enviar Pedido</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Buscar em qualquer lugar' },
    { keys: ['Ctrl', 'N'], description: 'Nova tarefa (na tela de Planejamento)' },
    { keys: ['Ctrl', 'D'], description: 'Alternar modo escuro' },
    { keys: ['Esc'], description: 'Fechar modais' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center">
            <Keyboard className="mr-2 text-blue-600" /> Atalhos de Teclado
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-700">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-400 mx-1">+</span>}
                    <kbd className="px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded shadow-sm">
                      {key}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> Use os atalhos para navegar mais rápido pelo sistema!
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for specific views ---

const ProjectSelect: React.FC<{ onSelect: (p: Project) => void }> = ({ onSelect }) => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
    {/* Background Image Overlay */}
    <div className="absolute inset-0 z-0 opacity-40">
        <img 
            src={MOCK_PROJECTS[0].imageUrl} 
            alt="Background Resort" 
            className="w-full h-full object-cover"
        />
    </div>
    
    <div className="relative z-10 w-full max-w-6xl p-6 animate-fadeIn flex flex-col items-center">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-4 shadow-2xl">
           <Building2 className="text-white w-12 h-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-lg">Gran Garden Resort</h1>
        <p className="text-slate-200 text-lg font-light tracking-wide">Portal de Gestão de Engenharia</p>
        
        <div className="flex justify-center gap-6 mt-4 text-sm text-white/90 font-medium">
            <span className="bg-blue-900/50 px-3 py-1 rounded-full border border-blue-500/30">41.798,4 m² A.C.</span>
            <span className="bg-blue-900/50 px-3 py-1 rounded-full border border-blue-500/30">R$ 192M Orçamento</span>
        </div>
      </div>

      {/* Contatos dos Engenheiros */}
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-6 mb-4 border-l-4 border-blue-600">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contato 1 - Gerente de Obras */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
               <div className="text-center sm:text-left mb-3 sm:mb-0">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gerente de Obras</p>
                  <h4 className="font-bold text-slate-800 text-lg">Engº José Paulo Grings</h4>
                  <p className="text-sm text-slate-600">+55 (51) 99135-4973</p>
               </div>
               <a 
                 href="https://wa.me/5551991354973?text=Ol%C3%A1%20Eng.%20Jos%C3%A9%20Paulo%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20a%20obra%20do%20Gran%20Garden%20Resort."
                 target="_blank"
                 rel="noreferrer"
                 className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all shadow-md font-bold text-sm w-full sm:w-auto"
               >
                  <MessageCircle size={18} className="mr-2" /> WhatsApp
               </a>
            </div>

            {/* Contato 2 - Coordenador de Obras */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
               <div className="text-center sm:text-left mb-3 sm:mb-0">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coordenador de Obras</p>
                  <h4 className="font-bold text-slate-800 text-lg">Engº Vinicius Morés</h4>
                  <p className="text-sm text-slate-600">+55 (51) 99998-8955</p>
               </div>
               <a 
                 href="https://wa.me/5551999988955?text=Ol%C3%A1%20Eng.%20Vinicius%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20a%20obra%20do%20Gran%20Garden%20Resort."
                 target="_blank"
                 rel="noreferrer"
                 className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all shadow-md font-bold text-sm w-full sm:w-auto"
               >
                  <MessageCircle size={18} className="mr-2" /> WhatsApp
               </a>
            </div>

            {/* Contato 3 - Coordenador de Projetos */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
               <div className="text-center sm:text-left mb-3 sm:mb-0">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coordenador de Projetos</p>
                  <h4 className="font-bold text-slate-800 text-lg">Engº Fabio Correa</h4>
                  <p className="text-sm text-slate-600">+55 (62) 99641-3988</p>
               </div>
               <a 
                 href="https://wa.me/5562996413988?text=Ol%C3%A1%20Eng.%20Fabio%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20o%20projeto%20do%20Gran%20Garden%20Resort."
                 target="_blank"
                 rel="noreferrer"
                 className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all shadow-md font-bold text-sm w-full sm:w-auto"
               >
                  <MessageCircle size={18} className="mr-2" /> WhatsApp
               </a>
            </div>
         </div>
      </div>

      {/* Dúvidas sobre projeto */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-6 mb-8 border-l-4 border-green-600">
         <h3 className="text-green-900 font-bold text-lg mb-4 flex items-center">
            <MessageCircle className="mr-2" /> Dúvidas sobre projeto
         </h3>
         <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-center sm:text-left mb-3 sm:mb-0">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coordenação de Projetos</p>
               <h4 className="font-bold text-slate-800 text-lg">Engº Eduardo Moraes</h4>
               <p className="text-sm text-slate-600">+55 (64) 99285-0439</p>
            </div>
            <a 
              href="https://wa.me/5564992850439?text=Ol%C3%A1%20Eng.%20Eduardo%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20o%20projeto%20do%20Gran%20Garden%20Resort."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all shadow-md font-bold text-sm w-full sm:w-auto"
            >
               <MessageCircle size={18} className="mr-2" /> WhatsApp
            </a>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {MOCK_PROJECTS.map(project => (
          <div 
            key={project.id}
            onClick={() => onSelect(project)}
            className="group bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border-l-4 border-blue-900"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-900 transition-colors">{project.name}</h3>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  project.status === 'Atrasada' ? 'bg-red-100 text-red-700' :
                  project.status === 'Finalizada' ? 'bg-green-100 text-green-700' :
                  project.status === 'A Iniciar' ? 'bg-slate-100 text-slate-600' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                 <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500 flex items-center"><Ruler size={14} className="mr-1.5"/> Área</span>
                    <span className="font-semibold text-slate-700">{project.area.toLocaleString('pt-BR')} m²</span>
                 </div>
                 <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500 flex items-center"><Box size={14} className="mr-1.5"/> Concreto</span>
                    <span className="font-semibold text-slate-700">{project.concreteVolume.toLocaleString('pt-BR')} m³</span>
                 </div>
                 <div className="flex flex-col text-sm pt-1">
                    <span className="text-slate-400 text-xs uppercase font-bold mb-1">Equipe</span>
                    <div className="text-slate-700 truncate font-medium flex items-center">
                        <Users size={14} className="mr-1.5 text-blue-600" />
                        {project.teamMembers}
                    </div>
                 </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Progresso</span>
                    <span className="text-sm font-bold text-blue-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      project.status === 'Finalizada' ? 'bg-green-500' : 
                      project.status === 'Atrasada' ? 'bg-red-500' : 'bg-blue-600'
                    }`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LoginView: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative">
     <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[100%] rounded-full bg-blue-800/20 blur-3xl"></div>
     </div>
    <div className="bg-white w-full max-w-sm rounded-2xl p-10 shadow-2xl relative z-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gran Garden</h1>
        <p className="text-slate-500">Acesso Corporativo</p>
      </div>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Usuário</label>
          <input type="text" className="w-full p-3.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="ID ou Email" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
          <input type="password" className="w-full p-3.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••" />
        </div>
        <Button fullWidth size="lg" onClick={onLogin} className="mt-2">Acessar Sistema</Button>
        <div className="text-center text-sm text-slate-400 mt-6 hover:text-blue-700 cursor-pointer transition-colors">Recuperar acesso</div>
      </div>
    </div>
  </div>
);

// --- Dashboard View ---
const DashboardView: React.FC<{ project: Project, onChangeView: (v: ViewState) => void, tasks: Task[] }> = ({ project, onChangeView, tasks }) => {
  return (
    <div className="space-y-8 animate-fadeIn pb-24 lg:pb-0">
      
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-64 bg-slate-900 shadow-lg">
          <img src={project.imageUrl || ''} className="w-full h-full object-cover opacity-60" alt="Obra" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                    <div className="flex items-center text-slate-300 gap-4 text-sm font-medium">
                        <span className="flex items-center bg-white/10 px-3 py-1 rounded-full"><Users size={14} className="mr-2"/> {project.teamName}</span>
                        <span className="flex items-center bg-white/10 px-3 py-1 rounded-full"><Building2 size={14} className="mr-2"/> Bloco em Estrutura</span>
                    </div>
                  </div>
                  <div className="hidden md:block text-right">
                     <div className="text-sm text-slate-400 mb-1">Status Atual</div>
                     <div className="text-2xl font-bold text-white flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${project.status === 'Em Andamento' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        {project.status}
                     </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Avanço Físico</div>
          <div className="text-4xl font-bold text-slate-800">{project.progress}%</div>
          <div className="text-xs text-green-600 font-medium flex items-center mt-2 bg-green-50 w-fit px-2 py-1 rounded">
            <TrendingUp size={12} className="mr-1" /> Meta atingida
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Vol. Concreto</div>
          <div className="text-3xl font-bold text-slate-800">{Math.round(project.concreteVolume)} <span className="text-lg text-slate-400">m³</span></div>
          <div className="text-xs text-slate-400 mt-2">Previsto x Realizado</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Área Construída</div>
          <div className="text-3xl font-bold text-slate-800">{Math.round(project.area).toLocaleString()} <span className="text-lg text-slate-400">m²</span></div>
          <div className="text-xs text-slate-400 mt-2">Total do Bloco</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Pendências</div>
          <div className="text-4xl font-bold text-blue-900">1</div>
          <div className="text-xs text-orange-500 mt-2 font-medium">Requer atenção imediata</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Actions & Tasks */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                size="lg" 
                icon={<ClipboardList />} 
                onClick={() => onChangeView('DAILY_LOG')}
                className="shadow-lg shadow-blue-900/10"
              >
                Diário de Obra
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                icon={<CalendarDays />} 
                onClick={() => onChangeView('PLANNING')}
                className="bg-white hover:bg-slate-50"
              >
                Planejamento
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                icon={<Package />} 
                onClick={() => onChangeView('MATERIALS')}
                className="bg-white hover:bg-slate-50"
              >
                Materiais
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Atividades Recentes</h3>
                    <p className="text-sm text-slate-500">Acompanhamento Diário</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onChangeView('PLANNING')}>Ver todas</Button>
              </div>
              <div className="divide-y divide-slate-100">
                {tasks.slice(0, 4).map(task => (
                   <div key={task.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                            task.status === 'Atrasado' ? 'bg-red-500' : 
                            task.status === 'Concluído' ? 'bg-green-500' :
                            task.status === 'A Fazer' ? 'bg-slate-300' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <div className="font-semibold text-slate-800">{task.name}</div>
                          <div className="text-sm text-slate-500 mt-1 flex items-center">
                            <Users size={14} className="mr-1" /> {task.responsible}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                        task.status === 'Atrasado' ? 'bg-red-100 text-red-700' : 
                        task.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                        task.status === 'A Fazer' ? 'bg-slate-100 text-slate-600' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {task.status}
                      </span>
                   </div>
                ))}
              </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="font-medium text-blue-100">Previsão do Tempo</p>
                    <h3 className="text-3xl font-bold mt-1">24°C</h3>
                    <p className="text-sm text-blue-100 mt-1">Ensolarado • Umidade 45%</p>
                 </div>
                 <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <span className="text-2xl">☀️</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Gráfico de Evolução Temporal */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center">
              <TrendingUp className="mr-2 text-blue-600" /> Evolução do Projeto
            </h3>
            <p className="text-sm text-slate-500">Planejado vs Realizado (%)</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-slate-600">Planejado</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-slate-600">Realizado</span>
            </div>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_TIMELINE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Area 
                type="monotone" 
                dataKey="planned" 
                name="Planejado"
                stroke="#3b82f6" 
                strokeWidth={2}
                fill="url(#colorPlanned)" 
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Realizado"
                stroke="#10b981" 
                strokeWidth={3}
                fill="url(#colorActual)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start">
            <AlertOctagon className="text-orange-600 mr-3 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-sm font-semibold text-orange-800">Desvio Detectado</p>
              <p className="text-xs text-orange-700 mt-1">
                O progresso real está 9% abaixo do planejado. Considere revisar cronograma e alocar recursos adicionais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Planning View (With Add Task Logic) ---
const PlanningView: React.FC<{ tasks: Task[], onAddTask: () => void }> = ({ tasks, onAddTask }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getTasksNearDeadline = () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return tasks.filter(task => {
      const deadline = new Date(task.deadline);
      return deadline >= today && deadline <= threeDaysFromNow && task.status !== 'Concluído';
    });
  };

  const nearDeadlineTasks = getTasksNearDeadline();

  const exportToExcel = () => {
    const csvContent = [
      ['Atividade', 'Prazo', 'Responsável', 'Status'].join(','),
      ...filteredTasks.map(task => [
        task.name,
        new Date(task.deadline).toLocaleDateString('pt-BR'),
        task.responsible,
        task.status
      ].join(','))
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tarefas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      {/* Notificações de Prazo */}
      {nearDeadlineTasks.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg animate-fadeIn">
          <div className="flex items-start">
            <Bell className="text-orange-500 mr-3 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-orange-800">Atenção: {nearDeadlineTasks.length} tarefa(s) com prazo próximo</h4>
              <ul className="mt-2 space-y-1">
                {nearDeadlineTasks.map(task => (
                  <li key={task.id} className="text-sm text-orange-700">
                    • {task.name} - Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Planejamento</h2>
          <p className="text-slate-500">Cronograma detalhado das atividades</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter size={16}/>}
          >
            Filtros {filterStatus !== 'Todos' && `(${filterStatus})`}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel}
            icon={<FileSpreadsheet size={16}/>}
          >
            Exportar Excel
          </Button>
          <Button size="sm" onClick={onAddTask} icon={<Plus size={16}/>}>Nova Tarefa</Button>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por atividade ou responsável..." 
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showFilters && (
          <div className="flex gap-2 flex-wrap pt-2 border-t border-slate-100 animate-fadeIn">
            {['Todos', 'A Fazer', 'Em Andamento', 'Concluído', 'Atrasado'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm text-slate-500 flex justify-between items-center">
        <span>Mostrando {filteredTasks.length} de {tasks.length} tarefas</span>
      </div>
      
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            {searchTerm || filterStatus !== 'Todos' ? 'Nenhuma tarefa encontrada com os filtros aplicados.' : 'Nenhuma tarefa cadastrada.'}
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-300 transition-colors cursor-pointer hover:shadow-md">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${
                    task.status === 'Atrasado' ? 'bg-red-500' : 
                    task.status === 'Concluído' ? 'bg-green-500' :
                    task.status === 'A Fazer' ? 'bg-slate-300' :
                    'bg-blue-500'
                  }`}></span>
                  <h3 className="font-bold text-slate-800 text-lg">{task.name}</h3>
                </div>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center">
                    <CalendarDays size={14} className="mr-2"/> {new Date(task.deadline).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-sm text-slate-500 flex items-center">
                    <Users size={14} className="mr-2"/> {task.responsible}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                <span className={`text-sm font-bold px-3 py-1 rounded-md ${
                  task.status === 'Atrasado' ? 'bg-red-100 text-red-700' : 
                  task.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                  task.status === 'A Fazer' ? 'bg-slate-100 text-slate-700' :
                  'bg-blue-100 text-blue-800'
                }`}>{task.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Materials View (With Request Logic) ---
const MaterialsView: React.FC<{ materials: Material[], onRequestMaterial: () => void }> = ({ materials, onRequestMaterial }) => {
  const data = materials.map(m => ({ name: m.name, value: m.consumedToday }));
  
  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Controle de Materiais</h2>
        <Button onClick={onRequestMaterial} icon={<Package size={16}/>}>Solicitar Material</Button>
      </div>
      
      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-600 mb-6 uppercase tracking-wider">Consumo Diário</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12, fill: '#475569'}} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="value" fill="#1e3a8a" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map(mat => (
           <div key={mat.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{mat.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Estoque Atual: <span className="font-semibold text-slate-700">{mat.stock} {mat.unit}</span></p>
              </div>
              <div className="text-right">
                {mat.stock <= mat.minStock ? (
                   <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-full flex items-center">
                     <AlertOctagon size={14} className="mr-1.5"/> Repor Estoque
                   </span>
                ) : (
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">Nível Normal</span>
                )}
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

// --- BIM Viewer (Simulated) ---
const BimView: React.FC = () => {
    const [fileLoaded, setFileLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedElement, setSelectedElement] = useState<IfcElement | null>(null);

    // Mock extraction data
    const mockElements: IfcElement[] = [
        { id: '1', type: 'Pilar', name: 'P-12', level: 'Térreo', properties: { volume: 0.45, area: 4.2, material: 'Concreto C35' } },
        { id: '2', type: 'Viga', name: 'V-104', level: '1º Pavimento', properties: { volume: 1.2, area: 12.5, material: 'Concreto C30' } },
        { id: '3', type: 'Laje', name: 'L-05', level: 'Cobertura', properties: { volume: 15.6, area: 120, material: 'Concreto C25' } },
    ];

    const handleLoadFile = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setFileLoaded(true);
        }, 2000);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-4">
            <div className={`flex-1 bg-slate-900 rounded-xl overflow-hidden relative shadow-2xl ${!fileLoaded ? 'flex items-center justify-center' : ''}`}>
                {!fileLoaded ? (
                    <div className="text-center p-8">
                        {loading ? (
                             <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-white font-medium">Processando arquivo IFC...</p>
                                <p className="text-slate-400 text-sm mt-2">Extraindo geometria e metadados</p>
                             </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="bg-slate-800 p-6 rounded-full mb-6">
                                    <Box size={64} className="text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Visualizador BIM</h3>
                                <p className="text-slate-400 mb-8 max-w-md">Carregue seu modelo IFC para visualizar em 3D e extrair quantitativos automaticamente.</p>
                                <Button size="lg" onClick={handleLoadFile} icon={<UploadCloud />}>Carregar Modelo IFC</Button>
                                <p className="text-xs text-slate-500 mt-4">Suporta .ifc, .glTF, .obj (Simulado)</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Simulated 3D Viewport - Image Placeholder for 3D Context */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center">
                             {/* In a real app, this would be the <canvas> for Three.js / web-ifc */}
                             <img 
                                src="https://raw.githubusercontent.com/user-attachments/assets/gran-garden-resort.jpg" 
                                className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                                alt="3D Model"
                             />
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                 <div className="grid grid-cols-4 gap-8 opacity-30 transform perspective-1000 rotate-x-12 scale-75">
                                    {/* Grid Overlay Simulation */}
                                    {Array.from({length:16}).map((_,i) => <div key={i} className="w-32 h-32 border border-blue-500/50"></div>)}
                                 </div>
                             </div>
                             
                             {/* Interactive Points (Simulated) */}
                             <div 
                                className="absolute top-1/3 left-1/3 w-4 h-4 bg-blue-500 rounded-full cursor-pointer animate-pulse shadow-[0_0_15px_rgba(59,130,246,1)]"
                                onClick={() => setSelectedElement(mockElements[0])}
                             ></div>
                             <div 
                                className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-green-500 rounded-full cursor-pointer animate-pulse shadow-[0_0_15px_rgba(34,197,94,1)]"
                                onClick={() => setSelectedElement(mockElements[1])}
                             ></div>
                        </div>

                        {/* Overlay Controls */}
                        <div className="absolute top-4 left-4 flex gap-2">
                             <div className="bg-black/50 backdrop-blur-md p-2 rounded-lg text-white text-xs">
                                 <p className="font-bold">Gran Garden - Bloco A</p>
                                 <p className="text-slate-300">IFC 2x3 • 45MB</p>
                             </div>
                        </div>
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button size="sm" variant="secondary" className="opacity-80"><Layers size={16} /></Button>
                            <Button size="sm" variant="secondary" className="opacity-80"><Eye size={16} /></Button>
                        </div>
                    </>
                )}
            </div>

            {/* Properties Panel */}
            {fileLoaded && (
                <div className="w-full lg:w-80 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col animate-slideInRight">
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 flex items-center">
                            <Database size={18} className="mr-2 text-blue-900" /> Propriedades
                        </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedElement ? (
                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase">Elemento</span>
                                    <h4 className="text-xl font-bold text-slate-800">{selectedElement.name}</h4>
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mt-1 font-semibold">{selectedElement.type}</span>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500">Nível</span>
                                        <span className="text-sm font-medium">{selectedElement.level}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500">Material</span>
                                        <span className="text-sm font-medium">{selectedElement.properties.material}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500">Volume</span>
                                        <span className="text-sm font-medium">{selectedElement.properties.volume} m³</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-sm text-slate-500">Área de Forma</span>
                                        <span className="text-sm font-medium">{selectedElement.properties.area} m²</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button fullWidth size="sm" variant="outline" icon={<ClipboardList size={16}/>}>
                                        Adicionar ao Diário
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400 py-10">
                                <Box size={48} className="mx-auto mb-3 opacity-20" />
                                <p>Selecione um elemento no modelo 3D para ver os detalhes e quantitativos.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Database View (Updated Layout) ---
const DatabaseView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'BUDGET' | 'SCHEDULE'>('PROJECTS');
  const project = MOCK_PROJECTS[0];

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Base Técnica</h2>
           <p className="text-slate-500">Documentação Centralizada</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
           {['PROJECTS', 'BUDGET', 'SCHEDULE'].map((tab) => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === tab 
                    ? 'bg-blue-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
               >
                {tab === 'PROJECTS' ? 'Projetos' : tab === 'BUDGET' ? 'Orçamento' : 'Cronograma'}
               </button>
           ))}
        </div>
      </div>

      {activeTab === 'PROJECTS' && (
        <div className="space-y-8 animate-fadeIn">
           {/* Project Cover - New Professional Layout */}
           <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-lg group">
             <img 
               src={project.imageUrl} 
               alt="Render do Projeto" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-8">
                <div className="text-white max-w-2xl">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Em Construção</span>
                     <span className="bg-blue-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Fase Estrutural</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-2">{project.location}</h3>
                  <p className="text-slate-200 text-lg line-clamp-2">Complexo hoteleiro de alto padrão com 15 blocos residenciais e áreas de lazer integradas à natureza.</p>
                </div>
             </div>
             <div className="absolute top-6 right-6">
                <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20">
                    <ImageIcon className="w-4 h-4 mr-2" /> Galeria de Fotos
                </Button>
             </div>
           </div>

           {/* Files Grid */}
           <div>
               <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-800 text-lg">Documentos do Projeto</h3>
                   <Button variant="outline" size="sm" icon={<UploadCloud size={16}/>}>Upload</Button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {MOCK_FILES.map(file => (
                    <div key={file.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group flex items-start justify-between cursor-pointer">
                       <div className="flex items-start">
                          <div className={`p-3 rounded-lg mr-4 ${
                            file.type === 'PDF' ? 'bg-red-50 text-red-600' : 
                            file.type === 'DWG' ? 'bg-blue-50 text-blue-600' : 
                            file.type === 'MPP' ? 'bg-green-50 text-green-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                             {file.type === 'DWG' ? <FileCode size={24} /> : <FileText size={24} />}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-blue-700 transition-colors" title={file.name}>{file.name}</h4>
                            <div className="flex items-center text-xs text-slate-500 mt-1.5 space-x-2">
                               <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{file.category}</span>
                               <span>•</span>
                               <span>{file.date}</span>
                            </div>
                          </div>
                       </div>
                       <button className="text-slate-400 hover:text-blue-600 transition-colors">
                         <Download size={20} />
                       </button>
                    </div>
                  ))}
               </div>
           </div>
        </div>
      )}

      {activeTab === 'BUDGET' && (
        <div className="space-y-8 animate-fadeIn">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <DollarSign size={100} />
                </div>
                <div className="relative z-10">
                    <div className="text-slate-400 text-sm font-bold uppercase mb-2">Orçamento Total</div>
                    <div className="text-3xl font-bold">R$ 192.862.136</div>
                    <div className="mt-4 text-xs text-slate-400 bg-slate-800 w-fit px-2 py-1 rounded">Base Out/2025</div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-bold uppercase mb-2">Realizado (Estimado)</div>
                <div className="text-3xl font-bold text-blue-900">R$ 84.500.000</div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '43%'}}></div>
                </div>
                <div className="text-xs text-slate-500 mt-2 text-right">43% executado</div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm font-bold uppercase mb-2">Saldo a Realizar</div>
                <div className="text-3xl font-bold text-green-600">R$ 108.362.136</div>
                <div className="mt-4 flex items-center text-xs text-green-700 font-medium">
                    <TrendingUp size={14} className="mr-1" /> Dentro da margem prevista
                </div>
             </div>
           </div>

           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center"><PieChartIcon className="mr-2 w-6 h-6 text-blue-900"/> Curva ABC (Sintética)</h3>
             <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_BUDGET.sort((a,b) => b.estimated - a.estimated).slice(0, 10)} layout="vertical" margin={{left: 10, right: 30}}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" tickFormatter={(val) => `R$${(val/1000000).toFixed(0)}M`} tick={{fill: '#64748b'}} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={180} tick={{fontSize: 11, fill: '#334155', fontWeight: 500}} axisLine={false} />
                    <Tooltip 
                        formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                        cursor={{fill: '#f8fafc'}}
                    />
                    <Bar dataKey="estimated" name="Previsto" fill="#cbd5e1" radius={[0,4,4,0]} barSize={12} />
                    <Bar dataKey="spent" name="Realizado" fill="#1e3a8a" radius={[0,4,4,0]} barSize={12} />
                  </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'SCHEDULE' && (
        <div className="space-y-6 animate-fadeIn">
           <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                 <div className="bg-blue-50 p-4 rounded-xl text-blue-900">
                    <CalendarDays size={32} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900 text-xl">Cronograma Mestre Oficial</h3>
                   <p className="text-slate-500">Revisão 03 - Aprovada em 01/10/2025</p>
                 </div>
              </div>
              <Button icon={<Download size={18} />} variant="primary">Baixar Arquivo .MPP</Button>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Main Layout ---

const MainApp: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // States for interactive data
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  
  // Modal states
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  
  // Salvar preferência de tema
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K para busca
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
        searchInput?.focus();
      }
      // Ctrl/Cmd + N para nova tarefa (apenas na view de planejamento)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && view === 'PLANNING') {
        e.preventDefault();
        setTaskModalOpen(true);
      }
      // Ctrl/Cmd + D para dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setDarkMode(!darkMode);
      }
      // ESC para fechar modais
      if (e.key === 'Escape') {
        setTaskModalOpen(false);
        setMaterialModalOpen(false);
        setHelpModalOpen(false);
      }
      // ? para abrir ajuda
      if (e.key === '?' && !isTaskModalOpen && !isMaterialModalOpen) {
        e.preventDefault();
        setHelpModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [darkMode, view, isTaskModalOpen, isMaterialModalOpen]);

  const handleLogin = () => setView('PROJECT_SELECT');
  const handleProjectSelect = (p: Project) => {
    setCurrentProject(p);
    setView('DASHBOARD');
  };
  
  const addTask = (task: Task) => {
      setTasks([...tasks, task]);
  };

  const SidebarItem: React.FC<{ icon: any, label: string, target: ViewState }> = ({ icon, label, target }) => (
    <button 
      onClick={() => {
          setView(target);
          setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center px-6 py-4 transition-all border-l-4 ${
        view === target 
            ? 'bg-blue-900 border-blue-400 text-white shadow-lg' 
            : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {React.cloneElement(icon, { size: 22, className: "mr-3" })}
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </button>
  );

  if (view === 'LOGIN') return <LoginView onLogin={handleLogin} />;
  if (view === 'PROJECT_SELECT') return <ProjectSelect onSelect={handleProjectSelect} />;

  // Protected Views Layout with Professional Sidebar
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar - Professional Dark Navy */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
           <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                    <HardHat className="text-white w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-bold text-xl leading-none tracking-tight">Gran Garden</h1>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Resort</p>
                </div>
           </div>
           <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400">
               <X size={24} />
           </button>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          <div className="px-6 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Gestão</div>
          <SidebarItem icon={<LayoutDashboard />} label="Painel Gerencial" target="DASHBOARD" />
          <SidebarItem icon={<CalendarDays />} label="Planejamento" target="PLANNING" />
          <SidebarItem icon={<Package />} label="Materiais & Estoque" target="MATERIALS" />
          
          <div className="px-6 mt-8 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Técnico</div>
          <SidebarItem icon={<FileText />} label="Projetos" target="PROJECTS" />
          <SidebarItem icon={<FolderOpen />} label="Base de Dados" target="DATABASE" />
          <SidebarItem icon={<Box />} label="BIM / IFC" target="BIM_VIEWER" />
          <SidebarItem icon={<Users />} label="Gestão de Equipes" target="PEOPLE" />
          <SidebarItem icon={<AlertOctagon />} label="Lições Aprendidas" target="LESSONS_LEARNED" />
          <SidebarItem icon={<FileBarChart />} label="Relatórios" target="REPORTS" />
        </nav>

        <div className="p-6 border-t border-white/10 bg-slate-900/50">
           <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                  VM
              </div>
              <div>
                  <p className="text-sm font-medium text-white">Engº Vinicius Mores</p>
                  <p className="text-xs text-slate-400">vinicius.mores@gavresorts.com.br</p>
              </div>
           </div>
          <button onClick={() => setView('PROJECT_SELECT')} className="flex items-center text-slate-400 hover:text-white w-full px-2 py-2 text-sm font-medium transition-colors hover:bg-white/5 rounded-lg">
            <LogOut size={18} className="mr-3" /> Sair do Projeto
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 lg:ml-72 min-h-screen transition-all duration-300 ${darkMode ? 'bg-slate-800' : ''}`}>
        <header className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm transition-colors`}>
           <div className="flex items-center">
             <button onClick={() => setMobileMenuOpen(true)} className={`lg:hidden mr-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <Menu size={24} />
             </button>
             <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} hidden sm:block`}>{currentProject?.name}</h2>
           </div>
           
           <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    className={`pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 ${darkMode ? 'text-yellow-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'} rounded-full transition-colors`}
                title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => setHelpModalOpen(true)}
                className={`p-2 ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'} rounded-full transition-colors`}
                title="Ajuda e Atalhos (pressione ?)"
              >
                <HelpCircle size={20} />
              </button>
              <button className={`relative p-2 ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'} rounded-full transition-colors`}>
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
           </div>
        </header>

        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
          {view === 'DASHBOARD' && currentProject && <DashboardView project={currentProject} onChangeView={setView} tasks={tasks} />}
          {view === 'DAILY_LOG' && (
             <DailyLog onCancel={() => setView('DASHBOARD')} onSave={() => {
                alert('Diário Salvo e Sincronizado!');
                setView('DASHBOARD');
             }} />
          )}
          {view === 'PLANNING' && <PlanningView tasks={tasks} onAddTask={() => setTaskModalOpen(true)} />}
          {view === 'MATERIALS' && <MaterialsView materials={materials} onRequestMaterial={() => setMaterialModalOpen(true)} />}
          {view === 'DATABASE' && <DatabaseView />}
          {view === 'BIM_VIEWER' && <BimView />}
          {view === 'LESSONS_LEARNED' && <LessonsLearnedView />}
          {view === 'REPORTS' && <ReportsView tasks={ALL_TASKS} currentProject={currentProject} />}
          {view === 'PROJECTS' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Projetos</h2>
                  <p className="text-slate-500">Gerenciamento de arquivos e documentação técnica</p>
                </div>
              </div>

              {/* Grid de Funcionalidades */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* PDF */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
                      <FileText className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Abrir PDF</h3>
                      <p className="text-xs text-slate-500">Visualizar documentos</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        window.open(url, '_blank');
                      }
                    }}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                  />
                </div>

                {/* OneDrive */}
                <div 
                  onClick={() => window.open('https://onedrive.live.com/', '_blank')}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                      <Database className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">OneDrive</h3>
                      <p className="text-xs text-slate-500">Acessar arquivos</p>
                    </div>
                  </div>
                  <Button variant="outline" fullWidth className="mt-4">
                    <UploadCloud className="mr-2" size={16} /> Abrir OneDrive
                  </Button>
                </div>

                {/* Google Drive */}
                <div 
                  onClick={() => window.open('https://drive.google.com/', '_blank')}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                      <Database className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Google Drive</h3>
                      <p className="text-xs text-slate-500">Acessar arquivos</p>
                    </div>
                  </div>
                  <Button variant="outline" fullWidth className="mt-4">
                    <UploadCloud className="mr-2" size={16} /> Abrir Google Drive
                  </Button>
                </div>

                {/* DWG */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-yellow-200 transition-colors">
                      <FileCode className="text-yellow-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Abrir DWG</h3>
                      <p className="text-xs text-slate-500">Arquivos AutoCAD</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".dwg,.dxf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        alert(`Arquivo ${file.name} selecionado. Abrindo visualizador...`);
                        // Aqui você pode integrar com um visualizador DWG
                      }
                    }}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 cursor-pointer"
                  />
                </div>

                {/* IA - Gerar Lista de Materiais */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow cursor-pointer group md:col-span-2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                      <Layers className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Gerar Lista de Materiais com IA</h3>
                      <p className="text-xs text-slate-500">Análise inteligente de projetos</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.dwg,.dxf,.ifc"
                      id="ai-file-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          alert(`Analisando ${file.name} com IA...\n\nEsta funcionalidade irá:\n- Extrair quantitativos\n- Identificar materiais\n- Gerar lista completa\n- Calcular estimativas`);
                        }
                      }}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                    />
                    <p className="text-xs text-slate-600">
                      Formatos aceitos: PDF, DWG, DXF, IFC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {view === 'PEOPLE' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Gestão de Equipes</h2>
                  <p className="text-slate-500">Gerenciamento de tarefas e responsáveis</p>
                </div>
                <Button size="sm" onClick={() => setTaskModalOpen(true)} icon={<Plus size={16}/>}>
                  Nova Tarefa
                </Button>
              </div>

              {/* Resumo de Equipe */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-500">Total de Tarefas</h3>
                    <ClipboardList className="text-blue-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{tasks.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-500">Em Andamento</h3>
                    <TrendingUp className="text-yellow-600" size={20} />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">
                    {tasks.filter(t => t.status === 'Em Andamento').length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-500">Concluídas</h3>
                    <div className="text-green-600">✓</div>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">
                    {tasks.filter(t => t.status === 'Concluído').length}
                  </p>
                </div>
              </div>

              {/* Lista de Tarefas por Responsável */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800">Tarefas por Responsável</h3>
                </div>
                <div className="divide-y divide-slate-200">
                  {Array.from(new Set(tasks.map(t => t.responsible))).filter(r => r && r !== '-').map(responsible => {
                    const responsibleTasks = tasks.filter(t => t.responsible === responsible);
                    const completed = responsibleTasks.filter(t => t.status === 'Concluído').length;
                    const inProgress = responsibleTasks.filter(t => t.status === 'Em Andamento').length;
                    const pending = responsibleTasks.filter(t => t.status === 'A Fazer').length;
                    const overdue = responsibleTasks.filter(t => t.status === 'Atrasado').length;

                    return (
                      <div key={responsible} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {String(responsible).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{responsible}</h4>
                              <p className="text-sm text-slate-500">
                                {responsibleTasks.length} tarefa{responsibleTasks.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800">
                              {Math.round((completed / responsibleTasks.length) * 100)}%
                            </div>
                            <div className="text-xs text-slate-500">Concluído</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          <div className="bg-green-50 px-3 py-2 rounded-lg">
                            <div className="text-lg font-bold text-green-700">{completed}</div>
                            <div className="text-xs text-green-600">Concluídas</div>
                          </div>
                          <div className="bg-blue-50 px-3 py-2 rounded-lg">
                            <div className="text-lg font-bold text-blue-700">{inProgress}</div>
                            <div className="text-xs text-blue-600">Em Progresso</div>
                          </div>
                          <div className="bg-slate-50 px-3 py-2 rounded-lg">
                            <div className="text-lg font-bold text-slate-700">{pending}</div>
                            <div className="text-xs text-slate-600">Pendentes</div>
                          </div>
                          <div className="bg-red-50 px-3 py-2 rounded-lg">
                            <div className="text-lg font-bold text-red-700">{overdue}</div>
                            <div className="text-xs text-red-600">Atrasadas</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {responsibleTasks.slice(0, 3).map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                  task.status === 'Atrasado' ? 'bg-red-500' : 
                                  task.status === 'Concluído' ? 'bg-green-500' :
                                  task.status === 'A Fazer' ? 'bg-slate-300' :
                                  'bg-blue-500'
                                }`}></span>
                                <span className="text-sm text-slate-700 font-medium truncate">{task.name}</span>
                              </div>
                              <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                                {new Date(task.deadline).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          ))}
                          {responsibleTasks.length > 3 && (
                            <button 
                              onClick={() => setView('PLANNING')}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Ver todas as {responsibleTasks.length} tarefas →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {Array.from(new Set(tasks.map(t => t.responsible))).filter(r => r && r !== '-').length === 0 && (
                    <div className="p-12 text-center">
                      <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg font-medium mb-2">Nenhum responsável definido</p>
                      <p className="text-slate-400 text-sm">Adicione tarefas com responsáveis para visualizar a gestão de equipes</p>
                      <Button className="mt-4" onClick={() => setTaskModalOpen(true)} icon={<Plus size={16}/>}>
                        Criar Primeira Tarefa
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <NewTaskModal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} onSave={addTask} />
      <MaterialRequestModal 
        isOpen={isMaterialModalOpen} 
        onClose={() => setMaterialModalOpen(false)} 
        materials={materials}
        onSuccess={() => {
          // Aqui poderia adicionar um toast notification
          alert("Solicitação gerada! Verifique seu aplicativo de e-mail.");
        }}
      />
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
};

export default MainApp;
