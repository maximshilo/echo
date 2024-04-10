const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('./client/build'))

//mongoose connection

const userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    dob: Date,
    profilePicture: Number,
    following: Array,
    followers: Array
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

app.post('/db/getUserByID', async (req, res) => {
    let temp = await usersModel.findOne({ _id: req.body._id })
    let user = {
        username: temp.username,
        id: temp._id,
        dob: temp.dob,
        email: temp.email,
        following: temp.following,
        followers: temp.followers,
        profilePicture: temp.profilePicture
    }
    console.log(user)

    res.status(200).json(user)
})

app.post('/db/signinUser', async (req, res) => {
    let reqTime = new Date()
    console.log(reqTime.toJSON(), 'REQ -> POST /db/signinUser')

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
                followers: dataRequest.followers,
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
                followers: [],
                profilePicture: 1
            }
        }

        console.log(new Date().toJSON(), 'POST -> POST /db/signinUser -> RES TIME(ms):', (reqTime - new Date()))
        res.status(tempRes.status).json(tempRes)
    } catch (e) {
        console.log(e.toString())
        res.status(500).json({ error: e.toString() })
    }
})

app.put('/db/likePost', async (req, res) => {
    // put /db/likePost
    // likes a post by it's ID
    // req -> body -> {
    //    likes : Array of Strings (user IDs),
    //    postID : String,
    //    userID : String, the ObjectID of the user whose like is to be added to the likes array
    //}

    let likes = req.body.likes
    let postID = req.body.postID
    let userID = req.body.userID

    likes.push(userID)

    let temp = await postsModel.findOneAndUpdate({ _id: postID }, { likes: likes })

    res.status(200).json({ message: 'OK' })
})

app.put('/db/unlikePost', async (req, res) => {
    // put /db/unlikePost 
    // unlikes a post by it's ID
    // req -> body -> {
    //     likes : Array of Strings (user IDs),
    //     postID : String,
    //     index : Number, the position of the current user, whose like is to be removed, in the likes array
    // }
    // sends 200, and { message: 'OK' }

    let likes = req.body.likes
    let postID = req.body.postID
    let index = req.body.index

    likes = likes.toSpliced(index, 1)

    let temp = await postsModel.findOneAndUpdate({ _id: postID }, { likes: likes })

    res.status(200).json({ message: 'OK' })
})

app.put('/db/deletePost', async (req, res) => {
    // put /db/deletePost
    // delete's a post document from the posts collection.
    // req -> body -> { postID : String }
    // sends 200, and the deleted post

    let postID = req.body.postID

    let temp = await postsModel.findOneAndDelete({ _id: postID })

    res.status(200).json(temp)
})

app.put('/db/followUser', async (req, res) => {
    // put /db/followUser
    // follows a users by ID.
    // req -> body -> {
    //     subjectUserID : String,
    //     objectUserID : String
    // }

    let reqTime = new Date()
    console.log(reqTime.toJSON(), 'REQ -> PUT /db/followUser')

    try {
        let subjectUserID = req.body.subjectUserID
        let objectUserID = req.body.objectUserID

        let subjectUser = await usersModel.findOne({ _id: subjectUserID })
        let objectUser = await usersModel.findOne({ _id: objectUserID })

        let subjectFollowers = [...subjectUser.followers]
        let objectFollowing = [...objectUser.following]

        subjectFollowers.push(objectUserID)
        objectFollowing.push(subjectUserID)

        subjectUser = await usersModel.findOneAndUpdate({ _id: subjectUserID }, { followers: subjectFollowers }, { returnNewDocument: true })
        objectUser = await usersModel.findOneAndUpdate({ _id: objectUserID }, { following: objectFollowing }, { returnNewDocument: true })

        res.status(200).json({ users: [subjectUser, objectUser] })
        console.log(new Date().toJSON(), 'RES -> PUT /db/followUser -> RES TIME(ms):', (new Date() - reqTime))
    } catch (e) {
        console.log(e.toString())
        res.status(500).json({ error: e.toString() })
    }
})

app.post('/db/unfollowUser', async (req, res) => {
    // post /db/unfollowUser
    // unfollows a user by id
    // req -> body -> {
    //     subjectUserID : String,
    //     objectUserID : String
    // }

    let reqTime = new Date()
    console.log(reqTime.toJSON(), 'REQ -> POST /db/unfollowUser')

    try {
        let subjectUserID = req.body.subjectUserID
        let objectUserID = req.body.objectUserID

        let subjectUser = await usersModel.findOne({ _id: subjectUserID })
        let objectUser = await usersModel.findOne({ _id: objectUserID })

        let subjectFollowers = subjectUser.followers
        let objectFollowing = objectUser.following

        let objectIndex = subjectFollowers.findIndex(id => id == objectUserID)
        let subjectIndex = objectFollowing.findIndex(id => id == subjectUserID)

        subjectFollowers = subjectFollowers.toSpliced(objectIndex, 1)
        objectFollowing = objectFollowing.toSpliced(subjectIndex, 1)


        subjectUser = await usersModel.findOneAndUpdate({ _id: subjectUserID }, { followers: subjectFollowers }, { returnNewDocument: true })
        objectUser = await usersModel.findOneAndUpdate({ _id: objectUserID }, { following: objectFollowing }, { returnNewDocument: true })

        console.log(objectUser)

        objectUser = {
            username: objectUser.username,
            id: objectUser._id,
            dob: objectUser.dob,
            email: objectUser.email,
            following: objectFollowing,
            followers: objectUser.followers,
            profilePicture: objectUser.profilePicture
        }

        res.status(200).json(objectUser)
    } catch (e) {
        console.log(new Date().toJSON(), 'ERROR -> POST /db/unfollowUser ->', e.toString())
        res.status(500).json({ error: e.toString() })
    }

    console.log(new Date().toJSON(), 'RES -> POST /db/unfollowUser -> RES TIME (ms):', (new Date() - reqTime))
})

app.post('/db/getFollowSuggestions', async (req, res) => {
    // post /db/getFollowSuggestions
    // sends 10 users that are fit to be a suggestion
    // req -> body -> {
    //     currentUserID : String,
    //     currentUserFollowing : Array,
    //     displayedResults : Array
    // }

    let reqTime = new Date()
    console.log(reqTime.toJSON(), 'REQ -> POST /db/getFollowSuggestions')

    try {
        let currentUserID = req.body.currentUserID
        let currentUserFollowing = req.body.currentUserFollowing
        let displayedResults = req.body.displayedResults

        currentUserFollowing.push(currentUserID)
        currentUserFollowing.concat(displayedResults)

        let suggestions = await usersModel.find({ _id: { $nin: currentUserFollowing } })

        res.status(200).json(suggestions)
    } catch (e) {
        console.log(new Date().toJSON(), 'ERROR -> /db/getFollowSuggestions ->', e.toString())
        res.status(500).json({ error: e.toString() })
    }

    console.log(new Date().toJSON(), 'RES -> POST /db/getFollowSuggestions -> RES TIME (ms):', new Date() - reqTime)
})

app.get('*', (req, res) => {
    // get *
    // sends index.html if URL path exists.
    // sends code 404 otherwise.

    try {
        res.sendFile('./index.html')
    } catch {
        res.status(404).send('404')
    }
})


app.listen(PORT, () => {
    console.log(`server is up; listening to port ${PORT}`)
})
