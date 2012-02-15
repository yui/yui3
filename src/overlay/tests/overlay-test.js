YUI.add('overlay-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite('Overlay');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.overlay && this.overlay.destroy();
        delete this.overlay;
        Y.one('#test').empty();
    },

    'Y.Overlay() should create a new overlay widget': function () {
        this.overlay = new Y.Overlay();
        this.overlay.render('#test');

        Assert.isInstanceOf(Y.Overlay, this.overlay, 'Not an instance of a `Y.Overlay`.');
        Assert.isTrue(Y.one('#test').contains(this.overlay.get('boundingBox')), 'Overlay was not rendered into "#test".');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['overlay', 'test']
});
