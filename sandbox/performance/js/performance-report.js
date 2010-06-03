YUI.add('performance-report', function (Y) {

// -- Shorthand and Private Variables ------------------------------------------
var Lang = Y.Lang,
    Obj  = Y.Object,

    isValue = Lang.isValue,

    CONTENT_BOX = 'contentBox',
    PERFORMANCE = 'performance';

function Report() {
    Report.superclass.constructor.apply(this, arguments);
}

Y.extend(Report, Y.Widget, {
    // -- Public Constants -----------------------------------------------------
    CHART_URL: 'http://chart.apis.google.com/chart?',

    // Selectors (relative to contentBox)
    SELECTOR_BODY  : 'tbody',
    SELECTOR_FOOTER: 'tfoot',
    SELECTOR_HEADER: 'thead',
    SELECTOR_RESULT: 'tbody>tr.result',

    // Templates
    BODY_TEMPLATE   : '<tbody></tbody>',
    CONTENT_TEMPLATE: '<table></table>',
    FOOTER_TEMPLATE : '<tfoot><tr><td colspan="10"></td></tr></tfoot>',

    HEADER_TEMPLATE:
        '<thead>' +
            '<tr>' +
                '<th class="group">Group</th>' +
                '<th class="test">Test</th>' +
                '<th class="calls">Calls</th>' +
                '<th class="failures">Failures</th>' +
                '<th class="mean">Mean</th>' +
                '<th class="median">Median</th>' +
                '<th class="mediandev"><abbr title="Median Absolute Deviation">Med. Dev.</abbr></th>' +
                '<th class="stdev"><abbr title="Sample Standard Deviation">Std. Dev.</abbr></th>' +
                '<th class="max">Max</th>' +
                '<th class="min">Min</th>' +
            '</tr>' +
        '</thead>',

    RESULT_TEMPLATE:
        '<tr class="{classNames result}">' +
            '<td class="group">{groupName}</td>' +
            '<td class="test"><div class="bd">{name} <img src="{chartUrl}" style="height:20px;width:100px" alt="Sparkline"></div></td>' +
            '<td class="calls">{calls}</td>' +
            '<td class="failures">{failures}</td>' +
            '<td class="mean">{mean}</td>' +
            '<td class="median">{median}</td>' +
            '<td class="mediandev">{mediandev}</td>' +
            '<td class="stdev">{stdev}</td>' +
            '<td class="max">{max}</td>' +
            '<td class="min">{min}</td>' +
        '</tr>' +
        '<tr class="code hidden">' +
            '<td colspan="10">' +
                '<pre><code>{code}</code></pre>' +
            '</td>' +
        '</tr>',

    // -- Public Methods -------------------------------------------------------
    initializer: function () {
        if (!this.get(PERFORMANCE)) {
            Y.error('No performance instance specified.');
        }
    },

    bindUI: function () {
        var contentBox = this.get(CONTENT_BOX),
            perf       = this.get(PERFORMANCE);

        contentBox.delegate('click', this._onResultClick, this.SELECTOR_RESULT);

        perf.after('clear', this._afterClear, this);
        perf.after('end', this._afterEnd, this);
        perf.after('resultAdd', this._afterResultAdd, this);
        perf.after('start', this._afterStart, this);
    },

    renderUI: function () {
        var contentBox = this.get(CONTENT_BOX);

        this._renderHeader(contentBox);
        this._renderFooter(contentBox);
        this._renderBody(contentBox);
    },

    syncUI: function () {
        
    },

    // -- Protected Methods ----------------------------------------------------
    _clearResults: function () {
        this.get(CONTENT_BOX).one(this.SELECTOR_BODY).get('children').each(function (node) {
            node.remove().destroy(true);
        });
    },

    _renderBody: function (contentBox) {
        // Do nothing if BODY_TEMPLATE is empty.
        if (!this.BODY_TEMPLATE) {
            return;
        }

        var body = contentBox.one(this.SELECTOR_BODY);

        // Remove the body if it already exists.
        if (body) {
            body.destroy(true);
        }

        // Render a new body.
        contentBox.append(this.BODY_TEMPLATE);
    },

    _renderFooter: function (contentBox) {
        // Do nothing if FOOTER_TEMPLATE is empty.
        if (!this.FOOTER_TEMPLATE) {
            return;
        }

        var foot = contentBox.one(this.SELECTOR_FOOTER);

        // Remove the footer if it already exists.
        if (foot) {
            foot.destroy(true);
        }

        // Render a new footer.
        contentBox.append(this.FOOTER_TEMPLATE);
    },

    _renderHeader: function (contentBox) {
        // Do nothing if HEADER_TEMPLATE is empty.
        if (!this.HEADER_TEMPLATE) {
            return;
        }

        var head = contentBox.one(this.SELECTOR_HEADER);

        // Remove the header if it already exists.
        if (head) {
            head.destroy(true);
        }

        // Render a new header.
        contentBox.append(this.HEADER_TEMPLATE);
    },

    _renderResult: function (resultData, test, group) {
        var chartParams = {
                cht: 'ls',
                chd: 't:' + resultData.points.join(','),
                chf: 'bg,s,00000000', // transparent background
                chs: '100x20'
            };

        this.get(CONTENT_BOX).one(this.SELECTOR_BODY).append(Y.substitute(
            this.RESULT_TEMPLATE,

            Y.merge(resultData, {
                chartUrl : this.CHART_URL + Report._createQueryString(chartParams),
                code     : Report._htmlEntities(test.test.toString()),
                groupName: Report._htmlEntities(group.name || 'Default'),
                mediandev: resultData.mediandev !== '' ? '±' + resultData.mediandev : '',
                name     : Report._htmlEntities(resultData.name),
                stdev    : resultData.stdev !== '' ? '±' + resultData.stdev : ''
            }),

            function (key, value, meta) {
                if (key === 'classNames') {
                    return meta + (resultData.failures ? ' fail' : '');
                }
        
                return value;
            }
        ));
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterClear: function () {
        this._clearResults();
    },

    _afterEnd: function () {
        this.get(CONTENT_BOX).removeClass('running');
    },

    _afterResultAdd: function (e) {
        this._renderResult(e.result, e.test, e.group);
    },

    _afterStart: function () {
        this.get(CONTENT_BOX).addClass('running');
    },

    _onResultClick: function (e) {
        e.currentTarget.next('tr.code').toggleClass('hidden');
    }
}, {
    // -- Public Static Constants ----------------------------------------------
    NAME: 'performanceReport',

    ATTRS: {
        performance: {
            validator: function (value) {
                return value instanceof Y.Performance;
            },

            writeOnce: 'initOnly'
        }
    },

    // -- Protected Static Methods ---------------------------------------------

    /**
     * Creates a query string based on the specified object of name/value
     * params.
     *
     * @method _createQueryString
     * @param {Object} params object of name/value parameter pairs
     * @return {String}
     * @protected
     * @static
     */
    _createQueryString: function (params) {
        var _params = [],
            encode  = encodeURIComponent;

        Obj.each(params, function (value, key) {
            if (isValue(value)) {
                _params.push(encode(key) + '=' + encode(value));
            }
        });

        return _params.join('&amp;');
    },

    /**
     * Replaces special HTML characters in the specified string with their
     * entity equivalents.
     *
     * @method _htmlEntities
     * @param {String} string
     * @return {String}
     * @protected
     * @static
     */
    _htmlEntities: function (string) {
        return string.replace(/&/g, '&amp;').
                      replace(/</g, '&lt;').
                      replace(/>/g, '&gt;').
                      replace(/"/g, '&quot;');
    }
});

Y.PerformanceReport = Report;

}, '@VERSION@', {
    requires: ['performance', 'substitute', 'widget']
});
