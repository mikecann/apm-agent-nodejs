'use strict'

// Test the behaviour of the agent configured with 'disableSend=true'.

const tape = require('tape')

const apm = require('../')
const { NoopTransport } = require('../lib/noop-transport')
const { MockAPMServer } = require('./_mock_apm_server')

tape.test('disableSend', function (suite) {
  let server
  let serverUrl
  const METRICS_INTERVAL_S = 1

  suite.test('setup', function (t) {
    server = new MockAPMServer()
    server.start(function (serverUrl_) {
      serverUrl = serverUrl_
      t.comment('mock APM serverUrl: ' + serverUrl)
      apm.start({
        serverUrl,
        serviceName: 'test-disable-send',
        logLevel: 'off',
        captureExceptions: false,
        metricsInterval: `${METRICS_INTERVAL_S}s`, // Try to force getting metrics soon.
        transport: function customTransport (conf, agent) {
          throw new Error('custom transport should not get called with disableSend=true')
        },
        disableSend: true
      })
      t.comment('apm started')
      t.end()
    })
  })

  suite.test('transport should be NoopTransport if disableSend=true', function (t) {
    t.ok(apm._transport instanceof NoopTransport, 'agent transport is NoopTransport')
    t.end()
  })

  suite.test('transactions and spans are not sent to APM server', function (t) {
    const tx = apm.startTransaction('mytx')
    const s = tx.startSpan('myspan')
    setImmediate(function () {
      s.end()
      tx.end()
      apm.flush(function onFlushed () {
        t.ok(tx.id, 'transaction has an id: ' + tx.id)
        t.ok(s.id, 'span has an id: ' + s.id)
        t.equal(server.events.length, 0, 'no events sent to APM server intake')
        t.end()
      })
    })
  })

  suite.test('errors are not sent to APM server', function (t) {
    apm.captureError(new Error('myboom'), function (_, errId) {
      t.ok(errId, 'apm.captureError still calls back with an error id: ' + errId)
      t.equal(server.events.length, 0, 'no events sent to APM server intake')
      t.end()
    })
  })

  suite.test('metrics are not sent to APM server', function (t) {
    setTimeout(function afterMetricsInterval () {
      t.equal(server.events.length, 0,
        'after metricsInterval, no events sent to APM server intake')
      t.end()
    }, METRICS_INTERVAL_S * 1000)
  })

  suite.test('teardown', function (t) {
    server.close()
    t.end()
    apm.destroy()
  })

  suite.end()
})
