YUI.add('tabview-base-test', function(Y) {
    
    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.TabviewBase',

        'should create from existing markup': function() {
            new Y.TabviewBase({
                node: '#demo-base'
            });

            Y.Assert.isTrue(Y.DOM.hasClass(Y.DOM.byId('demo-base'), 'yui3-tabview'));
        }            

    })); 
}, '@VERSION@' ,{requires:['tabview-base', 'test']});
