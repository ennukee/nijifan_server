const express = require('express')
const path = require('path')
const app = express()

const { fetchYoutube, fetchTwitter, fetchMostPopularVideos } = require('./util/fetchData.js')
const { imageGen } = require('./util/imageGen.js')

app.use('/storage', express.static(path.join(__dirname, 'public')))

app.get('/youtube', async (req, res) => {
  const key = req.query.key
  if (key !== process.env.PRIVATE_API_TOKEN) {
    res.status(403)
    res.send('Unauthorized')
  } else {
    res.status(200)
    res.send(await fetchYoutube())
  }
})

app.get('/videos', async (req, res) => {
  const key = req.query.key
  if (key !== process.env.PRIVATE_API_TOKEN) {
    res.status(403)
    res.send('Unauthorized')
  } else {
    res.status(200)
    res.send(await fetchMostPopularVideos())
  }
})

app.get('/twitter', async (req, res) => {
  const key = req.query.key
  if (key !== process.env.PRIVATE_API_TOKEN) {
    res.status(403)
    res.send('Unauthorized')
  } else {
    res.status(200)
    res.send(await fetchTwitter())
  }
})

app.get('/force-images', async (req, res) => {
  const key = req.query.key
  if (key !== process.env.PRIVATE_API_TOKEN) {
    res.status(403)
    res.send('Unauthorized')
  } else {
    res.status(200)

    const status = await imageGen()
    if (status) {
      res.send({ response: 'OK', code: 200 })
    } else {
      res.send({ code: 500 })
    }
  }
})

app.listen(80, () => {
  console.log('Server listening on port 80')
})
