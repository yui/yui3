<h2 class="first">Asynchronous Events Test Example</h2>

<p>This example begins by creating a namespace:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.namespace("example.yuitest");  
</textarea>
<p>This namespace serves as the core object upon which others will be added (to prevent creating global objects).</p>

<h3>Creating the TestCase</h3>

<p>The first step is to create a new <code>Y.Test.Case</code>object called <code>AsyncTestCase</code>.
  To do so, using the <code>Y.Test.Case</code>constructor and pass in an object literal containing information about the tests to be run:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.example.yuitest.AsyncTestCase = new Y.Test.Case({

    //name of the test case - if not provided, one is auto-generated
    name : "Animation Tests",        
            
    //---------------------------------------------------------------------
    // Test methods - names must begin with "test"
    //---------------------------------------------------------------------
    
    testAnimation : function (){

        var myAnim = new Y.Anim({
                node: '#testDiv',
                to: {
                    width: 400
                },
                duration: 3,
                easing: Y.Easing.easeOut
        });

        //assign oncomplete handler
        myAnim.on("end", function(){
        
            //tell the TestRunner to resume
            this.resume(function(){
            
                Y.Assert.areEqual(document.getElementById("testDiv").offsetWidth, 400, "Width of the DIV should be 400.");
            
            });
        
        }, this, true);

        //start the animation
        myAnim.run();
        
        //wait until something happens
        this.wait();
    
    }
                
});

</textarea>  
<p>The only test in the <code>Y.Test.Case</code>is called <code>testAnimation</code>. It begins by creating a new
<code>Anim</code> object that will animate the width of a <code>div</code> to 400 pixels over three seconds. An
event handler is assigned to the <code>Anim</code> object's <code>end</code> event, within which the
<code>resume()</code> method is called. A function is passed into the <code>resume()</code> method to indicate
the code to run when the test resumes, which is a test to make sure the width is 400 pixels. After that, the 
<code>run()</code> method is called to begin the animation and the <code>wait()</code> method is called to
tell the <code>Y.Test.Runner</code> to wait until it is told to resume testing again. When the animation completes,
the <code>end</code> event is fired and the test resumes, assuring that the width is correct.</p>
<h3>Running the tests</h3>

<p>With all of the tests defined, the last step is to run them:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
//create the console
var r = new Y.Console({
    verbose : true,
    newestOnTop : false
});

r.render('#testLogger');

//create the logger
Y.Test.Runner.add(Y.example.yuitest.AsyncTestCase);

//run the tests
Y.Test.Runner.run();
</textarea> 

<p>Before running the tests, it's necessary to create a <code>Y.Console</code> object to display the results (otherwise the tests would run 
  but you wouldn't see the results). After that, the <code>Y.Test.Runner</code> is loaded with the <code>Y.Test.Case</code>object by calling 
  <code>add()</code> (any number of <code>Y.Test.Case</code>and <code>TestSuite</code> objects can be added to a <code>Y.Test.Runner</code>, 
  this example only adds one for simplicity). The very last step is to call <code>run()</code>, which begins executing the tests in its
  queue and displays the results in the <code>Y.Console</code>.</p>