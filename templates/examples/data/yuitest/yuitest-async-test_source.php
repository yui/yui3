<div id="testLogger"></div>
<script type="text/javascript">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

    Y.namespace("example.yuitest");
    
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
     
    //create the console
    var r = new Y.Console({
        verbose : true,
        newestOnTop : false
    });
    
    r.render('#testLogger');

    Y.Test.Runner.add(Y.example.yuitest.AsyncTestCase);

    //run the tests
    Y.Test.Runner.run();
});

</script>