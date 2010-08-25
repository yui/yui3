/**
 * The YUI loader core
 * @module loader
 * @submodule loader-base
 */

if (!YUI.Env[Y.version]) {

    (function() {
        var VERSION         = Y.version,
            // CONFIG          = Y.config,
            BUILD           = '/build/',
            ROOT            = VERSION + BUILD,
            CDN_BASE        = Y.Env.base,
            GALLERY_VERSION = 'gallery-2010.08.25-19-45',
            // GALLERY_ROOT    = GALLERY_VERSION + BUILD,
            TNT             = '2in3',
            TNT_VERSION     = '3',
            YUI2_VERSION    = '2.8.1',
            // YUI2_ROOT       = TNT + '.' + TNT_VERSION + '/' + YUI2_VERSION + BUILD,
            COMBO_BASE      = CDN_BASE + 'combo?',
            META =          { version:   VERSION,
                              root:      ROOT,
                              base:      Y.Env.base,
                              comboBase: COMBO_BASE,
                              skin:      { defaultSkin: 'sam',
                                           base:        'assets/skins/',
                                           path:        'skin.css',
                                           after:       [ 'cssreset', 
                                                          'cssfonts', 
                                                          'cssgrids', 
                                                          'cssbase', 
                                                          'cssreset-context', 
                                                          'cssfonts-context' ] },
                              groups:    {},
                              // modules:   { / METAGEN / },
                              patterns:  {}                                     },
            groups =          META.groups,
            yui2Update =      function(tnt, yui2) {
                                  var root = TNT + '.' + 
                                            (tnt || TNT_VERSION) + '/' + (yui2 || YUI2_VERSION) + BUILD;
                                  groups.yui2.base = CDN_BASE + root;
                                  groups.yui2.root = root;
                              },
            galleryUpdate =   function(tag) {
                                  var root = (tag || GALLERY_VERSION) + BUILD;
                                  groups.gallery.base = CDN_BASE + root;
                                  groups.gallery.root = root;
                              };

        groups[VERSION] = {};

        groups.gallery = {
            // base:      CDN_BASE + GALLERY_ROOT,
            ext:       false,
            combine:   true,
            // root:      GALLERY_ROOT,
            comboBase: COMBO_BASE,
            update:    galleryUpdate,
            patterns:  { 'gallery-':    { },
                         'gallerycss-': { type: 'css' } }
        };

        groups.yui2 = {
            // base:      CDN_BASE + YUI2_ROOT,
            combine:   true,
            ext:       false,
            // root:      YUI2_ROOT,
            comboBase: COMBO_BASE,
            update:    yui2Update,
            patterns:  { 
                'yui2-': {
                    configFn: function(me) {
                        if(/-skin|reset|fonts|grids|base/.test(me.name)) {
                            me.type = 'css';
                            me.path = me.path.replace(/\.js/, '.css');
                            // this makes skins in builds earlier than 2.6.0 work as long as combine is false
                            me.path = me.path.replace(/\/yui2-skin/, '/assets/skins/sam/yui2-skin');
                        }
                    }
                } 
            }
        };

        galleryUpdate();
        yui2Update();

        YUI.Env[VERSION] = META;
    }());
}


