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
_yuitest_coverage["/build/node-event-simulate/node-event-simulate.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/node-event-simulate/node-event-simulate.js",
    code: []
};
_yuitest_coverage["/build/node-event-simulate/node-event-simulate.js"].code=["YUI.add('node-event-simulate', function(Y) {","","/**"," * Adds functionality to simulate events."," * @module node"," * @submodule node-event-simulate"," */","","/**"," * Simulates an event on the node."," * @param {String} type The type of event (i.e., \"click\")."," * @param {Object} options (Optional) Extra options to copy onto the event object."," * @return {void}"," * @for Node"," * @method simulate"," */","Y.Node.prototype.simulate = function (type, options) {","    ","    Y.Event.simulate(Y.Node.getDOMNode(this), type, options);","};","","","","}, '@VERSION@' ,{requires:['node-base', 'event-simulate']});"];
_yuitest_coverage["/build/node-event-simulate/node-event-simulate.js"].lines = {"1":0,"17":0,"19":0};
_yuitest_coverage["/build/node-event-simulate/node-event-simulate.js"].functions = {"simulate:17":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/node-event-simulate/node-event-simulate.js"].coveredLines = 3;
_yuitest_coverage["/build/node-event-simulate/node-event-simulate.js"].coveredFunctions = 2;
_yuitest_coverline("/build/node-event-simulate/node-event-simulate.js", 1);
YUI.add('node-event-simulate', function(Y) {

/**
 * Adds functionality to simulate events.
 * @module node
 * @submodule node-event-simulate
 */

/**
 * Simulates an event on the node.
 * @param {String} type The type of event (i.e., "click").
 * @param {Object} options (Optional) Extra options to copy onto the event object.
 * @return {void}
 * @for Node
 * @method simulate
 */
_yuitest_coverfunc("/build/node-event-simulate/node-event-simulate.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/node-event-simulate/node-event-simulate.js", 17);
Y.Node.prototype.simulate = function (type, options) {
    
    _yuitest_coverfunc("/build/node-event-simulate/node-event-simulate.js", "simulate", 17);
_yuitest_coverline("/build/node-event-simulate/node-event-simulate.js", 19);
Y.Event.simulate(Y.Node.getDOMNode(this), type, options);
};



}, '@VERSION@' ,{requires:['node-base', 'event-simulate']});
