const express = require('express')
const path = require('path')
const app = express()

const { fetchData } = require('./util/fetchData.js')

app.use('/data', express.static(path.join(__dirname, 'public')))
app.get('/fetch', (req, res) => {
  fetchData()
})
app.listen(80, () => {
  console.log('Server listening on port 80')
})
