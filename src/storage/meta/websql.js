function (Y) {
    return !Y.config.indexedDB && 'openDatabase' in Y.config.win;
}
