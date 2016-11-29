const AWS = require('aws-sdk')
const co = require('co')
const mime = require('mime-types')
const moment = require('moment')
const Webcam = require('node-webcam')
const path = require('path')

const webcam = Webcam.create()
const s3 = new AWS.S3({region: 'ap-northeast-1'})

function capture() {
  return new Promise(resolve => {
    webcam.capture('filename', file => {
      resolve(file)
    })
  })
}

function getLastShot() {
  return new Promise(resolve => {
    webcam.getLastShot(shot => {
      webcam.clear()
      resolve(shot)
    })
  })
}

module.exports = function *() {
  const file = yield capture()
  const lastShot = yield getLastShot()

  return yield s3.putObject({
    ACL: 'public-read',
    Body: lastShot,
    Bucket: 'rize-home-monitoring',
    ContentType: mime.lookup(path.extname(file)),
    Key: moment().unix().toString() + path.extname(file)
  }).promise()
}