YUI.add('widget-position-align-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite('Widget: Position Align');

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    _should: {
        error: {
            'align() with invalid points Array should throw an error after render': true
        }
    },

    setUp: function () {
        this.TestWidget = Y.Base.create('testWidget', Y.Widget, [
            Y.WidgetPosition,
            Y.WidgetPositionAlign
        ]);
    },

    tearDown : function () {
        delete this.TestWidget;
    },

    'align() with no arguments should not set the `align` Attribute': function () {
        var widget = new this.TestWidget(),
            align  = {
                node  : 'body',
                points: [Y.WidgetPositionAlign.CC, Y.WidgetPositionAlign.CC]
            };
        
        widget.align();
        Assert.isNull(widget.get('align'));

        widget.set('align', align);
        Assert.areSame(align, widget.get('align'));

        widget.align();
        Assert.areSame(align, widget.get('align'));
    },

    'align() with no arguments should call `_syncUIPosAlign()': function () {
        var widget = new this.TestWidget(),
            calls  = 0;

        Y.before(function () {
            calls += 1;
        }, widget, '_syncUIPosAlign');

        widget.align();
        Assert.areSame(1, calls);
    },

    'align() with arguments should set the `align` Attribute': function () {
        var widget = new this.TestWidget(),
            align  = {
                node  : 'body',
                points: [Y.WidgetPositionAlign.CC, Y.WidgetPositionAlign.CC]
            };

        widget.align(align.node, align.points);
        Assert.areSame(align.node, widget.get('align').node);
        Assert.areSame(align.points, widget.get('align').points);
    },

    'align() with invalid points Array should throw an error after render': function () {
        var widget = new this.TestWidget({ render: true });

        Assert.isTrue(widget.get('rendered'));
        widget.align(null, [null, null]);
        widget.align(null, []);
        widget.align(null);
    },

    'align() should be chainable': function () {
        var widget = new this.TestWidget();
        Assert.areSame(widget, widget.align());
    },

    'centered() should set the `align` Attribute with center `points`': function () {
        var widget = new this.TestWidget(),
            points;

        widget.centered();
        Assert.isUndefined(widget.get('align').node);

        points = widget.get('align').points;
        Assert.areSame(Y.WidgetPositionAlign.CC, points[0]);
        Assert.areSame(Y.WidgetPositionAlign.CC, points[1]);
    },

    'centered() should accept a `node` argument and set that as the `align` Node': function () {
        var widget = new this.TestWidget();

        widget.centered('body');
        Assert.areSame('body', widget.get('align').node);
    },

    'centered() should be chainable': function () {
        var widget = new this.TestWidget();
        Assert.areSame(widget, widget.centered());
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-position-align', 'test']
});
