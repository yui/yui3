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

    /**
    Base path or URL from which all routes should be evaluated.

    For example, if your controller is running on a page at
    `http://example.com/myapp/` and you add a route with the path `/`, your
    route will never execute, because the path will always be preceded by
    `/myapp`. Setting _base_ to `/myapp` would cause all routes to be evaluated
    relative to that base path, so the `/` route would then execute.

    This property may be overridden in a subclass, set after instantiation, or
    passed as a config attribute when instantiating a `Y.Controller`-based
    class.

    @property base
    @type String
    @default `''`
    **/
    base: '',

    /**
    Array of route objects specifying routes to be created at instantiation
    time.

    Each item in the array must be an object with the following properties:

      * `path`: String or regex representing the path to match. See the docs for
        the `route()` method for more details.
      * `callback`: Function or a string representing the name of a function on
        this controller instance that should be called when the route is
        triggered. See the docs for the `route()` method for more details.

    This property may be overridden in a subclass or passed as a config
    attribute when instantiating a `Y.Controller`-based class, but setting it
    after instantiation will have no effect (use the `route()` method instead).

    If routes are passed at instantiation time, they will override any routes
    set on the prototype.

    @property routes
    @type Object[]
    @default `[]`
    **/
    routes: [],

    // -- Protected Properties -------------------------------------------------

    /**
    Regex used to match parameter placeholders in route paths.

    Subpattern captures:

      1. Parameter prefix character. Either a `:` for subpath parameters that
         should only match a single level of a path, or `*` for splat parameters
         that should match any number of path levels.
      2. Parameter name.

    @property _regexPathParam
    @type RegExp
    @protected
    **/
    _regexPathParam: /([:*])([\w\d-]+)/g,

    /**
    Regex that matches and captures the query portion of a URL, minus the
    preceding `?` character, and discarding the hash portion of the URL if any.

    @property _regexUrlQuery
    @type RegExp
    @protected
    **/
    _regexUrlQuery: /\?([^#]*).*$/,

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
        this._history = html5 ? new Y.HistoryHTML5({force: true}) : new Y.HistoryHash();
        this._history.after('change', this._afterHistoryChange, this);

        // Handle the initial route.
        this._dispatch(this._getPath(), this._getState());
    },

    destructor: function () {
        this._history.detachAll();
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Returns an array of route objects that match the specified URL path.

    This method is called internally to determine which routes match the current
    path whenever the URL changes. You may override it if you want to customize
    the route matching logic, although this usually shouldn't be necessary.

    Each returned route object has the following properties:

      * `callback`: A function or a string representing the name of a function
        this controller that should be executed when the route is triggered.
      * `keys`: An array of strings representing the named parameters defined in
        the route's path specification, if any.
      * `path`: The route's path specification, which may be either a string or
        a regex.
      * `regex`: A regular expression version of the route's path specification.
        This regex is used to determine whether the route matches a given path.

    @example
        controller.route('/foo', function () {});
        controller.match('/foo');
        // => [{callback: ..., keys: [], path: '/foo', regex: ...}]

    @method match
    @param {String} path URL path to match.
    @return {Object[]} Array of route objects that match the specified path.
    **/
    match: function (path) {
        return YArray.filter(this._routes, function (route) {
            return path.search(route.regex) > -1;
        });
    },

    /**
    Replaces the current browser history entry with a new one, and dispatches to
    the first matching route handler, if any.

    Behind the scenes, this method uses HTML5 `pushState()` in browsers that
    support it (or the location hash in older browsers and IE) to change the
    URL and create a history entry for the given state.

    The specified URL must share the same origin (i.e., protocol, host, and
    port) as the current page, or an error will occur.

    @example
        // Starting URL: http://example.com/

        controller.replace('/bar/', {bar: true});
        // New URL: http://example.com/bar/

        controller.replace('/');
        // New URL: http://example.com/

    @method replace
    @param {String} [url] URL to set. May be relative or absolute, but if a
      `base` property is specified, this URL must be relative to that property.
      If not specified, the page's current URL will be used.
    @param {Object} [state] State object to associate with this history entry.
      May be any object that can be serialized to JSON.
    @chainable
    @see save()
    **/
    replace: function (url, state, title) {
        return this._save(url, state, title, true);
    },

    /**
    Adds a route handler for the specified URL _path_.

    The _path_ parameter may be either a string or a regular expression. If it's
    a string, it may contain named parameters: `:param` will match any single
    part of a URL path (not including `/` characters), and `*param` will match
    any number of parts of a URL path (including `/` characters). These named
    parameters will be made available as keys on the `req.params` object that's
    passed to route handlers.

    If the _path_ parameter is a regex, all pattern matches will be made
    available as numbered keys on `req.params`, starting with `0` for the full
    match, then `1` for the first subpattern match, and so on.

    Here's a set of sample routes along with URL paths that they match:

      * Route: `/photos/:tag/:page`
        * URL: `/photos/kittens/1`, params: `{tag: 'kittens', 'page': '1'}`
        * URL: `/photos/puppies/2`, params: `{tag: 'puppies', 'page': '2'}`

      * Route: `/file/*path`
        * URL: `/file/foo/bar/baz.txt`, params: `{path: 'foo/bar/baz.txt'}`
        * URL: `/file/foo`, params: `{path: 'foo'}`

    If multiple route handlers match a given URL, they will be executed in the
    order they were added. The first route that was added will be the first to
    be executed.

    @example
        controller.route('/photos/:tag/:page', function (req, next) {
          Y.log('Current tag: ' + req.params.tag);
          Y.log('Current page number: ' + req.params.page);
        });

    @method route
    @param {String|RegExp} path Path to match. May be a string or a regular
      expression.
    @param {Function|String} callback Callback function to call whenever this
        route is triggered. If specified as a string, the named function will be
        called on this controller instance.
      @param {Object} callback.req Request object containing information about
          the request. It contains the following properties.
        @param {Object} callback.req.params Captured parameters matched by the
          route path specification. If a string path was used and contained
          named parameters, then this will be a key/value hash mapping parameter
          names to their matched values. If a regex path was used, the keys will
          be numbered subpattern matches starting at `'0'` for the full match,
          then `'1'` for the first subpattern match, and so on.
        @param {String} callback.req.path The current URL path.
        @param {Object} callback.req.query Query hash representing the URL query
          string, if any. Parameter names are keys, and are mapped to parameter
          values.
        @param {Object} callback.req.state State object associated with this
          URL, if any.
      @param {Function} callback.next Callback to pass control to the next
        matching route. If you don't call this function, then no further route
        handlers will be executed, even if there are more that match. If you do
        call this function, then the next matching route handler (if any) will
        be called, and will receive the same `req` object that was passed to
        this route (so you can use the request object to pass data along to
        subsequent routes).
    @chainable
    **/
    route: function (path, callback) {
        var keys = [];

        this._routes.push({
            callback: callback,
            keys    : keys,
            path    : path,
            regex   : this._getRegex(path, keys)
        });

        return this;
    },

    /**
    Saves a new browser history entry and dispatches to the first matching route
    handler, if any.

    Behind the scenes, this method uses HTML5 `pushState()` in browsers that
    support it (or the location hash in older browsers and IE) to change the
    URL and create a history entry for the given state.

    The specified URL must share the same origin (i.e., protocol, host, and
    port) as the current page, or an error will occur.

    @example
        // Starting URL: http://example.com/

        controller.save('/bar/', {bar: true});
        // New URL: http://example.com/bar/

        controller.save('/');
        // New URL: http://example.com/

    @method save
    @param {String} [url] URL to set. May be relative or absolute, but if a
      `base` property is specified, this URL must be relative to that property.
      If not specified, the page's current URL will be used.
    @param {Object} [state] State object to associate with this history entry.
      May be any object that can be serialized to JSON.
    @chainable
    @see replace()
    **/
    save: function (url, state, title) {
        return this._save(url, state, title);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Wrapper around `decodeURIComponent` that also converts `+` chars into
    spaces.

    @method _decode
    @param {String} string String to decode.
    @return {String} Decoded string.
    @protected
    **/
    _decode: function (string) {
        return decodeURIComponent(string.replace(/\+/g, ' '));
    },

    /**
    Dispatches to the first route handler that matches the specified _path_.

    @method _dispatch
    @param {String} path URL path.
    @param {Object} state State to pass to route handlers.
    @protected
    **/
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

    /**
    Gets the current route path.

    @method _getPath
    @return {String} Current route path.
    @protected
    **/
    _getPath: (function () {
        var self = this;

        function removeBase(path) {
            var base = self.base;

            if (base && path.indexOf(base) === 0) {
                path = path.substring(base.length);
            }

            return path;
        }

        return html5 ? function () {
            return removeBase(location.pathname);
        } : function () {
            return this._history.get('path') || removeBase(location.pathname);
        };
    }()),

    /**
    Gets the current route query string.

    @method _getQuery
    @return {String} Current route query string.
    @protected
    **/
    _getQuery: html5 ? function () {
        return location.search.substring(1);
    } : function () {
        return this._history.get('query') || location.search.substring(1);
    },

    /**
    Creates a regular expression from the specified route specification. If
    _path_ is already a regex, it will be returned unmodified.

    @method _getRegex
    @param {String|RegExp} path Route path specification.
    @param {Array} keys Array reference to which route parameter names will be
      added.
    @return {RegExp} Route regex.
    @protected
    **/
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

    /**
    Gets a request object that can be passed to a route handler.

    @method _getRequest
    @param {String} path Current path being dispatched.
    @param {Object} state Current state.
    @return {Object} Request object.
    @protected
    **/
    _getRequest: function (path, state) {
        return {
            path : path,
            query: this._parseQuery(this._getQuery()),
            state: state
        };
    },

    /**
    Gets the current state, if any.

    @method _getState
    @return {Object} Current state.
    @protected
    **/
    _getState: html5 ? function () {
        return this._history.get();
    } : function () {
        var jsonState = this._history.get('state');
        return jsonState ? Y.JSON.parse(jsonState) : {};
    },

    /**
    Parses a URL query string into a key/value hash. If `Y.QueryString.parse` is
    available, this method will be an alias to that.

    @method _parseQuery
    @param {String} query Query string to parse.
    @return {Object} Hash of key/value pairs for query parameters.
    @protected
    **/
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

    /**
    Saves a history entry using either `pushState()` or the location hash.

    @method _save
    @param {String} [url] URL for the history entry.
    @param {Object} [state] State object associated with the history entry.
    @param {String} [title] Page title associated with the history entry. This
      is currently undocumented in the public `replace` and `save` methods,
      since browsers don't currently do anything with it.
    @param {Boolean} [replace=false] If `true`, the current history entry will
      be replaced instead of a new one being added.
    @chainable
    @protected
    **/
    _save: function (url, state, title, replace) {
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

    /**
    Handles `history:change` events.

    @method _afterHistoryChange
    @param {EventFacade} e
    @protected
    **/
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
