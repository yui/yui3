YUI.add('overlay-stdmod-tests', function(Y) {

    var suite = new Y.Test.Suite('overlay-stdmod example test suite'),
        Assert = Y.Assert,
        overlay = Y.one('.example .yui3-overlay'),
        hd = Y.one('.example .yui3-widget-hd'),
        bd = Y.one('.example .yui3-widget-bd'),
        ft = Y.one('.example .yui3-widget-ft'),
        setBtn = Y.one('#setHTML'),
        text = Y.one('#content'),
        where = Y.one('#where'),
        section = Y.one('#section');

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'test overlay renders': function() {
            Assert.isTrue((overlay !== null), ' - Failed to render overlay container');
            Assert.isTrue((Y.one('.example #overlay') !== null), ' - Failed to render #overlay');
        },
        'test initial text': function() {
            Assert.areEqual('Overlay Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('Overlay Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('Overlay Footer', ft.getHTML(),' - Failed correct text for ft');
        },

////////////////////////////// header
        'test new text *before* Header': function() {
            text.set('value', 'before Header...');
            section.set('value', 'header');
            where.set('value', 'before');
            setBtn.simulate('click');
            Assert.areEqual('before Header...Overlay Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('Overlay Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('Overlay Footer', ft.getHTML(),' - Failed correct text for ft');
        },
        'test new text *after* Header': function() {
            text.set('value', '...after Header');
            where.set('value', 'after');
            setBtn.simulate('click');
            Assert.areEqual('before Header...Overlay Header...after Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('Overlay Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('Overlay Footer', ft.getHTML(),' - Failed correct text for ft');
        },
        'test new text *replace* Header': function() {
            text.set('value', 'Fresh Header');
            where.set('value', 'replace');
            setBtn.simulate('click');
            Assert.areEqual('Fresh Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('Overlay Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('Overlay Footer', ft.getHTML(),' - Failed correct text for ft');
        },

/////////////////////////////// body
        'test new text *before* Body': function() {
            text.set('value', 'before Body...');
            section.set('value', 'body');
            where.set('value', 'before');
            setBtn.simulate('click');
            Assert.areEqual('Fresh Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('before Body...Overlay Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('Overlay Footer', ft.getHTML(),' - Failed correct text for ft');
        },
        'test new text *after* Body': function() {
            text.set('value', '...after Body');
            where.set('value', 'after');
            setBtn.simulate('click');
            Assert.areEqual('Fresh Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('before Body...Overlay Body...after Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('Overlay Footer', ft.getHTML(),' - Failed correct text for ft');
        },
        'test new text *replace* Body': function() {
            text.set('value', 'Fresh Body');
            where.set('value', 'replace');
            setBtn.simulate('click');
            Assert.areEqual('Fresh Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('Fresh Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('Overlay Footer', ft.getHTML(),' - Failed correct text for ft');
        },

//////////////////////////////// footer
        'test new text *before* Footer': function() {
            text.set('value', 'before Footer...');
            section.set('value', 'footer');
            where.set('value', 'before');
            setBtn.simulate('click');
            Assert.areEqual('Fresh Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('Fresh Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('before Footer...Overlay Footer', ft.getHTML(),' - Failed correct text for ft');
        },
        'test new text *after* Footer': function() {
            text.set('value', '...after Footer');
            where.set('value', 'after');
            setBtn.simulate('click');
            Assert.areEqual('Fresh Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('Fresh Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('before Footer...Overlay Footer...after Footer', ft.getHTML(),' - Failed correct text for ft');
        },
        'test new text *replace* Footer': function() {
            text.set('value', 'Fresh Footer');
            where.set('value', 'replace');
            setBtn.simulate('click');
            Assert.areEqual('Fresh Header', hd.getHTML(),' - Failed correct text for hd');
            Assert.areEqual('Fresh Body', bd.getHTML(),' - Failed correct text for bd');
            Assert.areEqual('Fresh Footer', ft.getHTML(),' - Failed correct text for ft');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
