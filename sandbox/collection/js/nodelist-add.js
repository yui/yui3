Y.mix( Y.NodeList.prototype, {

    add: function ( node ) {
        if ( node ) {
            this._items.push( Y.Node.getDOMNode( node ) );
        }

        return this;
    },

    remove: function ( node ) {
        if ( node ) {
            var i = this.indexOf( Y.Node.getDOMNode( node ) );

            if ( i !== -1 ) {
                this._items.splice( i, 1 );
            }
        }

        return this;
    }
} );
