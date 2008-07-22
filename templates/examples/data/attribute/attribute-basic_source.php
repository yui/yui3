<div id="example-out"></div>
<script type="text/javascript">
(function() {
    // Get a new instance of YUI and 
    // load it with the attribute module

    var Y = YUI().use("attribute");

    // Setup custom dummy class which is going
    // to support managed attributes

    function MyClass(cfg) {

        // When constructed, setup the
        // initial attributes for the
        // instance, by calling the
        // protected _initAtts method

        this._initAtts(MyClass.ATTRIBUTES, cfg);
    }

    // Setup static property to hold attribute config
    MyClass.ATTRIBUTES = {
        // Add 3 attributes, foo, bar and foobar
        "foo" : {
            value:5
        },
 
        "bar" : {
            value:"Hello World!"
        },

        "foobar" : {
            value:true
        }
    };

    // Augment custom class with Attribute
    Y.augment(MyClass, Y.Attribute);

    var o1 = new MyClass();

    var print = YUI.example.print;
    print("<strong>o1 values set during construction:</strong>");
    print("foo:" + o1.get("foo"));
    print("bar:" + o1.get("bar"));
    print("foobar:" + o1.get("foobar"));

    o1.set("foo", 10);
    o1.set("bar", "Hello New World!");
    o1.set("foobar", false);

    print("<strong>o1 new values:</strong>");
    print("new foo:" + o1.get("foo"));
    print("new bar:" + o1.get("bar"));
    print("new foobar:" + o1.get("foobar"));

    var o2 = new MyClass({
        foo: 7,
        bar: "Aloha World!",
        foobar: false
    });

    print("<strong>o2 values set during construction:</strong>");
    print("foo:" + o2.get("foo"));
    print("bar:" + o2.get("bar"));
    print("foobar:" + o2.get("foobar"));
})();
</script>
