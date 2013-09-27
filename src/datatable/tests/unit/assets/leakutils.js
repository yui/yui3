/*
// Add a reference to the module in the YUI configuration section so it can locate it
// It's up to you where you put it.
YUI({
    groups: {
        leaks: {
            base:'assets/',
            modules: {
                'leak-utils': {
                    path: 'leakutils.js',
                    requires: ['test','node-base']
                }
            }
        }
    }

// Loading needs to be done in two stages.
// In the first stage you have to load this utility along the `test` and
// `base-core` modules so the utility can patch those two.
// The `base-core` needs to be loaded before any other module that depends
// on it, otherwise, the classes in those modules will not inherit the patched-up
// version but the original unpatched one.
// Put a reference to the module in the YUI().use()
}).use(
    'base-core',
    'test',
    'leak-utils',
    // Now you enable the leak detector so it patches `test` and `base-core`
    function (Y) {
        if (/[?&]leak=([^&]+)/.test(window.location.search)) {
            Y.Test.Runner.setDOMIgnore('#logger','script');
            Y.Test.Runner.enableLeakDetector();
        }
    // Then you get to load the rest as you would normally do.
    Y.use(
    'test-console',
    // ...... Whatever it is you are testing ...
    function(Y) {

    (new Y.Test.Console()).render('#logger');

    Y.Test.Runner.setName('datatable-celleditor-inline');

    // It is better to run it conditionally via a URL argument
    if (/[?&]leak=([^&]+)/.test(window.location.search)) {

        // Add the list of CSS selectors corresponding to elements not to be analyzed
        Y.Test.Runner.setDOMIgnore('#logger','script');

        // Enable it
        Y.Test.Runner.enableLeakDetector();
    }
    Y.Test.Runner.run();

 */
YUI.add('leak-utils', function(Y) {
    var DOMNodes, // Stores a snapshot of the existing DOM Nodes
        DOMEvents, // Stores a snapshot of DOM events
        baseInstances, // Array of base instances created
        collectBase = false, // signals whether to collect base instances or not.
        inCase = false, // says whether I'm in a test case or not

        arrEach = Y.Array.each,
        objEach = Y.Object.each,

        // Stores the info to show after each test case ends
        logs = {},

        // Shows the logs
        showLogs = function (name) {
            Y.log(name,'leak','TestRunner');

            objEach(logs, function (section, key) {
                if (section.length) {
                    Y.log('    ' + key,'leak','TestRunner');
                    arrEach(section, function (msg) {
                        Y.log('              ' + msg,'leak','TestRunner');
                    });
                }
            });
            logs = {};

        },

        // Produces as CSS-selector type of signature for a node or HTML element
        signature = function (n) {
            var tag, id, cname;
            if (n.get) {
                tag = n.get('tagName') || n.get('nodeName');
                id = n.get('id');
                cname = n.get('className');
            } else {
                tag = n.tagName || n.nodeName;
                id = n.id;
                cname = n.className;
            }
            if (!tag) {
                return tag;
            }
            switch (tag.toUpperCase()) {
                case 'HTML':
                case 'BODY':
                    return;
            }
            return tag + (id ? '#' + id : '') + ( cname ?  '.' + cname.replace(' ','.') : '');
        },

        // Takes a snapshot of what's in the document body
        snapShotDOM = function () {
            var excludes = Y.Test.Runner._DOMIgnore,
                addNode = function (n) {
                    if (Y.some(excludes, function (x) {
                        return n.test(x);
                    })) {
                        return null;
                    }
                    var item = signature(n);
                    if (item) {
                        DOMNodes.push(item);
                    }
                    n.get('children').each(addNode);
                };
            DOMNodes = [];
            addNode(Y.one('body'));
        },

        // Compares the document body with a previous snapshot
        cmpDOM = function () {
            var excludes = Y.Test.Runner._DOMIgnore,
                leftovers = [],
                missing = [],
                cmpNode = function (n) {
                    if (Y.some(excludes, function (x) {
                        return n.test(x);
                    })) {
                        return false;
                    }
                    var item = signature(n), i;
                    if (item) {
                        i = DOMNodes.indexOf(item);
                        if (i < 0) {
                            leftovers.push(item);
                        } else {
                            delete DOMNodes[i];
                        }
                    }
                    n.get('children').each(cmpNode);
                };
            cmpNode(Y.one('body'));
            arrEach(DOMNodes, function (item) {
                if (item) {
                    missing.push(item);
                }
            });
            logs['Leftover DOM nodes'] = leftovers;
            logs['Missing DOM nodes']  = missing;
            DOMNodes = null;

        },

        // Instead of taking a snapshot of the cache I found it easier
        // to simply whipe it out and count from there
        snapShotNodes = function () {
            Y.Node._instances = {};
        },

        // Lists cached Node references
        cmpNodes = function () {
            var excludes = Y.all(Y.Test.Runner._DOMIgnore.join(',')),
                leftovers = [],
                extrasindoc = [];
            objEach(Y.Node._instances, function (n) {
                if (excludes.some(function (x) {
                    return x.contains(n);
                })) {
                    return;
                }
                var indoc = false,
                    item = signature(n);
                if (item) {
                    try {
                        indoc = n.inDoc();
                    }
                    catch (e) {}
                    if (indoc) {
                        extrasindoc.push(item);
                    } else {
                        leftovers.push(item);
                    }
                }
            });
            logs['Leftover cached Nodes'] = leftovers;
            logs['Leftover cached Nodes still in doc'] = extrasindoc;
        },

        // Takes a snapshot of DOM events
        snapShotDOMEvents = function () {
            var excludes = Y.all(Y.Test.Runner._DOMIgnore.join(','));

            DOMEvents = [];
            objEach(Y.Env.evt.dom_map, function (item) {
                objEach(item, function (ev, key) {
                    if (excludes.some(function (x) {
                        return x.contains(ev.el);
                    })) {
                        return;
                    }
                    DOMEvents.push(key);
                });
            });

        },

        // Checks for DOM Events left behind
        cmpDOMEvents = function () {
            var excludes = Y.all(Y.Test.Runner._DOMIgnore.join(',')),
                leftovers = [];
            objEach(Y.Env.evt.dom_map, function (item) {
                objEach(item, function (ev, key) {
                    if (0 < DOMEvents.indexOf(key)) {
                        if (excludes.some(function (x) {
                            return x.contains(ev.el);
                        })) {
                            return;
                        }
                        if (ev.type === '_synth') {
                            arrEach(ev.handles, function (item) {
                                leftovers.push(item.evt.type + ': ' + signature(ev.el));
                            });
                        } else {
                            leftovers.push(ev.type + ': ' + signature(ev.el));
                        }
                    }
                });
            });
            logs['Leftover DOM Events'] = leftovers;
            DOMEvents = null;
        },
        snapShotBase = function () {
            baseInstances = {};
            collectBase = true;
        },
        cmpBase = function () {
            collectBase = false;
            var leftOvers = [];
            objEach(baseInstances, function (name, yuid) {
                if (name) {
                    leftOvers.push(name + '#' + yuid);
                }
            });
            logs['Leftover Base instances'] = leftOvers;
            baseInstances = null;
        };

    // Creates the list of elements to be ignored.
    Y.Test.Runner.setDOMIgnore = function () {
        this._DOMIgnore = Y.Array(arguments);
    };

    // Enables the leak detector
    Y.Test.Runner.enableLeakDetector = function () {

        Y.BaseCore.prototype._initBase = (function (original) {
            return function () {
                var ret = original.apply(this, arguments);
                if (collectBase) {
                    baseInstances[this._yuid] = this.name;
                }
                return ret;
            };
        })(Y.BaseCore.prototype._initBase);

        Y.BaseCore.prototype._baseDestroy = (function (original) {
            return function () {
                if (collectBase) {
                    baseInstances[this._yuid] = null;
                }
                return original.apply(this, arguments);
            };
        })(Y.BaseCore.prototype._baseDestroy);

        // Monkey patches a native test runner method.
        Y.Test.Runner._execNonTestMethod = (function (original) {
            return function (node, methodName) {

                var ret;
                switch (methodName) {
                    case 'setUp':
                        if (inCase) {
                            snapShotDOM();
                            snapShotNodes();
                            snapShotDOMEvents();
                            snapShotBase();
                        }
                        ret = original.apply(this, arguments);
                        break;

                    case 'tearDown':
                        ret = original.apply(this, arguments);
                        if (inCase) {
                            cmpDOM();
                            cmpNodes();
                            cmpDOMEvents();
                            cmpBase();
                            if (typeof this._cur.testObject === 'string') {
                                showLogs(node.testObject.name + '\n  ' + this._cur.testObject + '\n');
                            }
                        }
                        break;
                    case 'init':
                        inCase = true;
                        ret = original.apply(this, arguments);
                        break;
                    case 'destroy':
                        inCase = false;
                        ret = original.apply(this, arguments);
                        break;
                    default:
                        ret = original.apply(this, arguments);
                }
                return ret;
            };
        })(Y.Test.Runner._execNonTestMethod);
    };

},'', {requires: [ 'test', 'node-base']});