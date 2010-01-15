Y.mix( Y.ArrayList.prototype, {

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

});
