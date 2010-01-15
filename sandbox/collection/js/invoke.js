Y.Array.invoke = function ( items, name ) {
    var args       = Y.Array( arguments, 2, true ),
        isFunction = Y.Lang.isFunction,
        ret        = [];

    Y.Array.each( Y.Array( items ), function ( item, i ) {
        if ( isFunction( item[ name ] ) ) {
            ret[i] = item[ name ].apply( item, args );
        }
    });

    return ret;
};
