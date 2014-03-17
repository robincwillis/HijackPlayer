HijackPlayer
============

####Don't be a sucker, take over the party from someone else's iphone

A small web app to stream playlists of audio through the browser, optimized for mobile devices and webkit. I developed this basically because I was sick of having to leave my phone hooked up to someone's stereo when I wanted to play or stream a song for a bunch of people. Most html5 audio and video players focus on cross browser compatibility and graceful degradation when html5 audio is not supported. This is all fine and good but for this purpose I don't really care so I set out to make my own little lightweight player.

####Demo

[Hijack Player](http://robincwillis.github.io/HijackPlayer/)

####Getting Started

download and install node.js

install grunt

	sudo npm-install -g grunt-cli

run in project dir

	npm-install --save-dev

to start compiling js / sass

	grunt

####Dependancies/Thanks

1. Jquery
2. Jquery Mobile UI (just the event bindings)
3. Underscore
4. Cubiq iScroll

####Todo

1. ~~show audio percent loaded~~
2. default image when cover is missing
3. handle missing audio
4. audio processing backend
5. image optimization for thumbnails