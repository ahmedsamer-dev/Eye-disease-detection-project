import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography, useTheme } from '@mui/material';

/**
 * Reusable form field wrapper.
 * type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea'
 * options: array of strings (for select)
 */
export default function FormField({ label, name, type = 'text', value, onChange, options = [], hint, fullWidth = true, required = false, sx = {} }) {
  const theme = useTheme();
  const commonSx = { bgcolor: theme.palette.background.paper, borderRadius: 1, ...sx };

  if (type === 'select') {
    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 0.5, display: 'block' }}>
          {label}{required && ' *'}
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            name={name}
            value={value}
            onChange={onChange}
            displayEmpty
            sx={commonSx}
          >
            <MenuItem value=""><em>Select...</em></MenuItem>
            {options.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  if (type === 'textarea') {
    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 0.5, display: 'block' }}>
          {label}{required && ' *'}
        </Typography>
        <TextField
          name={name}
          value={value}
          onChange={onChange}
          multiline
          minRows={2}
          maxRows={5}
          fullWidth
          placeholder={hint || ''}
          sx={commonSx}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Typography variant="caption" sx={{ color: theme.palette.text.primary, fontWeight: 600, mb: 0.5, display: 'block' }}>
        {label}{required && ' *'}
      </Typography>
      <TextField
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        fullWidth
        size="small"
        placeholder={hint || ''}
        sx={commonSx}
        InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      />
    </Box>
  );
}
