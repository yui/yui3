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

// HTTP request factory. Augments Node's HTTPServerRequest object with
// additional properties.
exports.Request = function Request(req) {
    var parsedURL = parseURL(req.url, true);

    Object.defineProperties(req, {
        parsedURL: {
            value: parsedURL
        },

        query: {
            value: parsedURL.query || {}
        }
    });

    return req;
};

// HTTP response factory. Augments Node's HTTPServerResponse object with
// additional properties and methods.
exports.Response = function Response(res) {
    var headers    = {},
        statusCode = 200;

    Object.defineProperties(res, {
        headers: {
            enumerable: true,

            get: function () {
                var _headers = {},
                    header,
                    name;

                for (name in headers) {
                    if (headers.hasOwnProperty(name)) {
                        header = headers[name];
                        _headers[header[0]] = header[1];
                    }
                }

                return _headers;
            }
        },

        statusCode: {
            enumerable: true,

            get: function () {
                return statusCode;
            },

            set: function (value) {
                return (statusCode = parseInt(value, 10));
            }
        }
    });

    // TODO: validate name characters in headers
    res.addHeader = function addHeader(name, value) {
        if (!res.hasHeader(name)) {
            res.setHeader(name, value);
            return true;
        }

        return false;
    };

    res.getHeader = function getHeader(name) {
        return res.hasHeader(name) ? headers[name.toLowerCase()][1] : undefined;
    };

    res.hasHeader = function hasHeader(name) {
        return headers.hasOwnProperty(name.toLowerCase());
    };

    res.removeHeader = function removeHeader(name) {
        if (res.hasHeader(name)) {
            delete headers[name.toLowerCase()];
            return true;
        }

        return false;
    };

    res.send304 = function send304() {
        res.statusCode = 304;
        res.sendResponse();
    };

    res.send404 = function send404() {
        res.sendError(404, 'The requested resource was not found.');
    };

    res.sendError = function sendError(statusCode, message, title) {
        message = message || '';
        title   = title || statusCode.toString() + ' ' +
                (http.STATUS_CODES[statusCode.toString()] || 'Unknown Error');

        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.statusCode = statusCode;

        res.sendResponse(
            '<!DOCTYPE html>' +
            '<html>' +
                '<head><title>' + title + '</title></head>' +
                '<body>' +
                    '<h1>' + title + '</h1>' +
                    '<p>' + message + '</p>' +
                '</body>' +
            '</html>'
        );
    };

    res.sendHTML = function sendHTML(body) {
        res.addHeader('Content-Type', 'text/html;charset=utf-8');
        res.sendResponse(body);
    };

    res.sendJSON = function sendJSON(body) {
        res.addHeader('Content-Type', 'application/json;charset=utf-8');
        sendResponse(JSON.stringify(body));
    };

    res.sendResponse = function sendResponse(body) {
        if (body) {
            res.addHeader('Content-Length', body.length || 0);
        }

        res.writeHead(res.statusCode, res.headers);

        if (body) {
            res.write(body);
        }

        res.end();
    };

    res.setHeader = function setHeader(name, value) {
        headers[name.toLowerCase()] = [name, value];
    };

    // Default headers.
    res.addHeader('Date', new Date().toUTCString());

    return res;
};

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
        try {
            publicRoot = fs.realpathSync(config && config.publicRoot || 'public');
        } catch (ex) {
            publicRoot = null;
        }

        server = http.createServer(handleRequest);
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
            replace('%status',   res.statusCode).
            replace('%size',     res.getHeader('Content-Length') || '-')
        );
    }

    function matchPublic(req, res, callback, pathOverride) {
        var fullPath,
            requestPath = pathOverride || req.parsedURL.pathname;

        if (!publicRoot) {
            return finish(false);
        }

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

                    res.setHeader('Content-Type', mime.getType(path.extname(fullPath)));
                    res.sendResponse(buffer);
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
            res.send404();
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
                        if (!res.finished) {
                            switch(typeof result) {
                            case 'string':
                                res.sendHTML(result);
                                break;

                            case 'object':
                                res.sendJSON(result);
                                break;

                            default:
                                res.statusCode = 204;
                                res.sendResponse();
                            }
                        }

                        callback && callback.call(null, req, res, true);
                    },

                    query   : req.query,
                    request : req,
                    response: res
                }, matches);

                return; // <-- look, a return!
            }
        }

        // No route matched; return a 404.
        res.send404();
        callback && callback.call(null, req, res, false);
    }

    // -- Private Callbacks ----------------------------------------------------
    function handleRequest(req, res) {
        req = exports.Request(req);
        res = exports.Response(res);

        // Fast error and no logging for all favicon requests (for now).
        if (req.parsedURL.pathname === '/favicon.ico') {
            res.send404();
            return;
        }

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
