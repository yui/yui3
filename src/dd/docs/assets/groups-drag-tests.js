YUI.add('groups-drag-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('groups-drag');

    suite.add(new Y.Test.Case({
        name: 'groups-drag',
        'is rendered and dd attached': function() {
            var dds = Y.all('.player');

            dds.each(function(dd) {
                Assert.isTrue(dd.hasClass('yui3-dd-draggable'), 'Failed to attach to: ' + dd.get('id'));
            });
        },
        'is rendered and dd-drop attached': function() {
            var dds = Y.all('.slot');

            dds.each(function(dd) {
                Assert.isTrue(dd.hasClass('yui3-dd-drop'), 'Failed to attach to: ' + dd.get('id'));
            });
        }
    }));

    Y.Test.Runner.add(suite);

});
