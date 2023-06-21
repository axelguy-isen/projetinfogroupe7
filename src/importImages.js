const importAllImages = () => {
    const images = {};
  
    function importImage(imagePath) {
      const imageKey = imagePath.replace("./", "").replace(/\.(png|jpg|jpeg|gif|svg)$/, "");
      images[imageKey] = require(`${imagePath}`).default;
    }
  
    // Importez ici toutes vos images en utilisant la fonction importImage()
    importImage("./images/1.jpg");
    
    // ...
  
    return images;
  };
  
  export default importAllImages;
  