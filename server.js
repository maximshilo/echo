const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('./client/build'))
mongoose.connect('mongodb+srv://maximshilo00:326974359max@projectdb.j3ljufi.mongodb.net/echo_collections')

const userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    dob: Date,
    profilePicture: Number,
    following: []
})

const usersModel = mongoose.model('users', userSchema)

const postSchema = mongoose.Schema({
    content: String,
    date: Date,
    likes: Array,
    username: String,
    userID: String,
    userPicture: Number,
})

const postsModel = mongoose.model('posts', postSchema)

app.post('/db/addNewPost', async (req, res) => {
    let tempRes = {
        status: 200,
        info: ''
    }

    let newPost = req.body

    await postsModel.insertMany(newPost)

    res.status(tempRes.status).json(tempRes)
})

app.post('/db/getPostsByUserId', async (req, res) => {
    let tempRes = {
        status: 200,
        content: {}
    }

    let posts = await postsModel.find({ userID: req.body.id })
    tempRes.content = posts

    res.status(tempRes.status).json(tempRes.content)
})

app.post('/db/getFollowingPosts', async (req, res) => {
    let following = req.body.following
    let posts = await postsModel.find({ userID: { $in: following } })
    res.status(200).json(posts)
})

app.post('/db/signupNewUser', async (req, res) => {
    try {
        let tempRes = {
            status: 200,
            info: ''
        }

        let user = req.body
        await usersModel.insertMany(user)

        let dataRequest = await usersModel.find({ email: user.email, password: user.password })

        if (dataRequest) {
            tempRes.status = 200
            tempRes.info = {
                username: dataRequest.username,
                id: dataRequest._id,
                dob: dataRequest.dob,
                email: dataRequest.email,
                following: dataRequest.following,
                profilePicture: dataRequest.profilePicture
            }
        } else {
            tempRes.status = 500
            tempRes.info = {
                username: null,
                id: null,
                dob: null,
                email: null,
                following: [],
                profilePicture: 1
            }
        }

        res.status(tempRes.status).json(tempRes)
    } catch (e) {
        console.log(e.toString())
        res.status(500).json({ error: e.toString() })
    }
})

app.get('/db/getAllUsers', async (req, res) => {
    let users = await usersModel.find()
    res.status(200).json(users)
})

app.post('/db/signinUser', async (req, res) => {
    try {
        let tempRes = {
            status: 200,
            info: ''
        }

        let attempInfo = req.body
        let dataRequest = await usersModel.findOne({ email: attempInfo.email, password: attempInfo.password })

        if (dataRequest) {
            tempRes.status = 200
            tempRes.info = {
                username: dataRequest.username,
                id: dataRequest._id,
                dob: dataRequest.dob,
                email: dataRequest.email,
                following: dataRequest.following,
                profilePicture: dataRequest.profilePicture
            }
        } else {
            tempRes.status = 500
            tempRes.info = {
                username: null,
                id: null,
                dob: null,
                email: null,
                following: [],
                profilePicture: 1
            }
        }

        res.status(tempRes.status).json(tempRes)
    } catch (e) {
        console.log(e.toString())
        res.status(500).json({ error: e.toString() })
    }
})

app.put('/db/likePost', async (req, res) => {
    let likes = req.body.likes
    let postID = req.body.postID
    let userID = req.body.userID

    likes.push(userID)

    let temp = await postsModel.findOneAndUpdate({ _id: postID }, { likes: likes })

    res.status(200).json({ message: 'OK' })
})

app.put('/db/unlikePost', async (req, res) => {
    let likes = req.body.likes
    let postID = req.body.postID
    let index = req.body.index

    likes = likes.toSpliced(index, 1)

    let temp = await postsModel.findOneAndUpdate({ _id: postID }, { likes: likes })

    res.status(200).json({ message: 'OK' })
})

app.put('/db/deletePost', async (req, res) => {
    let postID = req.body.postID

    let temp = await postsModel.findOneAndDelete({ _id: postID })

    res.status(200).json(temp)
})

app.get('*', (req, res) => {
    try {
        res.sendFile('./index.html')
    } catch {
        res.status(404).send('404')
    }
})

app.listen(PORT, () => {
    console.log(`server is up; listening to port ${PORT}`)
})