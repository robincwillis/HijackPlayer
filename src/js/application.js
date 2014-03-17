//Quick and dirty mobile detection (important for handling touch events)
function mobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

var app = app || {};

app = {

	models : {
		curTrack : -1, //id of the current track
		isDragging : false, //mouse drag detection
		audio : new Audio() //html5 audio object
	},

	controllers : {
		//Loads and plays a track from the playlist
		loadTrack : function(id){
			app.models.curTrack = id;
			app.models.audio.setAttribute("src",app.models.tracks[id].src);
			app.models.audio.play();
			app.views.updatePlaylist(id);
			app.views.updateAudioInfo(id);
			app.views.updatePlayerControls(app.models.audio.paused);
		},
		//Play or pause the track
		playTrack : function(){
			if(app.models.audio.paused){
				app.models.audio.play();
				app.views.updateProgress();
			}else{
				app.models.audio.pause();
			}
			app.views.updatePlayerControls(app.models.audio.paused);
		},
		//Go to the next track
		nextTrack : function(){
			var id = parseInt(app.models.curTrack)+1 < app.models.tracks.length ? parseInt(app.models.curTrack)+1 : 0;
			app.controllers.loadTrack(id);
		},
		//Go to the previous track
		prevTrack : function(){
			var id = parseInt(app.models.curTrack) > 0 ? parseInt(app.models.curTrack)-1 : app.models.tracks.length-1;
			app.controllers.loadTrack(id);
		},
		//Seek through the track
		seekTrack : function(percentage){
			app.models.audio.currentTime = percentage * app.models.audio.duration;
			app.views.updateProgress();
		}
	},

	views : {
		//Toggle navbar icon state
		updateNavigation : function(){
			$('.expand-icon, .collapse-icon').toggleClass('hidden');
		},
		//Display amount of the track that is buffered over the progressbar
		updateBuffered : function(){
			$('.progress-preview').remove();
			var ranges = [];
				for(var i = 0; i < app.models.audio.buffered.length; i ++){
					ranges.push([
						(100 / app.models.audio.duration )* app.models.audio.buffered.start(i),
						(100 / app.models.audio.duration )* app.models.audio.buffered.end(i)
					]);
			}
			for(var i=0; i < ranges.length; i++){
				$('#progressBar').append('<div class="progress-preview" style="left:'+ranges[i][0]+'%; width:'+ranges[i][1]+'%;"></div>')
			};
		},
		//Display amount of the track that has been played
		updateProgress : function(){
			var progress = $("#progress");
			var percentage = app.models.audio.currentTime > 0 ? (100 / app.models.audio.duration) * app.models.audio.currentTime : 0;
			progress.css({width:percentage + "%"});
		},
		//Toggle the state of the play/pause buttons
		updatePlayerControls : function(paused){
			if(paused){
				$('.pause-icon').addClass('hidden');
				$('.play-icon').removeClass('hidden');
			}else{
				$('.pause-icon').removeClass('hidden');
				$('.play-icon').addClass('hidden');
			}
		},
		//Update the player with the information for the currently playing track
		updateAudioInfo : function(id){
			$('.audio-info .song-title').empty().append(app.models.tracks[id].title);
			$('.audio-info .artist-album-info').empty().append(app.models.tracks[id].artist + " | " + app.models.tracks[id].album);
			$('.album-cover').empty().append('<img src="'+app.models.tracks[id].cover+'">');

			if(app.models.tracks[id].waveform !== undefined){
				$('.waveform').css({
					'background-image': 'url('+app.models.tracks[id].waveform+')'
				});
			}
			if ( $('.download').parent().is( "a" ) ) {
		    	$('.download').unwrap();
		 	}
		    $('.download').wrap( '<a href="'+app.models.tracks[id].src+'" target="_blank"></a>' );
		},
		//Update the duration for the currently playing track
		updateDuration :  function(){
			var seconds = app.models.audio.currentTime;
			minutes = Math.floor(seconds / 60);
		    minutes = (minutes >= 10) ? minutes : "0" + minutes;
		    seconds = Math.floor(seconds % 60);
		    seconds = (seconds >= 10) ? seconds : "0" + seconds;
		    $('.audio-info .song-duration').empty().append( minutes + ":" + seconds);
		},
		//Update the playlist to indicate playing track
		updatePlaylist : function(id){
			var $curTrackItem = $('.playlist').children('#'+id);
			$('.action-icon').removeClass('hidden');
			$('.playing-icon').addClass('hidden');
			$curTrackItem.find('.action-icon, .playing-icon').toggleClass('hidden');
			$('.this .collapse-icon').toggleClass('hidden');
		},
		//Toggle between playlist and player view
		togglePlaylistPlayer : function(){
			$('#playlist-view').toggleClass('pos-left');
			$('#player-view').toggleClass('pos-right');
		},
		//Open player view (close playlist view)
		openPlayer : function(){
			$('#playlist-view').addClass('pos-left');
			$('#player-view').removeClass('pos-right');
		},
		//Open playlist view (close player view)
		openPlaylist : function(){
			$('#playlist-view').removeClass('pos-left');
			$('#player-view').addClass('pos-right');
		}
	},

	bindAudioEvents : function(){
		//On track time progress
		app.models.audio.addEventListener("timeupdate", this.views.updateProgress, false);
		//On track end
		app.models.audio.addEventListener("ended", this.controllers.nextTrack, false);
		//On track buffer progress
		app.models.audio.addEventListener("progress", this.views.updateBuffered, false);
	},

	bindEvents : function(){
		//Playlist Item Clicked
		$('body').on('click', '.playlist-track', function(e){
			e.preventDefault();
			app.views.openPlayer();
			if(app.models.curTrack === $(this).attr('id')){return;}
			app.views.updateNavigation();
			app.controllers.loadTrack($(this).attr('id'));
		});
		//Nav Playlist View Button Clicked
		$('.left-btn').on('vclick', function(e){
			e.preventDefault();
			if(!$('#playlist-view').hasClass('pos-left')){return;}
			app.views.openPlaylist();
			app.views.updateNavigation();
		});
		//Nav Track View Button Clicked
		$('.right-btn').on('vclick', function(e){
			e.preventDefault();
			app.views.togglePlaylistPlayer();
			app.views.updateNavigation();
		});
		//Prev Button Clicked
		$('.prev').on('vclick',function(e){
			app.controllers.prevTrack();
		});
		//Next Button Clicked
		$('.next').on('vclick',function(e){
			app.controllers.nextTrack();
		});
		//Play / Pause Button Clicked
		$('.play-pause').on('vclick',function(e){
			e.preventDefault();
			app.controllers.playTrack();
		});
		//Progressbar Clicked (Desktop / Mobile)
		$('.progress-bar').on('vclick',function(e){
			var parentOffset = $(this).offset();
			var parentWidth = $(this).width();
			var relX = e.pageX - parentOffset.left;
			var relY = e.pageY - parentOffset.top;
			var xPos = (relX/parentWidth * 100);
			app.controllers.seekTrack(relX/parentWidth);
		});
		//Progressbar Dragged (Desktop)
		if(!mobile()){
			$(".progress-bar").mousedown(function(e) {
				$(this).mousemove(function(e) {
					app.models.isDragging = true;
					var parentOffset = $(this).offset();
					var parentWidth = $(this).width();
					var relX = e.pageX - parentOffset.left;
					var relY = e.pageY - parentOffset.top;
					var xPos = (relX/parentWidth * 100);
					app.controllers.seekTrack(relX/parentWidth);
				});
			}).mouseup(function() {
				var wasDragging = app.models.isDragging;
				app.models.isDragging = false;
				$(this).unbind("mousemove");
			});
		}
		//Progressbar Dragged (Mobile)
		if(mobile()){
			$('#progressBar').on('vmousemove', function(e){
				var parentOffset = $(this).offset();
				var parentWidth = $(this).width();
				var relX = e.pageX - parentOffset.left;
				var relY = e.pageY - parentOffset.top;
				var xPos = (relX/parentWidth * 100);
				$(this).find(".progress-preview").css({
					width: xPos + "%"
				});
				app.controllers.seekTrack(relX/parentWidth);
			});
		}
	},
	bootstrap : function(json){
		app.models.tracks = json;
		$('.playlist').empty();
		//(small hack) Adding padding to this element screws up the way iscroll calculates scrolling so we push content down with an element in the list
		$('.playlist').append('<li class="playlist-buffer"></li>');
		//Load tracks into the DOM
		$.each(app.models.tracks, function(i, track){
			track.id = i;
			var trackTmpl = _.template(Templates["track"], track);
			$('.playlist').append(trackTmpl);
		});
		//Attach iScroll to the Playlist
		if(mobile()){
			myScroll = new iScroll('playlist-view');
		}
		//Bind Events
		app.bindEvents();
		app.bindAudioEvents();
	},
	//Get playlist json file
	init : function(){
		$.getJSON('playlist.json',this.bootstrap);
		document.audio = this.models.audio;
	}
}

app.init();