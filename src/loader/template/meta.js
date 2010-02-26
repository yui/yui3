(function() {
var VERSION = Y.version,
ROOT = VERSION + '/build/',
GALLERY_VERSION = Y.config.gallery || Y.gallery,
GALLERY_ROOT = GALLERY_VERSION + '/build/',
COMBO_BASE = 'http://yui.yahooapis.com/combo?',
GALLERY_BASE = 'http://yui.yahooapis.com/' + GALLERY_ROOT,
META = {
    version: VERSION,
    root: ROOT,
    base: 'http://yui.yahooapis.com/' + ROOT,
    comboBase: COMBO_BASE,
    skin: {
        defaultSkin: 'sam',
        base: 'assets/skins/',
        path: 'skin.css',
        after: ['cssreset', 'cssfonts', 'cssreset-context', 'cssfonts-context']
        //rollup: 3
    },

    groups: {},

    modules: { /* METAGEN */ },

    // Patterns are module definitions which will be added with 
    // the default options if a definition is not found. The
    // assumption is that the module itself will be in the default
    // location, and if there are any additional dependencies, they
    // will have to be fetched with a second request.  This could
    // happen multiple times, each segment resulting in a new
    // dependency list.
    //
    // types: regex, prefix, function
    patterns: {
        // 'gallery-': { 
            // http://yui.yahooapis.com/3.0.0/build/
            // http://yui.yahooapis.com/gallery-/build/
            // group: 'gallery'
            // ext: false
            // filter: {
            //     'searchExp': VERSION,
            //     'replaceStr': GALLERY_VERSION
            // }
        // }

        /*
        // expand 'lang|module|lang'
        'lang|': {
            ext: false,
            action: function(data) {
                // Y.log('testing data: ' + data);

                var parts = data.split('|'),
                    name = parts[1],
                    lang = parts[2],
                    packName, mod;

                if (lang) {

                    packName = this.getLangPackName(lang, name);

                    if ('create' == parts[3]) {
                        mod = this.getModule(packName);
                        if (!mod) {
                            mod = this.getModule(name);
                            // Y.log('action creating ' + packName);
                            this._addLangPack(lang, mod, packName);
                        }
                    }

                    this.require(packName);
                }
                delete this.required[data];
            }
        }
        */
    }
};

META.groups[VERSION] = {};

META.groups.gallery = {
    base:      GALLERY_BASE,
    patterns:  { 
        'gallery-': {}
    },
    ext:       false,
    combine:   true,
    root:      GALLERY_ROOT,
    comboBase: COMBO_BASE
};

YUI.Env[VERSION] = META;

})();
