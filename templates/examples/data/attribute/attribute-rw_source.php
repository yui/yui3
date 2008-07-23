<div id="example-out"></div>

<script type="text/javascript">
(function() {
    // Shortcut to print (unrelated to example)
    var print = YUI.example.print;

    // Get a new YUI instance 
    var Y = YUI().use("attribute");

    // Setup a custom class with attribute support
    function MyClass(cfg) {
        this._initAtts(MyClass.ATTRIBUTES, cfg);
    }

    // Setup attribute configuration
    MyClass.ATTRIBUTES = {
        "foo" : {
            value: "Default Foo",
            readOnly: true
        },
 
        "bar" : {
            value: "Default Bar",
            writeOnce: true
        }
    };

    MyClass.prototype.doSomething = function() {
        // ... Do something which requires
        // MyClass to change the value
        // of foo ...
        
        // Host code can reset value of 
        // readOnly attributes interally,
        // by working with the private state
        // property

        this._conf.remove("foo");
        this.set("foo", "New Default Foo");
    };

    Y.augment(MyClass, Y.Attribute);

    var o1 = new MyClass({
        foo: "User Foo",
        bar: "User Bar"
    });

    print("Initial Set", "header");
    print("foo value (readOnly):", "subheader");
    print(o1.get("foo"));

    print("bar value (writeOnce):", "subheader");
    print(o1.get("bar"));

    // Attempt to reset values:

    print("Try Setting Again", "header");
    o1.set("foo", "User Reset Foo");
    o1.set("bar", "User Reset Bar");

    print("Final foo value (readOnly)", "subheader");
    print(o1.get("foo"));

    print("Final bar value (writeOnce)", "subheader");
    print(o1.get("bar"));

    print("Set Value Of Foo Interally", "header");
    print("foo value (readOnly):", "subheader");

    o1.doSomething();
    print(o1.get("foo"));

})();
</script>
