YUI.add("widget-stack-tests", function(Y) {
    var L= Y.Lang,
        Assert = Y.Assert,
        Widget = Y.Base.create("widget-stack-tester", Y.Widget, [ Y.WidgetStack ]),
        WidgetAttrValue = Y.Base.create("widget-stack-tester", Y.Widget, [ Y.WidgetStack ], {}, {
            ATTRS : {
                zIndex : {
                    value : 3
                }
            }
        }),
        WidgetAttrValueFn = Y.Base.create("widget-stack-tester", Y.Widget, [ Y.WidgetStack ], {}, {
            ATTRS : {
                zIndex : {
                    valueFn : function() { 
                        return 4; 
                    }
                }
            }
        }),
        
        getZ = function(w) {
            return w.get("boundingBox").getStyle("zIndex");
        };
    
    Y.namespace("Tests").WidgetStack= new Y.Test.Case({
        name : "WidgetStack",
        
        tearDown : function() {
            var w = L.isArray(this.w) ? this.w : [ this.w ];
            
            Y.Array.forEach(w, function(widget) {
                widget.destroy();
            });
        },
        
        "zIndex should default to 1" : function() {
            var w = this.w = new Widget({ render : true });
            
            Assert.areEqual("1", getZ(w));
            Assert.areEqual(1, w.get("zIndex"));
        },
        
        "zIndex should be overrideable by class extension using value": function() {
            var w = this.w = new WidgetAttrValue({ render : true });
            
            Assert.areEqual("3", getZ(w));
            Assert.areEqual(3, w.get("zIndex"));
        },
        
        "zIndex should be overrideable by class extension using valueFn": function() {
            var w = this.w = new WidgetAttrValueFn({ render : true });
            
            Assert.areEqual("4", getZ(w));
            Assert.areEqual(4, w.get("zIndex"));
        },
        
        "zIndex from HTML_PARSER should be correct" : function() {
            var w = this.w = [
                new Widget({ 
                    srcNode : ".style-htmlparser", 
                    render : true 
                }),
                new Widget({ 
                    srcNode : ".css-htmlparser",
                    render : true 
                })
            ];
            
            Assert.areEqual("2", getZ(w[0]));
            Assert.areEqual(2, w[0].get("zIndex"));
            
            Assert.areEqual("2", getZ(w[1]));
            Assert.areEqual(2, w[1].get("zIndex"));
        },
        
        "zIndex from HTML_PARSER shouldn't override class extension ATTR using value" : function() {
            var w = this.w = [
                new WidgetAttrValue({ 
                    srcNode : ".style-htmlparser", 
                    render : true 
                }),
                new WidgetAttrValue({ 
                    srcNode : ".css-htmlparser",
                    render : true 
                })
            ];
            
            Assert.areEqual("3", getZ(w[0]));
            Assert.areEqual(3, w[0].get("zIndex"));
            
            Assert.areEqual("3", getZ(w[1]));
            Assert.areEqual(3, w[1].get("zIndex"));
        },
        
        "zIndex from HTML_PARSER shouldn't override class extension ATTR using valueFn" : function() {
            var w = this.w = [
                new WidgetAttrValueFn({ 
                    srcNode : ".style-htmlparser", 
                    render : true 
                }),
                new WidgetAttrValueFn({ 
                    srcNode : ".css-htmlparser",
                    render : true 
                })
            ];
            
            Assert.areEqual("4", getZ(w[0]));
            Assert.areEqual(4, w[0].get("zIndex"));
            
            Assert.areEqual("4", getZ(w[1]));
            Assert.areEqual(4, w[1].get("zIndex"));
        }
    });
    
}, "@VERSION@", { requires : [
    "test",
    "base-build",
    "widget",
    "widget-stack"
]});