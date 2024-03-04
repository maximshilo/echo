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
    following: []
})

const usersModel = mongoose.model('users', userSchema)

app.post('/db/signupNewUser', async (req, res) => {
    try {
        console.log('attempting to sign new user')
        let tempRes = {
            status: 200,
            info: ''
        }

        let user = req.body
        console.log(user)
        await usersModel.insertMany(user)

        let dataRequest = await usersModel.find({ email: user.email, password: user.password })

        if (dataRequest) {
            tempRes.status = 200
            tempRes.info = { username: dataRequest.username, id: dataRequest._id }
        } else {
            tempRes.status = 500
            tempRes.info = { username: null, id: null }
        }

        res.status(tempRes.status).json(tempRes)
    } catch (e) {
        console.log(e.toString())
        res.status(500).json({ error: e.toString() })
    }
})

app.post('/db/signinUser', async (req, res) => {
    try {
        let tempRes = {
            status: 200,
            info: ''
        }

        let attempInfo = req.body
        let dataRequest = await usersModel.find({ email: attempInfo.email, password: attempInfo.password })

        if (dataRequest) {
            tempRes.status = 200
            tempRes.info = { username: dataRequest.username, id: dataRequest._id }
        } else {
            tempRes.status = 500
            tempRes.info = { username: null, id: null }
        }

        res.status(tempRes.status).json(tempRes)
    } catch (e) {
        console.log(e.toString())
        res.status(500).json({ error: e.toString() })
    }
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