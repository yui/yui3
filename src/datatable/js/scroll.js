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

 @module datatable-scroll
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
    Scrolls a given row or cell into view if the table is scrolling.  Pass the
    `clientId` of a Model from the DataTable's `data` ModelList or its row
    index to scroll to a row or a [row index, column index] array to scroll to
    a cell.  Alternately, to scroll to any element contained within the table's
    scrolling areas, pass its ID, or the Node itself (though you could just as
    well call `node.scrollIntoView()` yourself, but hey, whatever).

    @method scrollTo
    @param {String|Number|Number[]|Node} id A row clientId, row index, cell
            coordinate array, id string, or Node
    @return {DataTable}
    @chainable
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

        return this;
    },

    //----------------------------------------------------------------------------
    // Protected properties and methods
    //----------------------------------------------------------------------------

    /**
    Template for the `<table>` that is used to fix the caption in place when
    the table is horizontally scrolling.

    @property _CAPTION_TABLE_TEMPLATE
    @type {HTML}
    @value '<table class="{className}" role="presentation"></table>'
    @protected
    **/
    _CAPTION_TABLE_TEMPLATE: '<table class="{className}" role="presentation"></table>',

    /**
    Template used to create sizable element liners around header content to
    synchronize fixed header column widths.

    @property _SCROLL_LINER_TEMPLATE
    @type {HTML}
    @value '<div class="{className}"></div>'
    @protected
    **/
    _SCROLL_LINER_TEMPLATE: '<div class="{className}"></div>',

    /**
    Template for the virtual scrollbar needed in "y" and "xy" scrolling setups.

    @property _SCROLLBAR_TEMPLATE
    @type {HTML}
    @value '<div class="{className}"><div></div></div>'
    @protected
    **/
    _SCROLLBAR_TEMPLATE: '<div class="{className}"><div></div></div>',

    /**
    Template for the `<div>` that is used to contain the table when the table is
    horizontally scrolling.

    @property _X_SCROLLER_TEMPLATE
    @type {HTML}
    @value '<div class="{className}"></div>'
    @protected
    **/
    _X_SCROLLER_TEMPLATE: '<div class="{className}"></div>',

    /**
    Template for the `<table>` used to contain the fixed column headers for
    vertically scrolling tables.

    @property _Y_SCROLL_HEADER_TEMPLATE
    @type {HTML}
    @value '<table role="presentation" aria-hidden="true" class="{className}"></table>'
    @protected
    **/
    _Y_SCROLL_HEADER_TEMPLATE: '<table role="presentation" aria-hidden="true" class="{className}"></table>',

    /**
    Template for the `<div>` that is used to contain the rows when the table is
    vertically scrolling.

    @property _Y_SCROLLER_TEMPLATE
    @type {HTML}
    @value '<div class="{className}"></div>'
    @protected
    **/
    _Y_SCROLLER_TEMPLATE: '<div class="{className}"></div>',

    /**
    Adds padding to the last cells in the fixed header for vertically scrolling
    tables.  This padding is equal in width to the scrollbar, so can't be
    relegated to a stylesheet.

    @method _addScrollbarPadding
    @protected
    **/
    _addScrollbarPadding: function () {
        var fixedHeader = this._yScrollHeader,
            headerClass = '.' + this.getClassName('header'),
            scrollbarWidth, rows, header, i, len;

        if (fixedHeader) {
            scrollbarWidth = Y.DOM.getScrollbarWidth() + 'px';
            rows = fixedHeader.all('tr');

            for (i = 0, len = rows.size(); i < len; i += +header.get('rowSpan')) {
                header = rows.item(i).all(headerClass).pop();
                header.setStyle('paddingRight', scrollbarWidth);
            }
        }
    },

    /**
    Creates a vertical scrollbar below the fixed headers for vertical scrolling.

    @method _addVirtualScrollbar
    @protected
    **/
    _addVirtualScrollbar: function () {
        /*
        var scroller       = this._yScrollNode,
            scrollbarWidth = Y.DOM.getScrollbarWidth() + 'px',
            scrollbar      = Y.Node.create(
                Y.Lang.sub(this._SCROLLBAR_TEMPLATE, {
                    className: this.getClassName('virtual', 'scrollbar')
                }));

        this._scrollbarNode = scrollbar;

        scrollbar.setStyles({
            height: scroller.get('clientHeight') + 'px',
            width : scrollbarWidth,
            bottom : scrollbarWidth
        });

        scrollbar.one('div')
            .setStyle('height', scroller.get('scrollHeight') + 'px');

        this._virtualScrollHandle = new Y.EventHandle([
            scrollbar.on('scroll', Y.rbind('_syncVirtualScroll', this)),
            scroller.on('scroll', Y.rbind('_syncVirtualScroll', this))
        ]);

        this.get('contentBox').appendChild(scrollbar);
        */
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
    Reacts to changes in the `caption` attribute by adding, removing, or
    syncing the caption table when the table is set to scroll.

    @method _afterScrollCaptionChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollCaptionChange: function (e) {
        if (e.newVal) {
            if (!e.prevVal) {
                this._createScrollCaptionTable();

                this._captionTable.prepend(this._captionNode);
            }

            this._syncYScrollNodeDims();
            this._syncScrollbarHeight();
        } else if (!e.newVal && e.prevVal) {
            this._removeScrollCaptionTable();
        }
    },

    /**
    Reacts to changes in the `columns` attribute of vertically scrolling tables
    by refreshing the fixed headers, scroll container, and virtual scrollbar
    position.

    @method _afterScrollColumnsChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollColumnsChange: function (e) {
        if (this._yScroll) {
            this._syncScrollUI();
        }
    },

    /**
    Reacts to changes in vertically scrolling table's `data` ModelList by
    synchronizing the fixed column header widths and virtual scrollbar height.

    @method _afterScrollDataChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollDataChange: function (e) {
        this._syncScrollUI();
    },
    /**
    Reacts to changes in the `height` attribute of vertically scrolling tables
    by updating the height of the `<div>` wrapping the data table and the
    virtual scrollbar.  If `scrollable` was set to "y" or "xy" but lacking a
    declared `height` until the received change, `_syncScrollUI` is called to
    create the fixed headers etc.

    @method _afterScrollHeightChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollHeightChange: function (e) {
        if (this._yScroll) {
            if (!e.prevVal) {
                this._syncScrollUI();
            } else {
                this._syncYScrollNodeDims();
                this._syncScrollbarHeight();
            }
        }
    },

    /**
    Reacts to changes in the width of scrolling tables by expanding the width of
    the `<div>` wrapping the data table for horizontally scrolling tables or
    upding the position of the virtual scrollbar for vertically scrolling
    tables.

    @method _afterScrollWidthChange
    @param {EventFacade} e The relevant change event (ignored)
    @protected
    **/
    _afterScrollWidthChange: function (e) {
        if (this._xScroll || this._yScroll) {
            this._syncScrollUI();
        }
    },

    /**
    Binds virtual scrollbar interaction to the `_yScrollNode`'s `scrollTop` and
    vice versa.

    @method _bindScrollbar
    @protected
    **/
    _bindScrollbar: function () {
        var scrollbar = this._scrollbarNode,
            scroller  = this._yScrollNode;

        if (scrollbar && scroller && !this._scrollbarEventHandle) {
            this._scrollbarEventHandle = new Y.Event.Handle([
                scrollbar.on('scroll', this._syncScrollPosition, this, 'virtual'),
                scroller.on('scroll', this._syncScrollPosition, this)
            ]);
        }
    },

    /**
    Binds to the window resize event to update the vertical scrolling table
    headers and wrapper `<div>` dimensions.

    @method _bindScrollResize
    @protected
    **/
    _bindScrollResize: function () {
        var timer, self = this;
        if (!this._scrollResizeHandle) {
            // TODO: sync header widths and scrollbar position.  If the height
            // of the headers has changed, update the scrollbar dims as well.
            this._scrollResizeHandle = Y.on('resize',
                this._syncScrollUI, null, this);
        }
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
        this.after({
            columnsChange: Y.bind('_afterScrollColumnsChange', this),
            heightChange : Y.bind('_afterScrollHeightChange', this),
            widthChange  : Y.bind('_afterScrollWidthChange', this),
            captionChange: Y.bind('_afterScrollCaptionChange', this)
        });

        this.after(['dataChange', '*:add', '*:remove', '*:reset', '*:change'],
            Y.bind('_afterScrollDataChange', this));
    },

    /**
    Calculates the height of the div containing the vertically scrolling rows.
    The height is produced by subtracting the `offsetHeight` of the scrolling
    `<div>` from the `clientHeight` of the `contentBox`.

    @method _calcScrollHeight
    @protected
    **/
    _calcScrollHeight: function () {
        /*
        var scrollNode = this._yScrollNode;

        return this.get('contentBox').get('clientHeight') -
               scrollNode.get('offsetTop') -
               // To account for padding and borders of the scroll div
               scrollNode.get('offsetHeight') +
               scrollNode.get('clientHeight');
        */
    },

    /**
    Creates a virtual scrollbar from the `_SCROLLBAR_TEMPLATE`, assigning it to
    the `_scrollbarNode` property.

    @method _createScrollbar
    @protected
    **/
    _createScrollbar: function () {
        if (!this._scrollbarNode) {
            this._scrollbarNode = Y.Node.create(
                Y.Lang.sub(this._SCROLLBAR_TEMPLATE, {
                    className: this.getClassName('scrollbar')
                }));

            this._scrollbarNode.setStyle('width',
                Y.DOM.getScrollbarWidth() + 'px');
        }
    },

    /**
    Populates the `_xScrollNode` property by creating the `<div>` Node described
    by the `_X_SCROLLER_TEMPLATE`.

    @method _createXScrollNode
    @protected
    **/
    _createXScrollNode: function () {
        if (!this._xScrollNode) {
            this._xScrollNode = Y.Node.create(
                Y.Lang.sub(this._X_SCROLLER_TEMPLATE, {
                    className: this.getClassName('x','scroller')
                }));
        }
    },

    /**
    Populates the `_yScrollHeader` property by creating the `<table>` Node
    described by the `_Y_SCROLL_HEADER_TEMPLATE`.

    @method _createYScrollHeader
    @protected
    **/
    _createYScrollHeader: function () {
        if (!this._yScrollHeader) {
            this._yScrollHeader = Y.Node.create(
                Y.Lang.sub(this._Y_SCROLL_HEADER_TEMPLATE, {
                    className: this.getClassName('scroll','columns')
                }));

            // Needed for IE which creates an empty <tbody> in the table
            this._yScrollHeader.empty();
        }
    },

    /**
    Populates the `_yScrollNode` property by creating the `<div>` Node described
    by the `_Y_SCROLLER_TEMPLATE`.

    @method _createYScrollNode
    @protected
    **/
    _createYScrollNode: function () {
        if (!this._yScrollNode) {
            this._yScrollNode = Y.Node.create(
                Y.Lang.sub(this._Y_SCROLLER_TEMPLATE, {
                    className: this.getClassName('y','scroller')
                }));
        }
    },

    /**
    Cleans up external event subscriptions.

    @method destructor
    @protected
    **/
    destructor: function () {
        this._unbindScrollbar();
        this._unbindScrollResize();
    },

    /**
    Assigns style widths to all columns based on their current `offsetWidth`s.
    This faciliates creating a clone of the `<colgroup>` so column widths are
    the same after the table is split in to header and data tables.

    @method _fixColumnWidths
    @protected
    **/
    _fixColumnWidths: function () {
        /*
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
        */
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
    Merges the caption and content tables back into one table if they are split.

    @method _mergeXScrollContent
    @protected
    **/
    _mergeXScrollContent: function () {
        var scrollNode = this._xScrollNode,
            captionTable;

        this.get('boundingBox').removeClass(this.getClassName('scrollable', 'x'));

        if (scrollNode) {
            if (this._captionNode) {
                captionTable = this._captionNode && this._captionNode.ancestor(
                    '.' + this.getClassName('caption', 'table'));

                this._tableNode.insertBefore(this._captionNode,
                    this._tableNode.get('firstChild'));

                if (captionTable) {
                    captionTable.remove().destroy(true);
                }

            }

            scrollNode.replace(scrollNode.get('childNodes').toFrag());

            this._xScrollNode = null;

            if (this._scrollbarNode) {
                this._virtualScrollHandle.detach();
                this._virtualScrollHandle = null;

                this._scrollbarNode.remove().destroy(true);
                this._scrollbarNode = null;
            }
        }
    },

    /**
    Merges the header and data tables back into one table if they are split.

    @method _mergeYScrollContent
    @protected
    **/
    _mergeYScrollContent: function () {
        /*
        this.get('boundingBox').removeClass(this.getClassName('scrollable', 'y'));

        if (this._yScrollNode) {
            this._tableNode.append(this._tbodyNode);

            this._yScrollNode.remove().destroy(true);
            this._yScrollNode = null;

            this._removeHeaderScrollPadding();
        }

        this._uiSetColumns();
        */
    },

    /**
    Removes the additional padding added to the last cells in each header row to
    allow the scrollbar to fit below.

    @method _removeHeaderScrollPadding
    @protected
    **/
    _removeHeaderScrollPadding: function () {
        /*
        var rows = this._theadNode.all('> tr').getDOMNodes(),
            cell, i, len;

        // The last cell in all rows of the table headers
        for (i = 0, len = rows.length; i < len; i += (cell.rowSpan || 1)) {
            cell = Y.one(rows[i].cells[rows[i].cells.length - 1])
                .setStyle('paddingRight', '');
        }
        */
    },

    /**
    Removes the table used to house the caption when the table is scrolling.

    @method _removeScrollCaptionTable
    @protected
    **/
    _removeScrollCaptionTable: function () {
        if (this._scrollCaptionTable) {
            this._scrollCaptionTable.remove().destroy(true);

            delete this._scrollCaptionTable;
        }
    },

    /**
    Removes the `<div>` wrapper used to contain the data table when the table
    is vertically scrolling.

    @method _removeYScrollNode
    @protected
    **/
    _removeYScrollNode: function () {
        if (this._yScrollNode) {
            this._yScrollNode.remove().destroy(true);

            delete this._yScrollNode;
        }
    },

    /**
    Removes the `<table>` used to contain the fixed column headers when the
    table is vertically scrolling.

    @method _removeYScrollHeader
    @protected
    **/
    _removeYScrollHeader: function () {
        if (this._yScrollHeader) {
            this._yScrollHeader.remove().destroy(true);

            delete this._yScrollHeader;
        }
    },

    /**
    Removes the virtual scrollbar used by scrolling tables.

    @method _removeScrollbar
    @protected
    **/
    _removeScrollbar: function () {
        if (this._scrollbarNode) {
            this._scrollBarNode.remove().destroy(true);

            delete this._scrollBarNode;
        }
    },

    /**
    Adds additional padding to the current amount of right padding on each row's
    last cell to account for the width of the scrollbar below.

    @method _setHeaderScrollPadding
    @protected
    **/
    _setHeaderScrollPadding: function () {
        /*
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
        */
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
        /*
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
        */
    },

    /**
    Splits the data table from its caption if it has one and wraps the table in
    a horizontally scrollable container `<div>`.

    @method _splitXScrollContent
    @protected
    **/
    _splitXScrollContent: function () {
        var captionTable;

        this._createXScrollNode();

        this._tableNode.wrap(this._xScrollNode);

        if (this._yScrollNode) {
            this._xScrollNode.append(this._yScrollNode);
        }

        if (this._captionNode) {
            captionTable = Y.Node.create(
                Y.Lang.sub(this._CAPTION_TABLE_TEMPLATE, {
                    className: this.getClassName('caption', 'table')
                }));

            captionTable.setStyle('width', this.get('width'));
            captionTable.insertBefore(this._captionNode,
                captionTable.get('firstChild'));

            this.get('contentBox').insertBefore(captionTable, this._xScrollNode);
        }
    },

    /**
    Splits the unified table with headers and data into two tables, the latter
    contained within a vertically scrollable container `<div>`.

    @method _splitYScrollContent
    @protected
    **/
    _splitYScrollContent: function () {
        /*
        var table = this._tableNode,
            scrollNode = this._yScrollTable,
            scrollTable, width;
            
        this.get('boundingBox').addClass(this.getClassName('scrollable','y'));

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

            scrollTable.setStyle('width', scrollNode.get('clientWidth') + 'px');
        }

        this._setYScrollColWidths();
        */
    },

    /**
    Updates the virtual scrollbar's height to avoid overlapping with the fixed
    headers.

    @method _syncScrollbarHeight
    @protected
    **/
    _syncScrollbarHeight: function () {
        var scrollbar   = this._scrollbarNode,
            scroller    = this._yScrollNode,
            fixedHeader = this._yScrollHeader;

        if (scrollbar && scroller && fixedHeader) {
            scrollbar.get('firstChild').setStyle('height',
                this._tbodyNode.get('scrollHeight') + 'px');

            scrollbar.setStyle('height', 
                (scroller.get('clientHeight') -
                 fixedHeader.get('offsetHeight')) + 'px');
        }
    },

    /**
    Updates the virtual scrollbar's placement to avoid overlapping the fixed
    headers or the data table.

    @method _syncScrollbarPosition
    @protected
    **/
    _syncScrollbarPosition: function () {
        var scrollbar   = this._scrollbarNode,
            scroller    = this._xScrollNode || this._yScrollNode,
            fixedHeader = this._yScrollHeader,
            scrollbarWidth = Y.DOM.getScrollbarWidth(),
            top;

        if (scrollbar && scroller) {
            if (fixedHeader) {
                top = (fixedHeader.get('offsetHeight') +
                       fixedHeader.get('offsetTop')) + 'px';
            } else {
                top =
                    (scroller.get('offsetTop') +
                    parseInt(scroller.getComputedStyle('borderTopWidth'), 10)) +
                    'px';
            }

            scrollbar.setStyles({
                top : top,
                left: (scroller.get('offsetWidth') - scrollbarWidth -
                      parseInt(scroller.getComputedStyle('borderRightWidth'), 10)) + 'px'
            });
        }
    },

    /**
    Keeps the virtual scrollbar and the scrolling `<div>` wrapper around the
    data table in vertically scrolling tables in sync.

    @method _syncScrollPosition
    @param {DOMEventFacade} e The scroll event
    @param {String} [source] The string "virtual" if the event originated from
                        the virtual scrollbar
    @protected
    **/
    _syncScrollPosition: function (e, source) {
        var scrollbar = this._scrollbarNode,
            scroller  = this._yScrollNode;

        if (scrollbar && scroller) {
            if (this._scrollLock && this._scrollLock.source === source) {
                this._scrollLock.cancel();

                delete this._scrollLock;
            }

            if (!this._scrollLock) {
                this._scrollLock = Y.later(300, this, function () {
                    delete this._scrollLock;
                });

                this._scrollLock.source = source;
            }

            if (this._scrollLock.source === source) {
                if (source === 'virtual') {
                    scroller.set('scrollTop', scrollbar.get('scrollTop'));
                } else {
                    scrollbar.set('scrollTop', scroller.get('scrollTop'));
                }
            }
        }
    },

    /**
    Splits or merges the table for X and Y scrolling depending on the current
    widget state.  If the table needs to be split, but is already, does nothing.

    @method _syncScrollUI
    @protected
    **/
    _syncScrollUI: function () {
        /*
        this._uiSetDim('width', '');
        this._tableNode.setStyle('width', '');
        */

        this._uiSetScrollable();

        if (this._yScroll) {
            if (!this._yScrollNode) {
                this._createYScrollNode();

                // Wrap the table in the Y scroller
                this._tableNode
                    .replace(this._yScrollNode)
                    .appendTo(this._yScrollNode);

                if (this._captionNode) {
                    this._createScrollCaptionTable();

                    this._captionTable.prepend(this._captionNode);
                }

            }

            this._syncYScrollNodeDims();

            // Allow headerless scrolling
            if (this._theadNode && !this._yScrollHeader) {
                this._createYScrollHeader();

                this._yScrollNode.insert(this._yScrollHeader, 'before');
            }

            if (this._yScrollHeader) {
                this._syncScrollHeaders();

                if (!this._scrollbarNode) {
                    this._createScrollbar();

                    this._bindScrollbar();

                    this._yScrollNode.insert(this._scrollbarNode, 'before');
                }

                if (this._scrollbarNode) {
                    this._syncScrollbarHeight();
                    this._syncScrollbarPosition();
                }
            } else {
                this._removeScrollbar();
            }
        } else {
            if (this._captionNode && !this._xScroll) {
                this._tableNode.prepend(this._captionNode);
                this._removeScrollCaptionTable();
            }
            this._removeYScrollNode();
            this._removeYScrollHeader();
            this._removeScrollbar();
        }

        /*
        if (this._xScroll) {
            // Only split the table if the content is wider than the config width
            if (table.get('scrollWidth') > parseInt(this.get('width'), 10)) {
                this._splitXScrollContent();

                if (this._yScrollNode) {
                    this._yScrollNode.setStyle('height',
                        (this._yScrollNode.get('offsetHeight') -
                         Y.DOM.getScrollbarWidth()) + 'px');

                    // Only add virtual scrollbar if the OS+browser renders
                    // scrollbars.
                    if (Y.DOM.getScrollbarWidth()) {
                        this._addVirtualScrollbar();
                    }
                }
            } else {
                this._mergeXScrollContent();
            }
        } else {
            this._mergeXScrollContent();
        }

        this._uiSetDim('width', this.get('width'));
        */
    },

    /**
    Keeps the `_yScrollNode` scroll position in sync with the `_scrollbarNode`
    in an "xy" scroll configuration.

    @method _syncVirtualScroll
    @param {DOMEventFacade} e The scroll event
    @param {Object} details subscription details, including which of the two
        scrolling elements is being scrolled
    @protected
    **/
    _syncVirtualScroll: function (e) {
        /*
        var move = (e.currentTarget === this._scrollbarNode) ?
                    this._yScrollNode : this._scrollbarNode;

        move.set('scrollTop', e.currentTarget.get('scrollTop'));
        */
    },

    /**
    Assigns widths to the fixed header columns to match the columns in the data
    table.

    @method _syncScrollColumnWidths
    @protected
    **/
    _syncScrollColumnWidths: function () {
        var headers;

        if (this._theadNode && this._yScrollHeader) {
            headers = this._theadNode.all('.' + this.getClassName('header'));

            this._yScrollHeader.all('.' + this.getClassName('scroll', 'liner'))
                .each(function (liner, i) {
                    var header = headers.item(i);

                    // Can't use getComputedStyle('width') because IE 7- return
                    // the <col>'s width even though it's not honoring it.
                    liner.setStyle('width',
                        (header.get('clientWidth') -
                         (parseInt(header.getComputedStyle('paddingLeft'), 10)|0) -
                         (parseInt(header.getComputedStyle('paddingRight'), 10)|0)) +
                         'px');
                });
        }
    },

    /**
    Creates matching headers in the fixed header table for vertically scrolling
    tables and synchronizes the column widths.

    @method _syncScrollHeaders
    @protected
    **/
    _syncScrollHeaders: function () {
        var fixedHeader   = this._yScrollHeader,
            linerTemplate = this._SCROLL_LINER_TEMPLATE,
            linerClass    = this.getClassName('scroll', 'liner');

        if (this._theadNode && fixedHeader) {
            fixedHeader.empty().appendChild(
                this._theadNode.cloneNode(true));

            // Prevent duplicate IDs and assign ARIA attributes to hide
            // from screen readers
            fixedHeader.all('*')
                .removeAttribute('id')
                .setAttribute('role', 'presentation')
                .setAttribute('aria-hidden', true);

            fixedHeader.all('.' + this.getClassName('header'))
                .each(function (header) {
                    var liner = Y.Node.create(Y.Lang.sub(linerTemplate, {
                            className: linerClass
                        }));

                    liner.appendChild(header.get('childNodes').toFrag());

                    header.appendChild(liner);
                }, this);

            this._syncScrollColumnWidths();

            this._addScrollbarPadding();
        }
    },

    /**
    Assigns the dimensions of the `<div>` wrapping the data table in vertically
    scrolling tables.

    @method _syncYScrollNodeDims
    @protected
    **/
    _syncYScrollNodeDims: function () {
        var scroller = this._yScrollNode,
            table    = this._tableNode,
            width, tableWidth, scrollerWidth, scrollbarWidth;

        if (scroller && table) {
            width = this.get('width');
            scrollbarWidth = Y.DOM.getScrollbarWidth();

            if (width) {
                if (width.slice(-1) === '%') {
                    this._bindScrollResize();
                } else {
                    this._unbindScrollResize();
                }

                // The table's rendered width might be greater than the
                // configured width
                scroller.setStyle('width', width);
                scrollerWidth = scroller.get('clientWidth');

                table.setStyle('width', scrollerWidth +'px');

                tableWidth = table.get('clientWidth');

                // Expand the scroll node width if the table can't fit
                if (tableWidth > scrollerWidth) {
                    scroller.setStyle('width',
                        (tableWidth + scrollbarWidth) + 'px');
                }
            } else {
                // Allow the table to expand naturally
                table.setStyle('width', '');
                scroller.setStyle('width', '');

                scroller.setStyle('width',
                    (table.get('clientWidth') + scrollbarWidth) + 'px');
            }

            scroller.setStyle('height',
                    (this.get('boundingBox').get('clientHeight') -
                         scroller.get('offsetTop') -
                         (parseInt(scroller.getComputedStyle('borderTopWidth'), 10)|0) -
                         (parseInt(scroller.getComputedStyle('borderBottomWidth'), 10)|0) + 'px'));
        }
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
        /*
        var scrollable = this._xScrollNode || this._yScrollNode;

        if (isNumber(width)) {
            width += this.DEF_UNIT;
        }

        if (scrollable) {
            this._mergeXScrollContent();
            this._mergeYScrollContent();
            this._syncScrollUI();
        } else {
            this._uiSetDim('width', width);
            this._tableNode.setStyle('width', width);
        }
        */
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
    },

    /**
    Detaches the scroll event subscriptions used to maintain scroll position
    parity between the scrollable `<div>` wrapper around the data table and the
    virtual scrollbar for vertically scrolling tables.

    @method _unbindScrollbar
    @protected
    **/
    _unbindScrollbar: function () {
        if (this._scrollbarEventHandle) {
            this._scrollbarEventHandle.detach();
        }
    },

    /**
    Detaches the resize event subscription used to maintain column parity for
    vertically scrolling tables with percentage widths.

    @method _unbindScrollResize
    @protected
    **/
    _unbindScrollResize: function () {
        if (this._scrollResizeHandle) {
            this._scrollResizeHandle.detach();
            delete this._scrollResizeHandle;
        }
    }

    /**
    Indicates horizontal table scrolling is enabled.

    @property _xScroll
    @type {Boolean}
    @default undefined (not initially set)
    @private
    **/
    //_xScroll: null,

    /**
    Indicates vertical table scrolling is enabled.

    @property _yScroll
    @type {Boolean}
    @default undefined (not initially set)
    @private
    **/
    //_yScroll: null,

    /**
    Fixed column header `<table>` Node for vertical scrolling tables.

    @property _yScrollHeader
    @type {Node}
    @default undefined (not initially set)
    @protected
    **/
    //_yScrollHeader: null,

    /**
    Overflow Node used to contain the data rows in a vertically scrolling table.

    @property _yScrollNode
    @type {Node}
    @default undefined (not initially set)
    @protected
    **/
    //_yScrollNode: null,

    /**
    Overflow Node used to contain the table headers and data in a horizontally
    scrolling table.

    @property _xScrollNode
    @type {Node}
    @default undefined (not initially set)
    @protected
    **/
    //_xScrollNode: null
}, true);

Y.Base.mix(Y.DataTable, [Scrollable]);
