YUI.add('dom-xy-test', function(Y) {
    Y.DOM._testXY = function() {
        var Assert = Y.Assert,
            ArrayAssert = Y.ArrayAssert,

            tests = {name: 'Y.DOM.xy'},
            sel = 'h1, .node, table th, table td, table tr, table',
            play2 = Y.DOM.byId('play2'),
            nodes = Y.Selector.query(sel);

        window.scrollTo(100, 100);
        play2.scrollTop = 50;

        Y.each(nodes, function(n) {
            var el = document.createElement('div'),
                xy = Y.DOM.getXY(n),
                box,
                actual,
                id = n.id;

            el.className = 'nodeOver nodeOver-' + n.tagName.toLowerCase();
            el.style.height = n.offsetHeight + 'px';
            el.style.width = n.offsetWidth + 'px';
            document.body.appendChild(el);

            Y.DOM.setXY(el, xy, true);
            box = el.getBoundingClientRect();

            //actual = [box.left + Y.DOM.docScrollX(), box.top + Y.DOM.docScrollY()];
            actual = [el.offsetLeft, el.offsetTop];

            tests['should set ' + id + ' in page coords'] = function() {
                ArrayAssert.itemsAreEqual(actual, [Math.round(xy[0]), Math.round(xy[1])]);
            };
        });

        Y.Test.Runner.add(new Y.Test.Case(tests));
    };
}, '@VERSION@' ,{requires:['dom-screen', 'test']});
