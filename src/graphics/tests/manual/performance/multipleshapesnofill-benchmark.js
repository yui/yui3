YUI.add('multipleshapesnofill-benchmark', function (Y) {
    Y.BenchmarkSuite = new Benchmark.Suite();
    var suite = Y.BenchmarkSuite,
        graphic,
        container = document.createElement('div');
    container.style.left = "10px";
    container.style.top = "10px";
    container.style.width = "600px";
    container.style.height = "300px";
    container.id = "container";
    document.body.appendChild(container);
  
    suite.add("MultipleShapesNoFill", function() { 
        var circle = graphic.addShape({
                type: "circle",
                radius: 8,
                stroke: {
                    color: "#333",
                    weight: 1
                }
            }),
            rect = graphic.addShape({
                type: "rect",
                width: 16,
                height: 8,
                stroke: {
                    color: "#333",
                    weight: 1
                }
            }),
            ellipse = graphic.addShape({
                type: "ellipse",
                width: 16,
                height: 8,
                stroke: {
                    color: "#333",
                    weight: 1
                }
            });
    }, {
        onStart: function() {
            graphic = new Y.Graphic({
                render: container
            });
        },

        onComplete: function() {
            graphic.destroy();
        }
    });
    
}, '@VERSION@', {requires: ['graphics']});
