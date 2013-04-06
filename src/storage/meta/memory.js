function (Y) {
    var win = Y.config.win;

    return !Y.config.indexedDB && !('openDatabase' in win) &&
            !('localStorage' in win);
}
