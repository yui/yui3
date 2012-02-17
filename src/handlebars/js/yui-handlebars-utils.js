// This file provides a YUI-specific implementation of Handlebars' lib/utils.js
// file. Handlebars unfortunately creates enclosed references to its utils, so
// we have to maintain a complete fork of this file rather than just overriding
// specific parts.

var Lang = Y.Lang;

Handlebars.Exception = function (message) {
    var error = Error.prototype.constructor.apply(this, arguments),
        key;

    for (key in error) {
        if (error.hasOwnProperty(key)) {
            this[key] = error[key];
        }
    }

    this.message = error.message;
};

Handlebars.Exception.prototype = new Error();

Handlebars.SafeString = function (string) {
    this.string = string;
};

Handlebars.SafeString.prototype.toString = function () {
    return this.string.toString();
};

Handlebars.Utils = {
    escapeExpression: function (string) {
        // Skip escaping for empty strings.
        if (string === '') {
            return string;
        }

        // Don't escape SafeStrings, since they're already (presumed to be)
        // safe.
        if (string instanceof Handlebars.SafeString) {
            return string.toString();
        } else if (string === false || !Lang.isValue(string)) {
            return '';
        }

        // Unlike Handlebars' escaping implementation, Y.Escape.html() will
        // double-escape existing &amp; entities. This seems much less
        // surprising than avoiding double-escaping, especially since
        // a lack of double-escaping would make it impossible to use Handlebars
        // for things like displaying escaped code snippets.
        return Y.Escape.html(string);
    },

    isEmpty: function (value) {
        if (value === false
                || !Lang.isValue(value)
                || (Lang.isArray(value) && !value.length)) {

            return true;
        }

        return false;
    }
};
