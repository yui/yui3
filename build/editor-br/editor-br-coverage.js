if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["editor-br"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "editor-br",
    code: []
};
_yuitest_coverage["editor-br"].code=["YUI.add('editor-br', function (Y, NAME) {","","","","    /**","     * Plugin for Editor to normalize BR's.","     * @class Plugin.EditorBR","     * @extends Base","     * @constructor","     * @module editor","     * @submodule editor-br","     */","","","    var EditorBR = function() {","        EditorBR.superclass.constructor.apply(this, arguments);","    }, HOST = 'host', LI = 'li';","","","    Y.extend(EditorBR, Y.Base, {","        /**","        * Frame keyDown handler that normalizes BR's when pressing ENTER.","        * @private","        * @method _onKeyDown","        */","        _onKeyDown: function(e) {","            if (e.stopped) {","                e.halt();","                return;","            }","            if (e.keyCode == 13) {","                var host = this.get(HOST), inst = host.getInstance(),","                    sel = new inst.EditorSelection(),","                    last = '';","","                if (sel) {","                    if (Y.UA.ie) {","                        if (!sel.anchorNode || (!sel.anchorNode.test(LI) && !sel.anchorNode.ancestor(LI))) {","                            var host = this.get(HOST);","                            host.execCommand('inserthtml', inst.EditorSelection.CURSOR);","                            e.halt();","                        }","                    }","                    if (Y.UA.webkit) {","                        if (!sel.anchorNode.test(LI) && !sel.anchorNode.ancestor(LI)) {","                            host.frame._execCommand('insertlinebreak', null);","                            e.halt();","                        }","                    }","                }","            }","        },","        /**","        * Adds listeners for keydown in IE and Webkit. Also fires insertbeonreturn for supporting browsers.","        * @private","        * @method _afterEditorReady","        */","        _afterEditorReady: function() {","            var inst = this.get(HOST).getInstance();","            try {","                inst.config.doc.execCommand('insertbronreturn', null, true);","            } catch (bre) {}","","            if (Y.UA.ie || Y.UA.webkit) {","                inst.on('keydown', Y.bind(this._onKeyDown, this), inst.config.doc);","            }","        },","        /**","        * Adds a nodeChange listener only for FF, in the event of a backspace or delete, it creates an empy textNode","        * inserts it into the DOM after the e.changedNode, then removes it. Causing FF to redraw the content.","        * @private","        * @method _onNodeChange","        * @param {Event} e The nodeChange event.","        */","        _onNodeChange: function(e) {","            switch (e.changedType) {","                case 'backspace-up':","                case 'backspace-down':","                case 'delete-up':","                    /*","                    * This forced FF to redraw the content on backspace.","                    * On some occasions FF will leave a cursor residue after content has been deleted.","                    * Dropping in the empty textnode and then removing it causes FF to redraw and","                    * remove the \"ghost cursors\"","                    */","                    var inst = this.get(HOST).getInstance();","                    var d = e.changedNode;","                    var t = inst.config.doc.createTextNode(' ');","                    d.appendChild(t);","                    d.removeChild(t);","                    break;","            }","        },","        initializer: function() {","            var host = this.get(HOST);","            if (host.editorPara) {","                Y.error('Can not plug EditorBR and EditorPara at the same time.');","                return;","            }","            host.after('ready', Y.bind(this._afterEditorReady, this));","            if (Y.UA.gecko) {","                host.on('nodeChange', Y.bind(this._onNodeChange, this));","            }","        }","    }, {","        /**","        * editorBR","        * @static","        * @property NAME","        */","        NAME: 'editorBR',","        /**","        * editorBR","        * @static","        * @property NS","        */","        NS: 'editorBR',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","    ","    Y.namespace('Plugin');","    ","    Y.Plugin.EditorBR = EditorBR;","","","","}, '@VERSION@', {\"requires\": [\"editor-base\"]});"];
_yuitest_coverage["editor-br"].lines = {"1":0,"15":0,"16":0,"20":0,"27":0,"28":0,"29":0,"31":0,"32":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"44":0,"45":0,"46":0,"47":0,"59":0,"60":0,"61":0,"64":0,"65":0,"76":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"95":0,"96":0,"97":0,"98":0,"100":0,"101":0,"102":0,"125":0,"127":0};
_yuitest_coverage["editor-br"].functions = {"EditorBR:15":0,"_onKeyDown:26":0,"_afterEditorReady:58":0,"_onNodeChange:75":0,"initializer:94":0,"(anonymous 1):1":0};
_yuitest_coverage["editor-br"].coveredLines = 40;
_yuitest_coverage["editor-br"].coveredFunctions = 6;
_yuitest_coverline("editor-br", 1);
YUI.add('editor-br', function (Y, NAME) {



    /**
     * Plugin for Editor to normalize BR's.
     * @class Plugin.EditorBR
     * @extends Base
     * @constructor
     * @module editor
     * @submodule editor-br
     */


    _yuitest_coverfunc("editor-br", "(anonymous 1)", 1);
_yuitest_coverline("editor-br", 15);
var EditorBR = function() {
        _yuitest_coverfunc("editor-br", "EditorBR", 15);
_yuitest_coverline("editor-br", 16);
EditorBR.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', LI = 'li';


    _yuitest_coverline("editor-br", 20);
Y.extend(EditorBR, Y.Base, {
        /**
        * Frame keyDown handler that normalizes BR's when pressing ENTER.
        * @private
        * @method _onKeyDown
        */
        _onKeyDown: function(e) {
            _yuitest_coverfunc("editor-br", "_onKeyDown", 26);
_yuitest_coverline("editor-br", 27);
if (e.stopped) {
                _yuitest_coverline("editor-br", 28);
e.halt();
                _yuitest_coverline("editor-br", 29);
return;
            }
            _yuitest_coverline("editor-br", 31);
if (e.keyCode == 13) {
                _yuitest_coverline("editor-br", 32);
var host = this.get(HOST), inst = host.getInstance(),
                    sel = new inst.EditorSelection(),
                    last = '';

                _yuitest_coverline("editor-br", 36);
if (sel) {
                    _yuitest_coverline("editor-br", 37);
if (Y.UA.ie) {
                        _yuitest_coverline("editor-br", 38);
if (!sel.anchorNode || (!sel.anchorNode.test(LI) && !sel.anchorNode.ancestor(LI))) {
                            _yuitest_coverline("editor-br", 39);
var host = this.get(HOST);
                            _yuitest_coverline("editor-br", 40);
host.execCommand('inserthtml', inst.EditorSelection.CURSOR);
                            _yuitest_coverline("editor-br", 41);
e.halt();
                        }
                    }
                    _yuitest_coverline("editor-br", 44);
if (Y.UA.webkit) {
                        _yuitest_coverline("editor-br", 45);
if (!sel.anchorNode.test(LI) && !sel.anchorNode.ancestor(LI)) {
                            _yuitest_coverline("editor-br", 46);
host.frame._execCommand('insertlinebreak', null);
                            _yuitest_coverline("editor-br", 47);
e.halt();
                        }
                    }
                }
            }
        },
        /**
        * Adds listeners for keydown in IE and Webkit. Also fires insertbeonreturn for supporting browsers.
        * @private
        * @method _afterEditorReady
        */
        _afterEditorReady: function() {
            _yuitest_coverfunc("editor-br", "_afterEditorReady", 58);
_yuitest_coverline("editor-br", 59);
var inst = this.get(HOST).getInstance();
            _yuitest_coverline("editor-br", 60);
try {
                _yuitest_coverline("editor-br", 61);
inst.config.doc.execCommand('insertbronreturn', null, true);
            } catch (bre) {}

            _yuitest_coverline("editor-br", 64);
if (Y.UA.ie || Y.UA.webkit) {
                _yuitest_coverline("editor-br", 65);
inst.on('keydown', Y.bind(this._onKeyDown, this), inst.config.doc);
            }
        },
        /**
        * Adds a nodeChange listener only for FF, in the event of a backspace or delete, it creates an empy textNode
        * inserts it into the DOM after the e.changedNode, then removes it. Causing FF to redraw the content.
        * @private
        * @method _onNodeChange
        * @param {Event} e The nodeChange event.
        */
        _onNodeChange: function(e) {
            _yuitest_coverfunc("editor-br", "_onNodeChange", 75);
_yuitest_coverline("editor-br", 76);
switch (e.changedType) {
                case 'backspace-up':
                case 'backspace-down':
                case 'delete-up':
                    /*
                    * This forced FF to redraw the content on backspace.
                    * On some occasions FF will leave a cursor residue after content has been deleted.
                    * Dropping in the empty textnode and then removing it causes FF to redraw and
                    * remove the "ghost cursors"
                    */
                    _yuitest_coverline("editor-br", 86);
var inst = this.get(HOST).getInstance();
                    _yuitest_coverline("editor-br", 87);
var d = e.changedNode;
                    _yuitest_coverline("editor-br", 88);
var t = inst.config.doc.createTextNode(' ');
                    _yuitest_coverline("editor-br", 89);
d.appendChild(t);
                    _yuitest_coverline("editor-br", 90);
d.removeChild(t);
                    _yuitest_coverline("editor-br", 91);
break;
            }
        },
        initializer: function() {
            _yuitest_coverfunc("editor-br", "initializer", 94);
_yuitest_coverline("editor-br", 95);
var host = this.get(HOST);
            _yuitest_coverline("editor-br", 96);
if (host.editorPara) {
                _yuitest_coverline("editor-br", 97);
Y.error('Can not plug EditorBR and EditorPara at the same time.');
                _yuitest_coverline("editor-br", 98);
return;
            }
            _yuitest_coverline("editor-br", 100);
host.after('ready', Y.bind(this._afterEditorReady, this));
            _yuitest_coverline("editor-br", 101);
if (Y.UA.gecko) {
                _yuitest_coverline("editor-br", 102);
host.on('nodeChange', Y.bind(this._onNodeChange, this));
            }
        }
    }, {
        /**
        * editorBR
        * @static
        * @property NAME
        */
        NAME: 'editorBR',
        /**
        * editorBR
        * @static
        * @property NS
        */
        NS: 'editorBR',
        ATTRS: {
            host: {
                value: false
            }
        }
    });
    
    _yuitest_coverline("editor-br", 125);
Y.namespace('Plugin');
    
    _yuitest_coverline("editor-br", 127);
Y.Plugin.EditorBR = EditorBR;



}, '@VERSION@', {"requires": ["editor-base"]});
