import { useState } from 'react';
import { Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const { getFilteredIncidents, selectIncident, selectedIncident, filter, setFilter } = useAppContext();
  const filteredIncidents = getFilteredIncidents();

  const getSeverityColor = (severity) => {
    const colors = {
      'Critical': 'var(--red)',
      'High': 'var(--amber)',
      'Medium': 'var(--blue)',
      'Low': 'var(--green)'
    };
    return colors[severity] || 'var(--text-secondary)';
  };

  const getTimeElapsed = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 1000); // seconds
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleTabClick = (tab) => {
    setFilter(tab);
  };

  return (
    <div 
      className="sidebar"
      style={{
        width: '320px',
        height: 'calc(100vh - 64px)',
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: '64px'
      }}
    >
      {/* Header */}
      <div 
        style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600,
              fontFamily: 'Sora, sans-serif',
              color: 'var(--text-primary)'
            }}>
              Incidents
            </h2>
            <span 
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '0.125rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              {filteredIncidents.length}
            </span>
          </div>
          <button 
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div 
          style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '1rem',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.5rem'
          }}
        >
          {['ACTIVE', 'PENDING', 'ALL'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.813rem',
                fontWeight: 600,
                fontFamily: 'Sora, sans-serif',
                color: filter === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                position: 'relative',
                padding: '0.25rem 0',
                transition: 'color 0.2s'
              }}
            >
              {tab}
              {filter === tab && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--cyan)',
                    borderRadius: '2px'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.75rem'
        }}
      >
        {filteredIncidents.map((incident) => {
          const isCritical = incident.severity === 'Critical';
          const isSelected = selectedIncident?.id === incident.id;

          return (
            <div
              key={incident.id}
              onClick={() => selectIncident(incident)}
              style={{
                background: isSelected ? 'var(--bg-card)' : 'transparent',
                border: '1px solid var(--border)',
                borderLeft: isCritical ? `3px solid ${getSeverityColor('critical')}` : '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.875rem',
                marginBottom: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isCritical ? '0 0 20px rgba(239, 68, 68, 0.3)' : 'none',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.borderColor = 'var(--border-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isSelected ? 'var(--bg-card)' : 'transparent';
                e.currentTarget.style.borderColor = 'var(--border)';
                if (isCritical) {
                  e.currentTarget.style.borderLeftColor = getSeverityColor('Critical');
                }
              }}
            >
              {/* Type Badge */}
              <div style={{ marginBottom: '0.5rem' }}>
                <span 
                  style={{
                    fontSize: '0.688rem',
                    fontWeight: 600,
                    fontFamily: 'Sora, sans-serif',
                    color: 'var(--cyan)',
                    background: 'rgba(6, 182, 212, 0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {incident.type}
                </span>
              </div>

              {/* Severity Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getSeverityColor(incident.severity),
                    animation: isCritical ? 'pulse 2s infinite' : 'none'
                  }}
                />
                <span 
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    fontFamily: 'Sora, sans-serif',
                    color: getSeverityColor(incident.severity),
                    textTransform: 'capitalize'
                  }}
                >
                  {incident.severity}
                </span>
              </div>

              {/* Location */}
              <div style={{ marginBottom: '0.5rem' }}>
                <p 
                  style={{
                    fontSize: '0.813rem',
                    fontFamily: 'Sora, sans-serif',
                    color: 'var(--text-primary)',
                    lineHeight: '1.4'
                  }}
                >
                  {incident.location}
                </p>
              </div>

              {/* Status and Time */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.625rem' }}>
                <span 
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase'
                  }}
                >
                  {incident.status}
                </span>
                <span 
                  style={{
                    fontSize: '0.688rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-muted)'
                  }}
                >
                  {getTimeElapsed(incident.timestamp)}
                </span>
              </div>

              {/* Incident ID */}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <span 
                  style={{
                    fontSize: '0.688rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-muted)'
                  }}
                >
                  {incident.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
