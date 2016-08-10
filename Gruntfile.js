
module.exports = function(grunt){
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect:{
			server:{
				options:{
					port: 9001,
					hostname: 'localhost',
					open: true,
					livereload: true
				}
			}
		},
		less: {
			'app/build/css/style.css': ['app/assets/css/style.less'],
			options: {
				compress: true,
				yuicompress: false,
				optimization: 2,
				cleancss:false,
				syncImport: false,
				strictUnits:false,
				strictMath: true,
				strictImports: true,
				ieCompat: false
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: ['app/src/**/*.js'],
				dest: 'app/build/js/app.js',
			}
		},
		watch: {
			scripts: {
				files: ['**/*.js','**/*.less','**/*.html'],
				tasks: ['default'],
				options: {
					spawn: false
				},
				configFiles: {
					files: [ 'Gruntfile.js', 'config/*.js' ],
					options: {
						reload: true
					}
				}
			},
		}
	});

		//carregar plugins
		grunt.loadNpmTasks('grunt-contrib-connect');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-cssmin');
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-watch');
		grunt.loadNpmTasks('grunt-contrib-less');

		grunt.registerTask('createserver', ['connect:server']);
		grunt.registerTask('minify', ['concat']);
		grunt.registerTask('default', ['less','minify']);
		grunt.registerTask('run', ['createserver','default','watch']);
	}
