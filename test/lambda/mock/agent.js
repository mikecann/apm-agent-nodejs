'use strict'

const logging = require('../../../lib/logging')
const TransactionMock = require('./transaction')

module.exports = class AgentMock {
  constructor () {
    this.flushed = false
    this.transactions = []
    this.errors = []
    this.logger = logging.createLogger('off')
    this._conf = {
      // A (very) minimal `agent._conf` to satisfy "lib/lambda.js" usage.
      active: true
    }
  }

  startTransaction (name, type, opts) {
    const trans = new TransactionMock(name, type, opts)
    this.transactions.push(trans)
    return trans
  }

  captureError (error, opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = {}
    } else if (!opts) {
      opts = {}
    }
    this.errors.push(error)
    if (cb) {
      setImmediate(cb)
    }
  }

  flush (callback) {
    this.flushed = true
    if (callback) {
      setImmediate(callback)
    }
  }
}
