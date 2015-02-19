module.exports = function(grunt) {
    var jsonConfig = {};
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                dest: 'site/dist/css/main.css',
                src: [
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'site/css/main.css'
                ]
            },
            js: {
                dest: 'site/dist/js/main.js',
                src: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-cache/dist/angular-cache.js',
                    'site/js/main.js'
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            'bower_components/bootstrap/dist/fonts/*'
                        ],
                        dest: 'site/dist/fonts/',
                        filter: 'isFile'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'copy']);
};