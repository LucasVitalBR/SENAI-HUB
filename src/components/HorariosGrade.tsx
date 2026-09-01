import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  SlidersHorizontal, 
  Download, 
  Calendar, 
  User, 
  Building2,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { UserProfile, WeekSchedule, ClassItem } from '../types';
import { WEEKDAYS_FULL, STATIC_EVENTS_BY_MONTH } from '../data';

interface HorariosGradeProps {
  profiles: Record<string, UserProfile>;
  selectedMonth: 'Junho' | 'Julho' | 'Agosto';
  setSelectedMonth: (month: 'Junho' | 'Julho' | 'Agosto') => void;
  excelData: any[][] | null;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export default function HorariosGrade({ 
  profiles, 
  selectedMonth, 
  setSelectedMonth, 
  excelData,
  onShowToast
}: HorariosGradeProps) {
  const [dayFilter, setDayFilter] = useState<number>(-1); // -1 = Todos os dias
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all'); // all, Lucas, Ederson, Gessica
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar'); // Default to calendar view

  // Helper arrays for calendar generation
  const getDayIndex = (month: 'Junho' | 'Julho' | 'Agosto', day: number) => {
    const monthMap = { Junho: 5, Julho: 6, Agosto: 7 };
    const jsDay = new Date(2026, monthMap[month], day).getDay();
    const mapping = [6, 0, 1, 2, 3, 4, 5];
    return mapping[jsDay];
  };

  const getClassDetails = (subject: string): { code: string; colorClass: string } => {
    const s = subject.toLowerCase();
    if (s.includes('eletrônica') || s.includes('industrial') && s.includes('eletr')) {
      return { 
        code: 'TEC.290', 
        colorClass: 'bg-pink-100 border-pink-200 dark:bg-pink-950/40 dark:border-pink-900/30 text-pink-600 dark:text-pink-400' 
      };
    }
    if (s.includes('clp') || s.includes('automação') || s.includes('lógica de c')) {
      return { 
        code: 'QUA.578', 
        colorClass: 'bg-fuchsia-100 border-fuchsia-200 dark:bg-fuchsia-950/40 dark:border-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400' 
      };
    }
    if (s.includes('microcontrolados') || s.includes('microcontrolador')) {
      return { 
        code: 'TEC.221', 
        colorClass: 'bg-amber-150 border-amber-250 dark:bg-amber-950/40 dark:border-amber-900/30 text-amber-800 dark:text-amber-300' 
      };
    }
    if (s.includes('cad') || s.includes('desenho') || s.includes('pcb')) {
      return { 
        code: 'TEC.052', 
        colorClass: 'bg-cyan-100 border-cyan-200 dark:bg-cyan-950/40 dark:border-cyan-900/30 text-cyan-600 dark:text-cyan-400' 
      };
    }
    if (s.includes('sensores') || s.includes('iot') && !s.includes('projeto')) {
      return { 
        code: 'TEC.029', 
        colorClass: 'bg-violet-100 border-violet-200 dark:bg-violet-950/40 dark:border-violet-900/30 text-violet-600 dark:text-violet-400' 
      };
    }
    if (s.includes('projeto integrador') || s.includes('conselho') || s.includes('logística') || s.includes('gestão')) {
      return { 
        code: 'TEC.051', 
        colorClass: 'bg-teal-100 border-teal-200 dark:bg-teal-950/40 dark:border-teal-900/30 text-teal-600 dark:text-teal-400' 
      };
    }
    return { 
      code: 'TEC.GEN', 
      colorClass: 'bg-blue-100 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/30 text-blue-600 dark:text-blue-400' 
    };
  };

  const generateMonthCalendar = () => {
    const list = [];
    const WEEKDAYS_SHORT_PORTUGUESE = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
    const maxDays = selectedMonth === 'Junho' ? 30 : 31;

    for (let day = 1; day <= maxDays; day++) {
      const dayIdx = getDayIndex(selectedMonth, day);
      const weekdayName = WEEKDAYS_SHORT_PORTUGUESE[dayIdx];
      const dateStr = `${day.toString().padStart(2, '0')}/${weekdayName}`;

      let matutino: any = { occupied: false };
      let vespertino: any = { occupied: false };
      let noturno: any = { occupied: false };

      // 1. Get static spreadsheet entries
      const monthEvents = STATIC_EVENTS_BY_MONTH[selectedMonth];
      if (monthEvents && monthEvents[day]) {
        const ev = monthEvents[day];
        if (ev.matutino) {
          const { code, colorClass } = getClassDetails(ev.matutino.subject);
          matutino = { occupied: true, code, colorClass, ...ev.matutino };
        }
        if (ev.vespertino) {
          const { code, colorClass } = getClassDetails(ev.vespertino.subject);
          vespertino = { occupied: true, code, colorClass, ...ev.vespertino };
        }
        if (ev.noturno) {
          const { code, colorClass } = getClassDetails(ev.noturno.subject);
          noturno = { occupied: true, code, colorClass, ...ev.noturno };
        }
      }

      // 2. Override with dynamic database schedule for active weeks (July 13 - 26)
      let targetWeek: 'current' | 'next' | null = null;
      if (selectedMonth === 'Julho') {
        if (day >= 13 && day <= 19) targetWeek = 'current';
        else if (day >= 20 && day <= 26) targetWeek = 'next';
      }

      if (targetWeek) {
        matutino = { occupied: false };
        vespertino = { occupied: false };
        noturno = { occupied: false };

        Object.entries(profiles).forEach(([profKey, profile]) => {
          const dayClasses = profile.schedule[targetWeek!][dayIdx] || [];
          dayClasses.forEach((cls) => {
            const startHour = parseInt(cls.timeStart.split(':')[0], 10);
            const { code, colorClass } = getClassDetails(cls.subject);
            
            const shiftData = {
              occupied: true,
              code,
              colorClass,
              subject: cls.subject,
              instructor: profile.name,
              class: cls.class,
              lab: cls.lab,
              students: cls.students
            };

            if (startHour < 12) {
              matutino = shiftData;
            } else if (startHour >= 12 && startHour < 18) {
              vespertino = shiftData;
            } else {
              noturno = shiftData;
            }
          });
        });
      }

      // Apply Search Filter and Instructor Filter to calendar shifts
      const applyFiltersToShift = (shift: any) => {
        if (!shift.occupied) return shift;

        // Instructor Filter
        if (roleFilter !== 'all' && !shift.instructor.toLowerCase().includes(roleFilter.toLowerCase())) {
          return { occupied: false };
        }

        // Search Term Filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchSubject = shift.subject.toLowerCase().includes(term);
          const matchClass = shift.class.toLowerCase().includes(term);
          const matchLab = shift.lab?.toLowerCase().includes(term) || false;
          const matchInst = shift.instructor.toLowerCase().includes(term);
          if (!matchSubject && !matchClass && !matchLab && !matchInst) {
            return { occupied: false };
          }
        }

        return shift;
      };

      list.push({
        dayNum: day,
        dateStr,
        weekdayName,
        matutino: applyFiltersToShift(matutino),
        vespertino: applyFiltersToShift(vespertino),
        noturno: applyFiltersToShift(noturno)
      });
    }

    return list;
  };

  // Aggregate schedules from month calendar
  const getAggregatedSchedulesForMonth = (): (ClassItem & { instructorName: string; dayNum: number; shiftName: string })[] => {
    const list: (ClassItem & { instructorName: string; dayNum: number; shiftName: string })[] = [];
    const cal = generateMonthCalendar();
    
    cal.forEach((dayData) => {
      if (dayData.matutino.occupied) {
        list.push({
          timeStart: dayData.matutino.timeStart || "07:30",
          timeEnd: dayData.matutino.timeEnd || "11:30",
          subject: dayData.matutino.subject,
          class: dayData.matutino.class,
          lab: dayData.matutino.lab,
          students: dayData.matutino.students,
          instructor: dayData.matutino.instructor,
          instructorName: dayData.matutino.instructor,
          dayNum: dayData.dayNum,
          shiftName: "Matutino"
        });
      }
      if (dayData.vespertino.occupied) {
        list.push({
          timeStart: dayData.vespertino.timeStart || "13:00",
          timeEnd: dayData.vespertino.timeEnd || "17:00",
          subject: dayData.vespertino.subject,
          class: dayData.vespertino.class,
          lab: dayData.vespertino.lab,
          students: dayData.vespertino.students,
          instructor: dayData.vespertino.instructor,
          instructorName: dayData.vespertino.instructor,
          dayNum: dayData.dayNum,
          shiftName: "Vespertino"
        });
      }
      if (dayData.noturno.occupied) {
        list.push({
          timeStart: dayData.noturno.timeStart || "19:00",
          timeEnd: dayData.noturno.timeEnd || "22:30",
          subject: dayData.noturno.subject,
          class: dayData.noturno.class,
          lab: dayData.noturno.lab,
          students: dayData.noturno.students,
          instructor: dayData.noturno.instructor,
          instructorName: dayData.noturno.instructor,
          dayNum: dayData.dayNum,
          shiftName: "Noturno"
        });
      }
    });

    return list.sort((a, b) => {
      if (a.dayNum !== b.dayNum) {
        return a.dayNum - b.dayNum;
      }
      return a.timeStart.localeCompare(b.timeStart);
    });
  };

  const allSchedules = getAggregatedSchedulesForMonth();

  // Filter schedules by day of week if requested
  const filteredSchedules = allSchedules.filter((item) => {
    // Weekday Filter (0 = SEG, etc.)
    if (dayFilter !== -1) {
      const dayIdx = getDayIndex(selectedMonth, item.dayNum);
      if (dayIdx !== dayFilter) return false;
    }
    return true;
  });

  const handleExport = () => {
    onShowToast('A exportação para PDF foi simulada com sucesso! O relatório de ocupação da grade está pronto para impressão.', 'success');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDayFilter(-1);
    setRoleFilter('all');
    onShowToast('Filtros limpos com sucesso.', 'info');
  };

  return (
    <div className="space-y-6 fade-in" id="horarios-grade-container">
      {/* Header com Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">Grade Geral de Horários</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualização consolidada de todas as salas, laboratórios e turmas ativas do SENAI Naviraí.
          </p>
        </div>
        
        {/* Toggle de Modo de Visualização e Semana */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Visual Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setViewMode('calendar');
                onShowToast('Modo de Visualização: Calendário Mensal (Planilha)', 'success');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Calendar size={13} />
              <span>Calendário (Planilha)</span>
            </button>
            <button
              onClick={() => {
                setViewMode('table');
                onShowToast('Modo de Visualização: Lista Detalhada', 'success');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Clock size={13} />
              <span>Lista Detalhada</span>
            </button>
          </div>

          {/* Toggle de Mês */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {(['Junho', 'Julho', 'Agosto'] as const).map((m) => {
              const isActive = selectedMonth === m;
              return (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    onShowToast(`Exibindo grade de ${m} de 2026`, 'info');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Painel de Filtros e Busca */}
      <div className="card p-5" id="filtros-horarios">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca por texto */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={14} />
            </span>
            <input 
              type="text"
              placeholder="Buscar por instrutor, disciplina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          {/* Filtro por Dia */}
          <div>
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(parseInt(e.target.value, 10))}
              disabled={viewMode === 'calendar'}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title={viewMode === 'calendar' ? 'O calendário já exibe todos os dias do mês simultaneamente' : ''}
            >
              {viewMode === 'calendar' ? (
                <option value="-1">Exibindo todo o mês</option>
              ) : (
                <>
                  <option value="-1">Todos os dias</option>
                  {WEEKDAYS_FULL.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Filtro por Docente */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
            >
              <option value="all">Todos os Docentes</option>
              <option value="Lucas Vital">Lucas Vital</option>
              <option value="Ederson Souza">Ederson Souza</option>
              <option value="Géssica Oliveira">Géssica Oliveira</option>
            </select>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <button
              onClick={handleResetFilters}
              title="Limpar Filtros"
              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200 dark:border-slate-800"
            >
              <RefreshCw size={12} />
              <span>Limpar</span>
            </button>
            <button
              onClick={handleExport}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Download size={12} />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabela ou Lista de Horários */}
      <div className="card p-6" id="tabela-horarios-grade">
        {viewMode === 'calendar' ? (
          /* NOVO MODO: Calendário de Planilha Excel */
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/80">
            <table className="w-full border-collapse text-center text-xs bg-white dark:bg-slate-950 min-w-[800px]">
              <thead>
                {/* Cabeçalho do Mês */}
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-extrabold uppercase tracking-wider text-[11px]">
                  <th colSpan={13} className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-800 font-extrabold text-blue-600 dark:text-blue-400">
                    {selectedMonth.toLowerCase()}/2026
                  </th>
                </tr>
                {/* Cabeçalho de Turnos */}
                <tr className="bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2 px-3 border-r border-slate-200 dark:border-slate-800 text-center min-w-[75px] font-extrabold"></th>
                  <th colSpan={4} className="py-2 border-r border-slate-200 dark:border-slate-800 text-center font-extrabold bg-blue-50/40 dark:bg-blue-950/20">matutino</th>
                  <th colSpan={4} className="py-2 border-r border-slate-200 dark:border-slate-800 text-center font-extrabold bg-amber-50/20 dark:bg-amber-950/10">vespertino</th>
                  <th colSpan={4} className="py-2 text-center font-extrabold bg-violet-50/30 dark:bg-violet-950/10">noturno</th>
                </tr>
                {/* Cabeçalho de Períodos/Sub-colunas */}
                <tr className="bg-slate-50/50 dark:bg-slate-900/60 text-[9px] text-slate-400 dark:text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800/60">
                  <th className="py-1 px-3 border-r border-slate-200 dark:border-slate-800 text-left">Dia</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">1º</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">2º</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">3º</th>
                  <th className="py-1 border-r border-slate-200 dark:border-slate-800">4º</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">1º</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">2º</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">3º</th>
                  <th className="py-1 border-r border-slate-200 dark:border-slate-800">4º</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">1º</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">2º</th>
                  <th className="py-1 border-r border-slate-100 dark:border-slate-800/40">3º</th>
                  <th className="py-1">4º</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/60">
                {generateMonthCalendar().map((day) => {
                  const isSimulatedWeek = selectedMonth === 'Julho' && (
                    (day.dayNum >= 13 && day.dayNum <= 19) ||
                    (day.dayNum >= 20 && day.dayNum <= 26)
                  );

                  const isWeekend = day.weekdayName === 'sáb' || day.weekdayName === 'dom';

                  return (
                    <tr 
                      key={day.dayNum} 
                      className={`h-9 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors ${
                        isSimulatedWeek 
                          ? 'bg-blue-50/20 dark:bg-blue-950/5' 
                          : isWeekend 
                            ? 'bg-slate-50/30 dark:bg-slate-900/10 text-slate-400 dark:text-slate-500' 
                            : ''
                      }`}
                    >
                      {/* Dia */}
                      <td className={`p-1.5 text-center border-r border-slate-200 dark:border-slate-800 font-mono text-[10px] font-semibold ${
                        isWeekend ? 'bg-slate-50/40 dark:bg-slate-900/15' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {day.dateStr}
                      </td>

                      {/* Matutino Shift */}
                      {day.matutino.occupied ? (
                        <td 
                          colSpan={4} 
                          className={`relative p-1 border-r border-slate-200 dark:border-slate-800 font-bold text-[10px] transition-all group overflow-visible ${day.matutino.colorClass}`}
                        >
                          <div className="flex flex-col items-center justify-center h-full cursor-pointer leading-none">
                            <span className="tracking-wide font-extrabold uppercase text-[10px]">{day.matutino.code}</span>
                          </div>
                          
                          {/* Hover Tooltip Popover */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-[110%] mb-1 hidden group-hover:block z-40 w-60 bg-slate-900 text-white text-[11px] p-3 rounded-lg shadow-2xl border border-slate-800 font-sans text-left leading-relaxed">
                            <div className="font-extrabold text-pink-400 mb-1 flex items-center justify-between border-b border-slate-800 pb-1">
                              <span>{day.matutino.code}</span>
                              <span className="text-[9px] uppercase font-bold text-slate-400">Matutino</span>
                            </div>
                            <p className="font-bold text-slate-100">{day.matutino.subject}</p>
                            <p className="mt-1"><strong className="text-slate-400">Docente:</strong> {day.matutino.instructor}</p>
                            <p><strong className="text-slate-400">Turma:</strong> {day.matutino.class}</p>
                            <p><strong className="text-slate-400">Ambiente/Lab:</strong> {day.matutino.lab}</p>
                            <p><strong className="text-slate-400">Alunos:</strong> {day.matutino.students}</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900"></div>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 border-r border-slate-200 dark:border-slate-800 h-full bg-transparent"></td>
                        </>
                      )}

                      {/* Vespertino Shift */}
                      {day.vespertino.occupied ? (
                        <td 
                          colSpan={4} 
                          className={`relative p-1 border-r border-slate-200 dark:border-slate-800 font-bold text-[10px] transition-all group overflow-visible ${day.vespertino.colorClass}`}
                        >
                          <div className="flex flex-col items-center justify-center h-full cursor-pointer leading-none">
                            <span className="tracking-wide font-extrabold uppercase text-[10px]">{day.vespertino.code}</span>
                          </div>
                          
                          {/* Hover Tooltip Popover */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-[110%] mb-1 hidden group-hover:block z-40 w-60 bg-slate-900 text-white text-[11px] p-3 rounded-lg shadow-2xl border border-slate-800 font-sans text-left leading-relaxed">
                            <div className="font-extrabold text-amber-400 mb-1 flex items-center justify-between border-b border-slate-800 pb-1">
                              <span>{day.vespertino.code}</span>
                              <span className="text-[9px] uppercase font-bold text-slate-400">Vespertino</span>
                            </div>
                            <p className="font-bold text-slate-100">{day.vespertino.subject}</p>
                            <p className="mt-1"><strong className="text-slate-400">Docente:</strong> {day.vespertino.instructor}</p>
                            <p><strong className="text-slate-400">Turma:</strong> {day.vespertino.class}</p>
                            <p><strong className="text-slate-400">Ambiente/Lab:</strong> {day.vespertino.lab}</p>
                            <p><strong className="text-slate-400">Alunos:</strong> {day.vespertino.students}</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900"></div>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 border-r border-slate-200 dark:border-slate-800 h-full bg-transparent"></td>
                        </>
                      )}

                      {/* Noturno Shift */}
                      {day.noturno.occupied ? (
                        <td 
                          colSpan={4} 
                          className={`relative p-1 border-r border-slate-200 dark:border-slate-800 font-bold text-[10px] transition-all group overflow-visible ${day.noturno.colorClass}`}
                        >
                          <div className="flex flex-col items-center justify-center h-full cursor-pointer leading-none">
                            <span className="tracking-wide font-extrabold uppercase text-[10px]">{day.noturno.code}</span>
                          </div>
                          
                          {/* Hover Tooltip Popover */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-[110%] mb-1 hidden group-hover:block z-40 w-60 bg-slate-900 text-white text-[11px] p-3 rounded-lg shadow-2xl border border-slate-800 font-sans text-left leading-relaxed">
                            <div className="font-extrabold text-blue-400 mb-1 flex items-center justify-between border-b border-slate-800 pb-1">
                              <span>{day.noturno.code}</span>
                              <span className="text-[9px] uppercase font-bold text-slate-400">Noturno</span>
                            </div>
                            <p className="font-bold text-slate-100">{day.noturno.subject}</p>
                            <p className="mt-1"><strong className="text-slate-400">Docente:</strong> {day.noturno.instructor}</p>
                            <p><strong className="text-slate-400">Turma:</strong> {day.noturno.class}</p>
                            <p><strong className="text-slate-400">Ambiente/Lab:</strong> {day.noturno.lab}</p>
                            <p><strong className="text-slate-400">Alunos:</strong> {day.noturno.students}</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900"></div>
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 border-r border-slate-100 dark:border-slate-800/40 h-full bg-transparent"></td>
                          <td className="p-0 h-full bg-transparent"></td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* MODO ANTERIOR: Lista/Tabela Detalhada */
          filteredSchedules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                    <th className="p-3">Dia da Semana</th>
                    <th className="p-3">Horário</th>
                    <th className="p-3">Componente / Disciplina</th>
                    <th className="p-3">Docente</th>
                    <th className="p-3">Turma</th>
                    <th className="p-3">Ambiente / Lab</th>
                    <th className="p-3 text-center">Alunos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredSchedules.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="p-3">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 block whitespace-nowrap">
                          {WEEKDAYS_FULL[getDayIndex(selectedMonth, item.dayNum)]}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                          {item.dayNum.toString().padStart(2, '0')} de {selectedMonth}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300 font-semibold">
                          <Clock size={12} className="text-slate-400" />
                          <span>{item.timeStart} - {item.timeEnd}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{item.subject}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold">
                            {item.instructorName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{item.instructorName}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{item.class}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-750">
                          <Building2 size={11} className="text-slate-400" />
                          {item.lab}
                        </span>
                      </td>
                      <td className="p-3 text-center font-semibold font-mono text-slate-500 dark:text-slate-400">{item.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <BookOpen size={48} className="text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nenhum horário correspondente aos filtros.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Experimente alterar os filtros de docente ou dia da semana.</p>
            </div>
          )
        )}
      </div>

      {/* Caixa Informativa sobre Integração Excel */}
      <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-950/5 flex items-start gap-3">
        <SlidersHorizontal size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Sincronização de Dados de Planilhas</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Esta grade exibe as aulas consolidadas do sistema. Caso queira atualizar os horários com uma nova planilha do sistema de gestão acadêmica, arraste-a para qualquer área da aplicação na aba <strong>Dashboard</strong> para que o mapeamento e atualização dos horários ocorram em tempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
