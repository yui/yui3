/**
 * Provides a mechanism to fetch remote resources and
 * insert them into a document.
 * @module yui
 * @submodule get
 */

/**
 * Fetches and inserts one or more script or link nodes into the document
 * @class Get
 * @static
 */

var ua = Y.UA,
    L = Y.Lang,
    TYPE_JS = 'text/javascript',
    TYPE_CSS = 'text/css',
    STYLESHEET = 'stylesheet',
    
    // FireFox does not support the onload event for link nodes, so
    // there is no way to make the css requests synchronous. This means
    // that the css rules in multiple files could be applied out of order
    // in this browser if a later request returns before an earlier one.
    //
    // Safari too.

    ONLOAD_SUPPORTED = {
        'script': true,
        'css': !(ua.webkit || ua.gecko)
    },

    /**
     * hash of queues to manage multiple requests
     * @property queues
     * @private
     */
    queues = {},

    /**
     * queue index used to generate transaction ids
     * @property qidx
     * @type int
     * @private
     */
    qidx = 0,

    /**
     * interal property used to prevent multiple simultaneous purge
     * processes
     * @property purging
     * @type boolean
     * @private
     */
    purging,

    /**
     * Generates an HTML element, this is not appended to a document
     * @method _node
     * @param {string} type the type of element.
     * @param {Object} attr the fixed set of attribute for the type.
     * @param {Object} attr optional Any custom attributes provided by the user.
     * @param {Window} win optional window to create the element in.
     * @return {HTMLElement} the generated node.
     * @private
     */
    _node = function(type, attr, custAttrs, win) {
        var w = win || Y.config.win,
            d = w.document,
            n = d.createElement(type),
            i;

        if (custAttrs) {
            Y.mix(attr, custAttrs);
        }

        for (i in attr) {
            if (attr[i] && attr.hasOwnProperty(i)) {
                n.setAttribute(i, attr[i]);
            }
        }

        return n;
    },

    /**
     * Generates a link node
     * @method _linkNode
     * @param {string} url the url for the css file.
     * @param {Window} win optional window to create the node in.
     * @param {object} attributes optional attributes collection to apply to the
     * new node.
     * @return {HTMLElement} the generated node.
     * @private
     */
    _linkNode = function(url, win, attributes) {
        return _node('link', {
                        id: Y.guid(),
                        type: TYPE_CSS,
                        rel: STYLESHEET,
                        href: url
                    }, attributes, win);
    },

    /**
     * Generates a script node
     * @method _scriptNode
     * @param {string} url the url for the script file.
     * @param {Window} win optional window to create the node in.
     * @param {object} attributes optional attributes collection to apply to the
     * new node.
     * @return {HTMLElement} the generated node.
     * @private
     */
    _scriptNode = function(url, win, attributes) {
        return _node('script', {
                        id: Y.guid(),
                        type: TYPE_JS,
                        src: url
                    }, attributes, win);
    },

    /**
     * Returns the data payload for callback functions.
     * @method _returnData
     * @param {object} q the queue.
     * @param {string} msg the result message.
     * @param {string} result the status message from the request.
     * @return {object} the state data from the request.
     * @private
     */
    _returnData = function(q, msg, result) {
        return {
            tId: q.tId,
            win: q.win,
            data: q.data,
            nodes: q.nodes,
            msg: msg,
            statusText: result,

            purge: function() {
                _purge(this.tId);
            }
        };
    },

    /**
     * The transaction is finished
     * @method _end
     * @param {string} id the id of the request.
     * @param {string} msg the result message.
     * @param {string} result the status message from the request.
     * @private
     */
    _end = function(id, msg, result) {
        var q = queues[id],
            onEnd = q && q.onEnd;

        if (onEnd) {
            onEnd.call(q.context || q, _returnData(q, msg, result));
        }
    },

    /**
     * The request failed, execute fail handler with whatever
     * was accomplished.  There isn't a failure case at the
     * moment unless you count aborted transactions
     * @method _fail
     * @param {string} id the id of the request
     * @private
     */
    _fail = function(id, msg) {
        Y.log('get failure: ' + msg, 'warn', 'get');

        var q = queues[id],
            timer = q.timer,
            onFailure = q.onFailure;

        if (timer) {
            clearTimeout(timer);
        }

        if (onFailure) {
            onFailure.call(q.context || q, _returnData(q, msg));
        }

        _end(id, msg, 'failure');
    },

    /**
     * The request is complete, so executing the requester's callback
     * @method _finish
     * @param {string} id the id of the request.
     * @private
     */
    _finish = function(id) {
        Y.log("Finishing transaction " + id, "info", "get");

        var q = queues[id],
            timer = q.timer,
            onSuccess = q.onSuccess;

        if (timer) {
            clearTimeout(timer);
        }

        q.finished = true;

        if (q.aborted) {
            _abort(id);
        } else {

            if (onSuccess) {
                onSuccess.call(q.context || q, _returnData(q));
            }

            // TODO: 3.3.0 had undefined msg for this path. Find the right one
            _end(id, null, 'OK');
        }
    },

    _abort = function(id) {
       _fail(id, 'transaction ' + id + ' was aborted');
    },

    /**
     * Timeout detected
     * @method _timeout
     * @param {string} id the id of the request.
     * @private
     */
    _timeout = function(id) {
        Y.log('Timeout ' + id, 'info', 'get');

        var q = queues[id],
            onTimeout = q.onTimeout;

        if (onTimeout) {
            onTimeout.call(q.context || q, _returnData(q));
        }

        _end(id, 'timeout', 'timeout');
    },

    /**
     * onload callback
     * @method _loaded
     * @param {string} id the id of the request.
     * @return {string} the result.
     * @private
     */
    _loaded = function(id, url) {

        var q = queues[id],
            timer = q.timer,
            sync = !q.async;

        if (timer) {
            clearTimeout(timer);
        }

        // TODO: Fire onProgress here?

        if (q.aborted) {
            _abort(id);
        } else {
            if ((--q.remaining) === 0) {
                _finish(id);
            } else if (sync) {
                _next(id);
            }
        }
    },

    /**
     * Loads the next item for a given request
     * @method _next
     * @param {string} id the id of the request.
     * @return {string} the result.
     * @private
     */
    _next = function(id) {

        // Assigning out here for readability
        var q = queues[id],
            type = q.type,
            attrs = q.attributes,
            win = q.win,
            timeout = q.timeout,
            sync = !q.async,
            node,
            url;

        if (q.url.length > 0) {

            url = q.url.shift();

            Y.log('attempting to load ' + url, 'info', 'get');

            if (timeout) {
                q.timer = setTimeout(function() {
                    _timeout(id);
                }, timeout);
            }
    
            if (type === 'script') {
                node = _scriptNode(url, win, attrs);
            } else {
                node = _linkNode(url, win, attrs);
            }

            // add the node to the queue so we can return it in the callback 
            q.nodes.push(node);

            _trackLoad(type, node, id, url);
            _insertInDoc(node, id, win);
    
            if (!ONLOAD_SUPPORTED[type]) {
                _loaded(id, url);
            }

            if (!sync) {
                // _next() is called here, 
                // or chained in _loaded() if sync
                _next(id);
            }
        }
    },

    _insertInDoc = function(node, id, win) {

        // Add it to the head or insert it before 'insertBefore'.  
        // Work around IE bug if there is a base tag.
        var q = queues[id],
            doc = win.document,
            insertBefore = q.insertBefore || doc.getElementsByTagName('base')[0],
            sibling,
            head;

        if (insertBefore) {
            sibling = _getNode(insertBefore, id);
            if (sibling) {
                Y.log('inserting before: ' + insertBefore, 'info', 'get');
                sibling.parentNode.insertBefore(node, sibling);
            }
        } else {
            // 3.3.0 assumed head is always around.
            doc.getElementsByTagName('head')[0].appendChild(node);
        }
    },

    /**
     * Removes processed queues and corresponding nodes
     * @method _autoPurge
     * @private
     */
    _autoPurge = function() {
        if (purging) {
            return;
        }
        purging = true;

        var i, q;

        for (i in queues) {
            if (queues.hasOwnProperty(i)) {
                q = queues[i];
                if (q.autopurge && q.finished) {
                    _purge(q.tId);
                    delete queues[i];
                }
            }
        }

        purging = false;
    },

    /**
     * Saves the state for the request and begins loading
     * the requested urls
     * @method queue
     * @param {string} type the type of node to insert.
     * @param {string} url the url to load.
     * @param {object} opts the hash of options for this request.
     * @return {object} transaction object.
     * @private
     */
    _queue = function(type, url, opts) {

        opts = opts || {};

        var id = 'q' + (qidx++),
            thresh = opts.purgethreshold || Y.Get.PURGE_THRESH, 
            q;

        if (qidx % thresh === 0) {
            _autoPurge();
        }

        // Merge to protect opts (grandfathered in).
        q = queues[id] = Y.merge(opts);

        // Avoid mix, merge overhead. Known set of props.
        q.tId = id;
        q.type = type;
        q.url = url;
        q.finished = false;
        q.nodes = [];

        q.win = q.win || Y.config.win;
        q.context = q.context || q;
        q.autopurge = ('autopurge' in q) ? q.autopurge : (type === 'script') ? true : false;
        q.attributes = q.attributes || {};
        q.attributes.charset = opts.charset || q.attributes.charset || 'utf-8';
        q.url = (L.isString(q.url)) ? [q.url] : q.url;

        // TODO: Do we really need to account for this developer error? 
        // If the url is undefined, this is probably a trailing comma problem in IE.
        if (!q.url[0]) {
            q.url.shift();
            Y.log('skipping empty url');
        }

        q.remaining = q.url.length;

        _next(id);

        return {
            tId: id
        };
    };

    /**
     * Detects when a node has been loaded.  In the case of
     * script nodes, this does not guarantee that contained
     * script is ready to use.
     * @method _trackLoad
     * @param {string} type the type of node to track.
     * @param {HTMLElement} n the node to track.
     * @param {string} id the id of the request.
     * @param {string} url the url that is being loaded.
     * @private
     */
    _trackLoad = function(type, n, id, url) {

        // TODO: Can we massage this to use ONLOAD_SUPPORTED[type]?

        // IE supports the readystatechange event for script and css nodes
        // Opera only for script nodes.  Opera support onload for script
        // nodes, but this doesn't fire when there is a load failure.
        // The onreadystatechange appears to be a better way to respond
        // to both success and failure.
        if (ua.ie) {

            n.onreadystatechange = function() {
                var rs = this.readyState;
                if ('loaded' === rs || 'complete' === rs) {
                    // Y.log(id + " onreadstatechange " + url, "info", "get");
                    n.onreadystatechange = null;
                    _loaded(id, url);
                }
            };

        } else if (ua.webkit) {

            // webkit prior to 3.x is no longer supported
            if (type === 'script') {
                // Safari 3.x supports the load event for script nodes (DOM2)
                n.addEventListener('load', function() {
                    _loaded(id, url);
                }, false);
            }

        } else {

            // FireFox and Opera support onload (but not DOM2 in FF) handlers for
            // script nodes. Opera, but not FF, supports the onload event for link nodes.

            n.onload = function() {
                // Y.log(id + " onload " + url, "info", "get");
                _loaded(id, url);
            };

            n.onerror = function(e) {
                _fail(id, e + ': ' + url);
            };
        }
    };

    _getNode = function(nId, tId) {
        var q = queues[tId],
            n = (L.isString(nId)) ? q.win.document.getElementById(nId) : nId;
        if (!n) {
            _fail(tId, 'target node not found: ' + nId);
        }

        return n;
    };

    /**
     * Removes the nodes for the specified queue
     * @method _purge
     * @param {string} tId the transaction id.
     * @private
     */
    _purge = function(tId) {
        var n, l, d, h, s, i, node, attr, insertBefore,
            q = queues[tId];

        if (q) {
            n = q.nodes;
            l = n.length;
            d = q.win.document;
            h = d.getElementsByTagName('head')[0];

            insertBefore = q.insertBefore ||
                           d.getElementsByTagName('base')[0];

            if (insertBefore) {
                s = _getNode(insertBefore, tId);
                if (s) {
                    h = s.parentNode;
                }
            }

            for (i = 0; i < l; i = i + 1) {
                node = n[i];
                if (node.clearAttributes) {
                    node.clearAttributes();
                } else {
                    for (attr in node) {
                        if (node.hasOwnProperty(attr)) {
                            delete node[attr];
                        }
                    }
                }

                h.removeChild(node);
            }
        }
        q.nodes = [];
    };

Y.Get = {

    /**
     * The number of request required before an automatic purge.
     * Can be configured via the 'purgethreshold' config
     * property PURGE_THRESH
     * @static
     * @type int
     * @default 20
     * @private
     */
    PURGE_THRESH: 20,

    /**
     * Called by the the helper for detecting script load in Safari
     * @method _finalize
     * @static
     * @param {string} id the transaction id.
     * @private
     */
    _finalize: function(id) {
        Y.log(id + ' finalized ', 'info', 'get');
        setTimeout(function() {
            _finish(id);
        }, 0);
    },

    /**
     * Abort a transaction
     * @method abort
     * @static
     * @param {string|object} o Either the tId or the object returned from
     * script() or css().
     */
    abort : function(o) {
        var id = (L.isString(o)) ? o : o.tId,
            q = queues[id];
        if (q) {
            Y.log('Aborting ' + id, 'info', 'get');
            q.aborted = true;
        }
    },

    /**
     * Fetches and inserts one or more script nodes into the head
     * of the current document or the document in a specified window.
     *
     * @method script
     * @static
     * @param {string|string[]} url the url or urls to the script(s).
     * @param {object} opts Options:
     * <dl>
     * <dt>onSuccess</dt>
     * <dd>
     * callback to execute when the script(s) are finished loading
     * The callback receives an object back with the following
     * data:
     * <dl>
     * <dt>win</dt>
     * <dd>the window the script(s) were inserted into</dd>
     * <dt>data</dt>
     * <dd>the data object passed in when the request was made</dd>
     * <dt>nodes</dt>
     * <dd>An array containing references to the nodes that were
     * inserted</dd>
     * <dt>purge</dt>
     * <dd>A function that, when executed, will remove the nodes
     * that were inserted</dd>
     * <dt>
     * </dl>
     * </dd>
     * <dt>onTimeout</dt>
     * <dd>
     * callback to execute when a timeout occurs.
     * The callback receives an object back with the following
     * data:
     * <dl>
     * <dt>win</dt>
     * <dd>the window the script(s) were inserted into</dd>
     * <dt>data</dt>
     * <dd>the data object passed in when the request was made</dd>
     * <dt>nodes</dt>
     * <dd>An array containing references to the nodes that were
     * inserted</dd>
     * <dt>purge</dt>
     * <dd>A function that, when executed, will remove the nodes
     * that were inserted</dd>
     * <dt>
     * </dl>
     * </dd>
     * <dt>onEnd</dt>
     * <dd>a function that executes when the transaction finishes,
     * regardless of the exit path</dd>
     * <dt>onFailure</dt>
     * <dd>
     * callback to execute when the script load operation fails
     * The callback receives an object back with the following
     * data:
     * <dl>
     * <dt>win</dt>
     * <dd>the window the script(s) were inserted into</dd>
     * <dt>data</dt>
     * <dd>the data object passed in when the request was made</dd>
     * <dt>nodes</dt>
     * <dd>An array containing references to the nodes that were
     * inserted successfully</dd>
     * <dt>purge</dt>
     * <dd>A function that, when executed, will remove any nodes
     * that were inserted</dd>
     * <dt>
     * </dl>
     * </dd>
     * <dt>context</dt>
     * <dd>the execution context for the callbacks</dd>
     * <dt>win</dt>
     * <dd>a window other than the one the utility occupies</dd>
     * <dt>autopurge</dt>
     * <dd>
     * setting to true will let the utilities cleanup routine purge
     * the script once loaded
     * </dd>
     * <dt>purgethreshold</dt>
     * <dd>
     * The number of transaction before autopurge should be initiated
     * </dd>
     * <dt>data</dt>
     * <dd>
     * data that is supplied to the callback when the script(s) are
     * loaded.
     * </dd>
     * <dt>insertBefore</dt>
     * <dd>node or node id that will become the new node's nextSibling.
     * If this is not specified, nodes will be inserted before a base
     * tag should it exist.  Otherwise, the nodes will be appended to the
     * end of the document head.</dd>
     * </dl>
     * <dt>charset</dt>
     * <dd>Node charset, default utf-8 (deprecated, use the attributes
     * config)</dd>
     * <dt>attributes</dt>
     * <dd>An object literal containing additional attributes to add to
     * the link tags</dd>
     * <dt>timeout</dt>
     * <dd>Number of milliseconds to wait before aborting and firing
     * the timeout event</dd>
     * <pre>
     * &nbsp; Y.Get.script(
     * &nbsp; ["http://yui.yahooapis.com/2.5.2/build/yahoo/yahoo-min.js",
     * &nbsp;  "http://yui.yahooapis.com/2.5.2/build/event/event-min.js"],
     * &nbsp; &#123;
     * &nbsp;   onSuccess: function(o) &#123;
     * &nbsp;     this.log("won't cause error because Y is the context");
     * &nbsp;     Y.log(o.data); // foo
     * &nbsp;     Y.log(o.nodes.length === 2) // true
     * &nbsp;     // o.purge(); // optionally remove the script nodes
     * &nbsp;                   // immediately
     * &nbsp;   &#125;,
     * &nbsp;   onFailure: function(o) &#123;
     * &nbsp;     Y.log("transaction failed");
     * &nbsp;   &#125;,
     * &nbsp;   onTimeout: function(o) &#123;
     * &nbsp;     Y.log("transaction timed out");
     * &nbsp;   &#125;,
     * &nbsp;   data: "foo",
     * &nbsp;   timeout: 10000, // 10 second timeout
     * &nbsp;   context: Y, // make the YUI instance
     * &nbsp;   // win: otherframe // target another window/frame
     * &nbsp;   autopurge: true // allow the utility to choose when to
     * &nbsp;                   // remove the nodes
     * &nbsp;   purgetheshold: 1 // purge previous transaction before
     * &nbsp;                    // next transaction
     * &nbsp; &#125;);.
     * </pre>
     * @return {tId: string} an object containing info about the
     * transaction.
     */
    script: function(url, opts) {
        return _queue('script', url, opts);
    },

    /**
     * Fetches and inserts one or more css link nodes into the
     * head of the current document or the document in a specified
     * window.
     * @method css
     * @static
     * @param {string} url the url or urls to the css file(s).
     * @param {object} opts Options:
     * <dl>
     * <dt>onSuccess</dt>
     * <dd>
     * callback to execute when the css file(s) are finished loading
     * The callback receives an object back with the following
     * data:
     * <dl>win</dl>
     * <dd>the window the link nodes(s) were inserted into</dd>
     * <dt>data</dt>
     * <dd>the data object passed in when the request was made</dd>
     * <dt>nodes</dt>
     * <dd>An array containing references to the nodes that were
     * inserted</dd>
     * <dt>purge</dt>
     * <dd>A function that, when executed, will remove the nodes
     * that were inserted</dd>
     * <dt>
     * </dl>
     * </dd>
     * <dt>context</dt>
     * <dd>the execution context for the callbacks</dd>
     * <dt>win</dt>
     * <dd>a window other than the one the utility occupies</dd>
     * <dt>data</dt>
     * <dd>
     * data that is supplied to the callbacks when the nodes(s) are
     * loaded.
     * </dd>
     * <dt>insertBefore</dt>
     * <dd>node or node id that will become the new node's nextSibling</dd>
     * <dt>charset</dt>
     * <dd>Node charset, default utf-8 (deprecated, use the attributes
     * config)</dd>
     * <dt>attributes</dt>
     * <dd>An object literal containing additional attributes to add to
     * the link tags</dd>
     * </dl>
     * <pre>
     * Y.Get.css("http://localhost/css/menu.css");
     * </pre>
     * <pre>
     * &nbsp; Y.Get.css(
     * &nbsp; ["http://localhost/css/menu.css",
     * &nbsp;  "http://localhost/css/logger.css"], &#123;
     * &nbsp;   insertBefore: 'custom-styles' // nodes will be inserted
     * &nbsp;                                 // before the specified node
     * &nbsp; &#125;);.
     * </pre>
     * @return {tId: string} an object containing info about the
     * transaction.
     */
    css: function(url, opts) {
        return _queue('css', url, opts);
    }
};
