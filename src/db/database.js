let db;

function openDatabase() {
  const request = window.indexedDB.open('commentaireDB', 1);

  request.onerror = function(event) {
    console.error('Erreur lors de l\'ouverture de la base de données', event.target.error);
  };

  request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Créer la table "commentaire" si elle n'existe pas déjà
    if (!db.objectStoreNames.contains('commentaire')) {
      db.createObjectStore('commentaire', { keyPath: 'id', autoIncrement: true });
    }
  };

  request.onsuccess = function(event) {
    db = event.target.result;
    console.log('Base de données ouverte avec succès');
  };
}

function addComment(comment, callback) {
  const transaction = db.transaction('commentaire', 'readwrite');
  const store = transaction.objectStore('commentaire');
  
  const request = store.add(comment);

  request.onerror = function(event) {
    console.error('Erreur lors de l\'ajout du commentaire', event.target.error);
    callback(event.target.error);
  };

  request.onsuccess = function(event) {
    console.log('Commentaire ajouté avec succès');
    callback(null);
  };
}

function getComments(callback) {
  const transaction = db.transaction('commentaire', 'readonly');
  const store = transaction.objectStore('commentaire');
  const request = store.getAll();

  request.onerror = function(event) {
    console.error('Erreur lors de la récupération des commentaires', event.target.error);
    callback(event.target.error, null);
  };

  request.onsuccess = function(event) {
    const comments = event.target.result;
    console.log('Commentaires récupérés avec succès', comments);
    callback(null, comments);
  };
}

// Ouvrir la base de données au chargement de la page
openDatabase();

export default { addComment, getComments };
