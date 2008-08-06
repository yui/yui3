<h3>Setting Up Your Own Class To Use Attribute</h3>

<p>In this example, we'll show how you can use the Attribute utility to add managed attributes to your own object classes. Later examples will walk you through listening for attribute change events and some of the more advanced attribute configuration properties.</p>

<h4>Creating A YUI Instance</h4>
<p>Before we get into attribute, a quick note on how we set up the instance of YUI we'll use for the examples. For all of the attribute examples, we'll setup our own instance of the YUI object and download the files we require on demand using the code pattern shown below:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">

    // Create our local YUI instance, to avoid
    // modifying the global YUI object

    YUI({...}).use("node", "attribute", function(Y) {

        // Example code is written inside this function,
        // which gets passed our own YUI instance, Y, loaded
        // with the modules we asked for - "node" and "attribute"

    });
</script>
</textarea>

<p>The call to <code>YUI()</code> will create and return a new instance of the global YUI object for us to use. However this instance does not yet have all the modules we need for the examples.</p>

<p>To load the modules, we invoke <code>use()</code> and pass it the list of modules we'd like populated on our new YUI instance - in this case, <code>node</code> and <code>attribute</code>. The YUI instance will pull down the source files for <code>node</code> and <code>attribute</code> if they don't already exist on the page. When the source files are done downloading, the callback function which we pass in as the 3rd argument to <code>use()</code> is invoked, and is passed our custom YUI instance, <code>Y</code>, populated with the classes which make up the <code>node</code> and <code>attribute</code> modules.</p>

<p>This callback function is where we'll write all our example code. By working inside the callback function, we don't pollute the global namespace and we're also able to download the files we need on demand, rather than have them be on the page upfront.</p>

<p><em>NOTE:</em> The configuration object passed to <code>YUI()</code> when creating the instance, is used to specify how (<em>combined, separate, debug, min etc.</em>) we want the files downloaded and from where. The API documentation for the <a href="../api/YUI.html">YUI object</a>, provides more information about the configuration options available.</p>

<h4>Defining Your Custom Class</h4>

<p>The first step in the example is to create the constructor function for our new class, to which we want to add attribute support. In our example, this class is called <code>MyClass</code>. We then augment <code>MyClass</code> with the <code>Y.Attribute</code> class, so that it receives all of <code>Attribute's</code> methods:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    function MyClass(cfg) {
        ...
    }

    Y.augment(MyClass, Y.Attribute);
</textarea>

<h4>Adding Attributes</h4>

<p>We can now setup any attributes we need for <code>MyClass</code>. We can setup multiple attributes in one call using the using the <code>_initAtts</code> method (a protected method, designed to be used by the augmented class, as opposed to end users of your class). For the basic example we add 3 attributes - <code>foo</code>,<code>bar</code>, and <code>foobar</code>, and provide an initial  <code>value</code> for each. The same object literal we use to provide the value for the attribute will also be used in the other examples to configure specific types of attributes using properties such as <code>readOnly</code>, <code>writeOnce</code>, <code>validator</code> etc..</p>

<p>For convenience (not required), we define the set of attributes which <code>MyClass</code> supports as a static property on our <code>MyClass</code> constructor. This static property is passed to <code>_initAtts</code> to setup the attributes, as part of <code>MyClass's</code> constructor. The complete definition for <code>MyClass</code> is shown below:

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>

<p><strong>NOTE:</strong> The <code>_initAtts</code> method, in addition to the default attribute configurarion, also accepts an object literal (associative array) of name/value pairs which can be used to over-ride the default values of the attributes. This is useful for classes which wish to allow the user the set the value of attributes as part of object construction, as shown by the use of the <code>cfg</code> argument above.</p>

<h4>Using Attributes</h4>

<p>Now that we have <code>MyClass</code> defined with a set of attributes it supports, users can get and set attribute values on instances of <code>MyClass</code>:

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>

<p>For the second instance that we create in the example we set the values of the attributes, using the contructor configuration argument:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    var o2 = new MyClass({
                foo: 7,
                bar: "Aloha World!",
                foobar: false
             });
</textarea>

<p>So, in this example, we see how we can setup a new class with Attribute support allowing the end user to get and set attribute values on the instances they create.</p>
