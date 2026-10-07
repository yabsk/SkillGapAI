import React from 'react';

const ProgressGauge = ({ percentage = 0, label = 'Match Score', size = 160 }) => {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = '#137C73'; // Teal
  if (percentage < 50) strokeColor = '#FF7568'; // Coral
  else if (percentage < 75) strokeColor = '#0B4F4A'; // Deep Teal

  return (
    <div style={styles.container}>
      <svg width={size} height={size} style={styles.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(11, 79, 74, 0.1)"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      <div style={styles.content}>
        <span style={styles.percentText}>{percentage}%</span>
        <span style={styles.labelText}>{label}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: 'rotate(-90deg)',
  },
  content: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0B4F4A',
  },
  labelText: {
    fontSize: '0.75rem',
    color: '#536B67',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
};

export default ProgressGauge;
