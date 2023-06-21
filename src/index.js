import React from "react";
import ReactDOM from "react-dom";
import { createHashRouter, RouterProvider, Route } from "react-router-dom";
import './App.css';
import Header from "./Header";
import Home from "./Home";
import Parc from "./Parc";
import ParcDetails from "./ParcDetails";
import Jardin from "./Jardin";
import JardinDetails from './JardinDetails';
import Localisation from "./Localisation";
import Map from "./Map";
import Commentaire from "./Commentaire";

// Composant pour la page des produits


// Configuration du routeur
const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/parc",
    element: <Parc />,
  },
  {
    path: "/parc/:id",
    element: <ParcDetails />,
  },
  {
    path: "/jardin",
    element: <Jardin />,
  },
  {
    path: "/jardin/:id",
    element: <JardinDetails />,
  },
  {
    path: "/localisation",
    element: <Localisation />,
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    path: "/commentaire",
    element: <Commentaire />,
  },
]);

// Rendu de l'application
ReactDOM.render(
  <RouterProvider router={router}>
    <div>
      <Route path="/" element={<Home />} />
      <Route path="/parc" element={<Parc />} />
      <Route path="/parc/:id" element={<ParcDetails />} />
      <Route path="/jardin" element={<Jardin />} />
      <Route path="/jardin/:id" element={<JardinDetails />} />
      <Route path="/localisation" element={<Localisation />} />
      <Route path="/map" element={<Map />} />
      <Route path="/commentaire" element={<Commentaire />} />
    </div>
  </RouterProvider>,
  document.getElementById("root")
);
