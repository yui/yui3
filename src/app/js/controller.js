/**
The app framework provides simple MVC-like building blocks (models, model lists,
views, and controllers) for writing single-page JavaScript applications.

@main app
@module app
**/

/**
Provides URL-based routing using HTML5 `pushState()` or the location hash.

This makes it easy to wire up route handlers for different application states
while providing full back/forward navigation support and bookmarkable, shareable
URLs.

@submodule controller
@class Controller
@constructor
@uses Base
**/

var YArray = Y.Array,
    QS     = Y.QueryString,

    // Android versions lower than 3.0 are buggy and don't update
    // window.location after a pushState() call, so we fall back to hash-based
    // history for them.
    //
    // See http://code.google.com/p/android/issues/detail?id=17471
    html5    = Y.HistoryBase.html5 && (!Y.UA.android || Y.UA.android >= 3),
    location = Y.config.win.location;

function Controller() {
    Controller.superclass.constructor.apply(this, arguments);
}

Y.Controller = Y.extend(Controller, Y.Base, {
    // -- Public Properties ----------------------------------------------------
    base  : '',
    routes: [],

    // -- Protected Properties -------------------------------------------------
    _regexPathParam: /([:*])([\w\d-]+)/g,
    _regexUrlQuery : /\?([^#]*).*$/,

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        config || (config = {});

        this._routes = [];

        config.base && (this.base = config.base);
        config.routes && (this.routes = config.routes);

        YArray.each(this.routes, function (route) {
            this.route(route.path, route.callback, true);
        }, this);

        // Set up a history instance.
        this._history = html5 ? new Y.HistoryHTML5() : new Y.HistoryHash();
        this._history.after('change', this._afterHistoryChange, this);

        // Handle the initial route.
        this._dispatch(this._getPath(), this._getState());
    },

    destructor: function () {
        this._history.detachAll();
    },

    // -- Public Methods -------------------------------------------------------
    match: function (path) {
        return YArray.filter(this._routes, function (route) {
            return path.search(route.regex) > -1;
        });
    },

    replace: function (url, title, state) {
        return this._save(url, title, state, true);
    },

    route: function (path, callback) {
        var keys = [];

        this._routes.push({
            callback: callback,
            keys    : keys,
            regex   : this._getRegex(path, keys)
        });

        return this;
    },

    save: function (url, title, state) {
        return this._save(url, title, state);
    },

    // -- Protected Methods ----------------------------------------------------
    _decode: function (string) {
        return decodeURIComponent(string.replace(/\+/g, ' '));
    },

    _dispatch: function (path, state) {
        var routes = this.match(path),
            req, route, self;

        if (!routes || !routes.length) {
            return;
        }

        req  = this._getRequest(path, state);
        self = this;

        function next(err) {
            var callback, matches;

            if (err) {
                Y.error(err);
            } else if ((route = routes.shift())) {
                matches  = route.regex.exec(path);
                callback = typeof route.callback === 'string' ?
                        self[route.callback] : route.callback;

                // Use named keys for parameter names if the route path contains
                // named keys. Otherwise, use numerical match indices.
                if (matches.length === route.keys.length + 1) {
                    req.params = YArray.hash(route.keys, matches.slice(1));
                } else {
                    req.params = {};

                    YArray.each(matches, function (value, i) {
                        req.params[i] = value;
                    });
                }

                callback.call(self, req, next);
            }
        }

        next();
    },

    _getPath: html5 ? function () {
        var base = this.base,
            path = location.pathname;

        if (base && path.indexOf(base) === 0) {
            path = path.substring(base.length);
        }

        return path;
    } : function () {
        return this._history.get('path') || this.base + location.pathname;
    },

    _getQuery: html5 ? function () {
        return location.search.substring(1);
    } : function () {
        return this._history.get('query') || location.search.substring(1);
    },

    _getRegex: function (path, keys) {
        if (path instanceof RegExp) {
            return path;
        }

        path = path.replace(this._regexPathParam, function (match, operator, key) {
            keys.push(key);
            return operator === '*' ? '(.*?)' : '([^/]*)';
        });

        return new RegExp('^' + path + '$');
    },

    _getRequest: function (path, state) {
        return {
            path : path,
            query: this._parseQuery(this._getQuery()),
            state: state
        };
    },

    _parseQuery: QS && QS.parse ? QS.parse : function (query) {
        var decode = this._decode,
            params = query.split('&'),
            i      = 0,
            len    = params.length,
            result = {},
            param;

        for (; i < len; ++i) {
            param = params[i].split('=');

            if (param[0]) {
                result[decode(param[0])] = decode(param[1] || '');
            }
        }

        return result;
    },

    _save: function (url, title, state, replace) {
        var jsonState, query;

        if (html5) {
            if (typeof url === 'string') {
                url = this.base + url;
            }
        } else {
            // If we're not using HTML5 history, take over the history state for
            // our own purposes and shove the implementer's state inside it as a
            // JSON string.
            jsonState = state && Y.JSON.stringify(state);

            // Extract a query string from the URL if there is one, then remove
            // both the query and the hash portions of the URL so we can store
            // just the path.
            url = url.replace(this._regexUrlQuery, function (match, params) {
                query = params;
                return '';
            });

            state = {path: url || this._getPath()};

            query     && (state.query = query);
            jsonState && (state.state = jsonState);
        }

        this._history[replace ? 'replace' : 'add'](state || {}, {
            merge: false,
            title: title,
            url  : url
        });

        return this;
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterHistoryChange: function (e) {
        var self = this;

        // We need to yield control to the UI thread to allow the browser to
        // update document.location before we dispatch.
        setTimeout(function () {
            self._dispatch(self._getPath(), self._getState());
        }, 1);
    }
}, {
    NAME: 'controller'
});
