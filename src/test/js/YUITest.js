

/**
 * YUI Test Framework
 * @module test
 * @main test
 */

/*
 * The root namespace for YUI Test.
 */

//So we only ever have one YUITest object that's shared
if (YUI.YUITest) {
    Y.Test = YUI.YUITest;

    if (Y.Test.prototype.debugWinJS === true) {
        var winJS = new Y.Test.WinJS();
    }


} else { //Ends after the YUITest definitions

    //Make this global for back compat
    YUITest = {
        version: "@VERSION@",
        guid: function(pre) {
            return Y.guid(pre);
        }
    };
