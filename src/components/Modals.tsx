import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { ColumnMap } from '../types';

// ==========================================================================
// QUICK SETTINGS MODAL
// ==========================================================================
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  simulatedTime: boolean;
  setSimulatedTime: (val: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (val: boolean) => void;
  onSave: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  darkMode,
  setDarkMode,
  simulatedTime,
  setSimulatedTime,
  pushNotifications,
  setPushNotifications,
  onSave,
}: SettingsModalProps) {
  const [localDarkMode, setLocalDarkMode] = useState(darkMode);
  const [localSimTime, setLocalSimTime] = useState(simulatedTime);
  const [localPushNotif, setLocalPushNotif] = useState(pushNotifications);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalDarkMode(darkMode);
      setLocalSimTime(simulatedTime);
      setLocalPushNotif(pushNotifications);
    }
  }, [isOpen, darkMode, simulatedTime, pushNotifications]);

  const handleSave = () => {
    setDarkMode(localDarkMode);
    setSimulatedTime(localSimTime);
    setPushNotifications(localPushNotif);
    onSave();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" id="settings-modal" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Configurações Rápidas</h3>
          <button className="btn-close-modal" id="btn-close-settings" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="settings-body">
          {/* Dark Mode */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-title">Modo Escuro (Dark Mode)</span>
              <span className="setting-desc">Ajusta a paleta de cores para ambientes de baixa luminosidade.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                id="dark-mode-toggle"
                checked={localDarkMode}
                onChange={(e) => setLocalDarkMode(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-title">Notificações Push</span>
              <span className="setting-desc">Receber avisos urgentes diretamente no navegador.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={localPushNotif}
                onChange={(e) => setLocalPushNotif(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {/* Time Simulation */}
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-title">Modo Simulação Temporal</span>
              <span className="setting-desc">Fixa a data em Julho de 2026 para demonstração técnica.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                id="sim-time-toggle"
                checked={localSimTime}
                onChange={(e) => setLocalSimTime(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div className="settings-footer">
          <button className="btn-primary" id="btn-save-settings" onClick={handleSave}>
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}


// ==========================================================================
// EXCEL COLUMN MAPPER MODAL
// ==========================================================================
interface MapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  excelHeaders: string[];
  onConfirm: (mapping: ColumnMap) => void;
}

export function MapperModal({
  isOpen,
  onClose,
  excelHeaders,
  onConfirm,
}: MapperModalProps) {
  const [mapDate, setMapDate] = useState(0);
  const [mapTime, setMapTime] = useState(1);
  const [mapInstructor, setMapInstructor] = useState(2);
  const [mapSubject, setMapSubject] = useState(3);
  const [mapClass, setMapClass] = useState(4);
  const [mapRoom, setMapRoom] = useState(5);

  // Auto detect columns on load
  useEffect(() => {
    if (isOpen && excelHeaders.length > 0) {
      let detectedDate = -1;
      let detectedTime = -1;
      let detectedInstructor = -1;
      let detectedSubject = -1;
      let detectedClass = -1;
      let detectedRoom = -1;

      excelHeaders.forEach((header, idx) => {
        if (!header) return;
        const text = String(header).toLowerCase().trim();
        
        if (/data|dia|calendario/i.test(text) && detectedDate === -1) detectedDate = idx;
        else if (/horario|turno|periodo|hora|tempo/i.test(text) && detectedTime === -1) detectedTime = idx;
        else if (/instrutor|docente|professor|nome/i.test(text) && detectedInstructor === -1) detectedInstructor = idx;
        else if (/disciplina|unidade curricular|uc|modulo|materia/i.test(text) && detectedSubject === -1) detectedSubject = idx;
        else if (/turma|curso|codigo/i.test(text) && detectedClass === -1) detectedClass = idx;
        else if (/sala|laboratorio|lab|ambiente|local/i.test(text) && detectedRoom === -1) detectedRoom = idx;
      });

      setMapDate(detectedDate !== -1 ? detectedDate : 0);
      setMapTime(detectedTime !== -1 ? detectedTime : Math.min(1, excelHeaders.length - 1));
      setMapInstructor(detectedInstructor !== -1 ? detectedInstructor : Math.min(2, excelHeaders.length - 1));
      setMapSubject(detectedSubject !== -1 ? detectedSubject : Math.min(3, excelHeaders.length - 1));
      setMapClass(detectedClass !== -1 ? detectedClass : Math.min(4, excelHeaders.length - 1));
      setMapRoom(detectedRoom !== -1 ? detectedRoom : Math.min(5, excelHeaders.length - 1));
    }
  }, [isOpen, excelHeaders]);

  const handleConfirm = () => {
    onConfirm({
      date: mapDate,
      time: mapTime,
      instructor: mapInstructor,
      subject: mapSubject,
      class: mapClass,
      room: mapRoom,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" id="mapper-modal" onClick={onClose}>
      <div className="settings-panel mapper-panel" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Mapeamento de Colunas da Planilha</h3>
          <button className="btn-close-modal" id="btn-close-mapper" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="settings-body" style={{ gap: '1.25rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.4', marginBottom: '0.5rem' }}>
            Identificamos as colunas da sua planilha. Selecione qual delas corresponde a cada informação para estruturar o calendário semanal:
          </p>
          
          {/* Coluna de Data */}
          <div className="setting-item" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <div className="setting-info">
              <span className="setting-title">Coluna de Data</span>
              <span className="setting-desc">Ex: "Data", "Dia da Aula", "Dia"</span>
            </div>
            <select 
              id="map-date" 
              className="mapper-select"
              value={mapDate}
              onChange={(e) => setMapDate(parseInt(e.target.value))}
              style={{ width: '200px', padding: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: 'var(--color-bg-hover)' }}
            >
              {excelHeaders.map((header, idx) => (
                <option key={idx} value={idx}>{header} (Coluna {idx + 1})</option>
              ))}
            </select>
          </div>

          {/* Coluna de Horário */}
          <div className="setting-item" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <div className="setting-info">
              <span className="setting-title">Coluna de Horário</span>
              <span className="setting-desc">Ex: "Horário", "Turno", "Período"</span>
            </div>
            <select 
              id="map-time" 
              className="mapper-select"
              value={mapTime}
              onChange={(e) => setMapTime(parseInt(e.target.value))}
              style={{ width: '200px', padding: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: 'var(--color-bg-hover)' }}
            >
              {excelHeaders.map((header, idx) => (
                <option key={idx} value={idx}>{header} (Coluna {idx + 1})</option>
              ))}
            </select>
          </div>

          {/* Coluna de Instrutor */}
          <div className="setting-item" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <div className="setting-info">
              <span className="setting-title">Coluna de Instrutor</span>
              <span className="setting-desc">Ex: "Instrutor", "Docente", "Professor"</span>
            </div>
            <select 
              id="map-instructor" 
              className="mapper-select"
              value={mapInstructor}
              onChange={(e) => setMapInstructor(parseInt(e.target.value))}
              style={{ width: '200px', padding: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: 'var(--color-bg-hover)' }}
            >
              {excelHeaders.map((header, idx) => (
                <option key={idx} value={idx}>{header} (Coluna {idx + 1})</option>
              ))}
            </select>
          </div>

          {/* Coluna de Disciplina */}
          <div className="setting-item" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <div className="setting-info">
              <span className="setting-title">Coluna de Disciplina / UC</span>
              <span className="setting-desc">Ex: "Unidade Curricular", "Disciplina", "Módulo"</span>
            </div>
            <select 
              id="map-subject" 
              className="mapper-select"
              value={mapSubject}
              onChange={(e) => setMapSubject(parseInt(e.target.value))}
              style={{ width: '200px', padding: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: 'var(--color-bg-hover)' }}
            >
              {excelHeaders.map((header, idx) => (
                <option key={idx} value={idx}>{header} (Coluna {idx + 1})</option>
              ))}
            </select>
          </div>

          {/* Coluna de Turma */}
          <div className="setting-item" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            <div className="setting-info">
              <span className="setting-title">Coluna de Turma</span>
              <span className="setting-desc">Ex: "Turma", "Curso", "Código da Turma"</span>
            </div>
            <select 
              id="map-class" 
              className="mapper-select"
              value={mapClass}
              onChange={(e) => setMapClass(parseInt(e.target.value))}
              style={{ width: '200px', padding: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: 'var(--color-bg-hover)' }}
            >
              {excelHeaders.map((header, idx) => (
                <option key={idx} value={idx}>{header} (Coluna {idx + 1})</option>
              ))}
            </select>
          </div>

          {/* Coluna de Sala / Lab */}
          <div className="setting-item" style={{ paddingBottom: '0.25rem' }}>
            <div className="setting-info">
              <span className="setting-title">Coluna de Sala / Laboratório</span>
              <span className="setting-desc">Ex: "Laboratório", "Sala", "Ambiente"</span>
            </div>
            <select 
              id="map-room" 
              className="mapper-select"
              value={mapRoom}
              onChange={(e) => setMapRoom(parseInt(e.target.value))}
              style={{ width: '200px', padding: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', backgroundColor: 'var(--color-bg-hover)' }}
            >
              {excelHeaders.map((header, idx) => (
                <option key={idx} value={idx}>{header} (Coluna {idx + 1})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="settings-footer">
          <button className="btn-primary" id="btn-confirm-mapping" onClick={handleConfirm}>
            Confirmar Mapeamento
          </button>
        </div>
      </div>
    </div>
  );
}


// ==========================================================================
// DRAG & DROP OVERLAY
// ==========================================================================
interface DragDropOverlayProps {
  isDragging: boolean;
}

export function DragDropOverlay({ isDragging }: DragDropOverlayProps) {
  if (!isDragging) return null;

  return (
    <div 
      className="drag-drop-overlay active" 
      id="drag-drop-overlay" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 22, 38, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
    >
      <div 
        className="drag-drop-content" 
        style={{
          textAlign: 'center',
          color: 'white',
          padding: '3rem',
          border: '3px dashed var(--color-blue-primary)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '500px',
          backgroundColor: 'rgba(255,255,255,0.03)',
        }}
      >
        <Upload 
          size={64} 
          style={{
            margin: '0 auto 1.5rem',
            color: 'var(--color-blue-primary)',
            animation: 'floatIcon 2s infinite alternate',
          }} 
        />
        <style>{`
          @keyframes floatIcon {
            from { transform: translateY(0); }
            to { transform: translateY(-8px); }
          }
        `}</style>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>
          Solte o arquivo Excel aqui
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', lineHeight: 1.5 }}>
          Solte o Mapa de Instrutores (.xlsx) para carregar os horários de forma automática.
        </p>
      </div>
    </div>
  );
}
