import React, { useState, useEffect } from 'react';
import { uploadResumeFile, getMyResume } from '../services/resumeService';
import SkillBadge from '../components/SkillBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileUp, FileText, CheckCircle2, AlertCircle, Sparkles, Calendar, Clock } from 'lucide-react';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await getMyResume();
      if (res.data) {
        setResume(res.data);
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a PDF or DOCX file to upload.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await uploadResumeFile(file);
      if (res.success && res.data) {
        setResume(res.data);
        setMessage({ type: 'success', text: 'Resume successfully uploaded and parsed with AI/NLP!' });
        setFile(null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to parse resume file.' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Checking active resume profile..." />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>
          Resume & <span className="gradient-text">NLP Skill Extraction</span>
        </h1>
        <p style={styles.subtitle}>
          Upload your latest resume (PDF or DOCX). Our NLP engine extracts technical skills and calculates work experience.
        </p>
      </div>

      {message.text && (
        <div
          style={{
            ...styles.alertBox,
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            borderColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
            color: message.type === 'success' ? '#34d399' : '#fb7185',
          }}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div style={styles.twoColumn}>
        {/* Upload Form Card */}
        <div className="glass-card" style={styles.uploadCard}>
          <h3>
            <FileUp size={20} color="#6366f1" /> Upload Resume Document
          </h3>
          <form onSubmit={handleUpload} style={styles.form}>
            <div style={styles.dropZone}>
              <FileText size={40} color="#818cf8" />
              <p style={styles.dropZoneText}>
                Drag and drop your resume file here or <span style={{ color: '#818cf8' }}>browse</span>
              </p>
              <span style={styles.dropZoneSub}>Supported formats: PDF, DOCX (Max 5MB)</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
            </div>

            {file && (
              <div style={styles.selectedFile}>
                <FileText size={16} color="#34d399" />
                <span>Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={uploading || !file}>
              {uploading ? 'Parsing Resume Text...' : <><Sparkles size={16} /> Run NLP Skill Extraction</>}
            </button>
          </form>
        </div>

        {/* Extracted Skills & Metadata Display */}
        <div className="glass-card" style={styles.resultCard}>
          <h3>Extracted Resume Profile</h3>
          {resume ? (
            <div style={styles.resultDetails}>
              <div style={styles.metaRow}>
                <div style={styles.metaItem}>
                  <FileText size={16} color="#6366f1" />
                  <span>File: <strong>{resume.fileName}</strong></span>
                </div>
                <div style={styles.metaItem}>
                  <Calendar size={16} color="#06b6d4" />
                  <span>Parsed: <strong>{new Date(resume.parsedDate).toLocaleDateString()}</strong></span>
                </div>
                <div style={styles.metaItem}>
                  <Clock size={16} color="#10b981" />
                  <span>Experience: <strong>{resume.experienceYears} Years</strong></span>
                </div>
              </div>

              <div style={styles.skillSection}>
                <h4>Auto-Detected Skills ({resume.extractedSkills?.length || 0})</h4>
                <div style={styles.badgeWrap}>
                  {resume.extractedSkills && resume.extractedSkills.length > 0 ? (
                    resume.extractedSkills.map((s) => (
                      <SkillBadge key={s._id || s.skillName} skillName={s.skillName} category={s.category} status="matched" />
                    ))
                  ) : (
                    <p style={styles.noText}>No skills automatically matched. Update or re-parse your resume.</p>
                  )}
                </div>
              </div>

              {resume.parsedText && (
                <div style={styles.textPreviewSection}>
                  <h4>Extracted Text Sample</h4>
                  <pre style={styles.textPreview}>
                    {resume.parsedText.substring(0, 500)}...
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <FileText size={48} color="#475569" />
              <p>No resume uploaded yet. Upload a resume to extract your skills.</p>
            </div>
          )}
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
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '0.95rem',
  },
  alertBox: {
    padding: '0.85rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '1.5rem',
  },
  uploadCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  dropZone: {
    border: '2px dashed rgba(99, 102, 241, 0.4)',
    borderRadius: '12px',
    padding: '2.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    background: 'rgba(15, 23, 42, 0.4)',
    position: 'relative',
    cursor: 'pointer',
  },
  dropZoneText: {
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  dropZoneSub: {
    fontSize: '0.78rem',
    color: '#64748b',
  },
  fileInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  selectedFile: {
    padding: '0.65rem 1rem',
    background: 'rgba(16, 185, 129, 0.1)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    color: '#34d399',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  resultCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  resultDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    padding: '0.85rem',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '10px',
    fontSize: '0.85rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  skillSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  badgeWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  noText: {
    color: '#64748b',
    fontSize: '0.85rem',
  },
  textPreviewSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  textPreview: {
    background: 'rgba(15, 23, 42, 0.8)',
    padding: '0.85rem',
    borderRadius: '8px',
    fontSize: '0.78rem',
    color: '#94a3b8',
    whiteSpace: 'pre-wrap',
    maxHeight: '160px',
    overflowY: 'auto',
  },
  emptyState: {
    padding: '3rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    color: '#64748b',
    textAlign: 'center',
  },
};

export default ResumeUploadPage;
