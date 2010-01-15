YUI.add('colly', function(Y) {

/*
 * This seems like a subset of NodeList functionality.  Maybe grounds for a
 * core collection structure with methods such as filter, each, indexOf, etc
 * extended into NodeList?  NodeList methods are applied to its _nodes array,
 * so a bit different.  And core should omit the weight of the extra methods
 * anyway.
 */
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
// @DISCUSS: function (items, constructor/proto/whitelist, extras)? to allow
// empty collections that match the API of a constructor/proto, and 'extras' to
// have some extra or instance-specific override methods/properties?
Y.collection = function (items) {
    if (!Y.Lang.isArray(items)) {
        return isObject(items) ? items : null;
    }

    items = items.slice();

    var first = items[0],
        len   = items.length,
        api   = isObject(first) ? {} : null,
        fn;

    if (first) {
        api._items = items;
        api.length = len;

        for (fn in first) {
            // Not doing a hasOwnProperty check on purpose.
            // Having the second param receive a constructor would allow
            // capturing just the class methods up its superclass axis, but
            // it's less code and little overhead to get the few methods from
            // Object.prototype.
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
