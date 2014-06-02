function (Y) {
    var _JSON = Y.config.global.JSON,
        Native = Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON,
        nativeSupport = Y.config.useNativeJSONStringify !== false && !!Native;

    // Double check basic native functionality.  This is primarily to catch broken
    // early JSON API implementations in Firefox 3.1 beta1 and beta2.
    if ( nativeSupport ) {
        try {
            nativeSupport = ( '0' === Native.stringify(0) );
        } catch ( e ) {
            nativeSupport = false;
        }
    }


    return !nativeSupport;
}
