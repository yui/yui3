YUI.add('rls', function(Y) {

/**
 * Implentation for building the remote loader service url.
 * @method _rls
 * @param what {Array} the requested modules
 * @since 3.2.0
 */
Y._rls = function(what) {
    var config = Y.config,

        // the configuration
        rls = config.rls || {
            m:    1, // must have
            v:    Y.version,
            gv:   config.gallery,
            env:  1, // must have
            lang: config.lang,
            '2in3v':  config['2in3'],
            '2v': config.yui2,
            filt: config.filter,
            filts: config.filters,
            caps: ''
        },

        // The rls base path
        rls_base = config.rls_base || 'load?',

        // the template
        rls_tmpl = config.rls_tmpl || function() {
            var s = '', param;
            for (param in rls) {
                if (param in rls && rls[param]) {
                    s += param + '={' + param + '}&';
                }
            }
            // console.log('rls_tmpl: ' + s);
            return s;
        }(), 
        
        url;

    // update the request
    rls.m = what;
    rls.env = Y.Object.keys(YUI.Env.mods);

    url = Y.Lang.sub(rls_base + rls_tmpl, rls);

    config.rls = rls;
    config.rls_tmpl = rls_tmpl;

    // console.log(url);
    return url;
};



}, '@VERSION@' ,{requires:['yui-base','get']});
