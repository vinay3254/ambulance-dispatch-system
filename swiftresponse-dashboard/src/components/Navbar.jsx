import { NavLink } from 'react-router-dom';
import { Menu, Plus, RefreshCw, Bell, Maximize, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { incidents, ambulances } = useAppContext();

  const pendingCount = incidents?.filter(i => i.status === 'Pending').length || 0;
  const availableCount = ambulances?.filter(a => a.status === 'Available').length || 0;
  const activeCount = incidents?.filter(i => i.status === 'Active' || i.status === 'Acknowledged').length || 0;
  const notificationCount = pendingCount;

  return (
    <nav
      style={{
        height: '64px',
        backgroundColor: '#060b14',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Plus size={24} style={{ color: 'var(--red)', strokeWidth: 2.5, transform: 'rotate(45deg)' }} />
          <span
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            SwiftResponse
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--green)',
              boxShadow: '0 0 8px var(--green)',
            }}
          />
          <span
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
            }}
          >
            System Online
          </span>
        </div>
      </div>

      {/* Center Section - Nav Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[
          { path: '/', label: 'Map View' },
          { path: '/tracking', label: 'Mobile Tracking' },
          { path: '/analytics', label: 'Analytics' },
          { path: '/ai-insights', label: 'AI Insights' },
        ].map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            style={({ isActive }) => ({
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '1.25rem 1rem',
              borderBottom: isActive ? '2px solid var(--red)' : '2px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <span
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--red)',
                letterSpacing: '0.05em',
              }}
            >
              PENDING
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--red)',
                minWidth: '1.25rem',
                textAlign: 'center',
              }}
            >
              {pendingCount}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            <span
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--green)',
                letterSpacing: '0.05em',
              }}
            >
              AVAILABLE
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--green)',
                minWidth: '1.25rem',
                textAlign: 'center',
              }}
            >
              {availableCount}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <span
              style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--blue)',
                letterSpacing: '0.05em',
              }}
            >
              ACTIVE
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--blue)',
                minWidth: '1.25rem',
                textAlign: 'center',
              }}
            >
              {activeCount}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '32px',
            backgroundColor: 'var(--border)',
          }}
        />

        {/* Action Icons */}
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          title="Refresh Data"
        >
          <RefreshCw size={18} />
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          title="Notifications"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'var(--red)',
                color: '#fff',
                fontSize: '0.625rem',
                fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                borderRadius: '9999px',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 0 8px var(--red)',
              }}
            >
              {notificationCount}
            </span>
          )}
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          title="Fullscreen"
        >
          <Maximize size={18} />
        </button>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '32px',
            backgroundColor: 'var(--border)',
          }}
        />

        {/* User Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <User
            size={20}
            style={{
              color: 'var(--text-secondary)',
            }}
          />
          <span
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            Dispatcher
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
