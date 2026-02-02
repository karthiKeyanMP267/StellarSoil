import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const DeliveryMap = ({ origin, destination, deliveryLocation }) => {
  const center = {
    lat: (origin?.lat + destination?.lat) / 2 || 11.7401,
    lng: (origin?.lng + destination?.lng) / 2 || 78.1550,
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {origin && <Marker position={origin} label="Farm" />}
        {destination && <Marker position={destination} label="Delivery" />}
        {deliveryLocation && <Marker position={deliveryLocation} label="Current" />}
      </GoogleMap>
    </LoadScript>
  );
};

export default DeliveryMap;
