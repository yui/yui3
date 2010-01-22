    /* TODO: Loader/MetaData Touch Points

    a) _explodeLang()

        1) Explode static meta-data "lang" property into first class modules

           var langModuleName = loader._formatLang(lang, module);

    b) _useLang(lang)

        Support for Y.use("lang:fr-CA"); or Y.use("lang:fr-CA;module");

        1) Y.I18N.lookupBestLang(module, lang)

        2) var module_lang = loader._formatLang(module, lang)
        3) loader.insert(module_lang)

        4) Y._attach(module_lang)

    c) getAvailableLangs(module)

        1) Loop through meta-data for the module, to get available langs

        getAvailableLangs() support feasible?

            Loop through meta-data for all "loaded" modules, to get the common
            subset (could be presented as an app level dropdown for example).  

    d) Register custom langs

        1). Same as registering any module, through the YUI constructor?

    */

/**
 * Internal data store
 *
 * [module/submodule][BCPlanguage]
 */
var _mods = {},

    ACTIVE = "yuiActiveLang";

Y.I18N = {

    _mod : function(module) {
        if (!_mods[module]) {
            _mods[module] = {};
        }
        return _mods[module];
    },

    // Explode module language meta-data, converting lang: [] configuration into module data

    _explodeLang : function() {

        // It may seem like this function could be merged
        // into _explode, resulting in a single loop, but
        // that's not possible because Object.each doesn't
        // necessarily iterate over the modules added
        // during iteration.
        // We can handle localization separately because
        // resource modules are not allowed to require
        // other modules.
        
        // If the application hasn't requested a language, use the root version
        // of any resource module.

        var loader = this;

        var reqLang = Y.config.lang || "",
            langPrefix = "lang-",
            langBase = "lang/",
            r = loader.required;

        Y.Object.each(r, function(v, name) {

            var m, lang, mLang, i;
            
            m = this.getModule(name);

            // modules that have resource modules are identified by the languages property
            if (m && m.lang) {

                // look up best language for the module's resources
                lang = Y.I18N.lookupBestLang(reqLang, m.lang);

                // construct descriptor for the resource module with name and path
                mLang = {};
                mLang.type = "js";
                mLang.name = lang ? langPrefix + name + "_" + lang : langPrefix + name;

                // we assume the resource module lives in the same directory and
                // has the same suffix as the module using it
                i = m.path.lastIndexOf(name);
                if (i >= 0) {
                    mLang.path = m.path.substring(0, i) + langBase + mLang.name + "." + mLang.type;
                }

                // register the resource module and make sure it gets loaded
                this.addModule(mLang);
                r[mLang.name] = true;
            }
        }, loader);
    },

    // Pull down and attach a language pack
    _useLang : function(module, lang) {
	// TODO: Pull down and attach new language for a module, or all "loaded" modules
    },

    /**
     * Get the set of currently registered languages.
     *
     * @method getAvailLangs
     * @param {String} module Optional. The module name.
     * @return
     */
    getAvailableLangs : function(module) {
	// TODO: Need Meta-Data access to find m.lang for a module
    },

    /**
     * Finds the closest language match, from the list of available languages based on BCP 47 lookup.
     *
     * @method lookupBestLang
     * @param {String} lang The BCP 47 language code to find the closest match for
     * @param {Array} supportedLangs An array of supported langauge codes
     *
     * @return {String} The BCP 47 language code
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

        if (L.isString(preferredLanguages)) {
            preferredLanguages = preferredLanguages.split(/[, ]/);
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

    /**
     * Sets the active language for the given module. Returns false on failure
     * (e.g. if the language does not exist)
     *
     * @method setLang
     * @private
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language code.
     *
     */
    _setLang : function(module, lang) {
        var langs = this._mod(module),
            currLang = langs[ACTIVE];
            exists = !!langs[lang];

        if (exists) {
            langs[ACTIVE] = lang;
            this.fire("i18n:langChange", {mod: module, prevVal: currLang, newVal: lang});
        }
        return exists;
    },

    /**
     * Get the active language for the given module.
     *
     * @method getCurrLang
     *
     * @param {String} module The module name.
     * @param {String} lang The BCP 47 language code.
     *
     * @return {String} The current BCP 47 language code.
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
     * @param {String} lang The BCP 47 language code.
     * @param {Object} strings The hash of strings.
     */
    add : function(module, lang, strings) {
        this._mod(module)[lang] = strings;
        this._setLang(module, lang);
    },

    /**
     * @method get
     *
     * @param {String} module The module name.
     * @param {String} key Optional. If not provided, returns all strings, using merge to protect the originals.
     * @param {String} lang Optional. The BCP 47 langauge code.
     * @return String | Object
     */
    get : function(module, key, lang) {
        var mod = this._mod(module),
            str,
            lang = lang || mod[ACTIVE],
            strs = mod[lang];

        if (strs) {
            str = (key) ? strs[key] : Y.merge(strs);
        }

        return str;
    }
};

Y.augment(Y.I18N, Y.EventTarget);

Y.I18N.publish("i18n:langChange", {emitFacade:true});
