var Lang = Y.Lang,
    isObject = Lang.isObject,
    htmlEscape = Y.Escape.html,
    fromTemplate = Y.Lang.sub;

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
        this.host = config.source;
        this.table = config.table;
        this.data  = config.data;

        this._eventHandles = [];
    },

    render: function () {
        var table    = this.table,
            data     = this.data,
            existing = table.one('> .' + this.host.getClassName('data')),
            tbody    = this.host._tbodyNode,
            replace  = existing && (!tbody || !tbody.compareTo(existing)),
                       // Copy taken so hidden and nodeFormatter columns
                       // can be removed for template assembly and population
            columns  = Y.Array(this.host.getColumnData().dataColumns);

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
    _afterColumnChange: function (e) {
        // TODO
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
    }
});
