var getClassName = Y.ClassNameManager.getClassName,

    DOT       = '.',
    DATATABLE = 'datatable',
    CN_TABLE  = getClassName(DATATABLE, 'table'),
    CN_THEAD  = getClassName(DATATABLE, 'head'),
    CN_TFOOT  = getClassName(DATATABLE, 'foot'),
    CN_TBODY  = getClassName(DATATABLE, 'data'),

function EnhanceMarkup() {}

Y.mix(EnhanceMarkup, {
    HTML_PARSER: {
        _tableNode  : '_findHTMLTableNode',
        _captionNode: '_findHTMLCaptionNode',
        _theadNode  : '_findHTMLTheadNode',
        _tfootNode  : '_findHTMLTfootNode',
        _tbodyNode  : '_findHTMLTbodyNode',
        columns: '_parseHTMLColumns',
        caption: '_parseHTMLCaption',
        summary: '_parseHTMLSummary'
    }
});

Y.mix(EnhanceMarkup.prototype, {
    // -- Instance properties -------------------------------------------------
    RE_COLUMN_ATTR: /data-yui3-column-(.*)/,

    // -- Public methods ------------------------------------------------------
    initializer: function (config) {
        if (config) {
            // Node references from HTML_PARSER to support progressive
            // enhancement, but aren't stored as attributes.
            this._tableNode   = config._tableNode;
            this._captionNode = config._captionNode;
            this._theadNode   = config._theadNode;
            this._tfootNode   = config._tfootNode;
            this._tbodyNode   = config._tbodyNode;
        }
    },

    // -- Protected and private methods ---------------------------------------
    _findHTMLCaptionNode: function (srcNode) {
        return srcNode.one(DOT + this.getClassName('table') + ' > caption');
    },

    _findHTMLTableNode: function (srcNode) {
        return (srcNode.get('tagName') === 'table') ?
            srcNode :
            srcNode.one(DOT + this.getClassName('table'));
    },

    _findHTMLTbodyNode: function (srcNode) {
        return srcNode.one(DOT + this.getClassName('data'));
    },

    _findHTMLTfootNode: function (srcNode) {
        return srcNode.one(DOT + this.getClassName('foot'));
    },

    _findHTMLTheadNode: function (srcNode) {
        return srcNode.one(DOT + this.getClassName('head'));
    },

    _parseHTMLCaption: function (srcNode) {
        var caption = this._findHTMLCaptionNode(srcNode);

        return caption && caption.getContent();
    },

    _parseHTMLColumns: function (srcNode) {
        var self = this,
            ths  = srcNode.all('> .' + CN_THEAD + ' th'),
            columns = [];

        ths.each(function (th) {
            // TODO: if (th.get('colspan')) { => children }
            // TODO: use dataset shim when it becomes available
            var attributes = th.getDOMNode().attributes,
                dataAttrRE = self.RE_COLUMN_ATTR,
                col = {
                        key: th.get('text'),
                        label: th.getContent()
                      },
                i, match;

            if (attributes) {
                for (i = attributes.length - 1; i >= 0; --i) {
                    match = attributes[i].name.match(dataAttrRE);

                    if (match) {
                        // Attributes and dataset differ in that data-foo-bar
                        // and data-fooBar will both become dataset.fooBar.
                        // Assume the implementer will use the correct casing.
                        col[match[1]] = attributes[i].value;
                    }
                }
            }

            columns.push(col);
        });

        return (columns.length) ? columns : null;
    },

    _parseHTMLSummary: function (srcNode) {
        var table = (srcNode.test('table')) ? srcNode : srcNode.one('table');

        return table && table.getAttribute('summary');
    }

});

Y.DataTable.EnhanceMarkup = EnhanceMarkup;

Y.Base.mix(Y.DataTable, [EnhanceMarkup]);
