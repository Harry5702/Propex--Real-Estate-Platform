import React, { useState, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

/**
 * ImageUploader — reusable image upload component for admin pages.
 *
 * Props:
 *   value    — current image URL string
 *   onChange — called with new URL when image changes
 *   label    — optional label text
 *   hint     — optional helper text shown below
 *   height   — preview image height in px (default 160)
 */
const ImageUploader = ({ value, onChange, label = 'Image', hint, height = 160 }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [tab, setTab] = useState('upload'); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState(value || '');

  // Single hidden file input, always mounted
  const fileInputRef = useRef(null);

  const triggerFilePicker = () => fileInputRef.current?.click();

  const uploadFile = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('File too large — max 10 MB.'); return; }
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return; }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post(`${API}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100))
      });
      if (res.data.success) {
        onChange(res.data.url);
        setUrlInput(res.data.url);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = e => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleUrlApply = () => { onChange(urlInput); setError(''); };
  const handleRemove = () => { onChange(''); setUrlInput(''); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Single hidden file input — always mounted */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {label && (
        <label style={{
          fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text)',
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {label}
        </label>
      )}

      {/* Tab switcher */}
      <div style={{
        display: 'flex', borderRadius: 8, overflow: 'hidden',
        border: '1.5px solid #e5e7eb', width: 'fit-content'
      }}>
        {[
          { key: 'upload', label: '📁 Upload File' },
          { key: 'url',    label: '🔗 Paste URL'   },
        ].map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              padding: '7px 16px', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, fontFamily: 'inherit',
              transition: 'all 0.2s',
              background: tab === t.key ? 'linear-gradient(135deg, #4a7c59, #2d5a27)' : '#f9fafb',
              color: tab === t.key ? 'white' : '#6b7280',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Upload File tab ── */}
      {tab === 'upload' && (
        <div
          onClick={() => !uploading && triggerFilePicker()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${isDragging ? '#4a7c59' : '#d1d5db'}`,
            borderRadius: 10,
            padding: '22px 16px',
            textAlign: 'center',
            cursor: uploading ? 'default' : 'pointer',
            background: isDragging ? 'rgba(74,124,89,0.05)' : '#fafafa',
            transition: 'all 0.2s',
          }}
        >
          {uploading ? (
            <>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a7c59', marginBottom: 10 }}>
                Uploading… {progress}%
              </div>
              <div style={{
                height: 6, background: '#e5e7eb', borderRadius: 10,
                overflow: 'hidden', maxWidth: 200, margin: '0 auto'
              }}>
                <div style={{
                  height: '100%', borderRadius: 10,
                  background: 'linear-gradient(90deg, #4a7c59, #5fa870)',
                  width: `${progress}%`, transition: 'width 0.2s'
                }} />
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: 4 }}>
                Click to upload or drag &amp; drop
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                JPG, PNG, GIF, WebP — max 10 MB
              </div>
            </>
          )}
        </div>
      )}

      {/* ── URL tab ── */}
      {tab === 'url' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleUrlApply(); }}
            style={{
              flex: 1, padding: '10px 14px',
              border: '1.5px solid #e5e7eb', borderRadius: 8,
              fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
              color: '#374151'
            }}
          />
          <button
            type="button"
            onClick={handleUrlApply}
            style={{
              padding: '10px 18px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg, #4a7c59, #2d5a27)',
              color: 'white', fontWeight: 700, fontSize: '0.8rem',
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit'
            }}
          >
            Apply
          </button>
        </div>
      )}

      {/* ── Error message ── */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 8, padding: '8px 12px',
          fontSize: '0.8rem', color: '#dc2626',
          display: 'flex', gap: 6, alignItems: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Preview ── */}
      {value && (
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
          <img
            src={value}
            alt="preview"
            style={{
              width: '100%', height: height,
              objectFit: 'cover', display: 'block',
              border: '1.5px solid #e5e7eb', borderRadius: 10
            }}
            onError={() => setError('Could not load this image. Try re-uploading or check the URL.')}
            onLoad={() => setError('')}
          />
          {/* Overlay action buttons */}
          <div style={{
            position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6
          }}>
            <button
              type="button"
              onClick={triggerFilePicker}
              style={{
                padding: '5px 12px', borderRadius: 6, border: 'none',
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
                color: 'white', cursor: 'pointer',
                fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit'
              }}
            >
              🔄 Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                padding: '5px 12px', borderRadius: 6, border: 'none',
                background: 'rgba(239,68,68,0.75)', backdropFilter: 'blur(6px)',
                color: 'white', cursor: 'pointer',
                fontSize: '0.75rem', fontWeight: 700, fontFamily: 'inherit'
              }}
            >
              ✕ Remove
            </button>
          </div>
        </div>
      )}

      {/* ── Hint (only shown when no image) ── */}
      {hint && !value && (
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{hint}</span>
      )}
    </div>
  );
};

export default ImageUploader;
