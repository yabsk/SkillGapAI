import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        SkillGap AI &copy; 2026 | Department of Computer Science & Engineering | Anurag University Mini Project
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: 'center',
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid rgba(11, 79, 74, 0.12)',
    color: '#7F9793',
    background: '#FAF8F2',
    fontSize: '0.8rem',
    marginTop: 'auto',
  },
  text: {
    margin: 0,
  },
};

export default Footer;
