const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

// middleWare
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to Drone Zone!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})