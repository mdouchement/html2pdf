var express = require('express')
var fs = require('fs')
var tmp = require('tmp')
const puppeteer = require('puppeteer')

// Global
var debug = (process.env.DEBUG === '1')
tmp.setGracefulCleanup()

var browserOpts = {}
if (process.env.DOCKER_EXECUTION === '1') {
  browserOpts = {
    executablePath: process.env.CHROMIUM_BIN,
    args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
  }
}

// PDF

async function _generatePDF(url, orientation, format, tmpFile) {
  const browser = await puppeteer.launch(browserOpts)
  try {
    const page = await browser.newPage()

    // From the launched Chromium console. Useful for debug.
    if (debug) {
      page.on('console', msg => {
        console.log('--CONSOLE------------------')
        for (let i = 0; i < msg.args.length; ++i)
        console.log(`${i}: ${msg.args[i]}`)
        console.log('___________________________')
      })
    }

    page.on('pageerror', errmsg => {
      console.log('[pageerror] ' + errmsg)

      throw new Error(errmsg)
    })

    page.on('error', err => {
      console.log('[ERROR] ' + err.message)
      console.log(err.stack)

      throw err
    })

    await page.goto(url, {waitUntil: 'networkidle2'})

    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    await page.pdf({
      path: tmpFile,
      format: format,
      landscape: orientation === 'landscape'
    })
  } finally {
    browser.close()
  }
}

var generatePDF = (url, orientation, format) => {
  return new Promise((resolve, reject) => {
    tmp.file((err, tmpFile) => {
      if (err) {
        return reject(err)
      }

      _generatePDF(url, orientation, format, tmpFile)
        .then((data) => {
          fs.access(tmpFile, fs.F_OK, (err) => {
            if (err) {
              return reject(err)
            }
            return resolve(fs.createReadStream(tmpFile))
          })
        })
        .catch(err => reject(err))
    })
  })
}

// Server

var app = express()
app.set('port', process.env.PORT || 4005)

app.get('/export', (req, res) => {
  console.log('generating pdf with params :', req.query)
  if (!req.query || !req.query.url) {
    return res.status(404).end('missing url param')
  }
  generatePDF(req.query.url, req.query.orientation, req.query.format)
    .then(stream => {
      res.attachment(req.query.filename)
      stream.pipe(res)
      console.log('generated pdf with params :')
      console.log(req.query)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json(err)
    })
})

app.listen(app.get('port'))
console.info('listening on port: ' + app.get('port'))
