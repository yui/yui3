<h3>Setting up your own class to use Attribute</h3>

<p>In this example, we'll show how you can use the Attribute utility to add managed attributes to your own object classes. Later examples will walk you through listening for attribute change events and some of the more advanced attribute configuration properties.</p>

<h3>A word about sandboxing YUI</h3>
<p>Before we get into attribute, a quick note on sandboxing YUI. For all of the attribute examples, we'll be writing the example code inside an anonymous function wrapper, and using our own YUI instance inside that anonymous function wrapper, which is recommended when working with YUI:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
(function() {

    // Create our local YUI instance, to avoid
    // modifying the global YUI object
    var Y = YUI();

    // Load it with the modules we need. 
    // In this case, attribute.  
    Y.use("attribute");
 
    ...
})();
</script>
</textarea>

<p>This can also be written a little more succinctly, based on the fact that YUI() and use() are chainable, as:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
(function() {
    var Y = YUI().use("attribute");
    ...
})();
</script>
</textarea>

<h3>Setting up your custom class</h3>

<p>The first step in the example is to create the constructor function for the new class, which we want to make into in a managed attribute provider. In our example, this class is called <code>MyClass</code>. We then augment this class with <code>Attribute</code> so that it recieves all of <code>Attribute's</code> methods, supporting managed attributes:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    function MyClass(cfg) {
        ...
    }

    Y.augment(MyClass, Y.Attribute);
</script>
</textarea>

<h3>Adding attributes to your custom class</h3>

<p>We can now setup any attributes we need for <code>MyClass</code>. We can setup multiple attributes in one call using the using the <code>_initAtts</code> method (a protected method, designed to be used by the augmented class, as opposed to end users of your class). For the basic example we add 3 attributes - <code>foo, bar, and foobar</code>, and provide an initial  <code>value</code> for each. The same object literal we use to provide the value for the attribute, will also be used in the other examples to setup specific properties for the attribute such as <code>readOnly</code>, <code>writeOnce</code>, <code>validator</code> etc..</p>

<p>For convenience (not required), we define the set of attributes which <code>MyClass</code> supports, as a static property on our <code>MyClass</code> constructor. This static property is passed to <code>_initAtts</code> to setup the attributes, as part of <code>MyClass</code> construction. The complete definition for <code>MyClass</code> is shown below:

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
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
</script>
</textarea>

<p><strong>NOTE:</strong> The <code>_initAtts</code> method, in addition to the default attribute configurarion, also accepts an object literal (associative array) of name value pairs which can be used to over-ride the default values of the attributes. This is useful for classes which wish to allow the user the set the value of attributes as part of object construction, as shown by the use of the <code>cfg</code> argument above.</p>

<h3>Using attributes on instances of MyClass</h3>

<p>Now that we have <code>MyClass</code> defined with a set of attributes it supports, we can get and set attribute values on instances of <code>MyClass</code>:

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    // Create a new instance of MyClass, without over-riding
    // any initial values
    var o1 = new MyClass();

    // Print out the current values of foo, bar, foobar
    var print = YUI.example.print;
    print("<strong>o1 values set during construction:</strong>"); 
    print("foo:" + o1.get("foo")); 
    print("bar:" + o1.get("bar")); 
    print("foobar:" + o1.get("foobar")); 
 
    // Set the values of foo, bar and foobar using 
    // the set method provided by Attribute
    o1.set("foo", 10); 
    o1.set("bar", "Hello New World!"); 
    o1.set("foobar", false); 
   
    // Print out the new values of foo, bar, foobar
    print("<strong>o1 new values:</strong>"); 
    print("new foo:" + o1.get("foo")); 
    print("new bar:" + o1.get("bar")); 
    print("new foobar:" + o1.get("foobar"));
</script>
</textarea>

<p>For the second instance that we create in the example we set the values of the attributes, by providing values to the contructor:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var o2 = new MyClass({
                foo: 7,
                bar: "Aloha World!",
                foobar: false
             });
</script>
</textarea>

<p>So, in this example, we see how we can setup a new class with Attribute support and how the end user can perform basic set/get operations on these attribute values on the instances they create.</p>
