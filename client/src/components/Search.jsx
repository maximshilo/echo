import React from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import store from '../redux/store'
import { updateCurrentUserFromDatabase, signinUser } from '../redux/actions.js'

import Navbar from './Navbar'

import '../css/Search.css'

export default function Search(props) {
    const [params] = useSearchParams()
    const [results, setResults] = useState([])

    const currentUser = store.getState().userReducer.currentUser

    const [original, setOriginal] = useState('')

    const generateSearchStrings = () => {
        let original = params.get('search')
        let searchStrings = [original]

        for (let i = 0; i + 2 < original.length; i++) {
            searchStrings.push(original.substring(i, i + 3))
        }

        return searchStrings
    }

    const loadResults = async () => {
        let searchStrings = generateSearchStrings()
        let results = await fetch('/db/getAllUsers').then(res => res.json())

        results = results.filter(res => {
            let temp = false
            searchStrings.forEach(str => {
                if (res.username.includes(str)) {
                    temp = true
                }
            })

            if (temp) {
                return res
            }
        })
        setResults(results)
    }



    const displayResults = () => {
        return results.map(res => {
            return <SearchResult res={res} following={currentUser.following}/>
        })
    }

    useEffect(() => {
        setOriginal(params.get('search'))
        loadResults()
    }, [params])

    return (
        <div className='Search'>
            <Navbar user={store.getState().userReducer.currentUser} />
            <div className='searchContainer'>
                {displayResults()}
            </div>
        </div>
    )
}

function SearchResult(props) {
    let res = props.res
    const currentUser = store.getState().userReducer.currentUser

    const [followFlag, setFollowFlag] = useState(currentUser.following.findIndex(id => id == res._id) == -1)

    const displayFollowButton = (displayedUserID) => {
        if (followFlag) {
            return <button className='generalUseWideButton' onClick={async () => {
                await fetch('/db/followUser', {
                    method : 'PUT',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        subjectUserID : displayedUserID,
                        objectUserID : currentUser.id
                    })
                }).then((res) => {
                    setFollowFlag(false)
                    return res.json()
                }).then(async (json) => {
                    console.log(json)
                    await updateCurrentUserFromDatabase(currentUser).then(action => store.dispatch(action))
                })
                
                
            }}>Follow</button>
        } else {
            return <button onClick={async () => {
                await fetch('/db/unfollowUser', {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        subjectUserID : displayedUserID,
                        objectUserID : currentUser.id
                    })
                })
                .then((res) => {
                    setFollowFlag(true)
                    return res.json()
                })
                .then(async (json) => {
                    store.dispatch(signinUser(json))
                })
                setFollowFlag(true)
            }}>Unfollow</button>
        }

    }

    return (
        <div className='Post'>
            <div className='row'>
                <img className='postPicture' src={`profile_pictures/p${res.profilePicture}.webp`}></img>
                <span style={{ marginLeft: '12px', fontSize: '24px' }} className='defaultHeading'>{res.username}</span>
                {displayFollowButton(res._id)}
            </div>
        </div>
    )
}