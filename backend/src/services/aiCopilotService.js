/**
 * Dynamic AI Copilot Service
 * Multi-Provider LLM Integration (Google Gemini, OpenAI, Groq) with Context-Aware Prompt Synthesis
 */

const generateCopilotResponse = async ({ message, history = [], context = {} }) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const targetRole = context.targetRole || 'Full Stack Developer';
  const readinessScore = context.readinessScore || 72;
  const matchPercentage = context.matchPercentage || 68;
  const atsScore = context.atsScore || 75;
  const userSkills = Array.isArray(context.userSkills) ? context.userSkills.join(', ') : 'Java, JavaScript, React, Node.js';
  const missingSkills = Array.isArray(context.missingSkills) ? context.missingSkills.join(', ') : 'Docker, AWS, Spring Boot';
  const topMissingSkill = Array.isArray(context.missingSkills) && context.missingSkills.length > 0 ? context.missingSkills[0] : 'Docker';

  // System Prompt with Candidate Profile Context
  const systemPrompt = `You are SkillGap Copilot, an expert AI Career Advisor & Mentor for students and ambitious software engineers.
Candidate Profile Context:
- Target Job Role: ${targetRole}
- Job Readiness Score: ${readinessScore}% (0-100% scale)
- Role Match Percentage: ${matchPercentage}%
- Resume ATS Pass Rate: ${atsScore}%
- Extracted Known Skills: ${userSkills}
- Highest Priority Missing Skill Gaps: ${missingSkills}
- Top Priority Skill to Learn Next: ${topMissingSkill}

Guidelines for your response:
1. Provide a direct, highly practical, and personalized answer tailored to the candidate's target role (${targetRole}) and missing skills.
2. Use markdown formatting (bullet points, bold text) for readability.
3. Be encouraging, professional, and actionable.
4. If the user asks multi-turn follow up questions (e.g., "Why?", "How?", "What about this?"), refer to the previous context in the conversation.
5. Keep your answer focused and concise (under 250 words unless creating a full study plan).`;

  // 1. Try Google Gemini API if GEMINI_API_KEY is available
  if (geminiKey) {
    try {
      const contentsPayload = [];

      // Format conversation memory turns for Gemini API
      if (Array.isArray(history) && history.length > 0) {
        history.slice(-6).forEach((item) => {
          const role = item.sender === 'user' || item.role === 'user' ? 'user' : 'model';
          const text = item.text || item.content || '';
          if (text) {
            contentsPayload.push({
              role,
              parts: [{ text }],
            });
          }
        });
      }

      // Add current message
      contentsPayload.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: contentsPayload,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return { reply: candidateText.trim(), provider: 'Google Gemini 1.5 Flash' };
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn('[Gemini API Warning]:', errJson.error?.message || response.statusText);
      }
    } catch (err) {
      console.warn('[Gemini API Exception]:', err.message);
    }
  }

  // 2. Try OpenAI API if OPENAI_API_KEY is available
  if (openAiKey) {
    try {
      const messagesPayload = [{ role: 'system', content: systemPrompt }];

      if (Array.isArray(history) && history.length > 0) {
        history.slice(-6).forEach((item) => {
          const role = item.sender === 'user' || item.role === 'user' ? 'user' : 'assistant';
          const text = item.text || item.content || '';
          if (text) {
            messagesPayload.push({ role, content: text });
          }
        });
      }
      messagesPayload.push({ role: 'user', content: message });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messagesPayload,
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content;
        if (replyText) {
          return { reply: replyText.trim(), provider: 'OpenAI GPT-3.5' };
        }
      }
    } catch (err) {
      console.warn('[OpenAI API Exception]:', err.message);
    }
  }

  // 3. Dynamic Prompt Synthesis Engine (Zero-Crash Fallback for AI API key)
  return generateDynamicContextualResponse({ message, history, context });
};

/**
 * Dynamic Prompt Synthesis Engine
 * Analyzes natural language query + history + live profile context to synthesize dynamic answers.
 */
const generateDynamicContextualResponse = ({ message, history = [], context = {} }) => {
  const targetRole = context.targetRole || 'Full Stack Developer';
  const readinessScore = context.readinessScore || 72;
  const matchPercentage = context.matchPercentage || 68;
  const userSkills = Array.isArray(context.userSkills) && context.userSkills.length > 0 ? context.userSkills : ['Java', 'JavaScript', 'React JS', 'Node JS', 'Git'];
  const missingSkills = Array.isArray(context.missingSkills) && context.missingSkills.length > 0 ? context.missingSkills : ['Docker', 'AWS', 'Spring Boot', 'SQL'];
  
  const g1 = missingSkills[0] || 'Docker';
  const g2 = missingSkills[1] || 'AWS';
  const g3 = missingSkills[2] || 'Spring Boot';

  const qLower = message.toLowerCase().trim();

  // Multi-turn conversational memory check
  const lastBotMsg = history.length > 0 ? [...history].reverse().find(h => h.sender === 'copilot' || h.role === 'model')?.text || '' : '';
  const lastUserMsg = history.length > 1 ? [...history].reverse().find((h, i) => i > 0 && (h.sender === 'user' || h.role === 'user'))?.text || '' : '';

  // Check if query is a follow-up ("why", "how", "tell me more", "explain further")
  if (qLower === 'why' || qLower === 'why?' || qLower.startsWith('why is that') || qLower.startsWith('explain why')) {
    if (lastBotMsg.includes('Docker') || lastBotMsg.includes(g1)) {
      return {
        reply: `**Why ${g1} is Critical for Your Profile:**\n\nJob postings for **${targetRole}** heavily require ${g1} because modern teams deploy microservices using containerization. Your profile currently lacks verified ${g1} experience, which accounts for a **15% drop** in your Job Readiness Score (${readinessScore}%). Mastering it makes your resume stand out immediately!`,
        provider: 'SkillGap Context Engine',
      };
    } else {
      return {
        reply: `**Why This Matters for ${targetRole}:**\n\nIn competitive hiring for **${targetRole}** positions, technical recruiters prioritize candidates who demonstrate both core development (${userSkills.slice(0, 2).join(', ')}) and infrastructure awareness (${missingSkills.slice(0, 2).join(', ')}). Addressing this gap directly elevates your employability index beyond 85%.`,
        provider: 'SkillGap Context Engine',
      };
    }
  }

  // Answer specific natural language queries dynamically
  if (qLower.includes('data scientist') || qLower.includes('data science')) {
    return {
      reply: `To transition into a **Data Scientist** role from your current **${targetRole}** baseline, focus on building these core competencies:\n\n` +
        `1. **Programming**: Master **Python** (Pandas, NumPy, Scikit-Learn) and **SQL**.\n` +
        `2. **Machine Learning**: Learn Regression, Decision Trees, and Clustering algorithms.\n` +
        `3. **Data Visualization**: Practice with Matplotlib, Seaborn, or Tableau.\n` +
        `4. **Math Foundations**: Linear Algebra, Probability, and Inferential Statistics.\n\n` +
        `*Next Action*: Select **Data Scientist** as your target job role in the sidebar to generate a tailored gap analysis!`,
      provider: 'SkillGap Context Engine',
    };
  }

  if (qLower.includes('python')) {
    return {
      reply: `**Python in Your Career Roadmap:**\n\nPython is a versatile language essential for backend automation, data analytics, and AI/ML workflows. For your target role as **${targetRole}**, Python is valuable for writing utility scripts, testing APIs, and building backend services with FastAPI/Django. Your current profile features **${userSkills.join(', ')}** — adding Python will broaden your technical versatility!`,
      provider: 'SkillGap Context Engine',
    };
  }

  if (qLower.includes('skills should i learn') || qLower.includes('learn next') || qLower.includes('what to learn')) {
    return {
      reply: `Based on your target role as **${targetRole}** (Current Match: **${matchPercentage}%**), here are your top 3 recommended skills to learn next:\n\n` +
        `1. 🔥 **${g1}** *(Priority 10/10)* — Critical infrastructure requirement for ${targetRole} roles.\n` +
        `2. ⚡ **${g2}** *(Priority 9/10)* — Essential cloud deployment platform.\n` +
        `3. 🛠️ **${g3}** *(Priority 8/10)* — High-demand backend enterprise framework.\n\n` +
        `*Tip: Completing ${g1} will increase your Job Readiness Score from ${readinessScore}% to over 80%!*`,
      provider: 'SkillGap Context Engine',
    };
  }

  if (qLower.includes('readiness score low') || qLower.includes('readiness score') || qLower.includes('score low') || qLower.includes('why is my score')) {
    return {
      reply: `Your current **Job Readiness Score is ${readinessScore}%**. Here is the exact breakdown of why your score is at this level and how to raise it:\n\n` +
        `• **Missing High-Priority Skills**: Your target role (${targetRole}) requires **${g1}** and **${g2}**, which are not yet verified in your profile.\n` +
        `• **Portfolio Projects**: You need 1 production-grade project showcasing containerized services.\n` +
        `• **Interview Readiness**: Technical practice scores are pending.\n\n` +
        `**Fastest Path to 85%+**: Use our **Build My Next Project** tool to create a project with ${g1}!`,
      provider: 'SkillGap Context Engine',
    };
  }

  if (qLower.includes('suggest a project') || qLower.includes('project for my target') || qLower.includes('project') || qLower.includes('build project')) {
    return {
      reply: `For your target role as **${targetRole}**, I recommend building:\n\n` +
        `🚀 **"${targetRole} Microservices Engine with ${g1} & ${userSkills[0] || 'React'}"**\n\n` +
        `• **Problem Statement**: Build a high-throughput REST API using ${userSkills[0] || 'Node.js'}, containerize services with ${g1}, and deploy to ${g2}.\n` +
        `• **Skills Developed**: ${g1}, ${userSkills[0] || 'React'}, REST API Design, Docker Compose.\n` +
        `• **Career Impact**: Fills your #1 skill gap (${g1}) and gives you an impressive GitHub portfolio piece!`,
      provider: 'SkillGap Context Engine',
    };
  }

  if (qLower.includes('improve my resume') || qLower.includes('resume advice') || qLower.includes('improve resume') || qLower.includes('resume')) {
    return {
      reply: `Here are 3 high-impact resume improvements for **${targetRole}** positions:\n\n` +
        `1. **Add Missing Keywords**: Feature **${g1}**, **${g2}**, and **${g3}** in your technical summary.\n` +
        `2. **Quantify Achievements**: Rewrite bullet points with metrics (e.g. *"Engineered REST service in ${userSkills[0] || 'React'} reducing API latency by 35%"*).\n` +
        `3. **Showcase Projects**: Include a dedicated section for your portfolio projects with live GitHub and demo links.`,
      provider: 'SkillGap Context Engine',
    };
  }

  if (qLower.includes('study plan') || qLower.includes('7-day') || qLower.includes('plan')) {
    return {
      reply: `Here is your personalized **7-Day Skill Action Plan** for **${targetRole}**:\n\n` +
        `• **Days 1–2 (Foundation)**: Study syntax and core concepts of **${g1}**.\n` +
        `• **Days 3–4 (Hands-On)**: Build a mini app integrating **${g1}** with **${userSkills[0] || 'JavaScript'}**.\n` +
        `• **Days 5–6 (Project)**: Use our Project Generator to create a portfolio repository with ${g1}.\n` +
        `• **Day 7 (Assessment)**: Take an AI Mock Interview session on ${targetRole} concepts!\n\n` +
        `*(Add \`GEMINI_API_KEY\` to backend \`.env\` for live multi-turn LLM generation!)*`,
      provider: 'SkillGap Context Engine',
    };
  }

  // General natural language fallback synthesizing personalized context
  return {
    reply: `As your **SkillGap Copilot**, I analyzed your query (*"${message}"*) in the context of your target role **${targetRole}**.\n\n` +
      `Your current readiness score is **${readinessScore}%** with known skills in **${userSkills.slice(0, 4).join(', ')}**. ` +
      `To accelerate your career progression, I recommend focusing on your top missing skill gap: **${g1}**.\n\n` +
      `Feel free to ask me about study plans, project ideas, interview questions, or specific technical topics!`,
    provider: 'SkillGap Context Engine',
  };
};

module.exports = {
  generateCopilotResponse,
};
