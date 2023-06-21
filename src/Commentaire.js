import React, { useState, useEffect } from 'react';
import db from './db/database';

const Commentaire = ({ parcId, jardinId }) => {
  const [utilisateur, setUtilisateur] = useState('');
  const [message, setMessage] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadComments();
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
        setComments(filteredComments);
      }
    });
  };

  const handleImageChange = () => {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.file) {
      // Utilisez le plugin Cordova pour sélectionner une image
      window.cordova.plugins.file.openPicker(
        (imageUri) => {
          setImageUri(imageUri);
        },
        (error) => {
          console.error('Erreur lors de la sélection de l\'image :', error);
        },
        { type: 'image/*' }
      );
    } else {
      console.warn('Le plugin Cordova File n\'est pas disponible. La sélection d\'image ne fonctionnera pas dans cet environnement.');
    }
  };

  const handleCommentChange = (event) => {
    setMessage(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    const newComment = {
      parcId: parcId || null,
      jardinId: jardinId || null,
      utilisateur: utilisateur,
      message: message,
      imageUri: imageUri || null,
    };

    db.addComment(newComment, (error) => {
      if (error) {
        console.error('Erreur lors de l\'ajout du commentaire :', error);
      } else {
        setUtilisateur('');
        setMessage('');
        setImageUri('');
        loadComments();
      }
    });
  };

  return (
    <div className="commentaire-container">
      <h1>Ajouter un commentaire</h1>
      <form onSubmit={handleCommentSubmit}>
        <input type="text" value={utilisateur} onChange={(e) => setUtilisateur(e.target.value)} placeholder="Utilisateur" />
        <textarea value={message} onChange={handleCommentChange} placeholder="Message" />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Ajouter</button>
      </form>

      <h2>Commentaires</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <div>{comment.utilisateur}: {comment.message}</div>
            {comment.imageUri && <img src={comment.imageUri} alt="Comment Image" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Commentaire;
