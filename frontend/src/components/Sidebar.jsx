import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Target,
  BarChart3,
  Award,
  Map,
  BookOpen,
  LineChart,
  ShieldCheck,
  FolderPlus,
  MessageSquareCode,
  X,
  Sparkles,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useContext(AuthContext);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'User Profile', icon: User },
    { path: '/resume-upload', label: 'Resume Upload', icon: FileText },
    { path: '/target-role', label: 'Target Job Role', icon: Target },
    { path: '/skill-gap', label: 'Skill Gap Analysis', icon: BarChart3 },
    { path: '/job-readiness', label: 'Readiness & ATS', icon: Award },
    { path: '/career-roadmap', label: 'Career Roadmap', icon: Map },
    { path: '/project-generator', label: 'Build Project', icon: FolderPlus },
    { path: '/mock-interview', label: 'AI Mock Interview', icon: MessageSquareCode },
    { path: '/recommendations', label: 'Recommendations', icon: BookOpen },
    { path: '/progress-tracking', label: 'Progress Tracking', icon: LineChart },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin-dashboard', label: 'Admin Dashboard', icon: ShieldCheck });
  }

  const renderNavLinks = () => (
    <div style={styles.navGroup}>
      <span style={styles.groupHeader}>CAREER INTELLIGENCE</span>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (onClose) onClose();
            }}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.activeLink : {}),
            })}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on >= 900px) */}
      <aside className="desktop-sidebar" style={styles.aside}>
        {renderNavLinks()}
      </aside>

      {/* Mobile Drawer Overlay (visible when toggled on < 900px) */}
      <div
        className={`mobile-drawer-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`mobile-drawer ${isOpen ? 'active' : ''}`}>
        <div className="mobile-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#137C73" />
            <span style={{ fontWeight: '800', color: '#0B4F4A', fontSize: '1.05rem' }}>
              SkillGap <span style={{ color: '#FF7568' }}>AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            aria-label="Close navigation menu"
          >
            <X size={20} color="#536B67" />
          </button>
        </div>
        <div style={{ padding: '1.25rem 0.85rem' }}>
          {renderNavLinks()}
        </div>
      </div>
    </>
  );
};

const styles = {
  aside: {
    width: '240px',
    background: '#FFFFFF',
    borderRight: '1px solid rgba(11, 79, 74, 0.12)',
    padding: '1.5rem 0.85rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    flexShrink: 0,
    boxShadow: '2px 0 10px rgba(11, 79, 74, 0.02)',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  groupHeader: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#7F9793',
    letterSpacing: '0.08em',
    paddingLeft: '0.75rem',
    marginBottom: '0.5rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.85rem',
    borderRadius: '10px',
    color: '#536B67',
    fontSize: '0.86rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  activeLink: {
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(184, 242, 230, 0.5)',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    padding: '0.4rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Sidebar;
