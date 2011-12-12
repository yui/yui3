var fromTemplate = Y.Lang.sub,
    Lang = Y.Lang,
    isArray = Lang.isArray;

Y.namespace('DataTable').HeaderView = Y.Base.create('tableHeader', Y.View, [], {
    // -- Instance properties -------------------------------------------------
    CELL_TEMPLATE :
        '<th id="{_yuid}" abbr="{abbr}" ' +
                'colspan="{colspan}" rowspan="{rowspan}">' +
            '<div class="{linerClass}">' +
                '{content}' +
            '</div>' +
        '</th>',

    ROW_TEMPLATE:
        '<tr>{content}</tr>',

    THEAD_TEMPLATE:
        '<thead class="{classes}">{content}</thead>',

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
        this.host  = config.source;
        this.table = config.table;
        this.data  = config.data;
        this.columns = this._parseColumns(config.columns);

        this.host.after('columnsChange', this._afterColumnsChange);

        this._eventHandles = [];
    },

    render: function () {
        var table    = this.table,
            columns  = this.columns,
            existing = table.one('> .' + this.host.getClassName('head')),
            thead    = this.host._theadNode,
            replace  = existing && (!thead || !thead.compareTo(existing)),
            defaults = {
                            abbr: '',
                            colspan: 1,
                            rowspan: 1,
                            // TODO: remove dependence on this.host
                            linerClass: this.host.getClassName('liner')
                       },
            i, len, j, jlen, col, html;

        if (!thead) {
            thead = '';

            if (columns.length) {
                for (i = 0, len = columns.length; i < len; ++i) {
                    html = '';

                    for (j = 0, jlen = columns[i].length; j < jlen; ++j) {
                        col = columns[i][j];
                        html += fromTemplate(this.CELL_TEMPLATE,
                            Y.merge(
                                defaults,
                                col, {
                                    content: col.label ||
                                             col.key   ||
                                             ("Column " + j)
                                }
                            ));
                    }

                    thead += fromTemplate(this.ROW_TEMPLATE, {
                        content: html
                    });
                }
            }

            thead = fromTemplate(this.THEAD_TEMPLATE, {
                classes: this.host.getClassName('head'),
                content: thead
            });
        }

        if (existing) {
            if (replace) {
                existing.replace(thead);
            }
        } else {
            table.insertBefore(thead, table.one('> tfoot, > tbody'));
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

    _parseColumns: function (data) {
        var columns = [],
            rowStack = [],
            index = [],
            rowSpan = 1,
            row, col, children, i, len, j, jlen;
        
        if (isArray(data) && data.length) {
            // First pass, assign colspans and calculate row count for
            // non-nested headers' rowspan
            rowStack.push(data);
            index.push(-1);

            while (rowStack.length) {
                row = rowStack[rowStack.length - 1];
                i = index[index.length - 1] + 1;

                for (len = row.length; i < len; ++i) {
                    col = row[i];
                    children = col.children;

                    if (typeof col === 'string') {
                        row[i] = col = { key: col };
                    }

                    Y.stamp(col);

                    if (isArray(children) && children.length) {
                        rowStack.push(children);
                        index[index.length - 1] = i;
                        index.push(-1);
                        rowSpan = Math.max(rowSpan, rowStack.length);

                        // break to let the while loop process the children
                        break;
                    } else {
                        col.colspan = 1;
                    }
                }

                if (i >= len) {
                    // All columns in this row are processed
                    if (rowStack.length > 1) {
                        // The parent column
                        col = rowStack[rowStack.length-2][index[index.length-2]];
                        col.colspan = 0;

                        for (i = 0, len = row.length; i < len; ++i) {
                            // Can't use .length because in 3+ rows, colspan
                            // needs to aggregate the colspans of children
                            col.colspan += row[i].colspan;

                            // Assign the parent column for ease of navigation
                            row[i].parent = col;
                        }
                    }
                    rowStack.pop();
                    index.pop();
                }
            }

            // Second pass, build row arrays and assign rowspan
            for (i = 0; i < rowSpan; ++i) {
                columns.push([]);
            }

            rowStack.push(data);
            index.push(-1);

            while (rowStack.length) {
                row = rowStack[rowStack.length - 1];
                i = index[index.length - 1] + 1;

                for (len = row.length; i < len; ++i) {
                    col = row[i];
                    children = col.children;

                    columns[rowStack.length - 1].push(col);

                    index[index.length - 1] = i;

                    if (children && children.length) {
                        rowStack.push(children);
                        index.push(-1);

                        // break to let the while loop process the children
                        break;
                    } else {
                        // collect the IDs of parent cols
                        col.headers = [];

                        for (j = 0, jlen = rowStack.length; j < jlen; ++j) {
                            col.headers.push(rowStack[j][index[j]]._yuid);
                        }

                        col.rowspan = rowSpan - rowStack.length + 1;
                    }
                }

                if (i >= len) {
                    // All columns in this row are processed
                    rowStack.pop();
                    index.pop();
                }
            }
        }

        return columns;
    }
});
