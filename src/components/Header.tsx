import { useState, useEffect } from 'react';
import { Menu, ChevronDown, Settings, SignalHigh, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { WEEKDAYS_FULL, SIMULATED_WEEKS } from '../data';

interface HeaderProps {
  currentUserKey: string;
  setCurrentUserKey: (key: string) => void;
  currentUserProfile: UserProfile;
  profiles: Record<string, UserProfile>;
  selectedMonth: 'Junho' | 'Julho' | 'Agosto';
  selectedDay: number;
  selectedDayIndex: number;
  simulatedTime: boolean;
  onOpenSettings: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export default function Header({
  currentUserKey,
  setCurrentUserKey,
  currentUserProfile,
  profiles,
  selectedMonth,
  selectedDay,
  selectedDayIndex,
  simulatedTime,
  onOpenSettings,
  onShowToast,
  setSidebarOpen,
  sidebarOpen,
  userEmail,
  onLogout,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Compute dynamic header date
  const getHeaderDate = () => {
    if (simulatedTime) {
      const dayFull = WEEKDAYS_FULL[selectedDayIndex];
      return `${dayFull}, ${selectedDay.toString().padStart(2, '0')} de ${selectedMonth} de 2026`;
    } else {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      let formatted = now.toLocaleDateString('pt-BR', options);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
  };

  const handleUserSelect = (key: string, name: string) => {
    setCurrentUserKey(key);
    setDropdownOpen(false);
    onShowToast(`Simulando: ${name}`, 'success');
  };

  // Close dropdown on document click
  useEffect(() => {
    const handleDocumentClick = () => {
      setDropdownOpen(false);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="mobile-toggle" 
          id="mobile-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(!sidebarOpen);
          }}
        >
          <Menu size={20} />
        </button>
        <div className="greeting-wrapper">
          <h1 className="greeting-title" id="header-greeting">
            Olá, {currentUserProfile.name}!{' '}
            <span className="tag-role">{currentUserProfile.tag}</span>
          </h1>
          <p className="current-date" id="current-date">
            {getHeaderDate()}
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* System Status */}
        <div 
          className="system-status-wrapper hidden sm:flex" 
          title="Todos os sistemas operacionais (Conectado ao SENAI Cloud)"
        >
          <span className="status-text">Status do Sistema</span>
          <div className="signal-bars">
            <span className="bar bar-1 active"></span>
            <span className="bar bar-2 active"></span>
            <span className="bar bar-3 active"></span>
            <span className="bar bar-4 active"></span>
          </div>
        </div>

        {/* User simulation selector dropdown */}
        <div className={`user-sim-selector ${dropdownOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div 
            className="dropdown-trigger" 
            id="dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="sim-user-avatar bg-blue-500 font-bold">
              {currentUserProfile.initials}
            </div>
            <span className="sim-user-name">
              {currentUserProfile.name} ({currentUserProfile.role})
            </span>
            <ChevronDown size={14} className="dropdown-chevron" />
          </div>

          {/* Dropdown Menu */}
          <div className="dropdown-menu" id="dropdown-menu">
            <div className="dropdown-header">
              Simular Usuário
              {userEmail && (
                <span style={{ display: 'block', fontWeight: 400, opacity: 0.7, fontSize: '0.7rem' }}>
                  Logado como {userEmail}
                </span>
              )}
            </div>
            {Object.keys(profiles).map((key) => {
              const u = profiles[key];
              const isActive = key === currentUserKey;
              return (
                <a 
                  key={key} 
                  href="#" 
                  className={`dropdown-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleUserSelect(key, u.name);
                  }}
                >
                  <div className="item-avatar bg-slate-500 text-white font-bold">
                    {u.initials}
                  </div>
                  <div className="item-details">
                    <span className="item-name">{u.name}</span>
                    <span className="item-role">{u.role}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Settings button */}
        <button 
          className="btn-quick-settings" 
          id="btn-quick-settings" 
          title="Configurações Rápidas"
          onClick={onOpenSettings}
        >
          <Settings size={20} />
        </button>

        {/* Logout button */}
        {onLogout && (
          <button
            className="btn-logout"
            title="Sair da conta"
            onClick={onLogout}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
