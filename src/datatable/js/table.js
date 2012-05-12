/**
View class responsible for rendering a `<table>` from provided data.  Used as
the default `view` for `Y.DataTable.Base` and `Y.DataTable` classes.

@module datatable
@submodule datatable-table
@since 3.6.0
**/
var toArray = Y.Array,
    getClassName = Y.ClassNameManager.getClassName,
    fromTemplate = Y.Lang.sub;

/**
View class responsible for rendering a `<table>` from provided data.  Used as
the default `view` for `Y.DataTable.Base` and `Y.DataTable` classes.



@class TableView
@namespace DataTable
@extends View
@since 3.6.0
**/
Y.namespace('DataTable').TableView = Y.Base.create('table', Y.View, [], {

    /**
    The HTML template used to create the caption Node if the `caption`
    attribute is set.

    @property CAPTION_TEMPLATE
    @type {HTML}
    @default '<caption class="{className}"/>'
    @since 3.6.0
    **/
    CAPTION_TEMPLATE: '<caption class="{className}"/>',

    /**
    The HTML template used to create the table Node.

    @property TABLE_TEMPLATE
    @type {HTML}
    @default '<table cellspacing="0" class="{className}"/>'
    @since 3.6.0
    **/
    TABLE_TEMPLATE  : '<table cellspacing="0" class="{className}"/>',

    /**
    HTML template used to create table's `<tbody>` if configured with a
    `bodyView`.

    @property TBODY_TEMPLATE
    @type {HTML}
    @default '<tbody class="{className}"/>'
    @since 3.6.0
    **/
    TBODY_TEMPLATE: '<tbody class="{className}"/>',

    /**
    Template used to create the table's `<tfoot>` if configured with a
    `footerView`.

    @property TFOOT_TEMPLATE
    @type {HTML}
    @default '<tfoot class="{className}"/>'
    @since 3.5.0
    **/
    TFOOT_TEMPLATE: '<tfoot class="{className}"/>',

    /**
    Template used to create the table's `<thead>` if configured with a
    `headerView`.

    @property THEAD_TEMPLATE
    @type {HTML}
    @default '<thead class="{className}"/>'
    @since 3.5.0
    **/
    THEAD_TEMPLATE: '<thead class="{className}"/>',

    /**
    The object or instance of the class assigned to `bodyView` that is
    responsible for rendering and managing the table's `<tbody>`(s) and its
    content.

    @property body
    @type {Object}
    @default undefined (initially unset)
    @since 3.5.0
    **/
    //body: null,

    /**
    The object or instance of the class assigned to `footerView` that is
    responsible for rendering and managing the table's `<tfoot>` and its
    content.

    @property foot
    @type {Object}
    @default undefined (initially unset)
    @since 3.5.0
    **/
    //foot: null,

    /**
    The object or instance of the class assigned to `headerView` that is
    responsible for rendering and managing the table's `<thead>` and its
    content.

    @property head
    @type {Object}
    @default undefined (initially unset)
    @since 3.5.0
    **/
    //head: null,

    //-----------------------------------------------------------------------//
    // Public methods
    //-----------------------------------------------------------------------//

    /**
    Returns the `<td>` Node from the given row and column index.  Alternately,
    the `seed` can be a Node.  If so, the nearest ancestor cell is returned.
    If the `seed` is a cell, it is returned.  If there is no cell at the given
    coordinates, `null` is returned.

    Optionally, include an offset array or string to return a cell near the
    cell identified by the `seed`.  The offset can be an array containing the
    number of rows to shift followed by the number of columns to shift, or one
    of "above", "below", "next", or "previous".

    <pre><code>// Previous cell in the previous row
    var cell = table.getCell(e.target, [-1, -1]);

    // Next cell
    var cell = table.getCell(e.target, 'next');
    var cell = table.getCell(e.taregt, [0, 1];</pre></code>

    This is actually just a pass through to the `bodyView` instance's method
    by the same name.

    @method getCell
    @param {Number[]|Node} seed Array of row and column indexes, or a Node that
        is either the cell itself or a descendant of one.
    @param {Number[]|String} [shift] Offset by which to identify the returned
        cell Node
    @return {Node}
    @since 3.5.0
    **/
    getCell: function (seed, shift) {
        return this.body && this.body.getCell &&
            this.body.getCell.apply(this.body, arguments);
    },

    /**
    Returns the generated CSS classname based on the input.  If the `host`
    attribute is configured, it will attempt to relay to its `getClassName`
    or use its static `NAME` property as a string base.
    
    If `host` is absent or has neither method nor `NAME`, a CSS classname
    will be generated using this class's `NAME`.

    @method getClassName
    @param {String} token* Any number of token strings to assemble the
        classname from.
    @return {String}
    @protected
    **/
    getClassName: function () {
        var host = this.host,
            NAME = (host && host.constructor.NAME) ||
                    this.constructor.NAME;

        if (host && host.getClassName) {
            return host.getClassName.apply(host, arguments);
        } else {
            return getClassName([NAME].concat(toArray(arguments, 0, true)));
        }
    },

    /**
    Returns the `<tr>` Node from the given row index, Model, or Model's
    `clientId`.  If the rows haven't been rendered yet, or if the row can't be
    found by the input, `null` is returned.

    This is actually just a pass through to the `bodyView` instance's method
    by the same name.

    @method getRow
    @param {Number|String|Model} id Row index, Model instance, or clientId
    @return {Node}
    @since 3.5.0
    **/
    getRow: function (id) {
        return this.body && this.body.getRow &&
            this.body.getRow.apply(this.body, arguments);
    },


    //-----------------------------------------------------------------------//
    // Protected and private methods
    //-----------------------------------------------------------------------//

    /**
    Creates the `<table>`.

    @method _createTable
    @return {Node} The `<table>` node
    @protected
    @since 3.5.0
    **/
    _createTable: function () {
        return Y.Node.create(fromTemplate(this.TABLE_TEMPLATE, {
            className: this.getClassName('table')
        })).empty();
    },

    /**
    Creates a `<tbody>` node from the `TBODY_TEMPLATE`.

    @method _createTBody
    @protected
    @since 3.5.0
    **/
    _createTBody: function () {
        return Y.Node.create(fromTemplate(this.TBODY_TEMPLATE, {
            className: this.getClassName('data')
        }));
    },

    /**
    Creates a `<tfoot>` node from the `TFOOT_TEMPLATE`.

    @method _createTFoot
    @protected
    @since 3.5.0
    **/
    _createTFoot: function () {
        return Y.Node.create(fromTemplate(this.TFOOT_TEMPLATE, {
            className: this.getClassName('footer')
        }));
    },

    /**
    Creates a `<thead>` node from the `THEAD_TEMPLATE`.

    @method _createTHead
    @protected
    @since 3.5.0
    **/
    _createTHead: function () {
        return Y.Node.create(fromTemplate(this.THEAD_TEMPLATE, {
            className: this.getClassName('columns')
        }));
    },

    /**
    Calls `render()` on the `bodyView` class instance.

    @method _defRenderBodyFn
    @param {EventFacade} e The renderBody event
    @protected
    @since 3.5.0
    **/
    _defRenderBodyFn: function (e) {
        e.view.render();
    },

    /**
    Calls `render()` on the `footerView` class instance.

    @method _defRenderFooterFn
    @param {EventFacade} e The renderFooter event
    @protected
    @since 3.5.0
    **/
    _defRenderFooterFn: function (e) {
        e.view.render();
    },

    /**
    Calls `render()` on the `headerView` class instance.

    @method _defRenderHeaderFn
    @param {EventFacade} e The renderHeader event
    @protected
    @since 3.5.0
    **/
    _defRenderHeaderFn: function (e) {
        e.view.render();
    },

    /**
    Renders the `<table>` and, if there are associated Views, the `<thead>`,
    `<tfoot>`, and `<tbody>` (empty until `syncUI`).

    Assigns the generated table nodes to the `_tableNode`, `_theadNode`,
    `_tfootNode`, and `_tbodyNode` properties.  Assigns the instantiated Views
    to the `head`, `foot`, and `body` properties.


    @method _defRenderTableFn
    @param {EventFacade} e The renderTable event
    @protected
    @since 3.5.0
    **/
    _defRenderTableFn: function (e) {
        var attrs = this.getAttrs(),
            config;

        if (!this._tableNode) {
            this._tableNode = this._createTable();
        }

        attrs.table = this;
        attrs.container = this._tableNode;

        this._uiSetCaption(this.get('caption'));
        this._uiSetSummary(this.get('summary'));

        if (this.head || e.headerView) {
            if (!this.head) {
                this.head = new e.headerView(Y.merge(attrs, e.headerConfig));
            }

            this.fire('renderHeader', { view: this.head });
        }

        if (this.foot || e.footerView) {
            if (!this.foot) {
                this.foot = new e.footerView(Y.merge(attrs, e.footerConfig));
            }

            this.fire('renderFooter', { view: this.foot });
        }

        if (this.body || e.bodyView) {
            if (!this.body) {
                this.body = new e.bodyView(Y.merge(attrs, e.bodyConfig));
            }

            this.fire('renderBody', { view: this.body });
        }

        this.get('container').append(this._tableNode);
    },

    _initColumns: function () {
        var columns = this.get('columns'),
            i, len, column;

    },

    /**
    Publishes core events.

    @method _initEvents
    @protected
    @since 3.5.0
    **/
    _initEvents: function () {
        this.publish({
            // Y.bind used to allow late binding for method override support
            renderTable : { defaultFn: Y.bind('_defRenderTableFn', this) },
            renderHeader: { defaultFn: Y.bind('_defRenderHeaderFn', this) },
            renderBody  : { defaultFn: Y.bind('_defRenderBodyFn', this) },
            renderFooter: { defaultFn: Y.bind('_defRenderFooterFn', this) }
        });
    },

    /**
    Constructor logic.

    @method intializer
    @param {Object} config Configuration object passed to the constructor
    @protected
    @since 3.6.0
    **/
    initializer: function () {
        this.host = this.get('host');

        this._initEvents();

        this._initColumns();
    },

    render: function () {
        if (this.get('container')) {
            this.fire('renderTable', {
                headerView  : this.get('headerView'),
                headerConfig: this.get('headerConfig'),

                bodyView    : this.get('bodyView'),
                bodyConfig  : this.get('bodyConfig'),

                footerView  : this.get('footerView'),
                footerConfig: this.get('footerConfig'),

                rowView     : this.get('rowView'),
                rowConfig   : this.get('rowConfig')
            });
        }
    },

    /**
    Creates, removes, or updates the table's `<caption>` element per the input
    value.  Empty values result in the caption being removed.

    @method _uiSetCaption
    @param {HTML} htmlContent The content to populate the table caption
    @protected
    @since 3.5.0
    **/
    _uiSetCaption: function (htmlContent) {
        var table   = this._tableNode,
            caption = this._captionNode;

        if (htmlContent) {
            if (!caption) {
                this._captionNode = caption = Y.Node.create(
                    fromTemplate(this.CAPTION_TEMPLATE, {
                        className: this.getClassName('caption')
                    }));

                table.prepend(this._captionNode);
            }

            caption.setHTML(htmlContent);

        } else if (caption) {
            caption.remove(true);

            delete this._captionNode;
        }
    },

    /**
    Updates the table's `summary` attribute with the input value.

    @method _uiSetSummary
    @protected
    @since 3.5.0
    **/
    _uiSetSummary: function (summary) {
        if (summary) {
            this._tableNode.setAttribute('summary', summary);
        } else {
            this._tableNode.removeAttribute('summary');
        }
    },

    /**
    Sets the `boundingBox` and table width per the input value.

    @method _uiSetWidth
    @param {Number|String} width The width to make the table
    @protected
    @since 3.5.0
    **/
    _uiSetWidth: function (width) {
        var table = this._tableNode;

        if (isNumber(width)) {
            // DEF_UNIT from Widget
            width += this.DEF_UNIT;
        }

        if (isString(width)) {
            this._uiSetDim('width', width);

            // Table width needs to account for borders
            table.setStyle('width', !width ? '' :
                (this.get('boundingBox').get('offsetWidth') -
                 (parseInt(table.getComputedStyle('borderLeftWidth'), 10)|0) -
                 (parseInt(table.getComputedStyle('borderLeftWidth'), 10)|0)) +
                 'px');

            table.setStyle('width', width);
        }
    },
}, {
    ATTRS: {
        summary: {
        },

        caption: {
        },

        columns: {
        },

        headerView: {
        },

        headerConfig: {
        },

        footerView: {
        },

        footerConfig: {
        },

        bodyView: {
        },

        bodyConfig: {
        },

        rowView: {
        },

        rowConfig: {
        }
    }
});


