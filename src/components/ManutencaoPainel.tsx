import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Hammer, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';

interface ManutencaoPainelProps {
  currentUserProfile: UserProfile;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

interface OrdemServico {
  id: string;
  local: string;
  equipamento: string;
  urgencia: 'baixa' | 'media' | 'alta';
  descricao: string;
  status: 'pendente' | 'analise' | 'andamento' | 'concluido';
  solicitante: string;
  dataAbertura: string;
  comentarioTecnico?: string;
}

export default function ManutencaoPainel({ currentUserProfile, onShowToast }: ManutencaoPainelProps) {
  const [showOSForm, setShowOSForm] = useState(false);
  const [local, setLocal] = useState('Laboratório Maker');
  const [equipamento, setEquipamento] = useState('');
  const [urgencia, setUrgencia] = useState<'baixa' | 'media' | 'alta'>('media');
  const [descricao, setDescricao] = useState('');

  // Ordens de Serviço simuladas
  const [ordens, setOrdens] = useState<OrdemServico[]>([
    {
      id: 'os-1',
      local: 'Laboratório Maker',
      equipamento: 'Impressora 3D Cloner 2 (Extrusora Entupida)',
      urgencia: 'media',
      descricao: 'A extrusora está apresentando travamentos durante a alimentação de filamento PLA, inviabilizando impressões de projetos integradores.',
      status: 'andamento',
      solicitante: 'Lucas Vital',
      dataAbertura: '14/07/2026',
      comentarioTecnico: 'Marcos Aurélio: Peça de reposição solicitada na secretaria com Eliane.'
    },
    {
      id: 'os-2',
      local: 'Laboratório de Elétrica',
      equipamento: 'Ar Condicionado Split 24000BTUs',
      urgencia: 'alta',
      descricao: 'O equipamento está vazando bastante água na parede interna e não está refrigerando adequadamente o ambiente, provocando desconforto térmico.',
      status: 'analise',
      solicitante: 'Ederson Ivan Cardoso',
      dataAbertura: '15/07/2026'
    }
  ]);

  const [updatingOsId, setUpdatingOsId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [statusInput, setStatusInput] = useState<'pendente' | 'analise' | 'andamento' | 'concluido'>('andamento');

  const isTechnician = currentUserProfile.role === 'Manutenção' || currentUserProfile.role === 'Administrador';

  const handleCreateOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipamento.trim() || !descricao.trim()) {
      onShowToast('Por favor, preencha o equipamento e o problema apresentado.', 'warning');
      return;
    }

    const novaOS: OrdemServico = {
      id: `os-${Math.random().toString().slice(2, 6)}`,
      local: local,
      equipamento: equipamento,
      urgencia: urgencia,
      descricao: descricao,
      status: 'pendente',
      solicitante: currentUserProfile.name,
      dataAbertura: '15/07/2026'
    };

    setOrdens(prev => [novaOS, ...prev]);
    onShowToast(`Ordem de serviço para "${equipamento}" aberta sob o número #${novaOS.id}!`, 'success');

    // Limpar formulário
    setEquipamento('');
    setDescricao('');
    setShowOSForm(false);
  };

  const handleCancelOS = (id: string, equipamento: string) => {
    setOrdens(prev => prev.filter(o => o.id !== id));
    onShowToast(`Ordem de serviço #${id} foi removida da lista.`, 'info');
  };

  const handleStartUpdateOS = (os: OrdemServico) => {
    setUpdatingOsId(os.id);
    setStatusInput(os.status);
    setCommentInput(os.comentarioTecnico ? os.comentarioTecnico.replace(`${currentUserProfile.name}: `, '') : '');
  };

  const handleSaveOSUpdate = (id: string) => {
    setOrdens(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status: statusInput,
          comentarioTecnico: commentInput.trim() ? `${currentUserProfile.name}: ${commentInput.trim()}` : undefined
        };
      }
      return o;
    }));
    setUpdatingOsId(null);
    onShowToast(`Ordem de serviço #${id} atualizada com sucesso pela equipe técnica!`, 'success');
  };

  return (
    <div className="space-y-6 fade-in" id="manutencao-painel-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight font-sans">Manutenção e TI</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Abra ordens de serviço para conserto de computadores, calibragem de máquinas e reparos de infraestrutura da unidade.
          </p>
        </div>

        <button
          onClick={() => setShowOSForm(!showOSForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus size={16} />
          <span>Abrir Ordem de Serviço</span>
        </button>
      </div>

      {/* Formulário de Abertura de OS */}
      {showOSForm && (
        <div className="card p-6 border-blue-200 dark:border-blue-900/40 bg-blue-50/10 dark:bg-blue-950/5 animate-fade-in" id="form-abrir-os">
          <h2 className="text-base font-bold font-sans mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wrench className="text-blue-500" size={18} />
            Formulário de Solicitação de Assistência Técnica (OS)
          </h2>

          <form onSubmit={handleCreateOS} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Local / Ambiente</label>
              <select
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                <option value="Laboratório Maker">Laboratório Maker</option>
                <option value="Laboratório de Eletricidade">Laboratório de Eletricidade</option>
                <option value="Laboratório CAD">Laboratório CAD</option>
                <option value="Oficina de Metalmecânica">Oficina de Metalmecânica</option>
                <option value="Sala de Aula Teórica 01 a 05">Salas de Aula Teóricas</option>
                <option value="Biblioteca / Auditório">Biblioteca / Auditório</option>
                <option value="Área de Convivência / Pátio">Área de Convivência / Pátio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Equipamento ou Infraestrutura</label>
              <input
                type="text"
                required
                placeholder="Ex: Projetor Epson / Bancada 3"
                value={equipamento}
                onChange={(e) => setEquipamento(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Severidade / Urgência</label>
              <select
                value={urgencia}
                onChange={(e) => setUrgencia(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                <option value="baixa">Baixa (Não interrompe aula)</option>
                <option value="media">Média (Atrapalha andamento de projetos)</option>
                <option value="alta">Alta / Crítica (Interrompe ou impossibilita aulas)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Descrição do Defeito / Solicitação de Conserto</label>
              <textarea
                required
                rows={4}
                placeholder="Detalhe o defeito apresentado para que a equipe de TI e infraestrutura de Naviraí possa providenciar as ferramentas e peças necessárias..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOSForm(false)}
                className="px-4 py-2 bg-slate-150 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-250 dark:border-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-sm"
              >
                Registrar Ordem de Serviço
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid: Lista de OSs Ativas & Quadro Geral de Manutenção */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Lista de Ordens de Serviço */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6" id="card-os-list">
            <h2 className="text-base font-bold font-sans mb-4 flex items-center gap-2">
              <Hammer size={16} className="text-blue-500" />
              Ordens de Serviço Ativas
            </h2>

            <div className="space-y-4">
              {ordens.map((os) => {
                const isAlta = os.urgencia === 'alta';
                const isMedia = os.urgencia === 'media';
                
                return (
                  <div 
                    key={os.id} 
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 space-y-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            {os.equipamento}
                          </span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono font-bold px-1.5 py-0.5 rounded">
                            #{os.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Local: <strong>{os.local}</strong> • Aberta por {os.solicitante} em {os.dataAbertura}
                        </p>
                      </div>

                      {/* Status badge */}
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                        os.status === 'pendente' 
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/20' 
                          : os.status === 'analise'
                            ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/20'
                            : os.status === 'andamento'
                              ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/20'
                              : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/20'
                      }`}>
                        {os.status === 'pendente' ? 'Pendente' : os.status === 'analise' ? 'Em análise' : os.status === 'andamento' ? 'Em conserto' : 'Concluído'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100/60 dark:border-slate-800/60">
                      {os.descricao}
                    </p>

                    {os.comentarioTecnico && (
                      <div className="p-2.5 rounded-lg bg-blue-50/40 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-800 dark:text-blue-300 font-medium">
                        {os.comentarioTecnico}
                      </div>
                    )}

                    {updatingOsId === os.id ? (
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3 animate-fade-in text-xs">
                        <p className="font-bold text-slate-700 dark:text-slate-350">Painel de Atualização Técnica</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Status da Manutenção</label>
                            <select
                              value={statusInput}
                              onChange={(e) => setStatusInput(e.target.value as any)}
                              className="w-full text-xs px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded focus:outline-none"
                            >
                              <option value="pendente">Pendente</option>
                              <option value="analise">Em análise</option>
                              <option value="andamento">Em conserto</option>
                              <option value="concluido">Concluído</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Responsável Técnico</label>
                            <input
                              type="text"
                              disabled
                              value={currentUserProfile.name}
                              className="w-full text-xs px-2 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-250 dark:border-slate-700 rounded cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Parecer / Comentário Técnico</label>
                          <textarea
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            rows={2}
                            placeholder="Descreva as ações tomadas..."
                            className="w-full text-xs px-2 py-1 bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded focus:outline-none"
                          />
                        </div>

                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setUpdatingOsId(null)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveOSUpdate(os.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                          >
                            Salvar Atualização
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                          isAlta ? 'text-red-500' : isMedia ? 'text-amber-500' : 'text-slate-400'
                        }`}>
                          <AlertOctagon size={11} />
                          Prioridade {os.urgencia}
                        </span>

                        <div className="flex items-center gap-2">
                          {isTechnician && (
                            <button
                              onClick={() => handleStartUpdateOS(os)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all"
                            >
                              Atualizar Status
                            </button>
                          )}

                          {os.status === 'pendente' && (
                            <button
                              onClick={() => handleCancelOS(os.id, os.equipamento)}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Direito: Notas & SLA da TI */}
        <div className="space-y-4">
          <div className="card p-5" id="card-sla">
            <h2 className="text-sm font-bold font-sans mb-3 flex items-center gap-1.5">
              <Clock className="text-blue-500" size={16} />
              Acordo de Serviço (SLA)
            </h2>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>O tempo de resposta para chamados técnicos de infraestrutura segue o seguinte protocolo de gravidade:</p>
              
              <ul className="space-y-2 pt-2">
                <li className="flex justify-between items-center bg-red-50/20 dark:bg-red-950/10 p-2 rounded border border-red-100/30 dark:border-red-900/20">
                  <span className="font-semibold text-red-600 dark:text-red-400">Gravidade Alta</span>
                  <span className="font-mono">Até 2h úteis</span>
                </li>
                <li className="flex justify-between items-center bg-amber-50/20 dark:bg-amber-950/10 p-2 rounded border border-amber-100/30 dark:border-amber-900/20">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Gravidade Média</span>
                  <span className="font-mono">Até 24h úteis</span>
                </li>
                <li className="flex justify-between items-center bg-slate-50/40 dark:bg-slate-900/40 p-2 rounded border border-slate-100/30 dark:border-slate-800/20">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Gravidade Baixa</span>
                  <span className="font-mono">Até 48h úteis</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber-500" />
              Equipe de Plantão TI Naviraí
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              O plantonista Robson Santos está disponível no ramal 4505 das 13:00 às 22:30 para emergências críticas em computadores ou projetores de aula.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
