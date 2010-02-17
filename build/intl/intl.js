YUI.add('intl-load', function(Y) {


    /* Loader/MetaData Touch Points

    a) _explodeLang()

        1) Explode static meta-data "lang" property into first class modules

           var langModuleName = loader._formatLang(lang, module);

    b) _useLang(lang)

        Support for Y.use("lang:fr-CA"); or Y.use("lang:fr-CA;module");

        1) Y.Intl.lookupBestLang(module, lang)

        2) loader._formatLang(module, lang)
        3) loader.insert(module_lang)

        4) Y._attach(module_lang)

    c) getAvailableLangs(module)

        1) Loop through meta-data for the module, to get available langs

        getAvailableLangs() support feasible?

            Loop through meta-data for all "loaded" modules, to get the common
            subset (could be presented as an app level dropdown for example).  

    d) Register custom langs

        1). Same as any module?

    */

/** 
 * The Intl utility provides a central location for managing language specific sets of strings and formatting patterns.
 * @module intl
 */

/**
 * The intl-load sub-module provides utilities for loader language support
 * 
 * @module intl
 * @submodule intl-load
 */

/** 
 * The Intl utility provides a central location for managing language specific sets of strings and formatting patterns.
 * 
 * @class Intl
 * @static
 */

var SPLIT_REGEX = /[, ]/;

Y.mix(Y.namespace("Intl"), {

    /**
     * Finds the best language match, from the list of available languages based on BCP 47 lookup.
     *
     * @method lookupBestLang
     * @param {String} lang The BCP 47 language tag to find the best match for
     * @param {Array} supportedLangs An array of supported langauge codes
     *
     * @return {String} The BCP 47 language tag
     */
    lookupBestLang : function (preferredLanguages, availableLanguages) {

        var i, language, result, index;

        // check whether the list of available languages contains language; if so return it
        function scan(language) {
            var i;
            for (i = 0; i < availableLanguages.length; i += 1) {
                if (language.toLowerCase() === availableLanguages[i].toLowerCase()) {
                    return availableLanguages[i];
                }
            }
        }

        if (Y.Lang.isString(preferredLanguages)) {
            preferredLanguages = preferredLanguages.split(SPLIT_REGEX);
        }

        for (i = 0; i < preferredLanguages.length; i += 1) {
            language = preferredLanguages[i];
            if (!language || language === "*") {
                continue;
            }
            // check the fallback sequence for one language
            while (language.length > 0) {
                result = scan(language);
                if (result) {
                    return result;
                } else {
                    index = language.lastIndexOf("-");
                    if (index >= 0) {
                        language = language.substring(0, index);
                        // one-character subtags get cut along with the following subtag
                        if (index >= 2 && language.charAt(index - 2) === "-") {
                            language = language.substring(0, index - 2);
                        }
                    } else {
                        // nothing available for this language
                        break;
                    }
                }
            }
        }

        return "";
    },

    _explodeLang : function() {
        // LOADER STUB
    },

    _useLang : function(module, lang) {
        // LOADER STUB
    },

    getAvailableLangs : function(module) {
        // META-DATA STUB
    }
});


}, '@VERSION@' );
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


YUI.add('intl', function(Y){}, '@VERSION@' ,{use:['intl-load', 'intl-lang']});

