YUI.add('event-custom-benchmark', function (Y) {

   var suite = Y.BenchmarkSuite = new Benchmark.Suite(),
       I = 0,
       ETPUBLISH,
       ET_FAST_PUBLISH,
       FN = function() {},
       ET10,
       ET2,
       ET;

   ET10 = new Y.EventTarget({
      emitFacade:true
   });

   ET10.publish("fooChange", {
      defaultTargetOnly: true,
      defaultFn:function() {}
   });

   for (var i = 0; i < 5; i++) {
      ET10.on("fooChange", function() {});
      ET10.after("fooChange", function() {});
   }

   ET2 = new Y.EventTarget({
      emitFacade:true
   });


   ET2.publish("fooChange", {
      defaultTargetOnly: true,
      defaultFn:function() {}
   });

   ET2.on("fooChange", function() {});
   ET2.after("fooChange", function() {});

   ET0 = new Y.EventTarget({
      emitFacade:true
   });

   var ET_CFG = {
      defaultTargetOnly: true,
      defaultFn:FN
   };

   // Ideally, would like to create a new ET for each run, but
   // benchmark doesn't give me a trivial way to do that. Live with
   // publishing a new event each time.

   suite.add('Fire - 0 listeners', function () {
      ET0.fire("fooChange");
   });

   suite.add('Fire With Payload - 0 listeners', function () {
      ET0.fire("fooChange", {
         a: 1,
         b: 2,
         c: 3
      });
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
         defaultTargetOnly: true,
         defaultFn:function() {}
      });

      et.fire("fooChange");

   });

   suite.add('EventTarget Construction + Publish(foo) + Subscribe(foo) + Fire(foo) - 2 listeners', function () {

      var et = new Y.EventTarget({
         emitFacade:true
      });

      et.publish("fooChange", {
         defaultTargetOnly: true,
         defaultFn:function() {}
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
         defaultTargetOnly: true,
         defaultFn:function() {}
      });

      for (var i = 0; i < 5; i++) {
         et.on("fooChange", function() {});
         et.after("fooChange", function() {});
      }

      et.fire("fooChange");
   });

   suite.add('new Base()', function () {
      var b = new Y.Base();
   });

   suite.add('new BaseCore()', function () {
      var b = new Y.BaseCore();
   });

   suite.add('Publish', function () {
      // Unfortunate, but best way to reduce variance.
      ETPUBLISH = new Y.EventTarget({emitFacade:true});

      ETPUBLISH.publish("fooChange", ET_CFG);
   });

   suite.add('Low-level Publish', function () {

      var type, e;

      // Unfortunate, but best way to reduce variance.
      ET_FAST_PUBLISH = new Y.EventTarget({emitFacade:true});

      type = ET_FAST_PUBLISH._getFullType("fooChange");

      e = ET_FAST_PUBLISH._publish(type);
      e.emitFacade = true;
      e.defaultFn = FN;
      e.defaultTargetOnly = true;
   });

}, '@VERSION@', {requires: ['event-custom', 'widget']});
