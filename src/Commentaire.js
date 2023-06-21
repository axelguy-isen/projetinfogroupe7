import React, { useState, useEffect } from 'react';
import db from './db/database';

const Commentaire = ({ parcId, jardinId }) => {
  const [utilisateur, setUtilisateur] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      window.resolveLocalFileSystemURL(file, function(fileEntry) {
        fileEntry.file(function(file) {
          const reader = new FileReader();
          reader.onloadend = function() {
            const imageUri = this.result;
            setImageFile(file);
            setImageUri(imageUri);
          };
          reader.readAsDataURL(file);
        });
      });
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
        setImageFile(null);
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
        {imageUri && <img src={imageUri} alt="Selected Image" />}
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
