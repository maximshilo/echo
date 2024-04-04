import React from 'react'
import { useState, useEffect} from 'react'
import { useSearchParams  } from 'react-router-dom'

import store from '../redux/store'
import Navbar from './Navbar'

import '../css/Search.css'

export default function Search (props) {
    const [params] = useSearchParams()
    const [results, setResults] = useState([])

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
                if (res.username.includes(str)){
                    temp = true
                }
            })

            if (temp) {
                return res
            }
        })
        setResults(results)
    }

    const displayFollowButton = () => { return <button>Follow</button>}

    const displayResults = () => {
        return results.map(res => {
            return (
                <div className='Post'>
                    <div className='row'>
                        <img className='postPicture' src={`profile_pictures/p${res.profilePicture}.webp`}></img>
                        <span style={{ marginLeft : '12px', fontSize:'24px'}} className='defaultHeading'>{res.username}</span>
                        { displayFollowButton() }
                    </div>
                </div>
            )
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
                { displayResults() }
            </div>
        </div>
    )
}