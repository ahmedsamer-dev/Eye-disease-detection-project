import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, IconButton, useTheme,
  CircularProgress, Alert, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogContentText,
  DialogActions, Snackbar
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { reportService, getErrorMessage } from '../api';

function HistoryItem({ report, onDeleteClick }) {
  const theme = useTheme();
  const navigate = useNavigate();
  console.log(report);
  const getSeverityStyle = (severity) => {
    const s = severity?.toLowerCase() || '';
    if (s.includes('high')) return { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' };
    if (s.includes('medium') || s.includes('moderate')) return { color: '#f59e0b', bgcolor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' };
    return { color: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' };
  };

  const severityStyle = getSeverityStyle(report.severity);

  // Format date nicely (e.g. June 14, 2026)
  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2,
        borderRadius: '16px',
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          borderColor: theme.palette.primary.light
        }
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48, height: 48, borderRadius: '12px',
                background: 'linear-gradient(135deg, #2D598F 0%, #1e3d64 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.2rem'
              }}
            >
              {report.condition[0]}
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
                <Typography sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '1.05rem' }}>
                  {report.condition}
                </Typography>
                <Chip
                  label={report.severity.split('-')[0].trim()}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: severityStyle.color,
                    bgcolor: severityStyle.bgcolor,
                    border: severityStyle.border,
                    height: 20
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {formattedDate} — Confidence: {report.confidence}%
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, mt: { xs: 2, sm: 0 }, gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => navigate(`/reports/${report.id}`)}
            sx={{ color: theme.palette.primary.main, bgcolor: 'rgba(45, 89, 143, 0.05)', '&:hover': { bgcolor: 'rgba(45, 89, 143, 0.1)' } }}
          >
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDeleteClick(report.id)}
            sx={{ color: theme.palette.error.main, bgcolor: 'rgba(211, 47, 47, 0.05)', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function History() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['reports-history'],
    queryFn: () => reportService.getAll(),
  });

  const [localReports, setLocalReports] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (data?.reports) {
      setLocalReports(data.reports);
    }
  }, [data]);

  const handleDeleteClick = (id) => {
    setSelectedReportId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await reportService.delete(selectedReportId);
      setLocalReports(prev => prev.filter(r => r.id !== selectedReportId));
      setSnackbarMessage("Report deleted successfully.");
      setSnackbarSeverity("success");
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to delete report from server.");
      setSnackbarSeverity("error");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedReportId(null);
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedReportId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const count = localReports.length;

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 850, mx: 'auto', px: { xs: 2, md: 3 }, py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: theme.palette.text.primary }}>
            Analysis History
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            You have {count} saved analyses
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/home')}>New Scan</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{getErrorMessage(error)}</Alert>}

      {localReports.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '16px', bgcolor: theme.palette.background.paper }}>
          <Typography sx={{ color: theme.palette.text.secondary, mb: 3 }}>No saved analysis reports found.</Typography>
          <Button variant="outlined" onClick={() => navigate('/home')}>Start Your First Scan</Button>
        </Paper>
      ) : (
        <Box>
          {localReports.map(report => (
            <HistoryItem key={report.id} report={report} onDeleteClick={handleDeleteClick} />
          ))}
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: { borderRadius: '16px', p: 1 }
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description" sx={{ color: 'text.primary' }}>
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus sx={{ borderRadius: '8px', textTransform: 'none' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notification */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '10px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
