YUI.add('attribute-rw-tests', function(Y) {

    var suite = new Y.Test.Suite('attribute-rw example test suite'),
        Assert = Y.Assert,

        INITIAL_FOO_VALUE = "Default Foo",
        INITIAL_BAR_VALUE;

    suite.add(new Y.Test.Case({
        name: 'Example Tests',

        writeInitialForm : Y.one("#writeInitial"),

        writeAgainForm : Y.one("#writeAgain"),

        writeInternallyForm : Y.one("#writeInternally"),

        clickFormSubmit : function(form) {

            // In non-IE browsers, clicking the submit will peform the default action,
            // of submitting the form. In IE, we need to do both
            form.one("button[type=submit]").simulate("click");

            if (Y.UA.ie && Y.UA.ie < 9) {
                form.simulate("submit");
            }
        },

        "Initial write during construction" : function() {

            var section = Y.one("#writeInitial"),

                btn = section.one(".do"),
                fooInput = section.one(".fooVal").set("value", "1234").get("value"),
                barInput = INITIAL_BAR_VALUE = section.one(".barVal").set("value", "qwerty").get("value"),
                output;


            this.clickFormSubmit(this.writeInitialForm);

            output = section.one(".example-out .myclass-attrs");

            Y.Assert.areEqual(output.get("children").item(0).get("text"), "foo (readOnly): " + INITIAL_FOO_VALUE);
            Y.Assert.areEqual(output.get("children").item(1).get("text"), "bar (writeOnce): " + INITIAL_BAR_VALUE);
        },

        "Write again after construction" : function() {

            var section = Y.one("#writeAgain"),

                btn = section.one(".do"),
                fooInput = section.one(".fooVal").set("value", "9876").get("value"),
                barInput = section.one(".barVal").set("value", "asdfg").get("value"),
                output;

            this.clickFormSubmit(this.writeAgainForm);

            output = section.one(".example-out .myclass-attrs");

            Y.Assert.areEqual(output.get("children").item(0).get("text"), "foo (readOnly): " + INITIAL_FOO_VALUE);
            Y.Assert.areEqual(output.get("children").item(1).get("text"), "bar (writeOnce): " + INITIAL_BAR_VALUE);
        },

        "Write internally, using private set" : function() {

            var section = Y.one("#writeInternally"),

                btn = section.one(".do"),
                fooInput = section.one(".fooVal").set("value", "1111").get("value"),
                output;

            this.clickFormSubmit(this.writeInternallyForm);

            output = section.one(".example-out .myclass-attrs");

            Y.Assert.areEqual(output.get("children").item(0).get("text"), "foo (readOnly): " + fooInput);
            Y.Assert.areEqual(output.get("children").item(1).get("text"), "bar (writeOnce): " + INITIAL_BAR_VALUE);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' , 'node-event-simulate' ] });
