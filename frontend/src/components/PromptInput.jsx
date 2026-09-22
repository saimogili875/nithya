import React, { useState } from 'react';
import { Send, Terminal, Sparkles, Folder, Github } from 'lucide-react';

export default function PromptInput({ selectedMode, onSubmitPrompt, isProcessing }) {
  const [prompt, setPrompt] = useState('Build me a simple weather API with a health endpoint.');
  const [localPath, setLocalPath] = useState('/Users/saikumar/iq/my-local-app');
  const [repoUrl, setRepoUrl] = useState('https://github.com/example/weather-service');

  const presetPrompts = [
    'Build me a simple weather API with a health endpoint.',
    'Build a RESTful Todo App with SQLite database and health check.',
    'Add an /api/metrics monitoring endpoint and validate tests.',
    'Fix unhandled 500 error in weather API controller.'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;
    onSubmitPrompt({
      prompt: prompt.trim(),
      mode: selectedMode,
      local_path: selectedMode === 'local' ? localPath : null,
      repo_url: selectedMode === 'github' ? repoUrl : null
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px' }}>
      <form onSubmit={handleSubmit}>
        {/* Mode-specific input options */}
        {selectedMode === 'local' && (
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Folder size={16} color="#06b6d4" />
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Local Directory Path:</span>
            <input
              type="text"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
              style={{
                flex: 1, padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace'
              }}
              placeholder="/path/to/local/project"
            />
          </div>
        )}

        {selectedMode === 'github' && (
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Github size={16} color="#06b6d4" />
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>GitHub Repository URL:</span>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              style={{
                flex: 1, padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace'
              }}
              placeholder="https://github.com/user/repository"
            />
          </div>
        )}

        {/* Prompt Input Box */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want the AI to build or modify..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'none'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="btn-primary"
            style={{
              height: '54px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              opacity: isProcessing ? 0.6 : 1
            }}
          >
            {isProcessing ? (
              <>
                <Sparkles size={18} className="spin" /> Autonomous Agent Working...
              </>
            ) : (
              <>
                <Send size={18} /> Instruct AI
              </>
            )}
          </button>
        </div>

        {/* Preset Suggestion Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} color="#06b6d4" /> Quick Presets:
          </span>
          {presetPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(p)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#9ca3af',
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '14px',
                whiteSpace: 'nowrap'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
