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
                    './public/js-safe/js/auth.js': ['./public/javascripts/auth/auth.js'],
                    './public/js-safe/js/bargraphctrl.js': ['./public/javascripts/controllers/graphbarctrl.js'],
                    './public/js-safe/js/chronoctrl.js': ['./public/javascripts/controllers/chronoctrl.js'],
                    './public/js-safe/js/graphctrl.js': ['./public/javascripts/controllers/graphctrl.js'],
                    './public/js-safe/js/mainctrl.js': ['./public/javascripts/controllers/mainctrl.js'],
                    './public/js-safe/js/navctrl.js': ['./public/javascripts/controllers/navctrl.js'],
                    './public/js-safe/js/postctrl.js': ['./public/javascripts/controllers/postctrl.js'],
                    './public/js-safe/js/profilectrl.js': ['./public/javascripts/controllers/profilectrl.js'],
                    './public/js-safe/js/chronodataservice.js': ['./public/javascripts/services/chronodataservice.js'],
                    './public/js-safe/js/postservice.js': ['./public/javascripts/services/postservice.js'],
                    './public/js-safe/app.js': ['./public/javascripts/angularApp.js']
                }
            }
        },
        concat: {
            js: { //target
                src: ['./public/js-safe/app.js', './public/js-safe/js/*.js'],
                dest: './public/js/app.js'
            }
        },
        uglify: {
            js: { //target
                src: ['./public/js/app.js'],
                dest: './public/js/app.js'
            }
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');

    //register grunt default task
    grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify']);
}
