<pre style="margin-bottom: 1em">
var chicken = new Chicken();
</pre>
<input type="button" name="demo_btn" id="demo_btn" value="Show Inheritance"/>
<div id="demo">
</div>
<script type="text/javascript">

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the 'oop' module.  Since we require 'node'
// for this example, and 'node' requires 'oop', the 'oop' module
// will be loaded automatically.

function(Y) {

    var Bird = function (name) {
        this.name = name;
    };

    Bird.prototype.flighted   = true;  // Default for all Birds
    Bird.prototype.isFlighted = function () { return this.flighted };
    Bird.prototype.getName    = function () { return this.name };

    Chicken = function (name) {
        // Chain the constructors
        this.constructor.superclass.constructor.call(this, name);
    };
    // Chickens are birds
    Y.extend(Chicken, Bird);
    
    // Define the Chicken prototype methods/members
    Chicken.prototype.flighted = false; // Override default for all Chickens

    showInheritance = function () {
        var chicken = new Chicken('Little'),
            results = Y.get('#demo');

        results.set('innerHTML', results.get('innerHTML') +
            ((chicken instanceof Object) ?
                "<p>chicken IS an instance of Object.</p>" :
                "<p>chicken IS NOT an instance of Object.</p>"));

        results.set('innerHTML', results.get('innerHTML') + 
            ((chicken instanceof Bird) ?
                "<p>chicken IS an instance of Y.example.Bird.</p>" :
                "<p>chicken IS NOT an instance of Y.example.Bird.</p>"));

        results.set('innerHTML', results.get('innerHTML') + 
            ((chicken instanceof Chicken) ?
                "<p>chicken IS an instance of Y.example.Chicken.</p>" :
                "<p>chicken IS NOT an instance of Y.example.Chicken.</p>"));

        // Chicken instances inherit Bird methods and members
        results.set('innerHTML', results.get('innerHTML') + 
            ((chicken.isFlighted()) ?
                "<p>chicken CAN fly.</p>" :
                "<p>chicken CAN NOT fly.</p>"));

        results.set('innerHTML', results.get('innerHTML') + 
            "<p>chicken's name is " + chicken.getName() + ".</p>");
    }
    
    Y.on('click', showInheritance, '#demo_btn');
});
</script>
