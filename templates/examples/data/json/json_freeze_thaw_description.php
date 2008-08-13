<h3>The CaveMan class</h3>
<p>For this example, we'll use a class CaveMan, with a property <code>discovered</code> that holds a <code>Date</code> instance, and a method <code>getName</code>.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

function CaveMan(name,discovered) {
    this.name       = name;
    this.discovered = discovered;
};
CaveMan.prototype.getName = function () {
    return this.name + ", the cave man";
}

...
</textarea>

<h3>Add <code>freeze</code> and <code>thaw</code> static methods</h3>
<p>We'll add the methods responsible for serializing and reconstituting instances to the CaveMan class as static methods.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
// Static method to convert to a basic structure with a class identifier
CaveMan.freeze = function (cm) {
    return {
        _class : 'CaveMan',
        n : cm.name,
        d : cm.discovered // remains a Date for standard JSON serialization
    };
};

// Static method to reconstitute a CaveMan from the basic structure
CaveMan.thaw = function (o) {
    return new CaveMan(o.n, o.d);
};
</textarea>

<h3>Reference the methods in replacer and reviver functions</h3>
<p>We'll create an <code>example</code> namespace to hold our moving parts.  In it, we'll add a method to pass to <code>JSON.stringify</code> that calls our custom serializer, and another method to pass to <code>JSON.parse</code> that detects the serialized structure and calls our thawing method.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var example = {
    cryo : function (k,o) {
        return (o instanceof CaveMan) ? CaveMan.freeze(o) : o;
    },

    revive : function (k,v) {
        // Check for cavemen by the _class key
        if (v instanceof Object && v._class == 'CaveMan') {
            return CaveMan.thaw(v);
        }
        // default to returning the value unaltered
        return v;
    }
};
</textarea>

<h3>The data to be serialized</h3>
<p>We'll create a CaveMan instance and nest it in another object structure to illustrate how the thawing process still operates normally for all other data.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
example.data = {
    count : 1,
    type  : 'Hominid',
    specimen : [
        new CaveMan('Ed',new Date(1946,6,6))
    ]
};
</textarea>

<h3>Thawing from the inside out and the <code>Date</code> instance</h3>
<p>The reviver function passed to <code>JSON.parse</code> is applied to all key:value pairs in the raw parsed object from the deepest keys to the highest level.  In our case, this means that the <code>name</code> and <code>discovered</code> properties will be passed through the reviver, and <em>then</em> the object containing those keys will be passed through.</p>
<p>We'll take advantage of this by watching for UTC formatted date strings (the default JSON serialization for Dates) and reviving them into proper <code>Date</code> instances before the containing object gets its turn in the reviver.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var example = {
    dateRE : /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/,

    cryo : function (k,o) {
        return (o instanceof CaveMan) ? CaveMan.freeze(o) : o;
    },
    revive : function (k,v) {
        // Turn anything that looks like a UTC date string into a Date instance
        if (typeof v === 'string' && example.dateRE.test(v)) {
            var d = new Date();
            d.setUTCFullYear(RegExp.$1, (RegExp.$2|0)-1, RegExp.$3);
            d.setUTCHours(RegExp.$4, RegExp.$5, RegExp.$6);
            return d;
        }
        // Check for cavemen by the _class key
        if (v instanceof Object && v._class == 'CaveMan') {
            return CaveMan.thaw(v);
        }
        // default to returning the value unaltered
        return v;
    }
};
</textarea>

<p>Now when the reviver function is evaluating the object it determines to be a CaveMan, the <code>discovered</code> property is correctly containing a <code>Date</code> instance.</p>

<h3>Choose your serialization</h3>
<p>You'll note there are two freeze and thaw operations going on in this example.  One for our CaveMan class and one for <code>Date</code> instances.  Their respective serialization and recreation techniques are very different.  You are free to decide the serialized format of your objects.  Choose whatever makes sense for your application.</p>
<p><em>Note</em>: There is no explicit <code>Date</code> serialization method listed inline because <code>JSON</code> natively supports <code>Date</code> serialization.   However, it is outside the scope of the parser's duty to create Date instances, so it's up to you to recreate them in the <code>parse</code> phase.  Feel free to use the method included here.</p>

<h3>Show and Tell</h3>
<p>Now we add the event handlers to the example buttons to call <code>JSON.stringify</code> and <code>parse</code> with our <code>example.cryo</code> and <code>example.revive</code> methods, respectively.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.get('#demo_freeze').on('click',function (e) {
    example.jsonString = Y.JSON.stringify(example.data, example.cryo);

    Y.get('#demo_frozen').set('innerHTML', example.jsonString);
    Y.get('#demo_thaw').set('disabled',false);
});

Y.get('#demo_thaw').on('click',function (e) {
    var x  = Y.JSON.parse(example.jsonString, example.revive);
        cm = x.specimen[0];

    Y.get('#demo_thawed').set('innerHTML',
        "<p>Specimen count: " + x.count + "</p>"+
        "<p>Specimen type: " + x.type + "</p>"+
        "<p>Instanceof CaveMan: " + (cm instanceof CaveMan) + "</p>"+
        "<p>Name: " + cm.getName() + "</p>"+
        "<p>Discovered: " + cm.discovered + "</p>");
});

}); // end of YUI(..).use(.., function (Y) {
</textarea>

<h3>Full Code Listing</h3>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

var example = {
    data       : null,
    jsonString : null,

    dateRE : /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/,

    cryo : function (k,o) {
        return (o instanceof CaveMan) ? CaveMan.freeze(o) : o;
    },
    revive : function (k,v) {
        // Turn anything that looks like a UTC date string into a Date instance
        if (typeof v === 'string' && example.dateRE.test(v)) {
            var d = new Date();
            d.setUTCFullYear(RegExp.$1, (RegExp.$2|0)-1, RegExp.$3);
            d.setUTCHours(RegExp.$4, RegExp.$5, RegExp.$6);
            return d;
        }
        // Check for cavemen by the _class key
        if (v instanceof Object && v._class == 'CaveMan') {
            return CaveMan.thaw(v);
        }
        // default to returning the value unaltered
        return v;
    }
};

function CaveMan(name,discovered) {
    this.name       = name;
    this.discovered = discovered;
};
CaveMan.prototype.getName = function () {
    return this.name + ", the cave man";
}

// Static methods to convert to and from a basic object structure
CaveMan.thaw = function (o) {
    return new CaveMan(o.n, o.d);
};
// Convert to a basic object structure including a class identifier
CaveMan.freeze = function (cm) {
    return {
        _class : 'CaveMan',
        n : cm.name,
        d : cm.discovered // remains a Date for standard JSON serialization
    };
};

example.data    = {
    count : 1,
    type  : 'Hominid',
    specimen : [
        new CaveMan('Ed',new Date(1946,6,6))
    ]
};

Y.get('#demo_freeze').on('click',function (e) {
    example.jsonString = Y.JSON.stringify(example.data, example.cryo);

    Y.get('#demo_frozen').set('innerHTML', example.jsonString);
    Y.get('#demo_thaw').set('disabled',false);
});

Y.get('#demo_thaw').on('click',function (e) {
    var parsedData = Y.JSON.parse(example.jsonString, example.revive);
        cm = parsedData.specimen[0];

    Y.get('#demo_thawed').set('innerHTML',
        "<p>Specimen count: " + parsedData.count + "</p>"+
        "<p>Specimen type: " + parsedData.type + "</p>"+
        "<p>Instanceof CaveMan: " + (cm instanceof CaveMan) + "</p>"+
        "<p>Name: " + cm.getName() + "</p>"+
        "<p>Discovered: " + cm.discovered + "</p>");
});

// Expose the example objects for inspection
example.CaveMan = CaveMan;
YUI.example = example;

});
</textarea>
