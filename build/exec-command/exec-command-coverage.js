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
_yuitest_coverage["exec-command"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "exec-command",
    code: []
};
_yuitest_coverage["exec-command"].code=["YUI.add('exec-command', function (Y, NAME) {","","","    /**","     * Plugin for the frame module to handle execCommands for Editor","     * @class Plugin.ExecCommand","     * @extends Base","     * @constructor","     * @module editor","     * @submodule exec-command","     */","        var ExecCommand = function() {","            ExecCommand.superclass.constructor.apply(this, arguments);","        };","","        Y.extend(ExecCommand, Y.Base, {","            /**","            * An internal reference to the keyCode of the last key that was pressed.","            * @private","            * @property _lastKey","            */","            _lastKey: null,","            /**","            * An internal reference to the instance of the frame plugged into.","            * @private","            * @property _inst","            */","            _inst: null,","            /**","            * Execute a command on the frame's document.","            * @method command","            * @param {String} action The action to perform (bold, italic, fontname)","            * @param {String} value The optional value (helvetica)","            * @return {Node/NodeList} Should return the Node/Nodelist affected","            */","            command: function(action, value) {","                var fn = ExecCommand.COMMANDS[action];","                ","                if (fn) {","                    return fn.call(this, action, value);","                } else {","                    return this._command(action, value);","                }","            },","            /**","            * The private version of execCommand that doesn't filter for overrides.","            * @private","            * @method _command","            * @param {String} action The action to perform (bold, italic, fontname)","            * @param {String} value The optional value (helvetica)","            */","            _command: function(action, value) {","                var inst = this.getInstance();","                try {","                    try {","                        inst.config.doc.execCommand('styleWithCSS', null, 1);","                    } catch (e1) {","                        try {","                            inst.config.doc.execCommand('useCSS', null, 0);","                        } catch (e2) {","                        }","                    }","                    inst.config.doc.execCommand(action, null, value);","                } catch (e) {","                }","            },","            /**","            * Get's the instance of YUI bound to the parent frame","            * @method getInstance","            * @return {YUI} The YUI instance bound to the parent frame","            */","            getInstance: function() {","                if (!this._inst) {","                    this._inst = this.get('host').getInstance();","                }","                return this._inst;","            },","            initializer: function() {","                Y.mix(this.get('host'), {","                    execCommand: function(action, value) {","                        return this.exec.command(action, value);","                    },","                    _execCommand: function(action, value) {","                        return this.exec._command(action, value);","                    }","                });","","                this.get('host').on('dom:keypress', Y.bind(function(e) {","                    this._lastKey = e.keyCode;","                }, this));","            },","            _wrapContent: function(str, override) {","                var useP = (this.getInstance().host.editorPara && !override ? true : false);","                ","                if (useP) {","                    str = '<p>' + str + '</p>';","                } else {","                    str = str + '<br>';","                }","                return str;","            }","        }, {","            /**","            * execCommand","            * @property NAME","            * @static","            */","            NAME: 'execCommand',","            /**","            * exec","            * @property NS","            * @static","            */","            NS: 'exec',","            ATTRS: {","                host: {","                    value: false","                }","            },","            /**","            * Static object literal of execCommand overrides","            * @property COMMANDS","            * @static","            */","            COMMANDS: {","                /**","                * Wraps the content with a new element of type (tag)","                * @method COMMANDS.wrap","                * @static","                * @param {String} cmd The command executed: wrap","                * @param {String} tag The tag to wrap the selection with","                * @return {NodeList} NodeList of the items touched by this command.","                */","                wrap: function(cmd, tag) {","                    var inst = this.getInstance();","                    return (new inst.EditorSelection()).wrapContent(tag);","                },","                /**","                * Inserts the provided HTML at the cursor, should be a single element.","                * @method COMMANDS.inserthtml","                * @static","                * @param {String} cmd The command executed: inserthtml","                * @param {String} html The html to insert","                * @return {Node} Node instance of the item touched by this command.","                */","                inserthtml: function(cmd, html) {","                    var inst = this.getInstance();","                    if (inst.EditorSelection.hasCursor() || Y.UA.ie) {","                        return (new inst.EditorSelection()).insertContent(html);","                    } else {","                        this._command('inserthtml', html);","                    }","                },","                /**","                * Inserts the provided HTML at the cursor, and focuses the cursor afterwards.","                * @method COMMANDS.insertandfocus","                * @static","                * @param {String} cmd The command executed: insertandfocus","                * @param {String} html The html to insert","                * @return {Node} Node instance of the item touched by this command.","                */","                insertandfocus: function(cmd, html) {","                    var inst = this.getInstance(), out, sel;","                    if (inst.EditorSelection.hasCursor()) {","                        html += inst.EditorSelection.CURSOR;","                        out = this.command('inserthtml', html);","                        sel = new inst.EditorSelection();","                        sel.focusCursor(true, true);","                    } else {","                        this.command('inserthtml', html);","                    }","                    return out;","                },","                /**","                * Inserts a BR at the current cursor position","                * @method COMMANDS.insertbr","                * @static","                * @param {String} cmd The command executed: insertbr","                */","                insertbr: function(cmd) {","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection(),","                        html = '<var>|</var>', last = null,","                        q = (Y.UA.webkit) ? 'span.Apple-style-span,var' : 'var';","","                    if (sel._selection.pasteHTML) {","                        sel._selection.pasteHTML(html);","                    } else {","                        this._command('inserthtml', html);","                    }","","                    var insert = function(n) {","                        var c = inst.Node.create('<br>');","                        n.insert(c, 'before');","                        return c;","                    };","","                    inst.all(q).each(function(n) {","                        var g = true;   ","                        if (Y.UA.webkit) {","                            g = false;","                            if (n.get('innerHTML') === '|') {","                                g = true;","                            }","                        }","                        if (g) {","                            last = insert(n);","                            if ((!last.previous() || !last.previous().test('br')) && Y.UA.gecko) {","                                var s = last.cloneNode();","                                last.insert(s, 'after');","                                last = s;","                            }","                            n.remove();","                        }","                    });","                    if (Y.UA.webkit && last) {","                        insert(last);","                        sel.selectNode(last);","                    }","                },","                /**","                * Inserts an image at the cursor position","                * @method COMMANDS.insertimage","                * @static","                * @param {String} cmd The command executed: insertimage","                * @param {String} img The url of the image to be inserted","                * @return {Node} Node instance of the item touched by this command.","                */","                insertimage: function(cmd, img) {","                    return this.command('inserthtml', '<img src=\"' + img + '\">');","                },","                /**","                * Add a class to all of the elements in the selection","                * @method COMMANDS.addclass","                * @static","                * @param {String} cmd The command executed: addclass","                * @param {String} cls The className to add","                * @return {NodeList} NodeList of the items touched by this command.","                */","                addclass: function(cmd, cls) {","                    var inst = this.getInstance();","                    return (new inst.EditorSelection()).getSelected().addClass(cls);","                },","                /**","                * Remove a class from all of the elements in the selection","                * @method COMMANDS.removeclass","                * @static","                * @param {String} cmd The command executed: removeclass","                * @param {String} cls The className to remove","                * @return {NodeList} NodeList of the items touched by this command.","                */","                removeclass: function(cmd, cls) {","                    var inst = this.getInstance();","                    return (new inst.EditorSelection()).getSelected().removeClass(cls);","                },","                /**","                * Adds a forecolor to the current selection, or creates a new element and applies it","                * @method COMMANDS.forecolor","                * @static","                * @param {String} cmd The command executed: forecolor","                * @param {String} val The color value to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                forecolor: function(cmd, val) {","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection(), n;","","                    if (!Y.UA.ie) {","                        this._command('useCSS', false);","                    }","                    if (inst.EditorSelection.hasCursor()) {","                        if (sel.isCollapsed) {","                            if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {","                                sel.anchorNode.setStyle('color', val);","                                n = sel.anchorNode;","                            } else {","                                n = this.command('inserthtml', '<span style=\"color: ' + val + '\">' + inst.EditorSelection.CURSOR + '</span>');","                                sel.focusCursor(true, true);","                            }","                            return n;","                        } else {","                            return this._command(cmd, val);","                        }","                    } else {","                        this._command(cmd, val);","                    }","                },","                /**","                * Adds a background color to the current selection, or creates a new element and applies it","                * @method COMMANDS.backcolor","                * @static","                * @param {String} cmd The command executed: backcolor","                * @param {String} val The color value to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                backcolor: function(cmd, val) {","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection(), n;","                    ","                    if (Y.UA.gecko || Y.UA.opera) {","                        cmd = 'hilitecolor';","                    }","                    if (!Y.UA.ie) {","                        this._command('useCSS', false);","                    }","                    if (inst.EditorSelection.hasCursor()) {","                        if (sel.isCollapsed) {","                            if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {","                                sel.anchorNode.setStyle('backgroundColor', val);","                                n = sel.anchorNode;","                            } else {","                                n = this.command('inserthtml', '<span style=\"background-color: ' + val + '\">' + inst.EditorSelection.CURSOR + '</span>');","                                sel.focusCursor(true, true);","                            }","                            return n;","                        } else {","                            return this._command(cmd, val);","                        }","                    } else {","                        this._command(cmd, val);","                    }","                },","                /**","                * Sugar method, calles backcolor","                * @method COMMANDS.hilitecolor","                * @static","                * @param {String} cmd The command executed: backcolor","                * @param {String} val The color value to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                hilitecolor: function() {","                    return ExecCommand.COMMANDS.backcolor.apply(this, arguments);","                },","                /**","                * Adds a font name to the current selection, or creates a new element and applies it","                * @method COMMANDS.fontname2","                * @deprecated","                * @static","                * @param {String} cmd The command executed: fontname","                * @param {String} val The font name to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                fontname2: function(cmd, val) {","                    this._command('fontname', val);","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection();","                    ","                    if (sel.isCollapsed && (this._lastKey != 32)) {","                        if (sel.anchorNode.test('font')) {","                            sel.anchorNode.set('face', val);","                        }","                    }","                },","                /**","                * Adds a fontsize to the current selection, or creates a new element and applies it","                * @method COMMANDS.fontsize2","                * @deprecated","                * @static","                * @param {String} cmd The command executed: fontsize","                * @param {String} val The font size to apply","                * @return {NodeList} NodeList of the items touched by this command.","                */","                fontsize2: function(cmd, val) {","                    this._command('fontsize', val);","","                    var inst = this.getInstance(),","                        sel = new inst.EditorSelection();","                    ","                    if (sel.isCollapsed && sel.anchorNode && (this._lastKey != 32)) {","                        if (Y.UA.webkit) {","                            if (sel.anchorNode.getStyle('lineHeight')) {","                                sel.anchorNode.setStyle('lineHeight', '');","                            }","                        }","                        if (sel.anchorNode.test('font')) {","                            sel.anchorNode.set('size', val);","                        } else if (Y.UA.gecko) {","                            var p = sel.anchorNode.ancestor(inst.EditorSelection.DEFAULT_BLOCK_TAG);","                            if (p) {","                                p.setStyle('fontSize', '');","                            }","                        }","                    }","                },","                /**","                * Overload for COMMANDS.list","                * @method COMMANDS.insertorderedlist","                * @static","                * @param {String} cmd The command executed: list, ul","                */","                insertunorderedlist: function(cmd) {","                    this.command('list', 'ul');","                },","                /**","                * Overload for COMMANDS.list","                * @method COMMANDS.insertunorderedlist","                * @static","                * @param {String} cmd The command executed: list, ol","                */","                insertorderedlist: function(cmd) {","                    this.command('list', 'ol');","                },","                /**","                * Noramlizes lists creation/destruction for IE. All others pass through to native calls","                * @method COMMANDS.list","                * @static","                * @param {String} cmd The command executed: list (not used)","                * @param {String} tag The tag to deal with","                */","                list: function(cmd, tag) {","                    var inst = this.getInstance(), html, self = this,","                        /*","                        The yui3- class name below is not a skinnable class,","                        it's a utility class used internally by editor and ","                        stripped when completed, calling getClassName on this","                        is a waste of resources.","                        */","                        DIR = 'dir', cls = 'yui3-touched',","                        dir, range, div, elm, n, str, s, par, list, lis,","                        useP = (inst.host.editorPara ? true : false),","                        sel = new inst.EditorSelection();","","                    cmd = 'insert' + ((tag === 'ul') ? 'un' : '') + 'orderedlist';","                    ","                    if (Y.UA.ie && !sel.isCollapsed) {","                        range = sel._selection;","                        html = range.htmlText;","                        div = inst.Node.create(html) || inst.one('body');","","                        if (div.test('li') || div.one('li')) {","                            this._command(cmd, null);","                            return;","                        }","                        if (div.test(tag)) {","                            elm = range.item ? range.item(0) : range.parentElement();","                            n = inst.one(elm);","                            lis = n.all('li');","","                            str = '<div>';","                            lis.each(function(l) {","                                str = self._wrapContent(l.get('innerHTML'));","                            });","                            str += '</div>';","                            s = inst.Node.create(str);","                            if (n.get('parentNode').test('div')) {","                                n = n.get('parentNode');","                            }","                            if (n && n.hasAttribute(DIR)) {","                                if (useP) {","                                    s.all('p').setAttribute(DIR, n.getAttribute(DIR));","                                } else {","                                    s.setAttribute(DIR, n.getAttribute(DIR));","                                }","                            }","                            if (useP) {","                                n.replace(s.get('innerHTML'));","                            } else {","                                n.replace(s);","                            }","                            if (range.moveToElementText) {","                                range.moveToElementText(s._node);","                            }","                            range.select();","                        } else {","                            par = Y.one(range.parentElement());","                            if (!par.test(inst.EditorSelection.BLOCKS)) {","                                par = par.ancestor(inst.EditorSelection.BLOCKS);","                            }","                            if (par) {","                                if (par.hasAttribute(DIR)) {","                                    dir = par.getAttribute(DIR);","                                }","                            }","                            if (html.indexOf('<br>') > -1) {","                                html = html.split(/<br>/i);","                            } else {","                                var tmp = inst.Node.create(html),","                                ps = tmp ? tmp.all('p') : null;","","                                if (ps && ps.size()) {","                                    html = [];","                                    ps.each(function(n) {","                                        html.push(n.get('innerHTML'));","                                    });","                                } else {","                                    html = [html];","                                }","                            }","                            list = '<' + tag + ' id=\"ie-list\">';","                            Y.each(html, function(v) {","                                var a = inst.Node.create(v);","                                if (a && a.test('p')) {","                                    if (a.hasAttribute(DIR)) {","                                        dir = a.getAttribute(DIR);","                                    }","                                    v = a.get('innerHTML');","                                }","                                list += '<li>' + v + '</li>';","                            });","                            list += '</' + tag + '>';","                            range.pasteHTML(list);","                            elm = inst.config.doc.getElementById('ie-list');","                            elm.id = '';","                            if (dir) {","                                elm.setAttribute(DIR, dir);","                            }","                            if (range.moveToElementText) {","                                range.moveToElementText(elm);","                            }","                            range.select();","                        }","                    } else if (Y.UA.ie) {","                        par = inst.one(sel._selection.parentElement());","                        if (par.test('p')) {","                            if (par && par.hasAttribute(DIR)) {","                                dir = par.getAttribute(DIR);","                            }","                            html = Y.EditorSelection.getText(par);","                            if (html === '') {","                                var sdir = '';","                                if (dir) {","                                    sdir = ' dir=\"' + dir + '\"';","                                }","                                list = inst.Node.create(Y.Lang.sub('<{tag}{dir}><li></li></{tag}>', { tag: tag, dir: sdir }));","                                par.replace(list);","                                sel.selectNode(list.one('li'));","                            } else {","                                this._command(cmd, null);","                            }","                        } else {","                            this._command(cmd, null);","                        }","                    } else {","                        inst.all(tag).addClass(cls);","                        if (sel.anchorNode.test(inst.EditorSelection.BLOCKS)) {","                            par = sel.anchorNode;","                        } else {","                            par = sel.anchorNode.ancestor(inst.EditorSelection.BLOCKS);","                        }","                        if (!par) { //No parent, find the first block under the anchorNode","                            par = sel.anchorNode.one(inst.EditorSelection.BLOCKS);","                        }","","                        if (par && par.hasAttribute(DIR)) {","                            dir = par.getAttribute(DIR);","                        }","                        if (par && par.test(tag)) {","                            var hasPParent = par.ancestor('p');","                            html = inst.Node.create('<div/>');","                            elm = par.all('li');","                            elm.each(function(h) {","                                html.append(self._wrapContent(h.get('innerHTML'), hasPParent));","                            });","                            if (dir) {","                                if (useP) {","                                    html.all('p').setAttribute(DIR, dir);","                                } else {","                                    html.setAttribute(DIR, dir);","                                }","                            }","                            if (useP) {","                                html = inst.Node.create(html.get('innerHTML'));","                            }","                            var fc = html.get('firstChild');","                            par.replace(html);","                            sel.selectNode(fc);","                        } else {","                            this._command(cmd, null);","                        }","                        list = inst.all(tag);","                        if (dir) {","                            if (list.size()) {","                                //Changed to a List","                                list.each(function(n) {","                                    if (!n.hasClass(cls)) {","                                        n.setAttribute(DIR, dir);","                                    }","                                });","                            }","                        }","","                        list.removeClass(cls);","                    }","                },","                /**","                * Noramlizes alignment for Webkit Browsers","                * @method COMMANDS.justify","                * @static","                * @param {String} cmd The command executed: justify (not used)","                * @param {String} val The actual command from the justify{center,all,left,right} stubs","                */","                justify: function(cmd, val) {","                    if (Y.UA.webkit) {","                        var inst = this.getInstance(),","                            sel = new inst.EditorSelection(),","                            aNode = sel.anchorNode;","","                            var bgColor = aNode.getStyle('backgroundColor');","                            this._command(val);","                            sel = new inst.EditorSelection();","                            if (sel.anchorNode.test('div')) {","                                var html = '<span>' + sel.anchorNode.get('innerHTML') + '</span>';","                                sel.anchorNode.set('innerHTML', html);","                                sel.anchorNode.one('span').setStyle('backgroundColor', bgColor);","                                sel.selectNode(sel.anchorNode.one('span'));","                            }","                    } else {","                        this._command(val);","                    }","                },","                /**","                * Override method for COMMANDS.justify","                * @method COMMANDS.justifycenter","                * @static","                */","                justifycenter: function(cmd) {","                    this.command('justify', 'justifycenter');","                },","                /**","                * Override method for COMMANDS.justify","                * @method COMMANDS.justifyleft","                * @static","                */","                justifyleft: function(cmd) {","                    this.command('justify', 'justifyleft');","                },","                /**","                * Override method for COMMANDS.justify","                * @method COMMANDS.justifyright","                * @static","                */","                justifyright: function(cmd) {","                    this.command('justify', 'justifyright');","                },","                /**","                * Override method for COMMANDS.justify","                * @method COMMANDS.justifyfull","                * @static","                */","                justifyfull: function(cmd) {","                    this.command('justify', 'justifyfull');","                }","            }","        });","        ","        /**","        * This method is meant to normalize IE's in ability to exec the proper command on elements with CSS styling.","        * @method fixIETags","        * @protected","        * @param {String} cmd The command to execute","        * @param {String} tag The tag to create","        * @param {String} rule The rule that we are looking for.","        */","        var fixIETags = function(cmd, tag, rule) {","            var inst = this.getInstance(),","                doc = inst.config.doc,","                sel = doc.selection.createRange(),","                o = doc.queryCommandValue(cmd),","                html, reg, m, p, d, s, c;","","            if (o) {","                html = sel.htmlText;","                reg = new RegExp(rule, 'g');","                m = html.match(reg);","","                if (m) {","                    html = html.replace(rule + ';', '').replace(rule, '');","","                    sel.pasteHTML('<var id=\"yui-ie-bs\">');","","                    p = doc.getElementById('yui-ie-bs');","                    d = doc.createElement('div');","                    s = doc.createElement(tag);","                    ","                    d.innerHTML = html;","                    if (p.parentNode !== inst.config.doc.body) {","                        p = p.parentNode;","                    }","","                    c = d.childNodes;","","                    p.parentNode.replaceChild(s, p);","","                    Y.each(c, function(f) {","                        s.appendChild(f);","                    });","                    sel.collapse();","                    if (sel.moveToElementText) {","                        sel.moveToElementText(s);","                    }","                    sel.select();","                }","            }","            this._command(cmd);","        };","","        if (Y.UA.ie) {","            ExecCommand.COMMANDS.bold = function() {","                fixIETags.call(this, 'bold', 'b', 'FONT-WEIGHT: bold');","            };","            ExecCommand.COMMANDS.italic = function() {","                fixIETags.call(this, 'italic', 'i', 'FONT-STYLE: italic');","            };","            ExecCommand.COMMANDS.underline = function() {","                fixIETags.call(this, 'underline', 'u', 'TEXT-DECORATION: underline');","            };","        }","","        Y.namespace('Plugin');","        Y.Plugin.ExecCommand = ExecCommand;","","","","}, '@VERSION@', {\"requires\": [\"frame\"]});"];
_yuitest_coverage["exec-command"].lines = {"1":0,"12":0,"13":0,"16":0,"37":0,"39":0,"40":0,"42":0,"53":0,"54":0,"55":0,"56":0,"58":0,"59":0,"63":0,"73":0,"74":0,"76":0,"79":0,"81":0,"84":0,"88":0,"89":0,"93":0,"95":0,"96":0,"98":0,"100":0,"135":0,"136":0,"147":0,"148":0,"149":0,"151":0,"163":0,"164":0,"165":0,"166":0,"167":0,"168":0,"170":0,"172":0,"181":0,"186":0,"187":0,"189":0,"192":0,"193":0,"194":0,"195":0,"198":0,"199":0,"200":0,"201":0,"202":0,"203":0,"206":0,"207":0,"208":0,"209":0,"210":0,"211":0,"213":0,"216":0,"217":0,"218":0,"230":0,"241":0,"242":0,"253":0,"254":0,"265":0,"268":0,"269":0,"271":0,"272":0,"273":0,"274":0,"275":0,"277":0,"278":0,"280":0,"282":0,"285":0,"297":0,"300":0,"301":0,"303":0,"304":0,"306":0,"307":0,"308":0,"309":0,"310":0,"312":0,"313":0,"315":0,"317":0,"320":0,"332":0,"344":0,"345":0,"348":0,"349":0,"350":0,"364":0,"366":0,"369":0,"370":0,"371":0,"372":0,"375":0,"376":0,"377":0,"378":0,"379":0,"380":0,"392":0,"401":0,"411":0,"423":0,"425":0,"426":0,"427":0,"428":0,"430":0,"431":0,"432":0,"434":0,"435":0,"436":0,"437":0,"439":0,"440":0,"441":0,"443":0,"444":0,"445":0,"446":0,"448":0,"449":0,"450":0,"452":0,"455":0,"456":0,"458":0,"460":0,"461":0,"463":0,"465":0,"466":0,"467":0,"469":0,"470":0,"471":0,"474":0,"475":0,"477":0,"480":0,"481":0,"482":0,"483":0,"486":0,"489":0,"490":0,"491":0,"492":0,"493":0,"494":0,"496":0,"498":0,"500":0,"501":0,"502":0,"503":0,"504":0,"505":0,"507":0,"508":0,"510":0,"512":0,"513":0,"514":0,"515":0,"516":0,"518":0,"519":0,"520":0,"521":0,"522":0,"524":0,"525":0,"526":0,"528":0,"531":0,"534":0,"535":0,"536":0,"538":0,"540":0,"541":0,"544":0,"545":0,"547":0,"548":0,"549":0,"550":0,"551":0,"552":0,"554":0,"555":0,"556":0,"558":0,"561":0,"562":0,"564":0,"565":0,"566":0,"568":0,"570":0,"571":0,"572":0,"574":0,"575":0,"576":0,"582":0,"593":0,"594":0,"598":0,"599":0,"600":0,"601":0,"602":0,"603":0,"604":0,"605":0,"608":0,"617":0,"625":0,"633":0,"641":0,"654":0,"655":0,"661":0,"662":0,"663":0,"664":0,"666":0,"667":0,"669":0,"671":0,"672":0,"673":0,"675":0,"676":0,"677":0,"680":0,"682":0,"684":0,"685":0,"687":0,"688":0,"689":0,"691":0,"694":0,"697":0,"698":0,"699":0,"701":0,"702":0,"704":0,"705":0,"709":0,"710":0};
_yuitest_coverage["exec-command"].functions = {"ExecCommand:12":0,"command:36":0,"_command:52":0,"getInstance:72":0,"execCommand:80":0,"_execCommand:83":0,"(anonymous 2):88":0,"initializer:78":0,"_wrapContent:92":0,"wrap:134":0,"inserthtml:146":0,"insertandfocus:162":0,"insert:192":0,"(anonymous 3):198":0,"insertbr:180":0,"insertimage:229":0,"addclass:240":0,"removeclass:252":0,"forecolor:264":0,"backcolor:296":0,"hilitecolor:331":0,"fontname2:343":0,"fontsize2:363":0,"insertunorderedlist:391":0,"insertorderedlist:400":0,"(anonymous 4):440":0,"(anonymous 5):482":0,"(anonymous 6):490":0,"(anonymous 7):551":0,"(anonymous 8):574":0,"list:410":0,"justify:592":0,"justifycenter:616":0,"justifyleft:624":0,"justifyright:632":0,"justifyfull:640":0,"(anonymous 9):684":0,"fixIETags:654":0,"bold:698":0,"italic:701":0,"underline:704":0,"(anonymous 1):1":0};
_yuitest_coverage["exec-command"].coveredLines = 274;
_yuitest_coverage["exec-command"].coveredFunctions = 42;
_yuitest_coverline("exec-command", 1);
YUI.add('exec-command', function (Y, NAME) {


    /**
     * Plugin for the frame module to handle execCommands for Editor
     * @class Plugin.ExecCommand
     * @extends Base
     * @constructor
     * @module editor
     * @submodule exec-command
     */
        _yuitest_coverfunc("exec-command", "(anonymous 1)", 1);
_yuitest_coverline("exec-command", 12);
var ExecCommand = function() {
            _yuitest_coverfunc("exec-command", "ExecCommand", 12);
_yuitest_coverline("exec-command", 13);
ExecCommand.superclass.constructor.apply(this, arguments);
        };

        _yuitest_coverline("exec-command", 16);
Y.extend(ExecCommand, Y.Base, {
            /**
            * An internal reference to the keyCode of the last key that was pressed.
            * @private
            * @property _lastKey
            */
            _lastKey: null,
            /**
            * An internal reference to the instance of the frame plugged into.
            * @private
            * @property _inst
            */
            _inst: null,
            /**
            * Execute a command on the frame's document.
            * @method command
            * @param {String} action The action to perform (bold, italic, fontname)
            * @param {String} value The optional value (helvetica)
            * @return {Node/NodeList} Should return the Node/Nodelist affected
            */
            command: function(action, value) {
                _yuitest_coverfunc("exec-command", "command", 36);
_yuitest_coverline("exec-command", 37);
var fn = ExecCommand.COMMANDS[action];
                
                _yuitest_coverline("exec-command", 39);
if (fn) {
                    _yuitest_coverline("exec-command", 40);
return fn.call(this, action, value);
                } else {
                    _yuitest_coverline("exec-command", 42);
return this._command(action, value);
                }
            },
            /**
            * The private version of execCommand that doesn't filter for overrides.
            * @private
            * @method _command
            * @param {String} action The action to perform (bold, italic, fontname)
            * @param {String} value The optional value (helvetica)
            */
            _command: function(action, value) {
                _yuitest_coverfunc("exec-command", "_command", 52);
_yuitest_coverline("exec-command", 53);
var inst = this.getInstance();
                _yuitest_coverline("exec-command", 54);
try {
                    _yuitest_coverline("exec-command", 55);
try {
                        _yuitest_coverline("exec-command", 56);
inst.config.doc.execCommand('styleWithCSS', null, 1);
                    } catch (e1) {
                        _yuitest_coverline("exec-command", 58);
try {
                            _yuitest_coverline("exec-command", 59);
inst.config.doc.execCommand('useCSS', null, 0);
                        } catch (e2) {
                        }
                    }
                    _yuitest_coverline("exec-command", 63);
inst.config.doc.execCommand(action, null, value);
                } catch (e) {
                }
            },
            /**
            * Get's the instance of YUI bound to the parent frame
            * @method getInstance
            * @return {YUI} The YUI instance bound to the parent frame
            */
            getInstance: function() {
                _yuitest_coverfunc("exec-command", "getInstance", 72);
_yuitest_coverline("exec-command", 73);
if (!this._inst) {
                    _yuitest_coverline("exec-command", 74);
this._inst = this.get('host').getInstance();
                }
                _yuitest_coverline("exec-command", 76);
return this._inst;
            },
            initializer: function() {
                _yuitest_coverfunc("exec-command", "initializer", 78);
_yuitest_coverline("exec-command", 79);
Y.mix(this.get('host'), {
                    execCommand: function(action, value) {
                        _yuitest_coverfunc("exec-command", "execCommand", 80);
_yuitest_coverline("exec-command", 81);
return this.exec.command(action, value);
                    },
                    _execCommand: function(action, value) {
                        _yuitest_coverfunc("exec-command", "_execCommand", 83);
_yuitest_coverline("exec-command", 84);
return this.exec._command(action, value);
                    }
                });

                _yuitest_coverline("exec-command", 88);
this.get('host').on('dom:keypress', Y.bind(function(e) {
                    _yuitest_coverfunc("exec-command", "(anonymous 2)", 88);
_yuitest_coverline("exec-command", 89);
this._lastKey = e.keyCode;
                }, this));
            },
            _wrapContent: function(str, override) {
                _yuitest_coverfunc("exec-command", "_wrapContent", 92);
_yuitest_coverline("exec-command", 93);
var useP = (this.getInstance().host.editorPara && !override ? true : false);
                
                _yuitest_coverline("exec-command", 95);
if (useP) {
                    _yuitest_coverline("exec-command", 96);
str = '<p>' + str + '</p>';
                } else {
                    _yuitest_coverline("exec-command", 98);
str = str + '<br>';
                }
                _yuitest_coverline("exec-command", 100);
return str;
            }
        }, {
            /**
            * execCommand
            * @property NAME
            * @static
            */
            NAME: 'execCommand',
            /**
            * exec
            * @property NS
            * @static
            */
            NS: 'exec',
            ATTRS: {
                host: {
                    value: false
                }
            },
            /**
            * Static object literal of execCommand overrides
            * @property COMMANDS
            * @static
            */
            COMMANDS: {
                /**
                * Wraps the content with a new element of type (tag)
                * @method COMMANDS.wrap
                * @static
                * @param {String} cmd The command executed: wrap
                * @param {String} tag The tag to wrap the selection with
                * @return {NodeList} NodeList of the items touched by this command.
                */
                wrap: function(cmd, tag) {
                    _yuitest_coverfunc("exec-command", "wrap", 134);
_yuitest_coverline("exec-command", 135);
var inst = this.getInstance();
                    _yuitest_coverline("exec-command", 136);
return (new inst.EditorSelection()).wrapContent(tag);
                },
                /**
                * Inserts the provided HTML at the cursor, should be a single element.
                * @method COMMANDS.inserthtml
                * @static
                * @param {String} cmd The command executed: inserthtml
                * @param {String} html The html to insert
                * @return {Node} Node instance of the item touched by this command.
                */
                inserthtml: function(cmd, html) {
                    _yuitest_coverfunc("exec-command", "inserthtml", 146);
_yuitest_coverline("exec-command", 147);
var inst = this.getInstance();
                    _yuitest_coverline("exec-command", 148);
if (inst.EditorSelection.hasCursor() || Y.UA.ie) {
                        _yuitest_coverline("exec-command", 149);
return (new inst.EditorSelection()).insertContent(html);
                    } else {
                        _yuitest_coverline("exec-command", 151);
this._command('inserthtml', html);
                    }
                },
                /**
                * Inserts the provided HTML at the cursor, and focuses the cursor afterwards.
                * @method COMMANDS.insertandfocus
                * @static
                * @param {String} cmd The command executed: insertandfocus
                * @param {String} html The html to insert
                * @return {Node} Node instance of the item touched by this command.
                */
                insertandfocus: function(cmd, html) {
                    _yuitest_coverfunc("exec-command", "insertandfocus", 162);
_yuitest_coverline("exec-command", 163);
var inst = this.getInstance(), out, sel;
                    _yuitest_coverline("exec-command", 164);
if (inst.EditorSelection.hasCursor()) {
                        _yuitest_coverline("exec-command", 165);
html += inst.EditorSelection.CURSOR;
                        _yuitest_coverline("exec-command", 166);
out = this.command('inserthtml', html);
                        _yuitest_coverline("exec-command", 167);
sel = new inst.EditorSelection();
                        _yuitest_coverline("exec-command", 168);
sel.focusCursor(true, true);
                    } else {
                        _yuitest_coverline("exec-command", 170);
this.command('inserthtml', html);
                    }
                    _yuitest_coverline("exec-command", 172);
return out;
                },
                /**
                * Inserts a BR at the current cursor position
                * @method COMMANDS.insertbr
                * @static
                * @param {String} cmd The command executed: insertbr
                */
                insertbr: function(cmd) {
                    _yuitest_coverfunc("exec-command", "insertbr", 180);
_yuitest_coverline("exec-command", 181);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection(),
                        html = '<var>|</var>', last = null,
                        q = (Y.UA.webkit) ? 'span.Apple-style-span,var' : 'var';

                    _yuitest_coverline("exec-command", 186);
if (sel._selection.pasteHTML) {
                        _yuitest_coverline("exec-command", 187);
sel._selection.pasteHTML(html);
                    } else {
                        _yuitest_coverline("exec-command", 189);
this._command('inserthtml', html);
                    }

                    _yuitest_coverline("exec-command", 192);
var insert = function(n) {
                        _yuitest_coverfunc("exec-command", "insert", 192);
_yuitest_coverline("exec-command", 193);
var c = inst.Node.create('<br>');
                        _yuitest_coverline("exec-command", 194);
n.insert(c, 'before');
                        _yuitest_coverline("exec-command", 195);
return c;
                    };

                    _yuitest_coverline("exec-command", 198);
inst.all(q).each(function(n) {
                        _yuitest_coverfunc("exec-command", "(anonymous 3)", 198);
_yuitest_coverline("exec-command", 199);
var g = true;   
                        _yuitest_coverline("exec-command", 200);
if (Y.UA.webkit) {
                            _yuitest_coverline("exec-command", 201);
g = false;
                            _yuitest_coverline("exec-command", 202);
if (n.get('innerHTML') === '|') {
                                _yuitest_coverline("exec-command", 203);
g = true;
                            }
                        }
                        _yuitest_coverline("exec-command", 206);
if (g) {
                            _yuitest_coverline("exec-command", 207);
last = insert(n);
                            _yuitest_coverline("exec-command", 208);
if ((!last.previous() || !last.previous().test('br')) && Y.UA.gecko) {
                                _yuitest_coverline("exec-command", 209);
var s = last.cloneNode();
                                _yuitest_coverline("exec-command", 210);
last.insert(s, 'after');
                                _yuitest_coverline("exec-command", 211);
last = s;
                            }
                            _yuitest_coverline("exec-command", 213);
n.remove();
                        }
                    });
                    _yuitest_coverline("exec-command", 216);
if (Y.UA.webkit && last) {
                        _yuitest_coverline("exec-command", 217);
insert(last);
                        _yuitest_coverline("exec-command", 218);
sel.selectNode(last);
                    }
                },
                /**
                * Inserts an image at the cursor position
                * @method COMMANDS.insertimage
                * @static
                * @param {String} cmd The command executed: insertimage
                * @param {String} img The url of the image to be inserted
                * @return {Node} Node instance of the item touched by this command.
                */
                insertimage: function(cmd, img) {
                    _yuitest_coverfunc("exec-command", "insertimage", 229);
_yuitest_coverline("exec-command", 230);
return this.command('inserthtml', '<img src="' + img + '">');
                },
                /**
                * Add a class to all of the elements in the selection
                * @method COMMANDS.addclass
                * @static
                * @param {String} cmd The command executed: addclass
                * @param {String} cls The className to add
                * @return {NodeList} NodeList of the items touched by this command.
                */
                addclass: function(cmd, cls) {
                    _yuitest_coverfunc("exec-command", "addclass", 240);
_yuitest_coverline("exec-command", 241);
var inst = this.getInstance();
                    _yuitest_coverline("exec-command", 242);
return (new inst.EditorSelection()).getSelected().addClass(cls);
                },
                /**
                * Remove a class from all of the elements in the selection
                * @method COMMANDS.removeclass
                * @static
                * @param {String} cmd The command executed: removeclass
                * @param {String} cls The className to remove
                * @return {NodeList} NodeList of the items touched by this command.
                */
                removeclass: function(cmd, cls) {
                    _yuitest_coverfunc("exec-command", "removeclass", 252);
_yuitest_coverline("exec-command", 253);
var inst = this.getInstance();
                    _yuitest_coverline("exec-command", 254);
return (new inst.EditorSelection()).getSelected().removeClass(cls);
                },
                /**
                * Adds a forecolor to the current selection, or creates a new element and applies it
                * @method COMMANDS.forecolor
                * @static
                * @param {String} cmd The command executed: forecolor
                * @param {String} val The color value to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                forecolor: function(cmd, val) {
                    _yuitest_coverfunc("exec-command", "forecolor", 264);
_yuitest_coverline("exec-command", 265);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection(), n;

                    _yuitest_coverline("exec-command", 268);
if (!Y.UA.ie) {
                        _yuitest_coverline("exec-command", 269);
this._command('useCSS', false);
                    }
                    _yuitest_coverline("exec-command", 271);
if (inst.EditorSelection.hasCursor()) {
                        _yuitest_coverline("exec-command", 272);
if (sel.isCollapsed) {
                            _yuitest_coverline("exec-command", 273);
if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {
                                _yuitest_coverline("exec-command", 274);
sel.anchorNode.setStyle('color', val);
                                _yuitest_coverline("exec-command", 275);
n = sel.anchorNode;
                            } else {
                                _yuitest_coverline("exec-command", 277);
n = this.command('inserthtml', '<span style="color: ' + val + '">' + inst.EditorSelection.CURSOR + '</span>');
                                _yuitest_coverline("exec-command", 278);
sel.focusCursor(true, true);
                            }
                            _yuitest_coverline("exec-command", 280);
return n;
                        } else {
                            _yuitest_coverline("exec-command", 282);
return this._command(cmd, val);
                        }
                    } else {
                        _yuitest_coverline("exec-command", 285);
this._command(cmd, val);
                    }
                },
                /**
                * Adds a background color to the current selection, or creates a new element and applies it
                * @method COMMANDS.backcolor
                * @static
                * @param {String} cmd The command executed: backcolor
                * @param {String} val The color value to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                backcolor: function(cmd, val) {
                    _yuitest_coverfunc("exec-command", "backcolor", 296);
_yuitest_coverline("exec-command", 297);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection(), n;
                    
                    _yuitest_coverline("exec-command", 300);
if (Y.UA.gecko || Y.UA.opera) {
                        _yuitest_coverline("exec-command", 301);
cmd = 'hilitecolor';
                    }
                    _yuitest_coverline("exec-command", 303);
if (!Y.UA.ie) {
                        _yuitest_coverline("exec-command", 304);
this._command('useCSS', false);
                    }
                    _yuitest_coverline("exec-command", 306);
if (inst.EditorSelection.hasCursor()) {
                        _yuitest_coverline("exec-command", 307);
if (sel.isCollapsed) {
                            _yuitest_coverline("exec-command", 308);
if (sel.anchorNode && (sel.anchorNode.get('innerHTML') === '&nbsp;')) {
                                _yuitest_coverline("exec-command", 309);
sel.anchorNode.setStyle('backgroundColor', val);
                                _yuitest_coverline("exec-command", 310);
n = sel.anchorNode;
                            } else {
                                _yuitest_coverline("exec-command", 312);
n = this.command('inserthtml', '<span style="background-color: ' + val + '">' + inst.EditorSelection.CURSOR + '</span>');
                                _yuitest_coverline("exec-command", 313);
sel.focusCursor(true, true);
                            }
                            _yuitest_coverline("exec-command", 315);
return n;
                        } else {
                            _yuitest_coverline("exec-command", 317);
return this._command(cmd, val);
                        }
                    } else {
                        _yuitest_coverline("exec-command", 320);
this._command(cmd, val);
                    }
                },
                /**
                * Sugar method, calles backcolor
                * @method COMMANDS.hilitecolor
                * @static
                * @param {String} cmd The command executed: backcolor
                * @param {String} val The color value to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                hilitecolor: function() {
                    _yuitest_coverfunc("exec-command", "hilitecolor", 331);
_yuitest_coverline("exec-command", 332);
return ExecCommand.COMMANDS.backcolor.apply(this, arguments);
                },
                /**
                * Adds a font name to the current selection, or creates a new element and applies it
                * @method COMMANDS.fontname2
                * @deprecated
                * @static
                * @param {String} cmd The command executed: fontname
                * @param {String} val The font name to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                fontname2: function(cmd, val) {
                    _yuitest_coverfunc("exec-command", "fontname2", 343);
_yuitest_coverline("exec-command", 344);
this._command('fontname', val);
                    _yuitest_coverline("exec-command", 345);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection();
                    
                    _yuitest_coverline("exec-command", 348);
if (sel.isCollapsed && (this._lastKey != 32)) {
                        _yuitest_coverline("exec-command", 349);
if (sel.anchorNode.test('font')) {
                            _yuitest_coverline("exec-command", 350);
sel.anchorNode.set('face', val);
                        }
                    }
                },
                /**
                * Adds a fontsize to the current selection, or creates a new element and applies it
                * @method COMMANDS.fontsize2
                * @deprecated
                * @static
                * @param {String} cmd The command executed: fontsize
                * @param {String} val The font size to apply
                * @return {NodeList} NodeList of the items touched by this command.
                */
                fontsize2: function(cmd, val) {
                    _yuitest_coverfunc("exec-command", "fontsize2", 363);
_yuitest_coverline("exec-command", 364);
this._command('fontsize', val);

                    _yuitest_coverline("exec-command", 366);
var inst = this.getInstance(),
                        sel = new inst.EditorSelection();
                    
                    _yuitest_coverline("exec-command", 369);
if (sel.isCollapsed && sel.anchorNode && (this._lastKey != 32)) {
                        _yuitest_coverline("exec-command", 370);
if (Y.UA.webkit) {
                            _yuitest_coverline("exec-command", 371);
if (sel.anchorNode.getStyle('lineHeight')) {
                                _yuitest_coverline("exec-command", 372);
sel.anchorNode.setStyle('lineHeight', '');
                            }
                        }
                        _yuitest_coverline("exec-command", 375);
if (sel.anchorNode.test('font')) {
                            _yuitest_coverline("exec-command", 376);
sel.anchorNode.set('size', val);
                        } else {_yuitest_coverline("exec-command", 377);
if (Y.UA.gecko) {
                            _yuitest_coverline("exec-command", 378);
var p = sel.anchorNode.ancestor(inst.EditorSelection.DEFAULT_BLOCK_TAG);
                            _yuitest_coverline("exec-command", 379);
if (p) {
                                _yuitest_coverline("exec-command", 380);
p.setStyle('fontSize', '');
                            }
                        }}
                    }
                },
                /**
                * Overload for COMMANDS.list
                * @method COMMANDS.insertorderedlist
                * @static
                * @param {String} cmd The command executed: list, ul
                */
                insertunorderedlist: function(cmd) {
                    _yuitest_coverfunc("exec-command", "insertunorderedlist", 391);
_yuitest_coverline("exec-command", 392);
this.command('list', 'ul');
                },
                /**
                * Overload for COMMANDS.list
                * @method COMMANDS.insertunorderedlist
                * @static
                * @param {String} cmd The command executed: list, ol
                */
                insertorderedlist: function(cmd) {
                    _yuitest_coverfunc("exec-command", "insertorderedlist", 400);
_yuitest_coverline("exec-command", 401);
this.command('list', 'ol');
                },
                /**
                * Noramlizes lists creation/destruction for IE. All others pass through to native calls
                * @method COMMANDS.list
                * @static
                * @param {String} cmd The command executed: list (not used)
                * @param {String} tag The tag to deal with
                */
                list: function(cmd, tag) {
                    _yuitest_coverfunc("exec-command", "list", 410);
_yuitest_coverline("exec-command", 411);
var inst = this.getInstance(), html, self = this,
                        /*
                        The yui3- class name below is not a skinnable class,
                        it's a utility class used internally by editor and 
                        stripped when completed, calling getClassName on this
                        is a waste of resources.
                        */
                        DIR = 'dir', cls = 'yui3-touched',
                        dir, range, div, elm, n, str, s, par, list, lis,
                        useP = (inst.host.editorPara ? true : false),
                        sel = new inst.EditorSelection();

                    _yuitest_coverline("exec-command", 423);
cmd = 'insert' + ((tag === 'ul') ? 'un' : '') + 'orderedlist';
                    
                    _yuitest_coverline("exec-command", 425);
if (Y.UA.ie && !sel.isCollapsed) {
                        _yuitest_coverline("exec-command", 426);
range = sel._selection;
                        _yuitest_coverline("exec-command", 427);
html = range.htmlText;
                        _yuitest_coverline("exec-command", 428);
div = inst.Node.create(html) || inst.one('body');

                        _yuitest_coverline("exec-command", 430);
if (div.test('li') || div.one('li')) {
                            _yuitest_coverline("exec-command", 431);
this._command(cmd, null);
                            _yuitest_coverline("exec-command", 432);
return;
                        }
                        _yuitest_coverline("exec-command", 434);
if (div.test(tag)) {
                            _yuitest_coverline("exec-command", 435);
elm = range.item ? range.item(0) : range.parentElement();
                            _yuitest_coverline("exec-command", 436);
n = inst.one(elm);
                            _yuitest_coverline("exec-command", 437);
lis = n.all('li');

                            _yuitest_coverline("exec-command", 439);
str = '<div>';
                            _yuitest_coverline("exec-command", 440);
lis.each(function(l) {
                                _yuitest_coverfunc("exec-command", "(anonymous 4)", 440);
_yuitest_coverline("exec-command", 441);
str = self._wrapContent(l.get('innerHTML'));
                            });
                            _yuitest_coverline("exec-command", 443);
str += '</div>';
                            _yuitest_coverline("exec-command", 444);
s = inst.Node.create(str);
                            _yuitest_coverline("exec-command", 445);
if (n.get('parentNode').test('div')) {
                                _yuitest_coverline("exec-command", 446);
n = n.get('parentNode');
                            }
                            _yuitest_coverline("exec-command", 448);
if (n && n.hasAttribute(DIR)) {
                                _yuitest_coverline("exec-command", 449);
if (useP) {
                                    _yuitest_coverline("exec-command", 450);
s.all('p').setAttribute(DIR, n.getAttribute(DIR));
                                } else {
                                    _yuitest_coverline("exec-command", 452);
s.setAttribute(DIR, n.getAttribute(DIR));
                                }
                            }
                            _yuitest_coverline("exec-command", 455);
if (useP) {
                                _yuitest_coverline("exec-command", 456);
n.replace(s.get('innerHTML'));
                            } else {
                                _yuitest_coverline("exec-command", 458);
n.replace(s);
                            }
                            _yuitest_coverline("exec-command", 460);
if (range.moveToElementText) {
                                _yuitest_coverline("exec-command", 461);
range.moveToElementText(s._node);
                            }
                            _yuitest_coverline("exec-command", 463);
range.select();
                        } else {
                            _yuitest_coverline("exec-command", 465);
par = Y.one(range.parentElement());
                            _yuitest_coverline("exec-command", 466);
if (!par.test(inst.EditorSelection.BLOCKS)) {
                                _yuitest_coverline("exec-command", 467);
par = par.ancestor(inst.EditorSelection.BLOCKS);
                            }
                            _yuitest_coverline("exec-command", 469);
if (par) {
                                _yuitest_coverline("exec-command", 470);
if (par.hasAttribute(DIR)) {
                                    _yuitest_coverline("exec-command", 471);
dir = par.getAttribute(DIR);
                                }
                            }
                            _yuitest_coverline("exec-command", 474);
if (html.indexOf('<br>') > -1) {
                                _yuitest_coverline("exec-command", 475);
html = html.split(/<br>/i);
                            } else {
                                _yuitest_coverline("exec-command", 477);
var tmp = inst.Node.create(html),
                                ps = tmp ? tmp.all('p') : null;

                                _yuitest_coverline("exec-command", 480);
if (ps && ps.size()) {
                                    _yuitest_coverline("exec-command", 481);
html = [];
                                    _yuitest_coverline("exec-command", 482);
ps.each(function(n) {
                                        _yuitest_coverfunc("exec-command", "(anonymous 5)", 482);
_yuitest_coverline("exec-command", 483);
html.push(n.get('innerHTML'));
                                    });
                                } else {
                                    _yuitest_coverline("exec-command", 486);
html = [html];
                                }
                            }
                            _yuitest_coverline("exec-command", 489);
list = '<' + tag + ' id="ie-list">';
                            _yuitest_coverline("exec-command", 490);
Y.each(html, function(v) {
                                _yuitest_coverfunc("exec-command", "(anonymous 6)", 490);
_yuitest_coverline("exec-command", 491);
var a = inst.Node.create(v);
                                _yuitest_coverline("exec-command", 492);
if (a && a.test('p')) {
                                    _yuitest_coverline("exec-command", 493);
if (a.hasAttribute(DIR)) {
                                        _yuitest_coverline("exec-command", 494);
dir = a.getAttribute(DIR);
                                    }
                                    _yuitest_coverline("exec-command", 496);
v = a.get('innerHTML');
                                }
                                _yuitest_coverline("exec-command", 498);
list += '<li>' + v + '</li>';
                            });
                            _yuitest_coverline("exec-command", 500);
list += '</' + tag + '>';
                            _yuitest_coverline("exec-command", 501);
range.pasteHTML(list);
                            _yuitest_coverline("exec-command", 502);
elm = inst.config.doc.getElementById('ie-list');
                            _yuitest_coverline("exec-command", 503);
elm.id = '';
                            _yuitest_coverline("exec-command", 504);
if (dir) {
                                _yuitest_coverline("exec-command", 505);
elm.setAttribute(DIR, dir);
                            }
                            _yuitest_coverline("exec-command", 507);
if (range.moveToElementText) {
                                _yuitest_coverline("exec-command", 508);
range.moveToElementText(elm);
                            }
                            _yuitest_coverline("exec-command", 510);
range.select();
                        }
                    } else {_yuitest_coverline("exec-command", 512);
if (Y.UA.ie) {
                        _yuitest_coverline("exec-command", 513);
par = inst.one(sel._selection.parentElement());
                        _yuitest_coverline("exec-command", 514);
if (par.test('p')) {
                            _yuitest_coverline("exec-command", 515);
if (par && par.hasAttribute(DIR)) {
                                _yuitest_coverline("exec-command", 516);
dir = par.getAttribute(DIR);
                            }
                            _yuitest_coverline("exec-command", 518);
html = Y.EditorSelection.getText(par);
                            _yuitest_coverline("exec-command", 519);
if (html === '') {
                                _yuitest_coverline("exec-command", 520);
var sdir = '';
                                _yuitest_coverline("exec-command", 521);
if (dir) {
                                    _yuitest_coverline("exec-command", 522);
sdir = ' dir="' + dir + '"';
                                }
                                _yuitest_coverline("exec-command", 524);
list = inst.Node.create(Y.Lang.sub('<{tag}{dir}><li></li></{tag}>', { tag: tag, dir: sdir }));
                                _yuitest_coverline("exec-command", 525);
par.replace(list);
                                _yuitest_coverline("exec-command", 526);
sel.selectNode(list.one('li'));
                            } else {
                                _yuitest_coverline("exec-command", 528);
this._command(cmd, null);
                            }
                        } else {
                            _yuitest_coverline("exec-command", 531);
this._command(cmd, null);
                        }
                    } else {
                        _yuitest_coverline("exec-command", 534);
inst.all(tag).addClass(cls);
                        _yuitest_coverline("exec-command", 535);
if (sel.anchorNode.test(inst.EditorSelection.BLOCKS)) {
                            _yuitest_coverline("exec-command", 536);
par = sel.anchorNode;
                        } else {
                            _yuitest_coverline("exec-command", 538);
par = sel.anchorNode.ancestor(inst.EditorSelection.BLOCKS);
                        }
                        _yuitest_coverline("exec-command", 540);
if (!par) { //No parent, find the first block under the anchorNode
                            _yuitest_coverline("exec-command", 541);
par = sel.anchorNode.one(inst.EditorSelection.BLOCKS);
                        }

                        _yuitest_coverline("exec-command", 544);
if (par && par.hasAttribute(DIR)) {
                            _yuitest_coverline("exec-command", 545);
dir = par.getAttribute(DIR);
                        }
                        _yuitest_coverline("exec-command", 547);
if (par && par.test(tag)) {
                            _yuitest_coverline("exec-command", 548);
var hasPParent = par.ancestor('p');
                            _yuitest_coverline("exec-command", 549);
html = inst.Node.create('<div/>');
                            _yuitest_coverline("exec-command", 550);
elm = par.all('li');
                            _yuitest_coverline("exec-command", 551);
elm.each(function(h) {
                                _yuitest_coverfunc("exec-command", "(anonymous 7)", 551);
_yuitest_coverline("exec-command", 552);
html.append(self._wrapContent(h.get('innerHTML'), hasPParent));
                            });
                            _yuitest_coverline("exec-command", 554);
if (dir) {
                                _yuitest_coverline("exec-command", 555);
if (useP) {
                                    _yuitest_coverline("exec-command", 556);
html.all('p').setAttribute(DIR, dir);
                                } else {
                                    _yuitest_coverline("exec-command", 558);
html.setAttribute(DIR, dir);
                                }
                            }
                            _yuitest_coverline("exec-command", 561);
if (useP) {
                                _yuitest_coverline("exec-command", 562);
html = inst.Node.create(html.get('innerHTML'));
                            }
                            _yuitest_coverline("exec-command", 564);
var fc = html.get('firstChild');
                            _yuitest_coverline("exec-command", 565);
par.replace(html);
                            _yuitest_coverline("exec-command", 566);
sel.selectNode(fc);
                        } else {
                            _yuitest_coverline("exec-command", 568);
this._command(cmd, null);
                        }
                        _yuitest_coverline("exec-command", 570);
list = inst.all(tag);
                        _yuitest_coverline("exec-command", 571);
if (dir) {
                            _yuitest_coverline("exec-command", 572);
if (list.size()) {
                                //Changed to a List
                                _yuitest_coverline("exec-command", 574);
list.each(function(n) {
                                    _yuitest_coverfunc("exec-command", "(anonymous 8)", 574);
_yuitest_coverline("exec-command", 575);
if (!n.hasClass(cls)) {
                                        _yuitest_coverline("exec-command", 576);
n.setAttribute(DIR, dir);
                                    }
                                });
                            }
                        }

                        _yuitest_coverline("exec-command", 582);
list.removeClass(cls);
                    }}
                },
                /**
                * Noramlizes alignment for Webkit Browsers
                * @method COMMANDS.justify
                * @static
                * @param {String} cmd The command executed: justify (not used)
                * @param {String} val The actual command from the justify{center,all,left,right} stubs
                */
                justify: function(cmd, val) {
                    _yuitest_coverfunc("exec-command", "justify", 592);
_yuitest_coverline("exec-command", 593);
if (Y.UA.webkit) {
                        _yuitest_coverline("exec-command", 594);
var inst = this.getInstance(),
                            sel = new inst.EditorSelection(),
                            aNode = sel.anchorNode;

                            _yuitest_coverline("exec-command", 598);
var bgColor = aNode.getStyle('backgroundColor');
                            _yuitest_coverline("exec-command", 599);
this._command(val);
                            _yuitest_coverline("exec-command", 600);
sel = new inst.EditorSelection();
                            _yuitest_coverline("exec-command", 601);
if (sel.anchorNode.test('div')) {
                                _yuitest_coverline("exec-command", 602);
var html = '<span>' + sel.anchorNode.get('innerHTML') + '</span>';
                                _yuitest_coverline("exec-command", 603);
sel.anchorNode.set('innerHTML', html);
                                _yuitest_coverline("exec-command", 604);
sel.anchorNode.one('span').setStyle('backgroundColor', bgColor);
                                _yuitest_coverline("exec-command", 605);
sel.selectNode(sel.anchorNode.one('span'));
                            }
                    } else {
                        _yuitest_coverline("exec-command", 608);
this._command(val);
                    }
                },
                /**
                * Override method for COMMANDS.justify
                * @method COMMANDS.justifycenter
                * @static
                */
                justifycenter: function(cmd) {
                    _yuitest_coverfunc("exec-command", "justifycenter", 616);
_yuitest_coverline("exec-command", 617);
this.command('justify', 'justifycenter');
                },
                /**
                * Override method for COMMANDS.justify
                * @method COMMANDS.justifyleft
                * @static
                */
                justifyleft: function(cmd) {
                    _yuitest_coverfunc("exec-command", "justifyleft", 624);
_yuitest_coverline("exec-command", 625);
this.command('justify', 'justifyleft');
                },
                /**
                * Override method for COMMANDS.justify
                * @method COMMANDS.justifyright
                * @static
                */
                justifyright: function(cmd) {
                    _yuitest_coverfunc("exec-command", "justifyright", 632);
_yuitest_coverline("exec-command", 633);
this.command('justify', 'justifyright');
                },
                /**
                * Override method for COMMANDS.justify
                * @method COMMANDS.justifyfull
                * @static
                */
                justifyfull: function(cmd) {
                    _yuitest_coverfunc("exec-command", "justifyfull", 640);
_yuitest_coverline("exec-command", 641);
this.command('justify', 'justifyfull');
                }
            }
        });
        
        /**
        * This method is meant to normalize IE's in ability to exec the proper command on elements with CSS styling.
        * @method fixIETags
        * @protected
        * @param {String} cmd The command to execute
        * @param {String} tag The tag to create
        * @param {String} rule The rule that we are looking for.
        */
        _yuitest_coverline("exec-command", 654);
var fixIETags = function(cmd, tag, rule) {
            _yuitest_coverfunc("exec-command", "fixIETags", 654);
_yuitest_coverline("exec-command", 655);
var inst = this.getInstance(),
                doc = inst.config.doc,
                sel = doc.selection.createRange(),
                o = doc.queryCommandValue(cmd),
                html, reg, m, p, d, s, c;

            _yuitest_coverline("exec-command", 661);
if (o) {
                _yuitest_coverline("exec-command", 662);
html = sel.htmlText;
                _yuitest_coverline("exec-command", 663);
reg = new RegExp(rule, 'g');
                _yuitest_coverline("exec-command", 664);
m = html.match(reg);

                _yuitest_coverline("exec-command", 666);
if (m) {
                    _yuitest_coverline("exec-command", 667);
html = html.replace(rule + ';', '').replace(rule, '');

                    _yuitest_coverline("exec-command", 669);
sel.pasteHTML('<var id="yui-ie-bs">');

                    _yuitest_coverline("exec-command", 671);
p = doc.getElementById('yui-ie-bs');
                    _yuitest_coverline("exec-command", 672);
d = doc.createElement('div');
                    _yuitest_coverline("exec-command", 673);
s = doc.createElement(tag);
                    
                    _yuitest_coverline("exec-command", 675);
d.innerHTML = html;
                    _yuitest_coverline("exec-command", 676);
if (p.parentNode !== inst.config.doc.body) {
                        _yuitest_coverline("exec-command", 677);
p = p.parentNode;
                    }

                    _yuitest_coverline("exec-command", 680);
c = d.childNodes;

                    _yuitest_coverline("exec-command", 682);
p.parentNode.replaceChild(s, p);

                    _yuitest_coverline("exec-command", 684);
Y.each(c, function(f) {
                        _yuitest_coverfunc("exec-command", "(anonymous 9)", 684);
_yuitest_coverline("exec-command", 685);
s.appendChild(f);
                    });
                    _yuitest_coverline("exec-command", 687);
sel.collapse();
                    _yuitest_coverline("exec-command", 688);
if (sel.moveToElementText) {
                        _yuitest_coverline("exec-command", 689);
sel.moveToElementText(s);
                    }
                    _yuitest_coverline("exec-command", 691);
sel.select();
                }
            }
            _yuitest_coverline("exec-command", 694);
this._command(cmd);
        };

        _yuitest_coverline("exec-command", 697);
if (Y.UA.ie) {
            _yuitest_coverline("exec-command", 698);
ExecCommand.COMMANDS.bold = function() {
                _yuitest_coverfunc("exec-command", "bold", 698);
_yuitest_coverline("exec-command", 699);
fixIETags.call(this, 'bold', 'b', 'FONT-WEIGHT: bold');
            };
            _yuitest_coverline("exec-command", 701);
ExecCommand.COMMANDS.italic = function() {
                _yuitest_coverfunc("exec-command", "italic", 701);
_yuitest_coverline("exec-command", 702);
fixIETags.call(this, 'italic', 'i', 'FONT-STYLE: italic');
            };
            _yuitest_coverline("exec-command", 704);
ExecCommand.COMMANDS.underline = function() {
                _yuitest_coverfunc("exec-command", "underline", 704);
_yuitest_coverline("exec-command", 705);
fixIETags.call(this, 'underline', 'u', 'TEXT-DECORATION: underline');
            };
        }

        _yuitest_coverline("exec-command", 709);
Y.namespace('Plugin');
        _yuitest_coverline("exec-command", 710);
Y.Plugin.ExecCommand = ExecCommand;



}, '@VERSION@', {"requires": ["frame"]});
