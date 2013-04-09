/**
 Provides keyboard navigation of DataTable cells and support for adding other
 keyboard actions.
 @module datatable
 @submodule datatable-keynav
*/
var arrEach = Y.Array.each,

/**
 A DataTable class extension that provides navigation via keyboard, based on
 WAI-ARIA recommendation for the [Grid widget](http://www.w3.org/WAI/PF/aria-practices/#grid)
 and extensible to support other actions.


 @class DataTable.KeyNav
 @extends Y.DataTable
 @author Daniel Barreiro
*/
    DtKeyNav = function (){};

/**
Mapping of key codes to friendly key names that can be used in the
[keyActions](#attr_keyActions) attribute and [ARIA_ACTIONS](#property_ARIA_ACTIONS)
property

@property keyNames
@type {Object}
@static
**/
DtKeyNav.keyNames = {
    13: 'enter',
    32: 'space',
    33: 'pgup',
    34: 'pgdown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

/**
Mapping of key codes to actions according to the WAI-ARIA suggestion for the
[Grid Widget](http://www.w3.org/WAI/PF/aria-practices/#grid).

The key for each entry is a key-code or [keyName](#property_keyNames) while the
value can be a function that performs the action or a string.  If a string,
it can either correspond to the name of a method in this module (or  any
method in a DataTable instance) or the name of an event to fire.
@property ARIA_ACTIONS
@type Object
@static
 */
DtKeyNav.ARIA_ACTIONS = {
    left:'_keyMoveLeft',
    right:'_keyMoveRight',
    up: '_keyMoveUp',
    down: '_keyMoveDown',
    home: '_keyMoveRowStart',
    end: '_keyMoveRowEnd',
    pgup: '_keyMoveColTop',
    pgdown: '_keyMoveColBottom',
    enter: 'enterActiveMode',
    113: 'enterActiveMode' // F2
};

DtKeyNav.ATTRS = {
    /**
    Cell that's currently either focused or
    focusable when the DataTable gets the focus.

    @attribute {Node|null} focusedCell
    **/
    focusedCell: {   },

    /**
    Table of actions to be performed for each key.  It is loaded with a clone
    of [ARIA_ACTIONS](#property_ARIA_ACTIONS) by default.

    The key for each entry is either a key-code or an alias from the
    [keyNames](#property_keyNames) table. They can be prefixed with any combination
    of the modifier keys `alt`, `ctrl`, `meta` or `shift` followed by a hyphen,
    such as `"ctrl-shift-up"` (modifiers, if more than one, should appear in alphabetical order).

    The value for each entry should be a function or the name of a method in
    the DataTable instance.  The method will receive the original keyboard
    EventFacade as its only argument.

    If the value is a string and it cannot be resolved into a method,
    it will be assumed to be the name of an event to fire. The listener to that
    event will receive an EventFacade containing references to the cell that has the focus,
    the row, column and, unless it is a header row, the record it corresponds to.
    The second argument will be the original EventFacade for the keyboard event.

     @attribute keyActions
     @type {Object}
     @default ARIA_ACTIONS
     */

    keyActions: {
        valueFn: function () {
            return Y.clone(DtKeyNav.ARIA_ACTIONS);
        }
    }
};

Y.mix( DtKeyNav.prototype, {
    /**
    Array containing the event handles to any event that might need to be detached
    on destruction.
    @property _keyNavSubscr
    @type Array
    @default null,
    @private
     */
    _keyNavSubscr: null,
    /**
    Reference to the THead section that holds the headers for the datatable.
    For a Scrolling DataTable, it is the one visible to the user.
    @property _keyNavTHead
    @type Node
    @default: null
    @private
     */
    _keyNavTHead: null,
    initializer: function () {
        this.onceAfter('render', this._afterKeyNavRender);
        this._keyNavSubscr = [
            this.after('focusedCellChange', this._afterKeyNavFocusedCellChange),
            this.after('focusedChange', this._afterKeyNavFocusedChange)
        ];

    },
    destructor: function () {
        arrEach(this._keyNavSubscr, function (evHandle) {
            if (evHandle && evHandle.detach) {
                evHandle.detach();
            }
        });

    },
    /**
    Sets the tabIndex on the focused cell and, if the DataTable has the focus,
    sets the focus on it.

    @method _afterFocusedCellChange
    @param e {EventFacade}
    @private
    */
    _afterKeyNavFocusedCellChange: function (e) {
         console.log('_afterKeyNavFocusedCellChange',e);
        var newVal  = e.newVal,
            prevVal = e.prevVal;

        if (prevVal) {
            prevVal.set('tabIndex', -1);
        }

        if (newVal) {
            newVal.set('tabIndex', 0);

            if (this.get('focused')) {
                newVal.scrollIntoView();
                newVal.focus();
            }
        }
    },
    /**
    When the DataTable gets the focus, it ensures the correct cell regains
    the focus.
    @method _afterKeyNavFocusedChange
    @param e {EventFacade}
    @private
     */
    _afterKeyNavFocusedChange: function (e) {
         console.log('_afterKeyNavFocusedChange',e);
         if (e.newVal) {
             var cell = this.get('focusedCell');
             cell.focus();
             cell.scrollIntoView();
         }

    },
    /**
    Subscribes to the events on the DataTable elements once they have been rendered,
    finds out the header section and makes the top-left element focusable.
    @method _afterKeyNavRender
    @private
     */
    _afterKeyNavRender: function () {
         console.log('_afterKeyNavRender');
        var cbx = this.get('contentBox');
        this._keyNavSubscr.push(
            cbx.on('keydown', this._onKeyNavKeyDown, this),
            cbx.on('click', this._onKeyNavClick, this)
        );
        this._keyNavTHead = (this._yScrollHeader || this._tableNode).one('thead');
        this._keyMoveFirst();
    },
    /**
    In response to a click event, it sets the focus on the clicked cell
    @method _onKeyNavClick
    @param e {EventFacade}
    @private
     */
    _onKeyNavClick: function (e) {
        var cell = e.target.ancestor('td, th', true);
        if (cell) {
            this.focus();
            this.set('focusedCell', cell);
        }
    },
    /**
    Responds to a key down event by executing the action set in the
    [keyActions](#attr_keyActions) table.
    @method _onKeyNavKeyDown
    @param e {EventFacade}
    @private
    */
    _onKeyNavKeyDown: function (e) {
         console.log('_onKeyNavKeyDown',e);
        var key    = DtKeyNav.keyNames[e.keyCode] || e.keyCode,
            action;

        arrEach(['alt', 'ctrl', 'meta', 'shift'], function (modifier) {
            if (e[modifier + 'Key']) {
                key = modifier + '-' + key;

            }
        });
        action = this.get('keyActions')[key];

        switch (typeof action) {
            case 'string':
                if (this[action]) {
                    this[action].call(this, e);
                } else {
                    this._keyNavFireEvent(action, e);
                }
                break;
            case 'function':
                action.call(this, e);
                break;
            default:
                return;
        }
        e.preventDefault();
    },
    /**
    If the action associated to a key combination is a string and no method
    by that name was found in this instance, this method will
    fire an event using that string and provides extra information
    to the listener.

    @method _keyNavFireEvent
    @param action {String} Name of the event to fire
    @param e {EventFacade} Original facade from the keydown event.
    @private

     */
    _keyNavFireEvent: function (action, e) {
        var cell = e.target.ancestor('td, th', true);
        if (cell) {
            this.fire(action, {
                cell: cell,
                row: cell.ancestor('tr'),
                record: this.getRecord(cell),
                column: this.getColumn(cell.get('cellIndex'))
            }, e);
        }
    },
    /**
    Sets the focus on the very first cell in the header of the table.
    @method _keyMoveFirst
    @private
     */
    _keyMoveFirst: function () {
        console.log('first');
        this.set('focusedCell' , this._keyNavTHead.one('th'), {src:'keyNav'});

    },
    /**
    Sets the focus on the cell to the left of the currently focused one.
    Does not wrap, following the WAI-ARIA recommendation.
    @method _keyMoveLeft
    @private
    */
    _keyMoveLeft: function () {
        console.log('left');
        var cell = this.get('focusedCell'),
            index = cell.get('cellIndex'),
            row = cell.ancestor();

        if (index === 0) {
            return;
        }
        this.set('focusedCell', row.get('cells').item(index - 1), {src:'keyNav'});

    },
    /**
    Sets the focus on the cell to the right of the currently focused one.
    Does not wrap, following the WAI-ARIA recommendation.
    @method _keyMoveRight
    @private
    */
    _keyMoveRight: function () {
        console.log('right');
        var cell = this.get('focusedCell'),
            index = cell.get('cellIndex') + 1,
            row = cell.ancestor(),
            cells = row.get('cells');

        if (index === cells.size()) {
            return;
        }
        this.set('focusedCell', cells.item(index), {src:'keyNav'});

    },
    /**
    Sets the focus on the cell above the currently focused one.
    It will move into the headers when the top of the data rows is reached.
    Does not wrap, following the WAI-ARIA recommendation.
    @method _keyMoveUp
    @private
    */
    _keyMoveUp: function () {
        console.log('up');
        var cell = this.get('focusedCell'),
            cellIndex = cell.get('cellIndex'),
            row = cell.ancestor(),
            rowIndex = row.get('rowIndex'),
            section = row.ancestor(),
            inHead = section === this._keyNavTHead;

        if (!inHead) {
            rowIndex -= section.get('firstChild').get('rowIndex');
        }
        if (rowIndex === 0) {
            if (inHead) {
                return;
            }
            section = this._keyNavTHead;
            row = section.get('lastChild');
        } else {
            row = section.get('rows').item(rowIndex -1);
        }
        this.set('focusedCell', row.get('cells').item(cellIndex));
    },
    /**
    Sets the focus on the cell below the currently focused one.
    It will move into the data rows when the bottom of the header rows is reached.
    Does not wrap, following the WAI-ARIA recommendation.
    @method _keyMoveDown
    @private
    */
    _keyMoveDown: function () {
        console.log('down');
        var cell = this.get('focusedCell'),
            cellIndex = cell.get('cellIndex'),
            row = cell.ancestor(),
            rowIndex = row.get('rowIndex') + 1,
            section = row.ancestor(),
            inHead = section === this._keyNavTHead;

        if (!inHead) {
            rowIndex -= section.get('firstChild').get('rowIndex');
        }
        if (rowIndex === section.get('rows').size()) {
            if (!inHead) {
                return;
            }
            section = this._tbodyNode;
            row = section.get('firstChild');

        } else {
            row = section.get('rows').item(rowIndex);
        }
        this.set('focusedCell', row.get('cells').item(cellIndex));
    },
    /**
    Sets the focus on the left-most cell of the row containing the currently focused cell.
    @method _keyMoveRowStart
    @private
     */
    _keyMoveRowStart: function () {
        var row = this.get('focusedCell').ancestor();
        this.set('focusedCell', row.get('firstChild'));

    },
    /**
    Sets the focus on the right-most cell of the row containing the currently focused cell.
    @method _keyMoveRowEnd
    @private
     */
    _keyMoveRowEnd: function () {
        var row = this.get('focusedCell').ancestor();
        this.set('focusedCell', row.get('lastChild'));

    },
    /**
    Sets the focus on the top-most cell of the column containing the currently focused cell.
    It would normally be a header cell.
    @method _keyMoveColTop
    @private
     */
    _keyMoveColTop: function () {
        var cell = this.get('focusedCell'),
            cellIndex = cell.get('cellIndex');

        this.set('focusedCell', this._keyNavTHead.get('firstChild').get('cells').item(cellIndex));
    },
    /**
    Sets the focus on the last cell of the column containing the currently focused cell.
    @method _keyMoveColBottom
    @private
     */
    _keyMoveColBottom: function () {
        var cell = this.get('focusedCell'),
            cellIndex = cell.get('cellIndex');

        this.set('focusedCell', this._tbodyNode.get('lastChild').get('cells').item(cellIndex));

    }
});

Y.DataTable.KeyNav = DtKeyNav;
Y.Base.mix(Y.DataTable, [DtKeyNav]);
