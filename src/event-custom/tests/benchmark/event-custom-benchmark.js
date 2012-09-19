YUI.add('event-custom-benchmark', function (Y) {

   var suite = Y.BenchmarkSuite = new Benchmark.Suite();

   var ETPUBLISH = new Y.EventTarget({
      emitFacade:true
   });

   var ET10 = new Y.EventTarget({
         emitFacade:true
   });

   ET10.publish("fooChange", {
      queuable:false,
      defaultTargetOnly: true, 
      defaultFn:function() {}, 
      silent:true
   });

   for (var i = 0; i < 5; i++) {
      ET10.on("fooChange", function() {});
      ET10.after("fooChange", function() {});
   }

   var ET2 = new Y.EventTarget({
         emitFacade:true
   });

   ET2.publish("fooChange", {
      queuable:false,
      defaultTargetOnly: true, 
      defaultFn:function() {}, 
      silent:true
   });

   ET2.on("fooChange", function() {});
   ET2.after("fooChange", function() {});

   var ET = new Y.EventTarget({
      emitFacade:true
   });

   var ET_CFG = {
         queuable:false,
         defaultTargetOnly: true, 
         defaultFn:function() {}, 
         silent:true
      };

   suite.add('Publish', function () {
      ETPUBLISH.publish("fooChange", ET_CFG);
   });

   suite.add('Fire - 2 listeners', function () {
      ET2.fire("fooChange");
   });

   suite.add('Fire With Payload - 2 listeners', function () {
      ET2.fire("fooChange", {
         a: 1,
         b: 2,
         c: 3
      });
   });

   suite.add('Fire - 10 listeners', function () {
      ET10.fire("fooChange");
   });

   suite.add('Fire With Payload - 10 listeners', function () {
      ET10.fire("fooChange", {
         a: 1,
         b: 2,
         c: 3
      });
   });

   suite.add('EventTarget Construction + Publish(foo) + Fire(foo) - no listeners', function () {

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

   suite.add('EventTarget Construction + Publish(foo) + Subscribe(foo) + Fire(foo) - 2 listeners', function () {

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

   suite.add('EventTarget Construction + Publish(foo) + Subscribe(foo) + Fire(foo) - 10 listeners', function () {

      var et = new Y.EventTarget({
         emitFacade:true
      });

      et.publish("fooChange", {
         queuable:false,
         defaultTargetOnly: true, 
         defaultFn:function() {}, 
         silent:true
      });

      for (var i = 0; i < 5; i++) {
         et.on("fooChange", function() {});
         et.after("fooChange", function() {});
      }

      et.fire("fooChange");
   });

   suite.add('Publish - 10 different events', function () {

      for (var i = 0; i < 10; i++) {
         ET.publish("fooChange" + i, ET_CFG);
      }

   });

   suite.add('Fire - 10 different events, no listeners', function () {

      for (var i = 0; i < 10; i++) {
         ET.fire("fooChange" + i);
      }

   });

   suite.add('Subscribe + Fire - 10 different events', function () {

      for (var i = 0; i < 10; i++) {
         ET.on("fooChange" + i, function() {});
         ET.after("fooChange" + i, function() {});
      }

      for (i = 0; i < 10; i++) {
         ET.fire("fooChange" + i);
      }

   });

   suite.add('new Base()', function () {
      var b = new Y.Base();
   });

   suite.add('new BaseCore()', function () {
      var b = new Y.BaseCore();
   });

}, '@VERSION@', {requires: ['event-custom', 'widget']});
