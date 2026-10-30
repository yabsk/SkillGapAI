import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, LogOut, User as UserIcon, Shield, Target, Menu, X } from 'lucide-react';

const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav} className="navbar-container">
      <div style={styles.brandContainer}>
        {isAuthenticated && (
          <button
            onClick={onToggleMobileMenu}
            className="mobile-nav-toggle"
            aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            title="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}

        <Link to={isAuthenticated ? '/dashboard' : '/'} style={styles.logoLink}>
          <div style={styles.logoIcon}>
            <Sparkles size={20} color="#137C73" />
          </div>
          <span style={styles.logoText}>
            SkillGap <span style={styles.logoAccent}>AI</span>
          </span>
        </Link>
      </div>

      <div style={styles.navActions} className="nav-actions">
        {isAuthenticated ? (
          <>
            {user?.targetRole && (
              <div style={styles.targetBadge} className="nav-target-badge">
                <Target size={13} color="#137C73" />
                <span style={styles.targetBadgeText}>
                  {user.targetRole.title || user.targetRole}
                </span>
              </div>
            )}

            {isAdmin && (
              <span style={styles.adminBadge} className="nav-admin-badge">
                <Shield size={13} /> Admin
              </span>
            )}

            <div style={styles.userInfo} className="nav-user-info">
              <div style={styles.avatar}>
                <UserIcon size={16} color="#FFFFFF" />
              </div>
              <div style={styles.userText} className="nav-user-text">
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.userEmail} className="nav-user-email">{user.email}</span>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary" style={styles.logoutBtn} title="Logout">
              <LogOut size={15} />
              <span className="logout-text">Logout</span>
            </button>
          </>
        ) : (
          <div style={styles.guestButtons}>
            <Link to="/login" className="btn-secondary" style={styles.guestBtn}>
              Sign In
            </Link>
            <Link to="/register" className="btn-primary" style={styles.guestBtn}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.85rem 2rem',
    background: '#FFFFFF',
    borderBottom: '1px solid rgba(11, 79, 74, 0.12)',
    boxShadow: '0 2px 10px rgba(11, 79, 74, 0.04)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: '#B8F2E6',
    border: '1px solid rgba(19, 124, 115, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.35rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    color: '#0B4F4A',
  },
  logoAccent: {
    color: '#FF7568',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  targetBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    background: '#B8F2E6',
    border: '1px solid rgba(19, 124, 115, 0.3)',
    fontSize: '0.82rem',
    color: '#0B4F4A',
  },
  adminBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    background: 'rgba(255, 117, 104, 0.15)',
    border: '1px solid rgba(255, 117, 104, 0.3)',
    fontSize: '0.78rem',
    color: '#FF7568',
    fontWeight: '600',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#0B4F4A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userText: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.82rem',
  },
  userName: {
    fontWeight: '600',
    color: '#243331',
  },
  userEmail: {
    color: '#536B67',
    fontSize: '0.75rem',
  },
  logoutBtn: {
    padding: '0.5rem 0.85rem',
    fontSize: '0.85rem',
  },
  guestButtons: {
    display: 'flex',
    gap: '0.75rem',
  },
};

export default Navbar;
