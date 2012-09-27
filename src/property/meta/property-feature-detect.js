function () {
    // IE8 implements Object.defineProperty(), but it only works on DOM objects.
    // All browsers that implement both defineProperty() and defineProperties()
    // should work without a shim, so we check for the existence of both.
    return typeof Object.defineProperties !== 'function' ||
            typeof Object.defineProperty !== 'function';
}
