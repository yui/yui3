<h2 class="first">Asynchronous Test Example</h2>

<p>This example begins by creating a namespace:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.namespace("example.yuitest");  
</textarea>
<p>This namespace serves as the core object upon which others will be added (to prevent creating global objects).</p>

<h3>Creating the TestCase</h3>

<p>The first step is to create a new <code>Y.Test.Case</code> object called <code>AsyncTestCase</code>.
  To do so, using the <code>Y.Test.Case</code> constructor and pass in an object literal containing information about the tests to be run:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.example.yuitest.AsyncTestCase = new Y.Test.Case({

    //name of the test case - if not provided, one is auto-generated
    name : "Asynchronous Tests",
    
    //---------------------------------------------------------------------
    // setUp and tearDown methods - optional
    //---------------------------------------------------------------------
    
    /*
     * Sets up data that is needed by each test.
     */
    setUp : function () {
        this.data = {
            name: "yuitest",
            year: 2007,
            beta: true
        };
    },
    
    /*
     * Cleans up everything that was created by setUp().
     */
    tearDown : function () {
        delete this.data;
    },
            
    //---------------------------------------------------------------------
    // Test methods - names must begin with "test"
    //---------------------------------------------------------------------
    
    testWait : function (){
        var Assert = Y.Assert;
        
        //do some assertions now
        Assert.isTrue(this.data.beta);
        Assert.isNumber(this.data.year);
        
        //wait five seconds and do some more
        this.wait(function(){
        
            Assert.isString(this.data.name);                
        
        }, 5000);
    
    }
                
});
</textarea>  
<p>The object literal passed into the constructor contains two different sections. The first section contains the <code>name</code> property,
  which is used to determine which <code>Y.Test.Case</code> is being executed. A name is necessary, so one is generated if it isn't specified.</p>
<p>Next, the <code>setUp()</code> and <code>tearDown()</code> methods are included. The <code>setUp()</code> method is used in a <code>Y.Test.Case</code>
  to set up data that may be needed for tests to be completed. This method is called immediately before each test is executed. For this example,
  <code>setUp()</code> creates a data object. The <code>tearDown()</code> is responsible for undoing what was done in <code>setUp()</code>. It is
  run immediately after each test is run and, in this case, deletes the data object that was created by <code>setUp</code>. These methods are optional.</p>
<p>The second section contains the actual tests to be run. The only test is <code>testWait()</code>, which demonstrates using
  the <code>wait()</code> method to delay test execution. There are two arguments passed in: a function to run once the test resumes
  and the number of milliseconds to wait before running this function (same basic format as <code>setTimeout()</code>). When
  the test resumes, the function is executed in the context of the <code>Y.Test.Case</code> object, meaning that it still has
  access to all of the same data as the test that called <code>wait()</code>, including properties and methods on the <code>Y.Test.Case</code>
  itself. This example shows the anonymous function using both the <code>Y.Assert</code> object and the <code>data</code> property
  of the <code>Y.Test.Case</code>.</p>

<h3>Running the tests</h3>

<p>With all of the tests defined, the last step is to run them:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
//create the console
var r = new Y.Console({
    verbose : true,
    newestOnTop : false
});

r.render('#testLogger');

//add the test suite to the runner's queue
Y.Test.Runner.add(Y.example.yuitest.AsyncTestCase);

//run the tests
Y.Test.Runner.run();
</textarea> 

<p>Before running the tests, it's necessary to create a <code>Y.Console</code> object to display the results (otherwise the tests would run 
  but you wouldn't see the results). After that, the <code>Y.Test.Runner</code> is loaded with the <code>Y.Test.Case</code> object by calling 
  <code>add()</code> (any number of <code>Y.Test.Case</code> and <code>TestSuite</code> objects can be added to a <code>TestRunner</code>, 
  this example only adds one for simplicity). The very last step is to call <code>run()</code>, which begins executing the tests in its
  queue and displays the results in the <code>Y.Console</code>.</p>