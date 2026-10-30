import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileSearch,
  Target,
  Award,
  Map,
  ArrowRight,
  UserCheck,
  Cpu,
  TrendingUp,
  FolderPlus,
  CheckCircle2,
} from 'lucide-react';

const LandingPage = () => {
  const journeySteps = [
    { step: '01', title: 'Upload / Build Profile', desc: 'Import your resume or list your current skills and target role preferences.', icon: UserCheck },
    { step: '02', title: 'AI Understands Your Skills', desc: 'NLP engine extracts & categorizes your technical inventory and experience level.', icon: Cpu },
    { step: '03', title: 'Discover Skill Gaps', desc: 'Semantic comparison reveals missing mandatory skills and priority gaps.', icon: Target },
    { step: '04', title: 'Get Personalized Roadmap', desc: 'Dynamic milestone guide with targeted courses, certs & resources.', icon: Map },
    { step: '05', title: 'Practice & Improve', desc: 'Build AI-recommended portfolio projects and practice technical mock interviews.', icon: FolderPlus },
    { step: '06', title: 'Become Job Ready', desc: 'Track your Job Readiness Score & ATS pass rate as you build your career.', icon: TrendingUp },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.badge}>
          <Sparkles size={14} color="#137C73" /> AI CAREER INTELLIGENCE PLATFORM
        </div>
        <h1 style={styles.heroTitle}>
          Understand your skills.<br />
          <span style={{ color: '#137C73' }}>Discover your gaps.</span><br />
          <span style={{ color: '#FF7568' }}>Build the career you want.</span>
        </h1>
        <p style={styles.heroSubtitle}>
          SkillGap AI is your AI-powered career intelligence companion. Go beyond basic resume parsing — analyze your skill inventory, bridge role gaps, build custom portfolio projects, practice mock interviews, and accelerate your job readiness.
        </p>

        <div style={styles.heroButtons}>
          <Link to="/register" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Start Free Skill Analysis <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Sign In to Workspace
          </Link>
        </div>

        {/* Animated Feature Cards Preview */}
        <div style={styles.previewContainer}>
          <div style={styles.previewCard}>
            <div style={styles.previewHeader}>
              <Cpu size={20} color="#137C73" />
              <span>AI Skill Extractor</span>
            </div>
            <div style={styles.previewBadgeGrid}>
              <span className="pulse" style={styles.mintTag}><CheckCircle2 size={12} /> React JS</span>
              <span style={styles.mintTag}><CheckCircle2 size={12} /> Node.js</span>
              <span style={styles.mintTag}><CheckCircle2 size={12} /> MongoDB</span>
            </div>
          </div>

          <div style={styles.previewCard}>
            <div style={styles.previewHeader}>
              <Target size={20} color="#FF7568" />
              <span>Priority Gaps Identified</span>
            </div>
            <div style={styles.previewBadgeGrid}>
              <span style={styles.coralTag}>Docker Containerization</span>
              <span style={styles.coralTag}>AWS Microservices</span>
            </div>
          </div>

          <div style={styles.previewCard}>
            <div style={styles.previewHeader}>
              <TrendingUp size={20} color="#0B4F4A" />
              <span>Job Readiness Score</span>
            </div>
            <div style={styles.scoreNumber}>78%</div>
            <div style={styles.scoreBar}><div style={{ width: '78%', height: '100%', background: '#137C73', borderRadius: '4px' }} /></div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section style={styles.journeySection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>6-STEP CAREER JOURNEY</span>
          <h2 style={styles.sectionTitle}>How SkillGap AI Prepares You For The Industry</h2>
        </div>

        <div style={styles.journeyGrid}>
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="glass-card" style={styles.journeyCard}>
                <div style={styles.stepNumber}>{step.step}</div>
                <div style={styles.journeyIconBox}>
                  <Icon size={24} color="#0B4F4A" />
                </div>
                <h3 style={styles.journeyStepTitle}>{step.title}</h3>
                <p style={styles.journeyStepDesc}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Intelligence Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Built For Ambitious Students & Developers</h2>
        <div style={styles.grid}>
          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, background: '#B8F2E6', borderColor: '#137C73' }}>
              <FileSearch size={24} color="#0B4F4A" />
            </div>
            <h3 style={styles.cardTitle}>NLP Resume Analysis</h3>
            <p style={styles.cardDesc}>
              Upload PDF or DOCX resumes. Our NLP engine parses technical skills, soft skills, and experience years instantly.
            </p>
          </div>

          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, background: '#B8F2E6', borderColor: '#137C73' }}>
              <Target size={24} color="#0B4F4A" />
            </div>
            <h3 style={styles.cardTitle}>Semantic Gap Prioritization</h3>
            <p style={styles.cardDesc}>
              Compares your exact profile with industry target job roles to calculate weighted skill gaps and priority missing areas.
            </p>
          </div>

          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, background: '#B8F2E6', borderColor: '#137C73' }}>
              <Award size={24} color="#0B4F4A" />
            </div>
            <h3 style={styles.cardTitle}>Job Readiness & ATS Score</h3>
            <p style={styles.cardDesc}>
              Calculates your dynamic employability score (0–100%) and provides actionable ATS keyword density feedback.
            </p>
          </div>

          <div className="glass-card" style={styles.featureCard}>
            <div style={{ ...styles.iconBox, background: '#B8F2E6', borderColor: '#137C73' }}>
              <Map size={24} color="#0B4F4A" />
            </div>
            <h3 style={styles.cardTitle}>Personalized Career Roadmap</h3>
            <p style={styles.cardDesc}>
              Generates structured learning milestones with curated courses, documentation, custom project builds, and mock interview practice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem) 4rem clamp(1rem, 3vw, 2rem)',
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(2.5rem, 6vw, 5rem)',
    width: '100%',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.25rem',
    marginTop: '0.5rem',
    width: '100%',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    background: '#B8F2E6',
    border: '1px solid rgba(19, 124, 115, 0.3)',
    color: '#0B4F4A',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  heroTitle: {
    fontSize: 'clamp(1.85rem, 5.5vw, 3.2rem)',
    fontWeight: '800',
    lineHeight: 1.18,
    maxWidth: '900px',
    color: '#0B4F4A',
  },
  heroSubtitle: {
    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
    color: '#536B67',
    maxWidth: '750px',
    lineHeight: 1.6,
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  previewContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: '1.25rem',
    width: '100%',
    marginTop: '2rem',
  },
  previewCard: {
    background: '#FFFFFF',
    border: '1px solid rgba(11, 79, 74, 0.12)',
    borderRadius: '14px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    boxShadow: '0 4px 20px rgba(11, 79, 74, 0.05)',
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#0B4F4A',
  },
  previewBadgeGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  mintTag: {
    background: '#B8F2E6',
    color: '#0B4F4A',
    padding: '0.25rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  coralTag: {
    background: 'rgba(255, 117, 104, 0.15)',
    color: '#FF7568',
    padding: '0.25rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: '600',
  },
  scoreNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0B4F4A',
    lineHeight: 1,
  },
  scoreBar: {
    width: '100%',
    height: '8px',
    background: 'rgba(11, 79, 74, 0.08)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  journeySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2.5rem',
    width: '100%',
  },
  sectionHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  sectionBadge: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#137C73',
    letterSpacing: '0.08em',
  },
  sectionTitle: {
    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  journeyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1.25rem',
    width: '100%',
  },
  journeyCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: '#FFFFFF',
    border: '1px solid rgba(11, 79, 74, 0.12)',
    padding: '1.5rem 1.25rem',
  },
  stepNumber: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'rgba(11, 79, 74, 0.18)',
  },
  journeyIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: '#B8F2E6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyStepTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0B4F4A',
  },
  journeyStepDesc: {
    fontSize: '0.88rem',
    color: '#536B67',
    lineHeight: 1.5,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2.5rem',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: '1.25rem',
    width: '100%',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: '#FFFFFF',
    border: '1px solid rgba(11, 79, 74, 0.12)',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#0B4F4A',
  },
  cardDesc: {
    color: '#536B67',
    fontSize: '0.88rem',
    lineHeight: 1.5,
  },
};

export default LandingPage;
