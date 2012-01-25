YUI.add('datatable-scroll', function(Y) {

// TODO: split this into a plugin and a class extension to add the ATTRS (ala
// Plugin.addHostAttr()

/**
Adds the ability to make the table rows scrollable while preserving the header
placement.

There are two types of scrolling, horizontal (x) and vertical (y).  Horizontal
scrolling is achieved by wrapping the entire table in a scrollable container.
Vertical scrolling is achieved by splitting the table headers and data into two
separate tables, the latter of which is wrapped in a vertically scrolling
container.  In this case, column widths of header cells and data cells are kept
in sync programmatically.

Since the split table synchronization can be costly at runtime, the split is only done if the data in the table stretches beyond the configured `height` value.

To activate or deactivate scrolling, set the `scrollable` attribute to one of
the following values:

 * `false` - (default) Scrolling is disabled.
 * `true` or 'xy' - If `height` is set, vertical scrolling will be activated, if
            `width` is set, horizontal scrolling will be activated.
 * 'x' - Activate horizontal scrolling only. Requires the `width` attribute is
         also set.
 * 'y' - Activate vertical scrolling only. Requires the `height` attribute is
         also set.

 @module @datatable-scroll
 @class DataTable.Scrollable
 @for DataTable
**/
var YLang = Y.Lang,
    isString = YLang.isString,
    isNumber = YLang.isNumber,
    isArray  = YLang.isArray,

    Scrollable;

Y.DataTable.Scrollable = Scrollable = function () {};

Scrollable.ATTRS = {
    /**
    Activates or deactivates scrolling in the table.  Acceptable values are:

     * `false` - (default) Scrolling is disabled.
     * `true` or 'xy' - If `height` is set, vertical scrolling will be activated, if
                `width` is set, horizontal scrolling will be activated.
     * 'x' - Activate horizontal scrolling only. Requires the `width` attribute is
             also set.
     * 'y' - Activate vertical scrolling only. Requires the `height` attribute is
             also set.

    @attribute scrollable
    @type {String|Boolean}
    @value false
    **/
    scrollable: {
        value: false,
        setter: '_setScrollable'
    }
};

Y.mix(Scrollable.prototype, {
    /**
    Template for the `<div>` that is used to contain the rows when the table is
    vertically scrolling.

    @property SCROLLING_CONTAINER_TEMPLATE
    @type {HTML}
    @value '<div class="{classes}"><table></table></div>'
    **/
    SCROLLING_CONTAINER_TEMPLATE: '<div class="{classes}"><table></table></div>',

    /**
    Scrolls a given row or cell into view if the table is scrolling.  Pass the
    `clientId` of a Model from the DataTable's `data` ModelList or its row
    index to scroll to a row or a [row index, column index] array to scroll to
    a cell.  Alternately, to scroll to any element contained within the table's
    scrolling areas, pass its ID, or the Node itself (though you could just as
    well call `node.scrollIntoView()` yourself, but hey, whatever).

    @method scrollTo
    @param {String|Number|Number[]|Node} id A row clientId, row index, cell
            coordinate array, id string, or Node
    **/
    scrollTo: function (id) {
        var target;

        if (id && this._tbodyNode && (this._yScrollNode || this._xScrollNode)) {
            if (isArray(id)) {
                target = this.getCell(id);
            } else if (isNumber(id)) { 
                target = this.getRow(id);
            } else if (isString(id)) {
                target = this._tbodyNode.one('#' + id);
            } else if (id instanceof Y.Node &&
                    // TODO: ancestor(yScrollNode, xScrollNode)
                    id.ancestor('.yui3-datatable') === this.get('boundingBox')) {
                target = id;
            }

            target && target.scrollIntoView();
        }
    },

    //----------------------------------------------------------------------------
    // Protected properties and methods
    //----------------------------------------------------------------------------
    /**
    Relays changes in the table structure or content to trigger a reflow of the
    scrolling setup.

    @method _afterContentChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterContentChange: function (e) {
        this._mergeYScrollContent();
        this._syncScrollUI();
    },

    /**
    Reacts to changes in the `scrollable` attribute by updating the `_xScroll`
    and `_yScroll` properties and syncing the scrolling structure accordingly.

    @method _afterScrollableChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollableChange: function (e) {
        this._uiSetScrollable();
        this._syncScrollUI();
    },

    /**
    Syncs the scrolling structure if the table is configured to scroll vertically.

    @method _afterScrollHeightChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollHeightChange: function (e) {
        this._yScroll && this._syncScrollUI();
    },

    /**
    Attaches internal subscriptions to keep the scrolling structure up to date
    with changes in the table's `data`, `columns`, `caption`, or `height`.  The
    `width` is taken care of already.

    This executes after the table's native `bindUI` method.

    @method _bindScrollUI
    @protected
    **/
    _bindScrollUI: function () {
        this.after([
            'dataChange',
            'columnsChange',
            'captionChange',
            'heightChange'],
            Y.bind('_afterContentChange', this));

        this.data.after([
            'add', 'remove', 'reset', '*:change'],
            Y.bind('_afterContentChange', this));
    },

    /**
    Calculates the height of the div containing the vertically scrolling rows.
    The height is produced by subtracting the `offsetHeight` of the scrolling
    `<div>` from the `clientHeight` of the `contentBox`.

    @method _calcScrollHeight
    @protected
    **/
    _calcScrollHeight: function () {
        var scrollNode = this._yScrollNode;

        return this.get('contentBox').get('clientHeight') -
               scrollNode.get('offsetTop') -
               // To account for padding and borders of the scroll div
               scrollNode.get('offsetHeight') +
               scrollNode.get('clientHeight');
    },

    /**
    Populates the `_yScrollNode` property by creating the `<div>` Node described
    by the `SCROLLING\_CONTAINER_TEMPLATE`.

    @method _createYScrollNode
    @protected
    **/
    _createYScrollNode: function () {
        if (!this._yScrollNode) {
            this._yScrollNode = Y.Node.create(
                Y.Lang.sub(this.SCROLLING_CONTAINER_TEMPLATE, {
                    classes: this.getClassName('data','container')
                }));
        }
    },

    /**
    Assigns style widths to all columns based on their current `offsetWidth`s.
    This faciliates creating a clone of the `<colgroup>` so column widths are
    the same after the table is split in to header and data tables.

    @method _fixColumnWidths
    @protected
    **/
    _fixColumnWidths: function () {
        var tbody     = this._tbodyNode,
            table     = tbody.get('parentNode'),
            firstRow  = tbody.one('tr'),
            cells     = firstRow && firstRow.all('td'),
            scrollbar = Y.DOM.getScrollbarWidth(),
            widths    = [], i, len, cell;

        if (cells) {
            // The thead and tbody need to be in the same table to accurately
            // calculate column widths.
            this._tableNode.appendChild(this._tbodyNode);

            i = cells.size() - 1;
            cell = cells.item(i);

            // FIXME? This may be fragile if the table has a fixed width and
            // increasing the size of the last column would push the overall
            // width beyond the configured width.
            // bump up the width of the last column to account for the scrollbar.
            this._setColumnWidth(i,
                (cell.get('offsetWidth') + scrollbar) + 'px');

            // Avoid assignment without scrollbar adjustment
            cells.pop();

            // Two passes so assigned widths don't cause subsequent width changes
            // which would cost reflows.
            widths = cells.get('offsetWidth');

            for (i = 0, len = widths.length; i < len; ++i) {
                this._setColumnWidth(i, widths[i] + 'px');
            }

            table.appendChild(this._tbodyNode);
        }
    },

    /**
    Sets up event handlers and AOP advice methods to bind the DataTable's natural
    behaviors with the scrolling APIs and state.

    @method initializer
    @param {Object} config The config object passed to the constructor (ignored)
    @protected
    **/
    initializer: function () {
        this._setScrollProperties();

        this.after(['scrollableChange', 'heightChange', 'widthChange'],
            this._setScrollProperties);

        Y.Do.after(this._bindScrollUI, this, 'bindUI');
        Y.Do.after(this._syncScrollUI, this, 'syncUI');
    },

    /**
    Merges the header and data tables back into one table if they are split.

    @method _mergeYScrollContent
    @protected
    **/
    _mergeYScrollContent: function () {
        this.get('boundingBox').removeClass(this.getClassName('scrollable-y'));

        if (this._yScrollNode) {
            this._tableNode.append(this._tbodyNode);

            this._yScrollNode.remove().destroy(true);
            this._yScrollNode = null;

            this._removeHeaderScrollPadding();

            this._setARIARoles();
        }

        this._uiSetWidth(this.get('width'));
        this._uiSetColumns();
    },

    /**
    Removes the additional padding added to the last cells in each header row to
    allow the scrollbar to fit below.

    @method _removeHeaderScrollPadding
    @protected
    **/
    _removeHeaderScrollPadding: function () {
        var rows = this._theadNode.all('> tr').getDOMNodes(),
            cell, i, len;

        // The last cell in all rows of the table headers
        for (i = 0, len = rows.length; i < len; i += (cell.rowSpan || 1)) {
            cell = Y.one(rows[i].cells[rows[i].cells.length - 1])
                .setStyle('paddingRight', '');
        }
    },

    /**
    Moves the ARIA "grid" role from the table to the `contentBox` and adds the
    "presentation" role to both header and data tables to support the two
    tables reporting as one table for screen readers.

    @method _setARIARoles
    @protected
    **/
    _setARIARoles: function () {
        var contentBox = this.get('contentBox');

        if (this._yScrollNode) {
            this._tableNode.setAttribute('role', 'presentation');
            this._yScrollNode.one('> table').setAttribute('role', 'presentation');
            contentBox.setAttribute('role', 'grid');
        } else {
            this._tableNode.setAttribute('role', 'grid');
            contentBox.removeAttribute('role');
        }
    },

    /**
    Adds additional padding to the current amount of right padding on each row's
    last cell to account for the width of the scrollbar below.

    @method _setHeaderScrollPadding
    @protected
    **/
    _setHeaderScrollPadding: function () {
        var rows = this._theadNode.all('> tr').getDOMNodes(),
            padding, cell, i, len;

        cell = Y.one(rows[0].cells[rows[0].cells.length - 1]);

        padding = (Y.DOM.getScrollbarWidth() +
                   parseInt(cell.getComputedStyle('paddingRight'), 10)) + 'px';

        // The last cell in all rows of the table headers
        for (i = 0, len = rows.length; i < len; i += (cell.rowSpan || 1)) {
            cell = Y.one(rows[i].cells[rows[i].cells.length - 1])
                .setStyle('paddingRight', padding);
        }
    },

    /**
    Accepts (case insensitive) values "x", "y", "xy", `true`, and `false`.
    `true` is translated to "xy" and upper case values are converted to lower
    case.  All other values are invalid.

    @method _setScrollable
    @param {String|Boolea} val Incoming value for the `scrollable` attribute
    @return {String}
    @protected
    **/
    _setScrollable: function (val) {
        if (val === true) {
            val = 'xy';
        }

        if (isString(val)) {
            val = val.toLowerCase();
        }

        return (val === false || val === 'y' || val === 'x' || val === 'xy') ?
            val :
            Y.Attribute.INVALID_VALUE;
    },

    /**
    Assigns the `_xScroll` and `_yScroll` properties to true if an
    appropriate value is set in the `scrollable` attribute and the `height`
    and/or `width` is set.

    @method _setScrollProperties
    @protected
    **/
    _setScrollProperties: function () {
        var scrollable = this.get('scrollable') || '',
            width      = this.get('width'),
            height     = this.get('height');

        this._xScroll = width  && scrollable.indexOf('x') > -1;
        this._yScroll = height && scrollable.indexOf('y') > -1;
    },

    /**
    Clones the fixed (see `_fixColumnWidths` method) `<colgroup>` for use by the
    table in the vertical scrolling container.  The last column's width is reduced
    by the width of the scrollbar (which is offset by additional padding on the
    last header cell(s) in the header table - see `_setHeaderScrollPadding`).

    @method _setYScrollColWidths
    @protected
    **/
    _setYScrollColWidths: function () {
        var scrollNode = this._yScrollNode,
            table      = scrollNode && scrollNode.one('> table'),
            // hack to account for right border
            colgroup, lastCol;

        if (table) {
            scrollNode.all('colgroup,col').remove();
            colgroup = this._colgroupNode.cloneNode(true);
            colgroup.set('id', Y.stamp(colgroup));

            // Browsers with proper support for column widths need the
            // scrollbar width subtracted from the last column.
            if (!Y.Features.test('table', 'badColWidth')) {
                lastCol = colgroup.all('col').pop();

                // Subtract the scrollbar width added to the last col
                lastCol.setStyle('width',
                    (parseInt(lastCol.getStyle('width'), 10) - 1 -
                    Y.DOM.getScrollbarWidth()) + 'px');
            }

            table.insertBefore(colgroup, table.one('> thead, > tfoot, > tbody'));
        }
    },

    /**
    Splits the unified table with headers and data into two tables, the latter
    contained within a vertically scrollable container `<div>`.

    @method _splitYScrollContent
    @protected
    **/
    _splitYScrollContent: function () {
        var table = this._tableNode,
            scrollNode = this._yScrollTable,
            scrollbar  = Y.DOM.getScrollbarWidth(),
            scrollTable, width;
            
        this.get('boundingBox').addClass(this.getClassName('scrollable-y'));

        if (!scrollNode) {
            // I don't want to take into account the added paddingRight done in
            // _setHeaderScrollPadding for the data cells that will be
            // scrolling below
            this._fixColumnWidths();

            this._setHeaderScrollPadding();

            // lock the header table width in case the removal of the tbody would
            // allow the table to shrink (such as when the tbody data causes a
            // browser horizontal scrollbar).
            width = parseInt(table.getComputedStyle('width'), 10);
            table.setStyle('width', width + 'px');

            this._createYScrollNode();
            scrollNode  = this._yScrollNode;
            scrollTable = scrollNode.one('table');
            
            scrollTable.append(this._tbodyNode);

            table.insert(scrollNode, 'after');

            scrollNode.setStyles({
                height: this._calcScrollHeight() + 'px',
                        // FIXME: Lazy hack to account for scroll node borders
                width : (width - 2) + 'px'
            });

            scrollTable.setStyle('width', (width - scrollbar - 1) + 'px');
            this._setARIARoles();
        }

        this._setYScrollColWidths();
    },

    /**
    Calls `_mergeYScrollContent` or `_splitYScrollContent` depending on the
    current widget state, accounting for current state.  That is, if the table
    needs to be split, but is already, nothing happens.

    @method _syncScrollUI
    @protected
    **/
    _syncScrollUI: function () {
        var scrollable  = this._xScroll || this._yScroll,
            cBox        = this.get('contentBox'),
            node        = this._yScrollNode || cBox,
            table       = node.one('table'),
            overflowing = this._yScroll &&
                           (table.get('scrollHeight') > node.get('clientHeight'));

        this._uiSetScrollable();

        if (scrollable) {
            // Only split the table if the content is longer than the height
            if (overflowing) {
                this._splitYScrollContent();
            } else {
                this._mergeYScrollContent();
            }
        } else {
            this._mergeYScrollContent();
        }

        // TODO: fix X scroll.  I'll need to split tables here as well for the
        // caption if there is one present, so the horizontal scroll happens
        // under the stationary caption.
        // Also, similarly, only activate the x scrolling if the table is wider
        // than the configured width.
    },

    /**
    Overrides the default Widget `_uiSetWidth` to assign the width to either
    the table or the `contentBox` (for horizontal scrolling) in addition to the
    native behavior of setting the width of the `boundingBox`.

    @method _uiSetWidth
    @param {String|Number} width CSS width value or number of pixels
    @protected
    **/
    _uiSetWidth: function (width) {
        var scrollable = parseInt(width, 10) &&
                         (this.get('scrollable')||'').indexOf('x') > -1;

        if (isNumber(width)) {
            width += this.DEF_UNIT;
        }

        this._uiSetDim('width', width);
        this._tableNode.setStyle('width', scrollable ? '' : width);
        // FIXME: this allows the caption to scroll out of view
        this.get('contentBox').setStyle('width', scrollable ? width : '');

        if (this._yScrollNode) {
            this._mergeYScrollContent();
            this._syncScrollUI();
        }
    },

    /**
    Assigns the appropriate class to the `boundingBox` to identify the DataTable
    as horizontally scrolling, vertically scrolling, or both (adds both classes).

    Classes added are "yui3-datatable-scrollable-x" or "...-y"

    @method _uiSetScrollable
    @protected
    **/
    _uiSetScrollable: function () {
        // Initially add classes.  These may be purged by _syncScrollUI.
        this.get('boundingBox')
            .toggleClass(this.getClassName('scrollable','x'), this._xScroll)
            .toggleClass(this.getClassName('scrollable','y'), this._yScroll);
    }

    /**
    Indicates horizontal table scrolling is enabled.

    @property _xScroll
    @type {Boolean}
    @default undefined (not initially set)
    @private
    **/
    //_xScroll,

    /**
    Indicates vertical table scrolling is enabled.

    @property _yScroll
    @type {Boolean}
    @default undefined (not initially set)
    @private
    **/
    //_yScroll,

    /**
    Overflow Node used to contain the data rows in a vertically scrolling table.

    @property _yScrollNode
    @type {Node}
    @default undefined (not initially set)
    @protected
    **/
    //_yScrollNode

    // TODO: Add _xScrollNode
}, true);

Y.Base.mix(Y.DataTable, [Scrollable]);


}, '@VERSION@' ,{skinnable:true, requires:['datatable-base', 'dom-screen']});
