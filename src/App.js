import React from 'react';
import { HashRouter, Link, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <HashRouter>
      <div>
        <header className="header">
          <nav className="navbar navbar-light bg-light">
            <div className="container">
              <Link className="navbar-brand mr-4 pr-2" to="/home">
                TourIsen
              </Link>
              <Link className="nav-link" to="/parc">Parc</Link>
              <Link className="nav-link" to="/jardin">Jardin</Link>
              <Link className="nav-link" to="/hotels">Hotels</Link>
              <Link className="nav-link" to="/restaurants">Restaurants</Link>
            </div>
          </nav>
        </header>

      </div>
    </HashRouter>
            
  );
}

export default App;
