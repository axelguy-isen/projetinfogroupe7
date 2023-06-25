import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const images = require.context('./images', true); // Importation du contexte des images

const Parc = () => {
  const [parcs, setParcs] = useState([]); // État pour stocker les parcs récupérés
  const [latitude, setLatitude] = useState(null); // État pour stocker la latitude
  const [longitude, setLongitude] = useState(null); // État pour stocker la longitude

  useEffect(() => {
    document.addEventListener('deviceready', onDeviceReady); // Ajout de l'écouteur d'événement lors du montage du composant

    return () => {
      document.removeEventListener('deviceready', onDeviceReady); // Suppression de l'écouteur d'événement lors du démontage du composant
    };
  }, []);

  const onDeviceReady = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude); // Mise à jour de la latitude
        setLongitude(longitude); // Mise à jour de la longitude
        fetchParcs(latitude, longitude); // Appel de la fonction pour récupérer les parcs
      },
      (error) => {
        console.error('Erreur de géolocalisation :', error);
      },
      { enableHighAccuracy: true }
    );
  };

  const fetchParcs = (latitude, longitude) => {
    const apiUrl = `https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=parcs-jardins-lille-hellemmes-lomme-emprise&q=&rows=50&refine.sous_types=Parc`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const parcRecords = data.records || [];

        const parcList = parcRecords
          .filter((record) => !record.fields.nom.includes('Jardin')) // Filtrer les enregistrements dont le nom ne contient pas "Jardin"
          .map((record) => ({
            id: record.fields.id,
            name: record.fields.nom,
            slug: record.fields.slug,
            coordinates: {
              latitude: record.fields.latitude,
              longitude: record.fields.longitude,
            },
            imageId: record.fields.image_id,
          }));

        // Triez les parcs en fonction de leur distance par rapport à la position actuelle
        const sortedParcs = parcList.sort((parcA, parcB) => {
          const distanceA = calculateDistance(parcA.coordinates, {
            latitude,
            longitude,
          });
          const distanceB = calculateDistance(parcB.coordinates, {
            latitude,
            longitude,
          });

          return distanceA - distanceB;
        });

        setParcs(sortedParcs); // Mise à jour de la liste des parcs
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des parcs :', error);
      });
  };

  const calculateDistance = (coord1, coord2) => {
    const lat1 = coord1.latitude;
    const lon1 = coord1.longitude;
    const lat2 = coord2.latitude;
    const lon2 = coord2.longitude;

    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));

    return distance;
  };

  return (
    <div>
      <Header />
      <div>
        <h1>Les parcs dans la métropole de Lille :</h1>
        {latitude && longitude ? (
          <p></p>
        ) : (
          <p>En attente de la géolocalisation...</p>
        )}
        <ul>
          {parcs.map((parc) => (
            <li key={parc.id}>
              <Link to={`/parc/${parc.id}`}>{parc.name}</Link>
              {parc.coordinates && (
                <p></p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Parc;
