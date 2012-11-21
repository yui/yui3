YUI.add('event-key-tests', function(Y) {

Y.Node.prototype.key = function (keyCode, charCode, mods, type) {
    var simulate = Y.Event.simulate,
        el       = this._node,
        config   = Y.merge(mods || {});

    if (type) {
        if (type === 'keypress') {
            config.charCode = config.keyCode = config.which = charCode || keyCode;
        } else {
            config.keyCode = config.which = keyCode;
        }
        simulate(el, type, config);
    } else {
        config.keyCode = config.which = keyCode;
        simulate(el, 'keydown', config);
        simulate(el, 'keyup', config);

        config.charCode = config.keyCode = config.which = charCode || keyCode;
        simulate(el, 'keypress', config);
    }
};

function setUp() {
    var testbed = Y.one('#testbed'),
        body;

    if (!testbed) {
        body = Y.one('body');
        testbed = body.create('<div id="testbed"></div>');
        body.prepend(testbed);
    }

    testbed.setContent(
    '<ul id="items">' +
        '<li id="item1">' +
            '<div id="div1"><input type="text" id="text1"></div>' +
        '</li>' +
        '<li id="item2">' +
            '<div id="div2"><input type="text" id="text2"></div>' +
        '</li>' +
        '<li id="item3">' +
            '<div id="div3"><textarea id="area1" rows="5" cols="5"></textarea></div>' +
        '</li>' +
    '</ul>');
}

function tearDown() {
    var testbed = Y.one('#testbed');

    if (testbed) {
        testbed.remove().destroy(true);
    }
}

var suite = new Y.Test.Suite("Event: key");

suite.add(new Y.Test.Case({
    name: "node.on('key',...)",

    setUp: setUp,
    tearDown: tearDown,

    "test node.on('key', fn, '65')": function () {
        var input = Y.one("#text1"),
            target, type, currentTarget, keyCode, thisObj;

        input.on("key", function (e) {
            target = e.target;
            type = e.type;
            currentTarget = e.currentTarget;
            keyCode = e.keyCode;
            thisObj = this;
        }, '65');

        input.key(65);

        Y.Assert.areSame(input, target);
        Y.Assert.areSame("key", type);
        Y.Assert.areSame(input, currentTarget);
        Y.Assert.areSame(65, keyCode);
        Y.Assert.areSame(input, thisObj);
    },

    "test node.on('key', fn, '65', thisObj)": function () {
        var input = Y.one("#text1"),
            obj   = { foo: "foo" },
            target, type, currentTarget, keyCode, thisObj;

        input.on("key", function (e) {
            target = e.target;
            type = e.type;
            currentTarget = e.currentTarget;
            keyCode = e.keyCode;
            thisObj = this;
        }, '65', obj);

        input.key(65);

        Y.Assert.areSame(input, target);
        Y.Assert.areSame("key", type);
        Y.Assert.areSame(input, currentTarget);
        Y.Assert.areSame(65, keyCode);
        Y.Assert.areSame(obj, thisObj);
    },

    "test node.on('key', fn, '65', thisObj, args)": function () {
        var input = Y.one("#text1"),
            obj   = { foo: "foo" },
            target, type, currentTarget, keyCode, thisObj, arg;

        input.on("key", function (e, x) {
            target = e.target;
            type = e.type;
            currentTarget = e.currentTarget;
            keyCode = e.keyCode;
            thisObj = this;
            arg = x;
        }, '65', obj, "ARG!");

        input.key(65);

        Y.Assert.areSame(input, target);
        Y.Assert.areSame("key", type);
        Y.Assert.areSame(input, currentTarget);
        Y.Assert.areSame(65, keyCode);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame("ARG!", arg);
    }
}));

suite.add(new Y.Test.Case({
    name: "nodelist.on('key',...)",

    setUp: setUp,
    tearDown: tearDown,

    "test nodelist.on('key', fn, '65')": function () {
        var inputs = Y.all("#items input"),
            item0 = inputs.item(0),
            item1 = inputs.item(1),
            target = [],
            type = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [];

        inputs.on("key", function (e) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            keyCode.push(e.keyCode);
            thisObj.push(this);
        }, '65');

        item0.key(65);
        item1.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        // Synth infrastructure iterates nodelist input for individual
        // subscription for each node, so 'this' is not the nodelist as
        // it is with nodelist.on('click');
        //Y.ArrayAssert.itemsAreSame([inputs, inputs], thisObj);
        Y.ArrayAssert.itemsAreSame([item0, item1], thisObj);
    },

    "test nodelist.on('key', fn, '65', thisObj)": function () {
        var inputs = Y.all("#items input"),
            item0 = inputs.item(0),
            item1 = inputs.item(1),
            obj = { foo: "foo" },
            target = [],
            type = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [];

        inputs.on("key", function (e) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            keyCode.push(e.keyCode);
            thisObj.push(this);
        }, '65', obj);

        item0.key(65);
        item1.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
    },

    "test nodelist.on('key', fn, '65', thisObj, args)": function () {
        var inputs = Y.all("#items input"),
            item0 = inputs.item(0),
            item1 = inputs.item(1),
            obj = { foo: "foo" },
            target = [],
            type = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [],
            arg = [];

        inputs.on("key", function (e, x) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            keyCode.push(e.keyCode);
            thisObj.push(this);
            arg.push(x);
        }, '65', obj, "ARG!");

        item0.key(65);
        item1.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["ARG!", "ARG!"], arg);
    }
}));

suite.add(new Y.Test.Case({
    name: "Y.on('key',...)",

    setUp: setUp,
    tearDown: tearDown,

    "test Y.on('key', fn, selector, '65')": function () {
        var input = Y.one("#text1"),
            target, type, currentTarget, keyCode, thisObj;

        Y.on("key", function (e) {
            target = e.target;
            type = e.type;
            currentTarget = e.currentTarget;
            keyCode = e.keyCode;
            thisObj = this;
        }, '#text1', '65');

        input.key(65);

        Y.Assert.areSame(input, target);
        Y.Assert.areSame("key", type);
        Y.Assert.areSame(input, currentTarget);
        Y.Assert.areSame(65, keyCode);
        Y.Assert.areSame(input, thisObj);
    },

    "test Y.on('key', fn, node, '65')": function () {
        var input = Y.one("#text1"),
            target, type, currentTarget, keyCode, thisObj;

        Y.on("key", function (e) {
            target = e.target;
            type = e.type;
            currentTarget = e.currentTarget;
            keyCode = e.keyCode;
            thisObj = this;
        }, input, '65');

        input.key(65);

        Y.Assert.areSame(input, target);
        Y.Assert.areSame("key", type);
        Y.Assert.areSame(input, currentTarget);
        Y.Assert.areSame(65, keyCode);
        Y.Assert.areSame(input, thisObj);
    },

    "test Y.on('key', fn, selector, '65', thisObj)": function () {
        var input = Y.one("#text1"),
            obj   = { foo: "foo" },
            target, type, currentTarget, keyCode, thisObj;

        Y.on("key", function (e) {
            target = e.target;
            type = e.type;
            currentTarget = e.currentTarget;
            keyCode = e.keyCode;
            thisObj = this;
        }, '#text1', '65', obj);

        input.key(65);

        Y.Assert.areSame(input, target);
        Y.Assert.areSame("key", type);
        Y.Assert.areSame(input, currentTarget);
        Y.Assert.areSame(65, keyCode);
        Y.Assert.areSame(obj, thisObj);
    },

    "test Y.on('key', fn, selector, '65', thisObj, args)": function () {
        var input = Y.one("#text1"),
            obj   = { foo: "foo" },
            target, type, currentTarget, keyCode, thisObj, arg;

        Y.on("key", function (e, x) {
            target = e.target;
            type = e.type;
            currentTarget = e.currentTarget;
            keyCode = e.keyCode;
            thisObj = this;
            arg = x;
        }, '#text1', '65', obj, "ARG!");

        input.key(65);

        Y.Assert.areSame(input, target);
        Y.Assert.areSame("key", type);
        Y.Assert.areSame(input, currentTarget);
        Y.Assert.areSame(65, keyCode);
        Y.Assert.areSame(obj, thisObj);
        Y.Assert.areSame("ARG!", arg);
    }
}));

suite.add(new Y.Test.Case({
    name: "node.delegate('key',...)",

    setUp: setUp,
    tearDown: tearDown,

    "test node.delegate('key', fn, '65', filter)": function () {
        var items = Y.one("#items"),
            item0 = items.one("#text1"),
            item1 = items.one("#text2"),
            item2 = items.one("#area1"),
            target = [],
            type = [],
            container = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [];

        items.delegate("key", function (e) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            container.push(e.container);
            keyCode.push(e.keyCode);
            thisObj.push(this);
        }, '65', 'input');

        item0.key(65);
        item1.key(65);
        item2.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([item0, item1], thisObj);
        Y.ArrayAssert.itemsAreSame([items, items], container);
    },

    "test node.delegate('key', fn, '65', filter, thisObj)": function () {
        var items = Y.one("#items"),
            item0 = items.one("#text1"),
            item1 = items.one("#text2"),
            item2 = items.one("#area1"),
            obj = { foo: "foo" },
            target = [],
            type = [],
            container = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [];

        items.delegate("key", function (e) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            container.push(e.container);
            keyCode.push(e.keyCode);
            thisObj.push(this);
        }, '65', 'input', obj);

        item0.key(65);
        item1.key(65);
        item2.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame([items, items], container);
    },

    "test node.delegate('key', fn, '65', filter, thisObj, args)": function () {
        var items = Y.one("#items"),
            item0 = items.one("#text1"),
            item1 = items.one("#text2"),
            item2 = items.one("#area1"),
            obj = { foo: "foo" },
            target = [],
            type = [],
            container = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [],
            args = [];

        items.delegate("key", function (e, x) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            container.push(e.container);
            keyCode.push(e.keyCode);
            thisObj.push(this);
            args.push(x);
        }, '65', 'input', obj, "ARG!");

        item0.key(65);
        item1.key(65);
        item2.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["ARG!", "ARG!"], args);
        Y.ArrayAssert.itemsAreSame([items, items], container);
    }
}));

suite.add(new Y.Test.Case({
    name: "Y.delegate('key',...)",

    setUp: setUp,
    tearDown: tearDown,

    "test Y.delegate('key', fn, selector, '65', filter)": function () {
        var items = Y.one("#items"),
            item0 = items.one("#text1"),
            item1 = items.one("#text2"),
            item2 = items.one("#area1"),
            target = [],
            type = [],
            container = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [];

        Y.delegate("key", function (e) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            container.push(e.container);
            keyCode.push(e.keyCode);
            thisObj.push(this);
        }, '#items', '65', 'input');

        item0.key(65);
        item1.key(65);
        item2.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([item0, item1], thisObj);
        Y.ArrayAssert.itemsAreSame([items, items], container);
    },

    "test Y.delegate('key', fn, node, '65', filter)": function () {
        var items = Y.one("#items"),
            item0 = items.one("#text1"),
            item1 = items.one("#text2"),
            item2 = items.one("#area1"),
            target = [],
            type = [],
            container = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [];

        Y.delegate("key", function (e) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            container.push(e.container);
            keyCode.push(e.keyCode);
            thisObj.push(this);
        }, items, '65', 'input');

        item0.key(65);
        item1.key(65);
        item2.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([item0, item1], thisObj);
        Y.ArrayAssert.itemsAreSame([items, items], container);
    },

    "test Y.delegate('key', fn, selector, '65', filter, thisObj)": function () {
        var items = Y.one("#items"),
            item0 = items.one("#text1"),
            item1 = items.one("#text2"),
            item2 = items.one("#area1"),
            obj = { foo: "foo" },
            target = [],
            type = [],
            container = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [];

        Y.delegate("key", function (e) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            container.push(e.container);
            keyCode.push(e.keyCode);
            thisObj.push(this);
        }, '#items', '65', 'input', obj);

        item0.key(65);
        item1.key(65);
        item2.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame([items, items], container);
    },

    "test Y.delegate('key', fn, selector, '65', filter, thisObj, args)": function () {
        var items = Y.one("#items"),
            item0 = items.one("#text1"),
            item1 = items.one("#text2"),
            item2 = items.one("#area1"),
            obj = { foo: "foo" },
            target = [],
            type = [],
            container = [],
            currentTarget = [],
            keyCode = [],
            thisObj = [],
            args = [];

        Y.delegate("key", function (e, x) {
            target.push(e.target);
            type.push(e.type);
            currentTarget.push(e.currentTarget);
            container.push(e.container);
            keyCode.push(e.keyCode);
            thisObj.push(this);
            args.push(x);
        }, '#items', '65', 'input', obj, "ARG!");

        item0.key(65);
        item1.key(65);
        item2.key(65);

        Y.ArrayAssert.itemsAreSame([item0, item1], target);
        Y.ArrayAssert.itemsAreSame(["key", "key"], type);
        Y.ArrayAssert.itemsAreSame([item0, item1], currentTarget);
        Y.ArrayAssert.itemsAreSame([65, 65], keyCode);
        Y.ArrayAssert.itemsAreSame([obj, obj], thisObj);
        Y.ArrayAssert.itemsAreSame(["ARG!", "ARG!"], args);
        Y.ArrayAssert.itemsAreSame([items, items], container);
    }

}));

suite.add(new Y.Test.Case({
    name: "key spec/filter",

    setUp: setUp,
    tearDown: tearDown,

    "test 'down:65'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'down:65');

        input.key(65);
        Y.Assert.areSame(1, count);

        input.key(65, null, null, 'keydown');
        Y.Assert.areSame(2, count);

        input.key(65, 65, null, 'keypress');
        Y.Assert.areSame(2, count);

        input.key(99);
        Y.Assert.areSame(2, count);
    },

    "test 'up:65'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'up:65');

        input.key(65);
        Y.Assert.areSame(1, count);

        input.key(65, null, null, 'keyup');
        Y.Assert.areSame(2, count);

        input.key(65, 65, null, 'keypress');
        Y.Assert.areSame(2, count);

        input.key(99);
        Y.Assert.areSame(2, count);
    },

    "test 'press:65'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'press:65');

        input.key(65);
        Y.Assert.areSame(1, count);

        input.key(65, null, null, 'keypress');
        Y.Assert.areSame(2, count);

        input.key(65, 65, null, 'keyup');
        Y.Assert.areSame(2, count);

        input.key(99);
        Y.Assert.areSame(2, count);
    },

    "test 'a'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'a');

        input.key(65, 97);
        Y.Assert.areSame(1, count);

        input.key(65, null, null, 'keydown');
        Y.Assert.areSame(1, count);

        input.key(65, 97, null, 'keypress');
        Y.Assert.areSame(2, count);

        input.key(99);
        Y.Assert.areSame(2, count);
    },

    "test 'down:a'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'down:a');

        // keydown sends keyCode, which for 'a' is 65, but I can't calculate
        // the keyCode from a character, only the charCode (97).  So none of
        // these should match.
        input.key(65, 97);
        Y.Assert.areSame(0, count);

        input.key(65, null, null, 'keydown');
        Y.Assert.areSame(0, count);

        input.key(65, 97, null, 'keypress');
        Y.Assert.areSame(0, count);

        // FIXME: bug confirmation that a different keyCode will trigger the
        // subscriber (keyCode 97 is NOT 'a' in keydown phase).
        input.key(97);
        Y.Assert.areSame(1, count);
    },

    "test 'up:a'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'up:a');

        // keydown sends keyCode, which for 'a' is 65, but I can't calculate
        // the keyCode from a character, only the charCode (97).  So none of
        // these should match.
        input.key(65, 97);
        Y.Assert.areSame(0, count);

        input.key(65, null, null, 'keyup');
        Y.Assert.areSame(0, count);

        input.key(65, 97, null, 'keypress');
        Y.Assert.areSame(0, count);

        // FIXME: bug confirmation that a different keyCode will trigger the
        // subscriber (keyCode 97 is NOT 'a' in keyup phase).
        input.key(97);
        Y.Assert.areSame(1, count);
    },

    "test 'press:a'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'press:a');

        input.key(65, 97);
        Y.Assert.areSame(1, count);

        input.key(65, 97, null, 'keypress');
        Y.Assert.areSame(2, count);

        input.key(65, 97, null, 'keyup');
        Y.Assert.areSame(2, count);

        input.key(99);
        Y.Assert.areSame(2, count);
    },

    "test 'A'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'A');

        input.key(65, 65, { shiftKey: true });
        Y.Assert.areSame(1, count);

        input.key(65, 97); // 'a'
        Y.Assert.areSame(1, count);

        input.key(65, 65, { shiftKey: true }, 'keypress');
        Y.Assert.areSame(2, count);

        input.key(99, 99, { shiftKey: true });
        Y.Assert.areSame(2, count);
    },

    "test 'enter', 'esc', 'backspace', 'tab', 'pageup', 'pagedown'": function () {
        var input = Y.one("#text1"),
            count = 0,
            map = {
                enter    : 13,
                esc      : 27,
                backspace: 8,
                tab      : 9,
                pageup   : 33,
                pagedown : 34
            };

        function inc() {
            count++;
        }

        Y.Object.each(map, function (code, name) {
            count = 0;
            input.on("key", inc, name);

            input.key(code);
            Y.Assert.areSame(1, count);

            // default for named keys is keydown
            input.key(code, null, null, 'keydown');
            Y.Assert.areSame(2, count);

            input.key(code, code, null, 'keypress');
            Y.Assert.areSame(2, count);

            input.key(code + 1);
            Y.Assert.areSame(2, count);
        });
    },

    "test 'a,b'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'a,b');

        input.key(65, 97);
        Y.Assert.areSame(1, count);

        input.key(66, 98);
        Y.Assert.areSame(2, count);

        input.key(65, 97, null, 'keypress');
        Y.Assert.areSame(3, count);

        input.key(66, null, null, 'keyup');
        Y.Assert.areSame(3, count);

        input.key(99);
        Y.Assert.areSame(3, count);
    },

    "test '65,b,esc'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, '65,b,esc');

        input.key(65, 97);
        Y.Assert.areSame(1, count);

        // FIXME: I want this to work, but 'esc' triggers keydown subscription,
        // which breaks the charCode mapping from 'b'.
        input.key(66, 98);
        Y.Assert.areSame(1, count);

        input.key(27);
        Y.Assert.areSame(2, count);

        // subscribed to keydown, so this misses.
        input.key(65, 97, null, 'keypress');
        Y.Assert.areSame(2, count);

        // FIXME: cont.
        input.key(66, null, null, 'keydown');
        Y.Assert.areSame(2, count);

        input.key(27, null, null, 'keydown');
        Y.Assert.areSame(3, count);

        input.key(99);
        Y.Assert.areSame(3, count);
    },

    "test 'unknownKeyName'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'ack!');

        // Uses first character
        input.key(65, 97);
        Y.Assert.areSame(1, count);

        input.key(65, 97, null, 'keypress');
        Y.Assert.areSame(2, count);

        input.key(66, null, null, 'keyup');
        Y.Assert.areSame(2, count);

        input.key(99);
        Y.Assert.areSame(2, count);
    },

    "test '65,unknownKeyName'": function () {
    },

    "test '65,unknownKeyName+alt'": function () {
    },

    "test 'press:a,b'": function () {
    },

    "test 'a+shift'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'press:a,b');

        input.key(65, 97);
        Y.Assert.areSame(1, count);

        input.key(66, 98);
        Y.Assert.areSame(2, count);

        input.key(65, 97, null, 'keypress');
        Y.Assert.areSame(3, count);

        input.key(66, null, null, 'keyup');
        Y.Assert.areSame(3, count);

        input.key(99);
        Y.Assert.areSame(3, count);
    },

    "test 'enter+ctrl'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'enter+ctrl');

        input.key(13);
        Y.Assert.areSame(0, count);

        input.key(13, null, { ctrlKey: true });
        Y.Assert.areSame(1, count);

        input.key(13, 13, { ctrlKey: true }, 'keypress');
        Y.Assert.areSame(1, count);

        input.key(13, null, { ctrlKey: true }, 'keydown');
        Y.Assert.areSame(2, count);

        input.key(99);
        Y.Assert.areSame(2, count);
    },

    "test 'up:a+alt'": function () {
    },

    "test 'a,b+shift+meta'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'a,b+shift+meta');

        input.key(65, 97);
        Y.Assert.areSame(0, count);

        input.key(65, 97, { ctrlKey: true });
        Y.Assert.areSame(0, count);

        input.key(65, 65, { ctrlKey: true, shiftKey: true });
        Y.Assert.areSame(0, count);

        input.key(65, 65, { metaKey: true, shiftKey: true });
        Y.Assert.areSame(1, count);

        input.key(65, 65, { ctrlKey: true, metaKey: true, shiftKey: true });
        Y.Assert.areSame(2, count);

        input.key(66, 66, { metaKey: true, shiftKey: true });
        Y.Assert.areSame(3, count);

        input.key(65, 65, { metaKey: true, shiftKey: true }, 'keypress');
        Y.Assert.areSame(4, count);

        input.key(65, null, { metaKey: true, shiftKey: true }, 'keyup');
        Y.Assert.areSame(4, count);

        input.key(99, 99, { metaKey: true, shiftKey: true });
        Y.Assert.areSame(4, count);
    },

    "test spec with spaces 'down:65, 66,   67'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'down:65, 66,   67');

        input.key(65);
        Y.Assert.areSame(1, count);

        input.key(66);
        Y.Assert.areSame(2, count);

        input.key(67);
        Y.Assert.areSame(3, count);

        input.key(65, null, null, 'keyup');
        Y.Assert.areSame(3, count);

        input.key(65, null, null, 'keydown');
        Y.Assert.areSame(4, count);
    },

    "test spec with no keyCodes 'down:'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, 'down:');

        input.key(65);
        Y.Assert.areSame(1, count);

        input.key(66);
        Y.Assert.areSame(2, count);

        input.key(67);
        Y.Assert.areSame(3, count);

        input.key(65, null, null, 'keyup');
        Y.Assert.areSame(3, count);

        input.key(40, null, null, 'keydown');
        Y.Assert.areSame(4, count);
    },

    "test spec with only modifiers '+ctrl+shift'": function () {
        var input = Y.one("#text1"),
            count = 0;

        function inc() {
            count++;
        }

        input.on("key", inc, '+ctrl+shift');

        input.key(65);
        Y.Assert.areSame(0, count);

        input.key(65, 65, { shiftKey: true });
        Y.Assert.areSame(0, count);

        input.key(65, 97, { ctrlKey: true });
        Y.Assert.areSame(0, count);

        input.key(65, 65, { shiftKey: true, ctrlKey: true });
        Y.Assert.areSame(1, count);

        input.key(65, 65, { shiftKey: true, ctrlKey: true, metaKey: true });
        Y.Assert.areSame(2, count);

        input.key(65, null, { shiftKey: true, ctrlKey: true }, 'keyup');
        Y.Assert.areSame(2, count);

        input.key(65, 65, { shiftKey: true, ctrlKey: true }, 'keypress');
        Y.Assert.areSame(3, count);
    }
}));

suite.add(new Y.Test.Case({
    name: "detach",

    setUp: setUp,
    tearDown: tearDown,

    "test node.on() + node.detach()": function () {
    },

    "test Y.on() + node.detach()": function () {
    },

    "test node.on() + handle.detach()": function () {
    },

    "test node.on('cat|key',...) + node.detach('cat|...')": function () {
    },

    "test node.delegate() + node.detach()": function () {
    },

    "test node.delegate() + handle.detach()": function () {
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['event-key', 'test']});
