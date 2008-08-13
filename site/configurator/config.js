(function() {

    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Sel = YAHOO.util.Selector,
        Lang = YAHOO.lang,

        chart = null,
        tabView = null,

        current = {
            initialLoad : true,
            required : [],
            sizes : [],
            selected : {},
            filter : 'min',
            rollup : true,
            combo : true,
            optional : true,
            base: ""
        },

        modInfoEl = Dom.get('modInfo'), 
        jsModsEl = Dom.get('jsMods'), 
        cssModsEl = Dom.get('cssMods'), 
        subModsEl = Dom.get('subMods'), 

        modDescEl = Dom.get('modDesc'), 
        modDescHdEl = Sel.query('#modDesc .hd')[0], 
        modDescBdEl = Sel.query('#modDesc .bd')[0], 

        configEl = Dom.get('config'), 
        comboEl = Dom.get('combo'), 
        fileTypeEl = Dom.get('fileType'),
        rollupEl = Dom.get('rollup'),
        optionalEl = Dom.get('optional'), 
        baseEl = Dom.get('base'),
        
        outputEl = Dom.get('loaderOutput'),
        resourcesEl = Dom.get('resources'),
        chartEl = Dom.get('chart'),
        legendEl = Dom.get('legend'),
        totalEl = Sel.query('#weight .hd')[0],
        totalWeightEl = Dom.get("finalWeight"),
        subModsHeaderEl = Sel.query('#subModPanel .hd')[0],

        GB = 1024 * 1024 * 1024,
        MB = 1024 * 1024;

    var Y = YUI();

    var outputAnim = new YAHOO.util.ColorAnim(outputEl, 
        {backgroundColor: {from: '#edff9f', to: '#fff' }}, 1.5, YAHOO.util.Easing.easeIn
    );

    function prettySize(size) {
        if (size > GB) {
            mysize = Math.round(size / GB) + " GB";
        } else if (size > MB) {
            mysize = Math.round(size / MB) + " MB";
        } else if ( size >= 1024 ) {
            mysize = Math.round(size / 1024) + " Kb";
        } else {
            mysize = size + " bytes";
        }
        return mysize;
    };

    function getIncludes(loader) {

        var s = loader.sorted, l = s.length, m, url, out = [], combourl = [], i, cssPushed = false, jsPushed = false;

        if (l) {
            for (i=0; i < l; i++)  {
                m = loader.moduleInfo[s[i]];
                if (m.type == 'css') {
                    
                    if (!cssPushed) {
                        out.push('<!-- CSS -->');
                        cssPushed = true;
                    }

                    url = m.fullpath || loader._url(m.path);
                    out.push('<link rel="stylesheet" type="text/css" href="' + url + '">');
                }
            }

            for (i=0; i <l; i=i+1)  {
                m = loader.moduleInfo[s[i]];
                if (m.type == 'js') {

                    if (!jsPushed) {
                        out.push('<!-- JS -->');
                        jsPushed = true;
                    }

                    if(comboEl.checked) {
                        var filter = loader.FILTERS[current.filter.toUpperCase()];
                        var filteredPath = (filter) ? m.path.replace(new RegExp(filter.searchExp), filter.replaceStr) : m.path; 
                        combourl.push(loader.root + filteredPath);
                    } else {
                        url = m.fullpath || loader._url(m.path);
                        out.push('<script type="text/javascript" src="' + url + '"></scr' + 'ipt>');                        
                    }
                }
            }

            if(comboEl.checked && combourl.length) {
                var src = loader.comboBase + combourl.join("&");
                out.push('<script type="text/javascript" src="' + src + '"></scr' + 'ipt>');
            }
        }

        return out;
    }

    function load() {

        var mods = [], hackYuiRollup = false;

        /* Loader Hacks */

        // Rollup yui if yui-base, get and loader selected
        if (current.rollup 
            && current.selected["yui-base"] 
            && current.selected["get"] 
            && current.selected["loader"] 
            && !current.selected["yui"]) {
           hackYuiRollup = true;
           mods[mods.length] = "yui";
        }

        // Make sure either yui or yui-base are included
        if (mods.length == 0 && !current.selected["yui-base"] && !current.selected["yui"]) {
            mods[mods.length] = "yui-base";
        }

        // Make sure yui, yui-base are added first, with yui superceding yui-base
        if (mods.length == 0 && (current.selected["yui-base"] || current.selected["yui"])) {
            if (current.selected["yui"]) {
                mods[mods.length] = "yui";
            } else {
                mods[mods.length] = "yui-base";
            }
        }

        for (var i in current.selected) {
            if (Lang.hasOwnProperty(current.selected, i)) {
                if (i != "yui" && i != "yui-base" && 
                        !(hackYuiRollup && (i == "get" || i == "loader" || i == "yui-base"))) {
                    mods[mods.length] = i;
                }
            }
        }

        var loader = new Y.Loader({
            require: mods,
            force: mods,

            allowRollup: current.rollup, 
            filter: current.filter,
            loadOptional: current.optional,

            combo: current.combo
        });

        if (current.base != "") {
            loader.base = current.base;
        }

        loader.calculate();

        var s = loader.sorted, l = s.length, m, url, out = [], combo = [];

        current.required = toModuleHash(loader.sorted);
        current.sizes = toSizeArray(loader.sorted);

        showResults(loader);

        current.initialLoad = false;
    }

    function toModuleHash(modList) {
        var req = {}, mod;
        if (modList) {
            for (var i = 0; i < modList.length; i++) {
                mod = modList[i];
                if (configData[mod]) {
                    req[mod] = true;
                }
            }
        }
        return req;
    }

    function toSizeArray(modList) {
        var sizes = [];

        for (var i = 0; i < modList.length; i++) {
            var cfg = configData[modList[i]];
            if (cfg) {
                sizes[sizes.length] = { 
                    name: cfg.info.name, 
                    size: cfg.sizes[current.filter]
                };
            }
        }

        sizes.sort(function(a,b) {
            if (!("size" in a && "size" in b)) {
                return 0;
            } else {
                return (b.size - a.size);
            }
        });

        return sizes;
    }

    function showResults(loader) {
        updateResourceUI(getIncludes(loader));
        updateWeightUI(current.sizes);
    }

    function updateSizeUI() {
        var sizeEls = Dom.getElementsByClassName("size", "span", modInfoEl), name, el;
        for (var i = 0, l = sizeEls.length; i < l; i++) {
           el = sizeEls[i];
           name = el.id.replace("size_", "");
           el.innerHTML = "(" + prettySize(configData[name].sizes[current.filter]) + ")";
        }
    }

    function updateChartUI(sizes) {

        var data = new YAHOO.util.DataSource(sizes);
        data.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        data.responseSchema = { fields: [ "name", "size" ] };
       
        YAHOO.widget.Chart.SWFURL = "http:/"+"/yui.yahooapis.com/2.5.2/build/charts/assets/charts.swf";

        // Unfortunately, resetting pie chart data set is buggy
        chart = new YAHOO.widget.PieChart( "chart", data, {
                dataField: "size",
                categoryField: "name",
                style: {
                    padding: 5, 
                    legend: {
                        display:"bottom"
                    }
                }
        });
    };

    function updateResourceUI(buffer) {
        outputEl.value = buffer.join('\n');
        if (!current.initialLoad) {
            outputAnim.stop();
            outputAnim.animate();
        }
    }

    function updateWeightUI(sizes) {
        var total = 0, prettyTotal;
        for (var i = 0; i < sizes.length; i++) {
            total += sizes[i].size;
        }

        var prettyTotal = prettySize(total);
        totalEl.innerHTML = 'Total Weight: ' + prettyTotal + ' <span class="yui-' + current.filter + '">(' + current.filter + ')</span>';
        totalWeightEl.innerHTML = ' - Total Weight: ' + prettyTotal + ' <span class="yui-' + current.filter + '">(' + current.filter + ')</span>';

        var weightTab = tabView.get("tabs")[1];
        weightTab.set("label", "Page Weight Analysis - " + prettyTotal + "");

        if (YAHOO.env.ua.gecko) {
            var tabEl = weightTab.get("element");
            if (tabEl) {
                Dom.addClass(tabEl, "yui-force-redraw");
                setTimeout(function() {
                    Dom.removeClass(tabEl, "yui-force-redraw");
                }, 100);
            }
        }
    }

    function handleModuleSelection(name, stateChange) {
        var cfg = configData[name];
        if (cfg) {
 
            if (stateChange != undefined) {
                if (stateChange) {
                    current.selected[name] = true;
                } else {
                    delete current.selected[name];
                }
            }

            if(cfg.isSubMod) {
                updateStateFromSubModule(name, cfg, stateChange);
            } else {
                updateStateFromModule(name, cfg, stateChange);
            }

            if (stateChange !== undefined) {
                load();
            }
        }
    }

    function updateStateFromSubModule(name, cfg, stateChange) {
        if (stateChange !== undefined && !stateChange) {

            var parentName = cfg.module,
                parentCfg = configData[parentName],
                submodules = parentCfg.submodules,
                submodCfg;

            for (var sm in submodules) {
                submodCfg = configData[sm];
                if (submodCfg) {
                    if(submodCfg._selectionEl.get("checked")) {
                        current.selected[sm] = true;
                    } else {
                        if (current.selected[sm]) {
                            delete current.selected[sm];
                        }
                    }
                }
            }

            parentCfg._selectionEl.set("checked", false);
            delete current.selected[parentName];
        }
    }

    function updateStateFromModule(name, cfg, stateChange) {
 
        subModsHeaderEl.innerHTML = "Sub Modules: " + name;

        var recreate = (!current.subModulesDisplayed || current.subModulesDisplayed != name);

        current.subModulesDisplayed = name;

        if (cfg.submodules) {
            var submods = cfg.submodules;

            if (recreate) {
                Event.purgeElement(subModsEl, true);
                subModsEl.innerHTML = "";
            }

            for (var submod in submods) {
                var submodcfg = configData[submod];
                if (submodcfg) {
                    var isChecked = (stateChange === undefined && (current.selected[submod] || current.selected[name]) || stateChange);

                    if (recreate) {
                        var li = document.createElement('li');
                        li.id = "mod_" + submod;
                        li.className = "modentry";

                        subModsEl.appendChild(li);
     
                        createModuleSelectionElement(submod, submodcfg, li);
                        createSizeElement(submodcfg, li);
                    }

                    submodcfg._selectionEl.set("checked", isChecked);

                    if (stateChange !== undefined) {
                        if (isChecked) {
                            current.selected[submod] = true;
                        } else {
                            delete current.selected[submod];
                        }
                    }

                    submodcfg.module = name;
                }
            }
        } else {
            subModsEl.innerHTML = "<li>&quot;" + name  + "&quot; does not have any sub modules.</li>";
        }
    }

    function bindFormElements() {

        comboEl.checked = current.combo;
        optionalEl.checked = current.optional;
        rollupEl.checked = current.rollup;
        fileTypeEl.value = current.filter;
        baseEl.value = current.base;

        if (current.combo) {
            baseEl.disabled = true;
        }

        Event.on("modPanel", 'click', function(e) {
            var t = Event.getTarget(e), name;
            if (t.id.indexOf("mod_") !== -1) {
                name = t.id.replace('mod_', '');
                handleModuleSelection(name);
            }
        });

        Event.on("loaderOutput", 'focus', function(e) {
            try {
                this.select();
            } catch(e) {
                // ignore
            }
        });

        Event.on(modInfoEl, 'mouseover', function(e) {
            var t = Event.getTarget(e), name, desc, cfg, className;

            t = Dom.hasClass(t, "modentry") ? t : Dom.getAncestorByClassName(t, "modentry");
            if (t) {
                name = t.id.replace('mod_', '');
                cfg = configData[name];

                Dom.addClass(t, "yui-hover");
 
                desc = configData[name].info.desc;
                if (desc) {
                    modDescHdEl.innerHTML = name;
                    modDescBdEl.innerHTML = desc;
                    Dom.removeClass(modDescEl, "yui-hidden");
                }
            }
        });

        Event.on(modInfoEl, 'mouseout', function(e) {
            var t = Event.getTarget(e), name, cfg, className;

            t = Dom.hasClass(t, "modentry") ? t : Dom.getAncestorByClassName(t, "modentry");
            if (t) {
                name = t.id.replace('mod_', '');
                cfg = configData[name];

                Dom.removeClass(t, "yui-hover");

                modDescHdEl.innerHTML = "";
                modDescBdEl.innerHTML = "";
                Dom.addClass(modDescEl, "yui-hidden");
            }
        });

        Event.on(fileTypeEl, 'change', function() {
            current.filter = this.options[this.selectedIndex].value;
            updateSizeUI();
            load();
        });

        Event.on(baseEl, 'change', function() {
            current.base = YAHOO.lang.trim(this.value);
            load();
        });

        Event.on(comboEl, 'click', function() {
            current.combo = this.checked;
            baseEl.disabled = this.checked;
            load();
        });

        Event.on(rollupEl, 'click', function() {
            current.rollup = this.checked;
            load();
        });

        Event.on(optionalEl, 'click', function() {
            current.optional = this.checked;
            load();
        });
    }

    function createModuleSelectionElement(name, cfg, parent) {
            if (cfg._selectionEl) {
                cfg._selectionEl.destroy();
            }

            var btn = new YAHOO.widget.Button({
                type: "checkbox",
                label: name,
                id: "check_" + name,
                value: name,
                container: parent,
                checked: (!!current.selected[name]),
                onclick: {
                    fn: function() {
                        handleModuleSelection(name, this.get("checked"));
                    }
                }
            });

            cfg._selectionEl = btn;
            btn._moduleName = name;
    }

    function createSizeElement(cfg, parent) {
        var s = document.createElement("span");
        var size = cfg.sizes[current.filter]; 

        s.className = "size";
        s.id = "size_" + cfg.info.name;
        parent.appendChild(s);

        s.innerHTML = '(' + prettySize(size) + ')';
    }

    function hackYuiConfigData() {

        var yuiCfg = configData["yui"];

        hackSubModule(yuiCfg, configData["yui-base"]);
        hackSubModule(yuiCfg, configData["get"]);
        hackSubModule(yuiCfg, configData["loader"]);
    }

    function hackSubModule(moduleCfg, submoduleCfg) {
        if (moduleCfg && submoduleCfg) {
           submoduleCfg.isSubMod = true;
           if (!moduleCfg.submodules) {
               moduleCfg.submodules = {};
           }
           moduleCfg.submodules[submoduleCfg.info.name] = submoduleCfg;
        }
    }

    function addModules() {

        var js = [], css = [], i, li, cfg, name, className;

        for (name in configData) {
            if (Lang.hasOwnProperty(configData, name)) {
                cfg = configData[name];
                if (cfg.type == 'js' && !cfg.isSubMod && name !== 'yui') {
                    js.push(name);
                }

                if (cfg.type == 'css') {
                    css.push(name);
                }
            }
        }

        js.sort();
        js.splice(0, 0, 'yui');

        for (i=0; i < js.length; i++) {

            name = js[i];
            cfg = configData[name];

            li = document.createElement('li');
            li.id = "mod_" + name;
            className = "modentry";
            if (cfg.submodules) {
                className += " hasSubModules";
            }
            li.className = className;

            jsModsEl.appendChild(li);

            createModuleSelectionElement(name, cfg, li);
            createSizeElement(cfg, li);
        }

        css.sort();

        for (i=0; i < css.length; i++) {

            name = css[i];
            cfg = configData[name];

            li = document.createElement('li');
            li.id = "mod_" + name;

            className = "modentry";
            if (cfg.submodules) {
                className += " hasSubModules";
            }
            li.className = className;

            cssModsEl.appendChild(li);

            createModuleSelectionElement(name, cfg, li);
            createSizeElement(cfg, li);
        }
    }

    hackYuiConfigData();

    Event.onDOMReady(function() {
        
        current.selected = toModuleHash(YAHOO.configurator.INIT_SELECTION || ["yui"]);

        tabView = new YAHOO.widget.TabView("configurator");
        tabView.on("activeTabChange", function(e) {
            if (this.get("activeIndex") == 1) {
                updateChartUI(current.sizes);
            }
        });

        addModules();
        bindFormElements();
        load();
    });

})();
