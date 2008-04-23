YUI.add("loader-meta", function(Y) {

    // reducing metadata file size:
    //
    // type is optional - default 'js'
    //
    // requires is optional, default is the core
    //
    // path is optional, default is name/name-min.js.  We no longer will
    // have -beta and -experimental file names.
    // * Note: this should probably be changed... name.js should be minified
    //
    // using tokens for strings since they can be minified
    //
    // use 1 instead of true

    var TYPE = 'type', 
        BASE = 'base', 
        PATH = 'path',
        AFTER = 'after',
        ROLLUP = 'rollup',
        SUPERSEDES = 'supersedes',
        REQUIRES = 'requires',
        OPTIONAL = 'optional',
        SKINNABLE = 'skinnable',
        CSS = 'css',
        PKG = 'pkg',

        ANIMATION = 'animation',
        RESET = 'reset',
        FONTS = 'fonts',
        GRIDS = 'grids',
        CONNECTION = 'connection',
        DRAGDROP = 'dragdrop',
        ELEMENT = 'element',
        BUTTON = 'button',
        MENU = 'menu',
        CONTAINERCORE = 'containercore',
        CALENDAR = 'calendar',
        SLIDER = 'slider',
        JSON = 'json',
        DATASOURCE = 'datasource',
        SELECTOR = 'selector',
        RESIZE = 'resize'


Y.env.moduleInfo {
    // 'base': 'http://yui.yahooapis.com/2.5.1/build/',
    BASE: '/build/',

    'skin': {
        'defaultSkin': 'sam',
        BASE: 'assets/skins/',
        PATH: 'skin.css',
        AFTER: [RESET, FONTS, GRIDS, BASE],
        ROLLUP: 3
    },

    'moduleInfo': {

        ANIMATION: {
        },

        'autocomplete': {
            OPTIONAL: [CONNECTION, ANIMATION],
            SKINNABLE: 1
        },

        BASE: {
            TYPE: CSS,
            AFTER: [RESET, FONTS, GRIDS]
        },

        BUTTON: {
            REQUIRES: [ELEMENT],
            OPTIONAL: [MENU],
            SKINNABLE: 1
        },

        CALENDAR: {
            SKINNABLE: 1
        },

        'charts': {
            REQUIRES: [ELEMENT, JSON, DATASOURCE]
        },

        'colorpicker': {
            REQUIRES: [SLIDER, ELEMENT],
            OPTIONAL: [ANIMATION],
            SKINNABLE: 1
        },

        CONNECTION: {
        },

        'container': {
            // button is also optional, but this creates a circular 
            // dependency when loadOptional is specified.  button
            // optionally includes menu, menu requires container.
            OPTIONAL: [DRAGDROP, ANIMATION, CONNECTION],
            SUPERSEDES: [CONTAINERCORE],
            SKINNABLE: 1
        },

        CONTAINERCORE: {
            PATH: 'container/container_core-min.js',
            PKG: 'container'
        },

        'cookie': {
        },

        DATASOURCE: {
            OPTIONAL: [CONNECTION]
        },

        'datatable': {
            REQUIRES: [ELEMENT, DATASOURCE],
            OPTIONAL: [CALENDAR, DRAGDROP],
            SKINNABLE: 1
        },

        DRAGDROP: {
        },

        'editor': {
            REQUIRES: [MENU, ELEMENT, BUTTON],
            OPTIONAL: [ANIMATION, DRAGDROP],
            SUPERSEDES: ['simpleeditor'],
            SKINNABLE: 1
        },

        ELEMENT: {
        },

        FONTS: {
            TYPE: CSS,
        },

        GRIDS: {
            TYPE: CSS,
            REQUIRES: [FONTS],
            OPTIONAL: [RESET]
        },

        'history': {
        },

         'imagecropper': {
             REQUIRES: [DRAGDROP, ELEMENT, RESIZE],
             SKINNABLE: 1
         },

         'imageloader': {
         },

         JSON: {
         },

         'layout': {
             REQUIRES: [ELEMENT],
             OPTIONAL: [ANIMATION, DRAGDROP, RESIZE, SELECTOR],
             SKINNABLE: 1
         }, 

        'logger': {
            OPTIONAL: [DRAGDROP],
            SKINNABLE: 1
        },

        MENU: {
            REQUIRES: [CONTAINERCORE],
            SKINNABLE: 1
        },

        'profiler': {
        },


        'profilerviewer': {
            REQUIRES: ['profiler', ELEMENT],
            SKINNABLE: 1
        },

        RESET: {
            TYPE: CSS,
        },

        'reset-fonts-grids': {
            TYPE: CSS,
            PATH: 'reset-fonts-grids/reset-fonts-grids.css',
            SUPERSEDES: [RESET, FONTS, GRIDS, 'reset-fonts'],
            ROLLUP: 4
        },

        'reset-fonts': {
            TYPE: CSS,
            PATH: 'reset-fonts/reset-fonts.css',
            SUPERSEDES: [RESET, FONTS],
            ROLLUP: 2
        },

         RESIZE: {
             REQUIRES: [DRAGDROP, ELEMENT],
             OPTIONAL: [ANIMATION],
             SKINNABLE: 1
         },

        SELECTOR: {
        },

        'simpleeditor': {
            PATH: 'editor/simpleeditor-beta-min.js',
            REQUIRES: [ELEMENT],
            OPTIONAL: [CONTAINERCORE, MENU, BUTTON, ANIMATION, DRAGDROP],
            SKINNABLE: 1,
            PKG: 'editor'
        },

        SLIDER: {
            REQUIRES: [DRAGDROP],
            OPTIONAL: [ANIMATION]
        },

        'tabview': {
            REQUIRES: [ELEMENT],
            OPTIONAL: [CONNECTION],
            SKINNABLE: 1
        },

        'treeview': {
            SKINNABLE: 1
        },

        'uploader': {
        },

        'yuitest': {
            REQUIRES: ['logger'],
            SKINNABLE: 1
        }
    }
}

}, "3.0.0");
