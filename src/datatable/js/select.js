/**
 Adds support for selecting columns, rows and cells with the mouse in a DataTable

 @module datatable
 @submodule datatable-select
 @since @SINCE@
 */

/**
 @class DataTable.Select
 @since @SINCE@
 */

function Select() {}

/**
 Fired after the selection is modifed by a direct method call or interaction
 with the UI

 If `selectMode` is "cell", index is based on the position of the cell in the
 `tbody`, where top left is 0 and bottom right is
 `rowIndex * number of columns + number of columns`.

 @event selectionChange
 @param {Number} curIndex Index of the row, column or cell that was acted upon to
    cause the event to fire
 @param {Number} lastIndex Index of the last item that was selected. This will
    be the same of the `curIndex` if the item interacted with was a new
    selection. This will be a different number from `curIndex` if the item was
    deselected.

 */
var SELECTION_CHANGE = 'selectionChange',
    getClassName = Y.ClassNameManager.getClassName;


Select.ATTRS = {
    /**
     Setting this will allow you to select a row, column or cell. Using
     modifier keys will allow you to to toggle specific items, or select a
     range of items.

     Possible values are "row", "col" or "cell"

     Setting to `null` will remove the ability to select until it is set again.

     @attribute selectRows
     @default null
     @type String
     @since @SINCE@
     */
    selectMode: {
        value: null,
        setter: '_setSelectMode',
        validator: Y.Lang.isString
    }
};

Select.prototype = {

    // PROPERTIES

    /**
     An object consisting of classnames for a `row`, a `col` and a `cell` to
     be applied to their respective objects when the user selects the item and
     the attribute is set to true.

     @public
     @property selectClassNames
     @type Object
     @since @SINCE@
     */
    selectClassNames: {
        row: getClassName(NAME, 'row'),
        col: getClassName(NAME, 'col'),
        cell: getClassName(NAME, 'cell')
    },

    /**
     A string that is used to create a column selector when the column is
     clicked. Can contain the css prefix (`{prefix}`) and the column name
     (`{col}`). Further substitution will require `_highlightCol` to be
     overwritten.

     @protected
     @property _colSelector
     @type String
     @since @SINCE@
     */
    _colSelector: '.{prefix}-col-{col}',

    /**
     This object will contain any delegates created when their feature is
     turned on.

     @protected
     @property _selectDelegates
     @type Object
     @since @SINCE@
     */

    /**
     A number consisting of the last index of the selected row, column or cell.
     @protected
     @property _lastSelectIndex
     @type Number
     @default null
     @since @SINCE@
     */

    /**
     An Object consisting of the selected item's index for each row, column
     and cell.

     @protected
     @property _selectSelected
     @type Object
     @since @SINCE@
     */

    // PUBLIC
    initializer: function () {
        this._selectDelegate = null;
        this._lastSelectIndex = null;
        this._selectSelected = [];
    },

    /**
     Clears all selections currently in the table.

     @public
     @method clearSelection
     @return Current DataTable instance
     @chainable
     */
    clearSelection: function () {
        this._selectSelected = [];
        this._lastSelectIndex = null;

        if (!this.body) {
            return this;
        }

        var tbody = this.body.tbodyNode,
            classNames = this.selectClassNames;

        tbody.all('.' + classNames.row).removeClass(classNames.row);
        tbody.all('.' + classNames.col).removeClass(classNames.col);
        tbody.all('.' + classNames.cell).removeClass(classNames.cell);

        this.fire(SELECTION_CHANGE, {
            lastIndex: this._lastSelectIndex,
            curIndex: this._lastSelectIndex
        });

        return this;
    },

    /**
     Selects all items in the table depending on the mode specified.

     @public
     @method selectAll
     @param {String} type Type of selection to be made
     @return Current DataTable instance
     @chainable
     */
    selectAll: function (type) {
        var tbody = this.body.tbodyNode,
            mode = type || this.get('selectMode'),
            items,
            min,
            max;

        if (mode === 'row') {
            items = tbody.all('tr');
            max = items.size();
        } else if (mode === 'col') {
            items = tbody.all('td');
            max = tbody.one('tr').all('td').size();
        } else if (mode === 'cell') {
            items = tbody.all('td');
            max = items.size();
        }

        if (items && items.size()) {
            this._lastSelectIndex = max - 1;

            items.addClass(this.selectClassNames[mode]);

            for (min = 0; min < max; min++) {
                this._selectSelected.push(min);
            }

            this.fire(SELECTION_CHANGE, {
                lastIndex: this._lastSelectIndex,
                curIndex: this._lastSelectIndex
            });
        }

        return this;

    },

    /**
     Select a specific row, cell, or column. The type provided must be 'row',
     'col' or 'cell' to specify what to select. The cell provided must be an
     Array or a Node. The Node can be the raw DOM node or a Y.Node of the cell,
     a cell's child, or a cell's direct ancestor. Modifiers will be passed
     through to the selectRow, selectCol, or selectCell method.

     @public
     @method select
     @param {String} type Type of selection to be made
     @param {Array|Node} cell Array, Y.Node or Node
     @param {Object} [modifiers] Modifier for cell selection
     @return Current DataTable instance
     @chainable
     */
    select: function (type, cell, modifiers) {
        if (type !== 'row' && type !== 'col' && type !== 'cell') {
            return this;
        }

        var method = 'select' + type.charAt(0).toUpperCase() + type.substr(1).toLowerCase();

        if (Y.Lang.isArray(cell)) {
            cell = this.getCell(cell);
        } else {
            // assume cell is a node if not an array
            cell = Y.Node(cell);
            if (cell.get('tagName') !== 'TD') {
                // always look inward first
                if (cell.one('td')) {
                    cell = cell.one('td');
                } else {
                    cell = cell.ancestor('td');
                }
            }
        }

        if (!cell || !this.body.tbodyNode.contains(cell)) {
            return this;
        }

        return this[method](cell, modifiers);
    },

    /**
     Selects or deselects the row.

     If the modifier specifies the shift key was used, creates a range
     selection from the previously selected row. If  there is no previously
     selected row, the modifier is suppressed.

     If the modifier specifies the ctrl key was used, toggles the selection of
     the row. If there is no previously selected row, the modifier is
     suppressed.

     @public
     @method selectRow
     @param {Y.Node} cell Cell, or cell decendant to specify which is row is
        to be selected
     @param {Object} [modifiers] Object specifying whether the shift key or
        control key was used. Passed through automatically when called through
        UI interaction.
     @return Current DataTable instance
     @chainable
     */
    selectRow: function (cell, modifiers) {
        var row = cell.ancestor('tr'),
            className = this.selectClassNames.row,
            tbody = cell.ancestor('tbody'),
            indexOffset = -(tbody.get('firstChild.rowIndex')),
            curIndex = row.get('rowIndex') + indexOffset,
            lastIndex = this._lastSelectIndex,
            selectedRows = this._selectSelected,
            selectedRowsPos,
            rows,
            startIndex,
            endIndex,
            deselected;

        modifiers || (modifiers = {});

        // no previous index mutes the current modifier
        if (!lastIndex && lastIndex !== 0) {
            modifiers.shift = false;
            modifiers.ctrl = false;
        }

        if (modifiers.shift) { // range selection from last index
            startIndex = Math.min(curIndex, lastIndex);
            endIndex = Math.max(curIndex, lastIndex);

            // find all rows within the start and end that need to be selected
            rows = tbody.all('tr').slice(startIndex, endIndex + 1);

            // add rows to index in order, but only newly selected rows
            rows.each(Y.bind(function (row) {
                if (!row.hasClass(className)) {
                    row.addClass(className);
                    selectedRows.push(curIndex);
                }
            }, this));

        } else if (modifiers.ctrl) { // toggle selection _and_ keeping other selections
            if (row.hasClass(className)) {
                // deselect
                row.removeClass(className);
                selectedRowsPos = Y.Array.indexOf(selectedRows, curIndex);
                selectedRows.splice(selectedRowsPos, 1);
                deselected = true;
            } else {
                row.addClass(className);
                selectedRows.push(curIndex);
            }
        } else { // toggle selection _while_ removing all other selections
            if (row.hasClass(className) && selectedRows.length <= 1) {
                row.removeClass(className);
                selectedRows = [];
                deselected = true;
            } else {
                this.clearSelection();
                row.addClass(className);
                selectedRows = [curIndex];
            }
        }

        // The row interacted with was deselected so we need to back up the last selected index
        if (deselected) {
            curIndex = selectedRows.length ? selectedRows[selectedRows.length - 1] : null;
        }

        this._selectSelected = selectedRows;
        this._lastSelectIndex = curIndex;

        this.fire(SELECTION_CHANGE, {
            lastIndex: this._lastSelectIndex,
            curIndex: row.get('rowIndex') + indexOffset
        });

        return this;
    },

    /**
     Selects or deselects the column.

     If the modifier specifies the shift key was used, creates a range
     selection from the previously selected column. If  there is no previously
     selected column, the modifier is suppressed.

     If the modifier specifies the ctrl key was used, toggles the selection of
     the column. If there is no previously selected column, the modifier is
     suppressed.

     @public
     @method selectCol
     @param {Y.Node} cell Cell, or cell decendant to specify which is column
        is to be selected
     @param {Object} [modifiers] Object specifying whether the shift key or
        control key was used. Passed through automatically when called through
        UI interaction.
     @return Current DataTable instance
     @chainable
     */
    selectCol: function (cell, modifiers) {
        var //row = cell.ancestor('tr'),
            className = this.selectClassNames.col,
            curIndex = cell.get('cellIndex'),
            lastIndex = this._lastSelectIndex,
            selectedCols = this._selectSelected,
            colSelector = Y.Lang.sub(this._colSelector, {
                               prefix: this._cssPrefix,
                               col: cell.getData('col')
                           }),
            selectedColsPos,
            colSelectors = [colSelector],
            startIndex,
            endIndex,
            deselected,
            tbody = cell.ancestor('tbody');

        modifiers || (modifiers = {});

        // no previous index mutes the current modifier
        if (!lastIndex && lastIndex !== 0) {
            modifiers.shift = false;
            modifiers.ctrl = false;
        }

        if (modifiers.shift) { // range selection from last index

            startIndex = Math.min(curIndex, lastIndex);
            endIndex = Math.max(curIndex, lastIndex);

            // find all column cells within the start and end that need to be selected
            cols = cell.ancestor('tr').all('td').slice(startIndex, endIndex + 1);
            colSelectors = [];

            // get column selectors for columns that are not selected
            cols.each(Y.bind(function (col) {
                if (!col.hasClass(className)) {
                    colSelectors.push('.' + this._cssPrefix + '-col-' + col.getData('col'));
                    selectedCols.push(col.get('cellIndex'));
                }
            }, this));

            tbody.all(colSelectors.join(', ')).addClass(className);

        } else if (modifiers.ctrl) { // toggle selection _and_ keeping other selections

            if (cell.hasClass(className)) {
                // deselect

                tbody.all(colSelectors.join(', ')).removeClass(className);
                selectedColsPos = Y.Array.indexOf(selectedCols, curIndex);
                selectedCols.splice(selectedColsPos, 1);
                deselected = true;
            } else {
                tbody.all(colSelectors.join(', ')).addClass(className);
                selectedCols.push(curIndex);
            }

        } else { // toggle selection _while_ removing all other selections
            cols = tbody.all(colSelectors.join(', '));
            if (cols.item(0).hasClass(className) && selectedCols.length <= 1) {
                cols.removeClass(className);
                selectedCols = [];
                deselected = true;
            } else {
                this.clearSelection();
                cols.addClass(className);
                selectedCols = [curIndex];
            }
        }

        // The row interacted with was deselected so we need to back up the last selected index
        if (deselected) {
            curIndex = selectedCols.length ? selectedCols[selectedCols.length - 1] : null;
        }

        this._selectSelected = selectedCols;
        this._lastSelectIndex = curIndex;

        this.fire(SELECTION_CHANGE, {
            lastIndex: this._lastSelectIndex,
            curIndex: cell.get('cellIndex')
        });

        return this;
    },

    /**
     Selects or deselects the cell.

     If the modifier specifies the shift key was used, creates a range
     selection from the previously selected cell. If  there is no previously
     selected cell, the modifier is suppressed.

     If the modifier specifies the ctrl key was used, toggles the selection of
     the cell. If there is no previously selected cell, the modifier is
     suppressed.

     @public
     @method selectCell
     @param {Y.Node} cell Cell, or cell decendant to specify which is cell
        is to be selected
     @param {Object} [modifiers] Object specifying whether the shift key or
        control key was used. Passed through automatically when called through
        UI interaction.
     @return Current DataTable instance
     @chainable
     */
    selectCell: function (cell, modifiers) {
        // cellPosition [x, y] -> [col, row]
        var className = this.selectClassNames.cell,
            curIndex = this._getCellIndex(cell),
            lastIndex = this._lastSelectIndex,
            selectedCells = this._selectSelected,
            cellPosition = this._getPositionFromIndex(curIndex),
            lastPosition = this._getPositionFromIndex(lastIndex),
            tbody = cell.ancestor('tbody'),
            cells = new Y.NodeList(cell),
            startPosition,
            endPosition,
            deselected,
            row,
            rowMax,
            col,
            colMax,
            workingCell;

        modifiers || (modifiers = {});

        // no previous index mutes the current modifier
        if (!lastIndex && lastIndex !== 0) {
            modifiers.shift = false;
            modifiers.ctrl = false;
        }

        if (modifiers.shift) { // range selection from last index
            startPosition = [
                Math.min(cellPosition[0], lastPosition[0]),
                Math.min(cellPosition[1], lastPosition[1])
            ];
            endPosition = [
                Math.max(cellPosition[0], lastPosition[0]),
                Math.max(cellPosition[1], lastPosition[1])
            ];

            for (row = startPosition[1], rowMax = endPosition[1]; row <= rowMax; row++) {
                for (col = startPosition[0], colMax = endPosition[0]; col <= colMax; col++) {
                    workingCell = this.getCell([row, col]);
                    if (!workingCell.hasClass(className)) {
                        cells.push(workingCell);
                        selectedCells.push(this._getCellIndex(workingCell));
                    }
                }
            }

            cells.addClass(className);

        } else if (modifiers.ctrl) { // toggle selection _and_ keeping other selections

            if (cell.hasClass(className)) {
                // deselect
                cell.removeClass(className);
                selectedCellsPos = Y.Array.indexOf(selectedCells, curIndex);
                selectedCells.splice(selectedCellsPos, 1);
                deselected = true;
            } else {
                cell.addClass(className);
                selectedCells.push(curIndex);
            }

        } else { // toggle selection _while_ removing all other selections
            if (cell.hasClass(className) && selectedCells.length <= 1) {
                cell.removeClass(className);
                selectedCells = [];
                deselected = true;
            } else {
                this.clearSelection();
                cell.addClass(className);
                selectedCells = [curIndex];
            }
        }

        // The row interacted with was deselected so we need to back up the last selected index
        if (deselected) {
            curIndex = selectedCells.length ? selectedCells[selectedCells.length - 1] : null;
        }

        this._selectSelected = selectedCells;
        this._lastSelectIndex = curIndex;

        this.fire(SELECTION_CHANGE, {
            lastIndex: this._lastSelectIndex,
            curIndex: this._getCellIndex(cell)
        });

        return this;
    },


    // SETTERS
    /**
     Normalizes the value and creates a delegate for clicking cells in the
     tbody. Detaches any previously assigned delegate as only one mode can be
     specified at a time.

     @protected
     @method _setSelectMode
     @param {String} val Can be "row", "col", or "cell" specifying what is to
        be selected
     @return val Normalized value
     */
    _setSelectMode: function (val) {
        var del = this._selectDelegate;

        this.clearSelection();

        switch (val) {
            case 'row':
            case 'rows':
                val = 'row';
                break;
            case 'col':
            case 'cols':
            case 'column':
            case 'columns':
                val = 'col';
                break;
            case 'cell':
            case 'cells':
                val = 'cell';
                break;
            default:
                // invalid set option. exit.
                val = null;
                break;
        }

        if (del) {
            del.detach();
        }

        if (val) {
            del = this.delegate('click', Y.bind(this._selectClick, this), 'tbody td');
            this._selectDelegate = del;
        }

        return val;
    },



    // PROTECTED

    /**
     Click delegate callback designed to call the correct select method based
     off the mode specified. This is also pass through the correct modifiers
     to the select method.

     @protected _selectClick
     @method _selectClick
     @param {EventFacade} e Mouse event from the delegate
     */
    _selectClick: function(e) {
        var modifiers = {},
            mode = this.get('selectMode');

        mode = mode.charAt(0).toUpperCase() + mode.substr(1).toLowerCase();

        if (e.shiftKey) {
            modifiers.shift = true;
            this._clearTextSelection();
        }
        if (e.ctrlKey || e.metaKey) {
            modifiers.ctrl = true;
        }

        this['select' + mode](e.target, modifiers);

        if (e.shiftKey) {
            this._clearTextSelection();
        }
    },

    /**
     Gets the position of the cell in [column, row] format based on the cell
     position provided

     @protected
     @method _getPositionFromIndex
     @param {Number} index
     @return Array Position of the cell index provided in relation to the
        data being displayed.
     */
    _getPositionFromIndex: function (index) {
        var colCount = this.get('columns').length,
            x,
            y;

        x = index % colCount;
        y = (index - x) / colCount;

        return [x, y];
    },

    /**
     Returns the index of the cell with relation to the data being displayed.

     @protected
     @method _getCellIndex
     @param {Y.Node} cell Cell node to be indexed.
     @return Number Index of the cell provided
     */
    _getCellIndex: function (cell) {
        var indexOffset = -(cell.ancestor('tbody').get('firstChild.rowIndex')),
            row = cell.ancestor('tr').get('rowIndex') + indexOffset,
            col = cell.get('cellIndex'),
            index = this.get('columns').length * row + col;

        return index;
    },

    /**
     Clears any highlighted text on the screen when the mouse is used to shift
     select a row, column or cell.

     @protected
     @method _clearTextSelection
     @since @SINCE@
     */
    _clearTextSelection: function () {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else {
            document.selection.createRange();
            document.selection.empty();
        }
    }

};

Y.DataTable.Select = Select;

Y.Base.mix(Y.DataTable, [Y.DataTable.Select]);
