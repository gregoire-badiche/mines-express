const express = require('express')
const app = express()
const port = 3000

app.use(express.static('web'));

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})