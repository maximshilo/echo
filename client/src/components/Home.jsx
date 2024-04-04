import React from 'react'
import { useState, useEffect } from 'react'
import store from '../redux/store.js'

import Navbar from './Navbar.jsx'
import Post from './Post.jsx'

import '../css/Home.css'

export default function Home() {
    const [newPostContent, setNewPostContent] = useState('')
    const [loadPostsFlag, setLoadPostsFlag] = useState(false)
    const [posts, setPosts] = useState([])

    const currentUser = store.getState().userReducer.currentUser

    const attempPost = async () => {
        let newPost = {
            content: newPostContent,
            date: new Date(Date.now()),
            likes: [],
            username: currentUser.username,
            userID: currentUser.id,
            userPicture: currentUser.profilePicture
        }

        let res = await fetch('/db/addNewPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        }).then(res => res.json())

        setNewPostContent('')
        setLoadPostsFlag(!loadPostsFlag)
        console.log(res)
    }

    const loadPosts = async () => {
        let content = await fetch('/db/getPostsByUserId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: currentUser.id })
        }).then(res => res.json())

        console.log(content)
        setPosts(content.sort((a, b) => new Date(b.date) - new Date(a.date)))
    }

    useEffect(() => {
        loadPosts()
    }, [loadPostsFlag])


    const displayPosts = () => {
        return <div>{posts.map((post, idx) => <Post render={{loadPostsFlag, setLoadPostsFlag}} key={post._id} post={post} />)}</div>
    }

    return (
        <div className='Home'>
            <Navbar user={currentUser} />
            <div className='homeContainer'>
                <div className='homeDiv'>
                    <div className='row'>
                        <div className='col'>
                            <img className='profilePicture' src={`profile_pictures/p${currentUser.profilePicture}.webp`}></img>
                        </div>
                        <div className='col'>
                            <div className='userInfoContentDiv'>
                                <h2>Welcome,</h2>
                                <h1>{currentUser.username}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='homeDiv'>
                    <input value={newPostContent} onChange={(e) => { setNewPostContent(e.target.value) }} placeholder='share a thought'></input>
                    <button onClick={() => { attempPost() }}>Post</button>
                </div>
                <div>
                    {displayPosts()}
                </div>
            </div>
        </div>
    )
}