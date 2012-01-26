YUI.add('external', function(Y) {
    Y.External = {
        run: function() {
            Y.one('#marker').setContent('External Module was loaded.');
        }
    }
}, '1.0.0', { requires: [ 'node' ] });
