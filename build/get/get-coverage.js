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
_yuitest_coverage["build/get/get.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/get/get.js",
    code: []
};
_yuitest_coverage["build/get/get.js"].code=["YUI.add('get', function (Y, NAME) {","","/*jslint boss:true, expr:true, laxbreak: true */","","/**","Provides dynamic loading of remote JavaScript and CSS resources.","","@module get","@class Get","@static","**/","","var Lang = Y.Lang,","","    CUSTOM_ATTRS, // defined lazily in Y.Get.Transaction._createNode()","","    Get, Transaction;","","Y.Get = Get = {","    // -- Public Properties ----------------------------------------------------","","    /**","    Default options for CSS requests. Options specified here will override","    global defaults for CSS requests.","","    See the `options` property for all available options.","","    @property cssOptions","    @type Object","    @static","    @since 3.5.0","    **/","    cssOptions: {","        attributes: {","            rel: 'stylesheet'","        },","","        doc         : Y.config.linkDoc || Y.config.doc,","        pollInterval: 50","    },","","    /**","    Default options for JS requests. Options specified here will override global","    defaults for JS requests.","","    See the `options` property for all available options.","","    @property jsOptions","    @type Object","    @static","    @since 3.5.0","    **/","    jsOptions: {","        autopurge: true,","        doc      : Y.config.scriptDoc || Y.config.doc","    },","","    /**","    Default options to use for all requests.","","    Note that while all available options are documented here for ease of","    discovery, some options (like callback functions) only make sense at the","    transaction level.","","    Callback functions specified via the options object or the `options`","    parameter of the `css()`, `js()`, or `load()` methods will receive the","    transaction object as a parameter. See `Y.Get.Transaction` for details on","    the properties and methods available on transactions.","","    @static","    @since 3.5.0","    @property {Object} options","","    @property {Boolean} [options.async=false] Whether or not to load scripts","        asynchronously, meaning they're requested in parallel and execution","        order is not guaranteed. Has no effect on CSS, since CSS is always","        loaded asynchronously.","","    @property {Object} [options.attributes] HTML attribute name/value pairs that","        should be added to inserted nodes. By default, the `charset` attribute","        will be set to \"utf-8\" and nodes will be given an auto-generated `id`","        attribute, but you can override these with your own values if desired.","","    @property {Boolean} [options.autopurge] Whether or not to automatically","        purge inserted nodes after the purge threshold is reached. This is","        `true` by default for JavaScript, but `false` for CSS since purging a","        CSS node will also remove any styling applied by the referenced file.","","    @property {Object} [options.context] `this` object to use when calling","        callback functions. Defaults to the transaction object.","","    @property {Mixed} [options.data] Arbitrary data object to pass to \"on*\"","        callbacks.","","    @property {Document} [options.doc] Document into which nodes should be","        inserted. By default, the current document is used.","","    @property {HTMLElement|String} [options.insertBefore] HTML element or id","        string of an element before which all generated nodes should be","        inserted. If not specified, Get will automatically determine the best","        place to insert nodes for maximum compatibility.","","    @property {Function} [options.onEnd] Callback to execute after a transaction","        is complete, regardless of whether it succeeded or failed.","","    @property {Function} [options.onFailure] Callback to execute after a","        transaction fails, times out, or is aborted.","","    @property {Function} [options.onProgress] Callback to execute after each","        individual request in a transaction either succeeds or fails.","","    @property {Function} [options.onSuccess] Callback to execute after a","        transaction completes successfully with no errors. Note that in browsers","        that don't support the `error` event on CSS `<link>` nodes, a failed CSS","        request may still be reported as a success because in these browsers","        it can be difficult or impossible to distinguish between success and","        failure for CSS resources.","","    @property {Function} [options.onTimeout] Callback to execute after a","        transaction times out.","","    @property {Number} [options.pollInterval=50] Polling interval (in","        milliseconds) for detecting CSS load completion in browsers that don't","        support the `load` event on `<link>` nodes. This isn't used for","        JavaScript.","","    @property {Number} [options.purgethreshold=20] Number of nodes to insert","        before triggering an automatic purge when `autopurge` is `true`.","","    @property {Number} [options.timeout] Number of milliseconds to wait before","        aborting a transaction. When a timeout occurs, the `onTimeout` callback","        is called, followed by `onFailure` and finally `onEnd`. By default,","        there is no timeout.","","    @property {String} [options.type] Resource type (\"css\" or \"js\"). This option","        is set automatically by the `css()` and `js()` functions and will be","        ignored there, but may be useful when using the `load()` function. If","        not specified, the type will be inferred from the URL, defaulting to","        \"js\" if the URL doesn't contain a recognizable file extension.","    **/","    options: {","        attributes: {","            charset: 'utf-8'","        },","","        purgethreshold: 20","    },","","    // -- Protected Properties -------------------------------------------------","","    /**","    Regex that matches a CSS URL. Used to guess the file type when it's not","    specified.","","    @property REGEX_CSS","    @type RegExp","    @final","    @protected","    @static","    @since 3.5.0","    **/","    REGEX_CSS: /\\.css(?:[?;].*)?$/i,","","    /**","    Regex that matches a JS URL. Used to guess the file type when it's not","    specified.","","    @property REGEX_JS","    @type RegExp","    @final","    @protected","    @static","    @since 3.5.0","    **/","    REGEX_JS : /\\.js(?:[?;].*)?$/i,","","    /**","    Contains information about the current environment, such as what script and","    link injection features it supports.","","    This object is created and populated the first time the `_getEnv()` method","    is called.","","    @property _env","    @type Object","    @protected","    @static","    @since 3.5.0","    **/","","    /**","    Mapping of document _yuid strings to <head> or <base> node references so we","    don't have to look the node up each time we want to insert a request node.","","    @property _insertCache","    @type Object","    @protected","    @static","    @since 3.5.0","    **/","    _insertCache: {},","","    /**","    Information about the currently pending transaction, if any.","","    This is actually an object with two properties: `callback`, containing the","    optional callback passed to `css()`, `load()`, or `js()`; and `transaction`,","    containing the actual transaction instance.","","    @property _pending","    @type Object","    @protected","    @static","    @since 3.5.0","    **/","    _pending: null,","","    /**","    HTML nodes eligible to be purged next time autopurge is triggered.","","    @property _purgeNodes","    @type HTMLElement[]","    @protected","    @static","    @since 3.5.0","    **/","    _purgeNodes: [],","","    /**","    Queued transactions and associated callbacks.","","    @property _queue","    @type Object[]","    @protected","    @static","    @since 3.5.0","    **/","    _queue: [],","","    // -- Public Methods -------------------------------------------------------","","    /**","    Aborts the specified transaction.","","    This will cause the transaction's `onFailure` callback to be called and","    will prevent any new script and link nodes from being added to the document,","    but any resources that have already been requested will continue loading","    (there's no safe way to prevent this, unfortunately).","","    *Note:* This method is deprecated as of 3.5.0, and will be removed in a","    future version of YUI. Use the transaction-level `abort()` method instead.","","    @method abort","    @param {Get.Transaction} transaction Transaction to abort.","    @deprecated Use the `abort()` method on the transaction instead.","    @static","    **/","    abort: function (transaction) {","        var i, id, item, len, pending;","","","        if (!transaction.abort) {","            id          = transaction;","            pending     = this._pending;","            transaction = null;","","            if (pending && pending.transaction.id === id) {","                transaction   = pending.transaction;","                this._pending = null;","            } else {","                for (i = 0, len = this._queue.length; i < len; ++i) {","                    item = this._queue[i].transaction;","","                    if (item.id === id) {","                        transaction = item;","                        this._queue.splice(i, 1);","                        break;","                    }","                }","            }","        }","","        transaction && transaction.abort();","    },","","    /**","    Loads one or more CSS files.","","    The _urls_ parameter may be provided as a URL string, a request object,","    or an array of URL strings and/or request objects.","","    A request object is just an object that contains a `url` property and zero","    or more options that should apply specifically to that request.","    Request-specific options take priority over transaction-level options and","    default options.","","    URLs may be relative or absolute, and do not have to have the same origin","    as the current page.","","    The `options` parameter may be omitted completely and a callback passed in","    its place, if desired.","","    @example","","        // Load a single CSS file and log a message on completion.","        Y.Get.css('foo.css', function (err) {","            if (err) {","            } else {","            }","        });","","        // Load multiple CSS files and log a message when all have finished","        // loading.","        var urls = ['foo.css', 'http://example.com/bar.css', 'baz/quux.css'];","","        Y.Get.css(urls, function (err) {","            if (err) {","            } else {","            }","        });","","        // Specify transaction-level options, which will apply to all requests","        // within the transaction.","        Y.Get.css(urls, {","            attributes: {'class': 'my-css'},","            timeout   : 5000","        });","","        // Specify per-request options, which override transaction-level and","        // default options.","        Y.Get.css([","            {url: 'foo.css', attributes: {id: 'foo'}},","            {url: 'bar.css', attributes: {id: 'bar', charset: 'iso-8859-1'}}","        ]);","","    @method css","    @param {String|Object|Array} urls URL string, request object, or array","        of URLs and/or request objects to load.","    @param {Object} [options] Options for this transaction. See the","        `Y.Get.options` property for a complete list of available options.","    @param {Function} [callback] Callback function to be called on completion.","        This is a general callback and will be called before any more granular","        callbacks (`onSuccess`, `onFailure`, etc.) specified in the `options`","        object.","","        @param {Array|null} callback.err Array of errors that occurred during","            the transaction, or `null` on success.","        @param {Get.Transaction} callback.transaction Transaction object.","","    @return {Get.Transaction} Transaction object.","    @static","    **/","    css: function (urls, options, callback) {","        return this._load('css', urls, options, callback);","    },","","    /**","    Loads one or more JavaScript resources.","","    The _urls_ parameter may be provided as a URL string, a request object,","    or an array of URL strings and/or request objects.","","    A request object is just an object that contains a `url` property and zero","    or more options that should apply specifically to that request.","    Request-specific options take priority over transaction-level options and","    default options.","","    URLs may be relative or absolute, and do not have to have the same origin","    as the current page.","","    The `options` parameter may be omitted completely and a callback passed in","    its place, if desired.","","    Scripts will be executed in the order they're specified unless the `async`","    option is `true`, in which case they'll be loaded in parallel and executed","    in whatever order they finish loading.","","    @example","","        // Load a single JS file and log a message on completion.","        Y.Get.js('foo.js', function (err) {","            if (err) {","            } else {","            }","        });","","        // Load multiple JS files, execute them in order, and log a message when","        // all have finished loading.","        var urls = ['foo.js', 'http://example.com/bar.js', 'baz/quux.js'];","","        Y.Get.js(urls, function (err) {","            if (err) {","            } else {","            }","        });","","        // Specify transaction-level options, which will apply to all requests","        // within the transaction.","        Y.Get.js(urls, {","            attributes: {'class': 'my-js'},","            timeout   : 5000","        });","","        // Specify per-request options, which override transaction-level and","        // default options.","        Y.Get.js([","            {url: 'foo.js', attributes: {id: 'foo'}},","            {url: 'bar.js', attributes: {id: 'bar', charset: 'iso-8859-1'}}","        ]);","","    @method js","    @param {String|Object|Array} urls URL string, request object, or array","        of URLs and/or request objects to load.","    @param {Object} [options] Options for this transaction. See the","        `Y.Get.options` property for a complete list of available options.","    @param {Function} [callback] Callback function to be called on completion.","        This is a general callback and will be called before any more granular","        callbacks (`onSuccess`, `onFailure`, etc.) specified in the `options`","        object.","","        @param {Array|null} callback.err Array of errors that occurred during","            the transaction, or `null` on success.","        @param {Get.Transaction} callback.transaction Transaction object.","","    @return {Get.Transaction} Transaction object.","    @since 3.5.0","    @static","    **/","    js: function (urls, options, callback) {","        return this._load('js', urls, options, callback);","    },","","    /**","    Loads one or more CSS and/or JavaScript resources in the same transaction.","","    Use this method when you want to load both CSS and JavaScript in a single","    transaction and be notified when all requested URLs have finished loading,","    regardless of type.","","    Behavior and options are the same as for the `css()` and `js()` methods. If","    a resource type isn't specified in per-request options or transaction-level","    options, Get will guess the file type based on the URL's extension (`.css`","    or `.js`, with or without a following query string). If the file type can't","    be guessed from the URL, a warning will be logged and Get will assume the","    URL is a JavaScript resource.","","    @example","","        // Load both CSS and JS files in a single transaction, and log a message","        // when all files have finished loading.","        Y.Get.load(['foo.css', 'bar.js', 'baz.css'], function (err) {","            if (err) {","            } else {","            }","        });","","    @method load","    @param {String|Object|Array} urls URL string, request object, or array","        of URLs and/or request objects to load.","    @param {Object} [options] Options for this transaction. See the","        `Y.Get.options` property for a complete list of available options.","    @param {Function} [callback] Callback function to be called on completion.","        This is a general callback and will be called before any more granular","        callbacks (`onSuccess`, `onFailure`, etc.) specified in the `options`","        object.","","        @param {Array|null} err Array of errors that occurred during the","            transaction, or `null` on success.","        @param {Get.Transaction} Transaction object.","","    @return {Get.Transaction} Transaction object.","    @since 3.5.0","    @static","    **/","    load: function (urls, options, callback) {","        return this._load(null, urls, options, callback);","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Triggers an automatic purge if the purge threshold has been reached.","","    @method _autoPurge","    @param {Number} threshold Purge threshold to use, in milliseconds.","    @protected","    @since 3.5.0","    @static","    **/","    _autoPurge: function (threshold) {","        if (threshold && this._purgeNodes.length >= threshold) {","            this._purge(this._purgeNodes);","        }","    },","","    /**","    Populates the `_env` property with information about the current","    environment.","","    @method _getEnv","    @return {Object} Environment information.","    @protected","    @since 3.5.0","    @static","    **/","    _getEnv: function () {","        var doc = Y.config.doc,","            ua  = Y.UA;","","        // Note: some of these checks require browser sniffs since it's not","        // feasible to load test files on every pageview just to perform a","        // feature test. I'm sorry if this makes you sad.","        return (this._env = {","","            // True if this is a browser that supports disabling async mode on","            // dynamically created script nodes. See","            // https://developer.mozilla.org/En/HTML/Element/Script#Attributes","","            // IE10 doesn't return true for the MDN feature test, so setting it explicitly,","            // because it is async by default, and allows you to disable async by setting it to false","            async: (doc && doc.createElement('script').async === true) || (ua.ie >= 10),","","            // True if this browser fires an event when a dynamically injected","            // link node fails to load. This is currently true for Firefox 9+","            // and WebKit 535.24+","            cssFail: ua.gecko >= 9 || ua.compareVersions(ua.webkit, 535.24) >= 0,","","            // True if this browser fires an event when a dynamically injected","            // link node finishes loading. This is currently true for IE, Opera,","            // Firefox 9+, and WebKit 535.24+. Note that IE versions <9 fire the","            // DOM 0 \"onload\" event, but not \"load\". All versions of IE fire","            // \"onload\".","            // davglass: Seems that Chrome on Android needs this to be false.","            cssLoad: (","                    (!ua.gecko && !ua.webkit) || ua.gecko >= 9 ||","                    ua.compareVersions(ua.webkit, 535.24) >= 0","                ) && !(ua.chrome && ua.chrome <= 18),","","            // True if this browser preserves script execution order while","            // loading scripts in parallel as long as the script node's `async`","            // attribute is set to false to explicitly disable async execution.","            preservesScriptOrder: !!(ua.gecko || ua.opera || (ua.ie && ua.ie >= 10))","        });","    },","","    _getTransaction: function (urls, options) {","        var requests = [],","            i, len, req, url;","","        if (!Lang.isArray(urls)) {","            urls = [urls];","        }","","        options = Y.merge(this.options, options);","","        // Clone the attributes object so we don't end up modifying it by ref.","        options.attributes = Y.merge(this.options.attributes,","                options.attributes);","","        for (i = 0, len = urls.length; i < len; ++i) {","            url = urls[i];","            req = {attributes: {}};","","            // If `url` is a string, we create a URL object for it, then mix in","            // global options and request-specific options. If it's an object","            // with a \"url\" property, we assume it's a request object containing","            // URL-specific options.","            if (typeof url === 'string') {","                req.url = url;","            } else if (url.url) {","                // URL-specific options override both global defaults and","                // request-specific options.","                Y.mix(req, url, false, null, 0, true);","                url = url.url; // Make url a string so we can use it later.","            } else {","                continue;","            }","","            Y.mix(req, options, false, null, 0, true);","","            // If we didn't get an explicit type for this URL either in the","            // request options or the URL-specific options, try to determine","            // one from the file extension.","            if (!req.type) {","                if (this.REGEX_CSS.test(url)) {","                    req.type = 'css';","                } else {","                    if (!this.REGEX_JS.test(url)) {","                    }","","                    req.type = 'js';","                }","            }","","            // Mix in type-specific default options, but don't overwrite any","            // options that have already been set.","            Y.mix(req, req.type === 'js' ? this.jsOptions : this.cssOptions,","                false, null, 0, true);","","            // Give the node an id attribute if it doesn't already have one.","            req.attributes.id || (req.attributes.id = Y.guid());","","            // Backcompat for <3.5.0 behavior.","            if (req.win) {","                req.doc = req.win.document;","            } else {","                req.win = req.doc.defaultView || req.doc.parentWindow;","            }","","            if (req.charset) {","                req.attributes.charset = req.charset;","            }","","            requests.push(req);","        }","","        return new Transaction(requests, options);","    },","","    _load: function (type, urls, options, callback) {","        var transaction;","","        // Allow callback as third param.","        if (typeof options === 'function') {","            callback = options;","            options  = {};","        }","","        options || (options = {});","        options.type = type;","","        options._onFinish = Get._onTransactionFinish;","","        if (!this._env) {","            this._getEnv();","        }","","        transaction = this._getTransaction(urls, options);","","        this._queue.push({","            callback   : callback,","            transaction: transaction","        });","","        this._next();","","        return transaction;","    },","","    _onTransactionFinish : function() {","        Get._pending = null;","        Get._next();","    },","","    _next: function () {","        var item;","","        if (this._pending) {","            return;","        }","","        item = this._queue.shift();","","        if (item) {","            // this._pending = item; ","            this._pending = item.transaction.options.async ? null : item;","            item.transaction.execute(item.callback);","        }","    },","","    _purge: function (nodes) {","        var purgeNodes    = this._purgeNodes,","            isTransaction = nodes !== purgeNodes,","            index, node;","","        while (node = nodes.pop()) { // assignment","            // Don't purge nodes that haven't finished loading (or errored out),","            // since this can hang the transaction.","            if (!node._yuiget_finished) {","                continue;","            }","","            node.parentNode && node.parentNode.removeChild(node);","","            // If this is a transaction-level purge and this node also exists in","            // the Get-level _purgeNodes array, we need to remove it from","            // _purgeNodes to avoid creating a memory leak. The indexOf lookup","            // sucks, but until we get WeakMaps, this is the least troublesome","            // way to do this (we can't just hold onto node ids because they may","            // not be in the same document).","            if (isTransaction) {","                index = Y.Array.indexOf(purgeNodes, node);","","                if (index > -1) {","                    purgeNodes.splice(index, 1);","                }","            }","        }","    }","};","","/**","Alias for `js()`.","","@method script","@static","**/","Get.script = Get.js;","","/**","Represents a Get transaction, which may contain requests for one or more JS or","CSS files.","","This class should not be instantiated manually. Instances will be created and","returned as needed by Y.Get's `css()`, `js()`, and `load()` methods.","","@class Get.Transaction","@constructor","@since 3.5.0","**/","Get.Transaction = Transaction = function (requests, options) {","    var self = this;","","    self.id       = Transaction._lastId += 1;","    self.data     = options.data;","    self.errors   = [];","    self.nodes    = [];","    self.options  = options;","    self.requests = requests;","","    self._callbacks = []; // callbacks to call after execution finishes","    self._queue     = [];","    self._reqsWaiting   = 0;","","    // Deprecated pre-3.5.0 properties.","    self.tId = self.id; // Use `id` instead.","    self.win = options.win || Y.config.win;","};","","/**","Arbitrary data object associated with this transaction.","","This object comes from the options passed to `Get.css()`, `Get.js()`, or","`Get.load()`, and will be `undefined` if no data object was specified.","","@property {Object} data","**/","","/**","Array of errors that have occurred during this transaction, if any.","","@since 3.5.0","@property {Object[]} errors","@property {String} errors.error Error message.","@property {Object} errors.request Request object related to the error.","**/","","/**","Numeric id for this transaction, unique among all transactions within the same","YUI sandbox in the current pageview.","","@property {Number} id","@since 3.5.0","**/","","/**","HTMLElement nodes (native ones, not YUI Node instances) that have been inserted","during the current transaction.","","@property {HTMLElement[]} nodes","**/","","/**","Options associated with this transaction.","","See `Get.options` for the full list of available options.","","@property {Object} options","@since 3.5.0","**/","","/**","Request objects contained in this transaction. Each request object represents","one CSS or JS URL that will be (or has been) requested and loaded into the page.","","@property {Object} requests","@since 3.5.0","**/","","/**","Id of the most recent transaction.","","@property _lastId","@type Number","@protected","@static","**/","Transaction._lastId = 0;","","Transaction.prototype = {","    // -- Public Properties ----------------------------------------------------","","    /**","    Current state of this transaction. One of \"new\", \"executing\", or \"done\".","","    @property _state","    @type String","    @protected","    **/","    _state: 'new', // \"new\", \"executing\", or \"done\"","","    // -- Public Methods -------------------------------------------------------","","    /**","    Aborts this transaction.","","    This will cause the transaction's `onFailure` callback to be called and","    will prevent any new script and link nodes from being added to the document,","    but any resources that have already been requested will continue loading","    (there's no safe way to prevent this, unfortunately).","","    @method abort","    @param {String} [msg=\"Aborted.\"] Optional message to use in the `errors`","        array describing why the transaction was aborted.","    **/","    abort: function (msg) {","        this._pending    = null;","        this._pendingCSS = null;","        this._pollTimer  = clearTimeout(this._pollTimer);","        this._queue      = [];","        this._reqsWaiting    = 0;","","        this.errors.push({error: msg || 'Aborted'});","        this._finish();","    },","","    /**","    Begins execting the transaction.","","    There's usually no reason to call this manually, since Get will call it","    automatically when other pending transactions have finished. If you really","    want to execute your transaction before Get does, you can, but be aware that","    this transaction's scripts may end up executing before the scripts in other","    pending transactions.","","    If the transaction is already executing, the specified callback (if any)","    will be queued and called after execution finishes. If the transaction has","    already finished, the callback will be called immediately (the transaction","    will not be executed again).","","    @method execute","    @param {Function} callback Callback function to execute after all requests","        in the transaction are complete, or after the transaction is aborted.","    **/","    execute: function (callback) {","        var self     = this,","            requests = self.requests,","            state    = self._state,","            i, len, queue, req;","","        if (state === 'done') {","            callback && callback(self.errors.length ? self.errors : null, self);","            return;","        } else {","            callback && self._callbacks.push(callback);","","            if (state === 'executing') {","                return;","            }","        }","","        self._state = 'executing';","        self._queue = queue = [];","","        if (self.options.timeout) {","            self._timeout = setTimeout(function () {","                self.abort('Timeout');","            }, self.options.timeout);","        }","","        self._reqsWaiting = requests.length;","","        for (i = 0, len = requests.length; i < len; ++i) {","            req = requests[i];","","            if (req.async || req.type === 'css') {","                // No need to queue CSS or fully async JS.","                self._insert(req);","            } else {","                queue.push(req);","            }","        }","","        self._next();","    },","","    /**","    Manually purges any `<script>` or `<link>` nodes this transaction has","    created.","","    Be careful when purging a transaction that contains CSS requests, since","    removing `<link>` nodes will also remove any styles they applied.","","    @method purge","    **/","    purge: function () {","        Get._purge(this.nodes);","    },","","    // -- Protected Methods ----------------------------------------------------","    _createNode: function (name, attrs, doc) {","        var node = doc.createElement(name),","            attr, testEl;","","        if (!CUSTOM_ATTRS) {","            // IE6 and IE7 expect property names rather than attribute names for","            // certain attributes. Rather than sniffing, we do a quick feature","            // test the first time _createNode() runs to determine whether we","            // need to provide a workaround.","            testEl = doc.createElement('div');","            testEl.setAttribute('class', 'a');","","            CUSTOM_ATTRS = testEl.className === 'a' ? {} : {","                'for'  : 'htmlFor',","                'class': 'className'","            };","        }","","        for (attr in attrs) {","            if (attrs.hasOwnProperty(attr)) {","                node.setAttribute(CUSTOM_ATTRS[attr] || attr, attrs[attr]);","            }","        }","","        return node;","    },","","    _finish: function () {","        var errors  = this.errors.length ? this.errors : null,","            options = this.options,","            thisObj = options.context || this,","            data, i, len;","","        if (this._state === 'done') {","            return;","        }","","        this._state = 'done';","","        for (i = 0, len = this._callbacks.length; i < len; ++i) {","            this._callbacks[i].call(thisObj, errors, this);","        }","","        data = this._getEventData();","","        if (errors) {","            if (options.onTimeout && errors[errors.length - 1].error === 'Timeout') {","                options.onTimeout.call(thisObj, data);","            }","","            if (options.onFailure) {","                options.onFailure.call(thisObj, data);","            }","        } else if (options.onSuccess) {","            options.onSuccess.call(thisObj, data);","        }","","        if (options.onEnd) {","            options.onEnd.call(thisObj, data);","        }","","        if (options._onFinish) {","            options._onFinish();","        }","    },","","    _getEventData: function (req) {","        if (req) {","            // This merge is necessary for backcompat. I hate it.","            return Y.merge(this, {","                abort  : this.abort, // have to copy these because the prototype isn't preserved","                purge  : this.purge,","                request: req,","                url    : req.url,","                win    : req.win","            });","        } else {","            return this;","        }","    },","","    _getInsertBefore: function (req) {","        var doc = req.doc,","            el  = req.insertBefore,","            cache, cachedNode, docStamp;","","        if (el) {","            return typeof el === 'string' ? doc.getElementById(el) : el;","        }","","        cache    = Get._insertCache;","        docStamp = Y.stamp(doc);","","        if ((el = cache[docStamp])) { // assignment","            return el;","        }","","        // Inserting before a <base> tag apparently works around an IE bug","        // (according to a comment from pre-3.5.0 Y.Get), but I'm not sure what","        // bug that is, exactly. Better safe than sorry?","        if ((el = doc.getElementsByTagName('base')[0])) { // assignment","            return (cache[docStamp] = el);","        }","","        // Look for a <head> element.","        el = doc.head || doc.getElementsByTagName('head')[0];","","        if (el) {","            // Create a marker node at the end of <head> to use as an insertion","            // point. Inserting before this node will ensure that all our CSS","            // gets inserted in the correct order, to maintain style precedence.","            el.appendChild(doc.createTextNode(''));","            return (cache[docStamp] = el.lastChild);","        }","","        // If all else fails, just insert before the first script node on the","        // page, which is virtually guaranteed to exist.","        return (cache[docStamp] = doc.getElementsByTagName('script')[0]);","    },","","    _insert: function (req) {","        var env          = Get._env,","            insertBefore = this._getInsertBefore(req),","            isScript     = req.type === 'js',","            node         = req.node,","            self         = this,","            ua           = Y.UA,","            cssTimeout, nodeType;","","        if (!node) {","            if (isScript) {","                nodeType = 'script';","            } else if (!env.cssLoad && ua.gecko) {","                nodeType = 'style';","            } else {","                nodeType = 'link';","            }","","            node = req.node = this._createNode(nodeType, req.attributes,","                req.doc);","        }","","        function onError() {","            self._progress('Failed to load ' + req.url, req);","        }","","        function onLoad() {","            if (cssTimeout) {","                clearTimeout(cssTimeout);","            }","","            self._progress(null, req);","        }","","        // Deal with script asynchronicity.","        if (isScript) {","            node.setAttribute('src', req.url);","","            if (req.async) {","                // Explicitly indicate that we want the browser to execute this","                // script asynchronously. This is necessary for older browsers","                // like Firefox <4.","                node.async = true;","            } else {","                if (env.async) {","                    // This browser treats injected scripts as async by default","                    // (standard HTML5 behavior) but asynchronous loading isn't","                    // desired, so tell the browser not to mark this script as","                    // async.","                    node.async = false;","                }","","                // If this browser doesn't preserve script execution order based","                // on insertion order, we'll need to avoid inserting other","                // scripts until this one finishes loading.","                if (!env.preservesScriptOrder) {","                    this._pending = req;","                }","            }","        } else {","            if (!env.cssLoad && ua.gecko) {","                // In Firefox <9, we can import the requested URL into a <style>","                // node and poll for the existence of node.sheet.cssRules. This","                // gives us a reliable way to determine CSS load completion that","                // also works for cross-domain stylesheets.","                //","                // Props to Zach Leatherman for calling my attention to this","                // technique.","                node.innerHTML = (req.attributes.charset ?","                    '@charset \"' + req.attributes.charset + '\";' : '') +","                    '@import \"' + req.url + '\";';","            } else {","                node.setAttribute('href', req.url);","            }","        }","","        // Inject the node.","        if (isScript && ua.ie && (ua.ie < 9 || (document.documentMode && document.documentMode < 9))) {","            // Script on IE < 9, and IE 9+ when in IE 8 or older modes, including quirks mode.","            node.onreadystatechange = function () {","                if (/loaded|complete/.test(node.readyState)) {","                    node.onreadystatechange = null;","                    onLoad();","                }","            };","        } else if (!isScript && !env.cssLoad) {","            // CSS on Firefox <9 or WebKit.","            this._poll(req);","        } else {","            // Script or CSS on everything else. Using DOM 0 events because that","            // evens the playing field with older IEs.","","            if (ua.ie >= 10) {","","                // We currently need to introduce a timeout for IE10, since it ","                // calls onerror/onload synchronously for 304s - messing up existing","                // program flow. ","","                // Remove this block if the following bug gets fixed by GA","                // https://connect.microsoft.com/IE/feedback/details/763871/dynamically-loaded-scripts-with-304s-responses-interrupt-the-currently-executing-js-thread-onload","                node.onerror = function() { setTimeout(onError, 0); };","                node.onload  = function() { setTimeout(onLoad, 0); };","            } else {","                node.onerror = onError;","                node.onload  = onLoad;","            }","","            // If this browser doesn't fire an event when CSS fails to load,","            // fail after a timeout to avoid blocking the transaction queue.","            if (!env.cssFail && !isScript) {","                cssTimeout = setTimeout(onError, req.timeout || 3000);","            }","        }","","        this.nodes.push(node);","        insertBefore.parentNode.insertBefore(node, insertBefore);","    },","","    _next: function () {","        if (this._pending) {","            return;","        }","","        // If there are requests in the queue, insert the next queued request.","        // Otherwise, if we're waiting on already-inserted requests to finish,","        // wait longer. If there are no queued requests and we're not waiting","        // for anything to load, then we're done!","        if (this._queue.length) {","            this._insert(this._queue.shift());","        } else if (!this._reqsWaiting) {","            this._finish();","        }","    },","","    _poll: function (newReq) {","        var self       = this,","            pendingCSS = self._pendingCSS,","            isWebKit   = Y.UA.webkit,","            i, hasRules, j, nodeHref, req, sheets;","","        if (newReq) {","            pendingCSS || (pendingCSS = self._pendingCSS = []);","            pendingCSS.push(newReq);","","            if (self._pollTimer) {","                // A poll timeout is already pending, so no need to create a","                // new one.","                return;","            }","        }","","        self._pollTimer = null;","","        // Note: in both the WebKit and Gecko hacks below, a CSS URL that 404s","        // will still be treated as a success. There's no good workaround for","        // this.","","        for (i = 0; i < pendingCSS.length; ++i) {","            req = pendingCSS[i];","","            if (isWebKit) {","                // Look for a stylesheet matching the pending URL.","                sheets   = req.doc.styleSheets;","                j        = sheets.length;","                nodeHref = req.node.href;","","                while (--j >= 0) {","                    if (sheets[j].href === nodeHref) {","                        pendingCSS.splice(i, 1);","                        i -= 1;","                        self._progress(null, req);","                        break;","                    }","                }","            } else {","                // Many thanks to Zach Leatherman for calling my attention to","                // the @import-based cross-domain technique used here, and to","                // Oleg Slobodskoi for an earlier same-domain implementation.","                //","                // See Zach's blog for more details:","                // http://www.zachleat.com/web/2010/07/29/load-css-dynamically/","                try {","                    // We don't really need to store this value since we never","                    // use it again, but if we don't store it, Closure Compiler","                    // assumes the code is useless and removes it.","                    hasRules = !!req.node.sheet.cssRules;","","                    // If we get here, the stylesheet has loaded.","                    pendingCSS.splice(i, 1);","                    i -= 1;","                    self._progress(null, req);","                } catch (ex) {","                    // An exception means the stylesheet is still loading.","                }","            }","        }","","        if (pendingCSS.length) {","            self._pollTimer = setTimeout(function () {","                self._poll.call(self);","            }, self.options.pollInterval);","        }","    },","","    _progress: function (err, req) {","        var options = this.options;","","        if (err) {","            req.error = err;","","            this.errors.push({","                error  : err,","                request: req","            });","","        }","","        req.node._yuiget_finished = req.finished = true;","","        if (options.onProgress) {","            options.onProgress.call(options.context || this,","                this._getEventData(req));","        }","","        if (req.autopurge) {","            // Pre-3.5.0 Get always excludes the most recent node from an","            // autopurge. I find this odd, but I'm keeping that behavior for","            // the sake of backcompat.","            Get._autoPurge(this.options.purgethreshold);","            Get._purgeNodes.push(req.node);","        }","","        if (this._pending === req) {","            this._pending = null;","        }","","        this._reqsWaiting -= 1;","","        this._next();","    }","};","","","}, '@VERSION@', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/get/get.js"].lines = {"1":0,"13":0,"19":0,"259":0,"262":0,"263":0,"264":0,"265":0,"267":0,"268":0,"269":0,"271":0,"272":0,"274":0,"275":0,"276":0,"277":0,"283":0,"354":0,"430":0,"476":0,"491":0,"492":0,"507":0,"513":0,"547":0,"550":0,"551":0,"554":0,"557":0,"560":0,"561":0,"562":0,"568":0,"569":0,"570":0,"573":0,"574":0,"576":0,"579":0,"584":0,"585":0,"586":0,"588":0,"591":0,"597":0,"601":0,"604":0,"605":0,"607":0,"610":0,"611":0,"614":0,"617":0,"621":0,"624":0,"625":0,"626":0,"629":0,"630":0,"632":0,"634":0,"635":0,"638":0,"640":0,"645":0,"647":0,"651":0,"652":0,"656":0,"658":0,"659":0,"662":0,"664":0,"666":0,"667":0,"672":0,"676":0,"679":0,"680":0,"683":0,"691":0,"692":0,"694":0,"695":0,"708":0,"721":0,"722":0,"724":0,"725":0,"726":0,"727":0,"728":0,"729":0,"731":0,"732":0,"733":0,"736":0,"737":0,"798":0,"800":0,"827":0,"828":0,"829":0,"830":0,"831":0,"833":0,"834":0,"856":0,"861":0,"862":0,"863":0,"865":0,"867":0,"868":0,"872":0,"873":0,"875":0,"876":0,"877":0,"881":0,"883":0,"884":0,"886":0,"888":0,"890":0,"894":0,"907":0,"912":0,"915":0,"920":0,"921":0,"923":0,"929":0,"930":0,"931":0,"935":0,"939":0,"944":0,"945":0,"948":0,"950":0,"951":0,"954":0,"956":0,"957":0,"958":0,"961":0,"962":0,"964":0,"965":0,"968":0,"969":0,"972":0,"973":0,"978":0,"980":0,"988":0,"993":0,"997":0,"998":0,"1001":0,"1002":0,"1004":0,"1005":0,"1011":0,"1012":0,"1016":0,"1018":0,"1022":0,"1023":0,"1028":0,"1032":0,"1040":0,"1041":0,"1042":0,"1043":0,"1044":0,"1046":0,"1049":0,"1053":0,"1054":0,"1057":0,"1058":0,"1059":0,"1062":0,"1066":0,"1067":0,"1069":0,"1073":0,"1075":0,"1080":0,"1086":0,"1087":0,"1091":0,"1099":0,"1103":0,"1108":0,"1110":0,"1111":0,"1112":0,"1113":0,"1116":0,"1118":0,"1123":0,"1131":0,"1132":0,"1134":0,"1135":0,"1140":0,"1141":0,"1145":0,"1146":0,"1150":0,"1151":0,"1158":0,"1159":0,"1160":0,"1161":0,"1166":0,"1171":0,"1172":0,"1173":0,"1175":0,"1178":0,"1182":0,"1188":0,"1189":0,"1191":0,"1193":0,"1194":0,"1195":0,"1197":0,"1198":0,"1199":0,"1200":0,"1201":0,"1202":0,"1212":0,"1216":0,"1219":0,"1220":0,"1221":0,"1228":0,"1229":0,"1230":0,"1236":0,"1238":0,"1239":0,"1241":0,"1248":0,"1250":0,"1251":0,"1255":0,"1259":0,"1260":0,"1263":0,"1264":0,"1267":0,"1269":0};
_yuitest_coverage["build/get/get.js"].functions = {"abort:258":0,"css:353":0,"js:429":0,"load:475":0,"_autoPurge:490":0,"_getEnv:506":0,"_getTransaction:546":0,"_load:620":0,"_onTransactionFinish:650":0,"_next:655":0,"_purge:671":0,"Transaction:721":0,"abort:826":0,"(anonymous 2):876":0,"execute:855":0,"purge:906":0,"_createNode:911":0,"_finish:938":0,"_getEventData:977":0,"_getInsertBefore:992":0,"onError:1053":0,"onLoad:1057":0,"onreadystatechange:1110":0,"onerror:1131":0,"onload:1132":0,"_insert:1031":0,"_next:1149":0,"(anonymous 3):1229":0,"_poll:1165":0,"_progress:1235":0,"(anonymous 1):1":0};
_yuitest_coverage["build/get/get.js"].coveredLines = 260;
_yuitest_coverage["build/get/get.js"].coveredFunctions = 31;
_yuitest_coverline("build/get/get.js", 1);
YUI.add('get', function (Y, NAME) {

/*jslint boss:true, expr:true, laxbreak: true */

/**
Provides dynamic loading of remote JavaScript and CSS resources.

@module get
@class Get
@static
**/

_yuitest_coverfunc("build/get/get.js", "(anonymous 1)", 1);
_yuitest_coverline("build/get/get.js", 13);
var Lang = Y.Lang,

    CUSTOM_ATTRS, // defined lazily in Y.Get.Transaction._createNode()

    Get, Transaction;

_yuitest_coverline("build/get/get.js", 19);
Y.Get = Get = {
    // -- Public Properties ----------------------------------------------------

    /**
    Default options for CSS requests. Options specified here will override
    global defaults for CSS requests.

    See the `options` property for all available options.

    @property cssOptions
    @type Object
    @static
    @since 3.5.0
    **/
    cssOptions: {
        attributes: {
            rel: 'stylesheet'
        },

        doc         : Y.config.linkDoc || Y.config.doc,
        pollInterval: 50
    },

    /**
    Default options for JS requests. Options specified here will override global
    defaults for JS requests.

    See the `options` property for all available options.

    @property jsOptions
    @type Object
    @static
    @since 3.5.0
    **/
    jsOptions: {
        autopurge: true,
        doc      : Y.config.scriptDoc || Y.config.doc
    },

    /**
    Default options to use for all requests.

    Note that while all available options are documented here for ease of
    discovery, some options (like callback functions) only make sense at the
    transaction level.

    Callback functions specified via the options object or the `options`
    parameter of the `css()`, `js()`, or `load()` methods will receive the
    transaction object as a parameter. See `Y.Get.Transaction` for details on
    the properties and methods available on transactions.

    @static
    @since 3.5.0
    @property {Object} options

    @property {Boolean} [options.async=false] Whether or not to load scripts
        asynchronously, meaning they're requested in parallel and execution
        order is not guaranteed. Has no effect on CSS, since CSS is always
        loaded asynchronously.

    @property {Object} [options.attributes] HTML attribute name/value pairs that
        should be added to inserted nodes. By default, the `charset` attribute
        will be set to "utf-8" and nodes will be given an auto-generated `id`
        attribute, but you can override these with your own values if desired.

    @property {Boolean} [options.autopurge] Whether or not to automatically
        purge inserted nodes after the purge threshold is reached. This is
        `true` by default for JavaScript, but `false` for CSS since purging a
        CSS node will also remove any styling applied by the referenced file.

    @property {Object} [options.context] `this` object to use when calling
        callback functions. Defaults to the transaction object.

    @property {Mixed} [options.data] Arbitrary data object to pass to "on*"
        callbacks.

    @property {Document} [options.doc] Document into which nodes should be
        inserted. By default, the current document is used.

    @property {HTMLElement|String} [options.insertBefore] HTML element or id
        string of an element before which all generated nodes should be
        inserted. If not specified, Get will automatically determine the best
        place to insert nodes for maximum compatibility.

    @property {Function} [options.onEnd] Callback to execute after a transaction
        is complete, regardless of whether it succeeded or failed.

    @property {Function} [options.onFailure] Callback to execute after a
        transaction fails, times out, or is aborted.

    @property {Function} [options.onProgress] Callback to execute after each
        individual request in a transaction either succeeds or fails.

    @property {Function} [options.onSuccess] Callback to execute after a
        transaction completes successfully with no errors. Note that in browsers
        that don't support the `error` event on CSS `<link>` nodes, a failed CSS
        request may still be reported as a success because in these browsers
        it can be difficult or impossible to distinguish between success and
        failure for CSS resources.

    @property {Function} [options.onTimeout] Callback to execute after a
        transaction times out.

    @property {Number} [options.pollInterval=50] Polling interval (in
        milliseconds) for detecting CSS load completion in browsers that don't
        support the `load` event on `<link>` nodes. This isn't used for
        JavaScript.

    @property {Number} [options.purgethreshold=20] Number of nodes to insert
        before triggering an automatic purge when `autopurge` is `true`.

    @property {Number} [options.timeout] Number of milliseconds to wait before
        aborting a transaction. When a timeout occurs, the `onTimeout` callback
        is called, followed by `onFailure` and finally `onEnd`. By default,
        there is no timeout.

    @property {String} [options.type] Resource type ("css" or "js"). This option
        is set automatically by the `css()` and `js()` functions and will be
        ignored there, but may be useful when using the `load()` function. If
        not specified, the type will be inferred from the URL, defaulting to
        "js" if the URL doesn't contain a recognizable file extension.
    **/
    options: {
        attributes: {
            charset: 'utf-8'
        },

        purgethreshold: 20
    },

    // -- Protected Properties -------------------------------------------------

    /**
    Regex that matches a CSS URL. Used to guess the file type when it's not
    specified.

    @property REGEX_CSS
    @type RegExp
    @final
    @protected
    @static
    @since 3.5.0
    **/
    REGEX_CSS: /\.css(?:[?;].*)?$/i,

    /**
    Regex that matches a JS URL. Used to guess the file type when it's not
    specified.

    @property REGEX_JS
    @type RegExp
    @final
    @protected
    @static
    @since 3.5.0
    **/
    REGEX_JS : /\.js(?:[?;].*)?$/i,

    /**
    Contains information about the current environment, such as what script and
    link injection features it supports.

    This object is created and populated the first time the `_getEnv()` method
    is called.

    @property _env
    @type Object
    @protected
    @static
    @since 3.5.0
    **/

    /**
    Mapping of document _yuid strings to <head> or <base> node references so we
    don't have to look the node up each time we want to insert a request node.

    @property _insertCache
    @type Object
    @protected
    @static
    @since 3.5.0
    **/
    _insertCache: {},

    /**
    Information about the currently pending transaction, if any.

    This is actually an object with two properties: `callback`, containing the
    optional callback passed to `css()`, `load()`, or `js()`; and `transaction`,
    containing the actual transaction instance.

    @property _pending
    @type Object
    @protected
    @static
    @since 3.5.0
    **/
    _pending: null,

    /**
    HTML nodes eligible to be purged next time autopurge is triggered.

    @property _purgeNodes
    @type HTMLElement[]
    @protected
    @static
    @since 3.5.0
    **/
    _purgeNodes: [],

    /**
    Queued transactions and associated callbacks.

    @property _queue
    @type Object[]
    @protected
    @static
    @since 3.5.0
    **/
    _queue: [],

    // -- Public Methods -------------------------------------------------------

    /**
    Aborts the specified transaction.

    This will cause the transaction's `onFailure` callback to be called and
    will prevent any new script and link nodes from being added to the document,
    but any resources that have already been requested will continue loading
    (there's no safe way to prevent this, unfortunately).

    *Note:* This method is deprecated as of 3.5.0, and will be removed in a
    future version of YUI. Use the transaction-level `abort()` method instead.

    @method abort
    @param {Get.Transaction} transaction Transaction to abort.
    @deprecated Use the `abort()` method on the transaction instead.
    @static
    **/
    abort: function (transaction) {
        _yuitest_coverfunc("build/get/get.js", "abort", 258);
_yuitest_coverline("build/get/get.js", 259);
var i, id, item, len, pending;


        _yuitest_coverline("build/get/get.js", 262);
if (!transaction.abort) {
            _yuitest_coverline("build/get/get.js", 263);
id          = transaction;
            _yuitest_coverline("build/get/get.js", 264);
pending     = this._pending;
            _yuitest_coverline("build/get/get.js", 265);
transaction = null;

            _yuitest_coverline("build/get/get.js", 267);
if (pending && pending.transaction.id === id) {
                _yuitest_coverline("build/get/get.js", 268);
transaction   = pending.transaction;
                _yuitest_coverline("build/get/get.js", 269);
this._pending = null;
            } else {
                _yuitest_coverline("build/get/get.js", 271);
for (i = 0, len = this._queue.length; i < len; ++i) {
                    _yuitest_coverline("build/get/get.js", 272);
item = this._queue[i].transaction;

                    _yuitest_coverline("build/get/get.js", 274);
if (item.id === id) {
                        _yuitest_coverline("build/get/get.js", 275);
transaction = item;
                        _yuitest_coverline("build/get/get.js", 276);
this._queue.splice(i, 1);
                        _yuitest_coverline("build/get/get.js", 277);
break;
                    }
                }
            }
        }

        _yuitest_coverline("build/get/get.js", 283);
transaction && transaction.abort();
    },

    /**
    Loads one or more CSS files.

    The _urls_ parameter may be provided as a URL string, a request object,
    or an array of URL strings and/or request objects.

    A request object is just an object that contains a `url` property and zero
    or more options that should apply specifically to that request.
    Request-specific options take priority over transaction-level options and
    default options.

    URLs may be relative or absolute, and do not have to have the same origin
    as the current page.

    The `options` parameter may be omitted completely and a callback passed in
    its place, if desired.

    @example

        // Load a single CSS file and log a message on completion.
        Y.Get.css('foo.css', function (err) {
            if (err) {
            } else {
            }
        });

        // Load multiple CSS files and log a message when all have finished
        // loading.
        var urls = ['foo.css', 'http://example.com/bar.css', 'baz/quux.css'];

        Y.Get.css(urls, function (err) {
            if (err) {
            } else {
            }
        });

        // Specify transaction-level options, which will apply to all requests
        // within the transaction.
        Y.Get.css(urls, {
            attributes: {'class': 'my-css'},
            timeout   : 5000
        });

        // Specify per-request options, which override transaction-level and
        // default options.
        Y.Get.css([
            {url: 'foo.css', attributes: {id: 'foo'}},
            {url: 'bar.css', attributes: {id: 'bar', charset: 'iso-8859-1'}}
        ]);

    @method css
    @param {String|Object|Array} urls URL string, request object, or array
        of URLs and/or request objects to load.
    @param {Object} [options] Options for this transaction. See the
        `Y.Get.options` property for a complete list of available options.
    @param {Function} [callback] Callback function to be called on completion.
        This is a general callback and will be called before any more granular
        callbacks (`onSuccess`, `onFailure`, etc.) specified in the `options`
        object.

        @param {Array|null} callback.err Array of errors that occurred during
            the transaction, or `null` on success.
        @param {Get.Transaction} callback.transaction Transaction object.

    @return {Get.Transaction} Transaction object.
    @static
    **/
    css: function (urls, options, callback) {
        _yuitest_coverfunc("build/get/get.js", "css", 353);
_yuitest_coverline("build/get/get.js", 354);
return this._load('css', urls, options, callback);
    },

    /**
    Loads one or more JavaScript resources.

    The _urls_ parameter may be provided as a URL string, a request object,
    or an array of URL strings and/or request objects.

    A request object is just an object that contains a `url` property and zero
    or more options that should apply specifically to that request.
    Request-specific options take priority over transaction-level options and
    default options.

    URLs may be relative or absolute, and do not have to have the same origin
    as the current page.

    The `options` parameter may be omitted completely and a callback passed in
    its place, if desired.

    Scripts will be executed in the order they're specified unless the `async`
    option is `true`, in which case they'll be loaded in parallel and executed
    in whatever order they finish loading.

    @example

        // Load a single JS file and log a message on completion.
        Y.Get.js('foo.js', function (err) {
            if (err) {
            } else {
            }
        });

        // Load multiple JS files, execute them in order, and log a message when
        // all have finished loading.
        var urls = ['foo.js', 'http://example.com/bar.js', 'baz/quux.js'];

        Y.Get.js(urls, function (err) {
            if (err) {
            } else {
            }
        });

        // Specify transaction-level options, which will apply to all requests
        // within the transaction.
        Y.Get.js(urls, {
            attributes: {'class': 'my-js'},
            timeout   : 5000
        });

        // Specify per-request options, which override transaction-level and
        // default options.
        Y.Get.js([
            {url: 'foo.js', attributes: {id: 'foo'}},
            {url: 'bar.js', attributes: {id: 'bar', charset: 'iso-8859-1'}}
        ]);

    @method js
    @param {String|Object|Array} urls URL string, request object, or array
        of URLs and/or request objects to load.
    @param {Object} [options] Options for this transaction. See the
        `Y.Get.options` property for a complete list of available options.
    @param {Function} [callback] Callback function to be called on completion.
        This is a general callback and will be called before any more granular
        callbacks (`onSuccess`, `onFailure`, etc.) specified in the `options`
        object.

        @param {Array|null} callback.err Array of errors that occurred during
            the transaction, or `null` on success.
        @param {Get.Transaction} callback.transaction Transaction object.

    @return {Get.Transaction} Transaction object.
    @since 3.5.0
    @static
    **/
    js: function (urls, options, callback) {
        _yuitest_coverfunc("build/get/get.js", "js", 429);
_yuitest_coverline("build/get/get.js", 430);
return this._load('js', urls, options, callback);
    },

    /**
    Loads one or more CSS and/or JavaScript resources in the same transaction.

    Use this method when you want to load both CSS and JavaScript in a single
    transaction and be notified when all requested URLs have finished loading,
    regardless of type.

    Behavior and options are the same as for the `css()` and `js()` methods. If
    a resource type isn't specified in per-request options or transaction-level
    options, Get will guess the file type based on the URL's extension (`.css`
    or `.js`, with or without a following query string). If the file type can't
    be guessed from the URL, a warning will be logged and Get will assume the
    URL is a JavaScript resource.

    @example

        // Load both CSS and JS files in a single transaction, and log a message
        // when all files have finished loading.
        Y.Get.load(['foo.css', 'bar.js', 'baz.css'], function (err) {
            if (err) {
            } else {
            }
        });

    @method load
    @param {String|Object|Array} urls URL string, request object, or array
        of URLs and/or request objects to load.
    @param {Object} [options] Options for this transaction. See the
        `Y.Get.options` property for a complete list of available options.
    @param {Function} [callback] Callback function to be called on completion.
        This is a general callback and will be called before any more granular
        callbacks (`onSuccess`, `onFailure`, etc.) specified in the `options`
        object.

        @param {Array|null} err Array of errors that occurred during the
            transaction, or `null` on success.
        @param {Get.Transaction} Transaction object.

    @return {Get.Transaction} Transaction object.
    @since 3.5.0
    @static
    **/
    load: function (urls, options, callback) {
        _yuitest_coverfunc("build/get/get.js", "load", 475);
_yuitest_coverline("build/get/get.js", 476);
return this._load(null, urls, options, callback);
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Triggers an automatic purge if the purge threshold has been reached.

    @method _autoPurge
    @param {Number} threshold Purge threshold to use, in milliseconds.
    @protected
    @since 3.5.0
    @static
    **/
    _autoPurge: function (threshold) {
        _yuitest_coverfunc("build/get/get.js", "_autoPurge", 490);
_yuitest_coverline("build/get/get.js", 491);
if (threshold && this._purgeNodes.length >= threshold) {
            _yuitest_coverline("build/get/get.js", 492);
this._purge(this._purgeNodes);
        }
    },

    /**
    Populates the `_env` property with information about the current
    environment.

    @method _getEnv
    @return {Object} Environment information.
    @protected
    @since 3.5.0
    @static
    **/
    _getEnv: function () {
        _yuitest_coverfunc("build/get/get.js", "_getEnv", 506);
_yuitest_coverline("build/get/get.js", 507);
var doc = Y.config.doc,
            ua  = Y.UA;

        // Note: some of these checks require browser sniffs since it's not
        // feasible to load test files on every pageview just to perform a
        // feature test. I'm sorry if this makes you sad.
        _yuitest_coverline("build/get/get.js", 513);
return (this._env = {

            // True if this is a browser that supports disabling async mode on
            // dynamically created script nodes. See
            // https://developer.mozilla.org/En/HTML/Element/Script#Attributes

            // IE10 doesn't return true for the MDN feature test, so setting it explicitly,
            // because it is async by default, and allows you to disable async by setting it to false
            async: (doc && doc.createElement('script').async === true) || (ua.ie >= 10),

            // True if this browser fires an event when a dynamically injected
            // link node fails to load. This is currently true for Firefox 9+
            // and WebKit 535.24+
            cssFail: ua.gecko >= 9 || ua.compareVersions(ua.webkit, 535.24) >= 0,

            // True if this browser fires an event when a dynamically injected
            // link node finishes loading. This is currently true for IE, Opera,
            // Firefox 9+, and WebKit 535.24+. Note that IE versions <9 fire the
            // DOM 0 "onload" event, but not "load". All versions of IE fire
            // "onload".
            // davglass: Seems that Chrome on Android needs this to be false.
            cssLoad: (
                    (!ua.gecko && !ua.webkit) || ua.gecko >= 9 ||
                    ua.compareVersions(ua.webkit, 535.24) >= 0
                ) && !(ua.chrome && ua.chrome <= 18),

            // True if this browser preserves script execution order while
            // loading scripts in parallel as long as the script node's `async`
            // attribute is set to false to explicitly disable async execution.
            preservesScriptOrder: !!(ua.gecko || ua.opera || (ua.ie && ua.ie >= 10))
        });
    },

    _getTransaction: function (urls, options) {
        _yuitest_coverfunc("build/get/get.js", "_getTransaction", 546);
_yuitest_coverline("build/get/get.js", 547);
var requests = [],
            i, len, req, url;

        _yuitest_coverline("build/get/get.js", 550);
if (!Lang.isArray(urls)) {
            _yuitest_coverline("build/get/get.js", 551);
urls = [urls];
        }

        _yuitest_coverline("build/get/get.js", 554);
options = Y.merge(this.options, options);

        // Clone the attributes object so we don't end up modifying it by ref.
        _yuitest_coverline("build/get/get.js", 557);
options.attributes = Y.merge(this.options.attributes,
                options.attributes);

        _yuitest_coverline("build/get/get.js", 560);
for (i = 0, len = urls.length; i < len; ++i) {
            _yuitest_coverline("build/get/get.js", 561);
url = urls[i];
            _yuitest_coverline("build/get/get.js", 562);
req = {attributes: {}};

            // If `url` is a string, we create a URL object for it, then mix in
            // global options and request-specific options. If it's an object
            // with a "url" property, we assume it's a request object containing
            // URL-specific options.
            _yuitest_coverline("build/get/get.js", 568);
if (typeof url === 'string') {
                _yuitest_coverline("build/get/get.js", 569);
req.url = url;
            } else {_yuitest_coverline("build/get/get.js", 570);
if (url.url) {
                // URL-specific options override both global defaults and
                // request-specific options.
                _yuitest_coverline("build/get/get.js", 573);
Y.mix(req, url, false, null, 0, true);
                _yuitest_coverline("build/get/get.js", 574);
url = url.url; // Make url a string so we can use it later.
            } else {
                _yuitest_coverline("build/get/get.js", 576);
continue;
            }}

            _yuitest_coverline("build/get/get.js", 579);
Y.mix(req, options, false, null, 0, true);

            // If we didn't get an explicit type for this URL either in the
            // request options or the URL-specific options, try to determine
            // one from the file extension.
            _yuitest_coverline("build/get/get.js", 584);
if (!req.type) {
                _yuitest_coverline("build/get/get.js", 585);
if (this.REGEX_CSS.test(url)) {
                    _yuitest_coverline("build/get/get.js", 586);
req.type = 'css';
                } else {
                    _yuitest_coverline("build/get/get.js", 588);
if (!this.REGEX_JS.test(url)) {
                    }

                    _yuitest_coverline("build/get/get.js", 591);
req.type = 'js';
                }
            }

            // Mix in type-specific default options, but don't overwrite any
            // options that have already been set.
            _yuitest_coverline("build/get/get.js", 597);
Y.mix(req, req.type === 'js' ? this.jsOptions : this.cssOptions,
                false, null, 0, true);

            // Give the node an id attribute if it doesn't already have one.
            _yuitest_coverline("build/get/get.js", 601);
req.attributes.id || (req.attributes.id = Y.guid());

            // Backcompat for <3.5.0 behavior.
            _yuitest_coverline("build/get/get.js", 604);
if (req.win) {
                _yuitest_coverline("build/get/get.js", 605);
req.doc = req.win.document;
            } else {
                _yuitest_coverline("build/get/get.js", 607);
req.win = req.doc.defaultView || req.doc.parentWindow;
            }

            _yuitest_coverline("build/get/get.js", 610);
if (req.charset) {
                _yuitest_coverline("build/get/get.js", 611);
req.attributes.charset = req.charset;
            }

            _yuitest_coverline("build/get/get.js", 614);
requests.push(req);
        }

        _yuitest_coverline("build/get/get.js", 617);
return new Transaction(requests, options);
    },

    _load: function (type, urls, options, callback) {
        _yuitest_coverfunc("build/get/get.js", "_load", 620);
_yuitest_coverline("build/get/get.js", 621);
var transaction;

        // Allow callback as third param.
        _yuitest_coverline("build/get/get.js", 624);
if (typeof options === 'function') {
            _yuitest_coverline("build/get/get.js", 625);
callback = options;
            _yuitest_coverline("build/get/get.js", 626);
options  = {};
        }

        _yuitest_coverline("build/get/get.js", 629);
options || (options = {});
        _yuitest_coverline("build/get/get.js", 630);
options.type = type;

        _yuitest_coverline("build/get/get.js", 632);
options._onFinish = Get._onTransactionFinish;

        _yuitest_coverline("build/get/get.js", 634);
if (!this._env) {
            _yuitest_coverline("build/get/get.js", 635);
this._getEnv();
        }

        _yuitest_coverline("build/get/get.js", 638);
transaction = this._getTransaction(urls, options);

        _yuitest_coverline("build/get/get.js", 640);
this._queue.push({
            callback   : callback,
            transaction: transaction
        });

        _yuitest_coverline("build/get/get.js", 645);
this._next();

        _yuitest_coverline("build/get/get.js", 647);
return transaction;
    },

    _onTransactionFinish : function() {
        _yuitest_coverfunc("build/get/get.js", "_onTransactionFinish", 650);
_yuitest_coverline("build/get/get.js", 651);
Get._pending = null;
        _yuitest_coverline("build/get/get.js", 652);
Get._next();
    },

    _next: function () {
        _yuitest_coverfunc("build/get/get.js", "_next", 655);
_yuitest_coverline("build/get/get.js", 656);
var item;

        _yuitest_coverline("build/get/get.js", 658);
if (this._pending) {
            _yuitest_coverline("build/get/get.js", 659);
return;
        }

        _yuitest_coverline("build/get/get.js", 662);
item = this._queue.shift();

        _yuitest_coverline("build/get/get.js", 664);
if (item) {
            // this._pending = item; 
            _yuitest_coverline("build/get/get.js", 666);
this._pending = item.transaction.options.async ? null : item;
            _yuitest_coverline("build/get/get.js", 667);
item.transaction.execute(item.callback);
        }
    },

    _purge: function (nodes) {
        _yuitest_coverfunc("build/get/get.js", "_purge", 671);
_yuitest_coverline("build/get/get.js", 672);
var purgeNodes    = this._purgeNodes,
            isTransaction = nodes !== purgeNodes,
            index, node;

        _yuitest_coverline("build/get/get.js", 676);
while (node = nodes.pop()) { // assignment
            // Don't purge nodes that haven't finished loading (or errored out),
            // since this can hang the transaction.
            _yuitest_coverline("build/get/get.js", 679);
if (!node._yuiget_finished) {
                _yuitest_coverline("build/get/get.js", 680);
continue;
            }

            _yuitest_coverline("build/get/get.js", 683);
node.parentNode && node.parentNode.removeChild(node);

            // If this is a transaction-level purge and this node also exists in
            // the Get-level _purgeNodes array, we need to remove it from
            // _purgeNodes to avoid creating a memory leak. The indexOf lookup
            // sucks, but until we get WeakMaps, this is the least troublesome
            // way to do this (we can't just hold onto node ids because they may
            // not be in the same document).
            _yuitest_coverline("build/get/get.js", 691);
if (isTransaction) {
                _yuitest_coverline("build/get/get.js", 692);
index = Y.Array.indexOf(purgeNodes, node);

                _yuitest_coverline("build/get/get.js", 694);
if (index > -1) {
                    _yuitest_coverline("build/get/get.js", 695);
purgeNodes.splice(index, 1);
                }
            }
        }
    }
};

/**
Alias for `js()`.

@method script
@static
**/
_yuitest_coverline("build/get/get.js", 708);
Get.script = Get.js;

/**
Represents a Get transaction, which may contain requests for one or more JS or
CSS files.

This class should not be instantiated manually. Instances will be created and
returned as needed by Y.Get's `css()`, `js()`, and `load()` methods.

@class Get.Transaction
@constructor
@since 3.5.0
**/
_yuitest_coverline("build/get/get.js", 721);
Get.Transaction = Transaction = function (requests, options) {
    _yuitest_coverfunc("build/get/get.js", "Transaction", 721);
_yuitest_coverline("build/get/get.js", 722);
var self = this;

    _yuitest_coverline("build/get/get.js", 724);
self.id       = Transaction._lastId += 1;
    _yuitest_coverline("build/get/get.js", 725);
self.data     = options.data;
    _yuitest_coverline("build/get/get.js", 726);
self.errors   = [];
    _yuitest_coverline("build/get/get.js", 727);
self.nodes    = [];
    _yuitest_coverline("build/get/get.js", 728);
self.options  = options;
    _yuitest_coverline("build/get/get.js", 729);
self.requests = requests;

    _yuitest_coverline("build/get/get.js", 731);
self._callbacks = []; // callbacks to call after execution finishes
    _yuitest_coverline("build/get/get.js", 732);
self._queue     = [];
    _yuitest_coverline("build/get/get.js", 733);
self._reqsWaiting   = 0;

    // Deprecated pre-3.5.0 properties.
    _yuitest_coverline("build/get/get.js", 736);
self.tId = self.id; // Use `id` instead.
    _yuitest_coverline("build/get/get.js", 737);
self.win = options.win || Y.config.win;
};

/**
Arbitrary data object associated with this transaction.

This object comes from the options passed to `Get.css()`, `Get.js()`, or
`Get.load()`, and will be `undefined` if no data object was specified.

@property {Object} data
**/

/**
Array of errors that have occurred during this transaction, if any.

@since 3.5.0
@property {Object[]} errors
@property {String} errors.error Error message.
@property {Object} errors.request Request object related to the error.
**/

/**
Numeric id for this transaction, unique among all transactions within the same
YUI sandbox in the current pageview.

@property {Number} id
@since 3.5.0
**/

/**
HTMLElement nodes (native ones, not YUI Node instances) that have been inserted
during the current transaction.

@property {HTMLElement[]} nodes
**/

/**
Options associated with this transaction.

See `Get.options` for the full list of available options.

@property {Object} options
@since 3.5.0
**/

/**
Request objects contained in this transaction. Each request object represents
one CSS or JS URL that will be (or has been) requested and loaded into the page.

@property {Object} requests
@since 3.5.0
**/

/**
Id of the most recent transaction.

@property _lastId
@type Number
@protected
@static
**/
_yuitest_coverline("build/get/get.js", 798);
Transaction._lastId = 0;

_yuitest_coverline("build/get/get.js", 800);
Transaction.prototype = {
    // -- Public Properties ----------------------------------------------------

    /**
    Current state of this transaction. One of "new", "executing", or "done".

    @property _state
    @type String
    @protected
    **/
    _state: 'new', // "new", "executing", or "done"

    // -- Public Methods -------------------------------------------------------

    /**
    Aborts this transaction.

    This will cause the transaction's `onFailure` callback to be called and
    will prevent any new script and link nodes from being added to the document,
    but any resources that have already been requested will continue loading
    (there's no safe way to prevent this, unfortunately).

    @method abort
    @param {String} [msg="Aborted."] Optional message to use in the `errors`
        array describing why the transaction was aborted.
    **/
    abort: function (msg) {
        _yuitest_coverfunc("build/get/get.js", "abort", 826);
_yuitest_coverline("build/get/get.js", 827);
this._pending    = null;
        _yuitest_coverline("build/get/get.js", 828);
this._pendingCSS = null;
        _yuitest_coverline("build/get/get.js", 829);
this._pollTimer  = clearTimeout(this._pollTimer);
        _yuitest_coverline("build/get/get.js", 830);
this._queue      = [];
        _yuitest_coverline("build/get/get.js", 831);
this._reqsWaiting    = 0;

        _yuitest_coverline("build/get/get.js", 833);
this.errors.push({error: msg || 'Aborted'});
        _yuitest_coverline("build/get/get.js", 834);
this._finish();
    },

    /**
    Begins execting the transaction.

    There's usually no reason to call this manually, since Get will call it
    automatically when other pending transactions have finished. If you really
    want to execute your transaction before Get does, you can, but be aware that
    this transaction's scripts may end up executing before the scripts in other
    pending transactions.

    If the transaction is already executing, the specified callback (if any)
    will be queued and called after execution finishes. If the transaction has
    already finished, the callback will be called immediately (the transaction
    will not be executed again).

    @method execute
    @param {Function} callback Callback function to execute after all requests
        in the transaction are complete, or after the transaction is aborted.
    **/
    execute: function (callback) {
        _yuitest_coverfunc("build/get/get.js", "execute", 855);
_yuitest_coverline("build/get/get.js", 856);
var self     = this,
            requests = self.requests,
            state    = self._state,
            i, len, queue, req;

        _yuitest_coverline("build/get/get.js", 861);
if (state === 'done') {
            _yuitest_coverline("build/get/get.js", 862);
callback && callback(self.errors.length ? self.errors : null, self);
            _yuitest_coverline("build/get/get.js", 863);
return;
        } else {
            _yuitest_coverline("build/get/get.js", 865);
callback && self._callbacks.push(callback);

            _yuitest_coverline("build/get/get.js", 867);
if (state === 'executing') {
                _yuitest_coverline("build/get/get.js", 868);
return;
            }
        }

        _yuitest_coverline("build/get/get.js", 872);
self._state = 'executing';
        _yuitest_coverline("build/get/get.js", 873);
self._queue = queue = [];

        _yuitest_coverline("build/get/get.js", 875);
if (self.options.timeout) {
            _yuitest_coverline("build/get/get.js", 876);
self._timeout = setTimeout(function () {
                _yuitest_coverfunc("build/get/get.js", "(anonymous 2)", 876);
_yuitest_coverline("build/get/get.js", 877);
self.abort('Timeout');
            }, self.options.timeout);
        }

        _yuitest_coverline("build/get/get.js", 881);
self._reqsWaiting = requests.length;

        _yuitest_coverline("build/get/get.js", 883);
for (i = 0, len = requests.length; i < len; ++i) {
            _yuitest_coverline("build/get/get.js", 884);
req = requests[i];

            _yuitest_coverline("build/get/get.js", 886);
if (req.async || req.type === 'css') {
                // No need to queue CSS or fully async JS.
                _yuitest_coverline("build/get/get.js", 888);
self._insert(req);
            } else {
                _yuitest_coverline("build/get/get.js", 890);
queue.push(req);
            }
        }

        _yuitest_coverline("build/get/get.js", 894);
self._next();
    },

    /**
    Manually purges any `<script>` or `<link>` nodes this transaction has
    created.

    Be careful when purging a transaction that contains CSS requests, since
    removing `<link>` nodes will also remove any styles they applied.

    @method purge
    **/
    purge: function () {
        _yuitest_coverfunc("build/get/get.js", "purge", 906);
_yuitest_coverline("build/get/get.js", 907);
Get._purge(this.nodes);
    },

    // -- Protected Methods ----------------------------------------------------
    _createNode: function (name, attrs, doc) {
        _yuitest_coverfunc("build/get/get.js", "_createNode", 911);
_yuitest_coverline("build/get/get.js", 912);
var node = doc.createElement(name),
            attr, testEl;

        _yuitest_coverline("build/get/get.js", 915);
if (!CUSTOM_ATTRS) {
            // IE6 and IE7 expect property names rather than attribute names for
            // certain attributes. Rather than sniffing, we do a quick feature
            // test the first time _createNode() runs to determine whether we
            // need to provide a workaround.
            _yuitest_coverline("build/get/get.js", 920);
testEl = doc.createElement('div');
            _yuitest_coverline("build/get/get.js", 921);
testEl.setAttribute('class', 'a');

            _yuitest_coverline("build/get/get.js", 923);
CUSTOM_ATTRS = testEl.className === 'a' ? {} : {
                'for'  : 'htmlFor',
                'class': 'className'
            };
        }

        _yuitest_coverline("build/get/get.js", 929);
for (attr in attrs) {
            _yuitest_coverline("build/get/get.js", 930);
if (attrs.hasOwnProperty(attr)) {
                _yuitest_coverline("build/get/get.js", 931);
node.setAttribute(CUSTOM_ATTRS[attr] || attr, attrs[attr]);
            }
        }

        _yuitest_coverline("build/get/get.js", 935);
return node;
    },

    _finish: function () {
        _yuitest_coverfunc("build/get/get.js", "_finish", 938);
_yuitest_coverline("build/get/get.js", 939);
var errors  = this.errors.length ? this.errors : null,
            options = this.options,
            thisObj = options.context || this,
            data, i, len;

        _yuitest_coverline("build/get/get.js", 944);
if (this._state === 'done') {
            _yuitest_coverline("build/get/get.js", 945);
return;
        }

        _yuitest_coverline("build/get/get.js", 948);
this._state = 'done';

        _yuitest_coverline("build/get/get.js", 950);
for (i = 0, len = this._callbacks.length; i < len; ++i) {
            _yuitest_coverline("build/get/get.js", 951);
this._callbacks[i].call(thisObj, errors, this);
        }

        _yuitest_coverline("build/get/get.js", 954);
data = this._getEventData();

        _yuitest_coverline("build/get/get.js", 956);
if (errors) {
            _yuitest_coverline("build/get/get.js", 957);
if (options.onTimeout && errors[errors.length - 1].error === 'Timeout') {
                _yuitest_coverline("build/get/get.js", 958);
options.onTimeout.call(thisObj, data);
            }

            _yuitest_coverline("build/get/get.js", 961);
if (options.onFailure) {
                _yuitest_coverline("build/get/get.js", 962);
options.onFailure.call(thisObj, data);
            }
        } else {_yuitest_coverline("build/get/get.js", 964);
if (options.onSuccess) {
            _yuitest_coverline("build/get/get.js", 965);
options.onSuccess.call(thisObj, data);
        }}

        _yuitest_coverline("build/get/get.js", 968);
if (options.onEnd) {
            _yuitest_coverline("build/get/get.js", 969);
options.onEnd.call(thisObj, data);
        }

        _yuitest_coverline("build/get/get.js", 972);
if (options._onFinish) {
            _yuitest_coverline("build/get/get.js", 973);
options._onFinish();
        }
    },

    _getEventData: function (req) {
        _yuitest_coverfunc("build/get/get.js", "_getEventData", 977);
_yuitest_coverline("build/get/get.js", 978);
if (req) {
            // This merge is necessary for backcompat. I hate it.
            _yuitest_coverline("build/get/get.js", 980);
return Y.merge(this, {
                abort  : this.abort, // have to copy these because the prototype isn't preserved
                purge  : this.purge,
                request: req,
                url    : req.url,
                win    : req.win
            });
        } else {
            _yuitest_coverline("build/get/get.js", 988);
return this;
        }
    },

    _getInsertBefore: function (req) {
        _yuitest_coverfunc("build/get/get.js", "_getInsertBefore", 992);
_yuitest_coverline("build/get/get.js", 993);
var doc = req.doc,
            el  = req.insertBefore,
            cache, cachedNode, docStamp;

        _yuitest_coverline("build/get/get.js", 997);
if (el) {
            _yuitest_coverline("build/get/get.js", 998);
return typeof el === 'string' ? doc.getElementById(el) : el;
        }

        _yuitest_coverline("build/get/get.js", 1001);
cache    = Get._insertCache;
        _yuitest_coverline("build/get/get.js", 1002);
docStamp = Y.stamp(doc);

        _yuitest_coverline("build/get/get.js", 1004);
if ((el = cache[docStamp])) { // assignment
            _yuitest_coverline("build/get/get.js", 1005);
return el;
        }

        // Inserting before a <base> tag apparently works around an IE bug
        // (according to a comment from pre-3.5.0 Y.Get), but I'm not sure what
        // bug that is, exactly. Better safe than sorry?
        _yuitest_coverline("build/get/get.js", 1011);
if ((el = doc.getElementsByTagName('base')[0])) { // assignment
            _yuitest_coverline("build/get/get.js", 1012);
return (cache[docStamp] = el);
        }

        // Look for a <head> element.
        _yuitest_coverline("build/get/get.js", 1016);
el = doc.head || doc.getElementsByTagName('head')[0];

        _yuitest_coverline("build/get/get.js", 1018);
if (el) {
            // Create a marker node at the end of <head> to use as an insertion
            // point. Inserting before this node will ensure that all our CSS
            // gets inserted in the correct order, to maintain style precedence.
            _yuitest_coverline("build/get/get.js", 1022);
el.appendChild(doc.createTextNode(''));
            _yuitest_coverline("build/get/get.js", 1023);
return (cache[docStamp] = el.lastChild);
        }

        // If all else fails, just insert before the first script node on the
        // page, which is virtually guaranteed to exist.
        _yuitest_coverline("build/get/get.js", 1028);
return (cache[docStamp] = doc.getElementsByTagName('script')[0]);
    },

    _insert: function (req) {
        _yuitest_coverfunc("build/get/get.js", "_insert", 1031);
_yuitest_coverline("build/get/get.js", 1032);
var env          = Get._env,
            insertBefore = this._getInsertBefore(req),
            isScript     = req.type === 'js',
            node         = req.node,
            self         = this,
            ua           = Y.UA,
            cssTimeout, nodeType;

        _yuitest_coverline("build/get/get.js", 1040);
if (!node) {
            _yuitest_coverline("build/get/get.js", 1041);
if (isScript) {
                _yuitest_coverline("build/get/get.js", 1042);
nodeType = 'script';
            } else {_yuitest_coverline("build/get/get.js", 1043);
if (!env.cssLoad && ua.gecko) {
                _yuitest_coverline("build/get/get.js", 1044);
nodeType = 'style';
            } else {
                _yuitest_coverline("build/get/get.js", 1046);
nodeType = 'link';
            }}

            _yuitest_coverline("build/get/get.js", 1049);
node = req.node = this._createNode(nodeType, req.attributes,
                req.doc);
        }

        _yuitest_coverline("build/get/get.js", 1053);
function onError() {
            _yuitest_coverfunc("build/get/get.js", "onError", 1053);
_yuitest_coverline("build/get/get.js", 1054);
self._progress('Failed to load ' + req.url, req);
        }

        _yuitest_coverline("build/get/get.js", 1057);
function onLoad() {
            _yuitest_coverfunc("build/get/get.js", "onLoad", 1057);
_yuitest_coverline("build/get/get.js", 1058);
if (cssTimeout) {
                _yuitest_coverline("build/get/get.js", 1059);
clearTimeout(cssTimeout);
            }

            _yuitest_coverline("build/get/get.js", 1062);
self._progress(null, req);
        }

        // Deal with script asynchronicity.
        _yuitest_coverline("build/get/get.js", 1066);
if (isScript) {
            _yuitest_coverline("build/get/get.js", 1067);
node.setAttribute('src', req.url);

            _yuitest_coverline("build/get/get.js", 1069);
if (req.async) {
                // Explicitly indicate that we want the browser to execute this
                // script asynchronously. This is necessary for older browsers
                // like Firefox <4.
                _yuitest_coverline("build/get/get.js", 1073);
node.async = true;
            } else {
                _yuitest_coverline("build/get/get.js", 1075);
if (env.async) {
                    // This browser treats injected scripts as async by default
                    // (standard HTML5 behavior) but asynchronous loading isn't
                    // desired, so tell the browser not to mark this script as
                    // async.
                    _yuitest_coverline("build/get/get.js", 1080);
node.async = false;
                }

                // If this browser doesn't preserve script execution order based
                // on insertion order, we'll need to avoid inserting other
                // scripts until this one finishes loading.
                _yuitest_coverline("build/get/get.js", 1086);
if (!env.preservesScriptOrder) {
                    _yuitest_coverline("build/get/get.js", 1087);
this._pending = req;
                }
            }
        } else {
            _yuitest_coverline("build/get/get.js", 1091);
if (!env.cssLoad && ua.gecko) {
                // In Firefox <9, we can import the requested URL into a <style>
                // node and poll for the existence of node.sheet.cssRules. This
                // gives us a reliable way to determine CSS load completion that
                // also works for cross-domain stylesheets.
                //
                // Props to Zach Leatherman for calling my attention to this
                // technique.
                _yuitest_coverline("build/get/get.js", 1099);
node.innerHTML = (req.attributes.charset ?
                    '@charset "' + req.attributes.charset + '";' : '') +
                    '@import "' + req.url + '";';
            } else {
                _yuitest_coverline("build/get/get.js", 1103);
node.setAttribute('href', req.url);
            }
        }

        // Inject the node.
        _yuitest_coverline("build/get/get.js", 1108);
if (isScript && ua.ie && (ua.ie < 9 || (document.documentMode && document.documentMode < 9))) {
            // Script on IE < 9, and IE 9+ when in IE 8 or older modes, including quirks mode.
            _yuitest_coverline("build/get/get.js", 1110);
node.onreadystatechange = function () {
                _yuitest_coverfunc("build/get/get.js", "onreadystatechange", 1110);
_yuitest_coverline("build/get/get.js", 1111);
if (/loaded|complete/.test(node.readyState)) {
                    _yuitest_coverline("build/get/get.js", 1112);
node.onreadystatechange = null;
                    _yuitest_coverline("build/get/get.js", 1113);
onLoad();
                }
            };
        } else {_yuitest_coverline("build/get/get.js", 1116);
if (!isScript && !env.cssLoad) {
            // CSS on Firefox <9 or WebKit.
            _yuitest_coverline("build/get/get.js", 1118);
this._poll(req);
        } else {
            // Script or CSS on everything else. Using DOM 0 events because that
            // evens the playing field with older IEs.

            _yuitest_coverline("build/get/get.js", 1123);
if (ua.ie >= 10) {

                // We currently need to introduce a timeout for IE10, since it 
                // calls onerror/onload synchronously for 304s - messing up existing
                // program flow. 

                // Remove this block if the following bug gets fixed by GA
                // https://connect.microsoft.com/IE/feedback/details/763871/dynamically-loaded-scripts-with-304s-responses-interrupt-the-currently-executing-js-thread-onload
                _yuitest_coverline("build/get/get.js", 1131);
node.onerror = function() { _yuitest_coverfunc("build/get/get.js", "onerror", 1131);
setTimeout(onError, 0); };
                _yuitest_coverline("build/get/get.js", 1132);
node.onload  = function() { _yuitest_coverfunc("build/get/get.js", "onload", 1132);
setTimeout(onLoad, 0); };
            } else {
                _yuitest_coverline("build/get/get.js", 1134);
node.onerror = onError;
                _yuitest_coverline("build/get/get.js", 1135);
node.onload  = onLoad;
            }

            // If this browser doesn't fire an event when CSS fails to load,
            // fail after a timeout to avoid blocking the transaction queue.
            _yuitest_coverline("build/get/get.js", 1140);
if (!env.cssFail && !isScript) {
                _yuitest_coverline("build/get/get.js", 1141);
cssTimeout = setTimeout(onError, req.timeout || 3000);
            }
        }}

        _yuitest_coverline("build/get/get.js", 1145);
this.nodes.push(node);
        _yuitest_coverline("build/get/get.js", 1146);
insertBefore.parentNode.insertBefore(node, insertBefore);
    },

    _next: function () {
        _yuitest_coverfunc("build/get/get.js", "_next", 1149);
_yuitest_coverline("build/get/get.js", 1150);
if (this._pending) {
            _yuitest_coverline("build/get/get.js", 1151);
return;
        }

        // If there are requests in the queue, insert the next queued request.
        // Otherwise, if we're waiting on already-inserted requests to finish,
        // wait longer. If there are no queued requests and we're not waiting
        // for anything to load, then we're done!
        _yuitest_coverline("build/get/get.js", 1158);
if (this._queue.length) {
            _yuitest_coverline("build/get/get.js", 1159);
this._insert(this._queue.shift());
        } else {_yuitest_coverline("build/get/get.js", 1160);
if (!this._reqsWaiting) {
            _yuitest_coverline("build/get/get.js", 1161);
this._finish();
        }}
    },

    _poll: function (newReq) {
        _yuitest_coverfunc("build/get/get.js", "_poll", 1165);
_yuitest_coverline("build/get/get.js", 1166);
var self       = this,
            pendingCSS = self._pendingCSS,
            isWebKit   = Y.UA.webkit,
            i, hasRules, j, nodeHref, req, sheets;

        _yuitest_coverline("build/get/get.js", 1171);
if (newReq) {
            _yuitest_coverline("build/get/get.js", 1172);
pendingCSS || (pendingCSS = self._pendingCSS = []);
            _yuitest_coverline("build/get/get.js", 1173);
pendingCSS.push(newReq);

            _yuitest_coverline("build/get/get.js", 1175);
if (self._pollTimer) {
                // A poll timeout is already pending, so no need to create a
                // new one.
                _yuitest_coverline("build/get/get.js", 1178);
return;
            }
        }

        _yuitest_coverline("build/get/get.js", 1182);
self._pollTimer = null;

        // Note: in both the WebKit and Gecko hacks below, a CSS URL that 404s
        // will still be treated as a success. There's no good workaround for
        // this.

        _yuitest_coverline("build/get/get.js", 1188);
for (i = 0; i < pendingCSS.length; ++i) {
            _yuitest_coverline("build/get/get.js", 1189);
req = pendingCSS[i];

            _yuitest_coverline("build/get/get.js", 1191);
if (isWebKit) {
                // Look for a stylesheet matching the pending URL.
                _yuitest_coverline("build/get/get.js", 1193);
sheets   = req.doc.styleSheets;
                _yuitest_coverline("build/get/get.js", 1194);
j        = sheets.length;
                _yuitest_coverline("build/get/get.js", 1195);
nodeHref = req.node.href;

                _yuitest_coverline("build/get/get.js", 1197);
while (--j >= 0) {
                    _yuitest_coverline("build/get/get.js", 1198);
if (sheets[j].href === nodeHref) {
                        _yuitest_coverline("build/get/get.js", 1199);
pendingCSS.splice(i, 1);
                        _yuitest_coverline("build/get/get.js", 1200);
i -= 1;
                        _yuitest_coverline("build/get/get.js", 1201);
self._progress(null, req);
                        _yuitest_coverline("build/get/get.js", 1202);
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
                _yuitest_coverline("build/get/get.js", 1212);
try {
                    // We don't really need to store this value since we never
                    // use it again, but if we don't store it, Closure Compiler
                    // assumes the code is useless and removes it.
                    _yuitest_coverline("build/get/get.js", 1216);
hasRules = !!req.node.sheet.cssRules;

                    // If we get here, the stylesheet has loaded.
                    _yuitest_coverline("build/get/get.js", 1219);
pendingCSS.splice(i, 1);
                    _yuitest_coverline("build/get/get.js", 1220);
i -= 1;
                    _yuitest_coverline("build/get/get.js", 1221);
self._progress(null, req);
                } catch (ex) {
                    // An exception means the stylesheet is still loading.
                }
            }
        }

        _yuitest_coverline("build/get/get.js", 1228);
if (pendingCSS.length) {
            _yuitest_coverline("build/get/get.js", 1229);
self._pollTimer = setTimeout(function () {
                _yuitest_coverfunc("build/get/get.js", "(anonymous 3)", 1229);
_yuitest_coverline("build/get/get.js", 1230);
self._poll.call(self);
            }, self.options.pollInterval);
        }
    },

    _progress: function (err, req) {
        _yuitest_coverfunc("build/get/get.js", "_progress", 1235);
_yuitest_coverline("build/get/get.js", 1236);
var options = this.options;

        _yuitest_coverline("build/get/get.js", 1238);
if (err) {
            _yuitest_coverline("build/get/get.js", 1239);
req.error = err;

            _yuitest_coverline("build/get/get.js", 1241);
this.errors.push({
                error  : err,
                request: req
            });

        }

        _yuitest_coverline("build/get/get.js", 1248);
req.node._yuiget_finished = req.finished = true;

        _yuitest_coverline("build/get/get.js", 1250);
if (options.onProgress) {
            _yuitest_coverline("build/get/get.js", 1251);
options.onProgress.call(options.context || this,
                this._getEventData(req));
        }

        _yuitest_coverline("build/get/get.js", 1255);
if (req.autopurge) {
            // Pre-3.5.0 Get always excludes the most recent node from an
            // autopurge. I find this odd, but I'm keeping that behavior for
            // the sake of backcompat.
            _yuitest_coverline("build/get/get.js", 1259);
Get._autoPurge(this.options.purgethreshold);
            _yuitest_coverline("build/get/get.js", 1260);
Get._purgeNodes.push(req.node);
        }

        _yuitest_coverline("build/get/get.js", 1263);
if (this._pending === req) {
            _yuitest_coverline("build/get/get.js", 1264);
this._pending = null;
        }

        _yuitest_coverline("build/get/get.js", 1267);
this._reqsWaiting -= 1;

        _yuitest_coverline("build/get/get.js", 1269);
this._next();
    }
};


}, '@VERSION@', {"requires": ["yui-base"]});
