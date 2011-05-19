/**
* Checks the environment for local modules and deals with them before firing off an RLS request.
* This needs to make sure that all dependencies are calculated before it can make an RLS request in
* order to make sure all remote dependencies are evaluated and their requirements are met.
* @method rls_locals
* @private
* @param {YUI} instance The YUI Instance we are working with.
* @param {Array} argz The requested modules.
* @param {Callback} cb The callback to be executed when we are done
* @param {YUI} cb.instance The instance is passed back to the callback
* @param {Array} cb.argz The modified list or modules needed to require
*/
Y.rls_locals = function(instance, argz, cb) {
    if (instance.config.modules) {
        var files = [], asked = Y.Array.hash(argz),
            PATH = 'fullpath', f,
            mods = instance.config.modules;

        for (f in mods) {
            if (mods[f][PATH]) {
                if (asked[f]) {
                    files.push(mods[f][PATH]);
                    if (mods[f].requires) {
                        Y.Array.each(mods[f].requires, function(f) {
                            if (!YUI.Env.mods[f]) {
                                if (mods[f]) {
                                    if (mods[f][PATH]) {
                                        files.push(mods[f][PATH]);
                                        argz.push(f);
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
        if (files.length) {
            Y.Get.script(files, {
                onEnd: function(o) {
                    cb(instance, argz);
                },
                data: argz
            });
        } else {
            cb(instance, argz);
        }
    } else {
        cb(instance, argz);
    }
};


/**
* Check the environment and the local config to determine if a module has already been registered.
* @method rls_needs
* @private
* @param {String} mod The module to check
* @param {YUI} instance The instance to check against.
*/
Y.rls_needs = function(mod, instance) {
    var self = instance || this,
        config = self.config;

    if (!YUI.Env.mods[mod] && !(config.modules && config.modules[mod])) {
        return true;
    }
    return false;
};

/**
 * Implentation for building the remote loader service url.
 * @method _rls
 * @param {Array} what the requested modules.
 * @since 3.2.0
 * @return {string} the url for the remote loader service call.
 */
Y._rls = function(what) {

    var config = Y.config,
        mods = config.modules,
        YArray = Y.Array,
        YObject = Y.Object,

        // the configuration
        rls = config.rls || {
            m: 1, // required in the template
            v: Y.version,
            gv: config.gallery,
            env: 1, // required in the template
            lang: config.lang,
            '2in3v': config['2in3'],
            '2v': config.yui2,
            filt: config.filter,
            filts: config.filters,
            tests: 1 // required in the template
        },

        // The rls base path
        rls_base = config.rls_base || 'load?',

        // the template
        rls_tmpl = config.rls_tmpl || function() {
            var s = '', param;
            for (param in rls) {
                if (param in rls && rls[param]) {
                    s += param + '={' + param + '}&';
                }
            }
            // console.log('rls_tmpl: ' + s);
            return s;
        }(),
        m = [], asked = {}, o, d, mod,
        i, len = what.length,
        url;
    
    for (i = 0; i < len; i++) {
        asked[what[i]] = 1;
        if (Y.rls_needs(what[i])) {
            Y.log('Did not find ' + what[i] + ' in YUI.Env.mods or config.modules adding to RLS', 'info', 'rls');
            m.push(what[i]);
        } else {
            Y.log(what[i] + ' was skipped from RLS', 'info', 'rls');
        }
    }

    if (mods) {
        for (i in mods) {
            if (asked[i] && mods[i].requires) {
                len = mods[i].requires.length;
                for (o = 0; o < len; o++) {
                    mod = mods[i].requires[o];
                    if (Y.rls_needs(mod)) {
                        m.push(mod);
                    } else {
                        d = YUI.Env.mods[mod] || mods[mod];
                        if (d) {
                            d = d.details || d;
                            if (d.requires) {
                                YArray.each(d.requires, function(o) {
                                    if (Y.rls_needs(o)) {
                                        m.push(o);
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    
    YObject.each(YUI.Env.mods, function(i) {
        if (asked[i.name]) {
            if (i.details && i.details.requires) {
                YArray.each(i.details.requires, function(o) {
                    if (Y.rls_needs(o)) {
                        m.push(o);
                    }
                });
            }
        }
    });

    //Strip Duplicates
    m = YObject.keys(YArray.hash(m));

    if (!m.length) {
        //Return here if there no modules to load.
        Y.log('RLS request terminated, no modules in m', 'warn', 'rls');
        return false;
    }
    // update the request
    rls.m = m.sort(); // cache proxy optimization
    rls.env = YObject.keys(YUI.Env.mods).sort();
    rls.tests = Y.Features.all('load', [Y]);

    url = Y.Lang.sub(rls_base + rls_tmpl, rls);

    config.rls = rls;
    config.rls_tmpl = rls_tmpl;

    YUI._rls_active = {
        inst: this,
        url: url
    };
    return url;
};

/**
* Hash to hang on to the calling RLS instance so we can deal with the return from the server.
* @property _rls_active
* @private
* @type Object
* @static
*/
YUI._rls_active = {};
/**
* 
* @method $rls
* @private
* @static
* @param {Object} req The data returned from the RLS server
* @param {String} req.css Does this request need CSS? If so, load the same RLS url with &css=1 attached
* @param {Array} req.module The sorted list of modules to attach to the page.
*/
if (!YUI.$rls) {
    YUI.$rls = function(req) {
        var rls_active = YUI._rls_active;
        YUI._rls_active = {};
        if (rls_active.inst) {
            if (req.css) {
                rls_active.inst.Get.css(rls_active.url + '&css=1');
            }
            if (req.modules) {
                rls_active.inst._attach(req.modules);
            }
        }
        
    };
}
