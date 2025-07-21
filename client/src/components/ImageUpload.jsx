import React, { useState } from 'react';
import API from '../api/api';

const ImageUpload = ({ type, id, onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const endpoint = type === 'farm' 
        ? '/api/farms/images'
        : `/api/products/${id}/images`;

      const response = await API.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFiles([]);
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className={`px-6 py-2 text-white rounded-lg transition-colors duration-200 
            ${uploading || files.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700'
            }`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
