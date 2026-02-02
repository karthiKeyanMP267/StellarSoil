import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, PlusIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import API from '../api/api';
import CertificateCard from './CertificateCard';
import CertificateUploader from './CertificateUploader';

/**
 * Simplified component for managing farm certificates
 */
const FarmCertificates = ({ farmId }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploader, setShowUploader] = useState(false);

  // Load certificates
  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.get(`/api/certificates/farms/${farmId}/certificates`);
      if (response.data.success) {
        setCertificates(response.data.certificates || []);
      }
    } catch (err) {
      setError('Unable to load certificates');
    } finally {
      setLoading(false);
    }
  };

  // Handle certificate deletion
  const handleDelete = async (certificateId) => {
    if (!window.confirm('Delete this certificate?')) return;
    
    try {
      await API.delete(`/api/certificates/farms/${farmId}/certificates/${certificateId}`);
      setCertificates(prev => prev.filter(cert => cert._id !== certificateId));
    } catch (err) {
      setError('Failed to delete certificate');
    }
  };

  // Handle certificate upload success
  const handleUploadSuccess = (newCertificate) => {
    setCertificates(prev => [newCertificate, ...prev]);
    setShowUploader(false);
  };

  useEffect(() => {
    if (farmId) loadCertificates();
  }, [farmId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading certificates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          Farm Certificates
        </h3>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          {showUploader ? (
            <>
              <XMarkIcon className="h-5 w-5" />
              Cancel
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5" />
              Add Certificate
            </>
          )}
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2 text-red-700">
          <ExclamationTriangleIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Certificate Uploader */}
      {showUploader && (
        <div className="mb-6">
          <CertificateUploader 
            farmId={farmId} 
            onSuccess={handleUploadSuccess} 
          />
        </div>
      )}
      
      {/* Certificates List */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {certificates.map(certificate => (
            <CertificateCard
              key={certificate._id}
              certificate={certificate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : !showUploader ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No certificates added yet</p>
          <button
            onClick={() => setShowUploader(true)}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition inline-flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Your First Certificate
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FarmCertificates;