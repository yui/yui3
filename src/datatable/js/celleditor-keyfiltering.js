/**
Extension to DataTable Cell Editors that does input validation as the entry is being
typed or pasted in.  It uses the `event-valuechange` module to check the on
input and textarea elements.

The built-in cell editors have key filters configured, when applicable, but they
will not be operative unless this module is loaded.
@module datatable
@submodule datatable-celleditor-keyfiltering
*/
/**
This class is not meant to be used directly, it will get automatically mixed into
`DataTable.BaseCellEditor`.
@class DataTable.BaseCellEditor.KeyFiltering
@static
 */
var KF = function () {};

KF.ATTRS = {
    /**
    Provides an input filtering capability to restrict input into the editing area
    checked via the `event-valuechange` module.

    This attribute is set to either a RegEx or a function that confirms if the entry
    was valid for this editor.

    If a function is provided, the single argument is the current input value and if
    it is valid it should return true.

    ##### keyFiltering requires the `datatable-celleditor-keyfiltering` module to be loaded

    @example
          /^\d*$/            // for numeric digit-only input
          /^(\d|\-|\.)*$/      // for floating point numeric input
          /^(\d|\/)*$/         // for Date field entry in MM/DD/YYYY format

    The cell editors for dates and numbers already have key filters defined,
    which are ignored when this module is not loaded.
    Those default key filters are very simple-minded and might not be applicable
    for any but the most basic dates, numbers and locales.

    @attribute keyFiltering
    @type RegExp | Function
    @for DataTable.BaseCellEditor
    @default null
    */
    keyFiltering:  {
        value:  null
    }
};

Y.mix( KF.prototype, {

    /**
    Event handle to changes in the [keyFiltering](#attr_keyFiltering) attribute
    value change, to detach when done.
    @property _keyFilteringSubscr
    @type EventHandle | null
    @default null
    @private
     */
    _keyFilteringSubscr: null,

    /**
    Internal copy of the function set in the [keyFiltering](#attr_keyFiltering)
    attribute for faster processing.  If  [keyFiltering](#attr_keyFiltering)
    was a RegExp, it will be converted to a function using that RegExp to check
    the entry.

    @method _keyFilter
    @param value {String} input value to be validated
    @return {Boolean} true if value is valid
    @for DataTable.BaseCellEditor
    @private
    */
    _keyFilter : null,

    /**
    Lifecycle method
    @method initializer
    @protected
    */
    initializer: function () {
        this._subscr.push(this.after('keyFilteringChange', this._processKeyFiltering));
        this.onceAfter('render', this._processKeyFiltering);
    },

    /**
    Processes both changes in the [keyFiltering](#attr_keyFiltering)  attribute
    and the initial rendering of the input element to be monitored for valid
    entries.

    @method _processKeyFiltering
    @for DataTable.BaseCellEditor
    @private
     */
    _processKeyFiltering: function () {
        var value = this.get('keyFiltering'),
            input = this._inputNode;

        if (input) {
            if (value === null) {
                if (this._keyFilteringSubscr) {
                    this._keyFilteringSubscr.detach();
                }
                this._keyFilter = null;
                return;
            } else if (typeof value === 'function') {
                this._keyFilter = value;
            } else if (value instanceof RegExp) {
                this._keyFilter = this._regExpFilter(value);
            }
            if (!this._keyFilteringSubscr) {
                this._keyFilteringSubscr =  input.on('valuechange', this._onValueChange, this);

            }
        }
    },

    /**
    Returns a function that uses the regular expression provided to check a value
    passed to that function.  It is used along the [keyFiltering](#attr_keyFiltering)
    attribute to set the [_keyFilter](#method__keyFilter) method for input validation.

    @method _regExpFilter
    @param regExp {RegExp} regular expression to use when checking.
    @return {Function} Function that checks a value passed to it against the regular expression.
    @private
    @for DataTable.BaseCellEditor

     */
    _regExpFilter: function (regExp) {
        return function (value) {
            return regExp.test(value);
        };
    },

    /**
    Handles validation while the value is being entered. It applies the
    [keyFiltering](#attr_keyFiltering) regular expression or function to the input
    and rejects the entry if it doesn't match.

    It will be active if there is an [_inputNode](#property__inputNode) set and
    a [keyFiltering](#attr_keyFiltering) set.

    @method _onValueChange
    @param e {EventFacade} Event facade as provided by the `valuechange` event.
    @private
    @for DataTable.BaseCellEditor
    */
    _onValueChange: function (e) {
        if (!this._keyFilter(e.newVal)) {
            e.target.set('value', e.prevVal);
        }
    }
});
Y.DataTable.BaseCellEditor.KeyFiltering = KF;
Y.Base.mix(Y.DataTable.BaseCellEditor, [KF]);