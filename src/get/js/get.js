/**
 * Provides a mechanism to fetch remote resources and
 * insert them into a document.
 * @module get
 */

/**
 * Fetches and inserts one or more script or link nodes into the document
 * @class Get
 * @static
 */

var Lang = Y.Lang,
    Get, Transaction;

Y.Get = Get = {
    // -- Public Properties ----------------------------------------------------

    /**
    Default options for CSS requests.

    @property cssOptions
    @type Object
    @static
    **/
    cssOptions: {
        attributes: {
            rel: 'stylesheet'
        },

        doc         : Y.config.linkDoc || Y.config.doc,
        pollInterval: 50
    },

    /**
    Default options for JS requests.

    @property jsOptions
    @type Object
    @static
    **/
    jsOptions: {
        autopurge: true,
        doc      : Y.config.scriptDoc || Y.config.doc
    },

    /**
    Default options for all requests.

    @property options
    @type Object
    @static
    **/
    options: {
        attributes: {
            charset: 'utf-8'
        },

        purgethreshold: 20
    },

    // -- Protected Properties -------------------------------------------------

    /**
    Regex that matches a CSS URL.

    @property REGEX_CSS
    @type RegExp
    @final
    @protected
    @static
    **/
    REGEX_CSS: /\.css(?:[?;].*)?$/i,

    /**
    Regex that matches a JS URL.

    @property REGEX_JS
    @type RegExp
    @final
    @protected
    @static
    **/
    REGEX_JS : /\.js(?:[?;].*)?$/i,

    /**
    Contains information about the current environment, such as whether it's a
    browser or a server-side environment, and what script and link injection
    features it supports.

    This object is created and populated the first time the `_getEnv()` method
    is called.

    @property _env
    @type Object
    @protected
    @static
    **/

    /**
    Currently pending transaction, if any.

    This is actually an object with two properties: `callback`, containing the
    optional callback passed to `css()`, `load()`, or `script()`; and
    `transaction`, containing the actual transaction instance.

    @property _pending
    @type Object
    @protected
    @static
    **/
    _pending: null,

    /**
    HTML nodes eligible to be purged next time autopurge is triggered.

    @property _purgeNodes
    @type HTMLElement[]
    @protected
    @static
    **/
    _purgeNodes: [],

    /**
    Queued transactions and associated callbacks.

    @property _queue
    @type Object[]
    @protected
    @static
    **/
    _queue: [],

    // -- Public Methods -------------------------------------------------------
    abort: function (transaction) {
        var i, id, item, len;

        if (!(typeof transaction === 'object')) {
            id = transaction;
            transaction = null;

            Y.log('Passing an id to `abort()` is deprecated as of 3.5.0. Pass a transaction object instead.', 'warn', 'get');

            if (this._pending && this._pending.transaction.id === id) {
                transaction = this._pending.transaction;
                this._pending = null;
            } else {
                for (i = 0, len = this._queue.length; i < len; ++i) {
                    item = this._queue[i].transaction;

                    if (item.id === id) {
                        transaction = item;
                        this._queue.splice(i, 1);
                        break;
                    }
                }
            }
        }

        if (transaction) {
            transaction.abort();
        }
    },

    css: function (urls, options, callback) {
        return this._load('css', urls, options, callback);
    },

    js: function (urls, options, callback) {
        return this._load('js', urls, options, callback);
    },

    // Loads both CSS and JS.
    load: function (urls, options, callback) {
        return this._load(null, urls, options, callback);
    },

    // -- Protected Methods ----------------------------------------------------
    _autoPurge: function (threshold) {
        if (threshold && this._purgeNodes.length >= threshold) {
            Y.log('autopurge triggered after ' + this._purgeNodes.length + ' nodes', 'info', 'get');
            this._purge(this._purgeNodes);
        }
    },

    _getEnv: function () {
        var doc = Y.config.doc,
            ua  = Y.UA;

        // Note: some of these checks require browser sniffs since it's not
        // feasible to load test files on every pageview just to perform a
        // feature test. I'm sorry if this makes you sad.
        return this._env = {
            // True if this is a browser that supports disabling async mode on
            // dynamically created script nodes. See
            // https://developer.mozilla.org/En/HTML/Element/Script#Attributes
            async: doc && doc.createElement('script').async === true,

            // True if this browser fires an event when a dynamically injected
            // link node finishes loading. This is currently true for IE, Opera,
            // and Firefox 9+. Note that IE versions <9 fire the DOM 0 "onload"
            // event, but not "load". All versions of IE fire "onload".
            cssLoad: !!(ua.gecko ? ua.gecko >= 9 : !ua.webkit),

            // True if this browser preserves script execution order while
            // loading scripts in parallel as long as the script node's `async`
            // attribute is set to false to explicitly disable async execution.
            preservesScriptOrder: !!(ua.gecko || ua.opera)
        };
    },

    _getTransaction: function (urls, options) {
        var requests = [],
            i, len, req, url;

        if (typeof urls === 'string') {
            urls = [urls];
        }

        for (i = 0, len = urls.length; i < len; ++i) {
            url = urls[i];
            req = {attributes: {}};

            // If `url` is a string, we create a URL object for it, then mix in
            // global options and request-specific options. If it's an object
            // with a "url" property, we assume it's a request object containing
            // URL-specific options.
            if (typeof url === 'string') {
                req.url = url;
            } else if (url.url) {
                // URL-specific options override both global defaults and
                // request-specific options.
                Y.mix(req, url, false, null, 0, true);
                url = url.url; // Make url a string so we can use it later.
            } else {
                Y.log('URL must be a string or an object with a `url` property.', 'error', 'get');
                continue;
            }

            Y.mix(req, options, false, null, 0, true);
            Y.mix(req, this.options, false, null, 0, true);

            // If we didn't get an explicit type for this URL either in the
            // request options or the URL-specific options, try to determine
            // one from the file extension.
            if (!req.type) {
                if (this.REGEX_CSS.test(url)) {
                    req.type = 'css';
                } else {
                    if (!this.REGEX_JS.test(url)) {
                        Y.log("Can't guess file type from URL. Assuming JS: " + url, 'warn', 'get');
                    }

                    req.type = 'js';
                }
            }

            // Mix in type-specific default options, but don't overwrite any
            // options that have already been set.
            Y.mix(req, req.type === 'js' ? this.jsOptions : this.cssOptions,
                false, null, 0, true);

            // Give the node an id attribute if it doesn't already have one.
            req.attributes.id || (req.attributes.id = Y.guid());

            // Backcompat for <3.5.0 behavior.
            if (req.win) {
                Y.log('The `win` option is deprecated as of 3.5.0. Use `doc` instead.', 'warn', 'get');
                req.doc = req.win.document;
            } else {
                req.win = req.doc.defaultView || req.doc.parentWindow;
            }

            if (req.charset) {
                Y.log('The `charset` option is deprecated as of 3.5.0. Set `attributes.charset` instead.', 'warn', 'get');
                req.attributes.charset = req.charset;
            }

            requests.push(req);
        }

        return new Transaction(requests, options);
    },

    _load: function (type, urls, options, callback) {
        var transaction;

        options || (options = {});
        options.type = type;

        if (!this._env) {
            this._getEnv();
        }

        transaction = this._getTransaction(urls, options);

        this._queue.push({
            callback   : callback,
            transaction: transaction
        });

        this._next();

        return transaction;
    },

    _next: function () {
        var item;

        if (this._pending) {
            return;
        }

        item = this._queue.shift();

        if (item) {
            this._pending = item;

            item.transaction.execute(function () {
                item.callback && item.callback.apply(this, arguments);

                Get._pending = null;
                Get._next();
            });
        }
    },

    _purge: function (nodes) {
        var purgeNodes    = this._purgeNodes,
            isTransaction = nodes !== purgeNodes,
            attr, index, node, parent;

        while (node = nodes.pop()) {
            parent = node.parentNode;

            if (node.clearAttributes) {
                // IE.
                node.clearAttributes();
            } else {
                // Everyone else.
                for (attr in node) {
                    if (node.hasOwnProperty(attr)) {
                        delete node[attr];
                    }
                }
            }

            parent && parent.removeChild(node);

            // If this is a transaction-level purge and this node also exists in
            // the Get-level _purgeNodes array, we need to remove it from
            // _purgeNodes to avoid creating a memory leak. The indexOf lookup
            // sucks, but until we get WeakMaps, this is the least troublesome
            // way to do this (we can't just hold onto node ids because they may
            // not be in the same document).
            if (isTransaction) {
                index = Y.Array.indexOf(purgeNodes, node);

                if (index > -1) {
                    purgeNodes.splice(index, 1);
                }
            }
        }
    }
};

/**
Alias for `js()`. Deprecated as of 3.5.0.

@method js
@deprecated Use `js()` instead.
@static
**/
Get.script = Get.js;

/**
Represents a Get transaction, which may contain requests for one or more JS or
CSS files.

This class should not be instantiated manually. Instances will be created and
returned as needed by Y.Get's `css()`, `load()`, and `script()` methods.

@class Get.Transaction
@constructor
**/
Get.Transaction = Transaction = function (requests, options) {
    var self = this;

    self.id       = Transaction._lastId += 1;
    self.errors   = [];
    self.nodes    = [];
    self.options  = options;
    self.requests = requests;

    self._callbacks = []; // callbacks to call after execution finishes
    self._queue     = [];
    self._waiting   = 0;

    // Deprecated pre-3.5.0 properties.
    self.data  = options.data;
    self.tId   = self.id; // Use `id` instead.
    self.win   = options.win || Y.config.win;
};

/**
Id of the most recent transaction.

@property _lastId
@type Number
@protected
@static
**/
Transaction._lastId = 0;

Transaction.prototype = {
    // -- Public Properties ----------------------------------------------------
    _state: 'new', // "new", "executing", or "done"

    // -- Public Methods -------------------------------------------------------
    abort: function (msg) {
        this._pending    = null;
        this._pendingCSS = null;
        this._pollTimer  = clearTimeout(this._pollTimer);
        this._queue      = [];
        this._waiting    = 0;

        this.errors.push({error: msg || 'Aborted'});
        this._finish();
    },

    execute: function (callback) {
        var self     = this,
            requests = self.requests,
            state    = self._state,
            i, len, queue, req;

        if (state === 'done') {
            callback && callback(self.errors.length ? self.errors : null, self);
        } else {
            callback && self._callbacks.push(callback);

            if (state === 'executing') {
                return;
            }
        }

        self._state = 'executing';
        self._queue = queue = [];

        if (self.options.timeout) {
            self._timeout = setTimeout(function () {
                self.abort('Timeout');
            }, self.options.timeout);
        }

        for (i = 0, len = requests.length; i < len; ++i) {
            req = self.requests[i];

            if (req.async || req.type === 'css') {
                // No need to queue CSS or fully async JS.
                self._insert(req);
            } else {
                queue.push(req);
            }
        }

        self._next();
    },

    purge: function () {
        Get._purge(this.nodes);
    },

    // -- Protected Methods ----------------------------------------------------
    _createNode: function (name, attrs, doc) {
        var node = doc.createElement(name),
            attr;

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                node.setAttribute(attr, attrs[attr]);
            }
        }

        return node;
    },

    _finish: function () {
        var errors  = this.errors.length ? this.errors : null,
            options = this.options,
            thisObj = options.context,
            data, i, len;

        if (this._state === 'done') {
            return;
        }

        this._state = 'done';

        for (i = 0, len = this._callbacks.length; i < len; ++i) {
            this._callbacks[i](errors, this);
        }

        if (options.onEnd || options.onFailure || options.onSuccess
                || options.onTimeout) {

            data = this._getEventData();

            if (errors) {
                if (options.onTimeout && errors[errors.length - 1] === 'Timeout') {
                    options.onTimeout.call(thisObj, data);
                }

                if (options.onFailure) {
                    options.onFailure.call(thisObj, data);
                }
            } else if (options.onSuccess) {
                options.onSuccess.call(thisObj, data);
            }

            if (options.onEnd) {
                options.onEnd.call(thisObj, data);
            }
        }
    },

    _getEventData: function (req) {
        if (req) {
            // This merge is necessary for backcompat. I hate it.
            return Y.merge(this, {
                abort  : this.abort, // have to copy these because the prototype isn't preserved
                purge  : this.purge,
                request: req,
                url    : req.url,
                win    : req.win
            });
        } else {
            return this;
        }
    },

    _getInsertBefore: function (req) {
        var doc = req.doc,
            el  = req.insertBefore || doc.getElementsByTagName('base')[0];

        // Inserting before a <base> tag apparently works around an IE bug
        // (according to a comment from pre-3.5.0 Y.Get), but I'm not sure what
        // bug that is, exactly. Better safe than sorry?

        if (el) {
            return typeof el === 'string' ? doc.getElementById(el) : el;
        }

        // Barring an explicit insertBefore config or a <base> element, we'll
        // try to insert before the first child of <head>. If <head> doesn't
        // exist, we'll throw our hands in the air and insert before the first
        // <script>, which we know must exist because *something* put Y.Get on
        // the page.
        el = doc.head || doc.getElementsByTagName('head')[0];
        return el ? el.firstChild : doc.getElementsByTagName('script')[0];
    },

    _insert: function (req) {
        var env          = Get._env,
            insertBefore = this._getInsertBefore(req),
            isScript     = req.type === 'js',
            node         = req.node,
            self         = this,
            ua           = Y.UA,
            nodeType;

        if (!node) {
            if (isScript) {
                nodeType = 'script';
            } else if (!env.cssLoad && ua.gecko) {
                nodeType = 'style';
            } else {
                nodeType = 'link';
            }

            node = req.node = this._createNode(nodeType, req.attributes,
                req.doc);
        }

        function onError(e) {
            // TODO: What useful info is on `e`, if any?
            self._progress('Failed to load ' + req.url, req);
        }

        function onLoad() {
            self._progress(null, req);
        }

        // Deal with script asynchronicity.
        if (isScript) {
            node.setAttribute('src', req.url);

            if (req.async) {
                // Explicitly indicate that we want the browser to execute this
                // script asynchronously. This is necessary for older browsers
                // like Firefox <4.
                node.async = true;
            } else {
                if (env.async) {
                    // This browser treats injected scripts as async by default
                    // (standard HTML5 behavior) but asynchronous loading isn't
                    // desired, so tell the browser not to mark this script as
                    // async.
                    node.async = false;
                }

                // If this browser doesn't preserve script execution order based
                // on insertion order, we'll need to avoid inserting other
                // scripts until this one finishes loading.
                if (!env.preservesScriptOrder) {
                    Y.log("This browser doesn't preserve script execution order, so scripts will be loaded synchronously (which is slower).", 'info', 'get');
                    this._pending = req;
                }
            }
        } else {
            if (!env.cssLoad && ua.gecko) {
                // In Firefox <9, we can import the requested URL into a <style>
                // node and poll for the existence of node.sheet.cssRules. This
                // gives us a reliable way to determine CSS load completion that
                // also works for cross-domain stylesheets.
                //
                // Props to Zach Leatherman for calling my attention to this
                // technique.
                node.innerHTML = (req.attributes.charset ?
                    '@charset "' + req.attributes.charset + '";' : '') +
                    '@import "' + req.url + '";';
            } else {
                node.setAttribute('href', req.url);
            }
        }

        // Inject the node.
        if (isScript && ua.ie && ua.ie < 9) {
            // Script on IE6, 7, and 8.
            node.onreadystatechange = function () {
                if (/loaded|complete/.test(node.readyState)) {
                    node.onreadystatechange = null;
                    onLoad();
                }
            };
        } else if (!isScript && !env.cssLoad) {
            // CSS on Firefox <9 or WebKit.
            this._poll(req);
        } else {
            // Script or CSS on everything else. Using DOM 0 events because that
            // evens the playing field with older IEs.
            node.onerror = onError;
            node.onload  = onLoad;
        }

        this._waiting += 1;

        this.nodes.push(node);
        insertBefore.parentNode.insertBefore(node, insertBefore);
    },

    _next: function () {
        if (this._pending) {
            return;
        }

        // If there are requests in the queue, insert the next queued request.
        // Otherwise, if we're waiting on already-inserted requests to finish,
        // wait longer. If there are no queued requests and we're not waiting
        // for anything to load, then we're done!
        if (this._queue.length) {
            this._insert(this._queue.shift());
        } else if (!this._waiting) {
            this._finish();
        }
    },

    _poll: function (newReq) {
        var self       = this,
            pendingCSS = self._pendingCSS,
            isWebKit   = Y.UA.webkit,
            i, hasRules, j, nodeHref, req, sheets;

        if (newReq) {
            pendingCSS || (pendingCSS = self._pendingCSS = []);
            pendingCSS.push(newReq);

            if (self._pollTimer) {
                // A poll timeout is already pending, so no need to create a
                // new one.
                return;
            }
        }

        self._pollTimer = null;

        // Note: in both the WebKit and Gecko hacks below, a CSS URL that 404s
        // will still be treated as a success. There's no good workaround for
        // this.

        for (i = 0; i < pendingCSS.length; ++i) {
            req = pendingCSS[i];

            if (isWebKit) {
                // Look for a stylesheet matching the pending URL.
                sheets   = req.doc.styleSheets;
                j        = sheets.length;
                nodeHref = req.node.href;

                while (--j >= 0) {
                    if (sheets[j].href === nodeHref) {
                        pendingCSS.splice(i, 1);
                        i -= 1;
                        self._progress(null, req);
                        break;
                    }
                }
            } else {
                // Many thanks to Zach Leatherman for calling my attention to
                // the @import-based cross-domain technique used here, and to
                // Oleg Slobodskoi for an earlier same-domain implementation.
                //
                // See Zach's blog for more details:
                // http://www.zachleat.com/web/2010/07/29/load-css-dynamically/
                try {
                    // We don't really need to store this value since we never
                    // use it again, but if we don't store it, Closure Compiler
                    // assumes the code is useless and removes it.
                    hasRules = !!req.node.sheet.cssRules;

                    // If we get here, the stylesheet has loaded.
                    pendingCSS.splice(i, 1);
                    i -= 1;
                    self._progress(null, req);
                } catch (ex) {
                    // An exception means the stylesheet is still loading.
                }
            }
        }

        if (pendingCSS.length) {
            self._pollTimer = setTimeout(function () {
                self._poll.call(self);
            }, self.options.pollInterval);
        }
    },

    _progress: function (err, req) {
        var options = this.options;

        if (err) {
            req.error = err;

            this.errors.push({
                error  : err,
                request: req
            });

            Y.log(err, 'error', 'get');
        }

        req.finished = true;

        if (options.onProgress) {
            options.onProgress.call(options.context || null,
                this._getEventData(req));
        }

        if (req.autopurge) {
            // Pre-3.5.0 Get always excludes the most recent node from an
            // autopurge. I find this odd, but I'm keeping that behavior for
            // the sake of backcompat.
            Get._autoPurge(this.options.purgethreshold);
            Get._purgeNodes.push(req.node);
        }

        if (this._pending === req) {
            this._pending = null;
        }

        this._waiting -= 1;
        this._next();
    }
};

/*
Public functions:

  - abort(o) void
    - o: transaction object or tId string

  - css(urls, options) String (transaction object)
  - script(urls, options) String (transaction object)


Public callbacks:

  - onEnd
    - Executes after the transaction finishes, regardless of success or failure.

  - onFailure
    - Same payload as onSuccess.

  - onProgress(e)
    - Same payload as onSuccess, but with an additional e.url property
      containing the URL of the loaded file.

  - onSuccess(e)
    - e.win: Window the nodes were inserted into.
    - e.data: Arbitrary data object provided at request time.
    - e.nodes: Array of inserted nodes.
    - e.purge: Function that will purge the inserted nodes.

  - onTimeout(e)
    - Same payload as onSuccess.


Options:

  - async: When true, an array of files will be loaded in parallel rather than
    in serial.

  - attributes: Object literal containing additional attributes to add to nodes.

  - autopurge: Whether or not nodes should be automatically purged.

  - charset: Charset for inserted nodes (deprecated -- use the `attributes` config
    instead).

  - context: Execution context (`this` object) for callback functions.

  - data: Arbitrary data object to supply to callbacks.

  - insertBefore: node or node id before which script/link nodes should be
    inserted.

  - purgethreshold: Number of transactions before autopurge should occur.

  - timeout: Number of milliseconds to wait before aborting and firing onTimeout.

  - win: Window into which nodes should be inserted. Defaults to current window.


Features:

  - charset="utf-8" by default
  - autopurge after 20 nodes inserted
  - node id is a Y.guid()
  - log a warning on failure
  - clear a node's attributes before purging it (why? to help GC?)
  - insertBefore option defaults to the first "base" element, if any


Transaction objects:

    {
        tId: 'transaction id string'
    }


Callback data payload:

    {
        tId: q.tId,
        win: q.win,
        data: q.data,
        nodes: q.nodes,
        msg: msg,
        statusText: result,
        url: url,

        purge: function() {
            _purge(this.tId);
        }
    }
*/
