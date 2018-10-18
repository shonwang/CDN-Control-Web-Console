module.exports = function(grunt) {
  var path = require('path');

  var unixify = function(path) {
    return path.split('\\').join('/');
  }

  grunt.registerMultiTask('getpaths', 'generate requirejs.config paths', function() {
    var options = this.options({
      srcBasePath: "",
    });
    var map = {};
    var mappingExt = path.extname(options.mapping);
    // If mapping file is a .json, read it and just override current modifications
    if (mappingExt === '.json' && grunt.file.exists(options.mapping)) {
      map = grunt.file.readJSON(options.mapping);
    }
    this.files.forEach(function(file) {
      if (file.orig.srcBasePath)
        options.srcBasePath = file.orig.srcBasePath;
      file.src.forEach(function(src) {
        var source = grunt.file.read(src);
        var dirname = path.dirname(src);
        var rootDir = path.relative(options.srcBasePath, dirname);
        var ext = path.extname(src);
        var basename = path.basename(src, ext);
        if (basename === 'main') return;

        var key = path.basename(src, ext);
        var outKey = path.join(rootDir, basename);
        grunt.log.writeln('Generated: ' + outKey);

        map[unixify(key)] = unixify(outKey);
      });
    });

    if (options.mapping) {
      var output = JSON.stringify(map, null, "  ");
      grunt.file.write(options.mapping, output);
      grunt.log.writeln('Generated mapping: ' + options.mapping);
    }

  });
};