<h3>Note:</h3>
<p>Keep an eye on the Logger console at right to see the profiling information being reported.</p>


<script type="text/javascript">

YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

    Y.namespace("example.profiler");

    //object with method to profile
    Y.example.profiler.MathHelper = {    
        factorial : function (num){
            if (num > 1) {
                return num * Y.example.profiler.MathHelper.factorial(num-1);
            } else {
                return 1;
            }
        }    
    };
    
    //register the function
    Y.Profiler.registerFunction("Y.example.profiler.MathHelper.factorial", Y.example.profiler.MathHelper);    
     
    window.onload = function (){
        
        Y.example.profiler.MathHelper.factorial(10);
        
        var calls = Y.Profiler.getCallCount("Y.example.profiler.MathHelper.factorial");
        var max = Y.Profiler.getMax("Y.example.profiler.MathHelper.factorial");
        var min = Y.Profiler.getMin("Y.example.profiler.MathHelper.factorial");
        var avg = Y.Profiler.getAverage("Y.example.profiler.MathHelper.factorial");
        
        Y.Profiler.unregisterFunction("Y.example.profiler.MathHelper.factorial");
        
        var msg = "Method Y.example.profiler.MathHelper was run " + calls + "times.\n" +
                "The average time was " + avg + "ms.\n" +
                "The max time was " + max + " ms.\n" +
                "The min time was " + min + " ms.";
        alert(msg);
    };
});
</script>