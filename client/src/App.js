import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './components/Home'
import Signin from './components/Signin'
import Signup from './components/Signup'

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='*' element={<Signin />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/home/:username' element={<Home />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
