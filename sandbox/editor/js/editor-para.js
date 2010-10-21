YUI.add('editor-para', function(Y) {


    /**
     * Plugin for Editor to paragraph auto wrapping and correction.
     * @module editor
     * @submodule editor-para
     */     
    /**
     * Plugin for Editor to paragraph auto wrapping and correction.
     * @class Plugin.EditorPara
     * @extends Base
     * @constructor
     */


    var EditorPara = function() {
        EditorPara.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', BODY = 'body', NODE_CHANGE = 'nodeChange',
    FIRST_P = BODY + ' > p', P = 'p';


    Y.extend(EditorPara, Y.Base, {
        /**
        * Utility method to create an empty paragraph when the document is empty.
        * @private
        * @method _fixFirstPara
        */
        _fixFirstPara: function() {
            var host = this.get(HOST), inst = host.getInstance(), sel;
            inst.one('body').set('innerHTML', '<' + P + '>' + inst.Selection.CURSOR + '</' + P + '>');
            sel = new inst.Selection();
            sel.focusCursor(true, false);
        },
        /**
        * nodeChange handler to handle fixing an empty document.
        * @private
        * @method _onNodeChange
        */
        _onNodeChange: function(e) {
            var host = this.get(HOST), inst = host.getInstance();

            switch (e.changedType) {
                case 'enter':
                    if (Y.UA.webkit) {
                        //Webkit doesn't support shift+enter as a BR, this fixes that.
                        if (e.changedEvent.shiftKey) {
                            host.execCommand('insertbr');
                            e.changedEvent.preventDefault();
                        }
                    }
                    if (Y.UA.gecko && host.get('defaultblock') !== 'p') {
                        var par = e.changedNode, d, sel, btag = inst.Selection.DEFAULT_BLOCK_TAG;
                        if (!par.test(btag)) {
                            par = par.ancestor(btag);
                        }
                        d = inst.Node.create('<' + btag + '>' + inst.Selection.CURSOR + '</' + btag + '>');
                        sel = new inst.Selection();
                        par.insert(d, 'after');
                        sel.focusCursor(true, false);
                        e.changedEvent.preventDefault();
                    }
                    break;
                case 'keydown':
                    if (inst.config.doc.childNodes.length < 2) {
                        var cont = inst.config.doc.body.innerHTML;
                        if (cont && cont.length < 5 && cont.toLowerCase() == '<br>') {
                            this._fixFirstPara();
                        }
                    }
                    break;
                case 'backspace-up':
                case 'backspace-down':
                case 'delete-up':
                    if (!Y.UA.ie) {
                        var ps = inst.all(FIRST_P), br, item, html, txt, p, imgs;
                        item = inst.one(BODY);
                        if (ps.item(0)) {
                            item = ps.item(0);
                        }
                        br = item.one('br');
                        if (br) {
                            br.removeAttribute('id');
                            br.removeAttribute('class');
                        }

                        txt = inst.Selection.getText(item);
                        txt = txt.replace(/ /g, '').replace(/\n/g, '');
                        imgs = item.all('img');
                        
                        if (txt.length === 0 && !imgs.size()) {
                            //God this is horrible..
                            if (!item.test(P)) {
                                this._fixFirstPara();
                            }
                            p = null;
                            if (e.changedNode && e.changedNode.test(P)) {
                                p = e.changedNode;
                            }
                            if (!p && host._lastPara && host._lastPara.inDoc()) {
                                p = host._lastPara;
                            }
                            if (p && !p.test(P)) {
                                p = p.ancestor(P);
                            }
                            if (p) {
                                if (!p.previous() && p.get('parentNode') && p.get('parentNode').test(BODY)) {
                                    Y.log('Stopping the backspace event', 'warn', 'editor-para');
                                    e.changedEvent.frameEvent.halt();
                                }
                            }
                        }
                        if (Y.UA.webkit) {
                            if (e.changedNode) {
                                item = e.changedNode;
                                if (item.test('li') && (!item.previous() && !item.next())) {
                                    html = item.get('innerHTML').replace('<br>', '');
                                    if (html === '') {
                                        if (item.get('parentNode')) {
                                            item.get('parentNode').replace(inst.Node.create('<br>'));
                                            e.changedEvent.frameEvent.halt();
                                            e.preventDefault();
                                            inst.Selection.filterBlocks();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (Y.UA.gecko) {
                        /**
                        * This forced FF to redraw the content on backspace.
                        * On some occasions FF will leave a cursor residue after content has been deleted.
                        * Dropping in the empty textnode and then removing it causes FF to redraw and
                        * remove the "ghost cursors"
                        */
                        var d = e.changedNode,
                            t = inst.config.doc.createTextNode(' ');
                        d.appendChild(t);
                        d.removeChild(t);
                    }
                    break;
            }
            
        },
        /**
        * Performs a block element filter when the Editor is first ready
        * @private
        * @method _afterEditorReady
        */
        _afterEditorReady: function() {
            var host = this.get(HOST), inst = host.getInstance(), btag;
            if (inst) {
                inst.Selection.filterBlocks();
                btag = inst.Selection.DEFAULT_BLOCK_TAG;
                FIRST_P = BODY + ' > ' + btag;
                P = btag;
            }
        },
        /**
        * Performs a block element filter when the Editor after an content change
        * @private
        * @method _afterContentChange
        */
        _afterContentChange: function() {
            var host = this.get(HOST), inst = host.getInstance();
            if (inst && inst.Selection) {
                inst.Selection.filterBlocks();
            }
        },
        /**
        * Performs block/paste filtering after paste.
        * @private
        * @method _afterPaste
        */
        _afterPaste: function() {
            var host = this.get(HOST), inst = host.getInstance(),
                sel = new inst.Selection();

            Y.later(50, host, function() {
                inst.Selection.filterBlocks();
            });
            
        },
        initializer: function() {
            var host = this.get(HOST);

            host.on(NODE_CHANGE, Y.bind(this._onNodeChange, this));
            host.after('ready', Y.bind(this._afterEditorReady, this));
            host.after('contentChange', Y.bind(this._afterContentChange, this));
            if (Y.Env.webkit) {
                host.after('dom:paste', Y.bind(this._afterPaste, this));
            }
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
    
    Y.namespace('Plugin');
    
    Y.Plugin.EditorPara = EditorPara;

}, '1.0.0', {requires: ['editor-base', 'selection']});
