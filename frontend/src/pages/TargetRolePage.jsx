import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getJobRoles, selectTargetRole } from '../services/jobRoleService';
import SkillBadge from '../components/SkillBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';

const TargetRolePage = () => {
  const { user, updateUserTargetRole } = useContext(AuthContext);
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobRoles();
  }, []);

  const fetchJobRoles = async () => {
    try {
      const res = await getJobRoles();
      if (res.data) {
        setJobRoles(res.data);
      }
    } catch (err) {
      console.error('Error fetching job roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = async (roleObj) => {
    setSelectingId(roleObj._id);
    try {
      const res = await selectTargetRole(roleObj._id);
      if (res.success) {
        updateUserTargetRole(roleObj);
        navigate('/skill-gap');
      }
    } catch (err) {
      console.error('Error selecting target role:', err);
    } finally {
      setSelectingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading target job roles..." />;

  const currentRoleId = user?.targetRole?._id || user?.targetRole;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>
          Select Target <span className="gradient-text">Job Role</span>
        </h1>
        <p style={styles.subtitle}>
          Choose your target career specialization. SkillGap AI will perform semantic skill gap analysis against its skill requirements.
        </p>
      </div>

      <div style={styles.roleGrid}>
        {jobRoles.map((role) => {
          const isSelected = currentRoleId === role._id;
          return (
            <div
              key={role._id}
              className="glass-card"
              style={{
                ...styles.roleCard,
                borderColor: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.titleGroup}>
                  <div style={styles.iconBox}>
                    <Target size={20} color={isSelected ? '#818cf8' : '#64748b'} />
                  </div>
                  <div>
                    <h3 style={styles.roleTitle}>{role.title}</h3>
                    <span style={styles.categoryBadge}>{role.industryCategory}</span>
                  </div>
                </div>

                {isSelected && (
                  <span style={styles.activeLabel}>
                    <CheckCircle2 size={16} /> Active Target
                  </span>
                )}
              </div>

              <p style={styles.roleDesc}>{role.description}</p>

              <div style={styles.skillsSection}>
                <h4 style={styles.skillsHeading}>Required Industry Skills ({role.requiredSkills?.length || 0})</h4>
                <div style={styles.badgeWrap}>
                  {role.requiredSkills?.map((req) => {
                    const sName = req.skill?.skillName || 'Skill';
                    return (
                      <SkillBadge
                        key={req._id || sName}
                        skillName={`${sName} (${req.proficiencyLevel})`}
                        status="matched"
                      />
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handleSelectRole(role)}
                className={isSelected ? 'btn-secondary' : 'btn-primary'}
                style={styles.selectBtn}
                disabled={selectingId === role._id}
              >
                {selectingId === role._id
                  ? 'Setting Target Role...'
                  : isSelected
                  ? 'Target Selected (Analyze Skills)'
                  : <>Select Target Role <ArrowRight size={16} /></>}
              </button>
            </div>
          );
        })}
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
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1.25rem',
  },
  roleCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    position: 'relative',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  categoryBadge: {
    fontSize: '0.75rem',
    color: '#06b6d4',
    fontWeight: '600',
  },
  activeLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.3rem 0.65rem',
    borderRadius: '20px',
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#34d399',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  roleDesc: {
    color: '#94a3b8',
    fontSize: '0.88rem',
    lineHeight: 1.5,
  },
  skillsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  skillsHeading: {
    fontSize: '0.82rem',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  badgeWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  selectBtn: {
    marginTop: 'auto',
    width: '100%',
    padding: '0.75rem',
  },
};

export default TargetRolePage;
