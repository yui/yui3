/*
* This file was assembled by ../scripts/build_loader_tests.js
*/

//This is a hack for global modules in npm 1.0
require.paths.push('/usr/local/lib/node_modules');


var Y = require('yui3').silent().useSync('loader'),
    YUITest = require("yuitest").YUITest,
    Assert = YUITest.Assert,
    ArrayAssert = YUITest.ArrayAssert,
    suite = new YUITest.TestSuite("YUILoader");

//Generic Async Wait
var async = function(fn) {
    var count = 0;
    return function(data) {
        var loaded = false;
        var w = function() {
            if (count === 1000) {
                throw new Error('Async Timer reached 1000 iterations..');
            }
            count++;
            if (!loaded) {
                this.wait(w, 10);
            }
        };
        var next = function() {
            loaded = true;
        };
        fn.call(this, data, next);
        this.wait(w, 10);
    };
};

/*
* !! TESTCASE !! will be replaced with a JSON object by the parent script.
*/
suite.add(new YUITest.TestCase({
    name: "Loader Tests",
         "Testing anim": function(data) {
            var loader = new Y.Loader({
                require: ["anim"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("anim")) > -1);
        },
     "Testing anim-base": function(data) {
            var loader = new Y.Loader({
                require: ["anim-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("anim-base")) > -1);
        },
     "Testing anim-color": function(data) {
            var loader = new Y.Loader({
                require: ["anim-color"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("anim-color")) > -1);
        },
     "Testing anim-curve": function(data) {
            var loader = new Y.Loader({
                require: ["anim-curve"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("anim-curve")) > -1);
        },
     "Testing anim-easing": function(data) {
            var loader = new Y.Loader({
                require: ["anim-easing"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("anim-easing")) > -1);
        },
     "Testing anim-node-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["anim-node-plugin"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("anim-node-plugin")) > -1);
        },
     "Testing anim-scroll": function(data) {
            var loader = new Y.Loader({
                require: ["anim-scroll"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("anim-scroll")) > -1);
        },
     "Testing anim-xy": function(data) {
            var loader = new Y.Loader({
                require: ["anim-xy"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("anim-xy")) > -1);
        },
     "Testing app": function(data) {
            var loader = new Y.Loader({
                require: ["app"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("app")) > -1);
        },
     "Testing arraysort": function(data) {
            var loader = new Y.Loader({
                require: ["arraysort"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("arraysort")) > -1);
        },
     "Testing async-queue": function(data) {
            var loader = new Y.Loader({
                require: ["async-queue"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("async-queue")) > -1);
        },
     "Testing attribute": function(data) {
            var loader = new Y.Loader({
                require: ["attribute"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("attribute")) > -1);
        },
     "Testing attribute-base": function(data) {
            var loader = new Y.Loader({
                require: ["attribute-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("attribute-base")) > -1);
        },
     "Testing attribute-complex": function(data) {
            var loader = new Y.Loader({
                require: ["attribute-complex"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("attribute-complex")) > -1);
        },
     "Testing autocomplete": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("autocomplete")) > -1);
        },
     "Testing autocomplete-base": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("autocomplete-base")) > -1);
        },
     "Testing autocomplete-list": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-list"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("autocomplete-list")) > -1);
        },
     "Testing autocomplete-sources": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-sources"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("autocomplete-sources")) > -1);
        },
     "Testing base": function(data) {
            var loader = new Y.Loader({
                require: ["base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("base")) > -1);
        },
     "Testing base-base": function(data) {
            var loader = new Y.Loader({
                require: ["base-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("base-base")) > -1);
        },
     "Testing base-build": function(data) {
            var loader = new Y.Loader({
                require: ["base-build"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("base-build")) > -1);
        },
     "Testing base-pluginhost": function(data) {
            var loader = new Y.Loader({
                require: ["base-pluginhost"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("base-pluginhost")) > -1);
        },
     "Testing cache": function(data) {
            var loader = new Y.Loader({
                require: ["cache"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cache")) > -1);
        },
     "Testing cache-base": function(data) {
            var loader = new Y.Loader({
                require: ["cache-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cache-base")) > -1);
        },
     "Testing cache-offline": function(data) {
            var loader = new Y.Loader({
                require: ["cache-offline"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cache-offline")) > -1);
        },
     "Testing cache-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["cache-plugin"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cache-plugin")) > -1);
        },
     "Testing charts": function(data) {
            var loader = new Y.Loader({
                require: ["charts"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("charts")) > -1);
        },
     "Testing classnamemanager": function(data) {
            var loader = new Y.Loader({
                require: ["classnamemanager"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("classnamemanager")) > -1);
        },
     "Testing collection": function(data) {
            var loader = new Y.Loader({
                require: ["collection"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("collection")) > -1);
        },
     "Testing array-extras": function(data) {
            var loader = new Y.Loader({
                require: ["array-extras"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("array-extras")) > -1);
        },
     "Testing array-invoke": function(data) {
            var loader = new Y.Loader({
                require: ["array-invoke"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("array-invoke")) > -1);
        },
     "Testing arraylist": function(data) {
            var loader = new Y.Loader({
                require: ["arraylist"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("arraylist")) > -1);
        },
     "Testing arraylist-add": function(data) {
            var loader = new Y.Loader({
                require: ["arraylist-add"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("arraylist-add")) > -1);
        },
     "Testing arraylist-filter": function(data) {
            var loader = new Y.Loader({
                require: ["arraylist-filter"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("arraylist-filter")) > -1);
        },
     "Testing compat": function(data) {
            var loader = new Y.Loader({
                require: ["compat"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("compat")) > -1);
        },
     "Testing console": function(data) {
            var loader = new Y.Loader({
                require: ["console"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("console")) > -1);
        },
     "Testing cookie": function(data) {
            var loader = new Y.Loader({
                require: ["cookie"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cookie")) > -1);
        },
     "Testing cssbase": function(data) {
            var loader = new Y.Loader({
                require: ["cssbase"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssbase")) > -1);
        },
     "Testing cssbase-context": function(data) {
            var loader = new Y.Loader({
                require: ["cssbase-context"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssbase-context")) > -1);
        },
     "Testing cssfonts": function(data) {
            var loader = new Y.Loader({
                require: ["cssfonts"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssfonts")) > -1);
        },
     "Testing cssfonts-context": function(data) {
            var loader = new Y.Loader({
                require: ["cssfonts-context"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssfonts-context")) > -1);
        },
     "Testing cssgrids": function(data) {
            var loader = new Y.Loader({
                require: ["cssgrids"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssgrids")) > -1);
        },
     "Testing cssgrids-context-deprecated": function(data) {
            var loader = new Y.Loader({
                require: ["cssgrids-context-deprecated"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssgrids-context-deprecated")) > -1);
        },
     "Testing cssgrids-deprecated": function(data) {
            var loader = new Y.Loader({
                require: ["cssgrids-deprecated"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssgrids-deprecated")) > -1);
        },
     "Testing cssreset": function(data) {
            var loader = new Y.Loader({
                require: ["cssreset"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssreset")) > -1);
        },
     "Testing cssreset-context": function(data) {
            var loader = new Y.Loader({
                require: ["cssreset-context"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("cssreset-context")) > -1);
        },
     "Testing dataschema": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dataschema")) > -1);
        },
     "Testing dataschema-array": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-array"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dataschema-array")) > -1);
        },
     "Testing dataschema-base": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dataschema-base")) > -1);
        },
     "Testing dataschema-json": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-json"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dataschema-json")) > -1);
        },
     "Testing dataschema-text": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-text"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dataschema-text")) > -1);
        },
     "Testing dataschema-xml": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-xml"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dataschema-xml")) > -1);
        },
     "Testing datasource": function(data) {
            var loader = new Y.Loader({
                require: ["datasource"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource")) > -1);
        },
     "Testing datasource-arrayschema": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-arrayschema"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-arrayschema")) > -1);
        },
     "Testing datasource-cache": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-cache"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-cache")) > -1);
        },
     "Testing datasource-function": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-function"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-function")) > -1);
        },
     "Testing datasource-get": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-get"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-get")) > -1);
        },
     "Testing datasource-io": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-io"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-io")) > -1);
        },
     "Testing datasource-jsonschema": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-jsonschema"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-jsonschema")) > -1);
        },
     "Testing datasource-local": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-local"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-local")) > -1);
        },
     "Testing datasource-polling": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-polling"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-polling")) > -1);
        },
     "Testing datasource-textschema": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-textschema"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-textschema")) > -1);
        },
     "Testing datasource-xmlschema": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-xmlschema"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datasource-xmlschema")) > -1);
        },
     "Testing datatable": function(data) {
            var loader = new Y.Loader({
                require: ["datatable"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatable")) > -1);
        },
     "Testing datatable-base": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatable-base")) > -1);
        },
     "Testing datatable-datasource": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-datasource"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatable-datasource")) > -1);
        },
     "Testing datatable-scroll": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-scroll"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatable-scroll")) > -1);
        },
     "Testing datatable-sort": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-sort"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatable-sort")) > -1);
        },
     "Testing datatype": function(data) {
            var loader = new Y.Loader({
                require: ["datatype"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatype")) > -1);
        },
     "Testing datatype-date": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-date"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatype-date")) > -1);
        },
     "Testing datatype-number": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-number"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatype-number")) > -1);
        },
     "Testing datatype-xml": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-xml"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatype-xml")) > -1);
        },
     "Testing datatype-date-format": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-date-format"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("datatype-date-format")) > -1);
        },
     "Testing dd": function(data) {
            var loader = new Y.Loader({
                require: ["dd"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd")) > -1);
        },
     "Testing dd-constrain": function(data) {
            var loader = new Y.Loader({
                require: ["dd-constrain"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-constrain")) > -1);
        },
     "Testing dd-ddm": function(data) {
            var loader = new Y.Loader({
                require: ["dd-ddm"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-ddm")) > -1);
        },
     "Testing dd-ddm-base": function(data) {
            var loader = new Y.Loader({
                require: ["dd-ddm-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-ddm-base")) > -1);
        },
     "Testing dd-ddm-drop": function(data) {
            var loader = new Y.Loader({
                require: ["dd-ddm-drop"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-ddm-drop")) > -1);
        },
     "Testing dd-delegate": function(data) {
            var loader = new Y.Loader({
                require: ["dd-delegate"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-delegate")) > -1);
        },
     "Testing dd-drag": function(data) {
            var loader = new Y.Loader({
                require: ["dd-drag"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-drag")) > -1);
        },
     "Testing dd-drop": function(data) {
            var loader = new Y.Loader({
                require: ["dd-drop"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-drop")) > -1);
        },
     "Testing dd-proxy": function(data) {
            var loader = new Y.Loader({
                require: ["dd-proxy"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-proxy")) > -1);
        },
     "Testing dd-scroll": function(data) {
            var loader = new Y.Loader({
                require: ["dd-scroll"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dd-scroll")) > -1);
        },
     "Testing dial": function(data) {
            var loader = new Y.Loader({
                require: ["dial"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dial")) > -1);
        },
     "Testing dom": function(data) {
            var loader = new Y.Loader({
                require: ["dom"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dom")) > -1);
        },
     "Testing dom-base": function(data) {
            var loader = new Y.Loader({
                require: ["dom-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dom-base")) > -1);
        },
     "Testing dom-screen": function(data) {
            var loader = new Y.Loader({
                require: ["dom-screen"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dom-screen")) > -1);
        },
     "Testing dom-style": function(data) {
            var loader = new Y.Loader({
                require: ["dom-style"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dom-style")) > -1);
        },
     "Testing selector": function(data) {
            var loader = new Y.Loader({
                require: ["selector"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("selector")) > -1);
        },
     "Testing selector-native": function(data) {
            var loader = new Y.Loader({
                require: ["selector-native"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("selector-native")) > -1);
        },
     "Testing dump": function(data) {
            var loader = new Y.Loader({
                require: ["dump"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("dump")) > -1);
        },
     "Testing editor": function(data) {
            var loader = new Y.Loader({
                require: ["editor"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("editor")) > -1);
        },
     "Testing createlink-base": function(data) {
            var loader = new Y.Loader({
                require: ["createlink-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("createlink-base")) > -1);
        },
     "Testing editor-base": function(data) {
            var loader = new Y.Loader({
                require: ["editor-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("editor-base")) > -1);
        },
     "Testing editor-bidi": function(data) {
            var loader = new Y.Loader({
                require: ["editor-bidi"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("editor-bidi")) > -1);
        },
     "Testing editor-br": function(data) {
            var loader = new Y.Loader({
                require: ["editor-br"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("editor-br")) > -1);
        },
     "Testing editor-lists": function(data) {
            var loader = new Y.Loader({
                require: ["editor-lists"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("editor-lists")) > -1);
        },
     "Testing editor-para": function(data) {
            var loader = new Y.Loader({
                require: ["editor-para"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("editor-para")) > -1);
        },
     "Testing exec-command": function(data) {
            var loader = new Y.Loader({
                require: ["exec-command"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("exec-command")) > -1);
        },
     "Testing frame": function(data) {
            var loader = new Y.Loader({
                require: ["frame"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("frame")) > -1);
        },
     "Testing selection": function(data) {
            var loader = new Y.Loader({
                require: ["selection"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("selection")) > -1);
        },
     "Testing escape": function(data) {
            var loader = new Y.Loader({
                require: ["escape"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("escape")) > -1);
        },
     "Testing event": function(data) {
            var loader = new Y.Loader({
                require: ["event"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event")) > -1);
        },
     "Testing event-base": function(data) {
            var loader = new Y.Loader({
                require: ["event-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-base")) > -1);
        },
     "Testing event-delegate": function(data) {
            var loader = new Y.Loader({
                require: ["event-delegate"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-delegate")) > -1);
        },
     "Testing event-focus": function(data) {
            var loader = new Y.Loader({
                require: ["event-focus"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-focus")) > -1);
        },
     "Testing event-hover": function(data) {
            var loader = new Y.Loader({
                require: ["event-hover"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-hover")) > -1);
        },
     "Testing event-key": function(data) {
            var loader = new Y.Loader({
                require: ["event-key"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-key")) > -1);
        },
     "Testing event-mouseenter": function(data) {
            var loader = new Y.Loader({
                require: ["event-mouseenter"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-mouseenter")) > -1);
        },
     "Testing event-mousewheel": function(data) {
            var loader = new Y.Loader({
                require: ["event-mousewheel"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-mousewheel")) > -1);
        },
     "Testing event-resize": function(data) {
            var loader = new Y.Loader({
                require: ["event-resize"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-resize")) > -1);
        },
     "Testing event-synthetic": function(data) {
            var loader = new Y.Loader({
                require: ["event-synthetic"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-synthetic")) > -1);
        },
     "Testing event-custom": function(data) {
            var loader = new Y.Loader({
                require: ["event-custom"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-custom")) > -1);
        },
     "Testing event-custom-base": function(data) {
            var loader = new Y.Loader({
                require: ["event-custom-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-custom-base")) > -1);
        },
     "Testing event-custom-complex": function(data) {
            var loader = new Y.Loader({
                require: ["event-custom-complex"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-custom-complex")) > -1);
        },
     "Testing event-gestures": function(data) {
            var loader = new Y.Loader({
                require: ["event-gestures"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-gestures")) > -1);
        },
     "Testing event-flick": function(data) {
            var loader = new Y.Loader({
                require: ["event-flick"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-flick")) > -1);
        },
     "Testing event-move": function(data) {
            var loader = new Y.Loader({
                require: ["event-move"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-move")) > -1);
        },
     "Testing event-simulate": function(data) {
            var loader = new Y.Loader({
                require: ["event-simulate"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-simulate")) > -1);
        },
     "Testing event-valuechange": function(data) {
            var loader = new Y.Loader({
                require: ["event-valuechange"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("event-valuechange")) > -1);
        },
     "Testing highlight": function(data) {
            var loader = new Y.Loader({
                require: ["highlight"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("highlight")) > -1);
        },
     "Testing highlight-accentfold": function(data) {
            var loader = new Y.Loader({
                require: ["highlight-accentfold"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("highlight-accentfold")) > -1);
        },
     "Testing highlight-base": function(data) {
            var loader = new Y.Loader({
                require: ["highlight-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("highlight-base")) > -1);
        },
     "Testing intl": function(data) {
            var loader = new Y.Loader({
                require: ["intl"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("intl")) > -1);
        },
     "Testing io": function(data) {
            var loader = new Y.Loader({
                require: ["io"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("io")) > -1);
        },
     "Testing io-base": function(data) {
            var loader = new Y.Loader({
                require: ["io-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("io-base")) > -1);
        },
     "Testing io-form": function(data) {
            var loader = new Y.Loader({
                require: ["io-form"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("io-form")) > -1);
        },
     "Testing io-queue": function(data) {
            var loader = new Y.Loader({
                require: ["io-queue"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("io-queue")) > -1);
        },
     "Testing io-upload-iframe": function(data) {
            var loader = new Y.Loader({
                require: ["io-upload-iframe"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("io-upload-iframe")) > -1);
        },
     "Testing io-xdr": function(data) {
            var loader = new Y.Loader({
                require: ["io-xdr"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("io-xdr")) > -1);
        },
     "Testing json": function(data) {
            var loader = new Y.Loader({
                require: ["json"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("json")) > -1);
        },
     "Testing json-parse": function(data) {
            var loader = new Y.Loader({
                require: ["json-parse"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("json-parse")) > -1);
        },
     "Testing json-stringify": function(data) {
            var loader = new Y.Loader({
                require: ["json-stringify"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("json-stringify")) > -1);
        },
     "Testing jsonp": function(data) {
            var loader = new Y.Loader({
                require: ["jsonp"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("jsonp")) > -1);
        },
     "Testing node": function(data) {
            var loader = new Y.Loader({
                require: ["node"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node")) > -1);
        },
     "Testing node-base": function(data) {
            var loader = new Y.Loader({
                require: ["node-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node-base")) > -1);
        },
     "Testing node-event-delegate": function(data) {
            var loader = new Y.Loader({
                require: ["node-event-delegate"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node-event-delegate")) > -1);
        },
     "Testing node-pluginhost": function(data) {
            var loader = new Y.Loader({
                require: ["node-pluginhost"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node-pluginhost")) > -1);
        },
     "Testing node-screen": function(data) {
            var loader = new Y.Loader({
                require: ["node-screen"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node-screen")) > -1);
        },
     "Testing node-style": function(data) {
            var loader = new Y.Loader({
                require: ["node-style"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node-style")) > -1);
        },
     "Testing node-flick": function(data) {
            var loader = new Y.Loader({
                require: ["node-flick"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node-flick")) > -1);
        },
     "Testing node-focusmanager": function(data) {
            var loader = new Y.Loader({
                require: ["node-focusmanager"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node-focusmanager")) > -1);
        },
     "Testing node-menunav": function(data) {
            var loader = new Y.Loader({
                require: ["node-menunav"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("node-menunav")) > -1);
        },
     "Testing oop": function(data) {
            var loader = new Y.Loader({
                require: ["oop"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("oop")) > -1);
        },
     "Testing overlay": function(data) {
            var loader = new Y.Loader({
                require: ["overlay"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("overlay")) > -1);
        },
     "Testing plugin": function(data) {
            var loader = new Y.Loader({
                require: ["plugin"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("plugin")) > -1);
        },
     "Testing pluginhost": function(data) {
            var loader = new Y.Loader({
                require: ["pluginhost"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("pluginhost")) > -1);
        },
     "Testing pluginhost-base": function(data) {
            var loader = new Y.Loader({
                require: ["pluginhost-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("pluginhost-base")) > -1);
        },
     "Testing pluginhost-config": function(data) {
            var loader = new Y.Loader({
                require: ["pluginhost-config"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("pluginhost-config")) > -1);
        },
     "Testing profiler": function(data) {
            var loader = new Y.Loader({
                require: ["profiler"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("profiler")) > -1);
        },
     "Testing querystring": function(data) {
            var loader = new Y.Loader({
                require: ["querystring"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("querystring")) > -1);
        },
     "Testing querystring-parse": function(data) {
            var loader = new Y.Loader({
                require: ["querystring-parse"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("querystring-parse")) > -1);
        },
     "Testing querystring-stringify": function(data) {
            var loader = new Y.Loader({
                require: ["querystring-stringify"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("querystring-stringify")) > -1);
        },
     "Testing querystring-parse-simple": function(data) {
            var loader = new Y.Loader({
                require: ["querystring-parse-simple"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("querystring-parse-simple")) > -1);
        },
     "Testing querystring-stringify-simple": function(data) {
            var loader = new Y.Loader({
                require: ["querystring-stringify-simple"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("querystring-stringify-simple")) > -1);
        },
     "Testing queue-promote": function(data) {
            var loader = new Y.Loader({
                require: ["queue-promote"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("queue-promote")) > -1);
        },
     "Testing queue-run": function(data) {
            var loader = new Y.Loader({
                require: ["queue-run"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("queue-run")) > -1);
        },
     "Testing recordset": function(data) {
            var loader = new Y.Loader({
                require: ["recordset"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("recordset")) > -1);
        },
     "Testing recordset-base": function(data) {
            var loader = new Y.Loader({
                require: ["recordset-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("recordset-base")) > -1);
        },
     "Testing recordset-filter": function(data) {
            var loader = new Y.Loader({
                require: ["recordset-filter"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("recordset-filter")) > -1);
        },
     "Testing recordset-indexer": function(data) {
            var loader = new Y.Loader({
                require: ["recordset-indexer"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("recordset-indexer")) > -1);
        },
     "Testing recordset-sort": function(data) {
            var loader = new Y.Loader({
                require: ["recordset-sort"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("recordset-sort")) > -1);
        },
     "Testing resize": function(data) {
            var loader = new Y.Loader({
                require: ["resize"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("resize")) > -1);
        },
     "Testing resize-base": function(data) {
            var loader = new Y.Loader({
                require: ["resize-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("resize-base")) > -1);
        },
     "Testing resize-constrain": function(data) {
            var loader = new Y.Loader({
                require: ["resize-constrain"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("resize-constrain")) > -1);
        },
     "Testing resize-proxy": function(data) {
            var loader = new Y.Loader({
                require: ["resize-proxy"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("resize-proxy")) > -1);
        },
     "Testing scrollview": function(data) {
            var loader = new Y.Loader({
                require: ["scrollview"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("scrollview")) > -1);
        },
     "Testing slider": function(data) {
            var loader = new Y.Loader({
                require: ["slider"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("slider")) > -1);
        },
     "Testing clickable-rail": function(data) {
            var loader = new Y.Loader({
                require: ["clickable-rail"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("clickable-rail")) > -1);
        },
     "Testing range-slider": function(data) {
            var loader = new Y.Loader({
                require: ["range-slider"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("range-slider")) > -1);
        },
     "Testing slider-base": function(data) {
            var loader = new Y.Loader({
                require: ["slider-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("slider-base")) > -1);
        },
     "Testing slider-value-range": function(data) {
            var loader = new Y.Loader({
                require: ["slider-value-range"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("slider-value-range")) > -1);
        },
     "Testing sortable": function(data) {
            var loader = new Y.Loader({
                require: ["sortable"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("sortable")) > -1);
        },
     "Testing stylesheet": function(data) {
            var loader = new Y.Loader({
                require: ["stylesheet"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("stylesheet")) > -1);
        },
     "Testing substitute": function(data) {
            var loader = new Y.Loader({
                require: ["substitute"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("substitute")) > -1);
        },
     "Testing swf": function(data) {
            var loader = new Y.Loader({
                require: ["swf"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("swf")) > -1);
        },
     "Testing swfdetect": function(data) {
            var loader = new Y.Loader({
                require: ["swfdetect"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("swfdetect")) > -1);
        },
     "Testing tabview": function(data) {
            var loader = new Y.Loader({
                require: ["tabview"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("tabview")) > -1);
        },
     "Testing test": function(data) {
            var loader = new Y.Loader({
                require: ["test"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("test")) > -1);
        },
     "Testing text": function(data) {
            var loader = new Y.Loader({
                require: ["text"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("text")) > -1);
        },
     "Testing text-accentfold": function(data) {
            var loader = new Y.Loader({
                require: ["text-accentfold"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("text-accentfold")) > -1);
        },
     "Testing text-data-accentfold": function(data) {
            var loader = new Y.Loader({
                require: ["text-data-accentfold"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("text-data-accentfold")) > -1);
        },
     "Testing text-data-wordbreak": function(data) {
            var loader = new Y.Loader({
                require: ["text-data-wordbreak"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("text-data-wordbreak")) > -1);
        },
     "Testing text-wordbreak": function(data) {
            var loader = new Y.Loader({
                require: ["text-wordbreak"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("text-wordbreak")) > -1);
        },
     "Testing transition": function(data) {
            var loader = new Y.Loader({
                require: ["transition"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("transition")) > -1);
        },
     "Testing transition-native": function(data) {
            var loader = new Y.Loader({
                require: ["transition-native"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("transition-native")) > -1);
        },
     "Testing transition-timer": function(data) {
            var loader = new Y.Loader({
                require: ["transition-timer"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("transition-timer")) > -1);
        },
     "Testing widget": function(data) {
            var loader = new Y.Loader({
                require: ["widget"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("widget")) > -1);
        },
     "Testing widget-base": function(data) {
            var loader = new Y.Loader({
                require: ["widget-base"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("widget-base")) > -1);
        },
     "Testing widget-htmlparser": function(data) {
            var loader = new Y.Loader({
                require: ["widget-htmlparser"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("widget-htmlparser")) > -1);
        },
     "Testing widget-skin": function(data) {
            var loader = new Y.Loader({
                require: ["widget-skin"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("widget-skin")) > -1);
        },
     "Testing widget-uievents": function(data) {
            var loader = new Y.Loader({
                require: ["widget-uievents"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("widget-uievents")) > -1);
        },
     "Testing widget-anim": function(data) {
            var loader = new Y.Loader({
                require: ["widget-anim"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("widget-anim")) > -1);
        },
     "Testing widget-locale": function(data) {
            var loader = new Y.Loader({
                require: ["widget-locale"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("widget-locale")) > -1);
        },
     "Testing yql": function(data) {
            var loader = new Y.Loader({
                require: ["yql"],
                allowRollup: false
            });
            loader.calculate();
            Assert.isTrue((loader.sorted.indexOf("yql")) > -1);
        }    
}));

YUITest.TestRunner.add(suite);
