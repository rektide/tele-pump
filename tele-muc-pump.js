var http2 = require("http2")
var telestreamitize = require("telestreamitize")

// The callback to handle requests
function createTeleMucPumpHandler(opts){
	opts= opts|| {}
	opts.telestream= opts.telestream|| new telestreamitize()
	return function onRequest(request, response){
		if(request.url == '/messages.stream'){
			// guard 
			if(opts.guard && !response.push){
				response.writeHead(400)
				response.end()
				return
			}
			opts.telestream.on('*', function(msg){
				var push= response.push('/'/ + msg.sender + '/' + msg.time)
				push.writeHead(200)
				push.end(JSON.stringify(msg))
			})
			if(opts.close){
				response.writeHead(200)
				response.end()
			}else{
				// we're in it for real with a loonnnggg poll
				// l
				// o
				// n
				// g
				// p
				// o
				// l
				// l

				// is

				// l
				// o
				// n
				// g
				// &verticalTab;
			}
		}
	}
}

module.exports= createTeleMucPumpHandler

module.exports.main= function createServer(telestream){
	// Creating the server in plain or TLS mode (TLS mode is the default)
	var server
	if (process.env.HTTP2_PLAIN) {
		server = http2.raw.createServer({
			//log: log
		}, module.exports())
	} else {
		server = http2.createServer({
			//log: log,
			key: fs.readFileSync(path.join(__dirname, "/localhost.key")),
			cert: fs.readFileSync(path.join(__dirname, "/localhost.crt"))
		}, module.exports())
	}
	server.listen(process.env.HTTP2_PORT || 8080)
}

if(module === require.main){
	module.exports.main()
}
