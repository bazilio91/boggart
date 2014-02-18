var modules = require('./config/modules.js'),
    _ = require('lodash');

'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);


    var moduleFiles = [],
        watchModuleJS = [];
    _.each(modules, function (options, moduleName) {
        var module = require(moduleName);
        moduleFiles[moduleFiles.length] = {
            expand: true,
            cwd: 'node_modules/' + moduleName + '/client/scripts',
            src: ['**'],
            dest: '.tmp/scripts/modules/' + module.name
        };

        moduleFiles[moduleFiles.length] = {
            expand: true,
            cwd: 'node_modules/' + moduleName + '/client/styles',
            src: ['**'],
            dest: '.tmp/styles/process/',
            filter: 'isFile',
            rename: function (dest, src) {
                return dest + moduleName + '_' + src;
            }
        };

        watchModuleJS[watchModuleJS.length] = [
            'node_modules/' + moduleName + '/client/scripts/**/*.js'
        ]
    });

    grunt.initConfig({
        config: {
            app: 'client',
            server: 'server',
            dist: 'dist'
        },
        concat: {
            server: {
                src: ['.tmp/styles/*.css'],
                dest: '.tmp/styles/main.css'
            }
        },
        watch: {
            compass: {
                files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['copy:styles', 'compass:server', 'concat:server', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= config.app %>/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= config.app %>}/scripts/{,*/}*.js',
                    '<%= config.app %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
                ]
            },
            express: {
                options: {
                    nospawn: true
                },
                files: ['<%= config.server %>/**/*.js'],
                tasks: ['express:server']
            },
            jst: {
                files: ['<%= config.app %>/scripts/templates/{,*/}*.ejs'],
                tasks: ['jst']
            },
            modulesJS: {
                files: watchModuleJS,
                tasks: ['copy:modules']
            }
        },
        shell: {
            dmg: {
                command: 'hdiutil create ./webkitbuilds/releases/tissue/mac/Home.dmg -srcfolder ./webkitbuilds/releases/home/mac/ -ov'
            }
        },
        nodewebkit: {
            options: {
                build_dir: './webkitbuilds', // Where the build version of my node-webkit app is saved
                mac: true, // We want to build it for mac
                win: true, // We want to build it for win
                linux32: false, // We don't need linux32
                linux64: false, // We don't need linux64
                version: '0.8.2'
            },
            // ResHacker.exe -addoverwrite "Project.exe", "Project.exe", "ProgramIcon.ico", ICONGROUP, MAINICON, 0
            src: ['./*'] // Your node-wekit app
        },

        connect: {
            options: {
                port: 3000,
                hostname: 'localhost'
            },
            test: {
                options: {
                    base: [
                        '.tmp',
                        'test',
                        '<%= config.app %>'
                    ]
                }
            }
        },
        express: {
            options: {
                port: 3000
            },
            dist: {
                options: {
                    script: '<%= config.dist %>/<%= config.server %>/app.js'
                }
            },
            server: {
                options: {
                    script: '<%= config.server %>/app.js'
                }
            }
        },
        jst: {
            options: {
                amd: true,
                processName: function (filename) {
                    return filename.replace('client/scripts/templates/', '').replace('.ejs', '');
                }
            },
            compile: {
                files: {
                    '.tmp/scripts/templates.js': ['<%= config.app %>/scripts/templates/{,*/}*.ejs']
                }
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= config.dist %>/*',
                            '!<%= config.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<% config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },
        compass: {
            options: {
                sassDir: '.tmp/styles/process/',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '.tmp/images',
                javascriptsDir: '.tmp/scripts',
                fontsDir: '.tmp/fonts',
                importPath: '<%= config.app %>/components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/fonts',
                relativeAssets: false,
                assetCacheBuster: false
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= config.dist %>/<%= config.app %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },
        requirejs: {
            dist: {
                options: {
                    baseUrl: '<%= config.app %>/scripts',
                    paths: {
                        'templates': '../../.tmp/scripts/templates'
                    },
                    optimize: 'none',
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/<%= config.app %>/scripts/{,*/}*.js',
                        '<%= config.dist %>/<%= config.app %>/styles/{,*/}*.css',
                        '<%= config.dist %>/<%= config.app %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        '<%= config.dist %>/<%= config.app %>/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>/<%= config.app %>'
            },
            html: '<%= config.app %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>/<%= config.app %>']
            },
            html: ['<%= config.dist %>/<%= config.app %>/{,*/}*.html'],
            css: ['<%= config.dist %>/<%= config.app %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/images',
                        src: '{,*/}*.{gif,jpeg,jpg,png}',
                        dest: '<%= config.dist %>/<%= config.app %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= config.dist %>/<%= config.app %>/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>',
                        src: '*.html',
                        dest: '<%= config.dist %>/<%= config.app %>'
                    }
                ]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>/<%= config.app %>',
                        src: [
                            '*.{ico,png,txt}',
                            'images/{,*/}*.{webp,gif}',
                            'fonts/{,*/}*.*',
                            'components/sass-bootstrap/fonts/*.*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '<%= config.server %>',
                        dest: '<%= config.dist %>/<%= config.server %>',
                        src: ['app.js']
                    }
                ]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/styles',
                dest: '.tmp/styles/process',
                src: '**'
            },
            modules: {
                expand: true,
                cwd: './',
                files: moduleFiles
            }
        },
        modernizr: {
            devFile: '<%= config.app %>/components/modernizr/modernizr.js',
            outputFile: '<%= config.dist %>/<%= config.app %>/components/modernizr/modernizr.js',
            files: [
                '<%= config.dist %>/<%= config.app %>/scripts/{,*/}*.js',
                '<%= config.dist %>/<%= config.app %>/styles/{,*/}*.css',
                '!<%= config.dist %>/<%= config.app %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            server: [
                'compass',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'compass',
                'copy:styles',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        bower: {
            options: {
                exclude: ['modernizr']
            },
            all: {
                rjsConfig: '<%= config.app %>/scripts/main.js'
            }
        }
    });

    grunt.registerTask('s', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'express:dist', 'watch']);
        }

        grunt.task.run([
            'clean:server',
            'copy:modules',
            'jst',
            'concurrent:server',
            'autoprefixer',
            'express:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'jst',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jst',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'requirejs',
        'concat',
        'cssmin',
        'uglify',
        'modernizr',
        'copy:dist',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('exe', [
        'nodewebkit',
        'shell:dmg'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
