<div id="example-out"></div>

<script type="text/javascript">
(function() {
    // Shortcut to print (unrelated to example)
    var print = YUI.example.print;

    // Get a new YUI instance 
    var Y = YUI().use("attribute", "dump");

    // Setup a custom class with attribute support
    function MyClass(cfg) {
        this._initAtts(MyClass.ATTRIBUTES, cfg);
    }

    // Setup attribute configuration
    MyClass.ATTRIBUTES = {
        "A" : {
            value : {
                a1 : "a1",
                a2 : "a2",
                a3 : {
                    a3a : "a3a",
                    a3b : "a3b"
                }
            },

            // Deep clone, when returning,
            // to protect entire object
            clone : Y.Attribute.CLONE.DEEP
        },
 
        "B" : {
            value : {
                b1 : "b1",
                b2 : "b2",
                b3 : {
                    b3a : "b3a",
                    b3b : "b3b"
                }
            },

            // Shallow clone, when returning, to
            // protect top level properties
            clone : Y.Attribute.CLONE.SHALLOW
        },

        "C" : {
            value : {
                c1 : "c1",
                c2 : "c2",
                c3 : {
                    c3a : "c3a",
                    c3b : "c3b"
                }
            },

            // Deep clone when returning, and don't
            // allow sub-attribute values to be set,
            // but allow whole value to be set
            clone : Y.Attribute.CLONE.IMMUTABLE
        },

        "D" : {
            value : {
                d1 : "d1",
                d2 : "d2",
                d3 : {
                    d3a : "d3a",
                    d3b : "d3b"
                }
            },

            // Don't clone value when returning (default)
            clone : Y.Attribute.CLONE.NONE
        }
    };

    Y.augment(MyClass, Y.Attribute);

    var o1 = new MyClass();

    /** Deep Cloned **/
    var aVal = o1.get("A");

    print("A - Deep Cloned", "header");
    print("Original Value:", "subheader")
    print(Y.dump(aVal));

    aVal.a1 = "a1-Mod";
    aVal.a3.a3b = "a3b-Mod";

    print("Value After Modifying Reference:", "subheader");
    print(Y.dump(o1.get("A")));

    o1.set("A.a3.a3a", "a3a-Mod");

    print("Value After Setting Sub-Attribute:", "subheader");
    print(Y.dump(o1.get("A")));

    /** Shallow Cloned **/
    var bVal = o1.get("B");

    print("B - Shallow Cloned", "header");
    print("Original Value:", "subheader")
    print(Y.dump(bVal));

    bVal.b1 = "b1-Mod";
    bVal.b3.b3b = "b3b-Mod";
    
    print("Value After Modifying Reference:", "subheader");
    print(Y.dump(o1.get("B")));

    o1.set("B.b3.b3a", "b3a-Mod");

    print("Value After Setting Sub-Attribute:", "subheader");
    print(Y.dump(o1.get("B")));
    
    /** Immutable **/
    var cVal = o1.get("C");

    print("C - Immutable", "header");
    print("Original Value:", "subheader")
    print(Y.dump(cVal));

    cVal.c1 = "c1-Mod";
    cVal.c3.c3b = "c3b-Mod";

    print("Value After Modifying Reference:", "subheader");
    print(Y.dump(o1.get("C")));

    // NOTE: Attempting to set a sub-attribute
    // on a DEEP or SHALLOW cloned attribute
    // is allowed, but prevented on IMMUTABLE
    // attributes

    o1.set("C.c3.c3a", "c3a-Mod");

    print("Value After Setting Sub-Attribute:", "subheader");
    print(Y.dump(o1.get("C")));

    /** Default **/
    var dVal = o1.get("D");

    print("D - No Cloning", "header");
    print("Original Value:", "subheader")
    print(Y.dump(dVal));

    dVal.d1 = "d1-Mod";
    dVal.d3.d3b = "d3b-Mod";

    print("Value After Modifying Reference:", "subheader");
    print(Y.dump(o1.get("D")));

    o1.set("D.d3.d3a", "d3a-Mod");

    print("Value After Setting Sub-Attribute:", "subheader");
    print(Y.dump(o1.get("D")));
})();
</script>
