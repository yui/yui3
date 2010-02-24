YUI.add('exec-command', function(Y) {

        var ExecCommand = function() {
            ExecCommand.superclass.constructor.apply(this, arguments);
        };

        Y.extend(ExecCommand, Y.Base, {
            _defExecFn: function(e) {
                var action = e.action,
                    value = e.value,
                    host = this.get('host'),
                    fn = ExecCommand.COMMANDS[action];

                //console.log('execCommand: ', action, value);
                if (fn) {
                    fn.call(this, action, value);  
                } else {
                    this._execCommand(action, value);
                }
            },
            _execCommand: function(action, value) {
                var inst = this.get('host').getInstance();
                try {
                    inst.config.doc.execCommand(action, false, value);
                } catch (e) {
                    console.log(e.message);
                }
            },
            getInstance: function() {
                return this.get('host').getInstance();
            },
            command: function(action, value) {
                this.fire('command', { action: action, value: value });
            },
            initializer: function() {
                Y.mix(this.get('host'), {
                    execCommand: function(action, value) {
                        this.exec.fire('command', { value: value, action: action });
                    },
                    _execCommand: function(action, value) {
                        this.exec._execCommand(action, value);
                    }
                });

                this.publish('command', {
                    defaultFn: this._defExecFn,
                    queuable: false,
                    emitFacade: true,
                    bubbles: true,
                    prefix: 'exec'
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
            COMMANDS: {}
        });
        Y.namespace('Plugin');
        Y.Plugin.ExecCommand = ExecCommand;



}, '@VERSION@', { requires: [ 'frame' ], skinnable: false });
