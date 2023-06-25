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
            openingHoursWinter: jardinRecord.fields.horaires_ouverture_hiver,
            accesmetro: jardinRecord.fields.acces_metro,
            adresse: jardinRecord.fields.adresse
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

  let openingHoursSummerText = jardinDetails.openingHoursSummer ? jardinDetails.openingHoursSummer : "Ouverture permanente";
  let openingHoursWinterText = jardinDetails.openingHoursWinter ? jardinDetails.openingHoursWinter : "Ouverture permanente";

  if (openingHoursSummerText === "Ouverture permanente" && openingHoursWinterText === "Ouverture permanente") {
    openingHoursSummerText = "Ouverture permanente";
    openingHoursWinterText = "";
  }
  const imageFileName = `${jardinDetails.id}.jpg`;
  const imagePath = `/images/${imageFileName}`;

  return (
    <div>
      <Header />
      <div>
      <h1>{jardinDetails.name}</h1>
      <img
          src={process.env.PUBLIC_URL + imagePath}
          alt={jardinDetails.name}
          className="parc-image"
        />
      <div className="parc-information">
          <p>{jardinDetails.description}</p>
          <p>Horaires d'ouverture : {openingHoursSummerText} {openingHoursWinterText}</p>
          <p>{jardinDetails.name} est à l'adresse : {jardinDetails.adresse}</p>
          <p>Les accés métro : {jardinDetails.accesmetro}</p>
        </div>

        <Commentaire jardinId={id} comments={comments} />
      </div>
    </div>
  );
}

export default JardinDetails;
