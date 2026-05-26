import React, { useState, createContext, useContext } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Admin.css';

// ─── Auth Context ────────────────────────────────────────────────────────────
const AdminAuthContext = createContext(null);
export const useAdminAuth = () => useContext(AdminAuthContext);

// ─── Login Page ──────────────────────────────────────────────────────────────
const AdminLogin = ({ onLogin }) => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    if (creds.username === 'admin' && creds.password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid credentials. Use admin / admin123');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="admin-login-logo">
          <motion.div
            className="logo-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            🏠
          </motion.div>
          <h1>Propex Admin</h1>
          <p>Property Management Dashboard</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="admin-login-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="admin"
                value={creds.username}
                onChange={e => setCreds(p => ({ ...p, username: e.target.value }))}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={creds.password}
                onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? '⏳ Authenticating…' : '🚀 Access Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Sidebar Nav Items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Overview', icon: '📊', path: '/admin', exact: true },
  { label: 'Hero Section', icon: '🖼️', path: '/admin/hero' },
  { label: 'Featured Properties', icon: '⭐', path: '/admin/featured' },
  { label: 'All Properties', icon: '🏠', path: '/admin/listings' },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">🏠</div>
        <div className="admin-sidebar-brand">
          <h2>Propex</h2>
          <span>Admin Panel</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-nav-section-title">Navigation</div>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-link ${isActive(item) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}

        <div className="admin-nav-section-title" style={{ marginTop: 24 }}>Site</div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-nav-link"
        >
          <span className="nav-icon">🌐</span>
          <span className="nav-label">View Website</span>
        </a>
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={onLogout}>
          <span style={{ fontSize: 18 }}>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

// ─── Top Bar ──────────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  '/admin': { title: 'Dashboard', desc: 'Overview of your real estate platform' },
  '/admin/hero': { title: 'Hero Section', desc: 'Manage homepage hero carousel slides' },
  '/admin/featured': { title: 'Featured Properties', desc: 'Choose which properties to spotlight' },
  '/admin/listings': { title: 'All Properties', desc: 'Add, edit and manage all property listings' },
};

const AdminTopbar = () => {
  const location = useLocation();
  const meta = Object.entries(PAGE_TITLES).find(([key]) =>
    location.pathname === key || (key !== '/admin' && location.pathname.startsWith(key))
  )?.[1] || { title: 'Admin', desc: '' };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-title">
        <h1>{meta.title}</h1>
        <p>{meta.desc}</p>
      </div>
      <div className="admin-topbar-actions">
        <div className="admin-user-chip">
          <div className="admin-user-avatar">A</div>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
};

// ─── Main Layout ─────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('propex_admin_auth') === 'true';
  });

  const handleLogin = () => {
    sessionStorage.setItem('propex_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('propex_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminAuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout }}>
        <AdminLogin onLogin={handleLogin} />
      </AdminAuthContext.Provider>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, handleLogin, handleLogout }}>
      <div className="admin-root">
        <AdminSidebar onLogout={handleLogout} />
        <div className="admin-main">
          <AdminTopbar />
          <main className="admin-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
};

export default AdminLayout;
