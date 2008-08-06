<input type="button" id="demo" name="demo" value="Send">

<p id="demo_p1"></p>
<p id="demo_p2"></p>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the 'oop' module.  Since we require 'node'
// for this example, and 'node' requires 'oop', the 'oop' module
// will be loaded automatically.

function(Y) {

    Foo = function () {
        /* code specific to Foo */
        this.publish('interestingMoment');
    }
    Foo.prototype.doSomething = function() {
        /* ..do something interesting... */

        this.fire('interestingMoment');
    }

    Y.augment(Foo, Y.Event.Target);

    var f = new Foo();

    // Add some event listeners
    f.subscribe('interestingMoment', function () {
        var p = Y.get('#demo_p1');
        p.set('innerHTML', 'I was notified of an interesting moment');
    });
    f.subscribe('interestingMoment', function () {
        var p = Y.get('#demo_p2');
        p.set('innerHTML', 'I was also notified of an interesting moment');
    });

    Y.on('click', function () { f.doSomething() }, '#demo');
});

</script>
