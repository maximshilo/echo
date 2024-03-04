import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import '../css/Signup.css'

const numbers = '1234567890'
const letters = 'abcdefghijklmnopqrstuvwxyz'
const symblos = '!@#$%^&*'

export default function Signup(props) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [dob, setDob] = useState([0, 0, 0])

    const [errors, setErrors] = useState(['asdasd', '', '', ''])

    const updateDateOfBirth = (v, id) => {
        let temp = dob
        temp[id] = v
        setDob([...temp])
    }

    const signup = async () => {
        let user = {
            username,
            email,
            password,
            dob : new Date(dob[2], dob[1], dob[0])
        }

        let res = await fetch('/db/signupNewUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        return res
    }

    const validateDoB = () => {
        let d = dob
        let error = ''

        let day = d[0]
        let month = d[1]
        let year = d[2]

        if (day.toString().split('').filter(c => numbers.includes(c)).length != day.toString().split('').length) {
            error += 'Only acceptable date format: 1/2/2000'
        } else if (month.toString().split('').filter(c => numbers.includes(c)).length != month.toString().split('').length) {
            error += 'Only acceptable date format: 1/2/2000'
        } else if (year.toString().split('').filter(c => numbers.includes(c)).length != year.toString().split('').length) {
            error += 'Only acceptable date format: 1/1/2000'
        }

        if (error.length < 1 && dob[1] > 0) {
            dob[1] = month - 1
        }

        return error
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

            if (p.split('').filter(c => symblos.includes(c)) < 1) {
                error += 'Password must contain one of the following ' + symblos.split('').toString() + '\n'
            }
        } else {
            error += 'Password must contain at least 8 characters.\n'
        }

        if (p != confirmPassword) {
            error += 'Passwords must match!\n'
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
                error += 'Email must include a @.\n'
            }
        } else {
            error += 'Must input an Email.\n'
        }

        return error
    }
    const validateUsername = () => {
        let u = username
        let error = ''
        if (username.length > 5) {
            // additional validations?
        } else {
            error += 'Username must contain at least 6 characters.\n'
        }

        return error
    }
    const validateInfo = () => {
        let errors = []

        errors.push(validateUsername())
        errors.push(validateEmail())
        errors.push(validatePassword())
        errors.push(validateDoB())

        setErrors(errors)
        return errors.filter(e => e.length > 0).length < 1
    }

    const attemptSignup = async () => {
        let infoValidity = await validateInfo()

        if (infoValidity) {
            await signup().then((res) => { return res.json() })
                .then((json) => console.log(json))
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
                        <input className='defaultUserInfoInput' type='text' onChange={(e) => {
                            let v = e.target.value
                            setUsername(v)
                        }} placeholder='Username'></input>
                        {errors[0].length > 0 ? displayError(0) : <></>}
                        <input className='defaultUserInfoInput' type='text' onChange={(e) => {
                            let v = e.target.value
                            setEmail(v)
                        }} placeholder='Email'></input>
                        {errors[1].length > 0 ? displayError(1) : <></>}
                        <input className='defaultUserInfoInput' type='password' onChange={(e) => {
                            let v = e.target.value
                            setPassword(v)
                        }} placeholder='Password'></input>
                        {errors[2].length > 0 ? displayError(2) : <></>}
                        <input className='defaultUserInfoInput' type='password' onChange={(e) => {
                            let v = e.target.value
                            setConfirmPassword(v)
                        }} placeholder='Confirm password'></input>
                        {errors[3].length > 0 ? displayError(3) : <></>}
                        <div className='dobInputsContainer'>
                            <span className='dobInputsSpan'>Date of birth</span>
                            <input className='userDobInput' type='text' onChange={(e) => {
                                let v = e.target.value
                                updateDateOfBirth(v, 0)
                            }} placeholder='Day'></input>
                            <input className='userDobInput' type='text' onChange={(e) => {
                                let v = e.target.value
                                updateDateOfBirth(v, 1)
                            }} placeholder='Month'></input>
                            <input className='userDobInput' type='text' onChange={(e) => {
                                let v = e.target.value
                                updateDateOfBirth(v, 2)
                            }} placeholder='Year'></input>
                        </div>
                        <button className='generalUseWideButton' onClick={() => { attemptSignup() }}>Sign up</button>
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