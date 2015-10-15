#!/usr/bin/env node
var
  assert= require("assert"),
  spdy= require("spdy"),
  EventWebPush= require( "event-webpush")

// create a client
var spdyAgent= new spdy.createAgent({
  host: "localhost",
  port: 8090,
  rejectUnauthorized: false,
  keepAlive: true,
  keepAliveMsecs: 30*60*1000
})
spdyAgent.on("error", function(err){
	console.log( "client error", err)
})
spdyAgent.on("end", function(end){
	console.log( "client end")
})

// log pushes
EventWebPush.on( "push", function( push){
	console.log("message-headers", push.headers)
	push.setEncoding("utf8")
	push.on( "data", function( data){
		console.log( "message-data", data)
	})
})

function subscribeToMessages(){
	// subscribe
	EventWebPush.request({
	  host: "localhost",
	  path: "/s/messages",
	  headers: {
		"Connection": "keep-alive"
	  },
	  agent: spdyAgent
	}, function( res){
		assert.fail(true, "Request should remain outstanding")
	}).on( "error", function(err){
		console.log( "get error", err)
	}).end()
}

module.exports = subscribeToMessages
module.exports.subscribeToMessages= subscribeToMessages

if( require.main=== module){
	subscribeToMessages()
}
