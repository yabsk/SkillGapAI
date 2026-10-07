import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const SkillBadge = ({ skillName, status = 'matched', category }) => {
  const isMatched = status === 'matched';

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: '600',
    background: isMatched ? '#B8F2E6' : 'rgba(255, 117, 104, 0.15)',
    color: isMatched ? '#0B4F4A' : '#FF7568',
    border: isMatched ? '1px solid rgba(19, 124, 115, 0.3)' : '1px solid rgba(255, 117, 104, 0.3)',
  };

  return (
    <span style={badgeStyle}>
      {isMatched ? <CheckCircle2 size={13} color="#0B4F4A" /> : <AlertCircle size={13} color="#FF7568" />}
      {skillName} {category ? `(${category})` : ''}
    </span>
  );
};

export default SkillBadge;
