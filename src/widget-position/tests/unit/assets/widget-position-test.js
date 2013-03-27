YUI.add('widget-position-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite, TestWidget;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('Widget: Position');
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetPosition]);

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'WidgetPosition should add `x`, `y`, and `xy` attributes': function () {
        this.widget = new TestWidget();
        this.widget.render('#test');

        Assert.areSame(0, this.widget.get('x'), '`x` is not 0.');
        Assert.areSame(0, this.widget.get('y'), '`y` is not 0.');
        Assert.isArray(this.widget.get('xy'), '`xy` is not an Array.');
    },

    '`move()` should move the widget to the new `xy`': function () {
        var returnVal;

        this.widget = new TestWidget();
        this.widget.render('#test');

        Assert.areSame(0, this.widget.get('x'), '`x` is not 0.');
        Assert.areSame(0, this.widget.get('y'), '`y` is not 0.');

        returnVal = this.widget.move(10, 10);

        Assert.areSame(this.widget, returnVal, 'method is not chainable');

        Assert.areSame(10, this.widget.get('x'), '`x` is not 0.');
        Assert.areSame(10, this.widget.get('y'), '`y` is not 0.');

        this.widget.set('x', 20);
        this.widget.set('y', 20);

        Assert.areSame(20, this.widget.get('x'), '`x` is not 0.');
        Assert.areSame(20, this.widget.get('y'), '`y` is not 0.');
    },

    '`syncXY` should synchronize x, y, xy with boundingBox': function () {
        var bb,
            returnVal;

        this.widget = new TestWidget();
        this.widget.render('#test');
        bb = this.widget.get('boundingBox');

        bb.setXY([10, 20]);
        returnVal = this.widget.syncXY();

        Assert.areSame(this.widget, returnVal, 'method is not chainable');

        Assert.areSame(bb.getX(), this.widget.get('x'), '`x` is not in sync with boundingBox.');
        Assert.areSame(bb.getY(), this.widget.get('y'), '`y` is not in sync with boundingBox.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-position', 'test']
});
