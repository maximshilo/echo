import React from 'react'
import { useState } from 'react'
import { Link, useNavigate, createSearchParams } from 'react-router-dom'

import store from '../redux/store'
import { signout } from '../redux/actions'

import '../css/Navbar.css'

export default function Navbar(props) {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    let user = props.user

    return (
        <div className='Navbar'>
            <div className='navbarContainer'>
                <span>Welcome,
                    <Link to={'/home'}> {user.username}</Link>
                </span>
                <div>
                    <input
                        type='text'
                        style={
                            {
                                textIndent: '0px',
                                textAlign: 'left',
                                padding: '3px 12px',
                                margin: '0 6px'
                            }
                        }
                        placeholder='serach for a user'
                        onChange={(e) => {
                            setSearch(e.target.value) 
                            }}
                        
                        maxLength={15}>
                    </input>
                    <button
                        onClick={() => {
                            navigate({
                                pathname : '/search',
                                search : createSearchParams({
                                    search
                                }).toString()
                            })
                        }}
                    >Search</button>
                </div>
                <button onClick={() => {
                    store.dispatch(signout())
                    navigate('/')
                }}>
                    Sign out
                </button>
            </div>
        </div>
    )
}