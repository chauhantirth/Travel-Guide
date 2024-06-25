import React from 'react';

const HaversineDistance = (userCoords, placeCoords) => {
  // Coordinates
  const lat1 = placeCoords.lat;
  const lon1 = placeCoords.lng;
  const lat2 = userCoords.lat;
  const lon2 = userCoords.lng;

  // Function to convert degrees to radians
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // Haversine formula to calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
  };

  // Calculate the distance
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance;
};

export default HaversineDistance;
