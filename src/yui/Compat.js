// Compatibility layer for 2.x
(function() {

    var M = function(Y) {

        if (Y === YUI) {
            
            // get any existing YAHOO obj props
            var o = (window.YAHOO) ? YUI.merge(window.YAHOO) : null;

            // Make the YUI global the YAHOO global
            window.YAHOO = YUI;

            // augment old YAHOO props
            if (o) {
                Y.mix(Y, o);
            }
        }

        // add old namespaces
        Y.namespace("util", "widget", "example");

        // support Y.register
        Y.mix(Y.env, {
                modules: [],
                listeners: [],
                getVersion: function(name) {
                    return this.env.modules[name] || null;
                }
        });

        Y.env.ua = Y.ua; 
        var L = Y.lang;

        // add old lang properties 
        Y.mix(L, {

            // hasOwnProperty: Y.bind(Y.object.owns, Y),
            hasOwnProperty: Y.object.owns,

            augmentObject: function(r, s) {
                var a = arguments, wl = (a.length > 2) ? Y.array(a, 2, true) : null;
                return Y.mix(r, s, (wl), wl);
            },
         
            augmentProto: function(r, s) {
                var a = arguments, wl = (a.length > 2) ? Y.array(a, 2, true) : null;
                return Y.bind(Y.prototype, r, s, (wl), wl);
            },

            augment: Y.bind(Y.augment, Y),
            extend: Y.bind(Y.extend, Y), 
            merge: Y.bind(Y.merge, Y)
        }, true);

        Y.augmentProto = L.augmentProto;

        // add register function
        Y.mix(Y, {
            register: function(name, mainClass, data) {
                var mods = Y.env.modules;
                if (!mods[name]) {
                    mods[name] = { versions:[], builds:[] };
                }
                var m=mods[name],v=data.version,b=data.build,ls=Y.env.listeners;
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
                    Y.log("mainClass is undefined for module " + name, "warn");
                }
            }
        });

        // add old load listeners
        if ("undefined" !== typeof YAHOO_config) {
            var l=YAHOO_config.listener,ls=Y.env.listeners,unique=true,i;
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
            
        // add old registration for yahoo
        Y.register("yahoo", Y, {version: "@VERSION@", build: "@BUILD@"});

        // @todo subscribe register to the module added event to pick
        // modules registered with the new method.
    };

    YUI.add("compat", M, "3.0.0");

})();
