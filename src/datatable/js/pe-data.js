/**
Class extension for DataTable that extracts `data` and `columns` configuration
from the markup `srcNode`.

@module datatable-pe-data
@since 3.6.0
@beta
**/
var toArray = Y.Array,
    YLang   = Y.Lang,
    isArray = YLang.isArray,

    PE;

/**
Class extension for DataTable that extracts `data` and `columns` configuration
from the markup `srcNode`.

@class ProgressiveEnhancement
@namespace DataTable
@since 3.6.0
**/
PE = Y.DataTable.ProgressiveEnhancement = function () {};

/**
Classes Base.mix()ed with this class will also get the static `Parser` object.

@property _buildCfg
@static
@type {Object}
@protected
@since 3.6.0
**/
PE._buildCfg = {
    aggregate: ['Parser']
};

/**
Map of string names to value parser functions to extract raw data values from
markup strings during progressive enhancement.  Parser functions receive the
value from markup and the column configuration.

Included parsers are:
 * 'number'

@property Parser
@static
@type {Object}
@protected
@since 3.6.0
**/
PE.Parser = {
    'number': function (val, col) { return +val; }
};

/**
Map of attributes-to-functions for extracting data from the configured `srcNode`

@
**/
PE.HTML_PARSER = {
    caption: function (srcNode) {
        var caption = srcNode.one('caption');

        return caption && caption.getHTML();
    },

    summary: function (srcNode) {
        var table = srcNode.test('table') ? srcNode : srcNode.one('table');

        return table && table.get('summary');
    },

    columns: function (srcNode) {
        return this._parseColumnsFromMarkup(srcNode);
    },

    peData : function (srcNode) {
        return this._parseDataFromMarkup(srcNode);
    }
};

// FIXME: This is needed to allow HTML_PARSER assigned attributes to be assigned
// when those attributes aren't explicitly in the host class ATTRS.  In this
// case, because the DT.Base class doesn't use them.  It just passes them to
// the TableView.  Ticket #2532394 filed to see if this is intentional.
PE.ATTRS = {
    caption: {},
    summary: {}
};

Y.mix(PE.prototype, {
    /**
    Translates a nested array structure into the array-of-objects format needed
    by the `data` ModelList.

    @method _convertDataArray
    @param {Array[]} data The array of arrays with cell data
    @param {Object[]} columns The columns to map the data to
    @return {Object[]}
    @protected
    @since 3.6.0
    **/
    _convertDataArray: function (arr, columns) {
        var parsers = PE.Parser || {},
            data    = [],
            i, len, j, jlen, col, rec, parser;

        for (i = 0, len = arr.length; i < len; ++i) {
            rec = {};

            for (j = 0, jlen = columns.length; j < jlen; ++j) {
                col    = columns[j];
                parser = parsers[col.type];

                rec[col.key] = parser ?
                    parser.call(this, arr[i][j], col) :
                    arr[i][j];
            }

            data[i] = rec;
        }

        return data;
    },

    /**
    Overrides Widget `_defaultCB` because it defaults the `contentBox` from
    `srcNode`, but `srcNode` might (reasonably) be a `<table>` Node, which
    would cause a DOM train wreck.

    @method _defaultCB
    @protected
    @since 3.6.0
    **/
    _defaultCB: function () {
        var srcNode = this.get('srcNode');

        return srcNode && !srcNode.test('table') ? srcNode : null;
    },

    /**
    Applies HTML parsed cell values to the `data` ModelList.

    @method initializer
    @param {Object} config The configuration object supplied at construction,
                            decorated with properties from HTML_PARSER
    @protected
    @since 3.6.0
    **/
    initializer: function (config) {
        var data    = config.data,
            peData  = config.peData;

        if ((!data || !data.length) && isArray(peData)) {
            this.set('data',
                this._convertDataArray(peData, this._displayColumns),
                { silent: true });
        }
    },

    /**
    @method _parseColumnsFromMarkup
    @param {Node} srcNode The widget's `srcNode` to search through
    @return {null|Object[]} `columns` config array
    @protected
    @since 3.6.0
    **/
    _parseColumnsFromMarkup: function (srcNode) {
        var columns = [];

        // TODO: nested header support
        // Getting a thead first to avoid getting nested table ths
        srcNode.one('thead').all('> tr > th').each(function (th) {
            var attrs = th.getData(),
                label = th.get('text'),
                column = {
                    label: label
                },
                attr, config, val;

            for (attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    val = this._parseColumnConfigValue(attrs[attr]);

                    // data-y-key="key" or data-yui3-type="number"
                    config = (attr.match(/y(?:ui3?)-([\w\-]+)/) || [])[1];

                    if (config) {
                        column[config] = val;
                    }
                }
            }

            if (!column.key) {
                column.key = label;
            }

            columns.push(column);
        }, this);

        return columns;
    },

    /**
    Looks for common string patterns to translate to native values.

    @method _parseColumnConfigValue
    @param {String} val Attribute value from markup
    @return {null|String|Number|Object|Array|Boolean}
    @protected
    **/
    _parseColumnConfigValue: function (val) {
        if (val === 'true' || val === 'false') {
            return !!val;
        } else if (val === 'null') {
            return null;
        } else if (!isNaN(+val)) {
            return +val;
        } else if (Y.JSON && Y.JSON.parse && /[\[{]/.test(val.charAt(0))) {
            try {
                return Y.JSON.parse(val);
            } catch (e) {
                // flow through to default return
            }
        }
            
        return val;
    },

    /**
    Extracts the data values from the table cells into an array of objects.

    @method _parseDataFromMarkup
    @param {Node} srcNode The widget's `srcNode` to search through
    @return {null|Object[]} `data` config array
    @protected
    @since 3.6.0
    **/
    _parseDataFromMarkup: function (srcNode) {
        var cells   = srcNode.one('tbody').all('> tr > td')._nodes,
            data    = [],
            i, len, rec, index, cell;

        for (i = 0, len = cells.length; i < len; ++i) {
            cell  = cells[i];
            index = cell.cellIndex;

            if (!index) {
                rec = [];
                data.push(rec);
            }

            rec[index] = cell.innerHTML;
        }

        return data;
    }
}, true);

Y.Base.mix(Y.DataTable, [PE]);
