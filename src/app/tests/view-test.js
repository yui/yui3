YUI.add('view-test', function (Y) {

var ArrayAssert  = Y.ArrayAssert,
    Assert       = Y.Assert,
    ObjectAssert = Y.ObjectAssert,

    suite,
    viewSuite;

// -- Global Suite -------------------------------------------------------------
suite = Y.AppTestSuite || (Y.AppTestSuite = new Y.Test.Suite('App Framework'));

// -- View Suite ---------------------------------------------------------------
viewSuite = new Y.Test.Suite('View');

// -- View: Lifecycle ----------------------------------------------------------
viewSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'container should be a <div> node by default': function () {
        var view = new Y.View();

        Assert.isInstanceOf(Y.Node, view.get('container'));
        Assert.areSame('div', view.get('container').get('tagName').toLowerCase());
    },

    'events property should be an empty object by default': function () {
        var view = new Y.View();

        Assert.isObject(view.events);
        Assert.isTrue(Y.Object.isEmpty(view.events));
    },

    'model attribute should be null by default': function () {
        Assert.isNull(new Y.View().get('model'));
    },

    'initializer should allow setting a model reference at init': function () {
        var model = new Y.Model(),
            view  = new Y.View({model: model});

        Assert.areSame(model, view.get('model'));
    },

    'initializer should allow setting a model list reference at init': function () {
        var modelList = new Y.ModelList(),
            view      = new Y.View({modelList: modelList});

        Assert.areSame(modelList, view.get('modelList'));
    },

    'initializer should allow setting a template at init': function () {
        var template = {},
            view     = new Y.View({template: template});

        Assert.areSame(template, view.template);
    },

    'initializer should call create() to create the container node': function () {
        var calls = 0,

            TestView = Y.Base.create('testView', Y.View, [], {
                create: function (container) {
                    calls += 1;
                    Assert.areSame('<b/>', container);
                }
            });

        new TestView({container: '<b/>'});

        Assert.areSame(1, calls);
    },

    'initializer should call attachEvents()': function () {
        var calls  = 0,
            events = {'#foo': {click: 'handler'}},

            TestView = Y.Base.create('testView', Y.View, [], {
                events: {'#bar': {click: 'handler'}},

                attachEvents: function (events) {
                    calls += 1;

                    Assert.areSame(this.events, events);

                    // Ensure that events specified at instantiation time are
                    // merged into any default events, rather than overwriting
                    // all default events.
                    Assert.areSame('handler', events['#foo'].click);
                    Assert.isObject(events['#bar'], 'Events passed at init should be merged into default events.');
                    Assert.areSame('handler', events['#bar'].click);
                }
            });

        new TestView({events: events});

        Assert.areSame(1, calls);
    },

    'destructor should remove the container from the DOM': function () {
        var view = new Y.View();

        Y.one('body').append(view.get('container'));
        Assert.isTrue(view.get('container').inDoc());

        view.destroy();
        Assert.isNull(view.get('container')._node);
    }
}));

viewSuite.add(new Y.Test.Case({
    name: 'Methods',

    'create() should create and return a container node': function () {
        var view = new Y.View(),
            node = Y.Node.create('<div/>');

        Assert.areSame(node, view.create(node), "should return the same node if it's already a node");

        node = view.create('#test');
        Assert.isInstanceOf(Y.Node, node, "should support selector strings");
        Assert.areSame('div', node.get('tagName').toLowerCase());

        node = view.create(Y.config.doc.createElement('div'));
        Assert.isInstanceOf(Y.Node, node, "should support DOM elements");
        Assert.areSame('div', node.get('tagName').toLowerCase());
    },

    'remove() should remove the container node from the DOM': function () {
        var view = new Y.View();

        Y.one('body').append(view.get('container'));
        Assert.isTrue(view.get('container').inDoc());

        view.remove();
        Assert.isFalse(view.get('container').inDoc());
    },

    'render() should be a chainable noop': function () {
        var view = new Y.View();
        Assert.areSame(view, view.render());
    }
}));

suite.add(viewSuite);

}, '@VERSION@', {
    requires: ['model', 'model-list', 'view', 'test']
});
