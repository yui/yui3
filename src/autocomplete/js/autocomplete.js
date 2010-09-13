/**
 * Provides automatic input completion or suggestions for text input fields and
 * textareas.
 *
 * @module autocomplete
 * @class AutoComplete
 * @extends Base
 * @uses AutoCompleteBase
 * @constructor
 * @param {Object} config Configuration object.
 * @since 3.3.0
 */

Y.AutoComplete = Y.Base.create('autocomplete', Y.Base, [Y.AutoCompleteBase], {
    initializer: function () {
        this._bindInput();
        this._syncInput();
    },

    destructor: function () {
        this._unbindInput();
    }
});
