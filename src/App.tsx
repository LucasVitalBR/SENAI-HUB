import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { read, utils } from 'xlsx';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NoticeBanner from './components/NoticeBanner';
import CalendarCard from './components/CalendarCard';
import LabsCard from './components/LabsCard';
import UnidadeNavirai from './components/UnidadeNavirai';
import HorariosGrade from './components/HorariosGrade';
import LaboratoriosReserva from './components/LaboratoriosReserva';
import FrotaVeiculos from './components/FrotaVeiculos';
import ManutencaoPainel from './components/ManutencaoPainel';
import ComunicadosPainel from './components/ComunicadosPainel';
import Login from './components/Login';
import { 
  SettingsModal, 
  MapperModal, 
  DragDropOverlay 
} from './components/Modals';

import { UserProfile, ColumnMap, LabItem } from './types';
import { 
  DEFAULT_USER_PROFILES, 
  DEFAULT_LABS_OCCUPANCY_DATA,
  SIMULATED_WEEKS 
} from './data';
import { supabase } from './supabaseClient';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

// Top-level export: gates the whole app behind Supabase Auth.
// Keeps all existing dashboard logic untouched in <Dashboard />.
export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (authLoading) {
    return (
      <div className="login-screen">
        <p style={{ color: 'white' }}>Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return <Dashboard userEmail={session.user.email ?? ''} userId={session.user.id} />;
}

function Dashboard({ userEmail, userId }: { userEmail: string; userId: string }) {
  // Navigation & Active View State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  // Profile & Simulated Calendar State
  const [currentUserKey, setCurrentUserKey] = useState('lucas');
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>(DEFAULT_USER_PROFILES);

  // Load real team members ("people") from Supabase and use them as the
  // profile list instead of the hardcoded DEFAULT_USER_PROFILES.
  useEffect(() => {
    let cancelled = false;

    supabase
      .from('people')
      .select('id, full_name, permission_role, job_title, area, initials, user_id')
      .order('full_name', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data || data.length === 0) {
          if (error) console.error('Erro ao buscar pessoas:', error.message);
          return;
        }

        const roleLabels: Record<string, string> = {
          administrador: 'Administrador',
          coordenador: 'Coordenador',
          instrutor: 'Instrutor',
          secretaria: 'Secretaria',
          financeiro: 'Financeiro',
          comercial: 'Comercial',
          estagiario: 'Estagiário',
          manutencao: 'Manutenção',
        };

        const fetchedProfiles: Record<string, UserProfile> = {};
        let matchedKey: string | null = null;

        data.forEach((person) => {
          // Reuse a mock schedule from the old hardcoded list when the name
          // matches, so instructors we already had demo data for keep it.
          const legacyMatch = Object.values(DEFAULT_USER_PROFILES).find(
            (p) => p.name.trim().toLowerCase() === person.full_name.trim().toLowerCase()
          );

          const roleLabel = roleLabels[person.permission_role] || person.permission_role;
          const tag = person.job_title
            ? person.area
              ? `${person.job_title} - ${person.area}`
              : person.job_title
            : roleLabel;

          fetchedProfiles[person.id] = {
            name: person.full_name,
            role: roleLabel,
            tag,
            discipline: person.area || person.job_title || '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(person.full_name)}`,
            initials: person.initials || person.full_name.slice(0, 2).toUpperCase(),
            schedule: legacyMatch?.schedule || { current: {}, next: {} },
          };

          if (person.user_id === userId) {
            matchedKey = person.id;
          }
        });

        setProfiles(fetchedProfiles);
        const firstKey = Object.keys(fetchedProfiles)[0];
        setCurrentUserKey(matchedKey || firstKey || 'lucas');
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  // Infinite calendar selection (Junho, Julho, Agosto de 2026)
  const [selectedMonth, setSelectedMonth] = useState<'Junho' | 'Julho' | 'Agosto'>(() => {
    const now = new Date();
    const monthNamesMap: Record<number, 'Junho' | 'Julho' | 'Agosto'> = {
      5: 'Junho',
      6: 'Julho',
      7: 'Agosto'
    };
    return monthNamesMap[now.getMonth()] || 'Julho';
  });
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    return new Date().getDate();
  });

  const getWeekdayIndex = (day: number) => {
    const monthMap = { Junho: 5, Julho: 6, Agosto: 7 };
    const jsDay = new Date(2026, monthMap[selectedMonth], day).getDay();
    const mapping = [6, 0, 1, 2, 3, 4, 5];
    return mapping[jsDay];
  };

  const selectedDayIndex = getWeekdayIndex(selectedDay);

  const setSelectedDayIndex = (idx: number) => {
    if (selectedMonth === 'Julho' && selectedDay >= 13 && selectedDay <= 19) {
      const dates = [13, 14, 15, 16, 17, 18, 19];
      setSelectedDay(dates[idx]);
    } else if (selectedMonth === 'Julho' && selectedDay >= 20 && selectedDay <= 26) {
      const dates = [20, 21, 22, 23, 24, 25, 26];
      setSelectedDay(dates[idx]);
    } else {
      const currentWeekday = getWeekdayIndex(selectedDay);
      const mondayDate = selectedDay - currentWeekday;
      let targetDay = mondayDate + idx;
      const maxDays = selectedMonth === 'Junho' ? 30 : 31;
      if (targetDay < 1) targetDay = 1;
      if (targetDay > maxDays) targetDay = maxDays;
      setSelectedDay(targetDay);
    }
  };

  const [disciplineFilter, setDisciplineFilter] = useState<'my' | 'all'>('my');

  // Settings State
  const [darkMode, setDarkMode] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // File Upload / Parsing State
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [columnMap, setColumnMap] = useState<ColumnMap | null>(null);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [mapperOpen, setMapperOpen] = useState(false);
  const [temporaryExcelData, setTemporaryExcelData] = useState<any[][] | null>(null);
  const [parsedLabsSchedule, setParsedLabsSchedule] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Toasts Alert System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automate toast dismissal
    setTimeout(() => {
      setToasts((prev) => prev.map(t => t.id === id ? { ...t, removing: true } as any : t));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3500);
  };

  // Restore states and localStorages on mount
  useEffect(() => {
    // 1. Theme restore
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 2. Parsed schedule restore
    const savedExcel = localStorage.getItem('senai_hub_excel_data');
    const savedMap = localStorage.getItem('senai_hub_column_map');
    if (savedExcel && savedMap) {
      try {
        const parsedExcel = JSON.parse(savedExcel);
        const parsedMap = JSON.parse(savedMap);
        setExcelData(parsedExcel);
        setColumnMap(parsedMap);
        processExcelData(parsedExcel, parsedMap);
        showToast('Grade de horários restaurada e sincronizada localmente.', 'success');
      } catch (e) {
        console.error('Falha ao restaurar cache do Excel:', e);
        localStorage.removeItem('senai_hub_excel_data');
        localStorage.removeItem('senai_hub_column_map');
      }
    }
  }, []);

  // Update theme triggers
  const handleThemeUpdate = (val: boolean) => {
    setDarkMode(val);
    if (val) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  };

  // Drag and Drop triggers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.clientX === 0 || e.clientY === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle selected spreadsheets upload
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (!result) return;
        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        
        if (rows.length < 2) {
          showToast('A planilha parece estar vazia.', 'warning');
          return;
        }
        
        setTemporaryExcelData(rows);
        
        const headerRow = rows.find(r => r && r.length > 0) || [];
        setExcelHeaders(headerRow.map(h => String(h || '')));

        const savedMap = localStorage.getItem('senai_hub_column_map');
        if (savedMap) {
          const parsedMap = JSON.parse(savedMap) as ColumnMap;
          setColumnMap(parsedMap);
          processExcelData(rows, parsedMap);
          showToast(`✅ Sincronizado com: ${file.name}`, 'success');
        } else {
          setMapperOpen(true);
        }
      } catch (err) {
        console.error(err);
        showToast('Falha no processamento da planilha.', 'warning');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Parse Excel Date serial / string representation
  const parseExcelDate = (value: any): Date | null => {
    if (!value) return null;
    if (typeof value === 'number') {
      const utc_days = Math.floor(value - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      const fractional_day = value - Math.floor(value) + 0.0000001;
      let total_seconds = Math.floor(86400 * fractional_day);
      const hours = Math.floor(total_seconds / 3600);
      return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate() + 1, hours, 0, 0);
    }
    if (typeof value === 'string') {
      const parts = value.trim().split(/[/-]/);
      if (parts.length === 3) {
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10) - 1; // 0-indexed
        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
        return new Date(year, month, day);
      }
    }
    return null;
  };

  // Retrieve hours start/end text
  const parseTimeStrings = (rawTime: any): { start: string; end: string } => {
    if (!rawTime) return { start: "07:30", end: "11:30" };
    const text = String(rawTime).trim().toLowerCase();
    const match = text.match(/(\d{2}[:h]\d{2})\s*(?:[-–]|às|as)\s*(\d{2}[:h]\d{2})/i);
    if (match) {
      return {
        start: match[1].replace('h', ':'),
        end: match[2].replace('h', ':')
      };
    }
    if (text.includes('matutino') || text.includes('manhã') || text.includes('manha')) {
      return { start: "07:30", end: "11:30" };
    }
    if (text.includes('vespertino') || text.includes('tarde')) {
      return { start: "13:00", end: "17:00" };
    }
    if (text.includes('noturno') || text.includes('noite')) {
      return { start: "19:00", end: "22:30" };
    }
    return { start: "07:30", end: "11:30" };
  };

  const getWeekDates = (weekInfo: { dates: number[]; monthNum: number }) => {
    return weekInfo.dates.map(dateNum => new Date(2026, weekInfo.monthNum, dateNum));
  };

  const isSameDate = (d1: Date | null, d2: Date) => {
    if (!d1) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Master process Excel columns structures
  const processExcelData = (rows: any[][], map: ColumnMap) => {
    const headerIdx = rows.findIndex(row => row && row.length > 0);
    const dataRows = rows.slice(headerIdx + 1);

    const scheduleByInstructor: Record<string, any[]> = {};
    const uniqueInstructors = new Set<string>();

    dataRows.forEach(row => {
      if (!row || row.length === 0) return;
      
      const rawDate = row[map.date];
      const rawTime = row[map.time];
      const instructor = row[map.instructor];
      const subject = row[map.subject] || "Geral";
      const className = row[map.class] || "Sem Turma";
      const room = row[map.room] || "Sala de Teoria";

      if (!rawDate || !instructor) return;

      const dateObj = parseExcelDate(rawDate);
      if (!dateObj) return;

      const instructorClean = String(instructor).trim();
      uniqueInstructors.add(instructorClean);

      const timeParsed = parseTimeStrings(rawTime);

      const classItem = {
        date: dateObj,
        timeStart: timeParsed.start,
        timeEnd: timeParsed.end,
        subject: String(subject).trim(),
        class: String(className).trim(),
        lab: String(room).trim(),
        instructor: instructorClean,
        students: 25
      };

      if (!scheduleByInstructor[instructorClean]) {
        scheduleByInstructor[instructorClean] = [];
      }
      scheduleByInstructor[instructorClean].push(classItem);
    });

    const instructorsList = Array.from(uniqueInstructors).sort();

    const currentWeekInfo = SIMULATED_WEEKS.current;
    const nextWeekInfo = SIMULATED_WEEKS.next;

    const currentWeekDates = getWeekDates(currentWeekInfo);
    const nextWeekDates = getWeekDates(nextWeekInfo);

    const dynamicProfiles: Record<string, UserProfile> = {};

    instructorsList.forEach(inst => {
      const initials = inst.split(' ').slice(0, 2).map(n => n[0].toUpperCase()).join('');
      const profileKey = inst.toLowerCase().replace(/\s+/g, '_');

      dynamicProfiles[profileKey] = {
        name: inst,
        role: "Instrutor",
        tag: "Instrutor",
        discipline: "Mapeado da Planilha",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${inst}&backgroundType=gradientLinear`,
        initials: initials,
        schedule: {
          current: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
          next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
        }
      };

      const instClasses = scheduleByInstructor[inst] || [];

      instClasses.forEach(item => {
        // Compare current week
        currentWeekDates.forEach((wDate, dayIdx) => {
          if (isSameDate(item.date, wDate)) {
            dynamicProfiles[profileKey].schedule.current[dayIdx].push(item);
          }
        });
        // Compare next week
        nextWeekDates.forEach((wDate, dayIdx) => {
          if (isSameDate(item.date, wDate)) {
            dynamicProfiles[profileKey].schedule.next[dayIdx].push(item);
          }
        });
      });

      // Sort classes chronologically
      for (let day in dynamicProfiles[profileKey].schedule.current) {
        dynamicProfiles[profileKey].schedule.current[day].sort((a, b) => a.timeStart.localeCompare(b.timeStart));
      }
      for (let day in dynamicProfiles[profileKey].schedule.next) {
        dynamicProfiles[profileKey].schedule.next[day].sort((a, b) => a.timeStart.localeCompare(b.timeStart));
      }
    });

    if (Object.keys(dynamicProfiles).length > 0) {
      setProfiles(dynamicProfiles);
      const firstKey = Object.keys(dynamicProfiles)[0];
      setCurrentUserKey(firstKey);
    }

    // Rebuild Labs Occupancy from spreadsheet
    rebuildLabsOccupancy(dataRows, map, currentWeekDates, nextWeekDates);
  };

  // Re-calculate labs occupied grids
  const rebuildLabsOccupancy = (
    dataRows: any[][], 
    map: ColumnMap, 
    currentWeekDates: Date[], 
    nextWeekDates: Date[]
  ) => {
    const tempLabsOccupancy: any = {
      current: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} },
      next: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} }
    };

    dataRows.forEach(row => {
      if (!row || row.length === 0) return;
      const rawDate = row[map.date];
      const rawTime = row[map.time];
      const room = row[map.room];
      const instructor = row[map.instructor];
      const subject = row[map.subject] || "Aulas";
      const className = row[map.class] || "";

      if (!rawDate || !room || !instructor) return;

      const dateObj = parseExcelDate(rawDate);
      if (!dateObj) return;

      const timeParsed = parseTimeStrings(rawTime);
      const roomClean = String(room).trim();
      const schedText = `${timeParsed.start} - ${subject} (${className})`;

      const insertLabData = (weekKey: 'current' | 'next', weekDates: Date[]) => {
        weekDates.forEach((wDate, dayIdx) => {
          if (isSameDate(dateObj, wDate)) {
            if (!tempLabsOccupancy[weekKey][dayIdx][roomClean]) {
              tempLabsOccupancy[weekKey][dayIdx][roomClean] = {
                name: roomClean,
                cap: roomClean.toLowerCase().includes('cad') ? 30 : roomClean.toLowerCase().includes('maker') ? 15 : 22,
                resp: String(instructor).trim(),
                status: "ocupado",
                schedules: []
              };
            }
            if (!tempLabsOccupancy[weekKey][dayIdx][roomClean].schedules.includes(schedText)) {
              tempLabsOccupancy[weekKey][dayIdx][roomClean].schedules.push(schedText);
            }
          }
        });
      };

      insertLabData('current', currentWeekDates);
      insertLabData('next', nextWeekDates);
    });

    setParsedLabsSchedule(tempLabsOccupancy);
  };

  // Confirm new map columns modal
  const handleConfirmMapping = (mapping: ColumnMap) => {
    if (!temporaryExcelData) return;
    
    setColumnMap(mapping);
    setExcelData(temporaryExcelData);
    
    localStorage.setItem('senai_hub_excel_data', JSON.stringify(temporaryExcelData));
    localStorage.setItem('senai_hub_column_map', JSON.stringify(mapping));
    
    processExcelData(temporaryExcelData, mapping);
    setMapperOpen(false);
    showToast('Planilha configurada e sincronizada com sucesso!', 'success');
  };

  // Build dynamic lab records lists
  const getLabsList = (): LabItem[] => {
    if (parsedLabsSchedule) {
      const selectedWeek = selectedMonth === 'Julho' && selectedDay >= 20 ? 'next' : 'current';
      const parsedLabsForDay = parsedLabsSchedule[selectedWeek][selectedDayIndex] || {};
      
      const uniqueLabNames = Array.from(new Set([
        ...Object.keys(parsedLabsForDay),
        "Laboratório de Eletricidade",
        "Laboratório CAD",
        "Laboratório Maker"
      ]));

      return uniqueLabNames.map(name => {
        if (parsedLabsForDay[name]) {
          return parsedLabsForDay[name] as LabItem;
        } else {
          return {
            name: name,
            cap: name.toLowerCase().includes('cad') ? 30 : name.toLowerCase().includes('maker') ? 15 : 22,
            resp: "Disponível",
            status: "livre" as const,
            schedules: []
          };
        }
      });
    }

    return DEFAULT_LABS_OCCUPANCY_DATA[selectedDayIndex] || [];
  };

  const activeUserProfile = profiles[currentUserKey] || DEFAULT_USER_PROFILES.lucas;

  return (
    <div 
      className="app-container"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUserProfile={activeUserProfile}
        onShowToast={showToast}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Layout Area */}
      <div className={`main-layout ${sidebarOpen ? '' : 'collapsed'}`}>
        {(() => {
          const selectedWeek = selectedMonth === 'Julho' && selectedDay >= 20 ? 'next' : 'current';
          return (
            <Header 
              currentUserKey={currentUserKey}
              setCurrentUserKey={setCurrentUserKey}
              currentUserProfile={activeUserProfile}
              profiles={profiles}
              selectedMonth={selectedMonth}
              selectedDay={selectedDay}
              selectedDayIndex={selectedDayIndex}
              simulatedTime={simulatedTime}
              onOpenSettings={() => setSettingsOpen(true)}
              onShowToast={showToast}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              userEmail={userEmail}
              onLogout={() => supabase.auth.signOut()}
            />
          );
        })()}

        {/* Content Wrapper */}
        <main className="content-wrapper">
          {activeTab === 'dashboard' ? (
            <div className="dashboard-grid">
              
              {/* Left & Center Column */}
              <div className="col-main">
                {/* News bulletin cards carousel */}
                <NoticeBanner />

                {/* Calendar grid view */}
                <CalendarCard 
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedDayIndex={selectedDayIndex}
                  setSelectedDayIndex={setSelectedDayIndex}
                  disciplineFilter={disciplineFilter}
                  setDisciplineFilter={setDisciplineFilter}
                  currentUserProfile={activeUserProfile}
                  profiles={profiles}
                  onShowToast={showToast}
                  onFileSelect={handleFileSelect}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                />
              </div>

              {/* Right Column: Labs occupiers lists */}
              <div className="col-side">
                <LabsCard 
                  labsList={getLabsList()}
                  selectedDayIndex={selectedDayIndex}
                  onShowToast={showToast}
                />
              </div>
            </div>
          ) : activeTab === 'unidade' ? (
            <UnidadeNavirai 
              currentUserProfile={activeUserProfile} 
              onShowToast={showToast} 
            />
          ) : activeTab === 'horarios' ? (
            <HorariosGrade 
              profiles={profiles} 
              selectedMonth={selectedMonth} 
              setSelectedMonth={setSelectedMonth} 
              excelData={excelData} 
              onShowToast={showToast} 
            />
          ) : activeTab === 'laboratorios' ? (
            <LaboratoriosReserva 
              currentUserProfile={activeUserProfile} 
              labsList={getLabsList()} 
              selectedDayIndex={selectedDayIndex} 
              setSelectedDayIndex={setSelectedDayIndex} 
              onShowToast={showToast} 
            />
          ) : activeTab === 'frota' ? (
            <FrotaVeiculos 
              currentUserProfile={activeUserProfile} 
              onShowToast={showToast} 
            />
          ) : activeTab === 'manutencao' ? (
            <ManutencaoPainel 
              currentUserProfile={activeUserProfile} 
              onShowToast={showToast} 
            />
          ) : activeTab === 'comunicados' ? (
            <ComunicadosPainel 
              currentUserProfile={activeUserProfile} 
              onShowToast={showToast} 
            />
          ) : (
            /* Developing Module fallback */
            <div className="card p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-xl font-bold font-sans">Módulo em Desenvolvimento</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                O módulo "{activeTab.toUpperCase()}" está sendo estruturado pela coordenação de TI do SENAI Naviraí.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Settings Modal Dialog */}
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        setDarkMode={handleThemeUpdate}
        simulatedTime={simulatedTime}
        setSimulatedTime={setSimulatedTime}
        pushNotifications={pushNotifications}
        setPushNotifications={setPushNotifications}
        onSave={() => {
          setSettingsOpen(false);
          showToast('Configurações salvas com sucesso!', 'success');
        }}
      />

      {/* Column Mapping Modal Dialog */}
      <MapperModal 
        isOpen={mapperOpen}
        onClose={() => setMapperOpen(false)}
        excelHeaders={excelHeaders}
        onConfirm={handleConfirmMapping}
      />

      {/* Drag & Drop Overlays */}
      <DragDropOverlay isDragging={isDragging} />

      {/* Floating Alerts Toasts Container */}
      <div className="toast-container" id="toast-container">
        {toasts.map((toast: any) => (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type} ${toast.removing ? 'removing' : ''}`}
          >
            {toast.type === 'success' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {toast.type === 'warning' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            )}
            {toast.type === 'info' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
