import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './components/PrivateRoutes.jsx'

import Navbar from './components/Navbar'
import Home from './components/Home'
import Signin from './components/Signin'
import Signup from './components/Signup'

import store from './redux/store.js'

import './App.css';

function App() {
  var [str, setStr] = useState(store.getState())

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='*' element={<Signin />}></Route>
          <Route path='/signup' element={<Signup />}></Route>

          <Route element={<PrivateRoutes />}>
            <Route path='/home' element={<Home />}></Route>
          </Route>
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
