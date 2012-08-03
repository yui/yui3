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
_yuitest_coverage["/home/yui/src/yui3/src/file/build_tmp/file.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/home/yui/src/yui3/src/file/build_tmp/file.js",
    code: []
};
_yuitest_coverage["/home/yui/src/yui3/src/file/build_tmp/file.js"].code=["YUI.add('file', function(Y) {","","    /**","     * The File class provides a wrapper for a file pointer, either through an HTML5 ","     * implementation or as a reference to a file pointer stored in Flash. The File wrapper ","     * also implements the mechanics for uploading a file and tracking its progress.","     * @module file","     * @main file","     * @since 3.5.0","     */     ","","    /**","     * `Y.File` serves as an alias for either <a href=\"FileFlash.html\">`Y.FileFlash`</a>","     * or <a href=\"FileHTML5.html\">`Y.FileHTML5`</a>, depending on the feature set available","     * in a specific browser.","     *","     * @class File","     */",""," var Win = Y.config.win;",""," if (Win && Win.File && Win.FormData && Win.XMLHttpRequest) {","    Y.File = Y.FileHTML5;"," }",""," else {","    Y.File = Y.FileFlash;"," }","","","}, '@VERSION@' ,{requires:['file-flash', 'file-html5']});"];
_yuitest_coverage["/home/yui/src/yui3/src/file/build_tmp/file.js"].lines = {"1":0,"20":0,"22":0,"23":0,"27":0};
_yuitest_coverage["/home/yui/src/yui3/src/file/build_tmp/file.js"].functions = {"(anonymous 1):1":0};
_yuitest_coverage["/home/yui/src/yui3/src/file/build_tmp/file.js"].coveredLines = 5;
_yuitest_coverage["/home/yui/src/yui3/src/file/build_tmp/file.js"].coveredFunctions = 1;
_yuitest_coverline("/home/yui/src/yui3/src/file/build_tmp/file.js", 1);
YUI.add('file', function(Y) {

    /**
     * The File class provides a wrapper for a file pointer, either through an HTML5 
     * implementation or as a reference to a file pointer stored in Flash. The File wrapper 
     * also implements the mechanics for uploading a file and tracking its progress.
     * @module file
     * @main file
     * @since 3.5.0
     */     

    /**
     * `Y.File` serves as an alias for either <a href="FileFlash.html">`Y.FileFlash`</a>
     * or <a href="FileHTML5.html">`Y.FileHTML5`</a>, depending on the feature set available
     * in a specific browser.
     *
     * @class File
     */

 _yuitest_coverfunc("/home/yui/src/yui3/src/file/build_tmp/file.js", "(anonymous 1)", 1);
_yuitest_coverline("/home/yui/src/yui3/src/file/build_tmp/file.js", 20);
var Win = Y.config.win;

 _yuitest_coverline("/home/yui/src/yui3/src/file/build_tmp/file.js", 22);
if (Win && Win.File && Win.FormData && Win.XMLHttpRequest) {
    _yuitest_coverline("/home/yui/src/yui3/src/file/build_tmp/file.js", 23);
Y.File = Y.FileHTML5;
 }

 else {
    _yuitest_coverline("/home/yui/src/yui3/src/file/build_tmp/file.js", 27);
Y.File = Y.FileFlash;
 }


}, '@VERSION@' ,{requires:['file-flash', 'file-html5']});
