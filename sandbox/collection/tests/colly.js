YUI.add('colly', function(Y) {

(function () {
var YArray      = Y.Array,
    YArray_each = YArray.each,
    ArrayListProto;

function ArrayList( items ) {
    if ( items !== undefined ) {
        this._items = Y.Lang.isArray( items ) ? items : YArray( items );
    } else {
        // ||= to support lazy initialization from augment
        this._items = this._items || [];
    }
}

ArrayListProto = {
    item: function ( i ) {
        return this._items[i];
    },

    each: function ( fn, context ) {
        YArray_each( this._items, function ( item, i ) {
            item = this.item( i );

            return fn.call( context || item, item, i, this );
        }, this);

        return this;
    },

    some: function ( fn, context ) {
        return YArray.some( this._items, function ( item, i ) {
            item = this.item( i );

            return fn.call( context || item, item, i, this );
        }, this);
    },

    indexOf: function ( needle ) {
        return YArray.indexOf( this._items, needle );
    },

    filter: function ( validator ) {
        var items = [];

        YArray_each( this._items, function ( item, i ) {
            item = this.item( i );

            if ( validator( item ) ) {
                items.push( item );
            }
        }, this);

        return new this.constructor( items );
    },

    size: function () {
        return this._items.length;
    },

    isEmpty: function () {
        return !this.size();
    }
};
// Default implementation does not distinguish between public and private
// item getter
ArrayListProto._item = ArrayListProto.item;
ArrayList.prototype  = ArrayListProto;

Y.mix( ArrayList, {

    addMethod: function ( dest, names ) {

        names = YArray( names );

        YArray_each( names, function ( name ) {
            dest[ name ] = function () {
                var args = YArray( arguments, 0, true ),
                    ret  = [];

                YArray_each( this._items, function ( item, i ) {
                    item = this._item( i );

                    var result = item[ name ].apply( item, args );

                    if ( result !== undefined && result !== item ) {
                        ret.push( result );
                    }
                }, this);

                return ret.length ? ret : this;
            };
        } );
    }
} );

Y.ArrayList = ArrayList;
})();
Y.mix( Y.ArrayList.prototype, {

    modulus: function ( n, r ) {
        r = r || 0;

        var items = [];

        Y.Array.each( this._items, function ( item, i ) {
            if ( i % n === r ) {
                items.push( item );
            }
        }, this);

        return new this.constructor( items );
    },

    odd: function () {
        return this.modulus( 2, 1 );
    },

    even: function () {
        return this.modulus( 2 );
    }

});


}, '@VERSION@' );
