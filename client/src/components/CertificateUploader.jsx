import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, faSpinner, faCertificate, 
  faFileAlt, faTimesCircle, faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import API from '../api/api';

/**
 * Component to upload and process certification documents
 * @param {Object} props
 * @param {string} props.farmId - ID of the farm to upload certificate for
 * @param {Function} props.onSuccess - Callback function after successful upload
 */
const CertificateUploader = ({ farmId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [certType, setCertType] = useState('Organic Certification');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type === 'application/pdf') {
      // Set a generic PDF preview
      setPreview('pdf');
    } else {
      setPreview(null);
    }
  };
  
  // Clear selected file
  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };
  
  // Handle certificate upload
  const uploadCertificate = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setProcessingStatus('Uploading file...');
    setUploadProgress(10);
    
    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('type', certType);
    
    try {
      // Start fake progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 5;
          if (next >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return next;
        });
        
        // Update processing messages
        if (uploadProgress < 30) {
          setProcessingStatus('Uploading file...');
        } else if (uploadProgress < 60) {
          setProcessingStatus('Processing document content...');
        } else {
          setProcessingStatus('Analyzing certification details...');
        }
      }, 500);
      
      const response = await API.post(`/api/certificates/farms/${farmId}/certificates`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setProcessingStatus('Complete!');
      
      if (response.data.success) {
        toast.success('Certificate uploaded and processed successfully');
        
        // Reset form
        setFile(null);
        setPreview(null);
        setCertType('Organic Certification');
        
        // Call success callback with the new certificate data
        if (onSuccess) onSuccess(response.data.certificate);
      }
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast.error('Failed to upload certificate: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setProcessingStatus('');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faCertificate} className="mr-2 text-green-600 text-xl" />
        <h3 className="text-xl font-semibold text-gray-800">Upload New Certificate</h3>
      </div>
      
      <form onSubmit={uploadCertificate}>
        {/* Certificate Type */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Certificate Type
          </label>
          <select
            value={certType}
            onChange={(e) => setCertType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={uploading}
          >
            <option value="Organic Certification">Organic Certification</option>
            <option value="Fair Trade">Fair Trade</option>
            <option value="Sustainable Farming">Sustainable Farming</option>
            <option value="Non-GMO">Non-GMO Certification</option>
            <option value="Quality Control">Quality Control</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* File Upload Area */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Certificate Document (PDF or Image)
          </label>
          
          {!file ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition"
              onClick={() => document.getElementById('certificate-file').click()}
            >
              <FontAwesomeIcon icon={faUpload} className="text-3xl text-gray-400 mb-2" />
              <p className="text-gray-600">Click to select a file or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, PNG (max 10MB)</p>
              <input
                type="file"
                id="certificate-file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={preview === 'pdf' ? faFileAlt : faFileAlt} 
                    className="text-xl mr-2 text-blue-500" 
                  />
                  <span className="text-gray-800 font-medium truncate">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-red-500 hover:text-red-700"
                  disabled={uploading}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
              </div>
              
              {preview && preview !== 'pdf' && (
                <div className="mt-2">
                  <img 
                    src={preview} 
                    alt="Certificate preview" 
                    className="max-h-40 rounded-md mx-auto border" 
                  />
                </div>
              )}
              
              {preview === 'pdf' && (
                <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
                  <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-red-500 mr-2" />
                  <span>PDF Document</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Processing status & progress */}
        {uploading && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-green-700">{processingStatus}</span>
              <span className="text-sm font-medium text-green-700">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!file || uploading}
            className={`
              px-4 py-2 rounded-lg text-white font-medium 
              ${!file || uploading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 transition duration-300'}
            `}
          >
            {uploading ? (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Upload & Process Certificate
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateUploader;