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

		//Check for IE VML and set different number of objects 
		var numObjs = (Y.UA.ie && Y.UA.ie < 9) ? 11 : 11;

		Y.Assert.areEqual( numObjs, div.all("span,div").size() );
        Y.Assert.areEqual( numObjs, fl.all("span,div").size() );
        Y.Assert.areEqual( numObjs, p.all("span,div").size() );
        Y.Assert.areEqual( numObjs, span.all("span,div").size() );
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

		//Check for IE VML and set different number of objects 
		var numObjs = (Y.UA.ie && Y.UA.ie < 9) ? 11 : 11;


		Y.Assert.areEqual( numObjs, div.all("span,div").size() );
        Y.Assert.areEqual( numObjs, fl.all("span,div").size() );
        Y.Assert.areEqual( numObjs, p.all("span,div").size() );
        Y.Assert.areEqual( numObjs, span.all("span,div").size() );
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


		//Check for IE VML and set different number of objects 
		var numObjs = (Y.UA.ie && Y.UA.ie < 9) ? 11 : 11;
        Y.Assert.areEqual( numObjs, div.all("span,div").size() );
        Y.Assert.areEqual( numObjs, fl.all("span,div").size() );
        Y.Assert.areEqual( numObjs, p.all("span,div").size() );
        Y.Assert.areEqual( numObjs, span.all("span,div").size() );
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

		//Check for IE VML and set different number of objects 
		var numObjs = (Y.UA.ie && Y.UA.ie < 9) ? 11 : 11;

        Y.Assert.areEqual( numObjs, div.all("span,div").size() );
        Y.Assert.areEqual( numObjs, fl.all("span,div").size() );
        Y.Assert.areEqual( numObjs, p.all("span,div").size() );
        Y.Assert.areEqual( numObjs, span.all("span,div").size() );
    },

    "test render off DOM": function () {
        var container = Y.Node.create("<div></div>");

        (new Y.Dial().render(container));

		//Check for IE VML and set different number of objects 
		var numObjs = (Y.UA.ie && Y.UA.ie < 9) ? 11 : 11;


		Y.Assert.areEqual( numObjs, container.all("span,div").size() );
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
        d.set('value', 3.3333); // dial does not round value
        Y.Assert.areEqual( 3, d.get('value') );

        // out of range constrained by setter        FIX THIS BUG. leaving in 3.3.0
        d.set('value', -500);
        Y.Assert.areEqual( -220, d.get('value') );

        // out of range constrained by setter        FIX THIS BUG. leaving in 3.3.0
        d.set('value', 500);
        Y.Assert.areEqual( 220, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );

        d.set('value', 6.77777); // dial does not round value
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
        d.set('value', 3.3333); // dial does not round value
        Y.Assert.areEqual( 3, d.get('value') );

        // out of range constrained by setter        FIX THIS BUG. leaving in 3.3.0
        d.set('value', -500);
        Y.Assert.areEqual( -220, d.get('value'), "2" );

        // out of range constrained by setter        FIX THIS BUG. leaving in 3.3.0
        d.set('value', 500);
        Y.Assert.areEqual( 220, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );

        d.set('value', 6.77777); // dial does not round value
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
        d.set('value', 3.3333); // dial does not round value
        Y.Assert.areEqual( 3, d.get('value') );

        // out of range constrained by setter        FIX THIS BUG. leaving in 3.3.0
        d.set('value', -500);
        Y.Assert.areEqual( -220, d.get('value') );

        // out of range constrained by setter        FIX THIS BUG. leaving in 3.3.0
        d.set('value', 500);
        Y.Assert.areEqual( 220, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );

        d.set('value', 6.77777); // dial does not round value
        Y.Assert.areEqual( 7, d.get('value') );
        Y.Assert.areEqual( d.get('value'), d.get('value') );
*/
	},

    "set('value', v) then render() should position _handleNode": function () {
        var d = this.dial;

        d.set('value', 20);
        d.render("#testbed");
		

        Y.Assert.areEqual( 76, parseInt(d._handleNode.getStyle("left"),10) );
    },

    "set('value', v) after render() should move the _handleNode": function () {
        var d = this.dial;

		d.render('#testbed');

        Y.Assert.areEqual( 40, parseInt(d._handleNode.getStyle('left'),10) );
        d.set('value', 20);
        Y.Assert.areEqual( 76, parseInt(d._handleNode.getStyle('left'),10) );

        d.set('value', 0);
        Y.Assert.areEqual( 0, d.get('value') );
        Y.Assert.areEqual( 40, parseInt(d._handleNode.getStyle('left'),10) );

        d.set('value', -93);
        Y.Assert.areEqual( -93, d.get('value') );
        Y.Assert.areEqual( 56, parseInt(d._handleNode.getStyle('left'),10) );
    }// no comma *****************

/*
	// This works in everything but IE9. I don't know why.
	// compare to similar test in slider's testsuite.js
	"setValue(v) when hidden should still move the handle-user": function () {
		var d = this.dial;

        Y.one('#testbed').setStyle('visibility','block');

        d.render('#testbed');

		Y.Assert.areEqual( 40, parseInt(d._handleNode.getStyle('left'),10) ); 
		d.set('value', 20);
		Y.Assert.areEqual( 76, parseInt(d._handleNode.getStyle('left'),10) );
		
		Y.one('#testbed').setStyle('visibility','');
		Y.Assert.areEqual( 76, parseInt(d._handleNode.getStyle('left'),10) );
	} // no comma *****************
*/
}));

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

/*		I don't believe the diameter should be able to be changed after render
        dial.set('diameter', 200);
        Y.Assert.areEqual( (200 + delta), bb.get('offsetWidth') );

        dial.set('diameter', "-140px");
        Y.Assert.areEqual( (200 + delta), bb.get('offsetWidth') );

        ref.setStyle("width", "150px");
        dial.set('diameter', '150');
        Y.Assert.areEqual( (ref.get('offsetWidth') + delta), bb.get('offsetWidth') );
*/
        dial.destroy();

    },


    "test handleDiameter": function () {
        Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
        var testbed = Y.one("#dial"),
            ref     = Y.one("#ref"),
            dial, calcSize, bb;
        dial = new Y.Dial({handleDiameter: 0.53 }).render( testbed );
        bb = testbed.get('firstChild');
        calcSize = dial.get('diameter') * dial.get('handleDiameter');
        Y.Assert.areEqual( calcSize, dial._handleNode.get('offsetWidth') );
        dial.destroy();
    },

	// Would like to test markerDiameter 
	// but it reads as zero I believe because _markerNode is hidden until the handle is dragged.

    "test centerButtonDiameter": function () {
        Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
        var testbed = Y.one("#dial"),
            ref     = Y.one("#ref"),
            dial, calcSize, bb;
        dial = new Y.Dial({centerButtonDiameter: 0.89 }).render( testbed );
        bb = testbed.get('firstChild');
        calcSize = dial.get('diameter') * dial.get('centerButtonDiameter');
        Y.Assert.areEqual( calcSize, dial._centerButtonNode.get('offsetWidth') );
        dial.destroy();
    },


    "test handleDistance": function () {
        Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
        var testbed = Y.one("#dial"),
            ref     = Y.one("#ref"),
            dial, calcHandleTop, bb;
        dial = new Y.Dial({handleDistance: 1 }).render( testbed );
        bb = testbed.get('firstChild');
        calcHandleTop = -(dial.get('handleDiameter') * dial.get('diameter')) / 2;
        Y.Assert.areEqual( calcHandleTop, parseInt(dial._handleNode.getStyle('top'),10) );
        dial.destroy();
    },


    "test increments and min max": function () {
        
    },

    "test min, max, resetDial, incrMinor, decrMinor, incrMajor, decrMajor": function () {
        Y.one('#testbed').append('<div id="dial"></div>');

		var testbed = Y.one("#dial"),
            dial;
        dial = new Y.Dial().render( testbed );
		dial._setToMin();
		Y.Assert.areEqual(dial.get('min'), dial.get('value'));

		dial._setToMax();
		Y.Assert.areEqual(dial.get('max'), dial.get('value'));

		dial._resetDial();
		Y.Assert.areEqual(dial._originalValue, dial.get('value'));

		dial.set('value', 0);

		dial._incrMinor();
		Y.Assert.areEqual(1, dial.get('value'));

		dial._decrMinor();
		Y.Assert.areEqual(0, dial.get('value'));

		dial._incrMajor();
		Y.Assert.areEqual(10, dial.get('value'));

		dial._decrMajor();
		Y.Assert.areEqual(0, dial.get('value'));


	},

    "test max": function () {
    },

    "test value": function () {
    }
}));

suite.add( new Y.Test.Case({
	
		name: "String Changes After Render",
	
		setUp: function () {
			Y.one('body').append('<span id="testbed"></span>');
		},
	
		tearDown: function () {
			Y.one('#testbed').remove(true);
		},
	
		"test changing strings after rendering dial": function() {
			var testbed = Y.one("#testbed"),
			labelStr = 'My new label',
			tooltipStr = 'My new tooltip';
			
			dial = new Y.Dial().render("#testbed");
			dial._setLabelString(labelStr);
			dial._setTooltipString(tooltipStr);
			Y.Assert.areEqual( labelStr, Y.one('.' + dial._classes[0].CSS_CLASSES.labelString).get('innerHTML') );
			
			if(Y.UA.ie && Y.UA.ie < 9){
				Y.Assert.areEqual( tooltipStr, Y.one('.' + dial._classes[0].CSS_CLASSES.handleVml).get('title') );
			}else{
				Y.Assert.areEqual( tooltipStr, Y.one('.' + dial._classes[0].CSS_CLASSES.handle).get('title') );
			}
			
		}
}));

suite.add( new Y.Test.Case({
	
		name: "International Strings",
	
		setUp: function () {
			Y.one('body').append('<span id="testbed"></span>');
		},
	
		tearDown: function () {
			Y.one('#testbed').remove(true);
		},
	
		"test international strings from lang files": function() {
			var testbed = Y.one("#testbed");
			
			Y.Intl.add ( 'dial' , 'xs' , {label: 'My label lang test', resetStr: 'Reset lang test', tooltipHandle: 'Drag to set value lang test'} )

			Y.Intl.setLang('dial', 'xs');
			//alert(Y.Intl.setLang('dial', 'xs'));
			dial = new Y.Dial().render("#testbed");
			Y.Assert.areEqual( Y.Intl.get('dial').label, Y.one('.' + dial._classes[0].CSS_CLASSES.labelString).get('innerHTML') );
			if(Y.UA.ie && Y.UA.ie < 9){
				Y.Assert.areEqual( Y.Intl.get('dial').tooltipHandle, Y.one('.' + dial._classes[0].CSS_CLASSES.handleVml).get('title') );
			}else{
				Y.Assert.areEqual( Y.Intl.get('dial').tooltipHandle, Y.one('.' + dial._classes[0].CSS_CLASSES.handle).get('title') );
			}
		}
}));

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
