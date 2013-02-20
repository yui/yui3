module.exports = function(grunt) {

    var cli = grunt.cli;

    cli.optlist['release-version'] = {
        info: 'Release Version',
        type: String
    };

    cli.optlist['cache-build'] = {
        info: 'Cache the build',
        type: Boolean
    };


    grunt.loadNpmTasks('grunt-yui-contrib');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.initConfig({
        version: grunt.option('release-version'),
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
                    archive: 'release/<%= version %>/yui_<%= version %>.zip',
                    mode: 'zip',
                    level: 3
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
                    archive: 'release/<%= version %>/akamai_<%= version %>.zip',
                    mode: 'zip',
                    level: 3
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
                    archive: 'release/<%= version %>/akamaissl_<%= version %>.zip',
                    mode: 'zip',
                    level: 3
                }
            }
        }
    });

    grunt.registerTask('default', ['boot']);

};
