/**
 * Custom event engine, DOM event listener abstraction layer, synthetic DOM
 * events.
 * @module event-custom
 */

var AFTER = 'after',
    AFTER_PREFIX = '~AFTER~',
    PREFIX_DELIMITER = ':',
    CATEGORY_DELIMITER = '|',

    DO_BEFORE = 0,
    DO_AFTER = 1,

    CONFIGS = [
        'broadcast',
        'monitored',
        'bubbles',
        'context',
        'contextFn',
        'currentTarget',
        'defaultFn',
        'defaultTargetOnly',
        'details',
        'emitFacade',
        'fireOnce',
        'async',
        'host',
        'preventable',
        'preventedFn',
        'queuable',
        'silent',
        'stoppedFn',
        'target',
        'type'
    ],

    YUI3_SIGNATURE = 9,
    YUI_LOG = 'yui:log',

    toArray    = Y.Array,
    Lang       = Y.Lang,
    isString   = Lang.isString,
    isArray    = Lang.isArray,
    isObject   = Lang.isObject,
    isFunction = Lang.isFunction,

    _wildType = Y.cached(function(type) {
        var i = type.indexOf(':');
        return (i > -1) ? '*' + type.slice(i) : type;
    }),

    /**
     * If the instance has a prefix attribute and the
     * event type is not prefixed, the instance prefix is
     * applied to the supplied type.
     * @method _getType
     * @private
     */
    _getType = Y.cached(function(type, pre) {

        if (!pre || !isString(type) || type.indexOf(PREFIX_DELIMITER) > -1) {
            return type;
        }

        return pre + PREFIX_DELIMITER + type;
    }),

    synths          = {},
    categoryHandles = {},

    proto,
    eventTargetOn,
    eventTargetDetach,

    registerSub;


Y.Env.evt = {
    handles: categoryHandles,
    plugins: synths
};
