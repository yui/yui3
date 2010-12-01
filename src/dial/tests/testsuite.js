YUI.add('dial-test', function(Y) {

var suite = new Y.Test.Suite("Y.Dial");

suite.add( new Y.Test.Case({
    name: "Simple dial test",

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "test default construction": function () {
        Y.Assert.isInstanceOf( Y.Dial, new Y.Dial() );
    } //no comma
}));


suite.add( new Y.Test.Case({
    name: "Lifecycle",

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "test default construction": function () {
        Y.Assert.isInstanceOf( Y.Dial, new Y.Dial() );
    },

    "test render(selector)": function () {
        Y.one("#testbed").setContent(
            "<div></div>" +   // block element
            '<div class="floated" style="float:left"></div>' + // float
            "<p></p>" +       // limited block element
            "<span></span>"); // inline element

        (new Y.Dial().render("#testbed > div"));
        (new Y.Dial().render("#testbed > div.floated"));
        (new Y.Dial().render("#testbed > p"));
        (new Y.Dial().render("#testbed > span"));

        var div  = Y.one("#testbed > div"),
            fl   = Y.one("#testbed > div.floated"),
            p    = Y.one("#testbed > p"),
            span = Y.one("#testbed > span");

        Y.assert( (div.get("offsetHeight") > 0) );
        Y.assert( (fl.get("offsetHeight") > 0) );
        Y.assert( (p.get("offsetHeight") > 0) );
        Y.assert( (span.get("offsetHeight") > 0) );

        Y.assert( (fl.get("offsetWidth") > 0) );
        Y.assert( (span.get("offsetWidth") > 0) );

        Y.Assert.areEqual( 13, div.all("span,div").size() );
        Y.Assert.areEqual( 13, fl.all("span,div").size() );
        Y.Assert.areEqual( 13, p.all("span,div").size() );
        Y.Assert.areEqual( 13, span.all("span,div").size() );
    },

    "test render( node )": function () {
        Y.one("#testbed").setContent(
            "<div></div>" +   // block element
            '<div class="floated" style="float:left"></div>' + // float
            "<p></p>" +       // limited block element
            "<span></span>"); // inline element

        var div  = Y.one("#testbed > div"),
            fl   = Y.one("#testbed > div.floated"),
            p    = Y.one("#testbed > p"),
            span = Y.one("#testbed > span");

        (new Y.Dial().render(div));
        (new Y.Dial().render(fl));
        (new Y.Dial().render(p));
        (new Y.Dial().render(span));

        Y.assert( (div.get("offsetHeight") > 0) );
        Y.assert( (fl.get("offsetHeight") > 0) );
        Y.assert( (p.get("offsetHeight") > 0) );
        Y.assert( (span.get("offsetHeight") > 0) );

        Y.assert( (fl.get("offsetWidth") > 0) );
        Y.assert( (span.get("offsetWidth") > 0) );

        Y.Assert.areEqual( 13, div.all("span,div").size() );
        Y.Assert.areEqual( 13, fl.all("span,div").size() );
        Y.Assert.areEqual( 13, p.all("span,div").size() );
        Y.Assert.areEqual( 13, span.all("span,div").size() );
    },

    "test render: selector attrib in constructor": function () {
        Y.one("#testbed").setContent(
            "<div></div>" +   // block element
            '<div class="floated" style="float:left"></div>' + // float
            "<p></p>" +       // limited block element
            "<span></span>"); // inline element

        (new Y.Dial({ render: "#testbed > div" }));
        (new Y.Dial({ render: "#testbed > div.floated" }));
        (new Y.Dial({ render: "#testbed > p" }));
        (new Y.Dial({ render: "#testbed > span" }));

        var div  = Y.one("#testbed > div"),
            fl   = Y.one("#testbed > div.floated"),
            p    = Y.one("#testbed > p"),
            span = Y.one("#testbed > span");

        Y.assert( (div.get("offsetHeight") > 0) );
        Y.assert( (fl.get("offsetHeight") > 0) );
        Y.assert( (p.get("offsetHeight") > 0) );
        Y.assert( (span.get("offsetHeight") > 0) );

        Y.assert( (fl.get("offsetWidth") > 0) );
        Y.assert( (span.get("offsetWidth") > 0) );

        Y.Assert.areEqual( 13, div.all("span,div").size() );
        Y.Assert.areEqual( 13, fl.all("span,div").size() );
        Y.Assert.areEqual( 13, p.all("span,div").size() );
        Y.Assert.areEqual( 13, span.all("span,div").size() );
    },

    "test render: node attrib in constructor": function () {
        Y.one("#testbed").setContent(
            "<div></div>" +   // block element
            '<div class="floated" style="float:left"></div>' + // float
            "<p></p>" +       // limited block element
            "<span></span>"); // inline element

        var div  = Y.one("#testbed > div"),
            fl   = Y.one("#testbed > div.floated"),
            p    = Y.one("#testbed > p"),
            span = Y.one("#testbed > span");

        (new Y.Dial({ render: div }));
        (new Y.Dial({ render: fl }));
        (new Y.Dial({ render: p }));
        (new Y.Dial({ render: span }));

        Y.assert( (div.get("offsetHeight") > 0) );
        Y.assert( (fl.get("offsetHeight") > 0) );
        Y.assert( (p.get("offsetHeight") > 0) );
        Y.assert( (span.get("offsetHeight") > 0) );

        Y.assert( (fl.get("offsetWidth") > 0) );
        Y.assert( (span.get("offsetWidth") > 0) );

        Y.Assert.areEqual( 13, div.all("span,div").size() );
        Y.Assert.areEqual( 13, fl.all("span,div").size() );
        Y.Assert.areEqual( 13, p.all("span,div").size() );
        Y.Assert.areEqual( 13, span.all("span,div").size() );
    },

    "test render off DOM": function () {
        var container = Y.Node.create("<div></div>");

        (new Y.Dial().render(container));

        Y.Assert.areEqual( 13, container.all("span,div").size() );
    },

    "test destroy() before render": function () {
        var dial = new Y.Dial();

        dial.destroy();

        Y.Assert.isTrue( dial.get("destroyed") );
    },

    "test destroy() after render off DOM": function () {
        var container = Y.Node.create("<div></div>"),
            dial = new Y.Dial();

        dial.render( container );

        dial.destroy();

        Y.Assert.isTrue( dial.get("destroyed") );

        Y.Assert.isNull( container.get("firstChild") );
    },

    "test destroy() after render to DOM": function () {
        var dial = new Y.Dial();

        dial.render( "#testbed" );

        dial.destroy();

        Y.Assert.isTrue( dial.get("destroyed") );

        Y.Assert.isNull( Y.one("#testbed").get("firstChild") );
    }
}));

suite.add( new Y.Test.Case({
    name: "API",

    setUp: function () {
        Y.one('body').append('<div id="testbed"></div>');

        this.dial = new Y.Dial();
    },

    tearDown: function () {
        this.dial.destroy();

        Y.one('#testbed').remove(true);
    },

    "test get('value')) and set('value', v) before render": function () {
        var d = this.dial;

        Y.Assert.areEqual( 0, d.get('value') );

        d.set('value', 50);
        Y.Assert.areEqual( 50, d.get('value') );
/*
        d.set('value', 3.3333);
        Y.Assert.areEqual( 3, d.get('value') );
*/
        // out of range constrained by setter
        d.set('value', -500);
        Y.Assert.areEqual( -220, d.get('value') );

        d.set('value', 500);
        Y.Assert.areEqual( 220, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );
/*
        d.set('value', 6.77777);
        Y.Assert.areEqual( 7, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );
*/
	},

    "test get('value')) and set('value', v) after render() to hidden container": function () {
        var container = Y.Node.create('<div></div>'),
            d = this.dial;

        d.render( container );

        Y.Assert.areEqual( 0, d.get('value'), "1" );

        d.set('value', 50);
        Y.Assert.areEqual( 50, d.get('value') );
/*
        d.set('value', 3.3333);
        Y.Assert.areEqual( 3, d.get('value') );
*/
        d.set('value', -500);
        Y.Assert.areEqual( -220, d.get('value'), "2" );

        d.set('value', 500);
        Y.Assert.areEqual( 220, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );
/*
        d.set('value', 6.77777);
        Y.Assert.areEqual( 7, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );
*/
	},

    "test get('value')) and set('value', v) after render() to DOM": function () {
        var d = this.dial;

        d.render('#testbed');

        Y.Assert.areEqual( 0, d.get('value') );

        d.set('value', 50);
        Y.Assert.areEqual( 50, d.get('value') );
/*
        d.set('value', 3.3333);
        Y.Assert.areEqual( 3, d.get('value') );
*/
        d.set('value', -500);
        Y.Assert.areEqual( -220, d.get('value') );

        d.set('value', 500);
        Y.Assert.areEqual( 220, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );
/*
        d.set('value', 6.77777);
        Y.Assert.areEqual( 7, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );
*/
	},

    "set('value', v) then render() should position _handleNode": function () {
        var d = this.dial;

        d.set('value', 20);
        d.render("#testbed");

        Y.Assert.areEqual( 86, parseInt(d._handleNode.getStyle("left"),10) );
    },

    "set('value', v) after render() should move the _handleNode": function () {
        var d = this.dial;

        d.render('#testbed');

        Y.Assert.areEqual( 50, parseInt(d._handleNode.getStyle('left'),10) );

        d.set('value', 20);
        Y.Assert.areEqual( 86, parseInt(d._handleNode.getStyle('left'),10) );

        d.set('value', 0);
        Y.Assert.areEqual( 0, d.get('value') );
        Y.Assert.areEqual( 50, parseInt(d._handleNode.getStyle('left'),10) );

        d.set('value', -93);
        Y.Assert.areEqual( -93, d.get('value') );
        Y.Assert.areEqual( 66, parseInt(d._handleNode.getStyle('left'),10) );
    },

    "setValue(v) when hidden should still move the thumb": function () {
        var d = this.dial;

        Y.one('#testbed').setStyle('display','none');

        d.render('#testbed');

        Y.Assert.areEqual( 50, parseInt(d._handleNode.getStyle('left'),10) );

        d.set('value', 20);
        Y.Assert.areEqual( 86, parseInt(d._handleNode.getStyle('left'),10) );


        Y.one('#testbed').setStyle('display','');
        Y.Assert.areEqual( 86, parseInt(d._handleNode.getStyle('left'),10) );
    }
	
	
	
}));
/*

suite.add( new Y.Test.Case({
    name: "Attributes",

//    _should: {
//        fail: {
//            // TODO This is a bug. invalid construction value should fallback
//            // to specified attribute default
//            "axis should only accept 'x', 'X', 'y', and 'Y'": true
//        }
//    },

    setUp: function () {
        Y.one('body').append('<span id="testbed"></span>');
    },

    tearDown: function () {
        Y.one('#testbed').remove(true);
    },

    "test diameter": function () {
        Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');

        var testbed = Y.one("#dial"),
            ref     = Y.one("#ref"),
            dial, delta, bb;

        dial = new Y.Dial().render( testbed );
        bb = testbed.get('firstChild');

        delta = bb.get('offsetWidth') - parseInt(dial.get('diameter'), 10);

        dial.destroy();

        dial = new Y.Dial({ diameter: 300 }).render( testbed );
        bb = testbed.get('firstChild');

        Y.Assert.areEqual( (300 + delta), bb.get('offsetWidth') );

        dial.set('diameter', 200);
        Y.Assert.areEqual( (200 + delta), bb.get('offsetWidth') );

        dial.set('diameter', "-140px");
        Y.Assert.areEqual( (200 + delta), bb.get('offsetWidth') );

        ref.setStyle("width", "150px");
        dial.set('diameter', '150');
        Y.Assert.areEqual( (ref.get('offsetWidth') + delta), bb.get('offsetWidth') );

        dial.destroy();

        dial = new Y.Dial({ axis: 'y' }).render( testbed );
        bb = testbed.get('firstChild');

        delta = bb.get('offsetHeight') - parseInt(dial.get('length'), 10);

        dial.destroy();

        dial = new Y.Dial({ axis: 'y', length: 50 }).render( testbed );
        bb = testbed.get('firstChild');

        Y.Assert.areEqual( (50 + delta), bb.get('offsetHeight') );

        dial.set('length', 300);
        Y.Assert.areEqual( (300 + delta), bb.get('offsetHeight') );

        dial.set('length', "-140px");
        Y.Assert.areEqual( (300 + delta), bb.get('offsetHeight') );

        ref.setStyle("height", "23.5em");
        dial.set('length', '23.5em');
        Y.Assert.areEqual( (ref.get('offsetHeight') + delta), bb.get('offsetHeight') );
    },

    "thumbUrl should default at render()": function () {
        var dial = new Y.Dial();
        
        Y.Assert.isNull( dial.get('thumbUrl') );
        
        dial.render('#testbed');

        Y.Assert.isString( dial.get('thumbUrl') );

        dial.destroy();
    },

    "thumbUrl should default to sam skin": function () {
        var dial = new Y.Dial().render("#testbed");

        Y.Assert.areEqual( Y.config.base + 'dial/assets/skins/sam/thumb-x.png', dial.get('thumbUrl') );

        dial.destroy();
    },

    "thumbUrl should default from the current skin": function () {
        var testbed = Y.one("#testbed"),
            dial  = new Y.Dial();

        testbed.addClass("yui3-skin-foo");

        dial.render( testbed );

        Y.Assert.areEqual( Y.config.base + 'dial/assets/skins/foo/thumb-x.png', dial.get('thumbUrl') );

        dial.destroy();
    },

    "test clickableRail": function () {
        
    },

    "test min": function () {
    },

    "test max": function () {
    },

    "test value": function () {
    }
}));
*/


/*
suite.add( new Y.Test.Case({
    name: "Bugs",

    setUp: function () {
    },

    tearDown: function () {
    },

    "test ": function () {
    }
}));
*/

Y.Test.Runner.add( suite );


}, '@VERSION@' ,{requires:['test', 'dial']});
