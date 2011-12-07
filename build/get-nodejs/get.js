YUI.add('get', function(Y) {

    /**
    * NodeJS specific Get module used to load remote resources. It contains the same signature as the default Get module so there is no code change needed.
    * Note: There is an added method called Get.domScript, which is the same as Get.script in a browser, it simply loads the script into the dom tree
    * so that you can call outerHTML on the document to print it to the screen.
    * @module get-nodejs
    */
        
    var path = require('path'),
        vm = require('vm'),
        fs = require('fs'),
        n_url = require('url'),
        http = require('http'),
        https = require('https');

    Y.Get = function() {};
    Y.config.base = path.join(__dirname, '../');


    Y.Get.urlInfoPort = function(urlInfo) {
        return urlInfo.port ? parseInt(urlInfo.port, 10) :
            urlInfo.protocol === 'http:' ? 80 : 443;
    };

    
    


    Y.Get._exec = function(data, url, cb) {
        var mod = "(function(YUI) { " + data + ";return YUI; })";
        var script = vm.createScript(mod, url);
        var fn = script.runInThisContext(mod);
        YUI = fn(YUI);
        cb(null);
    };

    Y.Get._include = function(url, cb) {
        if (url.match(/^https?:\/\//)) {
            var u = n_url.parse(url, parseQueryString=false),
                p = Y.Get.urlInfoPort(u),            
                req_url = u.pathname;

            if (u.search) {
                req_url += u.search;
            }            
            var h = http;
            if (p === 443 || u.protocol === 'https:') {
                h = https;
            }
            h.get({
                host: u.hostname,
                port: p,
                path: req_url
            }, function(res) {
                var mod = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    mod += chunk;
                });
                res.on('end', function() {
                    Y.Get._exec(mod, url, cb);
                });
            });
        } else {
            if (Y.config.useSync) {
                //Needs to be in useSync
                var mod = fs.readFileSync(url,'utf8');
                Y.Get._exec(mod, url, cb);
            } else {
                fs.readFile(url, 'utf8', function(err, mod) {
                    Y.Get._exec(mod, url, cb);
                });
            }
        }
        
    };


    var end = function(cb, msg, result) {
        if (Y.Lang.isFunction(cb.onEnd)) {
            cb.onEnd.call(Y, msg, result);
        }
    }, pass = function(cb) {
        if (Y.Lang.isFunction(cb.onSuccess)) {
            cb.onSuccess.call(Y, cb);
        }
        end(cb, 'success', 'success');
    }, fail = function(cb, er) {
        if (Y.Lang.isFunction(cb.onFailure)) {
            cb.onFailure.call(Y, er, cb);
        }
        end(cb, er, 'fail');
    };


    /**
    * Override for Get.script for loading local or remote YUI modules.
    */
    Y.Get.script = function(s, cb) {
        var A = Y.Array,
            urls = A(s), url, i, l = urls.length, c= 0,
            check = function() {
                if (c === l) {
                    pass(cb);
                }
            };



        for (i=0; i<l; i++) {
            url = urls[i];

            url = url.replace(/'/g, '%27');
            // doesn't need to be blocking, so don't block.
            Y.Get._include(url, function(err) {
                if (!Y.config) {
                    Y.config = {
                        debug: true
                    };
                }
                if (err) {
                    if (err.stack) {
                        A.each(err.stack.split('\n'), function(frame) {
                        });
                    } else {
                        console.log(err);
                    }
                } else {
                    c++;
                    check();
                }
            });
        }
    };



}, '@VERSION@' ,{requires:['yui-base']});
