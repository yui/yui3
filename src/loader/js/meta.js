/**
 * The YUI loader core
 * @module loader
 * @submodule loader-base
 */

(function() {
    var VERSION = Y.version,
        ////////////////////////////////////////////////////////////
        //                  BEGIN WF2 CHANGE                      //
        // Justification: Our combo path is different than YUI's. //
        ////////////////////////////////////////////////////////////
        // BUILD = '/build/',
        // ROOT = VERSION + BUILD,
        // CDN_BASE = Y.Env.base,
        ////////////////////////////////////////////////////////////
        //                    END WF2 CHANGE                      //
        ////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////
        //                      BEGIN WF2 CHANGE                      //
        // Justification: We don't support YUI's gallery, or YUI 2in3 //
        ////////////////////////////////////////////////////////////////
        // GALLERY_VERSION = '@GALLERY@',
        // TNT = '2in3',
        // TNT_VERSION = '@TNT@',
        // YUI2_VERSION = '@YUI2@',
        ////////////////////////////////////////////////////////////////
        //                        END WF2 CHANGE                      //
        ////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////
        //                  BEGIN WF2 CHANGE                      //
        // Justification: Our combo path is different than YUI's. //
        ////////////////////////////////////////////////////////////
        // COMBO_BASE = CDN_BASE + 'combo?',

        // to handle the case where BASE === 'https://wellscontent.wellsfargo.com/wria/combo'
        WF2_BASE = Y.config.base.charAt(Y.config.base.length - 1) === '/' ? Y.config.base : Y.config.base + '/',

        WF2_COMBO_BASE = WF2_BASE + '@WF2_COMBOPATH@',
        WF2_GALLERY_BASE = WF2_BASE + '@WF2GALLERY_ROOTDIR@',
        WF2_GALLERY_COMBO_BASE = WF2_BASE + '@WF2GALLERY_COMBOPATH@',
        META = { version: VERSION,
                          root: '',
                          base: WF2_BASE,
                          combine: "@WF2_COMBINE@" === "true",
                          comboBase: WF2_COMBO_BASE,
                          skin: { //defaultSkin: 'sam',
                                       //////////////////////
                                       // BEGIN WF2 CHANGE //
                                       //////////////////////
                                       defaultSkin: Y.UA.touchEnabled ? 'nxt' : 'nx',
                                       //////////////////////
                                       //  END WF2 CHANGE  //
                                       //////////////////////
                                       base: 'assets/skins/',
                                       path: 'skin.css',
                                       after: ['cssreset',
                                                      'cssfonts',
                                                      'cssgrids',
                                                      'cssbase',
                                                      'cssreset-context',
                                                      'cssfonts-context']},
                          groups: {
                            'wellsfargo-gallery': {
                                base: WF2_GALLERY_BASE,
                                // combine: false, // false by default, here as a placeholder for when we change to true
                                comboBase: WF2_GALLERY_COMBO_BASE,
                                patterns: {
                                    'wf2-gallery-': {},
                                    'lang/wf2-gallery-': {},
                                    'wf2-gallerycss-': {
                                        type: 'css'
                                    }
                                },
                                root: ''
                            }
                          },
                          patterns: {} },
        ////////////////////////////////////////////////////////////
        //                    END WF2 CHANGE                      //
        ////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////
        //                      BEGIN WF2 CHANGE                       //
        // Justification: We don't support YUI's gallery, or YUI 2in3. //
        /////////////////////////////////////////////////////////////////
        groups = META.groups;
        // yui2Update = function(tnt, yui2, config) {

        //     var root = TNT + '.' +
        //             (tnt || TNT_VERSION) + '/' +
        //             (yui2 || YUI2_VERSION) + BUILD,
        //         base = (config && config.base) ? config.base : CDN_BASE,
        //         combo = (config && config.comboBase) ? config.comboBase : COMBO_BASE;

        //     groups.yui2.base = base + root;
        //     groups.yui2.root = root;
        //     groups.yui2.comboBase = combo;
        // },
        // galleryUpdate = function(tag, config) {
        //     var root = (tag || GALLERY_VERSION) + BUILD,
        //         base = (config && config.base) ? config.base : CDN_BASE,
        //         combo = (config && config.comboBase) ? config.comboBase : COMBO_BASE;

        //     groups.gallery.base = base + root;
        //     groups.gallery.root = root;
        //     groups.gallery.comboBase = combo;
        // };
        /////////////////////////////////////////////////////////////////
        //                        END WF2 CHANGE                       //
        /////////////////////////////////////////////////////////////////

    groups[VERSION] = {};

    /////////////////////////////////////////////////////////////////
    //                      BEGIN WF2 CHANGE                       //
    // Justification: We don't support YUI's gallery, or YUI 2in3. //
    /////////////////////////////////////////////////////////////////
    // groups.gallery = {
    //     ext: false,
    //     combine: true,
    //     comboBase: COMBO_BASE,
    //     update: galleryUpdate,
    //     patterns: { 'gallery-': { },
    //                 'lang/gallery-': {},
    //                 'gallerycss-': { type: 'css' } }
    // };

    // groups.yui2 = {
    //     combine: true,
    //     ext: false,
    //     comboBase: COMBO_BASE,
    //     update: yui2Update,
    //     patterns: {
    //         'yui2-': {
    //             configFn: function(me) {
    //                 if (/-skin|reset|fonts|grids|base/.test(me.name)) {
    //                     me.type = 'css';
    //                     me.path = me.path.replace(/\.js/, '.css');
    //                     // this makes skins in builds earlier than
    //                     // 2.6.0 work as long as combine is false
    //                     me.path = me.path.replace(/\/yui2-skin/,
    //                                      '/assets/skins/sam/yui2-skin');
    //                 }
    //             }
    //         }
    //     }
    // };

    // galleryUpdate();
    // yui2Update();
    /////////////////////////////////////////////////////////////////
    //                        END WF2 CHANGE                       //
    /////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////
    //                                   END WF2 CHANGE                                    //
    /////////////////////////////////////////////////////////////////////////////////////////

    if (YUI.Env[VERSION]) {
        Y.mix(META, YUI.Env[VERSION], false, [
            'modules',
            'groups',
            'skin'
        ], 0, true);
    }

    YUI.Env[VERSION] = META;
}());
