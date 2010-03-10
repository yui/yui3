YUI.add('editor-lists', function(Y) {
    /**
     * Handles list manipulation inside the Editor. Adds keyboard manipulation and execCommand support.
     * @module editor
     * @submodule editor-lists
     */     
    /**
     * Handles list manipulation inside the Editor. Adds keyboard manipulation and execCommand support.
     * @class EditorLists
     * @constructor
     * @extends Base
     * @namespace Plugin
     */
    
    var EditorLists = function() {
        EditorLists.superclass.constructor.apply(this, arguments);
    }, LI = 'li', OL = 'ol', HOST = 'host';

    Y.extend(EditorLists, Y.Base, {
        /**
        * Listener for host's nodeChange event and captures the tabkey interaction only when inside a list node.
        * @private
        * @method _onNodeChange
        * @param {Event} e The Event facade passed from the host.
        */
        _onNodeChange: function(e) {
            var inst = this.get(HOST).getInstance(), sel;

            if (Y.UA.ie && e.changedType === 'enter') {
                e.changedEvent.halt();
                e.preventDefault();
                var li = e.changedNode,
                    newLi = Y.Node.create('<li><span>FOO</span></li>');
                li.insert(newLi, 'after');
                li = newLi.one('span');
                sel = new inst.Selection();
                sel.selectNode(li);
            }
            if (e.changedType === 'tab') {
                if (e.changedNode.test('li, li *')) {
                    Y.log('Overriding TAB to move lists around', 'info', 'editorLists');
                    e.changedEvent.halt();
                    e.preventDefault();
                    var li = e.changedNode, sTab = e.changedEvent.shiftKey,
                        par = li.ancestor('ol,ul'),
                        moved = false, tag = 'ul';


                    if (par.get('tagName').toLowerCase() === OL) {
                        tag = OL;
                    }
                    Y.log('ShiftKey: ' + sTab, 'info', 'editorLists');
                    
                    if (!li.test(LI)) {
                        li = li.ancestor(LI);
                    }
                    if (sTab) {
                        if (li.ancestor(LI)) {
                            Y.log('Shifting list up one level', 'info', 'editorLists');
                            li.ancestor(LI).insert(li, 'after');
                            moved = true;
                        }
                    } else {
                        if (li.previous(LI)) {
                            Y.log('Shifting list down one level', 'info', 'editorLists');
                            var newList = Y.Node.create('<' + tag + '></' + tag + '>');
                            li.previous(LI).append(newList);
                            newList.append(li);
                            moved = true;
                        }
                    }
                }
                if (moved) {
                    li.all(EditorLists.REMOVE).remove();
                    //Selection here..
                    sel = new inst.Selection();
                    sel.selectNode(li, true, true);
                }
            }
        },
        initializer: function() {
            this.get(HOST).on('nodeChange', Y.bind(this._onNodeChange, this));
        }
    }, {
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


    Y.namespace('Plugin');

    Y.Plugin.EditorLists = EditorLists;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
        insertunorderedlist: function(cmd) {
            var inst = this.get('host').getInstance(), out;
            this.get('host')._execCommand(cmd, '');
            out = (new inst.Selection()).getSelected();
            return out;
        },
        insertorderedlist: function(cmd) {
            var inst = this.get('host').getInstance(), out;
            this.get('host')._execCommand(cmd, '');
            out = (new inst.Selection()).getSelected();
            return out;   
        }
    });

});
