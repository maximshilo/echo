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
                <div className='verticalLine'></div>
                <div className='siginPageInputsDiv'>
                    <div className='signinTitles'>
                        <span className='signinPrimaryTitle'>Jump in!</span>
                        <span className='signinSecondaryTitle'>Sign in with an existing ECHO account</span>
                    </div>
                    <div className='signinContainer'>
                        <input className='defaultUserInfoInput' type='text' placeholder='Email'></input>
                        <input className='defaultUserInfoInput' type='password' placeholder='Password'></input>
                        <button className='generalUseWideButton'>Log in</button>
                        <a href='#'>Recover password</a>
                    </div>
                    <div className='signupRedirectionDiv'>
                        <Link to={'/signup'}><button className='generalUseWideButtonInLink'>Create new account</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}