YUI.add('pathnostroke-benchmark', function (Y) {
    Y.BenchmarkSuite = new Benchmark.Suite();
    var suite = Y.BenchmarkSuite,
        graphic,
        top = 10,
        container = document.createElement('div');
    container.style.display = "block";
    container.style.left = "10px";
    container.style.top = "10px";
    container.style.width = "600px";
    container.style.height = "300px";
    container.id = "container";
    document.body.appendChild(container);
  
    suite.add("PathNoStroke", function() { 
        var x = 0,
            y,
            i, 
            len = 200,
            path = graphic.addShape({
                type: "path",
                fill: {
                    color: "#9aa"
                },
                stroke: null
            });
        path.clear();
        path.moveTo(0, top);
        for(i = 0; i < len; i = i + 1)
        {
            y = i % 2 === 0 ? (top + 25) : top;
            x = x + 5;
            path.lineTo(x, y);
        }
        path.end();
        top = top + 25;
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
