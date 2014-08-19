/* jshint node: true */
module.exports = function(grunt) {
    "use strict";
    // Guntfile to update and develop adamaltmejd jekyll page.
    // Regular posts are easily added without the help of this file.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
                ' * Website of <%= pkg.author %>\n' +
                ' * Version: <%= pkg.version %>\n' +
                ' * Licensed under <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
                ' * Uses Jekyll, with Twitter Bootstrap, and theme based on Bootswatch' +
                ' */\n\n',
        // Clean task to remove output folder
        clean: {
            development: ['_site', 'assets/css/style.css'],
            production: ['assets/css/style.css']
        },

        // We want a builting sass compiler for development as this is faster.
        // However in production we let Jekyll do it.
        sass: {
            development: {

            }
        },


        // less: {
        //     development: {
        //         files: { 'assets/css/style.css': 'assets/less/style.less' }
        //     },
        //     production: {
        //         options: { cleancss: true },
        //         files: { 'assets/css/style.css': 'assets/less/style.less' }
        //     }
        // },

        jekyll: {
            options: {
                bundleExec: true
            },
            development: {
                options: {
                    drafts: true,
                    future: true,
                    raw: 'sass: \n' +
                         '  style: :nested\n'
                }
            }
        },

        copy: {
            // css: {
            //     files: {
            //         '_site/assets/css/style.css': 'assets/css/style.css'
            //     }
            // },
            fonts: {
                expand: true,
                src: ['bower_components/bootstrap-sass-official/assets/fonts/**', 'bower_components/font-awesome/fonts/*'],
                dest: 'assets/fonts/'
            },
            bootstrap: {
                expand: true,
                src: ['bower_components/bootstrap-sass-official/assets/stylesheets/**'],
                dest: '_sass/bootstrap/',
            },
            fontawesome: {
                expand: true,
                src: ['bower_components/font-awesome/scss/*'],
                dest: '_sass/fa/',
            },
            bootswatch: {
                expand: true,
                src: ['bower_components/bootswatch-scss/yeti/*'],
                dest: '_sass/bootswatch/',
            }
        },

        watch: {
            less: {
                // We watch and compile sass files but don't live reload
                files: ['assets/less/*.less'],
                tasks: "less:development"
            },
            jekyll: {
                // Instead, whenever any changes to the site are made
                //   (including building css files with watch task above)
                //   we run the jekyll-task and rebuild the site.
                files: ['_config.yml',
                        '*.html',
                        '_drafts/**/*',
                        '_includes/**/*',
                        '_layouts/**/*',
                        '_posts/**/*',
                        'about/index.html',
                        'archives/index.html',
                        'assets/fonts/**/*',
                        'notes/index.html'
                       ],
                tasks: "jekyll"
            },
            css: {
                // For faster livereload we do not use Jekyll to load css-change
                files: ['assets/css/**/*'],
                tasks: "copy:css"
            },
            livereload: {
                // We then watch the output server for livereload.
                options: { livereload: true, interrupt: true },
                files: ['_site/**/*']
            }
        },

        connect: {
            // Using grunt-contrib-connect as server.
            server: {
                options: {
                    base: '_site/',
                    port: 8080,
                    livereload: true
                }
            }
        },

        open: {
            server: {
                path: 'http://localhost:<%= connect.server.options.port %>/'
            }
        }
    });
    // Load tasks
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-open");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-jekyll");

    // Register tasks (dev and prod)
    // The default task will show the usage
    grunt.registerTask('default', 'Prints usage', function () {
        grunt.log.writeln('Grunt script');
        grunt.log.writeln('------------------------');
        grunt.log.writeln('run "grunt dev", "grunt prod" or "grunt update"');
    });

    // Development task
    grunt.registerTask('dev', [
        'clean:development',
        'less:development',
        'jekyll:development',
        'connect',
        'open:server',
        'watch'
    ]);

    // Production task - we do not need to use jekyll task here since github will do this
    //   instead, we only need to make sure the directory is ready to be pushed.
    grunt.registerTask('prod', [
        'clean:production'
    ]);

    // Update task, run to update dependencies
    grunt.registerTask('update', [
        'clean',
        'copy:fonts',
    ]);
};
