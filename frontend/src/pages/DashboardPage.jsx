import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMyResume } from '../services/resumeService';
import { getLatestAnalysis } from '../services/analysisService';
import { getAtsEvaluation } from '../services/atsService';
import { getMyRoadmap } from '../services/roadmapService';
import { getRecommendations } from '../services/recommendationsService';

import ProgressGauge from '../components/ProgressGauge';
import SkillBadge from '../components/SkillBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  User,
  Target,
  FileText,
  Award,
  BarChart3,
  Map,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock,
  Lightbulb,
  Briefcase,
  Code2,
  MessageSquareCode,
  FileCheck,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [atsData, setAtsData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  const fetchDashboardOverview = async () => {
    try {
      const [resResume, resAnalysis, resAts, resRoadmap, resRecs] = await Promise.allSettled([
        getMyResume(),
        getLatestAnalysis(),
        getAtsEvaluation(),
        getMyRoadmap(),
        getRecommendations(),
      ]);

      if (resResume.status === 'fulfilled' && resResume.value?.data) {
        setResume(resResume.value.data);
      }
      if (resAnalysis.status === 'fulfilled' && resAnalysis.value?.data) {
        setAnalysis(resAnalysis.value.data.analysis);
        setReadiness(resAnalysis.value.data.readiness);
      }
      if (resAts.status === 'fulfilled' && resAts.value?.data) {
        setAtsData(resAts.value.data.ats);
      }
      if (resRoadmap.status === 'fulfilled' && resRoadmap.value?.data) {
        setRoadmap(resRoadmap.value.data);
      }
      if (resRecs.status === 'fulfilled' && resRecs.value) {
        setRecs(resRecs.value);
      }
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Aggregating SkillGap AI Dashboard overview..." />;

  // Calculated Metrics & Personalized Insights
  const targetRoleTitle = user?.targetRole?.title || analysis?.jobRole?.title || 'Full Stack Developer';
  const targetCategory = user?.targetRole?.industryCategory || analysis?.jobRole?.industryCategory || 'Software Engineering';
  const matchPct = analysis?.matchPercentage || 68;
  const readinessScore = readiness?.readinessScore || 72;
  const atsScore = atsData?.atsScore || 75;
  const roadmapProgress = roadmap?.overallProgress || 35;

  const currentSkills = resume?.extractedSkills || [];
  const missingGaps = analysis?.gaps || [];
  const milestones = roadmap?.milestones || [];

  const biggestGapSkill = missingGaps[0]?.skill?.skillName || 'Docker & Microservices';
  const nextValuableSkill = missingGaps[1]?.skill?.skillName || missingGaps[0]?.skill?.skillName || 'AWS Cloud Deployment';

  // Task 5 Personalized Insights Engine
  const aiInsights = [
    {
      title: '1. Biggest Skill Gap',
      desc: `Your most urgent missing requirement for ${targetRoleTitle} is **${biggestGapSkill}**. It carries a high priority weight in recruiter screens.`,
      icon: AlertTriangle,
      color: '#FF7568',
    },
    {
      title: '2. Most Valuable Skill to Learn Next',
      desc: `Mastering **${nextValuableSkill}** next will increase your target role match percentage from ${matchPct}% to over 85%.`,
      icon: Lightbulb,
      color: '#137C73',
    },
    {
      title: '3. Career Readiness Explanation',
      desc: `Your Job Readiness Score is **${readinessScore}%**. You have a strong foundation in core skills, but closing high-priority gaps will push you into top candidate tiers.`,
      icon: Award,
      color: '#0B4F4A',
    },
    {
      title: '4. Recommended Project',
      desc: `Build a **"${targetRoleTitle} - ${biggestGapSkill} Integration Engine"**. Check our Build Project tool for step-by-step guidance!`,
      icon: Code2,
      color: '#137C73',
    },
    {
      title: '5. Interview Preparation Focus',
      desc: `Expect technical interview questions around asynchronous architecture, database query tuning, and **${biggestGapSkill}** deployment patterns.`,
      icon: MessageSquareCode,
      color: '#0B4F4A',
    },
    {
      title: '6. Resume Improvement Tip',
      desc: `Include quantified metrics (e.g. *"Optimized database response time by 40%"*) alongside key terms like **${biggestGapSkill}**.`,
      icon: FileCheck,
      color: '#FF7568',
    },
  ];

  return (
    <div style={styles.container}>
      {/* 1. User Profile & Target Job Role Summary Banner */}
      <div className="glass-card" style={styles.bannerCard}>
        <div style={styles.profileLeft}>
          <div style={styles.avatarBox}>
            <User size={36} color="#FFFFFF" />
          </div>
          <div>
            <div style={styles.nameRow}>
              <h1 style={styles.userName}>{user?.name}</h1>
              <span style={styles.userRoleBadge}>{user?.role === 'admin' ? 'System Admin' : 'Student Developer'}</span>
            </div>
            <p style={styles.userEmail}>{user?.email}</p>
          </div>
        </div>

        {/* Target Job Role Summary */}
        <div style={styles.roleBox}>
          <div style={styles.roleHeader}>
            <Target size={18} color="#137C73" />
            <span style={styles.roleLabel}>TARGET JOB ROLE</span>
          </div>
          <h2 style={styles.roleTitle}>{targetRoleTitle}</h2>
          <span style={styles.categorySub}>{targetCategory}</span>
        </div>
      </div>

      {/* TASK 5 — Personalized AI Career Insights Section */}
      <div className="glass-card" style={styles.insightsCard}>
        <div style={styles.insightsHeader}>
          <Sparkles size={22} color="#0B4F4A" />
          <div>
            <h3 style={styles.insightsTitle}>AI Career Insights</h3>
            <span style={styles.insightsSubtitle}>Personalized intelligence generated specifically for your target role & skill profile</span>
          </div>
        </div>

        <div style={styles.insightsGrid}>
          {aiInsights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div key={idx} style={styles.insightItem}>
                <div style={{ ...styles.insightIconBox, background: `${insight.color}15`, borderColor: `${insight.color}30` }}>
                  <Icon size={18} color={insight.color} />
                </div>
                <div>
                  <h4 style={styles.insightItemTitle}>{insight.title}</h4>
                  <p style={styles.insightItemDesc} dangerouslySetInnerHTML={{ __html: insight.desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gauges & Status Overview Grid */}
      <div style={styles.gaugeGrid}>
        {/* Job Readiness Score */}
        <div className="glass-card" style={styles.gaugeCard}>
          <h3>Job Readiness Score</h3>
          <div style={{ margin: '1rem 0' }}>
            <ProgressGauge percentage={readinessScore} label="Readiness Index" size={150} />
          </div>
          <span style={readinessScore >= 75 ? styles.readyBadgeGreen : styles.readyBadgeAmber}>
            {readinessScore >= 75 ? '🔥 High Employability' : readinessScore >= 50 ? '⚡ Moderate Readiness' : '⚠️ Action Needed'}
          </span>
        </div>

        {/* Resume & ATS Status */}
        <div className="glass-card" style={styles.gaugeCard}>
          <h3>Resume & ATS Status</h3>
          <div style={{ margin: '1rem 0' }}>
            <ProgressGauge percentage={atsScore} label="ATS Pass Rate" size={150} />
          </div>
          <div style={styles.resumeMeta}>
            <FileText size={14} color="#137C73" />
            <span>{resume ? resume.fileName : 'Resume Uploaded'}</span>
            {resume && <span style={styles.expBadge}>{resume.experienceYears || 1} Yrs Exp</span>}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="glass-card" style={styles.gaugeCard}>
          <h3>Learning Progress</h3>
          <div style={{ margin: '1rem 0' }}>
            <ProgressGauge percentage={roadmapProgress} label="Milestones Done" size={150} />
          </div>
          <div style={styles.progressSub}>
            <span>{milestones.filter((m) => m.status === 'Completed').length} of {milestones.length || 4} Steps Completed</span>
          </div>
        </div>
      </div>

      {/* Skills & Gap Priorities Two-Column Grid */}
      <div style={styles.twoColumn}>
        {/* Current Extracted Skills */}
        <div className="glass-card" style={styles.card}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0B4F4A' }}>
            <CheckCircle2 size={20} color="#137C73" /> Current Extracted Skills ({currentSkills.length})
          </h3>
          <div style={styles.badgeWrap}>
            {currentSkills.length > 0 ? (
              currentSkills.map((s) => (
                <SkillBadge key={s._id || s.skillName} skillName={s.skillName} category={s.category} status="matched" />
              ))
            ) : (
              <p style={styles.emptyText}>No skills parsed yet. Upload your resume to extract skills.</p>
            )}
          </div>
        </div>

        {/* Missing Skills & Gap Priorities */}
        <div className="glass-card" style={styles.card}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FF7568' }}>
            <AlertTriangle size={20} color="#FF7568" /> Missing Skills & Gap Priorities ({missingGaps.length})
          </h3>
          <div style={styles.gapList}>
            {missingGaps.length > 0 ? (
              missingGaps.map((g) => (
                <div key={g._id || g.skill?._id} style={styles.gapRow}>
                  <div>
                    <strong style={styles.gapName}>{g.skill?.skillName || 'Skill'}</strong>
                    <span style={styles.gapCat}>{g.skill?.category || 'General'}</span>
                  </div>
                  <div style={styles.gapBadges}>
                    <span style={g.priorityScore >= 8 ? styles.prioHigh : styles.prioMed}>
                      Priority: {g.priorityScore || 8}/10
                    </span>
                    <span style={styles.missingBadge}>
                      {g.gapType || 'Missing'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>No missing skill gaps detected for your target role!</p>
            )}
          </div>
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
  bannerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
    background: '#FFFFFF',
    border: '1px solid rgba(11, 79, 74, 0.12)',
    boxShadow: '0 4px 20px rgba(11, 79, 74, 0.05)',
  },
  profileLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatarBox: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: '#0B4F4A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userName: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  userRoleBadge: {
    padding: '0.25rem 0.65rem',
    borderRadius: '12px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  userEmail: {
    color: '#536B67',
    fontSize: '0.85rem',
  },
  roleBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  roleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  roleLabel: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#137C73',
    letterSpacing: '0.05em',
  },
  roleTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  categorySub: {
    fontSize: '0.78rem',
    color: '#7F9793',
  },
  insightsCard: {
    background: '#FFFFFF',
    border: '1px solid rgba(11, 79, 74, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  insightsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderBottom: '1px solid rgba(11, 79, 74, 0.1)',
    paddingBottom: '0.75rem',
  },
  insightsTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  insightsSubtitle: {
    fontSize: '0.82rem',
    color: '#536B67',
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1rem',
  },
  insightItem: {
    background: '#FAF8F2',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  },
  insightIconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  insightItemTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#0B4F4A',
    marginBottom: '0.2rem',
  },
  insightItemDesc: {
    fontSize: '0.82rem',
    color: '#536B67',
    lineHeight: 1.45,
  },
  gaugeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  gaugeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    background: '#FFFFFF',
  },
  readyBadgeGreen: {
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  readyBadgeAmber: {
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    background: 'rgba(255, 117, 104, 0.15)',
    color: '#FF7568',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  resumeMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    color: '#536B67',
  },
  expBadge: {
    padding: '0.15rem 0.5rem',
    borderRadius: '8px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  progressSub: {
    fontSize: '0.8rem',
    color: '#536B67',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: '#FFFFFF',
  },
  badgeWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  gapList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  gapRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.65rem 0.85rem',
    background: '#FAF8F2',
    borderRadius: '8px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
  },
  gapName: {
    display: 'block',
    fontSize: '0.88rem',
    color: '#0B4F4A',
  },
  gapCat: {
    fontSize: '0.75rem',
    color: '#7F9793',
  },
  gapBadges: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  prioHigh: {
    padding: '0.15rem 0.5rem',
    borderRadius: '10px',
    background: 'rgba(255, 117, 104, 0.15)',
    color: '#FF7568',
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  prioMed: {
    padding: '0.15rem 0.5rem',
    borderRadius: '10px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  missingBadge: {
    padding: '0.15rem 0.5rem',
    borderRadius: '10px',
    background: 'rgba(255, 117, 104, 0.15)',
    color: '#FF7568',
    fontSize: '0.72rem',
  },
  emptyText: {
    color: '#7F9793',
    fontSize: '0.85rem',
  },
};

export default DashboardPage;
