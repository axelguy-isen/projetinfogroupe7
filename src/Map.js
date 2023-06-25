// Import des modules nécessaires
import React, { useEffect, useState } from 'react';
import Header from './Header';

// Définition du composant Map
const Map = () => {
  // Déclaration des états latitude et longitude
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Effet de chargement du composant
  useEffect(() => {
    // Ajout d'un écouteur d'événement pour deviceready
    document.addEventListener('deviceready', onDeviceReady);

    // Nettoyage de l'écouteur d'événement lorsque le composant est démonté
    return () => {
      document.removeEventListener('deviceready', onDeviceReady);
    };
  }, []);

  // Fonction appelée lorsque l'appareil est prêt
  const onDeviceReady = () => {
    // Récupération de la géolocalisation actuelle
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        loadMap(latitude, longitude);
      },
      (error) => {
        console.error('Erreur de géolocalisation :', error);
      },
      { enableHighAccuracy: true }
    );
  };

  // Fonction de chargement de la carte
  const loadMap = (latitude, longitude) => {
    // Création d'un élément script pour charger l'API Google Maps
    const googleMapsScript = document.createElement('script');
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=VOTRE_CLE_API&libraries=places`; // Remplacez VOTRE_CLE_API par votre clé API Google Maps
    window.document.body.appendChild(googleMapsScript);

    // Écouteur d'événement pour le chargement de l'API Google Maps
    googleMapsScript.addEventListener('load', () => {
      // Initialisation de la carte
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
      });

      // Ajout d'un marqueur à la position de la géolocalisation
      const marker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Ma position',
      });
    });
  };

  // Rendu du composant
  return (
    <div>
      <Header />
      <div>
        <h1>Map</h1>
        {latitude && longitude ? (
          <div id="map" style={{ height: '500px', width: '100%' }}></div>
        ) : (
          <p>En attente de la géolocalisation...</p>
        )}
      </div>
    </div>
  );
};

// Export du composant Map
export default Map;
