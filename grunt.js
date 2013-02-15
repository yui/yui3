module.exports = function(grunt) {

    var cli = grunt.cli;

    cli.optlist['release-version'] = {
        info: 'Release Version',
        type: String
    };


    grunt.loadNpmTasks('grunt-yui-contrib');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.initConfig({
        version: grunt.option('release-version'),
        compress: {
            dist: {
                files: [
                    {
                        src: ['release/<%= version %>/dist/'+'**'],
                        dest: 'release/<%= version %>/yui_<%= version %>.zip'
                    }
                ],
                options: {
                    mode: 'zip',
                    rootDir: 'yui/',
                    basePath: 'release/<%= version %>/dist/',
                    level: 3
                }
            },
            cdn: {
                files: [
                    {
                        src: ['release/<%= version %>/cdn/'+'**'],
                        dest: 'release/<%= version %>/akamai_<%= version %>.zip'
                    }
                ],
                options: {
                    mode: 'zip',
                    rootDir: 'yui/',
                    basePath: 'release/<%= version %>/cdn/',
                    level: 3
                }
            },
            'cdn-ssl': {
                files: [
                    {
                        src: ['release/<%= version %>/cdn-ssl/'+'**'],
                        dest: 'release/<%= version %>/akamaissl_<%= version %>.zip'
                    }
                ],
                options: {
                    mode: 'zip',
                    rootDir: 'yui/',
                    basePath: 'release/<%= version %>/cdn-ssl/',
                    level: 3
                }
            }
        }
    });

    grunt.registerTask('default', ['boot']);

};
