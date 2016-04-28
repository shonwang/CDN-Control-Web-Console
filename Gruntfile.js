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
                files: {"js/template.js": ['tpl/**/*.html', 'tpl/*.html']}
            }
        },
        copy: {
            main: {
                files: [
                {
                    expand: true,
                    cwd: '',
                    src: ['css/*', 'css/**/*'],
                    dest: 'dest/'
                },
                {
                    expand: true,
                    cwd: '',
                    src: ['js/*', 'js/**/*'],
                    dest: 'dest/'
                },
                {
                    expand: true,
                    cwd: '',
                    src: ['libs/*', 'libs/**/*'],
                    dest: 'dest/'
                },
                {
                    expand: true,
                    cwd: '',
                    src: ['fonts/*', 'fonts/**/*'],
                    dest: 'dest/'
                },
                {
                    expand: true,
                    cwd: '',
                    src: ['images/*', 'images/**/*'],
                    dest: 'dest/'
                },
                {
                    expand: true,
                    cwd: '',
                    src: "*.html",
                    dest: 'dest/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-underscore-compiler');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    var modifyFile = function(filePath, key, val){
        var dataMain = grunt.file.read(filePath);
        var mainArray = dataMain.split("\n"), 
            line, newMain = [];
        for (var k = 0; k < mainArray.length; k++){
            line = mainArray[k];
            grunt.log.writeln(line)
            if (line.indexOf(key) > -1&&line.indexOf('if') == -1) line = val;
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

    grunt.registerTask('temp',['underscore:compile']);
    grunt.registerTask('debug',["clean", 'underscore:compile', "copy"]);
    grunt.registerTask('set',["clean", 'underscore:compile', "copy", "set-url"]);
    grunt.registerTask('test',["clean", 'underscore:compile', "copy", "test-url"]);
    grunt.registerTask('online',["clean", 'underscore:compile', "copy", "online-url"]);
    grunt.registerTask('gray',["clean", 'underscore:compile', "copy", "gray-url"]);
};