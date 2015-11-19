/*
This script is injected into Patari webapp and used to communicate with host app.
*/

var ipc = require('ipc');
var path = require('path');
var observe = require(__dirname + "/libs/observer.js");
var dom = require(__dirname + "/libs/domhelpers.js");
global.ipc = ipc;


//var last_playlist_update = 0;
var update_atleast_after = 1000; //used to limit updates when observer below goes crazy with dom updates
var scheduledUpdate=false;

window.onload = function(){

	// add watch on changes to playlist and send the playlist to host
	var playlistDOM = dom.getPlaylistContainer();
	observe(playlistDOM[0],function(){
		//cancel any previously scheduled update
		if (scheduledUpdate)
			clearTimeout(scheduledUpdate);

		scheduledUpdate = setTimeout(function(){
			scheduledUpdate = false;
			var list = dom.getPlaylistItems();
			ipc.send('playlist_update',list);

		},update_atleast_after)
		
		
	});
}


ipc.on('mediabuttons', function(arg) {
  console.log(arg);
  if (arg==="playpause"){
  	dom.mediaPlayPause();
  }
  if (arg==="next"){
  	dom.mediaNext();
  }
  if (arg==="previous"){
  	dom.mediaPrevious();
  }
});

ipc.on('playlist_play', function(arg) {
	dom.playPlaylistItem(arg);
});


ipc.on('notify', function(arg) {
	console.log("notify",arg)
	var myNotification = new Notification(arg.Title,{body:arg.body,icon:arg.icon});
});