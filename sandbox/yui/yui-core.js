(function() {

var L = Y.Lang, 
DELIMITER = '__',
FROZEN = {
    'prototype': 1,
    '_yuid': 1
},

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
            if ((p in s) && (ov || !(p in r))) {
                r[p] = s[p];
            }
        }
    } else {
        for (i in s) { 
            if (s.hasOwnProperty(i) && !(i in FROZEN)) {
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
            }
        }
    
        if (Y.UA.ie) {
            _iefix(r, s);
        }
    }

    return r;
};

Y.mix3 = function(r, s, ov, wl, mode, merge) {

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

    var arr = merge && L.isArray(r), i, key;

    if (wl) {
        for (i=0; i<wl.length; i++) {
            key = wl[i];
            if ((key in s) && !(key in FROZEN)) {
                // if the receiver has this property, it is an object,
                // and merge is specified, merge the two objects.
                if (merge && r[key] && L.isObject(r[key], true)) {
                    Y.mix(r[key], s[key]); // recursive
                // otherwise apply the property only if overwrite
                // is specified or the receiver doesn't have one.
                } else if (!arr && (ov || !(key in r))) {
                    r[key] = s[key];
                // if merge is specified and the receiver is an array,
                // append the array item
                } else if (arr) {
                    r.push(s[key]);
                }
            }
        }

    } else {
        for (key in s) { 
            if (s.hasOwnProperty(key) && !(key in FROZEN)) {
                if (merge && r[key] && L.isObject(r[key], true)) {
                    Y.mix(r[key], s[key]);
                } else if (!arr && (ov || !(key in r))) {
                    r[key] = s[key];
                } else if (arr) {
                    r.push(s[key]);
                }
            }
        }
    }

    if (Y.UA.ie) {
        _iefix(r, s);
    }

    return r;
};

Y.mix2 = function(r, s, ov, wl, mode, merge) {

    if (!s||!r) {
        return r || Y;
    }

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

    var w = (wl && wl.length) ? Y.Array.hash(wl) : null, 
        arr = merge && L.isArray(r), i;

    for (i in s) { 

        if (s.hasOwnProperty(i) && !(i in FROZEN)) {

            // check white list if it was supplied
            if (!w || (i in w)) {
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
            }
        }
    }

    if (Y.UA.ie) {
        _iefix(r, s, w);
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

    return function(arg1, arg2) {
        var a = arguments, 
            key = arg2 ? Y.Array(a, 0, true).join(DELIMITER) : arg1;

        if (!(key in cache)) {
            cache[key] = source.apply(source, a);
        }

        return cache[key];
    };

};

// v2 : build a tree
// Y.cached = function(source, cache){
//     cache = cache || {};
//     return function(arg) {
//         var a = arguments, i=1, l=a.length, branch=cache, key=arg || DELIMITER, okey;
//         for (; i<l; i++) {
//             if (a[i]) {
//                 okey = key + DELIMITER; // meh, key can be set and have children
//                 if (!branch[okey]) {
//                     branch[okey] = {};
//                 }
//                 branch = branch[okey];
//                 key = a[i];
//             }
//         }
//         if (!(key in branch)) {
//             branch[key] = source.apply(source, a);
//         }
//         return branch[key];
//     };
// };
//
// v3 value and subtree separate properties 
// Y.cached = function(source, cache){
//     cache = cache || {};
//     return function(arg) {
//         var a = arguments, i=1, l=a.length, branch=cache, key=arg || DELIMITER, okey;
//         branch[key] = branch[key] || {};
//         for (; i<l; i++) {
//             if (a[i]) {
//                 okey = key;
//                 key = a[i];
//                 if (!branch[okey]) {
//                     branch[okey] = {
//                         children: {}
//                     };
//                     branch[okey][key] = {};
//                 }
//                 branch = branch[okey].children;
//             }
//         }
//         if (!('value' in branch[key])) {
//             branch[key].value = source.apply(source, a);
//         }
//         return branch[key].value;
//     };
// 
// };

})();

