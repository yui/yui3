var fromTemplate = Y.Lang.sub,
    Lang = Y.Lang,
    isArray = Lang.isArray,
    toArray = Y.Array,

    ClassNameManager = Y.ClassNameManager,
    _getClassName    = ClassNameManager.getClassName;

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
        // TODO: How best to decouple this?
        this._eventHandles.push(
            this.host.after('columnsChange', this._afterColumnChange));
    },

    destructor: function () {
        (new Y.EventHandle(this._eventHandles)).detach();
    },

    getClassName: function () {
        var args = toArray(arguments);
        args.unshift(this._cssPrefix);
        args.push(true);

        return _getClassName.apply(ClassNameManager, args);
    },

    initializer: function (config) {
        var cssPrefix = config.cssPrefix || (config.host || {}).cssPrefix;

        this.host    = config.source;
        this.columns = this._parseColumns(config.columns);

        this._eventHandles = [];

        if (cssPrefix) {
            this._cssPrefix = cssPrefix;
        }
    },

    render: function () {
        var table    = this.get('container'),
            columns  = this.columns,
            thead    = this.host._theadNode,
            defaults = {
                            abbr: '',
                            colspan: 1,
                            rowspan: 1,
                            // TODO: remove dependence on this.host
                            linerClass: this.getClassName('liner')
                       },
            existing, replace, i, len, j, jlen, col, html;

        table = Y.one(table);
        if (table && table.get('tagName') !== 'TABLE') {
            table = table.one('table');
        }

        if (!table) {
            Y.log('Could not render thead. Table not provided', 'warn');
            return this;
        }

        existing = table.one('> .' + this.getClassName('columns'));
        replace  = existing && (!thead || !thead.compareTo(existing));

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
                classes: this.getClassName('columns'),
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

    _cssPrefix: 'table',

    _parseColumns: function (data) {
        var columns = [],
            stack = [],
            rowSpan = 1,
            entry, row, col, children, parent, i, len, j;
        
        if (isArray(data) && data.length) {
            // First pass, assign colspans and calculate row count for
            // non-nested headers' rowspan
            stack.push([data, -1]);

            while (stack.length) {
                entry = stack[stack.length - 1];
                row   = entry[0];
                i     = entry[1] + 1;

                for (len = row.length; i < len; ++i) {
                    col = row[i];
                    children = col.children;

                    if (typeof col === 'string') {
                        row[i] = col = { key: col };
                    }

                    Y.stamp(col);

                    if (isArray(children) && children.length) {
                        stack.push([children, -1]);
                        entry[1] = i;

                        rowSpan = Math.max(rowSpan, stack.length);

                        // break to let the while loop process the children
                        break;
                    } else {
                        col.colspan = 1;
                    }
                }

                if (i >= len) {
                    // All columns in this row are processed
                    if (stack.length > 1) {
                        entry  = stack[stack.length - 2];
                        parent = entry[0][entry[1]];

                        parent.colspan = 0;

                        for (i = 0, len = row.length; i < len; ++i) {
                            // Can't use .length because in 3+ rows, colspan
                            // needs to aggregate the colspans of children
                            parent.colspan += row[i].colspan;

                            // Assign the parent column for ease of navigation
                            row[i].parent = parent;
                        }
                    }
                    stack.pop();
                }
            }

            // Second pass, build row arrays and assign rowspan
            for (i = 0; i < rowSpan; ++i) {
                columns.push([]);
            }

            stack.push([data, -1]);

            while (stack.length) {
                entry = stack[stack.length - 1];
                row   = entry[0];
                i     = entry[1] + 1;

                for (len = row.length; i < len; ++i) {
                    col = row[i];
                    children = col.children;

                    columns[stack.length - 1].push(col);

                    entry[1] = i;

                    if (children && children.length) {
                        // parent cells must assume rowspan 1 (long story)

                        // break to let the while loop process the children
                        stack.push([children, -1]);
                        break;
                    } else {
                        // collect the IDs of parent cols
                        col.headers = [col._yuid];

                        for (j = stack.length - 2; j >= 0; --j) {
                            parent = stack[j][0][stack[j][1]];

                            col.headers.unshift(parent._yuid);
                        }

                        col.rowspan = rowSpan - stack.length + 1;
                    }
                }

                if (i >= len) {
                    // All columns in this row are processed
                    stack.pop();
                }
            }
        }

        return columns;
    }
});
