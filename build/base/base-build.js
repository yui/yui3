YUI.add('base-build', function(Y) {

    /**
     * The base-build submodule provides Base.build functionality, which
     * can be used to create custom classes, by aggregating extensions onto 
     * a main class.
     *
     * @module base
     * @submodule base-build
     * @for Base
     */

    var Base = Y.Base,
        L = Y.Lang,

        mergeAttrs = function(m, e) {
            if (!m.ATTRS && e.ATTRS) {
                m.ATTRS = {};
            }

            if (e.ATTRS) {
                Y.aggregate(m.ATTRS, e.ATTRS, true);
            }
        };

    /**
     * The build configuration for the Base class.
     *
     * Defines the static fields which need to be aggregated
     * when the Base class is used as the main class passed to 
     * the <a href="#method_Base.build">Base.build</a> method.
     *
     * @property Base._buildCfg
     * @type Object
     * @static
     * @final
     * @private
     */
    Base._buildCfg = {
        // TODO: The name "custBuild" may change, not ready for public use.
        custBuild : mergeAttrs,
        aggregates : ["_PLUG", "_UNPLUG"]
    };

    /**
     * <p>
     * Builds a custom constructor function (class) from the
     * main function, and array of extension functions (classes)
     * provided. The NAME field for the constructor function is 
     * defined by the first argument passed in.
     * </p>
     * <p>
     * The cfg object supports the following properties
     * </p>
     * <dl>
     *    <dt>dynamic &#60;boolean&#62;</dt>
     *    <dd>
     *    <p>If true (default), a completely new class
     *    is created which extends the main class, and acts as the 
     *    host on which the extension classes are augmented.</p>
     *    <p>If false, the extensions classes are augmented directly to
     *    the main class, modifying the main class' prototype.</p>
     *    </dd>
     *    <dt>aggregates &#60;String[]&#62;</dt>
     *    <dd>An array of static property names, which will get aggregated
     *    on to the built class, in addition to the default properties build 
     *    will always aggregate as defined by the main class' static _buildCfg
     *    property.
     *    </dd>
     * </dl>
     *
     * @method Base.build
     * @static
     * @param {Function} name The name of the new class. Used to defined the NAME property for the new class.
     * @param {Function} main The main class on which to base the built class
     * @param {Function[]} extensions The set of extension classes which will be
     * augmented/aggregated to the built class.
     * @param {Object} cfg Optional. Build configuration for the class (see description).
     * @return {Function} A custom class, created from the provided main and extension classes
     */
    Base.build = function(name, main, extensions, cfg) {

        var build = Base.build,
            builtClass = build._getClass(main, cfg),
            buildCfg = build._getBuildCfg(main, cfg),
            aggregates = buildCfg.aggregates,
            custBuildSteps = buildCfg.custBuild,
            dynamic = builtClass._yuibuild.dynamic,
            i, l, j, val, extClass;

        // Shallow isolate aggregates
        if (dynamic && aggregates) {
            if (aggregates) {
                for (i = 0, l = aggregates.length; i < l; ++i) {
                    val = aggregates[i];
                    if (main.hasOwnProperty(val)) {
                        builtClass[val] = L.isArray(main[val]) ? [] : {};
                    }
                }
                Y.aggregate(builtClass, main, true, aggregates);
            }
        }

        // Augment/Aggregate
        for (i = 0, l = extensions.length; i < l; i++) {
            extClass = extensions[i];

            if (aggregates) {
                Y.aggregate(builtClass, extClass, true, aggregates);
            }

            if (custBuildSteps) {
                for (j = 0; j < custBuildSteps.length; j++) {
                    custBuildSteps[j](builtClass, extClass);
                }
            }

            // Old non-displacing augment
            Y.mix(builtClass, extClass, true, null, 1);

            builtClass._yuibuild.exts.push(extClass);
        }

        builtClass.prototype.hasImpl = build._hasImpl;

        if (dynamic) {
            builtClass.NAME = name;
            builtClass.prototype.constructor = builtClass;
        }

        return builtClass;
    };

    Y.mix(Base.build, {

        _template: function(main) {

            function BuiltClass() {
                BuiltClass.superclass.constructor.apply(this, arguments);
                return this;
            }
            Y.extend(BuiltClass, main);

            return BuiltClass;
        },

        _hasImpl : function(extClass) {
            var classes = this._getClasses();
            for (var i = 0, l = classes.length; i < l; i++) {
                var cls = classes[i];
                 
                if (cls._yuibuild) {
                    var exts = cls._yuibuild.exts,
                        ll = exts.length,
                        j;
    
                    for (j = 0; j < ll; j++) {
                        if (exts[j] === extClass) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        _getClass : function(main, cfg) {

           var dynamic = (cfg && false === cfg.dynamic) ? false : true,
                builtClass = (dynamic) ? Base.build._template(main) : main;

            builtClass._yuibuild = {
                id: null,
                exts : [],
                dynamic : dynamic
            };

            return builtClass;
        },
        
        _getBuildCfg : function(main, cfg) {
            var aggr = [], 
                steps = [],
                buildCfg,
                cfgAggr = (cfg && cfg.aggregates),
                cfgCustBuild = (cfg && cfg.custBuild),
                c = main;

            while (c && c.prototype) {
                buildCfg = c._buildCfg; 
                if (buildCfg) {
                    if (buildCfg.aggregates) {
                        aggr = aggr.concat(buildCfg.aggregates);
                    }
                    if (buildCfg.custBuild) {
                        steps.push(buildCfg.custBuild);
                    }
                }
                c = c.superclass ? c.superclass.constructor : null;
            }

            if (cfgAggr) {
                aggr = aggr.concat(cfgAggr);
            }
            if (cfgCustBuild) {
                steps.push(cfg.cfgBuild);
            }

            return {
                aggregates: aggr,
                custBuild: steps
            };
        }
    });


}, '@VERSION@' ,{requires:['base-base']});
