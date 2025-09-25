import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCertificate, faSpinner, faExclamationTriangle,
  faPlus, faTimes, faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import API from '../api/api';
import CertificateCard from './CertificateCard';
import CertificateUploader from './CertificateUploader';

/**
 * Component for displaying and managing farm certificates
 * @param {Object} props
 * @param {string} props.farmId - ID of the farm to display certificates for
 */
const FarmCertificates = ({ farmId }) => {
  const { token } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [stats, setStats] = useState({
    validCount: 0,
    expiringCount: 0,
    expiredCount: 0,
    averageScore: 0,
    highestScore: 0
  });

  // Load certificates for the farm
  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.get(`/api/certificates/farms/${farmId}/certificates`);
      
      if (response.data.success) {
        setCertificates(response.data.certificates || []);
        calculateStats(response.data.certificates || []);
      } else {
        setError(response.data.message || 'Failed to load certificates');
      }
    } catch (err) {
      console.error('Error loading certificates:', err);
      setError('Unable to load certificates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate certificate stats
  const calculateStats = (certs) => {
    const now = new Date();
    let validCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    let totalScore = 0;
    let highestScore = 0;
    
    certs.forEach(cert => {
      // Update highest score
      if (cert.score > highestScore) {
        highestScore = cert.score;
      }
      
      // Add to total score for average
      totalScore += cert.score || 0;
      
      // Check expiry status
      if (cert.expiryDate) {
        const expiryDate = new Date(cert.expiryDate);
        if (expiryDate < now) {
          expiredCount++;
        } else {
          // Check if expiring in 30 days
          const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
          if (daysRemaining <= 30) {
            expiringCount++;
          } else {
            validCount++;
          }
        }
      } else {
        // No expiry date - count as valid
        validCount++;
      }
    });
    
    setStats({
      validCount,
      expiringCount,
      expiredCount,
      averageScore: certs.length ? Math.round(totalScore / certs.length) : 0,
      highestScore
    });
  };

  // Handle certificate deletion
  const handleDelete = async (certificateId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }
    
    try {
      const response = await API.delete(`/api/certificates/farms/${farmId}/certificates/${certificateId}`);
      
      if (response.data.success) {
        // Remove the certificate from the list
        setCertificates(prev => prev.filter(cert => cert._id !== certificateId));
        calculateStats(certificates.filter(cert => cert._id !== certificateId));
      }
    } catch (err) {
      console.error('Error deleting certificate:', err);
    }
  };

  // Handle certificate reprocessing
  const handleReprocess = async (certificateId) => {
    try {
      const response = await API.post(`/api/certificates/farms/${farmId}/certificates/${certificateId}/reprocess`);
      
      if (response.data.success) {
        // Update the certificate with the new data
        setCertificates(prev => prev.map(cert => 
          cert._id === certificateId ? response.data.certificate : cert
        ));
        calculateStats(certificates.map(cert => 
          cert._id === certificateId ? response.data.certificate : cert
        ));
      }
    } catch (err) {
      console.error('Error reprocessing certificate:', err);
    }
  };

  // Handle successful certificate upload
  const handleCertificateUploaded = (newCertificate) => {
    setCertificates(prev => [newCertificate, ...prev]);
    calculateStats([newCertificate, ...certificates]);
    setShowUploader(false);
  };

  // Load certificates on component mount
  useEffect(() => {
    if (farmId) {
      loadCertificates();
    }
  }, [farmId]);

  // Show loading state
  if (loading && !certificates.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <FontAwesomeIcon icon={faSpinner} spin className="text-green-600 mr-2" />
          <span>Loading certificates...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Certificates Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            <FontAwesomeIcon icon={faCertificate} className="mr-2 text-green-600" />
            Farm Certifications
          </h3>
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={showUploader ? faTimes : faPlus} className="mr-2" />
            {showUploader ? 'Cancel' : 'Add Certificate'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Certificate Stats Summary */}
        {certificates.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-800">Valid Certificates</div>
              <div className="text-2xl font-bold text-green-700">{stats.validCount}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-800">Expiring Soon</div>
              <div className="text-2xl font-bold text-yellow-700">{stats.expiringCount}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-800">Expired</div>
              <div className="text-2xl font-bold text-red-700">{stats.expiredCount}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-800">Highest Score</div>
              <div className="text-2xl font-bold text-blue-700">{stats.highestScore}/100</div>
            </div>
          </div>
        )}
        
        {/* Certificate Uploader */}
        {showUploader && (
          <div className="mb-6">
            <CertificateUploader 
              farmId={farmId} 
              onSuccess={handleCertificateUploaded} 
            />
          </div>
        )}
        
        {/* Certificates List */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certificates.map(certificate => (
              <CertificateCard
                key={certificate._id}
                certificate={certificate}
                onDelete={handleDelete}
                onReprocess={handleReprocess}
              />
            ))}
          </div>
        ) : !showUploader ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <FontAwesomeIcon icon={faCertificate} className="text-gray-400 text-3xl mb-2" />
            <p className="text-gray-500 mb-4">No certificates added yet</p>
            <button
              onClick={() => setShowUploader(true)}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition duration-300 inline-flex items-center"
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
              Add Your First Certificate
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default FarmCertificates;