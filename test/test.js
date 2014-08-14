var safely = require("./../index.js"),
    assert = require("chai").assert,
    path   = require("path"),
    util   = require("util");



describe("safely", function() {
    var filepath, basename, basepath, extname, name;

    beforeEach(function() {
        filepath = "./test/target.txt";
        basename = path.basename(filepath);
        basepath = filepath.slice(0, filepath.lastIndexOf(basename));
        extname  = path.extname(basename);
        name     = basename.slice(0, basename.lastIndexOf(extname));
        extname  = extname.slice(1);
    });

//    describe("#safely", function() {
        it("should generate filename", function(done) {
            safely.defaults.version()(function(err, version) {
                var expecting;

                if (err) {
                    done(err);
                    return;
                }

                expecting = basepath + util.format(safely.defaults.format, name, version, extname);

                safely(filepath, function(err, name) {
                    var error;

                    if (err) {
                        done(err);
                        return;
                    }

                    try {
                        assert.equal(name, expecting);
                    } catch (err) {
                        error = err;
                    }

                    done(error);
                });
            });
        });

        it("should return not generate filename", function(done) {
            var expecting;

            filepath = expecting = basepath + name + ".not_exists";

            safely(filepath, function(err, name) {
                var error;

                if (err) {
                    done(err);
                    return;
                }

                try {
                    assert.equal(name, expecting);
                } catch (err) {
                    error = err;
                }

                done(error);
            });
        });
//    });

});
