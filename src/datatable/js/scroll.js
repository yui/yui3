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
 @for DataTable
 @class DataTable.Scrollable
**/
var YLang = Y.Lang,
    isString = YLang.isString,
    isNumber = YLang.isNumber,

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
    SCROLLING_CONTAINER_TEMPLATE: '<div class="{classes}"><table></table></div>',

    scrollTo: function (id) {
        //TODO
    },

    //----------------------------------------------------------------------------
    // Protected properties and methods
    //----------------------------------------------------------------------------

    _afterContentChange: function (e) {
        this._mergeYScrollContent();
        this._syncScrollUI();
    },

    _afterScrollableChange: function (e) {
        this._uiSetScrollable();
        this._syncScrollUI();
    },

    _afterScrollHeightChange: function (e) {
        this._yScroll && this._syncScrollUI();
    },

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

    _calcScrollHeight: function () {
        var scrollNode = this._yScrollNode;

        return this.get('contentBox').get('clientHeight') -
               scrollNode.get('offsetTop') -
               // To account for padding and borders of the scroll div
               scrollNode.get('offsetHeight') +
               scrollNode.get('clientHeight');
    },

    _createYScrollNode: function () {
        if (!this._yScrollNode) {
            this._yScrollNode = Y.Node.create(
                Y.Lang.sub(this.SCROLLING_CONTAINER_TEMPLATE, {
                    classes: this.getClassName('data','container')
                }));
        }
    },

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

    initializer: function () {
        this._setScrollProperties();

        this.on('renderBody', this._onRenderBody);

        this.after(['scrollableChange', 'heightChange', 'widthChange'],
            this._setScrollProperties);

        Y.Do.after(this._bindScrollUI, this, 'bindUI');
        Y.Do.after(this._syncScrollUI, this, 'syncUI');
    },

    _onRenderBody: function () {
        // Done here and not in syncUI to prevent content jumping.
        // _uiSetScrollable should apply the scrollable-y class to the contentBox
        // if the table is configured to scroll vertically.
        this._uiSetScrollable(this.get('scrollable'));
    },

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

    _removeHeaderScrollPadding: function () {
        var rows = this._theadNode.all('> tr').getDOMNodes(),
            cell, i, len;

        // The last cell in all rows of the table headers
        for (i = 0, len = rows.length; i < len; i += (cell.rowSpan || 1)) {
            cell = Y.one(rows[i].cells[rows[i].cells.length - 1])
                .setStyle('paddingRight', '');
        }
    },

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

    _setScrollProperties: function () {
        var scrollable = this.get('scrollable') || '',
            width      = this.get('width'),
            height     = this.get('height');

        this._xScroll = width  && scrollable.indexOf('x') > -1;
        this._yScroll = height && scrollable.indexOf('y') > -1;
    },

    _setYScrollColWidths: function () {
        var scrollNode = this._yScrollNode,
            table      = scrollNode && scrollNode.one('> table'),
            // hack to account for right border
            colgroup, lastCol;

        if (table) {
            scrollNode.all('colgroup,col').remove();
            colgroup = this._colgroupNode.cloneNode(true);

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

    _syncScrollUI: function () {
        var scrollable  = this._xScroll || this._yScroll,
            cBox        = this.get('contentBox'),
            node        = this._yScrollNode || cBox,
            table       = node.one('table'),
            overflowing = this._yScroll &&
                           (table.get('scrollHeight') > node.get('clientHeight'));

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

    _uiSetScrollable: function (scrollable) {
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
}, true);

Y.Base.mix(Y.DataTable, [Scrollable]);
