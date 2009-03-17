    /**
     * The NodeList Utility provides a DOM-like interface for interacting with DOM nodes.
     * @module node
     * @submodule node-base
     */    

    /**
     * The NodeList class provides a wrapper for manipulating DOM NodeLists.
     * NodeList properties can be accessed via the set/get methods.
     * Use Y.get() to retrieve NodeList instances.
     *
     * <strong>NOTE:</strong> NodeList properties are accessed using
     * the <code>set</code> and <code>get</code> methods.
     *
     * @class NodeList
     * @constructor
     */

    var OWNER_DOCUMENT = 'ownerDocument',
        TAG_NAME = 'tagName',
        NODE_NAME = 'nodeName',
        NODE_TYPE = 'nodeType',

        Selector = Y.Selector,
        _instances = {},
        _nodes = {},
        _restrict = {},
        _slice = [].slice;

    var NodeList = function() {
        this.initializer.apply(this, arguments);
    };

    NodeList.eachDOMNode = function(instance, fn, context) {
        context = context || instance;
        var nodes = ('length' in instance && 'item' in instance) ?  instance :
                _nodes[instance._yuid];

        for (var i = 0, node; node = nodes[i++];) {
            fn.call(context, node, i - 1, nodes);
        }
    });

    /**
     * @property PLUGINS
     * Registry for statically configured plugins.
     * Default plugins added to all NodeList instances. 
     * @static
     * Plugins are registered as objects with "fn" and "cfg" fields:
     * Y.NodeList.PLUGINS.push({ fn: Y.plugin.NodeListFX, cfg: {easing: 'easeOut'} });
     */
    NodeList.PLUGINS = [];

    /**
     * @method NodeList.plug
     * Add a default plugin to be plugged into all instances. 
     * @static
     * @param {Function || String} p The plugin class. String assumes Y.plugin[p]
     * @param {Object} config A default plugin configuration applied to all instances.
     * 
     */
    NodeList.plug = function(p, config) {
        NodeList.PLUGINS.push({fn: p, cfg: config}); 
    };

    NodeList.scrubVal = function(val, node, depth) {
        if (val !== undefined) {
            if (typeof val === 'object' || typeof val === 'function') { // safari nodeList === function
                if (val !== null && (
                        NODE_TYPE in val || // dom node
                        val.item || // dom collection or NodeList instance
                        (val[0] && val[0][NODE_TYPE]) || // assume array of nodes
                        val.document) // window TODO: restrict?
                    ) { 
                    if (val[NODE_TYPE] || val.document) { // node or window
                        val = NodeList.get(val);
                    } else {
                        val = NodeList.all(val);
                    }
                } else {
                    depth = (depth === undefined) ? 4 : depth;
                    if (depth > 0) {
                        for (var i in val) { // TODO: test this and pull hasOwnProperty check if safe?
                            if (val.hasOwnProperty && val.hasOwnProperty(i)) {
                                val[i] = NodeList.scrubVal(val[i], node, --depth);
                            }
                        }
                    }
                    
                }
            }
        } else {
            val = node; // for chaining
        }

        return val;
    };

    NodeList.addMethods = function(name, fn) {
        if (typeof name == 'string') {
            NodeList.prototype[name] = function() {
                var args = _slice.call(arguments, 0),
                    instance = this,
                    val;

                var getValue = function(node) {
                    args[0] = node;
                    val = NodeList.scrubVal(fn.apply(instance, args), instance);

                    if (getAll) {
                        ret[ret.length] = val;
                    } else {
                        ret = val;
                    }
                };

                NodeList.eachDOMNode(instance, getValue);
                return this;
            };
        } else { // assume object
            Y.each(name, function(fn, name) {
                NodeList.addMethods(name, fn);
            });
        }

    };

    /** 
     *   @method getDOMNodeList
     *   @static
     *   @param node A NodeList instance
     * @return DOMNodeList The DOM node bound to the NodeList instance
     */
    NodeList.getDOMNodeList = function(node) {
        return _nodes[node._yuid];
    };

    
    NodeList.wrapDOMMethod = function(name) {
        return function() {
            return Y.DOM[name].apply(Y.DOM, arguments);
        };

    };

    // rename and mark as protected
    NodeList.addDOMMethods = function(methods) {
        var add = {}; 
        Y.each(methods, function(v, n) {
            add[v] = NodeList.wrapDOMMethod(v);
        });

        NodeList.addMethods(add);
    };

    NodeList.prototype = {
        initializer: function(nodes, doc, isRoot) { // TODO: isRoot on List?
            var uid,
                instance = this;

            nodes = nodes || [];

            if (typeof nodes === 'string') {
                this._query = nodes;
                nodes = NodeList.query(nodes, doc);
            }

            // uid = selector || Y.guid(); // to cache queryAll results
            uid = Y.stamp(instance);
            NodeList[uid] = _all; // for applying/returning dom nodes

            _instances[uid] = this;
            _nodes[uid] = nodes;
            instance._initPlugins();
        },

        _initPlugins: function(config) { 
            if (Y.NodeList.PLUGINS) { 
                this.plug(Y.NodeList.PLUGINS); 
            } 
        }, 

        /**
         * Filters the NodeList instance down to only nodes matching the given selector.
         * @method filter
         * @param {String} selector The selector to filter against
         * @return {NodeList} NodeList containing the updated collection 
         * @see Selector
         */
        filter: function(selector) {
            return NodeList.scrubVal(Selector.filter(_nodes[this._yuid], selector), this);
        },

        /**
         * Applies the given function to each NodeList in the NodeList.
         * @method each
         * @param {Function} fn The function to apply 
         * @param {Object} context optional An optional context to apply the function with
         * Default context is the NodeList instance
         * @return {NodeList} NodeList containing the updated collection 
         * @chainable
         */
        each: function(fn, context) {
            // convert DOMNodes to Node instances
            NodeList.eachDOMNode(this, function(node, index, instance) {
                fn.call(context, Y.get(node), index, instance);
            });
        },

        /**
         * Returns the current number of items in the NodeList.
         * @method size
         * @return {Int} The number of items in the NodeList. 
         */
        size: function() {
            return _nodes[this._yuid].length;
        },

        /**
         * Retrieves the NodeList instance at the given index. 
         * @method item
         *
         * @param {Number} index The index of the target NodeList.
         * @return {NodeList} The NodeList instance at the given index.
         */
        item: function(index) {
            var node = _nodes[this._yuid][index];
            return Y.all(node);
        },

       /**
         * Attaches a DOM event handler.
         * @method attach
         * @param {String} type The type of DOM Event to listen for 
         * @param {Function} fn The handler to call when the event fires 
         * @param {Object} context An optional context to execute the handler,
         * with, defaults to the NodeList instance
         * @param {Object} arg An argument object to pass to the handler 
         */

        attach: function(type, fn, context, arg) {
            var args = _slice.call(arguments, 0);
            args.splice(2, 0, _nodes[this._yuid]);
            return Y.Event.attach.apply(Y.Event, args);
        },

       /**
         * Alias for attach.
         * @method on
         * @param {String} type The type of DOM Event to listen for 
         * @param {Function} fn The handler to call when the event fires 
         * @param {Object} arg An argument object to pass to the handler 
         * @see attach
         */
        on: function(type, fn, arg) {
            return this.attach.apply(this, arguments);
        },

       /**
         * Detaches a DOM event handler. 
         * @method detach
         * @param {String} type The type of DOM Event
         * @param {Function} fn The handler to call when the event fires 
         */
        detach: function(type, fn) {
            var args = _slice.call(arguments, 0);
            args.splice(2, 0, _nodes[this._yuid]);
            return Y.Event.detach.apply(Y.Event, args);
        },

        /**
         * Applies the supplied plugin to the node.
         * @method plug
         * @param {Function} The plugin Class to apply
         * @param {Object} config An optional config to pass to the constructor
         * @chainable
         */
        plug: function(p, cfg) {
            if (p) {
                if (typeof p === 'string' && Y.plugin) {
                    this._plug(Y.plugin[p], cfg);
                } else if (p.fn) {
                    this.plug(p.fn, p.cfg);
                } else if (Y.Lang.isFunction(p)) {
                    this._plug(p, cfg);
                } else {
                    for (var i = 0, len = p.length; i < len; ++i) {
                        this.plug(p[i]);
                    }
                }
            }
            return this;
        },

        update: function() {
            _nodes[this._yuid] = NodeList.query(this._query);
        },

        _plug: function(PluginClass, config) {
            if (PluginClass && PluginClass.NS) {
                var ns = PluginClass.NS;

                config = config || {};
                config.owner = this;

                this[ns] = new PluginClass(config);
            }
        },

        //normalize: function() {},
        //isSupported: function(feature, version) {},
        toString: function() {
            var str = this._yuid + ': ',
                errorMsg = this._yuid + ': not bound to any nodes',
                nodes = _nodes[this._yuid] || [],
                node;

            if (nodes) {
                node = nodes[0];
                str += node[NODE_NAME];
                if (node.id) {
                    str += '#' + node.id; 
                }

                if (node.className) {
                    str += '.' + node.className.replace(' ', '.'); 
                }

                if (nodes.length > 1) {
                    str += '...[' + nodes.length + ' items]';
                }
            }
            return str || errorMsg;
        }
    };

    NodeList.defaultSetter: function(node, prop, val) {
        if (node[prop] !== undefined) { // no expandos 
            node[prop] = val;
        } else {
            Y.log(prop + ' not in ' + node, 'warn', 'NodeList');
        }
    };

    NodeList.addMethods({
        addEventListener: function() {
            return Y.Event.nativeAdd.apply(Y.Event, arguments);
        },
        
        removeEventListener: function() {
            return Y.Event.nativeRemove.apply(Y.Event, arguments);
        }
    });

    NodeList.query = function(str, doc) {
        return Selector.query(str, doc);
    };

    Y.Array.each([
        /**
         * Passes through to DOM method.
         * @method removeAttribute
         * @param {String} attribute The attribute to be removed 
         * @chainable
         */
        'removeAttribute',

        /**
         * Passes through to DOM method.
         * Only valid on FORM elements
         * @method reset
         * @chainable
         */
        'reset',

        /**
         * Passes through to DOM method.
         * @method select
         * @chainable
         */
         'select'
    ], function(method) {
        NodeList.prototype[method] = function(arg1, arg2, arg3) {
            var scrubVal = NodeList.scrubVal;

            for (var i = 0, node; node = _nodes[this._yuid][i++];) {
                ret = node[method](scrubVal(arg1), scrubVal(arg2), scrubVal(arg3));
            }

            return scrubVal(ret);
        };
    });

    NodeList.addDOMMethods([
        'setAttribute'
    ]);

    Y.NodeList = NodeList;
    Y.all = function(nodes, doc) {
        var instance = _instances[nodes._yuid] || new Y.NodeList(nodes, doc);
        return instance;
    }
