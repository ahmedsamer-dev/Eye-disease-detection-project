import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, useTheme, CircularProgress, Alert } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { reportService, getErrorMessage } from '../api';

function ReportCard({ title, minHeight, children }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        borderRadius: '16px',
        mb: 2.5,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ px: 3, py: 1.8, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.95rem' }}>{title}</Typography>
      </Box>
      <Box sx={{
        m: 1.5,
        borderRadius: '12px',
        bgcolor: theme.palette.background.paper,
        minHeight,
        p: 2.5,
        boxShadow: theme.customShadows?.card?.[theme.palette.mode] || '0 1px 4px rgba(26,46,94,0.06)',
      }}>
        {children}
      </Box>
    </Box>
  );
}

export default function Reports() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => reportService.getById(Number(id)),
    initialData: location.state?.reportData,
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: (reportId) => reportService.save(reportId),
    onSuccess: () => {
      alert('Report saved to history successfully!');
    },
    onError: (err) => {
      alert(getErrorMessage(err));
    }
  });

  const downloadMutation = useMutation({
    mutationFn: (reportId) => reportService.downloadPdf(reportId),
    onError: (err) => {
      alert(getErrorMessage(err));
    }
  });

  const handleSave = () => {
    if (report?.id) saveMutation.mutate(report.id);
  };

  const handleDownload = () => {
    if (report?.id) downloadMutation.mutate(report.id);
  };

  const saving = saveMutation.isPending;

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Alert severity="error" sx={{ mb: 2 }}>{getErrorMessage(error)}</Alert>
      <Button variant="contained" onClick={() => navigate('/home')}>Go Back</Button>
    </Box>
  );

  if (!report) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography>No report data found.</Typography>
      <Button variant="contained" onClick={() => navigate('/home')} sx={{ mt: 2 }}>Analyze New Image</Button>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 780, mx: 'auto', px: { xs: 2, md: 3 }, py: 6 }}>
      <Typography variant="h5" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: theme.palette.text.primary, mb: 3 }}>
        Analysis Report #{report.id}
      </Typography>

      <ReportCard title="AI Scan Analysis" minHeight={320}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[
            { label: 'Condition', value: report.condition },
            { label: 'Confidence', value: `${report.confidence}%` },
            { label: 'Severity', value: report.severity },
            { label: 'IOP Estimate', value: report.iopEstimate || 'N/A' },
            { label: 'Retinal Cup/Disc Ratio', value: report.retinalCupDiscRatio || 'N/A' },
          ].map(item => (
            <Box key={item.label} sx={{ display: 'flex', gap: 2, p: 1.5, bgcolor: theme.palette.background.default, borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary, minWidth: 200 }}>{item.label}</Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{item.value}</Typography>
            </Box>
          ))}
          <Box sx={{
            mt: 1,
            p: 2,
            bgcolor: isDark ? 'rgba(42,184,160,0.12)' : '#f0f9f7',
            borderRadius: '10px',
            border: `1px solid ${isDark ? 'rgba(42,184,160,0.3)' : '#c8eee8'}`,
          }}>
            <Typography variant="body2" sx={{ color: isDark ? '#2ab8a0' : '#1a6b59', fontWeight: 600, mb: 0.5 }}>Summary</Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
              {report.summary}
            </Typography>
          </Box>
        </Box>
      </ReportCard>

      <ReportCard title="Recommendation" minHeight={120}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {report.recommendations?.map((r, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: theme.palette.background.default, borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                {typeof r === 'string' ? r : r.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </ReportCard>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
        <Button
          variant="outlined"
          onClick={handleDownload}
          startIcon={<ArrowDownwardIcon />}
          sx={{
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            fontWeight: 600,
            px: 4,
            py: 1.2,
            borderRadius: '10px',
            '&:hover': { bgcolor: theme.palette.text.primary, color: theme.palette.background.paper, borderColor: theme.palette.text.primary },
            transition: 'all 0.2s ease',
          }}
        >
          Download
        </Button>
        <Button
          variant="outlined"
          onClick={handleSave}
          disabled={saving}
          startIcon={<SaveOutlinedIcon />}
          sx={{
            borderColor: theme.palette.text.primary,
            color: theme.palette.text.primary,
            fontWeight: 600,
            px: 4,
            py: 1.2,
            borderRadius: '10px',
            '&:hover': { bgcolor: theme.palette.text.primary, color: theme.palette.background.paper, borderColor: theme.palette.text.primary },
            transition: 'all 0.2s ease',
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
}

