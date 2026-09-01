import React, { useRef } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Upload, 
  Users, 
  MapPin, 
  FileText, 
  CheckSquare, 
  FolderOpen 
} from 'lucide-react';
import { UserProfile, ClassItem } from '../types';
import { WEEKDAYS_SHORT, WEEKDAYS_FULL, SIMULATED_WEEKS, STATIC_EVENTS_BY_MONTH } from '../data';

interface CalendarCardProps {
  selectedMonth: 'Junho' | 'Julho' | 'Agosto';
  setSelectedMonth: (month: 'Junho' | 'Julho' | 'Agosto') => void;
  selectedDayIndex: number;
  setSelectedDayIndex: (idx: number) => void;
  disciplineFilter: 'my' | 'all';
  setDisciplineFilter: (filter: 'my' | 'all') => void;
  currentUserProfile: UserProfile;
  profiles: Record<string, UserProfile>;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  onFileSelect: (file: File) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

export default function CalendarCard({
  selectedMonth,
  setSelectedMonth,
  selectedDayIndex,
  setSelectedDayIndex,
  disciplineFilter,
  setDisciplineFilter,
  currentUserProfile,
  profiles,
  onShowToast,
  onFileSelect,
  selectedDay,
  setSelectedDay,
}: CalendarCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [timeStr, setTimeStr] = React.useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 10000); // update every 10s
    return () => clearInterval(interval);
  }, []);

  const isCurrentPeriod = (periodId: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMonthNum = now.getMonth();
    const monthMap = { Junho: 5, Julho: 6, Agosto: 7 };
    const isToday = now.getDate() === selectedDay && monthMap[selectedMonth] === currentMonthNum;
    
    if (!isToday) return false;
    
    if (periodId === 'matutino') return currentHour >= 6 && currentHour < 12;
    if (periodId === 'vespertino') return currentHour >= 12 && currentHour < 18;
    if (periodId === 'noturno') return currentHour >= 18;
    return false;
  };

  const getWeekdayIndex = (day: number) => {
    const monthMap = { Junho: 5, Julho: 6, Agosto: 7 };
    const jsDay = new Date(2026, monthMap[selectedMonth], day).getDay();
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
        colorClass: 'bg-amber-100 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/30 text-amber-800 dark:text-amber-300' 
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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
      // Reset input value so same file can be loaded again
      e.target.value = '';
    }
  };

  const isDatabaseWeek = selectedMonth === 'Julho' && selectedDay >= 13 && selectedDay <= 26;
  let finalClasses: ClassItem[] = [];

  if (isDatabaseWeek) {
    const weekKey = selectedDay <= 19 ? 'current' : 'next';
    const dayIdx = selectedDay <= 19 ? selectedDay - 13 : selectedDay - 20;

    const dayClasses = currentUserProfile.schedule[weekKey][dayIdx] || [];

    if (disciplineFilter === 'my') {
      finalClasses = [...dayClasses];
    } else {
      // Aggregate from all profiles for that week and day
      const allAggregated: ClassItem[] = [];
      Object.keys(profiles).forEach((key) => {
        const u = profiles[key];
        const uClasses = u.schedule[weekKey][dayIdx] || [];
        uClasses.forEach((c) => {
          // Prevent duplicates
          if (!allAggregated.some(
            (x) => x.timeStart === c.timeStart && 
                   x.instructor === c.instructor && 
                   x.lab === c.lab &&
                   x.subject === c.subject
          )) {
            allAggregated.push({
              ...c,
              instructor: c.instructor || u.name
            });
          }
        });
      });
      // Sort chronologically by start time
      finalClasses = allAggregated.sort((a, b) => a.timeStart.localeCompare(b.timeStart));
    }
  } else {
    // Outside database weeks, pull from STATIC_EVENTS_BY_MONTH
    const events = STATIC_EVENTS_BY_MONTH[selectedMonth]?.[selectedDay];
    if (events) {
      const list: ClassItem[] = [];
      if (events.matutino) {
        list.push({
          timeStart: events.matutino.timeStart || "07:30",
          timeEnd: events.matutino.timeEnd || "11:30",
          subject: events.matutino.subject,
          class: events.matutino.class,
          lab: events.matutino.lab,
          students: events.matutino.students,
          instructor: events.matutino.instructor
        });
      }
      if (events.vespertino) {
        list.push({
          timeStart: events.vespertino.timeStart || "13:00",
          timeEnd: events.vespertino.timeEnd || "17:00",
          subject: events.vespertino.subject,
          class: events.vespertino.class,
          lab: events.vespertino.lab,
          students: events.vespertino.students,
          instructor: events.vespertino.instructor
        });
      }
      if (events.noturno) {
        list.push({
          timeStart: events.noturno.timeStart || "19:00",
          timeEnd: events.noturno.timeEnd || "22:30",
          subject: events.noturno.subject,
          class: events.noturno.class,
          lab: events.noturno.lab,
          students: events.noturno.students,
          instructor: events.noturno.instructor
        });
      }

      if (disciplineFilter === 'my') {
        finalClasses = list.filter(c => 
          c.instructor && c.instructor.toLowerCase().includes(currentUserProfile.name.toLowerCase())
        );
      } else {
        finalClasses = list;
      }
    } else {
      finalClasses = [];
    }
  }

  const handleActionClick = (actionName: string) => {
    onShowToast(actionName, 'info');
  };

  const getCarouselDays = () => {
    const list = [];
    const months: ('Junho' | 'Julho' | 'Agosto')[] = ['Junho', 'Julho', 'Agosto'];
    const currentMonthIdx = months.indexOf(selectedMonth);

    for (let i = -3; i <= 3; i++) {
      let targetDay = selectedDay + i;
      let targetMonth = selectedMonth;

      const currentMaxDays = selectedMonth === 'Junho' ? 30 : 31;

      if (targetDay < 1) {
        // Wrap to previous month
        const prevMonthIdx = (currentMonthIdx - 1 + months.length) % months.length;
        const prevMonth = months[prevMonthIdx];
        const prevMaxDays = prevMonth === 'Junho' ? 30 : 31;
        targetMonth = prevMonth;
        targetDay = prevMaxDays + targetDay;
      } else if (targetDay > currentMaxDays) {
        // Wrap to next month
        const nextMonthIdx = (currentMonthIdx + 1) % months.length;
        const nextMonth = months[nextMonthIdx];
        targetMonth = nextMonth;
        targetDay = targetDay - currentMaxDays;
      }

      list.push({ dayNum: targetDay, month: targetMonth });
    }
    return list;
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const months: ('Junho' | 'Julho' | 'Agosto')[] = ['Junho', 'Julho', 'Agosto'];
    const currentMonthIdx = months.indexOf(selectedMonth);
    const maxDays = selectedMonth === 'Junho' ? 30 : 31;

    if (direction === 'prev') {
      if (selectedDay > 1) {
        const d = selectedDay - 1;
        setSelectedDay(d);
        onShowToast(`Navegando para ${WEEKDAYS_FULL[getWeekdayIndex(d)]}, ${d.toString().padStart(2, '0')} de ${selectedMonth}`, 'info');
      } else {
        // Go to previous month
        const prevMonthIdx = (currentMonthIdx - 1 + months.length) % months.length;
        const prevMonth = months[prevMonthIdx];
        const prevMaxDays = prevMonth === 'Junho' ? 30 : 31;
        setSelectedMonth(prevMonth);
        setSelectedDay(prevMaxDays);
        onShowToast(`Navegando para ${WEEKDAYS_FULL[getWeekdayIndex(prevMaxDays)]}, ${prevMaxDays.toString().padStart(2, '0')} de ${prevMonth}`, 'info');
      }
    } else {
      if (selectedDay < maxDays) {
        const d = selectedDay + 1;
        setSelectedDay(d);
        onShowToast(`Navegando para ${WEEKDAYS_FULL[getWeekdayIndex(d)]}, ${d.toString().padStart(2, '0')} de ${selectedMonth}`, 'info');
      } else {
        // Go to next month
        const nextMonthIdx = (currentMonthIdx + 1) % months.length;
        const nextMonth = months[nextMonthIdx];
        setSelectedMonth(nextMonth);
        setSelectedDay(1);
        onShowToast(`Navegando para ${WEEKDAYS_FULL[getWeekdayIndex(1)]}, 01 de ${nextMonth}`, 'info');
      }
    }
  };

  const getWeekdayIndexForMonthAndDay = (month: 'Junho' | 'Julho' | 'Agosto', day: number) => {
    const monthMap = { Junho: 5, Julho: 6, Agosto: 7 };
    const jsDay = new Date(2026, monthMap[month], day).getDay();
    const mapping = [6, 0, 1, 2, 3, 4, 5];
    return mapping[jsDay];
  };

  return (
    <section className="card calendar-card">
      <div className="calendar-header">
        <div className="calendar-title-group">
          <h2>CALENDÁRIO DE HORÁRIOS</h2>
          {/* Discipline Select Filter */}
          <div className="discipline-select-wrapper">
            <select 
              id="discipline-filter"
              value={disciplineFilter}
              onChange={(e) => {
                const val = e.target.value as 'my' | 'all';
                setDisciplineFilter(val);
                onShowToast(val === 'all' ? 'Exibindo todos os horários' : 'Filtrando seus horários', 'info');
              }}
            >
              <option value="my">{currentUserProfile.name} ({currentUserProfile.discipline})</option>
              <option value="all">Todas as Disciplinas</option>
            </select>
            <ChevronRight size={16} className="select-chevron rotate-90" />
          </div>
        </div>

        <div className="calendar-view-toggle">
          <button 
            className={`toggle-btn ${disciplineFilter === 'my' ? 'active' : ''}`}
            onClick={() => {
              setDisciplineFilter('my');
              onShowToast('Filtrando seus horários', 'info');
            }}
          >
            Meus Horários
          </button>
          <button 
            className={`toggle-btn ${disciplineFilter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setDisciplineFilter('all');
              onShowToast('Exibindo todos os horários', 'info');
            }}
          >
            Todos
          </button>
          
          <button 
            className="btn-import-excel" 
            id="btn-import-excel" 
            title="Importar Planilha Excel de Horários"
            onClick={handleImportClick}
          >
            <Upload size={14} />
            <span>Importar Planilha</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
          />
        </div>
      </div>

      {/* Month Selector tabs */}
      <div className="week-selector">
        {(['Junho', 'Julho', 'Agosto'] as const).map((m) => {
          const isActive = selectedMonth === m;
          return (
            <button 
              key={m}
              className={`week-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                setSelectedMonth(m);
                setSelectedDay(1); // Reset day when changing month to keep it safe
                onShowToast(`Exibindo cronograma de ${m}`, 'info');
              }}
            >
              <Calendar size={16} />
              <span>{m} / 2026</span>
            </button>
          );
        })}
      </div>

      {/* Calendar Days Carousel - Infinite scrolling custom design */}
      <div className="relative flex items-center justify-between gap-2 mb-2" id="days-carousel-container">
        {/* Previous Day button */}
        <button 
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200 dark:border-slate-800 shrink-0"
          onClick={() => navigateDay('prev')}
          title="Dia Anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Carousel Days Slider track */}
        <div className="flex-1 overflow-x-auto scrollbar-hide py-1">
          <div className="flex justify-between md:grid md:grid-cols-7 gap-2 min-w-[320px] md:min-w-0 transition-all duration-300">
            {getCarouselDays().map((item, idx) => {
              const isSelected = item.dayNum === selectedDay && item.month === selectedMonth;
              
              const now = new Date();
              const currentMonthNum = now.getMonth();
              const monthNamesMap: Record<number, 'Junho' | 'Julho' | 'Agosto'> = {
                5: 'Junho',
                6: 'Julho',
                7: 'Agosto'
              };
              const realTodayMonth = monthNamesMap[currentMonthNum];
              const realTodayDay = now.getDate();
              const isToday = item.dayNum === realTodayDay && item.month === realTodayMonth;

              const weekdayIdx = getWeekdayIndexForMonthAndDay(item.month, item.dayNum);
              return (
                <div 
                  key={`${item.month}-${item.dayNum}-${idx}`} 
                  className={`day-item flex-1 min-w-[50px] md:min-w-0 cursor-pointer ${
                    isSelected ? 'active scale-[1.03] shadow-md border-blue-500' : ''
                  } ${isToday ? 'today ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950' : ''}`}
                  onClick={() => {
                    if (item.month !== selectedMonth) {
                      setSelectedMonth(item.month);
                    }
                    setSelectedDay(item.dayNum);
                    onShowToast(`Visualizando ${WEEKDAYS_FULL[weekdayIdx]}, ${item.dayNum.toString().padStart(2, '0')} de ${item.month}`, 'info');
                  }}
                >
                  <span className="day-name text-[10px] font-bold block text-center uppercase tracking-tight text-slate-400">
                    {WEEKDAYS_SHORT[weekdayIdx]}
                  </span>
                  <span className="day-number text-base font-bold block text-center mt-0.5">
                    {item.dayNum}
                  </span>
                  <span className="text-[8px] font-semibold block text-center leading-none text-slate-400 -mt-0.5 max-md:hidden">
                    {item.month.substring(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Day button */}
        <button 
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200 dark:border-slate-800 shrink-0"
          onClick={() => navigateDay('next')}
          title="Próximo Dia"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Carousel Dot Indicators - Same as Notice Banner indicator style */}
      <div className="flex justify-center gap-1.5 mb-5" id="days-carousel-indicators">
        {getCarouselDays().map((item, idx) => {
          const isSelected = item.dayNum === selectedDay && item.month === selectedMonth;
          const weekdayIdx = getWeekdayIndexForMonthAndDay(item.month, item.dayNum);
          return (
            <button
              key={idx}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                isSelected 
                  ? 'w-6 bg-blue-600' 
                  : 'w-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
              onClick={() => {
                if (item.month !== selectedMonth) {
                  setSelectedMonth(item.month);
                }
                setSelectedDay(item.dayNum);
                onShowToast(`Selecionou ${WEEKDAYS_FULL[weekdayIdx]}, ${item.dayNum.toString().padStart(2, '0')} de ${item.month}`, 'info');
              }}
              title={`${WEEKDAYS_FULL[weekdayIdx]}, ${item.dayNum.toString().padStart(2, '0')} de ${item.month}`}
            />
          );
        })}
      </div>

      {/* Day Schedule Content Area */}
      <div className="day-schedule-content schedule-animate-enter" id="day-schedule-content">
        {/* Dynamic Header displaying Day, Month, and Live Time */}
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {WEEKDAYS_FULL[selectedDayIndex]}, {selectedDay} de {selectedMonth}
            </span>
            {(() => {
              const now = new Date();
              const currentMonthNum = now.getMonth();
              const monthMap = { Junho: 5, Julho: 6, Agosto: 7 };
              const isToday = now.getDate() === selectedDay && monthMap[selectedMonth] === currentMonthNum;
              if (isToday) {
                return (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 animate-pulse">
                    HOJE
                  </span>
                );
              }
              return null;
            })()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-800/60 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{timeStr}</span>
          </div>
        </div>

        {(() => {
          const periodData = [
            { id: 'matutino', label: 'Matutino' },
            { id: 'vespertino', label: 'Vespertino' },
            { id: 'noturno', label: 'Noturno' }
          ].map(p => {
            const matchedClass = finalClasses.find(c => {
              const hour = parseInt(c.timeStart.split(':')[0], 10);
              if (p.id === 'matutino') return hour < 12;
              if (p.id === 'vespertino') return hour >= 12 && hour < 18;
              if (p.id === 'noturno') return hour >= 18;
              return false;
            });
            return { ...p, matchedClass };
          });

          return (
            <div className="space-y-3">
              {periodData.map((p) => {
                const active = isCurrentPeriod(p.id);
                return (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      active
                        ? 'bg-emerald-50/15 dark:bg-emerald-950/10 border-emerald-500/40 dark:border-emerald-500/30 ring-1 ring-emerald-500/15 shadow-sm shadow-emerald-500/5'
                        : p.matchedClass 
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm' 
                          : 'bg-slate-50/50 dark:bg-slate-950/10 border-dashed border-slate-200 dark:border-slate-800/40 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                          active ? 'text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {p.label}
                        </span>
                        {active && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 animate-pulse">
                            ● AGORA
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {p.matchedClass ? (
                      (() => {
                        const details = getClassDetails(p.matchedClass.subject);
                        return (
                          <div className={`px-4 py-2 rounded-lg border font-mono font-extrabold text-sm tracking-wider uppercase shadow-sm ${details.colorClass}`}>
                            {details.code}
                          </div>
                        );
                      })()
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-600 italic font-sans pr-2">
                        Livre
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </section>
  );
}
