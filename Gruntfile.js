module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        clean: ["dest"],
        underscore: {
            compile: {
                options: {
                    namespace: "JST",
                    amd: true
                },
                files: {
                    "js/template.js": ['tpl/**/*.html', 'tpl/*.html']
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'dest/css/all.css': [
                        "css/bootstrap.min.css",
                        "css/jquery.datetimepicker.css",
                        "css/jquery-accordion-menu.css",
                        "css/monokai_sublime.min.css",
                        "css/animate.css",
                        "css/loaders.css",
                        "css/ks-frame.css",
                        "css/ks-fonts.css",
                        "css/zTreeStyle.css",
                        "css/domainList.css",
                        "css/bootstrap-switch.css",
                        "css/main.css"
                    ]
                }
            }
        },
        hash: {
            options: {
                mapping: 'dest/assets.json', //mapping file so your server can serve the right files
                srcBasePath: 'temp/js', // the base Path you want to remove from the `key` string in the mapping file
                destBasePath: 'dest/js', // the base Path you want to remove from the `value` string in the mapping file
                // flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
                hashLength: 8, // hash length, the max value depends on your hash function
                // hashFunction: function(source, encoding) { // default is md5
                //     return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
                // }
            },
            // js: {
            //     src: ['temp/js/**/*.js', 'temp/js/*.js'], //all your js that needs a hash appended to it
            //     dest: 'dest/' //where the new files will be created
            // }
            js: {
                files: [{
                    expand: true,
                    cwd: 'temp/',
                    src: ['js/**/*.js', 'js/*.js'],
                    dest: 'dest/'
                }]
            }
        },
        uglify: {
            libs: { //依赖库压缩
                options: {
                    compress: true,
                    mangle: {
                        except: ['define', 'exports', 'require']
                    }
                },
                files: {
                    'dest/libs/libs.js': [
                        "libs/jquery.min.js",
                        "libs/bootstrap.min.js",
                        "libs/jqPaginator.js",
                        "libs/jquery.datetimepicker.js",
                        "libs/jquery-accordion-menu.js",
                        "libs/jquery.ztree.core.js",
                        "libs/jquery.ztree.excheck.js",
                        "libs/jquery.ztree.exhide.js",
                        "libs/underscore.js",
                        "libs/backbone-min.js",
                        "libs/weige-alert.js",
                        "libs/highlight.min.js",
                        "libs/searchSelect.js",
                        "libs/plupload.full.min.js",
                        "libs/async.min.js",
                        "libs/bootstrap-switch.js"
                    ]
                }
            },
            bundle: {
                options: {
                    compress: true,
                    mangle: {
                        except: ['define', 'exports', 'require']
                    }
                },
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['js/**/*.js', 'js/*.js'],
                    dest: 'temp/'
                }]
            }
        },
        processhtml: {
            options: {},
            dist: {
                files: {
                    'dest/index.html': ['dest/index.html'],
                    'dest/map.html': ['dest/map.html']
                }
            }
        },
        filerev: {
            options: {
                algorithm: 'md5',
                length: 16
            },
            css: {
                src: ['dest/css/all.css']
            },
            js: {
                src: ['dest/js/main.js', 'dest/libs/libs.js']
            }
        },
        usemin: {
            html: ['dest/index.html', 'dest/map.html'],
            options: {
                assetsDirs: ['dest'],
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['css/*', 'css/**/*'],
                    dest: 'dest/'
                }, 
                // {
                //     expand: true,
                //     cwd: '',
                //     src: ['js/*', 'js/**/*'],
                //     dest: 'temp/'
                // }, 
                {
                    expand: true,
                    cwd: '',
                    src: ['libs/require.min.js',
                        "libs/jquery.min.js",
                        "libs/bootstrap.min.js",
                        "libs/particles.min.js",
                        "libs/app.js",
                        "libs/echarts.min.js",
                        "libs/echart-plain.js"

                    ], //['libs/*', 'libs/**/*'],
                    dest: 'dest/'
                }, {
                    expand: true,
                    cwd: '',
                    src: ['fonts/*', 'fonts/**/*'],
                    dest: 'dest/'
                }, {
                    expand: true,
                    cwd: '',
                    src: ['images/*', 'images/**/*'],
                    dest: 'dest/'
                }, {
                    expand: true,
                    cwd: '',
                    src: "*.html",
                    dest: 'dest/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-underscore-compiler');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-hash');

    var modifyFile = function(filePath, key, val) {
        var dataMain = grunt.file.read(filePath);
        var mainArray = dataMain.split("\n"),
            line, newMain = [];
        for (var k = 0; k < mainArray.length; k++) {
            line = mainArray[k];
            grunt.log.writeln(line)
            if (line.indexOf(key) > -1 && line.indexOf('if') == -1) line = val;
            newMain.push(line);
            grunt.log.writeln(line)
        }
        grunt.file.write(filePath, newMain.join("\n"));
    };

    grunt.registerTask('set-url', '', function() {
        modifyFile("dest/js/main.js", 'DEBUG', 'window.DEBUG = 2;\n');
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 2;\n');
    });

    grunt.registerTask('test-url', '', function() {
        modifyFile("dest/js/main.js", 'DEBUG', 'window.DEBUG = 4;\n');
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 4;\n');
    });

    grunt.registerTask('online-url', '', function() {
        modifyFile("dest/js/main.js", 'DEBUG', 'window.DEBUG = 3;\n');
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 3;\n');
    });

    grunt.registerTask('gray-url', '', function() {
        modifyFile("dest/js/main.js", 'DEBUG', 'window.DEBUG = 5;\n');
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 5;\n');
    });

    grunt.registerTask('dev-url', '', function() {
        modifyFile("dest/js/main.js", 'DEBUG', 'window.DEBUG = 6;\n');
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 6;\n');
    });

    grunt.registerTask('shanghai-url', '', function() {
        modifyFile("dest/js/main.js", 'DEBUG', 'window.DEBUG = 7;\n');
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 7;\n');
    });

    grunt.registerTask('gateway-develop-url', '', function() {
        modifyFile("dest/js/main.js", 'DEBUG', 'window.DEBUG = 8;\n');
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 8;\n');
    });

    grunt.registerTask('wuqing-url', '', function() {
        modifyFile("dest/js/main.js", 'DEBUG', 'window.DEBUG = 9;\n');
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 9;\n');
    });


    grunt.registerTask('gtest', ["clean", 'hash'])
    grunt.registerTask('temp', ['underscore:compile']);
    grunt.registerTask('debug', ["clean", 'underscore:compile', "copy", 'uglify', "cssmin", 'processhtml', 'filerev', 'usemin']);
    grunt.registerTask('set', ["clean", 'underscore:compile', "copy", "set-url", "uglify", "cssmin", 'processhtml', 'filerev', 'usemin']);
    grunt.registerTask('test', ["clean", 'underscore:compile', "copy", "test-url", "uglify", "cssmin", 'processhtml', 'filerev', 'usemin']);
    grunt.registerTask('online', ["clean", 'underscore:compile', "copy", "online-url", "uglify", "cssmin", 'processhtml', 'filerev', 'usemin']);
    grunt.registerTask('gray', ["clean", 'underscore:compile', "copy", "gray-url", "uglify", "cssmin", 'processhtml', 'filerev', 'usemin']);
    grunt.registerTask('develop', ["clean", 'underscore:compile', "copy", "dev-url", "uglify", "cssmin", 'processhtml', 'filerev', 'usemin']);
    grunt.registerTask('shanghai', ["clean", 'underscore:compile', "copy", "shanghai-url", "uglify", "cssmin", 'processhtml', 'filerev', 'usemin']);
    grunt.registerTask('wuqing', ["clean", 'underscore:compile', "copy", "wuqing-url", "uglify", "cssmin", 'processhtml', 'filerev', 'usemin']);
    grunt.registerTask('gatewaydevelop', ["clean", 'underscore:compile', "copy", "gateway-develop-url", "uglify", "cssmin", 'processhtml', 'filerev', 'usemin']);
};