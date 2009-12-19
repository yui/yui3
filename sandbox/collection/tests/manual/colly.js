YUI.add('colly', function(Y) {

var isFunction = Y.Lang.isFunction,
    isObject   = Y.Lang.isObject;

/**
 * Creates a wrapper object to a homogenous array of other objects.  The wrapper
 * is assigned methods with names mirroring those on the contained objects.
 * These methods are simple wrappers for iterative execution of the so named
 * method on each item.
 *
 * @method collection
 * @param items {Array} the items to encapsulate
 * @return {Object} an object with the same methods as its members
 */
Y.collection = function (items) {
    if (!Y.Lang.isArray(items)) {
        return isObject(items) ? items : null;
    }

    items = items.slice();

    var first = items[0],
        len   = items.length,
        // @DISCUSS: Spoof instanceof.  Seems a little deceitful.
        api = isObject(first) ? Y.Object(first.constructor.prototype) : null,
        fn;

    if (first) {
        api._items = items;
        api.length = len;

        for (fn in first) {
            // not doing a hasOwnProperty check on purpose
            if (isFunction(first[fn])) {
                api[fn] = (function (name) {
                    return function () {
                        // @DISCUSS: collect values or return last value?
                        var ret = [], i;
                        for (i = 0; i < len; ++i) {
                            ret.push(items[i][name].apply(items[i], arguments));
                        }
                        return ret;
                    };
                })(fn);
            }
        }
    }

    return api;
};


}, '@VERSION@' );
