let db;

// Fonction pour ouvrir la base de données
function openDatabase() {
  // Ouvrir la base de données "commentaireDB" avec la version 1
  const request = window.indexedDB.open('commentaireDB', 1);

  // Gérer les erreurs lors de l'ouverture de la base de données
  request.onerror = function(event) {
    console.error('Erreur lors de l\'ouverture de la base de données', event.target.error);
  };

  // Gérer les mises à niveau de la base de données
  request.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Créer la table "commentaire" si elle n'existe pas déjà
    if (!db.objectStoreNames.contains('commentaire')) {
      db.createObjectStore('commentaire', { keyPath: 'id', autoIncrement: true });
    }
  };

  // Gérer le succès de l'ouverture de la base de données
  request.onsuccess = function(event) {
    db = event.target.result;
    console.log('Base de données ouverte avec succès');
  };
}

// Fonction pour ajouter un commentaire
function addComment(comment, callback) {
  // Démarrer une transaction en mode "readwrite" sur la table "commentaire"
  const transaction = db.transaction('commentaire', 'readwrite');
  const store = transaction.objectStore('commentaire');

  // Ajouter le commentaire à l'aide de la méthode "add"
  const request = store.add(comment);

  // Gérer les erreurs lors de l'ajout du commentaire
  request.onerror = function(event) {
    console.error('Erreur lors de l\'ajout du commentaire', event.target.error);
    // Appeler la fonction de rappel avec l'erreur en tant que premier argument
    callback(event.target.error);
  };

  // Gérer le succès de l'ajout du commentaire
  request.onsuccess = function(event) {
    console.log('Commentaire ajouté avec succès');
    // Appeler la fonction de rappel sans erreur
    callback(null);
  };
}

// Fonction pour récupérer tous les commentaires
function getComments(callback) {
  // Démarrer une transaction en mode "readonly" sur la table "commentaire"
  const transaction = db.transaction('commentaire', 'readonly');
  const store = transaction.objectStore('commentaire');

  // Récupérer tous les commentaires à l'aide de la méthode "getAll"
  const request = store.getAll();

  // Gérer les erreurs lors de la récupération des commentaires
  request.onerror = function(event) {
    console.error('Erreur lors de la récupération des commentaires', event.target.error);
    // Appeler la fonction de rappel avec l'erreur en tant que premier argument et "null" comme deuxième argument
    callback(event.target.error, null);
  };

  // Gérer le succès de la récupération des commentaires
  request.onsuccess = function(event) {
    const comments = event.target.result;
    console.log('Commentaires récupérés avec succès', comments);
    // Appeler la fonction de rappel sans erreur et avec les commentaires récupérés en tant que deuxième argument
    callback(null, comments);
  };
}

// Ouvrir la base de données au chargement de la page
openDatabase();

// Exporter les fonctions addComment et getComments pour les rendre accessibles à d'autres modules
export default { addComment, getComments };
