import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Calendar, Users, Cloud, Camera, FileText } from 'lucide-react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface DailyLogProps {
  onSave: () => void;
  onCancel: () => void;
}

export const DailyLog: React.FC<DailyLogProps> = ({ onSave, onCancel }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weather, setWeather] = useState('sunny');
  const [activities, setActivities] = useState('');
  const [team, setTeam] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!activities.trim()) {
      alert('Por favor, descreva as atividades realizadas!');
      return;
    }

    try {
      setSaving(true);
      
      // Salvar no Firebase
      await addDoc(collection(db, 'dailyLogs'), {
        date: date,
        weather: weather,
        activities: activities,
        team: team,
        notes: notes,
        createdAt: Timestamp.now(),
        createdBy: localStorage.getItem('userName') || 'Usuário'
      });

      alert('Diário de obra salvo com sucesso!');
      onSave();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar diário. Verifique se o Firebase está configurado.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Diário de Obra</h2>
        <p className="text-slate-500">Registre as atividades e observações do dia</p>
      </div>

      <div className="space-y-6">
        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Calendar size={18} className="mr-2" /> Data
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Clima */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Cloud size={18} className="mr-2" /> Condições Climáticas
          </label>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="sunny">☀️ Ensolarado</option>
            <option value="cloudy">☁️ Nublado</option>
            <option value="rainy">🌧️ Chuvoso</option>
            <option value="storm">⛈️ Tempestade</option>
          </select>
        </div>

        {/* Equipe */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Users size={18} className="mr-2" /> Equipe Presente
          </label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Selecione a equipe...</option>
            <option value="Caio Rosa">👷 Caio Rosa (Blocos A1, A2, A3, A4)</option>
            <option value="Daniel Hubner">👷 Daniel Hubner (Blocos B1, B2, B3, B4)</option>
            <option value="Lucas Zotti">👷 Lucas Zotti (Blocos C1, C2, C3, C4)</option>
            <option value="Tatiana Dallacosta">👷 Tatiana Dallacosta (Lazer e Áreas Comuns)</option>
            <option value="Junior Brombatti">👷 Junior Brombatti (Recepção e Infraestrutura)</option>
            <option value="Equipe Completa">👥 Equipe Completa (Todos os Blocos)</option>
          </select>
        </div>

        {/* Atividades */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <FileText size={18} className="mr-2" /> Atividades Executadas
          </label>
          <textarea
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            placeholder="Descreva as principais atividades realizadas no dia..."
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <FileText size={18} className="mr-2" /> Observações e Pendências
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anote observações importantes, problemas encontrados, pendências..."
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Fotos */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Camera size={18} className="mr-2" /> Fotos do Dia
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <Camera size={48} className="mx-auto text-slate-400 mb-2" />
            <p className="text-slate-500 text-sm">Clique para adicionar fotos</p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={onCancel} fullWidth disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} fullWidth disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Diário'}
          </Button>
        </div>
      </div>
    </div>
  );
};
