module.exports = function(grunt) {

    grunt.initConfig({

        // configure nodemon
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },
        mochaTest: {
            local: {
                /*
                options: {
                    reporter: 'spec',
                    //captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
                    ui: 'tdd'
                },
                */
                src: ['test/*.js']
            },
        },
        jshint: {
            options: {
              "globals":{"angular": false},
              node:true,
	      reporter: 'node_modules/jshint-html-reporter/reporter.js',
	      reporterOutput: 'jshint.html'
            },
            client:['public/**/*.js'],
            server:['controllers/**/*.js',
                    'models/**/*.js',
                    '*.js',
                    'routers/**/*.js',
                    'sockets/**/*.js'],
            tests:['test/**/*.js']
        },
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
            }
        }

    });

    // ling our js
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // load nodemon
    grunt.loadNpmTasks('grunt-nodemon');

    // register the nodemon task when we run grunt
    grunt.registerTask('default', ['nodemon']);

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.registerTask('coverage', ['mocha_istanbul']);
    // Test
    grunt.registerTask('test', ['mochaTest:local']);

};
