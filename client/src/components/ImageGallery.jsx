import React, { useState } from 'react';
import API from '../api/api';

const ImageGallery = ({ images, type, id, onDelete, editable = false }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const endpoint = type === 'farm' 
        ? '/api/farms/images'
        : `/api/products/${id}/images`;

      await API.delete(endpoint, {
        data: { imageUrl }
      });

      if (onDelete) onDelete(imageUrl);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error deleting image');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            {editable && (
              <button
                onClick={() => handleDelete(imageUrl)}
                disabled={deleting}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
