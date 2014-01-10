YUI.add('shape-tests', function(Y) {

var parentDiv = Y.DOM.create('<div id="testdiv" style="width: 400px; height: 400px;">'),
    suite = new Y.Test.Suite("Graphics: Shape"),
    shapeTests,
    DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);

    shapeTests = new Y.Test.Case({

        setUp: function() {
            this.graphic = new Y.Graphic({
                render: parentDiv 
            });
            this.shape = this.graphic.addShape({
                type: "path"
            });
        },

        tearDown: function() {
            this.graphic.destroy();
            Y.Event.purgeElement(DOC, false);
        },

        "test: new Y.Shape()" : function() {
            Y.Assert.isInstanceOf(Y.Shape, this.shape, "This should be an instance of Y.Shape.");
        },

        "test: initializer()" : function() {
            function MockInitializerShape() {}
            MockInitializerShape.prototype = {
                _setGraphicCalled: false,
                _parsePathDataCalled: false,
                _updateHandlerCalled: false,
                _setGraphic: function() {
                    this._setGraphicCalled = true;   
                },
                _parsePathData: function() {
                    this._parsePathDataCalled = true;
                },
                _updateHandler: function() {
                    this._updateHandlerCalled = true;
                },
                get: function() {
                    return this._pathData;
                },
                createNode: function() {},
                _initProps: function() {}
            };
            var mockShape = new MockInitializerShape(),
                shape = this.shape;
            shape.initializer.apply(mockShape, [{}]);
            Y.Assert.isFalse(mockShape._setGraphicCalled, "The _setGraphic method should not be called when a graphic is not available.");
            Y.Assert.isFalse(mockShape._parsePathDataCalled, "The _parsePathData method should not be called when a graphic is not available.");
            Y.Assert.isTrue(mockShape._updateHandlerCalled, "the _updateHandler method should have been called.");
            mockShape._pathData = "M5, 0l100, 215 c 150 60 150 60 300 0z";
            shape.initializer.apply(mockShape, [{graphic: this.graphic}]);
            Y.Assert.isTrue(mockShape._setGraphicCalled, "The _setGraphic method should have been called.");
            Y.Assert.isTrue(mockShape._parsePathDataCalled, "The _parsePathData method should have been called.");
        },

        "test: on()" : function() {
            var shape = this.shape,
                handler = function() {
                    //do nothing
                },
                handle = this.shape.on("click", handler);
            Y.Assert.isObject(handle, "The handle should have been set.");
            Y.Assert.areEqual("click", handle.evt.type, "The event should be a click event.");
            handle = shape.on("customEvent", handler);
            Y.Assert.areEqual("customEvent", handle.evt.type, "The event should be a customEvent.");
        },

        "test: toFront()" : function() {
            function MockToFrontShape() {}
            MockToFrontShape.prototype = {
                mockGraphic: null,
                get: function() {
                    return this.mockGraphic;
                }
            };
            var shape = this.shape,
                mockShape = new MockToFrontShape(),
                graphicToFrontCalled = false;
            shape.toFront.apply(mockShape);
            Y.Assert.isFalse(graphicToFrontCalled, "There is no graphic, so the toFront method could not be called.");
            mockShape.mockGraphic = {
                _toFront: function() {
                    graphicToFrontCalled = true;
                }
            };
            shape.toFront.apply(mockShape);
            Y.Assert.isTrue(graphicToFrontCalled, "The graphic's toFront method should have been called.");
        },

        "test: toBack()" : function() {
            function MockToBackShape() {}
            MockToBackShape.prototype = {
                mockGraphic: null,
                get: function() {
                    return this.mockGraphic;
                }
            };
            var shape = this.shape,
                mockShape = new MockToBackShape(),
                graphicToBackCalled = false;
            shape.toBack.apply(mockShape);
            Y.Assert.isFalse(graphicToBackCalled, "There is no graphic, so the toBack method could not be called.");
            mockShape.mockGraphic = {
                _toBack: function() {
                    graphicToBackCalled = true;
                }
            };
            shape.toBack.apply(mockShape);
            Y.Assert.isTrue(graphicToBackCalled, "The graphic's toBack method should have been called.");
        }
    });
    
    suite.add(shapeTests);
    Y.Test.Runner.add( suite );


}, '@VERSION@' ,{requires:['graphics', 'test']});
