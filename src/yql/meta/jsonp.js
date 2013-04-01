function (Y) {
    /* Only load the JSONP module when not in nodejs or winjs
    TODO Make the winjs module a CORS module
    */
    return (!Y.UA.nodejs && !Y.UA.winjs);
}
