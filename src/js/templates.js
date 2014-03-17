//use mustache style templates
_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g
};

Templates = {};

Templates.track = [
	'<li id="{{id}}" class="playlist-track">',
		'<div class="thumbnail" style="background-image:url({{cover}});" ></div>',
		'<div class="song-meta">',
			'<h2 class="song-title">{{title}}</h2>',
			'<h4 class="song-info">',
				'<span class="artist">{{artist}}</span>',
				'<span class="album">{{album}}</span>',
			'</h4>',
		'</div>',
		'<div class="action">',
			'<div data-icon="b" class="icon action-icon"></div>',
			'<div data-icon="&quot;" class="icon playing-icon hidden"></div>',
		'</div>',
	'</li>',

].join("\n");
