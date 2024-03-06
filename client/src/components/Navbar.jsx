import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import store from '../redux/store'
import { signout } from '../redux/actions'

import '../css/Navbar.css'

export default function Navbar (props) {
    const navigation = useNavigate()

    let user = props.user
    
    return (
        <div className='Navbar'>
            <div className='navbarContainer'>
                <span>Welcome, {user.username}</span>
                <button onClick={() => {
                    store.dispatch(signout())
                    navigation('/')
                    }}>
                    Sign out
                </button>
            </div>
        </div>
    )
}