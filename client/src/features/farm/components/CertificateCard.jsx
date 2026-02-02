import React from 'react';
import { ShieldCheckIcon, CalendarIcon, TrashIcon, HashtagIcon } from '@heroicons/react/24/outline';

/**
 * Simplified certificate card display
 */
const CertificateCard = ({ certificate, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getStatus = () => {
    if (!certificate.expiryDate) return { text: 'Active', color: 'bg-gray-500' };
    
    const now = new Date();
    const expiry = new Date(certificate.expiryDate);
    const daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) return { text: 'Expired', color: 'bg-red-600' };
    if (daysRemaining <= 30) return { text: 'Expiring Soon', color: 'bg-yellow-600' };
    return { text: 'Valid', color: 'bg-green-600' };
  };

  const status = getStatus();

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-green-600" />
          <h3 className="font-medium text-gray-800">
            {certificate.type || 'Organic Certificate'}
          </h3>
        </div>
        <span className={`text-xs font-medium text-white px-2 py-1 rounded-full ${status.color}`}>
          {status.text}
        </span>
      </div>
      
      {/* Score Bar */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Score</div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`${getScoreColor(certificate.score)} h-3 rounded-full transition-all`} 
            style={{width: `${certificate.score}%`}}
          />
        </div>
        <div className="mt-1 text-right font-semibold text-sm">{certificate.score}/100</div>
      </div>
      
      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        {certificate.certNumber && (
          <div className="flex items-center gap-2 text-gray-600">
            <HashtagIcon className="h-4 w-4" />
            <span className="font-medium">{certificate.certNumber}</span>
          </div>
        )}
        
        {certificate.issuerName && (
          <div className="text-gray-600">
            <span className="font-medium">Issuer:</span> {certificate.issuerName}
          </div>
        )}
        
        {certificate.issueDate && (
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>Issued: {formatDate(certificate.issueDate)}</span>
          </div>
        )}
        
        {certificate.expiryDate && (
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>Expires: {formatDate(certificate.expiryDate)}</span>
          </div>
        )}
      </div>
      
      {/* Actions */}
      {onDelete && (
        <button 
          onClick={() => onDelete(certificate._id)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
        >
          <TrashIcon className="h-4 w-4" />
          Delete Certificate
        </button>
      )}
    </div>
  );
};

export default CertificateCard;