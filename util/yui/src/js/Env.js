
(function() {

    var M = function(Y) {

        /**
         * Y.Env is used to keep track of what is known about the YUI library and
         * the browsing environment
         * @class env
         * @static
         */
        Y.Env = Y.Env || {

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
        Y.Env.getVersion = function(name) {
            return Y.Env.modules[name] || null;
        };

    };

    // Register the module with the global YUI object
    YUI.add("env", null , M, "3.0.0");

})();

