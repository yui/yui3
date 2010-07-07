
    /**
     * Plugin for the frame module to handle execCommands for Editor
     * @module editor
     * @submodule exec-command
     */     
    /**
     * Plugin for the frame module to handle execCommands for Editor
     * @class ExecCommand
     * @extends Base
     * @constructor
     * @namespace Plugin
     */
        var ExecCommand = function() {
            ExecCommand.superclass.constructor.apply(this, arguments);
        };

        Y.extend(ExecCommand, Y.Base, {
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
                var fn = ExecCommand.COMMANDS[action];

                Y.log('execCommand(' + action + '): "' + value + '"', 'info', 'exec-command');
                if (fn) {
                    return fn.call(this, action, value);
                } else {
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
                var inst = this.getInstance();
                try {
                    Y.log('Internal execCommand(' + action + '): "' + value + '"', 'info', 'exec-command');
                    inst.config.doc.execCommand(action, false, value);
                } catch (e) {
                    Y.log(e.message, 'error', 'exec-command');
                }
            },
            /**
            * Get's the instance of YUI bound to the parent frame
            * @method getInstance
            * @return {YUI} The YUI instance bound to the parent frame
            */
            getInstance: function() {
                if (!this._inst) {
                    this._inst = this.get('host').getInstance();
                }
                return this._inst;
            },
            initializer: function() {
                Y.mix(this.get('host'), {
                    execCommand: function(action, value) {
                        return this.exec.command(action, value);
                    },
                    _execCommand: function(action, value) {
                        return this.exec._command(action, value);
                    }
                });
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
                    var inst = this.getInstance();
                    return (new inst.Selection()).wrapContent(tag);
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
                    var inst = this.getInstance();
                    return (new inst.Selection()).insertContent(html);
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
                    var inst = this.getInstance();
                    return (new inst.Selection()).getSelected().addClass(cls);
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
                    var inst = this.getInstance();
                    return (new inst.Selection()).getSelected().removeClass(cls);
                },
                bidi: function() {
                    var inst = this.getInstance(),
                        sel = new inst.Selection(),
                        blockItem, dir,
                        blocks = 'p,div,li,body'; //More??

                    if (sel.anchorNode) {
                        blockItem = sel.anchorNode;
                        if (!sel.anchorNode.test(blocks)) {
                            blockItem = sel.anchorNode.ancestor(blocks);
                        }
                        dir = blockItem.getAttribute('dir');
                        if (dir === '') {
                            dir = inst.one('html').getAttribute('dir');
                        }
                        if (dir === 'rtl') {
                            dir = 'ltr';
                        } else {
                            dir = 'rtl';
                        }
                        blockItem.setAttribute('dir', dir);
                    }
                    return blockItem;
                },
                backcolor: function(cmd, val) {
                    var inst = this.getInstance(),
                        sel = new inst.Selection(), n;

                    if (Y.UA.gecko || Y.UA.opera) {
                        cmd = 'hilitecolor';
                    }
                    if (!Y.UA.ie) {
                        this._command('styleWithCSS', 'true');
                    }
                    if (sel.isCollapsed) {
                        n = this.command('inserthtml', '<span style="background-color: ' + val + '"><span>&nbsp;</span>&nbsp;</span>');
                        inst.Selection.filterBlocks();
                        sel.selectNode(n.get('firstChild'));
                        return n;
                    } else {
                        return this._command(cmd, val);
                    }
                    if (!Y.UA.ie) {
                        this._command('styleWithCSS', false);
                    }
                },
                hilitecolor: function() {
                    ExecCommand.COMMANDS.backcolor.apply(this, arguments);
                },
                fontname: function(cmd, val) {
                    var inst = this.getInstance(),
                        sel = new inst.Selection(), n;

                    if (sel.isCollapsed) {
                        n = this.command('inserthtml', '<span style="font-family: ' + val + '">&nbsp;</span>');
                        sel.selectNode(n.get('firstChild'));
                        return n;
                    } else {
                        return this._command('fontname', val);
                    }
                },
                fontsize: function(cmd, val) {
                    var inst = this.getInstance(),
                        sel = new inst.Selection(), n;

                    if (sel.isCollapsed) {
                        n = this.command('inserthtml', '<font size="' + val + '">&nbsp;</font>');
                        sel.selectNode(n.get('firstChild'));
                        return n;
                    } else {
                        return this._command('fontsize', val);
                    }
                }
            }
        });

        Y.namespace('Plugin');
        Y.Plugin.ExecCommand = ExecCommand;

