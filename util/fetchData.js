const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
require('dotenv').config()

/*
  CRON Job Timers
    YT Subs - 5 to 10 mins?
    Tweets - unknown, probably 1-3 hours unless
*/

// --------------------------- //
//        YouTube Lookup       //
// --------------------------- //
const CHANNEL_IDS = {
  'UC4WvIIAo89_AzGUh1AZ6Dkg': 'rosemi',
  'UCu-J8uIXuLZh16gG-cT1naw': 'finana',
  'UCIeSUTOTkF9Hs7q3SGcO-Ow': 'elira',
  'UCP4nMSTdwU1KqYWu3UH5DHQ': 'pomu',
  'UCV1xUwfM2v2oBtT3JNvic3w': 'selen',
  'UCgA2jKRkqpY_8eysPUs8sjw': 'petra',
}
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

// ! -- Subscriber Section -- ! //
async function fetchYoutube() {
  const url = `https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${Object.keys(CHANNEL_IDS).join(',')}&key=${GOOGLE_API_KEY}`
  const resp = await fetch(url)
  const json = await resp.json()
  
  const remappedData = json.items.reduce((acc, cur) => {
    acc[CHANNEL_IDS[cur.id]] = { ...cur }
    return acc
  }, {})

  await fs.writeFile(path.join(__dirname, '../public/youtube.json'), JSON.stringify(remappedData), null, (err) => console.log(err))
  return remappedData
}

const CHANNEL_DEBUT_DATES = {
  rosemi: '2021-07-19T00:00:00Z',
  selen: '2021-07-19T00:00:00Z',
  petra: '2021-07-19T00:00:00Z',
  elira: '2021-05-17T00:00:00Z',
  pomu: '2021-05-17T00:00:00Z',
  finana: '2021-05-17T00:00:00Z',
}
// ! -- Most Popular Section -- ! //
async function fetchMostPopularVideos() {
  const videos = Object.entries(CHANNEL_IDS).map(async ([channel_id, channel_key]) => {
    const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel_id}&maxResults=3&publishedAfter=${CHANNEL_DEBUT_DATES[channel_key]}&order=viewCount&key=${GOOGLE_API_KEY}`

    const resp = await fetch(url)
    const json = await resp.json()

    return {
      [channel_key]: json.items
    }
  })

  const finishedVideos = await Promise.all(videos)

  const objectForm = finishedVideos.reduce((acc, cur) => {
    const key = Object.keys(cur)[0]
    acc[key] = cur[key]
    return acc
  }, {})

  await fs.writeFile(path.join(__dirname, '../public/videos.json'), JSON.stringify(objectForm), null, (err) => console.log(err))
  return objectForm
}

// ----------------------------- //
//         Twitter Lookup        //
// ----------------------------- //
const TWITTER_HANDLES = [
  'Rosemi_Lovelock',
  'EliraPendora',
  'FinanaRyugu',
  'PomuRainpuff',
  'Selen_Tatsuki',
  'Petra_Gurin',
]

const HANDLE_TO_ROUTE = {
  'Rosemi_Lovelock': 'rosemi',
  'EliraPendora': 'elira',
  'FinanaRyugu': 'finana',
  'PomuRainpuff': 'pomu',
  'Selen_Tatsuki': 'selen',
  'Petra_Gurin': 'petra',
}

const BEARER_TOKEN = process.env.TWITTER_BEARER
async function fetchTwitter() {
  const url = `https://api.twitter.com/2/users/by?usernames=${TWITTER_HANDLES.join(',')}&user.fields=username,profile_image_url,public_metrics`
  const resp = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER_TOKEN}`
    },
  })
  const json = await resp.json()

  const remappedData = json.data.reduce((acc, cur) => {
    acc[HANDLE_TO_ROUTE[cur.username]] = { ...cur }
    return acc
  }, {})

  await fs.writeFile(path.join(__dirname, '../public/twitter.json'), JSON.stringify(remappedData), null, (err) => console.log(err))
  return remappedData
}

module.exports = {
  fetchYoutube,
  fetchTwitter,
  fetchMostPopularVideos,
}