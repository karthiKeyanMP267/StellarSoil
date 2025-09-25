import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCertificate, faCalendarCheck, 
  faCalendarTimes, faHashtag, 
  faUserCheck, faTrash, faSync
} from '@fortawesome/free-solid-svg-icons';

/**
 * Display a certificate card with visual score and key details
 * @param {Object} props
 * @param {Object} props.certificate - Certificate data object
 * @param {Function} props.onDelete - Function to handle certificate deletion
 * @param {Function} props.onReprocess - Function to handle certificate reprocessing
 */
const CertificateCard = ({ certificate, onDelete, onReprocess }) => {
  // Format a date from ISO string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  // Function to get status text and color
  const getStatusInfo = () => {
    const now = new Date();
    const expiry = certificate.expiryDate ? new Date(certificate.expiryDate) : null;
    
    if (!expiry) return { text: 'Unknown Status', color: 'bg-gray-500' };
    
    if (expiry < now) {
      return { text: 'Expired', color: 'bg-red-600' };
    } else {
      // Calculate days remaining
      const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      if (daysRemaining <= 30) {
        return { text: 'Expiring Soon', color: 'bg-yellow-600' };
      } else {
        return { text: 'Valid', color: 'bg-green-600' };
      }
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition duration-300 bg-white">
      {/* Certificate Header */}
      <div className="flex justify-between items-center mb-3 border-b pb-3">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCertificate} className="text-green-600 mr-2 text-xl" />
          <h3 className="font-medium text-lg text-gray-800">
            {certificate.type || 'Organic Certificate'}
          </h3>
        </div>
        <div className="flex items-center">
          <div className={`text-xs font-bold text-white px-3 py-1 rounded-full ${statusInfo.color}`}>
            {statusInfo.text}
          </div>
        </div>
      </div>
      
      {/* Certificate Score */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Certification Score</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`${getScoreColor(certificate.score)} h-4 rounded-full`} 
            style={{width: `${certificate.score}%`}}
          ></div>
        </div>
        <div className="mt-1 text-right font-bold">{certificate.score}/100</div>
      </div>
      
      {/* Certificate Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {certificate.certNumber && (
          <div className="text-sm">
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faHashtag} className="mr-2" />
              Certificate Number:
            </div>
            <div className="font-medium ml-6 text-gray-800">{certificate.certNumber}</div>
          </div>
        )}
        
        {certificate.issuerName && (
          <div className="text-sm">
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
              Issued By:
            </div>
            <div className="font-medium ml-6 text-gray-800">{certificate.issuerName}</div>
          </div>
        )}
        
        {formatDate(certificate.issueDate) && (
          <div className="text-sm">
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
              Issue Date:
            </div>
            <div className="font-medium ml-6 text-gray-800">{formatDate(certificate.issueDate)}</div>
          </div>
        )}
        
        {formatDate(certificate.expiryDate) && (
          <div className="text-sm">
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faCalendarTimes} className="mr-2" />
              Expiry Date:
            </div>
            <div className="font-medium ml-6 text-gray-800">{formatDate(certificate.expiryDate)}</div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2 justify-end">
        {onReprocess && (
          <button 
            onClick={() => onReprocess(certificate._id)}
            className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition duration-300"
          >
            <FontAwesomeIcon icon={faSync} className="mr-1" /> Reprocess
          </button>
        )}
        {onDelete && (
          <button 
            onClick={() => onDelete(certificate._id)}
            className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition duration-300"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;