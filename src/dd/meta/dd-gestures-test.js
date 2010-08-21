function(Y) {
    return (Y.config.win && ('ontouchstart' in Y.config.win && !Y.UA.chrome));
}
