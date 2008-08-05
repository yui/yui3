<div id="example-out"></div>

<script type="text/javascript">

// Get a new instance of YUI and 
// load it with the required set of modules

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

    // Setup custom class which we want to 
    // add managed attribute support to

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
    print("o1 values set during construction:", "header");
    print("foo:" + o1.get("foo"));
    print("bar:" + o1.get("bar"));
    print("foobar:" + o1.get("foobar"));

    o1.set("foo", 10);
    o1.set("bar", "Hello New World!");
    o1.set("foobar", false);

    print("o1 new values:", "header");
    print("new foo:" + o1.get("foo"));
    print("new bar:" + o1.get("bar"));
    print("new foobar:" + o1.get("foobar"));

    var o2 = new MyClass({
        foo: 7,
        bar: "Aloha World!",
        foobar: false
    });

    print("o2 values set during construction:", "header");
    print("foo:" + o2.get("foo"));
    print("bar:" + o2.get("bar"));
    print("foobar:" + o2.get("foobar"));
});
</script>
