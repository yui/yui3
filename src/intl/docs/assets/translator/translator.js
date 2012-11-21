YUI.add("translator", function(Y) {

    function Translator() {
        this._strs = Y.Intl.get("translator");
    }

    Translator.prototype = {
        constructor : Translator,

        hi : function() {
            return this._strs.hello;
        },

        bye : function() {
            return this._strs.goodbye;
        }
    }

    Y.Translator = Translator;

}, "3.1.0", {lang: ["en", "fr", "es"]});

