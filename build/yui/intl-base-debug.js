YUI.add('intl-base', function(Y) {


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
 * @module yui
 * @submodule intl-base
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
    }
});


}, '@VERSION@' ,{requires:['yui-base']});
