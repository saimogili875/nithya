import React, { useState, useEffect } from 'react';
import { FileCode, GitPullRequest, Folder, ChevronRight, File } from 'lucide-react';

export default function CodeDiffViewer({ files = {} }) {
  const fileKeys = Object.keys(files);
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'diff'
  const [selectedFile, setSelectedFile] = useState(fileKeys[0] || 'main.py');

  useEffect(() => {
    if (fileKeys.length > 0 && (!selectedFile || !files[selectedFile])) {
      setSelectedFile(fileKeys[0]);
    }
  }, [files]);

  const fileContent = files[selectedFile] || '// Select a file from the workspace tree';

  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Tabs */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('code')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', border: 'none',
              background: activeTab === 'code' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              color: activeTab === 'code' ? '#06b6d4' : '#9ca3af'
            }}
          >
            <FileCode size={15} /> Code Explorer
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', border: 'none',
              background: activeTab === 'diff' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              color: activeTab === 'diff' ? '#06b6d4' : '#9ca3af'
            }}
          >
            <GitPullRequest size={15} /> Git Diff
          </button>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>
          {selectedFile || 'Workspace'}
        </span>
      </div>

      {/* Main Content Area */}
      {activeTab === 'code' ? (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* File Tree Sidebar */}
          <div style={{ width: '180px', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '10px', overflowY: 'auto', background: 'rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>
              FILES
            </div>
            {fileKeys.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>No files yet</div>
            ) : (
              fileKeys.map((fk) => (
                <div
                  key={fk}
                  onClick={() => setSelectedFile(fk)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer',
                    fontSize: '0.78rem', color: selectedFile === fk ? '#06b6d4' : '#9ca3af',
                    background: selectedFile === fk ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                    marginBottom: '2px', wordBreak: 'break-all'
                  }}
                >
                  <File size={13} color={selectedFile === fk ? '#06b6d4' : '#6b7280'} />
                  <span>{fk}</span>
                </div>
              ))
            )}
          </div>

          {/* Editor view */}
          <div style={{ flex: 1, padding: '14px', overflow: 'auto', background: 'rgba(5, 7, 12, 0.6)' }}>
            <pre style={{ margin: 0, fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#e5e7eb', lineHeight: '1.5' }}>
              <code>{fileContent}</code>
            </pre>
          </div>
        </div>
      ) : (
        /* Git Diff View */
        <div style={{ flex: 1, padding: '14px', overflow: 'auto', background: 'rgba(5, 7, 12, 0.8)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
          <div style={{ color: '#06b6d4', fontWeight: 'bold', marginBottom: '8px' }}>
            diff --git a/{selectedFile} b/{selectedFile}
          </div>
          <div style={{ color: '#6b7280', marginBottom: '8px' }}>
            --- a/{selectedFile}
            <br />
            +++ b/{selectedFile}
          </div>
          {fileContent.split('\n').map((line, i) => {
            const isAdded = line.includes('def') || line.includes('FastAPI') || line.includes('healthy') || line.includes('return');
            const isRemoved = line.includes('raise HTTPException(status_code=500');
            
            return (
              <div
                key={i}
                style={{
                  padding: '1px 6px',
                  background: isRemoved ? 'rgba(244, 63, 94, 0.15)' : isAdded ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: isRemoved ? '#f43f5e' : isAdded ? '#10b981' : '#9ca3af'
                }}
              >
                {isRemoved ? `- ${line}` : isAdded ? `+ ${line}` : `  ${line}`}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
