(function() {

var VERSION = Y.version,
ROOT = VERSION + '/build/',
GALLERY_VERSION = 'gallery-2009-10-19', // @TODO build time
GALLERY_ROOT = GALLERY_VERSION + '/build/',
GALLERY_BASE = 'http://yui.yahooapis.com/' + GALLERY_ROOT,
META = {
    version: VERSION,
    root: ROOT,
    base: 'http://yui.yahooapis.com/' + ROOT,
    comboBase: 'http://yui.yahooapis.com/combo?',
    skin: {
        defaultSkin: 'sam',
        base: 'assets/skins/',
        path: 'skin.css',
        after: ['cssreset', 'cssfonts', 'cssreset-context', 'cssfonts-context']
        //rollup: 3
    },

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
        'gallery-': { 
            // http://yui.yahooapis.com/3.0.0/build/
            // http://yui.yahooapis.com/gallery-/build/
            base: GALLERY_BASE,  // explicit declaration of the base attribute
            filter: {
                'searchExp': VERSION,
                'replaceStr': GALLERY_VERSION
            }
        }
    }
};

YUI.Env[VERSION] = META;

})();
