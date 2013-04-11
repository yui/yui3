YUI.add('slider-tests', function(Y) {

// copied this from event-key-test.js to add tests for changing value by keyboard
Y.Node.prototype.key = function (keyCode, charCode, mods, type) {
    var simulate = Y.Event.simulate,
        el       = this._node,
        config   = Y.merge(mods || {});

    if (type) {
        if (type === 'keypress') {
            config.charCode = config.keyCode = config.which = charCode || keyCode;
        } else {
            config.keyCode = config.which = keyCode;
        }
        simulate(el, type, config);
    } else {
        config.keyCode = config.which = keyCode;
        simulate(el, 'keydown', config);
        simulate(el, 'keyup', config);

        config.charCode = config.keyCode = config.which = charCode || keyCode;
        simulate(el, 'keypress', config);
    }
};
// END   copied this from event-key-test.js to add tests for changing value by keyboard
Y.Node.prototype.simulate = function (type, config) {
    var simulate = Y.Event.simulate,
        args     = [this._node, type].concat(Y.Array(arguments, 1, true));

    if(type) {
        simulate.apply(Y.Event, args);
    } 
};

var suite = new Y.Test.Suite("Slider");

suite.add( new Y.Test.Case({
    name: "Lifecycle",

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "test default construction": function () {
        Y.Assert.isInstanceOf( Y.Slider, new Y.Slider() );
    },

    "test SliderBase construction": function () {
        Y.Assert.isInstanceOf( Y.SliderBase, new Y.SliderBase() );
    },

    "test render(selector)": function () {
        Y.one("#testbed").setContent(
            "<div></div>" +   // block element
            '<div class="floated" style="float:left"></div>' + // float
            "<p></p>" +       // limited block element
            "<span></span>"); // inline element

        (new Y.Slider().render("#testbed > div"));
        (new Y.Slider().render("#testbed > div.floated"));
        (new Y.Slider().render("#testbed > p"));
        (new Y.Slider().render("#testbed > span"));

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

        Y.Assert.areEqual( 8, div.all("span,img").size() );
        Y.Assert.areEqual( 8, fl.all("span,img").size() );
        Y.Assert.areEqual( 8, p.all("span,img").size() );
        Y.Assert.areEqual( 8, span.all("span,img").size() );
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

        (new Y.Slider().render(div));
        (new Y.Slider().render(fl));
        (new Y.Slider().render(p));
        (new Y.Slider().render(span));

        Y.assert( (div.get("offsetHeight") > 0) );
        Y.assert( (fl.get("offsetHeight") > 0) );
        Y.assert( (p.get("offsetHeight") > 0) );
        Y.assert( (span.get("offsetHeight") > 0) );

        Y.assert( (fl.get("offsetWidth") > 0) );
        Y.assert( (span.get("offsetWidth") > 0) );

        Y.Assert.areEqual( 8, div.all("span,img").size() );
        Y.Assert.areEqual( 8, fl.all("span,img").size() );
        Y.Assert.areEqual( 8, p.all("span,img").size() );
        Y.Assert.areEqual( 8, span.all("span,img").size() );
    },

    "test render: selector attrib in constructor": function () {
        Y.one("#testbed").setContent(
            "<div></div>" +   // block element
            '<div class="floated" style="float:left"></div>' + // float
            "<p></p>" +       // limited block element
            "<span></span>"); // inline element

        (new Y.Slider({ render: "#testbed > div" }));
        (new Y.Slider({ render: "#testbed > div.floated" }));
        (new Y.Slider({ render: "#testbed > p" }));
        (new Y.Slider({ render: "#testbed > span" }));

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

        Y.Assert.areEqual( 8, div.all("span,img").size() );
        Y.Assert.areEqual( 8, fl.all("span,img").size() );
        Y.Assert.areEqual( 8, p.all("span,img").size() );
        Y.Assert.areEqual( 8, span.all("span,img").size() );
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

        (new Y.Slider({ render: div }));
        (new Y.Slider({ render: fl }));
        (new Y.Slider({ render: p }));
        (new Y.Slider({ render: span }));

        Y.assert( (div.get("offsetHeight") > 0) );
        Y.assert( (fl.get("offsetHeight") > 0) );
        Y.assert( (p.get("offsetHeight") > 0) );
        Y.assert( (span.get("offsetHeight") > 0) );

        Y.assert( (fl.get("offsetWidth") > 0) );
        Y.assert( (span.get("offsetWidth") > 0) );

        Y.Assert.areEqual( 8, div.all("span,img").size() );
        Y.Assert.areEqual( 8, fl.all("span,img").size() );
        Y.Assert.areEqual( 8, p.all("span,img").size() );
        Y.Assert.areEqual( 8, span.all("span,img").size() );
    },

    "test render off DOM": function () {
        var container = Y.Node.create("<div></div>");

        (new Y.Slider().render(container));

        Y.Assert.areEqual( 8, container.all("span,img").size() );
    },

    "test destroy() before render": function () {
        var slider = new Y.Slider();

        slider.destroy();

        Y.Assert.isTrue( slider.get("destroyed") );
    },

    "test destroy() after render off DOM": function () {
        var container = Y.Node.create("<div></div>"),
            slider = new Y.Slider();

        slider.render( container );

        slider.destroy();

        Y.Assert.isTrue( slider.get("destroyed") );

        Y.Assert.isNull( container.get("firstChild") );
    },

    "test destroy() after render to DOM": function () {
        var slider = new Y.Slider();

        slider.render( "#testbed" );

        slider.destroy();

        Y.Assert.isTrue( slider.get("destroyed") );

        Y.Assert.isNull( Y.one("#testbed").get("firstChild") );
    }
}));

suite.add( new Y.Test.Case({
    name: "API",

    setUp: function () {
        Y.one('body').append('<div id="testbed"></div>');

        this.slider = new Y.Slider();
    },

    tearDown: function () {
        this.slider.destroy();

        Y.one('#testbed').remove(true);
    },

    "test getValue() and setValue(v) before render": function () {
        var s = this.slider;

        Y.Assert.areEqual( 0, s.getValue() );

        s.setValue(50);
        Y.Assert.areEqual( 50, s.getValue() );

        s.setValue(3.3333);
        Y.Assert.areEqual( 3, s.getValue() );

        // out of range constrained by setter
        s.setValue(-10);
        Y.Assert.areEqual( 0, s.getValue() );

        s.setValue(110);
        Y.Assert.areEqual( 100, s.getValue() );
        Y.Assert.areEqual( s.get('value'), s.getValue() );

        s.set('value', 6.66666);
        Y.Assert.areEqual( 7, s.getValue() );
        Y.Assert.areEqual( s.get('value'), s.getValue() );
    },

    "test getValue() and setValue(v) after render() to hidden container": function () {
        var container = Y.Node.create('<div></div>'),
            s = this.slider;

        s.render( container );

        Y.Assert.areEqual( 0, s.getValue() );

        s.setValue(50);
        Y.Assert.areEqual( 50, s.getValue() );

        s.setValue(3.3333);
        Y.Assert.areEqual( 3, s.getValue() );

        s.setValue(-10);
        Y.Assert.areEqual( 0, s.getValue() );

        s.setValue(110);
        Y.Assert.areEqual( 100, s.getValue() );
        Y.Assert.areEqual( s.get('value'), s.getValue() );

        s.set('value', 6.66666);
        Y.Assert.areEqual( 7, s.getValue() );
        Y.Assert.areEqual( s.get('value'), s.getValue() );
    },

    "test getValue() and setValue(v) after render() to DOM": function () {
        var s = this.slider;

        s.render('#testbed');

        Y.Assert.areEqual( 0, s.getValue() );

        s.setValue(50);
        Y.Assert.areEqual( 50, s.getValue() );

        s.setValue(3.3333);
        Y.Assert.areEqual( 3, s.getValue() );

        s.setValue(-10);
        Y.Assert.areEqual( 0, s.getValue() );

        s.setValue(110);
        Y.Assert.areEqual( 100, s.getValue() );
        Y.Assert.areEqual( s.get('value'), s.getValue() );

        s.set('value', 6.66666);
        Y.Assert.areEqual( 7, s.getValue() );
        Y.Assert.areEqual( s.get('value'), s.getValue() );
    },

    "setValue(v) then render() should position thumb": function () {
        var s = this.slider;

        s.setValue(20);
        s.render("#testbed");

        Y.Assert.areEqual( 27, parseInt(s.thumb.getStyle("left"),10) );
    },

    "setValue(v) after render() should move the thumb": function () {
        var s = this.slider;

        s.render('#testbed');

        Y.Assert.areEqual( 0, parseInt(s.thumb.getStyle('left'),10) );

        s.setValue(20);
        Y.Assert.areEqual( 27, parseInt(s.thumb.getStyle('left'),10) );

        s.setValue(0);
        Y.Assert.areEqual( 0, s.getValue() );
        Y.Assert.areEqual( 0, parseInt(s.thumb.getStyle('left'),10) );

        s.setValue(100);
        Y.Assert.areEqual( 100, s.getValue() );
        Y.Assert.areEqual( 135, parseInt(s.thumb.getStyle('left'),10) );
    },

    "setValue(v) when hidden should still move the thumb": function () {
        var s = this.slider;

        Y.one('#testbed').setStyle('display','none');

        s.render('#testbed');

        Y.Assert.areEqual( 0, parseInt(s.thumb.getStyle('left'),10) );

        s.setValue(20);
        Y.Assert.areEqual( 27, parseInt(s.thumb.getStyle('left'),10) );


        Y.one('#testbed').setStyle('display','');
        Y.Assert.areEqual( 27, parseInt(s.thumb.getStyle('left'),10) );
    }
}));

suite.add( new Y.Test.Case({
    name: "Attributes",

    _should: {
        ignore: {
            "test clickableRail": Y.UA.phantomjs || Y.UA.touchEnabled
        }
    },

    setUp: function () {
        Y.one('body').append('<span id="testbed"></span>');
    },

    tearDown: function () {
        Y.one('#testbed').remove(true);
    },

    "test axis": function () {
        var testbed = Y.one('#testbed'),
            slider = new Y.Slider({ axis: 'x' }).render( testbed ),
            bb = testbed.get("firstChild");

        Y.assert( (bb.get("offsetWidth") > 100), "offsetWidth > 100" );
        Y.assert( (bb.get("offsetHeight") < 50), "offsetHeight < 50" );

        slider.destroy();

        slider = new Y.Slider({ axis: 'y' }).render( testbed );
        bb = testbed.get("firstChild");

        Y.assert( (bb.get("offsetHeight") > 100), "offsetHeight > 100" );
        Y.assert( (bb.get("offsetWidth") < 50), "offsetWidth < 50" );

        slider.destroy();
    },

    "axis should be writeOnce": function () {
        var slider = new Y.Slider();

        Y.Assert.areEqual("x", slider.get("axis"));

        slider.set('axis', 'y');
        Y.Assert.areEqual("x", slider.get("axis"));

        slider.destroy();

        slider = new Y.Slider({ axis: 'y' });
        Y.Assert.areEqual("y", slider.get("axis"));

        slider.set('axis', 'x');
        Y.Assert.areEqual("y", slider.get("axis"));
    },

    "axis should only accept 'x', 'X', 'y', and 'Y'": function () {
        var attempts = "a b c 1 2 3 yx yy YX YY vertical vert eks".split(/ /);

        Y.each( attempts, function ( axis ) {
            var slider = new Y.Slider({ axis: axis });
            Y.Assert.areEqual("x", slider.get("axis"));
            slider.destroy();
        });

        attempts = ['y', 'Y'];
        Y.each( attempts, function ( axis ) {
            var slider = new Y.Slider({ axis: axis });
            Y.Assert.areEqual("y", slider.get("axis"));
            slider.destroy();
        });
    },

    "test length": function () {
        Y.one('#testbed').append('<div id="slider"></div><div id="ref"></div>');

        var testbed = Y.one("#slider"),
            ref     = Y.one("#ref"),
            slider, delta, bb;

        slider = new Y.Slider().render( testbed );
        bb = testbed.get('firstChild');

        delta = bb.get('offsetWidth') - parseInt(slider.get('length'), 10);

        slider.destroy();

        slider = new Y.Slider({ length: 50 }).render( testbed );
        bb = testbed.get('firstChild');

        Y.Assert.areEqual( (50 + delta), bb.get('offsetWidth') );

        slider.set('length', 300);
        Y.Assert.areEqual( (300 + delta), bb.get('offsetWidth') );

        slider.set('length', "-140px");
        Y.Assert.areEqual( (300 + delta), bb.get('offsetWidth') );

        ref.setStyle("width", "23.5em");
        slider.set('length', '23.5em');
        Y.Assert.areEqual( (ref.get('offsetWidth') + delta), bb.get('offsetWidth') );

        slider.destroy();

        slider = new Y.Slider({ axis: 'y' }).render( testbed );
        bb = testbed.get('firstChild');

        delta = bb.get('offsetHeight') - parseInt(slider.get('length'), 10);

        slider.destroy();

        slider = new Y.Slider({ axis: 'y', length: 50 }).render( testbed );
        bb = testbed.get('firstChild');

        Y.Assert.areEqual( (50 + delta), bb.get('offsetHeight') );

        slider.set('length', 300);
        Y.Assert.areEqual( (300 + delta), bb.get('offsetHeight') );

        slider.set('length', "-140px");
        Y.Assert.areEqual( (300 + delta), bb.get('offsetHeight') );

        ref.setStyle("height", "23.5em");
        slider.set('length', '23.5em');
        Y.Assert.areEqual( (ref.get('offsetHeight') + delta), bb.get('offsetHeight') );
    },

    "thumbUrl should default at render()": function () {
        var slider = new Y.Slider();
        
        Y.Assert.isNull( slider.get('thumbUrl') );
        
        slider.render('#testbed');

        Y.Assert.isString( slider.get('thumbUrl') );

        slider.destroy();
    },

    "thumbUrl should default to sam skin": function () {
        var slider = new Y.Slider().render("#testbed");

        Y.Assert.areEqual( Y.config.base + 'slider-base/assets/skins/sam/thumb-x.png', slider.get('thumbUrl') );

        slider.destroy();
    },

    "thumbUrl should default from the current skin": function () {
        var testbed = Y.one("#testbed"),
            slider  = new Y.Slider();

        testbed.addClass("yui3-skin-foo");

        slider.render( testbed );

        Y.Assert.areEqual( Y.config.base + 'slider-base/assets/skins/foo/thumb-x.png', slider.get('thumbUrl') );

        slider.destroy();
    },

    //TODO This test uses click simulation and will fail in touch environments
    "test clickableRail": function () {
        var slider = new Y.Slider({
                width    : '300px',
                clickableRail: true
            }),
            railRegion, fake_event, fired,
            noop = function() {};

        slider.on('railMouseDown', function () {
            fired = true;
        });

        slider.render('#testbed');

        railRegion = slider.rail.get('region');
        fake_event = {
            clientX: railRegion.left + Math.floor(railRegion.width / 2),
            clientY: railRegion.top + Math.floor(railRegion.height / 2),
            pageX: railRegion.left + Math.floor(railRegion.width / 2),
            pageY: railRegion.top + Math.floor(railRegion.height / 2),
            halt: noop
        };


        slider.on('railMouseDown', function (e) {
            fired = true;
        });

        slider._onRailMouseDown(fake_event);

        Y.Assert.isTrue(fired, "railMouseDown didn't fire for clickableRail: true");

        fired = false;

        slider.destroy();

        Y.one('#testbed').empty();

        slider = new Y.Slider({
            width    : '300px',
            clickableRail: false
        });

        slider.on('railMouseDown', function () {
            fired = true;
        });

        slider.render('#testbed');

        slider._onRailMouseDown(fake_event);

        Y.Assert.isFalse(fired, "railMouseDown fired for clickableRail: false");

        slider.destroy();
    },

    "test min": function () {
        var slider = new Y.Slider({ min: -100 });

        Y.Assert.areSame(-100, slider.get('min'));

        slider.set('min', 0);

        Y.Assert.areSame(0, slider.get('min'));

        slider.destroy();
    },

    "test max": function () {
        var slider = new Y.Slider({ max: 33 });

        Y.Assert.areSame(33, slider.get('max'));

        slider.set('max', 80);

        Y.Assert.areSame(80, slider.get('max'));

        slider.destroy();
    },

    "test value": function () {
        var slider = new Y.Slider({ min: 0, max: 100, value: 50 });

        Y.Assert.areSame(50, slider.get('value'));

        slider.set('value', 0);

        Y.Assert.areSame(0, slider.get('value'));

        slider.destroy();
    },

    "setting the value outside the min or max should constrain it": function () {
        var slider = new Y.Slider({ min: 0, max: 100, value: 50 });

        Y.Assert.areSame(50, slider.get('value'));

        slider.set('value', -10);

        Y.Assert.areSame(0, slider.get('value'));

        slider.set('value', 110);

        Y.Assert.areSame(100, slider.get('value'));

        slider.destroy();
    },

    "setting the min or max should update the value if necessary": function () {
        var slider = new Y.Slider({ min: 0, max: 100, value: 50 });

        slider.render('#testbed');

        Y.Assert.areSame(50, slider.get('value'));

        slider.set('min', 60);

        Y.Assert.areSame(60, slider.get('value'));

        slider.set('min', 0);
        Y.Assert.areSame(60, slider.get('value'));

        slider.set('max', 50);

        Y.Assert.areSame(50, slider.get('value'));

        slider.destroy();
    },

    "instantiating with disabled: true should lock the thumb": function () {
        var slider = new Y.Slider({ disabled: true }).render('#testbed');

        Y.Assert.isTrue(slider._dd.get('lock'));

        slider.destroy();
    },

    "test ARIA attributes upon instantiation": function () {
        var slider  = new Y.Slider({ min: 0, max: 100, value: 50 });

        slider.render('#testbed');

        var thumb = slider.thumb;

        Y.Assert.areEqual(0, thumb.getAttribute('aria-valuemin'));
        Y.Assert.areEqual(100, thumb.getAttribute('aria-valuemax'));
        Y.Assert.areEqual(50, thumb.getAttribute('aria-valuenow'));
        Y.Assert.areEqual(50, thumb.getAttribute('aria-valuetext'));

        slider.destroy();
    }
}));

suite.add( new Y.Test.Case({
    name: "Mouse",
    _should: {
        ignore: {
            "clicking on the rail should move the thumb": Y.UA.phantomjs || Y.UA.touchEnabled
        }
    },
    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },
    
    //TODO This test uses click simulation and will fail in touch environments
    "clicking on the rail should move the thumb": function () {
        var slider = new Y.Slider({
                length: '350px',
                min   : 0,
                max   : 100,
                value : 50
            }),
            position, fired, railRegion, fake_event,
            noop = function() {};

        function thumbPosition() {
            return parseInt(slider.thumb.getStyle('left'), 10);
        }

        slider.render( "#testbed" );

        railRegion = slider.rail.get('region');
        fake_event = {
            clientX: railRegion.left + Math.floor(railRegion.width / 2),
            clientY: railRegion.top + Math.floor(railRegion.height / 2),
            pageX: railRegion.left + Math.floor(railRegion.width / 2),
            pageY: railRegion.top + Math.floor(railRegion.height / 2),
            halt: noop
        };

        Y.Assert.areNotSame(0, thumbPosition());

        slider.set('value', 0);

        Y.Assert.areSame(0, thumbPosition());

        slider.on('railMouseDown', function (fake_event) {
            fired = true;
        });

        slider._onRailMouseDown(fake_event);

        Y.Assert.isTrue(fired, "Failed to fire: railMouseDown");
        Y.Assert.isTrue( (thumbPosition() > 0), "Failed to find thumPosition > 0" );
    }
}));

suite.add( new Y.Test.Case({
    name: "Keyboard",

    setUp: function () {
        Y.one("body").append('<div id="testbed"></div>');
    },

    tearDown: function () {
        Y.one("#testbed").remove(true);
    },

    "test keyboard input": function () {
        var slider = new Y.Slider({
            length: '350px',
            min   : 0,
            max   : 100,
            value : 50
        });

        slider.render( "#testbed" );
        Y.Assert.areEqual( 50, slider.get('value') );
        var thumb = slider.thumb;
        thumb.key(33); // pageUp  // .key() method is at top of this file
        Y.Assert.areEqual(60, slider.get('value'));
        thumb.key(38); // up
        Y.Assert.areEqual(61, slider.get('value'));
        thumb.key(39); // right
        Y.Assert.areEqual(62, slider.get('value'));
        thumb.key(33); // pageUp
        Y.Assert.areEqual(72, slider.get('value'));
        thumb.key(40); // down
        Y.Assert.areEqual(71, slider.get('value'));
        thumb.key(34); // pageDown
        Y.Assert.areEqual(61, slider.get('value'));
        thumb.key(37); // left
        thumb.key(37); // left
        Y.Assert.areEqual(59, slider.get('value'));
        thumb.key(36); // home 
        Y.Assert.areEqual(0, slider.get('value'));
        thumb.key(35); // end 
        Y.Assert.areEqual(100, slider.get('value'));
        // beyond max
        thumb.key(33); // pageUp
        Y.Assert.areEqual(100, slider.get('value'));
        thumb.key(38); // up
        Y.Assert.areEqual(100, slider.get('value'));
        thumb.key(39); // right
        Y.Assert.areEqual(100, slider.get('value'));

        // min and beyond
        slider.set('value', 0);
        thumb.key(34); // pageDown
        Y.Assert.areEqual(0, slider.get('value'), "= pageDown at min");
        thumb.key(40); // down
        Y.Assert.areEqual(0, slider.get('value'));
        thumb.key(37); // left
        Y.Assert.areEqual(0, slider.get('value'));

        slider.destroy();

    },

    "test focus on thumb by click": function () {
        var slider = new Y.Slider({
            length: '350px',
            min   : 0,
            max   : 100,
            value : 50,
            majorStep : 34
        });

        slider.render( "#testbed" );
        Y.Assert.areEqual( 50, slider.get('value') );
        var thumb = slider.thumb;
        thumb.on('focus', function(){
            // 33 is pageUp. Increase value = init value + majorStep
            // .key() method is at top of this file
            thumb.key(33);  
        });
        thumb.simulate('click'); // Should set focus on thumb  
        Y.Assert.areEqual(84, slider.get('value'));

        slider.destroy();
    },
    
    /*
     * This tests changing the value by one unit
     * that would not move the slider a full pixel
     * and because of ticket #2531498, was
     * changing the value back to previous value
     * to match the thumb position
     */                             
    "test keyboard input and resultant value change, when Slider length is less than max - min": function () {
        var slider = new Y.Slider({
            length: '30px',  // length less than max - min
            min   : 0,
            max   : 100,
            value : 0
        });

        slider.render( "#testbed" );
        Y.Assert.areEqual( 0, slider.get('value') );
        var thumb = slider.thumb;
        thumb.key(38); // up   // .key() method is at top of this file
        Y.Assert.areEqual(1, slider.get('value'), "** init at 0, then keyUp");

        slider.destroy();

    },
    
    "test ARIA attributes while values change by keyboard input": function () {
        var slider = new Y.Slider({
            length: '300px',  // length less than max - min
            min   : 0,
            max   : 100,
            value : 50
        });

        slider.render( "#testbed" );
        Y.Assert.areEqual( 50, slider.get('value') );
        var thumb = slider.thumb;
        Y.Assert.areEqual(0, thumb.getAttribute('aria-valuemin'));
        Y.Assert.areEqual(100, thumb.getAttribute('aria-valuemax'));
        thumb.key(38); // up   // .key() method is at top of this file
        Y.Assert.areEqual(51, thumb.getAttribute('aria-valuenow'));
        Y.Assert.areEqual(51, thumb.getAttribute('aria-valuetext'));
        thumb.key(33); // pageUp
        Y.Assert.areEqual(61, thumb.getAttribute('aria-valuenow'));
        Y.Assert.areEqual(61, thumb.getAttribute('aria-valuetext'));

        slider.destroy();
    }
}));

Y.Test.Runner.add( suite );


}, '@VERSION@' ,{requires:['slider', 'test']});
