function handler(event, context, callback) {
  const response = {
      statusCode: 200,
      body: "default"
  };
  const options = {
    hostname: 'www.google.com',
    port: '443',
    path: '/',
    method: 'GET'
  }

  const transport = require('https')

  const req = transport.request(options, function(res) {
    const finalData = []

    res.on('data', function(data) {
      finalData.push(data)
    })

    res.on('end', function(data) {
      console.log('all the data')
      response.body = finalData.join('')
      callback(null, response)
    })
  })

  req.on('socket', function (socket) {
      socket.unref()
  })

  req.end()
}

handler()
setTimeout(function(){
  console.log("this is a test")
}, 1000)
