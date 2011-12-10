var fromTemplate = Y.Lang.sub;

Y.namespace('DataTable').HeaderView = Y.Base.create('tableHeader', Y.View, [], {

    THEAD_TEMPLATE:
        '<thead class="{classes}">{content}</thead>',

    ROW_TEMPLATE:
        '<tr>{content}</tr>',

    CELL_TEMPLATE :
        '<th id="{_yuid}" abbr="{abbr}" ' +
                'colspan="{colspan}" rowspan="{rowspan}">' +
            '<div class="{linerClass}">' +
                '{content}' +
            '</div>' +
        '</th>',

    initializer: function (config) {
        this.host  = config.source;
        this.table = config.table;
        this.data  = config.data;

        this._eventHandles = [];
    },

    destructor: function () {
        (new Y.EventHandle(this._eventHandles)).detach();
    },

    render: function () {
        var table    = this.table,
            existing = table.one('> .' + this.host.getClassName('head')),
            thead    = this.host._theadNode,
            replace  = existing && (!thead || !thead.compareTo(existing)),
            columns  = this.host.getColumnData().byPosition,
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
                        if (col.hidden !== true && col.visible !== false) {
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

    bindUI: function () {
        this._eventHandles.push(
            this.host.after('columnChange', this._afterColumnChange),
            this.data.after(
                ['*:change', '*:destroy'],
                this._afterDataChange, this));
    },

    _afterColumnChange: function (e) {
        // TODO
    },

    _afterDataChange: function (e) {
        // TODO
    }
});
