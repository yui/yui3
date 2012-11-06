YUI.add('stylesheet-tests', function(Y) {

// Set up the document for testing

// May need setAttribute?
//Y.one("link:not([href^=http]),link[href=^http://localhost/]").set('id', 'locallink');
Y.one("link").set('id', 'locallink');
if (!Y.one("#testbed")) {
    Y.one("body").append('<div id="testbed"></div>');
}

var d = document,
    Assert      = Y.Assert,
    Dom         = {},
    StyleSheet  = Y.StyleSheet,
    suite       = new Y.Test.Suite("Y.StyleSheet"),
    StyleAssert = {},
    testbed     = d.getElementById('testbed'),
    style   = Y.Node.create('<style type="text/css" id="styleblock"></style>'),
    cssText = 'h1 { font: normal 125%/1.4 Arial, sans-serif; }';

if (!Y.one("#styleblock")) {
    Y.one("head").append(style);

    if (style._node.styleSheet) {
        style._node.styleSheet.cssText = cssText;
    } else {
        style.append(cssText);
    }
}

StyleAssert.normalizeColor = function (c) {
    return c && (c+'').
        replace(/#([0-9a-f])([0-9a-f])([0-9a-f])(?![0-9a-f])/i,'#$1$1$2$2$3$3').
        replace(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})(?![0-9a-f])/i,
            function (m,r,g,b) {
                return "rgb("+parseInt(r,16)+", "+
                              parseInt(g,16)+", "+
                              parseInt(b,16)+")";
            });
};
StyleAssert.areEqual = function (a,b,msg) {
    var aa = StyleAssert.normalizeColor(a),
        bb = StyleAssert.normalizeColor(b);

    if (aa === 'bold') { aa = '700'; }
    if (bb === 'bold') { bb = '700'; }

    if (aa !== bb) {
        throw new Assert.ComparisonFailure(
            Assert._formatMessage(msg, "Values should be equal."), a, b);
    }
};

Dom.add = function (el,tag,conf) {
    var child = d.createElement(tag);
    if (conf) {
        Y.mix(child,conf,true);
    }
    return el.appendChild(child);
};
Dom.getNodeCount = function (tag,root) {
    return (root||d).getElementsByTagName(tag||'*').length;
};
Dom.getSheet = function (yuid) {
    var nodes = d.getElementsByTagName('style'),
        i;

    for (i = nodes.length - 1; i >= 0; --i) {
        if (Y.stamp(nodes[i]) === yuid) {
            return (nodes[i].sheet || nodes[i].styleSheet);
        }
    }
};

suite.add(new Y.Test.Case({
    name : "Test &lt;style&gt; node creation",

    setUp : function () {
        this.styleNodeCount = Dom.getNodeCount('style');
        this.linkNodeCount  = Dom.getNodeCount('link');

        this.testNode = Dom.add(testbed,'div',{id:'target'});
    },

    tearDown : function () {
        testbed.innerHTML = '';
    },

    test_createNew : function () {
        Y.StyleSheet('test');

        Assert.areSame(this.styleNodeCount + 1, Dom.getNodeCount('style'));
    },

    test_createFromExistingStyle : function () {
        Y.StyleSheet('styleblock');

        Assert.areSame(this.styleNodeCount, Dom.getNodeCount('style'));
    },

    test_createFromExistingLink : function () {
        Y.StyleSheet('locallink');

        Assert.areSame(this.styleNodeCount, Dom.getNodeCount('style'),"style");
        Assert.areSame(this.linkNodeCount, Dom.getNodeCount('link'),"link");
    },

    test_createEntireSheet : function () {
        Y.StyleSheet("#target { font-weight: bold; }");

        Assert.areSame(this.styleNodeCount + 1, Dom.getNodeCount('style'));

        StyleAssert.areEqual('bold',Y.DOM.getStyle(this.testNode,'fontWeight'));
    },

    test_gettingFromCache : function () {
        // By name
        var a = new StyleSheet('test'),
            b = new StyleSheet('test');

        Assert.areSame(this.styleNodeCount, Dom.getNodeCount('style'));
        Assert.areSame(a,b,"From cache by name");

        // By generated id
        b = new StyleSheet(a.getId());

        Assert.areSame(this.styleNodeCount, Dom.getNodeCount('style'));
        Assert.areSame(a,b,"From cache by yuiSSID");

        // By node
        a = new StyleSheet(d.getElementById('styleblock'));
        b = new StyleSheet('styleblock');

        Assert.areSame(this.styleNodeCount, Dom.getNodeCount('style'));
        Assert.areSame(a,b,"From cache by node vs id");
    }
}));

suite.add(new Y.Test.Case({
    name : "Test xdomain stylesheet access",

    setUp : function () {
        this.remoteLink = Dom.add(
            d.getElementsByTagName('head')[0],'link',{
                type : 'text/css',
                rel  : 'stylesheet',
                href : 'http://yui.yahooapis.com/2.6.0/build/base/base-min.css'
            });
    },

    tearDown : function () {
        this.remoteLink.parentNode.removeChild(this.remoteLink);
    },

    _should : {
        error : {
            "StyleSheet seeded with remote link should fail"          : true,
            "getCssText on a remote StyleSheet should throw an error" : true,
            "set(..) on a remote StyleSheet should throw an error"    : true,
            "disabling a remote StyleSheet should throw an error"     : true
        }
    },

    "StyleSheet seeded with remote link should fail" : function () {
        // Each line should throw an exception
        Y.StyleSheet(this.remoteLink);

        Y.log("StyleSheet creation allowed from remote file", "warn", "TestRunner");
        throw Error("This is an informative test only");
    },

    "getCssText on a remote StyleSheet should throw an error" : function () {
        // Each line should throw an exception
        var sheet = Y.StyleSheet(this.remoteLink);

        sheet.getCssText();

        Y.log("Getting cssText of a remote StyleSheet allowed", "warn", "TestRunner");
        throw Error("This is an informative test only");
    },

    "set(..) on a remote StyleSheet should throw an error" : function () {
        // Each line should throw an exception
        var sheet = Y.StyleSheet(this.remoteLink);

        sheet.set('#target', { color: '#f00' });

        Y.log("Creating rules in a remote StyleSheet allowed", "warn", "TestRunner");
        throw Error("This is an informative test only");
    },

    "disabling a remote StyleSheet should throw an error" : function () {
        // Each line should throw an exception
        var sheet = Y.StyleSheet(this.remoteLink);

        sheet.disable();

        Y.log("Disabling a remote StyleSheet allowed", "warn", "TestRunner");
        throw Error("This is an informative test only");
    }
}));

suite.add(new Y.Test.Case({
    name : "Test set",

    _should: {
        fail: {
            test_important: 2528707  // bug
        }
    },

    setUp : function () {
        this.stylesheet = new StyleSheet('test');

        this.testNode = Dom.add(testbed,'div',{
            id:'target',
            innerHTML:'<p>1</p><p>2</p><pre>pre</pre>'
        });
    },
    tearDown : function () {
        testbed.innerHTML = '';
        this.stylesheet.unset('#target');
        this.stylesheet.unset('#target p');
        this.stylesheet.unset('#target pre');
        // This should be unnecessary, but for the sake of cleanliness...
        this.stylesheet.unset('#target, #target p, #target pre');
    },

    test_addSimpleSelector : function () {
        this.stylesheet.set('#target',{
            color           : '#123456',
            backgroundColor : '#eef',
            border          : '1px solid #ccc'
        });

        StyleAssert.areEqual('#123456',
                        Y.DOM.getStyle(this.testNode,'color'),
                        "color");
        StyleAssert.areEqual('#eef',
                        Y.DOM.getStyle(this.testNode,'backgroundColor'),
                        "backgroundColor");
        StyleAssert.areEqual('#ccc',
                        Y.DOM.getStyle(this.testNode,'borderLeftColor'),
                        "border");
    },

    test_addRuleWithInvalidValue : function () {
        // This would throw an exception in IE if anywhere
        this.stylesheet.set('#target .foo .bar', { color : 'invalid-value' });
    },

    test_descendantSelector : function () {
        var before = Y.DOM.getStyle(
                        testbed.getElementsByTagName('pre')[0],'textAlign');

        this.stylesheet.set('#target p', { textAlign: 'right' });

        StyleAssert.areEqual('right',
                        Y.DOM.getStyle(
                            testbed.getElementsByTagName('p')[0],'textAlign'),
                        "#target p { text-align: right; }");

        StyleAssert.areEqual(before,
                        Y.DOM.getStyle(
                            testbed.getElementsByTagName('pre')[0],'textAlign'),
                        "#target pre should not be set (maybe auto/inherit?)");
    },

    test_setCommaSelector : function () {
        var sheet = Dom.getSheet(this.stylesheet.getId());

        if (!sheet) {
            Assert.fail("Could not find this StyleSheet's node or sheet");
        }

        this.stylesheet.set('#target, #target p, #target pre', {
            paddingLeft: '16px'
        });

        Assert.areEqual(3,(sheet.cssRules || sheet.rules).length, "Comma selector split failure");

        StyleAssert.areEqual('16px', Y.DOM.getStyle(this.testNode,'paddingLeft'));
        StyleAssert.areEqual('16px',
                        Y.DOM.getStyle(
                            testbed.getElementsByTagName('p')[0],'paddingLeft'),
                        "#target p");
        StyleAssert.areEqual('16px',
                        Y.DOM.getStyle(
                            testbed.getElementsByTagName('pre')[0],'paddingLeft'),
                        "#target pre");
    },

    test_important: function () {
        var target   = Y.one('#target'),
            sheet    = Dom.getSheet(this.stylesheet.getId()),
            original = target.get('offsetHeight');

        if (!sheet) {
            Assert.fail("Could not find this StyleSheet's node or sheet");
        }

        this.stylesheet.set('#target p', {
            paddingBottom: '10px !important'
        });

        Assert.areEqual(1,(sheet.cssRules || sheet.rules).length, "!important rule not added to the sheet");

        Assert.areNotEqual(original, target.get('offsetHeight'));

        Assert.fail(); // remove when the bug is fixed
    }
}));

suite.add(new Y.Test.Case({
    name : "Test Enable/Disable sheet",

    setUp : function () {
        this.stylesheet = new StyleSheet('test');

        this.stylesheet.enable();

        this.testNode = Dom.add(testbed,'div',{id:'target'});

        this.before = {
            color           : Y.DOM.getStyle(this.testNode,'color'),
            backgroundColor : Y.DOM.getStyle(this.testNode,'backgroundColor'),
            borderLeftColor : Y.DOM.getStyle(this.testNode,'borderLeftColor')
        };

    },

    tearDown : function () {
        testbed.innerHTML = '';
        this.stylesheet.enable();
        this.stylesheet.unset('#target');
        this.stylesheet.unset('#target p');
    },

    test_disableSheet : function () {
        this.stylesheet.set('#target',{
            color           : '#123456',
            backgroundColor : '#eef',
            border          : '1px solid #ccc'
        });

        StyleAssert.areEqual('#123456',
                        Y.DOM.getStyle(this.testNode,'color'),
                        "color (enabled)");
        StyleAssert.areEqual('#eef',
                        Y.DOM.getStyle(this.testNode,'backgroundColor'),
                        "backgroundColor (enabled)");
        StyleAssert.areEqual('#ccc',
                        Y.DOM.getStyle(this.testNode,'borderLeftColor'),
                        "border (enabled)");

        this.stylesheet.disable();

        StyleAssert.areEqual(this.before.color,
                        Y.DOM.getStyle(this.testNode,'color'),
                        "color (disabled)");
        StyleAssert.areEqual(this.before.backgroundColor,
                        Y.DOM.getStyle(this.testNode,'backgroundColor'),
                        "backgroundColor (disabled)");
        StyleAssert.areEqual(this.before.borderLeftColor,
                        Y.DOM.getStyle(this.testNode,'borderLeftColor'),
                        "border (disabled)");
    },

    test_enableSheet : function () {
        this.stylesheet.disable();

        this.stylesheet.set('#target',{
            color           : '#123456',
            backgroundColor : '#eef',
            border          : '1px solid #ccc'
        });

        StyleAssert.areEqual(this.before.color,
                        Y.DOM.getStyle(this.testNode,'color'),
                        "color (disabled)");
        StyleAssert.areEqual(this.before.backgroundColor,
                        Y.DOM.getStyle(this.testNode,'backgroundColor'),
                        "backgroundColor (disabled)");
        StyleAssert.areEqual(this.before.borderLeftColor,
                        Y.DOM.getStyle(this.testNode,'borderLeftColor'),
                        "border (disabled)");

        this.stylesheet.enable();

        StyleAssert.areEqual('#123456',
                        Y.DOM.getStyle(this.testNode,'color'),
                        "color (enabled)");
        StyleAssert.areEqual('#eef',
                        Y.DOM.getStyle(this.testNode,'backgroundColor'),
                        "backgroundColor (enabled)");
        StyleAssert.areEqual('#ccc',
                        Y.DOM.getStyle(this.testNode,'borderLeftColor'),
                        "border (enabled)");
    }
}));

suite.add(new Y.Test.Case({
    name : "Test unset",

    setUp : function () {
        this.stylesheet = new StyleSheet('test');

        this.testNode = Dom.add(testbed,'div',{
            id:'target',
            innerHTML:'<p>1</p><p>2</p><pre>pre</pre>'
        });

        this.before = {
            color           : Y.DOM.getStyle(this.testNode,'color'),
            backgroundColor : Y.DOM.getStyle(this.testNode,'backgroundColor'),
            borderLeftColor : Y.DOM.getStyle(this.testNode,'borderLeftColor'),
            textAlign       : Y.DOM.getStyle(this.testNode,'textAlign')
        };

    },
    tearDown : function () {
        testbed.innerHTML = '';
        this.stylesheet.unset('#target');
        this.stylesheet.unset('#target p');
        this.stylesheet.unset('#target pre');
        // This should be unnecessary, but for the sake of cleanliness...
        this.stylesheet.unset('#target, #target p, #target pre');
    },

    test_unset : function () {
        this.stylesheet.set('#target',{
            color           : '#f00',
            backgroundColor : '#eef',
            border          : '1px solid #ccc'
        });

        StyleAssert.areEqual('#f00',
                        Y.DOM.getStyle(this.testNode,'color'),
                        "color (before unset)");
        StyleAssert.areEqual('#eef',
                        Y.DOM.getStyle(this.testNode,'backgroundColor'),
                        "backgroundColor (before unset)");
        StyleAssert.areEqual('#ccc',
                        Y.DOM.getStyle(this.testNode,'borderLeftColor'),
                        "border (before unset)");

        this.stylesheet.unset('#target', 'color');

        StyleAssert.areEqual(this.before.color,
                        Y.DOM.getStyle(this.testNode,'color'),
                        "color (after unset)");

        this.stylesheet.unset('#target', ['backgroundColor','border']);

        StyleAssert.areEqual(this.before.backgroundColor,
                        Y.DOM.getStyle(this.testNode,'backgroundColor'),
                        "backgroundColor (after unset)");
        StyleAssert.areEqual(this.before.borderLeftColor,
                        Y.DOM.getStyle(this.testNode,'borderLeftColor'),
                        "border (after unset)");
    },

    test_removeRule : function () {
        this.stylesheet.set('#target', { textAlign: 'right' });

        StyleAssert.areEqual('right',
                        Y.DOM.getStyle(this.testNode,'textAlign'),
                        "#target { text-align: right; }");

        this.stylesheet.unset('#target');
        StyleAssert.areEqual(this.before.textAlign,
                        Y.DOM.getStyle(this.testNode,'textAlign'),
                        "#target text-align still in place");
    },

    test_unsetCommaSelector : function () {
        var p      = this.testNode.getElementsByTagName('p')[0],
            pre    = this.testNode.getElementsByTagName('pre')[0],
            before = {
                paddingLeft:[
                    Y.DOM.getStyle(this.testNode,'paddingLeft'),
                    Y.DOM.getStyle(p,'paddingLeft'),
                    Y.DOM.getStyle(pre,'paddingLeft')
                ],
                marginRight:[
                    Y.DOM.getStyle(this.testNode,'marginRight'),
                    Y.DOM.getStyle(p,'marginRight'),
                    Y.DOM.getStyle(pre,'marginRight')
                ]
            },
            after,
            sheet = Dom.getSheet(this.stylesheet.getId());

        if (!sheet) {
            Assert.fail("Could not find this StyleSheet's node or sheet");
        }

        this.stylesheet.set('#target, #target p, #target pre', {
            marginRight: '30px',
            paddingLeft: '16px'
        });


        Assert.areEqual(3,(sheet.cssRules || sheet.rules).length,
                        "Comma selector split failure");


        this.stylesheet.unset('#target, #target p, #target pre','paddingLeft');

        after = [
            Y.DOM.getStyle(this.testNode,'paddingLeft'),
            Y.DOM.getStyle(p,'paddingLeft'),
            Y.DOM.getStyle(pre,'paddingLeft')
        ];

        Assert.areEqual(3,(sheet.cssRules || sheet.rules).length,
                        "Should still be 3 rules");

        Y.ArrayAssert.itemsAreEqual(before.paddingLeft,after);

        after = [
            Y.DOM.getStyle(this.testNode,'marginRight'),
            Y.DOM.getStyle(p,'marginRight'),
            Y.DOM.getStyle(pre,'marginRight')
        ];
        Y.ArrayAssert.itemsAreEqual(['30px','30px','30px'],after);
    },

    test_removeCommaSelector : function () {
        var /*p      = this.testNode.getElementsByTagName('p')[0],
            pre    = this.testNode.getElementsByTagName('pre')[0],
            before = {
                paddingLeft: [
                    Y.DOM.getStyle(this.testNode,'paddingLeft'),
                    Y.DOM.getStyle(p,'paddingLeft'),
                    Y.DOM.getStyle(pre,'paddingLeft')
                ]
            },
            */
            sheet = Dom.getSheet(this.stylesheet.getId());

        if (!sheet) {
            Assert.fail("Could not capture this StyleSheet's node or sheet");
        }

        this.stylesheet.set('#target, #target p, #target pre', {
            paddingLeft: '16px'
        });

        Assert.areEqual(3,(sheet.cssRules || sheet.rules).length,
                        "Comma selector split failure");

        this.stylesheet.unset('#target, #target pre','paddingLeft');

        Assert.areEqual(1,(sheet.cssRules || sheet.rules).length);
    }
}));

suite.add(new Y.Test.Case({
    name : "Test getCssText",

    _should: {
        fail: {
            test_important: true
        }
    },

    setUp : function () {
        this.stylesheet = new StyleSheet('test');

        this.testNode = Dom.add(testbed,'div',{
            id:'target',
            innerHTML:'<p>1</p><p>2</p><pre>pre</pre>'
        });

        this.stylesheet.set('#target, #target p', {
            padding: '3px'
        });
    },
    tearDown : function () {
        testbed.innerHTML = '';
        this.stylesheet.unset('#target');
        this.stylesheet.unset('#target p');
    },

    test_getRuleCSS : function () {
        var css = this.stylesheet.getCssText('#target p');
        Y.log(css, 'info','TestLogger');
        Assert.isString(css);
        Assert.areSame(true, /padding/i.test(css));
    },

    test_getSheetCSS : function () {
        var css = this.stylesheet.getCssText();

        Y.log(css, 'info','TestLogger');

        Assert.isString(css);
        Assert.areSame(true, /padding/i.test(css));
        Assert.areSame(true, /#target/i.test(css));
        Assert.areSame(true, /#target\s+p\s+\{/i.test(css));
    },

    test_important: function () {
        this.stylesheet.set('#target p', {
            paddingBottom: '10px !important'
        });

        var css = this.stylesheet.getCssText();

        if (/important/i.test(css)) {
            Y.log("!important not found in cssText", "warn", "TestRunner");
        }

        Assert.fail(); // remove when the bug is fixed
    }
}));

suite.add(new Y.Test.Case({
    name : "Test float/opacity",

    setUp : function () {
        this.stylesheet = new StyleSheet('test');

        if (!d.getElementById('target')) {
            this.testNode = Dom.add(testbed,'div',{
                id:'target',
                innerHTML:'<p id="p1">1</p><p id="p2">2</p><p id="p3">3</p>'
            });
        }
    },

    test_float : function () {
        var p1 = Y.DOM.byId('p1'),
            p2 = Y.DOM.byId('p2'),
            p3 = Y.DOM.byId('p3');

        this.stylesheet.set('#target',{
                            overflow: 'hidden',
                            background: '#000',
                            zoom: 1
                        })
                        .set('#target p',{
                            height:'100px',
                            width:'100px',
                            border: '5px solid #ccc',
                            background: '#fff',
                            margin: '1em'
                        })
                        .set('#p1',{ 'float': 'left' })
                        .set('#p2',{ cssFloat: 'left' })
                        .set('#p3',{ styleFloat: 'left' });

        Assert.areEqual('left', Y.DOM.getStyle(p1,'float'));
        Assert.areEqual('left', Y.DOM.getStyle(p2,'float'));
        Assert.areEqual('left', Y.DOM.getStyle(p3,'float'));
    },

    test_opacity : function () {
        var p1 = Y.DOM.byId('p1'),
            p2 = Y.DOM.byId('p2'),
            p3 = Y.DOM.byId('p3');

        this.stylesheet.set('#p1',{ opacity: 0.5 }).
                        set('#p2',{ opacity: ".2" }).
                        set('#p3',{ opacity: 1 });

        Assert.areEqual(0.5,Y.DOM.getStyle(p1,'opacity'));
        Assert.areEqual(0.2,Y.DOM.getStyle(p2,'opacity'));
        Assert.areEqual(1,Y.DOM.getStyle(p3,'opacity'));
    }
}));

suite.add(new Y.Test.Case({
    name: "Testbed Cleanup",

    testbedCleanup: function () {
        Y.all('#testbed,style').remove(true);
    }
}));

Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['stylesheet', 'test']});
