import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Commentaire from "./Commentaire";
import db from "./db/database";

const ParcDetails = () => {
  const { id } = useParams();
  const [parcDetails, setParcDetails] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=parcs-jardins-lille-hellemmes-lomme-emprise&q=&facet=id&refine.id=${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.records.length > 0) {
          const parcRecord = data.records[0];
          const parcDetails = {
            name: parcRecord.fields.nom,
            description: parcRecord.fields.description,
            id: parcRecord.fields.id,
            openingHoursSummer: parcRecord.fields.horaires_ouverture_ete,
            openingHoursWinter: parcRecord.fields.horaires_ouverture_hiver,
            accesmetro: parcRecord.fields.acces_metro,
            adresse: parcRecord.fields.adresse
          };

          setParcDetails(parcDetails);

          fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(parcDetails.name)}`)
            .then(response => response.json())
            .then(data => {
              const description = data.extract;
              setParcDetails(prevDetails => ({
                ...prevDetails,
                description
              }));
            })
            .catch(error => {
              console.error('Une erreur s\'est produite lors de la récupération de la description :', error);
            });
        } else {
          console.log(`No parc found with ID ${id}`);
        }
      })
      .catch(error => {
        console.error(error);
      });

    db.getComments((error, comments) => {
      if (error) {
        console.error('Erreur lors de la récupération des commentaires :', error);
      } else {
        const parcComments = comments.filter(comment => comment.parcId === id);
        setComments(parcComments);
      }
    });
    
  }, [id]);

  if (!parcDetails) {
    return <div>Loading...</div>;
  }

  // Condition pour afficher l'ouverture permanente une seule fois
  let openingHoursSummerText = parcDetails.openingHoursSummer ? parcDetails.openingHoursSummer : "Ouverture permanente";
  let openingHoursWinterText = parcDetails.openingHoursWinter ? parcDetails.openingHoursWinter : "Ouverture permanente";

  if (openingHoursSummerText === "Ouverture permanente" && openingHoursWinterText === "Ouverture permanente") {
    openingHoursSummerText = "Ouverture permanente";
    openingHoursWinterText = "";
  }

  const imageFileName = `${parcDetails.id}.jpg`;
  const imagePath = `/images/${imageFileName}`;

  return (
    <div>
      <Header />
      <div>
        <h1>{parcDetails.name}</h1>
        <img
          src={process.env.PUBLIC_URL + imagePath}
          alt={parcDetails.name}
          className="parc-image"
        />
        <div className="parc-information">
          <p>{parcDetails.description}</p>
          <p>Horaires d'ouverture : {openingHoursSummerText} {openingHoursWinterText}</p>
          <p>{parcDetails.name} est à l'adresse : {parcDetails.adresse}</p>
          <p>Les accés métro : {parcDetails.accesmetro}</p>
        </div>

        <Commentaire parcId={id} comments={comments} />
      </div>
    </div>
  );
}

export default ParcDetails;
