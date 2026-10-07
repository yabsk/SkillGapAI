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
} from 'lucide-react';

const Sidebar = () => {
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

  return (
    <aside style={styles.aside}>
      <div style={styles.navGroup}>
        <span style={styles.groupHeader}>CAREER INTELLIGENCE</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
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
    </aside>
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
};

export default Sidebar;
