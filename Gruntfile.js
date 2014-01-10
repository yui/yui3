module.exports = function(grunt) {

    var cli = grunt.cli;

    cli.optlist['release-version'] = {
        info: 'Release Version',
        type: String
    };

    cli.optlist['release-build'] = {
        info: 'Release Build',
        type: String
    };

    cli.optlist['cache-build'] = {
        info: 'Cache the build',
        type: Boolean
    };

    grunt.config.init({
        version: grunt.option('release-version'),
        build: grunt.option('release-build'),
        buildtag: 'YUI <%= version %> (build <%= build %>)',
        copyright: 'Copyright <%= grunt.template.today("yyyy") %> Yahoo! Inc. All rights reserved.',
        license: 'Licensed under the BSD License.\nhttp://yuilibrary.com/license/',
        compress: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'release/<%= version %>/dist/',
                        src: ['**'],
                        dest: 'yui/'
                    }
                ],
                options: {
                    pretty: true,
                    archive: 'release/<%= version %>/archives/yui_<%= version %>.zip',
                    mode: 'zip',
                    level: 3,
                    zlib: {
                        chunkSize: 12 * 1024
                    }
                }
            },
            cdn: {
                files: [
                    {
                        expand: true,
                        cwd: 'release/<%= version %>/cdn/',
                        dest: '<%= version %>/',
                        src: ['**']
                    }
                ],
                options: {
                    pretty: true,
                    archive: 'release/<%= version %>/archives/akamai_<%= version %>.zip',
                    mode: 'zip',
                    level: 3,
                    zlib: {
                        chunkSize: 12 * 1024
                    }
                }
            },
            'cdn-ssl': {
                files: [
                    {
                        expand: true,
                        cwd: 'release/<%= version %>/cdn-ssl/',
                        dest: '<%= version %>/',
                        src: ['**']
                    }
                ],
                options: {
                    pretty: true,
                    archive: 'release/<%= version %>/archives/akamaissl_<%= version %>.zip',
                    mode: 'zip',
                    level: 3,
                    zlib: {
                        chunkSize: 12 * 1024
                    }
                }
            }
        },

        css_selectors: {
            'pure': {
                options: {
                    mutations: [
                        {search: /pure-/g,   replace: 'yui3-'},
                        {search: /^\.pure/, replace: '.yui3-normalized'}
                    ]
                },

                files: [
                    {src : 'bower_components/pure/base.css',
                     dest: 'src/cssnormalize/css/normalize.css'},

                    {src : 'bower_components/pure/base-context.css',
                     dest: 'src/cssnormalize/css/normalize-context.css'},

                    {src : 'bower_components/pure/grids-core.css',
                     dest: 'src/cssgrids/css/cssgrids-base.css'},

                    {src : 'bower_components/pure/grids-units.css',
                     dest: 'src/cssgrids/css/cssgrids-units.css'},

                    {src : 'bower_components/pure/grids.css',
                     dest: 'src/cssgrids/css/cssgrids-responsive.css'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-yui-contrib');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-css-selectors');

    grunt.registerTask('default', ['boot']);
    grunt.registerTask('import-pure', ['bower-install', 'css_selectors:pure']);

};
