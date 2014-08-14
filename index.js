var _        = require("lodash"),
    fs       = require("fs"),
    path     = require("path"),
    util     = require("util");


function whilst(value, test, iterator, callback) {
    test(value, function(err, result) {
        if (err) {
            callback(err);
            return;
        }

        if (result === true) {
            iterator(function(err, value) {
                if (err) {
                    callback(err);
                    return;
                }

                whilst(value, test, iterator, callback);
            });
        } else {
            callback(null, value);
        }
    });
}

function safely(filepath, options, cb) {
    var basename, basepath, extname, name,
        generator;

    if (_.isFunction(options)) {
        cb = options;
        options = {};
    }

    options = _.defaults(options || {}, safely.defaults);

    basename = path.basename(filepath);
    basepath = filepath.slice(0, filepath.lastIndexOf(basename));
    extname  = path.extname(basename);
    name     = basename.slice(0, basename.lastIndexOf(extname));
    extname  = extname.slice(1);

    generator = options.version();

    whilst(
        filepath,
        function(version, done) {
            fs.exists(version, function(result) {
                done(null, result);
            });
        },
        function(done) {
            generator(function(err, version) {
                if (err) {
                    done(err);
                    return;
                }

                done(null, basepath + util.format(options.format, name, version, extname));
            });
        },
        cb
    );
}

safely.defaults = {
    format: "%s(%d).%s",
    version: function() {
        var version = 0;
        return function(done) {
            done(null, ++version);
        }
    }
};

module.exports = safely;