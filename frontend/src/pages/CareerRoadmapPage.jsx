import React, { useState, useEffect } from 'react';
import { generateCareerRoadmap, getMyRoadmap, updateMilestoneStatus } from '../services/roadmapService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Map, Sparkles, BookOpen, Code, ExternalLink, CheckCircle2, Circle, Clock, ArrowRight, Zap } from 'lucide-react';

const CareerRoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await getMyRoadmap();
      if (res.data) {
        setRoadmap(res.data);
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    try {
      const res = await generateCareerRoadmap();
      if (res.success && res.data) {
        setRoadmap(res.data);
      }
    } catch (err) {
      console.error('Error generating roadmap:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleMilestone = async (skillId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await updateMilestoneStatus(skillId, nextStatus);
      if (res.success && res.data) {
        setRoadmap(res.data);
      }
    } catch (err) {
      console.error('Error updating milestone:', err);
    }
  };

  if (loading) return <LoadingSpinner message="Building your smart career roadmap..." />;

  const milestones = roadmap?.milestones || [];
  const progress = roadmap?.overallProgress || 0;

  // Stages definition for Task 6
  const stages = [
    { name: 'FOUNDATION', desc: 'Core Syntax & Basics' },
    { name: 'CORE SKILLS', desc: 'Frameworks & Databases' },
    { name: 'PROJECT BUILDING', desc: 'Real-World Microservices' },
    { name: 'INTERVIEW PREPARATION', desc: 'System Design & Debugging' },
    { name: 'JOB READY', desc: 'ATS Resume & Employability' },
  ];

  // Identify next uncompleted step for "Your Next Best Step" callout
  const nextStep = milestones.find((m) => m.status !== 'Completed') || milestones[0];

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2>Smart Personalized Career Roadmap</h2>
          <p style={styles.subtitle}>
            Target Role: <strong>{roadmap?.targetRole?.title || 'Full Stack Developer'}</strong>
          </p>
        </div>

        <button onClick={handleGenerateRoadmap} className="btn-primary" disabled={generating}>
          {generating ? 'Generating Steps...' : <><Sparkles size={16} /> Re-Generate Roadmap</>}
        </button>
      </div>

      {/* Task 6 Progression Stepper Bar */}
      <div className="glass-card" style={styles.stepperContainer}>
        {stages.map((stage, idx) => (
          <React.Fragment key={idx}>
            <div style={styles.stageItem}>
              <div style={idx <= 2 ? styles.stageActiveCircle : styles.stagePendingCircle}>
                {idx + 1}
              </div>
              <span style={styles.stageName}>{stage.name}</span>
              <span style={styles.stageDesc}>{stage.desc}</span>
            </div>
            {idx < stages.length - 1 && <div style={styles.stageConnector} />}
          </React.Fragment>
        ))}
      </div>

      {/* Task 6 "Your Next Best Step" Callout Box */}
      {nextStep && (
        <div style={styles.nextStepBox}>
          <div style={styles.nextHeader}>
            <Zap size={22} color="#0B4F4A" />
            <h3 style={styles.nextTitle}>Your Next Best Step</h3>
          </div>
          <p style={styles.nextDesc}>
            Master <strong>{nextStep.skill?.skillName || 'Docker Containerization'}</strong> → Build a mini integration project → Practice mock interview assessment.
          </p>
          <div style={styles.nextActionRow}>
            <span style={styles.nextBadge}>Estimated Effort: ~15 Hours</span>
            <span style={styles.nextBadgeAlt}>Priority Weight: High</span>
          </div>
        </div>
      )}

      {roadmap ? (
        <div style={styles.content}>
          {/* Progress Tracker Banner */}
          <div className="glass-card" style={styles.progressBanner}>
            <div style={styles.progressText}>
              <h3>Overall Milestone Progress</h3>
              <span>{progress}% Completed ({milestones.filter((m) => m.status === 'Completed').length} / {milestones.length} Milestones)</span>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
            </div>
          </div>

          {/* Milestone List */}
          <div style={styles.milestoneList}>
            {milestones.map((m, idx) => {
              const skillName = m.skill?.skillName || `Milestone #${idx + 1}`;
              const isDone = m.status === 'Completed';

              return (
                <div
                  key={m._id || idx}
                  className="glass-card"
                  style={{
                    ...styles.milestoneCard,
                    borderColor: isDone ? '#137C73' : 'rgba(11, 79, 74, 0.12)',
                    background: isDone ? '#FAF8F2' : '#FFFFFF',
                  }}
                >
                  {/* Milestone Header */}
                  <div style={styles.mHeader}>
                    <div style={styles.mTitleGroup}>
                      <button
                        onClick={() => handleToggleMilestone(m.skill?._id, m.status)}
                        style={styles.checkBtn}
                        title="Toggle Completion"
                      >
                        {isDone ? (
                          <CheckCircle2 size={24} color="#137C73" />
                        ) : (
                          <Circle size={24} color="#7F9793" />
                        )}
                      </button>
                      <div>
                        <h3 style={{ textDecoration: isDone ? 'line-through' : 'none', color: '#0B4F4A' }}>
                          Step {idx + 1}: Master {skillName}
                        </h3>
                        <span style={styles.categorySub}>{m.skill?.category || 'Technical Skill'} • Why it matters: Essential requirement on job specs</span>
                      </div>
                    </div>

                    <span style={isDone ? styles.doneBadge : styles.pendingBadge}>
                      {isDone ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  {/* Curated Resources */}
                  {m.resources && m.resources.length > 0 && (
                    <div style={styles.section}>
                      <h4 style={styles.subHeading}>
                        <BookOpen size={16} color="#137C73" /> Recommended Courses & Documentation
                      </h4>
                      <div style={styles.resourceGrid}>
                        {m.resources.map((res) => (
                          <a
                            key={res._id}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.resourceCard}
                          >
                            <div style={styles.resHeader}>
                              <span style={styles.resType}>{res.type}</span>
                              <ExternalLink size={14} color="#137C73" />
                            </div>
                            <strong style={styles.resTitle}>{res.title}</strong>
                            <div style={styles.resMeta}>
                              <span>{res.platform}</span>
                              <span><Clock size={12} /> {res.estimatedHours} Hrs</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hands-on Projects */}
                  {m.projects && m.projects.length > 0 && (
                    <div style={styles.section}>
                      <h4 style={styles.subHeading}>
                        <Code size={16} color="#0B4F4A" /> Hands-on Recommended Project
                      </h4>
                      <div style={styles.projectGrid}>
                        {m.projects.map((proj) => (
                          <div key={proj._id} style={styles.projectCard}>
                            <div style={styles.projHeader}>
                              <strong style={styles.projTitle}>{proj.title}</strong>
                              <span style={styles.diffBadge}>{proj.difficultyLevel}</span>
                            </div>
                            <p style={styles.projDesc}>{proj.description}</p>
                            <div style={styles.techStackWrap}>
                              {proj.techStack?.map((t, i) => (
                                <span key={i} style={styles.techTag}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyCard}>
          <Map size={48} color="#0B4F4A" />
          <h3>No Career Roadmap Generated Yet</h3>
          <p style={styles.subtitle}>Execute skill gap analysis first, then generate your personalized roadmap.</p>
          <button onClick={handleGenerateRoadmap} className="btn-primary" disabled={generating}>
            <Sparkles size={16} /> Generate Smart Roadmap
          </button>
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
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  subtitle: {
    color: '#536B67',
    fontSize: '0.92rem',
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    background: '#FFFFFF',
    overflowX: 'auto',
  },
  stageItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.25rem',
    minWidth: '120px',
  },
  stageActiveCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#0B4F4A',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stagePendingCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#FAF8F2',
    border: '1px solid rgba(11, 79, 74, 0.2)',
    color: '#7F9793',
    fontWeight: '700',
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageName: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#0B4F4A',
    letterSpacing: '0.05em',
  },
  stageDesc: {
    fontSize: '0.68rem',
    color: '#7F9793',
  },
  stageConnector: {
    flex: 1,
    height: '2px',
    background: 'rgba(11, 79, 74, 0.15)',
    margin: '0 0.5rem',
  },
  nextStepBox: {
    background: '#B8F2E6',
    border: '1px solid rgba(19, 124, 115, 0.3)',
    borderRadius: '14px',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  nextHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  nextTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  nextDesc: {
    fontSize: '0.92rem',
    color: '#0B4F4A',
  },
  nextActionRow: {
    display: 'flex',
    gap: '0.65rem',
    marginTop: '0.25rem',
  },
  nextBadge: {
    background: '#FFFFFF',
    color: '#0B4F4A',
    padding: '0.25rem 0.65rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  nextBadgeAlt: {
    background: '#137C73',
    color: '#FFFFFF',
    padding: '0.25rem 0.65rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  progressBanner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: '#FFFFFF',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#0B4F4A',
  },
  progressBarBg: {
    width: '100%',
    height: '10px',
    borderRadius: '5px',
    background: 'rgba(11, 79, 74, 0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: '#137C73',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  milestoneList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  milestoneCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  mHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  checkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  categorySub: {
    fontSize: '0.78rem',
    color: '#536B67',
    fontWeight: '500',
  },
  doneBadge: {
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontSize: '0.78rem',
    fontWeight: '700',
  },
  pendingBadge: {
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    background: 'rgba(11, 79, 74, 0.08)',
    color: '#0B4F4A',
    fontSize: '0.78rem',
    fontWeight: '700',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  subHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.92rem',
    color: '#0B4F4A',
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem',
  },
  resourceCard: {
    padding: '0.85rem',
    background: '#FAF8F2',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  resHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resType: {
    fontSize: '0.72rem',
    color: '#137C73',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resTitle: {
    fontSize: '0.88rem',
    color: '#0B4F4A',
  },
  resMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#7F9793',
  },
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  projectCard: {
    padding: '0.85rem',
    background: '#FAF8F2',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  projHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projTitle: {
    fontSize: '0.9rem',
    color: '#0B4F4A',
  },
  diffBadge: {
    fontSize: '0.72rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '10px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontWeight: '700',
  },
  projDesc: {
    fontSize: '0.82rem',
    color: '#536B67',
  },
  techStackWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
  },
  techTag: {
    fontSize: '0.72rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    background: '#FFFFFF',
    color: '#0B4F4A',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  emptyCard: {
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    background: '#FFFFFF',
  },
};

export default CareerRoadmapPage;
