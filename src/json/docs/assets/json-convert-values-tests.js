YUI.add('json-convert-values-tests', function(Y) {
    
    var Assert = Y.Assert,
        suite = new Y.Test.Suite('json-convert-values'),
        data = {"USD":1,"EUR":0.6661,"GBP":0.5207,"AUD":1.1225,"BRL":1.609,"NZD":1.4198,"CAD":1.0667,"CHF":1.0792,"CNY":6.8587 ,"DKK":4.9702,"HKD":7.8064,"INR":42.0168,"JPY":109.8901,"KRW":1000,"LKR":107.5269,"MXN":10.1317,"MYR" :3.3167,"NOK":5.3277,"SEK":6.2617,"SGD":1.4073,"THB":33.7838,"TWD":31.1526,"VEF":2.1445,"ZAR":7.6923 ,"BGN":1.3028,"CZK":16.0514,"EEK":10.4275,"HUF":158.7302,"LTL":2.2999,"LVL":0.4692,"PLN":2.1758,"RON" :2.3804,"SKK":20.2429,"ISK":4.8008,"HRK":81.3008,"RUB":24.3309,"TRY":1.1811,"PHP":44.2478,"COP":2000 ,"ARS":3.1289};

    var getSelected = function() {
        var sel = Y.one("#demo select");
        return sel.get("options").item(sel.get("selectedIndex")).get("value");
    };

    var getRows = function() {
        return Y.all('#demo table tbody tr');
    };
    
    suite.add(new Y.Test.Case({
        name: 'json-convert-values',
        'is rendered': function() {
            Assert.isNotNull(Y.one('#demo'));
            Assert.isNotNull(Y.one('#demo select'));
            Assert.isNotNull(Y.one('#demo input'));
            Assert.isNotNull(Y.one('#demo table'));
        },
        'initial fetch': function() {
            Y.one('#demo input').simulate('click');
            Assert.areEqual(1, getRows().size());
            this.wait(function() {
                Assert.areEqual(14, getRows().size());
                Assert.areEqual('USD', getSelected());
            }, 500);
        }
    }));

    var testCase = new Y.Test.Case({
        name: 'Validate Prices'
    });

    var walk = function(key) {
        var rows = getRows();
        rows.each(function(row) {
            var us = Number(row.all('td').item(2).get('innerHTML'));
            var con = Number(row.all('td').item(3).get('innerHTML'));
            var prog = (Math.round(us * data[key] * 100)/100);
            Assert.areEqual(con, prog);
        });
    };

    var getHeader = function(key) {
        var h = Y.one('#demo table thead th span');
        return (h) ? (h.get('innerHTML') === key) : false;
    };

    var sel = Y.one('#demo select');
    var button = Y.one('#demo input');
    sel.get('options').each(function(node, index, opts) {
        testCase['validate ' + node.get('value')] = (function(index, key) {
            return function() {
                var test = this;
                sel.set('selectedIndex', index);
                button.simulate('click');

                test.poll(function() {
                    return getHeader(key)
                }, 100, 10000, function() {
                    walk(key);
                }, function() {
                    Assert.fail('Polling failed');
                });
            }
        })(index, node.get('value'));
    });

    suite.add(testCase);

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node-event-simulate' ] });
