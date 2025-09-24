import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { 
  Box, Button, Card, CardContent, Typography, 
  CircularProgress, Alert, List, ListItem, 
  ListItemText, ListItemIcon, Grid, Paper, Divider,
  Chip, Stack, IconButton, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { 
  Upload, CheckCircle, Cancel, Delete,
  VerifiedUser, Description, StarRate
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

/**
 * FarmCertificateManager Component
 * Handles uploading, displaying, and managing farm certificates
 */
const FarmCertificateManager = ({ farmId, isOwner }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [certScore, setCertScore] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  
  // Fetch certificates when component mounts or farmId changes
  useEffect(() => {
    if (farmId) {
      fetchCertificates();
    }
  }, [farmId]);
  
  // Fetch certificates from the API
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/certificates/${farmId}`);
      setCertificates(response.data.certificates || []);
      setCertScore(response.data.certificationScore || 0);
      setIsVerified(response.data.isVerified || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError(t('error.failedToLoadCertificates'));
      enqueueSnackbar(t('error.failedToLoadCertificates'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError(t('error.invalidFileType'));
      enqueueSnackbar(t('error.invalidFileType'), { variant: 'error' });
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(t('error.fileTooLarge'));
      enqueueSnackbar(t('error.fileTooLarge'), { variant: 'error' });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL for images (not PDFs)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };
  
  // Upload the certificate
  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t('error.noFileSelected'));
      enqueueSnackbar(t('error.noFileSelected'), { variant: 'error' });
      return;
    }
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('certificate', selectedFile);
    
    try {
      const response = await axios.post(
        `/api/certificates/upload/${farmId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      enqueueSnackbar(t('success.certificateUploaded'), { variant: 'success' });
      
      // Reset form and refresh certificates
      setSelectedFile(null);
      setPreviewUrl('');
      fetchCertificates();
      
      // Show recommendations if any
      if (response.data.recommendations && response.data.recommendations.length > 0) {
        // Display first recommendation as a snackbar
        enqueueSnackbar(response.data.recommendations[0], { 
          variant: 'info',
          autoHideDuration: 6000
        });
      }
    } catch (err) {
      console.error('Error uploading certificate:', err);
      setError(t('error.failedToUpload'));
      enqueueSnackbar(t('error.failedToUpload'), { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };
  
  // Delete certificate confirmation
  const confirmDelete = (certificate) => {
    setCertificateToDelete(certificate);
    setDeleteDialogOpen(true);
  };
  
  // Delete certificate
  const handleDelete = async () => {
    if (!certificateToDelete) return;
    
    setLoading(true);
    try {
      await axios.delete(`/api/certificates/${farmId}/${certificateToDelete._id}`);
      enqueueSnackbar(t('success.certificateDeleted'), { variant: 'success' });
      fetchCertificates();
    } catch (err) {
      console.error('Error deleting certificate:', err);
      setError(t('error.failedToDelete'));
      enqueueSnackbar(t('error.failedToDelete'), { variant: 'error' });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setCertificateToDelete(null);
    }
  };
  
  // Get certification score color based on value
  const getScoreColor = (score) => {
    if (score >= 90) return 'success.main';
    if (score >= 70) return 'info.main';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };
  
  // Get certification score text based on value
  const getScoreText = (score) => {
    if (score >= 90) return t('certificate.excellent');
    if (score >= 80) return t('certificate.veryGood');
    if (score >= 70) return t('certificate.good');
    if (score >= 60) return t('certificate.satisfactory');
    if (score >= 50) return t('certificate.average');
    if (score >= 30) return t('certificate.belowAverage');
    return t('certificate.poor');
  };
  
  // Certificate status label
  const renderScoreChip = (score) => (
    <Chip
      icon={score >= 70 ? <CheckCircle /> : <Cancel />}
      label={getScoreText(score)}
      color={score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error'}
      sx={{ fontWeight: 'bold' }}
    />
  );
  
  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            {t('certificate.farmCertificates')}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {isVerified && (
              <Chip
                icon={<VerifiedUser />}
                label={t('certificate.verified')}
                color="success"
                variant="outlined"
              />
            )}
            <Chip
              icon={<StarRate />}
              label={`${t('certificate.score')}: ${certScore}`}
              color={certScore >= 70 ? 'success' : certScore >= 50 ? 'warning' : 'error'}
              variant="outlined"
            />
          </Stack>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Certificate Score Info */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('certificate.certificationStatus')}
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress 
                  variant="determinate" 
                  value={certScore} 
                  size={80}
                  thickness={5}
                  sx={{ color: getScoreColor(certScore) }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" component="div" color="text.secondary">
                    {`${Math.round(certScore)}`}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="body1" gutterBottom>
                {t('certificate.scoreExplanation')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('certificate.visibilityExplanation', { score: Math.max(10, Math.round(certScore)) })}
              </Typography>
              <Box mt={1}>
                {renderScoreChip(certScore)}
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Upload Section (only for owners) */}
        {isOwner && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('certificate.uploadCertificate')}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
              <input
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                id="certificate-upload"
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <label htmlFor="certificate-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                  disabled={uploading}
                >
                  {t('button.selectFile')}
                </Button>
              </label>
              
              {selectedFile && (
                <Box mt={2} textAlign="center">
                  <Typography variant="body2">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </Typography>
                  
                  {previewUrl && (
                    <Box mt={1} sx={{ maxWidth: '100%', maxHeight: 200, overflow: 'hidden' }}>
                      <img 
                        src={previewUrl} 
                        alt="Certificate preview" 
                        style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }} 
                      />
                    </Box>
                  )}
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={uploading}
                    sx={{ mt: 2 }}
                  >
                    {uploading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      t('button.upload')
                    )}
                  </Button>
                </Box>
              )}
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        )}
        
        {/* Certificates List */}
        <Typography variant="h6" gutterBottom>
          {t('certificate.existingCertificates')}
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : certificates.length > 0 ? (
          <List>
            {certificates.map((cert, index) => (
              <Paper key={cert._id || index} variant="outlined" sx={{ mb: 2 }}>
                <ListItem
                  secondaryAction={
                    isOwner && (
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => confirmDelete(cert)}
                      >
                        <Delete />
                      </IconButton>
                    )
                  }
                >
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1">
                          {cert.details?.certificateType || t('certificate.unknown')}
                        </Typography>
                        {renderScoreChip(cert.score)}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span" display="block">
                          {cert.details?.issuer || t('certificate.unknownIssuer')}
                        </Typography>
                        
                        <Typography variant="body2" component="span" display="block">
                          {t('certificate.validUntil')}: {cert.details?.validUntil || t('certificate.unknown')}
                        </Typography>
                        
                        {cert.details?.isOrganic && (
                          <Chip 
                            label={t('certificate.organic')} 
                            color="success" 
                            size="small" 
                            sx={{ mt: 1 }} 
                          />
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Alert severity="info">
            {t('certificate.noCertificates')}
          </Alert>
        )}
      </CardContent>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('certificate.confirmDelete')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('certificate.deleteWarning')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('button.cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default FarmCertificateManager;