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
_yuitest_coverage["build/widget-skin/widget-skin.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/widget-skin/widget-skin.js",
    code: []
};
_yuitest_coverage["build/widget-skin/widget-skin.js"].code=["YUI.add('widget-skin', function (Y, NAME) {","","/**"," * Provides skin related utlility methods."," *"," * @module widget"," * @submodule widget-skin"," */","var BOUNDING_BOX = \"boundingBox\",","    CONTENT_BOX = \"contentBox\",","    SKIN = \"skin\",","    _getClassName = Y.ClassNameManager.getClassName;","","/**"," * Returns the name of the skin that's currently applied to the widget."," *"," * Searches up the Widget's ancestor axis for, by default, a class"," * yui3-skin-(name), and returns the (name) portion. Otherwise, returns null."," *"," * This is only really useful after the widget's DOM structure is in the"," * document, either by render or by progressive enhancement."," *"," * @method getSkinName"," * @for Widget"," * @param {String} [skinPrefix] The prefix which the implementation uses for the skin"," * (\"yui3-skin-\" is the default)."," *"," * NOTE: skinPrefix will be used as part of a regular expression:"," *"," *     new RegExp('\\\\b' + skinPrefix + '(\\\\S+)')"," *"," * Although an unlikely use case, literal characters which may result in an invalid"," * regular expression should be escaped."," *"," * @return {String} The name of the skin, or null, if a matching skin class is not found."," */","","Y.Widget.prototype.getSkinName = function (skinPrefix) {","","    var root = this.get( CONTENT_BOX ) || this.get( BOUNDING_BOX ),","        match,","        search;","","    skinPrefix = skinPrefix || _getClassName(SKIN, \"\");","","    search = new RegExp( '\\\\b' + skinPrefix + '(\\\\S+)' );","","    if ( root ) {","        root.ancestor( function ( node ) {","            match = node.get( 'className' ).match( search );","            return match;","        } );","    }","","    return ( match ) ? match[1] : null;","};","","","}, '@VERSION@', {\"requires\": [\"widget-base\"]});"];
_yuitest_coverage["build/widget-skin/widget-skin.js"].lines = {"1":0,"9":0,"38":0,"40":0,"44":0,"46":0,"48":0,"49":0,"50":0,"51":0,"55":0};
_yuitest_coverage["build/widget-skin/widget-skin.js"].functions = {"(anonymous 2):49":0,"getSkinName:38":0,"(anonymous 1):1":0};
_yuitest_coverage["build/widget-skin/widget-skin.js"].coveredLines = 11;
_yuitest_coverage["build/widget-skin/widget-skin.js"].coveredFunctions = 3;
_yuitest_coverline("build/widget-skin/widget-skin.js", 1);
YUI.add('widget-skin', function (Y, NAME) {

/**
 * Provides skin related utlility methods.
 *
 * @module widget
 * @submodule widget-skin
 */
_yuitest_coverfunc("build/widget-skin/widget-skin.js", "(anonymous 1)", 1);
_yuitest_coverline("build/widget-skin/widget-skin.js", 9);
var BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    SKIN = "skin",
    _getClassName = Y.ClassNameManager.getClassName;

/**
 * Returns the name of the skin that's currently applied to the widget.
 *
 * Searches up the Widget's ancestor axis for, by default, a class
 * yui3-skin-(name), and returns the (name) portion. Otherwise, returns null.
 *
 * This is only really useful after the widget's DOM structure is in the
 * document, either by render or by progressive enhancement.
 *
 * @method getSkinName
 * @for Widget
 * @param {String} [skinPrefix] The prefix which the implementation uses for the skin
 * ("yui3-skin-" is the default).
 *
 * NOTE: skinPrefix will be used as part of a regular expression:
 *
 *     new RegExp('\\b' + skinPrefix + '(\\S+)')
 *
 * Although an unlikely use case, literal characters which may result in an invalid
 * regular expression should be escaped.
 *
 * @return {String} The name of the skin, or null, if a matching skin class is not found.
 */

_yuitest_coverline("build/widget-skin/widget-skin.js", 38);
Y.Widget.prototype.getSkinName = function (skinPrefix) {

    _yuitest_coverfunc("build/widget-skin/widget-skin.js", "getSkinName", 38);
_yuitest_coverline("build/widget-skin/widget-skin.js", 40);
var root = this.get( CONTENT_BOX ) || this.get( BOUNDING_BOX ),
        match,
        search;

    _yuitest_coverline("build/widget-skin/widget-skin.js", 44);
skinPrefix = skinPrefix || _getClassName(SKIN, "");

    _yuitest_coverline("build/widget-skin/widget-skin.js", 46);
search = new RegExp( '\\b' + skinPrefix + '(\\S+)' );

    _yuitest_coverline("build/widget-skin/widget-skin.js", 48);
if ( root ) {
        _yuitest_coverline("build/widget-skin/widget-skin.js", 49);
root.ancestor( function ( node ) {
            _yuitest_coverfunc("build/widget-skin/widget-skin.js", "(anonymous 2)", 49);
_yuitest_coverline("build/widget-skin/widget-skin.js", 50);
match = node.get( 'className' ).match( search );
            _yuitest_coverline("build/widget-skin/widget-skin.js", 51);
return match;
        } );
    }

    _yuitest_coverline("build/widget-skin/widget-skin.js", 55);
return ( match ) ? match[1] : null;
};


}, '@VERSION@', {"requires": ["widget-base"]});
