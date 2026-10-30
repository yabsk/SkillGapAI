import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../services/authService';
import { UserPlus, Sparkles, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register({ name, email, password });
      if (res.success && res.data) {
        loginSuccess(res.data);
        if (res.data.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/target-role');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconBox}>
            <Sparkles size={24} color="#137C73" />
          </div>
          <h2>Create Your Account</h2>
          <p style={styles.subtitle}>Start your AI skill gap analysis & career roadmap</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Keerthi Sri Yabaluri"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="input-control"
              placeholder="e.g. keerthi@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password (min 6 chars)</label>
            <input
              type="password"
              className="input-control"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Register Now</>}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Already have an account?</span>{' '}
          <Link to="/login" style={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(1rem, 4vw, 2rem)',
    background: '#F7F4EA',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    background: '#FFFFFF',
    border: '1px solid rgba(11, 79, 74, 0.12)',
    boxShadow: '0 10px 30px -5px rgba(11, 79, 74, 0.08)',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#B8F2E6',
    border: '1px solid rgba(19, 124, 115, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    color: '#536B67',
    fontSize: '0.9rem',
  },
  errorBox: {
    background: 'rgba(255, 117, 104, 0.15)',
    border: '1px solid rgba(255, 117, 104, 0.3)',
    color: '#FF7568',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  submitBtn: {
    width: '100%',
    marginTop: '0.5rem',
    padding: '0.85rem',
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#7F9793',
  },
  link: {
    color: '#137C73',
    fontWeight: '700',
  },
};

export default RegisterPage;
