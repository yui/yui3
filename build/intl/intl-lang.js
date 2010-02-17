YUI.add('intl-lang', function(Y) {

var _mods = {},

    ACTIVE = "yuiActiveLang";

/** 
 * The intl-lang sub-module adds the ability to store and retrieve multiple sets of language strings on the client.
 *
 * @module intl
 * @submodule intl-lang
 */


/** 
 * The Intl utility provides a central location for managing language specific sets of strings and formatting patterns.
 * 
 * @class Intl
 * @static
 */
Y.mix(Y.namespace("Intl"), {

    /**
     * @method _mod
     * @private
     *
     * @param {String} module The name of the module
     * @return {Object} The hash of localized strings for the module, keyed by BCP language tag
     */
    _mod : function(module) {
        if (!_mods[module]) {
            _mods[module] = {};
        }
        return _mods[module];
    },

    /**
     * Sets the active language for the given module.
     *
     * Returns false on failure, which would happen if the language had not been registered through the <a href="#method_add">add()</a> method.
     *
     * @method setLang
     * @private
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language tag.
     */
    _setLang : function(module, lang) {
        var langs = this._mod(module),
            currLang = langs[ACTIVE],
            exists = !!langs[lang];

        if (exists) {
            langs[ACTIVE] = lang;
            this.fire("intl:langChange", {module: module, prevVal: currLang, newVal: lang});
        }
        return exists;
    },

    /**
     * Get the active language for the given module.
     *
     * @method getLang
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language tag.
     *
     * @return {String} The current BCP 47 language tag.
     */
    getLang : function(module) {
        return this._mod(module)[ACTIVE];
    },

    /**
     * Register a set of strings for the given module and language
     *
     * @method add
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language tag.
     * @param {Object} strings The hash of strings.
     */
    add : function(module, lang, strings) {
        this._mod(module)[lang] = strings;
        this._setLang(module, lang);
    },

    /**
     * Get the module strings for the given BCP language tag.
     *
     * @method get
     *
     * @param {String} module The module name.
     * @param {String} key Optional. If not provided, returns all strings, using merge to protect the originals.
     * @param {String} lang Optional. The BCP 47 langauge tag.
     * @return String | Object
     */
    get : function(module, key, lang) {
        var mod = this._mod(module),
            strs,
            str;

        lang = lang || mod[ACTIVE];
        strs = mod[lang];

        if (strs) {
            str = (key) ? strs[key] : Y.merge(strs);
        }

        return str;
    }
});

Y.augment(Y.Intl, Y.EventTarget);

Y.Intl.publish("intl:langChange", {emitFacade:true});


}, '@VERSION@' ,{requires:['event-custom']});
