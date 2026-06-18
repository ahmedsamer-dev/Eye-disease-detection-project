import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Grid, Container, useTheme
} from '@mui/material';
import Logo from '../components/Logo.jsx';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../contexts/ThemeContext.jsx';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = theme.palette.mode === 'dark';

  // --- POLISHED COLOR PALETTE ---
  const sectionBg = isDark ? '#020617' : '#f8f9fa'; // dark:bg-slate-950
  const cardBg = isDark ? '#0f172a' : '#ffffff'; // dark:bg-slate-900
  const borderColor = isDark ? '#1e293b' : theme.palette.divider; // dark:border-slate-800
  const titleColor = isDark ? '#f8fafc' : '#2D598F'; // dark:text-slate-50
  const subtextColor = isDark ? '#94a3b8' : theme.palette.text.secondary; // dark:text-slate-400
  const btnPrimary = '#2563eb'; // blue-600
  const btnPrimaryHover = '#1d4ed8'; // blue-700
  
  // Image filters
  const imgFilter = isDark ? 'brightness(0.9) saturate(0.85)' : 'none';
  const iconFilter = isDark ? 'invert(1) brightness(0.9)' : 'none';

  return (
    <Box sx={{ bgcolor: sectionBg, minHeight: '100vh', overflowX: 'hidden', transition: 'all 0.3s ease' }}>

      {/* ── NAVBAR (Landing version) ───────────────────────────── */}
      <Box
        sx={{
          bgcolor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(248, 249, 250, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'fixed',
          zIndex: 1000,
          height: 72,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 8 },
          justifyContent: 'space-between',
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: theme.customShadows?.header?.[theme.palette.mode] || '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Logo />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
          {[
            { label: 'AI Diagnosis', targetId: 'section-ai-eye' },
            { label: 'Services', targetId: 'section-services' },
            { label: 'Why Us', targetId: 'section-why' },
          ].map(({ label, targetId }) => (
            <Typography
              key={label}
              onClick={() => {
                const el = document.getElementById(targetId);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              sx={{
                color: isDark ? '#f8fafc' : theme.palette.primary.main,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: { xs: 'none', md: 'block' },
                transition: 'all 0.3s ease',
                '&:hover': { opacity: 0.8 },
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1.5, pr: 2 }}>
          <Button
            onClick={toggleTheme}
            aria-label="toggle theme"
            sx={{
              minWidth: 36,
              width: 36,
              height: 36,
              p: 0,
              borderRadius: '50%',
              color: isDark ? '#f8fafc' : theme.palette.text.secondary,
              transition: 'all 0.3s ease',
              '&:hover': { color: btnPrimary, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
            }}
          >
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </Button>

          {/* Secondary/Outline Button Style for Sign In in Navbar */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/login')}
            sx={{
              color: isDark ? '#f8fafc' : '#000',
              borderColor: isDark ? '#f8fafc' : '#000',
              fontWeight: 600,
              fontSize: '0.8rem',
              textTransform: 'none',
              px: 2,
              py: 0.6,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: isDark ? 'rgba(248, 250, 252, 0.1)' : 'rgba(0,0,0,0.05)',
                borderColor: isDark ? '#f8fafc' : '#000',
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>

      {/* ── HERO ───────────────────────────────────────────── */}
      <Box
        sx={{
          mt: '72px',
          height: 'calc(100vh - 72px)',
          background: isDark ? '#020617' : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: isDark ? '-20px -20px 60px -15px rgba(30,58,138,0.2)' : 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: isDark ? 'radial-gradient(circle at top right, rgba(37,99,235,0.15) 0%, transparent 40%)' : 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 40%)',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Right side combined image */}
        <Box
          component="img"
          src="/image/Group 1.png"
          alt="Hero Background"
          sx={{
            position: 'absolute',
            right: { xs: -150, md: -10 },
            top: '50%',
            height: { xs: '80%', md: '120%' },
            pointerEvents: 'none',
            zIndex: 0,
            objectFit: 'contain',
            filter: imgFilter,
            transition: 'all 0.3s ease',
            animation: 'floatImage 6s ease-in-out infinite',
            '@keyframes floatImage': {
              '0%, 100%': { transform: 'translateY(-50%)' },
              '50%': { transform: 'translateY(-53%)' },
            },
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pl: { md: 8 } }}>
          <Box sx={{ maxWidth: 400, mt: 10, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Primary Button for Hero Sign-in */}
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: btnPrimary,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: theme.customShadows?.elevated?.[theme.palette.mode] || '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: btnPrimaryHover },
              }}
            >
              Sign In
            </Button>

            {/* Google Sign-in button */}
            <Button
              variant="contained"
              size="small"
              onClick={() => window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=784794762508-c185dkeb094cjr49em6j2rdmu2k5k57v.apps.googleusercontent.com&redirect_uri=http://localhost:5173/callback&response_type=id_token&scope=openid%20email%20profile&nonce=eye_disease_nonce'}
              startIcon={<GoogleIcon />}
              sx={{
                bgcolor: '#ffffff',
                color: '#000000',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                px: 2.5,
                py: 0.8,
                borderRadius: 2,
                boxShadow: theme.customShadows?.elevated?.[theme.palette.mode] || '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── FEATURE 1: AI Eye Diagnosis ──────────────────────── */}
      <Box
        id="section-ai-eye"
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          bgcolor: sectionBg,
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                component="img"
                src="/image/AIEyeDiagnosis.svg"
                alt="AI Eye Diagnosis Illustration"
                sx={{
                  width: '100%',
                  maxWidth: { xs: 320, md: 500 },
                  objectFit: 'contain',
                  filter: imgFilter,
                  transition: 'all 0.3s ease',
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ pl: { md: 4 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 800,
                  color: titleColor,
                  mb: 3,
                  fontSize: { xs: '2.4rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  transition: 'color 0.3s ease',
                }}
              >
                AI Eye<br />Diagnosis
              </Typography>
              <Typography sx={{ color: subtextColor, mb: 5, lineHeight: 1.6, fontSize: '1.05rem', maxWidth: 450, mx: { xs: 'auto', md: 0 }, transition: 'color 0.3s ease' }}>
                Smart and accurate eye health assessment powered by artificial intelligence, helping detect eye conditions early and improve vision care.
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => window.open('https://my.clevelandclinic.org/health/body/22694-retina-eye', '_blank', 'noopener,noreferrer')}
                sx={{
                  bgcolor: btnPrimary,
                  color: '#fff',
                  fontWeight: 600,
                  px: 3,
                  py: 0.9,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  boxShadow: theme.customShadows?.button?.[theme.palette.mode] || '0 8px 20px rgba(37,99,235,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: btnPrimaryHover, transform: 'translateY(-2px)', boxShadow: theme.customShadows?.cardHover?.[theme.palette.mode] || '0 12px 24px rgba(29,78,216,0.4)' },
                }}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES TRIO ──────────────────────────────────── */}
      <Box sx={{ bgcolor: sectionBg, pb: 12, px: { xs: 2, md: 8 }, transition: 'all 0.3s ease' }} id="section-services">
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 800,
              color: titleColor,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.8rem' },
              transition: 'color 0.3s ease',
            }}
          >
            The Great Place of<br />AI Eye Diagnosis
          </Typography>
          <Typography sx={{ color: subtextColor, mb: 10, maxWidth: 650, mx: 'auto', lineHeight: 1.6, fontSize: '1rem', transition: 'color 0.3s ease' }}>
            We provide advanced solutions for eye examination and diagnosis by combining medical expertise with cutting-edge AI technology to ensure fast, accurate, and reliable results.
          </Typography>

          <Grid container spacing={4} justifyContent="center" sx={{ position: 'relative' }}>
            {[
              { icon: 'AI-Powered', title: 'AI-Powered Diagnosis' },
              { icon: 'High-Precision', title: 'High-Precision Retinal Scan\nAnalysis' },
              { icon: 'Secure', title: 'Secure & Privacy-Focused' },
            ].map((f, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i} sx={{ position: 'relative' }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  px: 3,
                  py: 4,
                  bgcolor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: isDark ? '#1e293b' : '#f8f9fa',
                    boxShadow: theme.customShadows?.cardHover?.[theme.palette.mode] || '0 12px 30px rgba(0,0,0,0.06)',
                    transform: 'translateY(-5px)',
                  },
                }}>
                  <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <Box component="img" src={`/image/${f.icon}.svg`} alt={f.title} sx={{ filter: iconFilter, maxHeight: 80, maxWidth: 80, transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }} />
                  </Box>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: titleColor, fontSize: '1.05rem', whiteSpace: 'pre-line', transition: 'color 0.3s ease' }}>
                    {f.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── WHY SECTION ────────────────────────────────────── */}
      <Box id="section-why" sx={{ bgcolor: sectionBg, pt: 10, pb: 14, px: { xs: 2, md: 8 }, transition: 'all 0.3s ease' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, mb: 10, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box
              component="img"
              src="/image/WhyAI.svg"
              alt="Why AI Eye Diagnosis"
              sx={{ width: '100%', maxWidth: { xs: 200, md: 270 }, objectFit: 'contain', flexShrink: 0, filter: imgFilter, transition: 'all 0.3s ease' }}
            />
            <Box sx={{ maxWidth: 500, textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 800,
                  color: titleColor,
                  mb: 2,
                  fontSize: { xs: '1.6rem', md: '2rem' },
                  transition: 'color 0.3s ease',
                }}
              >
                Why AI Eye Diagnosis?
              </Typography>
              <Typography sx={{ color: subtextColor, lineHeight: 1.7, fontSize: '0.95rem', transition: 'color 0.3s ease' }}>
                AI-powered eye diagnosis enhances clinical accuracy, supports early detection, and improves patient outcomes through fast and standardized analysis.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={5} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
            {[
              { icon: 'Early', title: 'Early and accurate disease\ndetection' },
              { icon: 'Rapid', title: 'Rapid retinal image analysis' },
              { icon: 'Consistent', title: 'Consistent diagnostic\nstandards' },
            ].map((item, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Box sx={{
                  textAlign: 'center',
                  px: 2,
                  py: 4,
                  bgcolor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '20px',
                  boxShadow: theme.customShadows?.card?.[theme.palette.mode] || '0 8px 24px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.customShadows?.cardHover?.[theme.palette.mode] || '0 12px 32px rgba(0,0,0,0.08)',
                  },
                }}>
                  <Box sx={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <Box component="img" src={`/image/${item.icon}.svg`} alt={item.title} sx={{ filter: iconFilter, maxHeight: 72, maxWidth: 72, transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }} />
                  </Box>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: titleColor, fontSize: '0.95rem', whiteSpace: 'pre-line', transition: 'color 0.3s ease' }}>
                    {item.title}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
