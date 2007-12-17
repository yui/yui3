/**
 * The YAHOO object is the single global object used by YUI Library.  It
 * contains utility function for setting up namespaces, inheritance, and
 * logging.  YAHOO.util, YAHOO.widget, and YAHOO.example are namespaces
 * created automatically for and used by the library.
 *
 * YUI/YAHOO global object and module definition proposal for 3.0
 * (the switch from YAHOO to YUI has not been confirmed).
 *
 * What needs to be fixed:
 *
 * The current YAHOO is not resilient when components are included
 * multiple times.  The problem is aggrevated if the redundant
 * components are from different versions of the library.
 *
 * Developers can't defend against this easily because the negative
 * effects take place immediately when the redundant component is
 * included, modifying existing objects and prototypes.
 *
 * Content from multiple sources, produced by multiple authors, and 
 * on different release cycles is common today.  All of these
 * sources could be using any version of YUI.  The current
 * YAHOO object can be difficult to work with if all the page content is
 * not controlled by an entity that is prepared to deal with managing
 * the YUI dependencies globally.
 *
 * The current workaround is to use YUILoader's sandbox capability
 * to load a complete YUI stack for modules that can live in multiple
 * environments.  This adds overhead, and requires that the module
 * is defined with this use in mind.
 *
 * A developer should be able to include the library and expect it
 * to work exactly the same way in isolation as it does when another
 * YUI stack is included before or after on the same page.
 * 
 * - Including a YUI component should not modify any existing YUI
 *   component on a page.
 *
 * - A developer that includes YUI components should be able to
 *   consume the exact code they included.
 *
 * To address this, this proposal has a few core implementation
 * differences from the current YAHOO implementation:
 *
 * - The global object can be instantiated to provide a clean
 *   YUI/YAHOO object that can be referenced in the application
 *   scope.
 *
 * - YUI components do not directly modify any shared
 *   properties when they are included in the page.
 *
 * - Developers can create a pristine YUI/YAHOO instance and
 *   specify the modules that are needed.  Only then is the
 *   component bound to the YUI/YAHOO instance, and the
 *   inheritance chain established.
 *
 * - YUI components do not directly address a single YUI/YAHOO
 *   global object.  Instead they use a local reference
 *   which is assigned when a YUI/YAHOO instance binds the
 *   component.
 *
 *   2.x:
 *
 *   YAHOO = {}
 *   YAHOO.util = {}
 *   YAHOO.util.CustomEvent = function()
 *   YAHOO.util.CustomEvent.prototype = {}
 *   YAHOO.lang.extend()
 *   new YAHOO.util.CustomEvent()
 *
 *   3.x:
 *
 *   YUI = {}
 *   // Components included, no modification to YUI except updating
 *   // the component metadata.
 *   (function() { // Application context via anonymous function or module pattern
 *       var yui = YUI().use('yahoo', 'event');
 *       // The included CustomEvent is bound to the new YUI instance
 *       new yui.CustomEvent();
 *   })();
 *
 *   Downsides:
 *
 *   - Creates a required convention for component development.
 *     It looks like this should be taken care of by the build system.
 *
 *   - To use YUI, you must specify the component(s) you want.  Optionally
 *     we can provide a wildcard to get everything, but that would require
 *     that we go with YUILoader embedded (for dependency order).
 *     Maybe this is too complicated for little gain.  What happens if
 *     we bind everything?
 *
 *   Potential features:
 *
 *   - Integrate YUILoader.  Instead of requiring that the developer
 *     specify and include all dependencies, allow YUI to load missing
 *     dependencies.  Could be optional, defaulted to 'off' if we want
 *     to defend against lazy development practices.  It is a natural
 *     fit since we require that the developer specify what they will
 *     use anyway.
 *
 *   - Allow version range specification.  The protection the new YUI global
 *     offers makes version specification less important, but this could 
 *     provide an additional layer of protection when a given implementation
 *     requires a specific version or version range of YUI.
 *
 * @module yahoo
 * @title  YAHOO Global
 */

/**
 * YAHOO_config is not included as part of the library.  Instead it is an 
 * object that can be defined by the implementer immediately before 
 * including the YUI library.  The properties included in this object
 * will be used to configure global properties needed as soon as the 
 * library begins to load.
 * @class YAHOO_config
 * @static
 */

/**
 * A reference to a function that will be executed every time a YAHOO module
 * is loaded.  As parameter, this function will receive the version
 * information for the module. See <a href="YAHOO.env.html#getVersion">
 * YAHOO.env.getVersion</a> for the description of the version data structure.
 * @property listener
 * @type Function
 * @static
 * @default undefined
 */

/**
 * Set to true if the library will be dynamically loaded after window.onload.
 * Defaults to false 
 * @property injecting
 * @type boolean
 * @static
 * @default undefined
 */

/**
 * Forces the use of the supplied locale where applicable in the library
 * @property locale
 * @type string
 * @static
 * @default undefined
 */


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

YUI.info = YUI.info || {
    modules: {},
    count: 0
};

YUI.prototype = {
    version: '3.0.0',

    /**
     * Initialize this YUI instance
     * @param o config options
     */
    init: function(o) {
        // debug
        this.index = ++YUI.info.count;
        this.namespace("util", "widget", "example");
        this.use("env", "ua", "lang", "dump", "substitute", "later");
        this.log(this.index + ') init ');
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

        YUI.info.modules[name] = {
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
        var a=arguments, mods=YUI.info.modules;

        // YUI().use('*');
        // shortcut should use the loader to assure proper order
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
        var l=(this.widget && this.widget.Logger) || console;
        if(l && l.log) {
            l.log(msg, cat || "", src || "");
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
     * @property _IEEnumFix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @static
     * @private
     */
    _IEEnumFix: function(r, s) {
        if (this.env && this.env.ua.ie) {
            var add=["toString", "valueOf"], i;
            for (i=0;i<add.length;i=i+1) {
                var fname=add[i],f=s[fname];
                if (this.lang.isFunction(f) && f!=Object.prototype[fname]) {
                    r[fname]=f;
                }
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
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass 
     *                              if present.
     */
    extend: function(subc, superc, overrides) {
        if (!superc||!subc) {
            throw new Error("extend failed, verify that " +
                            "all dependencies are included.");
        }
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
    
        if (overrides) {
            for (var i in overrides) {
                subc.prototype[i]=overrides[i];
            }

            this._IEEnumFix(subc.prototype, overrides);
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
            
            this._IEEnumFix(r, s);
        }
    },
 
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
    augmentProto: function(r, s) {
        if (!s||!r) {
            throw new Error("Augment failed, verify dependencies.");
        }
        //var a=[].concat(arguments);
        var a=[r.prototype,s.prototype];
        for (var i=2;i<arguments.length;i=i+1) {
            a.push(arguments[i]);
        }
        this.augmentObject.apply(this, a);
    },

    augment: function() {
        this.augmentProto.apply(this, arguments);
    }
    
};

// Give the YUI global the same properties an instance would have.
// This means YUI works the same way YAHOO works today.
YUI.prototype.augmentObject(YUI, YUI.prototype);

/////////////////////////////////////////////////////////////////////////////

// The boilerplate code will be generated by the build system.


// // No namespace is available yet
// (function() {
// 
//     // The module will be invoked when yui.use() is called
//     var TabViewModule = function(YAHOO) {
// 
//         // Common shortcuts, property driven, generated by build system
//         var E = YAHOO.util.Event,
//             D = YAHOO.util.Dom;
// 
//         // The local YAHOO reference is the isolated YUI/YAHOO instance that
//         // this module has been bound to.
// 
//         /////////////////////////////////////////////////////////////////////
//         // Component source files start
//         /////////////////////////////////////////////////////////////////////
// 
//         YAHOO.widget.TabView = function() {};
//         YAHOO.widget.Tab = function() {};
// 
//         YAHOO.extend(YAHOO.widget.TabView, YAHOO.util.Element, {});
// 
//         /////////////////////////////////////////////////////////////////////
//         // Component source files end
//         /////////////////////////////////////////////////////////////////////
// 
//     };
// 
//     // Register the module with the global YUI object
//     YUI.add("tabview", "widget", TabViewModule, "3.0.0");
// 
// })();

// Compatibility layer for 2.x
(function() {
    var o = (window.YAHOO) ? YUI.merge(window.YAHOO) : null;

    window.YAHOO = YUI;

    if (o) {
        YUI.augmentObject(YUI, o);
    }

})();

// Usage:
//
// var Y = YUI().use('tabview'); // if yuiloader is embedded
// var Y = YUI().use('yahoo', 'dom', 'event', 'element', 'tabview'); // if not
// var Y = YUI().use('*'); // a catch-all would require yuiloader to deal with order

