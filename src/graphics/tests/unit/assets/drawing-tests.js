YUI.add('drawing-tests', function(Y) {

var parentDiv = Y.DOM.create('<div id="testdiv" style="width: 400px; height: 400px;">'),
    suite = new Y.Test.Suite("Graphics: Drawing"),
    drawingTests = new Y.Test.Case({

        setUp: function() {
            this.graphic = new Y.Graphic({
                render: parentDiv 
            });
            this.path = this.graphic.addShape({
                type: "path"
            });
        },

        tearDown: function() {
            this.graphic.destroy();
        },

        "test: moveTo()" : function() {
            Y.Assert.areEqual(this.path, this.path.moveTo(10, 10), "The moveTo method should return a reference to the path.");
        },

        "test: relativeMoveTo()" : function() {
            Y.Assert.areEqual(this.path, this.path.relativeMoveTo(10, 10), "The relativeMoveTo method should return a reference to the path.");
        },

        "test: lineTo()" : function() {
            Y.Assert.areEqual(this.path, this.path.lineTo(10, 10), "The lineTo method should return a reference to the path.");
            Y.Assert.areEqual(this.path, this.path.lineTo(10, 10, 20, 10, 20, 20, 10, 20, 10, 10), "The lineTo method should return a reference to the path.");
            Y.Assert.areEqual(this.path, this.path.lineTo([10, 10], [20, 10], [20, 20], [10, 20], [10, 10]), "The lineTo method should return a reference to the path.");
        },

        "test: relativeLineTo()" : function() {
            Y.Assert.areEqual(this.path, this.path.relativeLineTo(10, 10), "The relativeLineTo method should return a reference to the path.");
        },

        "test: curveTo()" : function() {
            Y.Assert.areEqual(this.path, this.path.curveTo(83.5, 0, 100.5, 17, 100, 50), "The curveTo method should return a reference to the path.");
            Y.Assert.areEqual(this.path, this.path.curveTo(83.5, 0, 100.5, 17, 100, 50), "The curveTo method should return a reference to the path.");
            this.path._pathArray = [];
            Y.Assert.areEqual(this.path, this.path.curveTo(83.5, 0, 100.5, 17, 100, 50), "The curveTo method should return a reference to the path.");
        },

        "test: relativeCurveTo()" : function() {
            Y.Assert.areEqual(this.path, this.path.relativeCurveTo(83.5, 0, 100.5, 17, 100, 50), "The relativeCurveTo method should return a reference to the path.");
        },

        "test: quadraticCurveTo()" : function() {
            Y.Assert.areEqual(this.path, this.path.quadraticCurveTo(10, 0, 10, 5), "The quadraticCurveTo method should return a reference to the path.");
            Y.Assert.areEqual(this.path, this.path.quadraticCurveTo(10, 0, 10, 5), "The quadraticCurveTo method should return a reference to the path.");
            this.path._pathArray = [];
            Y.Assert.areEqual(this.path, this.path.quadraticCurveTo(10, 0, 10, 5), "The quadraticCurveTo method should return a reference to the path.");
        },

        "test: relativeQuadraticCurveTo()" : function() {
            Y.Assert.areEqual(this.path, this.path.relativeQuadraticCurveTo(10, 0, 10, 5), "The relativeQuadraticCurveTo method should return a reference to the path.");
        },

        "test: drawRect()" : function() {
             Y.Assert.areEqual(this.path, this.path.drawRect(0, 0, 20, 10), "The drawRect method should return a reference to the path.");
        },

        "test: drawRoundRect()" : function() {
             Y.Assert.areEqual(this.path, this.path.drawRoundRect(0, 0, 200, 100, 4, 4), "The drawRoundRect method should return a reference to the path.");
        },

        "test: drawEllipse()" : function() {
             Y.Assert.areEqual(this.path, this.path.drawEllipse(0, 0, 20, 10), "The drawEllipse method should return a reference to the path.");
        },

        "test: drawCircle()" : function() {
             Y.Assert.areEqual(this.path, this.path.drawCircle(0, 0, 10), "The drawCircle method should return a reference to the path.");
        },

        "test: drawDiamond()" : function() {
             Y.Assert.areEqual(this.path, this.path.drawDiamond(0, 0, 20, 10), "The drawDiamond method should return a reference to the path.");
        },

        "test: drawWedge()" : function() {
            Y.Assert.areEqual(this.path, this.path.drawWedge(175, 175, -3, 87, 175), "The drawWedge method should return a reference to the path.");
            this.path.moveTo(100, 85);
            Y.Assert.areEqual(this.path, this.path.drawWedge(175, 175, -3, 87, 175), "The drawWedge method should return a reference to the path.");
            //hit over 360 branch
            Y.Assert.areEqual(this.path, this.path.drawWedge(175, 175, -3, 365, 175), "The drawWedge method should return a reference to the path.");
            //hit 0 segs branch
            Y.Assert.areEqual(this.path, this.path.drawWedge(175, 175, -3, 0, 175), "The drawWedge method should return a reference to the path.");
        }
    });
    
    suite.add(drawingTests);
    Y.Test.Runner.add( suite );


}, '@VERSION@' ,{requires:['graphics', 'test']});
