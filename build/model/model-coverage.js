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
_yuitest_coverage["build/model/model.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/model/model.js",
    code: []
};
_yuitest_coverage["build/model/model.js"].code=["YUI.add('model', function (Y, NAME) {","","/**","Attribute-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes.","","@module app","@submodule model","@since 3.4.0","**/","","/**","Attribute-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes.","","In most cases, you'll want to create your own subclass of `Y.Model` and","customize it to meet your needs. In particular, the `sync()` and `validate()`","methods are meant to be overridden by custom implementations. You may also want","to override the `parse()` method to parse non-generic server responses.","","@class Model","@constructor","@extends Base","@since 3.4.0","**/","var Model = Y.Base.create('model', Y.Model.Base, [Y.Model.Observable]);","","// -- Namespace ----------------------------------------------------------------","Y.Model = Y.mix(Model, Y.Model, true);","","","}, '@VERSION@', {\"requires\": [\"base-build\", \"model-base\", \"model-observable\"]});"];
_yuitest_coverage["build/model/model.js"].lines = {"1":0,"26":0,"29":0};
_yuitest_coverage["build/model/model.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["build/model/model.js"].coveredLines = 3;
_yuitest_coverage["build/model/model.js"].coveredFunctions = 1;
_yuitest_coverline("build/model/model.js", 1);
YUI.add('model', function (Y, NAME) {

/**
Attribute-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

@module app
@submodule model
@since 3.4.0
**/

/**
Attribute-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

In most cases, you'll want to create your own subclass of `Y.Model` and
customize it to meet your needs. In particular, the `sync()` and `validate()`
methods are meant to be overridden by custom implementations. You may also want
to override the `parse()` method to parse non-generic server responses.

@class Model
@constructor
@extends Base
@since 3.4.0
**/
_yuitest_coverfunc("build/model/model.js", "(anonymous 1)", 1);
_yuitest_coverline("build/model/model.js", 26);
var Model = Y.Base.create('model', Y.Model.Base, [Y.Model.Observable]);

// -- Namespace ----------------------------------------------------------------
_yuitest_coverline("build/model/model.js", 29);
Y.Model = Y.mix(Model, Y.Model, true);


}, '@VERSION@', {"requires": ["base-build", "model-base", "model-observable"]});
