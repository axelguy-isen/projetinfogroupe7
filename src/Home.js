import React from "react";
import Header from "./Header";
import HomeImg from "./images/img4.jpg";


const Home = () => {
  return (
    <div>
        <Header />
        <div className="container">
        <div className="container2">
            <div className="highlight-box">
            <h1>Lille</h1>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <img src={HomeImg} className="image-resize" alt="Image 4" />
            </div>
            <div className="highlight-box">
            <p>
                Aujourd'hui centre culturel et ville universitaire animée, elle fut autrefois une importante
                plateforme marchande des Flandres françaises, et de nombreuses influences flamandes demeurent encore. Le
                centre historique, le Vieux Lille, se caractérise par ses maisons de ville du XVIIe siècle en briques rouges,
                ses ruelles piétonnes pavées et sa Grand'Place centrale.
            </p>
            </div>
        </div>
        <div className="carousel">
            <div className="slides">
            <div className="slide">
                <div className="review">
                <h2>Titre de l'avis</h2>
                <div className="rating">
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                </div>
                <p>Contenu de l'avis...</p>
                </div>
            </div>
            <div className="slide">
                <div className="review">
                <h2>Titre de l'avis</h2>
                <div className="rating">
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                </div>
                <p>Contenu de l'avis...</p>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Home;
