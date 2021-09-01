const fs = require('fs')
const os = require("os")
const ElasticAPMHttpClient = require('elastic-apm-http-client')

class LambdaExtensionTransport extends ElasticAPMHttpClient {
  constructor(opts) {
    super(opts)
    this.data = []
    // this._encodedMetadata = '{"metadata":false}' // prevent deep access error in ElasticAPMHttpClient -- todo: fix
    this.initMetadata(opts)
  }

  initMetadata(opts) {
    const metadata = getMetadata(opts)
    this._encodedMetadata = this._encode({metadata}, ElasticAPMHttpClient.encoding.METADATA)
    this.data.push(this._encodedMetadata)
  }

  // config (opts) {
  //   super(opts)
  // }

  // addMetadataFilter (fn) {}

  serverlessSendToSocket() {
    // console.log('HELLO WORLD')
    // console.log(
    //   this.data.join('')
    // )
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/intake/v2/events',
      method: 'POST'
    }

    const req = require('http').request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      res.on('data', d => {
        process.stdout.write(d)
      })
    })

    req.on('error', error => {
      console.error(error)
    })

    req.end()
    // const socketPath = "/tmp/elastic-apm-data"
    // // if(fs.existsSync(socketPath)) {
    // //   const f = fs.openSync(socketPath, 'w')
    // //   fs.writeSync(f, this.data.join(''))
    // //   fs.closeSync(f)
    // // } else {
    // //   console.log(`ERROR: could not find ${socketPath}`)
    // // }
    this.data = []
    this.data.push(this._encodedMetadata)
  }

  writeThing(thing) {
    this.data.push(thing)
  }

  addMetadataFilter (fn) {}

  sendSpan (span, cb) {
    this.writeThing(this._encode({span}, ElasticAPMHttpClient.encoding.SPAN))
    if (cb) {
      process.nextTick(cb)
    }
  }

  sendTransaction (transaction, cb) {
    this.writeThing(this._encode({transaction}, ElasticAPMHttpClient.encoding.TRANSACTION))
    if (cb) {
      process.nextTick(cb)
    }
  }

  sendError (_error, cb) {
    this.writeThing(this._encode({_error}, ElasticAPMHttpClient.encoding.ERROR))
    if (cb) {
      process.nextTick(cb)
    }
  }

  sendMetricSet (metricset, cb) {
    this.writeThing(this._encode({metricset}, ElasticAPMHttpClient.encoding.METRICSET))
    if (cb) {
      process.nextTick(cb)
    }
  }

  flush (cb) {
    if (cb) {
      process.nextTick(cb)
    }
  }

  // Inherited from Writable, called in agent.js.
  destroy () {}
}

module.exports = {
  LambdaExtensionTransport
}
