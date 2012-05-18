YUI.add('yui-tests', function(Y) {
    
    var suite = new Y.Test.Suite('YUI Landing Page Tests');
    
    suite.add(new Y.Test.Case({
        name: 'Landing page tests',
        'test: headers': function() {
            var get = function(tag) {
                return document.getElementsByTagName(tag).length;
            },
            headers = get('h1') + get('h2') + get('h3');
            Y.Assert.isTrue(headers > 20, 'Section headers failed to render');
        }
    }));

    Y.Test.Runner.add(suite);

});
