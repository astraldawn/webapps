module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //grunt task configuration will go here
        // data
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    './public/js-safe/all.js': ['./public/javascripts/**/*.js'],
                    './public/js-safe/app.js': ['./public/javascripts/angularApp.js']
                }
            }
        },
        concat: {
            js: { //target
                src: ['./public/js-safe/app.js', './public/js-safe/all.js'],
                dest: './public/js/app.js'
            }
        },
        uglify: {
            js: { //target
                src: ['./public/js/app.js'],
                dest: './public/js/app.js'
            }
        },
        jshint: {
            all: ['./public/javascripts/**/*.js', './routes/*.js', './models/*.js']
        },
        jasmine_node: {
            options: {
                forceExit: true
            },
            all: []
        }
    })
    ;

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');

    //register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify']);
    grunt.registerTask('test', ['jshint', 'jasmine_node']);
};
