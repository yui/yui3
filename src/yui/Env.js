
(function() {

    var M = function(Y) {

        /**
         * YAHOO.env is used to keep track of what is known about the YUI library and
         * the browsing environment
         * @class YAHOO.env
         * @static
         */
        Y.env = Y.env || {

            /**
             * Keeps the version info for all YUI modules that have reported themselves
             * @property modules
             * @type Object[]
             */
            modules: [],
            
            /**
             * List of functions that should be executed every time a YUI module
             * reports itself.
             * @property listeners
             * @type Function[]
             */
            listeners: []
        };

        /**
         * Returns the version data for the specified module:
         *      <dl>
         *      <dt>name:</dt>      <dd>The name of the module</dd>
         *      <dt>version:</dt>   <dd>The version in use</dd>
         *      <dt>build:</dt>     <dd>The build number in use</dd>
         *      <dt>versions:</dt>  <dd>All versions that were registered</dd>
         *      <dt>builds:</dt>    <dd>All builds that were registered.</dd>
         *      <dt>mainClass:</dt> <dd>An object that was was stamped with the
         *                 current version and build. If 
         *                 mainClass.VERSION != version or mainClass.BUILD != build,
         *                 multiple versions of pieces of the library have been
         *                 loaded, potentially causing issues.</dd>
         *       </dl>
         *
         * @method getVersion
         * @static
         * @param {String}  name the name of the module (event, slider, etc)
         * @return {Object} The version info
         */
        Y.env.getVersion = function(name) {
            return Y.env.modules[name] || null;
        };

    };

    // Register the module with the global YUI object
    YUI.add("env", null , M, "3.0.0");
    YUI.use("env"); // core 


    /*
     * Initializes the global by creating the default namespaces and applying
     * any new configuration information that is detected.  This is the setup
     * for env.
     * @method init
     * @static
     * @private
     */
    YUI.namespace("util", "widget", "example");
    if ("undefined" !== typeof YAHOO_config) {
        var l=YAHOO_config.listener,ls=YUI.env.listeners,unique=true,i;
        if (l) {
            // if YAHOO is loaded multiple times we need to check to see if
            // this is a new config object.  If it is, add the new component
            // load listener to the stack
            for (i=0;i<ls.length;i=i+1) {
                if (ls[i]==l) {
                    unique=false;
                    break;
                }
            }
            if (unique) {
                ls.push(l);
            }
        }
    }

})();

