const express = require('express')
const path = require('path')
const app = express()

const { fetchSubs, fetchTweets } = require('./util/fetchData.js')

app.use(express.static(path.join(__dirname, 'public')))
app.get('/subs', async (req, res) => {
  res.send(await fetchSubs())
})
app.get('/tweets', async (req, res) => {
  res.send(await fetchTweets())
})
app.listen(80, () => {
  console.log('Server listening on port 80')
})
