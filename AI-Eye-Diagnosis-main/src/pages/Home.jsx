import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Chip, IconButton, useTheme, Alert } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { scanService, getErrorMessage } from '../api';

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');

  const uploadMutation = useMutation({
    mutationFn: (file) => scanService.upload(file),
    onSuccess: (data) => {
      navigate(`/reports/${data.reportId}`, { state: { reportData: data } });
    },
    onError: (err) => {
      setError(getErrorMessage(err));
    }
  });

  async function handleUpload() {
    if (!file) return;
    setError('');
    uploadMutation.mutate(file);
  }

  const loading = uploadMutation.isPending;

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }

  function removeFile() {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 12, px: 2, bgcolor: theme.palette.background.paper }}>

      {/* Main Container */}
      <Paper
        elevation={0}
        sx={{
          width: '100%', maxWidth: 800,
          bgcolor: theme.palette.background.default,
          py: 5, px: { xs: 3, md: 8 },
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, color: theme.palette.primary.main, textAlign: 'center', mb: 2 }}
        >
          AI Image Analysis
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary, textAlign: 'center', mb: 1.5, fontSize: '0.9rem' }}>
          Upload a fundus eye image for AI analysis.
        </Typography>
        <Box sx={{
          display: 'flex', alignItems: 'flex-start', gap: 1,
          bgcolor: isDark ? 'rgba(234,179,8,0.08)' : '#fefce8',
          border: `1px solid ${isDark ? 'rgba(234,179,8,0.25)' : '#fde68a'}`,
          borderRadius: '10px', px: 2, py: 1.2, mb: 3, maxWidth: 520,
        }}>
          <Typography sx={{ fontSize: '0.95rem', lineHeight: 1 }}>⚠️</Typography>
          <Box>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#fbbf24' : '#92400e', mb: 0.3 }}>
              Fundus Images Only
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: isDark ? '#d97706' : '#78350f', lineHeight: 1.5 }}>
              The AI model detects <strong>4 conditions</strong>: Glaucoma, Diabetic Retinopathy, Cataract, and Normal.
              Only upload clear <strong>fundus / retinal photographs</strong>. Other images will be rejected.
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}

        {/* Upload Zone */}
        <Box
          onClick={() => !file && !loading && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          sx={{
            width: '100%',
            bgcolor: isDragOver ? 'rgba(40,81,138,0.04)' : theme.palette.background.paper,
            borderRadius: '12px',
            border: `1px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
            transition: 'border-color 0.2s ease, background-color 0.2s ease',
            cursor: (file || loading) ? 'default' : 'pointer',
            minHeight: 240,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            opacity: loading ? 0.7 : 1,
            '&:hover': (file || loading) ? {} : { borderColor: theme.palette.secondary.light },
            boxShadow: theme.customShadows?.card?.[theme.palette.mode] || '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {file ? (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {preview ? (
                <Box
                  component="img"
                  src={preview}
                  alt="preview"
                  sx={{ maxHeight: 160, maxWidth: '100%', borderRadius: '10px', objectFit: 'contain' }}
                />
              ) : (
                <InsertDriveFileOutlinedIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={`${file.name} — ${formatSize(file.size)}`} size="small" />
                <IconButton size="small" onClick={removeFile} disabled={loading}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <>
              {/* Cloud Icon Area */}
              <Box sx={{
                width: 72, height: 48,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(90,180,232,0.12)' : '#dce8fa',
                borderRadius: '50px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 3,
              }}>
                <CloudUploadIcon sx={{ fontSize: 28, color: theme.palette.primary.light }} />
              </Box>

              <Typography sx={{ fontWeight: 800, color: theme.palette.text.primary, textAlign: 'center', fontSize: '1rem', mb: 1, fontStyle: 'italic' }}>
                Drop an image here or click to<br />upload
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, textAlign: 'center', fontSize: '0.75rem' }}>
                Supported: JPG, PNG
              </Typography>
            </>
          )}
        </Box>
      </Paper>

      {/* Report Button */}
      <Button
        variant="contained"
        disabled={!file || loading}
        onClick={handleUpload}

        sx={{
          px: 6,
          py: 1,
          mb: 3,
          borderColor: theme.palette.divider,
          color: theme.palette.primary.main,
          fontWeight: 500,
          borderRadius: '12px',
          fontSize: '1.2rem',
          bgcolor: theme.palette.background.default,
          textTransform: 'none',
          '&:hover': {
            bgcolor: theme.palette.action?.hover || '#f0f2f5',
            borderColor: theme.palette.divider,
          },
          minWidth: 180,
          boxShadow: theme.customShadows?.card?.[theme.palette.mode] || '0 2px 10px rgba(0,0,0,0.03)',
        }}
      >
        Report
      </Button>

    </Box>
  );
}
