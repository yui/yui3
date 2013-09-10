YUI.add('circle-benchmark', function (Y) {
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
  
    suite.add("Circle", function() { 
        var circle = graphic.addShape({
                type: "circle",
                radius: 8,
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
