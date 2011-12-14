var Lang         = Y.Lang,
    isObject     = Lang.isObject,
    isArray      = Lang.isArray,
    htmlEscape   = Y.Escape.html,
    fromTemplate = Y.Lang.sub,
    arrayIndexOf = Y.Array.indexOf,
    toArray      = Y.Array,

    ClassNameManager = Y.ClassNameManager,
    _getClassName    = ClassNameManager.getClassName;

Y.namespace('DataTable').BodyView = Y.Base.create('tableBody', Y.View, [], {
    // -- Instance properties -------------------------------------------------
    TBODY_TEMPLATE:
        '<tbody class="{classes}">{content}</tbody>',

    ROW_TEMPLATE :
        '<tr id="{clientId}" class="{rowClasses}">' +
            '{content}' +
        '</tr>',

    CELL_TEMPLATE:
        '<td headers="{headers}" class="{classes}">' +
            '<div class="{linerClass}">' +
                '{content}' +
            '</div>' +
        '</td>',

    // -- Public methods ------------------------------------------------------
    bindUI: function () {
        this._eventHandles.push(
            this.host.after('columnChange', this._afterColumnChange),
            this.get('modelList').after(
                ['*:change', '*:destroy'],
                this._afterDataChange, this));
    },

    destructor: function () {
        (new Y.EventHandle(this._eventHandles)).detach();
    },

    getCell: function (row, col) {
        var el = null;

        if (this._tbodyNode) {
            el = this._tbodyNode.getDOMNode().rows[+row];
            el && (el = el.cells[+col]);
        }
        
        return Y.one(el);
    },

    getClassName: function () {
        var args = toArray(arguments);
        args.unshift(this._cssPrefix);
        args.push(true);

        return _getClassName.apply(ClassNameManager, args);
    },

    getRow: function (index) {
        var el;

        if (this._tbodyNode) {
            el = this._tbodyNode.getDOMNode().rows[+index];
        }

        return Y.one(el);
    },

    initializer: function (config) {
        var cssPrefix = config.cssPrefix || (config.host || {}).cssPrefix;

        this.host    = config.source;
        this.columns = this._parseColumns(config.columns);
        this._tbodyNode = config.tbodyNode;

        this._eventHandles = [];

        if (cssPrefix) {
            this._cssPrefix = cssPrefix;
        }
    },

    render: function () {
        var table    = this.get('container'),
            data     = this.get('modelList'),
            columns  = this.columns,
            tbody    = this._tbodyNode,
            existing, replace;

        table =  Y.one(table);

        if (table && table.get('tagName') !== 'TABLE') {
            table = table.one('table');
        }

        if (!table) {
            Y.log('Could not render tbody. Container is not a table', 'warn');
            return this;
        }

        existing = table.one('> .' + this.getClassName('data'));
        replace  = existing && (!tbody || !tbody.compareTo(existing));

        // Needed for mutation
        this._createRowTemplate(columns);

        if ((!tbody || replace) && data) {
            tbody = Y.Node.create(this._createDataHTML(columns));

            this._applyNodeFormatters(tbody, columns);
        }

        if (existing) {
            if (replace) {
                existing.replace(tbody);
            }
        } else {
            table.append(tbody);
        }

        this.bindUI();

        return this;
    },

    // -- Protected and private methods ---------------------------------------
    _afterColumnsChange: function (e) {
        this._parseColumns(e.newVal);

        this.render();
    },
    
    _afterDataChange: function (e) {
        // TODO
    },

    _applyNodeFormatters: function (tbody, columns) {
        var host = this.host,
            data = this.get('modelList'),
            formatters = [],
            tbodyNode  = tbody.getDOMNode(),
            linerQuery = '.' + this.getClassName('liner'),
            i, len;

        // Only iterate the ModelList again if there are nodeFormatters
        for (i = 0, len = columns.length; i < len; ++i) {
            if (columns[i].nodeFormatter) {
                formatters.push(i);
            }
        }

        if (data && formatters.length) {
            data.each(function (record, index) {
                var formatterData = {
                        record    : record,
                        rowindex  : index
                    },
                    row = tbodyNode.rows[index],
                    i, len, col, key, cell, keep;


                if (row) {
                    for (i = 0, len = formatters.length; i < len; ++i) {
                        cell = Y.one(row.cells[formatters[i]]);

                        if (cell) {
                            col = formatterData.column = columns[formatters[i]];
                            key = col.key || col._yuid;

                            formatterData.value = record.get(key);
                            formatterData.td    = cell;
                            formatterData.cell  = cell.one(linerQuery) || cell;

                            keep = col.nodeFormatter.call(host, formatterData);

                            if (keep === false) {
                                // Remove from the Node cache to reduce
                                // memory footprint.  This also purges events,
                                // which you shouldn't be scoping to a cell
                                // anyway.  You've been warned.  Incidentally,
                                // you should always return false. Just sayin.
                                cell.destroy(true);
                            }
                        }
                    }
                }
            });
        }
    },

    _cssPrefix: 'table',

    _createDataHTML: function (columns) {
        var host = this.host,
            data = this.get('modelList'),
            odd  = this.getClassName('odd'),
            even = this.getClassName('even'),
            rowTemplate = this._rowTemplate,
            html = '';

        if (data) {
            data.each(function (record, index) {
                var data = record.getAttrs(),
                    i, len, col, key, value, formatterData, attr;

                for (i = 0, len = columns.length; i < len; ++i) {
                    col = columns[i];
                    key = col.key || col._yuid;
                    value = data[key];

                    data[key + '-classes']    = '';

                    if (col.formatter) {
                        formatterData = {
                            value     : value,
                            data      : data,
                            column    : col,
                            record    : record,
                            classnames: '',
                            rowindex  : index
                        };

                        if (typeof col.formatter === 'string') {
                            value = fromTemplate(col.formatter, formatterData);
                        } else {
                            // Formatters can either return a value
                            value = col.formatter.call(host, formatterData);

                            // or update the value property of the data obj passed
                            if (value === undefined) {
                                value = formatterData.value;
                            }

                            data[key + '-classes'] = formatterData.classnames;
                        }
                    }

                    if (value === '' && col.emptyCellValue) {
                        value = col.emptyCellValue;
                    }

                    data[key] = value;
                }

                data.rowClasses = (index % 2) ? odd : even;

                html += fromTemplate(rowTemplate, data);
            });
        }

        return fromTemplate(this.TBODY_TEMPLATE, {
            classes: this.getClassName('data'),
            content: html
        });
    },

    _createRowTemplate: function (columns) {
        var html         = '',
            cellTemplate = this.CELL_TEMPLATE,
            linerClass   = this.getClassName('liner'),
            i, len, col, key, tokenValues;

        for (i = 0, len = columns.length; i < len; ++i) {
            col = columns[i];

            key = col.key || col.name || col._yuid;
            tokenValues = {
                content   : '{' + key + '}',
                headers   : col.headers.join(' '),
                linerClass: linerClass,
                classes   : this.getClassName(key) + ' {' + key + '-classes}'
            };

            if (col.nodeFormatter) {
                // Defer all node decoration to the formatter
                tokenValues.content    = '';
                tokenValues.attributes = '';
                tokenValues.classes    = '';
            }

            html += fromTemplate(cellTemplate, tokenValues);
        }

        this._rowTemplate = fromTemplate(this.ROW_TEMPLATE, {
            content: html
        });
    },

    _parseColumns: function (data, columns) {
        var col, i, len;
        
        columns || (columns = []);

        if (isArray(data) && data.length) {
            for (i = 0, len = data.length; i < len; ++i) {
                col = data[i];

                if (typeof col === 'string') {
                    col = { key: col };
                }

                if (col.key || col.formatter || col.nodeFormatter) {
                    col.index = columns.length;
                    columns.push(col);
                } else if (col.children) {
                    this._parseColumns(col.children, columns);
                }
            }
        }

        return columns;
    }
});
