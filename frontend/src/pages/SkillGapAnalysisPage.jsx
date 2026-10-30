import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { runGapAnalysis, getLatestAnalysis } from '../services/analysisService';
import ProgressGauge from '../components/ProgressGauge';
import SkillBadge from '../components/SkillBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart3, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

const SkillGapAnalysisPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      const res = await getLatestAnalysis();
      if (res.data?.analysis) {
        setAnalysis(res.data.analysis);
      }
    } catch (err) {
      console.error('Error fetching analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await runGapAnalysis();
      if (res.success && res.data?.analysis) {
        setAnalysis(res.data.analysis);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute semantic gap analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSpinner message="Evaluating skill gap analysis..." />;

  const matchPct = analysis?.matchPercentage || 0;
  const matchedSkills = analysis?.matchedSkills || [];
  const gaps = analysis?.gaps || [];

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1>
            Semantic <span className="gradient-text">Skill Gap Analysis</span>
          </h1>
          <p style={styles.subtitle}>
            Target Job Role: <strong>{analysis?.jobRole?.title || 'Not Selected'}</strong>
          </p>
        </div>

        <button onClick={handleRunAnalysis} className="btn-primary" disabled={analyzing}>
          {analyzing ? 'Analyzing Resume...' : <><Sparkles size={16} /> Re-Run Analysis</>}
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {analysis ? (
        <div style={styles.contentGrid}>
          {/* Match Score Summary */}
          <div className="glass-card" style={styles.scoreCard}>
            <h3>Overall Skill Match Percentage</h3>
            <div style={{ margin: '1.5rem 0' }}>
              <ProgressGauge percentage={matchPct} label="Skill Alignment" size={160} />
            </div>
            <p style={styles.scoreText}>
              {matchPct >= 80
                ? 'Excellent Match! You satisfy most industry requirements for this role.'
                : matchPct >= 50
                ? 'Moderate Match. You have key foundation skills but need to bridge missing gaps.'
                : 'High Skill Gap. Focus on completing your recommended learning roadmap.'}
            </p>
            <Link to="/job-readiness" className="btn-secondary" style={{ marginTop: '1rem', width: '100%' }}>
              Check Job Readiness & ATS Tips
            </Link>
          </div>

          {/* Matched vs Missing Breakdown */}
          <div style={styles.breakdownCol}>
            {/* Matched Skills */}
            <div className="glass-card" style={styles.breakdownCard}>
              <h3 style={styles.matchedHeading}>
                <CheckCircle2 size={20} color="#10b981" /> Matched Skills ({matchedSkills.length})
              </h3>
              <div style={styles.badgeWrap}>
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((s) => (
                    <SkillBadge key={s._id || s.skillName} skillName={s.skillName} category={s.category} status="matched" />
                  ))
                ) : (
                  <p style={styles.emptyText}>No matching skills detected yet.</p>
                )}
              </div>
            </div>

            {/* Missing Skill Gaps */}
            <div className="glass-card" style={styles.breakdownCard}>
              <h3 style={styles.missingHeading}>
                <ShieldAlert size={20} color="#f43f5e" /> Identified Skill Gaps ({gaps.length})
              </h3>

              <div style={styles.gapList}>
                {gaps.length > 0 ? (
                  gaps.map((g) => (
                    <div key={g._id || g.skill?._id} style={styles.gapItem}>
                      <div style={styles.gapInfo}>
                        <strong style={styles.gapName}>{g.skill?.skillName || 'Required Skill'}</strong>
                        <span style={styles.gapCategory}>{g.skill?.category || 'General'}</span>
                      </div>
                      <div style={styles.gapTags}>
                        <span style={g.gapType === 'Missing' ? styles.missingTag : styles.mismatchTag}>
                          {g.gapType}
                        </span>
                        <span style={styles.priorityTag}>Priority: {g.priorityScore}/10</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={styles.emptyText}>Congratulations! No missing skill gaps identified.</p>
                )}
              </div>

              <Link to="/career-roadmap" className="btn-primary" style={{ marginTop: '1rem' }}>
                Generate Personalized Career Roadmap <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyCard}>
          <BarChart3 size={48} color="#6366f1" />
          <h3>No Analysis Conducted Yet</h3>
          <p style={styles.subtitle}>Select a target role and upload your resume to run AI gap analysis.</p>
          <button onClick={handleRunAnalysis} className="btn-primary" disabled={analyzing}>
            <Sparkles size={16} /> Execute Skill Gap Analysis
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
    color: '#94a3b8',
    fontSize: '0.95rem',
  },
  errorBox: {
    background: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    color: '#fb7185',
    padding: '0.85rem',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: '1.25rem',
  },
  scoreCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  scoreText: {
    color: '#94a3b8',
    fontSize: '0.88rem',
    lineHeight: 1.5,
  },
  breakdownCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  breakdownCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  matchedHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.1rem',
    color: '#34d399',
  },
  missingHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.1rem',
    color: '#fb7185',
  },
  badgeWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  gapList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  gapItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  gapInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  gapName: {
    color: '#f8fafc',
    fontSize: '0.92rem',
  },
  gapCategory: {
    color: '#64748b',
    fontSize: '0.75rem',
  },
  gapTags: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  missingTag: {
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    background: 'rgba(244, 63, 94, 0.15)',
    color: '#fb7185',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  mismatchTag: {
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    background: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  priorityTag: {
    color: '#94a3b8',
    fontSize: '0.78rem',
  },
  emptyText: {
    color: '#64748b',
    fontSize: '0.85rem',
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

export default SkillGapAnalysisPage;
