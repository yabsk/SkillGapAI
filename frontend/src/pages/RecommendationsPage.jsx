import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../services/recommendationsService';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Award, Code, FolderGit2, ExternalLink, Clock, Sparkles } from 'lucide-react';

const RecommendationsPage = () => {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'certifications' | 'coding' | 'projects'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecs();
  }, []);

  const fetchRecs = async () => {
    try {
      const recs = await getRecommendations();
      setData(recs);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Curating personalized learning recommendations..." />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>
          Targeted <span className="gradient-text">Learning Recommendations</span>
        </h1>
        <p style={styles.subtitle}>
          Tailored online courses, professional certifications, coding practice paths, and portfolio projects to address your skill gaps.
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        <button
          onClick={() => setActiveTab('courses')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'courses' ? styles.activeTab : {}),
          }}
        >
          <BookOpen size={16} /> Course Recommendations ({data?.courses?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('certifications')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'certifications' ? styles.activeTab : {}),
          }}
        >
          <Award size={16} /> Certifications ({data?.certifications?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('coding')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'coding' ? styles.activeTab : {}),
          }}
        >
          <Code size={16} /> Coding Practice ({data?.codingPractices?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'projects' ? styles.activeTab : {}),
          }}
        >
          <FolderGit2 size={16} /> Portfolio Projects ({data?.projects?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div style={styles.cardGrid}>
            {data?.courses?.map((c, idx) => (
              <div key={c._id || idx} className="glass-card" style={styles.recCard}>
                <div style={styles.badgeRow}>
                  <span style={styles.skillTag}>{c.skillName}</span>
                  <span style={styles.platformBadge}>{c.platform}</span>
                </div>
                <h3 style={styles.title}>{c.title}</h3>
                <div style={styles.metaRow}>
                  <span><Clock size={14} /> Est. {c.estimatedHours || 20} Hours</span>
                </div>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={styles.actionBtn}>
                  Enroll / View Course <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div style={styles.cardGrid}>
            {data?.certifications?.map((cert, idx) => (
              <div key={cert._id || idx} className="glass-card" style={styles.recCard}>
                <div style={styles.badgeRow}>
                  <span style={styles.skillTag}>{cert.skillName}</span>
                  <span style={styles.diffTag}>{cert.difficulty || 'Professional'}</span>
                </div>
                <h3 style={styles.title}>{cert.title}</h3>
                <p style={styles.providerText}>Issuing Provider: <strong>{cert.provider}</strong></p>
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={styles.actionBtn}>
                  Exam Details & Certify <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* CODING PRACTICE TAB */}
        {activeTab === 'coding' && (
          <div style={styles.cardGrid}>
            {data?.codingPractices?.map((code, idx) => (
              <div key={code._id || idx} className="glass-card" style={styles.recCard}>
                <div style={styles.badgeRow}>
                  <span style={styles.skillTag}>{code.skillName}</span>
                  <span style={styles.platformBadge}>{code.platform}</span>
                </div>
                <h3 style={styles.title}>{code.title}</h3>
                <div style={styles.metaRow}>
                  <span><Clock size={14} /> Est. {code.estimatedHours || 15} Hours</span>
                </div>
                <a href={code.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={styles.actionBtn}>
                  Start Practice Problems <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div style={styles.cardGrid}>
            {data?.projects?.map((p, idx) => (
              <div key={p._id || idx} className="glass-card" style={styles.recCard}>
                <div style={styles.badgeRow}>
                  <span style={styles.skillTag}>{p.skillName}</span>
                  <span style={styles.diffTag}>{p.difficultyLevel || 'Intermediate'}</span>
                </div>
                <h3 style={styles.title}>{p.title}</h3>
                <p style={styles.descText}>{p.description}</p>
                <div style={styles.techStackWrap}>
                  {p.techStack?.map((t, i) => (
                    <span key={i} style={styles.techBadge}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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
  tabRow: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '0.75rem',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.1rem',
    borderRadius: '10px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#94a3b8',
    fontSize: '0.88rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    background: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
    color: '#818cf8',
  },
  tabContent: {
    marginTop: '0.5rem',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  recCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillTag: {
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  platformBadge: {
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    background: 'rgba(6, 182, 212, 0.15)',
    color: '#38bdf8',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  diffTag: {
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '700',
    lineHeight: 1.3,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.82rem',
    color: '#64748b',
  },
  providerText: {
    fontSize: '0.85rem',
    color: '#94a3b8',
  },
  descText: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    lineHeight: 1.4,
  },
  techStackWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
    marginTop: 'auto',
  },
  techBadge: {
    fontSize: '0.72rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#cbd5e1',
  },
  actionBtn: {
    marginTop: 'auto',
    width: '100%',
    padding: '0.65rem',
    fontSize: '0.85rem',
  },
};

export default RecommendationsPage;
