module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        clean: ["dest", "temp"],
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
        react: {
            single_file_output: {
                files: [{
                    expand: true,
                    cwd: 'js/',
                    src: ['**/*.jsx'],
                    dest: 'js/'
                }]
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
                srcBasePath: 'temp/js/', // the base Path you want to remove from the `key` string in the mapping file
                destBasePath: 'dest/js/', // the base Path you want to remove from the `value` string in the mapping file
                // flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
                hashLength: 8, // hash length, the max value depends on your hash function
                // hashFunction: function(source, encoding) { // default is md5
                //     return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
                // }
            },
            js: {
                files: [{
                    expand: true,
                    cwd: 'temp/',
                    src: ['js/**/*.js', 'js/*.js'],
                    dest: 'dest/'
                }]
            }
        },
        getpaths: {
            options: {
                mapping: 'assets.json', 
                srcBasePath: 'js/'
            },
            js: {
                src: ['js/**/*.js', 'js/*.js'], 
                dest: ''
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
                        "libs/bootstrap-switch.js",
                        "libs/socket.io-1.4.5.js"
                    ]
                }
            },
            js: {
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
            },
            main: {
                options: {
                    compress: true,
                    mangle: {
                        except: ['define', 'exports', 'require']
                    }
                },
                files: {
                    'dest/js/main.js': ['temp/js/main.js']
                }
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
            other: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['css/*', 'css/**/*'],
                    dest: 'dest/'
                }, {
                    expand: true,
                    cwd: '',
                    src: ['libs/require.min.js',
                        "libs/jquery.min.js",
                        "libs/bootstrap.min.js",
                        "libs/particles.min.js",
                        "libs/app.js",
                        "libs/echarts.min.js",
                        "libs/echart-plain.js",
                        "libs/react.backbone.js",
                        "libs/create-react-class.js",
                        "libs/react.js",
                        "libs/react-dom.js",
                        "libs/react-bootstrap.js"
                    ], 
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
            },
            main: {
                expand: true,
                cwd: '',
                src: ['js/main.js'],
                dest: 'temp/'
            }, 
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
    require("./build/hash")(grunt);
    require("./build/getPaths")(grunt);
    grunt.loadNpmTasks('grunt-react');

    var modifyFile = function(filePath, key, val, setQeqPath) {
        grunt.log.writeln(filePath)
        var dataMain = grunt.file.read(filePath);
        var mainArray = dataMain.split("\n"),
            line, newMain = [], isSkip = false;
        for (var k = 0; k < mainArray.length; k++) {
            line = mainArray[k];
            if (line.indexOf('//PATH START===') > -1) isSkip = true;
            if (line.indexOf('//PATH END===') > -1) {
                line = '';
                isSkip = false;
            }
            if (isSkip || line === '') continue;
            if (line.indexOf(key) > -1 && line.indexOf('if') == -1) {
                grunt.log.writeln(line)
                line = val;
                grunt.log.writeln(line)
            }
            newMain.push(line);
        }
        var content = newMain.join("\n");
        if (setQeqPath) {
            var requirePath = grunt.file.read(setQeqPath);
            grunt.log.writeln(requirePath)
            content = '//PATH START=== \n var REQ_PATH = ' + requirePath + ";\n//PATH END===\n" + content;
            grunt.log.writeln(content)
            grunt.file.delete(setQeqPath)
        }
        grunt.file.write(filePath, content);
    };

    grunt.registerTask('set-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 2;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 2;');
    });

    grunt.registerTask('online-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 3;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 3;');
    });

    grunt.registerTask('test-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 4;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 4;');
    });

    grunt.registerTask('gray-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 5;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 5;');
    });

    grunt.registerTask('dev-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 6;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 6;');
    });

    grunt.registerTask('shanghai-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 7;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 7;');
    });

    grunt.registerTask('gateway-develop-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 8;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 8;');
    });

    grunt.registerTask('wuqing-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 9;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 9;');
    });

    grunt.registerTask('preonline-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 10;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 10;');
    });

    grunt.registerTask('debug-url', '', function() {
        modifyFile("temp/js/main.js", 'urlArgs', '\n');
        modifyFile("temp/js/main.js", 'DEBUG', 'window.DEBUG = 1.1;', "dest/assets.json");
        modifyFile("dest/login.html", 'DEBUG', 'window.DEBUG = 1.1;');
    });

    grunt.registerTask('module-url', '', function() {
        modifyFile("js/main.js", 'DEBUG', 'window.DEBUG = 1.1;', "assets.json");
        modifyFile("login.html", 'DEBUG', 'window.DEBUG = 1.1;');
    });

    grunt.registerTask('temp', ["clean", 'underscore', 'react']);
    grunt.registerTask('module', ["clean", 'underscore', 'getpaths', 'module-url']);
    grunt.registerTask('debug', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main','debug-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    // clean 清空temp dest 文件夹 
    // underscore 编译模版
    // copy:other 复制文件到dest文件夹
    // uglify:libs, uglify:js 压缩合并libs/里的文件到dest/libs/libs.js 且 压缩 js/ 到temp/js/
    // hash 给 temp/js/ 里的文件生成 MD5 到 dest/js/ , 除了main.js 文件，且 生成 requirejs 路径配置文件 dest/assets.json;
    // copy:main 复制 js/main.js 到 temp/js/main.js 
    // **-url 修改 temp/js/main.js、login.html文件的基本域名，且写入 dest/assets.json 中的路径配置
    // uglify:main 压缩 temp/js/main.js 到 dest/js/main.js
    // cssmin 压缩css文件到 dest/css/all.css
    // processhtml: 将html中的引用替换为 all.css 、libs.js
    // filerev & usemin: 生成 dest/js/main.js 、dest/libs/libs.js 和 dest/css/all.css 文件的MD5，并在文件中替换 
    grunt.registerTask('set', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'set-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    grunt.registerTask('online', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'online-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    grunt.registerTask('test', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'test-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    grunt.registerTask('gray', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'gray-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    grunt.registerTask('develop', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'dev-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    grunt.registerTask('shanghai', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'shanghai-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    grunt.registerTask('gatewaydevelop', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'gateway-develop-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    grunt.registerTask('wuqing', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'wuqing-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
    grunt.registerTask('preonline', ["clean", 'underscore', "copy:other", 'uglify:libs','uglify:js', 'hash', 
        'copy:main', 'preonline-url', 'uglify:main', "cssmin", 'processhtml', 'filerev', 'usemin'])
};