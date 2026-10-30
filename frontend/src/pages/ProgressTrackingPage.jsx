import React, { useState, useEffect } from 'react';
import { getMyRoadmap } from '../services/roadmapService';
import ProgressGauge from '../components/ProgressGauge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Map, CheckCircle2, Clock, Award, BarChart3 } from 'lucide-react';

const ProgressTrackingPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await getMyRoadmap();
      if (res.data) setRoadmap(res.data);
    } catch (err) {
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating learning progress stats..." />;

  const milestones = roadmap?.milestones || [];
  const completedCount = milestones.filter((m) => m.status === 'Completed').length;
  const totalCount = milestones.length;
  const progressPct = roadmap?.overallProgress || 0;

  // Estimate total hours from resources
  let totalHours = 0;
  let completedHours = 0;

  milestones.forEach((m) => {
    let mHours = 0;
    if (m.resources) {
      m.resources.forEach((r) => { mHours += r.estimatedHours || 10; });
    }
    totalHours += mHours;
    if (m.status === 'Completed') completedHours += mHours;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>
          Learning & <span className="gradient-text">Progress Tracking</span>
        </h1>
        <p style={styles.subtitle}>
          Track your milestone completion rate, study time estimates, and skill mastery status.
        </p>
      </div>

      {roadmap ? (
        <div style={styles.grid}>
          {/* Progress Overview Card */}
          <div className="glass-card" style={styles.scoreCard}>
            <h3>Overall Skill Mastery</h3>
            <div style={{ margin: '1.5rem 0' }}>
              <ProgressGauge percentage={progressPct} label="Milestones Complete" size={170} />
            </div>
            <div style={styles.statsSummary}>
              <div>
                <span style={styles.statVal}>{completedCount} / {totalCount}</span>
                <span style={styles.statLabel}>Completed Steps</span>
              </div>
              <div style={styles.divider} />
              <div>
                <span style={styles.statVal}>{completedHours} / {totalHours}</span>
                <span style={styles.statLabel}>Study Hours Done</span>
              </div>
            </div>
          </div>

          {/* Detailed Milestone Progression */}
          <div className="glass-card" style={styles.card}>
            <h3><BarChart3 size={20} color="#6366f1" /> Skill Mastery Timeline</h3>

            <div style={styles.timelineList}>
              {milestones.map((m, idx) => {
                const isDone = m.status === 'Completed';
                const sName = m.skill?.skillName || `Skill #${idx + 1}`;

                return (
                  <div key={m._id || idx} style={styles.timelineItem}>
                    <div style={{ ...styles.iconWrap, background: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.1)' }}>
                      <CheckCircle2 size={18} color={isDone ? '#34d399' : '#64748b'} />
                    </div>
                    <div style={styles.timelineContent}>
                      <div style={styles.timelineRow}>
                        <strong style={{ color: isDone ? '#34d399' : '#f8fafc' }}>
                          Step {idx + 1}: {sName}
                        </strong>
                        <span style={isDone ? styles.doneTag : styles.pendingTag}>
                          {isDone ? 'Mastered' : 'In Progress'}
                        </span>
                      </div>
                      <span style={styles.subText}>
                        Category: {m.skill?.category || 'General'} | Resources: {m.resources?.length || 0} | Projects: {m.projects?.length || 0}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyCard}>
          <Map size={48} color="#6366f1" />
          <h3>No Active Roadmap History</h3>
          <p style={styles.subtitle}>Generate a career roadmap to start tracking your learning progress.</p>
        </div>
      )}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
  },
  scoreCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
  },
  statsSummary: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(11, 79, 74, 0.1)',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  statVal: {
    display: 'block',
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#536B67',
  },
  divider: {
    width: '1px',
    background: 'rgba(11, 79, 74, 0.12)',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  timelineItem: {
    display: 'flex',
    gap: '0.85rem',
    alignItems: 'flex-start',
    padding: '0.85rem',
    background: '#FAF8F2',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
  },
  iconWrap: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
  },
  timelineRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  subText: {
    fontSize: '0.78rem',
    color: '#64748b',
  },
  doneTag: {
    fontSize: '0.72rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '10px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    fontWeight: '600',
  },
  pendingTag: {
    fontSize: '0.72rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '10px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    fontWeight: '600',
  },
  emptyCard: {
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
  },
};

export default ProgressTrackingPage;
