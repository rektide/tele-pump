#!/usr/bin/env node
var
  assert= require("assert"),
  Telestreamitize = require("telestreamitize")
var
  Context=    require( "webpush-pump/Context"),
  Push=       require( "webpush-pump/push/Push"),
  RouteMaker= require( "webpush-pump/util/route-maker"),
  Server=     require( "webpush-pump/server"),
  subscribe=  require( "webpush-pump/subscribe/subscribe"),
  Subscribe=  require( "webpush-pump/subscribe/Subscribe")

// create a server
var
  ctx= new Context(),
  router= RouteMaker( subscribe)( ctx)
  opts= {
	ctx: ctx,
	routes: router.routes(),
	port: 8090
  },
  server= Server( opts)
Push.warn= true
Push.okEmpty= true
console.log( "server created")

// make a Subscribeable for "messages"
var
  messages= new Subscribe()
messages.id= "messages"
ctx.accept( messages)
console.log( "subscribeable 'messages' created")

// collect & stream irc messages to "messages"
var
  room= "#node-dc.dev"
Telestreamitize({
	channelFilter: room
}).then(function( telestream){
	console.log( "listening for irc messages in '"+ room+ "'")
	telestream.on( "message", function( msg){
		var
		  push= new Push({
			subscribe: messages
		  }),
		  headers= {
			"Location": ["messages", msg.room.substring(1), msg.time].join( "/")
		  }
		push.send( JSON.stringify( msg), headers, ctx)
	})
})
