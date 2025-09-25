import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import { Box, Button, Card, CardContent, Typography, 
         CircularProgress, Alert, Grid, Paper, Divider, Chip, Tooltip,
         Skeleton, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { styled } from '@mui/material/styles';
import { useNotification } from './ui/Notification';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'visible'
}));

const ScoreBadge = styled(Box)(({ theme, score }) => ({
  position: 'absolute',
  top: '-20px',
  right: '20px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: score >= 80 ? theme.palette.success.main : 
                  score >= 60 ? theme.palette.warning.main : 
                  theme.palette.error.main,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[3],
  zIndex: 1,
  border: `3px solid ${theme.palette.background.paper}`,
  [theme.breakpoints.down('sm')]: {
    top: '-16px',
    right: '16px',
    width: '48px',
    height: '48px'
  }
}));

const GradeBadge = styled(Box)(({ theme, grade }) => ({
  position: 'absolute',
  top: '-15px',
  left: '20px',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 
    grade === 'A+' || grade === 'A' ? theme.palette.success.main : 
    grade === 'B' ? theme.palette.warning.main : 
    theme.palette.error.main,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[2],
  fontWeight: 'bold',
  fontSize: '1.2rem',
  [theme.breakpoints.down('sm')]: {
    top: '-12px',
    left: '16px',
    width: '34px',
    height: '34px',
    fontSize: '1rem'
  }
}));

const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderStyle: 'dashed',
  borderWidth: '2px',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(3),
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper
  }
}));

// NOTE: Phase-2 TODO -> externalize all static strings to i18n keys
const FarmCertificateManager = () => {
  const { farmId } = useParams();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [farmScore, setFarmScore] = useState(0);
  const [effectiveFarmId, setEffectiveFarmId] = useState(farmId || null);
  const [dragOver, setDragOver] = useState(false);
  const { success: notifySuccess, error: notifyError, info: notifyInfo } = useNotification?.() || {};
  const [reprocessingIds, setReprocessingIds] = useState(new Set());
  const [reprocessingAll, setReprocessingAll] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkTotal, setBulkTotal] = useState(0);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, cert: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, cert: null });
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Fetch certificates on component mount
  useEffect(() => {
    // Resolve farm id if not provided in route
    const ensureFarmId = async () => {
      try {
        if (farmId) {
          setEffectiveFarmId(farmId);
          return;
        }
        // Try to get current farmer profile and use its _id
        const res = await API.get('/farms/profile/me');
        const id = res?.data?._id || res?.data?.farm?._id || res?.data?.id;
        if (id) {
          setEffectiveFarmId(id);
        } else {
          setError('Unable to determine your farm ID. Please complete your farm profile first.');
        }
      } catch (e) {
        console.error('Failed to resolve farm id:', e);
        setError('Unable to load farm profile. Please ensure your farm profile is completed.');
      }
    };

    ensureFarmId();
  }, [farmId]);

  useEffect(() => {
    if (effectiveFarmId) {
      fetchCertificates();
    }
  }, [effectiveFarmId]);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      if (!effectiveFarmId) return;
  const response = await API.get(`/certificates/farms/${effectiveFarmId}/certificates`);
      setCertificates(response.data.certificates || []);
      setFarmScore(response.data.certificationScore || 0);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to fetch certificates. Please try again.');
      notifyError && notifyError('Certificates', 'Failed to fetch certificates');
      setLoading(false);
    }
  }, [effectiveFarmId, notifyError]);

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please select an image (JPG, PNG, TIFF, BMP) or PDF file.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File is too large. Maximum size is 10MB.');
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError(null);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'application/pdf'];
      if (!validTypes.includes(droppedFile.type)) {
        setError('Invalid file type. Please select an image (JPG, PNG, TIFF, BMP) or PDF file.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File is too large. Maximum size is 10MB.');
        return;
      }
      
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError(null);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  }, [dragOver]);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleSubmit = useCallback(async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);
      
      const formData = new FormData();
      formData.append('certificate', file);
      
      if (!effectiveFarmId) {
        setError('Unable to determine your farm ID. Please try again.');
        setUploading(false);
        return;
      }
  const response = await API.post(`/certificates/farms/${effectiveFarmId}/certificates`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
  setSuccess('Certificate uploaded and processed successfully!');
  notifySuccess && notifySuccess('Certificate', 'Uploaded and processed successfully');
      setFile(null);
      setFileName('');
      setUploading(false);
      
      // Refresh certificate list
      fetchCertificates();
    } catch (err) {
      console.error('Error uploading certificate:', err);
      setError(err.response?.data?.message || 'Failed to upload certificate. Please try again.');
      notifyError && notifyError('Upload Failed', err.response?.data?.message || 'Could not process certificate');
      setUploading(false);
    }
  }, [file, effectiveFarmId, fetchCertificates, notifyError, notifySuccess]);

  const handleDeleteCertificate = async (certificateId) => {
    if (!effectiveFarmId) return;
    // Optimistic UI: remove from UI first
    const prev = certificates;
    const next = certificates.filter(c => c._id !== certificateId);
    setCertificates(next);
    setDeletingIds(prevSet => new Set(prevSet).add(certificateId));
    try {
  await API.delete(`/certificates/farms/${effectiveFarmId}/certificates/${certificateId}`);
      setSuccess('Certificate deleted successfully.');
      notifySuccess && notifySuccess('Certificate', 'Deleted successfully');
      // Optionally refresh score after deletion
      fetchCertificates();
    } catch (err) {
      console.error('Error deleting certificate:', err);
      setError('Failed to delete certificate. Restoring item.');
      notifyError && notifyError('Delete Failed', 'Unable to delete certificate');
      setCertificates(prev); // rollback
    } finally {
      setDeletingIds(prevSet => {
        const s = new Set(prevSet);
        s.delete(certificateId);
        return s;
      });
    }
  };

  const reprocessCertificate = async (certificateId) => {
    try {
      if (!effectiveFarmId) return;
      setReprocessingIds(prev => new Set(prev).add(certificateId));
  await API.post(`/certificates/farms/${effectiveFarmId}/certificates/${certificateId}/reprocess`);
      setSuccess('Certificate reprocessed successfully.');
      fetchCertificates();
    } catch (err) {
      console.error('Error reprocessing certificate:', err);
      setError('Failed to reprocess certificate.');
      notifyError && notifyError('Reprocess Failed', 'Unable to reprocess this certificate');
    } finally {
      setReprocessingIds(prev => {
        const next = new Set(prev);
        next.delete(certificateId);
        return next;
      });
    }
  };

  const handleBulkReprocess = async () => {
    if (!effectiveFarmId || certificates.length === 0) return;
    setBulkDialogOpen(false);
    setReprocessingAll(true);
    setBulkTotal(certificates.length);
    setBulkProgress(0);
    notifyInfo && notifyInfo('Reprocess All', `Starting OCR reprocessing for ${certificates.length} certificates...`);
    let successCount = 0;
    let failCount = 0;
    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i];
      setReprocessingIds(prev => new Set(prev).add(cert._id));
      try {
        await API.post(`/certificates/${effectiveFarmId}/${cert._id}/reprocess`);
        successCount++;
      } catch (e) {
        console.error('Bulk reprocess error for', cert._id, e);
        failCount++;
      } finally {
        setReprocessingIds(prev => {
          const next = new Set(prev);
          next.delete(cert._id);
          return next;
        });
        setBulkProgress(i + 1);
      }
    }
    await fetchCertificates();
    setReprocessingAll(false);
    if (failCount === 0) {
      setSuccess(`Reprocessed ${successCount} certificate(s) successfully.`);
      notifySuccess && notifySuccess('Reprocess Complete', `${successCount} certificate(s) reprocessed`);
    } else {
      setError(`Reprocessed ${successCount} succeeded, ${failCount} failed.`);
      notifyError && notifyError('Reprocess Completed with Errors', `${successCount} succeeded, ${failCount} failed`);
    }
  };

  const getCertificateTypeColor = (certType) => {
    if (!certType || certType === "Unknown") return "default";
    
    const typeMap = {
      "NPOP Organic": "success",
      "APEDA Organic": "success",
      "PGS Organic": "success",
      "TNOCD Organic": "success", 
      "Agmark": "primary",
      "IndGAP": "info",
      "Global GAP": "info",
      "Bharat GAP": "primary",
      "Fair Trade": "secondary",
      "Rainforest Alliance": "success",
      "ISO Certified": "warning",
      "Seed Certification": "default",
      "Farmer Capacity Assessment": "default"
    };
    
    return typeMap[certType] || "default";
  };

  // Helper to render a labeled line only when there is a meaningful value
  const Labeled = ({ label, value }) => {
    if (!value || value === 'Unknown' || value === 'Not specified') return null;
    return (
      <Typography variant="body2" color="textSecondary">
        <strong>{label}:</strong> {value}
      </Typography>
    );
  };

  return (
    <Box sx={{ px: { xs: 1.5, md: 3 }, py: 2 }}>
      <Box sx={{ mb: 3, p: 3, borderRadius: 2, background: (theme) => `linear-gradient(135deg, ${theme.palette.success.light}, ${theme.palette.success.main})`, color: (theme) => theme.palette.common.white }}>
        <Typography variant="h5" fontWeight={700}>Farm Certification Manager</Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          Upload certificates to boost trust and ranking in searches. Higher certification scores improve visibility.
        </Typography>
      </Box>

      {/* Farm Score Display */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Typography variant="h6" sx={{ mr: 2 }}>
          Current Farm Certification Score:
        </Typography>
        <Box sx={{ 
          position: 'relative', 
          display: 'inline-flex',
          mr: 2
        }}>
          <CircularProgress 
            variant="determinate" 
            value={farmScore} 
            size={60}
            thickness={5}
            color={
              farmScore >= 80 ? "success" : 
              farmScore >= 60 ? "warning" : 
              "error"
            }
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
            <Typography
              variant="caption"
              component="div"
              sx={{ fontWeight: 'bold', fontSize: '1rem' }}
            >
              {farmScore}
            </Typography>
          </Box>
        </Box>
        {farmScore >= 80 ? (
          <Chip color="success" icon={<CheckIcon />} label="Excellent" />
        ) : farmScore >= 60 ? (
          <Chip color="warning" icon={<CheckIcon />} label="Good" />
        ) : farmScore > 0 ? (
          <Chip color="error" icon={<CloseIcon />} label="Needs Improvement" />
        ) : (
          <Chip icon={<CloseIcon />} label="No Certification" />
        )}
        <Tooltip title="Score is based on certificate type, validity, completeness, and farm size.">
          <IconButton sx={{ ml: 1 }} size="small" color="inherit">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {/* Upload Section */}
      <UploadBox
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('certificate-upload').click()}
        sx={(theme) => ({
          borderColor: dragOver ? theme.palette.primary.main : undefined,
          backgroundColor: dragOver ? theme.palette.action.hover : undefined,
          transition: 'all 120ms ease-in-out'
        })}
        role="button"
        tabIndex={0}
        aria-label="Upload farm certificate"
        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('certificate-upload').click(); }}
      >
        <input
          type="file"
          id="certificate-upload"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.tiff,.bmp,.pdf"
          aria-hidden="true"
        />
        <UploadIcon fontSize="large" color="primary" />
        <Typography variant="h6" sx={{ mt: 1 }}>
          Drag & drop your certificate here or click to browse
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Supported: JPG, PNG, TIFF, BMP, PDF • Max 10MB
        </Typography>
        
        {fileName && (
          <Box sx={{ mt: 2 }}>
            <Chip label={fileName} onDelete={() => {
              setFile(null);
              setFileName('');
            }} />
          </Box>
        )}
      </UploadBox>
      
      <Box sx={{ textAlign: 'right', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!file || uploading}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
          aria-disabled={!file || uploading}
        >
          {uploading ? 'Processing...' : 'Upload & Process Certificate'}
        </Button>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {/* Certificates List Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">
          Uploaded Certificates
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={reprocessingAll ? <CircularProgress size={18} /> : <AutorenewIcon />}
            disabled={loading || certificates.length === 0 || reprocessingAll}
            onClick={() => setBulkDialogOpen(true)}
          >
            Reprocess All
          </Button>
        </Box>
      </Box>

      {reprocessingAll && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant={bulkTotal > 0 ? 'determinate' : 'indeterminate'} value={bulkTotal > 0 ? (bulkProgress / bulkTotal) * 100 : 0} />
          <Typography variant="caption" color="text.secondary">
            Processing {bulkProgress} / {bulkTotal}
          </Typography>
        </Box>
      )}
      
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={12} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width={220} height={28} />
                  <Skeleton variant="text" width={160} />
                  <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : certificates.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No certificates uploaded yet. Upload certificates to increase your farm's visibility.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {certificates.map((cert) => (
            <Grid item xs={12} key={cert._id}>
              <StyledCard>
                <ScoreBadge score={cert.score}>
                  <Typography variant="h5">{cert.score}</Typography>
                </ScoreBadge>
                
                <GradeBadge grade={cert.grade}>
                  {cert.grade}
                </GradeBadge>
                
                <CardContent sx={{ pt: 6, pb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        <Chip 
                          color={getCertificateTypeColor(cert.details?.certificateType)} 
                          label={cert.details?.certificateType || 'Unknown Certificate'} 
                          sx={{ mr: 1 }}
                        />
                        {cert.details?.isOrganic && (
                          <Chip color="success" label="Organic" size="small" sx={{ mr: 1 }} />
                        )}
                      </Typography>

                      <Box sx={{ mb: 2, display: 'grid', gap: 0.5 }}>
                        {/* Certificate number shown if present */}
                        <Labeled label="Certificate No" value={cert.details?.certificateNumber} />
                        <Labeled label="Issuer" value={cert.details?.issuer} />
                        <Labeled label="Valid Until" value={cert.details?.validUntil} />
                        <Labeled label="Farm Size" value={cert.details?.farmSize} />
                        <Labeled label="Crops" value={cert.details?.crops} />
                        <Typography variant="body2" color="textSecondary">
                          <strong>Uploaded:</strong> {new Date(cert.uploadDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'right', display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
                        {cert.file && (
                          <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            href={`/uploads/certificates/${cert.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          color="secondary"
                          startIcon={<DeleteIcon />}
                          onClick={() => setConfirmDelete({ open: true, cert })}
                        >
                          {deletingIds.has(cert._id) ? <CircularProgress size={18} /> : 'Delete'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<InfoOutlinedIcon />}
                          onClick={() => {
                            setDetailsDialog({ open: true, cert });
                          }}
                        >
                          Details
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={reprocessingIds.has(cert._id) ? <CircularProgress size={18} /> : <AutorenewIcon />}
                          onClick={() => reprocessCertificate(cert._id)}
                          disabled={reprocessingAll || reprocessingIds.has(cert._id)}
                        >
                          Reprocess
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Parsed Details Dialog */}
      {detailsDialog?.open && (
        <Dialog open={detailsDialog.open} onClose={() => setDetailsDialog({ open: false })} maxWidth="md" fullWidth>
          <DialogTitle>Parsed Certificate Output</DialogTitle>
          <DialogContent dividers>
            <Typography variant="subtitle2" gutterBottom>Fields extracted from OCR and scoring:</Typography>
            <Box component="pre" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, overflow: 'auto', maxHeight: 400 }}>
              {JSON.stringify({
                score: detailsDialog.cert?.score,
                grade: detailsDialog.cert?.grade,
                details: detailsDialog.cert?.details,
                // If your API returns components or recommendations, include them when available
                score_components: detailsDialog.cert?.score_components,
                recommendations: detailsDialog.cert?.recommendations
              }, null, 2)}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialog({ open: false })}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete?.open && (
        <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, cert: null })}>
          <DialogTitle>Delete certificate?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action will permanently remove the certificate from your farm. This cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete({ open: false, cert: null })}>Cancel</Button>
            <Button color="error" variant="contained" startIcon={<DeleteIcon />} onClick={() => {
              const id = confirmDelete.cert?._id;
              setConfirmDelete({ open: false, cert: null });
              if (id) handleDeleteCertificate(id);
            }}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Bulk Reprocess Confirmation Dialog */}
      <Dialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)}>
        <DialogTitle>Reprocess all certificates?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will re-run OCR and scoring on all {certificates.length} certificate(s). It may take a while depending on file sizes. Continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<AutorenewIcon />} onClick={handleBulkReprocess} autoFocus>
            Yes, Reprocess All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmCertificateManager;