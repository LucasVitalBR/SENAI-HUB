import { useState, useEffect, useRef } from 'react';
import { Bell, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { NoticeItem } from '../types';
import { NOTICES_DATA } from '../data';

export default function NoticeBanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'high' | 'normal'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Filter notices based on search query and urgency filter
  const filteredNotices = NOTICES_DATA.filter((notice) => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      urgencyFilter === 'all' || 
      (urgencyFilter === 'high' && notice.urgency === 'high') ||
      (urgencyFilter === 'normal' && notice.urgency === 'normal');

    return matchesSearch && matchesFilter;
  });

  // Adjust active index if it exceeds filtered length
  useEffect(() => {
    if (currentIndex >= filteredNotices.length) {
      setCurrentIndex(0);
    }
  }, [filteredNotices.length, currentIndex]);

  // Set up carousel autoplay
  useEffect(() => {
    if (filteredNotices.length <= 1 || isHovered) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }

    autoPlayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredNotices.length);
    }, 6000);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [filteredNotices.length, isHovered]);

  const handlePrev = () => {
    if (filteredNotices.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + filteredNotices.length) % filteredNotices.length);
  };

  const handleNext = () => {
    if (filteredNotices.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % filteredNotices.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="card notice-banner">
      <div className="notice-header">
        <div className="notice-title-wrapper">
          <div className="bell-icon-wrapper">
            <Bell size={20} className="bell-animated" />
          </div>
          <h2>CENTRAL DE AVISOS</h2>
        </div>
        <div className="notice-controls">
          {/* Search Box */}
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar avisos..." 
              id="search-notices"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Urgency Filters */}
          <div className="urgency-filter">
            <button 
              className={`filter-btn ${urgencyFilter === 'all' ? 'active' : ''}`}
              onClick={() => setUrgencyFilter('all')}
            >
              Todos
            </button>
            <button 
              className={`filter-btn ${urgencyFilter === 'high' ? 'active' : ''}`}
              onClick={() => setUrgencyFilter('high')}
            >
              Urgentes
            </button>
            <button 
              className={`filter-btn ${urgencyFilter === 'normal' ? 'active' : ''}`}
              onClick={() => setUrgencyFilter('normal')}
            >
              Gerais
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div 
        className="carousel-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="carousel-track" id="carousel-track">
          {filteredNotices.length === 0 ? (
            <div className="carousel-item active" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ color: 'var(--color-text-light)' }}>Nenhum aviso encontrado</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
                Tente ajustar sua busca ou filtros de urgência.
              </p>
            </div>
          ) : (
            filteredNotices.map((notice, idx) => {
              const isActive = idx === currentIndex;
              const badgeClass = notice.urgency === 'high' ? 'urgente' : 'geral';
              const badgeText = notice.urgency === 'high' ? 'Urgente' : 'Informativo';
              
              return (
                <div 
                  key={notice.id} 
                  className={`carousel-item ${isActive ? 'active' : ''}`}
                  style={{ display: isActive ? 'flex' : 'none' }}
                >
                  <div className="notice-meta">
                    <span className={`notice-badge ${badgeClass}`}>{badgeText}</span>
                    <span className="notice-time">{notice.time}</span>
                  </div>
                  <h3>{notice.title}</h3>
                  <p title={notice.content}>{notice.content}</p>
                </div>
              );
            })
          )}
        </div>

        {filteredNotices.length > 1 && (
          <>
            <button className="carousel-nav prev" id="carousel-prev" onClick={handlePrev}>
              <ChevronLeft size={20} />
            </button>
            <button className="carousel-nav next" id="carousel-next" onClick={handleNext}>
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {filteredNotices.length > 1 && (
          <div className="carousel-indicators" id="carousel-indicators">
            {filteredNotices.map((_, idx) => (
              <span 
                key={idx}
                className={`indicator-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
