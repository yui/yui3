<h3>Note:</h3>
<p>Keep an eye on the Logger console at right to see the profiling information being reported.</p>


<div class="bar">div class="bar"</div>
<div class="bar-baz">div class="bar-baz"</div>
<div class="bar ">div class="bar "</div>
<div class=" bar ">div class=" bar "</div>
<div class="bar baz">div class=" bar baz"</div>
<div class="bar2 baz">div class=" bar2 baz"</div>
<div class="foo">div class="foo"</div>
<div class="foo" id="bar">div class="foo" id="bar"</div>
<div class="foo bar baz">div class="foo bar baz"</div>
<p class="bar">p class="bar"</p>
<button id="demo-run">run</button>

<script type="text/javascript">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

    Y.Node.get('#demo-run').on('click', function(){
        Y.Profiler.registerObject("Y.Node", Y.Node);
        Y.Profiler.registerObject("Y.DOM", Y.DOM);
        
        var results = Y.Node.all('.bar');
        results.addClass("newclass");
        
        var report = Y.Profiler.getFullReport(function(data){
            return data.calls > 0;
        });
        
        Y.Profiler.unregisterObject("Y.Node");    
        Y.Profiler.unregisterObject("Y.DOM");    
        
        //output results
        var msg = "";
        for (var func in report){
            msg += (func + "(): Called " + report[func].calls + " times. Avg: " + 
                report[func].avg + ", Min: " + report[func].min + ", Max: " + report[func].max) + "\n";
        }
        alert(msg);
    });
});
</script>