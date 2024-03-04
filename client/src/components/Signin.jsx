import React from 'react'
import { Link } from 'react-router-dom'

import '../css/Signin.css'

export default function Signin(props) {
    return (
        <div className='Signin'>
            <div className='flexRowContainer'>
                <div>
                    <span className='signinBigEchoTitle'>Echo</span>
                </div>
                <div className='siginPageInputsDiv'>
                    <div className='signinContainer'>
                        <input className='defaultuserInfoInput' type='text' placeholder='Email'></input>
                        <input className='defaultuserInfoInput' type='password' placeholder='Password'></input>
                        <button>Log in</button>
                        <a>Recover password</a>
                    </div>
                    <div className='signupRedirectionDiv'>
                        <Link to={'/signup'}><button>Create new account</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}