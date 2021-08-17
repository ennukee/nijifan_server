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
//  YouTube Subscriber Lookup  //
// --------------------------- //
const CHANNEL_IDS = [
  'UC4WvIIAo89_AzGUh1AZ6Dkg', // Rosemi
]
const API_KEY = process.env.GOOGLE_API_KEY

async function fetchSubs() {
  const url = `https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_IDS.join(',')}&key=${API_KEY}`
  const resp = await fetch(url)
  const json = await resp.json()

  await fs.writeFile(path.join(__dirname, '../public/data.json'), JSON.stringify(json), null, (err) => console.log(err))
  return json
}


// --------------------------- //
//        Tweet Lookup         //
// --------------------------- //
const TWITTER_IDS = [
  /*
    URL to query to find more IDs
    https://api.twitter.com/2/users/by?usernames=Rosemi_Lovelock&user.fields=created_at&tweet.fields=author_id,created_at
  */
  1413326894435602434, // Rosemi
  1390620618001838086, // Elira
]
const BEARER_TOKEN = process.env.TWITTER_BEARER
async function fetchTweets() {
  // TODO: Can only do 1 ID at a time it seems
  const url = `https://api.twitter.com/2/users/${TWITTER_IDS[0]}/tweets?tweet.fields=created_at&media.fields=preview_image_url`
}

module.exports = {
  fetchSubs,
  fetchTweets,
}