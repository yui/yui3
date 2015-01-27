/**
Provides URL-based routing using HTML5 `pushState()` or the location hash.

@module app
@submodule router
@since 3.4.0
**/

var HistoryHash = Y.HistoryHash,
    QS          = Y.QueryString,
    YArray      = Y.Array,
    YLang       = Y.Lang,
    YObject     = Y.Object,

    win = Y.config.win,

    // Holds all the active router instances. This supports the static
    // `dispatch()` method which causes all routers to dispatch.
    instances = [],

    // We have to queue up pushState calls to avoid race conditions, since the
    // popstate event doesn't actually provide any info on what URL it's
    // associated with.
    saveQueue = [],

    /**
    Fired when the router is ready to begin dispatching to route handlers.

    You shouldn't need to wait for this event unless you plan to implement some
    kind of custom dispatching logic. It's used internally in order to avoid
    dispatching to an initial route if a browser history change occurs first.

    @event ready
    @param {Boolean} dispatched `true` if routes have already been dispatched
      (most likely due to a history change).
    @fireOnce
    **/
    EVT_READY = 'ready';

/**
Provides URL-based routing using HTML5 `pushState()` or the location hash.

This makes it easy to wire up route handlers for different application states
while providing full back/forward navigation support and bookmarkable, shareable
URLs.

@class Router
@param {Object} [config] Config properties.
    @param {Boolean} [config.html5] Overrides the default capability detection
        and forces this router to use (`true`) or not use (`false`) HTML5
        history.
    @param {String} [config.root=''] Root path from which all routes should be
        evaluated.
    @param {Array} [config.routes=[]] Array of route definition objects.
@constructor
@extends Base
@since 3.4.0
**/
function Router() {
    Router.superclass.constructor.apply(this, arguments);
}

Y.Router = Y.extend(Router, Y.Base, {
    // -- Protected Properties -------------------------------------------------

    /**
    Whether or not `_dispatch()` has been called since this router was
    instantiated.

    @property _dispatched
    @type Boolean
    @default undefined
    @protected
    **/

    /**
    Whether or not we're currently in the process of dispatching to routes.

    @property _dispatching
    @type Boolean
    @default undefined
    @protected
    **/

    /**
    History event handle for the `history:change` or `hashchange` event
    subscription.

    @property _historyEvents
    @type EventHandle
    @protected
    **/

    /**
    Cached copy of the `html5` attribute for internal use.

    @property _html5
    @type Boolean
    @protected
    **/

    /**
    Map which holds the registered param handlers in the form:
    `name` -> RegExp | Function.

    @property _params
    @type Object
    @protected
    @since 3.12.0
    **/

    /**
    Whether or not the `ready` event has fired yet.

    @property _ready
    @type Boolean
    @default undefined
    @protected
    **/

    /**
    Regex used to break up a URL string around the URL's path.

    Subpattern captures:

      1. Origin, everything before the URL's path-part.
      2. The URL's path-part.
      3. The URL's query.
      4. The URL's hash fragment.

    @property _regexURL
    @type RegExp
    @protected
    @since 3.5.0
    **/
    _regexURL: /^((?:[^\/#?:]+:\/\/|\/\/)[^\/]*)?([^?#]*)(\?[^#]*)?(#.*)?$/,

    /**
    Regex used to match parameter placeholders in route paths.

    Subpattern captures:

      1. Parameter prefix character. Either a `:` for subpath parameters that
         should only match a single level of a path, or `*` for splat parameters
         that should match any number of path levels.

      2. Parameter name, if specified, otherwise it is a wildcard match.

    @property _regexPathParam
    @type RegExp
    @protected
    **/
    _regexPathParam: /([:*])([\w\-]+)?/g,

    /**
    Regex that matches and captures the query portion of a URL, minus the
    preceding `?` character, and discarding the hash portion of the URL if any.

    @property _regexUrlQuery
    @type RegExp
    @protected
    **/
    _regexUrlQuery: /\?([^#]*).*$/,

    /**
    Regex that matches everything before the path portion of a URL (the origin).
    This will be used to strip this part of the URL from a string when we
    only want the path.

    @property _regexUrlOrigin
    @type RegExp
    @protected
    **/
    _regexUrlOrigin: /^(?:[^\/#?:]+:\/\/|\/\/)[^\/]*/,

    /**
    Collection of registered routes.

    @property _routes
    @type Array
    @protected
    **/

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        var self = this;

        self._html5  = self.get('html5');
        self._params = {};
        self._routes = [];
        self._url    = self._getURL();

        // Necessary because setters don't run on init.
        self._setRoutes(config && config.routes ? config.routes :
                self.get('routes'));

        // Set up a history instance or hashchange listener.
        if (self._html5) {
            self._history       = new Y.HistoryHTML5({force: true});
            self._historyEvents =
                    Y.after('history:change', self._afterHistoryChange, self);
        } else {
            self._historyEvents =
                    Y.on('hashchange', self._afterHistoryChange, win, self);
        }

        // Fire a `ready` event once we're ready to route. We wait first for all
        // subclass initializers to finish, then for window.onload, and then an
        // additional 20ms to allow the browser to fire a useless initial
        // `popstate` event if it wants to (and Chrome always wants to).
        self.publish(EVT_READY, {
            defaultFn  : self._defReadyFn,
            fireOnce   : true,
            preventable: false
        });

        self.once('initializedChange', function () {
            Y.once('load', function () {
                setTimeout(function () {
                    self.fire(EVT_READY, {dispatched: !!self._dispatched});
                }, 20);
            });
        });

        // Store this router in the collection of all active router instances.
        instances.push(this);
    },

    destructor: function () {
        var instanceIndex = YArray.indexOf(instances, this);

        // Remove this router from the collection of active router instances.
        if (instanceIndex > -1) {
            instances.splice(instanceIndex, 1);
        }

        if (this._historyEvents) {
            this._historyEvents.detach();
        }
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Dispatches to the first route handler that matches the current URL, if any.

    If `dispatch()` is called before the `ready` event has fired, it will
    automatically wait for the `ready` event before dispatching. Otherwise it
    will dispatch immediately.

    @method dispatch
    @chainable
    **/
    dispatch: function () {
        this.once(EVT_READY, function () {
            var req, res;

            this._ready = true;

            if (!this.upgrade()) {
                req = this._getRequest('dispatch');
                res = this._getResponse(req);

                this._dispatch(req, res);
            }
        });

        return this;
    },

    /**
    Gets the current route path.

    @method getPath
    @return {String} Current route path.
    **/
    getPath: function () {
        return this._getPath();
    },

    /**
    Returns `true` if this router has at least one route that matches the
    specified URL, `false` otherwise.

    This method enforces the same-origin security constraint on the specified
    `url`; any URL which is not from the same origin as the current URL will
    always return `false`.

    @method hasRoute
    @param {String} url URL to match.
    @return {Boolean} `true` if there's at least one matching route, `false`
      otherwise.
    **/
    hasRoute: function (url) {
        var path;

        if (!this._hasSameOrigin(url)) {
            return false;
        }

        if (!this._html5) {
            url = this._upgradeURL(url);
        }

        // Get just the path portion of the specified `url`.
        path = this.removeQuery(url.replace(this._regexUrlOrigin, ''));

        return !!this.match(path).length;
    },

    /**
    Returns an array of route objects that match the specified URL path.

    If this router has a `root`, then the specified `path` _must_ be
    semantically within the `root` path to match any routes.

    This method is called internally to determine which routes match the current
    path whenever the URL changes. You may override it if you want to customize
    the route matching logic, although this usually shouldn't be necessary.

    Each returned route object has the following properties:

      * `callback`: A function or a string representing the name of a function
        this router that should be executed when the route is triggered.

      * `keys`: An array of strings representing the named parameters defined in
        the route's path specification, if any.

      * `path`: The route's path specification, which may be either a string or
        a regex.

      * `regex`: A regular expression version of the route's path specification.
        This regex is used to determine whether the route matches a given path.

    @example
        router.route('/foo', function () {});
        router.match('/foo');
        // => [{callback: ..., keys: [], path: '/foo', regex: ...}]

    @method match
    @param {String} path URL path to match. This should be an absolute path that
        starts with a slash: "/".
    @return {Object[]} Array of route objects that match the specified path.
    **/
    match: function (path) {
        var root = this.get('root');

        if (root) {
            // The `path` must be semantically within this router's `root` path
            // or mount point, if it's not then no routes should be considered a
            // match.
            if (!this._pathHasRoot(root, path)) {
                return [];
            }

            // Remove this router's `root` from the `path` before checking the
            // routes for any matches.
            path = this.removeRoot(path);
        }

        return YArray.filter(this._routes, function (route) {
            return path.search(route.regex) > -1;
        });
    },

    /**
    Adds a handler for a route param specified by _name_.

    Param handlers can be registered via this method and are used to
    validate/format values of named params in routes before dispatching to the
    route's handler functions. Using param handlers allows routes to defined
    using string paths which allows for `req.params` to use named params, but
    still applying extra validation or formatting to the param values parsed
    from the URL.

    If a param handler regex or function returns a value of `false`, `null`,
    `undefined`, or `NaN`, the current route will not match and be skipped. All
    other return values will be used in place of the original param value parsed
    from the URL.

    @example
        router.param('postId', function (value) {
            return parseInt(value, 10);
        });

        router.param('username', /^\w+$/);

        router.route('/posts/:postId', function (req) {
            Y.log('Post: ' + req.params.id);
        });

        router.route('/users/:username', function (req) {
            // `req.params.username` is an array because the result of calling
            // `exec()` on the regex is assigned as the param's value.
            Y.log('User: ' + req.params.username[0]);
        });

        router.route('*', function () {
            Y.log('Catch-all no routes matched!');
        });

        // URLs which match routes:
        router.save('/posts/1');     // => "Post: 1"
        router.save('/users/ericf'); // => "User: ericf"

        // URLs which do not match routes because params fail validation:
        router.save('/posts/a');            // => "Catch-all no routes matched!"
        router.save('/users/ericf,rgrove'); // => "Catch-all no routes matched!"

    @method param
    @param {String} name Name of the param used in route paths.
    @param {Function|RegExp} handler Function to invoke or regular expression to
        `exec()` during route dispatching whose return value is used as the new
        param value. Values of `false`, `null`, `undefined`, or `NaN` will cause
        the current route to not match and be skipped. When a function is
        specified, it will be invoked in the context of this instance with the
        following parameters:
      @param {String} handler.value The current param value parsed from the URL.
      @param {String} handler.name The name of the param.
    @chainable
    @since 3.12.0
    **/
    param: function (name, handler) {
        this._params[name] = handler;
        return this;
    },

    /**
    Removes the `root` URL from the front of _url_ (if it's there) and returns
    the result. The returned path will always have a leading `/`.

    @method removeRoot
    @param {String} url URL.
    @return {String} Rootless path.
    **/
    removeRoot: function (url) {
        var root = this.get('root'),
            path;

        // Strip out the non-path part of the URL, if any (e.g.
        // "http://foo.com"), so that we're left with just the path.
        url = url.replace(this._regexUrlOrigin, '');

        // Return the host-less URL if there's no `root` path to further remove.
        if (!root) {
            return url;
        }

        path = this.removeQuery(url);

        // Remove the `root` from the `url` if it's the same or its path is
        // semantically within the root path.
        if (path === root || this._pathHasRoot(root, path)) {
            url = url.substring(root.length);
        }

        return url.charAt(0) === '/' ? url : '/' + url;
    },

    /**
    Removes a query string from the end of the _url_ (if one exists) and returns
    the result.

    @method removeQuery
    @param {String} url URL.
    @return {String} Queryless path.
    **/
    removeQuery: function (url) {
        return url.replace(/\?.*$/, '');
    },

    /**
    Replaces the current browser history entry with a new one, and dispatches to
    the first matching route handler, if any.

    Behind the scenes, this method uses HTML5 `pushState()` in browsers that
    support it (or the location hash in older browsers and IE) to change the
    URL.

    The specified URL must share the same origin (i.e., protocol, host, and
    port) as the current page, or an error will occur.

    @example
        // Starting URL: http://example.com/

        router.replace('/path/');
        // New URL: http://example.com/path/

        router.replace('/path?foo=bar');
        // New URL: http://example.com/path?foo=bar

        router.replace('/');
        // New URL: http://example.com/

    @method replace
    @param {String} [url] URL to set. This URL needs to be of the same origin as
      the current URL. This can be a URL relative to the router's `root`
      attribute. If no URL is specified, the page's current URL will be used.
    @chainable
    @see save()
    **/
    replace: function (url) {
        return this._queue(url, true);
    },

    /**
    Adds a route handler for the specified `route`.

    The `route` parameter may be a string or regular expression to represent a
    URL path, or a route object. If it's a string (which is most common), it may
    contain named parameters: `:param` will match any single part of a URL path
    (not including `/` characters), and `*param` will match any number of parts
    of a URL path (including `/` characters). These named parameters will be
    made available as keys on the `req.params` object that's passed to route
    handlers.

    If the `route` parameter is a regex, all pattern matches will be made
    available as numbered keys on `req.params`, starting with `0` for the full
    match, then `1` for the first subpattern match, and so on.

    Alternatively, an object can be provided to represent the route and it may
    contain a `path` property which is a string or regular expression which
    causes the route to be process as described above. If the route object
    already contains a `regex` or `regexp` property, the route will be
    considered fully-processed and will be associated with any `callacks`
    specified on the object and those specified as parameters to this method.
    **Note:** Any additional data contained on the route object will be
    preserved.

    Here's a set of sample routes along with URL paths that they match:

      * Route: `/photos/:tag/:page`
        * URL: `/photos/kittens/1`, params: `{tag: 'kittens', page: '1'}`
        * URL: `/photos/puppies/2`, params: `{tag: 'puppies', page: '2'}`

      * Route: `/file/*path`
        * URL: `/file/foo/bar/baz.txt`, params: `{path: 'foo/bar/baz.txt'}`
        * URL: `/file/foo`, params: `{path: 'foo'}`

    **Middleware**: Routes also support an arbitrary number of callback
    functions. This allows you to easily reuse parts of your route-handling code
    with different route. This method is liberal in how it processes the
    specified `callbacks`, you can specify them as separate arguments, or as
    arrays, or both.

    If multiple route match a given URL, they will be executed in the order they
    were added. The first route that was added will be the first to be executed.

    **Passing Control**: Invoking the `next()` function within a route callback
    will pass control to the next callback function (if any) or route handler
    (if any). If a value is passed to `next()`, it's assumed to be an error,
    therefore stopping the dispatch chain, unless that value is: `"route"`,
    which is special case and dispatching will skip to the next route handler.
    This allows middleware to skip any remaining middleware for a particular
    route.

    @example
        router.route('/photos/:tag/:page', function (req, res, next) {
            Y.log('Current tag: ' + req.params.tag);
            Y.log('Current page number: ' + req.params.page);
        });

        // Using middleware.

        router.findUser = function (req, res, next) {
            req.user = this.get('users').findById(req.params.user);
            next();
        };

        router.route('/users/:user', 'findUser', function (req, res, next) {
            // The `findUser` middleware puts the `user` object on the `req`.
            Y.log('Current user:' req.user.get('name'));
        });

    @method route
    @param {String|RegExp|Object} route Route to match. May be a string or a
      regular expression, or a route object.
    @param {Array|Function|String} callbacks* Callback functions to call
        whenever this route is triggered. These can be specified as separate
        arguments, or in arrays, or both. If a callback is specified as a
        string, the named function will be called on this router instance.

      @param {Object} callbacks.req Request object containing information about
          the request. It contains the following properties.

        @param {Array|Object} callbacks.req.params Captured parameters matched
          by the route path specification. If a string path was used and
          contained named parameters, then this will be a key/value hash mapping
          parameter names to their matched values. If a regex path was used,
          this will be an array of subpattern matches starting at index 0 for
          the full match, then 1 for the first subpattern match, and so on.
        @param {String} callbacks.req.path The current URL path.
        @param {Number} callbacks.req.pendingCallbacks Number of remaining
          callbacks the route handler has after this one in the dispatch chain.
        @param {Number} callbacks.req.pendingRoutes Number of matching routes
          after this one in the dispatch chain.
        @param {Object} callbacks.req.query Query hash representing the URL
          query string, if any. Parameter names are keys, and are mapped to
          parameter values.
        @param {Object} callbacks.req.route Reference to the current route
          object whose callbacks are being dispatched.
        @param {Object} callbacks.req.router Reference to this router instance.
        @param {String} callbacks.req.src What initiated the dispatch. In an
          HTML5 browser, when the back/forward buttons are used, this property
          will have a value of "popstate". When the `dispath()` method is
          called, the `src` will be `"dispatch"`.
        @param {String} callbacks.req.url The full URL.

      @param {Object} callbacks.res Response object containing methods and
          information that relate to responding to a request. It contains the
          following properties.
        @param {Object} callbacks.res.req Reference to the request object.

      @param {Function} callbacks.next Function to pass control to the next
          callback or the next matching route if no more callbacks (middleware)
          exist for the current route handler. If you don't call this function,
          then no further callbacks or route handlers will be executed, even if
          there are more that match. If you do call this function, then the next
          callback (if any) or matching route handler (if any) will be called.
          All of these functions will receive the same `req` and `res` objects
          that were passed to this route (so you can use these objects to pass
          data along to subsequent callbacks and routes).
        @param {String} [callbacks.next.err] Optional error which will stop the
          dispatch chaining for this `req`, unless the value is `"route"`, which
          is special cased to jump skip past any callbacks for the current route
          and pass control the next route handler.
    @chainable
    **/
    route: function (route, callbacks) {
        // Grab callback functions from var-args.
        callbacks = YArray(arguments, 1, true);

        var keys, regex;

        // Supports both the `route(path, callbacks)` and `route(config)` call
        // signatures, allowing for fully-processed route configs to be passed.
        if (typeof route === 'string' || YLang.isRegExp(route)) {
            // Flatten `callbacks` into a single dimension array.
            callbacks = YArray.flatten(callbacks);

            keys  = [];
            regex = this._getRegex(route, keys);

            route = {
                callbacks: callbacks,
                keys     : keys,
                path     : route,
                regex    : regex
            };
        } else {
            // Look for any configured `route.callbacks` and fallback to
            // `route.callback` for back-compat, append var-arg `callbacks`,
            // then flatten the entire collection to a single dimension array.
            callbacks = YArray.flatten(
                [route.callbacks || route.callback || []].concat(callbacks)
            );

            // Check for previously generated regex, also fallback to `regexp`
            // for greater interop.
            keys  = route.keys;
            regex = route.regex || route.regexp;

            // Generates the route's regex if it doesn't already have one.
            if (!regex) {
                keys  = [];
                regex = this._getRegex(route.path, keys);
            }

            // Merge specified `route` config object with processed data.
            route = Y.merge(route, {
                callbacks: callbacks,
                keys     : keys,
                path     : route.path || regex,
                regex    : regex
            });
        }

        this._routes.push(route);
        return this;
    },

    /**
    Saves a new browser history entry and dispatches to the first matching route
    handler, if any.

    Behind the scenes, this method uses HTML5 `pushState()` in browsers that
    support it (or the location hash in older browsers and IE) to change the
    URL and create a history entry.

    The specified URL must share the same origin (i.e., protocol, host, and
    port) as the current page, or an error will occur.

    @example
        // Starting URL: http://example.com/

        router.save('/path/');
        // New URL: http://example.com/path/

        router.save('/path?foo=bar');
        // New URL: http://example.com/path?foo=bar

        router.save('/');
        // New URL: http://example.com/

    @method save
    @param {String} [url] URL to set. This URL needs to be of the same origin as
      the current URL. This can be a URL relative to the router's `root`
      attribute. If no URL is specified, the page's current URL will be used.
    @chainable
    @see replace()
    **/
    save: function (url) {
        return this._queue(url);
    },

    /**
    Upgrades a hash-based URL to an HTML5 URL if necessary. In non-HTML5
    browsers, this method is a noop.

    @method upgrade
    @return {Boolean} `true` if the URL was upgraded, `false` otherwise.
    **/
    upgrade: function () {
        if (!this._html5) {
            return false;
        }

        // Get the resolve hash path.
        var hashPath = this._getHashPath();

        if (hashPath) {
            // This is an HTML5 browser and we have a hash-based path in the
            // URL, so we need to upgrade the URL to a non-hash URL. This
            // will trigger a `history:change` event, which will in turn
            // trigger a dispatch.
            this.once(EVT_READY, function () {
                this.replace(hashPath);
            });

            return true;
        }

        return false;
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
    Shifts the topmost `_save()` call off the queue and executes it. Does
    nothing if the queue is empty.

    @method _dequeue
    @chainable
    @see _queue
    @protected
    **/
    _dequeue: function () {
        var self = this,
            fn;

        // If window.onload hasn't yet fired, wait until it has before
        // dequeueing. This will ensure that we don't call pushState() before an
        // initial popstate event has fired.
        if (!YUI.Env.windowLoaded) {
            Y.once('load', function () {
                self._dequeue();
            });

            return this;
        }

        fn = saveQueue.shift();
        return fn ? fn() : this;
    },

    /**
    Dispatches to the first route handler that matches the specified _path_.

    If called before the `ready` event has fired, the dispatch will be aborted.
    This ensures normalized behavior between Chrome (which fires a `popstate`
    event on every pageview) and other browsers (which do not).

    @method _dispatch
    @param {object} req Request object.
    @param {String} res Response object.
    @chainable
    @protected
    **/
    _dispatch: function (req, res) {
        var self      = this,
            decode    = self._decode,
            routes    = self.match(req.path),
            callbacks = [],
            matches, paramsMatch, routePath;

        self._dispatching = self._dispatched = true;

        if (!routes || !routes.length) {
            self._dispatching = false;
            return self;
        }

        routePath = self.removeRoot(req.path);

        function next(err) {
            var callback, name, route;

            if (err) {
                // Special case "route" to skip to the next route handler
                // avoiding any additional callbacks for the current route.
                if (err === 'route') {
                    callbacks = [];
                    next();
                } else {
                    Y.error(err);
                }

            } else if ((callback = callbacks.shift())) {
                if (typeof callback === 'string') {
                    name     = callback;
                    callback = self[name];

                    if (!callback) {
                        Y.error('Router: Callback not found: ' + name, null, 'router');
                    }
                }

                // Allow access to the number of remaining callbacks for the
                // route.
                req.pendingCallbacks = callbacks.length;

                callback.call(self, req, res, next);

            } else if ((route = routes.shift())) {
                // Make a copy of this route's `callbacks` so the original array
                // is preserved.
                callbacks = route.callbacks.concat();

                // Decode each of the path matches so that the any URL-encoded
                // path segments are decoded in the `req.params` object.
                matches = YArray.map(route.regex.exec(routePath) || [],
                        function (match) {

                    // Decode matches, or coerce `undefined` matches to an empty
                    // string to match expectations of working with `req.params`
                    // in the content of route dispatching, and normalize
                    // browser differences in their handling of regex NPCGs:
                    // https://github.com/yui/yui3/issues/1076
                    return (match && decode(match)) || '';
                });

                paramsMatch = true;

                // Use named keys for parameter names if the route path contains
                // named keys. Otherwise, use numerical match indices.
                if (matches.length === route.keys.length + 1) {
                    matches    = matches.slice(1);
                    req.params = YArray.hash(route.keys, matches);

                    paramsMatch = YArray.every(route.keys, function (key, i) {
                        var paramHandler = self._params[key],
                            value        = matches[i];

                        if (paramHandler && value && typeof value === 'string') {
                            // Check if `paramHandler` is a RegExp, becuase this
                            // is true in Android 2.3 and other browsers!
                            // `typeof /.*/ === 'function'`
                            value = YLang.isRegExp(paramHandler) ?
                                    paramHandler.exec(value) :
                                    paramHandler.call(self, value, key);

                            if (value !== false && YLang.isValue(value)) {
                                req.params[key] = value;
                                return true;
                            }

                            return false;
                        }

                        return true;
                    });
                } else {
                    req.params = matches.concat();
                }

                // Allow access to current route and the number of remaining
                // routes for this request.
                req.route         = route;
                req.pendingRoutes = routes.length;

                // Execute this route's `callbacks` or skip this route because
                // some of the param regexps don't match.
                if (paramsMatch) {
                    next();
                } else {
                    next('route');
                }
            }
        }

        next();

        self._dispatching = false;
        return self._dequeue();
    },

    /**
    Returns the resolved path from the hash fragment, or an empty string if the
    hash is not path-like.

    @method _getHashPath
    @param {String} [hash] Hash fragment to resolve into a path. By default this
        will be the hash from the current URL.
    @return {String} Current hash path, or an empty string if the hash is empty.
    @protected
    **/
    _getHashPath: function (hash) {
        hash || (hash = HistoryHash.getHash());

        // Make sure the `hash` is path-like.
        if (hash && hash.charAt(0) === '/') {
            return this._joinURL(hash);
        }

        return '';
    },

    /**
    Gets the location origin (i.e., protocol, host, and port) as a URL.

    @example
        http://example.com

    @method _getOrigin
    @return {String} Location origin (i.e., protocol, host, and port).
    @protected
    **/
    _getOrigin: function () {
        var location = Y.getLocation();
        return location.origin || (location.protocol + '//' + location.host);
    },

    /**
    Getter for the `params` attribute.

    @method _getParams
    @return {Object} Mapping of param handlers: `name` -> RegExp | Function.
    @protected
    @since 3.12.0
    **/
    _getParams: function () {
        return Y.merge(this._params);
    },

    /**
    Gets the current route path.

    @method _getPath
    @return {String} Current route path.
    @protected
    **/
    _getPath: function () {
        var path = (!this._html5 && this._getHashPath()) ||
                Y.getLocation().pathname;

        return this.removeQuery(path);
    },

    /**
    Returns the current path root after popping off the last path segment,
    making it useful for resolving other URL paths against.

    The path root will always begin and end with a '/'.

    @method _getPathRoot
    @return {String} The URL's path root.
    @protected
    @since 3.5.0
    **/
    _getPathRoot: function () {
        var slash = '/',
            path  = Y.getLocation().pathname,
            segments;

        if (path.charAt(path.length - 1) === slash) {
            return path;
        }

        segments = path.split(slash);
        segments.pop();

        return segments.join(slash) + slash;
    },

    /**
    Gets the current route query string.

    @method _getQuery
    @return {String} Current route query string.
    @protected
    **/
    _getQuery: function () {
        var location = Y.getLocation(),
            hash, matches;

        if (this._html5) {
            return location.search.substring(1);
        }

        hash    = HistoryHash.getHash();
        matches = hash.match(this._regexUrlQuery);

        return hash && matches ? matches[1] : location.search.substring(1);
    },

    /**
    Creates a regular expression from the given route specification. If _path_
    is already a regex, it will be returned unmodified.

    @method _getRegex
    @param {String|RegExp} path Route path specification.
    @param {Array} keys Array reference to which route parameter names will be
      added.
    @return {RegExp} Route regex.
    @protected
    **/
    _getRegex: function (path, keys) {
        if (YLang.isRegExp(path)) {
            return path;
        }

        // Special case for catchall paths.
        if (path === '*') {
            return (/.*/);
        }

        path = path.replace(this._regexPathParam, function (match, operator, key) {
            // Only `*` operators are supported for key-less matches to allowing
            // in-path wildcards like: '/foo/*'.
            if (!key) {
                return operator === '*' ? '.*' : match;
            }

            keys.push(key);
            return operator === '*' ? '(.*?)' : '([^/#?]*)';
        });

        return new RegExp('^' + path + '$');
    },

    /**
    Gets a request object that can be passed to a route handler.

    @method _getRequest
    @param {String} src What initiated the URL change and need for the request.
    @return {Object} Request object.
    @protected
    **/
    _getRequest: function (src) {
        return {
            path  : this._getPath(),
            query : this._parseQuery(this._getQuery()),
            url   : this._getURL(),
            router: this,
            src   : src
        };
    },

    /**
    Gets a response object that can be passed to a route handler.

    @method _getResponse
    @param {Object} req Request object.
    @return {Object} Response Object.
    @protected
    **/
    _getResponse: function (req) {
        return {req: req};
    },

    /**
    Getter for the `routes` attribute.

    @method _getRoutes
    @return {Object[]} Array of route objects.
    @protected
    **/
    _getRoutes: function () {
        return this._routes.concat();
    },

    /**
    Gets the current full URL.

    @method _getURL
    @return {String} URL.
    @protected
    **/
    _getURL: function () {
        var url = Y.getLocation().toString();

        if (!this._html5) {
            url = this._upgradeURL(url);
        }

        return url;
    },

    /**
    Returns `true` when the specified `url` is from the same origin as the
    current URL; i.e., the protocol, host, and port of the URLs are the same.

    All host or path relative URLs are of the same origin. A scheme-relative URL
    is first prefixed with the current scheme before being evaluated.

    @method _hasSameOrigin
    @param {String} url URL to compare origin with the current URL.
    @return {Boolean} Whether the URL has the same origin of the current URL.
    @protected
    **/
    _hasSameOrigin: function (url) {
        var origin = ((url && url.match(this._regexUrlOrigin)) || [])[0];

        // Prepend current scheme to scheme-relative URLs.
        if (origin && origin.indexOf('//') === 0) {
            origin = Y.getLocation().protocol + origin;
        }

        return !origin || origin === this._getOrigin();
    },

    /**
    Joins the `root` URL to the specified _url_, normalizing leading/trailing
    `/` characters.

    @example
        router.set('root', '/foo');
        router._joinURL('bar');  // => '/foo/bar'
        router._joinURL('/bar'); // => '/foo/bar'

        router.set('root', '/foo/');
        router._joinURL('bar');  // => '/foo/bar'
        router._joinURL('/bar'); // => '/foo/bar'

    @method _joinURL
    @param {String} url URL to append to the `root` URL.
    @return {String} Joined URL.
    @protected
    **/
    _joinURL: function (url) {
        var root = this.get('root');

        // Causes `url` to _always_ begin with a "/".
        url = this.removeRoot(url);

        if (url.charAt(0) === '/') {
            url = url.substring(1);
        }

        return root && root.charAt(root.length - 1) === '/' ?
                root + url :
                root + '/' + url;
    },

    /**
    Returns a normalized path, ridding it of any '..' segments and properly
    handling leading and trailing slashes.

    @method _normalizePath
    @param {String} path URL path to normalize.
    @return {String} Normalized path.
    @protected
    @since 3.5.0
    **/
    _normalizePath: function (path) {
        var dots  = '..',
            slash = '/',
            i, len, normalized, segments, segment, stack;

        if (!path || path === slash) {
            return slash;
        }

        segments = path.split(slash);
        stack    = [];

        for (i = 0, len = segments.length; i < len; ++i) {
            segment = segments[i];

            if (segment === dots) {
                stack.pop();
            } else if (segment) {
                stack.push(segment);
            }
        }

        normalized = slash + stack.join(slash);

        // Append trailing slash if necessary.
        if (normalized !== slash && path.charAt(path.length - 1) === slash) {
            normalized += slash;
        }

        return normalized;
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
    Returns `true` when the specified `path` is semantically within the
    specified `root` path.

    If the `root` does not end with a trailing slash ("/"), one will be added
    before the `path` is evaluated against the root path.

    @example
        this._pathHasRoot('/app',  '/app/foo'); // => true
        this._pathHasRoot('/app/', '/app/foo'); // => true
        this._pathHasRoot('/app/', '/app/');    // => true

        this._pathHasRoot('/app',  '/foo/bar'); // => false
        this._pathHasRoot('/app/', '/foo/bar'); // => false
        this._pathHasRoot('/app/', '/app');     // => false
        this._pathHasRoot('/app',  '/app');     // => false

    @method _pathHasRoot
    @param {String} root Root path used to evaluate whether the specificed
        `path` is semantically within. A trailing slash ("/") will be added if
        it does not already end with one.
    @param {String} path Path to evaluate for containing the specified `root`.
    @return {Boolean} Whether or not the `path` is semantically within the
        `root` path.
    @protected
    @since 3.13.0
    **/
    _pathHasRoot: function (root, path) {
        var rootPath = root.charAt(root.length - 1) === '/' ? root : root + '/';
        return path.indexOf(rootPath) === 0;
    },

    /**
    Queues up a `_save()` call to run after all previously-queued calls have
    finished.

    This is necessary because if we make multiple `_save()` calls before the
    first call gets dispatched, then both calls will dispatch to the last call's
    URL.

    All arguments passed to `_queue()` will be passed on to `_save()` when the
    queued function is executed.

    @method _queue
    @chainable
    @see _dequeue
    @protected
    **/
    _queue: function () {
        var args = arguments,
            self = this;

        saveQueue.push(function () {
            if (self._html5) {
                if (Y.UA.ios && Y.UA.ios < 5) {
                    // iOS <5 has buggy HTML5 history support, and needs to be
                    // synchronous.
                    self._save.apply(self, args);
                } else {
                    // Wrapped in a timeout to ensure that _save() calls are
                    // always processed asynchronously. This ensures consistency
                    // between HTML5- and hash-based history.
                    setTimeout(function () {
                        self._save.apply(self, args);
                    }, 1);
                }
            } else {
                self._dispatching = true; // otherwise we'll dequeue too quickly
                self._save.apply(self, args);
            }

            return self;
        });

        return !this._dispatching ? this._dequeue() : this;
    },

    /**
    Returns the normalized result of resolving the `path` against the current
    path. Falsy values for `path` will return just the current path.

    @method _resolvePath
    @param {String} path URL path to resolve.
    @return {String} Resolved path.
    @protected
    @since 3.5.0
    **/
    _resolvePath: function (path) {
        if (!path) {
            return Y.getLocation().pathname;
        }

        if (path.charAt(0) !== '/') {
            path = this._getPathRoot() + path;
        }

        return this._normalizePath(path);
    },

    /**
    Resolves the specified URL against the current URL.

    This method resolves URLs like a browser does and will always return an
    absolute URL. When the specified URL is already absolute, it is assumed to
    be fully resolved and is simply returned as is. Scheme-relative URLs are
    prefixed with the current protocol. Relative URLs are giving the current
    URL's origin and are resolved and normalized against the current path root.

    @method _resolveURL
    @param {String} url URL to resolve.
    @return {String} Resolved URL.
    @protected
    @since 3.5.0
    **/
    _resolveURL: function (url) {
        var parts    = url && url.match(this._regexURL),
            origin, path, query, hash, resolved;

        if (!parts) {
            return Y.getLocation().toString();
        }

        origin = parts[1];
        path   = parts[2];
        query  = parts[3];
        hash   = parts[4];

        // Absolute and scheme-relative URLs are assumed to be fully-resolved.
        if (origin) {
            // Prepend the current scheme for scheme-relative URLs.
            if (origin.indexOf('//') === 0) {
                origin = Y.getLocation().protocol + origin;
            }

            return origin + (path || '/') + (query || '') + (hash || '');
        }

        // Will default to the current origin and current path.
        resolved = this._getOrigin() + this._resolvePath(path);

        // A path or query for the specified URL trumps the current URL's.
        if (path || query) {
            return resolved + (query || '') + (hash || '');
        }

        query = this._getQuery();

        return resolved + (query ? ('?' + query) : '') + (hash || '');
    },

    /**
    Saves a history entry using either `pushState()` or the location hash.

    This method enforces the same-origin security constraint; attempting to save
    a `url` that is not from the same origin as the current URL will result in
    an error.

    @method _save
    @param {String} [url] URL for the history entry.
    @param {Boolean} [replace=false] If `true`, the current history entry will
      be replaced instead of a new one being added.
    @chainable
    @protected
    **/
    _save: function (url, replace) {
        var urlIsString = typeof url === 'string',
            currentPath, root, hash;

        // Perform same-origin check on the specified URL.
        if (urlIsString && !this._hasSameOrigin(url)) {
            Y.error('Security error: The new URL must be of the same origin as the current URL.');
            return this;
        }

        // Joins the `url` with the `root`.
        if (urlIsString) {
            url = this._joinURL(url);
        }

        // Force _ready to true to ensure that the history change is handled
        // even if _save is called before the `ready` event fires.
        this._ready = true;

        if (this._html5) {
            this._history[replace ? 'replace' : 'add'](null, {url: url});
        } else {
            currentPath = Y.getLocation().pathname;
            root        = this.get('root');
            hash        = HistoryHash.getHash();

            if (!urlIsString) {
                url = hash;
            }

            // Determine if the `root` already exists in the current location's
            // `pathname`, and if it does then we can exclude it from the
            // hash-based path. No need to duplicate the info in the URL.
            if (root === currentPath || root === this._getPathRoot()) {
                url = this.removeRoot(url);
            }

            // The `hashchange` event only fires when the new hash is actually
            // different. This makes sure we'll always dequeue and dispatch
            // _all_ router instances, mimicking the HTML5 behavior.
            if (url === hash) {
                Y.Router.dispatch();
            } else {
                HistoryHash[replace ? 'replaceHash' : 'setHash'](url);
            }
        }

        return this;
    },

    /**
    Setter for the `params` attribute.

    @method _setParams
    @param {Object} params Map in the form: `name` -> RegExp | Function.
    @return {Object} The map of params: `name` -> RegExp | Function.
    @protected
    @since 3.12.0
    **/
    _setParams: function (params) {
        this._params = {};

        YObject.each(params, function (regex, name) {
            this.param(name, regex);
        }, this);

        return Y.merge(this._params);
    },

    /**
    Setter for the `routes` attribute.

    @method _setRoutes
    @param {Object[]} routes Array of route objects.
    @return {Object[]} Array of route objects.
    @protected
    **/
    _setRoutes: function (routes) {
        this._routes = [];

        YArray.each(routes, function (route) {
            this.route(route);
        }, this);

        return this._routes.concat();
    },

    /**
    Upgrades a hash-based URL to a full-path URL, if necessary.

    The specified `url` will be upgraded if its of the same origin as the
    current URL and has a path-like hash. URLs that don't need upgrading will be
    returned as-is.

    @example
        app._upgradeURL('http://example.com/#/foo/'); // => 'http://example.com/foo/';

    @method _upgradeURL
    @param {String} url The URL to upgrade from hash-based to full-path.
    @return {String} The upgraded URL, or the specified URL untouched.
    @protected
    @since 3.5.0
    **/
    _upgradeURL: function (url) {
        // We should not try to upgrade paths for external URLs.
        if (!this._hasSameOrigin(url)) {
            return url;
        }

        var hash       = (url.match(/#(.*)$/) || [])[1] || '',
            hashPrefix = Y.HistoryHash.hashPrefix,
            hashPath;

        // Strip any hash prefix, like hash-bangs.
        if (hashPrefix && hash.indexOf(hashPrefix) === 0) {
            hash = hash.replace(hashPrefix, '');
        }

        // If the hash looks like a URL path, assume it is, and upgrade it!
        if (hash) {
            hashPath = this._getHashPath(hash);

            if (hashPath) {
                return this._resolveURL(hashPath);
            }
        }

        return url;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `history:change` and `hashchange` events.

    @method _afterHistoryChange
    @param {EventFacade} e
    @protected
    **/
    _afterHistoryChange: function (e) {
        var self       = this,
            src        = e.src,
            prevURL    = self._url,
            currentURL = self._getURL(),
            req, res;

        self._url = currentURL;

        // Handles the awkwardness that is the `popstate` event. HTML5 browsers
        // fire `popstate` right before they fire `hashchange`, and Chrome fires
        // `popstate` on page load. If this router is not ready or the previous
        // and current URLs only differ by their hash, then we want to ignore
        // this `popstate` event.
        if (src === 'popstate' &&
                (!self._ready || prevURL.replace(/#.*$/, '') === currentURL.replace(/#.*$/, ''))) {

            return;
        }

        req = self._getRequest(src);
        res = self._getResponse(req);

        self._dispatch(req, res);
    },

    // -- Default Event Handlers -----------------------------------------------

    /**
    Default handler for the `ready` event.

    @method _defReadyFn
    @param {EventFacade} e
    @protected
    **/
    _defReadyFn: function (e) {
        this._ready = true;
    }
}, {
    // -- Static Properties ----------------------------------------------------
    NAME: 'router',

    ATTRS: {
        /**
        Whether or not this browser is capable of using HTML5 history.

        Setting this to `false` will force the use of hash-based history even on
        HTML5 browsers, but please don't do this unless you understand the
        consequences.

        @attribute html5
        @type Boolean
        @initOnly
        **/
        html5: {
            // Android versions lower than 3.0 are buggy and don't update
            // window.location after a pushState() call, so we fall back to
            // hash-based history for them.
            //
            // See http://code.google.com/p/android/issues/detail?id=17471
            valueFn: function () { return Y.Router.html5; },
            writeOnce: 'initOnly'
        },

        /**
        Map of params handlers in the form: `name` -> RegExp | Function.

        If a param handler regex or function returns a value of `false`, `null`,
        `undefined`, or `NaN`, the current route will not match and be skipped.
        All other return values will be used in place of the original param
        value parsed from the URL.

        This attribute is intended to be used to set params at init time, or to
        completely reset all params after init. To add params after init without
        resetting all existing params, use the `param()` method.

        @attribute params
        @type Object
        @default `{}`
        @see param
        @since 3.12.0
        **/
        params: {
            value : {},
            getter: '_getParams',
            setter: '_setParams'
        },

        /**
        Absolute root path from which all routes should be evaluated.

        For example, if your router is running on a page at
        `http://example.com/myapp/` and you add a route with the path `/`, your
        route will never execute, because the path will always be preceded by
        `/myapp`. Setting `root` to `/myapp` would cause all routes to be
        evaluated relative to that root URL, so the `/` route would then execute
        when the user browses to `http://example.com/myapp/`.

        @example
            router.set('root', '/myapp');
            router.route('/foo', function () { ... });

            Y.log(router.hasRoute('/foo'));       // => false
            Y.log(router.hasRoute('/myapp/foo')); // => true

            // Updates the URL to: "/myapp/foo"
            router.save('/foo');

        @attribute root
        @type String
        @default `''`
        **/
        root: {
            value: ''
        },

        /**
        Array of route objects.

        Each item in the array must be an object with the following properties
        in order to be processed by the router:

          * `path`: String or regex representing the path to match. See the docs
            for the `route()` method for more details.

          * `callbacks`: Function or a string representing the name of a
            function on this router instance that should be called when the
            route is triggered. An array of functions and/or strings may also be
            provided. See the docs for the `route()` method for more details.

        If a route object contains a `regex` or `regexp` property, or if its
        `path` is a regular express, then the route will be considered to be
        fully-processed. Any fully-processed routes may contain the following
        properties:

          * `regex`: The regular expression representing the path to match, this
            property may also be named `regexp` for greater compatibility.

          * `keys`: Array of named path parameters used to populate `req.params`
            objects when dispatching to route handlers.

        Any additional data contained on these route objects will be retained.
        This is useful to store extra metadata about a route; e.g., a `name` to
        give routes logical names.

        This attribute is intended to be used to set routes at init time, or to
        completely reset all routes after init. To add routes after init without
        resetting all existing routes, use the `route()` method.

        @attribute routes
        @type Object[]
        @default `[]`
        @see route
        **/
        routes: {
            value : [],
            getter: '_getRoutes',
            setter: '_setRoutes'
        }
    },

    // Used as the default value for the `html5` attribute, and for testing.
    html5: Y.HistoryBase.html5 && (!Y.UA.android || Y.UA.android >= 3),

    // To make this testable.
    _instances: instances,

    /**
    Dispatches to the first route handler that matches the specified `path` for
    all active router instances.

    This provides a mechanism to cause all active router instances to dispatch
    to their route handlers without needing to change the URL or fire the
    `history:change` or `hashchange` event.

    @method dispatch
    @static
    @since 3.6.0
    **/
    dispatch: function () {
        var i, len, router, req, res;

        for (i = 0, len = instances.length; i < len; i += 1) {
            router = instances[i];

            if (router) {
                req = router._getRequest('dispatch');
                res = router._getResponse(req);

                router._dispatch(req, res);
            }
        }
    }
});

/**
The `Controller` class was deprecated in YUI 3.5.0 and is now an alias for the
`Router` class. Use that class instead. This alias will be removed in a future
version of YUI.

@class Controller
@constructor
@extends Base
@deprecated Use `Router` instead.
@see Router
**/
Y.Controller = Y.Router;
