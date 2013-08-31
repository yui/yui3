/**
 * The YUI loader core
 * @module loader
 * @submodule loader-base
 */

(function() {
    var VERSION = Y.version,
        BUILD = '/build/',
        ROOT = VERSION + '/',
        CDN_BASE = Y.Env.base,
        GALLERY_VERSION = '@GALLERY@',
        TNT = '2in3',
        TNT_VERSION = '@TNT@',
        YUI2_VERSION = '@YUI2@',
        COMBO_BASE = CDN_BASE + 'combo?',
        META = {
            version: VERSION,
            root: ROOT,
            base: Y.Env.base,
            comboBase: COMBO_BASE,
            skin: {
                defaultSkin: 'sam',
                base: 'assets/skins/',
                path: 'skin.css',
                after: [
                    'cssreset',
                    'cssfonts',
                    'cssgrids',
                    'cssbase',
                    'cssreset-context',
                    'cssfonts-context'
                ]
            },
            groups: {},
            patterns: {}
        },
        groups = META.groups,
        yui2Update = function(tnt, yui2, config) {
            var root = TNT + '.' +
                    (tnt || TNT_VERSION) + '/' +
                    (yui2 || YUI2_VERSION) + BUILD,
                base = (config && config.base) ? config.base : CDN_BASE,
                combo = (config && config.comboBase) ? config.comboBase : COMBO_BASE;

            groups.yui2.base = base + root;
            groups.yui2.root = root;
            groups.yui2.comboBase = combo;
        },
        galleryUpdate = function(tag, config) {
            var root = (tag || GALLERY_VERSION) + BUILD,
                base = (config && config.base) ? config.base : CDN_BASE,
                combo = (config && config.comboBase) ? config.comboBase : COMBO_BASE;

            groups.gallery.base = base + root;
            groups.gallery.root = root;
            groups.gallery.comboBase = combo;
        };


    groups[VERSION] = {};

    groups.gallery = {
        ext: false,
        combine: true,
        comboBase: COMBO_BASE,
        update: galleryUpdate,
        patterns: {
            'gallery-': {},
            'lang/gallery-': {},
            'gallerycss-': {
                type: 'css'
            }
        }
    };

    groups.yui2 = {
        combine: true,
        ext: false,
        comboBase: COMBO_BASE,
        update: yui2Update,
        patterns: {
            'yui2-': {
                configFn: function(me) {
                    if (/-skin|reset|fonts|grids|base/.test(me.name)) {
                        me.type = 'css';
                        me.path = me.path.replace(/\.js/, '.css');
                        // this makes skins in builds earlier than
                        // 2.6.0 work as long as combine is false
                        me.path = me.path.replace(/\/yui2-skin/,
                                            '/assets/skins/sam/yui2-skin');
                    }
                }
            }
        }
    };

    galleryUpdate();
    yui2Update();

    if (YUI.Env[VERSION]) {
        Y.mix(META, YUI.Env[VERSION], false, [
            'modules',
            'groups',
            'skin'
        ], 0, true);
    }

    YUI.Env[VERSION] = META;
}());
