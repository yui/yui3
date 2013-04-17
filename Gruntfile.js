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
        }
    });

    grunt.loadNpmTasks('grunt-yui-contrib');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.registerTask('default', ['boot']);

};
