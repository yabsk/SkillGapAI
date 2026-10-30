import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Award,
  AlertCircle,
  RefreshCw,
  Clock,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Sliders,
  ChevronRight,
  BookOpen,
  Target,
  BrainCircuit,
  MessageSquare,
  FileCheck,
} from 'lucide-react';

const MockInterviewPage = () => {
  const [roleTitle, setRoleTitle] = useState('Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [interviewType, setInterviewType] = useState('Technical & System Design');

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completedQnAs, setCompletedQnAs] = useState([]);
  const [finalReport, setFinalReport] = useState(null);

  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Timer state per question
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Pre-fetch target role from profile if available
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data?.data?.targetRole?.title) {
          setRoleTitle(res.data.data.targetRole.title);
        }
      } catch (err) {
        // Fallback default
      }
    };
    fetchUserRole();
    startNewSession('Full Stack Developer', 'Mid-Level');
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startNewSession = async (overrideRole, overrideLevel) => {
    const activeRole = overrideRole || roleTitle;
    const activeLevel = overrideLevel || experienceLevel;

    setLoading(true);
    setEvaluation(null);
    setUserAnswer('');
    setShowHint(false);
    setCompletedQnAs([]);
    setFinalReport(null);
    setSecondsElapsed(0);
    setIsTimerRunning(false);

    try {
      const res = await api.post('/interview/generate-questions', {
        roleTitle: activeRole,
        experienceLevel: activeLevel,
        interviewType,
      });

      if (res.data?.data?.questions) {
        setQuestions(res.data.data.questions);
        setCurrentIdx(0);
        setIsTimerRunning(true);
      }
    } catch (err) {
      console.error('Failed to load interview questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    if (!userAnswer || userAnswer.trim().length < 5) return;

    setEvaluating(true);
    setIsTimerRunning(false);

    try {
      const q = questions[currentIdx];
      const res = await api.post('/interview/evaluate-answer', {
        questionId: q.id,
        question: q.question,
        userAnswer,
        targetSkill: q.targetSkill,
        roundName: q.round,
        roleTitle,
        experienceLevel,
      });

      if (res.data?.data) {
        const evalData = res.data.data;
        setEvaluation(evalData);

        const newEntry = {
          questionId: q.id,
          question: q.question,
          targetSkill: q.targetSkill,
          round: q.round,
          roundIndex: q.roundIndex,
          userAnswer,
          timeElapsedSeconds: secondsElapsed,
          evaluation: evalData,
        };
        setCompletedQnAs((prev) => [...prev, newEntry]);
      }
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserAnswer('');
      setEvaluation(null);
      setShowHint(false);
      setSecondsElapsed(0);
      setIsTimerRunning(true);
    } else {
      generatePerformanceReport();
    }
  };

  const generatePerformanceReport = async () => {
    setGeneratingReport(true);
    setIsTimerRunning(false);

    try {
      const res = await api.post('/interview/generate-report', {
        roleTitle,
        experienceLevel,
        QnAList: completedQnAs,
      });

      if (res.data?.data) {
        setFinalReport(res.data.data);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const currentQ = questions[currentIdx];
  const progressPercent = questions.length > 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;

  return (
    <div style={styles.container}>
      {/* Header Banner */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.badge}>
            <Sparkles size={14} color="#137C73" /> AI MOCK INTERVIEWER SESSION
          </div>
          <h2 style={styles.title}>Dynamic Technical & HR Mock Interview</h2>
          <p style={styles.subtitle}>
            Multi-round realistic interview tailored to <strong>{roleTitle}</strong> ({experienceLevel}) with live answer evaluation and personalized performance reporting.
          </p>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="btn-secondary"
          style={styles.configToggleBtn}
        >
          <Sliders size={16} /> {showConfig ? 'Hide Config' : 'Change Target Role / Level'}
        </button>
      </div>

      {/* Role & Level Setup Panel */}
      {(showConfig || questions.length === 0) && (
        <div className="glass-card" style={styles.controlPanel}>
          <div className="form-group" style={{ flex: '1.5 1 220px', minWidth: 'min(100%, 220px)' }}>
            <label>Target Job Role</label>
            <input
              type="text"
              className="input-control"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
            />
          </div>

          <div className="form-group" style={{ flex: '1 1 180px', minWidth: 'min(100%, 180px)' }}>
            <label>Interview Level</label>
            <select
              className="input-control"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Entry-Level">Entry-Level / Fresher</option>
              <option value="Mid-Level">Mid-Level (1-3 yrs)</option>
              <option value="Senior Level">Senior / Lead Architect</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: '1 1 180px', minWidth: 'min(100%, 180px)' }}>
            <label>Interview Type</label>
            <select
              className="input-control"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
            >
              <option value="Technical & System Design">Technical & System Design</option>
              <option value="Role Scenario & Projects">Role Scenario & Projects</option>
              <option value="Behavioral & HR Round">Behavioral & HR Round</option>
            </select>
          </div>

          <button
            onClick={() => {
              setShowConfig(false);
              startNewSession();
            }}
            className="btn-primary"
            style={{ ...styles.genBtn, flex: '1 1 200px', minWidth: 'min(100%, 200px)' }}
            disabled={loading}
          >
            {loading ? 'Generating 13 Questions...' : <><RefreshCw size={16} /> Start New Session</>}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="glass-card" style={styles.loadingCard}>
          <RefreshCw size={32} color="#137C73" className="spin-icon" />
          <h4 style={{ color: '#0B4F4A', margin: 0 }}>Generating Personalized 13-Question Interview Session...</h4>
          <p style={{ color: '#536B67', fontSize: '0.88rem' }}>
            Synthesizing 5 interview rounds tailored for <strong>{roleTitle}</strong> ({experienceLevel}).
          </p>
        </div>
      )}

      {/* ACTIVE INTERVIEW SESSION */}
      {!loading && !finalReport && currentQ && (
        <div style={styles.sessionWrapper}>
          {/* Top Progress & Status Bar */}
          <div className="glass-card" style={styles.statusBar}>
            <div style={styles.statusItem}>
              <Target size={18} color="#137C73" />
              <div>
                <span style={styles.metaLabel}>TARGET ROLE</span>
                <div style={styles.metaVal}>{roleTitle} • {experienceLevel}</div>
              </div>
            </div>

            <div style={styles.statusItem}>
              <BrainCircuit size={18} color="#137C73" />
              <div>
                <span style={styles.metaLabel}>CURRENT ROUND ({currentQ.roundIndex || 1}/5)</span>
                <div style={styles.metaVal}>{currentQ.round}</div>
              </div>
            </div>

            <div style={styles.statusItem}>
              <Clock size={18} color="#FF7568" />
              <div>
                <span style={styles.metaLabel}>TIME ELAPSED</span>
                <div style={styles.timerVal}>{formatTime(secondsElapsed)}</div>
              </div>
            </div>

            <div style={styles.progressBox}>
              <div style={styles.progressText}>
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div style={styles.progressBarTrack}>
                <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Main Question Card */}
          <div className="glass-card" style={styles.interviewArena}>
            <div style={styles.qHeader}>
              <div style={styles.qRoundBadge}>
                <BookOpen size={14} /> {currentQ.round}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={styles.categoryTag}>{currentQ.category}</span>
                <span style={styles.skillTag}>Skill: {currentQ.targetSkill}</span>
              </div>
            </div>

            <h3 style={styles.questionText}>{currentQ.question}</h3>

            {/* Optional Hint Toggle */}
            <div style={styles.hintContainer}>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                style={styles.hintToggleBtn}
              >
                <HelpCircle size={15} color="#137C73" />
                {showHint ? 'Hide Interviewer Hint' : 'Request Interviewer Hint'}
              </button>

              {showHint && (
                <div style={styles.hintBox}>
                  💡 <strong>Interviewer Hint:</strong> {currentQ.hint}
                </div>
              )}
            </div>

            {/* Answer Form */}
            <form onSubmit={handleEvaluate} style={styles.answerForm}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={styles.answerLabel}>Your Answer:</label>
                <span style={styles.charCount}>{userAnswer.trim().length} characters</span>
              </div>

              <textarea
                className="input-control"
                rows={6}
                placeholder="Type your detailed, structured technical response here... (e.g. explain your approach, architecture decisions, trade-offs, and STAR format)"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                style={styles.textArea}
                disabled={evaluating || !!evaluation}
              />

              {!evaluation && (
                <button
                  type="submit"
                  className="btn-accent"
                  disabled={evaluating || userAnswer.trim().length < 5}
                  style={{ width: 'fit-content' }}
                >
                  {evaluating ? 'Evaluating Answer with AI...' : <><Send size={16} /> Submit Answer</>}
                </button>
              )}
            </form>

            {/* PER-QUESTION AI EVALUATION RESULTS */}
            {evaluation && (
              <div style={styles.evalBox}>
                <div style={styles.evalHeader}>
                  <div style={styles.scoreCircle}>
                    <span style={styles.scoreNumber}>{evaluation.score}</span>
                    <span style={styles.scoreMax}>/10</span>
                  </div>
                  <div>
                    <h4 style={styles.evalTitle}>AI Evaluation Feedback</h4>
                    <p style={styles.evalSubtitle}>{evaluation.communicationFeedback}</p>
                  </div>
                </div>

                <div style={styles.evalGrid}>
                  <div style={styles.evalCard}>
                    <h5 style={{ color: '#0B4F4A', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                      <CheckCircle2 size={16} color="#137C73" /> What You Did Well
                    </h5>
                    <ul style={styles.evalList}>
                      {evaluation.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div style={styles.evalCard}>
                    <h5 style={{ color: '#FF7568', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                      <AlertCircle size={16} color="#FF7568" /> Missing or Could Improve
                    </h5>
                    <ul style={styles.evalList}>
                      {evaluation.missingPoints?.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Follow-up Question if generated */}
                {evaluation.followUpQuestion && (
                  <div style={styles.followUpBox}>
                    <h5 style={styles.followUpTitle}>
                      <MessageSquare size={16} color="#137C73" /> Follow-Up Question from Interviewer:
                    </h5>
                    <p style={styles.followUpText}>"{evaluation.followUpQuestion}"</p>
                  </div>
                )}

                {/* Navigation Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(11, 79, 74, 0.1)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#536B67' }}>
                    Completed {currentIdx + 1} of {questions.length} Questions
                  </span>

                  <button
                    onClick={handleNextQuestion}
                    className="btn-primary"
                    disabled={generatingReport}
                    style={{ gap: '0.5rem' }}
                  >
                    {currentIdx < questions.length - 1 ? (
                      <>Next Question ({currentIdx + 2}/{questions.length}) <ChevronRight size={16} /></>
                    ) : (
                      <>{generatingReport ? 'Generating Final Report...' : <><FileCheck size={16} /> View Final Interview Report</>}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FINAL INTERVIEW PERFORMANCE REPORT */}
      {finalReport && (
        <div style={styles.reportWrapper}>
          <div className="glass-card" style={styles.reportHeaderCard}>
            <div style={styles.reportBadge}>
              <Award size={18} color="#0B4F4A" /> OFFICIAL MOCK INTERVIEW PERFORMANCE REPORT
            </div>

            <div style={styles.reportMainFlex}>
              <div>
                <h2 style={{ color: '#0B4F4A', fontSize: '1.8rem', margin: '0.2rem 0' }}>
                  Interview Performance Summary
                </h2>
                <p style={{ color: '#536B67', fontSize: '0.95rem' }}>
                  Target Role: <strong>{roleTitle}</strong> • Level: <strong>{experienceLevel}</strong> • {completedQnAs.length} Questions Answered
                </p>
              </div>

              <div style={styles.overallScoreBox}>
                <span style={styles.overallLabel}>OVERALL SCORE</span>
                <div style={styles.overallScoreVal}>
                  {finalReport.overallScore} <span style={{ fontSize: '1.1rem', color: '#536B67' }}>/ 10</span>
                </div>
              </div>
            </div>

            {/* AI Narrative Summary */}
            {finalReport.personalizedSummary && (
              <div style={styles.narrativeBox}>
                <h4 style={{ color: '#0B4F4A', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="#137C73" /> AI Interviewer Feedback Summary
                </h4>
                <p style={{ color: '#2C3E3B', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  "{finalReport.personalizedSummary}"
                </p>
              </div>
            )}
          </div>

          {/* Category Score Grid */}
          <div style={styles.categoryGrid}>
            <div className="glass-card" style={styles.categoryCard}>
              <span style={styles.catTitle}>Technical Knowledge</span>
              <div style={styles.catScore}>{finalReport.categoryScores?.technicalKnowledge} / 10</div>
            </div>

            <div className="glass-card" style={styles.categoryCard}>
              <span style={styles.catTitle}>Problem Solving</span>
              <div style={styles.catScore}>{finalReport.categoryScores?.problemSolving} / 10</div>
            </div>

            <div className="glass-card" style={styles.categoryCard}>
              <span style={styles.catTitle}>Role Knowledge</span>
              <div style={styles.catScore}>{finalReport.categoryScores?.roleKnowledge} / 10</div>
            </div>

            <div className="glass-card" style={styles.categoryCard}>
              <span style={styles.catTitle}>Communication</span>
              <div style={styles.catScore}>{finalReport.categoryScores?.communication} / 10</div>
            </div>

            <div className="glass-card" style={styles.categoryCard}>
              <span style={styles.catTitle}>Project Knowledge</span>
              <div style={styles.catScore}>{finalReport.categoryScores?.projectKnowledge} / 10</div>
            </div>

            <div className="glass-card" style={styles.categoryCard}>
              <span style={styles.catTitle}>Behavioral Skills</span>
              <div style={styles.catScore}>{finalReport.categoryScores?.behavioralSkills} / 10</div>
            </div>
          </div>

          {/* Detailed Breakdown Cards */}
          <div style={styles.reportGrid}>
            <div className="glass-card" style={styles.reportCard}>
              <h4 style={{ color: '#0B4F4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#137C73" /> Top Strengths Demonstrated
              </h4>
              <ul style={styles.reportList}>
                {finalReport.strengths?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card" style={styles.reportCard}>
              <h4 style={{ color: '#FF7568', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} color="#FF7568" /> Priority Areas to Improve
              </h4>
              <ul style={styles.reportList}>
                {finalReport.areasToImprove?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card" style={styles.reportCard}>
              <h4 style={{ color: '#0B4F4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="#137C73" /> Key Skills & Topics to Revise
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {finalReport.skillsToRevise?.map((skill, idx) => (
                  <span key={idx} style={styles.reviseBadge}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="glass-card" style={styles.reportCard}>
              <h4 style={{ color: '#0B4F4A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="#137C73" /> Recommended Next Action Steps
              </h4>
              <ol style={styles.stepList}>
                {finalReport.recommendedNextSteps?.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Report Footer Actions */}
          <div style={styles.reportActions}>
            <button
              onClick={() => startNewSession()}
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <RotateCcw size={16} /> Retake Interview for {roleTitle}
            </button>

            <button
              onClick={() => {
                setFinalReport(null);
                setShowConfig(true);
              }}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <Sliders size={16} /> Change Target Role or Level
            </button>
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
    gap: '1.75rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
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
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#0B4F4A',
    margin: 0,
  },
  subtitle: {
    color: '#536B67',
    fontSize: '0.92rem',
    margin: 0,
    maxWidth: '800px',
  },
  configToggleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  controlPanel: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-end',
    background: '#FFFFFF',
    flexWrap: 'wrap',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  genBtn: {
    height: '46px',
    marginBottom: '1.25rem',
  },
  loadingCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '3rem',
    textAlign: 'center',
  },
  sessionWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  statusBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
    gap: '1rem',
    alignItems: 'center',
    background: '#FFFFFF',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  metaLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#536B67',
    letterSpacing: '0.5px',
    display: 'block',
  },
  metaVal: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#0B4F4A',
  },
  timerVal: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#FF7568',
    fontFamily: 'monospace',
  },
  progressBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#0B4F4A',
  },
  progressBarTrack: {
    height: '8px',
    background: '#FAF8F2',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #137C73 0%, #B8F2E6 100%)',
    transition: 'width 0.4s ease',
  },
  interviewArena: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    background: '#FFFFFF',
    padding: 'clamp(1rem, 3vw, 1.5rem)',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  qHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  qRoundBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: '#0B4F4A',
    color: '#FFFFFF',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: '700',
  },
  categoryTag: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#536B67',
    background: '#FAF8F2',
    padding: '0.25rem 0.65rem',
    borderRadius: '6px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
  },
  skillTag: {
    background: '#B8F2E6',
    color: '#0B4F4A',
    padding: '0.25rem 0.65rem',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: '700',
  },
  questionText: {
    fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
    fontWeight: '800',
    color: '#0B4F4A',
    lineHeight: 1.4,
    margin: 0,
  },
  hintContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  hintToggleBtn: {
    background: 'none',
    border: 'none',
    color: '#137C73',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: 0,
    width: 'fit-content',
  },
  hintBox: {
    fontSize: '0.88rem',
    color: '#536B67',
    background: '#FAF8F2',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
  },
  answerForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  answerLabel: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#0B4F4A',
  },
  charCount: {
    fontSize: '0.78rem',
    color: '#536B67',
  },
  textArea: {
    width: '100%',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    resize: 'vertical',
  },
  evalBox: {
    marginTop: '1rem',
    background: '#FAF8F2',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  evalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  scoreCircle: {
    display: 'flex',
    alignItems: 'baseline',
    background: '#0B4F4A',
    color: '#B8F2E6',
    padding: '0.5rem 0.85rem',
    borderRadius: '8px',
    fontWeight: '800',
  },
  scoreNumber: {
    fontSize: '1.6rem',
  },
  scoreMax: {
    fontSize: '0.85rem',
    opacity: 0.8,
  },
  evalTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#0B4F4A',
    margin: 0,
  },
  evalSubtitle: {
    fontSize: '0.88rem',
    color: '#536B67',
    margin: '0.2rem 0 0 0',
  },
  evalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem',
  },
  evalCard: {
    background: '#FFFFFF',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
  },
  evalList: {
    paddingLeft: '1.2rem',
    fontSize: '0.85rem',
    color: '#536B67',
    lineHeight: 1.5,
    margin: 0,
  },
  followUpBox: {
    background: '#FFFFFF',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px border rgba(19, 124, 115, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  followUpTitle: {
    fontSize: '0.88rem',
    color: '#0B4F4A',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  followUpText: {
    fontSize: '0.9rem',
    color: '#2C3E3B',
    fontStyle: 'italic',
    margin: 0,
  },
  reportWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  reportHeaderCard: {
    background: '#FFFFFF',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  reportBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#0B4F4A',
    letterSpacing: '0.5px',
  },
  reportMainFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  overallScoreBox: {
    background: '#0B4F4A',
    color: '#FFFFFF',
    padding: '0.85rem 1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
  },
  overallLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#B8F2E6',
    letterSpacing: '0.5px',
    display: 'block',
  },
  overallScoreVal: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#B8F2E6',
    lineHeight: 1,
    marginTop: '0.2rem',
  },
  narrativeBox: {
    background: '#FAF8F2',
    padding: '1rem 1.25rem',
    borderRadius: '8px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
    gap: '0.85rem',
  },
  categoryCard: {
    background: '#FFFFFF',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  catTitle: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#536B67',
  },
  catScore: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  reportGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1.25rem',
  },
  reportCard: {
    background: '#FFFFFF',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  reportList: {
    paddingLeft: '1.2rem',
    fontSize: '0.88rem',
    color: '#536B67',
    lineHeight: 1.6,
    margin: '0.5rem 0 0 0',
  },
  stepList: {
    paddingLeft: '1.2rem',
    fontSize: '0.88rem',
    color: '#0B4F4A',
    fontWeight: '600',
    lineHeight: 1.6,
    margin: '0.5rem 0 0 0',
  },
  reviseBadge: {
    background: '#B8F2E6',
    color: '#0B4F4A',
    padding: '0.3rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  reportActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '1rem',
  },
};

export default MockInterviewPage;
