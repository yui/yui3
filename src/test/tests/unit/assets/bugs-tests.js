YUI.add('bugs-tests', function(Y) {


    var suite = new Y.Test.Suite("YUI Test Bugs");

    suite.add(new Y.Test.Case({

        name : "TestReporter",

        "creating an iframe should allow its name to be retrieved in the DOM": function () {
            var fixture = "yuiTestTest";
            // var form = document.createElement("<iframe name=\"yuiTestTest\">");
            /* buggy version:
            var form = document.createElement("iframe");
            form.name = fixture;
            document.body.appendChild(form);
            // Y.Assert.areNotEqual(document.getElementById("fixture2").outerHTML, "<iframe></iframe>");
            // Y.Assert.areNotEqual(form.outerHTML.toLowerCase(), "<iframe></iframe>");
            */
            // working version
            var div = document.createElement("div");
            div.id = "temp1";
            div.innerHTML = "<iframe id='fixture2' name='yuiTestTest'></iframe>";
            document.body.appendChild(div.firstChild);
            Y.Assert.isNull(document.getElementById(div.id));
            Y.Assert.areEqual(document.getElementById("fixture2").getAttribute("name"), fixture);
        }

    }));

    Y.Test.Runner.add(suite);

});
