import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from "./page/Home"
import Approve from "./page/Approve"
import Delete from "./page/Delete";
import Create from './page/Create';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul className="nav-links">
              <li>
                <Link to="/" className="App-link">Home</Link>
              </li>
              <li>
                <Link to="/create" className="App-link">Create</Link>
              </li>
              <li>
                <Link to="/approve" className="App-link">Approve</Link>
              </li>
              
              <li>
                <Link to="/delete" className="App-link">Delete</Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/approve" element={<Approve />} />
            <Route path="/delete" element={<Delete/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
