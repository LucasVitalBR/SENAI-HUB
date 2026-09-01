import { 
  LayoutDashboard, 
  School, 
  Clock, 
  Building2, 
  Truck, 
  Wrench, 
  Megaphone, 
  BookOpen,
  CheckSquare
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserProfile: UserProfile;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentUserProfile, 
  onShowToast,
  sidebarOpen,
  setSidebarOpen
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'unidade', name: 'Unidade Naviraí', icon: School },
    { id: 'horarios', name: 'Horários', icon: Clock },
    { id: 'laboratorios', name: 'Laboratórios', icon: Building2 },
    { id: 'frota', name: 'Frota de Veículos', icon: Truck },
    { id: 'manutencao', name: 'Manutenção', icon: Wrench },
    { id: 'comunicados', name: 'Comunicados', icon: Megaphone },
  ];

  const handleTabClick = (itemId: string, itemName: string) => {
    setActiveTab(itemId);
    setSidebarOpen(false);
    if (itemId === 'dashboard') {
      onShowToast('Visualizando o Dashboard Principal', 'success');
    } else if (itemId === 'unidade') {
      onShowToast('Carregando Informações da Unidade Naviraí', 'success');
    } else if (itemId === 'horarios') {
      onShowToast('Carregando Grade Geral de Horários', 'success');
    } else if (itemId === 'laboratorios') {
      onShowToast('Carregando Reservas de Laboratórios', 'success');
    } else if (itemId === 'frota') {
      onShowToast('Carregando Frota de Veículos', 'success');
    } else if (itemId === 'manutencao') {
      onShowToast('Carregando Painel de Manutenção e TI', 'success');
    } else if (itemId === 'comunicados') {
      onShowToast('Carregando Mural de Comunicados', 'success');
    } else {
      onShowToast(`Carregando Módulo: ${itemName}`, 'success');
    }
  };

  return (
    <aside id="sidebar" className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          {/* Custom brand icon using lucide */}
          <School size={20} className="text-white" />
        </div>
        <div className="brand-text">
          <span className="brand-title">NAVIRAÍ HUB</span>
          <span className="brand-subtitle">SENAI CONNECT</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li 
                key={item.id} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(item.id, item.name)}
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <IconComponent size={20} />
                  <span>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile Footer */}
      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <div className="avatar-container">
            <img 
              src={currentUserProfile.avatar} 
              alt={currentUserProfile.name} 
              className="user-avatar"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${currentUserProfile.initials}`;
              }}
            />
            <span className="status-indicator online"></span>
          </div>
          <div className="user-info">
            <span className="user-name">{currentUserProfile.name}</span>
            <span className="user-role">{currentUserProfile.role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
