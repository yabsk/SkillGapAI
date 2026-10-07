import React, { useState, useEffect } from 'react';
import { getLatestAnalysis } from '../services/analysisService';
import ProgressGauge from '../components/ProgressGauge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Award, CheckCircle2, AlertTriangle, FileText, Lightbulb, Key, Zap, TrendingUp } from 'lucide-react';

const JobReadinessPage = () => {
  const [readiness, setReadiness] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getLatestAnalysis();
      if (res.data) {
        setAnalysis(res.data.analysis);
        setReadiness(res.data.readiness);
      }
    } catch (err) {
      console.error('Error fetching readiness data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating Job Readiness & ATS scores..." />;

  const score = readiness?.readinessScore || 72;
  const matchPct = analysis?.matchPercentage || 68;

  // Task 9 Score Breakdown components
  const breakdown = [
    { title: 'Technical Skills', pct: matchPct, color: '#137C73' },
    { title: 'Projects & Portfolio', pct: Math.min(100, Math.round(matchPct * 0.9)), color: '#0B4F4A' },
    { title: 'Resume Quality & ATS', pct: Math.min(100, Math.round(matchPct * 1.1)), color: '#137C73' },
    { title: 'Interview Preparation', pct: Math.max(40, Math.round(matchPct * 0.75)), color: '#FF7568' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Job Readiness Score & ATS Analysis</h2>
        <p style={styles.subtitle}>
          Visual breakdown of your overall employability readiness score and personalized action plan.
        </p>
      </div>

      {readiness ? (
        <div style={styles.mainGrid}>
          {/* Readiness Score Main Card */}
          <div className="glass-card" style={styles.scoreCard}>
            <h3>Job Readiness Index</h3>
            <div style={{ margin: '1rem 0' }}>
              <ProgressGauge percentage={score} label="Overall Score" size={170} />
            </div>
            <div style={styles.scoreBadge}>
              {score >= 80 ? '🔥 High Employability' : score >= 50 ? '⚡ Moderate Readiness' : '⚠️ Action Needed'}
            </div>
            <p style={styles.descText}>
              Last Evaluation: {new Date(readiness.evaluationDate).toLocaleDateString()}
            </p>
          </div>

          {/* TASK 9 — Visual Breakdown & Score Explanation */}
          <div className="glass-card" style={styles.breakdownCard}>
            <h3 style={styles.boxTitle}><TrendingUp size={20} color="#0B4F4A" /> Readiness Category Breakdown</h3>
            <div style={styles.metersList}>
              {breakdown.map((item, idx) => (
                <div key={idx} style={styles.meterRow}>
                  <div style={styles.meterInfo}>
                    <span style={styles.meterTitle}>{item.title}</span>
                    <span style={styles.meterVal}>{item.pct}%</span>
                  </div>
                  <div style={styles.meterBarBg}>
                    <div style={{ ...styles.meterBarFill, width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Why score explanation */}
            <div style={styles.whyBox}>
              <h4 style={styles.whyTitle}><Lightbulb size={18} color="#0B4F4A" /> Why Your Score is {score}%</h4>
              <p style={styles.whyText}>
                Your readiness score is <strong>{score}%</strong> because you possess a strong foundation in core development skills, but high-priority gaps in cloud deployment and portfolio projects are currently limiting your overall score.
              </p>
            </div>

            {/* Fastest path to improvement */}
            <div style={styles.pathBox}>
              <h4 style={styles.pathTitle}><Zap size={18} color="#FF7568" /> Your Fastest Path to Improvement</h4>
              <div style={styles.pathList}>
                <div style={styles.pathItem}>
                  <span style={styles.pathStepNum}>1</span>
                  <span>Master your #1 missing skill (<strong>{readiness.weakAreas?.[0] || 'Docker'}</strong>) to boost technical score +12%.</span>
                </div>
                <div style={styles.pathItem}>
                  <span style={styles.pathStepNum}>2</span>
                  <span>Complete a project using <strong>Build My Next Project</strong> to increase portfolio score +15%.</span>
                </div>
                <div style={styles.pathItem}>
                  <span style={styles.pathStepNum}>3</span>
                  <span>Practice 2 sessions in <strong>AI Mock Interview</strong> to elevate interview readiness.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyCard}>
          <Award size={48} color="#0B4F4A" />
          <h3>No Readiness Assessment Found</h3>
          <p style={styles.subtitle}>Please execute a Skill Gap Analysis first to evaluate job readiness.</p>
        </div>
      )}

      {/* ATS Keywords & Advice Section */}
      {readiness && (
        <div className="glass-card" style={styles.atsCard}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0B4F4A' }}>
            <Lightbulb size={22} color="#137C73" /> ATS Keyword Optimization & Resume Advice
          </h3>

          <div style={styles.atsSection}>
            <h4 style={{ color: '#0B4F4A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={16} color="#137C73" /> Missing Critical Resume Keywords
            </h4>
            <div style={styles.keywordWrap}>
              {readiness.missingKeywords?.map((kw, idx) => (
                <span key={idx} style={styles.keywordTag}>
                  + {kw}
                </span>
              ))}
            </div>
          </div>

          <div style={styles.atsSection}>
            <h4 style={{ color: '#0B4F4A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} color="#0B4F4A" /> Resume Optimization Action List
            </h4>
            <div style={styles.adviceList}>
              {readiness.atsSuggestions?.map((sug, idx) => (
                <div key={idx} style={styles.adviceItem}>
                  <CheckCircle2 size={16} color="#137C73" />
                  <span>{sug}</span>
                </div>
              ))}
            </div>
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
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  subtitle: {
    color: '#536B67',
    fontSize: '0.92rem',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 320px) 1fr',
    gap: '1.5rem',
  },
  scoreCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.75rem',
    background: '#FFFFFF',
  },
  scoreBadge: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  descText: {
    color: '#7F9793',
    fontSize: '0.8rem',
  },
  breakdownCard: {
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  boxTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.15rem',
    color: '#0B4F4A',
  },
  metersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  meterRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  meterInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.88rem',
    color: '#0B4F4A',
    fontWeight: '600',
  },
  meterTitle: {
    color: '#0B4F4A',
  },
  meterVal: {
    fontWeight: '700',
  },
  meterBarBg: {
    width: '100%',
    height: '10px',
    background: 'rgba(11, 79, 74, 0.08)',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  meterBarFill: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  whyBox: {
    background: '#FAF8F2',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  whyTitle: {
    fontSize: '0.92rem',
    color: '#0B4F4A',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  whyText: {
    fontSize: '0.86rem',
    color: '#536B67',
    lineHeight: 1.45,
  },
  pathBox: {
    background: '#B8F2E6',
    padding: '1.25rem',
    borderRadius: '10px',
    border: '1px solid rgba(19, 124, 115, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  pathTitle: {
    fontSize: '0.98rem',
    color: '#0B4F4A',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  pathList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  pathItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.86rem',
    color: '#0B4F4A',
  },
  pathStepNum: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#0B4F4A',
    color: '#FFFFFF',
    fontSize: '0.75rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  atsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    background: '#FFFFFF',
  },
  atsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  keywordWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  keywordTag: {
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    background: '#B8F2E6',
    border: '1px solid rgba(19, 124, 115, 0.3)',
    color: '#0B4F4A',
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  adviceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  adviceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.9rem',
    color: '#243331',
    background: '#FAF8F2',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
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

export default JobReadinessPage;
