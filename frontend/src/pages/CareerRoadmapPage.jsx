import React, { useState, useEffect } from 'react';
import { generateCareerRoadmap, getMyRoadmap, updateMilestoneStatus } from '../services/roadmapService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Map,
  Sparkles,
  BookOpen,
  Code,
  ExternalLink,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Award,
  Layers,
} from 'lucide-react';

// Comprehensive Skill Metadata Knowledge Base (Ensures EVERY step has complete structured data)
const SKILL_KNOWLEDGE_BASE = {
  'Docker': {
    category: 'Cloud/DevOps',
    whyItMatters: 'Essential containerization technology required for modern software deployment, environment isolation, and microservices architecture.',
    resources: [
      { type: 'DOCUMENTATION', title: 'Docker Official Docs & Getting Started Guide', platform: 'Docker Docs', url: 'https://docs.docker.com/get-started/', estimatedHours: 10 },
      { type: 'COURSE', title: 'Docker Containerization & Compose Masterclass', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/docker-simplified-with-hands-on-examples/', estimatedHours: 15 },
    ],
    project: {
      title: 'Multi-Container Microservice Stack with Docker Compose',
      description: 'Build and containerize a React frontend, Node/Express API backend, and MongoDB database using Docker Compose and Nginx reverse proxy.',
      difficultyLevel: 'Intermediate',
      techStack: ['Docker', 'Docker Compose', 'Nginx', 'Node.js'],
    },
    outcomes: [
      'Write optimized multi-stage Dockerfiles for minimal production image sizes.',
      'Orchestrate multi-container application stacks using Docker Compose.',
      'Configure persistent storage volumes and bridge container networks.',
      'Push and manage containerized application images on Docker Hub.',
    ],
    estimatedHours: 15,
    suggestedDuration: '1–2 Weeks',
  },

  'AWS': {
    category: 'Cloud Infrastructure & Services',
    whyItMatters: 'Industry-standard cloud platform essential for hosting, scaling, securing, and deploying enterprise web applications and DevOps pipelines.',
    resources: [
      { type: 'DOCUMENTATION', title: 'AWS Official Documentation & Developer Guides', platform: 'AWS Documentation', url: 'https://docs.aws.amazon.com/', estimatedHours: 20 },
      { type: 'COURSE', title: 'AWS Cloud Practitioner & Architect Foundations Guide', platform: 'AWS Skill Builder', url: 'https://aws.amazon.com/training/', estimatedHours: 25 },
    ],
    project: {
      title: 'Automated AWS EC2 & S3 Cloud Hosting Pipeline',
      description: 'Deploy a production web application on AWS EC2 behind an Application Load Balancer with S3 static media storage and IAM role policies.',
      difficultyLevel: 'Intermediate',
      techStack: ['AWS EC2', 'AWS S3', 'IAM', 'CloudWatch'],
    },
    outcomes: [
      'Provision EC2 virtual instances and configure VPC security group rules.',
      'Manage IAM users, roles, policies, and S3 bucket access permissions.',
      'Deploy auto-scaling groups and Application Load Balancers.',
      'Monitor server health metrics and log telemetry using AWS CloudWatch.',
    ],
    estimatedHours: 25,
    suggestedDuration: '2–3 Weeks',
  },

  'Kubernetes': {
    category: 'Cloud/DevOps',
    whyItMatters: 'Leading container orchestration engine for managing microservice clusters, automated scaling, self-healing, and high-availability production systems.',
    resources: [
      { type: 'DOCUMENTATION', title: 'Kubernetes Official Concepts & Interactive Guides', platform: 'Kubernetes.io', url: 'https://kubernetes.io/docs/home/', estimatedHours: 20 },
      { type: 'TUTORIAL', title: 'Kubernetes Cluster Administration Tutorial', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/learn-kubernetes-in-under-3-hours/', estimatedHours: 15 },
    ],
    project: {
      title: 'Kubernetes Microservices Cluster with Helm & Ingress',
      description: 'Deploy a multi-service application on a local Kubernetes cluster using Helm charts, Ingress controllers, and persistent volume claims.',
      difficultyLevel: 'Advanced',
      techStack: ['Kubernetes', 'Helm', 'kubectl', 'Ingress'],
    },
    outcomes: [
      'Write declarative YAML manifests for Deployments, Services, and ConfigMaps.',
      'Configure Ingress routing and SSL certificate management.',
      'Package and release microservices using Helm chart templates.',
      'Perform zero-downtime rolling updates and troubleshoot pod lifecycles.',
    ],
    estimatedHours: 30,
    suggestedDuration: '3 Weeks',
  },

  'React JS': {
    category: 'Frontend Development',
    whyItMatters: 'Dominant UI library for building interactive, component-driven web applications and client-side single-page architectures.',
    resources: [
      { type: 'DOCUMENTATION', title: 'React Official Documentation & Interactive Guide', platform: 'React.dev', url: 'https://react.dev/learn', estimatedHours: 15 },
      { type: 'COURSE', title: 'Modern React Component & State Architecture Masterclass', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/tag/react/', estimatedHours: 25 },
    ],
    project: {
      title: 'Interactive Real-Time Analytics Dashboard',
      description: 'Develop a responsive React dashboard featuring dynamic data charts, Context API global state management, custom Hooks, and REST API integration.',
      difficultyLevel: 'Intermediate',
      techStack: ['React JS', 'JavaScript', 'Context API', 'Vite'],
    },
    outcomes: [
      'Build modular, reusable component architectures with custom React Hooks.',
      'Manage complex client state using Context API and Redux Toolkit.',
      'Perform asynchronous REST API data fetching with robust loading/error states.',
      'Optimize web performance, code splitting, and component rendering.',
    ],
    estimatedHours: 20,
    suggestedDuration: '2 Weeks',
  },

  'Node JS': {
    category: 'Backend & Server Systems',
    whyItMatters: 'High-performance, event-driven JavaScript runtime required for scalable server backend architectures, microservices, and real-time REST APIs.',
    resources: [
      { type: 'DOCUMENTATION', title: 'Node.js Official Documentation & API Reference', platform: 'Nodejs.org', url: 'https://nodejs.org/en/docs/', estimatedHours: 15 },
      { type: 'COURSE', title: 'Node.js & Express REST API Architecture', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/tag/node-js/', estimatedHours: 20 },
    ],
    project: {
      title: 'Secure RESTful Microservices API Gateway',
      description: 'Architect a Node.js Express REST API featuring Bearer JWT authentication, request sanitization, rate limiting, and MongoDB database persistence.',
      difficultyLevel: 'Intermediate',
      techStack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    },
    outcomes: [
      'Design RESTful endpoints adhering to HTTP specifications and JSON standards.',
      'Implement authentication, authorization middleware, and password hashing.',
      'Handle asynchronous non-blocking event loops and database transactions.',
      'Implement centralized error handling and structured logging middleware.',
    ],
    estimatedHours: 20,
    suggestedDuration: '2 Weeks',
  },

  'Spring Boot': {
    category: 'Enterprise Java Backend',
    whyItMatters: 'Industry-standard Java framework for building enterprise-grade, highly secure RESTful microservices and backend systems.',
    resources: [
      { type: 'DOCUMENTATION', title: 'Spring Boot Official Guides & Reference Documentation', platform: 'Spring.io', url: 'https://spring.io/guides', estimatedHours: 20 },
      { type: 'COURSE', title: 'Enterprise REST Microservices in Spring Boot', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/tag/spring-boot/', estimatedHours: 25 },
    ],
    project: {
      title: 'Enterprise E-Commerce REST API Microservice',
      description: 'Build a production Spring Boot application with Spring Security, JPA Hibernate, PostgreSQL persistence, and Swagger/OpenAPI documentation.',
      difficultyLevel: 'Advanced',
      techStack: ['Spring Boot', 'Java', 'Spring Security', 'PostgreSQL'],
    },
    outcomes: [
      'Configure Spring Dependency Injection, Inversion of Control, and Beans.',
      'Design relational data models using Spring Data JPA and Hibernate ORM.',
      'Secure REST endpoints using Spring Security and JWT access tokens.',
      'Write unit and integration tests using JUnit 5 and Mockito.',
    ],
    estimatedHours: 30,
    suggestedDuration: '3 Weeks',
  },

  'Python': {
    category: 'Programming & Data Science',
    whyItMatters: 'Versatile programming language fundamental for backend automation, data analytics, machine learning algorithms, and cloud scripting.',
    resources: [
      { type: 'DOCUMENTATION', title: 'Python 3 Official Documentation & Tutorial', platform: 'Python.org', url: 'https://docs.python.org/3/tutorial/', estimatedHours: 15 },
      { type: 'COURSE', title: 'Python Programming & Data Analytics Guide', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/tag/python/', estimatedHours: 20 },
    ],
    project: {
      title: 'Automated Data Pipeline & Predictive Analysis Engine',
      description: 'Develop a Python application to ingest, clean, analyze, and visualize complex statistical datasets using Pandas, NumPy, and Matplotlib.',
      difficultyLevel: 'Beginner',
      techStack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    },
    outcomes: [
      'Master Object-Oriented and Functional Python programming syntax.',
      'Perform data cleaning, feature transformation, and aggregation with Pandas.',
      'Automate system tasks, file processing, and HTTP API integrations.',
      'Package and manage virtual environment dependencies with pip and venv.',
    ],
    estimatedHours: 20,
    suggestedDuration: '2 Weeks',
  },

  'SQL': {
    category: 'Database Systems',
    whyItMatters: 'Essential database querying language required for relational data modeling, ACID transactions, and backend data persistence.',
    resources: [
      { type: 'DOCUMENTATION', title: 'PostgreSQL Official Documentation & SQL Manual', platform: 'PostgreSQL.org', url: 'https://www.postgresql.org/docs/', estimatedHours: 15 },
      { type: 'TUTORIAL', title: 'Relational Database SQL Query Masterclass', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/tag/sql/', estimatedHours: 15 },
    ],
    project: {
      title: 'Relational E-Commerce Database Schema & Query Engine',
      description: 'Design a 3NF normalized SQL database with complex JOIN queries, compound indexes, stored procedures, and ACID transaction triggers.',
      difficultyLevel: 'Intermediate',
      techStack: ['SQL', 'PostgreSQL', 'Database Design'],
    },
    outcomes: [
      'Write complex SQL queries using JOINs, GROUP BY, and Window Functions.',
      'Design 3NF normalized relational database schemas.',
      'Optimize database read/write speeds using compound B-Tree indexes.',
      'Ensure data integrity using foreign keys, constraints, and transactions.',
    ],
    estimatedHours: 15,
    suggestedDuration: '1–2 Weeks',
  },

  'MongoDB': {
    category: 'Database Systems',
    whyItMatters: 'Leading NoSQL document database used in modern web stacks (MERN/MEAN) for flexible JSON-style schema persistence and fast querying.',
    resources: [
      { type: 'DOCUMENTATION', title: 'MongoDB Official Manual & Developer Guides', platform: 'MongoDB Docs', url: 'https://www.mongodb.com/docs/manual/', estimatedHours: 12 },
      { type: 'COURSE', title: 'MongoDB University Basics M001 Course', platform: 'MongoDB University', url: 'https://learn.mongodb.com/', estimatedHours: 12 },
    ],
    project: {
      title: 'High-Throughput NoSQL Analytics Document Store',
      description: 'Build a MongoDB document database utilizing aggregation framework pipelines, indexes, and schema validation rules.',
      difficultyLevel: 'Intermediate',
      techStack: ['MongoDB', 'Mongoose', 'NoSQL'],
    },
    outcomes: [
      'Model flexible BSON document schemas (embedding vs referencing).',
      'Construct complex Aggregation Framework pipelines ($match, $group, $lookup).',
      'Create single and compound indexes to optimize query performance.',
      'Connect MongoDB services to Node.js applications using Mongoose ODM.',
    ],
    estimatedHours: 15,
    suggestedDuration: '1–2 Weeks',
  },

  'Git': {
    category: 'Developer Tools & Collaboration',
    whyItMatters: 'Indispensable version control system required for team code collaboration, branching strategies, and CI/CD deployment integrations.',
    resources: [
      { type: 'DOCUMENTATION', title: 'Git Official Reference Documentation & Book', platform: 'Git-scm.com', url: 'https://git-scm.com/doc', estimatedHours: 8 },
      { type: 'TUTORIAL', title: 'Git & GitHub Crash Course for Developers', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/git-and-github-for-beginners/', estimatedHours: 6 },
    ],
    project: {
      title: 'Collaborative GitHub Repository with Feature Branching & Actions',
      description: 'Set up an open-source project repository with branch protection rules, pull request templates, and automated GitHub Actions workflows.',
      difficultyLevel: 'Beginner',
      techStack: ['Git', 'GitHub', 'GitHub Actions'],
    },
    outcomes: [
      'Manage branches, merges, rebasing, and cherry-picking seamlessly.',
      'Resolve merge conflicts and inspect commit history using git log and diff.',
      'Set up remote repositories on GitHub with SSH keys and access tokens.',
      'Automate code checks using Git hooks and PR review workflows.',
    ],
    estimatedHours: 10,
    suggestedDuration: '1 Week',
  },

  'CI/CD': {
    category: 'Cloud/DevOps',
    whyItMatters: 'Automates building, testing, and deploying code to deliver high-quality software continuously and reliably.',
    resources: [
      { type: 'DOCUMENTATION', title: 'GitHub Actions Official Documentation', platform: 'GitHub Docs', url: 'https://docs.github.com/en/actions', estimatedHours: 10 },
      { type: 'TUTORIAL', title: 'Automated CI/CD Pipelines Guide', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/tag/ci-cd/', estimatedHours: 12 },
    ],
    project: {
      title: 'Automated Multi-Stage CI/CD Deployment Pipeline',
      description: 'Build a GitHub Actions pipeline that runs linting, unit tests, builds Docker images, and deploys to cloud servers.',
      difficultyLevel: 'Intermediate',
      techStack: ['CI/CD', 'GitHub Actions', 'Docker'],
    },
    outcomes: [
      'Write YAML pipeline workflows with job dependencies and secrets.',
      'Integrate automated testing and code linting verification gates.',
      'Automate Docker container building and registry publishing.',
      'Deploy build artifacts automatically to staging and production environments.',
    ],
    estimatedHours: 15,
    suggestedDuration: '1–2 Weeks',
  },

  'REST APIs': {
    category: 'Backend Architecture',
    whyItMatters: 'Standard architectural style for designing scalable, decoupled web services and client-server communications.',
    resources: [
      { type: 'DOCUMENTATION', title: 'RESTful API Design Best Practices & HTTP Specs', platform: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP', estimatedHours: 10 },
      { type: 'TUTORIAL', title: 'REST API Design & Architecture Tutorial', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/rest-api-design-best-practices/', estimatedHours: 12 },
    ],
    project: {
      title: 'OpenAPI Documented RESTful Gateway Microservice',
      description: 'Design a RESTful API with HTTP status codes, pagination, rate limiting, and OpenAPI/Swagger interactive documentation.',
      difficultyLevel: 'Intermediate',
      techStack: ['REST APIs', 'OpenAPI', 'Express JS', 'JSON'],
    },
    outcomes: [
      'Structure clean REST endpoints adhering to resource naming conventions.',
      'Use proper HTTP verbs (GET, POST, PUT, DELETE, PATCH) and status codes.',
      'Implement response pagination, filtering, and field selection.',
      'Document API contracts using OpenAPI / Swagger specifications.',
    ],
    estimatedHours: 12,
    suggestedDuration: '1–2 Weeks',
  },
};

// Fallback generator for custom skills
const getEnrichedSkillData = (skillName, targetRoleTitle, fallbackCategory) => {
  if (SKILL_KNOWLEDGE_BASE[skillName]) {
    return SKILL_KNOWLEDGE_BASE[skillName];
  }

  const name = skillName || 'Technical Skill';
  const role = targetRoleTitle || 'Target Job Role';
  const cat = fallbackCategory || 'Technical Competency';

  return {
    category: cat,
    whyItMatters: `Crucial domain competency required for ${role} positions to build production-grade features and solve complex technical challenges.`,
    resources: [
      { type: 'DOCUMENTATION', title: `${name} Official Documentation & Reference Guide`, platform: `${name} Official Docs`, url: 'https://docs.oracle.com/en/', estimatedHours: 12 },
      { type: 'COURSE', title: `Mastering ${name} - Hands-On Developer Course`, platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/news/', estimatedHours: 15 },
    ],
    project: {
      title: `${name} Hands-On Integration Project`,
      description: `Build a production-ready application demonstrating deep practical understanding of ${name} and best practices.`,
      difficultyLevel: 'Intermediate',
      techStack: [name, 'Software Engineering', 'Best Practices'],
    },
    outcomes: [
      `Understand core principles and architectural patterns of ${name}.`,
      `Implement ${name} in real-world software modules with robust error handling.`,
      `Debug performance bottlenecks and optimize configuration settings.`,
      `Integrate ${name} into automated testing and deployment workflows.`,
    ],
    estimatedHours: 15,
    suggestedDuration: '1–2 Weeks',
  };
};

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
  const targetRoleTitle = roadmap?.targetRole?.title || 'Full Stack Developer';

  // Stepper Stage Progress Definition
  const stages = [
    { name: 'FOUNDATION', desc: 'Core Syntax & Basics' },
    { name: 'CORE SKILLS', desc: 'Frameworks & Databases' },
    { name: 'PROJECT BUILDING', desc: 'Real-World Microservices' },
    { name: 'INTERVIEW PREPARATION', desc: 'System Design & Debugging' },
    { name: 'JOB READY', desc: 'ATS Resume & Employability' },
  ];

  // Next Best Step Callout
  const nextStep = milestones.find((m) => m.status !== 'Completed') || milestones[0];

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.topBadge}>
            <Sparkles size={14} color="#137C73" /> PERSONALIZED CAREER ROADMAP
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0B4F4A', margin: '0.2rem 0' }}>
            Structured Step-by-Step Learning Journey
          </h2>
          <p style={styles.subtitle}>
            Target Job Role: <strong>{targetRoleTitle}</strong> • {milestones.length} Comprehensive Learning Milestones
          </p>
        </div>

        <button onClick={handleGenerateRoadmap} className="btn-primary" disabled={generating}>
          {generating ? 'Generating Steps...' : <><Sparkles size={16} /> Re-Generate Roadmap</>}
        </button>
      </div>

      {/* Progression Stepper Bar */}
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

      {/* Next Best Step Callout Box */}
      {nextStep && (
        <div style={styles.nextStepBox}>
          <div style={styles.nextHeader}>
            <Zap size={22} color="#0B4F4A" />
            <h3 style={styles.nextTitle}>Your Next Best Step</h3>
          </div>
          <p style={styles.nextDesc}>
            Master <strong>{nextStep.skill?.skillName || 'Docker'}</strong> → Complete the recommended hands-on project → Test your skills in an AI Mock Interview.
          </p>
          <div style={styles.nextActionRow}>
            <span style={styles.nextBadge}>Estimated Effort: ~15 Hours</span>
            <span style={styles.nextBadgeAlt}>Priority Status: High Priority</span>
          </div>
        </div>
      )}

      {roadmap ? (
        <div style={styles.content}>
          {/* Progress Tracker Banner */}
          <div className="glass-card" style={styles.progressBanner}>
            <div style={styles.progressText}>
              <div>
                <h3 style={{ margin: 0, color: '#0B4F4A', fontSize: '1.1rem' }}>Overall Milestone Progress</h3>
                <span style={{ fontSize: '0.85rem', color: '#536B67' }}>
                  {milestones.filter((m) => m.status === 'Completed').length} of {milestones.length} Milestones Completed
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0B4F4A' }}>
                {progress}%
              </div>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
            </div>
          </div>

          {/* DETAILED MILESTONE LIST (EVERY STEP HAS THE EXACT STRUCTURED FORMAT) */}
          <div style={styles.milestoneList}>
            {milestones.map((m, idx) => {
              const skillName = m.skill?.skillName || `Skill #${idx + 1}`;
              const skillId = m.skill?._id || m._id;
              const isDone = m.status === 'Completed';

              // Enrich every step with complete detailed data
              const enriched = getEnrichedSkillData(skillName, targetRoleTitle, m.skill?.category);

              // Merge DB resources/projects if available, fallback to enriched knowledge base
              const resourcesToDisplay = (m.resources && m.resources.length > 0)
                ? m.resources.map(r => ({
                    type: r.type?.toUpperCase() || 'COURSE',
                    title: r.title,
                    platform: r.platform || 'Online Platform',
                    url: r.url || 'https://docs.docker.com/',
                    estimatedHours: r.estimatedHours || 12,
                  }))
                : enriched.resources;

              const projectToDisplay = (m.projects && m.projects.length > 0)
                ? {
                    title: m.projects[0].title,
                    description: m.projects[0].description,
                    difficultyLevel: m.projects[0].difficultyLevel || 'Intermediate',
                    techStack: m.projects[0].techStack || [skillName],
                  }
                : enriched.project;

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
                  {/* 1. Step Header & Title */}
                  <div style={styles.mHeader}>
                    <div style={styles.mTitleGroup}>
                      <button
                        onClick={() => handleToggleMilestone(skillId, m.status)}
                        style={styles.checkBtn}
                        title="Toggle Milestone Completion"
                      >
                        {isDone ? (
                          <CheckCircle2 size={28} color="#137C73" />
                        ) : (
                          <Circle size={28} color="#7F9793" />
                        )}
                      </button>
                      <div>
                        <div style={styles.stepBadgeRow}>
                          <span style={styles.stepNumBadge}>STEP {idx + 1}</span>
                          <span style={styles.categoryBadge}>{enriched.category}</span>
                        </div>
                        <h3 style={{ textDecoration: isDone ? 'line-through' : 'none', color: '#0B4F4A', margin: '0.2rem 0', fontSize: '1.35rem', fontWeight: '800' }}>
                          Step {idx + 1}: Master {skillName}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleMilestone(skillId, m.status)}
                      style={isDone ? styles.doneBadgeBtn : styles.pendingBadgeBtn}
                    >
                      {isDone ? '✓ Completed' : 'Mark as Completed'}
                    </button>
                  </div>

                  {/* 2 & 3. Category & WHY IT MATTERS */}
                  <div style={styles.whyMattersBox}>
                    <div style={styles.whyMattersHeader}>
                      <Sparkles size={16} color="#137C73" />
                      <span style={styles.whyMattersTitle}>WHY IT MATTERS FOR {targetRoleTitle.toUpperCase()}</span>
                    </div>
                    <p style={styles.whyMattersText}>
                      "{enriched.whyItMatters}"
                    </p>
                  </div>

                  {/* 4. RECOMMENDED COURSES & DOCUMENTATION */}
                  <div style={styles.section}>
                    <h4 style={styles.subHeading}>
                      <BookOpen size={16} color="#137C73" /> Recommended Courses & Documentation
                    </h4>
                    <div style={styles.resourceGrid}>
                      {resourcesToDisplay.map((res, rIdx) => (
                        <a
                          key={rIdx}
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
                            <span><Clock size={12} /> {res.estimatedHours} Hours</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* 5. HANDS-ON RECOMMENDED PROJECT */}
                  <div style={styles.section}>
                    <h4 style={styles.subHeading}>
                      <Code size={16} color="#0B4F4A" /> Hands-on Recommended Project
                    </h4>
                    <div style={styles.projectCard}>
                      <div style={styles.projHeader}>
                        <strong style={styles.projTitle}>{projectToDisplay.title}</strong>
                        <span style={styles.diffBadge}>{projectToDisplay.difficultyLevel}</span>
                      </div>
                      <p style={styles.projDesc}>{projectToDisplay.description}</p>
                      <div style={styles.techStackWrap}>
                        {projectToDisplay.techStack?.map((t, i) => (
                          <span key={i} style={styles.techTag}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 6. LEARNING OUTCOMES */}
                  <div style={styles.section}>
                    <h4 style={styles.subHeading}>
                      <Award size={16} color="#137C73" /> Learning Outcomes
                    </h4>
                    <div style={styles.outcomesBox}>
                      <span style={styles.outcomesIntro}>After completing this step, you should be able to:</span>
                      <ul style={styles.outcomesList}>
                        {enriched.outcomes.map((outcome, oIdx) => (
                          <li key={oIdx}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 7. ESTIMATED EFFORT FOOTER */}
                  <div style={styles.effortFooter}>
                    <div style={styles.effortItem}>
                      <Clock size={14} color="#536B67" />
                      <span>Estimated Learning Time: <strong>{enriched.estimatedHours} Hours</strong></span>
                    </div>
                    <div style={styles.effortItem}>
                      <Zap size={14} color="#137C73" />
                      <span>Suggested Duration: <strong>{enriched.suggestedDuration}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card" style={styles.emptyCard}>
          <Map size={48} color="#0B4F4A" />
          <h3>No Career Roadmap Generated Yet</h3>
          <p style={styles.subtitle}>Run a skill gap analysis to generate your structured learning roadmap.</p>
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
    gap: '1.75rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  topBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontSize: '0.78rem',
    fontWeight: '700',
  },
  subtitle: {
    color: '#536B67',
    fontSize: '0.92rem',
    margin: 0,
  },
  stepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem clamp(0.75rem, 3vw, 1.5rem)',
    background: '#FFFFFF',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  stageItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.25rem',
    minWidth: '95px',
    flexShrink: 0,
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
    margin: 0,
  },
  nextDesc: {
    fontSize: '0.92rem',
    color: '#0B4F4A',
    margin: 0,
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
    padding: '1.25rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    background: 'linear-gradient(90deg, #137C73 0%, #B8F2E6 100%)',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  milestoneList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
  },
  milestoneCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    padding: 'clamp(1rem, 3vw, 1.75rem)',
    borderRadius: '14px',
    border: '1px solid rgba(11, 79, 74, 0.12)',
  },
  mHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  mTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  checkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  stepBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  stepNumBadge: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#FFFFFF',
    background: '#0B4F4A',
    padding: '0.2rem 0.55rem',
    borderRadius: '6px',
    letterSpacing: '0.5px',
  },
  categoryBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#0B4F4A',
    background: '#FAF8F2',
    padding: '0.2rem 0.55rem',
    borderRadius: '6px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
  },
  doneBadgeBtn: {
    padding: '0.45rem 1rem',
    borderRadius: '20px',
    background: '#137C73',
    color: '#FFFFFF',
    fontSize: '0.82rem',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
  },
  pendingBadgeBtn: {
    padding: '0.45rem 1rem',
    borderRadius: '20px',
    background: '#FAF8F2',
    color: '#0B4F4A',
    border: '1px solid rgba(11, 79, 74, 0.2)',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  whyMattersBox: {
    background: '#FAF8F2',
    padding: '1rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  whyMattersHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  whyMattersTitle: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#137C73',
    letterSpacing: '0.5px',
  },
  whyMattersText: {
    fontSize: '0.9rem',
    color: '#2C3E3B',
    lineHeight: 1.5,
    margin: 0,
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
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#0B4F4A',
    margin: 0,
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    gap: '1rem',
  },
  resourceCard: {
    padding: '1rem',
    background: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textDecoration: 'none',
  },
  resHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resType: {
    fontSize: '0.7rem',
    color: '#137C73',
    fontWeight: '800',
    letterSpacing: '0.5px',
  },
  resTitle: {
    fontSize: '0.9rem',
    color: '#0B4F4A',
    lineHeight: 1.35,
  },
  resMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.78rem',
    color: '#536B67',
    marginTop: '0.25rem',
  },
  projectCard: {
    padding: '1.15rem',
    background: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  projHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  diffBadge: {
    fontSize: '0.72rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '12px',
    background: '#B8F2E6',
    color: '#0B4F4A',
    fontWeight: '800',
  },
  projDesc: {
    fontSize: '0.88rem',
    color: '#536B67',
    lineHeight: 1.5,
    margin: 0,
  },
  techStackWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginTop: '0.25rem',
  },
  techTag: {
    fontSize: '0.72rem',
    padding: '0.2rem 0.55rem',
    borderRadius: '6px',
    background: '#FAF8F2',
    color: '#0B4F4A',
    border: '1px solid rgba(11, 79, 74, 0.1)',
    fontWeight: '600',
  },
  outcomesBox: {
    background: '#FFFFFF',
    padding: '1rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid rgba(11, 79, 74, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  outcomesIntro: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#0B4F4A',
  },
  outcomesList: {
    paddingLeft: '1.25rem',
    fontSize: '0.85rem',
    color: '#536B67',
    lineHeight: 1.6,
    margin: 0,
  },
  effortFooter: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(11, 79, 74, 0.08)',
  },
  effortItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    color: '#536B67',
  },
  emptyCard: {
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    background: '#FFFFFF',
    borderRadius: '12px',
  },
};

export default CareerRoadmapPage;
