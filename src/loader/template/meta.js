(function() {
var VERSION         = Y.version,
    BUILD           = '/build/',
    ROOT            = VERSION + BUILD,
    CDN             = 'http://yui.yahooapis.com/',
    GALLERY_VERSION = Y.config.gallery || 'gallery-2010.03.02-18',
    GALLERY_ROOT    = GALLERY_VERSION + BUILD,
    YUI2_VERSION    = Y.config.yui2 || '2.8.0',
    YUI2_ROOT       = '2in3_test3/' + YUI2_VERSION + BUILD,
    COMBO_BASE      = CDN + 'combo?',
    META =          { version:   VERSION,
                      root:      ROOT,
                      base:      CDN + ROOT,
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
                      patterns:  {}                                     },
    groups =          META.groups;

groups[VERSION] = {};

groups.gallery = {
    base:      CDN + GALLERY_ROOT,
    ext:       false,
    combine:   true,
    root:      GALLERY_ROOT,
    comboBase: COMBO_BASE,
    patterns:  { 'gallery-': {} }
};

groups.yui2 = {
    base:      CDN + YUI2_ROOT,
    combine:   true,
    // base:      '/2in3/',
    ext:       false,
    root:      YUI2_ROOT,
    comboBase: COMBO_BASE,
    patterns:  { 
        'yui2-': {
            configFn: function(me) {
                if(/-skin|reset|fonts|grids|base/.test(me.name)) {
                    me.type = 'css';
                    me.path = me.path.replace(/\.js/, '.css');
                }
            }
        } 
    }
};

YUI.Env[VERSION] = META;

})();
