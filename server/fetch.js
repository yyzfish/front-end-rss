const Parser = require('rss-parser')
const Async = require('async')

const utils = require('./utils')

require('dotenv').config({ multiline: true })

let rssConfig = {}
try {
  rssConfig = JSON.parse(process.env.RSS_CONFIG || '{}')
} catch (e) {
}

async function fetchFeed(rss) {
  const parser = new Parser({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
    },
    xml2js: {
      emptyTag: '--EMPTY--',
    },
    requestOptions: {
      rejectUnauthorized: false
    }
  })

  try {
    const feed = await parser.parseURL(rss)
    if (feed) {
      utils.logSuccess('成功 RSS: ' + rss)
      return feed
    }
  } catch (e) {
    console.log(e)
  }

  utils.logWarn('失败 RSS: ' + rss)
  return true
}

async function initFetch(rssItem, onFinish) {
  let rssArray = rssItem.rss

  if (typeof rssArray === 'string') {
    rssArray = [rssArray]
  }

  const envRss = rssConfig[rssItem.title]

  if (envRss) {
    rssArray.unshift(envRss)
  }

  const tasks = rssArray.map((rss) => ((callback) => {
    ((async () => {
      const feed = await fetchFeed(rss)

      if (feed === true) {
        callback(true)
      } else {
        callback(null, feed)
      }
    })())
  }))

  utils.log('开始 RSS: ' + rssItem.title)

  return new Promise((resolve) => {
    Async.tryEach(tasks, (err, res) => {
      utils.log('完成 RSS: ' + rssItem.title)
      resolve(err ? null : res)
    })
  })
}

module.exports = initFetch
