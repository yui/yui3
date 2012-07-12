YUI.add('attribute-event-speeddate-tests', function(Y) {

    var suite = new Y.Test.Suite('attribute-event-speeddate example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({

        name: 'Example Tests',

        johnHi : Y.one("#john .hi"),

        janeHi : Y.one("#jane .hi"),

        sunsets : Y.one("#sunsets"),

        whales : Y.one("#whales"),

        specs : Y.one("#specs"),

        knitting : Y.one("#knitting"),

        likeJohn : Y.one("#jane .movingOn"),

        johnShirt : Y.one("#john .shirt"),

        janeShirt : Y.one("#jane .shirt"),

        checkNameTag : function(shirt, name, pqi, interests, status) {
            Y.Assert.isNotNull(shirt.one(".sd-nametag"));
            Y.Assert.isNotNull(shirt.one(".sd-nametag .sd-hd"));
            Y.Assert.isNotNull(shirt.one(".sd-nametag .sd-bd"));
            Y.Assert.isNotNull(shirt.one(".sd-nametag .sd-ft"));

            Y.Assert.areEqual(name, shirt.one(".sd-name").get("text"));
            Y.Assert.areEqual(pqi, shirt.one(".sd-personality").get("text"));
            Y.Assert.areEqual(interests, shirt.one(".sd-interests").get("text"));
            Y.Assert.areEqual(status, shirt.one(".sd-availability").get("text"));
        },

        clickCheckbox : function(checkbox, expectedState) {

            if (Y.UA.ie && Y.UA.ie < 9) {
                checkbox.set("checked", expectedState);
            } else {
                // Just in case it's already at that state, and the test wants to flip it with the click
                if (checkbox.get("checked") === expectedState) {
                    checkbox.set("checked", !expectedState);
                }
            }

            checkbox.simulate("click");
        },

        "Initial State" : function() {
            Y.Assert.isFalse(this.johnHi.get("disabled"));
            Y.Assert.isTrue(this.janeHi.get("disabled"));

            Y.Assert.isTrue(this.whales.get("disabled"));
            Y.Assert.isTrue(this.sunsets.get("disabled"));
            Y.Assert.isTrue(this.specs.get("disabled"));
            Y.Assert.isTrue(this.knitting.get("disabled"));

            Y.Assert.isTrue(this.likeJohn.get("disabled"));

            Y.Assert.areEqual(0, this.johnShirt.get("children").size());
            Y.Assert.areEqual(0, this.janeShirt.get("children").size());
        },

        "Hi I'm John" : function() {
            this.johnHi.simulate("click");

            Y.Assert.isFalse(this.janeHi.get("disabled"));

            Y.Assert.isTrue(this.whales.get("disabled"));
            Y.Assert.isTrue(this.sunsets.get("disabled"));
            Y.Assert.isTrue(this.specs.get("disabled"));
            Y.Assert.isTrue(this.knitting.get("disabled"));

            Y.Assert.isTrue(this.likeJohn.get("disabled"));

            this.checkNameTag(this.johnShirt, "John", "78", "absolutely nothing", "");

            Y.Assert.areEqual(0, this.janeShirt.get("children").size());
        },

        "Hey I'm Jane" : function() {
            this.janeHi.simulate("click");

            Y.Assert.isFalse(this.whales.get("disabled"));
            Y.Assert.isFalse(this.sunsets.get("disabled"));
            Y.Assert.isFalse(this.specs.get("disabled"));
            Y.Assert.isFalse(this.knitting.get("disabled"));

            Y.Assert.isFalse(this.likeJohn.get("disabled"));

            this.checkNameTag(this.johnShirt, "John", "78", "absolutely nothing", "");
            this.checkNameTag(this.janeShirt, "Jane", "82", "Popcorn, Saving Whales", "");
        },

        "Impress Jane" : function() {

            this.clickCheckbox(this.sunsets, true);

            this.checkNameTag(this.johnShirt, "John", "78", "Sunsets", "");

            this.clickCheckbox(this.specs, true);

            this.checkNameTag(this.johnShirt, "John", "78", "Sunsets, Reading Specifications", "");
            this.checkNameTag(this.janeShirt, "Jane", "82", "Popcorn, Saving Whales, Reading Specifications", "");

            this.clickCheckbox(this.whales, true);

            this.checkNameTag(this.johnShirt, "John", "78", "Sunsets, Reading Specifications, Saving Whales", "");

            this.clickCheckbox(this.knitting, true);

            this.checkNameTag(this.johnShirt, "John", "78", "Sunsets, Reading Specifications, Saving Whales, Knitting", "");
        },

        "Jane is not impressed" : function() {
            this.likeJohn.simulate("click");

            this.checkNameTag(this.johnShirt, "John", "78", "Sunsets, Reading Specifications, Saving Whales, Knitting", "");
            this.checkNameTag(this.janeShirt, "Jane", "82", "Popcorn, Saving Whales, Reading Specifications", "Oh, is that the time?");
        },

        "Jane is still not impressed" : function() {

            this.clickCheckbox(this.whales, false);

            this.likeJohn.simulate("click");

            this.checkNameTag(this.johnShirt, "John", "78", "Sunsets, Reading Specifications, Knitting", "");
            this.checkNameTag(this.janeShirt, "Jane", "82", "Popcorn, Saving Whales, Reading Specifications", "Oh, is that the time?");
        },

        "Jane is finally impressed" : function() {

            this.clickCheckbox(this.whales, true);
            this.clickCheckbox(this.knitting, false);

            this.likeJohn.simulate("click");

            this.checkNameTag(this.johnShirt, "John", "78", "Sunsets, Reading Specifications, Saving Whales", "");
            this.checkNameTag(this.janeShirt, "Jane", "82", "Popcorn, Saving Whales, Reading Specifications", "");

            Y.Assert.areEqual("... which he does", Y.one("#jane .reconsider .message").get("text"));
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
