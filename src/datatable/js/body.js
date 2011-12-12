var Lang         = Y.Lang,
    isObject     = Lang.isObject,
    isArray      = Lang.isArray,
    htmlEscape   = Y.Escape.html,
    fromTemplate = Y.Lang.sub,
    arrayIndexOf = Y.Array.indexOf;

Y.namespace('DataTable').BodyView = Y.Base.create('tableBody', Y.View, [], {
    // -- Instance properties -------------------------------------------------
    TBODY_TEMPLATE:
        '<tbody class="{classes}">{content}</tbody>',

    ROW_TEMPLATE :
        '<tr id="{clientId}" class="{rowClasses}">' +
            '{content}' +
        '</tr>',

    CELL_TEMPLATE:
        '<td headers="{headers}" class="{classes}" {attributes}>' +
            '<div class="{linerClass}">' +
                '{content}' +
            '</div>' +
        '</td>',

    // -- Public methods ------------------------------------------------------
    bindUI: function () {
        this._eventHandles.push(
            this.host.after('columnChange', this._afterColumnChange),
            this.data.after(
                ['*:change', '*:destroy'],
                this._afterDataChange, this));
    },

    destructor: function () {
        (new Y.EventHandle(this._eventHandles)).detach();
    },

    initializer: function (config) {
        this.host    = config.source;
        this.table   = config.table;
        this.data    = config.data;
        this.columns = this._parseColumns(config.columns);

        this.host.after('columnsChange', this._afterColumnsChange);

        this._eventHandles = [];
    },

    render: function () {
        var table    = this.table,
            data     = this.data,
            columns  = this.columns,
            tbody    = this.host._tbodyNode,
            existing = table.one('> .' + this.host.getClassName('data')),
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
        var prevCols = this.columns,
            existing = this.table.one('> .' + this.host.getClassName('data')),
            newCols, i, len, colA, colB, colAIndex, colBIndex, redraw;

        this._parseColumns(e.newVal);

        if (prevCols && existing) {
            newCols = this.columns;

            if (prevCols.length !== newCols.length) {
                redraw = true;
            } else {
                for (i = 0, len = prevCols.length; i < len; ++i) {
                    colA = prevCols[i];
                    colB = newCols[i];

                    if (!this._isSameColumn) {
                        redraw = true;
                        break;
                    }
                }
            }

            if (redraw) {
                // TODO: can't call render() because it doesn't replace the same
                // tbody, and it calls bindUI()
            }
        }
    },

    _afterDataChange: function (e) {
        // TODO
    },

    _applyNodeFormatters: function (tbody, columns) {
        var host = this.host,
            formatters = [],
            tbodyNode  = tbody.getDOMNode(),
            linerQuery = '.' + this.host.getClassName('liner'),
            i, len;

        // Only iterate the ModelList again if there are nodeFormatters
        for (i = 0, len = columns.length; i < len; ++i) {
            if (columns[i].nodeFormatter) {
                formatters.push(i);
            }
        }

        if (formatters.length) {
            this.data.each(function (record, index) {
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

    _createDataHTML: function (columns) {
        var host = this.host,
            odd  = host.getClassName('odd'),
            even = host.getClassName('even'),
            rowTemplate = this._rowTemplate,
            html = '';

        this.data.each(function (record, index) {
            var data = record.getAttrs(),
                i, len, col, key, value, formatterData, attributes, attr;

            for (i = 0, len = columns.length; i < len; ++i) {
                col = columns[i];
                key = col.key || col._yuid;
                value = data[key];

                data[key + '-classes']    = '';
                data[key + '-attributes'] = '';

                if (col.formatter) {
                    formatterData = {
                        value     : value,
                        data      : data,
                        column    : col,
                        record    : record,
                        classnames: '',
                        rowindex  : index
                        //attributes: {}
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

                        attributes = formatterData.attributes;

                        if (isObject(attributes)) {
                            for (attr in attributes) {
                                if (attributes.hasOwnProperty(attr)) {
                                    data[key + '-attributes'] +=
                                        ' ' + attr + '="' +
                                            htmlEscape(attributes[attr]) + '"';
                                }
                            }
                        }
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

        return fromTemplate(this.TBODY_TEMPLATE, {
            classes: this.host.getClassName('data'),
            content: html
        });
    },

    _createRowTemplate: function (columns) {
        var html         = '',
            cellTemplate = this.CELL_TEMPLATE,
            linerClass   = this.host.getClassName('liner'),
            i, len, col, key, tokenValues;

        for (i = 0, len = columns.length; i < len; ++i) {
            col = columns[i];

            if (col.hidden === true || col.visible === false) {
                columns.splice(i, 1);
                --i;
            } else {
                key = col.key || col._yuid;
                tokenValues = {
                    content   : '{' + key + '}',
                    headers   : col.headers.join(' '),
                    linerClass: linerClass,
                    attributes: '{' + key + '-attributes}',
                    classes   : '{' + key + '-classes}'
                };

                if (col.nodeFormatter) {
                    // Defer all node decoration to the formatter
                    tokenValues.content    = '';
                    tokenValues.attributes = '';
                    tokenValues.classes    = '';
                }

                html += fromTemplate(cellTemplate, tokenValues);
            }
        }

        this._rowTemplate = fromTemplate(this.ROW_TEMPLATE, {
            content: html
        });
    },

    // Custom Array.indexOf to search by property rather than object
    // identity.  Columns may be reset with new objects with the same props.
    _findColumnIndex: function (columns, column) {
        var i, len;

        for (i = 0, len = columns.length; i < len; ++i) {
            if (this._isSameColumn(columns[i], column)) {
                return i;
            }
        }

        return -1;
    },

    _isModifiedColumn: function (a, b) {
        return a.formatter      !== b.formatter     ||
               a.nodeFormatter  !== b.nodeFormatter ||
               a.emptyCellValue !== b.emptyCellValue;
    },

    _isSameColumn: function (a, b) {
        return (a && b) && (
            (a.key === b.key) ||
            (!a.key && !b.key && (
                (a.formatter && a.formatter === b.formatter) ||
                (a.nodeFormatter && a.nodeFormatter === b.nodeFormatter))));
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
                    columns.push(col);
                } else if (col.children) {
                    this._parseColumns(col.children, columns);
                }
            }
        }

        return columns;
    }

});
