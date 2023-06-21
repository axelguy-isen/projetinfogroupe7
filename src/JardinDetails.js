import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Commentaire from "./Commentaire";
import db from "./db/database";

const JardinDetails = () => {
  const { id } = useParams();
  const [jardinDetails, setJardinDetails] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=parcs-jardins-lille-hellemmes-lomme-emprise&q=&facet=id&refine.id=${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.records.length > 0) {
          const jardinRecord = data.records[0];
          const jardinDetails = {
            name: jardinRecord.fields.nom,
            description: jardinRecord.fields.description,
            id: jardinRecord.fields.id,
            openingHoursSummer: jardinRecord.fields.horaires_ouverture_ete,
            openingHoursWinter: jardinRecord.fields.horaires_ouverture_hiver
          };
          setJardinDetails(jardinDetails);

          fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(jardinDetails.name)}`)
            .then(response => response.json())
            .then(data => {
              const description = data.extract;
              setJardinDetails(prevDetails => ({
                ...prevDetails,
                description
              }));
            })
            .catch(error => {
              console.error('Une erreur s\'est produite lors de la récupération de la description :', error);
            });
        } else {
          console.log(`No jardin found with ID ${id}`);
        }
      })
      .catch(error => {
        console.error(error);
      });

    // Récupérer les commentaires spécifiques au jardin
    db.getComments((error, comments) => {
      if (error) {
        console.error('Erreur lors de la récupération des commentaires :', error);
      } else {
        const jardinComments = comments.filter(comment => comment.jardinId === id);
        setComments(jardinComments);
      }
    });
    
  }, [id]);

  if (!jardinDetails) {
    return <div>Loading...</div>;
  }

  const openingHoursSummerText = jardinDetails.openingHoursSummer ? jardinDetails.openingHoursSummer : "Ouverture permanente";
  const openingHoursWinterText = jardinDetails.openingHoursWinter ? jardinDetails.openingHoursWinter : "Ouverture permanente";

  return (
    <div>
      <Header />
      <div>
        <h1>{jardinDetails.name}</h1>
        <p>{jardinDetails.description}</p>
        <p>Horaires d'ouverture : {openingHoursSummerText} ou {openingHoursWinterText}</p>
        <img
          alt={jardinDetails.name}
          className="jardin-image"
        />

        {/* Ajouter le composant Commentaire */}
        <Commentaire jardinId={id} comments={comments} />
      </div>
    </div>
  );
}

export default JardinDetails;
