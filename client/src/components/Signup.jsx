import React from 'react'
import { Link } from 'react-router-dom'

import '../css/Signup.css'

export default function Signup(props) {
    return (
        <div className='Signup'>
            <div className='flexRowContainer'>
                <div>
                    <span className='signupBigEchoTitle'>Echo</span>
                </div>
                <div className='verticalLine'></div>
                <div className='sigupPageInputsDiv'>
                    <div className='signupTitles'>
                        <span className='signupPrimaryTitle'>Join the fun!</span>
                        <span className='signupSecondaryTitle'>Sign up for an ECHO account</span>
                    </div>
                    <div className='signupContainer'>
                        <input className='defaultUserInfoInput' type='text' placeholder='Username'></input>
                        <input className='defaultUserInfoInput' type='text' placeholder='Email'></input>
                        <div className='dobInputsContainer'>
                        <span className='dobInputsSpan'>Date of birth</span>
                            <input className='userDobInput' type='text' placeholder='Day'></input>
                            <input className='userDobInput' type='text' placeholder='Month'></input>
                            <input className='userDobInput' type='text' placeholder='Year'></input>
                        </div>
                        <button className='generalUseWideButton'>Sign up</button>
                    </div>
                    <div className='signinRedirectionDiv'>
                        <span className='signInRedirectionSpan'>Already have an account?</span>
                        <Link to={'/'}><button className='generalUseWideButtonInLink'>Sign in</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}