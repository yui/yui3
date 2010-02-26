(function() {
var VERSION         = Y.version,
    ROOT            = VERSION + '/build/',
    GALLERY_VERSION = Y.config.gallery || Y.gallery,
    GALLERY_ROOT    = GALLERY_VERSION + '/build/',
    COMBO_BASE      = 'http://yui.yahooapis.com/combo?',
    GALLERY_BASE    = 'http://yui.yahooapis.com/' + GALLERY_ROOT,
    META =          { version:   VERSION,
                      root:      ROOT,
                      base:      'http://yui.yahooapis.com/' + ROOT,
                      comboBase: COMBO_BASE,
                      skin:      { defaultSkin: 'sam',
                                   base:        'assets/skins/',
                                   path:        'skin.css',
                                   after:       [ 'cssreset', 
                                                  'cssfonts', 
                                                  'cssreset-context', 
                                                  'cssfonts-context' ] },
                      groups:    {},
                      modules:   { /* METAGEN */ },
                      patterns:  {}                                     };

META.groups[VERSION] = {};

META.groups.gallery = {
    base:      GALLERY_BASE,
    ext:       false,
    combine:   true,
    root:      GALLERY_ROOT,
    comboBase: COMBO_BASE,
    patterns:  { 
        'gallery-': {}
    }
};

YUI.Env[VERSION] = META;

})();
