<div id="demo">
    <input type="button" id="demo_freeze" value="Freeze">
    <input type="button" id="demo_thaw" disabled="disabled" value="Thaw">
    <pre id="demo_frozen">(stringify results here)</pre>
    <div id="demo_thawed"></div>
</div>

<script type="text/javascript">
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
</script>
