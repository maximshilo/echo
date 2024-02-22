const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000

app.use(express.static('./client/build'))

app.get('*', (req, res) => {
    res.sendFile('./index.html')
})

app.listen(PORT, () => {
    console.log(`server is up; listening to port ${PORT}`)
})