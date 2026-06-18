import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Checkbox, FormControlLabel,
  Button, TextField, RadioGroup, Radio, useTheme, Alert
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { medicalHistoryService, getErrorMessage } from '../api';

const INITIAL_FORM = {
  conditions: [], 
  otherText: '',
  medications: '', 
  allergies: '', 
  eyewear: '', 
  eyewearBrand: '', 
  lastExam: '',
  pastSurgeries: '', 
  privacyConsent: 'yes',
};

function SectionHeader({ title }) {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: theme.palette.primary.main, px: 2, py: 1, mb: 0 }}>
      <Typography sx={{ color: theme.palette.primary.contrastText, fontWeight: 600, fontStyle: 'italic', fontSize: '0.85rem' }}>
        {title}
      </Typography>
    </Box>
  );
}

function CustomCheckbox({ label, checked, onChange }) {
  const theme = useTheme();
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          size="small"
          sx={{ p: 0.4, color: theme.palette.divider, '&.Mui-checked': { color: theme.palette.primary.main } }}
        />
      }
      label={<Typography sx={{ fontSize: '0.78rem', color: theme.palette.primary.main, fontStyle: 'italic' }}>{label}</Typography>}
      sx={{ m: 0, mr: 2, mb: 0.5 }}
    />
  );
}

export default function PersonalInfo() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');

  const submitMutation = useMutation({
    mutationFn: (data) => medicalHistoryService.create(data),
    onSuccess: () => {
      navigate('/home');
    },
    onError: (err) => {
      setError(getErrorMessage(err));
    }
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCondition = (name) => {
    setForm(prev => ({
      ...prev,
      conditions: prev.conditions.includes(name)
        ? prev.conditions.filter(c => c !== name)
        : [...prev.conditions, name]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      hasDiabetes: form.conditions.includes('Diabetes'),
      hasGlaucoma: form.conditions.includes('Glaucoma'),
      hasCataracts: form.conditions.includes('Cataracts'),
      hasOther: !!form.otherText,
      otherSpecification: form.otherText,
      normalEye: form.conditions.includes('Normal eye'),
      currentMedications: form.medications,
      allergiesToMedications: form.allergies,
      wearGlassesOrContacts: form.eyewear,
      contactsBrandType: form.eyewearBrand,
      lastEyeExam: form.lastExam ? new Date(form.lastExam).toISOString() : null,
      pastEyeSurgeries: form.pastSurgeries,
      privacyConsent: form.privacyConsent === 'yes'
    };

    submitMutation.mutate(payload);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ maxWidth: '100%', mx: 'auto', px: { xs: 3, md: 12 }, py: 5, bgcolor: theme.palette.background.paper, minHeight: '100vh' }}
    >
      {/* SECTION 3: Referral */}
      <Box sx={{ border: `1px solid ${theme.palette.divider}`, mb: 3 }}>
        <SectionHeader title="Referral" />
        <Box sx={{ px: 2, pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography sx={{ color: theme.palette.primary.main, fontWeight: 700, fontStyle: 'italic', fontSize: '0.8rem', mb: 0.5 }}>
            Medical & Ocular History
          </Typography>
          <Typography sx={{ color: theme.palette.primary.main, fontWeight: 600, fontStyle: 'italic', fontSize: '0.75rem', mb: 1.5 }}>
            Check all that apply
          </Typography>

          <Grid container spacing={0.5} sx={{ mb: 2 }}>
            {['Diabetes', 'Glaucoma', 'Cataracts'].map(c => (
              <Grid item xs={6} key={c}>
                <CustomCheckbox label={c} checked={form.conditions.includes(c)} onChange={() => handleCondition(c)} />
              </Grid>
            ))}
            {/* Other with text */}
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CustomCheckbox label="Other (specify)" checked={!!form.otherText} onChange={() => { }} />
              <TextField
                name="otherText"
                value={form.otherText}
                onChange={handle}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '2px', height: 28, fontSize: '0.78rem' },
                  '& fieldset': { borderColor: theme.palette.divider },
                  width: 220,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomCheckbox label="Normal eye" checked={form.conditions.includes('Normal eye')} onChange={() => handleCondition('Normal eye')} />
            </Grid>
          </Grid>

          {/* Current Medications */}
          <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontWeight: 600, fontSize: '0.78rem', mb: 0.5 }}>
            Current Medications
          </Typography>
          <TextField
            name="medications"
            value={form.medications}
            onChange={handle}
            fullWidth multiline rows={2}
            variant="outlined"
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': { borderRadius: '2px', fontSize: '0.85rem' },
              '& fieldset': { borderColor: theme.palette.divider },
            }}
          />
          <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontSize: '0.72rem', mb: 2 }}>
            List all medications, including eye drops
          </Typography>

          {/* Allergies */}
          <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontWeight: 600, fontSize: '0.78rem', mb: 0.5 }}>
            Allergies to Medications
          </Typography>
          <TextField
            name="allergies"
            value={form.allergies}
            onChange={handle}
            fullWidth multiline rows={2}
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: '2px', fontSize: '0.85rem' },
              '& fieldset': { borderColor: theme.palette.divider },
            }}
          />

          {/* Glasses/Contacts row */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontWeight: 600, fontSize: '0.75rem', mb: 0.5 }}>
                Do you currently wear glasses or contacts?
              </Typography>
              <TextField name="eyewear" value={form.eyewear} onChange={handle} fullWidth variant="outlined" size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '2px', fontSize: '0.85rem' },
                  '& fieldset': { borderColor: theme.palette.divider },
                }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontWeight: 600, fontSize: '0.75rem', mb: 0.5 }}>
                If contacts, brand/type
              </Typography>
              <TextField name="eyewearBrand" value={form.eyewearBrand} onChange={handle} fullWidth variant="outlined" size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '2px', fontSize: '0.85rem' },
                  '& fieldset': { borderColor: theme.palette.divider },
                }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontWeight: 600, fontSize: '0.75rem', mb: 0.5 }}>
                Last eye exam
              </Typography>
              <TextField name="lastExam" value={form.lastExam} onChange={handle} fullWidth variant="outlined" size="small"
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '2px', fontSize: '0.85rem' },
                  '& fieldset': { borderColor: theme.palette.divider },
                }} />
            </Grid>
          </Grid>

          {/* Past Surgeries */}
          <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontWeight: 600, fontSize: '0.78rem', mb: 0.5 }}>
            Past Eye Surgeries / Procedures
          </Typography>
          <TextField
            name="pastSurgeries"
            value={form.pastSurgeries}
            onChange={handle}
            fullWidth multiline rows={2}
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: '2px', fontSize: '0.85rem' },
              '& fieldset': { borderColor: theme.palette.divider },
            }}
          />

          {/* Privacy Consent */}
          <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontSize: '0.75rem', mb: 0.5 }}>
            I authorize release of medical information necessary to process claims and assign benefits to the provider.
          </Typography>
          <Typography sx={{ color: theme.palette.primary.main, fontStyle: 'italic', fontWeight: 600, fontSize: '0.78rem', mb: 0.5 }}>
            Privacy & Communications
          </Typography>
          <RadioGroup row name="privacyConsent" value={form.privacyConsent} onChange={handle} sx={{ mb: 3 }}>
            <FormControlLabel
              value="yes"
              control={<Radio size="small" sx={{ p: 0.4, color: theme.palette.divider, '&.Mui-checked': { color: theme.palette.primary.main } }} />}
              label={<Typography sx={{ fontSize: '0.78rem', color: theme.palette.primary.main, fontStyle: 'italic', mr: 2 }}>Yes</Typography>}
            />
            <FormControlLabel
              value="no"
              control={<Radio size="small" sx={{ p: 0.4, color: theme.palette.divider, '&.Mui-checked': { color: theme.palette.primary.main } }} />}
              label={<Typography sx={{ fontSize: '0.78rem', color: theme.palette.primary.main, fontStyle: 'italic' }}>No</Typography>}
            />
          </RadioGroup>
        </Box>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mt: 2, mb: 4 }}>
        <Button
          variant="contained"
          type="submit"
          disabled={submitMutation.isPending}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            px: 5, py: 1.2,
            borderRadius: '6px',
            fontWeight: 700, fontStyle: 'italic', fontSize: '1rem',
            textTransform: 'none',
            '&:hover': { bgcolor: theme.palette.primary.dark },
          }}
        >
          {submitMutation.isPending ? 'Submitting...' : 'Submit Form'}
        </Button>
        <Button
          variant="text"
          type="button"
          onClick={() => setForm(INITIAL_FORM)}
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700, fontStyle: 'italic', fontSize: '1rem',
            textTransform: 'none',
          }}
        >
          Clear Fields
        </Button>
      </Box>

      <Typography sx={{ color: theme.palette.primary.main, fontSize: '0.78rem', fontStyle: 'italic' }}>
        Thank you for information.
      </Typography>
    </Box>
  );
}
