var modules = require('./config/modules.js'),
    _ = require('lodash');

'use strict';

module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);


    var moduleFiles = [],
        moduleLess = {},
        watchModuleJS = ['config/modules.js'],
        watchServerModuleJS = ['config/modules.js'],
        moduleEJS = []
    _.each(modules, function (options, moduleName) {
        var module = require(moduleName);
        moduleFiles[moduleFiles.length] = {
            expand: true,
            cwd: 'node_modules/' + moduleName + '/client/scripts',
            src: ['**'],
            dest: '.tmp/scripts/modules/' + module.name
        };


        moduleLess['.tmp/styles/process/' + module.name + '.css'] =
            'node_modules/' + moduleName + '/client/styles/style.less';

        watchModuleJS[watchModuleJS.length] = [
            'node_modules/' + moduleName + '/client/scripts/**/*.js'
        ];

        watchServerModuleJS[watchServerModuleJS.length] = [
            'node_modules/' + moduleName + '/*.js'
        ];

        moduleEJS[moduleEJS.length] = 'node_modules/' + moduleName + '/client/scripts/templates/**/*.ejs'
    });

    grunt.initConfig({
        config: {
            app: 'client',
            server: 'server',
            dist: 'dist'
        },
        concat: {
            server: {
                src: ['.tmp/styles/process/*.css'],
                dest: '.tmp/styles/main.css'
            }
        },
        watch: {
            less: {
                files: ['<%= config.app %>/styles/**/*.less'].concat(_.values(moduleLess)),
                tasks: ['less', 'concat:server', 'autoprefixer']
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
                files: ['<%= config.server %>/**/*.js'].concat(watchServerModuleJS),
                tasks: ['express:server']
            },
            jst: {
                files: ['<%= config.app %>/scripts/templates/{,*/}*.ejs'].concat(moduleEJS),
                tasks: ['jst']
            },
            modulesJS: {
                files: watchModuleJS,
                tasks: ['copy:modules']
            }
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
                    if (filename.indexOf('node_modules') === 0) {
                        return filename.replace(/node_modules\/(.*)\/client\/scripts\/templates\/(.*)\.ejs/, '$1/$2')
                    } else {
                        return filename.replace('client/scripts/templates/', '').replace('.ejs', '');
                    }
                }
            },
            compile: {
                files: {
                    '.tmp/scripts/templates.js': ['<%= config.app %>/scripts/templates/{,*/}*.ejs'].concat(moduleEJS)
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
        less: {
            dist: {
                files: _.merge(
                    {'.tmp/styles/process/main.css': '<%= config.app %>/styles/main.less'},
                    moduleLess
                )
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
                        src: '*.css',
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
                'less'
            ],
            test: [
                'less'
            ],
            dist: [
                'less',
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
            'concat',
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

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
