YUI.add('ellipse-benchmark', function (Y) {
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
  
    suite.add("Ellipse", function() { 
        var ellipse = graphic.addShape({
                type: "ellipse",
                width: 16,
                height: 8,
                fill: {
                    color: "#9aa"
                },
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
