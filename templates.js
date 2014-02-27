//use mustache style templates
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};


Templates = {};

Templates.track = [
    // "<h1> {{fullName}} </h1>",
    // "<ul>",
    //    "<li> Email</li>"
    //     "<li> Phone: {{tel}} </li>",
    // "</ul>"


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


// for (var tmpl in Templates) {
//     if (Templates.hasOwnProperty(tmpl)) {
//         Templates[tmpl] = _.template(Templates[tmpl]); // Underscore example
//     }
// }