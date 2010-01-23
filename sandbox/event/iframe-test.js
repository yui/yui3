for (var i = 0; i < 1000000; i++) {
    // Simulate a whole bunch of JavaScript parsing and execution to help exaggerate the problem.
};

YUI({

    base: '../../build/'

}).use('*', function(Y) {

    Y.on('domready',
        function() {
            var div = document.createElement('div');
            div.innerHTML = 'onDOMReady successfully fired after the DOM was ready :)';
            try {
                document.body.appendChild(div);
            } catch (e) {
                alert('onDOMReady fired before the DOM was ready :(');
            }
        }
    );

});

