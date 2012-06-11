var suite = new Y.Test.Suite("datatable-base");

suite.add(new Y.Test.Case({
    name: "DataTable.Base tests",

    setUp: function () {
        this.table = new Y.DataTable.Base();
    },

    "DataTable.Base should implement Core": function () {
        Y.assert(this.table.hasImpl(Y.DataTable.Core));
    },

    "DataTable.Base should set default view": function () {
        Y.Assert.isFunction(this.table.get('view'));
    },

    "DataTable.Base should preserve properties on the namespace": function () {
        var assert = Y.Assert;

        YUI.add('test-dt-namespace-is-preserved', function (Y) {
            assert.isUndefined(Y.DataTable);
            Y.namespace('DataTable').testProperty = true;
        });

        YUI().use('test-dt-namespace-is-preserved', function (Y) {
            assert.isObject(Y.DataTable);
            assert.isFalse(Y.Lang.isFunction(Y.DataTable));

            Y.use('datatable-base', function () {
                assert.isFunction(Y.DataTable);
                assert.isFunction(Y.DataTable.Base);
                assert.isTrue(Y.DataTable.testProperty);
            });
        });
    }
}));

suite.add(new Y.Test.Case({
    name: "DataTable tests",

    setUp: function () {
        this.table = new Y.DataTable();
    },

    "DataTable should implement Core": function () {
        Y.assert(this.table.hasImpl(Y.DataTable.Core));
    },

    "DataTable should be a subclass of Y.DataTable.Base": function () {
        Y.assert(this.table.hasImpl(Y.DataTable.Core));
    },

    "DataTable should default view": function () {
        Y.Assert.isFunction(this.table.get('view'));
    }
}));

suite.add(new Y.Test.Case({
    name: "DataTable UI tests",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: ['a', 'b', 'c'],
            data: [{ a: 1, b: 1, c: 1 }]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "set('data', modelList) should update the table": function () {
        var model = Y.Base.create('test-model', Y.Model, [], {}, {
                        ATTRS: { a: {}, b: {}, c: {} } }),
            table = this.table,
            modelList = new Y.ModelList(),
            fired;

        table.render();

        Y.Assert.isInstanceOf(Y.ModelList, table.data);
        Y.Assert.areSame(1, table.data.item(0).get('a'));

        table.after('dataChange', function (e) {
            Y.Assert.areSame(modelList, e.newVal);
            fired = true;
        });

        modelList.model = model;
        modelList.add([{ a: 2, b: 2, c: 2 }]);

        table.set('data', modelList);

        Y.Assert.areSame(modelList, table.data);
        Y.Assert.areSame(2, table.data.item(0).get('a'));
        Y.Assert.isTrue(fired);

        Y.Assert.areSame('2', table.get('contentBox')
            .one('.yui3-datatable-cell').get('text'));

        table.destroy();
    },

    "set(<core attr>, newVal) should relay to view": function () {
        var table = new Y.DataTable({
                    columns: ['a', 'b', 'c'],
                    data: this.data,
                    view: Y.View
                }).render(),
            fired = {};

        table.view.after([
            'columnsChange', 'modelListChange', 'summaryChange',
            'captionChange', 'widthChange'],
            function (e) {
                fired[e.attrName] = true;
            });

        table.set('columns', ['d', 'e', 'f']);
        table.set('data',    new Y.ModelList().reset([{ d: 1, e: 1, f: 1 }]));
        table.set('summary', 'new text');
        table.set('caption', 'new text');
        table.set('width',   '1000px');

        Y.Assert.isTrue(fired.columns);
        Y.Assert.isTrue(fired.modelList);
        Y.Assert.isTrue(fired.summary);
        Y.Assert.isTrue(fired.caption);
        Y.Assert.isTrue(fired.width);
    }
}));

suite.add(new Y.Test.Case({
    name: "delegate",

    "test table.delegate() pases through to node.delegate()": function () {
        var table = new Y.DataTable({ data: [{a:1}] }),
            hold = Y.delegate,
            pass;

        Y.delegate = function () {
            pass = true;
        };

        table.render();

        table.delegate('click', function () {}, '.test-yes');

        Y.delegate = hold;

        table.destroy();

        Y.Assert.isTrue(pass);
    }
}));

suite.add(new Y.Test.Case({
    name: "getCell",

    "test getCell() passes through to view": function () {
        var pass = {},
            table = new Y.DataTable({
                view: Y.Base.create('testView', Y.View, [], {
                    getCell: function () {
                        return pass;
                    }
                })
            }).render(),
            result = table.getCell('testing');

        table.destroy();

        Y.Assert.areSame(pass, result);
    }
}));

suite.add(new Y.Test.Case({
    name: "getRow",

    "test getRow() passes through to view": function () {
        var pass = {},
            table = new Y.DataTable({
                view: Y.Base.create('testView', Y.View, [], {
                    getRow: function () {
                        return pass;
                    }
                })
            }).render(),
            result = table.getRow('testing');

        table.destroy();

        Y.Assert.areSame(pass, result);
    }
}));

suite.add(new Y.Test.Case({
    name: "getRecord",

    tearDown: function () {
        this.table && this.table.destroy();
    },

    "test getRecord(unknown) passes through to view": function () {
        var pass = {},
            table = new Y.DataTable({
                view: Y.Base.create('testView', Y.View, [], {
                    getRecord: function () {
                        return pass;
                    }
                })
            }).render(),
            result = table.getRecord('testing');

        table.destroy();

        Y.Assert.areSame(pass, result);
    }
}));

suite.add(new Y.Test.Case({
    name: "render",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: ['a', 'b', 'c'],
            data: [
                { a: 1, b: 1, c: 1 },
                { a: 2, b: 2, c: 2 },
                { a: 3, b: 3, c: 3 }
            ]
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "render() should fire the renderView event": function () {
        var pass;

        this.table.on('renderView', function () { pass = true; });

        this.table.render();

        Y.Assert.isTrue(pass);
    },

    "render() should fire renderView if view is set": function () {
        var pass;

        this.table.set('view', Y.View).on('renderView', function () {
            pass = true;
        });

        this.table.render();

        Y.Assert.isTrue(pass);
    },

    "render() should bubble renderX events from view": function () {
        var pass = {},
            body = Y.one('body'),
            sectionView = {
                get: function () { return Y.one('body'); }
            };

        this.table.set('view', Y.Base.create('table', Y.View, [], {
            render: function () {
                this.fire('renderHeader', { view: sectionView });
                this.fire('renderFooter', { view: sectionView });
                this.fire('renderBody', { view: sectionView });
            }
        })).on(['table:renderHeader', 'table:renderFooter', 'table:renderBody'],
            function (e) {
                pass[e.type.slice(e.type.lastIndexOf(':') + 1)] = true;
            });

        this.table.render();

        Y.Assert.isTrue(pass.renderHeader);
        Y.Assert.isTrue(pass.renderFooter);
        Y.Assert.isTrue(pass.renderBody);
    }
}));

suite.add(new Y.Test.Case({
    name: "syncUI",

    setUp: function () {
        this.table = new Y.DataTable({
            columns: ['a'],
            data: [{ a: 1 }],
            view: Y.Base.create('table', Y.View, [], {
                count: 0,
                render: function () { this.count++; }
            })
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "syncUI should call render() on the view": function () {
        this.table.render();

        Y.Assert.areSame(1, this.table.view.count);

        this.table.syncUI();

        Y.Assert.areSame(2, this.table.view.count);
    }
}));

suite.add(new Y.Test.Case({
    name: "get",

    setUp: function () {
        this.Table = Y.Base.create('datatable', Y.DataTable.Base, [], {}, {
            ATTRS: {
                dtAttr: { value: true },
                dtObj: {
                    valueFn: function () {
                        return { property: true };
                    }
                }
            }
        });

        this.View = Y.Base.create('table', Y.View, [], {
            render: function () {}
        }, {
            ATTRS: {
                viewAttr: { value: true }
            }
        });

        this.table = new this.Table({
            columns: ['a'],
            data: [{ a: 1 }],
            view: this.View
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "table.get(known) should pull from DT attrs": function () {
        Y.Assert.isTrue(this.table.get('dtAttr'));
    },

    "table.get(known.subattr) should pull from DT attrs": function () {
        Y.Assert.isTrue(this.table.get('dtObj.property'));
    },

    "table.get(unknown) should pull from viewConfig before rendered": function () {
        Y.Assert.isUndefined(this.table.get('viewAttr'));

        this.table.destroy();

        this.table = new this.Table({
            columns: ['a'],
            data: [{ a: 1 }],
            view: this.View,
            viewConfig: {
                unknown: true
            }
        });

        Y.Assert.isTrue(this.table.get('unknown'));
    },

    "table.get(unknown) should pull from view after rendered": function () {
        this.table.render();

        Y.Assert.isTrue(this.table.get('viewAttr'));
    },

    "test table.getAttrs([known, unknown])": function () {
        var vals = this.table.getAttrs(['dtAttr', 'dtObj.property', 'viewAttr']);

        Y.Assert.isObject(vals);
        Y.Assert.isTrue(vals.dtAttr);
        Y.Assert.isTrue(vals['dtObj.property']);
        Y.Assert.isUndefined(vals.viewAttr);

        this.table.render();

        vals = this.table.getAttrs(['dtAttr', 'dtObj.property', 'viewAttr']);

        Y.Assert.isObject(vals);
        Y.Assert.isTrue(vals.dtAttr);
        Y.Assert.isTrue(vals['dtObj.property']);
        Y.Assert.isTrue(vals.viewAttr);
    }
}));

suite.add(new Y.Test.Case({
    name: "set",

    setUp: function () {
        this.Table = Y.Base.create('datatable', Y.DataTable.Base, [], {}, {
            ATTRS: {
                dtAttr: { value: false },
                dtObj: {
                    valueFn: function () {
                        return { property: false };
                    }
                }
            }
        });

        this.View = Y.Base.create('table', Y.View, [], {
            render: function () {}
        }, {
            ATTRS: {
                viewAttr: { value: false }
            }
        });

        this.table = new this.Table({
            columns: ['a'],
            data: [{ a: 1 }],
            view: this.View
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "table.set(known) should assign DT attr": function () {
        this.table.set('dtAttr', true);

        Y.Assert.isTrue(this.table._state.get('dtAttr', 'value'));
    },

    "table.set(known.subattr) should assign DT attr": function () {
        this.table.set('dtObj.property', true);

        Y.Assert.isTrue(this.table._state.get('dtObj', 'value').property);
    },

    "table.set(unknown) should assign to viewConfig before render()": function () {
        this.table.set('unknown', true);

        Y.Assert.isTrue(this.table.get('viewConfig').unknown);
    },

    "table.set(unknown) should assign to view after render()": function () {
        this.table.render();

        this.table.set('viewAttr', true);

        Y.Assert.isTrue(this.table.view.get('viewAttr'));
    },

    "test table.setAttrs({ known: val, unknown: val })": function () {
        this.table.setAttrs({
            dtAttr: true,
            unknown: true
        });

        Y.Assert.isTrue(this.table.get('dtAttr'));
        Y.Assert.isTrue(this.table.get('viewConfig').unknown);

        this.table.render();

        this.table.setAttrs({
            dtAttr: false,
            viewAttr: true
        });

        Y.Assert.isFalse(this.table.get('dtAttr'));
        Y.Assert.isTrue(this.table.view.get('viewAttr'));
    }
}));

/*
suite.add(new Y.Test.Case({
    name: "destroy",

    "destroying the view instance should prevent further changes propagating to the UI": function () {
        var table = this.table = new Y.DataTable({
            columns: [ 'a' ],
            data: [{ a: 1, b: 1 }]
        }).render();

        Y.Assert.areSame(1, table._tbodyNode.all('td').size());

        table.body.destroy();

        table.set('columns', ['a', 'b']);

        Y.Assert.areSame(1, table._tbodyNode.all('td').size());
    }
}));
*/

Y.Test.Runner.add(suite);
