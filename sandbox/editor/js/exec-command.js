YUI.add('exec-command', function(Y) {

        var ExecCommand = function() {
            ExecCommand.superclass.constructor.apply(this, arguments);
        };

        Y.extend(ExecCommand, Y.Base, {
            _defExecFn: function(e) {
                var action = e.action,
                    value = e.value,
                    host = this.get('host'),
                    inst = host.getInstance(),
                    fn = ExecCommand[action];

                //console.log('execCommand: ', action, value);
                if (fn) {
                    fn.call(this, action, value);  
                } else {
                    try {
                        inst.config.doc.execCommand(action, '', value);
                    } catch (e) {
                        Y.Throw(e);
                    }
                }
            },
            command: function(action, value) {
                this.fire('command', { action: action, value: value });
            },
            initializer: function() {
                Y.mix(this.get('host'), {
                    execCommand: function(action, value) {
                        this.exec.fire('command', { value: value, action: action });
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
            COMMANDS: {
            }
        });
        Y.namespace('Plugin');
        Y.Plugin.ExecCommand = ExecCommand;



}, '@VERSION@', { requires: [ 'frame' ], skinnable: false });
