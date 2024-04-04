import React from 'react'
import { useState } from 'react'
import store from '../redux/store.js'

import '../css/Post.css'

export default function Post(props) {
    const post = props.post
    const currentUser = store.getState().userReducer.currentUser
    const [likedByUser, setLikedByUser] = useState(post.likes.findIndex(id => id == currentUser.id))

    const heartColor = likedByUser == -1 ? 'white' : 'red'


    let date = new Date(props.post.date).toLocaleDateString()

    const toggleLikePost = async () => {
        let body = {
            likes : post.likes,
            postID : post._id,
            userID : currentUser.id,
            index : likedByUser
        }

        if (likedByUser == -1) {
            let res = await fetch('/db/likePost', {
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(body)
            }).then(res => res.json())

            setLikedByUser(post.likes.length)
            post.likes.push(currentUser.id)
        } else {
            let res = await fetch('/db/unlikePost', {
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(body)
            }).then(res => res.json())

            
            post.likes = post.likes.toSpliced(likedByUser, 1)
            setLikedByUser(-1)
        }
    }

    return (
        <div className='Post'>
            <div className='row'>
                <div className='likes'>
                    <div onClick={() => { toggleLikePost() }} className='heart' style={{ border : `1px solid ${heartColor}`}}>❤️</div>
                    <span id='likesCount' className='defaultHeading'>{post.likes.length}</span>
                </div>
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