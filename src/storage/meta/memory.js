function (Y) {
    var win  = Y.config.win,
        indexedDB = win.indexedDB || win.webkitIndexedDB || win.mozIndexedDB ||
                win.oIndexedDB || win.msIndexedDB;

    // See bug 2529572 and cache-offline.js
    try {
        return !indexedDB &&
                !('openDatabase' in Y.config.win) &&
                !Y.config.win.localStorage;
    } catch (e) {
        return true;
    }
}
