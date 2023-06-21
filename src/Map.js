import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Header from './Header';
import Parc from './Parc';

// Configuration de l'icône personnalisée pour le marqueur
const customMarkerIcon = L.icon({
  iconUrl: 'marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [showHotels, setShowHotels] = useState(false);

  useEffect(() => {
    document.addEventListener('deviceready', onDeviceReady);

    return () => {
      document.removeEventListener('deviceready', onDeviceReady);
    };
  }, []);

  const onDeviceReady = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        console.error('Erreur de géolocalisation :', error);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div>
      <Header />
      <div>
        <h1>Map</h1>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showRestaurants}
              onChange={(e) => setShowRestaurants(e.target.checked)}
            />
            Restaurants
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showHotels}
              onChange={(e) => setShowHotels(e.target.checked)}
            />
            Hôtels
          </label>
        </div>
        {latitude && longitude ? (
          <MapContainer
            center={[latitude, longitude]}
            zoom={14}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]} icon={customMarkerIcon}>
              <Popup>
                Latitude: {latitude}, Longitude: {longitude}
              </Popup>
            </Marker>
            {showRestaurants && (
              <Marker position={[latitude + 0.01, longitude]}>
                <Popup>Restaurant Marker</Popup>
              </Marker>
            )}
            {showHotels && (
              <Marker position={[latitude - 0.01, longitude]}>
                <Popup>Hotel Marker</Popup>
              </Marker>
            )}
          </MapContainer>
        ) : (
          <p>En attente de la géolocalisation...</p>
        )}
      </div>
    </div>
  );
};

export default Map;
