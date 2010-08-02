function(Y) {
    console.log('Gesture Test: ' + ('ontouchstart' in Y.config.win && !Y.UA.chrome));
    return ('ontouchstart' in Y.config.win && !Y.UA.chrome);
}
