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

    grunt.registerTask('seturl', '', function() {
        var dataMain = grunt.file.read("dest/js/main.js");
        var mainArray = dataMain.split("\n"), 
            line, newMain = [];
        for (var k = 0; k < mainArray.length; k++){
            line = mainArray[k];
            grunt.log.writeln(line)
            if (line.indexOf('DEBUG') > -1&&line.indexOf('if') == -1) line = 'window.DEBUG = false;\n'
            newMain.push(line);
            grunt.log.writeln(line)
        }
        grunt.file.write("dest/js/main.js", newMain.join("\n"));
    });

    grunt.registerTask('temp',['underscore:compile']);
    grunt.registerTask('set',["clean", 'underscore:compile', "copy", "seturl"]);
    grunt.registerTask('debug',["clean", 'underscore:compile', "copy"]);
};