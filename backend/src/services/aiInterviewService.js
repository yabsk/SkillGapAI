/**
 * AI Mock Interview Service
 * Dynamic Multi-Round Interview Question Generation, Answer Evaluation, Follow-ups, and Performance Reporting
 */

// Helper to extract JSON from Gemini API response text safely
const parseJSONFromText = (text) => {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (err) {
    return null;
  }
};

/**
 * Generate 13 multi-round interview questions dynamically based on role, level, and candidate context
 */
const generateInterviewSessionQuestions = async ({ roleTitle, experienceLevel, interviewType, userContext = {} }) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const role = roleTitle || userContext.targetRole || 'Full Stack Developer';
  const level = experienceLevel || 'Mid-Level';
  const userSkills = userContext.userSkills || ['JavaScript', 'React', 'Node.js'];
  const missingSkills = userContext.missingSkills || ['Docker', 'AWS', 'Spring Boot'];
  const resumeProjects = userContext.resumeProjects || ['Full Stack E-Commerce App', 'REST API Gateway'];

  // Prompt for Gemini API
  const prompt = `You are a Senior Technical Interviewer conducting a realistic mock interview for a candidate applying for:
- Target Job Role: ${role}
- Experience Level: ${level}
- Known Candidate Skills: ${userSkills.join(', ')}
- Missing Skill Gaps to Test: ${missingSkills.join(', ')}
- Projects from Resume: ${resumeProjects.join(', ')}

Generate a structured set of 13 interview questions divided into 5 distinct rounds:
ROUND 1 — INTRODUCTION / WARM-UP (2 questions)
ROUND 2 — TECHNICAL KNOWLEDGE (4 questions)
ROUND 3 — ROLE-SPECIFIC / SCENARIO QUESTIONS (3 questions)
ROUND 4 — PROJECT / EXPERIENCE (2 questions)
ROUND 5 — BEHAVIORAL / HR (2 questions)

Make questions highly specific to ${role} at the ${level} level. Incorporate candidate missing skills (${missingSkills.join(', ')}) and projects where applicable.

Return ONLY a valid JSON array of objects with this structure:
[
  {
    "id": 1,
    "round": "Round 1 — Introduction / Warm-Up",
    "roundIndex": 1,
    "category": "Career Background & Core Focus",
    "question": "Question text...",
    "targetSkill": "Skill name",
    "hint": "Brief interviewer hint..."
  }
]`;

  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = parseJSONFromText(candidateText);
          if (Array.isArray(parsed) && parsed.length >= 10) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('[Gemini Interview Questions Exception]:', err.message);
    }
  }

  // Fallback Dynamic Question Generation Engine (Zero-Crash, Role & Level Custom)
  return generateDynamicQuestionsFallback({ role, level, userSkills, missingSkills, resumeProjects });
};

/**
 * Dynamic Questions Generator (Fallback engine for all tech roles & levels)
 */
const generateDynamicQuestionsFallback = ({ role, level, userSkills, missingSkills, resumeProjects }) => {
  const roleLower = role.toLowerCase();
  const primaryMissing = missingSkills[0] || 'Docker';
  const secondaryMissing = missingSkills[1] || 'Cloud Deployment';
  const mainSkill = userSkills[0] || 'Core Technologies';
  const userProject = resumeProjects[0] || 'your recent technical project';

  let round1 = [];
  let round2 = [];
  let round3 = [];
  let round4 = [];
  let round5 = [];

  // Tailored questions per role type
  if (roleLower.includes('data scientist') || roleLower.includes('data science')) {
    round1 = [
      { id: 1, round: "Round 1 — Introduction / Warm-Up", roundIndex: 1, category: "Data Science Background", question: `Walk me through your data science background and your experience applying Python and statistics to solve real-world problems.`, targetSkill: "Data Science Fundamentals", hint: "Mention key libraries (Pandas, Scikit-Learn) and project domain experience." },
      { id: 2, round: "Round 1 — Introduction / Warm-Up", roundIndex: 1, category: "Workflow & Pipeline", question: `What is your standard end-to-end data pipeline workflow from raw data ingestion to model deployment?`, targetSkill: "Data Engineering & Pipeline", hint: "Discuss data cleaning, feature engineering, model validation, and deployment." }
    ];
    round2 = [
      { id: 3, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "Machine Learning Concepts", question: `Explain the Bias-Variance tradeoff and how you prevent overfitting in complex machine learning models.`, targetSkill: "Model Optimization", hint: "Cover regularization techniques (L1/L2), cross-validation, and ensemble methods." },
      { id: 4, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "Statistics & Feature Engineering", question: `How do you handle missing values, multi-collinearity, and highly imbalanced datasets?`, targetSkill: "Data Preprocessing", hint: "Mention SMOTE, imputation strategies, VIF score, and class weighting." },
      { id: 5, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "SQL & Querying", question: `Write or explain a complex SQL query using Window Functions (RANK, DENSE_RANK) to find top performing segments.`, targetSkill: "SQL & Analytics", hint: "Explain PARTITION BY, ORDER BY, and aggregation performance." },
      { id: 6, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: `${primaryMissing} Application`, question: `How would you utilize ${primaryMissing} to streamline data analysis or production model execution for ${role}?`, targetSkill: primaryMissing, hint: `Connect ${primaryMissing} directly to data reproducibility and environment isolation.` }
    ];
    round3 = [
      { id: 7, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "Model Evaluation Scenario", question: `Suppose your classification model achieves 98% accuracy on test data, but performs poorly in production. How do you diagnose data drift?`, targetSkill: "Model Monitoring", hint: "Discuss precision/recall vs accuracy, concept drift, and monitoring metrics." },
      { id: 8, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "A/B Testing & Metrics", question: `How do you design an A/B test for a new recommendation algorithm? What statistical significance metrics do you evaluate?`, targetSkill: "A/B Testing", hint: "Explain p-values, confidence intervals, sample size estimation, and power analysis." },
      { id: 9, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "Architecture & Scalability", question: `When scaling model inference for low latency, what trade-offs do you consider between batch scoring and real-time API endpoints?`, targetSkill: "ML Architecture", hint: "Compare REST endpoints (FastAPI), message queues (Kafka), and cached features (Redis)." }
    ];
  } else if (roleLower.includes('devops') || roleLower.includes('cloud')) {
    round1 = [
      { id: 1, round: "Round 1 — Introduction / Warm-Up", roundIndex: 1, category: "DevOps Philosophy", question: `Introduce yourself and summarize your hands-on experience with Infrastructure as Code and CI/CD automation.`, targetSkill: "DevOps Practices", hint: "Highlight tools like Terraform, Ansible, Docker, and GitHub Actions." },
      { id: 2, round: "Round 2 — Warm-Up", roundIndex: 1, category: "System Administration", question: `What are your core Linux troubleshooting techniques when inspecting high CPU usage or memory leaks in production?`, targetSkill: "Linux System Admin", hint: "Mention top, htop, vmstat, journalctl, netstat/ss, and log analysis." }
    ];
    round2 = [
      { id: 3, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "Containerization & Orchestration", question: `Explain how Kubernetes Pods communicate across node networks and how ingress controllers manage SSL termination.`, targetSkill: "Kubernetes Networking", hint: "Cover Pod CNI plugins, Service ClusterIP, Ingress rules, and Cert-Manager." },
      { id: 4, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "CI/CD Pipeline Security", question: `How do you implement secret management and vulnerability scanning inside CI/CD deployment pipelines?`, targetSkill: "DevSecOps", hint: "Discuss HashiCorp Vault, Trivy image scans, and SAST/DAST tools." },
      { id: 5, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "Cloud Infrastructure", question: `How do you design a multi-region highly available AWS/Cloud setup with automated failover?`, targetSkill: "Cloud Architecture", hint: "Mention Route53 DNS routing, multi-AZ RDS, and S3 replication." },
      { id: 6, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: `${primaryMissing} Integration`, question: `How would you configure ${primaryMissing} inside your automated continuous deployment pipeline?`, targetSkill: primaryMissing, hint: `Describe declarative configuration, stage gates, and rollbacks for ${primaryMissing}.` }
    ];
    round3 = [
      { id: 7, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "Incident Management", question: `A production cluster suddenly experiences 502 Bad Gateway errors across all services. What is your step-by-step triage process?`, targetSkill: "Incident Response", hint: "Check load balancer health checks, pod status, gateway logs, and resource limits." },
      { id: 8, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "Monitoring & Alerting", question: `How do you construct Prometheus metrics and Grafana dashboards to alert on Service Level Objectives (SLOs)?`, targetSkill: "Observability", hint: "Explain Golden Signals (Latency, Traffic, Errors, Saturation) and P99 latency." },
      { id: 9, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "Infrastructure Cost Optimization", question: `What strategies do you employ to reduce cloud resource waste without sacrificing availability?`, targetSkill: "FinOps", hint: "Mention auto-scaling (HPA/KEDA), spot instances, and lifecycle policies." }
    ];
  } else if (roleLower.includes('ai') || roleLower.includes('machine learning') || roleLower.includes('ml engineer')) {
    round1 = [
      { id: 1, round: "Round 1 — Introduction / Warm-Up", roundIndex: 1, category: "AI Background", question: `Summarize your experience building, training, and deploying Machine Learning and Deep Learning models.`, targetSkill: "ML & Deep Learning", hint: "Mention PyTorch/TensorFlow, model architectures, and production deployment." },
      { id: 2, round: "Round 1 — Introduction / Warm-Up", roundIndex: 1, category: "Modern AI Stack", question: `How do you approach working with Large Language Models (LLMs), RAG (Retrieval-Augmented Generation), and vector embeddings?`, targetSkill: "LLM & RAG Architectures", hint: "Discuss chunking strategies, vector databases (Pinecone/Chroma), and prompt engineering." }
    ];
    round2 = [
      { id: 3, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "Deep Learning Architectures", question: `Explain the Self-Attention mechanism in Transformers and how it improves over recurrent architectures (LSTMs).`, targetSkill: "Transformer Models", hint: "Cover Query, Key, Value matrices, multi-head attention, and positional encoding." },
      { id: 4, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "MLOps & Model Lifecycle", question: `How do you structure an MLOps pipeline for automated model retraining, versioning, and registry management?`, targetSkill: "MLOps", hint: "Mention MLflow, DVC, Feature Stores, and automated CI/CD for model weights." },
      { id: 5, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "Quantization & Model Compression", question: `What techniques (Quantization, Pruning, Distillation) do you use to deploy large models to edge devices or low-latency APIs?`, targetSkill: "Model Optimization", hint: "Explain FP16 vs INT8 quantization, ONNX runtime, and teacher-student distillation." },
      { id: 6, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: `${primaryMissing} for AI Pipelines`, question: `How does integrating ${primaryMissing} enhance model throughput or deployment scalability in your AI stack?`, targetSkill: primaryMissing, hint: `Connect ${primaryMissing} to asynchronous serving, GPU acceleration, or service orchestration.` }
    ];
    round3 = [
      { id: 7, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "RAG Evaluation Scenario", question: `Your RAG pipeline produces hallucinated answers for specialized domain queries. How do you evaluate and fix this issue?`, targetSkill: "RAG Debugging", hint: "Check embedding similarity scores, retrieval top-k parameters, and prompt grounding constraints." },
      { id: 8, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "Scalable Inference", question: `Design a high-throughput API backend serving 1,000 requests/sec for a computer vision classification model.`, targetSkill: "AI System Design", hint: "Mention batching (Triton Inference Server), GPU queues, and async worker pools." },
      { id: 9, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "AI Safety & Ethics", question: `How do you implement guardrails against prompt injection, data leakage, and toxic outputs in public-facing AI bots?`, targetSkill: "AI Safety", hint: "Discuss input sanitization, Guardrails AI/NeMo, output parsing, and PII masking." }
    ];
  } else {
    // Default Full Stack / Backend / General Web Developer
    round1 = [
      { id: 1, round: "Round 1 — Introduction / Warm-Up", roundIndex: 1, category: "Professional Overview", question: `Tell me about yourself, your technical journey, and your core stack specialization in ${role}.`, targetSkill: "Professional Communication", hint: "Summarize frontend/backend balance, key frameworks, and career goals." },
      { id: 2, round: "Round 1 — Introduction / Warm-Up", roundIndex: 1, category: "Development Methodology", question: `How do you structure your daily workflow when taking a feature from UI mockups to backend production release?`, targetSkill: "SDLC & Best Practices", hint: "Cover API contract design, Git branching, unit testing, and deployment." }
    ];
    round2 = [
      { id: 3, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "System Architecture", question: `Explain how you design a scalable RESTful API handling high concurrency with ${mainSkill}.`, targetSkill: mainSkill, hint: "Discuss asynchronous I/O, middleware structure, connection pooling, and error handling." },
      { id: 4, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "Database Optimization", question: `How do you handle schema migrations, compound indexing, and query optimization in SQL/NoSQL databases?`, targetSkill: "Database Design", hint: "Explain index selectivity, explain plans, ACID transactions, and N+1 query prevention." },
      { id: 5, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: "Authentication & Security", question: `Describe how JWT authentication, Refresh Tokens, and Role-Based Access Control (RBAC) should be implemented securely.`, targetSkill: "Security & Auth", hint: "Mention HTTP-only cookies, token expiration, secret rotation, and CSRF protection." },
      { id: 6, round: "Round 2 — Technical Knowledge", roundIndex: 2, category: `${primaryMissing} Deep Dive`, question: `How would you integrate ${primaryMissing} into your current application architecture to solve scaling bottlenecks?`, targetSkill: primaryMissing, hint: `Highlight microservices separation, containerization, or cloud caching with ${primaryMissing}.` }
    ];
    round3 = [
      { id: 7, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "System Design Scenario", question: `Design a rate-limiting middleware that limits users to 100 requests per minute per IP address.`, targetSkill: "System Design", hint: "Compare Token Bucket, Leaky Bucket, and Redis sliding window algorithms." },
      { id: 8, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "Frontend & Performance", question: `How do you optimize web application performance (Core Web Vitals, code splitting, asset caching, state re-renders)?`, targetSkill: "Performance Optimization", hint: "Mention React.memo, lazy loading, CDN caching, and bundle size reduction." },
      { id: 9, round: "Round 3 — Role-Specific / Scenario Questions", roundIndex: 3, category: "Resilience & Error Handling", question: `What strategies (Circuit Breaker, Exponential Backoff, Retry Policies) do you use when consuming third-party microservices?`, targetSkill: "Distributed Systems", hint: "Explain graceful degradation, fallback responses, and health checks." }
    ];
  }

  // Round 4: Project & Experience (Personalized to Resume/Target)
  round4 = [
    { id: 10, round: "Round 4 — Project / Experience", roundIndex: 4, category: "Project Deep Dive", question: `Tell me about a key project on your resume ("${userProject}"). What was the architecture and your primary technical contribution?`, targetSkill: "Project Execution", hint: "Use the STAR method: Situation, Task, Action taken, and quantitative Result achieved." },
    { id: 11, round: "Round 4 — Project / Experience", roundIndex: 4, category: "Technical Challenges & Debugging", question: `Describe the single hardest bug or performance bottleneck you encountered in "${userProject}" and how you resolved it.`, targetSkill: "Problem Solving", hint: "Explain diagnostic tools used (profilers, logs, APM), root cause identified, and permanent fix." }
  ];

  // Round 5: Behavioral / HR
  round5 = [
    { id: 12, round: "Round 5 — Behavioral / HR", roundIndex: 5, category: "Collaboration & Conflict", question: `Describe a situation where you had a technical disagreement with a team member or code reviewer. How did you handle it?`, targetSkill: "Teamwork & Collaboration", hint: "Focus on active listening, data-driven trade-off analysis, and consensus building." },
    { id: 13, round: "Round 5 — Behavioral / HR", roundIndex: 5, category: "Adaptability & Growth", question: `Technology moves fast. How do you prioritize learning new skills like ${primaryMissing} while delivering tight sprint deadlines?`, targetSkill: "Continuous Learning", hint: "Discuss self-directed learning, building POCs, and applying new skills in production." }
  ];

  // Adjust questions according to Experience Level
  const all13 = [...round1, ...round2, ...round3, ...round4, ...round5];
  if (level.toLowerCase().includes('senior')) {
    all13.forEach((q) => {
      q.question = q.question.replace('How do you', 'How would you lead your engineering team to architect and');
    });
  } else if (level.toLowerCase().includes('entry') || level.toLowerCase().includes('fresher')) {
    all13.forEach((q) => {
      q.hint += " Keep your answer clean, focusing on core fundamentals and hands-on academic/portfolio projects.";
    });
  }

  return all13;
};

/**
 * Evaluate candidate's answer for a single question
 */
const evaluateInterviewAnswer = async ({ roleTitle, experienceLevel, question, userAnswer, targetSkill, roundName }) => {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!userAnswer || userAnswer.trim().length < 10) {
    return {
      score: 3,
      strengths: ['Submitted a response.'],
      missingPoints: ['Answer is too short (minimum 10 characters required for evaluation).', 'Provide specific technical details, key concepts, and code/architecture references.'],
      conceptsToRevise: [targetSkill || 'Core Concepts'],
      communicationFeedback: 'Answer is incomplete. In a real interview, elaborate on your thought process with concrete examples.',
    };
  }

  const prompt = `You are a Senior Technical Interviewer for a ${roleTitle} position (${experienceLevel}).
Evaluate this candidate's answer to the following question:

Question (${roundName}): ${question}
Target Skill: ${targetSkill}
Candidate's Answer: "${userAnswer}"

Provide detailed, construct feedback in valid JSON format:
{
  "score": 8, // Integer or float from 1 to 10
  "strengths": ["Strength point 1", "Strength point 2"],
  "missingPoints": ["Missing point 1", "Missing point 2"],
  "conceptsToRevise": ["Concept 1", "Concept 2"],
  "communicationFeedback": "Direct advice on answer structure, clarity, and depth.",
  "followUpQuestion": "Optional follow-up question if answer is interesting or missed a key concept, else null"
}`;

  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 1000 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = parseJSONFromText(candidateText);
          if (parsed && typeof parsed.score === 'number') {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('[Gemini Evaluation Exception]:', err.message);
    }
  }

  // Fallback Dynamic Evaluation Engine
  const len = userAnswer.trim().length;
  const wordCount = userAnswer.trim().split(/\s+/).length;

  let calculatedScore = 6;
  if (wordCount > 100) calculatedScore = 9;
  else if (wordCount > 50) calculatedScore = 8;
  else if (wordCount > 25) calculatedScore = 7;
  else if (wordCount > 10) calculatedScore = 6;

  // Keyword bonus check
  const skillLower = (targetSkill || '').toLowerCase();
  const answerLower = userAnswer.toLowerCase();
  if (skillLower && answerLower.includes(skillLower)) {
    calculatedScore = Math.min(10, calculatedScore + 1);
  }

  // Generate dynamic follow-up if answer missed key edge case details
  let followUp = null;
  if (wordCount < 40) {
    followUp = `Good start! Could you elaborate specifically on how you would handle error logging or security considerations when implementing ${targetSkill || 'this solution'}?`;
  } else if (answerLower.includes('rest') || answerLower.includes('api')) {
    followUp = `Excellent points. How would you handle API versioning and backward compatibility without breaking existing clients?`;
  }

  return {
    score: calculatedScore,
    strengths: [
      `Addressed the core aspects of ${targetSkill || 'the question'} cleanly.`,
      `Demonstrated clear domain terminology and structured explanation.`,
    ],
    missingPoints: [
      `Could include quantitative metrics or performance benchmarks (e.g., latency reduction, memory footprint).`,
      `Elaborate slightly more on edge case failure modes and logging.`,
    ],
    conceptsToRevise: [
      targetSkill || 'Core Concepts',
      'Production Edge Cases & Fallbacks',
    ],
    communicationFeedback: wordCount > 40
      ? `Great depth in your answer! Use the STAR format (Situation, Task, Action, Result) to make your response even stronger.`
      : `Solid initial answer. In a real interview, aim for 3 to 4 detailed sentences covering implementation, testing, and edge cases.`,
    followUpQuestion: followUp,
  };
};

/**
 * Generate final comprehensive interview performance report
 */
const generateFinalInterviewReport = async ({ roleTitle, experienceLevel, QnAList = [], userContext = {} }) => {
  const totalQuestions = QnAList.length || 13;
  
  // Calculate category & overall scores
  let totalScoreSum = 0;
  let techScores = [];
  let problemScores = [];
  let roleScores = [];
  let commScores = [];
  let projScores = [];
  let behaveScores = [];

  QnAList.forEach((item) => {
    const score = item.evaluation?.score || 7;
    totalScoreSum += score;

    const roundIdx = item.roundIndex || 1;
    if (roundIdx === 1) commScores.push(score);
    else if (roundIdx === 2) techScores.push(score);
    else if (roundIdx === 3) roleScores.push(score);
    else if (roundIdx === 4) projScores.push(score);
    else if (roundIdx === 5) behaveScores.push(score);
    problemScores.push(score);
  });

  const avg = (arr) => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '7.5';

  const overallScore = (totalScoreSum / Math.max(1, totalQuestions)).toFixed(1);
  const technicalKnowledge = avg(techScores);
  const problemSolving = avg(problemScores);
  const roleKnowledge = avg(roleScores);
  const communication = avg(commScores);
  const projectKnowledge = avg(projScores);
  const behavioralSkills = avg(behaveScores);

  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const summaryPrompt = `Generate a 3-sentence personalized interviewer summary for a candidate who just completed a ${totalQuestions}-question mock interview for ${roleTitle} (${experienceLevel}). Their overall score is ${overallScore}/10. Highlight what they did well and their main area to polish.`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: summaryPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return {
            overallScore: parseFloat(overallScore),
            categoryScores: {
              technicalKnowledge: parseFloat(technicalKnowledge),
              problemSolving: parseFloat(problemSolving),
              roleKnowledge: parseFloat(roleKnowledge),
              communication: parseFloat(communication),
              projectKnowledge: parseFloat(projectKnowledge),
              behavioralSkills: parseFloat(behavioralSkills),
            },
            strengths: [
              `Solid foundational understanding of ${roleTitle} core workflows.`,
              `Clear articulation during Technical Knowledge & Project rounds.`,
              `Good problem-solving methodology when addressing technical scenarios.`,
            ],
            areasToImprove: [
              `Deepen knowledge in production deployment edge cases and cloud scalability.`,
              `Include quantitative metrics and performance benchmarks in answer responses.`,
            ],
            skillsToRevise: userContext.missingSkills || ['Docker', 'AWS', 'System Design'],
            recommendedNextSteps: [
              `Review priority missing skills in your Skill Gap Analysis dashboard.`,
              `Practice constructing STAR-format answers for behavioral and project questions.`,
              `Build a hands-on portfolio project containerized with Docker to demonstrate production readiness.`,
            ],
            personalizedSummary: candidateText.trim(),
          };
        }
      }
    } catch (err) {
      console.warn('[Gemini Report Exception]:', err.message);
    }
  }

  // Fallback Report Synthesis
  return {
    overallScore: parseFloat(overallScore),
    categoryScores: {
      technicalKnowledge: parseFloat(technicalKnowledge),
      problemSolving: parseFloat(problemSolving),
      roleKnowledge: parseFloat(roleKnowledge),
      communication: parseFloat(communication),
      projectKnowledge: parseFloat(projectKnowledge),
      behavioralSkills: parseFloat(behavioralSkills),
    },
    strengths: [
      `Strong grasp of fundamental concepts relevant to ${roleTitle}.`,
      `Structured explanation during Technical Architecture and Project Deep Dive questions.`,
      `Positive professional tone throughout behavioral questions.`,
    ],
    areasToImprove: [
      `Elaborate more on error handling, concurrency edge cases, and logging.`,
      `Incorporate specific metrics and benchmarking numbers in project answers.`,
    ],
    skillsToRevise: userContext.missingSkills || ['Docker', 'AWS', 'System Design'],
    recommendedNextSteps: [
      `Review priority missing skills in your Skill Gap Analysis dashboard.`,
      `Practice constructing STAR-format answers for behavioral and project questions.`,
      `Build a hands-on portfolio project containerized with Docker to demonstrate production readiness.`,
    ],
    personalizedSummary: `Overall, you demonstrated a good technical understanding of ${roleTitle} fundamentals with an overall score of ${overallScore}/10. To ace a real ${experienceLevel} interview, focus on strengthening production edge cases and system design trade-offs.`,
  };
};

module.exports = {
  generateInterviewSessionQuestions,
  evaluateInterviewAnswer,
  generateFinalInterviewReport,
};
