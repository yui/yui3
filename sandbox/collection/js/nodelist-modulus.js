Y.mix( Y.NodeList.prototype, {

    modulus: function ( n, r ) {
        r = r || 0;

        var items = [];

        Y.Array.each( this._items, function ( item, i ) {
            if ( i % n === r ) {
                items.push( item );
            }
        }, this);

        return Y.all( items );
    },

    odd: function () {
        return this.modulus( 2, 1 );
    },

    even: function () {
        return this.modulus( 2 );
    }

});
