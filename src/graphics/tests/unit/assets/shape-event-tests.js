YUI.add('shape-event-tests', function(Y) {

function ShapeEventTestTemplate(cfg) {
    var i;
    ShapeEventTestTemplate.superclass.constructor.apply(this);
    for(i in cfg)
    {
        if(cfg.hasOwnProperty(i))
        {
            this[i] = cfg[i];
        }
    }
}
Y.extend(ShapeEventTestTemplate, Y.Test.Case, {
    setUp: function () {
        var node,
            contentBounds,
            nodewidth,
            nodeheight;
        Y.one("body").append('<div id="testbed"></div>');
        Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="graphiccontainer"></div>');
        graphic = new Y.Graphic({render: "#graphiccontainer"});
        this.graphic = graphic;
        this.shape = graphic.addShape(this.attrs);
    },

    tearDown: function () {
        this.graphic.destroy();
        Y.one("#testbed").remove(true);
    },
    
    "test: on()" : function() {
        var clicked = false,
            context,
            ex1,
            ex2,
            obj = {
                a: 1
            },
            shape = this.shape;
        shape.on('click', function(e, extra1, extra2) {
            clicked = true;
            context = this;
            ex1 = extra1;
            ex2 = extra2;
        }, obj, 2, 3);

        Y.Event.simulate(shape.get("node"), 'click');

        Y.Assert.isTrue(clicked, "click handler didn't work");
        Y.Assert.areEqual(1, context.a, "context didn't work");
        Y.Assert.areEqual(2, ex1, "extra arg1 didn't work");
        Y.Assert.areEqual(3, ex2, "extra arg2 didn't work");
    },

    "test: customevent()" : function() {
        var fired = false,
            context,
            ex1,
            ex2,
            obj = {
                a: 1
            },
            shape = this.shape;
        
        shape.on("customFire", function(e, extra1, extra2) {
            fired = true;
            context = this;
            ex1 = extra1;
            ex2 = extra2;
        }, obj, 2, 3);
        
        shape.fire("customFire");

        Y.Assert.isTrue(fired, "click handler didn't work");
        Y.Assert.areEqual(1, context.a, "context didn't work");
        Y.Assert.areEqual(2, ex1, "extra arg1 didn't work");
        Y.Assert.areEqual(3, ex2, "extra arg2 didn't work");
    }
});

var suite = new Y.Test.Suite("Graphics: Shape Event Tests"),
    fill = {
        color: "#9aa"
    },
    stroke = {
        weight: 1,
        color: "#000"
    },
    circleTest = new ShapeEventTestTemplate({
        name: "Circle Event Tests",
        attrs: {
            type: "circle",
            radius: 8,
            fill: fill,
            stroke: stroke
        }
    }),
    rectTest = new ShapeEventTestTemplate({
        name: "Rect Event Tests",
        attrs: {
            type: "rect",
            width: 15,
            height: 15,
            fill: fill,
            stroke: stroke
        }
    }),
    ellipseTest = new ShapeEventTestTemplate({
        name: "Ellipse Event Tests",
        attrs: {
            type: "ellipse",
            width: 15,
            height: 15,
            fill: fill,
            stroke: stroke
        }
    });

suite.add(circleTest);
suite.add(rectTest);
suite.add(ellipseTest);
Y.Test.Runner.add(suite);

}, '@VERSION@' ,{requires:['event-simulate', 'graphics', 'test']});
