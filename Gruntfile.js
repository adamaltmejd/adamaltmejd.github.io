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
            development: ['_site'],
            production: ['_site'],
            update: ['_site','_sass/bootstrap/**/*','_sass/fa/**/*','/assets/fonts/**/*']
        },

        // Using grunt-sass in development
        sass: {
            development: {
                options: {
                    outputStyle: 'expanded',
                    includePaths: ['_sass/'],
                    sourceMap: true,
                    bundleExec: true
                },
                files: { '_site/assets/css/style.css': '_sass/main.scss' }
            }
        },

        jekyll: {
            options: {
                bundleExec: true
            },
            development: {
                options: {
                    drafts: true,
                    future: true,
                    raw: 'sass: \n' +
                         '    style: :expanded\n',
                    config: '_config.yml'
                }
            },
            production: {
                options: {
                    serve: true,
                    watch: true,
                    port: 8080,
                }

            }
        },

        copy: {
            fonts: {
                expand: true,
                src: ['bower_components/bootstrap-sass/assets/fonts/**', 'bower_components/font-awesome/fonts/*'],
                dest: 'assets/fonts/',
                flatten: true,
                filter: 'isFile'
            },
            bootstrap: {
                expand: true,
                cwd: 'bower_components/bootstrap-sass/assets/stylesheets/',
                src: ['**/*'],
                dest: '_sass/bootstrap/',
            },
            fontawesome: {
                expand: true,
                cwd: 'bower_components/font-awesome/scss/',
                src: ['**/*'],
                dest: '_sass/fa/',
            },
        },

        watch: {
            options: {forever: false},
            sass: {
                // We watch and compile sass files but don't live reload
                files: ['assets/css/main.scss', '_sass/**/*.{scss,sass}'],
                tasks: "sass:development"
            },
            jekyll: {
                // Instead, whenever any changes to the site are made
                //   (including building css files with watch task above)
                //   we run the jekyll-task and rebuild the site.
                files: ['_config.yml',
                        '*.html',
                        '*.md',
                        '_drafts/**/*',
                        '_includes/**/*',
                        '_layouts/**/*',
                        '_posts/**/*',
                        'assets/fonts/**/*',
                        'projects/**/*',
                        'teaching/**/*',
                        'cv/**/*'
                       ],
                tasks: "jekyll:development"
            },
            livereload: {
                // We then watch the output server for livereload.
                options: { livereload: true },
                files: ['_site/**/*.{html,css,js}']
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
    grunt.loadNpmTasks('grunt-sass');
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
        'jekyll:development',
        'sass:development',
        'connect',
        'open',
        'watch'
    ]);

    // Production task - we do not need to use jekyll task here since github will do this
    //   instead, we only need to make sure the directory is ready to be pushed.
    grunt.registerTask('prod', [
        'clean:production',
        'jekyll:production',
    ]);

    // Update task, run to update dependencies
    grunt.registerTask('update', [
        'clean:update',
        'copy:fonts',
        'copy:bootstrap',
        'copy:fontawesome',
    ]);
};
