YUI.add('snippet-benchmark', function (Y) {

   // Expect this to be slower, since we have 2 function hops to add, push with 2 applys
   var q, qa;

   var suite = Y.BenchmarkSuite = new Benchmark.Suite();

   suite.add('new Y.Queue', function () {
      q = new Y.Queue();
   });

   suite.add('new Y.Queue', function () {
      qa = new Y.Queue("a", "b", "c");
   });

}, '@VERSION@', {requires:["yui-base"]});
