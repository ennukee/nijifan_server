const express = require('express')
const path = require('path')
const app = express()

const { fetchYoutube, fetchTwitter, fetchMostPopularVideos } = require('./util/fetchData.js')

app.use('/storage', express.static(path.join(__dirname, 'public')))
app.get('/youtube', async (req, res) => {
  res.send(await fetchYoutube())
})
app.get('/videos', async (req, res) => {
  res.send(await fetchMostPopularVideos())
})
app.get('/twitter', async (req, res) => {
  res.send(await fetchTwitter())
})
app.listen(80, () => {
  console.log('Server listening on port 80')
})
