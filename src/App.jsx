import React, {useState,useEffect} from 'react';
import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Homes from './pages/Homes';
import Change from './pages/Change';
import {auth} from "./firebase";
import './app.scss';

function App() {
  

  return (
   <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Registration" element={<Registration/>}/>
          <Route path="/Change" element={<Change/>}/>
          <Route path="/Homes" element={<Homes/>}/>
        </Routes>
      </Router>
   </div>
  );
}

export default App
