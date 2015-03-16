module.exports = function (grunt) {

    // *************************************************************************
    // REQUIRE PATHS
    // Add any paths here you want shortened. Relative to the 'js' dir.
    // *************************************************************************

    var amdModulePaths = {
        'pubsub': './lib/vendors/jquery/pubsub',
        'backbone': './lib/vendors/backbone/backbone',
        'underscore': './lib/vendors/backbone/underscore',
        //'text': './lib/vendors/require/text',
        'dataJson': 'empty:',
        'd3': 'empty:'
    };

    // *************************************************************************
    // GRUNT CONFIG
    // You shouldn't need to edit anything below here
    // *************************************************************************

    var _ = require('lodash-node'),
        requirePathsForJquery1build = _.merge({'jquery': './lib/vendors/jquery/jquery-1.9.1'}, amdModulePaths);
        requirePathsForJquery2build = _.merge({'jquery': './lib/vendors/jquery/jquery-2.0.3'}, amdModulePaths);
    
    grunt.config(['amdModulePaths'], amdModulePaths);
    grunt.config(['requirejs', 'jquery1'], {
        options: {
            baseUrl: './source/js',
            paths: requirePathsForJquery1build,
            optimize: 'uglify2',
            generateSourceMaps: false,
            preserveLicenseComments: false,
            name: './app-english',
            out: './content/<%= config.services.default %>/js/all-english-legacyie.js'
        }
    });
    grunt.config(['requirejs', 'jquery2'], {
        options: {
            baseUrl: './source/js',
            paths: requirePathsForJquery2build,
            optimize: 'uglify2',
            generateSourceMaps: true,
            preserveLicenseComments: false,
            name: './app-english',
            out: './content/<%= config.services.default %>/js/all-english-html5.js'
        }
    });
    grunt.config(['requirejs', 'jquery1-cymru'], {
        options: {
            baseUrl: './source/js',
            paths: requirePathsForJquery1build,
            optimize: 'uglify2',
            generateSourceMaps: false,
            preserveLicenseComments: false,
            name: './app-cymru',
            out: './content/<%= config.services.default %>/js/all-cymru-legacyie.js'
        }
    });
    grunt.config(['requirejs', 'jquery2-cymru'], {
        options: {
            baseUrl: './source/js',
            paths: requirePathsForJquery2build,
            optimize: 'uglify2',
            generateSourceMaps: true,
            preserveLicenseComments: false,
            name: './app-cymru',
            out: './content/<%= config.services.default %>/js/all-cymru-html5.js'
        }
    });
    grunt.config(['requirejs', 'lite'], {
        options: {
            baseUrl: './source/js',
            paths: requirePathsForJquery2build,
            optimize: 'uglify2',
            generateSourceMaps: false,
            preserveLicenseComments: false,
            name: './lib/vendors/almond/almond',
            out: './content/<%= config.services.default %>/js/lite.js',
            include: ['app--lite'],
            insertRequire: ['app--lite'],
            wrap: true
        }
    });
};