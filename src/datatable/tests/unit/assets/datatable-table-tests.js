YUI.add('datatable-table-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Table");

suite.add(new Y.Test.Case({
    name: "datatable-table",

    "test non-DataTable construction": function () {
        var view = new Y.DataTable.TableView({
            columns: [{ key: 'a' }]
        });

        Y.Assert.isInstanceOf(Y.DataTable.TableView, view);
    },

    "default bodyView should be DataTable.BodyView": function () {
        var table = new Y.DataTable.TableView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<div></div>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });

        Y.Assert.areSame(Y.DataTable.BodyView, table.get('bodyView'));

        table.render();

        Y.Assert.isInstanceOf(Y.DataTable.BodyView, table.body);

        table.destroy();
    },

    "default headerView should be DataTable.HeaderView": function () {
        var table = new Y.DataTable.TableView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<div></div>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });

        Y.Assert.areSame(Y.DataTable.HeaderView, table.get('headerView'));

        table.render();

        Y.Assert.isInstanceOf(Y.DataTable.HeaderView, table.head);

        table.destroy();
    },

    "default footerView should be undefined": function () {
        var table = new Y.DataTable.TableView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<div></div>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });

        Y.Assert.isUndefined(table.get('footerView'));

        table.destroy();
    }
}));

suite.add(new Y.Test.Case({
    name: "relayed APIs (getCell, getRow, etc)",

    _should: {
        ignore: {
            "test getColumn() passes through to bodyView": 'feature pending'
        }
    },

    setUp: function () {
        var cell, row, record, column;

        cell   = this.cell   = {};
        row    = this.row    = {};
        record = this.record = {};
        column = this.column = {};

        this.table = new Y.DataTable.TableView({
            modelList: new Y.ModelList().reset([{a:1}]),
            columns: [{ key: 'a' }],
            container: Y.Node.create('<div></div>'),
            bodyView: Y.Base.create('testView', Y.View, [], {
                getCell  : function () { return cell; },
                getRow   : function () { return row; },
                getRecord: function () { return record; },
                getColumn: function () { return column; }
            })
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test getCell() passes through to bodyView": function () {
        Y.Assert.areSame(this.cell, this.table.getCell('testing'));
    },

    "test getRow() passes through to bodyView": function () {
        Y.Assert.areSame(this.row, this.table.getRow('testing'));
    },

    "test getRecord() passes through to bodyView": function () {
        Y.Assert.areSame(this.record, this.table.getRecord('testing'));
    },

    "test getColumn() passes through to bodyView": function () {
        Y.Assert.areSame(this.column, this.table.getColumn('testing'));
    }
}));

suite.add(new Y.Test.Case({
    name: "getClassName",

    setUp: function () {
        this.table = new Y.DataTable.TableView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<div></div>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test standalone getClassName()": function () {
        Y.Assert.areSame('yui3-table-foo', this.table.getClassName('foo'));
        Y.Assert.areSame('yui3-table-foo-bar',
            this.table.getClassName('foo', 'bar'));
    },

    "test host-relayed getClassName()": function () {
        this.table.host = {
            getClassName: function () {
                return arguments.length;
            }
        };

        Y.Assert.areSame(1, this.table.getClassName('foo'));
        Y.Assert.areSame(2, this.table.getClassName('foo', 'bar'));
    }
}));

suite.add(new Y.Test.Case({
    name: "columns attribute",

    setUp: function () {
        this.table = new Y.DataTable.TableView({
            modelList: new Y.ModelList().reset([{ a:1, b: 2, c: 3 }]),
            container: Y.Node.create('<div></div>'),
            columns: [
                { key: 'a' },
                { label: 'formatters', children: [
                    { key: 'b' },
                    { key: 'c' }
                  ]
                }
            ],
            bodyView: Y.Base.create('testBody', Y.View, []),
            headerView: Y.Base.create('testHead', Y.View, []),
            footerView: Y.Base.create('testHead', Y.View, [])
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test nested columns are flattened into displayColumns": function () {
        var displayColumns = this.table.displayColumns,
            keys = [], i = displayColumns.length;

        while (i--) {
            keys[i] = displayColumns[i].key;
        }

        Y.Assert.areSame(3, displayColumns.length);
        Y.ArrayAssert.itemsAreSame(['a', 'b', 'c'], keys);
    },

    "test headerView is instantiated with full column array": function () {
        Y.Assert.areSame(
            this.table.get('columns'), this.table.head.get('columns'));
    },

    "test footerView is instantiated with full column array": function () {
        Y.Assert.areSame(
            this.table.get('columns'), this.table.foot.get('columns'));
    },

    "test bodyView is instantiated with displayColumns": function () {
        Y.Assert.areSame(
            this.table.displayColumns, this.table.body.get('columns'));
    },

    "test changing columns config propagates to the views": function () {
        var table = this.table,
            bodyChanged, headerChanged, footerChanged;

        table.body.after('columnsChange', function (e) {
            bodyChanged = true;
            Y.Assert.areSame(table.displayColumns, e.newVal);
        });
        table.head.after('columnsChange', function (e) {
            headerChanged = true;
            Y.Assert.areSame(table.get('columns'), e.newVal);
        });
        table.foot.after('columnsChange', function (e) {
            footerChanged = true;
            Y.Assert.areSame(table.get('columns'), e.newVal);
        });

        table.set('columns', [{ key: 'd' }, { key: 'e' }, { key: 'f' }]);

        Y.Assert.isTrue(bodyChanged);
        Y.Assert.isTrue(headerChanged);
        Y.Assert.isTrue(footerChanged);
    }
}));

suite.add(new Y.Test.Case({
    name: "caption attribute",

    setUp: function () {
        this.table = new Y.DataTable.TableView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<div></div>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    },

    "configured caption should render to DOM": function () {
        this.table.set('caption', 'caption content').render();

        var caption = this.table.get('container').one('caption');

        Y.Assert.isInstanceOf(Y.Node, caption);
        Y.Assert.areSame(caption, this.table.captionNode);
        Y.Assert.areSame('caption content', caption.get('text'));
    },

    "set('caption', null) should remove caption": function () {
        this.table.set('caption', 'caption content').render();

        this.table.set('caption', null);

        var caption = this.table.get('container').one('caption');

        Y.Assert.isNull(caption);
        Y.Assert.isUndefined(this.table.captionNode);
    },

    "set('caption', '') should remove caption": function () {
        this.table.set('caption', 'caption content').render();

        this.table.set('caption', '');

        var caption = this.table.get('container').one('caption');

        Y.Assert.isNull(caption);
        Y.Assert.isUndefined(this.table.captionNode);
    },

    "set('caption', newVal) should update DOM": function () {
        this.table.set('caption', 'caption content').render();

        this.table.set('caption', 'new caption text');

        var caption = this.table.get('container').one('caption');

        Y.Assert.isInstanceOf(Y.Node, caption);
        Y.Assert.areSame(caption, this.table.captionNode);
        Y.Assert.areSame('new caption text', caption.get('text'));
    }
}));

suite.add(new Y.Test.Case({
    name: "summary attribute",

    setUp: function () {
        this.table = new Y.DataTable.TableView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<div></div>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "configured summary should render to DOM": function () {
        this.table.set('summary', 'summary content').render();

        var summary = this.table.tableNode.getAttribute('summary');

        Y.Assert.areSame('summary content', summary);
    },

    "set('summary', null) should empty summary": function () {
        this.table.set('summary', 'summary content').render();

        this.table.set('summary', null);

        var summary = this.table.tableNode.getAttribute('summary');

        Y.Assert.areSame('', summary);
    },

    "set('summary', '') should empty summary": function () {
        this.table.set('summary', 'summary content').render();

        this.table.set('summary', '');

        var summary = this.table.tableNode.getAttribute('summary');

        Y.Assert.areSame('', summary);
    },

    "set('summary', newVal) should update DOM": function () {
        this.table.set('summary', 'summary content').render();

        this.table.set('summary', 'new summary text');

        var summary = this.table.tableNode.getAttribute('summary');

        Y.Assert.areSame('new summary text', summary);
    }
}));

suite.add(new Y.Test.Case({
    name: "width attribute",

    setUp: function () {
        this.testbed = Y.one('body').appendChild('<div></div>');

        this.table = new Y.DataTable.TableView({
            columns: [{ key: 'a' }],
            container: this.testbed,
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        this.table.destroy();
        this.testbed.remove().destroy(true);
    },

    "configured width should set table width": function () {
        this.table.set('width', '200px').render();

        Y.Assert.areSame(200, this.table.tableNode.get('offsetWidth'));
    },

    "set('width', newVal) should update table width": function () {
        this.table.set('width', '200px').render();

        Y.Assert.areSame(200, this.table.tableNode.get('offsetWidth'));

        this.table.set('width', '300px');

        Y.Assert.areSame(300, this.table.tableNode.get('offsetWidth'));
    },

    "set('width', '') should allow natural table width": function () {
        this.table.render();

        var naturalWidth = this.table.tableNode.get('offsetWidth'),
            wide = naturalWidth + 100;

        this.table.set('width', wide + 'px');

        Y.Assert.areSame(wide, this.table.tableNode.get('offsetWidth'));

        this.table.set('width', '');

        Y.Assert.areSame(naturalWidth,
            this.table.tableNode.get('offsetWidth'));
    }
}));

suite.add(new Y.Test.Case({
    name: "render",

    setUp: function () {
        this.table = new Y.DataTable.TableView({
            columns: [{ key: 'a' }],
            container: Y.Node.create('<div></div>'),
            modelList: new Y.ModelList().reset([{ a: 1 }])
        });
    },

    tearDown: function () {
        this.table.destroy();
    },

    "render() should create a <table>": function () {
        this.table.render();

        Y.Assert.isInstanceOf(Y.Node, this.table.get('container').one('table'));
    },

    "render() should fire the renderTable event": function () {
        var pass;

        this.table.on('renderTable', function () { pass = true; });

        this.table.render();

        Y.Assert.isTrue(pass);
    },

    "render() should fire renderHeader if headerView is set": function () {
        var pass;

        this.table.set('headerView', Y.View).on('renderHeader', function () {
            pass = true;
        });

        this.table.render();

        Y.Assert.isTrue(pass);
    },

    "render() should fire renderBody if bodyView is set": function () {
        var pass;

        this.table.set('bodyView', Y.View).on('renderBody', function () {
            pass = true;
        });

        this.table.render();

        Y.Assert.isTrue(pass);
    },

    "render() should fire renderFooter if footerView is set": function () {
        var pass;

        this.table.set('footerView', Y.View).on('renderFooter', function () {
            pass = true;
        });

        this.table.render();

        Y.Assert.isTrue(pass);
    },

    "render() should call render() on the headerView if set": function () {
        var pass;

        this.table.set('headerView',
            Y.Base.create('testView', Y.View, [], {
                render: function () {
                    pass = true;
                }
            })).render();

        Y.Assert.isTrue(pass);
    },

    "render() should call render() on the bodyView if set": function () {
        var pass;

        this.table.set('bodyView',
            Y.Base.create('testView', Y.View, [], {
                render: function () {
                    pass = true;
                }
            })).render();

        Y.Assert.isTrue(pass);
    },

    "render() should call render() on the footerView if set": function () {
        var pass;

        this.table.set('footerView',
            Y.Base.create('testView', Y.View, [], {
                render: function () {
                    pass = true;
                }
            })).render();

        Y.Assert.isTrue(pass);
    },

    // This is really a joint responsibility of the table view and its
    // child views, so there's not really a single best place to test
    "Shared ModelList should not generate duplicate ids": function () {
        var modelList = new Y.ModelList().reset([{ a: 1 }]),
            table1 = new Y.DataTable.TableView({
                container: Y.Node.create('<div></div>'),
                columns: [{ key: 'a' }],
                modelList: modelList
            }).render(),
            table2 = new Y.DataTable.TableView({
                container: Y.Node.create('<div></div>'),
                columns: [{ key: 'a' }],
                modelList: modelList
            }).render(),
            ids = Y.Array.hash(table1.get('container').all('[id]').get('id')),
            dups = 0;

        Y.Array.each(table2.get('container').all('[id]').get('id'),
            function (id) {
                if (ids[id]) {
                    dups++;
                }
            });

        table1.destroy();
        table2.destroy();

        Y.Assert.areSame(0, dups, dups + " duplicate IDs found");
    }
}));

/*
suite.add(new Y.Test.Case({
    name: "destroy",

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    }

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


}, '@VERSION@' ,{requires:['datatable-table', 'test']});
