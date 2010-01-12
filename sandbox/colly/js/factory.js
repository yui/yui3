// Generic collection
function Collection() {
    this._construct.apply(this, arguments);
}

Collection.prototype = {
    _construct: function (items) {
        this._items = Y.Lang.isArray( items ) ?
            items :
            Y.Array( arguments, 0, true );
    },

    item: function ( i ) {
        return this._items[i];
    },

    each: function ( fn, context ) {
        var self = this;

        Y.Array.each( self._items, function ( item, i ) {
            item = self.item( i );

            return fn.call( context || item, item, i, self );
        });

        return self;
    },

    some: function ( fn ) {
        var self = this;

        Y.Array.some( self._items, function ( item, i ) {
            item = self.item( i );

            return fn.call( context || item, item, i, self );
        });

        return self;
    },

    indexOf: function ( needle ) {
        return Y.Array.indexOf( this._items, needle );
    },

    filter: function ( validator ) {
        var items = [];

        this.each( function ( item ) {
            if ( validator( item ) ) {
                items.push( item );
            }
        });

        return new this.constructor( items );
    },

    modulus: function ( n, r ) {
        r = r || 0;

        var items = [],
            self  = this;

        Y.Array.each( self._items, function ( item, i ) {
            if ( i % n === r ) {
                items.push( self.item( i ) );
            }
        });

        return new this.constructor( items );
    },

    odd: function () {
        return this.modulus( 2, 1 );
    },

    even: function () {
        return this.modulus( 2 );
    },

    size: function () {
        return this._items.length;
    },

    isEmpty: function () {
        return !this.size();
    },

    add: function ( item ) {
        this._items.push( item );

        return this;
    },

    remove: function ( item ) {
        var i = this.indexOf( item );

        if (i > -1) {
            this._items.splice(i,1);
        }

        return this;
    }
};

Y.Collection = Collection;

Y.Mix( Collection, {

    /**
     * Core factory method for creating collection classes.
     *
     * @method build
     * @param o {Function|Object} The seed constructor function or its prototype
     * @param config {Object} optional configuration for tweaking class build
     * @param proto {Object} optional prototype methods (will override)
     * @param statics {Object} optional static members for the collection class
     * @return {Function} the list class for the provided constructor
     * @static
     */
    build: function (o, config, proto, statics) {

        function C() {
            Y.Collection.apply( this, arguments );
        }

        config  = config  || {};
        proto   = proto   || {};
        statics = statics || {};

        var isFunction = Y.Lang.isFunction,
            isObject   = Y.Lang.isObject,
            whitelist  = config.methods,
            prototype  = {},
            fn, i, len;

        // Passing a constructor function is ok, too
        o = isFunction( o ) ? o.prototype : o;

        if ( Y.Lang.isArray( whitelist ) ) {
            for ( i = 0, len = whitelist.length; i < len; ++i ) {
                Y.Collection._addMethod( o, whitelist[i], prototype );
            }
        } else {
            for ( fn in o ) {
                if ( isFunction( o[fn] ) ) {
                    Y.Collection._addMethod( o, fn, prototype );
                }
            }
        }

        return Y.extend( C, Y.Collection,    // superclass
            Y.mix( prototype, proto, true ), // prototype
            statics );                       // static members
    },

    _addMethod: function ( source, name, dest ) {
        dest[name] = function () {
            var args = Y.Array( arguments, 0, true ),
                ret  = [];

            this.each( function ( item ) {
                var result = item[name].apply( item, args );

                if ( result !== undefined && result !== item ) {
                    ret.push( result );
                }
            });

            return ret.length ? ret : this;
        };
    }
});
