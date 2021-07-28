
// exports.handler = function handler(event, context, callback) {
//   const response = {
//       statusCode: 200,
//       body: "default"
//   };
//   const options = {
//     hostname: 'www.google.com',
//     port: '443',
//     path: '/',
//     method: 'GET'
//   }

//   const transport = require('https')

//   const req = transport.request(options, function(res) {
//     const finalData = []

//     res.on('data', function(data) {
//       finalData.push(data)
//     })

//     res.on('end', function(data) {
//       console.log('all the data')
//       response.body = finalData.join('')
//       callback(null, response)
//     })
//   })

//   req.on('socket', function (socket) {
//       socket.unref()
//   })

//   req.end()
// }

// exports.handler = function handler (event, context, callback) {
//     setTimeout(function () {
//         callback(null, 'hi')
//     }, 1000).unref() // <--- this unref
// }

// exports.handler = function handler (event, context, callback) {
//     callback(null, 'hello world')
// }
const SocketTransport = require('elastic-apm-node/lib/socket-transport')
const apm = require('elastic-apm-node').start({
    serverless:'aws-lambda',
  //   transport: function() {
  //   // const {NoopTransport} = require('./node_modules/elastic-apm-node/lib/noop-transport')

  //   return new SocketTransport({
  //     agentName: 'foo',
  //     agentVersion: 'bar',
  //     serviceName: 'baz',
  //     userAgent: 'bing',
  //   })
  // }
})
exports.handler = apm.lambda(function handler (event, context, callback) {
  console.log("asbefore")
  callback(null, `Hello Science!`)
  console.log("asafter")
})

// exports.handler = apm.lambda(function handler (event, context, callback) {
//   const response = {
//       statusCode: 200,
//       body: "hello APM wrapped"
//   };
//   callback(null, response)
// })

// exports.handler = apm.lambda(function handler (event, context, callback) {
//   const response = {
//       statusCode: 200,
//       body: "hello APM unwrapped"
//   };
//   callback(null, response)
// })

// exports.handler = async (event, context) => {
//   // console.log(context)
//   // TODO implement
//   const response = {
//       statusCode: 200,
//       body: "hello world"
//   };
//   return response;
// };
