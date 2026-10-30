import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FolderPlus, Sparkles, Code, CheckCircle2, ArrowRight, Layers, Award } from 'lucide-react';

const ProjectGeneratorPage = () => {
  const [targetRoleTitle, setTargetRoleTitle] = useState('Full Stack Developer');
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await api.post('/projects/generate-custom', {
        targetRoleTitle,
        skillLevel,
      });
      if (res.data && res.data.data) {
        setProject(res.data.data);
      }
    } catch (err) {
      console.error('Failed to generate project:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>
          <Sparkles size={14} color="#137C73" /> AI PORTFOLIO GENERATOR
        </div>
        <h2>Build My Next Project</h2>
        <p style={styles.subtitle}>
          Generate personalized project blueprints tailored specifically to close your identified skill gaps.
        </p>
      </div>

      {/* Control Panel */}
      <div className="glass-card" style={styles.controlPanel}>
        <div className="form-group" style={{ flex: '1 1 220px', minWidth: 'min(100%, 220px)' }}>
          <label>Target Career Role</label>
          <input
            type="text"
            className="input-control"
            value={targetRoleTitle}
            onChange={(e) => setTargetRoleTitle(e.target.value)}
            placeholder="e.g. Full Stack Developer"
          />
        </div>

        <div className="form-group" style={{ flex: '1 1 220px', minWidth: 'min(100%, 220px)' }}>
          <label>Difficulty / Skill Level</label>
          <select
            className="input-control"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option value="Beginner">Beginner (Foundation)</option>
            <option value="Intermediate">Intermediate (Core Skills)</option>
            <option value="Advanced">Advanced (Enterprise Microservices)</option>
          </select>
        </div>

        <button
          onClick={fetchProject}
          className="btn-primary"
          style={styles.genBtn}
          disabled={loading}
        >
          {loading ? 'Generating Blueprint...' : <><FolderPlus size={18} /> Generate New Project</>}
        </button>
      </div>

      {/* Generated Project Display */}
      {project && (
        <div className="glass-card" style={styles.projectDisplay}>
          <div style={styles.projectHeader}>
            <div>
              <span style={styles.levelBadge}>{project.difficultyLevel} Level</span>
              <h3 style={styles.projectTitle}>{project.title}</h3>
            </div>
            <div style={styles.techStackContainer}>
              {project.technologies?.map((tech, i) => (
                <span key={i} style={styles.techPill}>{tech}</span>
              ))}
            </div>
          </div>

          <div style={styles.sectionGrid}>
            <div style={styles.cardBox}>
              <h4 style={styles.boxTitle}><Layers size={16} color="#0B4F4A" /> Problem Statement</h4>
              <p style={styles.boxText}>{project.problemStatement}</p>
            </div>

            <div style={styles.cardBox}>
              <h4 style={styles.boxTitle}><Award size={16} color="#137C73" /> Why This Project Matters</h4>
              <p style={styles.boxText}>{project.whyUseful}</p>
            </div>
          </div>

          {/* Features Checklist */}
          <div style={styles.featuresSection}>
            <h4 style={styles.boxTitle}><Code size={16} color="#0B4F4A" /> Suggested Features to Implement</h4>
            <div style={styles.featuresList}>
              {project.suggestedFeatures?.map((feat, idx) => (
                <div key={idx} style={styles.featureItem}>
                  <CheckCircle2 size={16} color="#137C73" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.footerNote}>
            <span style={{ fontWeight: '700', color: '#0B4F4A' }}>Career Impact:</span> {project.helpsCareer}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontSize: '0.78rem',
    fontWeight: '700',
    width: 'fit-content',
  },
  subtitle: {
    color: '#536B67',
    fontSize: '0.92rem',
  },
  controlPanel: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-end',
    background: '#FFFFFF',
    flexWrap: 'wrap',
  },
  genBtn: {
    height: '46px',
    marginBottom: '1.25rem',
    flex: '1 1 200px',
    minWidth: 'min(100%, 200px)',
  },
  projectDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    background: '#FFFFFF',
    border: '1px solid rgba(11, 79, 74, 0.15)',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    borderBottom: '1px solid rgba(11, 79, 74, 0.1)',
    paddingBottom: '1.25rem',
  },
  levelBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#FF7568',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  projectTitle: {
    fontSize: 'clamp(1.25rem, 4vw, 1.6rem)',
    fontWeight: '800',
    color: '#0B4F4A',
    marginTop: '0.25rem',
  },
  techStackContainer: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  techPill: {
    background: '#B8F2E6',
    color: '#0B4F4A',
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1.25rem',
  },
  cardBox: {
    background: '#FAF8F2',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  boxTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.98rem',
    fontWeight: '700',
    color: '#0B4F4A',
  },
  boxText: {
    fontSize: '0.88rem',
    color: '#536B67',
    lineHeight: 1.5,
  },
  featuresSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.9rem',
    color: '#243331',
    background: '#FFFFFF',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
  },
  footerNote: {
    background: '#B8F2E6',
    color: '#0B4F4A',
    padding: '1rem',
    borderRadius: '10px',
    fontSize: '0.88rem',
  },
};

export default ProjectGeneratorPage;
