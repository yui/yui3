YUI({
    base: '../../../build/',
    //filter: 'DEBUG',
    filter: 'RAW',
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true,
        useConsole: true
    }
}).use('console', 'test', 'editor', 'node-event-simulate', function(Y) {

    var myConsole = new Y.Console({
        height: Y.one(window).get('winHeight') + 'px',
        width: '375px'
    }).render();    
            

    var editor = null,
    template = {
        name: 'Editor Tests',
        setUp : function() {
        },
        
        tearDown : function() {
        },
        test_load: function() {
            Y.Assert.isObject(Y.Frame, 'EditorBase was not loaded');
            Y.Assert.isObject(Y.EditorBase, 'EditorBase was not loaded');
        },
        test_frame: function() {
            var iframeReady = false,
            iframe = new Y.Frame({
                container: '#editor',
                designMode: true,
                content: 'This is a test.',
                use: ['node','selector-css3', 'dd-drag', 'dd-ddm']
            });
            Y.Assert.isInstanceOf(Y.Frame, iframe, 'Iframe instance can not be created');
            
            iframe.after('ready', function() {
                iframeReady = true;
            });
            iframe.render();

            this.wait(function() {
                Y.Assert.isTrue(iframeReady, 'IFRAME ready event did not fire');
                var inst = iframe.getInstance();

                Y.Assert.isInstanceOf(YUI, inst, 'Internal instance not created');
                Y.Assert.isObject(inst.DD.Drag, 'DD Not loaded inside the frame');
                Y.Assert.isObject(inst.DD.DDM, 'DD Not loaded inside the frame');
                
                iframe.destroy();

                Y.Assert.isNull(Y.one('#editor iframe'), 'iframe DOM node was not destroyed');

            }, 1500);
            
        },
        test_editor: function() {

            Y.EditorBase.USE.push('dd');
            Y.EditorBase.USE.push('node-event-simulate');
            var iframeReady = false;

            editor = new Y.EditorBase({
                content: 'Hello <b>World</b>!!',
                extracss: 'b { color: red; }'
            });
            Y.Assert.isInstanceOf(Y.EditorBase, editor, 'EditorBase instance can not be created');
            
            editor.after('ready', function() {
                iframeReady = true;
            });
            editor.on('nodeChange', function(e) {
                Y.Assert.areSame('mousedown', e.changedType, 'NodeChange working');
                Y.Assert.isTrue(e.changedNode.test('b, body'), 'Changed Node');

            });
            editor.render('#editor');

            this.wait(function() {
                Y.Assert.isTrue(iframeReady, 'IFRAME ready event did not fire');
                var inst = editor.getInstance();

                Y.Assert.isInstanceOf(YUI, inst, 'Internal instance not created');
                Y.Assert.isObject(inst.DD.Drag, 'DD Not loaded inside the frame');
                Y.Assert.isObject(inst.DD.DDM, 'DD Not loaded inside the frame');
                Y.Assert.areSame(Y.EditorBase.FILTER_RGB(inst.one('b').getStyle('color')), '#ff0000', 'Extra CSS Failed');
                inst.one('body').simulate('mousedown');
                inst.one('b').simulate('mousedown');

            }, 1500);
        },
        test_window: function() {
            Y.Assert.areEqual(Y.Node.getDOMNode(Y.one('#editor iframe').get('contentWindow')), Y.Node.getDOMNode(editor.getInstance().one('win')), 'Window object is not right');
        },
        test_doc: function() {
            Y.Assert.areEqual(Y.Node.getDOMNode(Y.one('#editor iframe').get('contentWindow.document')), Y.Node.getDOMNode(editor.getInstance().one('doc')), 'Document object is not right');
        }
    };
    
    var suite = new Y.Test.Suite("Editor");
    
    suite.add(new Y.Test.Case(template));
    Y.Test.Runner.add(suite);
    Y.Test.Runner.run();
});

