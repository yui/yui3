YUI.add('cssreset-context-tests', function(Y) {

    var suite = new Y.Test.Suite('cssreset-context example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'check H1 through H6 sizes': function() {
            var page = Y.one('.yui3-cssreset'),
                h = page.one('h1'),
                i = 0,
                size,
                viewPort = Y.one('body').get('viewportRegion').right - 20; // in this case the body has a margin so viewportRegion is smaller

            //alert(h.getHTML() + 'its computed fontsize: ' + h.item(i).getComputedStyle('fontSize')  + ' ..its fontsize: ' + h.item(i).getStyle('fontSize') + ' ..viewportRegion.right: ' + Y.one('body').get('viewportRegion').right );
            //alert(h.getHTML() + 'its computed fontsize: ' + h.getComputedStyle('fontSize')  + ' ..its fontsize: ' + h.getStyle('fontSize') + ' ..viewportRegion.right: ' + Y.one('body').get('viewportRegion').right );
            /*
            Encountered a strange IE bug:
            in IE 6,7,8 (but not 9)
            a node that is H1 - H6 .getComputedStyle('fontSize') === Y.one('body').get('viewportRegion').right + 'px'
            */
            size = h.getComputedStyle('fontSize');
            Assert.isTrue(((size === '16px') || (parseInt(size) > viewPort)), ' - Failed to set correct h1 - h6 fontsizes');


        },
        'check margins and padding': function() {
            var page = Y.one('.yui3-cssreset'),
                h = page.all('div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td'),
                i = 0,
                marg,
                pad;
                //alert( "Y.one('th').getComputedStyle('margin'): " + Y.one('th').getComputedStyle('margin'));
            for (i = 0; i < h.size(); i+=1) {
                //console.log(h.item(i).getComputedStyle('margin') + ' ...' + h.item(i).getHTML());
                marg = h.item(i).getComputedStyle('margin'); // IE8 is '0px' others are ''.   IE6 is "auto"
                pad = h.item(i).getComputedStyle('padding'); // IE8 is '0px' others are ''
                Assert.isTrue(((marg === '') || (marg === '0px') || (marg === 'auto')), ' - Failed to set margin to 0 ("") on ' + h.item(i).getHTML());
                Assert.isTrue(((pad === '') || (pad === '0px')), ' - Failed to set margin to 0 ("") on ' + h.item(i).getHTML());
            }
        },
        'check ol ul': function() {
            var listStyle = Y.one('ul').getComputedStyle('listStyle');
            //alert('listStyle: ' + listStyle);
            Assert.isTrue(((listStyle === '') || (listStyle === undefined) || (listStyle === 'disc outside none') || (listStyle === 'none outside none')), ' - Failed to set list-style to "", or undefined');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
