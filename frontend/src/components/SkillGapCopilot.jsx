import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { MessageSquare, X, Send, Sparkles, Bot, User, AlertCircle } from 'lucide-react';

const SkillGapCopilot = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: 'Hello! I am your SkillGap Copilot. Ask me anything about your skills, readiness score, target role, project ideas, or personalized study plans!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'What skills should I learn next?',
    'Why is my readiness score low?',
    'Suggest a project for my target role.',
    'How can I improve my resume?',
    'Create a 7-day study plan.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  if (!isAuthenticated) return null;

  const sendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text || !text.trim() || loading) return;

    const cleanText = text.trim();
    const newMessages = [...messages, { sender: 'user', text: cleanText }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    // Format chat history for AI memory (exclude greeting, pass recent turns)
    const historyPayload = newMessages
      .filter((m, idx) => idx > 0)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

    try {
      const res = await api.post('/copilot/chat', {
        message: cleanText,
        history: historyPayload,
      });

      if (res.data && res.data.data) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'copilot',
            text: res.data.data.reply,
            provider: res.data.data.provider,
          },
        ]);
      }
    } catch (err) {
      console.error('Copilot API Error:', err);
      const errDetail = err.response?.data?.error || 'Unable to connect to AI Copilot service. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: `⚠️ **Service Notice**: ${errDetail}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.floatingContainer}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.floatingBtn}
          className="pulse"
          title="Open SkillGap Copilot"
        >
          <Sparkles size={20} color="#0B4F4A" />
          <span>Copilot</span>
        </button>
      )}

      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerTitle}>
              <div style={styles.botIcon}>
                <Bot size={20} color="#0B4F4A" />
              </div>
              <div>
                <h4 style={styles.titleText}>SkillGap Copilot</h4>
                <span style={styles.statusText}>Dynamic AI Career Advisor</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
              <X size={18} color="#536B67" />
            </button>
          </div>

          {/* Messages Body */}
          <div style={styles.messagesContainer}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.messageRow,
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.sender === 'copilot' && (
                  <div style={styles.msgBotAvatar}>
                    <Bot size={14} color="#0B4F4A" />
                  </div>
                )}
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.sender === 'user' ? styles.userBubble : styles.botBubble),
                    ...(msg.isError ? styles.errorBubble : {}),
                  }}
                >
                  <span dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} />
                  {msg.provider && <div style={styles.providerTag}>{msg.provider}</div>}
                </div>
              </div>
            ))}
            {loading && (
              <div style={styles.messageRow}>
                <div style={styles.msgBotAvatar}>
                  <Bot size={14} color="#0B4F4A" />
                </div>
                <div style={{ ...styles.messageBubble, ...styles.botBubble }}>
                  <span className="spin" style={{ display: 'inline-block', marginRight: '0.4rem' }}>⚡</span>
                  <em>SkillGap Copilot is thinking...</em>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={styles.promptsContainer}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                style={styles.promptBtn}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={styles.inputForm}
          >
            <input
              type="text"
              placeholder="Ask SkillGap Copilot a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={styles.chatInput}
              disabled={loading}
            />
            <button type="submit" style={styles.sendBtn} disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  floatingContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
  },
  floatingBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#B8F2E6',
    color: '#0B4F4A',
    padding: '0.85rem 1.35rem',
    borderRadius: '30px',
    fontWeight: '700',
    fontSize: '0.92rem',
    boxShadow: '0 8px 24px rgba(11, 79, 74, 0.25)',
    border: '1px solid rgba(19, 124, 115, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },
  chatWindow: {
    width: '390px',
    height: '530px',
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid rgba(11, 79, 74, 0.15)',
    boxShadow: '0 16px 40px -8px rgba(11, 79, 74, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '1rem 1.25rem',
    background: '#0B4F4A',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
  },
  botIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#B8F2E6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusText: {
    fontSize: '0.72rem',
    color: '#B8F2E6',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  messagesContainer: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: '#F7F4EA',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  msgBotAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: '#B8F2E6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  messageBubble: {
    maxWidth: '84%',
    padding: '0.75rem 1rem',
    borderRadius: '14px',
    fontSize: '0.85rem',
    lineHeight: '1.48',
    whiteSpace: 'pre-line',
  },
  userBubble: {
    background: '#0B4F4A',
    color: '#FFFFFF',
    borderBottomRightRadius: '2px',
  },
  botBubble: {
    background: '#FFFFFF',
    color: '#243331',
    border: '1px solid rgba(11, 79, 74, 0.12)',
    borderBottomLeftRadius: '2px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
  },
  errorBubble: {
    background: 'rgba(255, 117, 104, 0.15)',
    color: '#FF7568',
    border: '1px solid rgba(255, 117, 104, 0.3)',
  },
  providerTag: {
    fontSize: '0.65rem',
    color: '#7F9793',
    marginTop: '0.35rem',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  promptsContainer: {
    padding: '0.5rem 0.85rem',
    background: '#FFFFFF',
    borderTop: '1px solid rgba(11, 79, 74, 0.08)',
    display: 'flex',
    gap: '0.4rem',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
  },
  promptBtn: {
    background: 'rgba(19, 124, 115, 0.08)',
    border: '1px solid rgba(19, 124, 115, 0.2)',
    color: '#0B4F4A',
    padding: '0.3rem 0.65rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0,
  },
  inputForm: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    background: '#FFFFFF',
    borderTop: '1px solid rgba(11, 79, 74, 0.1)',
    gap: '0.5rem',
  },
  chatInput: {
    flex: 1,
    border: '1px solid rgba(11, 79, 74, 0.15)',
    borderRadius: '20px',
    padding: '0.55rem 0.9rem',
    fontSize: '0.85rem',
    outline: 'none',
  },
  sendBtn: {
    background: '#0B4F4A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};

export default SkillGapCopilot;
