YUI.add('createlink-base', function(Y) {
    /**
     * Addes prompt style link creation.
     * @module editor
     * @submodule createlink-base
     */     
    /**
     * Addes prompt style link creation.
     * @class CreateLinkBase
     * @static
     * @constructor
     */
    
    var CreateLinkBase = {};
    CreateLinkBase.STRINGS = {
            PROMPT: 'Please enter the URL for the link to point to:',
            DEFAULT: 'http://'
    };

    Y.namespace('Plugin');
    Y.Plugin.CreateLinkBase = CreateLinkBase;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
        createlink: function(cmd) {
            var inst = this.get('host').getInstance(), out, a,
                url = prompt(CreateLinkBase.STRINGS.PROMPT, CreateLinkBase.STRINGS.DEFAULT);

            if (url) {
                Y.log('Adding link: ' + url, 'info', 'createLinkBase');
                this.get('host')._execCommand(cmd, url);
                out = (new inst.Selection()).getSelected();
                a = out.item(0).one('a');
                out.item(0).replace(a);
            }
            return a;
        }
    });

});
