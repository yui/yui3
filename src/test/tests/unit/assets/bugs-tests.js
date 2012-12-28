YUI.add('bugs-tests', function(Y) {


    var suite = new Y.Test.Suite("YUI Test Bugs");

    suite.add(new Y.Test.Case({
        _should: {
            ignore: {
                //http://code.google.com/p/phantomjs/issues/detail?id=947
                "creating an iframe should allow its name to be retrieved in the DOM": Y.UA.phantomjs
            }
        },
        name : "TestReporter",

        "creating an iframe should allow its name to be retrieved in the DOM": function () {
            var fixture = "yuiTestTest";
            var id = 'temp1';
            try {
                var div = document.createElement("div");
                div.id = id;
                div.innerHTML = "<iframe id='fixture2' name='yuiTestTest'></iframe>";
                document.body.appendChild(div.firstChild);
            } catch (e) {
                var iframe = document.createElement('iframe');
                iframe.id = 'fixture2';
                iframe.name = fixture;
                document.body.appendChild(iframe);
            }
            Y.Assert.isNull(document.getElementById(id));
            Y.Assert.areEqual(document.getElementById("fixture2").getAttribute("name"), fixture);
            document.body.removeChild(document.getElementById('fixture2'));
        }

    }));

    Y.Test.Runner.add(suite);

});
