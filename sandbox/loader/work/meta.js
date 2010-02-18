(function() {

var BASE = 'base', 
    CSS = 'css',
    JS = 'js',
    CSSRESET = 'cssreset',
    CSSFONTS = 'cssfonts',
    CSSGRIDS = 'cssgrids',
    CSSBASE  = 'cssbase',
    CSS_AFTER = [CSSRESET, CSSFONTS, CSSGRIDS, 
                 'cssreset-context', 'cssfonts-context', 'cssgrids-context'],
    YUI_CSS = ['reset', 'fonts', 'grids', BASE],
    VERSION = Y.version,
    GALLERY_VERSION = 'gallery-2009-10-19', // @TODO build time
    ROOT = VERSION + '/build/',
    GALLERY_ROOT = GALLERY_VERSION + '/build/',
    GALLERY_BASE = 'http://yui.yahooapis.com/' + GALLERY_ROOT,
    CONTEXT = '-context',
    ANIMBASE = 'anim-base',
    ATTRIBUTE = 'attribute',
    ATTRIBUTEBASE = ATTRIBUTE + '-base',
    BASEBASE = 'base-base',
    DDDRAG = 'dd-drag',
    DOM = 'dom',
    DATASCHEMABASE = 'dataschema-base',
    DATASOURCELOCAL = 'datasource-local',
    DOMBASE = 'dom-base',
    DOMSTYLE = 'dom-style',
    DOMSCREEN = 'dom-screen',
    DUMP = 'dump',
    GET = 'get',
    EVENTBASE = 'event-base',
    EVENTCUSTOM = 'event-custom',
    EVENTCUSTOMBASE = 'event-custom-base',
    IOBASE = 'io-base',
    NODE = 'node',
    NODEBASE = 'node-base',
    NODESTYLE = 'node-style',
    NODESCREEN = 'node-screen',
    NODEPLUGINHOST = 'node-pluginhost',
    OOP = 'oop',
    PLUGINHOST = 'pluginhost',
    SELECTORCSS2 = 'selector-css2',
    SUBSTITUTE = 'substitute',
    WIDGET = 'widget',
    WIDGETPOSITION = 'widget-position',
    YUIBASE = 'yui-base',
    PLUGIN = 'plugin',

    META = {

    version: VERSION,

    root: ROOT,

    base: 'http://yui.yahooapis.com/' + ROOT,

    comboBase: 'http://yui.yahooapis.com/combo?',

    skin: {
        defaultSkin: 'sam',
        base: 'assets/skins/',
        path: 'skin.css',
        after: CSS_AFTER
        //rollup: 3
    },

    modules: {

       dom: {
            requires: [OOP],
            submodules: {

                'dom-base': {
                    requires: [OOP]
                },

                'dom-style': {
                    requires: [DOMBASE]
                },

                'dom-screen': {
                    requires: [DOMBASE, DOMSTYLE]
                },

                'selector-native': {
                    requires: [DOMBASE]
                },

                'selector-css2': {
                    requires: ['selector-native']
                },

                'selector': {
                    requires: [DOMBASE]
                }

            },

            plugins: {
                'selector-css3': {
                    requires: [SELECTORCSS2]
                }
            }
        },

        node: {
            requires: [DOM, EVENTBASE],
            // expound: EVENT,

            submodules: {
                'node-base': {
                    requires: [DOMBASE, SELECTORCSS2, EVENTBASE]
                },

                'node-style': {
                    requires: [DOMSTYLE, NODEBASE]
                },

                'node-screen': {
                    requires: [DOMSCREEN, NODEBASE]
                },

                'node-pluginhost': {
                    requires: [NODEBASE, PLUGINHOST]
                },


                'node-event-delegate': {
                    requires: [NODEBASE, 'event-delegate']
                }
            },

            plugins: {
                'node-event-simulate': {
                    requires: [NODEBASE, 'event-simulate']
                },

                'align-plugin': {
                    requires: [NODESCREEN, NODEPLUGINHOST]
                },

                'shim-plugin': {
                    requires: [NODESTYLE, NODEPLUGINHOST]
                }
            }
        },

        anim: {
            submodules: {

                'anim-base': {
                    requires: [BASEBASE, NODESTYLE]
                },

                'anim-color': {
                    requires: [ANIMBASE]
                },

                'anim-easing': {
                    requires: [ANIMBASE]
                },

                'anim-scroll': {
                    requires: [ANIMBASE]
                },

                'anim-xy': {
                    requires: [ANIMBASE, NODESCREEN]
                },

                'anim-curve': {
                    requires: ['anim-xy']
                },

                'anim-node-plugin': {
                     requires: ['node-pluginhost', ANIMBASE]
                }
            }
        },

        attribute: { 
            submodules: {
                'attribute-base': {
                    requires: [EVENTCUSTOM]
                },

                'attribute-complex': {
                    requires: [ATTRIBUTEBASE]
                }
            }
        },

        base: {
            submodules: {
                'base-base': {
                    requires: [ATTRIBUTEBASE]
                },

                'base-build': {
                    requires: [BASEBASE]
                },

                'base-pluginhost': {
                    requires: [BASEBASE, PLUGINHOST]
                }
            }
        },

        cache: { 
            requires: [PLUGIN]
        },
        
        compat: { 
            requires: [EVENTBASE, DOM, DUMP, SUBSTITUTE]
        },

        classnamemanager: { 
            requires: [YUIBASE]
        },

        collection: { 
            submodules: {
                'array-extras': {},
                'arraylist': {},
                'array-invoke': {},
                // @TODO: candidates for plugins
                'arraylist-filter': {
                    requires: ['arraylist']
                },
                'arraylist-add': {
                    requires: ['arraylist']
                }
            }
        },

        console: {
            requires: ['yui-log', WIDGET, SUBSTITUTE],
            skinnable: true,
            plugins: {
                'console-filters': {
                    requires: [PLUGIN, 'console'],
                    skinnable: true
                }
            }
        },
        
        cookie: { 
            requires: [YUIBASE]
        },

        dataschema:{
            submodules: {
                'dataschema-base': {
                    requires: [BASE]
                },
                'dataschema-array': {
                    requires: [DATASCHEMABASE]
                },
                'dataschema-json': {
                    requires: [DATASCHEMABASE, 'json']
                },
                'dataschema-text': {
                    requires: [DATASCHEMABASE]
                },
                'dataschema-xml': {
                    requires: [DATASCHEMABASE]
                }
            }
        },

        datasource:{
            submodules: {
                'datasource-local': {
                    requires: [BASE]
                },
                'datasource-arrayschema': {
                    requires: [DATASOURCELOCAL, PLUGIN, 'dataschema-array']
                },
                'datasource-cache': {
                    requires: [DATASOURCELOCAL, 'cache']
                },
                'datasource-function': {
                    requires: [DATASOURCELOCAL]
                },
                'datasource-jsonschema': {
                    requires: [DATASOURCELOCAL, PLUGIN, 'dataschema-json']
                },
                'datasource-polling': {
                    requires: [DATASOURCELOCAL]
                },
                'datasource-get': {
                    requires: [DATASOURCELOCAL, GET]
                },
                'datasource-textschema': {
                    requires: [DATASOURCELOCAL, PLUGIN, 'dataschema-text']
                },
                'datasource-io': {
                    requires: [DATASOURCELOCAL, IOBASE]
                },
                'datasource-xmlschema': {
                    requires: [DATASOURCELOCAL, PLUGIN, 'dataschema-xml']
                }
            }
        },

        datatype:{
            submodules: {
                'datatype-date': {
                    requires: [YUIBASE]
                },
                'datatype-number': {
                    requires: [YUIBASE]
                },
                'datatype-xml': {
                    requires: [YUIBASE]
                }
            }
        },

        dd:{
            submodules: {
                'dd-ddm-base': {
                    requires: [NODE, BASE, 'yui-throttle']
                }, 
                'dd-ddm':{
                    requires: ['dd-ddm-base', 'event-resize']
                }, 
                'dd-ddm-drop':{
                    requires: ['dd-ddm']
                }, 
                'dd-drag':{
                    requires: ['dd-ddm-base']
                }, 
                'dd-drop':{
                    requires: ['dd-ddm-drop']
                }, 
                'dd-proxy':{
                    requires: [DDDRAG]
                }, 
                'dd-constrain':{
                    requires: [DDDRAG]
                }, 
                'dd-scroll':{
                    requires: [DDDRAG]
                }, 
                'dd-plugin':{
                    requires: [DDDRAG],
                    optional: ['dd-constrain', 'dd-proxy']
                },
                'dd-drop-plugin':{
                    requires: ['dd-drop']
                },
                'dd-delegate': {
                    requires: [DDDRAG, 'event-mouseenter'],
                    optional: ['dd-drop-plugin']
                }
            }
        },

        'dd-value': {
            requires: ['dd-constrain']
        },

        dump: { 
            requires: [YUIBASE]
        },

        event: { 
            expound: NODEBASE,
            submodules: {
                'event-base': {
                    expound: NODEBASE,
                    requires: [EVENTCUSTOMBASE]
                },
                'event-delegate': {
                    requires: [NODEBASE]
                },
                'event-focus': {
                    requires: [NODEBASE]
                },
                'event-key': {
                    requires: [NODEBASE]
                },
                'event-mouseenter': {
                    requires: [NODEBASE]
                },
                'event-mousewheel': {
                    requires: [NODEBASE]
                },
                'event-resize': {
                    requires: [NODEBASE]
                }
            }
        },

        'event-custom': { 
            submodules: {
                'event-custom-base': {
                    requires: [OOP, 'yui-later']
                },
                'event-custom-complex': {
                    requires: [EVENTCUSTOMBASE]
                }
            }
        },

        'event-simulate': { 
            requires: [EVENTBASE]
        },

        'node-focusmanager': { 
            requires: [ATTRIBUTE, NODE, PLUGIN, 'node-event-simulate', 'event-key', 'event-focus']
        },

        history: { 
            requires: [NODE]
        },

        imageloader: { 
            requires: [BASEBASE, NODESTYLE, NODESCREEN]
        },
        
        io:{
            submodules: {

                'io-base': {
                    requires: [EVENTCUSTOMBASE, 'querystring-stringify-simple']
                }, 

                'io-xdr': {
                    requires: [IOBASE, 'datatype-xml']
                }, 

                'io-form': {
                    requires: [IOBASE, NODEBASE, NODESTYLE]
                }, 

                'io-upload-iframe': {
                    requires: [IOBASE, NODEBASE]
                },

                'io-queue': {
                    requires: [IOBASE, 'queue-promote']
                }
            }
        },

        json: {
            submodules: {
                'json-parse': {
                    requires: [YUIBASE]
                },

                'json-stringify': {
                    requires: [YUIBASE]
                }
            }
        },

        loader: { 
            requires: [GET]
        },

        'node-menunav': {
            requires: [NODE, 'classnamemanager', PLUGIN, 'node-focusmanager'],
            skinnable: true
        },
        
        oop: { 
            requires: [YUIBASE]
        },

        overlay: {
            requires: [WIDGET, WIDGETPOSITION, 'widget-position-ext', 'widget-stack', 'widget-stdmod'],
            skinnable: true
        },

        plugin: { 
            requires: [BASEBASE]
        },

        pluginhost: { 
            requires: [YUIBASE]
        },

        profiler: { 
            requires: [YUIBASE]
        },

        'queue-promote': {
            requires: [YUIBASE]
        },

        // deprecated package, replaced with async-queue
        'queue-run': {
            requires: [EVENTCUSTOM],
            path: 'async-queue/async-queue-min.js'
        },

        'async-queue': {
            requires: [EVENTCUSTOM],
            supersedes: ['queue-run']
        },

        'querystring-stringify-simple': {
            requires: [YUIBASE],
            path: 'querystring/querystring-stringify-simple.js'
        },
        'querystring-parse-simple': {
            requires: [YUIBASE],
            path: 'querystring/querystring-parse-simple.js'
        },
        'querystring': {
            submodules: {
                'querystring-parse': {
                    supersedes: ['querystring-parse-simple'],
                    requires: [YUIBASE]
                },
                'querystring-stringify': {
                    supersedes: ['querystring-stringify-simple'],
                    requires: [YUIBASE]
                }
            }
        },

        slider: {
            requires: [WIDGET, 'dd-value'],
            skinnable: true
        },

        sortable: {
            requires: ['dd-delegate', 'dd-drop-plugin', 'dd-proxy']
        },

        stylesheet: { 
            requires: [YUIBASE]
        },

        substitute: {
            optional: [DUMP]
        },

        widget: {
            submodules : {
                'widget-base'  : {
                    requires: [ATTRIBUTE, 'event-focus', BASE, NODE, 'classnamemanager']
                },
                'widget-htmlparser' : {
                    requires: ['widget-base']
                },
                'widget-i18n' : {
                    requires: ['widget-base']
                }
            },
            plugins: {
                'widget-parent': { },
                'widget-child': { },                
                'widget-position': { },
                'widget-position-ext': {
                    requires: [WIDGETPOSITION]
                },
                'widget-stack': {
                    skinnable: true
                },
                'widget-stdmod': { }
            },
            skinnable: true
        },
        yui: {
            submodules: {
                'yui-base': {},
                get: {},
                'yui-log': {},
                'yui-later': {},
                'yui-throttle': {}
            }
        },

        test: {                                                                                                                                                        
            requires: [SUBSTITUTE, NODE, 'json', 'event-simulate'],
            skinnable: true                                                                                                                     
        }  

    },

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
