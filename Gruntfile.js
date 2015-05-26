'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: true,
                ignores: ['node_modules/**/*']
            },
            all: ['./**/*.js']
        },

        jscs: {
            src: [
                './**/*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                }
            },
            src: ['test.js']
        }
    });

    grunt.registerTask('lint', ['jshint', 'jscs']);
    grunt.registerTask('test', ['mochaTest']);
};
