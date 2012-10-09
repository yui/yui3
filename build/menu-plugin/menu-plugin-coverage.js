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
_yuitest_coverage["build/menu-plugin/menu-plugin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/menu-plugin/menu-plugin.js",
    code: []
};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].code=["YUI.add('menu-plugin', function (Y, NAME) {","","/**","Provides the `Y.Plugin.Menu` Node plugin.","","@module menu","@submodule menu-plugin","**/","","/**","Node plugin that toggles a dropdown menu when the host node is clicked.","","### Example","","    YUI().use('menu-plugin', function (Y) {","        var button = Y.one('#button');","","        // Plug a dropdown menu into the button.","        button.plug(Y.Plugin.Menu, {","            items: [","                {label: 'Item One'},","                {label: 'Item Two'},","                {label: 'Item Three'}","            ]","        });","","        // The menu will automatically be displayed whenever the button is","        // clicked, but you can also toggle it manually.","        button.menu.toggle();","    });","","@class Plugin.Menu","@constructor","@extends Menu","@uses Plugin.Base","**/","","Y.namespace('Plugin').Menu = Y.Base.create('menuPlugin', Y.Menu, [Y.Plugin.Base], {","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function (config) {","        this._host = config.host;","","        this._published = {};","        this._attachMenuPluginEvents();","    },","","    // -- Protected Methods ----------------------------------------------------","    _attachMenuPluginEvents: function () {","        // This event will be cleaned up by Y.Menu.","        this._menuEvents.push(","            Y.one('doc').after('click', this._afterDocClick, this)","        );","","        this.afterHostEvent('click', this._afterAnchorClick);","    },","","    // -- Protected Event Handlers ---------------------------------------------","    _afterAnchorClick: function () {","        if (!this.rendered) {","            this.render();","        }","","        if (this.isVisible()) {","            this.hide();","        } else {","            var anchorRegion = this._host.get('region'),","                container    = this.get('container');","","            // TODO: support more anchoring options beyond bottom left.","            container.setXY([anchorRegion.left, anchorRegion.bottom]);","            this.show();","        }","    },","","    _afterDocClick: function (e) {","        var container = this.get('container'),","            host      = this._host;","","        if (!e.target.ancestor(function (node) {","            return node === container || node === host;","        }, true)) {","            this.hide();","        }","    }","}, {","    NS: 'menu'","});","","","}, '@VERSION@', {\"requires\": [\"menu\", \"node-pluginhost\", \"plugin\"]});"];
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].lines = {"1":0,"38":0,"41":0,"43":0,"44":0,"50":0,"54":0,"59":0,"60":0,"63":0,"64":0,"66":0,"70":0,"71":0,"76":0,"79":0,"80":0,"82":0};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].functions = {"initializer:40":0,"_attachMenuPluginEvents:48":0,"_afterAnchorClick:58":0,"(anonymous 2):79":0,"_afterDocClick:75":0,"(anonymous 1):1":0};
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].coveredLines = 18;
_yuitest_coverage["build/menu-plugin/menu-plugin.js"].coveredFunctions = 6;
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 1);
YUI.add('menu-plugin', function (Y, NAME) {

/**
Provides the `Y.Plugin.Menu` Node plugin.

@module menu
@submodule menu-plugin
**/

/**
Node plugin that toggles a dropdown menu when the host node is clicked.

### Example

    YUI().use('menu-plugin', function (Y) {
        var button = Y.one('#button');

        // Plug a dropdown menu into the button.
        button.plug(Y.Plugin.Menu, {
            items: [
                {label: 'Item One'},
                {label: 'Item Two'},
                {label: 'Item Three'}
            ]
        });

        // The menu will automatically be displayed whenever the button is
        // clicked, but you can also toggle it manually.
        button.menu.toggle();
    });

@class Plugin.Menu
@constructor
@extends Menu
@uses Plugin.Base
**/

_yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 38);
Y.namespace('Plugin').Menu = Y.Base.create('menuPlugin', Y.Menu, [Y.Plugin.Base], {
    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "initializer", 40);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 41);
this._host = config.host;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 43);
this._published = {};
        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 44);
this._attachMenuPluginEvents();
    },

    // -- Protected Methods ----------------------------------------------------
    _attachMenuPluginEvents: function () {
        // This event will be cleaned up by Y.Menu.
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_attachMenuPluginEvents", 48);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 50);
this._menuEvents.push(
            Y.one('doc').after('click', this._afterDocClick, this)
        );

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 54);
this.afterHostEvent('click', this._afterAnchorClick);
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterAnchorClick: function () {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterAnchorClick", 58);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 59);
if (!this.rendered) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 60);
this.render();
        }

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 63);
if (this.isVisible()) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 64);
this.hide();
        } else {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 66);
var anchorRegion = this._host.get('region'),
                container    = this.get('container');

            // TODO: support more anchoring options beyond bottom left.
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 70);
container.setXY([anchorRegion.left, anchorRegion.bottom]);
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 71);
this.show();
        }
    },

    _afterDocClick: function (e) {
        _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "_afterDocClick", 75);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 76);
var container = this.get('container'),
            host      = this._host;

        _yuitest_coverline("build/menu-plugin/menu-plugin.js", 79);
if (!e.target.ancestor(function (node) {
            _yuitest_coverfunc("build/menu-plugin/menu-plugin.js", "(anonymous 2)", 79);
_yuitest_coverline("build/menu-plugin/menu-plugin.js", 80);
return node === container || node === host;
        }, true)) {
            _yuitest_coverline("build/menu-plugin/menu-plugin.js", 82);
this.hide();
        }
    }
}, {
    NS: 'menu'
});


}, '@VERSION@', {"requires": ["menu", "node-pluginhost", "plugin"]});
