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
_yuitest_coverage["editor-para-ie"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "editor-para-ie",
    code: []
};
_yuitest_coverage["editor-para-ie"].code=["YUI.add('editor-para-ie', function (Y, NAME) {","","","    /**","     * Extends EditorParaBase with IE support","     * @class Plugin.EditorParaIE","     * @extends Plugin.EditorParaBase","     * @constructor","     * @module editor","     * @submodule editor-para-ie","     */","","","    var EditorParaIE = function() {","        EditorParaIE.superclass.constructor.apply(this, arguments);","    }, HOST = 'host', BODY = 'body', NODE_CHANGE = 'nodeChange', PARENT_NODE = 'parentNode',","    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>', FC = 'firstChild', LI = 'li';","","","    Y.extend(EditorParaIE, Y.Plugin.EditorParaBase, {","        /**","        * nodeChange handler to handle fixing an empty document.","        * @private","        * @method _onNodeChange","        */","        _onNodeChange: function(e) {","            var host = this.get(HOST), inst = host.getInstance(),","                html, txt, par , d, sel, btag = inst.EditorSelection.DEFAULT_BLOCK_TAG,","                inHTML, txt2, childs, aNode, index, node2, top, n, sib,","                ps, br, item, p, imgs, t, LAST_CHILD = ':last-child';","","            switch (e.changedType) {","                case 'enter-up':","                    var para = ((this._lastPara) ? this._lastPara : e.changedNode),","                        b = para.one('br.yui-cursor');","","                    if (this._lastPara) {","                        delete this._lastPara;","                    }","","                    if (b) {","                        if (b.previous() || b.next()) {","                            if (b.ancestor(P)) {","                                b.remove();","                            }","                        }","                    }","                    if (!para.test(btag)) {","                        var para2 = para.ancestor(btag);","                        if (para2) {","                            para = para2;","                            para2 = null;","                        }","                    }","                    if (para.test(btag)) {","                        var prev = para.previous(), lc, lc2, found = false;","                        if (prev) {","                            lc = prev.one(LAST_CHILD);","                            while (!found) {","                                if (lc) {","                                    lc2 = lc.one(LAST_CHILD);","                                    if (lc2) {","                                        lc = lc2;","                                    } else {","                                        found = true;","                                    }","                                } else {","                                    found = true;","                                }","                            }","                            if (lc) {","                                host.copyStyles(lc, para);","                            }","                        }","                    }","                    break;","                case 'enter':","                    if (e.changedNode.test('br')) {","                        e.changedNode.remove();","                    } else if (e.changedNode.test('p, span')) {","                        var b = e.changedNode.one('br.yui-cursor');","                        if (b) {","                            b.remove();","                        }","                    }","                    break;","            }","        },","        initializer: function() {","            var host = this.get(HOST);","            if (host.editorBR) {","                Y.error('Can not plug EditorPara and EditorBR at the same time.');","                return;","            }","","            host.on(NODE_CHANGE, Y.bind(this._onNodeChange, this));","        }","    }, {","        /**","        * editorPara","        * @static","        * @property NAME","        */","        NAME: 'editorPara',","        /**","        * editorPara","        * @static","        * @property NS","        */","        NS: 'editorPara',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","    ","    Y.namespace('Plugin');","    ","    Y.Plugin.EditorPara = EditorParaIE;","","","","","}, '@VERSION@', {\"requires\": [\"editor-para-base\"]});"];
_yuitest_coverage["editor-para-ie"].lines = {"1":0,"14":0,"15":0,"20":0,"27":0,"32":0,"34":0,"37":0,"38":0,"41":0,"42":0,"43":0,"44":0,"48":0,"49":0,"50":0,"51":0,"52":0,"55":0,"56":0,"57":0,"58":0,"59":0,"60":0,"61":0,"62":0,"63":0,"65":0,"68":0,"71":0,"72":0,"76":0,"78":0,"79":0,"80":0,"81":0,"82":0,"83":0,"86":0,"90":0,"91":0,"92":0,"93":0,"96":0,"118":0,"120":0};
_yuitest_coverage["editor-para-ie"].functions = {"EditorParaIE:14":0,"_onNodeChange:26":0,"initializer:89":0,"(anonymous 1):1":0};
_yuitest_coverage["editor-para-ie"].coveredLines = 46;
_yuitest_coverage["editor-para-ie"].coveredFunctions = 4;
_yuitest_coverline("editor-para-ie", 1);
YUI.add('editor-para-ie', function (Y, NAME) {


    /**
     * Extends EditorParaBase with IE support
     * @class Plugin.EditorParaIE
     * @extends Plugin.EditorParaBase
     * @constructor
     * @module editor
     * @submodule editor-para-ie
     */


    _yuitest_coverfunc("editor-para-ie", "(anonymous 1)", 1);
_yuitest_coverline("editor-para-ie", 14);
var EditorParaIE = function() {
        _yuitest_coverfunc("editor-para-ie", "EditorParaIE", 14);
_yuitest_coverline("editor-para-ie", 15);
EditorParaIE.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', BODY = 'body', NODE_CHANGE = 'nodeChange', PARENT_NODE = 'parentNode',
    FIRST_P = BODY + ' > p', P = 'p', BR = '<br>', FC = 'firstChild', LI = 'li';


    _yuitest_coverline("editor-para-ie", 20);
Y.extend(EditorParaIE, Y.Plugin.EditorParaBase, {
        /**
        * nodeChange handler to handle fixing an empty document.
        * @private
        * @method _onNodeChange
        */
        _onNodeChange: function(e) {
            _yuitest_coverfunc("editor-para-ie", "_onNodeChange", 26);
_yuitest_coverline("editor-para-ie", 27);
var host = this.get(HOST), inst = host.getInstance(),
                html, txt, par , d, sel, btag = inst.EditorSelection.DEFAULT_BLOCK_TAG,
                inHTML, txt2, childs, aNode, index, node2, top, n, sib,
                ps, br, item, p, imgs, t, LAST_CHILD = ':last-child';

            _yuitest_coverline("editor-para-ie", 32);
switch (e.changedType) {
                case 'enter-up':
                    _yuitest_coverline("editor-para-ie", 34);
var para = ((this._lastPara) ? this._lastPara : e.changedNode),
                        b = para.one('br.yui-cursor');

                    _yuitest_coverline("editor-para-ie", 37);
if (this._lastPara) {
                        _yuitest_coverline("editor-para-ie", 38);
delete this._lastPara;
                    }

                    _yuitest_coverline("editor-para-ie", 41);
if (b) {
                        _yuitest_coverline("editor-para-ie", 42);
if (b.previous() || b.next()) {
                            _yuitest_coverline("editor-para-ie", 43);
if (b.ancestor(P)) {
                                _yuitest_coverline("editor-para-ie", 44);
b.remove();
                            }
                        }
                    }
                    _yuitest_coverline("editor-para-ie", 48);
if (!para.test(btag)) {
                        _yuitest_coverline("editor-para-ie", 49);
var para2 = para.ancestor(btag);
                        _yuitest_coverline("editor-para-ie", 50);
if (para2) {
                            _yuitest_coverline("editor-para-ie", 51);
para = para2;
                            _yuitest_coverline("editor-para-ie", 52);
para2 = null;
                        }
                    }
                    _yuitest_coverline("editor-para-ie", 55);
if (para.test(btag)) {
                        _yuitest_coverline("editor-para-ie", 56);
var prev = para.previous(), lc, lc2, found = false;
                        _yuitest_coverline("editor-para-ie", 57);
if (prev) {
                            _yuitest_coverline("editor-para-ie", 58);
lc = prev.one(LAST_CHILD);
                            _yuitest_coverline("editor-para-ie", 59);
while (!found) {
                                _yuitest_coverline("editor-para-ie", 60);
if (lc) {
                                    _yuitest_coverline("editor-para-ie", 61);
lc2 = lc.one(LAST_CHILD);
                                    _yuitest_coverline("editor-para-ie", 62);
if (lc2) {
                                        _yuitest_coverline("editor-para-ie", 63);
lc = lc2;
                                    } else {
                                        _yuitest_coverline("editor-para-ie", 65);
found = true;
                                    }
                                } else {
                                    _yuitest_coverline("editor-para-ie", 68);
found = true;
                                }
                            }
                            _yuitest_coverline("editor-para-ie", 71);
if (lc) {
                                _yuitest_coverline("editor-para-ie", 72);
host.copyStyles(lc, para);
                            }
                        }
                    }
                    _yuitest_coverline("editor-para-ie", 76);
break;
                case 'enter':
                    _yuitest_coverline("editor-para-ie", 78);
if (e.changedNode.test('br')) {
                        _yuitest_coverline("editor-para-ie", 79);
e.changedNode.remove();
                    } else {_yuitest_coverline("editor-para-ie", 80);
if (e.changedNode.test('p, span')) {
                        _yuitest_coverline("editor-para-ie", 81);
var b = e.changedNode.one('br.yui-cursor');
                        _yuitest_coverline("editor-para-ie", 82);
if (b) {
                            _yuitest_coverline("editor-para-ie", 83);
b.remove();
                        }
                    }}
                    _yuitest_coverline("editor-para-ie", 86);
break;
            }
        },
        initializer: function() {
            _yuitest_coverfunc("editor-para-ie", "initializer", 89);
_yuitest_coverline("editor-para-ie", 90);
var host = this.get(HOST);
            _yuitest_coverline("editor-para-ie", 91);
if (host.editorBR) {
                _yuitest_coverline("editor-para-ie", 92);
Y.error('Can not plug EditorPara and EditorBR at the same time.');
                _yuitest_coverline("editor-para-ie", 93);
return;
            }

            _yuitest_coverline("editor-para-ie", 96);
host.on(NODE_CHANGE, Y.bind(this._onNodeChange, this));
        }
    }, {
        /**
        * editorPara
        * @static
        * @property NAME
        */
        NAME: 'editorPara',
        /**
        * editorPara
        * @static
        * @property NS
        */
        NS: 'editorPara',
        ATTRS: {
            host: {
                value: false
            }
        }
    });
    
    _yuitest_coverline("editor-para-ie", 118);
Y.namespace('Plugin');
    
    _yuitest_coverline("editor-para-ie", 120);
Y.Plugin.EditorPara = EditorParaIE;




}, '@VERSION@', {"requires": ["editor-para-base"]});
