function (Y) {
    var win  = Y.config.win,
        indexedDB = win.indexedDB || win.webkitIndexedDB || win.mozIndexedDB ||
                win.oIndexedDB || win.msIndexedDB;

    Y.config.indexedDB = indexedDB;

    return !!indexedDB;
}
