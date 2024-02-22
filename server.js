const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.static('./client/build'))
mongoose.connect('mongodb+srv://maximshilo00:326974359max@projectdb.j3ljufi.mongodb.net/echo_collection')

const userSchema = mongoose.Schema({
    nickname: String,
    username: String,
    password: String,
    following: []
})

const userModel = mongoose.model('users', userSchema)


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