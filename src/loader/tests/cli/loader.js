/*
* This file was assembled by ../scripts/build_loader_tests.js
*/

var path = require('path'),
    YUI = require(path.join(__dirname, '../../../../', 'build/yui/yui.js')).YUI;
    Y = YUI(),
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
         "Testing align-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["align-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("align-plugin")) > -1, "Module (align-plugin) not found in sorted array");
        },
     "Testing anim": function(data) {
            var loader = new Y.Loader({
                require: ["anim"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("anim-base")) > -1, "Module (anim-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("anim-color")) > -1, "Module (anim-color) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("anim-curve")) > -1, "Module (anim-curve) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("anim-easing")) > -1, "Module (anim-easing) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("anim-node-plugin")) > -1, "Module (anim-node-plugin) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("anim-scroll")) > -1, "Module (anim-scroll) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("anim-xy")) > -1, "Module (anim-xy) not found in sorted array");
        },
     "Testing anim-base": function(data) {
            var loader = new Y.Loader({
                require: ["anim-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("anim-base")) > -1, "Module (anim-base) not found in sorted array");
        },
     "Testing anim-color": function(data) {
            var loader = new Y.Loader({
                require: ["anim-color"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("anim-color")) > -1, "Module (anim-color) not found in sorted array");
        },
     "Testing anim-curve": function(data) {
            var loader = new Y.Loader({
                require: ["anim-curve"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("anim-curve")) > -1, "Module (anim-curve) not found in sorted array");
        },
     "Testing anim-easing": function(data) {
            var loader = new Y.Loader({
                require: ["anim-easing"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("anim-easing")) > -1, "Module (anim-easing) not found in sorted array");
        },
     "Testing anim-node-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["anim-node-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("anim-node-plugin")) > -1, "Module (anim-node-plugin) not found in sorted array");
        },
     "Testing anim-scroll": function(data) {
            var loader = new Y.Loader({
                require: ["anim-scroll"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("anim-scroll")) > -1, "Module (anim-scroll) not found in sorted array");
        },
     "Testing anim-shape": function(data) {
            var loader = new Y.Loader({
                require: ["anim-shape"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("anim-shape")) > -1, "Module (anim-shape) not found in sorted array");
        },
     "Testing anim-shape-transform": function(data) {
            var loader = new Y.Loader({
                require: ["anim-shape-transform"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("anim-shape")) > -1, "Module (anim-shape) not found in sorted array");
        },
     "Testing anim-xy": function(data) {
            var loader = new Y.Loader({
                require: ["anim-xy"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("anim-xy")) > -1, "Module (anim-xy) not found in sorted array");
        },
     "Testing app": function(data) {
            var loader = new Y.Loader({
                require: ["app"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("app-base")) > -1, "Module (app-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("app-content")) > -1, "Module (app-content) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("app-transitions")) > -1, "Module (app-transitions) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("lazy-model-list")) > -1, "Module (lazy-model-list) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("model")) > -1, "Module (model) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("model-list")) > -1, "Module (model-list) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("model-sync-rest")) > -1, "Module (model-sync-rest) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("router")) > -1, "Module (router) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("view")) > -1, "Module (view) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("view-node-map")) > -1, "Module (view-node-map) not found in sorted array");
        },
     "Testing app-base": function(data) {
            var loader = new Y.Loader({
                require: ["app-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("app-base")) > -1, "Module (app-base) not found in sorted array");
        },
     "Testing app-content": function(data) {
            var loader = new Y.Loader({
                require: ["app-content"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("app-content")) > -1, "Module (app-content) not found in sorted array");
        },
     "Testing app-transitions": function(data) {
            var loader = new Y.Loader({
                require: ["app-transitions"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("app-transitions")) > -1, "Module (app-transitions) not found in sorted array");
        },
     "Testing app-transitions-native": function(data) {
            var loader = new Y.Loader({
                require: ["app-transitions-native"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("app-transitions-native")) > -1, "Module (app-transitions-native) not found in sorted array");
        },
     "Testing array-extras": function(data) {
            var loader = new Y.Loader({
                require: ["array-extras"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("array-extras")) > -1, "Module (array-extras) not found in sorted array");
        },
     "Testing array-invoke": function(data) {
            var loader = new Y.Loader({
                require: ["array-invoke"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("array-invoke")) > -1, "Module (array-invoke) not found in sorted array");
        },
     "Testing arraylist": function(data) {
            var loader = new Y.Loader({
                require: ["arraylist"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("arraylist")) > -1, "Module (arraylist) not found in sorted array");
        },
     "Testing arraylist-add": function(data) {
            var loader = new Y.Loader({
                require: ["arraylist-add"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("arraylist-add")) > -1, "Module (arraylist-add) not found in sorted array");
        },
     "Testing arraylist-filter": function(data) {
            var loader = new Y.Loader({
                require: ["arraylist-filter"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("arraylist-filter")) > -1, "Module (arraylist-filter) not found in sorted array");
        },
     "Testing arraysort": function(data) {
            var loader = new Y.Loader({
                require: ["arraysort"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("arraysort")) > -1, "Module (arraysort) not found in sorted array");
        },
     "Testing async-queue": function(data) {
            var loader = new Y.Loader({
                require: ["async-queue"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("async-queue")) > -1, "Module (async-queue) not found in sorted array");
        },
     "Testing attribute": function(data) {
            var loader = new Y.Loader({
                require: ["attribute"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("attribute-base")) > -1, "Module (attribute-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("attribute-complex")) > -1, "Module (attribute-complex) not found in sorted array");
        },
     "Testing attribute-base": function(data) {
            var loader = new Y.Loader({
                require: ["attribute-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("attribute-base")) > -1, "Module (attribute-base) not found in sorted array");
        },
     "Testing attribute-complex": function(data) {
            var loader = new Y.Loader({
                require: ["attribute-complex"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("attribute-complex")) > -1, "Module (attribute-complex) not found in sorted array");
        },
     "Testing attribute-core": function(data) {
            var loader = new Y.Loader({
                require: ["attribute-core"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("attribute-core")) > -1, "Module (attribute-core) not found in sorted array");
        },
     "Testing attribute-events": function(data) {
            var loader = new Y.Loader({
                require: ["attribute-events"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("attribute-observable")) > -1, "Module (attribute-observable) not found in sorted array");
        },
     "Testing attribute-extras": function(data) {
            var loader = new Y.Loader({
                require: ["attribute-extras"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("attribute-extras")) > -1, "Module (attribute-extras) not found in sorted array");
        },
     "Testing attribute-observable": function(data) {
            var loader = new Y.Loader({
                require: ["attribute-observable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("attribute-observable")) > -1, "Module (attribute-observable) not found in sorted array");
        },
     "Testing autocomplete": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-base")) > -1, "Module (autocomplete-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("autocomplete-sources")) > -1, "Module (autocomplete-sources) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("autocomplete-list")) > -1, "Module (autocomplete-list) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("autocomplete-plugin")) > -1, "Module (autocomplete-plugin) not found in sorted array");
        },
     "Testing autocomplete-base": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-base")) > -1, "Module (autocomplete-base) not found in sorted array");
        },
     "Testing autocomplete-filters": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-filters"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-filters")) > -1, "Module (autocomplete-filters) not found in sorted array");
        },
     "Testing autocomplete-filters-accentfold": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-filters-accentfold"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-filters-accentfold")) > -1, "Module (autocomplete-filters-accentfold) not found in sorted array");
        },
     "Testing autocomplete-highlighters": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-highlighters"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-highlighters")) > -1, "Module (autocomplete-highlighters) not found in sorted array");
        },
     "Testing autocomplete-highlighters-accentfold": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-highlighters-accentfold"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-highlighters-accentfold")) > -1, "Module (autocomplete-highlighters-accentfold) not found in sorted array");
        },
     "Testing autocomplete-list": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-list"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-list")) > -1, "Module (autocomplete-list) not found in sorted array");
        },
     "Testing autocomplete-list-keys": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-list-keys"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-list-keys")) > -1, "Module (autocomplete-list-keys) not found in sorted array");
        },
     "Testing autocomplete-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-plugin")) > -1, "Module (autocomplete-plugin) not found in sorted array");
        },
     "Testing autocomplete-sources": function(data) {
            var loader = new Y.Loader({
                require: ["autocomplete-sources"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("autocomplete-sources")) > -1, "Module (autocomplete-sources) not found in sorted array");
        },
     "Testing axes": function(data) {
            var loader = new Y.Loader({
                require: ["axes"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("axis-numeric")) > -1, "Module (axis-numeric) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("axis-category")) > -1, "Module (axis-category) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("axis-time")) > -1, "Module (axis-time) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("axis-stacked")) > -1, "Module (axis-stacked) not found in sorted array");
        },
     "Testing axes-base": function(data) {
            var loader = new Y.Loader({
                require: ["axes-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("axis-numeric-base")) > -1, "Module (axis-numeric-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("axis-category-base")) > -1, "Module (axis-category-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("axis-time-base")) > -1, "Module (axis-time-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("axis-stacked-base")) > -1, "Module (axis-stacked-base) not found in sorted array");
        },
     "Testing axis": function(data) {
            var loader = new Y.Loader({
                require: ["axis"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis")) > -1, "Module (axis) not found in sorted array");
        },
     "Testing axis-base": function(data) {
            var loader = new Y.Loader({
                require: ["axis-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-base")) > -1, "Module (axis-base) not found in sorted array");
        },
     "Testing axis-category": function(data) {
            var loader = new Y.Loader({
                require: ["axis-category"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-category")) > -1, "Module (axis-category) not found in sorted array");
        },
     "Testing axis-category-base": function(data) {
            var loader = new Y.Loader({
                require: ["axis-category-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-category-base")) > -1, "Module (axis-category-base) not found in sorted array");
        },
     "Testing axis-numeric": function(data) {
            var loader = new Y.Loader({
                require: ["axis-numeric"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-numeric")) > -1, "Module (axis-numeric) not found in sorted array");
        },
     "Testing axis-numeric-base": function(data) {
            var loader = new Y.Loader({
                require: ["axis-numeric-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-numeric-base")) > -1, "Module (axis-numeric-base) not found in sorted array");
        },
     "Testing axis-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["axis-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-stacked")) > -1, "Module (axis-stacked) not found in sorted array");
        },
     "Testing axis-stacked-base": function(data) {
            var loader = new Y.Loader({
                require: ["axis-stacked-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-stacked-base")) > -1, "Module (axis-stacked-base) not found in sorted array");
        },
     "Testing axis-time": function(data) {
            var loader = new Y.Loader({
                require: ["axis-time"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-time")) > -1, "Module (axis-time) not found in sorted array");
        },
     "Testing axis-time-base": function(data) {
            var loader = new Y.Loader({
                require: ["axis-time-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("axis-time-base")) > -1, "Module (axis-time-base) not found in sorted array");
        },
     "Testing base": function(data) {
            var loader = new Y.Loader({
                require: ["base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("base-base")) > -1, "Module (base-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("base-pluginhost")) > -1, "Module (base-pluginhost) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("base-build")) > -1, "Module (base-build) not found in sorted array");
        },
     "Testing base-base": function(data) {
            var loader = new Y.Loader({
                require: ["base-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("base-base")) > -1, "Module (base-base) not found in sorted array");
        },
     "Testing base-build": function(data) {
            var loader = new Y.Loader({
                require: ["base-build"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("base-build")) > -1, "Module (base-build) not found in sorted array");
        },
     "Testing base-core": function(data) {
            var loader = new Y.Loader({
                require: ["base-core"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("base-core")) > -1, "Module (base-core) not found in sorted array");
        },
     "Testing base-observable": function(data) {
            var loader = new Y.Loader({
                require: ["base-observable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("base-observable")) > -1, "Module (base-observable) not found in sorted array");
        },
     "Testing base-pluginhost": function(data) {
            var loader = new Y.Loader({
                require: ["base-pluginhost"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("base-pluginhost")) > -1, "Module (base-pluginhost) not found in sorted array");
        },
     "Testing button": function(data) {
            var loader = new Y.Loader({
                require: ["button"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("button")) > -1, "Module (button) not found in sorted array");
        },
     "Testing button-core": function(data) {
            var loader = new Y.Loader({
                require: ["button-core"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("button-core")) > -1, "Module (button-core) not found in sorted array");
        },
     "Testing button-group": function(data) {
            var loader = new Y.Loader({
                require: ["button-group"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("button-group")) > -1, "Module (button-group) not found in sorted array");
        },
     "Testing button-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["button-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("button-plugin")) > -1, "Module (button-plugin) not found in sorted array");
        },
     "Testing cache": function(data) {
            var loader = new Y.Loader({
                require: ["cache"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("cache-base")) > -1, "Module (cache-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("cache-offline")) > -1, "Module (cache-offline) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("cache-plugin")) > -1, "Module (cache-plugin) not found in sorted array");
        },
     "Testing cache-base": function(data) {
            var loader = new Y.Loader({
                require: ["cache-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("cache-base")) > -1, "Module (cache-base) not found in sorted array");
        },
     "Testing cache-offline": function(data) {
            var loader = new Y.Loader({
                require: ["cache-offline"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("cache-offline")) > -1, "Module (cache-offline) not found in sorted array");
        },
     "Testing cache-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["cache-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("cache-plugin")) > -1, "Module (cache-plugin) not found in sorted array");
        },
     "Testing calendar": function(data) {
            var loader = new Y.Loader({
                require: ["calendar"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("calendar")) > -1, "Module (calendar) not found in sorted array");
        },
     "Testing calendar-base": function(data) {
            var loader = new Y.Loader({
                require: ["calendar-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("calendar-base")) > -1, "Module (calendar-base) not found in sorted array");
        },
     "Testing calendarnavigator": function(data) {
            var loader = new Y.Loader({
                require: ["calendarnavigator"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("calendarnavigator")) > -1, "Module (calendarnavigator) not found in sorted array");
        },
     "Testing charts": function(data) {
            var loader = new Y.Loader({
                require: ["charts"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("charts-base")) > -1, "Module (charts-base) not found in sorted array");
        },
     "Testing charts-base": function(data) {
            var loader = new Y.Loader({
                require: ["charts-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("charts-base")) > -1, "Module (charts-base) not found in sorted array");
        },
     "Testing charts-legend": function(data) {
            var loader = new Y.Loader({
                require: ["charts-legend"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("charts-legend")) > -1, "Module (charts-legend) not found in sorted array");
        },
     "Testing classnamemanager": function(data) {
            var loader = new Y.Loader({
                require: ["classnamemanager"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("classnamemanager")) > -1, "Module (classnamemanager) not found in sorted array");
        },
     "Testing clickable-rail": function(data) {
            var loader = new Y.Loader({
                require: ["clickable-rail"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("clickable-rail")) > -1, "Module (clickable-rail) not found in sorted array");
        },
     "Testing collection": function(data) {
            var loader = new Y.Loader({
                require: ["collection"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("array-extras")) > -1, "Module (array-extras) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("arraylist")) > -1, "Module (arraylist) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("arraylist-add")) > -1, "Module (arraylist-add) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("arraylist-filter")) > -1, "Module (arraylist-filter) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("array-invoke")) > -1, "Module (array-invoke) not found in sorted array");
        },
     "Testing color": function(data) {
            var loader = new Y.Loader({
                require: ["color"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("color-base")) > -1, "Module (color-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("color-hsl")) > -1, "Module (color-hsl) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("color-harmony")) > -1, "Module (color-harmony) not found in sorted array");
        },
     "Testing color-base": function(data) {
            var loader = new Y.Loader({
                require: ["color-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("color-base")) > -1, "Module (color-base) not found in sorted array");
        },
     "Testing color-harmony": function(data) {
            var loader = new Y.Loader({
                require: ["color-harmony"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("color-harmony")) > -1, "Module (color-harmony) not found in sorted array");
        },
     "Testing color-hsl": function(data) {
            var loader = new Y.Loader({
                require: ["color-hsl"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("color-hsl")) > -1, "Module (color-hsl) not found in sorted array");
        },
     "Testing color-hsv": function(data) {
            var loader = new Y.Loader({
                require: ["color-hsv"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("color-hsv")) > -1, "Module (color-hsv) not found in sorted array");
        },
     "Testing console": function(data) {
            var loader = new Y.Loader({
                require: ["console"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("console")) > -1, "Module (console) not found in sorted array");
        },
     "Testing console-filters": function(data) {
            var loader = new Y.Loader({
                require: ["console-filters"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("console-filters")) > -1, "Module (console-filters) not found in sorted array");
        },
     "Testing controller": function(data) {
            var loader = new Y.Loader({
                require: ["controller"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("router")) > -1, "Module (router) not found in sorted array");
        },
     "Testing cookie": function(data) {
            var loader = new Y.Loader({
                require: ["cookie"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("cookie")) > -1, "Module (cookie) not found in sorted array");
        },
     "Testing createlink-base": function(data) {
            var loader = new Y.Loader({
                require: ["createlink-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("createlink-base")) > -1, "Module (createlink-base) not found in sorted array");
        },
     "Testing dataschema": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("dataschema-base")) > -1, "Module (dataschema-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dataschema-json")) > -1, "Module (dataschema-json) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dataschema-xml")) > -1, "Module (dataschema-xml) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dataschema-array")) > -1, "Module (dataschema-array) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dataschema-text")) > -1, "Module (dataschema-text) not found in sorted array");
        },
     "Testing dataschema-array": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-array"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dataschema-array")) > -1, "Module (dataschema-array) not found in sorted array");
        },
     "Testing dataschema-base": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dataschema-base")) > -1, "Module (dataschema-base) not found in sorted array");
        },
     "Testing dataschema-json": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-json"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dataschema-json")) > -1, "Module (dataschema-json) not found in sorted array");
        },
     "Testing dataschema-text": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-text"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dataschema-text")) > -1, "Module (dataschema-text) not found in sorted array");
        },
     "Testing dataschema-xml": function(data) {
            var loader = new Y.Loader({
                require: ["dataschema-xml"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dataschema-xml")) > -1, "Module (dataschema-xml) not found in sorted array");
        },
     "Testing datasource": function(data) {
            var loader = new Y.Loader({
                require: ["datasource"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("datasource-local")) > -1, "Module (datasource-local) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-io")) > -1, "Module (datasource-io) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-get")) > -1, "Module (datasource-get) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-function")) > -1, "Module (datasource-function) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-cache")) > -1, "Module (datasource-cache) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-jsonschema")) > -1, "Module (datasource-jsonschema) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-xmlschema")) > -1, "Module (datasource-xmlschema) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-arrayschema")) > -1, "Module (datasource-arrayschema) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-textschema")) > -1, "Module (datasource-textschema) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datasource-polling")) > -1, "Module (datasource-polling) not found in sorted array");
        },
     "Testing datasource-arrayschema": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-arrayschema"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-arrayschema")) > -1, "Module (datasource-arrayschema) not found in sorted array");
        },
     "Testing datasource-cache": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-cache"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-cache")) > -1, "Module (datasource-cache) not found in sorted array");
        },
     "Testing datasource-function": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-function"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-function")) > -1, "Module (datasource-function) not found in sorted array");
        },
     "Testing datasource-get": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-get"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-get")) > -1, "Module (datasource-get) not found in sorted array");
        },
     "Testing datasource-io": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-io"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-io")) > -1, "Module (datasource-io) not found in sorted array");
        },
     "Testing datasource-jsonschema": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-jsonschema"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-jsonschema")) > -1, "Module (datasource-jsonschema) not found in sorted array");
        },
     "Testing datasource-local": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-local"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-local")) > -1, "Module (datasource-local) not found in sorted array");
        },
     "Testing datasource-polling": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-polling"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-polling")) > -1, "Module (datasource-polling) not found in sorted array");
        },
     "Testing datasource-textschema": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-textschema"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-textschema")) > -1, "Module (datasource-textschema) not found in sorted array");
        },
     "Testing datasource-xmlschema": function(data) {
            var loader = new Y.Loader({
                require: ["datasource-xmlschema"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datasource-xmlschema")) > -1, "Module (datasource-xmlschema) not found in sorted array");
        },
     "Testing datatable": function(data) {
            var loader = new Y.Loader({
                require: ["datatable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("datatable-core")) > -1, "Module (datatable-core) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-table")) > -1, "Module (datatable-table) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-head")) > -1, "Module (datatable-head) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-body")) > -1, "Module (datatable-body) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-base")) > -1, "Module (datatable-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-column-widths")) > -1, "Module (datatable-column-widths) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-message")) > -1, "Module (datatable-message) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-mutable")) > -1, "Module (datatable-mutable) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-sort")) > -1, "Module (datatable-sort) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatable-datasource")) > -1, "Module (datatable-datasource) not found in sorted array");
        },
     "Testing datatable-base": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-base")) > -1, "Module (datatable-base) not found in sorted array");
        },
     "Testing datatable-body": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-body"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-body")) > -1, "Module (datatable-body) not found in sorted array");
        },
     "Testing datatable-column-widths": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-column-widths"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-column-widths")) > -1, "Module (datatable-column-widths) not found in sorted array");
        },
     "Testing datatable-core": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-core"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-core")) > -1, "Module (datatable-core) not found in sorted array");
        },
     "Testing datatable-datasource": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-datasource"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-datasource")) > -1, "Module (datatable-datasource) not found in sorted array");
        },
     "Testing datatable-formatters": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-formatters"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-formatters")) > -1, "Module (datatable-formatters) not found in sorted array");
        },
     "Testing datatable-head": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-head"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-head")) > -1, "Module (datatable-head) not found in sorted array");
        },
     "Testing datatable-message": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-message"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-message")) > -1, "Module (datatable-message) not found in sorted array");
        },
     "Testing datatable-mutable": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-mutable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-mutable")) > -1, "Module (datatable-mutable) not found in sorted array");
        },
     "Testing datatable-scroll": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-scroll"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-scroll")) > -1, "Module (datatable-scroll) not found in sorted array");
        },
     "Testing datatable-sort": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-sort"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-sort")) > -1, "Module (datatable-sort) not found in sorted array");
        },
     "Testing datatable-table": function(data) {
            var loader = new Y.Loader({
                require: ["datatable-table"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatable-table")) > -1, "Module (datatable-table) not found in sorted array");
        },
     "Testing datatype": function(data) {
            var loader = new Y.Loader({
                require: ["datatype"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            //Testing A rollup of a rollup module ( datatype )
            Assert.isTrue((loader.sorted.indexOf("datatype-date-parse")) > -1, "Module (datatype-date-parse) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatype-date-format")) > -1, "Module (datatype-date-format) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatype-date-math")) > -1, "Module (datatype-date-math) not found in sorted array");
            //Testing A rollup of a rollup module ( datatype )
            Assert.isTrue((loader.sorted.indexOf("datatype-number-parse")) > -1, "Module (datatype-number-parse) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatype-number-format")) > -1, "Module (datatype-number-format) not found in sorted array");
            //Testing A rollup of a rollup module ( datatype )
            Assert.isTrue((loader.sorted.indexOf("datatype-xml-parse")) > -1, "Module (datatype-xml-parse) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatype-xml-format")) > -1, "Module (datatype-xml-format) not found in sorted array");
        },
     "Testing datatype-date": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-date"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("datatype-date-parse")) > -1, "Module (datatype-date-parse) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatype-date-format")) > -1, "Module (datatype-date-format) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatype-date-math")) > -1, "Module (datatype-date-math) not found in sorted array");
        },
     "Testing datatype-date-format": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-date-format"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatype-date-format")) > -1, "Module (datatype-date-format) not found in sorted array");
        },
     "Testing datatype-date-math": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-date-math"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatype-date-math")) > -1, "Module (datatype-date-math) not found in sorted array");
        },
     "Testing datatype-date-parse": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-date-parse"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatype-date-parse")) > -1, "Module (datatype-date-parse) not found in sorted array");
        },
     "Testing datatype-number": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-number"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("datatype-number-parse")) > -1, "Module (datatype-number-parse) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatype-number-format")) > -1, "Module (datatype-number-format) not found in sorted array");
        },
     "Testing datatype-number-format": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-number-format"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatype-number-format")) > -1, "Module (datatype-number-format) not found in sorted array");
        },
     "Testing datatype-number-parse": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-number-parse"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatype-number-parse")) > -1, "Module (datatype-number-parse) not found in sorted array");
        },
     "Testing datatype-xml": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-xml"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("datatype-xml-parse")) > -1, "Module (datatype-xml-parse) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("datatype-xml-format")) > -1, "Module (datatype-xml-format) not found in sorted array");
        },
     "Testing datatype-xml-format": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-xml-format"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatype-xml-format")) > -1, "Module (datatype-xml-format) not found in sorted array");
        },
     "Testing datatype-xml-parse": function(data) {
            var loader = new Y.Loader({
                require: ["datatype-xml-parse"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("datatype-xml-parse")) > -1, "Module (datatype-xml-parse) not found in sorted array");
        },
     "Testing dd": function(data) {
            var loader = new Y.Loader({
                require: ["dd"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("dd-ddm-base")) > -1, "Module (dd-ddm-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dd-ddm")) > -1, "Module (dd-ddm) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dd-ddm-drop")) > -1, "Module (dd-ddm-drop) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dd-drag")) > -1, "Module (dd-drag) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dd-proxy")) > -1, "Module (dd-proxy) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dd-constrain")) > -1, "Module (dd-constrain) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dd-drop")) > -1, "Module (dd-drop) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dd-scroll")) > -1, "Module (dd-scroll) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dd-delegate")) > -1, "Module (dd-delegate) not found in sorted array");
        },
     "Testing dd-constrain": function(data) {
            var loader = new Y.Loader({
                require: ["dd-constrain"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-constrain")) > -1, "Module (dd-constrain) not found in sorted array");
        },
     "Testing dd-ddm": function(data) {
            var loader = new Y.Loader({
                require: ["dd-ddm"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-ddm")) > -1, "Module (dd-ddm) not found in sorted array");
        },
     "Testing dd-ddm-base": function(data) {
            var loader = new Y.Loader({
                require: ["dd-ddm-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-ddm-base")) > -1, "Module (dd-ddm-base) not found in sorted array");
        },
     "Testing dd-ddm-drop": function(data) {
            var loader = new Y.Loader({
                require: ["dd-ddm-drop"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-ddm-drop")) > -1, "Module (dd-ddm-drop) not found in sorted array");
        },
     "Testing dd-delegate": function(data) {
            var loader = new Y.Loader({
                require: ["dd-delegate"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-delegate")) > -1, "Module (dd-delegate) not found in sorted array");
        },
     "Testing dd-drag": function(data) {
            var loader = new Y.Loader({
                require: ["dd-drag"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-drag")) > -1, "Module (dd-drag) not found in sorted array");
        },
     "Testing dd-drop": function(data) {
            var loader = new Y.Loader({
                require: ["dd-drop"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-drop")) > -1, "Module (dd-drop) not found in sorted array");
        },
     "Testing dd-drop-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["dd-drop-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-drop-plugin")) > -1, "Module (dd-drop-plugin) not found in sorted array");
        },
     "Testing dd-gestures": function(data) {
            var loader = new Y.Loader({
                require: ["dd-gestures"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-gestures")) > -1, "Module (dd-gestures) not found in sorted array");
        },
     "Testing dd-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["dd-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-plugin")) > -1, "Module (dd-plugin) not found in sorted array");
        },
     "Testing dd-proxy": function(data) {
            var loader = new Y.Loader({
                require: ["dd-proxy"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-proxy")) > -1, "Module (dd-proxy) not found in sorted array");
        },
     "Testing dd-scroll": function(data) {
            var loader = new Y.Loader({
                require: ["dd-scroll"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dd-scroll")) > -1, "Module (dd-scroll) not found in sorted array");
        },
     "Testing dial": function(data) {
            var loader = new Y.Loader({
                require: ["dial"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dial")) > -1, "Module (dial) not found in sorted array");
        },
     "Testing dom": function(data) {
            var loader = new Y.Loader({
                require: ["dom"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("dom-base")) > -1, "Module (dom-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dom-screen")) > -1, "Module (dom-screen) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("dom-style")) > -1, "Module (dom-style) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("selector-native")) > -1, "Module (selector-native) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("selector")) > -1, "Module (selector) not found in sorted array");
        },
     "Testing dom-base": function(data) {
            var loader = new Y.Loader({
                require: ["dom-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dom-base")) > -1, "Module (dom-base) not found in sorted array");
        },
     "Testing dom-core": function(data) {
            var loader = new Y.Loader({
                require: ["dom-core"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dom-core")) > -1, "Module (dom-core) not found in sorted array");
        },
     "Testing dom-deprecated": function(data) {
            var loader = new Y.Loader({
                require: ["dom-deprecated"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dom-deprecated")) > -1, "Module (dom-deprecated) not found in sorted array");
        },
     "Testing dom-screen": function(data) {
            var loader = new Y.Loader({
                require: ["dom-screen"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dom-screen")) > -1, "Module (dom-screen) not found in sorted array");
        },
     "Testing dom-style": function(data) {
            var loader = new Y.Loader({
                require: ["dom-style"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dom-style")) > -1, "Module (dom-style) not found in sorted array");
        },
     "Testing dom-style-ie": function(data) {
            var loader = new Y.Loader({
                require: ["dom-style-ie"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dom-style-ie")) > -1, "Module (dom-style-ie) not found in sorted array");
        },
     "Testing dump": function(data) {
            var loader = new Y.Loader({
                require: ["dump"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("dump")) > -1, "Module (dump) not found in sorted array");
        },
     "Testing editor": function(data) {
            var loader = new Y.Loader({
                require: ["editor"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("frame")) > -1, "Module (frame) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("editor-selection")) > -1, "Module (editor-selection) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("exec-command")) > -1, "Module (exec-command) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("editor-base")) > -1, "Module (editor-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("editor-para")) > -1, "Module (editor-para) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("editor-br")) > -1, "Module (editor-br) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("editor-bidi")) > -1, "Module (editor-bidi) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("editor-tab")) > -1, "Module (editor-tab) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("createlink-base")) > -1, "Module (createlink-base) not found in sorted array");
        },
     "Testing editor-base": function(data) {
            var loader = new Y.Loader({
                require: ["editor-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-base")) > -1, "Module (editor-base) not found in sorted array");
        },
     "Testing editor-bidi": function(data) {
            var loader = new Y.Loader({
                require: ["editor-bidi"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-bidi")) > -1, "Module (editor-bidi) not found in sorted array");
        },
     "Testing editor-br": function(data) {
            var loader = new Y.Loader({
                require: ["editor-br"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-br")) > -1, "Module (editor-br) not found in sorted array");
        },
     "Testing editor-lists": function(data) {
            var loader = new Y.Loader({
                require: ["editor-lists"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-lists")) > -1, "Module (editor-lists) not found in sorted array");
        },
     "Testing editor-para": function(data) {
            var loader = new Y.Loader({
                require: ["editor-para"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-para")) > -1, "Module (editor-para) not found in sorted array");
        },
     "Testing editor-para-base": function(data) {
            var loader = new Y.Loader({
                require: ["editor-para-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-para-base")) > -1, "Module (editor-para-base) not found in sorted array");
        },
     "Testing editor-para-ie": function(data) {
            var loader = new Y.Loader({
                require: ["editor-para-ie"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-para-ie")) > -1, "Module (editor-para-ie) not found in sorted array");
        },
     "Testing editor-selection": function(data) {
            var loader = new Y.Loader({
                require: ["editor-selection"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-selection")) > -1, "Module (editor-selection) not found in sorted array");
        },
     "Testing editor-tab": function(data) {
            var loader = new Y.Loader({
                require: ["editor-tab"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("editor-tab")) > -1, "Module (editor-tab) not found in sorted array");
        },
     "Testing escape": function(data) {
            var loader = new Y.Loader({
                require: ["escape"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("escape")) > -1, "Module (escape) not found in sorted array");
        },
     "Testing event": function(data) {
            var loader = new Y.Loader({
                require: ["event"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("event-base")) > -1, "Module (event-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-delegate")) > -1, "Module (event-delegate) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-synthetic")) > -1, "Module (event-synthetic) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-mousewheel")) > -1, "Module (event-mousewheel) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-mouseenter")) > -1, "Module (event-mouseenter) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-key")) > -1, "Module (event-key) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-focus")) > -1, "Module (event-focus) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-resize")) > -1, "Module (event-resize) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-hover")) > -1, "Module (event-hover) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-outside")) > -1, "Module (event-outside) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-touch")) > -1, "Module (event-touch) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-move")) > -1, "Module (event-move) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-flick")) > -1, "Module (event-flick) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-valuechange")) > -1, "Module (event-valuechange) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-tap")) > -1, "Module (event-tap) not found in sorted array");
        },
     "Testing event-base": function(data) {
            var loader = new Y.Loader({
                require: ["event-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-base")) > -1, "Module (event-base) not found in sorted array");
        },
     "Testing event-base-ie": function(data) {
            var loader = new Y.Loader({
                require: ["event-base-ie"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-base-ie")) > -1, "Module (event-base-ie) not found in sorted array");
        },
     "Testing event-contextmenu": function(data) {
            var loader = new Y.Loader({
                require: ["event-contextmenu"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-contextmenu")) > -1, "Module (event-contextmenu) not found in sorted array");
        },
     "Testing event-custom": function(data) {
            var loader = new Y.Loader({
                require: ["event-custom"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("event-custom-base")) > -1, "Module (event-custom-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-custom-complex")) > -1, "Module (event-custom-complex) not found in sorted array");
        },
     "Testing event-custom-base": function(data) {
            var loader = new Y.Loader({
                require: ["event-custom-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-custom-base")) > -1, "Module (event-custom-base) not found in sorted array");
        },
     "Testing event-custom-complex": function(data) {
            var loader = new Y.Loader({
                require: ["event-custom-complex"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-custom-complex")) > -1, "Module (event-custom-complex) not found in sorted array");
        },
     "Testing event-delegate": function(data) {
            var loader = new Y.Loader({
                require: ["event-delegate"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-delegate")) > -1, "Module (event-delegate) not found in sorted array");
        },
     "Testing event-flick": function(data) {
            var loader = new Y.Loader({
                require: ["event-flick"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-flick")) > -1, "Module (event-flick) not found in sorted array");
        },
     "Testing event-focus": function(data) {
            var loader = new Y.Loader({
                require: ["event-focus"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-focus")) > -1, "Module (event-focus) not found in sorted array");
        },
     "Testing event-gestures": function(data) {
            var loader = new Y.Loader({
                require: ["event-gestures"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("event-flick")) > -1, "Module (event-flick) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("event-move")) > -1, "Module (event-move) not found in sorted array");
        },
     "Testing event-hover": function(data) {
            var loader = new Y.Loader({
                require: ["event-hover"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-hover")) > -1, "Module (event-hover) not found in sorted array");
        },
     "Testing event-key": function(data) {
            var loader = new Y.Loader({
                require: ["event-key"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-key")) > -1, "Module (event-key) not found in sorted array");
        },
     "Testing event-mouseenter": function(data) {
            var loader = new Y.Loader({
                require: ["event-mouseenter"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-mouseenter")) > -1, "Module (event-mouseenter) not found in sorted array");
        },
     "Testing event-mousewheel": function(data) {
            var loader = new Y.Loader({
                require: ["event-mousewheel"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-mousewheel")) > -1, "Module (event-mousewheel) not found in sorted array");
        },
     "Testing event-move": function(data) {
            var loader = new Y.Loader({
                require: ["event-move"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-move")) > -1, "Module (event-move) not found in sorted array");
        },
     "Testing event-outside": function(data) {
            var loader = new Y.Loader({
                require: ["event-outside"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-outside")) > -1, "Module (event-outside) not found in sorted array");
        },
     "Testing event-resize": function(data) {
            var loader = new Y.Loader({
                require: ["event-resize"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-resize")) > -1, "Module (event-resize) not found in sorted array");
        },
     "Testing event-simulate": function(data) {
            var loader = new Y.Loader({
                require: ["event-simulate"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-simulate")) > -1, "Module (event-simulate) not found in sorted array");
        },
     "Testing event-synthetic": function(data) {
            var loader = new Y.Loader({
                require: ["event-synthetic"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-synthetic")) > -1, "Module (event-synthetic) not found in sorted array");
        },
     "Testing event-tap": function(data) {
            var loader = new Y.Loader({
                require: ["event-tap"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-tap")) > -1, "Module (event-tap) not found in sorted array");
        },
     "Testing event-touch": function(data) {
            var loader = new Y.Loader({
                require: ["event-touch"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-touch")) > -1, "Module (event-touch) not found in sorted array");
        },
     "Testing event-valuechange": function(data) {
            var loader = new Y.Loader({
                require: ["event-valuechange"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("event-valuechange")) > -1, "Module (event-valuechange) not found in sorted array");
        },
     "Testing exec-command": function(data) {
            var loader = new Y.Loader({
                require: ["exec-command"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("exec-command")) > -1, "Module (exec-command) not found in sorted array");
        },
     "Testing file": function(data) {
            var loader = new Y.Loader({
                require: ["file"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("file")) > -1, "Module (file) not found in sorted array");
        },
     "Testing file-flash": function(data) {
            var loader = new Y.Loader({
                require: ["file-flash"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("file-flash")) > -1, "Module (file-flash) not found in sorted array");
        },
     "Testing file-html5": function(data) {
            var loader = new Y.Loader({
                require: ["file-html5"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("file-html5")) > -1, "Module (file-html5) not found in sorted array");
        },
     "Testing frame": function(data) {
            var loader = new Y.Loader({
                require: ["frame"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("frame")) > -1, "Module (frame) not found in sorted array");
        },
     "Testing gesture-simulate": function(data) {
            var loader = new Y.Loader({
                require: ["gesture-simulate"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("gesture-simulate")) > -1, "Module (gesture-simulate) not found in sorted array");
        },
     "Testing graphics": function(data) {
            var loader = new Y.Loader({
                require: ["graphics"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("graphics")) > -1, "Module (graphics) not found in sorted array");
        },
     "Testing graphics-canvas": function(data) {
            var loader = new Y.Loader({
                require: ["graphics-canvas"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("graphics-canvas")) > -1, "Module (graphics-canvas) not found in sorted array");
        },
     "Testing graphics-canvas-default": function(data) {
            var loader = new Y.Loader({
                require: ["graphics-canvas-default"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("graphics-canvas-default")) > -1, "Module (graphics-canvas-default) not found in sorted array");
        },
     "Testing graphics-group": function(data) {
            var loader = new Y.Loader({
                require: ["graphics-group"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("graphics-group")) > -1, "Module (graphics-group) not found in sorted array");
        },
     "Testing graphics-svg": function(data) {
            var loader = new Y.Loader({
                require: ["graphics-svg"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("graphics-svg")) > -1, "Module (graphics-svg) not found in sorted array");
        },
     "Testing graphics-svg-default": function(data) {
            var loader = new Y.Loader({
                require: ["graphics-svg-default"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("graphics-svg-default")) > -1, "Module (graphics-svg-default) not found in sorted array");
        },
     "Testing graphics-vml": function(data) {
            var loader = new Y.Loader({
                require: ["graphics-vml"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("graphics-vml")) > -1, "Module (graphics-vml) not found in sorted array");
        },
     "Testing graphics-vml-default": function(data) {
            var loader = new Y.Loader({
                require: ["graphics-vml-default"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("graphics-vml-default")) > -1, "Module (graphics-vml-default) not found in sorted array");
        },
     "Testing handlebars": function(data) {
            var loader = new Y.Loader({
                require: ["handlebars"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("handlebars-compiler")) > -1, "Module (handlebars-compiler) not found in sorted array");
        },
     "Testing handlebars-base": function(data) {
            var loader = new Y.Loader({
                require: ["handlebars-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("handlebars-base")) > -1, "Module (handlebars-base) not found in sorted array");
        },
     "Testing handlebars-compiler": function(data) {
            var loader = new Y.Loader({
                require: ["handlebars-compiler"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("handlebars-compiler")) > -1, "Module (handlebars-compiler) not found in sorted array");
        },
     "Testing highlight": function(data) {
            var loader = new Y.Loader({
                require: ["highlight"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("highlight-base")) > -1, "Module (highlight-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("highlight-accentfold")) > -1, "Module (highlight-accentfold) not found in sorted array");
        },
     "Testing highlight-accentfold": function(data) {
            var loader = new Y.Loader({
                require: ["highlight-accentfold"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("highlight-accentfold")) > -1, "Module (highlight-accentfold) not found in sorted array");
        },
     "Testing highlight-base": function(data) {
            var loader = new Y.Loader({
                require: ["highlight-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("highlight-base")) > -1, "Module (highlight-base) not found in sorted array");
        },
     "Testing history": function(data) {
            var loader = new Y.Loader({
                require: ["history"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("history-base")) > -1, "Module (history-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("history-hash")) > -1, "Module (history-hash) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("history-hash-ie")) > -1, "Module (history-hash-ie) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("history-html5")) > -1, "Module (history-html5) not found in sorted array");
        },
     "Testing history-base": function(data) {
            var loader = new Y.Loader({
                require: ["history-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("history-base")) > -1, "Module (history-base) not found in sorted array");
        },
     "Testing history-hash": function(data) {
            var loader = new Y.Loader({
                require: ["history-hash"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("history-hash")) > -1, "Module (history-hash) not found in sorted array");
        },
     "Testing history-hash-ie": function(data) {
            var loader = new Y.Loader({
                require: ["history-hash-ie"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("history-hash-ie")) > -1, "Module (history-hash-ie) not found in sorted array");
        },
     "Testing history-html5": function(data) {
            var loader = new Y.Loader({
                require: ["history-html5"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("history-html5")) > -1, "Module (history-html5) not found in sorted array");
        },
     "Testing imageloader": function(data) {
            var loader = new Y.Loader({
                require: ["imageloader"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("imageloader")) > -1, "Module (imageloader) not found in sorted array");
        },
     "Testing intl": function(data) {
            var loader = new Y.Loader({
                require: ["intl"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("intl")) > -1, "Module (intl) not found in sorted array");
        },
     "Testing io": function(data) {
            var loader = new Y.Loader({
                require: ["io"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("io-base")) > -1, "Module (io-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("io-xdr")) > -1, "Module (io-xdr) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("io-form")) > -1, "Module (io-form) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("io-upload-iframe")) > -1, "Module (io-upload-iframe) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("io-queue")) > -1, "Module (io-queue) not found in sorted array");
        },
     "Testing io-base": function(data) {
            var loader = new Y.Loader({
                require: ["io-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("io-base")) > -1, "Module (io-base) not found in sorted array");
        },
     "Testing io-form": function(data) {
            var loader = new Y.Loader({
                require: ["io-form"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("io-form")) > -1, "Module (io-form) not found in sorted array");
        },
     "Testing io-nodejs": function(data) {
            var loader = new Y.Loader({
                require: ["io-nodejs"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("io-nodejs")) > -1, "Module (io-nodejs) not found in sorted array");
        },
     "Testing io-queue": function(data) {
            var loader = new Y.Loader({
                require: ["io-queue"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("io-queue")) > -1, "Module (io-queue) not found in sorted array");
        },
     "Testing io-upload-iframe": function(data) {
            var loader = new Y.Loader({
                require: ["io-upload-iframe"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("io-upload-iframe")) > -1, "Module (io-upload-iframe) not found in sorted array");
        },
     "Testing io-xdr": function(data) {
            var loader = new Y.Loader({
                require: ["io-xdr"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("io-xdr")) > -1, "Module (io-xdr) not found in sorted array");
        },
     "Testing json": function(data) {
            var loader = new Y.Loader({
                require: ["json"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("json-parse")) > -1, "Module (json-parse) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("json-stringify")) > -1, "Module (json-stringify) not found in sorted array");
        },
     "Testing json-parse": function(data) {
            var loader = new Y.Loader({
                require: ["json-parse"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("json-parse")) > -1, "Module (json-parse) not found in sorted array");
        },
     "Testing json-parse-shim": function(data) {
            var loader = new Y.Loader({
                require: ["json-parse-shim"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("json-parse-shim")) > -1, "Module (json-parse-shim) not found in sorted array");
        },
     "Testing json-stringify": function(data) {
            var loader = new Y.Loader({
                require: ["json-stringify"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("json-stringify")) > -1, "Module (json-stringify) not found in sorted array");
        },
     "Testing json-stringify-shim": function(data) {
            var loader = new Y.Loader({
                require: ["json-stringify-shim"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("json-stringify-shim")) > -1, "Module (json-stringify-shim) not found in sorted array");
        },
     "Testing jsonp": function(data) {
            var loader = new Y.Loader({
                require: ["jsonp"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("jsonp")) > -1, "Module (jsonp) not found in sorted array");
        },
     "Testing jsonp-url": function(data) {
            var loader = new Y.Loader({
                require: ["jsonp-url"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("jsonp-url")) > -1, "Module (jsonp-url) not found in sorted array");
        },
     "Testing lazy-model-list": function(data) {
            var loader = new Y.Loader({
                require: ["lazy-model-list"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("lazy-model-list")) > -1, "Module (lazy-model-list) not found in sorted array");
        },
     "Testing matrix": function(data) {
            var loader = new Y.Loader({
                require: ["matrix"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("matrix")) > -1, "Module (matrix) not found in sorted array");
        },
     "Testing model": function(data) {
            var loader = new Y.Loader({
                require: ["model"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("model")) > -1, "Module (model) not found in sorted array");
        },
     "Testing model-list": function(data) {
            var loader = new Y.Loader({
                require: ["model-list"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("model-list")) > -1, "Module (model-list) not found in sorted array");
        },
     "Testing model-sync-rest": function(data) {
            var loader = new Y.Loader({
                require: ["model-sync-rest"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("model-sync-rest")) > -1, "Module (model-sync-rest) not found in sorted array");
        },
     "Testing node": function(data) {
            var loader = new Y.Loader({
                require: ["node"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("node-base")) > -1, "Module (node-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("node-event-delegate")) > -1, "Module (node-event-delegate) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("node-pluginhost")) > -1, "Module (node-pluginhost) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("node-screen")) > -1, "Module (node-screen) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("node-style")) > -1, "Module (node-style) not found in sorted array");
        },
     "Testing node-base": function(data) {
            var loader = new Y.Loader({
                require: ["node-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-base")) > -1, "Module (node-base) not found in sorted array");
        },
     "Testing node-core": function(data) {
            var loader = new Y.Loader({
                require: ["node-core"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-core")) > -1, "Module (node-core) not found in sorted array");
        },
     "Testing node-deprecated": function(data) {
            var loader = new Y.Loader({
                require: ["node-deprecated"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-deprecated")) > -1, "Module (node-deprecated) not found in sorted array");
        },
     "Testing node-event-delegate": function(data) {
            var loader = new Y.Loader({
                require: ["node-event-delegate"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-event-delegate")) > -1, "Module (node-event-delegate) not found in sorted array");
        },
     "Testing node-event-html5": function(data) {
            var loader = new Y.Loader({
                require: ["node-event-html5"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-event-html5")) > -1, "Module (node-event-html5) not found in sorted array");
        },
     "Testing node-event-simulate": function(data) {
            var loader = new Y.Loader({
                require: ["node-event-simulate"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-event-simulate")) > -1, "Module (node-event-simulate) not found in sorted array");
        },
     "Testing node-flick": function(data) {
            var loader = new Y.Loader({
                require: ["node-flick"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-flick")) > -1, "Module (node-flick) not found in sorted array");
        },
     "Testing node-focusmanager": function(data) {
            var loader = new Y.Loader({
                require: ["node-focusmanager"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-focusmanager")) > -1, "Module (node-focusmanager) not found in sorted array");
        },
     "Testing node-load": function(data) {
            var loader = new Y.Loader({
                require: ["node-load"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-load")) > -1, "Module (node-load) not found in sorted array");
        },
     "Testing node-menunav": function(data) {
            var loader = new Y.Loader({
                require: ["node-menunav"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-menunav")) > -1, "Module (node-menunav) not found in sorted array");
        },
     "Testing node-pluginhost": function(data) {
            var loader = new Y.Loader({
                require: ["node-pluginhost"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-pluginhost")) > -1, "Module (node-pluginhost) not found in sorted array");
        },
     "Testing node-screen": function(data) {
            var loader = new Y.Loader({
                require: ["node-screen"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-screen")) > -1, "Module (node-screen) not found in sorted array");
        },
     "Testing node-scroll-info": function(data) {
            var loader = new Y.Loader({
                require: ["node-scroll-info"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-scroll-info")) > -1, "Module (node-scroll-info) not found in sorted array");
        },
     "Testing node-style": function(data) {
            var loader = new Y.Loader({
                require: ["node-style"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("node-style")) > -1, "Module (node-style) not found in sorted array");
        },
     "Testing oop": function(data) {
            var loader = new Y.Loader({
                require: ["oop"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("oop")) > -1, "Module (oop) not found in sorted array");
        },
     "Testing overlay": function(data) {
            var loader = new Y.Loader({
                require: ["overlay"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("overlay")) > -1, "Module (overlay) not found in sorted array");
        },
     "Testing panel": function(data) {
            var loader = new Y.Loader({
                require: ["panel"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("panel")) > -1, "Module (panel) not found in sorted array");
        },
     "Testing parallel": function(data) {
            var loader = new Y.Loader({
                require: ["parallel"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("parallel")) > -1, "Module (parallel) not found in sorted array");
        },
     "Testing pjax": function(data) {
            var loader = new Y.Loader({
                require: ["pjax"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("pjax")) > -1, "Module (pjax) not found in sorted array");
        },
     "Testing pjax-base": function(data) {
            var loader = new Y.Loader({
                require: ["pjax-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("pjax-base")) > -1, "Module (pjax-base) not found in sorted array");
        },
     "Testing pjax-content": function(data) {
            var loader = new Y.Loader({
                require: ["pjax-content"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("pjax-content")) > -1, "Module (pjax-content) not found in sorted array");
        },
     "Testing pjax-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["pjax-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("pjax-plugin")) > -1, "Module (pjax-plugin) not found in sorted array");
        },
     "Testing plugin": function(data) {
            var loader = new Y.Loader({
                require: ["plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("plugin")) > -1, "Module (plugin) not found in sorted array");
        },
     "Testing pluginhost": function(data) {
            var loader = new Y.Loader({
                require: ["pluginhost"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("pluginhost-base")) > -1, "Module (pluginhost-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("pluginhost-config")) > -1, "Module (pluginhost-config) not found in sorted array");
        },
     "Testing pluginhost-base": function(data) {
            var loader = new Y.Loader({
                require: ["pluginhost-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("pluginhost-base")) > -1, "Module (pluginhost-base) not found in sorted array");
        },
     "Testing pluginhost-config": function(data) {
            var loader = new Y.Loader({
                require: ["pluginhost-config"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("pluginhost-config")) > -1, "Module (pluginhost-config) not found in sorted array");
        },
     "Testing promise": function(data) {
            var loader = new Y.Loader({
                require: ["promise"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("promise")) > -1, "Module (promise) not found in sorted array");
        },
     "Testing querystring": function(data) {
            var loader = new Y.Loader({
                require: ["querystring"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("querystring-parse")) > -1, "Module (querystring-parse) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("querystring-stringify")) > -1, "Module (querystring-stringify) not found in sorted array");
        },
     "Testing querystring-parse": function(data) {
            var loader = new Y.Loader({
                require: ["querystring-parse"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("querystring-parse")) > -1, "Module (querystring-parse) not found in sorted array");
        },
     "Testing querystring-parse-simple": function(data) {
            var loader = new Y.Loader({
                require: ["querystring-parse-simple"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("querystring-parse-simple")) > -1, "Module (querystring-parse-simple) not found in sorted array");
        },
     "Testing querystring-stringify": function(data) {
            var loader = new Y.Loader({
                require: ["querystring-stringify"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("querystring-stringify")) > -1, "Module (querystring-stringify) not found in sorted array");
        },
     "Testing querystring-stringify-simple": function(data) {
            var loader = new Y.Loader({
                require: ["querystring-stringify-simple"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("querystring-stringify-simple")) > -1, "Module (querystring-stringify-simple) not found in sorted array");
        },
     "Testing queue-promote": function(data) {
            var loader = new Y.Loader({
                require: ["queue-promote"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("queue-promote")) > -1, "Module (queue-promote) not found in sorted array");
        },
     "Testing range-slider": function(data) {
            var loader = new Y.Loader({
                require: ["range-slider"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("range-slider")) > -1, "Module (range-slider) not found in sorted array");
        },
     "Testing recordset": function(data) {
            var loader = new Y.Loader({
                require: ["recordset"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("recordset-base")) > -1, "Module (recordset-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("recordset-sort")) > -1, "Module (recordset-sort) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("recordset-filter")) > -1, "Module (recordset-filter) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("recordset-indexer")) > -1, "Module (recordset-indexer) not found in sorted array");
        },
     "Testing recordset-base": function(data) {
            var loader = new Y.Loader({
                require: ["recordset-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("recordset-base")) > -1, "Module (recordset-base) not found in sorted array");
        },
     "Testing recordset-filter": function(data) {
            var loader = new Y.Loader({
                require: ["recordset-filter"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("recordset-filter")) > -1, "Module (recordset-filter) not found in sorted array");
        },
     "Testing recordset-indexer": function(data) {
            var loader = new Y.Loader({
                require: ["recordset-indexer"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("recordset-indexer")) > -1, "Module (recordset-indexer) not found in sorted array");
        },
     "Testing recordset-sort": function(data) {
            var loader = new Y.Loader({
                require: ["recordset-sort"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("recordset-sort")) > -1, "Module (recordset-sort) not found in sorted array");
        },
     "Testing resize": function(data) {
            var loader = new Y.Loader({
                require: ["resize"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("resize-base")) > -1, "Module (resize-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("resize-proxy")) > -1, "Module (resize-proxy) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("resize-constrain")) > -1, "Module (resize-constrain) not found in sorted array");
        },
     "Testing resize-base": function(data) {
            var loader = new Y.Loader({
                require: ["resize-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("resize-base")) > -1, "Module (resize-base) not found in sorted array");
        },
     "Testing resize-constrain": function(data) {
            var loader = new Y.Loader({
                require: ["resize-constrain"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("resize-constrain")) > -1, "Module (resize-constrain) not found in sorted array");
        },
     "Testing resize-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["resize-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("resize-plugin")) > -1, "Module (resize-plugin) not found in sorted array");
        },
     "Testing resize-proxy": function(data) {
            var loader = new Y.Loader({
                require: ["resize-proxy"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("resize-proxy")) > -1, "Module (resize-proxy) not found in sorted array");
        },
     "Testing router": function(data) {
            var loader = new Y.Loader({
                require: ["router"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("router")) > -1, "Module (router) not found in sorted array");
        },
     "Testing scrollview": function(data) {
            var loader = new Y.Loader({
                require: ["scrollview"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("scrollview")) > -1, "Module (scrollview) not found in sorted array");
        },
     "Testing scrollview-base": function(data) {
            var loader = new Y.Loader({
                require: ["scrollview-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("scrollview-base")) > -1, "Module (scrollview-base) not found in sorted array");
        },
     "Testing scrollview-base-ie": function(data) {
            var loader = new Y.Loader({
                require: ["scrollview-base-ie"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("scrollview-base-ie")) > -1, "Module (scrollview-base-ie) not found in sorted array");
        },
     "Testing scrollview-list": function(data) {
            var loader = new Y.Loader({
                require: ["scrollview-list"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("scrollview-list")) > -1, "Module (scrollview-list) not found in sorted array");
        },
     "Testing scrollview-paginator": function(data) {
            var loader = new Y.Loader({
                require: ["scrollview-paginator"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("scrollview-paginator")) > -1, "Module (scrollview-paginator) not found in sorted array");
        },
     "Testing scrollview-scrollbars": function(data) {
            var loader = new Y.Loader({
                require: ["scrollview-scrollbars"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("scrollview-scrollbars")) > -1, "Module (scrollview-scrollbars) not found in sorted array");
        },
     "Testing selector": function(data) {
            var loader = new Y.Loader({
                require: ["selector"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("selector")) > -1, "Module (selector) not found in sorted array");
        },
     "Testing selector-native": function(data) {
            var loader = new Y.Loader({
                require: ["selector-native"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("selector-native")) > -1, "Module (selector-native) not found in sorted array");
        },
     "Testing series-area": function(data) {
            var loader = new Y.Loader({
                require: ["series-area"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-area")) > -1, "Module (series-area) not found in sorted array");
        },
     "Testing series-area-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-area-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-area-stacked")) > -1, "Module (series-area-stacked) not found in sorted array");
        },
     "Testing series-areaspline": function(data) {
            var loader = new Y.Loader({
                require: ["series-areaspline"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-areaspline")) > -1, "Module (series-areaspline) not found in sorted array");
        },
     "Testing series-areaspline-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-areaspline-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-areaspline-stacked")) > -1, "Module (series-areaspline-stacked) not found in sorted array");
        },
     "Testing series-bar": function(data) {
            var loader = new Y.Loader({
                require: ["series-bar"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-bar")) > -1, "Module (series-bar) not found in sorted array");
        },
     "Testing series-bar-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-bar-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-bar-stacked")) > -1, "Module (series-bar-stacked) not found in sorted array");
        },
     "Testing series-base": function(data) {
            var loader = new Y.Loader({
                require: ["series-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-base")) > -1, "Module (series-base) not found in sorted array");
        },
     "Testing series-candlestick": function(data) {
            var loader = new Y.Loader({
                require: ["series-candlestick"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-candlestick")) > -1, "Module (series-candlestick) not found in sorted array");
        },
     "Testing series-cartesian": function(data) {
            var loader = new Y.Loader({
                require: ["series-cartesian"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-cartesian")) > -1, "Module (series-cartesian) not found in sorted array");
        },
     "Testing series-column": function(data) {
            var loader = new Y.Loader({
                require: ["series-column"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-column")) > -1, "Module (series-column) not found in sorted array");
        },
     "Testing series-column-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-column-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-column-stacked")) > -1, "Module (series-column-stacked) not found in sorted array");
        },
     "Testing series-combo": function(data) {
            var loader = new Y.Loader({
                require: ["series-combo"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-combo")) > -1, "Module (series-combo) not found in sorted array");
        },
     "Testing series-combo-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-combo-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-combo-stacked")) > -1, "Module (series-combo-stacked) not found in sorted array");
        },
     "Testing series-combospline": function(data) {
            var loader = new Y.Loader({
                require: ["series-combospline"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-combospline")) > -1, "Module (series-combospline) not found in sorted array");
        },
     "Testing series-combospline-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-combospline-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-combospline-stacked")) > -1, "Module (series-combospline-stacked) not found in sorted array");
        },
     "Testing series-curve-util": function(data) {
            var loader = new Y.Loader({
                require: ["series-curve-util"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-curve-util")) > -1, "Module (series-curve-util) not found in sorted array");
        },
     "Testing series-fill-util": function(data) {
            var loader = new Y.Loader({
                require: ["series-fill-util"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-fill-util")) > -1, "Module (series-fill-util) not found in sorted array");
        },
     "Testing series-histogram-base": function(data) {
            var loader = new Y.Loader({
                require: ["series-histogram-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-histogram-base")) > -1, "Module (series-histogram-base) not found in sorted array");
        },
     "Testing series-line": function(data) {
            var loader = new Y.Loader({
                require: ["series-line"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-line")) > -1, "Module (series-line) not found in sorted array");
        },
     "Testing series-line-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-line-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-line-stacked")) > -1, "Module (series-line-stacked) not found in sorted array");
        },
     "Testing series-line-util": function(data) {
            var loader = new Y.Loader({
                require: ["series-line-util"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-line-util")) > -1, "Module (series-line-util) not found in sorted array");
        },
     "Testing series-marker": function(data) {
            var loader = new Y.Loader({
                require: ["series-marker"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-marker")) > -1, "Module (series-marker) not found in sorted array");
        },
     "Testing series-marker-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-marker-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-marker-stacked")) > -1, "Module (series-marker-stacked) not found in sorted array");
        },
     "Testing series-ohlc": function(data) {
            var loader = new Y.Loader({
                require: ["series-ohlc"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-ohlc")) > -1, "Module (series-ohlc) not found in sorted array");
        },
     "Testing series-pie": function(data) {
            var loader = new Y.Loader({
                require: ["series-pie"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-pie")) > -1, "Module (series-pie) not found in sorted array");
        },
     "Testing series-plot-util": function(data) {
            var loader = new Y.Loader({
                require: ["series-plot-util"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-plot-util")) > -1, "Module (series-plot-util) not found in sorted array");
        },
     "Testing series-range": function(data) {
            var loader = new Y.Loader({
                require: ["series-range"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-range")) > -1, "Module (series-range) not found in sorted array");
        },
     "Testing series-spline": function(data) {
            var loader = new Y.Loader({
                require: ["series-spline"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-spline")) > -1, "Module (series-spline) not found in sorted array");
        },
     "Testing series-spline-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-spline-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-spline-stacked")) > -1, "Module (series-spline-stacked) not found in sorted array");
        },
     "Testing series-stacked": function(data) {
            var loader = new Y.Loader({
                require: ["series-stacked"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("series-stacked")) > -1, "Module (series-stacked) not found in sorted array");
        },
     "Testing shim-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["shim-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("shim-plugin")) > -1, "Module (shim-plugin) not found in sorted array");
        },
     "Testing slider": function(data) {
            var loader = new Y.Loader({
                require: ["slider"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("slider-base")) > -1, "Module (slider-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("slider-value-range")) > -1, "Module (slider-value-range) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("clickable-rail")) > -1, "Module (clickable-rail) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("range-slider")) > -1, "Module (range-slider) not found in sorted array");
        },
     "Testing slider-base": function(data) {
            var loader = new Y.Loader({
                require: ["slider-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("slider-base")) > -1, "Module (slider-base) not found in sorted array");
        },
     "Testing slider-value-range": function(data) {
            var loader = new Y.Loader({
                require: ["slider-value-range"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("slider-value-range")) > -1, "Module (slider-value-range) not found in sorted array");
        },
     "Testing sortable": function(data) {
            var loader = new Y.Loader({
                require: ["sortable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("sortable")) > -1, "Module (sortable) not found in sorted array");
        },
     "Testing sortable-scroll": function(data) {
            var loader = new Y.Loader({
                require: ["sortable-scroll"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("sortable-scroll")) > -1, "Module (sortable-scroll) not found in sorted array");
        },
     "Testing stylesheet": function(data) {
            var loader = new Y.Loader({
                require: ["stylesheet"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("stylesheet")) > -1, "Module (stylesheet) not found in sorted array");
        },
     "Testing substitute": function(data) {
            var loader = new Y.Loader({
                require: ["substitute"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("substitute")) > -1, "Module (substitute) not found in sorted array");
        },
     "Testing swf": function(data) {
            var loader = new Y.Loader({
                require: ["swf"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("swf")) > -1, "Module (swf) not found in sorted array");
        },
     "Testing swfdetect": function(data) {
            var loader = new Y.Loader({
                require: ["swfdetect"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("swfdetect")) > -1, "Module (swfdetect) not found in sorted array");
        },
     "Testing tabview": function(data) {
            var loader = new Y.Loader({
                require: ["tabview"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tabview")) > -1, "Module (tabview) not found in sorted array");
        },
     "Testing tabview-base": function(data) {
            var loader = new Y.Loader({
                require: ["tabview-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tabview-base")) > -1, "Module (tabview-base) not found in sorted array");
        },
     "Testing tabview-plugin": function(data) {
            var loader = new Y.Loader({
                require: ["tabview-plugin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tabview-plugin")) > -1, "Module (tabview-plugin) not found in sorted array");
        },
     "Testing template": function(data) {
            var loader = new Y.Loader({
                require: ["template"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("template-base")) > -1, "Module (template-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("template-micro")) > -1, "Module (template-micro) not found in sorted array");
        },
     "Testing template-base": function(data) {
            var loader = new Y.Loader({
                require: ["template-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("template-base")) > -1, "Module (template-base) not found in sorted array");
        },
     "Testing template-micro": function(data) {
            var loader = new Y.Loader({
                require: ["template-micro"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("template-micro")) > -1, "Module (template-micro) not found in sorted array");
        },
     "Testing test": function(data) {
            var loader = new Y.Loader({
                require: ["test"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("test")) > -1, "Module (test) not found in sorted array");
        },
     "Testing test-console": function(data) {
            var loader = new Y.Loader({
                require: ["test-console"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("test-console")) > -1, "Module (test-console) not found in sorted array");
        },
     "Testing text": function(data) {
            var loader = new Y.Loader({
                require: ["text"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("text-accentfold")) > -1, "Module (text-accentfold) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("text-wordbreak")) > -1, "Module (text-wordbreak) not found in sorted array");
        },
     "Testing text-accentfold": function(data) {
            var loader = new Y.Loader({
                require: ["text-accentfold"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("text-accentfold")) > -1, "Module (text-accentfold) not found in sorted array");
        },
     "Testing text-data-accentfold": function(data) {
            var loader = new Y.Loader({
                require: ["text-data-accentfold"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("text-data-accentfold")) > -1, "Module (text-data-accentfold) not found in sorted array");
        },
     "Testing text-data-wordbreak": function(data) {
            var loader = new Y.Loader({
                require: ["text-data-wordbreak"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("text-data-wordbreak")) > -1, "Module (text-data-wordbreak) not found in sorted array");
        },
     "Testing text-wordbreak": function(data) {
            var loader = new Y.Loader({
                require: ["text-wordbreak"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("text-wordbreak")) > -1, "Module (text-wordbreak) not found in sorted array");
        },
     "Testing timers": function(data) {
            var loader = new Y.Loader({
                require: ["timers"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("timers")) > -1, "Module (timers) not found in sorted array");
        },
     "Testing transition": function(data) {
            var loader = new Y.Loader({
                require: ["transition"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("transition")) > -1, "Module (transition) not found in sorted array");
        },
     "Testing transition-timer": function(data) {
            var loader = new Y.Loader({
                require: ["transition-timer"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("transition-timer")) > -1, "Module (transition-timer) not found in sorted array");
        },
     "Testing tree": function(data) {
            var loader = new Y.Loader({
                require: ["tree"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tree")) > -1, "Module (tree) not found in sorted array");
        },
     "Testing tree-labelable": function(data) {
            var loader = new Y.Loader({
                require: ["tree-labelable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tree-labelable")) > -1, "Module (tree-labelable) not found in sorted array");
        },
     "Testing tree-lazy": function(data) {
            var loader = new Y.Loader({
                require: ["tree-lazy"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tree-lazy")) > -1, "Module (tree-lazy) not found in sorted array");
        },
     "Testing tree-node": function(data) {
            var loader = new Y.Loader({
                require: ["tree-node"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tree-node")) > -1, "Module (tree-node) not found in sorted array");
        },
     "Testing tree-openable": function(data) {
            var loader = new Y.Loader({
                require: ["tree-openable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tree-openable")) > -1, "Module (tree-openable) not found in sorted array");
        },
     "Testing tree-selectable": function(data) {
            var loader = new Y.Loader({
                require: ["tree-selectable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tree-selectable")) > -1, "Module (tree-selectable) not found in sorted array");
        },
     "Testing tree-sortable": function(data) {
            var loader = new Y.Loader({
                require: ["tree-sortable"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("tree-sortable")) > -1, "Module (tree-sortable) not found in sorted array");
        },
     "Testing uploader": function(data) {
            var loader = new Y.Loader({
                require: ["uploader"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("uploader")) > -1, "Module (uploader) not found in sorted array");
        },
     "Testing uploader-flash": function(data) {
            var loader = new Y.Loader({
                require: ["uploader-flash"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("uploader-flash")) > -1, "Module (uploader-flash) not found in sorted array");
        },
     "Testing uploader-html5": function(data) {
            var loader = new Y.Loader({
                require: ["uploader-html5"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("uploader-html5")) > -1, "Module (uploader-html5) not found in sorted array");
        },
     "Testing uploader-queue": function(data) {
            var loader = new Y.Loader({
                require: ["uploader-queue"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("uploader-queue")) > -1, "Module (uploader-queue) not found in sorted array");
        },
     "Testing view": function(data) {
            var loader = new Y.Loader({
                require: ["view"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("view")) > -1, "Module (view) not found in sorted array");
        },
     "Testing view-node-map": function(data) {
            var loader = new Y.Loader({
                require: ["view-node-map"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("view-node-map")) > -1, "Module (view-node-map) not found in sorted array");
        },
     "Testing widget": function(data) {
            var loader = new Y.Loader({
                require: ["widget"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A rollup module
            Assert.isTrue((loader.sorted.indexOf("widget-base")) > -1, "Module (widget-base) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("widget-htmlparser")) > -1, "Module (widget-htmlparser) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("widget-skin")) > -1, "Module (widget-skin) not found in sorted array");
            Assert.isTrue((loader.sorted.indexOf("widget-uievents")) > -1, "Module (widget-uievents) not found in sorted array");
        },
     "Testing widget-anim": function(data) {
            var loader = new Y.Loader({
                require: ["widget-anim"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-anim")) > -1, "Module (widget-anim) not found in sorted array");
        },
     "Testing widget-autohide": function(data) {
            var loader = new Y.Loader({
                require: ["widget-autohide"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-autohide")) > -1, "Module (widget-autohide) not found in sorted array");
        },
     "Testing widget-base": function(data) {
            var loader = new Y.Loader({
                require: ["widget-base"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-base")) > -1, "Module (widget-base) not found in sorted array");
        },
     "Testing widget-base-ie": function(data) {
            var loader = new Y.Loader({
                require: ["widget-base-ie"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-base-ie")) > -1, "Module (widget-base-ie) not found in sorted array");
        },
     "Testing widget-buttons": function(data) {
            var loader = new Y.Loader({
                require: ["widget-buttons"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-buttons")) > -1, "Module (widget-buttons) not found in sorted array");
        },
     "Testing widget-child": function(data) {
            var loader = new Y.Loader({
                require: ["widget-child"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-child")) > -1, "Module (widget-child) not found in sorted array");
        },
     "Testing widget-htmlparser": function(data) {
            var loader = new Y.Loader({
                require: ["widget-htmlparser"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-htmlparser")) > -1, "Module (widget-htmlparser) not found in sorted array");
        },
     "Testing widget-locale": function(data) {
            var loader = new Y.Loader({
                require: ["widget-locale"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-locale")) > -1, "Module (widget-locale) not found in sorted array");
        },
     "Testing widget-modality": function(data) {
            var loader = new Y.Loader({
                require: ["widget-modality"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-modality")) > -1, "Module (widget-modality) not found in sorted array");
        },
     "Testing widget-parent": function(data) {
            var loader = new Y.Loader({
                require: ["widget-parent"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-parent")) > -1, "Module (widget-parent) not found in sorted array");
        },
     "Testing widget-position": function(data) {
            var loader = new Y.Loader({
                require: ["widget-position"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-position")) > -1, "Module (widget-position) not found in sorted array");
        },
     "Testing widget-position-align": function(data) {
            var loader = new Y.Loader({
                require: ["widget-position-align"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-position-align")) > -1, "Module (widget-position-align) not found in sorted array");
        },
     "Testing widget-position-constrain": function(data) {
            var loader = new Y.Loader({
                require: ["widget-position-constrain"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-position-constrain")) > -1, "Module (widget-position-constrain) not found in sorted array");
        },
     "Testing widget-skin": function(data) {
            var loader = new Y.Loader({
                require: ["widget-skin"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-skin")) > -1, "Module (widget-skin) not found in sorted array");
        },
     "Testing widget-stack": function(data) {
            var loader = new Y.Loader({
                require: ["widget-stack"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-stack")) > -1, "Module (widget-stack) not found in sorted array");
        },
     "Testing widget-stdmod": function(data) {
            var loader = new Y.Loader({
                require: ["widget-stdmod"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-stdmod")) > -1, "Module (widget-stdmod) not found in sorted array");
        },
     "Testing widget-uievents": function(data) {
            var loader = new Y.Loader({
                require: ["widget-uievents"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("widget-uievents")) > -1, "Module (widget-uievents) not found in sorted array");
        },
     "Testing yql": function(data) {
            var loader = new Y.Loader({
                require: ["yql"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("yql")) > -1, "Module (yql) not found in sorted array");
        },
     "Testing yql-jsonp": function(data) {
            var loader = new Y.Loader({
                require: ["yql-jsonp"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("yql-jsonp")) > -1, "Module (yql-jsonp) not found in sorted array");
        },
     "Testing yql-nodejs": function(data) {
            var loader = new Y.Loader({
                require: ["yql-nodejs"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("yql-nodejs")) > -1, "Module (yql-nodejs) not found in sorted array");
        },
     "Testing yql-winjs": function(data) {
            var loader = new Y.Loader({
                require: ["yql-winjs"],
                ignoreRegistered: true,
                allowRollup: false
            });
            loader.calculate();
            //Testing A normal module
            Assert.isTrue((loader.sorted.indexOf("yql-winjs")) > -1, "Module (yql-winjs) not found in sorted array");
        }    
}));

YUITest.TestRunner.add(suite);
