if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["/build/oop/oop.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "/build/oop/oop.js",
    code: []
};
_yuitest_coverage["/build/oop/oop.js"].code=["YUI.add('oop', function(Y) {","","/**","Adds object inheritance and manipulation utilities to the YUI instance. This","module is required by most YUI components.","","@module oop","**/","","var L            = Y.Lang,","    A            = Y.Array,","    OP           = Object.prototype,","    CLONE_MARKER = '_~yuim~_',","","    hasOwn   = OP.hasOwnProperty,","    toString = OP.toString;","","function dispatch(o, f, c, proto, action) {","    if (o && o[action] && o !== Y) {","        return o[action].call(o, f, c);","    } else {","        switch (A.test(o)) {","            case 1:","                return A[action](o, f, c);","            case 2:","                return A[action](Y.Array(o, 0, true), f, c);","            default:","                return Y.Object[action](o, f, c, proto);","        }","    }","}","","/**","Augments the _receiver_ with prototype properties from the _supplier_. The","receiver may be a constructor function or an object. The supplier must be a","constructor function.","","If the _receiver_ is an object, then the _supplier_ constructor will be called","immediately after _receiver_ is augmented, with _receiver_ as the `this` object.","","If the _receiver_ is a constructor function, then all prototype methods of","_supplier_ that are copied to _receiver_ will be sequestered, and the","_supplier_ constructor will not be called immediately. The first time any","sequestered method is called on the _receiver_'s prototype, all sequestered","methods will be immediately copied to the _receiver_'s prototype, the","_supplier_'s constructor will be executed, and finally the newly unsequestered","method that was called will be executed.","","This sequestering logic sounds like a bunch of complicated voodoo, but it makes","it cheap to perform frequent augmentation by ensuring that suppliers'","constructors are only called if a supplied method is actually used. If none of","the supplied methods is ever used, then there's no need to take the performance","hit of calling the _supplier_'s constructor.","","@method augment","@param {Function|Object} receiver Object or function to be augmented.","@param {Function} supplier Function that supplies the prototype properties with","  which to augment the _receiver_.","@param {Boolean} [overwrite=false] If `true`, properties already on the receiver","  will be overwritten if found on the supplier's prototype.","@param {String[]} [whitelist] An array of property names. If specified,","  only the whitelisted prototype properties will be applied to the receiver, and","  all others will be ignored.","@param {Array|any} [args] Argument or array of arguments to pass to the","  supplier's constructor when initializing.","@return {Function} Augmented object.","@for YUI","**/","Y.augment = function (receiver, supplier, overwrite, whitelist, args) {","    var rProto    = receiver.prototype,","        sequester = rProto && supplier,","        sProto    = supplier.prototype,","        to        = rProto || receiver,","","        copy,","        newPrototype,","        replacements,","        sequestered,","        unsequester;","","    args = args ? Y.Array(args) : [];","","    if (sequester) {","        newPrototype = {};","        replacements = {};","        sequestered  = {};","","        copy = function (value, key) {","            if (overwrite || !(key in rProto)) {","                if (toString.call(value) === '[object Function]') {","                    sequestered[key] = value;","","                    newPrototype[key] = replacements[key] = function () {","                        return unsequester(this, value, arguments);","                    };","                } else {","                    newPrototype[key] = value;","                }","            }","        };","","        unsequester = function (instance, fn, fnArgs) {","            // Unsequester all sequestered functions.","            for (var key in sequestered) {","                if (hasOwn.call(sequestered, key)","                        && instance[key] === replacements[key]) {","","                    instance[key] = sequestered[key];","                }","            }","","            // Execute the supplier constructor.","            supplier.apply(instance, args);","","            // Finally, execute the original sequestered function.","            return fn.apply(instance, fnArgs);","        };","","        if (whitelist) {","            Y.Array.each(whitelist, function (name) {","                if (name in sProto) {","                    copy(sProto[name], name);","                }","            });","        } else {","            Y.Object.each(sProto, copy, null, true);","        }","    }","","    Y.mix(to, newPrototype || sProto, overwrite, whitelist);","","    if (!sequester) {","        supplier.apply(to, args);","    }","","    return receiver;","};","","/**"," * Copies object properties from the supplier to the receiver. If the target has"," * the property, and the property is an object, the target object will be"," * augmented with the supplier's value."," *"," * @method aggregate"," * @param {Object} receiver Object to receive the augmentation."," * @param {Object} supplier Object that supplies the properties with which to"," *     augment the receiver."," * @param {Boolean} [overwrite=false] If `true`, properties already on the receiver"," *     will be overwritten if found on the supplier."," * @param {String[]} [whitelist] Whitelist. If supplied, only properties in this"," *     list will be applied to the receiver."," * @return {Object} Augmented object."," */","Y.aggregate = function(r, s, ov, wl) {","    return Y.mix(r, s, ov, wl, 0, true);","};","","/**"," * Utility to set up the prototype, constructor and superclass properties to"," * support an inheritance strategy that can chain constructors and methods."," * Static members will not be inherited."," *"," * @method extend"," * @param {function} r   the object to modify."," * @param {function} s the object to inherit."," * @param {object} px prototype properties to add/override."," * @param {object} sx static properties to add/override."," * @return {object} the extended object."," */","Y.extend = function(r, s, px, sx) {","    if (!s || !r) {","        Y.error('extend failed, verify dependencies');","    }","","    var sp = s.prototype, rp = Y.Object(sp);","    r.prototype = rp;","","    rp.constructor = r;","    r.superclass = sp;","","    // assign constructor property","    if (s != Object && sp.constructor == OP.constructor) {","        sp.constructor = s;","    }","","    // add prototype overrides","    if (px) {","        Y.mix(rp, px, true);","    }","","    // add object overrides","    if (sx) {","        Y.mix(r, sx, true);","    }","","    return r;","};","","/**"," * Executes the supplied function for each item in"," * a collection.  Supports arrays, objects, and"," * NodeLists"," * @method each"," * @param {object} o the object to iterate."," * @param {function} f the function to execute.  This function"," * receives the value, key, and object as parameters."," * @param {object} c the execution context for the function."," * @param {boolean} proto if true, prototype properties are"," * iterated on objects."," * @return {YUI} the YUI instance."," */","Y.each = function(o, f, c, proto) {","    return dispatch(o, f, c, proto, 'each');","};","","/**"," * Executes the supplied function for each item in"," * a collection.  The operation stops if the function"," * returns true. Supports arrays, objects, and"," * NodeLists."," * @method some"," * @param {object} o the object to iterate."," * @param {function} f the function to execute.  This function"," * receives the value, key, and object as parameters."," * @param {object} c the execution context for the function."," * @param {boolean} proto if true, prototype properties are"," * iterated on objects."," * @return {boolean} true if the function ever returns true,"," * false otherwise."," */","Y.some = function(o, f, c, proto) {","    return dispatch(o, f, c, proto, 'some');","};","","/**"," * Deep object/array copy.  Function clones are actually"," * wrappers around the original function."," * Array-like objects are treated as arrays."," * Primitives are returned untouched.  Optionally, a"," * function can be provided to handle other data types,"," * filter keys, validate values, etc."," *"," * @method clone"," * @param {object} o what to clone."," * @param {boolean} safe if true, objects will not have prototype"," * items from the source.  If false, they will.  In this case, the"," * original is initially protected, but the clone is not completely"," * immune from changes to the source object prototype.  Also, cloned"," * prototype items that are deleted from the clone will result"," * in the value of the source prototype being exposed.  If operating"," * on a non-safe clone, items should be nulled out rather than deleted."," * @param {function} f optional function to apply to each item in a"," * collection; it will be executed prior to applying the value to"," * the new object.  Return false to prevent the copy."," * @param {object} c optional execution context for f."," * @param {object} owner Owner object passed when clone is iterating"," * an object.  Used to set up context for cloned functions."," * @param {object} cloned hash of previously cloned objects to avoid"," * multiple clones."," * @return {Array|Object} the cloned object."," */","Y.clone = function(o, safe, f, c, owner, cloned) {","","    if (!L.isObject(o)) {","        return o;","    }","","    // @todo cloning YUI instances doesn't currently work","    if (Y.instanceOf(o, YUI)) {","        return o;","    }","","    var o2, marked = cloned || {}, stamp,","        yeach = Y.each;","","    switch (L.type(o)) {","        case 'date':","            return new Date(o);","        case 'regexp':","            // if we do this we need to set the flags too","            // return new RegExp(o.source);","            return o;","        case 'function':","            // o2 = Y.bind(o, owner);","            // break;","            return o;","        case 'array':","            o2 = [];","            break;","        default:","","            // #2528250 only one clone of a given object should be created.","            if (o[CLONE_MARKER]) {","                return marked[o[CLONE_MARKER]];","            }","","            stamp = Y.guid();","","            o2 = (safe) ? {} : Y.Object(o);","","            o[CLONE_MARKER] = stamp;","            marked[stamp] = o;","    }","","    // #2528250 don't try to clone element properties","    if (!o.addEventListener && !o.attachEvent) {","        yeach(o, function(v, k) {","if ((k || k === 0) && (!f || (f.call(c || this, v, k, this, o) !== false))) {","                if (k !== CLONE_MARKER) {","                    if (k == 'prototype') {","                        // skip the prototype","                    // } else if (o[k] === o) {","                    //     this[k] = this;","                    } else {","                        this[k] =","                            Y.clone(v, safe, f, c, owner || o, marked);","                    }","                }","            }","        }, o2);","    }","","    if (!cloned) {","        Y.Object.each(marked, function(v, k) {","            if (v[CLONE_MARKER]) {","                try {","                    delete v[CLONE_MARKER];","                } catch (e) {","                    v[CLONE_MARKER] = null;","                }","            }","        }, this);","        marked = null;","    }","","    return o2;","};","","","/**"," * Returns a function that will execute the supplied function in the"," * supplied object's context, optionally adding any additional"," * supplied parameters to the beginning of the arguments collection the"," * supplied to the function."," *"," * @method bind"," * @param {Function|String} f the function to bind, or a function name"," * to execute on the context object."," * @param {object} c the execution context."," * @param {any} args* 0..n arguments to include before the arguments the"," * function is executed with."," * @return {function} the wrapped function."," */","Y.bind = function(f, c) {","    var xargs = arguments.length > 2 ?","            Y.Array(arguments, 2, true) : null;","    return function() {","        var fn = L.isString(f) ? c[f] : f,","            args = (xargs) ?","                xargs.concat(Y.Array(arguments, 0, true)) : arguments;","        return fn.apply(c || fn, args);","    };","};","","/**"," * Returns a function that will execute the supplied function in the"," * supplied object's context, optionally adding any additional"," * supplied parameters to the end of the arguments the function"," * is executed with."," *"," * @method rbind"," * @param {Function|String} f the function to bind, or a function name"," * to execute on the context object."," * @param {object} c the execution context."," * @param {any} args* 0..n arguments to append to the end of"," * arguments collection supplied to the function."," * @return {function} the wrapped function."," */","Y.rbind = function(f, c) {","    var xargs = arguments.length > 2 ? Y.Array(arguments, 2, true) : null;","    return function() {","        var fn = L.isString(f) ? c[f] : f,","            args = (xargs) ?","                Y.Array(arguments, 0, true).concat(xargs) : arguments;","        return fn.apply(c || fn, args);","    };","};","","","}, '@VERSION@' ,{requires:['yui-base']});"];
_yuitest_coverage["/build/oop/oop.js"].lines = {"1":0,"10":0,"18":0,"19":0,"20":0,"22":0,"24":0,"26":0,"28":0,"69":0,"70":0,"81":0,"83":0,"84":0,"85":0,"86":0,"88":0,"89":0,"90":0,"91":0,"93":0,"94":0,"97":0,"102":0,"104":0,"105":0,"108":0,"113":0,"116":0,"119":0,"120":0,"121":0,"122":0,"126":0,"130":0,"132":0,"133":0,"136":0,"154":0,"155":0,"170":0,"171":0,"172":0,"175":0,"176":0,"178":0,"179":0,"182":0,"183":0,"187":0,"188":0,"192":0,"193":0,"196":0,"212":0,"213":0,"231":0,"232":0,"262":0,"264":0,"265":0,"269":0,"270":0,"273":0,"276":0,"278":0,"282":0,"286":0,"288":0,"289":0,"293":0,"294":0,"297":0,"299":0,"301":0,"302":0,"306":0,"307":0,"308":0,"309":0,"310":0,"315":0,"323":0,"324":0,"325":0,"326":0,"327":0,"329":0,"333":0,"336":0,"354":0,"355":0,"357":0,"358":0,"361":0,"379":0,"380":0,"381":0,"382":0,"385":0};
_yuitest_coverage["/build/oop/oop.js"].functions = {"dispatch:18":0,"]:93":0,"copy:88":0,"unsequester:102":0,"(anonymous 2):120":0,"augment:69":0,"aggregate:154":0,"extend:170":0,"each:212":0,"some:231":0,"(anonymous 3):307":0,"(anonymous 4):324":0,"clone:262":0,"(anonymous 5):357":0,"bind:354":0,"(anonymous 6):381":0,"rbind:379":0,"(anonymous 1):1":0};
_yuitest_coverage["/build/oop/oop.js"].coveredLines = 100;
_yuitest_coverage["/build/oop/oop.js"].coveredFunctions = 18;
_yuitest_coverline("/build/oop/oop.js", 1);
YUI.add('oop', function(Y) {

/**
Adds object inheritance and manipulation utilities to the YUI instance. This
module is required by most YUI components.

@module oop
**/

_yuitest_coverfunc("/build/oop/oop.js", "(anonymous 1)", 1);
_yuitest_coverline("/build/oop/oop.js", 10);
var L            = Y.Lang,
    A            = Y.Array,
    OP           = Object.prototype,
    CLONE_MARKER = '_~yuim~_',

    hasOwn   = OP.hasOwnProperty,
    toString = OP.toString;

_yuitest_coverline("/build/oop/oop.js", 18);
function dispatch(o, f, c, proto, action) {
    _yuitest_coverfunc("/build/oop/oop.js", "dispatch", 18);
_yuitest_coverline("/build/oop/oop.js", 19);
if (o && o[action] && o !== Y) {
        _yuitest_coverline("/build/oop/oop.js", 20);
return o[action].call(o, f, c);
    } else {
        _yuitest_coverline("/build/oop/oop.js", 22);
switch (A.test(o)) {
            case 1:
                _yuitest_coverline("/build/oop/oop.js", 24);
return A[action](o, f, c);
            case 2:
                _yuitest_coverline("/build/oop/oop.js", 26);
return A[action](Y.Array(o, 0, true), f, c);
            default:
                _yuitest_coverline("/build/oop/oop.js", 28);
return Y.Object[action](o, f, c, proto);
        }
    }
}

/**
Augments the _receiver_ with prototype properties from the _supplier_. The
receiver may be a constructor function or an object. The supplier must be a
constructor function.

If the _receiver_ is an object, then the _supplier_ constructor will be called
immediately after _receiver_ is augmented, with _receiver_ as the `this` object.

If the _receiver_ is a constructor function, then all prototype methods of
_supplier_ that are copied to _receiver_ will be sequestered, and the
_supplier_ constructor will not be called immediately. The first time any
sequestered method is called on the _receiver_'s prototype, all sequestered
methods will be immediately copied to the _receiver_'s prototype, the
_supplier_'s constructor will be executed, and finally the newly unsequestered
method that was called will be executed.

This sequestering logic sounds like a bunch of complicated voodoo, but it makes
it cheap to perform frequent augmentation by ensuring that suppliers'
constructors are only called if a supplied method is actually used. If none of
the supplied methods is ever used, then there's no need to take the performance
hit of calling the _supplier_'s constructor.

@method augment
@param {Function|Object} receiver Object or function to be augmented.
@param {Function} supplier Function that supplies the prototype properties with
  which to augment the _receiver_.
@param {Boolean} [overwrite=false] If `true`, properties already on the receiver
  will be overwritten if found on the supplier's prototype.
@param {String[]} [whitelist] An array of property names. If specified,
  only the whitelisted prototype properties will be applied to the receiver, and
  all others will be ignored.
@param {Array|any} [args] Argument or array of arguments to pass to the
  supplier's constructor when initializing.
@return {Function} Augmented object.
@for YUI
**/
_yuitest_coverline("/build/oop/oop.js", 69);
Y.augment = function (receiver, supplier, overwrite, whitelist, args) {
    _yuitest_coverfunc("/build/oop/oop.js", "augment", 69);
_yuitest_coverline("/build/oop/oop.js", 70);
var rProto    = receiver.prototype,
        sequester = rProto && supplier,
        sProto    = supplier.prototype,
        to        = rProto || receiver,

        copy,
        newPrototype,
        replacements,
        sequestered,
        unsequester;

    _yuitest_coverline("/build/oop/oop.js", 81);
args = args ? Y.Array(args) : [];

    _yuitest_coverline("/build/oop/oop.js", 83);
if (sequester) {
        _yuitest_coverline("/build/oop/oop.js", 84);
newPrototype = {};
        _yuitest_coverline("/build/oop/oop.js", 85);
replacements = {};
        _yuitest_coverline("/build/oop/oop.js", 86);
sequestered  = {};

        _yuitest_coverline("/build/oop/oop.js", 88);
copy = function (value, key) {
            _yuitest_coverfunc("/build/oop/oop.js", "copy", 88);
_yuitest_coverline("/build/oop/oop.js", 89);
if (overwrite || !(key in rProto)) {
                _yuitest_coverline("/build/oop/oop.js", 90);
if (toString.call(value) === '[object Function]') {
                    _yuitest_coverline("/build/oop/oop.js", 91);
sequestered[key] = value;

                    _yuitest_coverline("/build/oop/oop.js", 93);
newPrototype[key] = replacements[key] = function () {
                        _yuitest_coverfunc("/build/oop/oop.js", "]", 93);
_yuitest_coverline("/build/oop/oop.js", 94);
return unsequester(this, value, arguments);
                    };
                } else {
                    _yuitest_coverline("/build/oop/oop.js", 97);
newPrototype[key] = value;
                }
            }
        };

        _yuitest_coverline("/build/oop/oop.js", 102);
unsequester = function (instance, fn, fnArgs) {
            // Unsequester all sequestered functions.
            _yuitest_coverfunc("/build/oop/oop.js", "unsequester", 102);
_yuitest_coverline("/build/oop/oop.js", 104);
for (var key in sequestered) {
                _yuitest_coverline("/build/oop/oop.js", 105);
if (hasOwn.call(sequestered, key)
                        && instance[key] === replacements[key]) {

                    _yuitest_coverline("/build/oop/oop.js", 108);
instance[key] = sequestered[key];
                }
            }

            // Execute the supplier constructor.
            _yuitest_coverline("/build/oop/oop.js", 113);
supplier.apply(instance, args);

            // Finally, execute the original sequestered function.
            _yuitest_coverline("/build/oop/oop.js", 116);
return fn.apply(instance, fnArgs);
        };

        _yuitest_coverline("/build/oop/oop.js", 119);
if (whitelist) {
            _yuitest_coverline("/build/oop/oop.js", 120);
Y.Array.each(whitelist, function (name) {
                _yuitest_coverfunc("/build/oop/oop.js", "(anonymous 2)", 120);
_yuitest_coverline("/build/oop/oop.js", 121);
if (name in sProto) {
                    _yuitest_coverline("/build/oop/oop.js", 122);
copy(sProto[name], name);
                }
            });
        } else {
            _yuitest_coverline("/build/oop/oop.js", 126);
Y.Object.each(sProto, copy, null, true);
        }
    }

    _yuitest_coverline("/build/oop/oop.js", 130);
Y.mix(to, newPrototype || sProto, overwrite, whitelist);

    _yuitest_coverline("/build/oop/oop.js", 132);
if (!sequester) {
        _yuitest_coverline("/build/oop/oop.js", 133);
supplier.apply(to, args);
    }

    _yuitest_coverline("/build/oop/oop.js", 136);
return receiver;
};

/**
 * Copies object properties from the supplier to the receiver. If the target has
 * the property, and the property is an object, the target object will be
 * augmented with the supplier's value.
 *
 * @method aggregate
 * @param {Object} receiver Object to receive the augmentation.
 * @param {Object} supplier Object that supplies the properties with which to
 *     augment the receiver.
 * @param {Boolean} [overwrite=false] If `true`, properties already on the receiver
 *     will be overwritten if found on the supplier.
 * @param {String[]} [whitelist] Whitelist. If supplied, only properties in this
 *     list will be applied to the receiver.
 * @return {Object} Augmented object.
 */
_yuitest_coverline("/build/oop/oop.js", 154);
Y.aggregate = function(r, s, ov, wl) {
    _yuitest_coverfunc("/build/oop/oop.js", "aggregate", 154);
_yuitest_coverline("/build/oop/oop.js", 155);
return Y.mix(r, s, ov, wl, 0, true);
};

/**
 * Utility to set up the prototype, constructor and superclass properties to
 * support an inheritance strategy that can chain constructors and methods.
 * Static members will not be inherited.
 *
 * @method extend
 * @param {function} r   the object to modify.
 * @param {function} s the object to inherit.
 * @param {object} px prototype properties to add/override.
 * @param {object} sx static properties to add/override.
 * @return {object} the extended object.
 */
_yuitest_coverline("/build/oop/oop.js", 170);
Y.extend = function(r, s, px, sx) {
    _yuitest_coverfunc("/build/oop/oop.js", "extend", 170);
_yuitest_coverline("/build/oop/oop.js", 171);
if (!s || !r) {
        _yuitest_coverline("/build/oop/oop.js", 172);
Y.error('extend failed, verify dependencies');
    }

    _yuitest_coverline("/build/oop/oop.js", 175);
var sp = s.prototype, rp = Y.Object(sp);
    _yuitest_coverline("/build/oop/oop.js", 176);
r.prototype = rp;

    _yuitest_coverline("/build/oop/oop.js", 178);
rp.constructor = r;
    _yuitest_coverline("/build/oop/oop.js", 179);
r.superclass = sp;

    // assign constructor property
    _yuitest_coverline("/build/oop/oop.js", 182);
if (s != Object && sp.constructor == OP.constructor) {
        _yuitest_coverline("/build/oop/oop.js", 183);
sp.constructor = s;
    }

    // add prototype overrides
    _yuitest_coverline("/build/oop/oop.js", 187);
if (px) {
        _yuitest_coverline("/build/oop/oop.js", 188);
Y.mix(rp, px, true);
    }

    // add object overrides
    _yuitest_coverline("/build/oop/oop.js", 192);
if (sx) {
        _yuitest_coverline("/build/oop/oop.js", 193);
Y.mix(r, sx, true);
    }

    _yuitest_coverline("/build/oop/oop.js", 196);
return r;
};

/**
 * Executes the supplied function for each item in
 * a collection.  Supports arrays, objects, and
 * NodeLists
 * @method each
 * @param {object} o the object to iterate.
 * @param {function} f the function to execute.  This function
 * receives the value, key, and object as parameters.
 * @param {object} c the execution context for the function.
 * @param {boolean} proto if true, prototype properties are
 * iterated on objects.
 * @return {YUI} the YUI instance.
 */
_yuitest_coverline("/build/oop/oop.js", 212);
Y.each = function(o, f, c, proto) {
    _yuitest_coverfunc("/build/oop/oop.js", "each", 212);
_yuitest_coverline("/build/oop/oop.js", 213);
return dispatch(o, f, c, proto, 'each');
};

/**
 * Executes the supplied function for each item in
 * a collection.  The operation stops if the function
 * returns true. Supports arrays, objects, and
 * NodeLists.
 * @method some
 * @param {object} o the object to iterate.
 * @param {function} f the function to execute.  This function
 * receives the value, key, and object as parameters.
 * @param {object} c the execution context for the function.
 * @param {boolean} proto if true, prototype properties are
 * iterated on objects.
 * @return {boolean} true if the function ever returns true,
 * false otherwise.
 */
_yuitest_coverline("/build/oop/oop.js", 231);
Y.some = function(o, f, c, proto) {
    _yuitest_coverfunc("/build/oop/oop.js", "some", 231);
_yuitest_coverline("/build/oop/oop.js", 232);
return dispatch(o, f, c, proto, 'some');
};

/**
 * Deep object/array copy.  Function clones are actually
 * wrappers around the original function.
 * Array-like objects are treated as arrays.
 * Primitives are returned untouched.  Optionally, a
 * function can be provided to handle other data types,
 * filter keys, validate values, etc.
 *
 * @method clone
 * @param {object} o what to clone.
 * @param {boolean} safe if true, objects will not have prototype
 * items from the source.  If false, they will.  In this case, the
 * original is initially protected, but the clone is not completely
 * immune from changes to the source object prototype.  Also, cloned
 * prototype items that are deleted from the clone will result
 * in the value of the source prototype being exposed.  If operating
 * on a non-safe clone, items should be nulled out rather than deleted.
 * @param {function} f optional function to apply to each item in a
 * collection; it will be executed prior to applying the value to
 * the new object.  Return false to prevent the copy.
 * @param {object} c optional execution context for f.
 * @param {object} owner Owner object passed when clone is iterating
 * an object.  Used to set up context for cloned functions.
 * @param {object} cloned hash of previously cloned objects to avoid
 * multiple clones.
 * @return {Array|Object} the cloned object.
 */
_yuitest_coverline("/build/oop/oop.js", 262);
Y.clone = function(o, safe, f, c, owner, cloned) {

    _yuitest_coverfunc("/build/oop/oop.js", "clone", 262);
_yuitest_coverline("/build/oop/oop.js", 264);
if (!L.isObject(o)) {
        _yuitest_coverline("/build/oop/oop.js", 265);
return o;
    }

    // @todo cloning YUI instances doesn't currently work
    _yuitest_coverline("/build/oop/oop.js", 269);
if (Y.instanceOf(o, YUI)) {
        _yuitest_coverline("/build/oop/oop.js", 270);
return o;
    }

    _yuitest_coverline("/build/oop/oop.js", 273);
var o2, marked = cloned || {}, stamp,
        yeach = Y.each;

    _yuitest_coverline("/build/oop/oop.js", 276);
switch (L.type(o)) {
        case 'date':
            _yuitest_coverline("/build/oop/oop.js", 278);
return new Date(o);
        case 'regexp':
            // if we do this we need to set the flags too
            // return new RegExp(o.source);
            _yuitest_coverline("/build/oop/oop.js", 282);
return o;
        case 'function':
            // o2 = Y.bind(o, owner);
            // break;
            _yuitest_coverline("/build/oop/oop.js", 286);
return o;
        case 'array':
            _yuitest_coverline("/build/oop/oop.js", 288);
o2 = [];
            _yuitest_coverline("/build/oop/oop.js", 289);
break;
        default:

            // #2528250 only one clone of a given object should be created.
            _yuitest_coverline("/build/oop/oop.js", 293);
if (o[CLONE_MARKER]) {
                _yuitest_coverline("/build/oop/oop.js", 294);
return marked[o[CLONE_MARKER]];
            }

            _yuitest_coverline("/build/oop/oop.js", 297);
stamp = Y.guid();

            _yuitest_coverline("/build/oop/oop.js", 299);
o2 = (safe) ? {} : Y.Object(o);

            _yuitest_coverline("/build/oop/oop.js", 301);
o[CLONE_MARKER] = stamp;
            _yuitest_coverline("/build/oop/oop.js", 302);
marked[stamp] = o;
    }

    // #2528250 don't try to clone element properties
    _yuitest_coverline("/build/oop/oop.js", 306);
if (!o.addEventListener && !o.attachEvent) {
        _yuitest_coverline("/build/oop/oop.js", 307);
yeach(o, function(v, k) {
_yuitest_coverfunc("/build/oop/oop.js", "(anonymous 3)", 307);
_yuitest_coverline("/build/oop/oop.js", 308);
if ((k || k === 0) && (!f || (f.call(c || this, v, k, this, o) !== false))) {
                _yuitest_coverline("/build/oop/oop.js", 309);
if (k !== CLONE_MARKER) {
                    _yuitest_coverline("/build/oop/oop.js", 310);
if (k == 'prototype') {
                        // skip the prototype
                    // } else if (o[k] === o) {
                    //     this[k] = this;
                    } else {
                        _yuitest_coverline("/build/oop/oop.js", 315);
this[k] =
                            Y.clone(v, safe, f, c, owner || o, marked);
                    }
                }
            }
        }, o2);
    }

    _yuitest_coverline("/build/oop/oop.js", 323);
if (!cloned) {
        _yuitest_coverline("/build/oop/oop.js", 324);
Y.Object.each(marked, function(v, k) {
            _yuitest_coverfunc("/build/oop/oop.js", "(anonymous 4)", 324);
_yuitest_coverline("/build/oop/oop.js", 325);
if (v[CLONE_MARKER]) {
                _yuitest_coverline("/build/oop/oop.js", 326);
try {
                    _yuitest_coverline("/build/oop/oop.js", 327);
delete v[CLONE_MARKER];
                } catch (e) {
                    _yuitest_coverline("/build/oop/oop.js", 329);
v[CLONE_MARKER] = null;
                }
            }
        }, this);
        _yuitest_coverline("/build/oop/oop.js", 333);
marked = null;
    }

    _yuitest_coverline("/build/oop/oop.js", 336);
return o2;
};


/**
 * Returns a function that will execute the supplied function in the
 * supplied object's context, optionally adding any additional
 * supplied parameters to the beginning of the arguments collection the
 * supplied to the function.
 *
 * @method bind
 * @param {Function|String} f the function to bind, or a function name
 * to execute on the context object.
 * @param {object} c the execution context.
 * @param {any} args* 0..n arguments to include before the arguments the
 * function is executed with.
 * @return {function} the wrapped function.
 */
_yuitest_coverline("/build/oop/oop.js", 354);
Y.bind = function(f, c) {
    _yuitest_coverfunc("/build/oop/oop.js", "bind", 354);
_yuitest_coverline("/build/oop/oop.js", 355);
var xargs = arguments.length > 2 ?
            Y.Array(arguments, 2, true) : null;
    _yuitest_coverline("/build/oop/oop.js", 357);
return function() {
        _yuitest_coverfunc("/build/oop/oop.js", "(anonymous 5)", 357);
_yuitest_coverline("/build/oop/oop.js", 358);
var fn = L.isString(f) ? c[f] : f,
            args = (xargs) ?
                xargs.concat(Y.Array(arguments, 0, true)) : arguments;
        _yuitest_coverline("/build/oop/oop.js", 361);
return fn.apply(c || fn, args);
    };
};

/**
 * Returns a function that will execute the supplied function in the
 * supplied object's context, optionally adding any additional
 * supplied parameters to the end of the arguments the function
 * is executed with.
 *
 * @method rbind
 * @param {Function|String} f the function to bind, or a function name
 * to execute on the context object.
 * @param {object} c the execution context.
 * @param {any} args* 0..n arguments to append to the end of
 * arguments collection supplied to the function.
 * @return {function} the wrapped function.
 */
_yuitest_coverline("/build/oop/oop.js", 379);
Y.rbind = function(f, c) {
    _yuitest_coverfunc("/build/oop/oop.js", "rbind", 379);
_yuitest_coverline("/build/oop/oop.js", 380);
var xargs = arguments.length > 2 ? Y.Array(arguments, 2, true) : null;
    _yuitest_coverline("/build/oop/oop.js", 381);
return function() {
        _yuitest_coverfunc("/build/oop/oop.js", "(anonymous 6)", 381);
_yuitest_coverline("/build/oop/oop.js", 382);
var fn = L.isString(f) ? c[f] : f,
            args = (xargs) ?
                Y.Array(arguments, 0, true).concat(xargs) : arguments;
        _yuitest_coverline("/build/oop/oop.js", 385);
return fn.apply(c || fn, args);
    };
};


}, '@VERSION@' ,{requires:['yui-base']});
