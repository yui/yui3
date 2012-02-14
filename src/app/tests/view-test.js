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

    'default container should be created lazily': function () {
        var calls = {
                attachEvents: 0,
                create: 0
            },

            MyView = Y.Base.create('myView', Y.View, [], {
                attachEvents: function () {
                    calls.attachEvents += 1;
                    return Y.View.prototype.attachEvents.apply(this, arguments);
                },

                create: function () {
                    calls.create += 1;
                    return Y.View.prototype.create.apply(this, arguments);
                }
            });

        a = new MyView();
        Assert.areSame(0, calls.create, 'create() should not be called before the container is retrieved');
        Assert.areSame(0, calls.attachEvents, 'attachEvents() should not be called before the container is retrieved');

        a.get('container');
        Assert.areSame(1, calls.create, 'create() should be called the first time the container is retrieved');
        Assert.areSame(1, calls.attachEvents, 'attachEvents() should be called the first time the container is retrieved');

        a.get('container');
        Assert.areSame(1, calls.create, 'create() should not be called more than once');
        Assert.areSame(1, calls.attachEvents, 'attachEvents() should not be called more than once');
    },

    'container events should be attached lazily when specified via a valueFn': function () {
        var calls = {
                attachEvents: 0,
                create: 0
            },

            MyView = Y.Base.create('myView', Y.View, [], {
                attachEvents: function () {
                    calls.attachEvents += 1;
                    return Y.View.prototype.attachEvents.apply(this, arguments);
                },

                create: function () {
                    calls.create += 1;
                    return Y.View.prototype.create.apply(this, arguments);
                }
            }, {
                ATTRS: {
                    container: {
                        valueFn: function () {
                            return Y.Node.create('<span class="valuefn-container"/>');
                        }
                    }
                }
            });

        a = new MyView();
        Assert.areSame(0, calls.create, 'create() should not be called before the container is retrieved');
        Assert.areSame(0, calls.attachEvents, 'attachEvents() should not be called before the container is retrieved');

        Assert.areSame('valuefn-container', a.get('container').get('className'), "container's CSS class should be 'valuefn-container'");
        Assert.areSame(0, calls.create, 'create() should not be called when the container is retrieved');
        Assert.areSame(1, calls.attachEvents, 'attachEvents() should be called the first time the container is retrieved');

        a.get('container');
        Assert.areSame(1, calls.attachEvents, 'attachEvents() should not be called more than once');
    },

    'container events should be attached lazily when specified via an attr value': function () {
        var calls = {
                attachEvents: 0,
                create: 0
            },

            MyView = Y.Base.create('myView', Y.View, [], {
                attachEvents: function () {
                    calls.attachEvents += 1;
                    return Y.View.prototype.attachEvents.apply(this, arguments);
                },

                create: function () {
                    calls.create += 1;
                    return Y.View.prototype.create.apply(this, arguments);
                }
            }, {
                ATTRS: {
                    container: {
                        value: Y.Node.create('<div class="value-container"/>')
                    }
                }
            });

        a = new MyView();
        Assert.areSame(0, calls.create, 'create() should not be called before the container is retrieved');
        Assert.areSame(0, calls.attachEvents, 'attachEvents() should not be called before the container is retrieved');

        Assert.areSame('value-container', a.get('container').get('className'), "container's CSS class should be 'value-container'");
        Assert.areSame(0, calls.create, 'create() should not be called');
        Assert.areSame(1, calls.attachEvents, 'attachEvents() should be called the first time the container is retrieved');

        a.get('container');
        Assert.areSame(1, calls.attachEvents, 'attachEvents() should not be called more than once');
    },

    'events property should be an empty object by default': function () {
        var view = new Y.View();

        Assert.isObject(view.events);
        Assert.isTrue(Y.Object.isEmpty(view.events));
    },

    'initializer should allow setting a ad-hoc attrs': function () {
        var model = new Y.Model(),
            view  = new Y.View({model: model, foo: 'bar'});

        Assert.areSame(model, view.get('model'));
        Assert.areSame('bar', view.get('foo'));
    },

    'initializer should allow setting a containerTemplate at init': function () {
        var view = new Y.View({containerTemplate: '<div class="my-container"/>'});

        Assert.areSame('<div class="my-container"/>', view.containerTemplate);
        Assert.isUndefined(view.get('containerTemplate'), 'containerTemplate config should not become an ad-hoc attr');
    },

    'initializer should allow setting events at init': function () {
        var events = {
                '.foo': {
                    click: '_onFooClick'
                }
            },

            view = new Y.View({events: events});

        ObjectAssert.ownsKey('.foo', view.events);
        Assert.areSame('_onFooClick', view.events['.foo'].click);
        Assert.isUndefined(view.get('events'), 'events config should not become an ad-hoc attr');
    },

    'initializer should allow setting a template at init': function () {
        var template = {},
            view     = new Y.View({template: template});

        Assert.areSame(template, view.template);
        Assert.isUndefined(view.get('template'), 'template config should not become an ad-hoc attr');
    },

    'create() should not be called on init': function () {
        var TestView = Y.Base.create('testView', Y.View, [], {
                create: function () {
                    Assert.fail('create() should not be called');
                }
            });

        new TestView();
    },

    'destructor should not remove the container by default': function () {
        var view = new Y.View();

        Y.one('body').append(view.get('container'));
        Assert.isTrue(view.get('container').inDoc());

        view.destroy();
        Assert.isTrue(view.get('container').inDoc());
    },

    'destructor should remove the container from the DOM if `remove` options is truthy': function () {
        var view = new Y.View();

        Y.one('body').append(view.get('container'));
        Assert.isTrue(view.get('container').inDoc());

        view.destroy({remove: true});
        Assert.isNull(view.get('container')._node);
    }
}));

viewSuite.add(new Y.Test.Case({
    name: 'Attributes',

    'attachEvents() should be called when the container attr changes': function () {
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
                    Assert.areSame('handler', events['#foo'].click, '#foo click handler should exist');
                    Assert.isObject(events['#bar'], 'Events passed at init should be merged into default events.');
                    Assert.areSame('handler', events['#bar'].click, '#bar click handler should exist');
                }
            });

        var view = new TestView({events: events});
        view.get('container');

        Assert.areSame(1, calls);
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
