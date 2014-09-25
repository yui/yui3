YUI.add('pathogen-encoder-tests', function (Y) {
    var suite   = new Y.Test.Suite('Pathogen Encoder Tests'),
        Assert  = Y.Assert,

        GROUP_DELIM     = ';',
        SUB_GROUP_DELIM = '+',
        MODULE_DELIM    = ',',

        TYPES = ['js', 'css'],

        customComboBase;

    suite.add(new Y.Test.Case({
        name: 'Test Basic URL Formatting',

        setUp: function () {
            Y.config.customComboBase = 'http://combo.yuilibrary.com/p/';
            customComboBase = Y.config.customComboBase;
        },

        'test basic formatting for core only': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,
                    require: ['datatable']
                }),
                resolved = loader.resolve(true),

                type,
                urls,
                groups,
                subgroups,
                modules,
                path,
                len,
                i;

            for (i = 0, len = TYPES.length; i < len; i += 1) {
                type = TYPES[i];
                urls = resolved[type];
                Assert.areEqual(1, urls.length, 'There should only be one ' + type + ' combo url');

                path   = urls[0].split(customComboBase).pop();
                groups = path.split(GROUP_DELIM);
                Assert.areEqual(1, groups.length, 'There should only be one group of ' + type + ' modules');

                subgroups = groups[0].split(SUB_GROUP_DELIM);
                Assert.areEqual(3, subgroups.length, 'There should only be three subgroups');
                Assert.areEqual('c', subgroups[0], 'Unexpected core identifier');
                Assert.isTrue(/^\d+\.\d+\.\d+/.test(subgroups[1]), 'Unexpected core version');

                modules = subgroups.pop().split(MODULE_DELIM);
                Assert.isTrue(modules.length > 0, 'Missing modules in the ' + type + ' combo url');
            }
        },

        'test basic formatting for gallery only': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,
                    require: ['gallery-pathogen-encoder', 'gallery-bitly'],
                    modules: {
                        'gallery-pathogen-encoder': {
                            group: 'gallery'
                        },
                        'gallery-bitly': {
                            group: 'gallery'
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                path,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(1, groups.length, 'Unexpected number of groups');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('g', subgroups[0], 'Unexpected gallery identifier');
            Assert.areEqual('2013.08.07-20-34', subgroups[1], 'Unexpected gallery version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.areEqual(2, modules.length, 'Unexpected number of modules');
        },
        
        'test basic formatting for root groups': function () {
            var loader = new Y.Loader({
                    combine: true,
                    require: ['af-poll', 'af-dom', 'af-pageviz'],

                    groups: {
                        'ape-af': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: 'os/mit/td/ape-af-0.0.38/',
                            combine: true
                        }
                    },

                    modules: {
                        'af-poll': {
                            group: 'ape-af',
                            requires: [
                                'af-pageviz'
                            ]
                        },
                        'af-dom': {
                            group: 'ape-af',
                            requires: [
                                'node-base',
                                'node-core'
                            ]
                        },
                        'af-pageviz': {
                            group: 'ape-af',
                            requires: [
                                'event-custom-base',
                                'event-custom-complex'
                            ]
                        }
                    }
                }),
                resolved = loader.resolve(true),

                urls,
                path,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(1, groups.length, 'Unexpected number of groups');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('r', subgroups[0], 'Unexpected group id');
            Assert.areEqual('os/mit/td/ape-af-0.0.38', subgroups[1], 'Unexpected root');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.areEqual(3, modules.length, 'Unexpected number of modules');
        },

        'test basic formatting for path groups': function () {
            var loader = new Y.Loader({
                    combine: true,
                    require: ['mod-a', 'mod-b', 'mod-c'],

                    groups: {
                        'awesome-group-name': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: '/',
                            combine: true
                        }
                    },

                    modules: {
                        'mod-a': {
                            group: 'awesome-group-name',
                            path: 'path/to/file/mod-a-min.js'
                        },
                        'mod-b': {
                            group: 'awesome-group-name',
                            path: 'path/to/file/1234567.js'
                        },
                        'mod-c': {
                            group: 'awesome-group-name',
                            path: 'path/to/file/mod-c.js'
                        }
                    }
                }),
                resolved = loader.resolve(true),

                path,
                urls,
                groups;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(3, groups.length, 'Unexpected number of groups');
        }
    }));
    
    suite.add(new Y.Test.Case({
        name: 'Test Complex URL Formatting',

        setUp: function () {
            Y.config.customComboBase = 'http://combo.yuilibrary.com/p/';
            customComboBase = Y.config.customComboBase;
        },

        'test formatting for groups: core + gallery + root + path': function () {
            var loader = new Y.Loader({
                    combine: true,
                    ignoreRegistered: true,

                    require: [
                        'yui-base',
                        'gallery-pathogen-encoder',
                        'af-poll',
                        'af-dom',
                        'af-pageviz',
                        'kamen',
                        'rider',
                        'wizard'
                    ],

                    groups: {
                        'ape-af': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: 'os/mit/td/ape-af-0.0.38/',
                            combine: true
                        },
                        'shabadoobie-touch-henshin': {
                            comboBase: 'http://l.yimg.com/zz/combo?',
                            root: '/',
                            combine: true
                        }
                    },

                    modules: {
                        'gallery-pathogen-encoder': {
                            group: 'gallery'
                        },
                        'gallery-bitly': {
                            group: 'gallery'
                        },
                        'af-poll': {
                            group: 'ape-af',
                            requires: [
                                'af-pageviz'
                            ]
                        },
                        'af-dom': {
                            group: 'ape-af',
                            requires: [
                                'node-base',
                                'node-core'
                            ]
                        },
                        'af-pageviz': {
                            group: 'ape-af',
                            requires: [
                                'event-custom-base',
                                'event-custom-complex'
                            ]
                        },
                        kamen: {
                            group: 'shabadoobie-touch-henshin',
                            path: 'a/b/c.js'
                        },
                        rider: {
                            group: 'shabadoobie-touch-henshin',
                            path: 'aa/bb/cc.js'
                        },
                        wizard: {
                            group: 'shabadoobie-touch-henshin',
                            path: 'aaa/bbb/ccc.js'
                        }
                    }
                }),
                resolved = loader.resolve(true),

                path,
                urls,
                groups,
                subgroups,
                modules;

            urls = resolved.js;
            Assert.areEqual(1, urls.length, 'Unexpected number of urls');

            path   = urls[0].split(customComboBase).pop();
            groups = path.split(GROUP_DELIM);
            Assert.areEqual(6, groups.length, 'Unexpected number of groups');

            subgroups = groups[0].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('c', subgroups[0], 'Unexpected group id');
            Assert.isTrue(/^\d+\.\d+\.\d+/.test(subgroups[1]), 'Unexpected core version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Unexpected number of modules');

            subgroups = groups[1].split(SUB_GROUP_DELIM);
            Assert.areEqual(3, subgroups.length, 'Unexpected number of subgroups');
            Assert.areEqual('g', subgroups[0], 'Unexpected group id');
            Assert.areEqual('2013.08.07-20-34', subgroups[1], 'Unexpected gallery version');

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Unexpected number of modules');

            subgroups = groups[2].split(SUB_GROUP_DELIM);

            modules = subgroups.pop().split(MODULE_DELIM);
            Assert.isTrue(modules.length > 0, 'Unexpected number of modules');
        }
    }));
    
    suite.add(new Y.Test.Case({
        name: 'Test non-compressed fullpath modules',

        setUp: function () {
            Y.config.customComboBase = 'http://combo.yuilibrary.com/p/';
        },

        'test fullpath compression off by default': function () {
            var modules = {},
                resolved,
                loader,
                paths;

            paths = [
                'eu/ai/tora.js',
                'eu/ai/maru.js',
                'eu/ai/yui.js'
            ];

            Y.Array.forEach(paths, function (path) {
                modules[path] = {
                    group: 'eu',
                    path: path
                };
            });

            Y.config.fullpathCompression = false;
            loader = new Y.Loader({
                combine: true,
                require: paths,
                groups: {
                    'eu': {
                        comboBase: 'http://l.yimg.com/zz/combo?',
                        root: '/',
                        combine: true
                    }
                },
                modules: modules
            });

            resolved = loader.resolve(true);
            Assert.areEqual(
                'http://combo.yuilibrary.com/p/eu/ai/maru;eu/ai/tora;eu/ai/yui.js',
                resolved.js[0],
                'Fullpath compression should be off by default'
            );
        }
    }));

    suite.add(new Y.Test.Case({
        name:  'Test fallback to default combohandler when customComboBase is not defined.',

        setUp: function() {
            Y.config.customComboBase = undefined;
        },

        'test fallback to default combohandler': function() {
            loader = new Y.Loader({
                combine: true,
                require: ['node', 'dd', 'console']
            });
            resolved = loader.resolve(true);
            Assert.areSame(1, resolved.js.length, 'JS Files returned more or less than expected');
            Assert.isTrue(resolved.js[0].indexOf('http://yui.yahooapis.com/combo?') > -1, 'Default YUI combo URL should be included in the result ');
        }
    }));
    
    Y.Test.Runner.add(suite);
});
