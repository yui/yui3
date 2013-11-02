YUI.add('datatable-body-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Body");

suite.add(new Y.Test.Case({
    name: "datatable-body",

    "test non-DataTable construction": function () {
        var view = new Y.DataTable.BodyView({
            modelList: new Y.ModelList().reset([{ a: 1 }]),
            columns: [{ key: 'a' }]
        });

        Y.Assert.isInstanceOf(Y.DataTable.BodyView, view);
    }

}));

suite.add(new Y.Test.Case({
    name: "getCell",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            container: Y.Node.create('<table></table>'),
            columns: [
                { key: 'a', formatter: '<em>{value}</em>', allowHTML: true },
                { key: 'b' },
                { key: 'c' }
            ],
            modelList: new Y.ModelList().reset([
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "getCell([row, col]) should return <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell([0,0])));
    },

    "getCell(tdNode) should return <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('td'))));
    },

    "getCell(childNode) should return <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('em'))));
    },

    "getCell([row, col], shiftString) should return relative <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell([1,0], 'above')));
        Y.Assert.isTrue(this.view.tbodyNode.all('tr').item(1).one('td').compareTo(
            this.view.getCell([0,0], 'below')));
        Y.Assert.isTrue(this.view.tbodyNode.one('td').next().compareTo(
            this.view.getCell([0,0], 'next')));
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell([0,1], 'previous')));
    },

    "getCell(tdNode, shiftString) should return the relative <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.all('tr').item(1).one('td'),
                'above')));

        Y.Assert.isTrue(this.view.tbodyNode.all('tr').item(1).one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('td'), 'below')));

        Y.Assert.isTrue(this.view.tbodyNode.one('td').next().compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('td'), 'next')));

        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.all('td').item(1), 'previous')));
    },

    "getCell(childNode, shiftString) should return the relative <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.all('tr').item(1).one('em'),
                'above')));

        Y.Assert.isTrue(this.view.tbodyNode.all('tr').item(1).one('td').compareTo(
            this.view.getCell(
                this.view.tbodyNode.one('em'), 'below')));
    },

    "getCell([row, col], shiftArray) should return relative <td>": function () {
        Y.Assert.isTrue(this.view.tbodyNode.all('td').item(2).compareTo(
            this.view.getCell([1, 0], [-1, 2])));
    },

    "getCell(tdNode, shiftArray) should return the relative <td>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.all('tr').item(1).all('td').item(2).compareTo(
                this.view.getCell(
                    this.view.tbodyNode.one('td'), [1, 2])));
    },

    "getCell(childNode, shiftArray) should return the relative <td>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.all('tr').item(1).all('td').item(2).compareTo(
                this.view.getCell(
                    this.view.tbodyNode.one('em'), [1, 2])));
    }
}));

suite.add(new Y.Test.Case({
    name: "getRow",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            container: Y.Node.create('<table></table>'),
            columns: [
                { key: 'a', formatter: '<em>{value}</em>', allowHTML: true },
                { key: 'b' },
                { key: 'c' }
            ],
            modelList: new Y.ModelList().reset([
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "getRow(index) should return <tr>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.one('tr').compareTo(
                this.view.getRow(0)));

        Y.Assert.isTrue(
            this.view.tbodyNode.all('tr').item(1).compareTo(
                this.view.getRow(1)));
    },

    "getRow(model) should return the <tr>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.one('tr').compareTo(
                this.view.getRow(this.view.get('modelList').item(0))));
    },

    "getRow(model.clientId) should return the <tr>": function () {
        Y.Assert.isTrue(
            this.view.tbodyNode.one('tr').compareTo(
                this.view.getRow(this.view.get('modelList').item(0).get('clientId'))));
    }

}));

suite.add(new Y.Test.Case({
    name: "getRecord",

    _should: {
        ignore: {
            // handled by Core
            "getRecord(index) should return modelList.item(index)": true,
            "getRecord(model.id) should return the corresponding Model": true,
            "getRecord(model.clientId) should return the corresponding Model": true
        }
    },

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            container: Y.Node.create('<table></table>'),
            columns: [
                { key: 'a', formatter: '<em>{value}</em>', allowHTML: true },
                { key: 'b' },
                { key: 'c' }
            ],
            modelList: new Y.ModelList().reset([
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "getRecord(node) should return the corresponding Model": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(
                this.view.tbodyNode.one('tr')));
    },

    "getRecord(childNode) should return the corresponding Model": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(
                this.view.tbodyNode.one('em')));
    },

    "getRecord(rowId) should return the corresponding Model": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(
                this.view.tbodyNode.one('tr').get('id')));
    },

    "getRecord(childElId) should return the corresponding Model": function () {
        var guid = Y.guid();

        this.view.tbodyNode.one('em').set('id', guid);

        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(guid));
    },

    "getRecord(index) should return modelList.item(index)": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0), this.view.getRecord(0));

        Y.Assert.areSame(this.view.get('modelList').item(1), this.view.getRecord(1));
    },

    "getRecord(model.id) should return the corresponding Model": function () {
        var M = Y.Base.create('testModel', Y.Model, [], {
                idAttribute: 'a'
            }, {
                ATTRS: {
                    a: {},
                    b: {},
                    c: {}
                }
            }),
            table = new Y.DataTable.BodyView({
                container: Y.Node.create('<table></table>'),
                columns: [
                    { key: 'a' },
                    { key: 'b' },
                    { key: 'c' }
                ],
                modelList: new Y.ModelList({ model: M }).reset([
                    { a: 1, b: 1, c: 1 },
                    { a: 2, b: 2, c: 2 },
                    { a: 3, b: 3, c: 3 }
                ])
            });

        // For proper cleanup
        this.view.destroy();
        this.view = table;

        Y.Assert.areSame(table.get('modelList').item(0), table.getRecord('a1'));
    },

    "getRecord(model.clientId) should return the corresponding Model": function () {
        Y.Assert.areSame(this.view.get('modelList').item(0),
            this.view.getRecord(
                this.view.get('modelList').item(0).get('clientId')));
    }

}));

suite.add(new Y.Test.Case({
    name: "columns attribute",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            container: Y.Node.create('<table></table>'),
            columns: [
                { key: 'a',
                  formatter: '<em id="em{value}">{value}</em>',
                  allowHTML: true
                },
                { key: 'b',
                  emptyCellValue: 'EMPTY',
                  formatter: function (o) {
                    o.rowClass += 'testRowClass';
                    o.className += 'testCellClass';
                  }
                },
                { key: 'c',
                  nodeFormatter: function (o) {
                    o.cell
                        .addClass('testCellClass')
                        .setContent(o.value)
                        .ancestor()
                            .addClass('testRowClass2');

                    return false;
                  }
                },
                { key: 'd' },
                { key: 'e',
                  formatter:'{a},{b}'
                },
                { key: 'f', formatter:'currency'},
                { key: 'g', formatter:'currency', currencyFormat: {
                    decimalPlaces:2,
                    decimalSeparator: ",",
                    thousandsSeparator: ",",
                    suffix: "€"
                }}
            ],
            modelList: new Y.ModelList().reset([
                { a: 'a1', b: 'b1', c: 'c1', d: 'd1', f: 123.45 , g: 123.45},
                { a: 'a2',          c: 'c2', d: 'd2', f: 678    , g: 678   }
            ])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },
    "string formatter should follow the template": function () {
        var view = this.view,
            node = view.getCell([0,0]),
            content = node.get('firstChild');
        Y.Assert.areSame('ema1', content.get('id'));
        Y.Assert.areSame('a1', content.getHTML());
        node = view.getCell([0,4]);
        Y.Assert.areSame('a1,b1', node.getHTML());
    },

    "formatter adding to o.className should add to cell classes": function () {
        var view = this.view,
            node = view.tbodyNode.one('.' + view.getClassName('col', 'b'));

        Y.Assert.isTrue(node.hasClass('testCellClass'));
        Y.Assert.areSame('b1', node.get('text'));
    },

    "formatter adding to o.rowClass should add to row classes": function () {
        var node = this.view.tbodyNode.one('tr');

        Y.Assert.isTrue(node.hasClass('testRowClass'));
    },

    "nodeFormatter should be able to add classes to o.cell": function () {
        var view = this.view,
            node = view.tbodyNode.one('.' + view.getClassName('col', 'c'));

        Y.Assert.isTrue(node.hasClass('testCellClass'));
        Y.Assert.areSame('c1', node.get('text'));
    },

    "nodeFormatter should be able to add row classes from o.cell.ancestor()": function () {
        var node = this.view.tbodyNode.one('tr');

        Y.Assert.isTrue(node.hasClass('testRowClass2'));
    },

    "emptyCellValue should apply for missing, null, or empty string values": function () {
        var view = this.view,
            node = view.tbodyNode
                    .all('.' + view.getClassName('col', 'b'))
                    .item(1);

        Y.Assert.areSame('EMPTY', node.get('text'));
    },

    "changing columns config propagates to the UI": function () {
        var view      = this.view,
            tbody     = view.tbodyNode,
            className = '.' + view.getClassName('cell');

        Y.Assert.areSame(14, tbody.all(className).size());

        this.view.set('columns', [{ key: 'd' }]);

        Y.Assert.areSame(2, tbody.all(className).size());
    },
    "testing node formatters": function () {
        var view = this.view,
            node = view.getCell([0,5]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-currency'));
        Y.Assert.areEqual('123.45', node.getHTML());
        node = view.getCell([0,6]);
        Y.Assert.areEqual('123,45€', node.getHTML());

    }
}));

suite.add(new Y.Test.Case({
    name: "default format specs",
    setUp: function () {
        this.dateFormatTime = new Date();
        this.dt = new Y.DataTable({
            columns:[
                {key: 'a', formatter:'currency', currencyFormat: {
                    decimalPlaces:2,
                    decimalSeparator: 'd',
                    thousandsSeparator: 't',
                    prefix: 'p',
                    suffix: 's'
                }},
                {key: 'b', formatter:'currency', emptyCellValue:'no charge'},
                {key: 'button', formatter: 'button', buttonLabel:'press me'},
                {key: 'boolean', formatter: 'boolean', booleanLabels: {
                        'true': 'yes',
                        'false': 'no'
                }},
                {key: 'date', formatter: 'date'},
                {key: 'localDate', formatter: 'localDate', emptyCellValue:'never'},
                {key: 'localTime', formatter: 'localTime'},
                {key: 'localDateTime', formatter: 'localDateTime'},
                {key: 'email', formatter: 'email', linkFrom: 'linkSrc'},
                {key: 'link', formatter: 'link', linkFrom: 'linkSrc'},
                {key: 'number', formatter: 'number',numberFormat: {
                    decimalPlaces:2,
                    decimalSeparator: 'd',
                    thousandsSeparator: 't',
                    prefix: 'p',
                    suffix: 's'
                }},
                {key: 'lookup', formatter: 'lookup', lookupTable: [
                    {value: undefined, text: 'unknown'},
                    {value: 0, text: 'zero'},
                    {value: 1, text: 'one'},
                    {value: 2, text: 'two'},
                    {value: 3, text: 'three'},
                    {value: 4, text: 'four'}
                ]},
                {key: 'lookup1', formatter: 'lookup', lookupTable: {
                    undefined: 'unknown',
                    0: 'zero',
                    1: 'one',
                    2: 'two',
                    3: 'three',
                    4: 'four'
                }}

            ],
            data: [
                {
                    a: 123.45, b: 123.45, button:'btn', 'boolean': true, 'date': new Date(),
                    localDate: new Date(), localTime: new Date(), localDateTime: new Date(),
                    email: 'me', link: 'site', linkSrc: 'there', number: 987654,
                    lookup: 1, lookup1: 1
                },
                {a: 6789,   b: 6789  , email: 'me', link: 'site',              'boolean': false,
                    lookup:3, lookup1:3 },
                {}
            ],
            currencyFormat: {
                decimalPlaces:1,
                decimalSeparator: ",",
                thousandsSeparator: ".",
                suffix: " Pts."
            }
        }).render();
    },
    tearDown: function () {
        this.dt.destroy();
    },
    "test currency format": function () {
        var dt = this.dt,
            node = dt.getCell([0,0]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-currency'));
        Y.Assert.areEqual('p123d45s', node.getHTML());

        node = dt.getCell([0,1]);
        Y.Assert.areEqual('123,5 Pts.', node.getHTML());  // rounded up
        node = dt.getCell([1,0]);
        Y.Assert.areEqual('p6t789d00s', node.getHTML());
        node = dt.getCell([1,1]);
        Y.Assert.areEqual('6.789,0 Pts.', node.getHTML());
        node = dt.getCell([2, 0]);
        Y.Assert.areEqual('', node.getHTML());
        node = dt.getCell([2, 1]);
        Y.Assert.areEqual('no charge', node.getHTML());
    },
    "test button format": function () {
        var dt = this.dt,
            node = dt.getCell([0,2]),
            content = node.get('firstChild');
        Y.Assert.isTrue(node.hasClass('yui3-datatable-button'));
        Y.Assert.areEqual('BUTTON', content.get('tagName').toUpperCase());
        Y.Assert.areEqual('press me', content.getHTML());
    },
    "test boolean format": function () {
        var dt = this.dt,
            node = dt.getCell([0,3]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-true'));
        Y.Assert.areEqual('yes',node.getHTML());
        node = dt.getCell([1,3]),
        Y.Assert.isTrue(node.hasClass('yui3-datatable-false'));
        Y.Assert.areEqual('no',node.getHTML());
        node = dt.getCell([2,3]);
        Y.Assert.areEqual('', node.getHTML());
    },
    "test date formats": function () {
        var dt = this.dt,
            node = dt.getCell([0,4]),
            testNode = document.createElement('td'),
            isIE = Y.UA.ie && Y.UA.ie < 9,
            getTestText = function(val) {
                if(isIE) {
                    testNode.innerHTML = Y.Escape.html(val);
                    val = testNode.innerHTML;
                }
                return val;
            };

        Y.Assert.isTrue(node.hasClass('yui3-datatable-date'));
        Y.Assert.areEqual(getTestText(Y.Date.format(this.dateFormatTime)), node.getHTML());

        node = dt.getCell([0,5]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-date'));
        Y.Assert.areEqual(getTestText(Y.Date.format(this.dateFormatTime,{format:'%x'})), node.getHTML());

        node = dt.getCell([0,6]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-date'));
        Y.Assert.areEqual(getTestText(Y.Date.format(this.dateFormatTime,{format:'%X'})), node.getHTML());

        node = dt.getCell([0,7]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-date'));
        Y.Assert.areEqual(getTestText(Y.Date.format(this.dateFormatTime,{format:'%c'})), node.getHTML());

        node = dt.getCell([2,4]);
        Y.Assert.areEqual('', node.getHTML());
        node = dt.getCell([2,5]);
        Y.Assert.areEqual('never', node.getHTML());
    },
    "test email format": function () {
        var dt = this.dt,
            node = dt.getCell([0,8]),
            content = node.get('firstChild');
        Y.Assert.isTrue(node.hasClass('yui3-datatable-email'));
        Y.Assert.areEqual('A', content.get('tagName').toUpperCase());
        Y.Assert.areEqual('me', content.getHTML());
        Y.Assert.areEqual('mailto:there', content.get('href'));

        node = dt.getCell([1,8]);
        Y.Assert.areEqual('me', node.getHTML());
        node = dt.getCell([2,8]);
        Y.Assert.areEqual('', node.getHTML());
    },
    "test link format": function () {
        var dt = this.dt,
            node = dt.getCell([0,9]),
            content = node.get('firstChild');
        Y.Assert.isTrue(node.hasClass('yui3-datatable-link'));
        Y.Assert.areEqual('A', content.get('tagName').toUpperCase());
        Y.Assert.areEqual('site', content.getHTML());
        Y.Assert.isTrue(/\/there$/.test(content.get('href')));
        node = dt.getCell([1,9]);
        Y.Assert.areEqual('site', node.getHTML());
        node = dt.getCell([2,9]);
        Y.Assert.areEqual('', node.getHTML());
    },
    "test number format": function () {
        var dt = this.dt,
            node = dt.getCell([0,10]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-number'));
        Y.Assert.areEqual('p987t654d00s', node.getHTML());
        node = dt.getCell([2, 0]);
        Y.Assert.areEqual('', node.getHTML());
    },
    "test lookup format": function () {
        var dt = this.dt,
            node = dt.getCell([0,11]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-lookup'));
        Y.Assert.areEqual('one', node.getHTML());
        node = dt.getCell(node, 'below');
        Y.Assert.areEqual('three', node.getHTML());
        node = dt.getCell(node, 'below');
        Y.Assert.areEqual('unknown', node.getHTML());

        node = dt.getCell([0,12]);
        Y.Assert.isTrue(node.hasClass('yui3-datatable-lookup'));
        Y.Assert.areEqual('one', node.getHTML());
        node = dt.getCell(node, 'below');
        Y.Assert.areEqual('three', node.getHTML());
        node = dt.getCell(node, 'below');
        Y.Assert.areEqual('unknown', node.getHTML());
    }
}));


suite.add(new Y.Test.Case({
    name: "getClassName",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<table></table>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        this.view.destroy();
    },

    "test standalone getClassName()": function () {
        Y.Assert.areSame('yui3-tableBody-foo', this.view.getClassName('foo'));
        Y.Assert.areSame('yui3-tableBody-foo-bar',
            this.view.getClassName('foo', 'bar'));
    },

    "test host-relayed getClassName()": function () {
        this.view.host = {
            getClassName: function () {
                return arguments.length;
            }
        };

        Y.Assert.areSame(1, this.view.getClassName('foo'));
        Y.Assert.areSame(2, this.view.getClassName('foo', 'bar'));
    }
}));

suite.add(new Y.Test.Case({
    name: "modelList changes",

    setUp: function () {
        this.view = new Y.DataTable.BodyView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<table></table>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        }).render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "replacing the modelList should update UI": function () {
        this.view.set('modelList', new Y.ModelList().reset([{ a: 5 }]));

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    },

    // Ref Ticket #2532523
    "changes to the modelList after replacing it should update the UI": function () {
        this.view.set('modelList', new Y.ModelList().reset([{ a: 5 }]));

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));

        this.view.get('modelList').item(0).set('a', 10);

        Y.Assert.areSame('10', this.view.tbodyNode.one('td').get('text'));
    },

    "reset()ing the modelList should update UI": function () {
        this.view.get('modelList').reset([{ a: 5 }]);

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    },

    "adding Models to the modelList should update UI": function () {
        this.view.get('modelList').add([{ a: 5 }]);

        Y.Assert.areSame('5', this.view.tbodyNode.all('td').item(1).get('text'));
    },

    "should be able to add data to model which may not exist as a column": function () {
        this.view.get('modelList').item(0).set('x', 1337);
        Y.Assert.areSame(1337, this.view.get('modelList').item(0).get("x"));
    },

    "removing Models from the modelList should update UI": function () {
        var modelList = this.view.get('modelList'),
            model;

        modelList.add([ { a: 2 }, { a: 3 }, { a: 4 } ]);

        modelList.item(2).destroy();

        Y.Assert.areSame(3, this.view.tbodyNode.all('tr').size());
    },

    "changing Model attributes should update UI": function () {
        this.view.get('modelList').item(0).set('a', 5);

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    }
}));

suite.add(new Y.Test.Case({
    name: "modelList changes should only refresh cell contents that are changed",

    setUp: function () {
        this.makeRow = function (index) {
            return { a: index, b: index, c: index };
        },
        this.view = new Y.DataTable.BodyView({
            columns: [{key:'a'}, {key:'b'}, {key:'c'}],
            container: Y.Node.create('<table></table>'),
            modelList: new Y.ModelList().reset([{ a: 1, b: 1, c: 2 }])
        });
        this.view.render();
    },

    tearDown: function () {
        this.view.destroy();
    },

    "replacing the modelList should update UI": function () {
        var td = this.view.tbodyNode.one('td');
        this.view.set('modelList', new Y.ModelList().reset([this.makeRow(5)]));

        Y.Assert.areNotSame(td, this.view.tbodyNode.one('td'));
        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    },

    "changes to the modelList after replacing it should update the UI but not change the nodes": function () {
        this.view.set('modelList', new Y.ModelList().reset([this.makeRow(5)]));

        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));

        var td = this.view.tbodyNode.one('td');
        this.view.get('modelList').item(0).set('a', 10);

        Y.Assert.areSame(td, this.view.tbodyNode.one('td'));
        Y.Assert.areSame('10', this.view.tbodyNode.one('td').get('text'));
    },

    "reset()ing the modelList should update UI": function () {
        var td = this.view.tbodyNode.one('td');
        this.view.get('modelList').reset([this.makeRow(5)]);

        Y.Assert.areNotSame(td, this.view.tbodyNode.one('td'));
        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    },

    "adding Models to the modelList should update UI but not change the existing cells": function () {
        var td = this.view.tbodyNode.one('td');
        this.view.get('modelList').add([this.makeRow(5)]);

        Y.Assert.areSame(td, this.view.tbodyNode.one('td'));
        Y.Assert.areSame('5', this.view.tbodyNode.all('td').item(4).get('text'));
    },

    "removing Models from the modelList should update UI but not change the existing cells": function () {
        var td = this.view.tbodyNode.one('td');
        var modelList = this.view.get('modelList'),
            model;

        modelList.add([ this.makeRow(2), this.makeRow(3), this.makeRow(4) ]);

        modelList.item(2).destroy();

        Y.Assert.areSame(td, this.view.tbodyNode.one('td'));
        Y.Assert.areSame(3, this.view.tbodyNode.all('tr').size());
    },

    "changing Model attributes should update UI but not change the existing cells": function () {
        var td = this.view.tbodyNode.one('td');
        this.view.get('modelList').item(0).set('a', 5);

        Y.Assert.areSame(td, this.view.tbodyNode.one('td'));
        Y.Assert.areSame('5', this.view.tbodyNode.one('td').get('text'));
    },

    "changing Model should file change event": function () {
        var test = this,
            v = this.view;

        v.after('contentUpdate', function (e) {
            Y.Assert.areSame('tableBody:contentUpdate', e.type);
        });

        v.get('modelList').item(0).set('a', 5);
    }


}));


suite.add(new Y.Test.Case({
    name: "clientId",

    "Row 'record' should match the clientId of the model": function () {
        var container = Y.Node.create('<table/>'),

            table = new Y.DataTable.BodyView({
                columns: [
                    { key: 'a' },
                    { key: 'clientId' }
                ],
                container: container,
                modelList: new Y.ModelList().reset([
                    { a: 1, b: 1 },
                    { a: 2, b: 2 }
                ])
            });

        table.render();

        Y.one('body').append(container);

        container.all('tr').each(function (row, index) {
            var record = row.getData('yui3-record'),
                model = table.get('modelList').item(index);

            // check model clientIds against row's stored record
            Y.Assert.areSame(model.get('clientId'), record);
        });

        table.destroy({ remove: true });
    }
}));



/*
suite.add(new Y.Test.Case({
    name: "destroy",

    tearDown: function () {
        if (this.view) {
            this.view.destroy();
        }
    },

    "destroying the bodyView instance should prevent further changes propagating to the UI": function () {
        var view = this.view = new Y.DataTable.BodyView({
            columns: [ 'a' ],
            data: [{ a: 1, b: 1 }]
        }).render();

        Y.Assert.areSame(1, table.tbodyNode.all('td').size());

        table.body.destroy();

        table.set('columns', ['a', 'b']);

        Y.Assert.areSame(1, table.tbodyNode.all('td').size());
    }
}));
*/

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-base','datatable-formatters', 'test']});
