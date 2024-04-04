import React, { useEffect } from 'react'
import { useState } from 'react'
import store from '../redux/store.js'

import '../css/Post.css'

export default function Post(props) {
    const post = props.post

    const currentUser = store.getState().userReducer.currentUser

    const [likedByUser, setLikedByUser] = useState(-1)

    let heartColor = likedByUser == -1 ? 'white' : 'red'
    let date = new Date(props.post.date).toLocaleDateString()


    const toggleLikePost = async () => {
        let body = {
            likes: post.likes,
            postID: post._id,
            userID: currentUser.id,
            index: likedByUser
        }

        if (likedByUser == -1) {
            let res = await fetch('/db/likePost', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(res => res.json())

            setLikedByUser(post.likes.length)
            post.likes.push(currentUser.id)
        } else {
            let res = await fetch('/db/unlikePost', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(res => res.json())


            post.likes = post.likes.toSpliced(likedByUser, 1)
            setLikedByUser(-1)
        }
    }

    const displayDeleteElement = () => {
        if (post.userID == currentUser.id) {
            return (
                <div className='delete'>
                    <div onClick={async () => {
                        let res = await fetch('/db/deletePost', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                postID: post._id
                            })
                        }).then(res => res.json())

                        props.render.setLoadPostsFlag(!props.render.loadPostsFlag)
                    }} className='trashcan'>🗑️</div>
                </div>
            )
        } else {
            return <></>
        }
    }

    useEffect(() => {
        setLikedByUser(-1)
        setLikedByUser(post.likes.findIndex(el => el == currentUser.id))
        console.log(post, post.likes.findIndex(el => el == currentUser.id))
    }, [])

    return (
        <div className='Post'>
            <div className='row'>
                <div className='likes'>
                    <div onClick={() => { toggleLikePost() }} className='heart' style={{ border: `1px solid ${heartColor}` }}>❤️</div>
                    <span id='likesCount' className='defaultHeading'>{post.likes.length}</span>
                </div>

                {displayDeleteElement()}

                <img className='postPicture' src={`profile_pictures/p${post.userPicture}.webp`}></img>
                <div className='postContent'>
                    <span className='defaultHeading'>{post.username}</span>
                    <span className='defaultBody'>{post.content}</span>
                    <span id='postDate' className='smallBody'>{date}</span>
                </div>
            </div>
        </div>
    )
}