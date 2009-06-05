(function() {

var L = Y.Lang, 
DELIMITER = '__',
// FROZEN = {
//     'prototype': 1,
//     '_yuid': 1
// },

/*
 * IE will not enumerate native functions in a derived object even if the
 * function was overridden.  This is a workaround for specific functions 
 * we care about on the Object prototype. 
 * @property _iefix
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @private
 * @for YUI
 */
_iefix = function(r, s) {
    var fn = s.toString;
    if (L.isFunction(fn) && fn != Object.prototype.toString) {
        r.toString = fn;
    }
};


/**
 * Returns a new object containing all of the properties of
 * all the supplied objects.  The properties from later objects
 * will overwrite those in earlier objects.  Passing in a
 * single object will create a shallow copy of it.  For a deep
 * copy, use clone.
 * @method merge
 * @param arguments {Object*} the objects to merge
 * @return {object} the new merged object
 */
Y.merge = function() {
    var a = arguments, o = {}, i, l = a.length;
    for (i=0; i<l; i=i+1) {
        Y.mix(o, a[i], true);
    }
    return o;
};
   
/**
 * Applies the supplier's properties to the receiver.  By default
 * all prototype and static propertes on the supplier are applied
 * to the corresponding spot on the receiver.  By default all
 * properties are applied, and a property that is already on the
 * reciever will not be overwritten.  The default behavior can
 * be modified by supplying the appropriate parameters.
 *
 * @TODO add constants for the modes
 *
 * @method mix
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @param ov {boolean} if true, properties already on the receiver
 * will be overwritten if found on the supplier.
 * @param wl {string[]} a whitelist.  If supplied, only properties in 
 * this list will be applied to the receiver.
 * @param {int} mode what should be copies, and to where
 *        default(0): object to object
 *        1: prototype to prototype (old augment)
 *        2: prototype to prototype and object props (new augment)
 *        3: prototype to object
 *        4: object to prototype
 * @param merge {boolean} merge objects instead of overwriting/ignoring
 * Used by Y.aggregate
 * @return {object} the augmented object
 */
Y.mix = function(r, s, ov, wl, mode, merge) {

    if (!s||!r) {
        return r || Y;
    }

    if (mode) {
        switch (mode) {
            case 1: // proto to proto
                return Y.mix(r.prototype, s.prototype);
            case 2: // object to object and proto to proto
                Y.mix(r.prototype, s.prototype);
                break; // pass through 
            case 3: // proto to static
                return Y.mix(r, s.prototype);
            case 4: // static to proto
                return Y.mix(r.prototype, s);
            default:  // object to object is what happens below
        }
    }

    // Maybe don't even need this wl && wl.length check anymore??
    var arr = merge && L.isArray(r), i, l, p;

    if (wl && wl.length) {
        for (i = 0, l = wl.length; i < l; ++i) {
            p = wl[i];
            if (p in s) {
                if (merge && L.isObject(r[p], true)) {
                    Y.mix(r[p], s[p]);
                } else if (!arr && (ov || !(p in r))) {
                    r[p] = s[p];
                } else if (arr) {
                    r.push(s[p]);
                }
            }
        }
    } else {
        for (i in s) { 
            // if (s.hasOwnProperty(i) && !(i in FROZEN)) {
                // check white list if it was supplied
                // if the receiver has this property, it is an object,
                // and merge is specified, merge the two objects.
                if (merge && L.isObject(r[i], true)) {
                    Y.mix(r[i], s[i]); // recursive
                // otherwise apply the property only if overwrite
                // is specified or the receiver doesn't have one.
                } else if (!arr && (ov || !(i in r))) {
                    r[i] = s[i];
                // if merge is specified and the receiver is an array,
                // append the array item
                } else if (arr) {
                    r.push(s[i]);
                }
            // }
        }
    
        if (Y.UA.ie) {
            _iefix(r, s);
        }
    }

    return r;
};

/**
 * Returns a wrapper for a function which caches the
 * return value of that function, keyed off of the combined 
 * argument values.
 * @function cached
 * @param source {function} the function to memoize
 * @param cache an optional cache seed
 * @return {Function} the wrapped function
 */
Y.cached = function(source, cache){
    cache = cache || {};

    // I want the profiler to show me separate entries for each
    // cached function.  Is this too much to ask?
    
    // return function cached_sourceFunction
    // return this['cached_' + source.name] = function
    // var a = function(){}; a.name = 'foo'; return a;

    return function cached(arg1, arg2) {

        // (?)()   51  5.76%   0.571ms 1.01ms  0.02ms  0.001ms 0.041ms
        // A() 76  6.58%   0.652ms 0.652ms 0.009ms 0.005ms 0.03ms
        // var key = (arg2 !== undefined) ? Y.Array(arguments, 0, true).join(DELIMITER) : arg1;

        // (?)()   51  8.57%   0.837ms 0.838ms 0.016ms 0.013ms 0.024ms
        // var key = (arguments.length > 1) ? Array.prototype.join.call(arguments, DELIMITER) : arg1;

        // (?)()   51  8.06%  0.761ms 0.762ms 0.015ms 0.002ms 0.025ms
        // var key = (arg2 !== undefined) ? Array.prototype.join.call(arguments, DELIMITER) : arg1;
        
        // (?)()   51  7.87%   0.749ms 0.751ms 0.015ms 0.001ms 0.027ms
        // A() 30  2.23%   0.214ms 0.214ms 0.007ms 0.005ms 0.009ms
        var key = (arg2) ? Array.prototype.join.call(arguments, DELIMITER) : arg1;

        if (!(key in cache)) {
            cache[key] = source.apply(source, arguments);
        }

        return cache[key];
    };

};

})();

