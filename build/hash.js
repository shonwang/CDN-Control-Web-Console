
module.exports = function(grunt) {
  var path = require('path');
  var crypto = require('crypto');

  var getHash = function(source, encoding) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(source, encoding);
    return md5sum.digest('hex');
  }

  var unixify = function (path) {
    return path.split('\\').join('/');
  }

  grunt.registerMultiTask('hash', 'Append a unique hash to tne end of a file for cache busting.', function() {
    var options = this.options({
      srcBasePath: "",
      destBasePath: "",
      flatten: false,
      hashLength: 8,
      hashFunction: getHash,
      hashSeparator: '.'
    });
    var map = {};
    var mappingExt = path.extname(options.mapping);

    // If mapping file is a .json, read it and just override current modifications
    if (mappingExt === '.json' && grunt.file.exists(options.mapping)) {
      map = grunt.file.readJSON(options.mapping);
    }
    this.files.forEach(function(file) {
      file.src.forEach(function(src) {
        var source = grunt.file.read(src);
        var hash = options.hashFunction(source, 'utf8').substr(0, options.hashLength);
        var dirname = path.dirname(src);
        var rootDir = path.relative(options.srcBasePath, dirname);
        var ext = path.extname(src);
        var basename = path.basename(src, ext);
        if (basename === 'main') return;

        // Default destination to the same directory
        var dest = path.dirname(file.dest) || path.dirname(src);
        var newFile = basename + (hash ? options.hashSeparator + hash : '') + ext;
        var outputPath = path.join(dest, newFile);

        // Determine if the key should be flatten or not. Also normalize the output path
        //var key = path.join(rootDir, path.basename(src, ext));
        var key = path.basename(src, ext);
        var outKey = path.relative(options.destBasePath, path.join(dest, basename + (hash ? options.hashSeparator + hash : '')));
        if (options.flatten) {
          key = path.basename(src);
          outKey = path.basename(outKey);
        }

        grunt.file.copy(src, outputPath);
        grunt.log.writeln('Generated: ' + outputPath);

        map[unixify(key)] = unixify(outKey);
      });
    });

    if (options.mapping) {
      var output = '';

      if (mappingExt === '.php') {
        output = "<?php return json_decode('" + JSON.stringify(map) + "'); ?>";
      } else {
        output = JSON.stringify(map, null, "  ");
      }

      grunt.file.write(options.mapping, output);
      grunt.log.writeln('Generated mapping: ' + options.mapping);
    }

  });
};