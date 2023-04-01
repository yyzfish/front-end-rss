const later = require('later')

const handleUpdate = require('./update')

// node app.js 设置自动更新
later.date.localTime()
later.setInterval(handleUpdate, {
  schedules: [
    { h: [06], m: [00] },
    { h: [08], m: [00] },
    { h: [10], m: [00] },
    { h: [12], m: [00] },
    { h: [15], m: [00] },
    { h: [18], m: [00] },
    { h: [21], m: [00] },
    { h: [23], m: [00] },
  ]
})
