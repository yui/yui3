YUI.add('table',function (Y) {

    var create = Y.Node.create;

    function Table() {
        Table.superclass.constructor.apply(this,arguments);
    }

    Table.NAME = 'table';

    Table.ATTRS = {
        columns : {
            value : [],
            validator : Y.Lang.isArray
        },

        caption : {
            value : null,
            validator : function (v) {
                return Y.Lang.isString(v) || Y.Lang.isNull(v);
            }
        },

        data : {
            value : [],
            validator : Y.Lang.isArray
        },

        totals : {
            value : null,
            validator : function (v) {
                return Y.Lang.isArray(v) || Y.Lang.isNull(v);
            }
        }
    };

    Y.extend(Table, Y.Widget, {
        renderUI : function () {
            this._table = create('<table></table>');

            this._renderCaption();
            this._renderThead();
            this._renderTfoot();
            this._renderTbody();

            this.get('contentBox').appendChild(this._table);
        },

        _renderCaption : function () {
            var cap = this.get('caption');
            if (cap) {
                this._table.appendChild(create('<caption>'+cap+'</caption>'));
            }
        },

        _renderThead : function () {
            this._table.appendChild(create(
                '<thead><tr><th>' +
                this.get('columns').join('</th><th>') +
                '</th></tr></thead>'));
        },

        _renderTfoot : function () {
            var totals = this.get('totals'),
                cols = this.get('columns'),
                data = this.get('data'),
                html,total,i,len;

            if (totals) {
                html = '<tfoot><tr>';

                for (i = 0, len = cols.length; i < len; ++i) {
                    if (totals[i]) {
                        total = 0;
                        Y.Array.each(data, function (rec) {
                            total += +(rec[cols[i]]) || 0;
                        });
                        html += '<td>' + Math.round(total) + '</td>';
                    } else {
                        html += '<td></td>';
                    }
                }

                this._table.appendChild(create(html + '</tr></tfoot>'));
            }
        },

        _renderTbody : function () {
            var cols = this.get('columns'),
                data = this.get('data'),
                rows = [], r,
                i, len,
                j, jlen;

            for (i = 0, len = data.length; i < len; ++i) {
                r = '';
                for (j = 0, jlen = cols.length; j < jlen; ++j) {
                    r += '<td>' + data[i][cols[j]] + '</td>';
                }
                if (r) {
                    rows.push('<tr>' + r + '</tr>');
                }
            }

            this._table.appendChild(create('<tbody>'+rows.join('')+'</tbody>'));
        }
    });

    Y.Table = Table;

},'@VERSION@',{requires:['widget']});
