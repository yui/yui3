YUI.add('dial-test',  function(Y) {

// copied this from event-key-test.js to add tests for changing value by keyboard
Y.Node.prototype.key = function (code, mods, type) {
    var simulate = Y.Event.simulate,
        el       = this._node,
        config   = Y.merge(mods || {}, { keyCode: code, charCode: code });

    if (typeof code === "string") {
        code = code.charCodeAt(0);
    }

    if (type) {
        simulate(el, type, config);
    } else {
        simulate(el, 'keydown', config);
        simulate(el, 'keyup', config);
        simulate(el, 'keypress', config);
    }
};
// END   copied this from event-key-test.js to add tests for changing value by keyboard


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

    "test getting a value from an angle": function () {
        Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
        var testbed = Y.one("#dial"),
            ref     = Y.one("#ref"),
            valueOfAngle,
            dial = new Y.Dial({value: 0 }).render( testbed );
        
        valueOfAngle = dial._getValueFromAngle(90);
        Y.Assert.areEqual( 25, valueOfAngle );

        valueOfAngle = dial._getValueFromAngle(270);
        Y.Assert.areEqual( 75, valueOfAngle );

        valueOfAngle = dial._getValueFromAngle(176);
        Y.Assert.areEqual( 49, valueOfAngle );

        dial.destroy();
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

suite.add( new Y.Test.Case({
	
		name: "Change Value by mousedown",
	
		setUp: function () {
			Y.one('body').append('<span id="testbed"></span>');
		},
	
		tearDown: function () {
			Y.one('#testbed').remove(true);
		},
	    // Places a red marker where the event (mousdown, drag:drag, drag:end) is going to take place.
	    // In order to see it, you need to put a breakpoint on the ring.simulate line just after this is called
	    // Turn the global enableVis to false before check in
        visualInspection: function (x,y,dialObj){
            var enableVis = false; // Global enable. You'll need to put breakpoints in code to see it.
            if(enableVis){
                var eventXYMarker,
                scrollT = Y.one('document').get('scrollTop'),
                scrollL = Y.one('document').get('scrollLeft');
                
                if(Y.one('.mDMarker')){
                    eventXYMarker = Y.one('.mDMarker');
                }else{
                    eventXYMarker = Y.Node.create('<div class="mDMarker" style="position:absolute; width:3px; height:3px; background-color:#f00;"></div>')
                    Y.one('.yui3-dial-ring').append(eventXYMarker);
                }
                eventXYMarker.setXY([(dialObj._centerXOnPage + x - scrollL), (dialObj._centerYOnPage + y - scrollT)]);
            }
	    },
	

		"test centerButton mousedown": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 90, min: 0, max: 100 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),
            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
 			//Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
 			//Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
    		dial.set('value', 35);
            eventX = 12; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -12; //Set the Y for event simulation. 
            dial._centerButtonNode.simulate("mousedown", getXYProps());	
    		Y.Assert.areEqual( dial._originalValue, dial.get('value'));
        },



	
		"test min:0 max:100 -- drag past max/max, then click 11 or 1 o'clock.": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 90, min: 0, max: 100 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),
            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
 			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
 			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            eventX = 22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for event simulation. 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'),  'drag CW past max:100');

            eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'),  'then click 11 0clock');
			
			dial.set('value', 10);
			
			eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'),  'drag CCW past min:0');

            eventX = 22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 10, dial.get('value'),  'then click 1 0clock');

			dial.set('value', 10);
			
			eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'),  'drag CCW past min:0');

            eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'),  'then click 11 o`clock');

			dial.destroy();
		},

		"test mousedown Range = one revolution. Not at North": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 70, min: 50, max: 150 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),

            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			
            eventX = 22; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 110, dial.get('value'));
			dial.destroy();
		},



		
		"test  min:0 max:100 -- mousedown on and off North. Range = one revolution": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 0, min: 0, max: 100 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),

            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
//  			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
//  			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            eventX = -15; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 93, dial.get('value'));

            eventX = 0; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'));
			
            eventX = -15;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 93, dial.get('value'));

            eventX = 1;
            eventY = 30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 49, dial.get('value'));

            eventX = 3;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 2, dial.get('value'));

            eventX = 0;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'));

			dial.destroy();
		},
		
		"test min: 0, max: 200 -- drag past max/max, then click 11 or 1 o'clock.": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
			dial = new Y.Dial({handleDistance: 1, value: 190, min: 0, max: 200 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),

            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
 			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
 			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            eventX = 22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for event simulation. 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
			Y.Assert.areEqual( 200, dial.get('value'),  'drag CW past max:200');

            eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 190, dial.get('value'),  'then click 11 0clock');
			
			dial.set('value', 10); ////////////////////////////////////////////////////////
			
			eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'),  'drag CCW past min:0');

            eventX = 22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 10, dial.get('value'),  'then click 1 0clock');

			dial.set('value', 10); /////////////////////////////////////////////
			
			eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'),  'drag CCW past min:0');

            eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'),  'then click 11 o`clock');

            eventX = 22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = 30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 40, dial.get('value'),  'then click 5 o`clock');

			dial.destroy();
		},

		"test min: 0, max: 200 -- click through two revolutions CW": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 90, min: 0, max: 200 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),
            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
//  			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
//  			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            eventX = -15; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 93, dial.get('value'));

            eventX = 0; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'));
			
            eventX = 15;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 107, dial.get('value'));

            eventX = 1;
            eventY = 30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 149, dial.get('value'));

            eventX = -2;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 199, dial.get('value'));

            eventX = 3;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 200, dial.get('value'));

			dial.destroy();
		},

		"test min: -35, max: 35 -- drag past max/max, then click in/out of range also #2530597." : function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: -25, min: -35, max: 35 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),
            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
 			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
 			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            eventX = -22; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = 30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
			Y.Assert.areEqual( -35, dial.get('value'),  'drag CCW past min:-35');
			
            eventX = 30;
            eventY = 0;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 25, dial.get('value'),  'then click 3 o`clock');

            eventX = -22;
            eventY = 30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( -35, dial.get('value'),  'then click 7 o`clock. out of range, min');

            eventX = 22;
            eventY = 30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 35, dial.get('value'),  'then click 5 o`clock. out of range, max');

            //#2530597 issues with min at zero and other zero related problem
            // originally this bug was:
            // drag to get angle just slightly > 0 but value is Zero
            // then click to left side of dial
            // Handle snapped to max on the right side of the dial 
            dial.set('value', 10); /////////////////////////////////////////////
            dial.set('decimalPlaces', 2);

            eventX = -8; // -8 results in value 0.35 ... -12. results in -0.35
            eventY = -100; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
//			Y.Assert.areEqual( 0, dial.get('value'),  'drag to get value 0 but angle slightly > 0'); // check dial._prevAng

            dial.set('decimalPlaces', 0); // round to integer for Y.assert
			
            eventX = -30;
            eventY = 0;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( -25, dial.get('value'),  'then click 9 o`clock.'); //#2530597
			
            //#2530597 issues with min at zero and other zero related problem
            // Try the opposite
            dial.set('value', -10); /////////////////////////////////////////////
            dial.set('decimalPlaces', 2);

            eventX = -12; // -8 results in value 0.35 ... -12. results in -0.35 
            eventY = -100; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	
//			Y.Assert.areEqual( 0, dial.get('value'),  'drag to get value 0 but angle slightly < 0'); // check dial._prevAng

            dial.set('decimalPlaces', 0); // round to integer for Y.assert
			
            eventX = -30;
            eventY = 0;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( -25, dial.get('value'),  'then click 9 o`clock.'); //#2530597
			
            dial.set('value', 0); /////////////////////////////////////////////

            eventX = -30;
            eventY = 0;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( -25, dial.get('value'),  'then click 9 o`clock.'); //#2530597
			
            dial.set('value', 0); /////////////////////////////////////////////

            eventX = 30;
            eventY = 0;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 25, dial.get('value'),  'then click 3 o`clock.'); //#2530597

			dial.destroy();
		},
		
		"test min: 10, max: 25 -- mousedown text min max and opposite mid angle ": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 12, min: 10, max: 25 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),

            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
//  			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
//  			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            eventX = -15; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 10, dial.get('value'));

            eventX = 28; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 12, dial.get('value'));
			
            eventX = 25;
            eventY = 5;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 25, dial.get('value'));

            eventX = -5;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 10, dial.get('value'));

            eventX = 3;
            eventY = 30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 25, dial.get('value'));

            eventX = -30;
            eventY = -3;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 10, dial.get('value'));

            eventX = 5;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 10, dial.get('value'));

			dial.destroy();
		},

		
		"test min: 75, max: 90 -- mousedown test min max and opposite mid angle ": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 80, min: 75, max: 90 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),

            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
//  			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
//  			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            eventX =  15; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'));

            eventX = -28; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 88, dial.get('value'));
			
            eventX = 25;
            eventY = 5;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'));

            eventX = -5;
            eventY = 30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 75, dial.get('value'));

            eventX = 28;
            eventY = 8;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'));

            eventX = -30;
            eventY =  3;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual(75, dial.get('value'));

            eventX = -5;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'));

			dial.destroy();
		},

		"test min: 5, max: 80 -- mousedown text min max and opposite mid angle": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 60, min: 5, max: 80 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),

            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
//  			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
//  			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            eventX = -5; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 5, dial.get('value'));

            eventX = -30; //Set the X for click simulation. This is offset from dial._centerXOnPage
            eventY = 0; //Set the Y for click simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 75, dial.get('value'));
			
            eventX = 15;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 7, dial.get('value'));

            eventX = 2;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 5, dial.get('value'));

            eventX = -2;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 5, dial.get('value'));

            eventX = -30;
            eventY = -20;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 80, dial.get('value'));

			dial.destroy();
		},


		"test drag CW past max, then click 11 O'clock -- min: 0, max: 100": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
			ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 90, min: 0, max: 100 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),

            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
 			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
 			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 

            eventX = 22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for event simulation. 
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	


            eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'),  'past min CCW, then click 11 0clock');

			dial.destroy();
		},

		"test drag CCW past min, then click 1 O'clock -- min: 0, max: 100": function() { //string must start with "test
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
			ref = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 10, min: 0, max: 100 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),

            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
 			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
 			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 

            eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            ring.simulate("mouseover", getXYProps());	
            ring.simulate("mouseout", getXYProps());	


            eventX =  22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; 
            ring.simulate("mousedown", getXYProps());	
			Y.Assert.areEqual( 10, dial.get('value'),  'past min CCW, then click 11 0clock');

			dial.destroy();
		},

		"test min:0, max:100 -- drag (no drag:end) handle past max, around one revolution, then back to less than max. See ratchet effect": function() { //string must start with "test
            
			Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
			var testbed = Y.one("#dial"),
				ref     = Y.one("#ref"),
			dial = new Y.Dial({handleDistance: 1, value: 80, min: 0, max: 100 }).render( testbed ),
			ring = Y.one('.yui3-dial-ring'),
            scrollT = Y.one('document').get('scrollTop'),
            scrollL = Y.one('document').get('scrollLeft'),
            eventX,
            eventY,
            getXYProps = function(){ // this returns the properties, the object literal needed for .simulate
                return { clientX: (dial._centerXOnPage + eventX - scrollL), clientY: (dial._centerYOnPage + eventY - scrollT)};
            }; 
			// listeners that bind an event *unused* by Dial to the intended method 
 			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); // make mouseover do what a real drag:drag would do 
 			Y.on('mouseout', Y.bind(dial._handleDragEnd, dial), dial._ringNode); // make mouseover do what a real drag:end would do 
			
            // Simulating a drag is not possible with Y.event.simulate
            // So I have to use an event supported by simulate.
            // One that doesn't interfere with the other events of dial as mousedown does
            // I chose mouseover on the ring as the event
            // and send it to the dial._handleDrag method,
            // which is what drag is attached to in the Dial.js code.
 			Y.on('mouseover', Y.bind(dial._handleDrag, dial), dial._ringNode); 

            eventX = -25; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for event simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'), 'Less than max at 11 oclock');

            eventX =  25;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'), '> max at 1 oclock');

            eventX =  25; 
            eventY = 30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'), '> max at 4 oclock');

            eventX =  -25; 
            eventY = 30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'), '> max at 7 oclock');

            eventX =  -25; 
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'), '> max at 11oclock');
 
            eventX =  25; 
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 100, dial.get('value'), 'passed max the second time');

            eventX =  -25; 
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 90, dial.get('value'), 'was > max, now back to < max');

            ///////////////////////////////////////// Now do min
            dial.set('value', 2);
            
            eventX = -22; //Set the X for event simulation. This is offset from dial._centerXOnPage
            eventY = -30; //Set the Y for event simulation. This is offset from dial._centerYOnPage
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'), '< min at 11 oclock');

            eventX =  -22; 
            eventY = 30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'), '< min at 7 oclock');

            eventX =  22; 
            eventY = 30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'), '< min at 4 oclock');

            eventX =  22;
            eventY = -30;
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'), '< min at 1 oclock');



            eventX =  -22; 
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 0, dial.get('value'), '< min at 11oclock passed min 2nd time');
 
            eventX =  22; 
            eventY = -30; 
            this.visualInspection(eventX,eventY,dial);
            ring.simulate("mouseover", getXYProps());	
			Y.Assert.areEqual( 16, dial.get('value'), 'now drag back to > min');


			dial.destroy();
		} //,
}));

suite.add( new Y.Test.Case({
    name: "Keyboard value changes",

	setUp: function () {
		Y.one('body').append('<span id="testbed"></span>');
	},

	tearDown: function () {
		Y.one('#testbed').remove(true);
	},

    "test changing dial value by keyboard": function () {
        Y.one('#testbed').append('<div id="dial"></div><div id="ref"></div>');
        var testbed = Y.one("#dial"),
            ref     = Y.one("#ref"),
            dial;
        dial = new Y.Dial({value: 12, max: 97, min: -52 }).render( testbed );
        var input = dial._ringNode;
        input.key(33); // pageUp
        Y.Assert.areEqual(22, dial.get('value'));
        input.key(38); // up
        Y.Assert.areEqual(23, dial.get('value'));
        input.key(39); // right
        Y.Assert.areEqual(24, dial.get('value'));
        input.key(33); // pageUp
        Y.Assert.areEqual(34, dial.get('value'));
        input.key(40); // down
        Y.Assert.areEqual(33, dial.get('value'));
        input.key(34); // pageDown
        Y.Assert.areEqual(23, dial.get('value'));
        input.key(37); // left
        input.key(37); // left
        Y.Assert.areEqual(21, dial.get('value'));
        input.key(36); // home 
        Y.Assert.areEqual(12, dial.get('value'));
        input.key(35); // end 
        Y.Assert.areEqual(97, dial.get('value'));
        // beyond max
        input.key(33); // pageUp
        Y.Assert.areEqual(97, dial.get('value'));
        input.key(38); // up
        Y.Assert.areEqual(97, dial.get('value'));
        input.key(39); // right
        Y.Assert.areEqual(97, dial.get('value'));

        // min and beyond
        dial.set('value', -50);
        input.key(34); // pageDown
        Y.Assert.areEqual(-52, dial.get('value'));
        input.key(40); // down
        Y.Assert.areEqual(-52, dial.get('value'));
        input.key(37); // left
        Y.Assert.areEqual(-52, dial.get('value'));
        
		dial.destroy();
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
