import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Select, MenuItem,
  Grid, Avatar, Divider, Collapse, useTheme, CircularProgress, Alert, Snackbar,
  IconButton, InputAdornment
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { profileService, authService, getErrorMessage, getFullImageUrl } from '../api';

const GENDER_MAP = {
  0: 'Male',
  1: 'Female',
  2: 'Other'
};

const REVERSE_GENDER_MAP = {
  'Male': 0,
  'Female': 1,
  'Other': 2
};

export default function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { logout, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editData, setEditData] = useState({});

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
      }, 3000);
    } catch (err) {
      setPasswordError(getErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  const [previewUrl, setPreviewUrl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const uploadImageMutation = useMutation({
    mutationFn: (file) => profileService.uploadProfileImage(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profile']);
      updateUser({ profileImageUrl: data.imageUrl });
      setPreviewUrl(null);
      setSnackbarMessage("Profile picture updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    },
    onError: (err) => {
      setPreviewUrl(null);
      setSnackbarMessage(getErrorMessage(err));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbarMessage("File size exceeds the 5MB limit.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Check file format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setSnackbarMessage("Only JPEG and PNG formats are allowed.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Show local preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Trigger upload
    uploadImageMutation.mutate(file);
  };

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  });

  useEffect(() => {
    if (profile) {
      setEditData({
        fullName: profile.fullName,
        preferredName: profile.preferredName || '',
        dob: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        gender: GENDER_MAP[profile.gender] || 'Male',
        phone: profile.phoneNumber || '',
        email: profile.email,
        address: profile.address || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setIsEditing(false);
      setSnackbarMessage("Profile details updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    },
    onError: (err) => {
      setSnackbarMessage(getErrorMessage(err));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Client-side validations
    if (!editData.fullName || editData.fullName.trim().length < 3) {
      setSnackbarMessage("Full Name must be at least 3 characters long.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (editData.phone && !/^\+?[0-9\s-]{8,15}$/.test(editData.phone)) {
      setSnackbarMessage("Please enter a valid phone number (8-15 digits).");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    updateMutation.mutate({
      fullName: editData.fullName,
      preferredName: editData.preferredName || null,
      phoneNumber: editData.phone || null,
      dateOfBirth: editData.dob ? new Date(editData.dob).toISOString() : null,
      gender: REVERSE_GENDER_MAP[editData.gender],
      address: editData.address || null,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditData({
        fullName: profile.fullName,
        preferredName: profile.preferredName || '',
        dob: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        gender: GENDER_MAP[profile.gender] || 'Male',
        phone: profile.phoneNumber || '',
        email: profile.email,
        address: profile.address || '',
      });
    }
  };

  const handleChange = (field) => (e) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{getErrorMessage(error)}</Alert></Box>;

  const age = profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : '—';

  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', py: 5, px: 3, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

        {/* SECTION 1 — PROFILE HEADER CARD */}
        <Box sx={{
          bgcolor: '#2D598F',
          borderRadius: 4,
          p: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 3,
        }}>
          {/* Avatar */}
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={previewUrl || getFullImageUrl(profile.profileImageUrl)}
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#2ab8a0',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 'bold',
                fontSize: '2rem',
              }}
            >
              {profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Avatar>

            {/* Loading Indicator during Upload */}
            {uploadImageMutation.isPending && (
              <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              </Box>
            )}

            {/* Edit Photo Icon Trigger */}
            <Box
              component="label"
              sx={{
                position: 'absolute', right: -4, bottom: -4,
                bgcolor: '#2ab8a0', borderRadius: '50%',
                border: '3px solid #2D598F',
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
                '&:hover': { bgcolor: '#239985' }
              }}
            >
              <PhotoCameraIcon sx={{ color: '#fff', fontSize: 16 }} />
              <input
                type="file"
                hidden
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                disabled={uploadImageMutation.isPending}
              />
            </Box>
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>
              {profile.fullName}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
              {profile.email}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
              Age: {age} years
            </Typography>
            <Box sx={{
              display: 'inline-block', mt: 1.5, bgcolor: 'rgba(42,184,160,0.2)',
              color: '#2ab8a0', fontSize: '0.75rem', px: 2, py: 0.5,
              borderRadius: '16px', border: '1px solid rgba(42,184,160,0.4)', fontWeight: 600,
            }}>
              Doctor
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 }, justifyContent: 'center' }}>
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                startIcon={<EditIcon />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', textTransform: 'none',
                  px: 3, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  startIcon={updateMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                  sx={{
                    bgcolor: '#2ab8a0', color: '#fff', textTransform: 'none',
                    px: 3, borderRadius: 2, '&:hover': { bgcolor: '#239985' },
                  }}
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                  startIcon={<CloseIcon />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', textTransform: 'none',
                    px: 3, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* SECTION 2 — PERSONAL INFORMATION CARD */}
        <Box sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1.1rem', fontWeight: 600, color: theme.palette.text.primary }}>
              Personal Information
            </Typography>
            <EditIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
          </Box>

          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid size={{ xs: 12, md: 6 }} >
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>Full Name</Typography>
              {!isEditing ? (
                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.primary, fontWeight: 500 }}>{profile.fullName || "—"}</Typography>
              ) : (
                <TextField
                  fullWidth size="small" value={editData.fullName} onChange={handleChange('fullName')}
                  disabled={updateMutation.isPending}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
            </Grid>

            {/* Preferred Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>Preferred Name</Typography>
              {!isEditing ? (
                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.primary, fontWeight: 500 }}>{profile.preferredName || "—"}</Typography>
              ) : (
                <TextField
                  fullWidth size="small" value={editData.preferredName} onChange={handleChange('preferredName')}
                  disabled={updateMutation.isPending}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
            </Grid>

            {/* Date of Birth */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>Date of Birth</Typography>
              {!isEditing ? (
                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.primary, fontWeight: 500 }}>{profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : "—"}</Typography>
              ) : (
                <TextField
                  type="date" fullWidth size="small" value={editData.dob} onChange={handleChange('dob')}
                  disabled={updateMutation.isPending}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
            </Grid>

            {/* Gender */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>Gender</Typography>
              {!isEditing ? (
                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.primary, fontWeight: 500 }}>{(profile.gender !== null && profile.gender !== undefined) ? GENDER_MAP[profile.gender] : "—"}</Typography>
              ) : (
                <Select
                  fullWidth size="small" value={editData.gender} onChange={handleChange('gender')}
                  disabled={updateMutation.isPending}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              )}
            </Grid>

            {/* Age */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>Age</Typography>
              <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.primary, fontWeight: 500 }}>{age} years</Typography>
            </Grid>

            {/* Mobile Phone */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>Mobile Phone</Typography>
              {!isEditing ? (
                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.primary, fontWeight: 500 }}>{profile.phoneNumber || "—"}</Typography>
              ) : (
                <TextField
                  type="tel" fullWidth size="small" value={editData.phone} onChange={handleChange('phone')}
                  disabled={updateMutation.isPending}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>Email</Typography>
              {!isEditing ? (
                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.primary, fontWeight: 500 }}>{profile.email || "—"}</Typography>
              ) : (
                <TextField
                  type="email" fullWidth size="small" value={editData.email} disabled
                  helperText="Email address cannot be changed."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, fontWeight: 500, mb: 1 }}>Address</Typography>
              {!isEditing ? (
                <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.primary, fontWeight: 500 }}>{profile.address || "—"}</Typography>
              ) : (
                <TextField
                  fullWidth size="small" value={editData.address} onChange={handleChange('address')}
                  disabled={updateMutation.isPending}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* SECTION 3 — ACCOUNT SETTINGS CARD */}
        <Box sx={{
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          p: 4,
        }}>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1.1rem', fontWeight: 600, color: theme.palette.text.primary, mb: 3 }}>
            Account Settings
          </Typography>

          {/* ROW 1: Change Password — hidden for Google users */}
          {!profile.isGoogleUser && <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: theme.palette.text.primary }}>Change Password</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mt: 0.5 }}>Update your account password</Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                sx={{
                  textTransform: 'none',
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.text.primary,
                  borderRadius: 2,
                  '&:hover': { bgcolor: theme.palette.background.default, borderColor: theme.palette.text.primary },
                }}
              >
                Update
              </Button>
            </Box>

            <Collapse in={showPasswordForm}>
              <Box
                component="form"
                onSubmit={handlePasswordSubmit}
                sx={{
                  mt: 3,
                  p: 3,
                  bgcolor: theme.palette.background.default,
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {passwordError && (
                  <Alert severity="error" onClose={() => setPasswordError('')}>
                    {passwordError}
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert severity="success">
                    {passwordSuccess}
                  </Alert>
                )}

                <TextField
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Current Password"
                  fullWidth
                  size="small"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    '& fieldset': { borderColor: theme.palette.divider },
                  }}
                />
                <TextField
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  fullWidth
                  size="small"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    '& fieldset': { borderColor: theme.palette.divider },
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  fullWidth
                  size="small"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    '& fieldset': { borderColor: theme.palette.divider },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={passwordLoading}
                  sx={{
                    bgcolor: theme.palette.text.primary,
                    color: theme.palette.background.paper,
                    textTransform: 'none',
                    borderRadius: 2,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': { bgcolor: isDark ? '#0F172A' : '#1a2e5e' },
                  }}
                >
                  {passwordLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Change'}
                </Button>
              </Box>
            </Collapse>
          </Box>}

          <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />

          {/* ROW 2: Logout */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444' }}>Log Out</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary, mt: 0.5 }}>Sign out of your account</Typography>
            </Box>
            <Button
              startIcon={<LogoutIcon />}
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              sx={{
                textTransform: 'none',
                color: '#ef4444',
                bgcolor: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2',
                border: '1px solid #fee2e2',
                borderRadius: 2,
                '&:hover': { bgcolor: isDark ? 'rgba(239,68,68,0.2)' : '#fee2e2' },
              }}
            >
              Log Out
            </Button>
          </Box>
        </Box>

      </Box>

      {/* Toast notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '10px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
