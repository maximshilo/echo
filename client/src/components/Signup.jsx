import React from 'react'
import { Link } from 'react-router-dom'

export default function Signup (props) {
    return (
        <div className='Signup'>
            <div className='signupContainer'>
                <input className='defaultuserInfoInput' type='text' placeholder='Username'></input>
                <input className='defaultuserInfoInput' type='text' placeholder='Email'></input>
                <div className='dobInputsContainer'>
                    <input type='text' placeholder='Day'></input>
                    <input type='text' placeholder='Month'></input>
                    <input type='text' placeholder='Year'></input>
                </div>
                <button>Sign up</button>
            </div>
            <div className='signinRedirectionDiv'>
                <span>Already have an account?</span>
                <Link to={'/'}><button>Sign in</button></Link>
            </div>
        </div>
    )
}