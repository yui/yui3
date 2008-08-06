<h2 class="first">Instantiate YUI</h2>
<textarea name="code" class="JScript">
<!-- include yui -->
<script type="text/javascript" src="<?php echo $buildpath ?>yui/yui.js"></script>
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the 'oop' module.  Since we require 'node'
// for this example, and 'node' requires 'oop', the 'oop' module
// will be loaded automatically.
</textarea>

<h2>The example: Any class can be an Event.Target</h2>
<p>This example creates a custom class, then augments it with
<code>Event.Target</code> (functionality included in the <a
href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>).  Using the
packaged functionality of <code>Event.Target</code>, the code for
<code>Foo</code> is able to focus on the functionality unique to its
purpose.</p>

<textarea name="code" class="JScript" cols="60" rows="1">

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

</textarea>

<h2>Composition, not inheritance</h2>
<p>If <code>Foo</code> were a part of a class hierarchy, it would be improper
to include <code>Event.Target</code> in the inheritance chain, since the
purpose of the two are fundamentally different.</p>

<p>Unlike <code>extend</code>ed classes, the relationship between a class and
the classes augmenting it is not an indication of type hierarchy.  The intent
of <code>augment</code> is to aid in extracting nonessential behaviors or
behaviors shared by many classes, allowing for a composition-style class
architecture.</p>

<img src="<?= "$assetsDirectory/composition_diagram.png" ?>" alt="Diagram showing class hierarchy, highlighting has-a relationship"/>

<p>This may appear similar to multiple inheritance, but it's not.
<code>augment</code> simply adds the public methods and members from one class
prototype to another class prototype.  Instances of the augmented class will
not pass <code>instanceof</code> tests for the class(es) which augmented
it.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
var Y = YUI();
function Foo() {}
Foo.prototype.doSomething = function () { /* something */ };

function Bar() {}
Y.augment(Bar, Foo);

var b = new Bar();
if (b instanceof Bar) {} // true 
if (b instanceof Foo) {} // FALSE
</textarea>
