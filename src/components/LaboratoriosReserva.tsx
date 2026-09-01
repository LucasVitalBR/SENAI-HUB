import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Trash2,
  Lock,
  User,
  Info
} from 'lucide-react';
import { UserProfile, LabItem } from '../types';
import { WEEKDAYS_FULL } from '../data';

interface LaboratoriosReservaProps {
  currentUserProfile: UserProfile;
  labsList: LabItem[];
  selectedDayIndex: number;
  setSelectedDayIndex: (idx: number) => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

interface CustomReservation {
  id: string;
  labName: string;
  dayIndex: number;
  timeRange: string;
  subject: string;
  className: string;
  studentsCount: number;
  status: 'Aprovada' | 'Pendente' | 'Cancelada';
  instructor: string;
}

export default function LaboratoriosReserva({
  currentUserProfile,
  labsList,
  selectedDayIndex,
  setSelectedDayIndex,
  onShowToast
}: LaboratoriosReservaProps) {
  const [showReservaForm, setShowReservaForm] = useState(false);
  const [selectedLabName, setSelectedLabName] = useState('Laboratório de Eletricidade');
  const [reservationDay, setReservationDay] = useState(1); // Terça padrão
  const [timeRange, setTimeRange] = useState('13:00 - 17:00');
  const [subjectInput, setSubjectInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [studentsCount, setStudentsCount] = useState(20);

  // Armazenar reservas feitas dinamicamente na sessão do usuário
  const [reservations, setReservations] = useState<CustomReservation[]>([
    {
      id: "res-1",
      labName: "Laboratório Maker",
      dayIndex: 0, // Segunda
      timeRange: "13:00 - 17:00",
      subject: "Sensores e Atuadores para IoT",
      className: "IoT-M1",
      studentsCount: 15,
      status: 'Aprovada',
      instructor: "Lucas Vital"
    },
    {
      id: "res-2",
      labName: "Laboratório CAD",
      dayIndex: 3, // Quinta
      timeRange: "13:00 - 17:00",
      subject: "Desenvolvimento de PCBs (CAD)",
      className: "CAD-M3",
      studentsCount: 20,
      status: 'Aprovada',
      instructor: "Lucas Vital"
    },
    {
      id: "res-3",
      labName: "Laboratório de Elétrica",
      dayIndex: 1, // Terça
      timeRange: "19:00 - 22:30",
      subject: "Prática Avançada com CLP",
      className: "Téc. Automação",
      studentsCount: 18,
      status: 'Pendente',
      instructor: "Ederson Ivan Cardoso"
    },
    {
      id: "res-4",
      labName: "Laboratório Maker",
      dayIndex: 4, // Sexta
      timeRange: "19:00 - 22:30",
      subject: "Análise Físico-Química",
      className: "Téc. Açúcar e Álcool",
      studentsCount: 20,
      status: 'Pendente',
      instructor: "Janaina Facco"
    }
  ]);

  const isManagement = currentUserProfile.role === 'Administrador' || currentUserProfile.role === 'Coordenador';
  const isReadOnly = currentUserProfile.role === 'Estagiário' || currentUserProfile.role === 'Manutenção';

  const handleMakeReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) {
      onShowToast(`Perfil de ${currentUserProfile.role} não possui permissão para reservar laboratórios.`, 'warning');
      return;
    }

    if (!subjectInput.trim() || !classInput.trim()) {
      onShowToast('Por favor, preencha a disciplina e a turma para a reserva.', 'warning');
      return;
    }

    // Criar reserva - Auto-aprovada para admin/coordenador, senão pendente
    const autoApprove = isManagement;
    const newRes: CustomReservation = {
      id: Math.random().toString(),
      labName: selectedLabName,
      dayIndex: reservationDay,
      timeRange: timeRange,
      subject: subjectInput,
      className: classInput,
      studentsCount: studentsCount,
      status: autoApprove ? 'Aprovada' : 'Pendente',
      instructor: currentUserProfile.name
    };

    setReservations((prev) => [newRes, ...prev]);
    
    if (autoApprove) {
      onShowToast(`Reserva do "${selectedLabName}" criada e auto-aprovada instantaneamente!`, 'success');
    } else {
      onShowToast(`Solicitação do "${selectedLabName}" enviada! Aguardando aprovação de Taís ou Jaqueline.`, 'info');
    }
    
    // Limpar campos
    setSubjectInput('');
    setClassInput('');
    setShowReservaForm(false);
  };

  const handleCancelReservation = (id: string, labName: string) => {
    setReservations((prev) => prev.filter(r => r.id !== id));
    onShowToast(`Reserva do "${labName}" removida com sucesso.`, 'info');
  };

  const handleApproveStatus = (id: string, approve: boolean) => {
    setReservations((prev) => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: approve ? 'Aprovada' : 'Cancelada' };
      }
      return r;
    }));
    onShowToast(approve ? 'Solicitação de reserva aprovada!' : 'Solicitação de reserva recusada.', approve ? 'success' : 'warning');
  };

  return (
    <div className="space-y-6 fade-in" id="laboratorios-reserva-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">Reservas de Laboratórios</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verifique a disponibilidade de espaços práticos e agende aulas especiais para sua turma.
          </p>
        </div>

        {isReadOnly ? (
          <div className="text-[11px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-3 py-2 rounded-xl">
            Somente leitura para perfil <strong>{currentUserProfile.role}</strong>
          </div>
        ) : (
          <button
            onClick={() => setShowReservaForm(!showReservaForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <Plus size={16} />
            <span>Solicitar Reserva</span>
          </button>
        )}
      </div>

      {/* Formulário de Reserva Especial */}
      {showReservaForm && !isReadOnly && (
        <div className="card p-6 border-blue-200 dark:border-blue-900/40 bg-blue-50/10 dark:bg-blue-950/5 animate-fade-in" id="form-reserva-lab">
          <h2 className="text-base font-bold font-sans mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="text-blue-500" size={18} />
            Nova Solicitação de Espaço
          </h2>

          <form onSubmit={handleMakeReservation} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Laboratório Técnico</label>
              <select
                value={selectedLabName}
                onChange={(e) => setSelectedLabName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                <option value="Laboratório de Eletricidade">Laboratório de Eletricidade</option>
                <option value="Laboratório CAD">Laboratório CAD</option>
                <option value="Laboratório Maker">Laboratório Maker</option>
                <option value="Oficina de Metalmecânica">Oficina de Metalmecânica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Dia da Semana</label>
              <select
                value={reservationDay}
                onChange={(e) => setReservationDay(parseInt(e.target.value, 10))}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                {WEEKDAYS_FULL.map((day, idx) => (
                  <option key={idx} value={idx}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Horário / Turno</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              >
                <option value="07:30 - 11:30">Matutino (07:30 - 11:30)</option>
                <option value="13:00 - 17:00">Vespertino (13:00 - 17:00)</option>
                <option value="19:00 - 22:30">Noturno (19:00 - 22:30)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Disciplina / Componente</label>
              <input
                type="text"
                required
                placeholder="Ex: Circuitos Integrados"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Turma Codificada</label>
              <input
                type="text"
                required
                placeholder="Ex: ELT-N3"
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Quantidade Estimada de Alunos</label>
              <input
                type="number"
                min="1"
                max="40"
                value={studentsCount}
                onChange={(e) => setStudentsCount(parseInt(e.target.value, 10))}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReservaForm(false)}
                className="px-4 py-2 bg-slate-150 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-250 dark:border-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer shadow-sm"
              >
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid: Status Real-time de Hoje & Reservas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Status dos Laboratórios para o dia selecionado */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6" id="card-status-labs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold font-sans flex items-center gap-2">
                  <Building2 size={16} className="text-blue-500" />
                  Status dos Ambientes Técnicos
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Visualização rápida por dia letivo selecionado.
                </p>
              </div>

              {/* Selector de dia */}
              <select
                value={selectedDayIndex}
                onChange={(e) => setSelectedDayIndex(parseInt(e.target.value, 10))}
                className="text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none text-slate-800 dark:text-slate-100"
              >
                {WEEKDAYS_FULL.map((day, idx) => (
                  <option key={idx} value={idx}>{day}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {labsList.map((lab, index) => {
                const isLivre = lab.status === 'livre';
                return (
                  <div 
                    key={index} 
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isLivre ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{lab.name}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users size={12} /> Cap: {lab.cap}
                        </span>
                        <span>Resp: <strong className="font-semibold text-slate-700 dark:text-slate-300">{lab.resp}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isLivre ? (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40 uppercase">
                          Livre para Uso
                        </span>
                      ) : (
                        <div className="text-right">
                          <span className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40 uppercase">
                            Ocupado
                          </span>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] truncate font-mono">
                            {lab.schedules[0] || "Aula agendada"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado Direito: Aprovações e Histórico */}
        <div className="space-y-4">
          
          {/* Painel de Aprovação Exclusivo de Gestão */}
          {isManagement && (
            <div className="card p-5 border-amber-200 dark:border-amber-900/40 bg-amber-50/5" id="card-gestao-aprovacoes">
              <h2 className="text-sm font-bold font-sans mb-3 text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                Gestão de Reservas Pendentes
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4">
                Como <strong>{currentUserProfile.role}</strong>, você pode aprovar ou rejeitar solicitações da unidade.
              </p>

              {reservations.filter(r => r.status === 'Pendente').length > 0 ? (
                <div className="space-y-3">
                  {reservations.filter(r => r.status === 'Pendente').map((res) => (
                    <div key={res.id} className="p-3 rounded-lg border border-amber-200/60 dark:border-amber-900/30 bg-amber-500/5 text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{res.labName}</h4>
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            {WEEKDAYS_FULL[res.dayIndex]} ({res.timeRange})
                          </p>
                        </div>
                        <span className="text-[8px] bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase">
                          Pendente
                        </span>
                      </div>
                      
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 space-y-0.5 bg-white/50 dark:bg-slate-900/50 p-2 rounded">
                        <p>Instrutor: <strong className="text-slate-700 dark:text-slate-300">{res.instructor}</strong></p>
                        <p>Disciplina: <span>{res.subject}</span></p>
                        <p>Turma: <span className="font-mono">{res.className}</span> ({res.studentsCount} alunos)</p>
                      </div>

                      <div className="flex gap-1.5 justify-end pt-1">
                        <button
                          onClick={() => handleApproveStatus(res.id, false)}
                          className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-600 dark:text-slate-300 hover:text-red-600 text-[10px] font-semibold rounded"
                        >
                          Recusar
                        </button>
                        <button
                          onClick={() => handleApproveStatus(res.id, true)}
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
                  Nenhuma solicitação aguardando aprovação.
                </div>
              )}
            </div>
          )}

          {/* Histórico / Reservas Ativas */}
          <div className="card p-5" id="card-minhas-reservas">
            <h2 className="text-sm font-bold font-sans mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="text-blue-500" size={16} />
              {isManagement ? "Todas as Reservas Ativas" : "Minhas Reservas Ativas"}
            </h2>
            <p className="text-[10px] text-slate-550 dark:text-slate-450 mb-3 leading-tight">
              {isManagement 
                ? "Visão geral completa de todos os laboratórios agendados na unidade."
                : `Exibindo somente solicitações de ${currentUserProfile.name}.`
              }
            </p>

            {reservations.filter(r => isManagement || r.instructor === currentUserProfile.name).length > 0 ? (
              <div className="space-y-3">
                {reservations
                  .filter(r => isManagement || r.instructor === currentUserProfile.name)
                  .map((res) => {
                    const isOwn = res.instructor === currentUserProfile.name;
                    return (
                      <div key={res.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-xs space-y-3 relative group">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{res.labName}</h4>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                              {WEEKDAYS_FULL[res.dayIndex]} ({res.timeRange})
                            </p>
                          </div>

                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase shrink-0 border ${
                            res.status === 'Aprovada'
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200'
                              : res.status === 'Pendente'
                                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200'
                                : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200'
                          }`}>
                            {res.status}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-50 dark:border-slate-850/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                          <div>
                            <p>Instrutor: <strong className="text-slate-700 dark:text-slate-350">{res.instructor} {isOwn && "(Você)"}</strong></p>
                            <p>Turma: <strong className="text-slate-700 dark:text-slate-300 font-mono">{res.className}</strong></p>
                            <p className="truncate max-w-[150px]">{res.subject}</p>
                          </div>
                          
                          {(isManagement || isOwn) && (
                            <button
                              onClick={() => handleCancelReservation(res.id, res.labName)}
                              title="Remover Reserva"
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
                <p className="text-xs">Nenhuma reserva ativa encontrada.</p>
              </div>
            )}
          </div>

          {/* Diretrizes da Unidade */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Lock size={12} className="text-slate-400" />
              Diretrizes de Segurança e Uso
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              As chaves e armários dos laboratórios técnicos devem ser retirados e devolvidos na Coordenação de Turno mediante assinatura de livro de registros de segurança.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
