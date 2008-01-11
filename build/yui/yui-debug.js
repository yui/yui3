if (typeof YUI === 'undefined' || !YUI) {
    /**
     * The YAHOO global namespace object.  If YAHOO is already defined, the
     * existing YAHOO object will not be overwritten so that defined
     * namespaces are preserved.  
     * @class YAHOO
     * @static
     */
    var YUI = function(o) {
        // Allow var yui = YUI() instead of var yui = new YUI()
        if (window === this) {
            return new YUI(o).log('creating new instance');
        } else {
            this.init(o);
        }
    };
}


YUI.prototype = {
    core: ["ua", "lang", "dump", "substitute", "later"],
    version: '3.0.0', // @todo probably doesn't go here

    /**
     * Initialize this YUI instance
     * @param o config options
     */
    init: function(o, precore) {

        this.env = {
            // @todo expand the new module metadata
            mods: {},
            _yuicount: 0,

            // @todo remove/convert the old reg stuff
            modules: [],
            listeners: [],
            getVersion: function(name) {
                return this.env.modules[name] || null;
            }
        };

        // @todo rename listener, YAHOO_config, and verify that it is still needed
        if ("undefined" !== typeof YAHOO_config) {
            var l=YAHOO_config.listener,ls=this.env.listeners,unique=true,i;
            if (l) {
                // if YAHOO is loaded multiple times we need to check to see if
                // this is a new config object.  If it is, add the new component
                // load listener to the stack
                for (i=0;i<ls.length;i=i+1) {
                    if (ls[i]==l) {
                        unique=false;
                        break;
                    }
                }
                if (unique) {
                    ls.push(l);
                }
            }
        }

        this._yuiidx = YUI.env._yuicount++;
        this._uididx = 0;
        this.id = this.uid('YUI');
        this.namespace("util", "widget", "example");
        if (!precore) {
            // This fails initially for the global (needs to be applied after
            // the core dependencies have been included).
            this.use.apply(this, this.core);
        }
        this.log(this._yuiidx + ') init ');
    },

    /**
     * Register a module
     * @method add
     * @param name {string} module name
     * @param namespace {string} name space for the module
     * @param fn {Function} entry point into the module that
     * is used to bind module to the YUI instance
     * @param version {string} version string
     * @return {YUI} the YUI instance
     */
    add: function(name, namespace, fn, version) {

        this.log('Adding a new component' + name);

        // @todo expand this to include version mapping
        
        // @todo allow requires/supersedes

        // @todo may want to restore the build property
        
        // @todo fire moduleAvailable event
        
        YUI.env.mods[name] = {
            name: name, 
            namespace: namespace, 
            fn: fn,
            version: version
        };

        return this; // chain support
    },

    /**
     * Bind a module to a YUI instance
     * @param {string} 1-n modules to bind (uses arguments array)
     * @return {YUI} the YUI instance
     */
    use: function() {
        var a=arguments, mods=YUI.env.mods;

        // YUI().use('*');
        // shortcut should use the loader to assure proper order?
        if (a[0] === "*") {
            return this.use.apply(this, mods);
        }

        for (var i=0; i<a.length; i=i+1) {

            // @todo 
            // Implement versioning?  loader can load different versions?
            // Should sub-modules/plugins be normal modules, or do
            // we add syntax for specifying these?
            //
            // YUI().use('dragdrop')
            // YUI().use('dragdrop:2.4.0'); // specific version
            // YUI().use('dragdrop:2.4.0-'); // at least this version
            // YUI().use('dragdrop:2.4.0-2.9999.9999'); // version range
            // YUI().use('*'); // use all available modules
            // YUI().use('lang+dump+substitute'); // use lang and some plugins
            // YUI().use('lang+*'); // use lang and all known plugins

            var m = mods[a[i]];

            this.log('using ' + a[i]);

            if (m) {

                if (m.namespace) {
                    this.namespace(m.namespace);
                }

                m.fn(this);
            } else {
                this.log('module not found: ' + a[i]);
            }
        }

        return this; // chain support var yui = YUI().use('dragdrop');
    },

    /**
     * Returns the namespace specified and creates it if it doesn't exist
     * <pre>
     * YAHOO.namespace("property.package");
     * YAHOO.namespace("YAHOO.property.package");
     * </pre>
     * Either of the above would create YAHOO.property, then
     * YAHOO.property.package
     *
     * Be careful when naming packages. Reserved words may work in some browsers
     * and not others. For instance, the following will fail in Safari:
     * <pre>
     * YAHOO.namespace("really.long.nested.namespace");
     * </pre>
     * This fails because "long" is a future reserved word in ECMAScript
     *
     * @method namespace
     * @static
     * @param  {String*} arguments 1-n namespaces to create 
     * @return {Object}  A reference to the last namespace object created
     */
    namespace: function() {
        var a=arguments, o=null, i, j, d;
        for (i=0; i<a.length; i=i+1) {
            d = a[i].split(".");
            o = this;
            for (j=(d[0] == "YUI") ? 1 : 0; j<d.length; j=j+1) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
        return o;
    },

    /**
     * Uses YAHOO.widget.Logger to output a log message, if the widget is
     * available.
     *
     * @method log
     * @static
     * @param  {String}  msg  The message to log.
     * @param  {String}  cat  The log category for the message.  Default
     *                        categories are "info", "warn", "error", time".
     *                        Custom categories can be used as well. (opt)
     * @param  {String}  src  The source of the the message (opt)
     * @return {YUI}      YUI instance
     */
    log: function(msg, cat, src) {

        // @todo take out automatic console logging, but provide
        // a way to enable console logging without the logger
        // component.

        var l=(this.widget && this.widget.Logger) || console;
        if(l && l.log) {
            l.log(msg, cat || "", src || "");
        } 

        return this;
    },

    fail: function(msg, e, eType) {
        YAHOO.log(msg, "error");

        // @todo provide a configuration option that determines if YUI 
        // generated errors throws a javascript error.  Some errors
        // should always generate a js error.  If an error type
        // is provided, that error is thrown regardless of the 
        // configuration.
        if (true) {
            e = e || new Error(msg);
        }

        return this;
    },

    /**
     * Registers a module with the YAHOO object
     * @method register
     * @static
     * @param {String}   name    the name of the module (event, slider, etc)
     * @param {Function} mainClass a reference to class in the module.  This
     *                             class will be tagged with the version info
     *                             so that it will be possible to identify the
     *                             version that is in use when multiple versions
     *                             have loaded
     * @param {Object}   data      metadata object for the module.  Currently it
     *                             is expected to contain a "version" property
     *                             and a "build" property at minimum.
     */
    register: function(name, mainClass, data) {
        var mods = this.env.modules;
        if (!mods[name]) {
            mods[name] = { versions:[], builds:[] };
        }
        var m=mods[name],v=data.version,b=data.build,ls=this.env.listeners;
        m.name = name;
        m.version = v;
        m.build = b;
        m.versions.push(v);
        m.builds.push(b);
        m.mainClass = mainClass;
        // fire the module load listeners
        for (var i=0;i<ls.length;i=i+1) {
            ls[i](m);
        }
        // label the main class
        if (mainClass) {
            mainClass.VERSION = v;
            mainClass.BUILD = b;
        } else {
            this.log("mainClass is undefined for module " + name, "warn");
        }
    },

    /**
     * Returns a new object containing all of the properties of
     * all the supplied objects.  The properties from later objects
     * will overwrite those in earlier objects.
     * @method merge
     * @since 2.3.0
     * @param arguments {Object*} the objects to merge
     * @return the new merged object
     */
    merge: function() {
        var o={}, a=arguments;
        for (var i=0, l=a.length; i<l; i=i+1) {
            this.augmentObject(o, a[i], true);
        }
        return o;
    },

    /**
     * IE will not enumerate native functions in a derived object even if the
     * function was overridden.  This is a workaround for specific functions 
     * we care about on the Object prototype. 
     * @property _iefix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param w a whitelist object (the keys are the valid items to reference)
     * @static
     * @private
     */
    _iefix: function(r, s, w) {
        var env = this.env, ua = env && env.ua, l=this.lang, op=Object.prototype;
        if (ua && ua.ie) {
            var a=["toString", "valueOf"], i;
            for (i=0; i<a.length; i=i+1) {
                var n=a[i],f=s[n];
                if (l.isFunction(f) && f != op[n]) {
                    if (!w || (n in w)) {
                        r[n]=f;
                    }
                }
            }
        }
    },
       
    /**
     * Applies all properties in the supplier to the receiver if the
     * receiver does not have these properties yet.  Optionally, one or 
     * more methods/properties can be specified (as additional 
     * parameters).  This option will overwrite the property if receiver 
     * has it already.  If true is passed as the third parameter, all 
     * properties will be applied and _will_ overwrite properties in 
     * the receiver.
     *
     * @method augmentObject
     * @static
     * @since 2.3.0
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  arguments zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything
     *        in the supplier will be used unless it would
     *        overwrite an existing property in the receiver. If true
     *        is specified as the third parameter, all properties will
     *        be applied and will overwrite an existing property in
     *        the receiver
     */
    //augmentObject: function(r, s) {
        //var a = Array.prototype.slice.call(arguments, 2);
        //return this.augment(r, s, 2, a, (a.length));
    //},
 
    /**
     * Same as YAHOO.lang.augmentObject, except it only applies prototype properties
     * @see YAHOO.lang.augmentObject
     * @method augmentProto
     * @static
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*|boolean}  arguments zero or more properties methods 
     *        to augment the receiver with.  If none specified, everything 
     *        in the supplier will be used unless it would overwrite an existing 
     *        property in the receiver.  if true is specified as the third 
     *        parameter, all properties will be applied and will overwrite an 
     *        existing property in the receiver
     */
    //augmentProto: function(r, s) {
        //var a = Array.prototype.slice.call(arguments, 2);
        //return this.augment(r, s, 1, a, (a.length));
    //},

    augmentObject: function(r, s) {
        if (!s||!r) {
            throw new Error("augment failed, verify dependencies.");
        }
        var a=arguments, i, p, override=a[2];
        if (override && override!==true) { // only absorb the specified properties
            for (i=2; i<a.length; i=i+1) {
                r[a[i]] = s[a[i]];
            }
        } else { // take everything, overwriting only if the third parameter is true
            for (p in s) { 
                if (override || !r[p]) {
                    r[p] = s[p];
                }
            }
            
            this._iefix(r, s);
        }
    },
 
    augmentProto: function(r, s) {
        if (!s||!r) {
            throw new Error("Augment failed, verify dependencies.");
        }
        //var a=[].concat(arguments);
        var a=[r.prototype,s.prototype];
        for (var i=2;i<arguments.length;i=i+1) {
            a.push(arguments[i]);
        }
        YAHOO.lang.augmentObject.apply(this, a);
    },

    /**
     * Applies the supplier's properties to the receiver.  By default
     * all prototype and static propertes on the supplier are applied
     * to the corresponding spot on the receiver.  By default all
     * properties are applied, and a property that is already on the
     * reciever will not be overwritten.  The default behavior can
     * be modified by supplying the appropriate parameters.
     * @method augment
     * @static
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {int} mode what should be copies, and to where
     *        default(0): prototype to prototype and static to static
     *        1: prototype to prototype
     *        2: static to static
     *        3: prototype to static
     *        4: static to prototype
     * @param wl {string[]} a whitelist.  If supplied, only properties in 
     * this list will be applied to the receiver.
     * @param ov {boolean} if true, properties already on the receiver
     * will be overwritten if found on the supplier.
     * @return {YUI} the YUI instance
     */
    augment: function(r, s, mode, wl, ov) {

        if (!s||!r) {
            throw new Error("augment failed, verify dependencies.");
        }

        var w = null, o=ov, ief = this._iefix, i;

        // convert the white list array to a hash
        if (wl) {
            w = {};
            for (i=0; i<wl.length; i=i+1) {
                w[i] = true;
            }
        }

        var f = function(r, s) {
            for (var i in s) { 
                if (o || !r[i]) {
                    if (!w || (i in w)) {
                        r[i] = s[i];
                    }
                }
            }

            ief(r, s, w);
        };

        var rp = r.prototype, sp = s.prototype;

        switch (mode) {
            case 1: // proto to proto
                f(rp, sp);
                break;
            case 2: // static to static
                f(r, s);
                break;
            case 3: // proto to static
                f(r, sp);
                break;
            case 4: // static to proto
                f(rp, s);
                break;
            default: // both proto to proto and static to static
                f(rp, sp);
                f(r, s);
        }

        return this;
    },

    _extended: {
        /**
         * Execute a superclass method or constructor
         * @method Super
         * @param m {string} method name to execute.  If not provided, the 
         * constructor is executed. 
         * @param {String*} arguments 1-n arguments to apply.  If not supplied,
         * the callers arguments are applied
         *
         * Super();
         *
         * Super(null, arg1, arg2);
         *
         * Super('methodname');
         *
         * Super('methodname', arg1, arg2);
         *
         */
        Super: function(m) {
            var args = arguments,
                a = (args.length > 1) ?
                        Array.prototype.slice.call(args, 1) :
                        args.callee.caller.arguments,
                s = this.constructor.superclass;

            if (m) {
                if (m in s) {
                    s[m].apply(this, a);
                } else {
                    YAHOO.fail(m + " super method not found");
                }
            } else {
                s.constructor.apply(this, a);
            }
        }
    },

    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     * Static members will not be inherited.
     *
     * @method extend
     * @static
     * @param {Function} r   the object to modify
     * @param {Function} s the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass 
     *                              if present.
     */
    extend: function(r, s, overrides) {
        if (!s||!r) {
            throw new Error("extend failed, verify dependencies");
        }
        var F = function() {}, sp = s.prototype;
        F.prototype=s.prototype;
        r.prototype=new F();
        r.prototype.constructor=r;
        r.superclass=sp;

        // If the superclass doesn't have a standard constructor,
        // define one so that Super() works
        if (sp.constructor == Object.prototype.constructor) {
            sp.constructor=s;
        }
    
        if (overrides) {
            for (var i in overrides) {
                r.prototype[i]=overrides[i];
            }

            this._iefix(r.prototype, overrides);
        }

        // Copy static properties too
        this.augment(r, s, 2);

        // Add superclass convienience functions
        this.augment(r, this._extended, 4);

        return this;
    },
   

    // generate an id that is unique among all YUI instances
    uid: function(pre) {
        var p = (pre) || 'yui-uid';
        return p +'-' + this._yuiidx + '-' + this._uididx++;
    },

    // objects that will use the event system require a unique 
    // identifier.  An id will be generated and applied if one
    // isn't found
    stamp: function(o) {
        if (!o) {
            return o;
        }

        var id = (this.lang.isString(o)) ? o : o.id;

        if (!id) {
            id = this.uid();
            o.id = id;
        }

        return id;
    }
    
};

// Give the YUI global the same properties an instance would have.
// This means YUI works the same way YAHOO works today.
//YUI.prototype.augmentObject(YUI, YUI.prototype);
YUI.prototype.augment(YUI, YUI, 3);
YUI.init(true);

(function() {

    var M = function(Y) {

        // obj utils
        Y.obj = {
        };

        Y.obj.Extended = function() {

        };

        Y.obj.Extended.prototype = {

            /*
            Super: {
                exec: function() {
                },
            }
            */

        };


    };

    YUI.add("obj", null, M, "3.0.0");

})();

// requires env
(function() {

    var M = function(Y) {

        Y.env.ua = function() {
            var o={

                /**
                 * Internet Explorer version number or 0.  Example: 6
                 * @property ie
                 * @type float
                 */
                ie:0,

                /**
                 * Opera version number or 0.  Example: 9.2
                 * @property opera
                 * @type float
                 */
                opera:0,

                /**
                 * Gecko engine revision number.  Will evaluate to 1 if Gecko 
                 * is detected but the revision could not be found. Other browsers
                 * will be 0.  Example: 1.8
                 * <pre>
                 * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
                 * Firefox 1.5.0.9: 1.8.0.9 <-- Reports 1.8
                 * Firefox 2.0.0.3: 1.8.1.3 <-- Reports 1.8
                 * Firefox 3 alpha: 1.9a4   <-- Reports 1.9
                 * </pre>
                 * @property gecko
                 * @type float
                 */
                gecko:0,

                /**
                 * AppleWebKit version.  KHTML browsers that are not WebKit browsers 
                 * will evaluate to 1, other browsers 0.  Example: 418.9.1
                 * <pre>
                 * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the 
                 *                                   latest available for Mac OSX 10.3.
                 * Safari 2.0.2:         416     <-- hasOwnProperty introduced
                 * Safari 2.0.4:         418     <-- preventDefault fixed
                 * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
                 *                                   different versions of webkit
                 * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
                 *                                   updated, but not updated
                 *                                   to the latest patch.
                 * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native SVG
                 *                                   and many major issues fixed).
                 * Safari 3.0.4 (523.12) 523.12  <-- First Tiger release - automatic update
                 *                                   from 2.x via the 10.4.11 OS patch
                 *                                   
                 * </pre>
                 * http://developer.apple.com/internet/safari/uamatrix.html
                 * @property webkit
                 * @type float
                 */
                webkit:0,

                /**
                 * The mobile property will be set to a string containing any relevant
                 * user agent information when a modern mobile browser is detected.
                 * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
                 * devices with the WebKit-based browser, and Opera Mini.  
                 * @property mobile 
                 * @type string
                 */
                mobile: null 
            };

            var ua=navigator.userAgent, m;

            // Modern KHTML browsers should qualify as Safari X-Grade
            if ((/KHTML/).test(ua)) {
                o.webkit=1;
            }
            // Modern WebKit browsers are at least X-Grade
            m=ua.match(/AppleWebKit\/([^\s]*)/);
            if (m&&m[1]) {
                o.webkit=parseFloat(m[1]);

                // Mobile browser check
                if (/ Mobile\//.test(ua)) {
                    o.mobile = "Apple"; // iPhone or iPod Touch
                } else {
                    m=ua.match(/NokiaN[^\/]*/);
                    if (m) {
                        o.mobile = m[0]; // Nokia N-series, ex: NokiaN95
                    }
                }

            }

            if (!o.webkit) { // not webkit
                // @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
                m=ua.match(/Opera[\s\/]([^\s]*)/);
                if (m&&m[1]) {
                    o.opera=parseFloat(m[1]);
                    m=ua.match(/Opera Mini[^;]*/);
                    if (m) {
                        o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                    }
                } else { // not opera or webkit
                    m=ua.match(/MSIE\s([^;]*)/);
                    if (m&&m[1]) {
                        o.ie=parseFloat(m[1]);
                    } else { // not opera, webkit, or ie
                        m=ua.match(/Gecko\/([^\s]*)/);
                        if (m) {
                            o.gecko=1; // Gecko detected, look for revision
                            m=ua.match(/rv:([^\s\)]*)/);
                            if (m&&m[1]) {
                                o.gecko=parseFloat(m[1]);
                            }
                        }
                    }
                }
            }
            
            return o;
        }();
    };

    // Register the module with the global YUI object
    YUI.add("ua", null , M, "3.0.0");

})();

(function() {

    var M = function(Y) {

        /**
         * Provides the language utilites and extensions used by the library
         * @class YAHOO.lang
         */
        Y.lang = Y.lang || {

            /**
             * Determines whether or not the provided object is an array.
             * Testing typeof/instanceof/constructor of arrays across frame 
             * boundaries isn't possible in Safari unless you have a reference
             * to the other frame to test against its Array prototype.  To
             * handle this case, we test well-known array properties instead.
             * properties.
             * @method isArray
             * @param {any} o The object being testing
             * @return Boolean
             */
            isArray: function(o) { 

                if (o) {
                   var l = Y.lang;
                   return l.isNumber(o.length) && l.isFunction(o.splice);
                }
                return false;
            },

            /**
             * Determines whether or not the provided object is a boolean
             * @method isBoolean
             * @param {any} o The object being testing
             * @return Boolean
             */
            isBoolean: function(o) {
                return typeof o === 'boolean';
            },
            
            /**
             * Determines whether or not the provided object is a function
             * @method isFunction
             * @param {any} o The object being testing
             * @return Boolean
             */
            isFunction: function(o) {
                return typeof o === 'function';
            },
                
            /**
             * Determines whether or not the provided object is null
             * @method isNull
             * @param {any} o The object being testing
             * @return Boolean
             */
            isNull: function(o) {
                return o === null;
            },
                
            /**
             * Determines whether or not the provided object is a legal number
             * @method isNumber
             * @param {any} o The object being testing
             * @return Boolean
             */
            isNumber: function(o) {
                return typeof o === 'number' && isFinite(o);
            },
              
            /**
             * Determines whether or not the provided object is of type object
             * or function
             * @method isObject
             * @param {any} o The object being testing
             * @return Boolean
             */  
            isObject: function(o) {
        return (o && (typeof o === 'object' || Y.lang.isFunction(o))) || false;
            },
                
            /**
             * Determines whether or not the provided object is a string
             * @method isString
             * @param {any} o The object being testing
             * @return Boolean
             */
            isString: function(o) {
                return typeof o === 'string';
            },
                
            /**
             * Determines whether or not the provided object is undefined
             * @method isUndefined
             * @param {any} o The object being testing
             * @return Boolean
             */
            isUndefined: function(o) {
                return typeof o === 'undefined';
            },
            
            /**
             * Determines whether or not the property was added
             * to the object instance.  Returns false if the property is not present
             * in the object, or was inherited from the prototype.
             * This abstraction is provided to enable hasOwnProperty for Safari 1.3.x.
             * There is a discrepancy between YAHOO.lang.hasOwnProperty and
             * Object.prototype.hasOwnProperty when the property is a primitive added to
             * both the instance AND prototype with the same value:
             * <pre>
             * var A = function() {};
             * A.prototype.foo = 'foo';
             * var a = new A();
             * a.foo = 'foo';
             * alert(a.hasOwnProperty('foo')); // true
             * alert(YAHOO.lang.hasOwnProperty(a, 'foo')); // false when using fallback
             * </pre>
             * @method hasOwnProperty
             * @param {any} o The object being testing
             * @return Boolean
             */
            hasOwnProperty: function(o, prop) {
                if (Object.prototype.hasOwnProperty) {
                    return o.hasOwnProperty(prop);
                }
                
                return !Y.lang.isUndefined(o[prop]) && 
                        o.constructor.prototype[prop] !== o[prop];
            },

            _iefix: Y._iefix,
            _extended: Y._extended,
            augmentObject: Y.augmentObject,
            extend: Y.extend,
            augmentObject: Y.augmentObject,
            augmentProto: Y.augmentProto,
            augment: Y.augment,

            /**
             * Returns a string without any leading or trailing whitespace.  If 
             * the input is not a string, the input will be returned untouched.
             * @method trim
             * @since 2.3.0
             * @param s {string} the string to trim
             * @return {string} the trimmed string
             */
            trim: function(s){
                try {
                    return s.replace(/^\s+|\s+$/g, "");
                } catch(e) {
                    return s;
                }
            },

            merge: Y.merge,

            /**
             * A convenience method for detecting a legitimate non-null value.
             * Returns false for null/undefined/NaN, true for other values, 
             * including 0/false/''
             * @method isValue
             * @since 2.3.0
             * @param o {any} the item to test
             * @return {boolean} true if it is not null/undefined/NaN || false
             */
            isValue: function(o) {
                // return (o || o === false || o === 0 || o === ''); // Infinity fails
                var l = Y.lang;
        return (l.isObject(o) || l.isString(o) || l.isNumber(o) || l.isBoolean(o));
            }

        };
    };

    // Register the module with the global YUI object
    YUI.add("lang", null , M, "3.0.0");

})();

// requires lang
(function() {

    var M = function(Y) {

        /**
         * Returns a simple string representation of the object or array.
         * Other types of objects will be returned unprocessed.  Arrays
         * are expected to be indexed.  Use object notation for
         * associative arrays.
         * @method dump
         * @since 2.3.0
         * @param o {Object} The object to dump
         * @param d {int} How deep to recurse child objects, default 3
         * @return {String} the dump result
         */
        Y.lang.dump = function(o, d) {
            var l=Y.lang,i,len,s=[],OBJ="{...}",FUN="f(){...}",
                COMMA=', ', ARROW=' => ';

            // Cast non-objects to string
            // Skip dates because the std toString is what we want
            // Skip HTMLElement-like objects because trying to dump 
            // an element will cause an unhandled exception in FF 2.x
            if (!l.isObject(o)) {
                return o + "";
            } else if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
                return o;
            } else if  (l.isFunction(o)) {
                return FUN;
            }

            // dig into child objects the depth specifed. Default 3
            d = (l.isNumber(d)) ? d : 3;

            // arrays [1, 2, 3]
            if (l.isArray(o)) {
                s.push("[");
                for (i=0,len=o.length;i<len;i=i+1) {
                    if (l.isObject(o[i])) {
                        s.push((d > 0) ? l.dump(o[i], d-1) : OBJ);
                    } else {
                        s.push(o[i]);
                    }
                    s.push(COMMA);
                }
                if (s.length > 1) {
                    s.pop();
                }
                s.push("]");
            // objects {k1 => v1, k2 => v2}
            } else {
                s.push("{");
                for (i in o) {
                    if (l.hasOwnProperty(o, i)) {
                        s.push(i + ARROW);
                        if (l.isObject(o[i])) {
                            s.push((d > 0) ? l.dump(o[i], d-1) : OBJ);
                        } else {
                            s.push(o[i]);
                        }
                        s.push(COMMA);
                    }
                }
                if (s.length > 1) {
                    s.pop();
                }
                s.push("}");
            }

            return s.join("");
        };
    };

    // Register the module with the global YUI object
    YUI.add("dump", null , M, "3.0.0");

})();

// requires lang, dump
(function() {

    var M = function(Y) {

        /**
         * Does variable substitution on a string. It scans through the string 
         * looking for expressions enclosed in { } braces. If an expression 
         * is found, it is used a key on the object.  If there is a space in
         * the key, the first word is used for the key and the rest is provided
         * to an optional function to be used to programatically determine the
         * value (the extra information might be used for this decision). If 
         * the value for the key in the object, or what is returned from the
         * function has a string value, number value, or object value, it is 
         * substituted for the bracket expression and it repeats.  If this
         * value is an object, it uses the Object's toString() if this has
         * been overridden, otherwise it does a shallow dump of the key/value
         * pairs.
         * @method substitute
         * @since 2.3.0
         * @param s {String} The string that will be modified.
         * @param o {Object} An object containing the replacement values
         * @param f {Function} An optional function that can be used to
         *                     process each match.  It receives the key,
         *                     value, and any extra metadata included with
         *                     the key inside of the braces.
         * @return {String} the substituted string
         */
        Y.lang.substitute = function (s, o, f) {
            var i, j, k, key, v, meta, l=Y.lang, saved=[], token, 
                DUMP='dump', SPACE=' ', LBRACE='{', RBRACE='}';


            for (;;) {
                i = s.lastIndexOf(LBRACE);
                if (i < 0) {
                    break;
                }
                j = s.indexOf(RBRACE, i);
                if (i + 1 >= j) {
                    break;
                }

                //Extract key and meta info 
                token = s.substring(i + 1, j);
                key = token;
                meta = null;
                k = key.indexOf(SPACE);
                if (k > -1) {
                    meta = key.substring(k + 1);
                    key = key.substring(0, k);
                }

                // lookup the value
                v = o[key];

                // if a substitution function was provided, execute it
                if (f) {
                    v = f(key, v, meta);
                }

                if (l.isObject(v)) {
                    if (l.isArray(v)) {
                        v = l.dump(v, parseInt(meta, 10));
                    } else {
                        meta = meta || "";

                        // look for the keyword 'dump', if found force obj dump
                        var dump = meta.indexOf(DUMP);
                        if (dump > -1) {
                            meta = meta.substring(4);
                        }

                        // use the toString if it is not the Object toString 
                        // and the 'dump' meta info was not found
                        if (v.toString===Object.prototype.toString||dump>-1) {
                            v = l.dump(v, parseInt(meta, 10));
                        } else {
                            v = v.toString();
                        }
                    }
                } else if (!l.isString(v) && !l.isNumber(v)) {
                    // This {block} has no replace string. Save it for later.
                    v = "~-" + saved.length + "-~";
                    saved[saved.length] = token;

                    // break;
                }

                s = s.substring(0, i) + v + s.substring(j + 1);


            }

            // restore saved {block}s
            for (i=saved.length-1; i>=0; i=i-1) {
                s = s.replace(new RegExp("~-" + i + "-~"), "{"  + saved[i] + "}", "g");
            }

            return s;

        };
    };

    // Register the module with the global YUI object
    YUI.add("substitute", null , M, "3.0.0");

})();

// requires lang
(function() {

    var M = function(Y) {

        /**
         * Executes the supplied function in the context of the supplied 
         * object 'when' milliseconds later.  Executes the function a 
         * single time unless periodic is set to true.
         * @method later
         * @since 2.4.0
         * @param when {int} the number of milliseconds to wait until the fn 
         * is executed
         * @param o the context object
         * @param fn {Function|String} the function to execute or the name of 
         * the method in the 'o' object to execute
         * @param data [Array] data that is provided to the function.  This accepts
         * either a single item or an array.  If an array is provided, the
         * function is executed with one parameter for each array item.  If
         * you need to pass a single array parameter, it needs to be wrapped in
         * an array [myarray]
         * @param periodic {boolean} if true, executes continuously at supplied 
         * interval until canceled
         * @return a timer object. Call the cancel() method on this object to 
         * stop the timer.
         */
        Y.lang.later = function(when, o, fn, data, periodic) {
            when = when || 0; 
            o = o || {};
            var m=fn, d=data, f, r;

            if (Y.lang.isString(fn)) {
                m = o[fn];
            }

            if (!m) {
                throw new TypeError("method undefined");
            }

            if (!Y.lang.isArray(d)) {
                d = [data];
            }

            f = function() {
                m.apply(o, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                interval: periodic,
                cancel: function() {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        };
    };

    // Register the module with the global YUI object
    YUI.add("later", null , M, "3.0.0");

})();

YUI.use.apply(YUI, YUI.core);
// Compatibility layer for 2.x
(function() {


    var o = (window.YAHOO) ? YUI.merge(window.YAHOO) : null;

    window.YAHOO = YUI;

    if (o) {
        //YUI.augmentObject(YUI, o);
        YUI.augment(YUI, o, 2);
    }

    // Protect against 2.x messing up the new augment (to some degree)
    var ex = YUI.prototype._extended;
    ex.prototype = {};
    YUI.augment(ex, ex, 4);

    // add registration for yahoo
    YUI.register("yahoo", YUI, {version: "@VERSION@", build: "@BUILD@"});

})();
YAHOO.register("yui", YUI, {version: "@VERSION@", build: "@BUILD@"});
