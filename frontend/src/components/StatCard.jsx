import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#0B4F4A' }) => {
  return (
    <div className="glass-card" style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        {Icon && (
          <div style={{ ...styles.iconBox, background: `${color}15`, borderColor: `${color}30` }}>
            <Icon size={20} color={color} />
          </div>
        )}
      </div>
      <div style={{ ...styles.value, color }}>
        {value}
      </div>
      {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    background: '#FFFFFF',
    border: '1px solid rgba(11, 79, 74, 0.12)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#536B67',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  iconBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: '2.2rem',
    fontWeight: '800',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '0.78rem',
    color: '#7F9793',
  },
};

export default StatCard;
