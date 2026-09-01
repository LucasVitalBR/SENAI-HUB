import React from 'react';
import { 
  Building2, 
  ChevronRight, 
  Clock, 
  Plus, 
  Users 
} from 'lucide-react';
import { LabItem } from '../types';
import { WEEKDAYS_FULL } from '../data';

interface LabsCardProps {
  labsList: LabItem[];
  selectedDayIndex: number;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export default function LabsCard({
  labsList,
  selectedDayIndex,
  onShowToast,
}: LabsCardProps) {
  const dayNameShort = WEEKDAYS_FULL[selectedDayIndex].split('-')[0];

  // Calculate dynamic occupancy rate
  const occupiedCount = labsList.filter((lab) => lab.status === 'ocupado').length;
  const totalLabs = labsList.length || 3;
  const rate = Math.round((occupiedCount / totalLabs) * 100);

  // Get progress bar color based on rate
  const getProgressBarColor = () => {
    if (rate >= 80) return 'linear-gradient(90deg, var(--color-status-occupied), var(--color-status-danger))';
    if (rate >= 40) return 'linear-gradient(90deg, var(--color-blue-primary), var(--color-status-occupied))';
    return 'linear-gradient(90deg, var(--color-status-online), var(--color-blue-primary))';
  };

  const handleSpacesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onShowToast('Carregando mapa de espaços físicos...', 'info');
  };

  const handleRequestLabClick = () => {
    onShowToast('Selecione um laboratório para solicitar reserva.', 'info');
  };

  return (
    <section className="card labs-card">
      <div className="labs-header">
        <div className="labs-title-group">
          <h2>AGENDA DE LABS</h2>
          <span className="occupancy-indicator" id="labs-occupancy-day">
            Ocupação para {dayNameShort}
          </span>
        </div>
        <a href="#" className="spaces-link" id="link-view-spaces" onClick={handleSpacesClick}>
          <span>Espaços</span>
          <ChevronRight size={14} className="-rotate-45" />
        </a>
      </div>

      {/* Labs Occupancy Progress Bar */}
      <div className="labs-occupancy-progress">
        <div className="progress-info">
          <span>Taxa de Ocupação</span>
          <span className="progress-percent" id="occupancy-rate">
            {rate}%
          </span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            id="occupancy-progress-bar" 
            style={{ 
              width: `${rate}%`,
              background: getProgressBarColor()
            }}
          />
        </div>
      </div>

      {/* Labs List */}
      <div className="labs-list" id="labs-list">
        {labsList.map((lab, index) => {
          const isOcupado = lab.status === 'ocupado';
          return (
            <div key={index} className="lab-card">
              <div className="lab-card-header">
                <div className="lab-title-wrapper">
                  <span className="lab-name">{lab.name}</span>
                  <span className="lab-capacity">
                    Capacidade: <strong>{lab.cap} alunos</strong>
                  </span>
                </div>
                <span className={`status-tag ${isOcupado ? 'ocupado' : 'livre'}`}>
                  {isOcupado ? 'Ocupado' : 'Livre'}
                </span>
              </div>
              
              <div className="lab-details">
                <div className="lab-meta-item">
                  <Users size={14} />
                  <span>
                    Responsável: <strong>{lab.resp}</strong>
                  </span>
                </div>
                <div className="lab-meta-item">
                  <Clock size={14} />
                  <span>Alocações no Dia:</span>
                </div>
                
                <div className="lab-schedules-list">
                  {isOcupado && lab.schedules && lab.schedules.length > 0 ? (
                    lab.schedules.map((schedule, sIdx) => (
                      <span key={sIdx} className="lab-schedule-time" title={schedule}>
                        {schedule}
                      </span>
                    ))
                  ) : (
                    <span className="lab-schedule-time" style={{ color: 'var(--color-status-online)', fontWeight: 600 }}>
                      Disponível para reservas
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action button */}
      <button 
        className="btn-action-secondary" 
        id="btn-request-lab"
        onClick={handleRequestLabClick}
      >
        <Plus size={18} />
        <span>Solicitar Reserva de Lab</span>
      </button>
    </section>
  );
}
