const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Skill = require('../models/Skill');

/**
 * 1. Extract raw text from PDF or DOCX file
 */
const extractTextFromFile = async (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    return '';
  }
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      if (typeof pdfParse === 'function') {
        const data = await pdfParse(dataBuffer);
        return data.text || '';
      } else if (pdfParse && pdfParse.PDFParse) {
        const parser = new pdfParse.PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        return result.text || '';
      }
    } else if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }
  } catch (error) {
    console.error(`[NLP Error] Text extraction failed for ${filePath}:`, error.message);
  }
  return '';
};

/**
 * 2. Parse comprehensive resume information using rule-based NLP patterns
 */
const parseResumeDetails = async (text) => {
  if (!text) {
    return {
      skills: [],
      extractedSkills: [],
      matchedSkills: [],
      education: [],
      certifications: [],
      projects: [],
      experienceYears: 0,
      contactInfo: {},
    };
  }

  const lowerText = text.toLowerCase();

  // A. Extract Skills against master database & taxonomy
  const allSkills = await Skill.find();
  const matchedSkills = [];
  const matchedSkillIds = [];

  for (const s of allSkills) {
    const name = s.skillName.toLowerCase();
    const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText) || lowerText.includes(name)) {
      matchedSkills.push(s);
      matchedSkillIds.push(s._id);
    }
  }

  // B. Extract Education (Degrees, Universities, CGPA/Percentages)
  const education = [];
  const degreeRegex = /(b\.?tech|bachelor|m\.?tech|master|intermediate|10th|ssc|cbse|tsbie|cgpa|percentage)/gi;
  const eduLines = text.split('\n').filter((line) => degreeRegex.test(line));

  eduLines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.length > 5 && trimmed.length < 150) {
      education.push(trimmed);
    }
  });

  // C. Extract Certifications
  const certifications = [];
  const certKeywords = ['certification', 'certified', 'infosys springboard', 'nptel', 'netacad', 'cisco', 'coursera', 'skill boost', 'hackerrank'];
  text.split('\n').forEach((line) => {
    const l = line.toLowerCase();
    if (certKeywords.some((kw) => l.includes(kw))) {
      const trimmed = line.trim().replace(/^[\s•\-\*\.]+/g, '');
      if (trimmed.length > 5 && trimmed.length < 120 && !certifications.includes(trimmed)) {
        certifications.push(trimmed);
      }
    }
  });

  // D. Extract Projects
  const projects = [];
  const projectKeywords = ['project', 'developed', 'architected', 'constructed', 'built', 'engineered'];

  text.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.includes('–') || trimmed.includes('-') || trimmed.includes('|')) {
      const parts = trimmed.split(/[-–|]/);
      if (parts.length >= 2 && parts[0].length < 40 && projectKeywords.some((k) => trimmed.toLowerCase().includes(k) || parts[1].toLowerCase().includes('tech'))) {
        projects.push({
          title: parts[0].trim(),
          description: parts.slice(1).join(' - ').trim(),
        });
      }
    }
  });

  // E. Extract Experience Years
  let experienceYears = 0;
  const expMatch = lowerText.match(/(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/i);
  if (expMatch) {
    experienceYears = parseFloat(expMatch[1]);
  } else {
    if (lowerText.includes('senior') || lowerText.includes('lead')) {
      experienceYears = 5;
    } else if (lowerText.includes('intermediate') || lowerText.includes('developer')) {
      experienceYears = 2;
    } else {
      experienceYears = 1;
    }
  }

  // F. Extract Contact Information
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

  const contactInfo = {
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
  };

  return {
    extractedSkills: matchedSkillIds,
    matchedSkills,
    education: education.slice(0, 5),
    certifications: certifications.slice(0, 8),
    projects: projects.slice(0, 5),
    experienceYears,
    contactInfo,
  };
};

module.exports = {
  extractTextFromFile,
  parseResumeDetails,
  extractSkillsAndExperience: parseResumeDetails,
};

