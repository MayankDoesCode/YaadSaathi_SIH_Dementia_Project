/**
 * locationService.js
 * SafeCircle Geolocation & Geofencing Service for YaadSaathi.
 * Computes Haversine distance, checks safe-zone thresholds, and manages browser geolocation permissions.
 */

// Default Safe Zone Anchor (Hazratganj, Lucknow for Indian context)
export const DEFAULT_HOME = {
  lat: 26.8467,
  lng: 80.9462,
  name: 'गृह पता (Home)',
  address: '12-B, हजरतगंज, लखनऊ (Hazratganj, Lucknow)',
};

// Safe Radius defined as 500 meters per requirements
export const SAFE_RADIUS_METERS = 500;

// Approaching boundary threshold (e.g. 80% of radius = 400m)
export const APPROACHING_RADIUS_METERS = 400;

/**
 * Calculates Haversine distance between two coordinates in meters.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Determines SafeZone status based on distance.
 * @param {number} distanceMeters
 * @param {number} radius
 * @returns {'SAFE' | 'APPROACHING' | 'OUTSIDE_SAFE_ZONE'}
 */
export function getSafeZoneStatus(distanceMeters, radius = SAFE_RADIUS_METERS) {
  if (distanceMeters <= radius * 0.8) {
    return 'SAFE'; // 🟢 Inside Safe Zone
  } else if (distanceMeters <= radius) {
    return 'APPROACHING'; // 🟠 Approaching Safe Zone Boundary
  } else {
    return 'OUTSIDE_SAFE_ZONE'; // 🔴 Outside Safe Zone
  }
}

/**
 * Requests browser geolocation with fallback to mock demo location.
 * @returns {Promise<{ lat: number, lng: number, isDemo: boolean, address: string, error?: string }>}
 */
export function requestElderlyLocation() {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({
        ...DEFAULT_HOME,
        isDemo: true,
        error: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isDemo: false,
          address: 'सक्रिय जीपीएस लोकेशन (Active GPS Location)',
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        // Fallback to demo location with clear indication
        resolve({
          ...DEFAULT_HOME,
          // Offset slightly within safe radius for realistic demo: ~45m from home
          lat: DEFAULT_HOME.lat + 0.0003,
          lng: DEFAULT_HOME.lng + 0.0002,
          isDemo: true,
          error: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      }
    );
  });
}
