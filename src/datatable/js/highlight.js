var getClassName = Y.ClassNameManager.getClassName;

function Highlight() {}

Highlight.ATTRS = {
    highlightRows: {
        value: false,
        setter: '_setHighlightRows',
        validator: Y.Lang.isBoolean
    },
    highlightCols: {
        value: false,
        setter: '_setHighlightCols',
        validator: Y.Lang.isBoolean
    },
    highlightCells: {
        value: false,
        setter: '_setHighlightCells',
        validator: Y.Lang.isBoolean
    }
};


Highlight.prototype = {

    highlightClassNames: {
        row: getClassName(NAME, 'row'),
        col: getClassName(NAME, 'col'),
        cell: getClassName(NAME, 'cell')
    },

    //append the column id to this
    //_colSelector: getClassName(this._cssPrefix, 'data') + ' ' + getClassName(this._cssPrefix, 'col') + '-',
    _colSelector: '.{prefix}-data .{prefix}-col-{col}',

    _colNameRegex: '{prefix}-col-(\\S*)',

    _hightlightDelegate: {},

    _setHighlightRows: function (val) {
        var del = this._hightlightDelegate;

        if (del.row) {
            del.row.detach();
        }

        if (val) {
            del.row = this.delegate('hover',
                Y.bind(this._highlightRow, this),
                Y.bind(this._highlightRow, this),
            "tbody tr");
        }

        return val;
    },

    _setHighlightCols: function (val) {
        var del = this._hightlightDelegate;

        if (del.col) {
            del.col.detach();
        }

        if (val) {
            this._buildColSelRegex();

            del.col = this.delegate('hover',
                Y.bind(this._highlightCol, this),
                Y.bind(this._highlightCol, this),
            "tr td");
        }
    },

    _setHighlightCells: function (val) {
        var del = this._hightlightDelegate;

        if (del.cell) {
            del.cell.detach();
        }

        if (val) {

            del.cell = this.delegate('hover',
                Y.bind(this._highlightCell, this),
                Y.bind(this._highlightCell, this),
            "tbody td");
        }

        return val;
    },

    _highlightRow: function (e) {
        e.currentTarget.toggleClass(this.highlightClassNames.row, (e.phase === 'over'));
    },

    _highlightCol: function(e) {
        var colName = this._colNameRegex.exec(e.currentTarget.getAttribute('class')),
            selector = Y.Lang.sub(this._colSelector, {
                prefix: this._cssPrefix,
                col: colName[1]
            });

        this.view.tableNode.all(selector).toggleClass(this.highlightClassNames.col, (e.phase === 'over'));
    },

    _highlightCell: function(e) {
        e.currentTarget.toggleClass(this.highlightClassNames.cell, (e.phase === 'over'));
    },

    _buildColSelRegex: function () {
        var str = this._colNameRegex,
            regex;

        if (typeof str === 'string') {
            this._colNameRegex = new RegExp(Y.Lang.sub(str, { prefix: this._cssPrefix }));
        }
    }
};

Y.DataTable.Highlight = Highlight;

Y.Base.mix(Y.DataTable, [Y.DataTable.Highlight]);
