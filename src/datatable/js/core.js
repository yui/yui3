var INVALID    = Y.Attribute.INVALID_VALUE,

    Lang       = Y.Lang,
    isFunction = Lang.isFunction,
    isArray    = Lang.isArray,
    isString   = Lang.isString,

    keys       = Y.Object.keys,

    Table;
    
Table = Y.namespace('DataTable').Core = function () {};

Y.mix(Table, {
    ATTRS: {
        columns: {
            // TODO: change to setter to coerce Columnset?
            validator: isArray,
            getter: '_getColumns'
        },

        recordType: {
            validator: '_validateRecordType',
            writeOnce: true
        },

        data: {
            value : [],
            setter: '_setData',
            getter: '_getData'
        },

        headerView: {
            validator: '_validateView',
            writeOnce: true
        },

        footerView: {
            validator: '_validateView',
            writeOnce: true
        },

        bodyView: {
            validator: '_validateView',
            writeOnce: true
        },

        summary: {
            value: '',
            // For paranoid reasons, the value is escaped on its way in because
            // rendering can be based on string concatenation.
            setter: Y.Escape.html
        },

        /**
        HTML content of an optional `<caption>` element to appear above the table.
        Leave this config unset or set to a falsy value to remove the caption.

        @attribute caption
        @type HTML
        @default '' (empty string)
        **/
        caption: {
            value: ''
        },

        recordset: {
            // TODO: back compat pass through to ML
        },

        columnset: {
            // TODO: back compat pass through to columns
        }
    },

    RE_COLUMN_ATTR: /data-yui3-column-(.*)/
});

Y.mix(Table.prototype, {
    TABLE_TEMPLATE  : '<table></table>',
    CAPTION_TEMPLATE: '<caption></caption>',

    initializer: function (config) {
        this._initColumns();

        this._initRecordType();

        this._initData();

        this.after('columnsChange', this._afterColumnsChange);
    },

    _initColumns: function () {
        var columns = this.get('columns'),
            data, attrHost;
        
        // Default column definition from the configured recordType or the
        // first item in the data.
        if (!columns) {
            attrHost = this.get('recordType');

            if (!attrHost) {
                data = this.get('data');

                if (data) {
                    if (isArray(data) && data.length) {
                        columns = keys(data[0]);
                    } else if (data.size && data.size()) {
                        attrHost = data.item(0).constructor;
                    }
                }
            }

            if (attrHost && attrHost.ATTRS) {
                // TODO: merge superclass attributes up to Model?
                columns = keys(attrHost.ATTRS);
            }
        }

        this._columns = this._parseColumns(columns || []);
    },

    _parseColumns: function (columns) {
        var data = {
                dataColumns: [],
                byKey: {},
                byPosition: []
            },
            row = 0,
            col, i, len;
        
        if (isArray(columns) && columns.length) {
            data.byPosition.push([]);
            for (i = 0, len = columns.length; i < len; ++i) {
                col = columns[i];

                if (isString(col)) {
                    col = { key: col };
                }

                col.headers = [Y.stamp(col)];

                data.byPosition[row].push(col);

                if (isArray(col.children)) {
                    row++;
                    data.byPosition.push([]);
                    // TODO
                    // child.parentIds = (col.parentIds || []).concat(col._yuid);
                } else {
                    data.dataColumns.push(col);

                    if (col.key) {
                        data.byKey[col.key] = col;
                    }
               }
            }
        }

        return data;
    },

    _afterColumnsChange: function (e) {
        this._columns = this.parseColumns(e.newVal);
    },

    renderUI: function () {
        var contentBox = this.get('contentBox'),
            table;

        this._renderTable();

        this._renderHeader();

        this._renderFooter();

        this._renderBody();

        table = this._tableNode;

        if (table) {
            // off DOM or in an existing node attached to a different parentNode
            if (!table.inDoc() || !table.ancestor().compareTo(contentBox)) {
                contentBox.append(table);
            }
        } else { Y.log('Problem rendering DataTable: table not created', 'warn', 'datatable'); // On the same line to allow builder to strip the else clause
        }
    },

    bindUI: function () {
        // TODO: handle widget
        this.after({
            captionChange: this._afterCaptionChange,
            summaryChange: this._afterSummaryChange
        });
    },

    _afterCaptionChange: function (e) {
        this._uiUpdateCaption(e.newVal);
    },

    _afterSummaryChange: function (e) {
        this._uiUpdateSummary(e.newVal);
    },

    _renderTable: function () {
        var caption = this.get('caption');

        if (!this._tableNode) {
            this._tableNode = Y.Node.create(this.TABLE_TEMPLATE);
        }
        this._tableNode.addClass(this.getClassName('table'));

        this._uiUpdateSummary(this.get('summary'));

        this._uiUpdateCaption(caption);
    },

    _uiUpdateCaption: function (htmlContent) {
        var caption = this._tableNode.one('> caption');

        if (htmlContent) {
            if (!this._captionNode) {
                this._captionNode = Y.Node.create(this.CAPTION_TEMPLATE);
            }

            this._captionNode.setContent(htmlContent);

            if (caption) {
                if (!caption.compareTo(this._captionNode)) {
                    caption.replace(this._captionNode);
                }
            } else {
                this._tableNode.prepend(this._captionNode);
            }

            this._captionNode = caption;
        } else {
            if (this._captionNode) {
                if (caption && caption.compareTo(this._captionNode)) {
                    caption = null;
                }

                this._captionNode.remove(true);
                delete this._captionNode;
            }

            if (caption) {
                caption.remove(true);
            }
        }
    },

    _uiUpdateSummary: function (summary) {
        this._tableNode.setAttribute('summary', summary || '');
    },

    _renderHeader: function () {
        var HeaderView = this.get('headerView');
        
        if (HeaderView) {
            this.head = (isFunction(HeaderView)) ? 
                new HeaderView({
                    source: this,
                    table : this._tableNode,
                    data  : this.data
                }) :
                HeaderView; // Assume if it's not a function, it's an instance

            this.head.addTarget(this);
            this.head.render();
        }
        // TODO: If there's no HeaderView, should I remove an existing <thead>?

        this._theadNode = this._tableNode.one('>.' + this.getClassName('head'));
    },

    _renderFooter: function (table, data) {
        var FooterView = this.get('footerView');
        
        if (FooterView) {
            this.foot = (isFunction(FooterView)) ? 
                new FooterView({
                    source: this,
                    table : this._tableNode,
                    data  : this.data
                }) :
                FooterView;

            this.foot.addTarget(this);
            this.foot.render();
        }

        this._tfootNode = this._tableNode.one('>.' + this.getClassName('foot'));
    },

    _renderBody: function (table, data) {
        var BodyView = this.get('bodyView');

        if (BodyView) {
            this.body = (isFunction(BodyView)) ? 
                new BodyView({
                    source: this,
                    table : this._tableNode,
                    data  : this.data
                }) :
                BodyView;

            this.body.addTarget(this);
            this.body.render();
        }

        this._tbodyNode = this._tableNode.one('>.' + this.getClassName('data'));
    },

    getColumn: function (name) {
        return this.get('columns.' + name);
    },

    getColumnData: function () {
        return this._columns;
    },

    _getColumns: function (columns, name) {
        // name will be 'columns' or 'columns.foo'. Trim to the dot.
        // TODO: support name as an index or (row,column) index pair
        name = name.slice(8);

        return (name) ?
            this._columns.byKey(name) :
            columns;
    },

    _initRecordType: function () {
        var data, columns, recordType, handle;
            
        if (!this.get('recordType')) {
            data    = this.get('data');
            columns = (this._columns || {}).byKey;

            // Use the ModelList's specified Model class
            if (data.model) {
                recordType = data.model;

            // Or if not configured, use the construct of the first Model
            } else if (data.size && data.size()) {
                recordType = data.model = data.item(0).constructor;

            // Or if the data is an array, build a class from the first item
            } else if (isArray(data) && data.length) {
                recordType = this._createRecordClass(keys(data[0]));

            // Or if the columns were defined, build a class from the keys
            } else if (keys(columns).length) {
                recordType = this._createRecordClass(keys(columns));
            }

            if (recordType) {
                this.set('recordType', recordType, { silent: true });

                if (!columns) {
                    this._initColumns();
                }
            } else {
                // FIXME: Edge case race condition with
                // new DT({ on/after: { <any of these changes> } }) OR
                // new DT().on( <any of these changes> )
                // where there's not enough info to assign this.data.model
                // at construction. The on/constructor subscriptions will be
                // executed before this subscription.
                handle = this.after(
                    ['columnsChange', 'recordTypeChange','dataChange'],
                    function (e) {
                        // manually batch detach rather than manage separate
                        // subs in case the change was inadequate to populate
                        // recordType. But subs must be detached because the
                        // subscriber recurses to _initRecordType, which would
                        // result in duplicate subs.
                        handle.detach();

                        if (!this.data.model) {
                            // FIXME: resubscribing if there's still not enough
                            // info to populate recordType will place the new
                            // subs later in the callback queue, opening the
                            // race condition even more.
                            this._initRecordType();

                            // If recordType isn't set yet, _initRecordType
                            // will have recreated this subscription.
                            this.data.model = this.get('recordType');
                        }
                    });
            }
        }
    },

    _createRecordClass: function (attrs) {
        var ATTRS = {},
            i, len;

        for (i = 0, len = attrs.length; i < len; ++i) {
            ATTRS[attrs[i]] = {};
        }

        return Y.Base.create('record', Y.Model, [], null, { ATTRS: ATTRS });
    },

    _initData: function () {
        var data = this.get('data'),
            recordType, values;

        if (isArray(data)) {
            recordType = this.get('recordType');

            values = data;
            data = new Y.ModelList();

            // _initRecordType is run before this, so recordType will be set
            // if the data array had any records.  Otherwise, values is an
            // empty array, so no need to call reset();
            if (recordType) {
                data.model = recordType;
                data.reset(values, { silent: true });
            }
        }

        this.data = data;
    },

    _setData: function (val) {
        if (val === null) {
            val = [];
        }

        if (isArray(val)) {
            if (this.data) {
                if (!this.data.model && val.length) {
                    // FIXME: this should happen only once, but this is a side
                    // effect in the setter.  Bad form, but I need the model set
                    // before calling reset()
                    this.set('recordType', this._createRecordClass(keys(val[0])));
                }

                this.data.reset(val);
                // TODO: return true to decrease memory footprint?
            }
            // else pass through the array data, but don't assign this.data
            // Let the _initData process clean up.
        } else if (val && val.getAttrs && val.addTarget) {
            this.data = val;
            // TODO: return true to decrease memory footprint?
        } else {
            val = INVALID;
        }

        return val;
    },

    _getData: function (val) {
        return this.data || val;
    },

    _validateRecordType: function (val) {
        var api = (isFunction(val)) ? val.prototype : {};

        // Duck type based on known/likely consumed APIs
        return api.addTarget && api.get && api.getAttrs && api.set;
    },

    _validateView: function (val) {
        var api = isFunction(val) ? val.prototype : val;

        return (api === null) || (api.render && api.addTarget);
    }
});
