import React, { useEffect, useState } from "react";
import Header from "./Header";

const Localisation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    document.addEventListener("deviceready", onDeviceReady);

    return () => {
      document.removeEventListener("deviceready", onDeviceReady);
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
        console.error("Erreur de géolocalisation :", error);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div>
      <Header />
      <div>
        {latitude && longitude ? (
          <div>
            <h2>Coordonnées GPS :</h2>
            <p>Latitude : {latitude}</p>
            <p>Longitude : {longitude}</p>
          </div>
        ) : (
          <p>En attente de la géolocalisation...</p>
        )}
      </div>
    </div>
  );
};

export default Localisation;
