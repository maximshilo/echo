import React from 'react' 
import store from '../redux/store.js'

import Navbar from './Navbar.jsx'

import '../css/Home.css'

export default function Home () {
    const currentUser = store.getState().userReducer.currentUser

    return (
        <div className='Home'>
            <Navbar user={currentUser} />
            <div className='homeContainer'>
                <div>
                    <h1>{currentUser.email}</h1>
                    <h1>{currentUser.dob}</h1>
                    <h1>{currentUser.following}</h1>
                    <h1>{currentUser.id}</h1>
                </div>
            </div>
        </div>
    )
}