YUI.add('performance-report-comparison', function (Y) {

// -- Shorthand and Private Variables ------------------------------------------
var Lang = Y.Lang,
    Node = Y.Node,
    Obj  = Y.Object,

    isValue = Lang.isValue,

    CONTENT_BOX = 'contentBox',
    PERFORMANCE = 'performance';

function Comparison() {
    Comparison.superclass.constructor.apply(this, arguments);
}

Y.extend(Comparison, Y.PerformanceReport, {
    // -- Protected Properties -------------------------------------------------

    // Mapping of group names to ids.
    _groupNameIdMap: {},

    // Mapping of test names to ids.
    _testNameIdMap: {},

    // -- Public Constants -----------------------------------------------------

    // Selectors (relative to contentBox)
    SELECTOR_HEADER_GROUP: 'thead>tr>th.group',
    SELECTOR_RESULT      : 'tbody>tr.result',
    SELECTOR_RESULT_GROUP: 'tbody>tr.result>td.group',

    // Templates
    HEADER_TEMPLATE:
        '<thead>' +
            '<tr>' +
                '<th class="test">Test</th>' +
                // Group-specific header columns will be appended here
            '</tr>' +
        '</thead>',

    HEADER_GROUP_TEMPLATE: '<th class="group">{name}</th>',

    RESULT_TEMPLATE:
        '<tr id="{id}" class="result">' +
            '<td class="test">{name}</td>' +
            // Group-specific result columns will be appended here.
        '</tr>',

    RESULT_GROUP_TEMPLATE: '<td class="group empty groupId-{id}">&nbsp;</td>',
    RESULT_GROUP_CONTENT_TEMPLATE: '<span class="median">{median}</span> <span class="mediandev">{mediandev}</span>',

    // -- Public Methods -------------------------------------------------------
    _clearBody: function () {
        this._groupNameIdMap = {};
        this._testNameIdMap  = {};

        this.get(CONTENT_BOX).one(this.SELECTOR_BODY).get('children').each(function (node) {
            node.remove().destroy(true);
        });
    },

    _clearHeader: function () {
        this.get(CONTENT_BOX).all(this.SELECTOR_HEADER_GROUP).each(function (node) {
            node.remove().destroy(true);
        });
    },

    _clearResults: function () {
        this.get(CONTENT_BOX).all(this.SELECTOR_RESULT_GROUP).each(function (node) {
            node.removeClass('fail').addClass('empty').set('innerHTML', '');
        });
    },

    _renderBody: function (contentBox, suite) {
        var body      = contentBox.one(this.SELECTOR_BODY),
            group,
            groupName,
            testName;

        if (body) {
            this._clearBody();
        } else {
            // Render a new body.
            body = Node.create(this.BODY_TEMPLATE);
            contentBox.append(body);
        }

        if (suite) {
            // This loop also populate the _groupNameIdMap and _testNameIdMap
            // properties.
            for (groupName in suite.groups) {
                if (!Obj.owns(suite.groups, groupName)) {
                    continue;
                }

                group = suite.groups[groupName];

                if (!this._groupNameIdMap[groupName]) {
                    this._groupNameIdMap[groupName] = group.id;
                }

                for (testName in group.tests) {
                    if (!Obj.owns(group.tests, testName) ||
                            this._testNameIdMap[testName]) {
                        continue;
                    }

                    // Test name is unique; add it.
                    this._testNameIdMap[testName] = group.tests[testName].id;
                }
            }

            // Append test names to the body, with placeholder columns for
            // groups.            
            Obj.each(this._testNameIdMap, function (testId, testName) {
                var result = Node.create(Y.substitute(
                    this.RESULT_TEMPLATE,
                    {id: testId, name: testName}
                ));

                Obj.each(this._groupNameIdMap, function (groupId) {
                    result.append(Y.substitute(
                        this.RESULT_GROUP_TEMPLATE,
                        {id: groupId}
                    ));
                }, this);

                body.append(result);
            }, this);
        }
    },

    _renderHeader: function (contentBox, suite) {
        var head = contentBox.one(this.SELECTOR_HEADER),
            tr;

        if (head) {
            this._clearHeader();
        } else {
            // Render a new header.
            head = Node.create(this.HEADER_TEMPLATE);
            contentBox.append(head);
        }

        if (suite) {
            tr = head.one('tr');

            // Append group names to the header.
            Obj.each(suite.groups, function (group, name) {
                tr.append(Y.substitute(
                    this.HEADER_GROUP_TEMPLATE,
                    {name: this._htmlEntities(name)}
                ));
            }, this);
        }
    },

    _renderResult: function (resultData, test, group) {
        var resultNode = Y.one('#' + this._testNameIdMap[resultData.name]),
            groupNode  = resultNode && resultNode.one('.groupId-' + this._groupNameIdMap[group.name]),
            median     = resultData.median,
            medianDev  = median !== '' ? '&plusmn;' + resultData.mediandev : '';

        if (!resultNode || !groupNode) {
            Y.log('Result node or group node not found.', 'warn', 'performance-report-comparison');
            return;
        }

        if (resultData.failures) {
            groupNode.addClass('fail');
            groupNode.set('innerHTML', 'failed');
        } else {
            groupNode.removeClass('empty');
            groupNode.set('innerHTML', Y.substitute(
                this.RESULT_GROUP_CONTENT_TEMPLATE,
                {
                    median   : median,
                    mediandev: medianDev
                }
            ));
        }
    },

    // -- Protected Event Handlers ---------------------------------------------
    _afterStart: function (e) {
        var contentBox = this.get(CONTENT_BOX);

        this._renderHeader(contentBox, e.suite);
        this._renderBody(contentBox, e.suite);

        contentBox.addClass('running');
    },

    _onResultClick: function (e) {
        // e.currentTarget.next('tr.code').toggleClass('hidden');
    }
}, {
    // -- Public Static Constants ----------------------------------------------
    NAME: 'comparisonReport',
    ATTRS: {}
});

Y.namespace('PerformanceReport').Comparison = Comparison;

}, '@VERSION@', {
    requires: ['performance-report']
});
