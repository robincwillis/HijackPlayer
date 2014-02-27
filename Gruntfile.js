module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		watch: {
			compass : {
				files: ['src/sass/*'],
				tasks: ['compass:dist']
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
	//grunt.loadNpmTasks('grunt-contrib-handlebars');
	//grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('dev', ['build','watch']);
	grunt.registerTask('build', ['compass']);
	grunt.registerTask('default',['dev']);

};