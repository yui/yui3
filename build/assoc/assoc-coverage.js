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
_yuitest_coverage["build/assoc/assoc.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/assoc/assoc.js",
    code: []
};
_yuitest_coverage["build/assoc/assoc.js"].code=["YUI.add('assoc', function (Y, NAME) {","","Y.Assoc = function() {","    var _arr = [],","        _obj = {},","        _keyExists = function (key) {","            return (_obj[key] !== undefined);","        },","        _getKey = function(obj) {","            var key = null,","                p;","","            for (p in obj) {","                if (obj.hasOwnProperty(p)) {","                    key = p;","                }","                if (key !== null) {","                    break;","                }","            }","","            return key;","        },","        _assoc = {","","            push : function() {","                var i = 0,","                    l = arguments.length,","                    key,","                    value;","","                for (i = 0; i < l; i++) {","                    value = arguments[i];","","                    key = _getKey(value);","                    if (key) {","                        if (_keyExists(key)) {","                            _arr = _arr.splice(_arr.indexOf(key),1);","                        }","                        _arr.push(key);","                        _obj[key] = value[key];","                    }","                }","","                return _assoc;","            },","","            pop : function() {","                var key = _arr.pop(),","                    val = {};","","                if (_obj[key]) {","                    val = _obj[key];","                    delete _obj[key];","                }","","                return val;","            },","","            shift : function() {","                var key = _arr.shift(),","                    val = {};","","                if (_obj[key]) {","                    val = _obj[key];","                    delete _obj[key];","                }","","                return val;","            },","","            unshift : function() {","                var i = 0,","                    l = arguments.length,","                    key,","                    value;","","                for (i = 0; i < l; i++) {","                    value = arguments[i];","","                    key = _getKey(value);","                    if (key) {","                        if (_keyExists(key)) {","                            _arr = _arr.splice(_arr.indexOf(key),1);","                        }","                        _arr.unshift(key);","                        _obj[key] = value[key];","                    }","                }","","                return _assoc;","            },","","            reverse: function() {","                _arr.reverse();","","                return _assoc;","            },","","            splice: function (index, numToRemove, elementsN) {","                // TODO: complete splice method","            },","","            indexOf : function(key) {","                return _arr.indexOf(key);","            },","","            lastIndexOf: function(key) {","                return _arr.lastIndexOf(key);","            },","","            size : function() {","                return _arr.length;","            },","","            each : function(callback) {","                var i = 0,","                    l = _arr.length;","","                for (i = 0; i < l; i++) {","                    (callback(/*value*/_obj[_arr[i]], /*key*/_arr[i], /*index*/i));","                }","","                return _assoc;","            },","","            setItem : function(index, value) {","                if (typeof index === 'string' && _keyExists(index)) {","                    _obj[index] = value;","                } else if (_arr[parseInt(index, 10)]) {","                    index = parseInt(index, 10);","","                    var key = _getKey(value);","","                    if (key) {","                        _arr[index] = key;","                        _obj[key] = value[key];","                    }","","                } else {","                    throw \"Key is not already set. Use `push`, `unshift` or \";","                }","","                return _assoc;","            },","","            getItem : function(index) {","                var retObj = {};","                if (typeof index === 'string' && _keyExists(index)) {","                    retObj = _obj[index];","                } else if (_arr[parseInt(index, 10)]) {","                    retObj = _obj[_arr[parseInt(index, 10)]];","                } else {","                    throw \"Item at index \" + index + \" is not found.\";","                }","","                return retObj;","            },","","            empty: function() {","                _arr = [];","                _obj = {};","","                return _assoc;","            },","","            keys: function() {","                return _arr.concat();","            },","","            values: function() {","                var i,","                    l = _arr.length,","                    retArr = [];","","                for (i=0; i<l; i++) {","                    retArr.push(_obj[_arr[i]]);","                }","","                return retArr;","            },","","            pairs: function() {","                var i,","                    l = _arr.length,","                    retArr = [],","                    key;","","                for (i=0; i<l; i++) {","                    key = _arr[i];","                    retArr.push({ key: _obj[key]});","                }","","                return retArr;","            }","","        };","","    return _assoc;","};","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/assoc/assoc.js"].lines = {"1":0,"3":0,"4":0,"7":0,"10":0,"13":0,"14":0,"15":0,"17":0,"18":0,"22":0,"27":0,"32":0,"33":0,"35":0,"36":0,"37":0,"38":0,"40":0,"41":0,"45":0,"49":0,"52":0,"53":0,"54":0,"57":0,"61":0,"64":0,"65":0,"66":0,"69":0,"73":0,"78":0,"79":0,"81":0,"82":0,"83":0,"84":0,"86":0,"87":0,"91":0,"95":0,"97":0,"105":0,"109":0,"113":0,"117":0,"120":0,"121":0,"124":0,"128":0,"129":0,"130":0,"131":0,"133":0,"135":0,"136":0,"137":0,"141":0,"144":0,"148":0,"149":0,"150":0,"151":0,"152":0,"154":0,"157":0,"161":0,"162":0,"164":0,"168":0,"172":0,"176":0,"177":0,"180":0,"184":0,"189":0,"190":0,"191":0,"194":0,"199":0};
_yuitest_coverage["build/assoc/assoc.js"].functions = {"_keyExists:6":0,"_getKey:9":0,"push:26":0,"pop:48":0,"shift:60":0,"unshift:72":0,"reverse:94":0,"indexOf:104":0,"lastIndexOf:108":0,"size:112":0,"each:116":0,"setItem:127":0,"getItem:147":0,"empty:160":0,"keys:167":0,"values:171":0,"pairs:183":0,"Assoc:3":0,"(anonymous 1):1":0};
_yuitest_coverage["build/assoc/assoc.js"].coveredLines = 81;
_yuitest_coverage["build/assoc/assoc.js"].coveredFunctions = 19;
_yuitest_coverline("build/assoc/assoc.js", 1);
YUI.add('assoc', function (Y, NAME) {

_yuitest_coverfunc("build/assoc/assoc.js", "(anonymous 1)", 1);
_yuitest_coverline("build/assoc/assoc.js", 3);
Y.Assoc = function() {
    _yuitest_coverfunc("build/assoc/assoc.js", "Assoc", 3);
_yuitest_coverline("build/assoc/assoc.js", 4);
var _arr = [],
        _obj = {},
        _keyExists = function (key) {
            _yuitest_coverfunc("build/assoc/assoc.js", "_keyExists", 6);
_yuitest_coverline("build/assoc/assoc.js", 7);
return (_obj[key] !== undefined);
        },
        _getKey = function(obj) {
            _yuitest_coverfunc("build/assoc/assoc.js", "_getKey", 9);
_yuitest_coverline("build/assoc/assoc.js", 10);
var key = null,
                p;

            _yuitest_coverline("build/assoc/assoc.js", 13);
for (p in obj) {
                _yuitest_coverline("build/assoc/assoc.js", 14);
if (obj.hasOwnProperty(p)) {
                    _yuitest_coverline("build/assoc/assoc.js", 15);
key = p;
                }
                _yuitest_coverline("build/assoc/assoc.js", 17);
if (key !== null) {
                    _yuitest_coverline("build/assoc/assoc.js", 18);
break;
                }
            }

            _yuitest_coverline("build/assoc/assoc.js", 22);
return key;
        },
        _assoc = {

            push : function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "push", 26);
_yuitest_coverline("build/assoc/assoc.js", 27);
var i = 0,
                    l = arguments.length,
                    key,
                    value;

                _yuitest_coverline("build/assoc/assoc.js", 32);
for (i = 0; i < l; i++) {
                    _yuitest_coverline("build/assoc/assoc.js", 33);
value = arguments[i];

                    _yuitest_coverline("build/assoc/assoc.js", 35);
key = _getKey(value);
                    _yuitest_coverline("build/assoc/assoc.js", 36);
if (key) {
                        _yuitest_coverline("build/assoc/assoc.js", 37);
if (_keyExists(key)) {
                            _yuitest_coverline("build/assoc/assoc.js", 38);
_arr = _arr.splice(_arr.indexOf(key),1);
                        }
                        _yuitest_coverline("build/assoc/assoc.js", 40);
_arr.push(key);
                        _yuitest_coverline("build/assoc/assoc.js", 41);
_obj[key] = value[key];
                    }
                }

                _yuitest_coverline("build/assoc/assoc.js", 45);
return _assoc;
            },

            pop : function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "pop", 48);
_yuitest_coverline("build/assoc/assoc.js", 49);
var key = _arr.pop(),
                    val = {};

                _yuitest_coverline("build/assoc/assoc.js", 52);
if (_obj[key]) {
                    _yuitest_coverline("build/assoc/assoc.js", 53);
val = _obj[key];
                    _yuitest_coverline("build/assoc/assoc.js", 54);
delete _obj[key];
                }

                _yuitest_coverline("build/assoc/assoc.js", 57);
return val;
            },

            shift : function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "shift", 60);
_yuitest_coverline("build/assoc/assoc.js", 61);
var key = _arr.shift(),
                    val = {};

                _yuitest_coverline("build/assoc/assoc.js", 64);
if (_obj[key]) {
                    _yuitest_coverline("build/assoc/assoc.js", 65);
val = _obj[key];
                    _yuitest_coverline("build/assoc/assoc.js", 66);
delete _obj[key];
                }

                _yuitest_coverline("build/assoc/assoc.js", 69);
return val;
            },

            unshift : function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "unshift", 72);
_yuitest_coverline("build/assoc/assoc.js", 73);
var i = 0,
                    l = arguments.length,
                    key,
                    value;

                _yuitest_coverline("build/assoc/assoc.js", 78);
for (i = 0; i < l; i++) {
                    _yuitest_coverline("build/assoc/assoc.js", 79);
value = arguments[i];

                    _yuitest_coverline("build/assoc/assoc.js", 81);
key = _getKey(value);
                    _yuitest_coverline("build/assoc/assoc.js", 82);
if (key) {
                        _yuitest_coverline("build/assoc/assoc.js", 83);
if (_keyExists(key)) {
                            _yuitest_coverline("build/assoc/assoc.js", 84);
_arr = _arr.splice(_arr.indexOf(key),1);
                        }
                        _yuitest_coverline("build/assoc/assoc.js", 86);
_arr.unshift(key);
                        _yuitest_coverline("build/assoc/assoc.js", 87);
_obj[key] = value[key];
                    }
                }

                _yuitest_coverline("build/assoc/assoc.js", 91);
return _assoc;
            },

            reverse: function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "reverse", 94);
_yuitest_coverline("build/assoc/assoc.js", 95);
_arr.reverse();

                _yuitest_coverline("build/assoc/assoc.js", 97);
return _assoc;
            },

            splice: function (index, numToRemove, elementsN) {
                // TODO: complete splice method
            },

            indexOf : function(key) {
                _yuitest_coverfunc("build/assoc/assoc.js", "indexOf", 104);
_yuitest_coverline("build/assoc/assoc.js", 105);
return _arr.indexOf(key);
            },

            lastIndexOf: function(key) {
                _yuitest_coverfunc("build/assoc/assoc.js", "lastIndexOf", 108);
_yuitest_coverline("build/assoc/assoc.js", 109);
return _arr.lastIndexOf(key);
            },

            size : function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "size", 112);
_yuitest_coverline("build/assoc/assoc.js", 113);
return _arr.length;
            },

            each : function(callback) {
                _yuitest_coverfunc("build/assoc/assoc.js", "each", 116);
_yuitest_coverline("build/assoc/assoc.js", 117);
var i = 0,
                    l = _arr.length;

                _yuitest_coverline("build/assoc/assoc.js", 120);
for (i = 0; i < l; i++) {
                    _yuitest_coverline("build/assoc/assoc.js", 121);
(callback(/*value*/_obj[_arr[i]], /*key*/_arr[i], /*index*/i));
                }

                _yuitest_coverline("build/assoc/assoc.js", 124);
return _assoc;
            },

            setItem : function(index, value) {
                _yuitest_coverfunc("build/assoc/assoc.js", "setItem", 127);
_yuitest_coverline("build/assoc/assoc.js", 128);
if (typeof index === 'string' && _keyExists(index)) {
                    _yuitest_coverline("build/assoc/assoc.js", 129);
_obj[index] = value;
                } else {_yuitest_coverline("build/assoc/assoc.js", 130);
if (_arr[parseInt(index, 10)]) {
                    _yuitest_coverline("build/assoc/assoc.js", 131);
index = parseInt(index, 10);

                    _yuitest_coverline("build/assoc/assoc.js", 133);
var key = _getKey(value);

                    _yuitest_coverline("build/assoc/assoc.js", 135);
if (key) {
                        _yuitest_coverline("build/assoc/assoc.js", 136);
_arr[index] = key;
                        _yuitest_coverline("build/assoc/assoc.js", 137);
_obj[key] = value[key];
                    }

                } else {
                    _yuitest_coverline("build/assoc/assoc.js", 141);
throw "Key is not already set. Use `push`, `unshift` or ";
                }}

                _yuitest_coverline("build/assoc/assoc.js", 144);
return _assoc;
            },

            getItem : function(index) {
                _yuitest_coverfunc("build/assoc/assoc.js", "getItem", 147);
_yuitest_coverline("build/assoc/assoc.js", 148);
var retObj = {};
                _yuitest_coverline("build/assoc/assoc.js", 149);
if (typeof index === 'string' && _keyExists(index)) {
                    _yuitest_coverline("build/assoc/assoc.js", 150);
retObj = _obj[index];
                } else {_yuitest_coverline("build/assoc/assoc.js", 151);
if (_arr[parseInt(index, 10)]) {
                    _yuitest_coverline("build/assoc/assoc.js", 152);
retObj = _obj[_arr[parseInt(index, 10)]];
                } else {
                    _yuitest_coverline("build/assoc/assoc.js", 154);
throw "Item at index " + index + " is not found.";
                }}

                _yuitest_coverline("build/assoc/assoc.js", 157);
return retObj;
            },

            empty: function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "empty", 160);
_yuitest_coverline("build/assoc/assoc.js", 161);
_arr = [];
                _yuitest_coverline("build/assoc/assoc.js", 162);
_obj = {};

                _yuitest_coverline("build/assoc/assoc.js", 164);
return _assoc;
            },

            keys: function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "keys", 167);
_yuitest_coverline("build/assoc/assoc.js", 168);
return _arr.concat();
            },

            values: function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "values", 171);
_yuitest_coverline("build/assoc/assoc.js", 172);
var i,
                    l = _arr.length,
                    retArr = [];

                _yuitest_coverline("build/assoc/assoc.js", 176);
for (i=0; i<l; i++) {
                    _yuitest_coverline("build/assoc/assoc.js", 177);
retArr.push(_obj[_arr[i]]);
                }

                _yuitest_coverline("build/assoc/assoc.js", 180);
return retArr;
            },

            pairs: function() {
                _yuitest_coverfunc("build/assoc/assoc.js", "pairs", 183);
_yuitest_coverline("build/assoc/assoc.js", 184);
var i,
                    l = _arr.length,
                    retArr = [],
                    key;

                _yuitest_coverline("build/assoc/assoc.js", 189);
for (i=0; i<l; i++) {
                    _yuitest_coverline("build/assoc/assoc.js", 190);
key = _arr[i];
                    _yuitest_coverline("build/assoc/assoc.js", 191);
retArr.push({ key: _obj[key]});
                }

                _yuitest_coverline("build/assoc/assoc.js", 194);
return retArr;
            }

        };

    _yuitest_coverline("build/assoc/assoc.js", 199);
return _assoc;
};


}, '@VERSION@', {"requires": ["yui-base"]});
