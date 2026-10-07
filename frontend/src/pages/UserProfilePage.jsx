import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMyResume } from '../services/resumeService';
import SkillBadge from '../components/SkillBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Mail, Shield, Target, FileText, Calendar, Clock, CheckCircle2 } from 'lucide-react';

const UserProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getMyResume();
      if (res.data) setResume(res.data);
    } catch (err) {
      console.error('Error fetching resume for profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile information..." />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>
          User <span className="gradient-text">Profile & Account</span>
        </h1>
        <p style={styles.subtitle}>
          Manage your personal information, career target role, and active resume skills.
        </p>
      </div>

      <div style={styles.grid}>
        {/* Profile Card */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.avatarLarge}>
            <User size={40} color="#f8fafc" />
          </div>
          <h2 style={styles.userName}>{user?.name}</h2>
          <span style={styles.roleBadge}>{user?.role === 'admin' ? 'System Administrator' : 'Student / Developer'}</span>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <Mail size={16} color="#6366f1" />
              <span>Email: <strong>{user?.email}</strong></span>
            </div>
            <div style={styles.infoItem}>
              <Target size={16} color="#06b6d4" />
              <span>Target Role: <strong>{user?.targetRole?.title || 'Not Selected'}</strong></span>
            </div>
            <div style={styles.infoItem}>
              <Shield size={16} color="#10b981" />
              <span>Account Status: <strong>Verified Active</strong></span>
            </div>
          </div>
        </div>

        {/* Active Resume & Skill Summary */}
        <div className="glass-card" style={styles.card}>
          <h3><FileText size={20} color="#6366f1" /> Active Resume Profile</h3>
          {resume ? (
            <div style={styles.resumeDetails}>
              <div style={styles.metaGrid}>
                <div style={styles.metaItem}>
                  <FileText size={16} color="#818cf8" />
                  <span>File: <strong>{resume.fileName}</strong></span>
                </div>
                <div style={styles.metaItem}>
                  <Calendar size={16} color="#06b6d4" />
                  <span>Parsed: <strong>{new Date(resume.parsedDate).toLocaleDateString()}</strong></span>
                </div>
                <div style={styles.metaItem}>
                  <Clock size={16} color="#34d399" />
                  <span>Experience: <strong>{resume.experienceYears} Yrs</strong></span>
                </div>
              </div>

              <div style={styles.skillsSection}>
                <h4>Extracted Technical Skills ({resume.extractedSkills?.length || 0})</h4>
                <div style={styles.badgeWrap}>
                  {resume.extractedSkills?.map((s) => (
                    <SkillBadge key={s._id || s.skillName} skillName={s.skillName} category={s.category} status="matched" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FileText size={40} color="#475569" />
              <p>No active resume uploaded yet. Go to Resume Upload page to add your resume.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  avatarLarge: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userName: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: '800',
  },
  roleBadge: {
    alignSelf: 'center',
    padding: '0.3rem 0.85rem',
    borderRadius: '20px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.9rem',
    color: '#cbd5e1',
  },
  resumeDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  metaGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    padding: '0.85rem',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '10px',
    fontSize: '0.85rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  skillsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  badgeWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  emptyState: {
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '0.75rem',
    color: '#64748b',
  },
};

export default UserProfilePage;
