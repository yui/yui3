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

    html5    = Y.HistoryBase.html5,
    location = Y.config.doc.location;

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
        this._history.on('change', this.onHistoryChange, this);

        // Handle the initial route.
        this._dispatch(this._getPath(), this._history.get());
    },

    destructor: function () {
        this._history.detachAll();
    },

    // -- Public Methods -------------------------------------------------------
    match: function (path) {
        return YArray.filter(this._routes, function (route) {
            return route.regex.test(path);
        });
    },

    replace: function (url, title, state) {
        return this._save(url, title, state, true);
    },

    route: function (path, callback) {
        var keys = [];

        this._routes.push({
            callback: typeof callback === 'string' ? this[callback] : callback,
            keys    : keys,
            regex   : this._getRegex(path, keys)
        });

        return this;
    },

    save: function (url, title, state) {
        return this._save(url, title, state);
    },

    // -- Protected Methods ----------------------------------------------------
    _dispatch: function (path, state) {
        var routes = this.match(path),
            req, route, self;

        if (!routes || !routes.length) {
            return;
        }

        req  = this._getRequest(path, state);
        self = this;

        function next(err) {
            var matches;

            if (err) {
                Y.error(err);
            } else if ((route = routes.shift())) {
                matches = route.regex.exec(path);

                req.params = matches ?
                        YArray.hash(route.keys, matches.slice(1)) : {};

                route.callback.call(self, req, next);
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
        return this._history.get('path') || '/';
    },

    _getQuery: html5 ? function () {
        return location.search.substring(1);
    } : function () {
        return this._history.get('query') || '';
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

            state = {path: url || '/'};

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
    onHistoryChange: function (e) {
        var self = this;

        // We need to yield control to the UI thread to allow the browser to
        // update document.location before we dispatch.
        setTimeout(function () {
            self._dispatch(self._getPath(), e.newVal);
        }, 1);
    }
}, {
    NAME: 'controller'
});
