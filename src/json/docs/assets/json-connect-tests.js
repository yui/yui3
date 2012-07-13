YUI.add('json-connect-tests', function(Y) {

    var Assert = Y.Assert,
        suite = new Y.Test.Suite('json-connect');

    suite.add(new Y.Test.Case({
        name: 'json-connect',
        'is rendered': function() {
        
            var el = Y.one('#demo button');
            Assert.isNotNull(el);
        },
        'io request works': function() {
            var button = Y.one('#demo button');
            var results = Y.one('#demo-messages');
            var html = results.get('innerHTML');
            Assert.areEqual('', html);

            button.simulate('click');
            
            this.poll(function() {
                var html = results.get('innerHTML');
                return (html) ? true : false;
            }, 100, 10000, function() {
                var ps = results.all('p');
                Assert.areEqual(ps.size(), 5);
                var html = ps.get('innerHTML').sort();
                var data = [
                    'Cat says "Meow"',
                    'Dog says "Woof"',
                    'Cow says "Moo"',
                    'Duck says "Quack"',
                    'Lion says "Roar"'];
                data.sort();
                Y.ArrayAssert.itemsAreEqual(html, data);

            }, function() {
                Y.Assert.fail('Polling failed');
            });
            
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node-event-simulate'  ]  });
