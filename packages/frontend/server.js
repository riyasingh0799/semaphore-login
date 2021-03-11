const express = require('express')
const Bundler = require('parcel-bundler')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

const entryFile = path.join(__dirname, './index.html')

const parcelOptions = {
  // provide parcel options here
  // these are directly passed into the
  // parcel bundler
  //
  // More info on supported options are documented at
  // https://parceljs.org/api
  https: false,
  autoInstall: false
}

const app = express()

const bundler = new Bundler(entryFile, parcelOptions)
bundler.on('buildEnd', () => {
  console.log('Build completed!')
})

app.use(bundler.middleware())

const port = 3000

// start up the server
app.listen(port, () => {
  console.log('Parcel proxy server has started at:', `http://localhost:${port}`)
})
