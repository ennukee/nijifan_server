const puppeteer = require('puppeteer')
require('dotenv').config()

// Below are pages that are finished and must be updated when pages are added
const VIEWABLE_PAGES = [
  '',
  '/en',
  '/jp',
  '/id',
  '/kr',
  '/en/rosemi',
]

const imageGen = async () => {
  const browser = await puppeteer.launch({ defaultViewport: null });
  try {
    for (let i = 0; i < VIEWABLE_PAGES.length; i++) {
      const page = await browser.newPage();
      page.setViewport({ width: 1920, height: 600 })
      const url = `http://${process.env.FRONTEND_ENDPOINT}${VIEWABLE_PAGES[i]}`
      console.log('Generating image for', url)
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 })
  
      const ele = await page.$('body')
      await ele.screenshot({
        path: `public/${VIEWABLE_PAGES[i] || 'home'}.png`,
        clip: {
          x: 0,
          y: VIEWABLE_PAGES[i].split('/').length === 3 ? 60 : 0,
          width: 1920,
          height: VIEWABLE_PAGES[i].split('/').length === 3 ? 600 : 1000,
        }
      })
    }
  } catch (e) {
    console.log(e)
    return false
  } finally {
    browser.close()
  }
  return true
}

module.exports = {
  imageGen,
}
