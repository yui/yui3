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
_yuitest_coverage["editor-para-base"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "editor-para-base",
    code: []
};
_yuitest_coverage["editor-para-base"].code=["YUI.add('editor-para-base', function (Y, NAME) {","","","    /**","     * Base Plugin for Editor to paragraph auto wrapping and correction.","     * @class Plugin.EditorParaBase","     * @extends Base","     * @constructor","     * @module editor","     * @submodule editor-para-base","     */","","","    var EditorParaBase = function() {","        EditorParaBase.superclass.constructor.apply(this, arguments);","    }, HOST = 'host', BODY = 'body', NODE_CHANGE = 'nodeChange', PARENT_NODE = 'parentNode',","    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>', FC = 'firstChild', LI = 'li';","","","    Y.extend(EditorParaBase, Y.Base, {","        /**","        * Utility method to create an empty paragraph when the document is empty.","        * @private","        * @method _fixFirstPara","        */","        _fixFirstPara: function() {","            var host = this.get(HOST), inst = host.getInstance(), sel, n,","                body = inst.config.doc.body,","                html = body.innerHTML,","                col = ((html.length) ? true : false);","","            if (html === BR) {","                html = '';","                col = false;","            }","","            body.innerHTML = '<' + P + '>' + html + inst.EditorSelection.CURSOR + '</' + P + '>';","","            n = inst.one(FIRST_P);","            sel = new inst.EditorSelection();","","            sel.selectNode(n, true, col);","        },","        /**","        * Performs a block element filter when the Editor is first ready","        * @private","        * @method _afterEditorReady","        */","        _afterEditorReady: function() {","            var host = this.get(HOST), inst = host.getInstance(), btag;","            if (inst) {","                inst.EditorSelection.filterBlocks();","                btag = inst.EditorSelection.DEFAULT_BLOCK_TAG;","                FIRST_P = BODY + ' > ' + btag;","                P = btag;","            }","        },","        /**","        * Performs a block element filter when the Editor after an content change","        * @private","        * @method _afterContentChange","        */","        _afterContentChange: function() {","            var host = this.get(HOST), inst = host.getInstance();","            if (inst && inst.EditorSelection) {","                inst.EditorSelection.filterBlocks();","            }","        },","        /**","        * Performs block/paste filtering after paste.","        * @private","        * @method _afterPaste","        */","        _afterPaste: function() {","            var host = this.get(HOST), inst = host.getInstance(),","                sel = new inst.EditorSelection();","","            Y.later(50, host, function() {","                inst.EditorSelection.filterBlocks();","            });","            ","        },","        initializer: function() {","            var host = this.get(HOST);","            if (host.editorBR) {","                Y.error('Can not plug EditorPara and EditorBR at the same time.');","                return;","            }","","            host.after('ready', Y.bind(this._afterEditorReady, this));","            host.after('contentChange', Y.bind(this._afterContentChange, this));","            if (Y.Env.webkit) {","                host.after('dom:paste', Y.bind(this._afterPaste, this));","            }","        }","    }, {","        /**","        * editorPara","        * @static","        * @property NAME","        */","        NAME: 'editorParaBase',","        /**","        * editorPara","        * @static","        * @property NS","        */","        NS: 'editorParaBase',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","    ","    Y.namespace('Plugin');","    ","    Y.Plugin.EditorParaBase = EditorParaBase;","","","","","}, '@VERSION@', {\"requires\": [\"editor-base\"]});"];
_yuitest_coverage["editor-para-base"].lines = {"1":0,"14":0,"15":0,"20":0,"27":0,"32":0,"33":0,"34":0,"37":0,"39":0,"40":0,"42":0,"50":0,"51":0,"52":0,"53":0,"54":0,"55":0,"64":0,"65":0,"66":0,"75":0,"78":0,"79":0,"84":0,"85":0,"86":0,"87":0,"90":0,"91":0,"92":0,"93":0,"116":0,"118":0};
_yuitest_coverage["editor-para-base"].functions = {"EditorParaBase:14":0,"_fixFirstPara:26":0,"_afterEditorReady:49":0,"_afterContentChange:63":0,"(anonymous 2):78":0,"_afterPaste:74":0,"initializer:83":0,"(anonymous 1):1":0};
_yuitest_coverage["editor-para-base"].coveredLines = 34;
_yuitest_coverage["editor-para-base"].coveredFunctions = 8;
_yuitest_coverline("editor-para-base", 1);
YUI.add('editor-para-base', function (Y, NAME) {


    /**
     * Base Plugin for Editor to paragraph auto wrapping and correction.
     * @class Plugin.EditorParaBase
     * @extends Base
     * @constructor
     * @module editor
     * @submodule editor-para-base
     */


    _yuitest_coverfunc("editor-para-base", "(anonymous 1)", 1);
_yuitest_coverline("editor-para-base", 14);
var EditorParaBase = function() {
        _yuitest_coverfunc("editor-para-base", "EditorParaBase", 14);
_yuitest_coverline("editor-para-base", 15);
EditorParaBase.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', BODY = 'body', NODE_CHANGE = 'nodeChange', PARENT_NODE = 'parentNode',
    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>', FC = 'firstChild', LI = 'li';


    _yuitest_coverline("editor-para-base", 20);
Y.extend(EditorParaBase, Y.Base, {
        /**
        * Utility method to create an empty paragraph when the document is empty.
        * @private
        * @method _fixFirstPara
        */
        _fixFirstPara: function() {
            _yuitest_coverfunc("editor-para-base", "_fixFirstPara", 26);
_yuitest_coverline("editor-para-base", 27);
var host = this.get(HOST), inst = host.getInstance(), sel, n,
                body = inst.config.doc.body,
                html = body.innerHTML,
                col = ((html.length) ? true : false);

            _yuitest_coverline("editor-para-base", 32);
if (html === BR) {
                _yuitest_coverline("editor-para-base", 33);
html = '';
                _yuitest_coverline("editor-para-base", 34);
col = false;
            }

            _yuitest_coverline("editor-para-base", 37);
body.innerHTML = '<' + P + '>' + html + inst.EditorSelection.CURSOR + '</' + P + '>';

            _yuitest_coverline("editor-para-base", 39);
n = inst.one(FIRST_P);
            _yuitest_coverline("editor-para-base", 40);
sel = new inst.EditorSelection();

            _yuitest_coverline("editor-para-base", 42);
sel.selectNode(n, true, col);
        },
        /**
        * Performs a block element filter when the Editor is first ready
        * @private
        * @method _afterEditorReady
        */
        _afterEditorReady: function() {
            _yuitest_coverfunc("editor-para-base", "_afterEditorReady", 49);
_yuitest_coverline("editor-para-base", 50);
var host = this.get(HOST), inst = host.getInstance(), btag;
            _yuitest_coverline("editor-para-base", 51);
if (inst) {
                _yuitest_coverline("editor-para-base", 52);
inst.EditorSelection.filterBlocks();
                _yuitest_coverline("editor-para-base", 53);
btag = inst.EditorSelection.DEFAULT_BLOCK_TAG;
                _yuitest_coverline("editor-para-base", 54);
FIRST_P = BODY + ' > ' + btag;
                _yuitest_coverline("editor-para-base", 55);
P = btag;
            }
        },
        /**
        * Performs a block element filter when the Editor after an content change
        * @private
        * @method _afterContentChange
        */
        _afterContentChange: function() {
            _yuitest_coverfunc("editor-para-base", "_afterContentChange", 63);
_yuitest_coverline("editor-para-base", 64);
var host = this.get(HOST), inst = host.getInstance();
            _yuitest_coverline("editor-para-base", 65);
if (inst && inst.EditorSelection) {
                _yuitest_coverline("editor-para-base", 66);
inst.EditorSelection.filterBlocks();
            }
        },
        /**
        * Performs block/paste filtering after paste.
        * @private
        * @method _afterPaste
        */
        _afterPaste: function() {
            _yuitest_coverfunc("editor-para-base", "_afterPaste", 74);
_yuitest_coverline("editor-para-base", 75);
var host = this.get(HOST), inst = host.getInstance(),
                sel = new inst.EditorSelection();

            _yuitest_coverline("editor-para-base", 78);
Y.later(50, host, function() {
                _yuitest_coverfunc("editor-para-base", "(anonymous 2)", 78);
_yuitest_coverline("editor-para-base", 79);
inst.EditorSelection.filterBlocks();
            });
            
        },
        initializer: function() {
            _yuitest_coverfunc("editor-para-base", "initializer", 83);
_yuitest_coverline("editor-para-base", 84);
var host = this.get(HOST);
            _yuitest_coverline("editor-para-base", 85);
if (host.editorBR) {
                _yuitest_coverline("editor-para-base", 86);
Y.error('Can not plug EditorPara and EditorBR at the same time.');
                _yuitest_coverline("editor-para-base", 87);
return;
            }

            _yuitest_coverline("editor-para-base", 90);
host.after('ready', Y.bind(this._afterEditorReady, this));
            _yuitest_coverline("editor-para-base", 91);
host.after('contentChange', Y.bind(this._afterContentChange, this));
            _yuitest_coverline("editor-para-base", 92);
if (Y.Env.webkit) {
                _yuitest_coverline("editor-para-base", 93);
host.after('dom:paste', Y.bind(this._afterPaste, this));
            }
        }
    }, {
        /**
        * editorPara
        * @static
        * @property NAME
        */
        NAME: 'editorParaBase',
        /**
        * editorPara
        * @static
        * @property NS
        */
        NS: 'editorParaBase',
        ATTRS: {
            host: {
                value: false
            }
        }
    });
    
    _yuitest_coverline("editor-para-base", 116);
Y.namespace('Plugin');
    
    _yuitest_coverline("editor-para-base", 118);
Y.Plugin.EditorParaBase = EditorParaBase;




}, '@VERSION@', {"requires": ["editor-base"]});
