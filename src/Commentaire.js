import React, { useState, useEffect } from 'react';
import db from './db/database';

const Commentaire = ({ parcId, jardinId }) => {
  const [utilisateur, setUtilisateur] = useState(''); // État pour stocker le nom d'utilisateur saisi
  const [message, setMessage] = useState(''); // État pour stocker le message saisi
  const [imageFile, setImageFile] = useState(null); // État pour stocker le fichier d'image sélectionné
  const [imageUri, setImageUri] = useState(''); // État pour stocker l'URI de l'image convertie en base64

  const [comments, setComments] = useState([]); // État pour stocker les commentaires

  useEffect(() => {
    loadComments(); // Charger les commentaires au montage du composant et lorsque l'ID du parc ou du jardin change
  }, [parcId, jardinId]);

  const loadComments = () => {
    db.getComments((error, comments) => {
      if (error) {
        console.error('Erreur lors du chargement des commentaires :', error);
      } else {
        let filteredComments = [];
        if (parcId) {
          filteredComments = comments.filter(comment => comment.parcId === parcId);
        } else if (jardinId) {
          filteredComments = comments.filter(comment => comment.jardinId === jardinId);
        }
        setComments(filteredComments); // Mettre à jour les commentaires filtrés
      }
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Mettre à jour le fichier d'image sélectionné
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUri(reader.result); // Mettre à jour l'URI de l'image convertie en base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommentChange = (event) => {
    setMessage(event.target.value); // Mettre à jour le message saisi
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    const newComment = {
      parcId: parcId || null,
      jardinId: jardinId || null,
      utilisateur: utilisateur || '',
      message: message || '',
      imageUri: imageUri || null,
    };

    db.addComment(newComment, (error) => {
      if (error) {
        console.error('Erreur lors de l\'ajout du commentaire :', error);
      } else {
        setUtilisateur('');
        setMessage('');
        setImageFile(null);
        setImageUri('');
        loadComments(); // Recharger les commentaires après l'ajout du nouveau commentaire
      }
    });
  };

  const renderImage = (imageUri) => {
    return <img src={imageUri} alt="Selected Image" />;
  };

  return (
    <div className="commentaire-container">
      <h1>Ajouter un commentaire</h1>
      <form onSubmit={handleCommentSubmit}>
        <input type="text" value={utilisateur} onChange={(e) => setUtilisateur(e.target.value)} placeholder="Utilisateur" />
        <textarea value={message} onChange={handleCommentChange} placeholder="Message" />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imageUri && renderImage(imageUri)}
        <button type="submit">Ajouter</button>
      </form>

      <h2>Commentaires</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <div>{comment.utilisateur}: {comment.message}</div>
            {comment.imageUri && renderImage(comment.imageUri)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Commentaire;
