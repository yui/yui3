var NodeList = Y.Collection.build( Y.Node, {
    // config
    {
        whitelist: [
            'append',
            'detach',
            'detachAll',
            'insert',
            'prepend',
            'remove',
            'removeAttribute',
            'set',
            'setContent'
        ]
    },
    
    // prototype
    {
        _construct: function ( nodes ) {
            if ( typeof nodes === 'string' ) {
                this._query = nodes;
                nodes = Y.Selector.query( nodes );
            } else if ( nodes.nodeType || nodes instanceof Y.Node ) {
                nodes = [ Y.Node.getDOMNode( nodes ) ];
            } else {
                nodes = Y.Array( nodes, 0, true );
            }

            NodeList._instances[ Y.stamp( this ) ] = this;

            NodeList.superclass._construct.call( this, nodes );
        },

        item: function ( i ) {
            return Y.one( this._items[i] );
        },

        toFrag: function () {
            return Y.one( Y.DOM._nl2frag( this._items ) );
        },

        filter: function ( selector ) {
            return Y.Lang.isFunction( selector ) ?
                NodeList.superclass.filter.apply( this, arguments ) :
                Y.all( Y.Selector.filter( this._items, selector ) );
        },

        destructor: function() {
            delete NodeList._instances[this._yuid];
        },

        refresh: function() {
            var doc,
                nodes = this._items,
                query = this._query,
                root  = this._queryRoot;

            if (query) {
                if (!root) {
                    if (nodes && nodes[0] && nodes[0].ownerDocument) {
                        root = nodes[0].ownerDocument;
                    }
                }

                this._nodes = Y.Selector.query(query, root);
            }

            return this;
        },

        on: function () {
            var args = Y.Array( arguments, 0, true );
            args.splice( 2, 1, this._items, args[2] || this );
            return Y.on.apply( Y, args );
        },

        after: function () {
            var args = Y.Array( arguments, 0, true );
            args.splice( 2, 1, this._items, args[2] || this );
            return Y.after.apply( Y, args );
        },

        toString: function() {
            var str = '',
                errorMsg = this._yuid + ': not bound to any nodes',
                nodes    = this._items,
                node;

            if (nodes && nodes[0]) {
                node = nodes[0];
                str += node.nodeName;
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
        },

        get: function ( attr ) {
            var ret = [],
                nodes = this._items,
                isNodeList = false,
                getTemp = NodeList._getTempNode,
                instance,
                val;

            if ( nodes[0] ) {
                instance = Y.Node._instances[ nodes[0]._yuid ] ||
                           getTemp( nodes[0] );

                isNodeList = (instance._get( attr ) || {}).nodeType;
            }

            Y.Array.each( nodes, function ( node ) {
                instance = Y.Node._instances[ node._yuid ];

                if ( !instance ) {
                    instance = getTemp( node );
                }

                val = instance._get( attr );
                if ( !isNodeList ) { // convert array of Nodes to NodeList
                    val = Y.Node.scrubVal( val, instance );
                }

                ret.push( val );
            });

            return ( isNodeList ) ? Y.all( ret ) : ret;
        }
    },

    // statics
    {
        NAME: 'nodeList',

        getDOMNodes: function( nodeList ) {
            return nodeList._items;
        },

        _instances: [],

        _getTempNode: function ( el ) {
            var tmp = NodeList._tempNode;

            if ( !tmp ) {
                NodeList._tempNode = tmp = Y.Node.create('<div></div>');
            }

            tmp._node = tmp.stateProxy = el;

            return tmp;
        }
    });

Y.all =
Y.Node.all = function ( nodes ) {
    return new NodeList( nodes );
};

Y.NodeList = NodeList;
