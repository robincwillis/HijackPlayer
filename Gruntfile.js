module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		watch: {
			compass : {
				files: ['src/sass/*'],
				tasks: ['compass:dist']
			},
			uglify : {
				files: ['src/js/*.js'],
				tasks: ['uglify:dist']
			}
		},

		uglify: {
			dist: {
				options : {
					sourceMap: function (path) {
						return 'application.min.js.map';
					}
				},
				files: {
					'js/application.min.js': [
					'src/js/*js',
					]
				}
			},
			vendor: {
				files: {
					'js/vendor.min.js' : [
					'vendor/js/jquery-1.10.2.min.js',
					'vendor/js/jquery.mobile.vmouse.js',
					'vendor/js/underscore-min.js',
					]
				}
			}
		},

		compass: {
			dist: {
				options: {
					sassDir: 'src/sass',
					cssDir: 'css',
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('dev', ['build','watch']);
	grunt.registerTask('build', ['uglify:vendor','uglify:dist','compass']);
	grunt.registerTask('default',['dev']);

};