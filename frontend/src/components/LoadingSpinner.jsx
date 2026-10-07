import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div style={styles.fullScreen}>
        <Loader2 size={36} color="#6366f1" className="spin" style={styles.spinIcon} />
        <span style={styles.text}>{message}</span>
      </div>
    );
  }

  return (
    <div style={styles.inline}>
      <Loader2 size={24} color="#6366f1" style={styles.spinIcon} />
      <span style={styles.text}>{message}</span>
    </div>
  );
};

const styles = {
  fullScreen: {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  inline: {
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  },
  text: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  spinIcon: {
    animation: 'spin 1s linear infinite',
  },
};

export default LoadingSpinner;
