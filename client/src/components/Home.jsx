import React from 'react' 
import { useState, useEffect} from 'react'
import store from '../redux/store.js'

import Navbar from './Navbar.jsx'

import '../css/Home.css'

export default function Home () {
    const [newPostContent, setNewPostContent] = useState('')
    const [loadPostsFlag, setLoadPostsFlag] = useState(false)
    const [posts, setPosts] = useState([])

    const currentUser = store.getState().userReducer.currentUser

    const attempPost = async () => {
        let newPost = {
            content : newPostContent,
            date : new Date(Date.now()),
            likes : [],
            username : currentUser.username,
            userID : currentUser.id
        }

        let res = await fetch('/db/addNewPost', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(newPost)
        }).then(res => res.json())

        setNewPostContent('')
        setLoadPostsFlag(!loadPostsFlag)
        console.log(res)
    }

    const loadPosts = async () => {
        let content = await fetch('/db/getPostsByUserId', {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ id : currentUser.id })
        }).then(res => res.json())

        console.log(content)
        setPosts(content)
    }

    useEffect(() => {
        loadPosts()
    }, [loadPostsFlag])


    const displayPosts = () => {
        return posts.reverse().map(post => <div>{post.content}</div>)
    }
    
    return (
        <div className='Home'>
            <Navbar user={currentUser} />
            <div className='homeContainer'>
                <div>
                    <h1>{currentUser.email}</h1>
                    <h1>{new Date(currentUser.dob).toLocaleDateString()}</h1>
                    <h1>{currentUser.following}</h1>
                    <h1>{currentUser.id}</h1>
                </div>
                <div>
                    <input value={newPostContent} onChange={(e) => { setNewPostContent(e.target.value) }} placeholder='share a thought'></input>
                    <button onClick={() => { attempPost() }}>Post</button>
                </div>
                <div>
                { displayPosts() }
                </div>
            </div>
        </div>
    )
}