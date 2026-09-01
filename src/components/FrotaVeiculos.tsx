import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Trash2,
  AlertTriangle,
  Info,
  ChevronRight,
  Gauge,
  Fuel
} from 'lucide-react';
import { UserProfile } from '../types';

interface FrotaVeiculosProps {
  currentUserProfile: UserProfile;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

interface VeiculoItem {
  id: string;
  modelo: string;
  placa: string;
  km: string;
  combustivel: string; // ex: Gasolina
  status: 'disponivel' | 'viagem' | 'manutencao';
  responsavel: string;
  ultimaRevisao: string;
  proximaRevisao: string;
}

interface ViagemAgendada {
  id: string;
  veiculoId: string;
  veiculoModelo: string;
  veiculoPlaca: string;
  destino: string;
  finalidade: string;
  dataSaida: string;
  horaSaida: string;
  retornoEstimado: string;
  motorista: string;
  passageiros: string;
  status: 'Aprovada' | 'Pendente';
}

export default function FrotaVeiculos({ currentUserProfile, onShowToast }: FrotaVeiculosProps) {
  const [showAgendarForm, setShowAgendarForm] = useState(false);
  const [selectedVeiculoId, setSelectedVeiculoId] = useState('v-1');
  const [destino, setDestino] = useState('');
  const [finalidade, setFinalidade] = useState('Visita Técnica Comercial');
  const [dataSaida, setDataSaida] = useState('2026-07-16');
  const [horaSaida, setHoraSaida] = useState('08:00');
  const [retornoEstimado, setRetornoEstimado] = useState('17:00');
  const [passageiros, setPassageiros] = useState('');

  // States for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKm, setEditKm] = useState('');
  const [editUltima, setEditUltima] = useState('');
  const [editProxima, setEditProxima] = useState('');

  // Veículos oficiais da Unidade Naviraí (Todos de 2015, Movidos a Gasolina)
  const [veiculos, setVeiculos] = useState<VeiculoItem[]>([
    { 
      id: 'v-1', 
      modelo: 'Toyota Hilux CD 4x4 (2015)', 
      placa: 'HQO-4590', 
      km: '142.850 km', 
      combustivel: 'Gasolina', 
      status: 'disponivel', 
      responsavel: 'Livre',
      ultimaRevisao: '12/01/2026',
      proximaRevisao: '12/07/2026'
    },
    { 
      id: 'v-2', 
      modelo: 'Toyota Etios Hatch (2015)', 
      placa: 'OOR-8921', 
      km: '88.120 km', 
      combustivel: 'Gasolina', 
      status: 'disponivel', 
      responsavel: 'Livre',
      ultimaRevisao: '15/02/2026',
      proximaRevisao: '15/08/2026'
    },
    { 
      id: 'v-3', 
      modelo: 'Fiat Fiorino (2015)', 
      placa: 'NRF-1104', 
      km: '115.400 km', 
      combustivel: 'Gasolina', 
      status: 'disponivel', 
      responsavel: 'Livre',
      ultimaRevisao: '22/03/2026',
      proximaRevisao: '22/09/2026'
    },
  ]);

  // Viagens agendadas de forma dinâmica
  const [viagens, setViagens] = useState<ViagemAgendada[]>([
    {
      id: 'g-1',
      veiculoId: 'v-2',
      veiculoModelo: 'Toyota Etios Hatch (2015)',
      veiculoPlaca: 'OOR-8921',
      destino: 'Usina Rio Amambai - Naviraí/MS',
      finalidade: 'Acompanhamento Pedagógico',
      dataSaida: '2026-07-15',
      horaSaida: '13:00',
      retornoEstimado: '18:00',
      motorista: 'Lucas Vital',
      passageiros: 'Jaqueline Sant\'Anna (Coord. Pedagógica)',
      status: 'Aprovada'
    },
    {
      id: 'g-2',
      veiculoId: 'v-3',
      veiculoModelo: 'Fiat Fiorino (2015)',
      veiculoPlaca: 'NRF-1104',
      destino: 'Copasul Sede - Naviraí/MS',
      finalidade: 'Coleta de Materiais de Aprendizagem',
      dataSaida: '2026-07-17',
      horaSaida: '08:30',
      retornoEstimado: '11:30',
      motorista: 'Vilson Rodrigues',
      passageiros: 'Rosemilda (Apoio)',
      status: 'Pendente'
    }
  ]);

  const isManagement = currentUserProfile.role === 'Administrador' || currentUserProfile.role === 'Coordenador';
  const isReadOnly = currentUserProfile.role === 'Estagiário' || currentUserProfile.role === 'Manutenção';

  const handleSaveEdit = (id: string) => {
    if (!editKm.trim()) {
      onShowToast('A quilometragem não pode estar vazia.', 'warning');
      return;
    }
    setVeiculos(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          km: editKm.toLowerCase().includes('km') ? editKm : `${editKm} km`,
          ultimaRevisao: editUltima,
          proximaRevisao: editProxima
        };
      }
      return v;
    }));
    setEditingId(null);
    onShowToast('Dados do veículo atualizados!', 'success');
  };

  const startEditing = (v: VeiculoItem) => {
    setEditingId(v.id);
    setEditKm(v.km);
    setEditUltima(v.ultimaRevisao);
    setEditProxima(v.proximaRevisao);
  };

  const handleCreateAgendamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      onShowToast(`Perfil de ${currentUserProfile.role} não possui permissão para solicitar veículos.`, 'warning');
      return;
    }

    if (!destino.trim()) {
      onShowToast('Informe o destino da viagem.', 'warning');
      return;
    }

    const veiculo = veiculos.find(v => v.id === selectedVeiculoId);
    if (!veiculo) return;

    if (veiculo.status === 'manutencao') {
      onShowToast('Este veículo está indisponível por estar em manutenção.', 'warning');
      return;
    }

    if (veiculo.status === 'viagem') {
      onShowToast('Este veículo já está alocado em outra viagem no momento.', 'warning');
      return;
    }

    // Criar nova viagem - Auto-aprovada se for gestão, senão Pendente
    const autoApprove = isManagement;
    const novaViagem: ViagemAgendada = {
      id: Math.random().toString(),
      veiculoId: veiculo.id,
      veiculoModelo: veiculo.modelo.split(' (')[0],
      veiculoPlaca: veiculo.placa,
      destino: destino,
      finalidade: finalidade,
      dataSaida: dataSaida,
      horaSaida: horaSaida,
      retornoEstimado: retornoEstimado,
      motorista: currentUserProfile.name,
      passageiros: passageiros || 'Nenhum passageiro',
      status: autoApprove ? 'Aprovada' : 'Pendente'
    };

    if (autoApprove) {
      // Marcar veículo como indisponível/viagem imediatamente
      setVeiculos(prev => prev.map(v => v.id === veiculo.id ? { ...v, status: 'viagem', responsavel: currentUserProfile.name } : v));
      onShowToast(`Reserva do veículo aprovada instantaneamente para "${destino}"!`, 'success');
    } else {
      onShowToast(`Solicitação enviada! Aguardando aprovação da Coordenação para liberar o veículo.`, 'info');
    }

    setViagens(prev => [novaViagem, ...prev]);

    // Limpar formulário
    setDestino('');
    setPassageiros('');
    setShowAgendarForm(false);
  };

  const handleApproveViagem = (id: string, approve: boolean) => {
    setViagens(prev => prev.map(v => {
      if (v.id === id) {
        if (approve) {
          // Ativar viagem e mudar veículo
          setVeiculos(prevVeh => prevVeh.map(veh => veh.id === v.veiculoId ? { ...veh, status: 'viagem', responsavel: v.motorista } : veh));
        }
        return { ...v, status: approve ? 'Aprovada' : 'Recusada' };
      }
      return v;
    }));
    onShowToast(approve ? 'Solicitação de viagem aprovada! Veículo alocado.' : 'Solicitação de viagem recusada.', approve ? 'success' : 'warning');
  };

  const handleCancelViagem = (viagemId: string, veiculoId: string, destino: string) => {
    // Remover viagem
    setViagens(prev => prev.filter(v => v.id !== viagemId));
    // Restaurar veículo para disponível
    setVeiculos(prev => prev.map(v => v.id === veiculoId ? { ...v, status: 'disponivel', responsavel: 'Livre' } : v));
    onShowToast(`Agendamento de viagem para "${destino}" cancelado com sucesso.`, 'info');
  };

  return (
    <div className="space-y-6 fade-in" id="frota-veiculos-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">Gerenciamento da Frota</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reserva de veículos corporativos para visitas técnicas, eventos ou serviços externos da unidade.
          </p>
        </div>

        {isReadOnly ? (
          <div className="text-[11px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-3 py-2 rounded-xl">
            Somente leitura para perfil <strong>{currentUserProfile.role}</strong>
          </div>
        ) : (
          <button
            onClick={() => setShowAgendarForm(!showAgendarForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Plus size={16} />
            <span>Solicitar Veículo</span>
          </button>
        )}
      </div>

      {/* Formulário de Agendamento */}
      {showAgendarForm && !isReadOnly && (
        <div className="card p-6 border-blue-200 dark:border-blue-900/40 bg-blue-50/10 dark:bg-blue-950/5 animate-fade-in" id="form-agendar-veiculo">
          <h2 className="text-base font-bold font-sans mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Truck className="text-blue-500" size={18} />
            Nova Requisição de Veículo Oficial
          </h2>

          <form onSubmit={handleCreateAgendamento} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Selecionar Veículo Disponível</label>
              <select
                value={selectedVeiculoId}
                onChange={(e) => setSelectedVeiculoId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                {veiculos.map(v => (
                  <option key={v.id} value={v.id} disabled={v.status === 'manutencao'}>
                    {v.modelo} - Placa {v.placa} ({v.status === 'manutencao' ? 'Indisponível' : 'Ativo'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Destino Final</label>
              <input
                type="text"
                required
                placeholder="Ex: Fazenda Copasul - Naviraí/MS"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Finalidade da Viagem</label>
              <select
                value={finalidade}
                onChange={(e) => setFinalidade(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                <option value="Visita Técnica Comercial">Visita Técnica Comercial</option>
                <option value="Acompanhamento Pedagógico">Acompanhamento Pedagógico (Estágios/Aprendizes)</option>
                <option value="Suporte Técnico Externo">Suporte Técnico Externo</option>
                <option value="Administrativo / Logística">Administrativo / Logística</option>
                <option value="Captação de Matrículas / Divulgação">Captação de Matrículas / Divulgação</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Data da Viagem</label>
              <input
                type="date"
                required
                value={dataSaida}
                onChange={(e) => setDataSaida(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Horário de Saída</label>
              <input
                type="time"
                required
                value={horaSaida}
                onChange={(e) => setHoraSaida(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Previsão de Retorno</label>
              <input
                type="time"
                required
                value={retornoEstimado}
                onChange={(e) => setRetornoEstimado(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Passageiros Acompanhantes (Nomes)</label>
              <input
                type="text"
                placeholder="Ex: Géssica Oliveira, Marcio Santos"
                value={passageiros}
                onChange={(e) => setPassageiros(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAgendarForm(false)}
                className="px-4 py-2 bg-slate-150 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-250 dark:border-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-sm"
              >
                Agendar Veículo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid: Veículos da Frota & Agendamentos Ativos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Lista de Veículos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6" id="card-veiculos-list">
            <h2 className="text-base font-bold font-sans mb-4 flex items-center gap-2">
              <Truck size={16} className="text-blue-500" />
              Estado Atual dos Veículos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {veiculos.map((v) => {
                const isDisponivel = v.status === 'disponivel';
                const isViagem = v.status === 'viagem';
                const isEditing = editingId === v.id;
                return (
                  <div 
                    key={v.id} 
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[170px]" title={v.modelo}>
                          {v.modelo}
                        </span>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {v.placa}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          <div>
                            <label className="block text-[9px] font-semibold text-slate-500 uppercase">Quilometragem (KM)</label>
                            <input 
                              type="text" 
                              value={editKm} 
                              onChange={(e) => setEditKm(e.target.value)}
                              className="w-full text-xs px-2 py-1 border border-slate-200 dark:border-slate-850 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-100" 
                              placeholder="Ex: 115.400 km"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-semibold text-slate-500 uppercase">Última Revisão</label>
                            <input 
                              type="text" 
                              value={editUltima} 
                              onChange={(e) => setEditUltima(e.target.value)}
                              className="w-full text-xs px-2 py-1 border border-slate-200 dark:border-slate-850 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-100" 
                              placeholder="Ex: 22/03/2026"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-semibold text-slate-500 uppercase">Próxima Revisão</label>
                            <input 
                              type="text" 
                              value={editProxima} 
                              onChange={(e) => setEditProxima(e.target.value)}
                              className="w-full text-xs px-2 py-1 border border-slate-200 dark:border-slate-850 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-100" 
                              placeholder="Ex: 22/09/2026"
                            />
                          </div>
                          <div className="flex gap-1 justify-end pt-1">
                            <button 
                              type="button" 
                              onClick={() => setEditingId(null)}
                              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                            >
                              Cancelar
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleSaveEdit(v.id)}
                              className="px-2 py-0.5 bg-blue-600 text-[10px] text-white rounded hover:bg-blue-700"
                            >
                              Salvar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 bg-white/40 dark:bg-slate-900/10 p-2 rounded-lg border border-slate-100/50 dark:border-slate-850/50">
                          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-medium">
                              <Gauge size={11} className="text-blue-500 shrink-0" /> {v.km}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Fuel size={11} className="text-orange-500 shrink-0" /> {v.combustivel}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-450 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-850/50">
                            <div>
                              <span className="block text-[8px] uppercase font-semibold text-slate-400">Última Revisão</span>
                              <span className="font-mono text-slate-700 dark:text-slate-300">{v.ultimaRevisao}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase font-semibold text-slate-400">Próxima Revisão</span>
                              <span className="font-mono text-slate-700 dark:text-slate-300">{v.proximaRevisao}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {isViagem ? `Com: ${v.responsavel}` : isDisponivel ? 'Disponível' : 'Oficina'}
                        </span>
                        {!isEditing && (
                          <button 
                            type="button" 
                            onClick={() => startEditing(v)}
                            className="text-[9px] text-blue-500 hover:underline text-left mt-0.5 font-semibold"
                          >
                            Editar odômetro/revisão
                          </button>
                        )}
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        isDisponivel 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' 
                          : isViagem 
                            ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40'
                            : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40'
                      }`}>
                        {v.status === 'disponivel' ? 'Livre' : v.status === 'viagem' ? 'Em viagem' : 'Manutenção'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Direito: Aprovações e Próximas Viagens */}
        <div className="space-y-4">
          
          {/* Painel de Aprovação de Viagens de Gestão */}
          {isManagement && (
            <div className="card p-5 border-amber-200 dark:border-amber-900/40 bg-amber-50/5" id="card-gestao-viagens-aprovacao">
              <h2 className="text-sm font-bold font-sans mb-3 text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                Gestão de Viagens Pendentes
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4">
                Como <strong>{currentUserProfile.role}</strong>, aprove as requisições de deslocamento externo da unidade.
              </p>

              {viagens.filter(v => v.status === 'Pendente').length > 0 ? (
                <div className="space-y-3">
                  {viagens.filter(v => v.status === 'Pendente').map((viagem) => (
                    <div key={viagem.id} className="p-3 rounded-lg border border-amber-200/60 dark:border-amber-900/30 bg-amber-500/5 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{viagem.destino}</h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                            Veículo: {viagem.veiculoModelo} ({viagem.veiculoPlaca})
                          </p>
                        </div>
                        <span className="text-[8px] bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                          Pendente
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5 bg-white/50 dark:bg-slate-900/50 p-2 rounded">
                        <p>Motorista: <strong className="text-slate-700 dark:text-slate-300">{viagem.motorista}</strong></p>
                        <p>Finalidade: <span>{viagem.finalidade}</span></p>
                        <p>Partida: <span>{viagem.dataSaida} às {viagem.horaSaida}h</span></p>
                        <p>Passageiros: <span>{viagem.passageiros}</span></p>
                      </div>

                      <div className="flex gap-1.5 justify-end pt-1">
                        <button
                          onClick={() => handleApproveViagem(viagem.id, false)}
                          className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-600 dark:text-slate-300 hover:text-red-600 text-[10px] font-semibold rounded"
                        >
                          Recusar
                        </button>
                        <button
                          onClick={() => handleApproveViagem(viagem.id, true)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold rounded shadow-sm"
                        >
                          Aprovar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-[11px]">
                  Nenhuma requisição de viagem pendente.
                </div>
              )}
            </div>
          )}

          {/* Próximas Viagens Agendadas */}
          <div className="card p-5" id="card-viagens-agendas">
            <h2 className="text-sm font-bold font-sans mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="text-blue-500" size={16} />
              {isManagement ? "Todas as Viagens da Unidade" : "Minhas Reservas de Viagem"}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3 leading-tight">
              {isManagement 
                ? "Visão geral das saídas autorizadas de veículos oficiais hoje e nos próximos dias."
                : `Exibindo somente viagens em que você (${currentUserProfile.name}) é o condutor.`
              }
            </p>

            {viagens.filter(v => isManagement || v.motorista === currentUserProfile.name).length > 0 ? (
              <div className="space-y-3">
                {viagens
                  .filter(v => isManagement || v.motorista === currentUserProfile.name)
                  .map((viagem) => {
                    const isOwn = viagem.motorista === currentUserProfile.name;
                    return (
                      <div key={viagem.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-xs space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-tight">{viagem.destino}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                              {viagem.veiculoModelo} ({viagem.veiculoPlaca})
                            </p>
                          </div>

                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 border ${
                            viagem.status === 'Aprovada'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200'
                              : viagem.status === 'Pendente'
                                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200'
                                : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200'
                          }`}>
                            {viagem.status}
                          </span>
                        </div>

                        <div className="space-y-1 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg text-[11px] text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-slate-400" />
                            <span>Partida: {viagem.dataSaida} às {viagem.horaSaida}h</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={11} className="text-slate-400" />
                            <span>Previsão Retorno: {viagem.retornoEstimado}h</span>
                          </div>
                          {viagem.passageiros && (
                            <div className="flex items-start gap-1.5">
                              <Users size={11} className="text-slate-400 mt-0.5" />
                              <span className="truncate max-w-[170px]" title={viagem.passageiros}>Com: {viagem.passageiros}</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-50 dark:border-slate-850/60 text-[11px] flex items-center justify-between">
                          <span className="text-slate-500">Motorista: <strong className="text-slate-700 dark:text-slate-350">{viagem.motorista} {isOwn && "(Você)"}</strong></span>
                          {(isManagement || isOwn) && (
                            <button
                              onClick={() => handleCancelViagem(viagem.id, viagem.veiculoId, viagem.destino)}
                              title="Cancelar Reserva de Viagem"
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <Info size={24} className="mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-xs">Nenhum veículo reservado no momento.</p>
              </div>
            )}
          </div>

          {/* Diretrizes da Frota */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber-500" />
              Aviso Importante Frota
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              O motorista é responsável pela inspeção inicial do veículo (nível de óleo, água, calibragem de pneus e registro de amassados) antes de assinar a liberação da chave com a portaria.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
