YUI.add('state-tests', function(Y) {    

    var basicTemplate = {

        name: "State Tests",

        testInstantiation : function() {
            var s = new Y.State();

            Y.Assert.isObject(s.data);
            Y.ObjectAssert.ownsNoKeys(s.data);
        },

        testAdd : function() {
            var s = new Y.State();

            s.add("A", "keyOne", "valueAOne");

            Y.Assert.areEqual("valueAOne", s.get("A", "keyOne"), "Initial add failed");

            s.add("A", "keyTwo", "valueATwo");

            Y.Assert.areEqual("valueAOne", s.get("A", "keyOne"), "Second add broke initial add");
            Y.Assert.areEqual("valueATwo", s.get("A", "keyTwo"), "Second add failed");

            s.add("A", "keyOne", "valueAOne-updated");

            Y.Assert.areEqual("valueAOne-updated", s.get("A", "keyOne"), "Update add failed");

            s.add("B", "keyOne", "valueBOne");

            Y.Assert.areEqual("valueBOne", s.get("B", "keyOne"), "Second name add failed");
        },

        testGet : function() {
            var s = new Y.State();
            
            s.add("A", "keyOne", "valueAOne");
            s.add("B", "keyOne", "valueBOne");
            
            Y.Assert.areEqual("valueAOne", s.get("A", "keyOne"));
            Y.Assert.areEqual("valueBOne", s.get("B", "keyOne"));

            Y.Assert.isUndefined(s.get("A", "keyTwo"));
            Y.Assert.isUndefined(s.get("B", "keyTwo"));
            Y.Assert.isUndefined(s.get("C", "keyOne"));
            Y.Assert.isUndefined(s.get("C", "keyTwo"));                        
        },

        testAddAll : function() {
            var s = new Y.State();
                a = {
                    keyOne: "valueAOne",
                    keyTwo: "valueATwo",
                    keyThree: "valueAThree"
                };

            s.addAll("A", a);

            Y.Assert.areNotSame(s.data["A"], a);

            Y.Assert.areEqual("valueAOne", s.get("A", "keyOne"));
            Y.Assert.areEqual("valueATwo", s.get("A", "keyTwo"));
            Y.Assert.areEqual("valueAThree", s.get("A", "keyThree"));
            Y.Assert.isUndefined(s.get("A", "keyFour"));

            s.addAll("B", {
                keyOne: "valueBOne",
                keyTwo: "valueBTwo" 
            });

            Y.Assert.areEqual("valueBOne", s.get("B", "keyOne"));
            Y.Assert.areEqual("valueBTwo", s.get("B", "keyTwo"));
        },

        testGetAll : function() {
            var s = new Y.State();

            s.addAll("A", {
                keyOne: "valueAOne",
                keyTwo: "valueATwo",
                keyThree: "valueAThree"
            });
            
            var shallow = s.getAll("A");

            Y.Assert.areNotSame(shallow, s.data["A"]);

            Y.ObjectAssert.areEqual({
                keyOne: "valueAOne",
                keyTwo: "valueATwo",
                keyThree: "valueAThree"
            }, shallow);

            var ref = s.getAll("A", true);

            Y.Assert.areSame(ref, s.data["A"]);
            
            Y.ObjectAssert.areEqual({
                keyOne: "valueAOne",
                keyTwo: "valueATwo",
                keyThree: "valueAThree"
            }, ref);

            Y.Assert.isUndefined(s.getAll("B"));
        },
        
        testRemove : function() {
            var s = new Y.State();

            s.addAll("A", {
                keyOne: "valueAOne",
                keyTwo: "valueATwo",
                keyThree: "valueAThree"
            });

            s.add("B", "keyOne", "valueBOne");

            s.remove("A", "keyOne");
            
            Y.Assert.isUndefined(s.get("A", "keyOne"));
            Y.Assert.areEqual("valueATwo", s.get("A", "keyTwo"));
            Y.Assert.areEqual("valueAThree", s.get("A", "keyThree"));
            Y.Assert.areEqual("valueBOne", s.get("B", "keyOne"));
        },

        testRemoveAll : function() {
            var s = new Y.State();

            s.add("B", "keyOne", "valueBOne");

            s.addAll("A", {
                keyOne: "valueAOne",
                keyTwo: "valueATwo",
                keyThree: "valueAThree"
            });

            s.removeAll("A");

            Y.Assert.isUndefined(s.get("A", "keyOne"));
            Y.Assert.isUndefined(s.get("A", "keyTwo"));
            Y.Assert.isUndefined(s.get("A", "keyThree"));
            
            Y.Assert.isUndefined(s.getAll("A"));

            Y.Assert.areEqual("valueBOne", s.get("B", "keyOne"));
        },

        testRemoveAllArray : function() {
            var s = new Y.State();

            s.add("B", "keyOne", "valueBOne");

            s.addAll("A", {
                keyOne: "valueAOne",
                keyTwo: "valueATwo",
                keyThree: "valueAThree"
            });

            s.removeAll("A", ["keyTwo", "keyThree"]);

            Y.Assert.isUndefined(s.get("A", "keyTwo"));
            Y.Assert.isUndefined(s.get("A", "keyThree"));

            Y.Assert.isObject(s.getAll("A"));
            Y.Assert.areEqual("valueAOne", s.get("A", "keyOne"));

            Y.Assert.areEqual("valueBOne", s.get("B", "keyOne"));
        },

        testRemoveAllObject : function() {
            var s = new Y.State();

            s.add("B", "keyOne", "valueBOne");

            s.addAll("A", {
                keyOne: "valueAOne",
                keyTwo: "valueATwo",
                keyThree: "valueAThree"
            });

            s.removeAll("A", {
                "keyTwo" : true, 
                "keyThree" : ""
            });

            Y.Assert.isUndefined(s.get("A", "keyTwo"));
            Y.Assert.isUndefined(s.get("A", "keyThree"));

            Y.Assert.isObject(s.getAll("A"));
            Y.Assert.areEqual("valueAOne", s.get("A", "keyOne"));

            Y.Assert.areEqual("valueBOne", s.get("B", "keyOne"));
        }
    };

    var suite = new Y.Test.Suite("State");
    suite.add(new Y.Test.Case(basicTemplate));

    Y.Test.Runner.add(suite);
    Y.Test.Runner.setName("State Tests");

}, "@VERSION@", {requires:["dump", "attribute-core", "test"]});
