YUI.add('attribute-basic-speeddate-tests', function(Y) {

    var suite = new Y.Test.Suite('attribute-basic-speeddate example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({

        name: 'Example Tests',

        johnHi : Y.one("#john .hi"),

        janeHi : Y.one("#jane .hi"),

        saveWhales : Y.one("#jane .upgrade"),

        likeJane : Y.one("#john .taken"),

        likeJohn : Y.one("#jane .taken"),

        johnShirt : Y.one("#john .shirt"),

        janeShirt : Y.one("#jane .shirt"),

        checkNameTag : function(shirt, name, pqi, status) {
            Y.Assert.isNotNull(shirt.one(".sd-nametag"));
            Y.Assert.isNotNull(shirt.one(".sd-nametag .sd-hd"));
            Y.Assert.isNotNull(shirt.one(".sd-nametag .sd-bd"));
            Y.Assert.isNotNull(shirt.one(".sd-nametag .sd-ft"));

            Y.Assert.areEqual(name, shirt.one(".sd-name").get("text"));
            Y.Assert.areEqual(pqi, shirt.one(".sd-personality").get("text"));
            Y.Assert.areEqual(status, shirt.one(".sd-availability").get("text"));
        },

        "Initial State" : function() {
            Y.Assert.isFalse(this.johnHi.get("disabled"));
            Y.Assert.isTrue(this.janeHi.get("disabled"));
            Y.Assert.isTrue(this.saveWhales.get("disabled"));
            Y.Assert.isTrue(this.likeJane.get("disabled"));
            Y.Assert.isTrue(this.likeJohn.get("disabled"));

            Y.Assert.areEqual(0, this.johnShirt.get("children").size());
            Y.Assert.areEqual(0, this.janeShirt.get("children").size());
        },

        "Hi I'm John" : function() {
            this.johnHi.simulate("click");

            Y.Assert.isFalse(this.janeHi.get("disabled"));

            Y.Assert.isTrue(this.saveWhales.get("disabled"));
            Y.Assert.isTrue(this.likeJane.get("disabled"));
            Y.Assert.isTrue(this.likeJohn.get("disabled"));

            this.checkNameTag(this.johnShirt, "John", "76.43", "I'm still looking");
        },

        "Hey I'm Jane " : function() {
            this.janeHi.simulate("click");

            Y.Assert.isFalse(this.saveWhales.get("disabled"));
            Y.Assert.isFalse(this.likeJane.get("disabled"));
            Y.Assert.isFalse(this.likeJohn.get("disabled"));

            this.checkNameTag(this.janeShirt, "Jane", "82", "I'm still looking");
        },

        "No way I save whales too" : function() {
            this.saveWhales.simulate("click");

            this.checkNameTag(this.janeShirt, "Jane", "98", "I'm still looking");
            this.checkNameTag(this.johnShirt, "John", "76.43", "I'm still looking");
        },

        "I like Jane" : function() {
            this.likeJane.simulate("click");

            this.checkNameTag(this.janeShirt, "Jane", "98", "I'm still looking");
            this.checkNameTag(this.johnShirt, "John", "76.43", "Sorry, I'm taken");
        },

        "I like John" : function() {
            this.likeJohn.simulate("click");

            this.checkNameTag(this.janeShirt, "Jane", "98", "Sorry, I'm taken");
            this.checkNameTag(this.johnShirt, "John", "76.43", "Sorry, I'm taken");
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
