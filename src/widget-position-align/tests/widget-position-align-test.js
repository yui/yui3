YUI.add('widget-position-align-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite('WidgetPositionAlign');

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    _should: {
        error: {
            'align() with no arguments should throw an error once the Widget is rendered': true,
            'align() with no arguments called after render should throw an error'        : true,
            'align() with invalid points Array should throw an error after render'       : true
        }
    },

    setUp: function () {
        this.TestWidget = Y.Base.create('testWidget', Y.Widget, [
            Y.WidgetPosition,
            Y.WidgetPositionAlign
        ]);
    },

    tearDow : function () {
        delete this.TestWidget;
    },

    'align() should set the `align` Attribute': function () {
        var widget = new this.TestWidget(),
            align  = {
                node  : 'body',
                points: [Y.WidgetPositionAlign.CC, Y.WidgetPositionAlign.CC]
            };

        widget.align(align.node, align.points);
        Assert.areSame(align.node, widget.get('align').node);
        Assert.areSame(align.points, widget.get('align').points);
    },

    'align() with no arguments should set the `align` Attribute to an object': function () {
        var widget = new this.TestWidget();

        Assert.areSame(null, widget.get('align'));
        Assert.isFalse(widget.get('rendered'));

        widget.align();
        Assert.isObject(widget.get('align'));
    },

    'align() with no arguments should throw an error once the Widget is rendered': function () {
        var widget = new this.TestWidget();

        Assert.isNull(widget.get('align'));
        Assert.isFalse(widget.get('rendered'));

        widget.align();
        Assert.isObject(widget.get('align'));
        widget.render();
    },

    'align() with no arguments called after render should throw an error': function () {
        var widget = new this.TestWidget({ render: true });

        Assert.isTrue(widget.get('rendered'));
        widget.align();
        Assert.isObject(widget.get('align'));
    },

    'align() with invalid points Array should throw an error after render': function () {
        var widget = new this.TestWidget({ render: true });

        Assert.isTrue(widget.get('rendered'));
        widget.align(null, [null, null]);
        widget.align(null, []);
        widget.align(null);
    },

    'align() should return `undefined`': function () {
        var widget = new this.TestWidget();
        Assert.isUndefined(widget.align());
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

    'centered() should return `undefined`': function () {
        var widget = new this.TestWidget();
        Assert.isUndefined(widget.centered());
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-position-align', 'test']
});
