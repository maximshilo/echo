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

    const [currentUser, setCurrentUser] = useState(store.getState().userReducer.currentUser)
    console.log(currentUser)

    const postSuggestions = [
        String.raw`Wow, day made! 🌈 Your turn? #GoodVibes`,
        String.raw`Caught a sunset that hit different 🌇`,
        String.raw`Found joy in a small moment today`,
        String.raw`Today’s win: ☕️ + 🎶. Yours?`,
        String.raw`Smiled at a stranger, they smiled back.`,
    ]

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
        let userPosts = await fetch('/db/getPostsByUserId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: currentUser.id })
        }).then(res => res.json())


        let followingPosts = await fetch('/db/getFollowingPosts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ following: currentUser.following })
        }).then(res => res.json())
        console.log(followingPosts)

        let allPosts = [...userPosts, ...followingPosts]
        setPosts(allPosts.sort((a, b) => new Date(b.date) - new Date(a.date)))
    }

    useEffect(() => {
        loadPosts()
    }, [loadPostsFlag])


    const displayPosts = () => {
        return <div>{posts.map((post, idx) => <Post render={{ loadPostsFlag, setLoadPostsFlag }} key={post._id} post={post} />)}</div>
    }

    return (
        <div className='Home'>
            <Navbar user={currentUser} />
            <div className='homeContainer'>
                <div className='upperRow'>
                    <div className='homeDiv'>
                        <div className='row'>
                            <div className='col'>
                                <img className='profilePicture' src={`profile_pictures/p${currentUser.profilePicture}.webp`}></img>
                            </div>
                            <div className='col'>
                                <div className='userInfoContentDiv'>
                                    <span className='defaultHeading'>Welcome,</span>
                                    <h1>{currentUser.username}</h1>
                                    <span className='followers'>{currentUser.followers.length} followers</span>
                                    <span className='following'>{currentUser.following.length} following</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='postDiv'>
                        <textarea
                        className='postInput'
                        value={newPostContent}
                        onChange={(e) => { setNewPostContent(e.target.value) }}
                        placeholder={postSuggestions[parseInt(Math.random() * postSuggestions.length)]}>

                        </textarea>
                        <button className='postButton' onClick={() => { attempPost() }}>Post</button>
                    </div>
                </div>
                <div>
                    {displayPosts()}
                </div>
            </div>
        </div>
    )
}