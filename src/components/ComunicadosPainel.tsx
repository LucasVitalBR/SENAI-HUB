import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Info,
  Calendar,
  Layers,
  Archive
} from 'lucide-react';
import { UserProfile, NoticeItem } from '../types';
import { NOTICES_DATA } from '../data';

interface ComunicadosPainelProps {
  currentUserProfile: UserProfile;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export default function ComunicadosPainel({ currentUserProfile, onShowToast }: ComunicadosPainelProps) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'high' | 'normal'>('all');
  
  const isManagement = currentUserProfile.role === 'Coordenador' || currentUserProfile.role === 'Administrador';

  // Campos de criação
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState<'high' | 'normal'>('normal');
  const [content, setContent] = useState('');

  // Comunicados reativos iniciados com NOTICES_DATA
  const [notices, setNotices] = useState<NoticeItem[]>(NOTICES_DATA);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManagement) {
      onShowToast('Apenas coordenadores e administradores podem publicar comunicados oficiais.', 'warning');
      return;
    }
    if (!title.trim() || !content.trim()) {
      onShowToast('Por favor, preencha o título e o conteúdo do comunicado.', 'warning');
      return;
    }

    const newNotice: NoticeItem = {
      id: Math.random(),
      title: title,
      content: content,
      urgency: urgency,
      time: 'Agora mesmo',
      author: currentUserProfile.name
    };

    setNotices((prev) => [newNotice, ...prev]);
    onShowToast('Novo comunicado oficial publicado no mural do SENAI Naviraí!', 'success');
    
    // Limpar campos
    setTitle('');
    setContent('');
    setShowForm(false);
  };

  const handleDeleteNotice = (id: number, title: string) => {
    if (!isManagement) {
      onShowToast('Você não tem permissão para remover comunicados oficiais.', 'warning');
      return;
    }
    setNotices((prev) => prev.filter(n => n.id !== id));
    onShowToast(`Comunicado "${title.slice(0, 20)}..." removido do mural.`, 'info');
  };

  const filteredNotices = notices.filter((notice) => {
    // Filtro de Urgência
    if (urgencyFilter !== 'all' && notice.urgency !== urgencyFilter) return false;

    // Filtro de Busca por texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = notice.title.toLowerCase().includes(term);
      const matchContent = notice.content.toLowerCase().includes(term);
      if (!matchTitle && !matchContent) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 fade-in" id="comunicados-painel-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight font-sans">Mural de Comunicados</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mural integrado de avisos pedagógicos, administrativos e eventos do SENAI Naviraí.
          </p>
        </div>

        {isManagement && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Plus size={16} />
            <span>Criar Comunicado</span>
          </button>
        )}
      </div>

      {/* Formulário de Criação de Comunicado */}
      {showForm && (
        <div className="card p-6 border-blue-200 dark:border-blue-900/40 bg-blue-50/10 dark:bg-blue-950/5 animate-fade-in" id="form-criar-comunicado">
          <h2 className="text-base font-bold font-sans mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Megaphone className="text-blue-500" size={18} />
            Publicar Novo Aviso Oficial
          </h2>

          <form onSubmit={handleCreateNotice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Título do Comunicado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Entrega de Notas Bimestrais"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Grau de Urgência</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                >
                  <option value="normal">Normal (Aviso Geral)</option>
                  <option value="high">Alta (Ação Requerida/Crítico)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Conteúdo do Aviso</label>
              <textarea
                required
                rows={5}
                placeholder="Insira as informações detalhadas que os professores e colaboradores devem ter ciência..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-150 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-250 dark:border-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-sm"
              >
                Publicar Comunicado
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Painel de Filtros */}
      <div className="card p-4" id="filtros-comunicados">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={14} />
            </span>
            <input 
              type="text"
              placeholder="Buscar por palavras-chave nos avisos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Urgência:</span>
            <button
              onClick={() => setUrgencyFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                urgencyFilter === 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setUrgencyFilter('high')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                urgencyFilter === 'high'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Alta
            </button>
            <button
              onClick={() => setUrgencyFilter('normal')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                urgencyFilter === 'normal'
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Normal
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Comunicados Mural */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Lista de Comunicados */}
        <div className="lg:col-span-2 space-y-4">
          {filteredNotices.length > 0 ? (
            <div className="space-y-4">
              {filteredNotices.map((notice) => {
                const isHigh = notice.urgency === 'high';
                return (
                  <div 
                    key={notice.id} 
                    className={`card p-6 border-l-4 transition-all hover:shadow-md ${
                      isHigh ? 'border-l-red-500' : 'border-l-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans leading-snug">
                          {notice.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          <Clock size={11} />
                          <span>{notice.time}</span>
                          <span>•</span>
                          <span>Autor: {notice.author || 'Coordenação Naviraí'}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                        isHigh 
                          ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40' 
                          : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40'
                      }`}>
                        {notice.urgency === 'high' ? 'Crítico' : 'Normal'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-50 dark:border-slate-850">
                      {notice.content}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 dark:text-slate-500">Mural SENAI Hub</span>
                      
                      {isManagement && (
                        <button
                          onClick={() => handleDeleteNotice(notice.id, notice.title)}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center gap-1"
                          title="Remover Comunicado"
                        >
                          <Trash2 size={13} />
                          <span className="text-[10px]">Remover</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-12 text-center flex flex-col items-center justify-center">
              <Megaphone size={40} className="text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nenhum comunicado encontrado.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Refine seus filtros de busca ou crie um novo aviso oficial.</p>
            </div>
          )}
        </div>

        {/* Lado Direito: Quadro de Informações do Mural */}
        <div className="space-y-4">
          <div className="card p-5" id="card-aviso-permanente">
            <h2 className="text-sm font-bold font-sans mb-3 flex items-center gap-1.5">
              <Calendar className="text-blue-500" size={16} />
              Calendário Acadêmico Jul/2026
            </h2>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">15/07 - Meio de Período</strong>
                  <span>Conselho de classe intermediário e fechamento parcial dos diários.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">22/07 - Encontro de Docentes</strong>
                  <span>Reunião pedagógica de alinhamento com a diretoria técnica.</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">28/07 - Feira de Tecnologia</strong>
                  <span>Exposição dos Projetos Integradores das turmas de IoT e Automação no Pátio Central.</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Info size={12} className="text-slate-400" />
              Regras do Mural
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Todos os comunicados aqui inseridos são visíveis de imediato para a equipe técnica e diretoria de Naviraí. Use com responsabilidade e evite linguajar informal.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
