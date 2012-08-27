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
_yuitest_coverage["editor-lists"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "editor-lists",
    code: []
};
_yuitest_coverage["editor-lists"].code=["YUI.add('editor-lists', function (Y, NAME) {","","","    /**","     * Handles list manipulation inside the Editor. Adds keyboard manipulation and execCommand support. Adds overrides for the <a href=\"Plugin.ExecCommand.html#method_COMMANDS.insertorderedlist\">insertorderedlist</a> and <a href=\"Plugin.ExecCommand.html#method_COMMANDS.insertunorderedlist\">insertunorderedlist</a> execCommands.","     * @class Plugin.EditorLists","     * @constructor","     * @extends Base","     * @module editor","     * @submodule editor-lists","     */","    ","    var EditorLists = function() {","        EditorLists.superclass.constructor.apply(this, arguments);","    }, LI = 'li', OL = 'ol', UL = 'ul', HOST = 'host';","","    Y.extend(EditorLists, Y.Base, {","        /**","        * Listener for host's nodeChange event and captures the tabkey interaction only when inside a list node.","        * @private","        * @method _onNodeChange","        * @param {Event} e The Event facade passed from the host.","        */","        _onNodeChange: function(e) {","            var inst = this.get(HOST).getInstance(), sel, li, ","            newLi, newList, sTab, par, moved = false, tag, focusEnd = false;","","            if (e.changedType === 'tab') {","                if (e.changedNode.test(LI + ', ' + LI + ' *')) {","                    e.changedEvent.halt();","                    e.preventDefault();","                    li = e.changedNode;","                    sTab = e.changedEvent.shiftKey;","                    par = li.ancestor(OL + ',' + UL);","                    tag = UL;","","                    if (par.get('tagName').toLowerCase() === OL) {","                        tag = OL;","                    }","                    ","                    if (!li.test(LI)) {","                        li = li.ancestor(LI);","                    }","                    if (sTab) {","                        if (li.ancestor(LI)) {","                            li.ancestor(LI).insert(li, 'after');","                            moved = true;","                            focusEnd = true;","                        }","                    } else {","                        //li.setStyle('border', '1px solid red');","                        if (li.previous(LI)) {","                            newList = inst.Node.create('<' + tag + '></' + tag + '>');","                            li.previous(LI).append(newList);","                            newList.append(li);","                            moved = true;","                        }","                    }","                }","                if (moved) {","                    if (!li.test(LI)) {","                        li = li.ancestor(LI);","                    }","                    li.all(EditorLists.REMOVE).remove();","                    if (Y.UA.ie) {","                        li = li.append(EditorLists.NON).one(EditorLists.NON_SEL);","                    }","                    //Selection here..","                    (new inst.EditorSelection()).selectNode(li, true, focusEnd);","                }","            }","        },","        initializer: function() {","            this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));","        }","    }, {","        /**","        * The non element placeholder, used for positioning the cursor and filling empty items","        * @property REMOVE","        * @static","        */","        NON: '<span class=\"yui-non\">&nbsp;</span>',","        /**","        * The selector query to get all non elements","        * @property NONSEL","        * @static","        */","        NON_SEL: 'span.yui-non',","        /**","        * The items to removed from a list when a list item is moved, currently removes BR nodes","        * @property REMOVE","        * @static","        */","        REMOVE: 'br',","        /**","        * editorLists","        * @property NAME","        * @static","        */","        NAME: 'editorLists',","        /**","        * lists","        * @property NS","        * @static","        */","        NS: 'lists',","        ATTRS: {","            host: {","                value: false","            }","        }","    });","","    Y.namespace('Plugin');","","    Y.Plugin.EditorLists = EditorLists;","","","","}, '@VERSION@', {\"requires\": [\"editor-base\"]});"];
_yuitest_coverage["editor-lists"].lines = {"1":0,"13":0,"14":0,"17":0,"25":0,"28":0,"29":0,"30":0,"31":0,"32":0,"33":0,"34":0,"35":0,"37":0,"38":0,"41":0,"42":0,"44":0,"45":0,"46":0,"47":0,"48":0,"52":0,"53":0,"54":0,"55":0,"56":0,"60":0,"61":0,"62":0,"64":0,"65":0,"66":0,"69":0,"74":0,"114":0,"116":0};
_yuitest_coverage["editor-lists"].functions = {"EditorLists:13":0,"_onNodeChange:24":0,"initializer:73":0,"(anonymous 1):1":0};
_yuitest_coverage["editor-lists"].coveredLines = 37;
_yuitest_coverage["editor-lists"].coveredFunctions = 4;
_yuitest_coverline("editor-lists", 1);
YUI.add('editor-lists', function (Y, NAME) {


    /**
     * Handles list manipulation inside the Editor. Adds keyboard manipulation and execCommand support. Adds overrides for the <a href="Plugin.ExecCommand.html#method_COMMANDS.insertorderedlist">insertorderedlist</a> and <a href="Plugin.ExecCommand.html#method_COMMANDS.insertunorderedlist">insertunorderedlist</a> execCommands.
     * @class Plugin.EditorLists
     * @constructor
     * @extends Base
     * @module editor
     * @submodule editor-lists
     */
    
    _yuitest_coverfunc("editor-lists", "(anonymous 1)", 1);
_yuitest_coverline("editor-lists", 13);
var EditorLists = function() {
        _yuitest_coverfunc("editor-lists", "EditorLists", 13);
_yuitest_coverline("editor-lists", 14);
EditorLists.superclass.constructor.apply(this, arguments);
    }, LI = 'li', OL = 'ol', UL = 'ul', HOST = 'host';

    _yuitest_coverline("editor-lists", 17);
Y.extend(EditorLists, Y.Base, {
        /**
        * Listener for host's nodeChange event and captures the tabkey interaction only when inside a list node.
        * @private
        * @method _onNodeChange
        * @param {Event} e The Event facade passed from the host.
        */
        _onNodeChange: function(e) {
            _yuitest_coverfunc("editor-lists", "_onNodeChange", 24);
_yuitest_coverline("editor-lists", 25);
var inst = this.get(HOST).getInstance(), sel, li, 
            newLi, newList, sTab, par, moved = false, tag, focusEnd = false;

            _yuitest_coverline("editor-lists", 28);
if (e.changedType === 'tab') {
                _yuitest_coverline("editor-lists", 29);
if (e.changedNode.test(LI + ', ' + LI + ' *')) {
                    _yuitest_coverline("editor-lists", 30);
e.changedEvent.halt();
                    _yuitest_coverline("editor-lists", 31);
e.preventDefault();
                    _yuitest_coverline("editor-lists", 32);
li = e.changedNode;
                    _yuitest_coverline("editor-lists", 33);
sTab = e.changedEvent.shiftKey;
                    _yuitest_coverline("editor-lists", 34);
par = li.ancestor(OL + ',' + UL);
                    _yuitest_coverline("editor-lists", 35);
tag = UL;

                    _yuitest_coverline("editor-lists", 37);
if (par.get('tagName').toLowerCase() === OL) {
                        _yuitest_coverline("editor-lists", 38);
tag = OL;
                    }
                    
                    _yuitest_coverline("editor-lists", 41);
if (!li.test(LI)) {
                        _yuitest_coverline("editor-lists", 42);
li = li.ancestor(LI);
                    }
                    _yuitest_coverline("editor-lists", 44);
if (sTab) {
                        _yuitest_coverline("editor-lists", 45);
if (li.ancestor(LI)) {
                            _yuitest_coverline("editor-lists", 46);
li.ancestor(LI).insert(li, 'after');
                            _yuitest_coverline("editor-lists", 47);
moved = true;
                            _yuitest_coverline("editor-lists", 48);
focusEnd = true;
                        }
                    } else {
                        //li.setStyle('border', '1px solid red');
                        _yuitest_coverline("editor-lists", 52);
if (li.previous(LI)) {
                            _yuitest_coverline("editor-lists", 53);
newList = inst.Node.create('<' + tag + '></' + tag + '>');
                            _yuitest_coverline("editor-lists", 54);
li.previous(LI).append(newList);
                            _yuitest_coverline("editor-lists", 55);
newList.append(li);
                            _yuitest_coverline("editor-lists", 56);
moved = true;
                        }
                    }
                }
                _yuitest_coverline("editor-lists", 60);
if (moved) {
                    _yuitest_coverline("editor-lists", 61);
if (!li.test(LI)) {
                        _yuitest_coverline("editor-lists", 62);
li = li.ancestor(LI);
                    }
                    _yuitest_coverline("editor-lists", 64);
li.all(EditorLists.REMOVE).remove();
                    _yuitest_coverline("editor-lists", 65);
if (Y.UA.ie) {
                        _yuitest_coverline("editor-lists", 66);
li = li.append(EditorLists.NON).one(EditorLists.NON_SEL);
                    }
                    //Selection here..
                    _yuitest_coverline("editor-lists", 69);
(new inst.EditorSelection()).selectNode(li, true, focusEnd);
                }
            }
        },
        initializer: function() {
            _yuitest_coverfunc("editor-lists", "initializer", 73);
_yuitest_coverline("editor-lists", 74);
this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));
        }
    }, {
        /**
        * The non element placeholder, used for positioning the cursor and filling empty items
        * @property REMOVE
        * @static
        */
        NON: '<span class="yui-non">&nbsp;</span>',
        /**
        * The selector query to get all non elements
        * @property NONSEL
        * @static
        */
        NON_SEL: 'span.yui-non',
        /**
        * The items to removed from a list when a list item is moved, currently removes BR nodes
        * @property REMOVE
        * @static
        */
        REMOVE: 'br',
        /**
        * editorLists
        * @property NAME
        * @static
        */
        NAME: 'editorLists',
        /**
        * lists
        * @property NS
        * @static
        */
        NS: 'lists',
        ATTRS: {
            host: {
                value: false
            }
        }
    });

    _yuitest_coverline("editor-lists", 114);
Y.namespace('Plugin');

    _yuitest_coverline("editor-lists", 116);
Y.Plugin.EditorLists = EditorLists;



}, '@VERSION@', {"requires": ["editor-base"]});
