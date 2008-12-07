<div id="testLogger"></div>
<div id="testDiv" style="position:absolute;width:10px;height:10px; background-color:red"></div>
<script type="text/javascript">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

    Y.namespace("example.yuitest");
    
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
});

</script>
