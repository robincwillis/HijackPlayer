function mobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

var app = app || {}

app = {

	models : {
			//tracks : [],
			curTrack : -1,
			isDragging : false,
		    audio : new Audio()

	},

	controllers : {

		loadTrack : function(id){

			app.models.curTrack = id;
			console.log(id);
			//Title

			//flip play pause button
			app.models.audio.setAttribute("src",app.models.tracks[id].src);
			app.models.audio.play();

			app.views.updatePlaylist(id);
			app.views.updateAudioInfo(id);
		},

		playTrack : function(){
			if(app.models.audio.paused){
				app.models.audio.play();
				app.views.updateProgress();
			}else{
				app.models.audio.pause();
			}
		},

		pauseTrack : function(){

		},

		nextTrack : function(){
			var id = parseInt(app.models.curTrack)+1 < app.models.tracks.length ? parseInt(app.models.curTrack)+1 : 0;
			app.controllers.loadTrack(id);
		},

		prevTrack : function(){
			var id = parseInt(app.models.curTrack) > 0 ? parseInt(app.models.curTrack)-1 : app.models.tracks.length-1;
			app.controllers.loadTrack(id);
		},

		seekTrack : function(percentage){
			app.models.audio.currentTime = percentage * app.models.audio.duration;
			app.views.updateProgress();

		}

	},

	views : {

		updateNavigation : function(){
			$('.expand-icon, .collapse-icon').toggleClass('hidden');
			//$('.expand-icon, .collapse-icon').toggleClass('hidden');

		},

		updateBuffered : function(){
			$('.progress-preview').remove();

			 var ranges = [];
			  for(var i = 0; i < app.models.audio.buffered.length; i ++)
			  {
			    ranges.push([
			     (100 / app.models.audio.duration )* app.models.audio.buffered.start(i),
			     (100 / app.models.audio.duration )* app.models.audio.buffered.end(i)
			      ]);
			  }
		     for(var i=0; i < ranges.length; i++){
		     	$('#progressBar').append('<div class="progress-preview" style="left:'+ranges[i][0]+'%; width:'+ranges[i][1]+'%;"></div>')
		     }
		},

		updateProgress : function(){

			var progress = document.getElementById("progress");
			var value = 0;
			var fValue = 0;

			if (app.models.audio.currentTime > 0) {
				//value = Math.floor((100 / app.models.audio.duration) * app.models.audio.currentTime);
				fValue = (100 / app.models.audio.duration) * app.models.audio.currentTime
			}
			progress.style.width = fValue + "%";

			//app.views.updateDuration();
		},

		updatePlayerControls : function(){
			$('.play-icon, .pause-icon').toggleClass('hidden');
		},

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

		updateDuration :  function(){
			var seconds = app.models.audio.currentTime;
			minutes = Math.floor(seconds / 60);
		    minutes = (minutes >= 10) ? minutes : "0" + minutes;
		    seconds = Math.floor(seconds % 60);
		    seconds = (seconds >= 10) ? seconds : "0" + seconds;
		    $('.audio-info .song-duration').empty().append( minutes + ":" + seconds);
		},

		updatePlaylist : function(id){

			var $curTrackItem = $('.playlist').children('#'+id);
			$('.action-icon').removeClass('hidden');
			$('.playing-icon').addClass('hidden');
			$curTrackItem.find('.action-icon, .playing-icon').toggleClass('hidden');
			$('.this .collapse-icon').toggleClass('hidden');

		},

		togglePlaylistPlayer : function(){

			$('#playlist-view').toggleClass('pos-left');
			$('#player-view').toggleClass('pos-right');

		},

		openPlayer : function(){

			$('#playlist-view').addClass('pos-left');
			$('#player-view').removeClass('pos-right');

		},

		openPlaylist : function(){

			$('#playlist-view').removeClass('pos-left');
			$('#player-view').addClass('pos-right');

		},

		togglePlayPause : function(){

			$('.pause-icon').removeClass('hidden');
			$('.play-icon').addClass('hidden');

		}

	},

	bindAudioEvents : function(){

		//On Track Progresss
		app.models.audio.addEventListener("timeupdate", this.views.updateProgress, false);
		//On Track End
		app.models.audio.addEventListener("ended", this.controllers.nextTrack, false);
		// stuff we can listen to on audio
		app.models.audio.addEventListener("progress", this.views.updateBuffered, false);
		//var duration = audio.duration;
		//var buffered = audio.buffered;
		//var bufferedEnd = audio.buffered.end();
		//audio.setAttribute("src","a.mp3");
		//audio.load(); // required for 'older' browsers
		// returns a TimeRanges object
		//var played = audio.played;
		// Is the player currently seeking?
		//var isSeeking = audio.seeking;
		// Is the media seekable?
		//var isSeekable = audio.seekable && audio.seekable.length > 0;
		// Time in seconds within which the media is seekable.
		//var seekableEnd = audio.seekable.end();
		//progress bar tap


	},

	bindEvents : function(){
		//Playlist Item Clicked
		$('body').on('vclick', '.playlist-track', function(e){
			e.preventDefault();
			app.views.openPlayer();

			if(app.models.curTrack === $(this).attr('id')){return;}

			app.views.togglePlayPause();
			app.views.updateNavigation();

			app.controllers.loadTrack($(this).attr('id'));
		});

		// //Nav Playlist View Button Clicked
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
			app.views.updatePlayerControls();

		});



		// //Progressbar Clicked
		$('.progress-bar').on('vclick',function(e){
			console.log('click');
			var parentOffset = $(this).offset();
			var parentWidth = $(this).width();
			var relX = e.pageX - parentOffset.left;
			var relY = e.pageY - parentOffset.top;
			var xPos = (relX/parentWidth * 100);
			app.controllers.seekTrack(relX/parentWidth);
		});

		//Progressbar Drag
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
					//$(window).unbind("mousemove");
					console.log('dragging');
				});
			}).mouseup(function() {
				var wasDragging = app.models.isDragging;
				app.models.isDragging = false;
				$(this).unbind("mousemove");
				if (!wasDragging) { //was clicking
					//$("#throbble").show();
				}
			});
		}
		// //Progressbar Touch Move
		if(mobile()){
			$('#progressBar').on('vmousemove', function(e){
				console.log(mobile);
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

		$.each(app.models.tracks, function(i, track){
			track.id = i;
			var trackTmpl = _.template(Templates["track"], track);
			$('.playlist').append(trackTmpl);
		});

		console.log('hello now now');
		myScroll = new iScroll('playlist-view');

		app.bindEvents();
		app.bindAudioEvents();
	},


	init : function(){

		$.getJSON('playlist.json',this.bootstrap);

		document.audio = this.models.audio;
	}

}

app.init();