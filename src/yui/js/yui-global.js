var time = (new Date()).getTime();

var VERSION = '@VERSION@';

var instances = {};

var APPLY_TO_AUTH = { 'io.xdrReady': 1,   // the functions applyTo
                          'io.xdrResponse': 1,   // can call. this should
                          'SWF.eventHandler': 1 }; // be done at build time

var ALREADY_DONE = { success: true };

var hasWin = (typeof window != 'undefined'),
    DOC_LABEL = 'yui3-js-enabled',
    CSS_STAMP_EL = 'yui3-css-stamp',
    win = (hasWin) ? window : null,
    filter = 'raw',
    el,
    doc = (hasWin) ? win.document : null,
    docEl = doc && doc.documentElement,
    docClass = docEl && docEl.className;

//  Stamp the documentElement (HTML) with a class of "yui-loaded" to
//  enable styles that need to key off of JS being enabled.
if (docEl && docClass.indexOf(DOC_LABEL) == -1) {
    if (docClass) {
        docClass += ' ';
    }
    docClass += DOC_LABEL;
    docEl.className = docClass;
}

if (VERSION.indexOf('@') > -1) {
    VERSION = '3.8.0'; // dev time hack for cdn test
}



var Factory = function() {
    /*
    var inst = new Instance(o);
    instances[inst.id] = inst;
    return inst;
    */
    var args = arguments;
    function InstanceWrapper() {
        return Instance.apply(this, args);
    };

    InstanceWrapper.prototype = Instance.prototype;

    var inst = new InstanceWrapper();
    instances[inst.id] = inst;
    return inst;

};


Factory.applyConfig = function(o) {
    Factory.GlobalConfig = Factory.GlobalConfig || {};
    Instance.prototype.applyConfig.call(this, Factory.GlobalConfig);
    Instance.prototype.applyConfig.call(this, o);
    Factory.GlobalConfig = this.config;
};

Factory.namespace = function() {
    return Instance.prototype.namespace.apply(this, arguments);
};


Factory.instanceOf = function(o, type) {
    if (!type || type === Factory) {
        type = Instance;
    }
    return (o && o.hasOwnProperty && (o instanceof type));
};

Factory.log = function() {
};

Factory.config = {
    win: win,
    doc: doc
};

Factory.toString = function() {
    var c = 0;
    for (var i in instances) {
        c++;
    }
    return 'YUI Global Factory: ' + c + ' instances';
};


// Regex in English:
// I'll start at the \b(simpleyui).
// 1. Look in the test string for "simpleyui" or "yui" or
//    "yui-base" or "yui-davglass" or "yui-foobar" that comes after a word break.  That is, it
//    can't match "foyui" or "i_heart_simpleyui". This can be anywhere in the string.
// 2. After #1 must come a forward slash followed by the string matched in #1, so
//    "yui-base/yui-base" or "simpleyui/simpleyui" or "yui-pants/yui-pants".
// 3. The second occurence of the #1 token can optionally be followed by "-debug" or "-min",
//    so "yui/yui-min", "yui/yui-debug", "yui-base/yui-base-debug". NOT "yui/yui-tshirt".
// 4. This is followed by ".js", so "yui/yui.js", "simpleyui/simpleyui-min.js"
// 0. Going back to the beginning, now. If all that stuff in 1-4 comes after a "?" in the string,
//    then capture the junk between the LAST "&" and the string in 1-4.  So
//    "blah?foo/yui/yui.js" will capture "foo/" and "blah?some/thing.js&3.3.0/build/yui-davglass/yui-davglass.js"
//    will capture "3.3.0/build/"
//
// Regex Exploded:
// (?:\?             Find a ?
//   (?:[^&]*&)      followed by 0..n characters followed by an &
//   *               in fact, find as many sets of characters followed by a & as you can
//   ([^&]*)         capture the stuff after the last & in \1
// )?                but it's ok if all this ?junk&more_junk stuff isn't even there
// \b(simpleyui|     after a word break find either the string "simpleyui" or
//    yui(?:-\w+)?   the string "yui" optionally followed by a -, then more characters
// )                 and store the simpleyui or yui-* string in \2
// \/\2              then comes a / followed by the simpleyui or yui-* string in \2
// (?:-(min|debug))? optionally followed by "-min" or "-debug"
// .js               and ending in ".js"
var _BASE_RE = /(?:\?(?:[^&]*&)*([^&]*))?\b(simpleyui|yui(?:-\w+)?)\/\2(?:-(min|debug))?\.js/;
var parseBasePath = function(src, pattern) {
    var match = src.match(pattern),
        path, filter = 'raw';

    if (match) {
        path = RegExp.leftContext || src.slice(0, src.indexOf(match[0]));

        // this is to set up the path to the loader.  The file
        // filter for loader should match the yui include.
        filter = match[3];

        // extract correct path for mixed combo urls
        // http://yuilibrary.com/projects/yui3/ticket/2528423
        if (match[1]) {
            path += '?' + match[1];
        }
        path = {
            filter: filter,
            path: path
        };
    }
    return path;
};

var getBase = function(pattern) {
    var nodes = (doc && doc.getElementsByTagName('script')) || [],
        path = CDN, parsed,
        i, len, src;

    for (i = 0, len = nodes.length; i < len; ++i) {
        src = nodes[i].src;
        if (src) {
            parsed = parseBasePath(src, pattern);
            if (parsed) {
                if (parsed.filter) {
                    filter = parsed.filter;
                }
                path = parsed.path;
                break;
            }
        }
    }

    // use CDN default
    return path;
};

var CDN = 'http://yui.yahooapis.com/';

Factory.Env = {
    defaults: {
        base: CDN,
        root: VERSION + '/',
        comboBase: CDN + 'combo?'
    },
    add: function(el, type, fn, capture) {
        if (el && el.addEventListener) {
            el.addEventListener(type, fn, capture);
        } else if (el && el.attachEvent) {
            el.attachEvent('on' + type, fn);
        }
    },
    remove: function(el, type, fn, capture) {
        if (el && el.removeEventListener) {
            // this can throw an uncaught exception in FF
            try {
                el.removeEventListener(type, fn, capture);
            } catch (ex) {}
        } else if (el && el.detachEvent) {
            el.detachEvent('on' + type, fn);
        }
    },
    handleLoad: function() {
        Factory.Env.windowLoaded = true;
        Factory.Env.DOMReady = true;
        if (hasWin) {
            Factory.Env.remove(window, 'load', Factory.Env.handleLoad);
        }
    },
    core: @YUI_CORE@,
    loaderExtras: ['loader-rollup', 'loader-yui3'],
    root: VERSION + '/',
    base: getBase(_BASE_RE) || CDN,
    filter: filter,
    mods: {},
    versions: {},
    _loaded: {},
    loaderPath: 'loader/loader' + ((filter !== 'raw') ? '-' + filter : '') + '.js',
    _yidx: 0
};

Factory.Env._loaded[VERSION] = {};

Factory.UA = {};

Factory.version = VERSION;

Factory.Env.cdn = CDN + Factory.version + '/';
Factory.Env.comboBase = CDN + 'combo?';

if (hasWin) {
    // add a window load event at load time so we can capture
    // the case where it fires before dynamic loading is
    // complete.
    Factory.Env.add(window, 'load', Factory.Env.handleLoad);
} else {
    Factory.Env.handleLoad();
}

Factory.Env.getBase = getBase;
Factory.Env.parseBasePath = parseBasePath;
Factory.Env._BASE_RE = _BASE_RE;

Factory.add = function(name, fn, version, details) {
    details = details || {};
    var env = YUI.Env,
        mod = {
            name: name,
            fn: fn,
            version: version,
            details: details
        },
        //Instance hash so we don't apply it to the same instance twice
        applied = {},
        loader, inst,
        i, versions = env.versions;

    env.mods[name] = mod;
    versions[version] = versions[version] || {};
    versions[version][name] = mod;
    
    for (i in instances) {
        if (instances.hasOwnProperty(i)) {
            inst = instances[i];
            if (!applied[inst.id]) {
                applied[inst.id] = true;
                loader = inst.Env._loader;
                if (loader) {
                    if (!loader.moduleInfo[name] || loader.moduleInfo[name].temp) {
                        loader.addModule(details, name);
                    }
                }
            }
        }
    }

    return this;
};


/**
Executes the named method on the specified YUI instance if that method is
whitelisted.

@method applyTo
@param {String} id YUI instance id.
@param {String} method Name of the method to execute. For example:
    'Object.keys'.
@param {Array} args Arguments to apply to the method.
@return {Mixed} Return value from the applied method, or `null` if the
    specified instance was not found or the method was not whitelisted.
**/
Factory.applyTo = function(id, method, args) {
    if (!(method in APPLY_TO_AUTH)) {
        this.log(method + ': applyTo not allowed', 'warn', 'yui');
        return null;
    }

    var instance = instances[id], nest, m, i;
    if (instance) {
        nest = method.split('.');
        m = instance;
        for (i = 0; i < nest.length; i = i + 1) {
            m = m[nest[i]];
            if (!m) {
                this.log('applyTo not found: ' + method, 'warn', 'yui');
            }
        }
        return m && m.apply(instance, args);
    }

    return null;
};


//Register the CSS stamp element
if (doc && !doc.getElementById(CSS_STAMP_EL)) {
    el = doc.createElement('div');
    el.innerHTML = '<div id="' + CSS_STAMP_EL + '" style="position: absolute !important; visibility: hidden !important"></div>';
    Factory.Env.cssStampEl = el.firstChild;
    if (doc.body) {
        doc.body.appendChild(Factory.Env.cssStampEl);
    } else {
        docEl.insertBefore(Factory.Env.cssStampEl, docEl.firstChild);
    }
} else if (doc && doc.getElementById(CSS_STAMP_EL) && !Factory.Env.cssStampEl) {
    Factory.Env.cssStampEl = doc.getElementById(CSS_STAMP_EL);
}
