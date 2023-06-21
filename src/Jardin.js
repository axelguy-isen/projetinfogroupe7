import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const Jardin = () => {
  const [jardins, setJardins] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

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
        fetchJardins(latitude, longitude);
      },
      (error) => {
        console.error('Erreur de géolocalisation :', error);
      },
      { enableHighAccuracy: true }
    );
  };

  const fetchJardins = (latitude, longitude) => {
    const apiUrl = `https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=parcs-jardins-lille-hellemmes-lomme-emprise&q=&rows=50&refine.sous_types=Jardin+public`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const jardinRecords = data.records || [];

        const jardinList = jardinRecords.map((record) => ({
          id: record.fields.id,
          name: record.fields.nom,
          slug: record.fields.slug,
          coordinates: {
            latitude: record.fields.latitude,
            longitude: record.fields.longitude,
          },
        }));

        // Triez les jardins en fonction de leur distance par rapport à la position actuelle
        const sortedJardins = jardinList.sort((jardinA, jardinB) => {
          const distanceA = calculateDistance(jardinA.coordinates, {
            latitude,
            longitude,
          });
          const distanceB = calculateDistance(jardinB.coordinates, {
            latitude,
            longitude,
          });

          return distanceA - distanceB;
        });

        setJardins(sortedJardins);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des jardins :', error);
      });
  };

  const calculateDistance = (coord1, coord2) => {
    const lat1 = coord1.latitude;
    const lon1 = coord1.longitude;
    const lat2 = coord2.latitude;
    const lon2 = coord2.longitude;

    // Formule de distance euclidienne entre deux coordonnées
    const distance = Math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2);

    return distance;
  };

  return (
    <div>
      <Header />
      <div>
        <h1>Les jardins dans la métropole de Lille :</h1>
        {latitude && longitude ? (
          <p>
            Coordonnées GPS : Latitude {latitude}, Longitude {longitude}
          </p>
        ) : (
          <p>En attente de la géolocalisation...</p>
        )}
        <ul>
          {jardins.map((jardin) => (
            <li key={jardin.id}>
              <Link to={`/jardin/${jardin.id}`}>{jardin.name}</Link>
              <p>
                Coordonnées du jardin : Latitude {jardin.coordinates.latitude}, Longitude {jardin.coordinates.longitude}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Jardin;
