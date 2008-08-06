<h2 class="first">Instantiate YUI</h2>
<textarea name="code" class="JScript">
<!-- include yui -->
<script type="text/javascript" src="<?php echo $buildpath ?>yui/yui.js"></script>
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the 'oop' module.  Since we require 'node'
// for this example, and 'node' requires 'oop', the 'oop' module
// will be loaded automatically.

function(Y) {
</textarea>

<h2>Creating a class hierarchy</h2>
<p>In this example, we create a class <code>Bird</code> then create a subclass <code>Chicken</code>.

<textarea name="code" class="JScript" cols="60" rows="1">

Bird = function (name) {
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

</textarea>

<h2><code>instanceof</code> many classes</h2>
<p>Unlike classes composed with augmentation, extending subclasses are also
considered instances of their superclass and all classes higher up the
inheritance tree.</p>

<p>We'll create an instance of <code>Chicken</code> and run some <code>instanceof</code> and method tests against it.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
showInheritance = function () {
    var chicken = new Chicken('Little'),
        results = Y.get('#demo');

    results.set('innerHTML', results.get('innerHTML') + 
        chicken instanceof Object ?
            "<p>chicken IS an instance of Object.</p>" :
            "<p>chicken IS NOT an instance of Object.</p>");

    results.set('innerHTML', results.get('innerHTML') + 
        chicken instanceof Bird ?
            "<p>chicken IS an instance of Bird.</p>" :
            "<p>chicken IS NOT an instance of Bird.</p>");

    results.set('innerHTML', results.get('innerHTML') + 
        chicken instanceof Chicken ?
            "<p>chicken IS an instance of Chicken.</p>" :
            "<p>chicken IS NOT an instance of Chicken.</p>");

    // Chicken instances inherit Bird methods and members
    results.set('innerHTML', results.get('innerHTML') + 
        chicken.isFlighted() ?
            "<p>chicken CAN fly.</p>" :
            "<p>chicken CAN NOT fly.</p>");

    results.set('innerHTML', results.get('innerHTML') + 
        "<p>chicken's name is " + chicken.getName() + ".</p>");
}

Y.on('click', showInheritance, '#demo_btn');
</textarea>

<h2>Other architecture strategies</h2>
<p>Take a look at <code>augment</code> and <code>mix</code> for different strategies of managing your code structure.
