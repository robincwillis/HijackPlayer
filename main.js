window.mobile = function() {
var check = false;
(function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))window.location=b})(navigator.userAgent||navigator.vendor||window.opera);
return check;}

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

		updateProgress : function(){

			var progress = document.getElementById("progress");
			var value = 0;
			var fValue = 0;

			if (app.models.audio.currentTime > 0) {
				value = Math.floor((100 / app.models.audio.duration) * app.models.audio.currentTime);
				fValue = (100 / app.models.audio.duration) * app.models.audio.currentTime
			}
			progress.style.width = fValue + "%";

			app.views.updateDuration();
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
			app.views.updatePlayerControls();

		});

		//Save Button Clicked

		//Progressbar Clicked
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
		//Progressbar Touch Move
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

		//myScroll = new iScroll('#playlist-view');

		app.bindEvents();
		app.bindAudioEvents();
	},


	init : function(){

		$.getJSON('playlist.json',this.bootstrap);

		document.audio = this.models.audio;
	}

}

app.init();