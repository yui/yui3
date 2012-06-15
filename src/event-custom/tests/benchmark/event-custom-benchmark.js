YUI.add('event-custom-benchmark', function (Y) {

   var suite = Y.BenchmarkSuite = new Benchmark.Suite();

   suite.add('EventTarget with attribute style publish', function () {

      var et = new Y.EventTarget({
         emitFacade:true
      });

      et.publish("fooChange", {
         queuable:false,
         defaultTargetOnly: true, 
         defaultFn:function() {}, 
         silent:true
      });

   });

   suite.add('EventTarget with attribute style publish, fire, no listeners', function () {

      var et = new Y.EventTarget({
         emitFacade:true
      });

      et.publish("fooChange", {
         queuable:false,
         defaultTargetOnly: true,
         defaultFn:function() {},
         silent:true
      });

      et.fire("fooChange");

   });

   suite.add('EventTarget with attribute style publish, fire, with on/after listeners', function () {

      var et = new Y.EventTarget({
         emitFacade:true
      });

      et.publish("fooChange", {
         queuable:false,
         defaultTargetOnly: true, 
         defaultFn:function() {}, 
         silent:true
      });

      et.on("fooChange", function() {});
      et.after("fooChange", function() {});

      et.fire("fooChange");
   });

}, '@VERSION@', {requires: ['event-custom']});
