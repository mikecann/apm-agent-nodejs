const fs = require('fs')
const os = require("os")
const ElasticAPMHttpClient = require('elastic-apm-http-client')

class SocketTransport extends ElasticAPMHttpClient {
  constructor(opts) {
    super(opts)
    this.data = []
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
    if(fs.existsSync('/tmp/the-pipe')) {
      const f = fs.openSync('/tmp/the-pipe', 'w')
      fs.writeSync(f, this.data.join(''))
      fs.closeSync(f)
    } else {
      console.log("ERROR: could not find /tmp/the-pipe")
    }
    this.data = []
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

  // sendSpan (span, cb) {
  //   this.writeThing(span)
  //   if (cb) {
  //     process.nextTick(cb)
  //   }
  // }

  // sendTransaction (transaction, cb) {
  //   this.writeThing(transaction)
  //   if (cb) {
  //     process.nextTick(cb)
  //   }
  // }

  // sendError (_error, cb) {
  //   this.writeThing(_error)
  //   if (cb) {
  //     process.nextTick(cb)
  //   }
  // }

  // sendMetricSet (metricset, cb) {
  //   this.writeThing(metricset)
  //   if (cb) {
  //     process.nextTick(cb)
  //   }
  // }

  // flush (cb) {
  //   if (cb) {
  //     process.nextTick(cb)
  //   }
  // }

  // // Inherited from Writable, called in agent.js.
  // destroy () {}
}

module.exports = SocketTransport
