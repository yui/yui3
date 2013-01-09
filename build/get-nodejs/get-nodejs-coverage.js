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
_yuitest_coverage["build/get-nodejs/get-nodejs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/get-nodejs/get-nodejs.js",
    code: []
};
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].code=["YUI.add('get', function (Y, NAME) {","","    /**","    * NodeJS specific Get module used to load remote resources.","    * It contains the same signature as the default Get module so there is no code change needed.","    * @module get-nodejs","    * @class GetNodeJS","    */","","    var Module = require('module'),","","        path = require('path'),","        fs = require('fs'),","        request = require('request'),","        end = function(cb, msg, result) {","            if (Y.Lang.isFunction(cb.onEnd)) {","                cb.onEnd.call(Y, msg, result);","            }","        }, pass = function(cb) {","            if (Y.Lang.isFunction(cb.onSuccess)) {","                cb.onSuccess.call(Y, cb);","            }","            end(cb, 'success', 'success');","        }, fail = function(cb, er) {","            er.errors = [er];","            if (Y.Lang.isFunction(cb.onFailure)) {","                cb.onFailure.call(Y, er, cb);","            }","            end(cb, er, 'fail');","        };","","","    Y.Get = function() {","    };","","    //Setup the default config base path","    Y.config.base = path.join(__dirname, '../');","","    YUI.require = require;","    YUI.process = process;","","    /**","    * Takes the raw JS files and wraps them to be executed in the YUI context so they can be loaded","    * into the YUI object","    * @method _exec","    * @private","    * @param {String} data The JS to execute","    * @param {String} url The path to the file that was parsed","    * @param {Callback} cb The callback to execute when this is completed","    * @param {Error} cb.err=null Error object","    * @param {String} cb.url The URL that was just parsed","    */","","    Y.Get._exec = function(data, url, cb) {","        if (data.charCodeAt(0) === 0xFEFF) {","            data = data.slice(1);","        }","","        var mod = new Module(url, module);","        mod.filename = url;","        mod.paths = Module._nodeModulePaths(path.dirname(url));","        mod._compile('module.exports = function (YUI) {' + data + '\\n;return YUI;};', url);","","        /*global YUI:true */","        YUI = mod.exports(YUI);","","        mod.loaded = true;","","        cb(null, url);","    };","","    /**","    * Fetches the content from a remote URL or a file from disc and passes the content","    * off to `_exec` for parsing","    * @method _include","    * @private","    * @param {String} url The URL/File path to fetch the content from","    * @param {Callback} cb The callback to fire once the content has been executed via `_exec`","    */","    Y.Get._include = function (url, cb) {","        var cfg,","            mod,","            self = this;","","        if (url.match(/^https?:\\/\\//)) {","            cfg = {","                url: url,","                timeout: self.timeout","            };","            request(cfg, function (err, response, body) {","                if (err) {","                    cb(err, url);","                } else {","                    Y.Get._exec(body, url, cb);","                }","            });","        } else {","            try {","                // Try to resolve paths relative to the module that required yui.","                url = Module._findPath(url, Module._resolveLookupPaths(url, module.parent.parent)[1]);","","                if (Y.config.useSync) {","                    //Needs to be in useSync","                    mod = fs.readFileSync(url,'utf8');","                } else {","                    fs.readFile(url, 'utf8', function (err, mod) {","                        if (err) {","                            cb(err, url);","                        } else {","                            Y.Get._exec(mod, url, cb);","                        }","                    });","                    return;","                }","            } catch (err) {","                cb(err, url);","                return;","            }","","            Y.Get._exec(mod, url, cb);","        }","    };","","","    /**","    * Override for Get.script for loading local or remote YUI modules.","    * @method js","    * @param {Array|String} s The URL's to load into this context","    * @param {Object} options Transaction options","    */","    Y.Get.js = function(s, options) {","        var urls = Y.Array(s), url, i, l = urls.length, c= 0,","            check = function() {","                if (c === l) {","                    pass(options);","                }","            };","","","        /*jshint loopfunc: true */","        for (i=0; i<l; i++) {","            url = urls[i];","            if (Y.Lang.isObject(url)) {","                url = url.url;","            }","","            url = url.replace(/'/g, '%27');","            Y.Get._include(url, function(err, url) {","                if (!Y.config) {","                    Y.config = {","                        debug: true","                    };","                }","                if (options.onProgress) {","                    options.onProgress.call(options.context || Y, url);","                }","                if (err) {","                    fail(options, err);","                } else {","                    c++;","                    check();","                }","            });","        }","    };","","    /**","    * Alias for `Y.Get.js`","    * @method script","    */","    Y.Get.script = Y.Get.js;","","    //Place holder for SS Dom access","    Y.Get.css = function(s, cb) {","        pass(cb);","    };","","","","}, '@VERSION@');"];
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].lines = {"1":0,"10":0,"16":0,"17":0,"20":0,"21":0,"23":0,"25":0,"26":0,"27":0,"29":0,"33":0,"37":0,"39":0,"40":0,"54":0,"55":0,"56":0,"59":0,"60":0,"61":0,"62":0,"65":0,"67":0,"69":0,"80":0,"81":0,"85":0,"86":0,"90":0,"91":0,"92":0,"94":0,"98":0,"100":0,"102":0,"104":0,"106":0,"107":0,"108":0,"110":0,"113":0,"116":0,"117":0,"120":0,"131":0,"132":0,"134":0,"135":0,"141":0,"142":0,"143":0,"144":0,"147":0,"148":0,"149":0,"150":0,"154":0,"155":0,"157":0,"158":0,"160":0,"161":0,"171":0,"174":0,"175":0};
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].functions = {"end:15":0,"pass:19":0,"fail:24":0,"_exec:54":0,"(anonymous 2):90":0,"(anonymous 3):106":0,"_include:80":0,"check:133":0,"(anonymous 4):148":0,"js:131":0,"css:174":0,"(anonymous 1):1":0};
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].coveredLines = 66;
_yuitest_coverage["build/get-nodejs/get-nodejs.js"].coveredFunctions = 12;
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 1);
YUI.add('get', function (Y, NAME) {

    /**
    * NodeJS specific Get module used to load remote resources.
    * It contains the same signature as the default Get module so there is no code change needed.
    * @module get-nodejs
    * @class GetNodeJS
    */

    _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "(anonymous 1)", 1);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 10);
var Module = require('module'),

        path = require('path'),
        fs = require('fs'),
        request = require('request'),
        end = function(cb, msg, result) {
            _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "end", 15);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 16);
if (Y.Lang.isFunction(cb.onEnd)) {
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 17);
cb.onEnd.call(Y, msg, result);
            }
        }, pass = function(cb) {
            _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "pass", 19);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 20);
if (Y.Lang.isFunction(cb.onSuccess)) {
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 21);
cb.onSuccess.call(Y, cb);
            }
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 23);
end(cb, 'success', 'success');
        }, fail = function(cb, er) {
            _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "fail", 24);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 25);
er.errors = [er];
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 26);
if (Y.Lang.isFunction(cb.onFailure)) {
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 27);
cb.onFailure.call(Y, er, cb);
            }
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 29);
end(cb, er, 'fail');
        };


    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 33);
Y.Get = function() {
    };

    //Setup the default config base path
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 37);
Y.config.base = path.join(__dirname, '../');

    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 39);
YUI.require = require;
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 40);
YUI.process = process;

    /**
    * Takes the raw JS files and wraps them to be executed in the YUI context so they can be loaded
    * into the YUI object
    * @method _exec
    * @private
    * @param {String} data The JS to execute
    * @param {String} url The path to the file that was parsed
    * @param {Callback} cb The callback to execute when this is completed
    * @param {Error} cb.err=null Error object
    * @param {String} cb.url The URL that was just parsed
    */

    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 54);
Y.Get._exec = function(data, url, cb) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "_exec", 54);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 55);
if (data.charCodeAt(0) === 0xFEFF) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 56);
data = data.slice(1);
        }

        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 59);
var mod = new Module(url, module);
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 60);
mod.filename = url;
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 61);
mod.paths = Module._nodeModulePaths(path.dirname(url));
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 62);
mod._compile('module.exports = function (YUI) {' + data + '\n;return YUI;};', url);

        /*global YUI:true */
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 65);
YUI = mod.exports(YUI);

        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 67);
mod.loaded = true;

        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 69);
cb(null, url);
    };

    /**
    * Fetches the content from a remote URL or a file from disc and passes the content
    * off to `_exec` for parsing
    * @method _include
    * @private
    * @param {String} url The URL/File path to fetch the content from
    * @param {Callback} cb The callback to fire once the content has been executed via `_exec`
    */
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 80);
Y.Get._include = function (url, cb) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "_include", 80);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 81);
var cfg,
            mod,
            self = this;

        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 85);
if (url.match(/^https?:\/\//)) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 86);
cfg = {
                url: url,
                timeout: self.timeout
            };
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 90);
request(cfg, function (err, response, body) {
                _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "(anonymous 2)", 90);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 91);
if (err) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 92);
cb(err, url);
                } else {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 94);
Y.Get._exec(body, url, cb);
                }
            });
        } else {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 98);
try {
                // Try to resolve paths relative to the module that required yui.
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 100);
url = Module._findPath(url, Module._resolveLookupPaths(url, module.parent.parent)[1]);

                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 102);
if (Y.config.useSync) {
                    //Needs to be in useSync
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 104);
mod = fs.readFileSync(url,'utf8');
                } else {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 106);
fs.readFile(url, 'utf8', function (err, mod) {
                        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "(anonymous 3)", 106);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 107);
if (err) {
                            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 108);
cb(err, url);
                        } else {
                            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 110);
Y.Get._exec(mod, url, cb);
                        }
                    });
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 113);
return;
                }
            } catch (err) {
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 116);
cb(err, url);
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 117);
return;
            }

            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 120);
Y.Get._exec(mod, url, cb);
        }
    };


    /**
    * Override for Get.script for loading local or remote YUI modules.
    * @method js
    * @param {Array|String} s The URL's to load into this context
    * @param {Object} options Transaction options
    */
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 131);
Y.Get.js = function(s, options) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "js", 131);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 132);
var urls = Y.Array(s), url, i, l = urls.length, c= 0,
            check = function() {
                _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "check", 133);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 134);
if (c === l) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 135);
pass(options);
                }
            };


        /*jshint loopfunc: true */
        _yuitest_coverline("build/get-nodejs/get-nodejs.js", 141);
for (i=0; i<l; i++) {
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 142);
url = urls[i];
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 143);
if (Y.Lang.isObject(url)) {
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 144);
url = url.url;
            }

            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 147);
url = url.replace(/'/g, '%27');
            _yuitest_coverline("build/get-nodejs/get-nodejs.js", 148);
Y.Get._include(url, function(err, url) {
                _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "(anonymous 4)", 148);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 149);
if (!Y.config) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 150);
Y.config = {
                        debug: true
                    };
                }
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 154);
if (options.onProgress) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 155);
options.onProgress.call(options.context || Y, url);
                }
                _yuitest_coverline("build/get-nodejs/get-nodejs.js", 157);
if (err) {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 158);
fail(options, err);
                } else {
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 160);
c++;
                    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 161);
check();
                }
            });
        }
    };

    /**
    * Alias for `Y.Get.js`
    * @method script
    */
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 171);
Y.Get.script = Y.Get.js;

    //Place holder for SS Dom access
    _yuitest_coverline("build/get-nodejs/get-nodejs.js", 174);
Y.Get.css = function(s, cb) {
        _yuitest_coverfunc("build/get-nodejs/get-nodejs.js", "css", 174);
_yuitest_coverline("build/get-nodejs/get-nodejs.js", 175);
pass(cb);
    };



}, '@VERSION@');
