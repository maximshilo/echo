import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import '../css/Signin.css'

const numbers = '1234567890'
const letters = 'abcdefghijklmnopqrstuvwxyz'
const symbols = '!@#$%^&*'

export default function Signin(props) {
    const navigation = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errors, setErrors] = useState(['', ''])

    const signin = async () => {
        let user = {
            email,
            password
        }

        let res = await fetch('/db/signinUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        return res
    }

    const validatePassword = () => {
        let p = password
        let error = ''
        if (p.length > 7) {
            if (p.split('').filter(c => numbers.includes(c)) < 1) {
                error += 'Password must contain a number\n'
            }

            if (p.split('').filter(c => letters.includes(c)) < 1) {
                error += 'Password must contain a letter\n'
            }

            if (p.split('').filter(c => symbols.includes(c)) < 1) {
                error += 'Password must contain one of the following ' + symbols.split('').toString() + '\n'
            }
        } else {
            error += 'Password must contain at least 8 characters.\n'
        }

        return error
    }

    const validateEmail = () => {
        let e = email
        let error = ''

        if (e.length > 0) {
            if (e.includes('@')) {
                if (e.split('@')[1].includes('.')) {
                    if (!e.split('@')[1].split('.')[1].includes('co')) {
                        error += 'Email must include a valid @ address ending.\n'
                    }

                    if (e.split('@')[1].split('.')[0].length < 1) {
                        error += 'Email must include a valid @ address prefix.\n'
                    }

                } else {
                    error += 'Email must include an . after the @.\n'
                }

                if (e.split('@')[0].length < 1) {
                    error += 'Email must include a valid local-part.\n'
                }
            }
            else {
                error += 'Email must include an @.\n'
            }
        } else {
            error += 'Must input an Email.\n'
        }

        return error
    }

    const vlaidateInfo = () => {
        let errors = []

        errors.push(validateEmail())
        errors.push(validatePassword())

        setErrors(errors)
        return errors.filter(e => e.length > 0).length < 1
    }

    const attemptSignin = async () => {
        let infoValidity = await vlaidateInfo()

        if (infoValidity) {
            await signin().then((res) => { return res.json() })
                .then((json) => {
                    if (json.status == 500) {
                        let temp = errors
                        temp[0] = 'Invalid user info.\n'
                        temp[1] = ''
                        setErrors(temp)
                    } else {
                        navigation(`/home/${json.info.username}`)
                    }
                })
        }
    }

    const displayError = (id) => {
        return (
            <div className='error'>
                <span>
                    {errors[id]}
                </span>
            </div>
        )
    }

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
                        <input className='defaultUserInfoInput' type='text' onChange={(e) => {
                            let v = e.target.value
                            setEmail(v)
                        }} placeholder='Email'></input>
                        {errors[0].length > 0 ? displayError(0) : <></>}
                        <input className='defaultUserInfoInput' type='password' onChange={(e) => {
                            let v = e.target.value
                            setPassword(v)
                        }} placeholder='Password'></input>
                        {errors[1].length > 0 ? displayError(1) : <></>}
                        <button onClick={() => { attemptSignin() }} className='generalUseWideButton'>Sign in</button>
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