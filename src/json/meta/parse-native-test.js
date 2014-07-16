function (Y) {
    var _JSON = Y.config.global.JSON,
        Native = Object.prototype.toString.call(_JSON) === '[object JSON]' && _JSON,
        nativeSupport = Y.config.useNativeJSONParse !== false && !!Native;

    function workingNative( k, v ) {
        return k === "ok" ? true : v;
    }

    // Double check basic functionality.  This is mainly to catch early broken
    // implementations of the JSON API in Firefox 3.1 beta1 and beta2
    if ( nativeSupport ) {
        try {
            nativeSupport = ( Native.parse( '{"ok":false}', workingNative ) ).ok;
        }
        catch ( e ) {
            nativeSupport = false;
        }
    }

    return !nativeSupport;
}
