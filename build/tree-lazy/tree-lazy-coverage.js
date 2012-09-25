if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/tree-lazy/tree-lazy.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/tree-lazy/tree-lazy.js",
    code: []
};
_yuitest_coverage["build/tree-lazy/tree-lazy.js"].code=["YUI.add('tree-lazy', function (Y, NAME) {","","/**","Provides `Plugin.Tree.Lazy`, a plugin for `Tree` that makes it easy to lazily","load and populate the contents of tree nodes the first time they're opened.","","@module tree","@submodule tree-lazy","**/","","/**","A plugin for `Tree` that makes it easy to lazily load and populate the contents","of tree nodes the first time they're opened.","","### Example","","    YUI().use('jsonp', 'tree', 'tree-lazy', function (Y) {","        var tree = new Y.Tree();","","        tree.plug(Y.Plugin.Tree.Lazy, {","","            // Custom function that Plugin.Tree.Lazy will call when it needs to","            // load the children for a node.","            load: function (node, callback) {","                // Request the data for this node's children via JSONP.","                Y.jsonp('http://example.com/api/data?callback={callback}', function (data) {","                    // If we didn't get any data back, treat this as an error.","                    if (!data) {","                        callback(new Error('No data!'));","                        return;","                    }","","                    // Append the children to the node (assume `data.children` is","                    // an array of child node data for the sake of this example).","                    node.append(data.children);","","                    // Call the callback function to tell Plugin.Tree.Lazy that","                    // we're done loading data.","                    callback();","                });","            }","","        });","    });","","@class Plugin.Tree.Lazy","@param {Object} config Config object.","","    @param {Function} config.load Custom `load()` function that will be called","        when a node's children need to be loaded. This function must call the","        provided callback to indicate completion.","","        @param {Function} config.load.callback Callback function. The custom","            `load()` function must call this callback to indicate completion.","","            @param {Error} [config.load.callback.err] Error object. If provided,","                the load action will be considered a failure, and an `error`","                event will be fired. Omit this argument (or set it to `null`) to","                indicate success.","","@extends Plugin.Base","@constructor","**/","","/**","Fired when the `load()` method indicates there was an error loading child nodes.","","@event error","@param {Error} error Error provided by the `load()` method.","@param {String} src Source of the error (defaults to \"load\").","**/","var EVT_ERROR = 'error';","","/**","Fired after child nodes have finished loading and have been added to the tree.","","@event loaded","@param {Tree.Node} node Tree node whose children have been loaded.","**/","var EVT_LOADED  = 'loaded';","","/**","Fired just before the custom `load()` method is called to load child nodes for a","node.","","Calling `preventDefault()` on this event's facade will cancel the load action","and prevent the `load()` method from being called.","","@event loading","@param {Tree.Node} node Tree node whose children will be loaded.","@preventable _defLoadingFn","**/","var EVT_LOADING = 'loading';","","Y.namespace('Plugin.Tree').Lazy = Y.Base.create('lazyTreePlugin', Y.Plugin.Base, [], {","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function (config) {","        this._host = config.host;","","        if (config.load) {","            this.load = config.load;","        }","","        this._published = {};","        this._attachEvents();","    },","","    // -- Public Methods -------------------------------------------------------","    load: function (node, callback) {","        callback(new Error('Plugin.Tree.Lazy: Please provide a custom `load` method when instantiating this plugin.'));","    },","","    // -- Protected Methods ----------------------------------------------------","","    _attachEvents: function () {","        this.onHostEvent('open', this._onOpen);","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    _onOpen: function (e) {","        var node = e.node;","","        // Nothing to do if this node can't have children or if its children","        // have already been (or are already being) loaded.","        if (!node.canHaveChildren || node.state.loaded || node.state.loading) {","            return;","        }","","        if (!this._published[EVT_LOADING]) {","            this._published[EVT_LOADING] = this.publish(EVT_LOADING, {","                defaultFn: this._defLoadingFn","            });","        }","","        this.fire(EVT_LOADING, {node: node});","    },","","    // -- Default Event Handlers -----------------------------------------------","","    _defLoadingFn: function (e) {","        var node = e.node,","            self = this;","","        node.state.loading = true;","","        this.load(node, function (err) {","            delete node.state.loading;","","            if (err) {","                self.fire(EVT_ERROR, {","                    error: err,","                    src  : 'load'","                });","","                return;","            }","","            node.state.loaded = true;","","            self.fire(EVT_LOADED, {node: node});","        });","    }","}, {","    NS: 'lazy'","});","","","}, '@VERSION@', {\"requires\": [\"base-pluginhost\", \"plugin\", \"tree\"]});"];
_yuitest_coverage["build/tree-lazy/tree-lazy.js"].lines = {"1":0,"72":0,"80":0,"93":0,"95":0,"98":0,"100":0,"101":0,"104":0,"105":0,"110":0,"116":0,"122":0,"126":0,"127":0,"130":0,"131":0,"136":0,"142":0,"145":0,"147":0,"148":0,"150":0,"151":0,"156":0,"159":0,"161":0};
_yuitest_coverage["build/tree-lazy/tree-lazy.js"].functions = {"initializer:97":0,"load:109":0,"_attachEvents:115":0,"_onOpen:121":0,"(anonymous 2):147":0,"_defLoadingFn:141":0,"(anonymous 1):1":0};
_yuitest_coverage["build/tree-lazy/tree-lazy.js"].coveredLines = 27;
_yuitest_coverage["build/tree-lazy/tree-lazy.js"].coveredFunctions = 7;
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 1);
YUI.add('tree-lazy', function (Y, NAME) {

/**
Provides `Plugin.Tree.Lazy`, a plugin for `Tree` that makes it easy to lazily
load and populate the contents of tree nodes the first time they're opened.

@module tree
@submodule tree-lazy
**/

/**
A plugin for `Tree` that makes it easy to lazily load and populate the contents
of tree nodes the first time they're opened.

### Example

    YUI().use('jsonp', 'tree', 'tree-lazy', function (Y) {
        var tree = new Y.Tree();

        tree.plug(Y.Plugin.Tree.Lazy, {

            // Custom function that Plugin.Tree.Lazy will call when it needs to
            // load the children for a node.
            load: function (node, callback) {
                // Request the data for this node's children via JSONP.
                Y.jsonp('http://example.com/api/data?callback={callback}', function (data) {
                    // If we didn't get any data back, treat this as an error.
                    if (!data) {
                        callback(new Error('No data!'));
                        return;
                    }

                    // Append the children to the node (assume `data.children` is
                    // an array of child node data for the sake of this example).
                    node.append(data.children);

                    // Call the callback function to tell Plugin.Tree.Lazy that
                    // we're done loading data.
                    callback();
                });
            }

        });
    });

@class Plugin.Tree.Lazy
@param {Object} config Config object.

    @param {Function} config.load Custom `load()` function that will be called
        when a node's children need to be loaded. This function must call the
        provided callback to indicate completion.

        @param {Function} config.load.callback Callback function. The custom
            `load()` function must call this callback to indicate completion.

            @param {Error} [config.load.callback.err] Error object. If provided,
                the load action will be considered a failure, and an `error`
                event will be fired. Omit this argument (or set it to `null`) to
                indicate success.

@extends Plugin.Base
@constructor
**/

/**
Fired when the `load()` method indicates there was an error loading child nodes.

@event error
@param {Error} error Error provided by the `load()` method.
@param {String} src Source of the error (defaults to "load").
**/
_yuitest_coverfunc("build/tree-lazy/tree-lazy.js", "(anonymous 1)", 1);
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 72);
var EVT_ERROR = 'error';

/**
Fired after child nodes have finished loading and have been added to the tree.

@event loaded
@param {Tree.Node} node Tree node whose children have been loaded.
**/
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 80);
var EVT_LOADED  = 'loaded';

/**
Fired just before the custom `load()` method is called to load child nodes for a
node.

Calling `preventDefault()` on this event's facade will cancel the load action
and prevent the `load()` method from being called.

@event loading
@param {Tree.Node} node Tree node whose children will be loaded.
@preventable _defLoadingFn
**/
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 93);
var EVT_LOADING = 'loading';

_yuitest_coverline("build/tree-lazy/tree-lazy.js", 95);
Y.namespace('Plugin.Tree').Lazy = Y.Base.create('lazyTreePlugin', Y.Plugin.Base, [], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/tree-lazy/tree-lazy.js", "initializer", 97);
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 98);
this._host = config.host;

        _yuitest_coverline("build/tree-lazy/tree-lazy.js", 100);
if (config.load) {
            _yuitest_coverline("build/tree-lazy/tree-lazy.js", 101);
this.load = config.load;
        }

        _yuitest_coverline("build/tree-lazy/tree-lazy.js", 104);
this._published = {};
        _yuitest_coverline("build/tree-lazy/tree-lazy.js", 105);
this._attachEvents();
    },

    // -- Public Methods -------------------------------------------------------
    load: function (node, callback) {
        _yuitest_coverfunc("build/tree-lazy/tree-lazy.js", "load", 109);
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 110);
callback(new Error('Plugin.Tree.Lazy: Please provide a custom `load` method when instantiating this plugin.'));
    },

    // -- Protected Methods ----------------------------------------------------

    _attachEvents: function () {
        _yuitest_coverfunc("build/tree-lazy/tree-lazy.js", "_attachEvents", 115);
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 116);
this.onHostEvent('open', this._onOpen);
    },

    // -- Protected Event Handlers ---------------------------------------------

    _onOpen: function (e) {
        _yuitest_coverfunc("build/tree-lazy/tree-lazy.js", "_onOpen", 121);
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 122);
var node = e.node;

        // Nothing to do if this node can't have children or if its children
        // have already been (or are already being) loaded.
        _yuitest_coverline("build/tree-lazy/tree-lazy.js", 126);
if (!node.canHaveChildren || node.state.loaded || node.state.loading) {
            _yuitest_coverline("build/tree-lazy/tree-lazy.js", 127);
return;
        }

        _yuitest_coverline("build/tree-lazy/tree-lazy.js", 130);
if (!this._published[EVT_LOADING]) {
            _yuitest_coverline("build/tree-lazy/tree-lazy.js", 131);
this._published[EVT_LOADING] = this.publish(EVT_LOADING, {
                defaultFn: this._defLoadingFn
            });
        }

        _yuitest_coverline("build/tree-lazy/tree-lazy.js", 136);
this.fire(EVT_LOADING, {node: node});
    },

    // -- Default Event Handlers -----------------------------------------------

    _defLoadingFn: function (e) {
        _yuitest_coverfunc("build/tree-lazy/tree-lazy.js", "_defLoadingFn", 141);
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 142);
var node = e.node,
            self = this;

        _yuitest_coverline("build/tree-lazy/tree-lazy.js", 145);
node.state.loading = true;

        _yuitest_coverline("build/tree-lazy/tree-lazy.js", 147);
this.load(node, function (err) {
            _yuitest_coverfunc("build/tree-lazy/tree-lazy.js", "(anonymous 2)", 147);
_yuitest_coverline("build/tree-lazy/tree-lazy.js", 148);
delete node.state.loading;

            _yuitest_coverline("build/tree-lazy/tree-lazy.js", 150);
if (err) {
                _yuitest_coverline("build/tree-lazy/tree-lazy.js", 151);
self.fire(EVT_ERROR, {
                    error: err,
                    src  : 'load'
                });

                _yuitest_coverline("build/tree-lazy/tree-lazy.js", 156);
return;
            }

            _yuitest_coverline("build/tree-lazy/tree-lazy.js", 159);
node.state.loaded = true;

            _yuitest_coverline("build/tree-lazy/tree-lazy.js", 161);
self.fire(EVT_LOADED, {node: node});
        });
    }
}, {
    NS: 'lazy'
});


}, '@VERSION@', {"requires": ["base-pluginhost", "plugin", "tree"]});
