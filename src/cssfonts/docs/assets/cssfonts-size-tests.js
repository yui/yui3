YUI.add('cssfonts-size-tests', function(Y) {

    var suite = new Y.Test.Suite('cssfonts-size example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'check font sizes': function() {
            var page = Y.one('body'),
                h = page.all('p'),
                i = 0,
                size,
                sizePercent,
                viewPort = Y.one('body').get('viewportRegion').right;
            for (i = 0; i < h.size(); i+=2) {
                //alert(h.item(i).getHTML() + 'its computed fontsize: ' + h.item(i).getComputedStyle('fontSize')  + ' ..its fontsize: ' + h.item(i).getStyle('fontSize') + ' ..viewportRegion.right: ' + Y.one('body').get('viewportRegion').right );
                /*
                Encountered a strange IE bug:
                in IE 6,7,8 (but not 9)
                node.getComputedStyle('fontSize') === Y.one('body').get('viewportRegion').right + 'px'
                node.Style('fontSize') === Y.one('body').get('viewportRegion').right + 'px'
                */
                size = Math.round(parseInt(h.item(i).getComputedStyle('fontSize'), 10));
                sizePercent = h.item(i).getHTML(); // get the percent string out of the DOM contents
                sizePercent = sizePercent.substring(sizePercent.indexOf('(') + 1, sizePercent.indexOf('%'));  // only the raw number
                sizePercent = sizePercent / 100;  // make it a %
                sizePx = Math.round(parseInt(h.item(i+1).getComputedStyle('fontSize'), 10));
                Assert.isTrue(((Math.abs(size - sizePx) < 2) || (Math.abs(size - (sizePercent) * viewPort) < 1)), ' - Failed on ' + h.item(i).getHTML());
            }
        }

    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
