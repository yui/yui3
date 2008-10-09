/*
 * YUI core utilities
 * @module yui
 * @submodule core
 */
// requires lang
YUI.add("core", function(Y) {

    var L = Y.Lang, 
    A = Y.Array,
    OP = Object.prototype, 
    IEF = ["toString", "valueOf"], 
    PROTO = 'prototype',

    /**
     * IE will not enumerate native functions in a derived object even if the
     * function was overridden.  This is a workaround for specific functions 
     * we care about on the Object prototype. 
     * @property _iefix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param w a whitelist object (the keys are the valid items to reference)
     * @private
     * @for YUI
     */
    _iefix = (Y.UA && Y.UA.ie) ?
        function(r, s, w) {
            for (var i=0, a=IEF; i<a.length; i=i+1) {
                var n = a[i], f = s[n];
                if (L.isFunction(f) && f != OP[n]) {
                    if (!w || (n in w)) {
                        r[n]=f;
                    }
                }
            }
        } : function() {};
   

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
        // var o={}, a=arguments;
        // for (var i=0, l=a.length; i<l; i=i+1) {
        //var a=arguments, o=Y.Object(a[0]);
        var a=arguments, o={};
        for (var i=0, l=a.length; i<l; i=i+1) {
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
     * @TODO review for PR2
     */
    Y.mix = function(r, s, ov, wl, mode, merge) {

        if (!s||!r) {
            return Y;
        }

        var w = (wl && wl.length) ? A.hash(wl) : null, m = merge,

            f = function(fr, fs, proto, iwl) {

                var arr = m && L.isArray(fr);

                for (var i in fs) { 

                    if (fs.hasOwnProperty(i)) {

                        // We never want to overwrite the prototype
                        // if (PROTO === i) {
                        if (PROTO === i || '_yuid' === i) {
                            continue;
                        }

                        // Y.log('i: ' + i + ", " + fs[i]);
                        // @TODO deal with the hasownprop issue

                        // check white list if it was supplied
                        if (!w || iwl || (i in w)) {
                            // if the receiver has this property, it is an object,
                            // and merge is specified, merge the two objects.
                            if (m && L.isObject(fr[i], true)) {
                                // console.log('aggregate RECURSE: ' + i);
                                // @TODO recursive or no?
                                // Y.mix(fr[i], fs[i]); // not recursive
                                f(fr[i], fs[i], proto, true); // recursive
                            // otherwise apply the property only if overwrite
                            // is specified or the receiver doesn't have one.
                            // @TODO make sure the 'arr' check isn't desructive
                            } else if (!arr && (ov || !(i in fr))) {
                                // console.log('hash: ' + i);
                                fr[i] = fs[i];
                            // if merge is specified and the receiver is an array,
                            // append the array item
                            } else if (arr) {
                                // console.log('array: ' + i);
                                // @TODO probably will need to remove dups
                                fr.push(fs[i]);
                            }
                        }
                    }
                }

                _iefix(fr, fs, w);
            };

        var rp = r.prototype, sp = s.prototype;

        switch (mode) {
            case 1: // proto to proto
                f(rp, sp, true);
                break;
            case 2: // object to object and proto to proto
                f(r, s);
                f(rp, sp, true);
                break;
            case 3: // proto to static
                f(r, sp, true);
                break;
            case 4: // static to proto
                f(rp, s);
                break;
            default:  // object to object
                f(r, s);
        }

        return r;
    };

    

}, "@VERSION@");
