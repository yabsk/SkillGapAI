import React, { useState, useEffect } from 'react';
import { getAtsEvaluation } from '../services/atsService';
import ProgressGauge from '../components/ProgressGauge';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileText, CheckCircle2, AlertTriangle, Key, ShieldCheck } from 'lucide-react';

const AtsCompatibilityPage = () => {
  const [atsData, setAtsData] = useState(null);
  const [qualityData, setQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAtsData();
  }, []);

  const fetchAtsData = async () => {
    try {
      const res = await getAtsEvaluation();
      if (res.data) {
        setAtsData(res.data.ats);
        setQualityData(res.data.quality);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Execute skill gap analysis first to generate ATS evaluation.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Evaluating ATS Compatibility & Resume Quality..." />;

  const atsScore = atsData?.atsScore || 0;
  const qualityScore = qualityData?.qualityScore || 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>
          Resume Evaluation & <span className="gradient-text">ATS Compatibility</span>
        </h1>
        <p style={styles.subtitle}>
          Automated resume screening analysis checking keyword coverage, formatting compliance, and structural quality.
        </p>
      </div>

      {error ? (
        <div style={styles.errorBox}>
          <AlertTriangle size={18} /> {error}
        </div>
      ) : atsData ? (
        <div style={styles.grid}>
          {/* ATS Score Radial Card */}
          <div className="glass-card" style={styles.scoreCard}>
            <h3>ATS Compatibility Score</h3>
            <div style={{ margin: '1.5rem 0' }}>
              <ProgressGauge percentage={atsScore} label="ATS Pass Rate" size={170} />
            </div>
            <p style={styles.scoreDesc}>
              {atsScore >= 75
                ? 'High ATS Pass Probability! Your resume contains primary target role keywords.'
                : 'Moderate ATS Match. Add missing keywords to pass automated resume parsers.'}
            </p>
            <div style={styles.qualityBadge}>
              Resume Quality Rating: <strong>{qualityData?.rating || 'Good'} ({qualityScore}/100)</strong>
            </div>
          </div>

          {/* ATS Keyword Breakdown & Advice */}
          <div style={styles.twoCol}>
            {/* Missing ATS Keywords */}
            <div className="glass-card" style={styles.card}>
              <h3><Key size={18} color="#06b6d4" /> Critical Missing ATS Keywords</h3>
              <p style={styles.subText}>Include these target industry terms in your resume skills section:</p>
              <div style={styles.keywordWrap}>
                {atsData.missingKeywords && atsData.missingKeywords.length > 0 ? (
                  atsData.missingKeywords.map((kw, idx) => (
                    <span key={idx} style={styles.kwBadge}>
                      + {kw}
                    </span>
                  ))
                ) : (
                  <p style={styles.subText}>All primary target keywords present in resume!</p>
                )}
              </div>
            </div>

            {/* Resume Structural Formatting Checklist */}
            <div className="glass-card" style={styles.card}>
              <h3><ShieldCheck size={18} color="#10b981" /> Resume Structure & Formatting Checklist</h3>
              <ul style={styles.checklist}>
                <li style={styles.checkItem}>
                  <CheckCircle2 size={16} color="#34d399" /> <strong>File Format:</strong> Valid PDF/DOCX structure detected.
                </li>
                <li style={styles.checkItem}>
                  <CheckCircle2 size={16} color={qualityData?.sectionChecks?.hasSkillsSection ? '#34d399' : '#fb7185'} />
                  <strong>Skills Section:</strong> {qualityData?.sectionChecks?.hasSkillsSection ? 'Clearly categorized skills list present' : 'Missing explicit skills section'}
                </li>
                <li style={styles.checkItem}>
                  <CheckCircle2 size={16} color={qualityData?.sectionChecks?.hasProjectsSection ? '#34d399' : '#fb7185'} />
                  <strong>Projects Section:</strong> {qualityData?.sectionChecks?.hasProjectsSection ? 'Technical projects section detected' : 'Add technical projects section'}
                </li>
                <li style={styles.checkItem}>
                  <CheckCircle2 size={16} color={qualityData?.sectionChecks?.hasEducationSection ? '#34d399' : '#fb7185'} />
                  <strong>Education Section:</strong> {qualityData?.sectionChecks?.hasEducationSection ? 'Degree & college info present' : 'Add education section'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyCard}>
          <FileText size={48} color="#6366f1" />
          <h3>No Resume Evaluation Data Found</h3>
          <p style={styles.subtitle}>Upload your resume and select a target job role to generate ATS compatibility results.</p>
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
  errorBox: {
    background: 'rgba(244, 63, 94, 0.15)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    color: '#fb7185',
    padding: '1rem',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.9rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1.25rem',
  },
  scoreCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  scoreDesc: {
    color: '#94a3b8',
    fontSize: '0.85rem',
    lineHeight: 1.5,
  },
  qualityBadge: {
    marginTop: '1rem',
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    fontSize: '0.8rem',
  },
  twoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  subText: {
    color: '#64748b',
    fontSize: '0.85rem',
  },
  keywordWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  kwBadge: {
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    background: 'rgba(6, 182, 212, 0.15)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    color: '#38bdf8',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  checklist: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    fontSize: '0.88rem',
    color: '#cbd5e1',
    padding: '0.5rem 0.75rem',
    background: 'rgba(15, 23, 42, 0.5)',
    borderRadius: '8px',
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

export default AtsCompatibilityPage;
