YUI.add('cssbase-basic-tests', function(Y) {

    var suite = new Y.Test.Suite('cssbase-basic example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check H1 size': function() {
            var page = Y.one('#page'),
                h = page.one('h1'),
                i = 0,
                size,
                sizePercent = 1.385,
                sizePx = 18,
                viewPort = Y.one('body').get('viewportRegion').right;

            size = Math.round(parseInt(h.getStyle('fontSize'), 10));
            //alert('size H1: ' + size);
            Assert.isTrue((((size - sizePx) < 1) || (Math.abs(size - (sizePercent * viewPort)) < 1)), ' - Failed on ' + h.getHTML());

        },
        'check H2 size': function() {
            var page = Y.one('#page'),
                h = page.one('h2'),
                i = 0,
                size,
                sizePercent = 1.231,
                sizePx = 16,
                viewPort = Y.one('body').get('viewportRegion').right;

            size = Math.round(parseInt(h.getStyle('fontSize'), 10));
            //alert('size H2: ' + size);
            Assert.isTrue((((size - sizePx) < 1) || (Math.abs(size - (sizePercent * viewPort)) < 1)), ' - Failed on ' + h.getHTML());

        },
        'check H3 size': function() {
            var page = Y.one('#page'),
                h = page.one('h3'),
                i = 0,
                size,
                sizePercent = 1.08,
                sizePx = 14,
                viewPort = Y.one('body').get('viewportRegion').right;

            size = Math.round(parseInt(h.getStyle('fontSize'), 10));
            //alert('size H3: ' + size);
            Assert.isTrue((((size - sizePx) < 1) || (Math.abs(size - (sizePercent * viewPort)) < 1)), ' - Failed on "' + h.getHTML() + '".');

        },
        'check background-color is #ffffff': function() {
            Assert.areEqual('rgb(255, 255, 255)', Y.one('html').getComputedStyle('backgroundColor'), ' - Failed to set background-color to "rgb(255, 255, 255)" on html');

        },
        'check table border-collapse is "collapse"': function() {
            Assert.areEqual('collapse', Y.one('table').getComputedStyle('borderCollapse'), ' - Failed to set table border-collapse is "collapse"');

        },
        'check em font-style is "italic"': function() {
            Assert.areEqual('italic', Y.one('em').getComputedStyle('fontStyle'), ' - Failed to set font-style to "italic"');

        },
        'check font weight bold': function() {
            var page = Y.one('#page'),
                h = page.all('h1, h2, h3, h4, h5, h6, strong'),   //em & strong, removed because changed to italic later
                i = 0,
                fweight;
                //alert( "Y.one('th').getComputedStyle('margin'): " + Y.one('th').getComputedStyle('margin'));
            for (i = 0; i < h.size(); i+=1) {
                fweight = h.item(i).getComputedStyle('fontWeight');

                //alert('fweight: ' + fweight);
                Assert.isTrue(((fweight === '700') || (fweight === 700) || (fweight === 'bold')), ' - Failed to set font-style to "", or undefined on ' + h.item(i).getHTML());
            }
        },
        'check ul style': function() {
            var listStyle = Y.one('#page ul').getComputedStyle('listStyle');
            //alert('listStyle: ' + listStyle);
            Assert.isTrue(((listStyle === '') || (listStyle === undefined) || (listStyle === 'disc outside none') || (listStyle === 'none outside none')), ' - Failed to set list-style to "", or undefined');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
