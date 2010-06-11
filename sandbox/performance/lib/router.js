/**
 * This is a simple HTTP router for Node.js. See ../perf-server.js for a usage
 * example.
 */

var fs       = require('fs'),
    http     = require('http'),
    mime     = require('./mime'),
    parseURL = require('url').parse,
    path     = require('path'),
    query    = require('querystring'),
    sys      = require('sys');

// Server factory.
exports.Server = function Server(config) {
    var publicRoot,

        routes = {
            'DELETE' : [],
            'GET'    : [],
            'HEAD'   : [],
            'OPTIONS': [],
            'POST'   : [],
            'PUT'    : []
        },

        server;

    // -- Private Methods ------------------------------------------------------
    function init() {
        publicRoot = config && config.publicRoot || 'public';
        server     = http.createServer(handleRequest);
    }

    function addRoute(method, pattern, handler) {
        routes[method].push({
            // Intentionally not escaping regexp chars in strings here, since
            // this allows us to construct patterns more easily without having
            // to constantly escape / chars.
            pattern: pattern instanceof RegExp ? pattern : new RegExp('^' + pattern + '$'),
            handler: handler
        });
    }

    function curry(fn, scope) {
        var args = Array.prototype.slice.call(arguments, 2);

        return function () {
            fn.apply(scope || null, args.concat(Array.prototype.slice.call(arguments)));
        };
    }

    function decodeURLMatch(match) {
        return match ? query.unescape(match, true) : match;
    }

    // Logs a request. The format is similar to the Apache CLF, but is missing
    // the timestamp and the useless ident field.
    function logRequest(req, res) {
        sys.log('%ip "%method %url %protocol" %status %size'.
            replace('%ip',       req.connection.remoteAddress).
            replace('%method',   req.method).
            replace('%url',      req.url).
            replace('%protocol', 'HTTP/' + req.httpVersion).
            replace('%status',   res.status).
            replace('%size',     res.headers['content-length'] || '-')
        );
    }

    function matchPublic(req, res, callback, pathOverride) {
        var fullPath,
            requestPath = pathOverride || req.parsedURL.pathname;

        function finish(matched) {
            if (callback) {
                callback.call(null, req, res, matched);
            }
        }

        fullPath = path.join(publicRoot, requestPath);

        // Don't allow traversal above the public root.
        if (fullPath.indexOf(publicRoot) !== 0) {
            return finish(false);
        }

        fs.stat(fullPath, function (err, stats) {
            if (err) {
                return finish(false);
            }

            if (stats.isFile()) {
                fs.readFile(fullPath, function (err, buffer) {
                    if (err) {
                        return finish(false);
                    }

                    res.headers['content-type'] = mime.getType(path.extname(fullPath));
                    sendResponse(res, buffer);
                    return finish(true);
                });

                return;
            } else if (stats.isDirectory()) {
                // Recurse to try to get index.html from the directory.
                return matchPublic(req, res, callback,
                        path.join(requestPath, 'index.html'));
            }

            finish(false);
        });
    }

    function matchRoute(req, res, callback) {
        var i,
            len,
            matches,
            methodRoutes = routes[req.method],
            path         = req.parsedURL.pathname,
            result,
            route;

        if (!methodRoutes || !methodRoutes.length) {
            send404(res);
            callback && callback.call(null, req, res, false);
            return; // <-- look, a return!
        }

        for (i = 0, len = methodRoutes.length; i < len; ++i) {
            route   = methodRoutes[i];
            matches = path.match(route.pattern);

            if (matches && matches.shift()) {
                matches = matches.map(decodeURLMatch);

                // Route matched, so pass control to the route and stop
                // processing other routes.
                route.handler.apply({
                    end: function (result) {
                        res.finished = true;

                        switch(typeof result) {
                        case 'string':
                            sendHTML(res, result);
                            break;

                        case 'object':
                            sendJSON(res, result);
                            break;

                        default:
                            res.status = 204;
                            sendResponse(res);
                        }

                        callback && callback.call(null, req, res, true);
                    },

                    query: req.query,
                    req  : req,
                    res  : res,

                    send404     : curry(send404,      null, res),
                    sendError   : curry(sendError,    null, res),
                    sendHTML    : curry(sendHTML,     null, res),
                    sendJSON    : curry(sendJSON,     null, res),
                    sendResponse: curry(sendResponse, null, res)
                }, matches);

                return; // <-- look, a return!
            }
        }

        // No route matched; return a 404.
        send404(res);
        callback && callback.call(null, req, res, false);
    }

    function send404(res) {
        sendError(res, 404, '404 Not Found', 'The requested resource was not found.');
    }

    function sendError(res, status, title, message) {
        res.headers['content-type'] = 'text/html;charset=utf-8';
        res.status = status;

        sendResponse(res,
            '<!DOCTYPE html>' +
            '<html>' +
                '<head><title>' + title + '</title></head>' +
                '<body>' +
                    '<h1>' + title + '</h1>' +
                    '<p>' + message + '</p>' +
                '</body>' +
            '</html>'
        );
    }

    function sendHTML(res, body) {
        if (!res.headers['content-type']) {
            res.headers['content-type'] = 'text/html;charset=utf-8';
        }

        sendResponse(res, body);
    }

    function sendJSON(res, body) {
        if (!res.headers['content-type']) {
            res.headers['content-type'] = 'application/json;charset=utf-8';
        }

        sendResponse(res, JSON.stringify(body));
    }

    function sendResponse(res, body) {
        if (body && !res.headers['content-length']) {
            res.headers['content-length'] = body.length;
        }

        res.writeHead(res.status, res.headers);

        if (body) {
            res.write(body);
        }

        res.end();
        res.finished = true;
    }

    // -- Private Callbacks ----------------------------------------------------
    function handleRequest(req, res) {
        // Parse the URL and query string.
        req.parsedURL = parseURL(req.url, true);
        req.query     = req.parsedURL.query || {};

        // Set default response code.
        res.status = 200;

        // Set default response headers.
        res.headers = {};

        // Look for a matching public file.
        matchPublic(req, res, function (req, res, matched) {
            if (matched) {
                logRequest(req, res);
            } else {
                // No public file matched, so look for a matching route.
                matchRoute(req, res, function () {
                    logRequest(req, res);
                });
            }
        });
    }

    init();

    return {
        // -- Public Methods ---------------------------------------------------
        del: function del(pattern, handler) {
            return addRoute('DELETE', pattern, handler);
        },

        end: server.end,

        get: function get(pattern, handler) {
            return addRoute('GET', pattern, handler);
        },

        head: function head(pattern, handler) {
            return addRoute('HEAD', pattern, handler);
        },

        listen: function listen(port, host) {
            port = port || 3000;
            host = host || '0.0.0.0';

            server.listen(port, host);

            sys.log('Listening for connections on ' + host + ':' + port);
        },

        options: function options(pattern, handler) {
            return addRoute('OPTIONS', pattern, handler);
        },

        post: function post(pattern, handler) {
            return addRoute('POST', pattern, handler);
        },

        put: function put(pattern, handler) {
            return addRoute('PUT', pattern, handler);
        }
    };
};
