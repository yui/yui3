/**
Class extension for DataTable that extracts various configurations from the
markup `srcNode`.

@module datatable-pe-data
@since 3.6.0
@beta
**/
var toArray = Y.Array,
    YLang   = Y.Lang,
    isArray = YLang.isArray,

    PE;

/**
Class extension for DataTable that extracts various configurations from the
markup.  All parsed configurations that aren't represented in the DataTable's
own attributes will be added to the `viewConfig` attribute.  The following
configuration properties are extracted from the `srcNode`:

 * `columns` - See below for details.
 * `data` - Cell content from inside '.yui3-datatable-data .yui3-datatable-cell'
   nodes.  If no matching nodes are found, a generic 'td' tag selector is used.
 * `caption` - HTML content from a node matching
   '.yui3-datatable-caption, caption'
 * `summary` - Text content from the `<table>`'s `summary` attribute
 * `tableNode` - The `<table>` Node
 * `theadNode` - The `<thead>` Node
 * `tbodyNode` - The `<tbody>` Node. Preference is given to the one matching
   '.yui3-datatable-data'.
 * `tfootNode` - The `<tfoot>` Node
 * `captionNode` - The `<caption>` Node

Column extraction involves capturing nodes matching '.yui3-datatable-header',
or if no matching nodes are found, a generic 'th' tag selector is used.  Each
Node's `innerHTML` is used as the column's `label` and the default `key`.  Each
is then inspected for data attributes in the form of _data-y-configName_ or
_data-yui3-configName_.  Numeric values for these attributes, booleans, and
`null` are parsed to their native representation.  If the `json-parse` module
is used and the data attribute value starts with _{_ or _[_, it will
be parsed to its native object or array value.  

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
Map of attributes-to-functions for extracting configuration data from the
`srcNode`.

@property HTML_PARSER
@static
@type {Object}
@since 3.6.0
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

    // Needs to be peData, not data, because I don't know what column keys
    // to assign values to yet, so this creates an array of arrays to convert
    // in the initializer.
    _peData: function (srcNode) {
        return this._parseDataFromMarkup(srcNode);
    },

    tableNode: function (srcNode) {
        var selector = '.' + this.getClassName('table') + ', table';

        return srcNode.test(selector) ? srcNode : srcNode.one(selector);
    },

    theadNode: function (srcNode) {
        return srcNode.one('.' + this.getClassName('columns') + ', thead');
    },

    tbodyNode: function (srcNode) {
        return srcNode.one('.' + this.getClassName('data') + ', tbody');
    },

    tfootNode: function (srcNode) {
        return srcNode.one('.' + this.getClassName('foot') + ', tfoot');
    },

    captionNode: function (srcNode) {
        return srcNode.one('.' + this.getClassName('caption') + ', caption');
    }
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
        var data   = config.data,
            peData = config._peData,
            viewConfig = this.get('viewConfig') || {};

        if ((!data || !data.length) && isArray(peData)) {
            this.set('data',
                this._convertDataArray(peData, this._displayColumns),
                { silent: true });
        }

        // Pass all non-attributes along to the viewConfig
        delete config._peData;
        delete viewConfig._peData;
    },

    /**
    @method _parseColumnsFromMarkup
    @param {Node} srcNode The widget's `srcNode` to search through
    @return {null|Object[]} `columns` config array
    @protected
    @since 3.6.0
    **/
    _parseColumnsFromMarkup: function (srcNode) {
        var thead   = srcNode.one('thead'),
            headers = thead && thead.all('>tr>.' + this.getClassName('header')),
            columns = [];

        if (thead && !headers.size()) {
            headers = thead.all('>tr>th');
        }

        // TODO: nested header support
        // Getting a thead first to avoid getting nested table ths
        headers.each(function (th) {
            var attrs = th.getData(),
                label = th.get('text'),
                column = {
                    id   : th.get('id'),
                    label: label
                },
                attr, config;

            for (attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    // data-y-key="key" or data-yui3-type="number"
                    config = (attr.match(/y(?:ui3?)?-([\w\-]+)/) || [])[1];

                    if (config) {
                        column[config] =
                            this._parseColumnConfigValue(attrs[attr]);
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
        var tbody = srcNode.one('.' + this.getClassName('data')) ||
                    srcNode.one('tbody'),
            cells = tbody && srcNode.all('.'+this.getClassName('cell'))._nodes,
            data  = [],
            i, len, rec, index, cell;

        if (tbody && !cells.length) {
            cells = tbody.all('> tr > td')._nodes;
        }

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
