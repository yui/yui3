YUI.add('get-tests', function(Y) {

    var suite = new Y.Test.Suite('get example test suite'),
        Assert = Y.Assert;

    var cleanStr = function(str) {
        var strTemp;
        strTemp = str.replace(/<BR>/g, '<br>');
        return strTemp.replace(/\s\s/g, ' ');
    }


    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test GET with Global Listeners': function() {
            var test = this,
                outputExpected = cleanStr('ID: 0: Transaction Event Start. The arguments are: foo<br>ID: 0: Transaction Event Complete.  The status code is: 200. The arguments are: bar<br>ID: 0: Transaction Event Success.  The response is: "This is the response from a simple text file.  Thank you for trying the YUI HTTP GET example.". The arguments are: baz<br>ID: 0: Transaction Event End. The arguments are: boo<br>');

            Y.one('#get1').simulate('click');

            var foo = function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        var output = Y.one('.example #container').getHTML();
//                      alert(output);

                         Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
                    });
                }, 500);
            }
            foo();
            test.wait(1000);
        },
        'test GET with Global and Transactional Listeners': function() {
            var test = this,
                outputExpected = cleanStr('ID: 1: Global Event Start. The globally-defined arguments are: global foo<br>ID: 1: Global Event Complete.  The status code is: 200. The globally-defined arguments are: global bar<br>ID: 1: Global Event Success.  The response is: "This is the response from a simple text file.  Thank you for trying the YUI HTTP GET example.". The globally-defined arguments are: global baz<br>ID: 1: Global Event End. The globally-defined arguments are: global boo<br>ID: 0: Transaction Event Start. The arguments are: foo<br>ID: 0: Transaction Event Complete.  The status code is: 200. The arguments are: bar<br>ID: 0: Transaction Event Success.  The response is: "This is the response from a simple text file.  Thank you for trying the YUI HTTP GET example.". The arguments are: baz<br>ID: 0: Transaction Event End. The arguments are: boo<br>ID: 1: Transaction Event Start. The arguments are: foo<br>ID: 1: Transaction Event Complete.  The status code is: 200. The arguments are: bar<br>ID: 1: Transaction Event Success.  The response is: "This is the response from a simple text file.  Thank you for trying the YUI HTTP GET example.". The arguments are: baz<br>ID: 1: Transaction Event End. The arguments are: boo<br>');

            Y.one('#get2').simulate('click');

            var foo = function(e) {
                setTimeout(function() {
                    test.resume(function() {
                        var output = Y.one('.example #container').getHTML();
//                      alert(output);

                         Assert.areEqual(outputExpected, cleanStr(output), ' - Failed to find expected output');
                    });
                }, 500);
            }
            foo();
            test.wait(1000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
