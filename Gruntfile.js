
module.exports = function(grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		meta: {
			js: 'js/*.js',
			test: 'test/**/*.js'
		},
		pkg: grunt.file.readJSON('package.json'),

		/**
		 * JSHint
		 */
		jshint: {
			all: [
				'Gruntfile.js',
				'<%= meta.test %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		concat: {
			common: {
				dest: "dist/framework.js",
				src: [
					"js/lib/jquery-1.10.1.js",
					"js/lib/underscore.js",
					"js/lib/backbone.js",
					"js/lib/raphael-min.js",
					"js/lib/g.raphael-min.js",
					"js/lib/g.pie-min.js",
					"js/frameworks.js"
				]
			}
		},
		/**
		 * Minify
		 */
		uglify: {
			options: {
				banner: "/** framework.js  daisuke shimizu, LINE inc. under the MIT License. */" ,
				preserveComments: "some"
			},
			target: {
				files: {
					"dist/framework-min.js": ["<%= concat.common.dest %>"]
				}
			}
		},
		/**
		 * Unit TEST
		 */
		jasmine : {
			src : '<%= meta.js %>',
			options : {
				vendor: [
					"js/lib/jquery-1.10.1.js",
					"js/lib/underscore.js",
					"js/lib/backbone.js",
					"js/lib/raphael-min.js",
					"js/lib/g.raphael-min.js",
					"js/lib/g.pie-min.js"
				],
				specs : '<%= meta.test %>'
			}
		},
		/**
		 * WATCH
		 */
		watch: {
			files: ["js/**/*.js", "*.html"],
			tasks: ['jshint', 'jasmine', 'concat', 'uglify']
		}

	});

	// Load the plugin task
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task
	grunt.registerTask('default', ['watch']);

};
