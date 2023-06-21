import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <div className="header"> 
  <nav className="navbar navbar-light bg-light">
    <div className="container">
      <Link className="nav-link" to="/">
        TourIsen
      </Link>
      <Link className="nav-link" to="/parc">Parc</Link>
      <Link className="nav-link" to="/jardin">Jardin</Link>
      <Link className="nav-link" to="/commentaire">Commentaire</Link>
      <Link className="nav-link" to="/map">Maps</Link>
    </div>
  </nav>
  </div> 
);

export default Header;
