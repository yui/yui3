YUI.add('exec-command', function(Y) {

        var ExecCommand = function() {
            ExecCommand.superclass.constructor.apply(this, arguments);
        };

        Y.extend(ExecCommand, Y.Base, {
            _inst: null,
            command: function(action, value) {
                var host = this.get('host'),
                    fn = ExecCommand.COMMANDS[action];

                Y.log('execCommand(' + action + '): "' + value + '"', 'info', 'exec-command');
                if (fn) {
                    return fn.call(this, action, value);
                } else {
                    return this._command(action, value);
                }
            },
            _command: function(action, value) {
                var inst = this.get('host').getInstance();
                try {
                    inst.config.doc.execCommand(action, false, value);
                } catch (e) {
                    Y.log(e.message, 'error', 'exec-command');
                }
            },
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
            NAME: 'exec-command',
            NS: 'exec',
            ATTRS: {
                host: {
                    value: false
                }
            },
            COMMANDS: {
                wrap: function(cmd, tag) {
                    var inst = this.getInstance();
                    return (new inst.Selection()).wrapContent(tag);
                },
                inserthtml: function(cmd, html) {
                    var inst = this.getInstance();
                    return (new inst.Selection()).insertContent(html);
                },
                insertimage: function(cmd, img) {
                    return this.command('inserthtml', '<img src="' + img + '">');
                },
                addclass: function(cmd, cls) {
                    var inst = this.getInstance();
                    return (new inst.Selection).getSelected().addClass(cls);
                },
                removeclass: function(cmd, cls) {
                    var inst = this.getInstance();
                    return (new inst.Selection).getSelected().removeClass(cls);
                }
            }
        });
        Y.namespace('Plugin');
        Y.Plugin.ExecCommand = ExecCommand;



}, '@VERSION@', { requires: [ 'frame' ], skinnable: false });
