import React, { useState, useEffect } from 'react';
import { getAdminStats, createSkill, createJobRole } from '../services/adminService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, Users, FileText, Target, Award, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Skill Form State
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [skillMsg, setSkillMsg] = useState('');

  // Role Form State
  const [roleTitle, setRoleTitle] = useState('');
  const [industryCategory, setIndustryCategory] = useState('Software Engineering');
  const [roleDesc, setRoleDesc] = useState('');
  const [roleMsg, setRoleMsg] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    setSkillMsg('');
    try {
      const res = await createSkill({ skillName, category });
      if (res.success) {
        setSkillMsg(`Skill "${skillName}" created successfully!`);
        setSkillName('');
        fetchStats();
      }
    } catch (err) {
      setSkillMsg(err.response?.data?.error || 'Failed to create skill.');
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setRoleMsg('');
    try {
      const res = await createJobRole({ title: roleTitle, industryCategory, description: roleDesc });
      if (res.success) {
        setRoleMsg(`Job Role "${roleTitle}" created successfully!`);
        setRoleTitle('');
        setRoleDesc('');
        fetchStats();
      }
    } catch (err) {
      setRoleMsg(err.response?.data?.error || 'Failed to create job role.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading admin control panel..." />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>
          System <span className="gradient-text">Admin Dashboard</span>
        </h1>
        <p style={styles.subtitle}>
          Manage Master Skills Repository, Target Job Roles, Learning Resources, and System Analytics.
        </p>
      </div>

      {/* Admin Metrics Row */}
      <div style={styles.metricsGrid}>
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="#6366f1" />
        <StatCard title="Analyzed Resumes" value={stats?.totalResumes || 0} icon={FileText} color="#06b6d4" />
        <StatCard title="Target Job Roles" value={stats?.totalRoles || 0} icon={Target} color="#8b5cf6" />
        <StatCard title="Avg Readiness" value={`${stats?.avgReadinessScore || 0}%`} icon={Award} color="#10b981" />
      </div>

      {/* Admin Management Forms */}
      <div style={styles.twoColumn}>
        {/* Master Skill Form */}
        <div className="glass-card" style={styles.formCard}>
          <h3>
            <Plus size={20} color="#6366f1" /> Add Master Skill
          </h3>
          {skillMsg && <div style={styles.msgBox}><CheckCircle2 size={16} /> {skillMsg}</div>}
          <form onSubmit={handleCreateSkill} style={styles.form}>
            <div className="form-group">
              <label>Skill Name</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Next.js, Kubernetes"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="input-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ background: 'rgba(15, 23, 42, 0.9)' }}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Cloud/DevOps">Cloud/DevOps</option>
                <option value="Programming">Programming</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Soft Skill">Soft Skill</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={16} /> Save Skill
            </button>
          </form>
        </div>

        {/* Job Role Form */}
        <div className="glass-card" style={styles.formCard}>
          <h3>
            <Target size={20} color="#06b6d4" /> Add Industry Job Role
          </h3>
          {roleMsg && <div style={styles.msgBox}><CheckCircle2 size={16} /> {roleMsg}</div>}
          <form onSubmit={handleCreateRole} style={styles.form}>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Cloud Solutions Architect"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Industry Category</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Cloud Infrastructure"
                value={industryCategory}
                onChange={(e) => setIndustryCategory(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                className="input-control"
                rows={2}
                placeholder="Brief role responsibilities description..."
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
              <Plus size={16} /> Save Job Role
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
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
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '1.5rem',
  },
  formCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  msgBox: {
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#34d399',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
};

export default AdminDashboardPage;
