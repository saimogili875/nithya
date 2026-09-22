import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LalMascot from './LalMascot';
import { Send, Sparkles, Bot, CheckCircle2, ChevronRight, Zap, RefreshCw, MessageSquare, Terminal, Layout } from 'lucide-react';

export default function LalAssistantPanel({ projectBrain, updateBrain, onApplyPrototypeChange }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'LAL',
      text: `Hello! I'm LAL, your AI Business & Software Assistant. I've analyzed your project context (${projectBrain?.industry || 'Tourism & Travel'}). How can I refine your platform today?`,
      timestamp: 'Just now'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Phase-specific quick prompts
  const getPhasePrompts = () => {
    if (currentPath === '/design') {
      return [
        "Make it Premium",
        "Make it Minimal",
        "Make it Mobile First",
        "Add 3D Elements",
        "Use Dark Luxury Style",
        "Improve Navigation",
        "More Enterprise"
      ];
    } else if (currentPath === '/prototype') {
      return [
        "Make the hero section larger",
        "Add WhatsApp booking flow",
        "Change color scheme to Dark Gold",
        "Make this layout responsive",
        "Add interactive stats grid"
      ];
    } else if (currentPath === '/tech-stack') {
      return [
        "Recommend highest scalability stack",
        "Suggest lowest cost database option",
        "Compare Microservices vs Monolith"
      ];
    } else if (currentPath === '/financial') {
      return [
        "Optimize for < $100/mo budget",
        "Recommend enterprise database setup",
        "Switch to serverless auto-scaling"
      ];
    } else if (currentPath === '/competitors') {
      return [
        "Where are top competitors weak?",
        "What feature creates a moat?",
        "Show customer pricing gaps"
      ];
    } else if (currentPath === '/documents') {
      return [
        "Generate 10-slide Pitch Deck",
        "Create PRD Document",
        "Rewrite executive summary"
      ];
    }
    return [
      "Analyze current project progress",
      "Suggest next recommended phase",
      "Enhance value proposition"
    ];
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isProcessing) return;

    const userMsg = { sender: 'USER', text: text.trim(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      let replyText = "";
      if (currentPath === '/design') {
        replyText = `I'll adjust the design direction according to "${text}". Updating layout tokens and color system for your ${projectBrain?.industry || 'project'}...`;
        if (updateBrain) updateBrain({ design_style: text });
      } else if (currentPath === '/prototype') {
        replyText = `Understood! Applying live prototype change: "${text}". Regenerating UI components safely in sandbox container...`;
        if (onApplyPrototypeChange) onApplyPrototypeChange(text);
      } else if (currentPath === '/tech-stack') {
        replyText = `Analyzing architecture tradeoffs for "${text}". Project Brain updated with recommended stack parameters.`;
      } else {
        replyText = `I have processed "${text}" for your current phase (${currentPath}). Updating Project Brain context and recommendations.`;
      }

      setMessages(prev => [
        ...prev,
        { sender: 'LAL', text: replyText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <aside
      className="glass-panel"
      style={{
        width: '320px',
        minWidth: '320px',
        height: 'calc(100vh - 120px)',
        position: 'sticky',
        top: '100px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(245, 158, 11, 0.15)',
        background: 'rgba(10, 12, 20, 0.95)'
      }}
    >
      {/* Header Bar */}
      <div style={{ padding: '14px 16px', background: 'rgba(15, 18, 28, 0.9)', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <LalMascot width={36} height={36} />
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: isProcessing ? '#f59e0b' : '#10b981', border: '2px solid #0a0c14' }} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              LAL ASSISTANT
              <span className="gold-badge" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>AI 2.0</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: isProcessing ? '#f59e0b' : '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isProcessing ? <RefreshCw size={10} className="spin" /> : <CheckCircle2 size={10} />}
              {isProcessing ? 'Processing request...' : 'Ready & Connected'}
            </div>
          </div>
        </div>
      </div>

      {/* Current Context Banner */}
      <div style={{ padding: '8px 14px', background: 'rgba(245, 158, 11, 0.08)', borderBottom: '1px solid rgba(245, 158, 11, 0.15)', fontSize: '0.72rem', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Zap size={12} color="#f59e0b" /> Context: <strong>{projectBrain?.industry || 'Tourism'}</strong>
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>Phase: {currentPath.replace('/', '') || 'idea'}</span>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div
              style={{
                padding: '10px 12px',
                borderRadius: msg.sender === 'USER' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: msg.sender === 'USER' 
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                  : 'rgba(20, 24, 38, 0.95)',
                color: msg.sender === 'USER' ? '#000' : '#f8fafc',
                fontSize: '0.8rem',
                lineHeight: '1.45',
                border: msg.sender === 'USER' ? 'none' : '1px solid rgba(245, 158, 11, 0.25)',
                boxShadow: msg.sender === 'USER' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 4px 12px rgba(0,0,0,0.4)',
                fontWeight: msg.sender === 'USER' ? '600' : '400'
              }}
            >
              {msg.sender === 'LAL' && (
                <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#f59e0b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bot size={12} /> LAL AI
                </div>
              )}
              {msg.text}
            </div>
            <span style={{ fontSize: '0.65rem', color: '#64748b', alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
              {msg.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Dynamic Prompt Quick Suggestions */}
      <div style={{ padding: '8px 12px', background: 'rgba(12, 14, 22, 0.8)', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={11} color="#f59e0b" /> Phase Quick Prompts
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {getPhasePrompts().map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(prompt)}
              style={{
                whiteSpace: 'nowrap',
                fontSize: '0.7rem',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              + {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div style={{ padding: '12px', background: 'rgba(15, 18, 28, 0.95)', borderTop: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask LAL on ${currentPath}...`}
          style={{
            flex: 1,
            background: 'rgba(8, 10, 16, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#fff',
            fontSize: '0.8rem',
            outline: 'none'
          }}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isProcessing || !inputMessage.trim()}
          className="gold-btn"
          style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Send size={15} />
        </button>
      </div>
    </aside>
  );
}
