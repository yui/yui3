/*
* This file was assembled by ../scripts/build_loader_tests.js
*/

//This is a hack for global modules in npm 1.0
require.paths.push('/usr/local/lib/node_modules');


var yui3 = require('yui3'),
    path = require('path'),
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
         "Testing local load anim": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("anim");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load anim-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("anim-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load anim-color": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("anim-color");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load anim-curve": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("anim-curve");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load anim-easing": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("anim-easing");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load anim-node-plugin": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("anim-node-plugin");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load anim-scroll": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("anim-scroll");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load anim-xy": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("anim-xy");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load arraysort": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("arraysort");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load async-queue": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("async-queue");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load attribute": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("attribute");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load attribute-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("attribute-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load attribute-complex": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("attribute-complex");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load autocomplete": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("autocomplete");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load autocomplete-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("autocomplete-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load autocomplete-list": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("autocomplete-list");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load autocomplete-sources": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("autocomplete-sources");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load base-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("base-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load base-build": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("base-build");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load base-pluginhost": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("base-pluginhost");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load cache": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("cache");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load cache-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("cache-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load cache-offline": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("cache-offline");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load cache-plugin": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("cache-plugin");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load charts": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("charts");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load classnamemanager": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("classnamemanager");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load collection": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("collection");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load array-extras": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("array-extras");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load array-invoke": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("array-invoke");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load arraylist": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("arraylist");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load arraylist-add": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("arraylist-add");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load arraylist-filter": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("arraylist-filter");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load compat": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("compat");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load console": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("console");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load cookie": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("cookie");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dataschema": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dataschema");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dataschema-array": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dataschema-array");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dataschema-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dataschema-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dataschema-json": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dataschema-json");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dataschema-text": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dataschema-text");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dataschema-xml": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dataschema-xml");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-arrayschema": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-arrayschema");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-cache": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-cache");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-function": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-function");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-get": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-get");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-io": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-io");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-jsonschema": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-jsonschema");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-local": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-local");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-polling": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-polling");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-textschema": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-textschema");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datasource-xmlschema": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datasource-xmlschema");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatable": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatable");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatable-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatable-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatable-datasource": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatable-datasource");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatable-scroll": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatable-scroll");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatable-sort": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatable-sort");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatype": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatype");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatype-date": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatype-date");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatype-number": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatype-number");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatype-xml": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatype-xml");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load datatype-date-format": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("datatype-date-format");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-constrain": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-constrain");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-ddm": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-ddm");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-ddm-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-ddm-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-ddm-drop": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-ddm-drop");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-delegate": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-delegate");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-drag": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-drag");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-drop": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-drop");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-proxy": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-proxy");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dd-scroll": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dd-scroll");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dial": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dial");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dom": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dom");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dom-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dom-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dom-screen": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dom-screen");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dom-style": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dom-style");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load selector": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("selector");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load selector-native": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("selector-native");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load dump": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("dump");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load editor": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("editor");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load createlink-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("createlink-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load editor-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("editor-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load editor-bidi": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("editor-bidi");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load editor-br": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("editor-br");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load editor-lists": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("editor-lists");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load editor-para": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("editor-para");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load exec-command": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("exec-command");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load frame": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("frame");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load selection": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("selection");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load escape": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("escape");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-delegate": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-delegate");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-focus": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-focus");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-hover": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-hover");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-key": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-key");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-mouseenter": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-mouseenter");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-mousewheel": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-mousewheel");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-resize": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-resize");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-synthetic": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-synthetic");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-custom": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-custom");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-custom-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-custom-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-custom-complex": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-custom-complex");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-gestures": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-gestures");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-flick": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-flick");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-move": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-move");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-simulate": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-simulate");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load event-valuechange": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("event-valuechange");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load highlight": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("highlight");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load highlight-accentfold": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("highlight-accentfold");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load highlight-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("highlight-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load history": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("history");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load history-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("history-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load history-hash": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("history-hash");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load history-html5": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("history-html5");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load history-deprecated": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("history-deprecated");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load intl": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("intl");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load io": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("io");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load io-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("io-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load io-form": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("io-form");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load io-queue": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("io-queue");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load io-upload-iframe": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("io-upload-iframe");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load io-xdr": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("io-xdr");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load json": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("json");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load json-parse": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("json-parse");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load json-stringify": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("json-stringify");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load jsonp": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("jsonp");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node-event-delegate": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node-event-delegate");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node-pluginhost": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node-pluginhost");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node-screen": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node-screen");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node-style": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node-style");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node-flick": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node-flick");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node-focusmanager": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node-focusmanager");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load node-menunav": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("node-menunav");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load oop": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("oop");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load overlay": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("overlay");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load plugin": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("plugin");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load pluginhost": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("pluginhost");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load pluginhost-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("pluginhost-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load pluginhost-config": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("pluginhost-config");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load profiler": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("profiler");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load querystring": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("querystring");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load querystring-parse": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("querystring-parse");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load querystring-stringify": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("querystring-stringify");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load querystring-parse-simple": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("querystring-parse-simple");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load querystring-stringify-simple": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("querystring-stringify-simple");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load queue-promote": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("queue-promote");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load recordset": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("recordset");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load recordset-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("recordset-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load recordset-filter": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("recordset-filter");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load recordset-indexer": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("recordset-indexer");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load recordset-sort": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("recordset-sort");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load resize": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("resize");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load resize-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("resize-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load resize-constrain": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("resize-constrain");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load resize-proxy": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("resize-proxy");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load scrollview": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("scrollview");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load slider": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("slider");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load clickable-rail": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("clickable-rail");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load range-slider": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("range-slider");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load slider-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("slider-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load slider-value-range": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("slider-value-range");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load sortable": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("sortable");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load stylesheet": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("stylesheet");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load substitute": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("substitute");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load swf": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("swf");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load swfdetect": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("swfdetect");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load tabview": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("tabview");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load test": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("test");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load text": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("text");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load text-accentfold": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("text-accentfold");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load text-data-accentfold": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("text-data-accentfold");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load text-data-wordbreak": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("text-data-wordbreak");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load text-wordbreak": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("text-wordbreak");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load transition": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("transition");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load transition-native": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("transition-native");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load transition-timer": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("transition-timer");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load widget": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("widget");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load widget-base": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("widget-base");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load widget-htmlparser": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("widget-htmlparser");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load widget-skin": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("widget-skin");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load widget-uievents": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("widget-uievents");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load widget-anim": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("widget-anim");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load widget-locale": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("widget-locale");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        },
     "Testing local load yql": function(data) {
            var p = path.join(__dirname, "../../../../");
            var Y = yui3.configure({ debug: false, yuiPath: p }).useSync("yql");
            Assert.areEqual(Y.Env._missed.length, 0, "Modules found in Env._missed: " + JSON.stringify(Y.Env._missed));
        }    
}));

YUITest.TestRunner.add(suite);
