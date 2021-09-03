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
    // console.log(
    //   this.data.join('')
    // )
    const postData = this.data.join('')

    const options = {
      hostname: 'localhost',
      port: 8200,
      path: '/intake/v2/events',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
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

    req.write(postData)
    req.end()

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

function getMetadata (opts) {
  var payload = {
    service: {
      name: opts.serviceName,
      environment: opts.environment,
      runtime: {
        name: process.release.name,
        version: process.versions.node
      },
      language: {
        name: 'javascript'
      },
      agent: {
        name: opts.agentName,
        version: opts.agentVersion
      },
      framework: undefined,
      version: undefined,
      node: undefined
    },
    process: {
      pid: process.pid,
      ppid: process.ppid,
      title: process.title,
      argv: process.argv
    },
    system: {
      hostname: opts.hostname,
      architecture: process.arch,
      platform: process.platform,
      container: undefined,
      kubernetes: undefined
    },
    labels: opts.globalLabels
  }

  if (opts.serviceNodeName) {
    payload.service.node = {
      configured_name: opts.serviceNodeName
    }
  }

  if (opts.serviceVersion) payload.service.version = opts.serviceVersion

  if (opts.frameworkName || opts.frameworkVersion) {
    payload.service.framework = {
      name: opts.frameworkName,
      version: opts.frameworkVersion
    }
  }

  if (opts.containerId) {
    payload.system.container = {
      id: opts.containerId
    }
  }

  if (opts.kubernetesNodeName || opts.kubernetesNamespace || opts.kubernetesPodName || opts.kubernetesPodUID) {
    payload.system.kubernetes = {
      namespace: opts.kubernetesNamespace,
      node: opts.kubernetesNodeName
        ? { name: opts.kubernetesNodeName }
        : undefined,
      pod: (opts.kubernetesPodName || opts.kubernetesPodUID)
        ? { name: opts.kubernetesPodName, uid: opts.kubernetesPodUID }
        : undefined
    }
  }

  if (opts.cloudMetadata) {
    payload.cloud = Object.assign({}, opts.cloudMetadata)
  }

  return payload
}

module.exports = {
  LambdaExtensionTransport
}
