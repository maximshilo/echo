import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar () {
    return (
        <div className='Navbar'>
            <div className='navbarContainer'>
                <div className='navbarLogoContainer'>
                    <span>ECHO</span>
                </div>
                <div className='navbarButtonsContainer'>
                    <Link to='/'><button>HOME</button></Link>
                </div>
                <div className='userInteractionsContainer'>
                    <span>Hello, Guest</span>
                </div>
            </div>
        </div>
    )
}