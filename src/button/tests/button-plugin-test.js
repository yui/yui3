YUI.add('button-plugin-test', function (Y) {

    var Assert      = Y.Assert,
        ArrayAssert = Y.ArrayAssert,
        suite;

    suite = new Y.Test.Suite('Buttons');

    suite.add(new Y.Test.Case({
        name: 'button plugin factory',

        setUp : function () {
            Y.one("#container").setContent('<button id="testButton">Hello</button>');
            this.button = Y.Plugin.Button.factory("#testButton");
        },
    
        tearDown: function () {
            Y.one('#container').empty(true);
            delete this.button;
        },
    
        // TODO: Write some tests
    
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['button-plugin', 'test']
});
