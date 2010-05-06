YUI.add('sandbox', function (Y) {

var GlobalEnv  = YUI.namespace('Env.Sandbox'),
    Lang       = Y.Lang,
    Node       = Y.Node,
    body       = Y.config.doc.body,
    isFunction = Lang.isFunction,

    YUI_BUILD = '../../build',

Sandbox = function (config) {
    this.id     = Y.guid('sandbox-');
    this.config = Y.merge(this.config, config || {});

    GlobalEnv[this.id] = {
        log: function () { Y.log.apply(this, arguments); }
    };

    this._createIframe();
};

Sandbox.prototype = {
    // -- Public Properties ----------------------------------------------------
    config: {
        bootstrapYUI: true
    },

    // -- Public Methods -------------------------------------------------------
    clearProfile: function () {
        var env = GlobalEnv[this.id];

        delete env.startTime;
        delete env.endTime;
        delete env.profileStop;
    },

    destroy: function () {
        delete GlobalEnv[this.id];

        if (this._iframe && this._iframe.parentNode) {
            this._iframe.parentNode.removeChild(this._iframe);
        }
    },

    getEnvValue: function (key) {
        return GlobalEnv[this.id][key];
    },

    profile: function (script) {
        var env       = GlobalEnv[this.id],
            iframeWin = this._iframe.contentWindow,
            run       = env.run;

        // if (!env.loaded) {
        //     setTimeout(Y.bind(function () {
        //         this.profile.call(this, script);
        //     }, this), 15);
        // 
        //     return;
        // }

        this.clearProfile();

        script = this._getProfiledScript(script);
        return run.call(iframeWin, script);
    },

    run: function (script) {
        var env = GlobalEnv[this.id];

        // if (!env.loaded) {
        //     setTimeout(Y.bind(function () {
        //         this.run.call(this, script);
        //     }, this), 15);
        // 
        //     return;
        // }

        return env.run.call(this._iframe.contentWindow, this._getScript(script));
    },

    setEnvValue: function (key, value) {
        if (key === 'loaded' || key === 'run') {
            // These keys are off limits.
            return undefined;
        }

        return GlobalEnv[this.id][key] = value;
    },

    // -- Protected Methods ----------------------------------------------------
    _createIframe: function () {
        var iframe    = body.appendChild(Node.getDOMNode(Node.create('<iframe id="' + this.id + '" style="display:none"/>'))),
            iframeDoc = iframe.contentWindow.document;

        // Based on a technique described by Dean Edwards:
        // http://dean.edwards.name/weblog/2006/11/sandbox/
        iframeDoc.write(
            '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
                '<title>' + this.id + '</title>' +
            '</head>' +
            '<body>' +
                '<script>' +
                    'var sandbox = parent.YUI.Env.Sandbox["' + this.id + '"];' +
                    'sandbox.run = function (script) { return window.eval(script); };' +
                '<\/script>'
        );

        if (this.config.bootstrapYUI) {
            iframeDoc.write(
                '<script src="' + YUI_BUILD + '/yui/yui-min.js"><\/script>' +
                '<script src="' + YUI_BUILD + '/loader/loader-min.js"><\/script>'
            );
        }

        iframeDoc.write(
                '<script>sandbox.loaded = true;</script>' + // needed for Firefox
            '</body>' +
            '</html>'
        );

        // Allows window.onload to fire.
        iframeDoc.close();

        this._iframe = iframe;
    },

    _getProfiledScript: function (script) {
        return 'profileStop = function () { sandbox.endTime = new Date().getTime(); };' +
               'sandbox.startTime=new Date().getTime();' +
               this._getScript(script);
    },

    _getScript: function (script) {
        return isFunction(script) ? '(' + script.toString() + '());' : script;
    }
};

Y.Sandbox = Sandbox;

}, '@VERSION@', {requires: ['node']});
