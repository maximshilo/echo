const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000

app.get('*', (req, res) => {
    res.send('hello world!')
})

app.listen(PORT, () => {
    console.log(`server is up; listening to port ${PORT}`)
})