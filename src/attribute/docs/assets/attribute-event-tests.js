YUI.add('attribute-event-tests', function(Y) {

    var suite = new Y.Test.Suite('attribute-event example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({

        name : 'Example Tests',

        attrSelector : Y.one("#attrSel"),

        attrCurrValue : Y.one("#currentVal"),

        attrNewValue : Y.one("#newVal"),

        attrPrevent : Y.one("#preventFoobar input[type=checkbox]"),

        changeValue : Y.one("#changeValue button[type=submit]"),

        changeValueForm : Y.one("#changeValue"),

        preventBox : Y.one("#preventFoobar"), 

        clickFormSubmit : function(form) {

            // In non-IE browsers, clicking the submit will peform the default action,
            // of submitting the form. In IE, we need to do both
            form.one("button[type=submit]").simulate("click");

            if (Y.UA.ie && Y.UA.ie < 9) {
                form.simulate("submit");
            }
        },

        'initial state' : function() {

            Y.Assert.isTrue(this.preventBox.hasClass("hidden"));
            Y.Assert.areEqual("none", this.preventBox.getComputedStyle("display"));

            Y.Assert.areEqual("", this.attrNewValue.get("value"));
            Y.Assert.areEqual(0, this.attrSelector.get("selectedIndex"));
            Y.Assert.areEqual("foo", this.attrSelector.get("value"));

            Y.Assert.areEqual("5", this.attrCurrValue.get("text"));
        },

        'foo change' : function() {

            this.attrNewValue.set("value", 10);

            this.clickFormSubmit(this.changeValueForm);

            var event = Y.one("#example-out .event"),
                eventData = event.all(".event-props li");

            Y.Assert.areEqual("e.attrName: foo", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: 5", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: 10", eventData.item(2).get("text"));
        },

        'foo unchanged' : function() {

            this.attrNewValue.set("value", 10);

            this.clickFormSubmit(this.changeValueForm);

            var events = Y.all("#example-out .event"),
                eventData = events.item(0).all(".event-props li");

            Y.Assert.areEqual(1, events.size());

            Y.Assert.areEqual("e.attrName: foo", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: 5", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: 10", eventData.item(2).get("text"));
        },

        'foo change again' : function() {

            this.attrNewValue.set("value", "qwerty");

            this.clickFormSubmit(this.changeValueForm);

            var events = Y.all("#example-out .event"),
                eventData = events.item(0).all(".event-props li");

            Y.Assert.areEqual(2, events.size());

            Y.Assert.areEqual("e.attrName: foo", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: 10", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: qwerty", eventData.item(2).get("text"));

            eventData = events.item(1).all(".event-props li");            

            Y.Assert.areEqual("e.attrName: foo", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: 5", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: 10", eventData.item(2).get("text"));
        },

        'bar change' : function() {

            this.attrSelector.set("selectedIndex", 1);
            this.attrSelector.simulate("change");

            Y.Assert.isTrue(this.preventBox.hasClass("hidden"));
            Y.Assert.areEqual("none", this.preventBox.getComputedStyle("display"));

            Y.Assert.areEqual("", this.attrNewValue.get("value"));
            Y.Assert.areEqual(1, this.attrSelector.get("selectedIndex"));
            Y.Assert.areEqual("bar", this.attrSelector.get("value"));

            Y.Assert.areEqual("Hello World!", this.attrCurrValue.get("text"));

            this.attrNewValue.set("value", "asdfg");

            this.clickFormSubmit(this.changeValueForm);

            var events = Y.all("#example-out .event"),
                eventData = events.item(0).all(".event-props li");

            Y.Assert.areEqual(3, events.size());

            Y.Assert.areEqual("e.attrName: bar", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: Hello World!", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: asdfg", eventData.item(2).get("text"));

            eventData = events.item(1).all(".event-props li");            

            Y.Assert.areEqual("e.attrName: foo", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: 10", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: qwerty", eventData.item(2).get("text"));

            eventData = events.item(2).all(".event-props li");

            Y.Assert.areEqual("e.attrName: foo", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: 5", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: 10", eventData.item(2).get("text"));
        },

        'bar unchanged' : function() {

            this.clickFormSubmit(this.changeValueForm);

            var events = Y.all("#example-out .event"),
                eventData = events.item(0).all(".event-props li");

            Y.Assert.areEqual(3, events.size());

            Y.Assert.areEqual("e.attrName: bar", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: Hello World!", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: asdfg", eventData.item(2).get("text"));

            eventData = events.item(1).all(".event-props li");            

            Y.Assert.areEqual("e.attrName: foo", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: 10", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: qwerty", eventData.item(2).get("text"));

            eventData = events.item(2).all(".event-props li");

            Y.Assert.areEqual("e.attrName: foo", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: 5", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: 10", eventData.item(2).get("text"));
        },

        'foobar change prevented' : function() {

            this.attrSelector.set("selectedIndex", 2);
            this.attrSelector.simulate("change");

            Y.Assert.isFalse(this.preventBox.hasClass("hidden"));
            Y.Assert.areNotEqual("none", this.preventBox.getComputedStyle("display"));
            Y.Assert.isTrue(this.attrPrevent.get("checked"));

            Y.Assert.areEqual("", this.attrNewValue.get("value"));
            Y.Assert.areEqual(2, this.attrSelector.get("selectedIndex"));
            Y.Assert.areEqual("foobar", this.attrSelector.get("value"));
            Y.Assert.areEqual("true", this.attrCurrValue.get("text"));

            this.attrNewValue.set("value", "1111");

            this.clickFormSubmit(this.changeValueForm);

            var events = Y.all("#example-out .event"),
                eventData = events.item(0).all(".event-props li"),
                eventTitle = events.item(0).one(".event-title").get("text");

            Y.Assert.areEqual(0, eventData.size());
            Y.Assert.areEqual("On foobarChange (prevented)", eventTitle);
        },

        'foobar change not prevented' : function() {
            this.attrPrevent.set("checked", false);

            this.attrNewValue.set("value", "2222");

            this.clickFormSubmit(this.changeValueForm);

            var events = Y.all("#example-out .event"),
                eventData = events.item(0).all(".event-props li");

            Y.Assert.areEqual(5, events.size());

            Y.Assert.areEqual("e.attrName: foobar", eventData.item(0).get("text"));
            Y.Assert.areEqual("e.prevVal: true", eventData.item(1).get("text"));
            Y.Assert.areEqual("e.newVal: 2222", eventData.item(2).get("text"));
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
