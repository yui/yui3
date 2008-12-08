(function() {

    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Sel = YAHOO.util.Selector,
        Lang = YAHOO.lang,

        chart = null,
        tabView = null,

        moduleData = configData.modules,
        categoryData = configData.categories,
        categoryOrder = ["core", "util", "infra", "widget", "nodeplugin", "css", "tool"],

        current = {
            initialLoad : true,
            selected : {},
            required : {},
            sizes : [],
            filter : 'min',
            rollup : false,
            combo : true,
            optional : true,
            base: ""
        },

        modInfoEl = Dom.get('modInfo'),
        modsBdEl = Sel.query('#modPanel .bd')[0],
        subModsEl = Dom.get('subMods'),

        modDescEl = Dom.get('modDesc'),
        modDescHdEl = Sel.query('#modDesc .hd')[0],
        modDescBdEl = Sel.query('#modDesc .bd')[0],

        configOptsEl = Dom.get('configOpts'),
        comboEl = Dom.get('combo'),
        fileTypeEl = Dom.get('fileType'),
        rollupEl = Dom.get('rollup'),
        optionalEl = Dom.get('optional'),
        baseEl = Dom.get('base'),

        outputEl = Dom.get('loaderOutput'),
        resourcesEl = Dom.get('resources'),
        selModsBdEl = Sel.query('#selectedModules .bd')[0],
        selModsFtEl = Sel.query('#selectedModules .ft')[0],
        chartEl = Dom.get('chart'),
        legendEl = Dom.get('legend'),
        totalEl = Sel.query('#weight .hd')[0],
        totalWeightEl = Dom.get("finalWeight"),
        subModsHeaderEl = Sel.query('#subModPanel .hd')[0],

        GB = 1024 * 1024 * 1024,
        MB = 1024 * 1024;

    var Y = YUI();

    var outputFilesAnim = new YAHOO.util.ColorAnim(outputEl,
        {backgroundColor: {from: '#edff9f', to: '#fff' }}, 1.5, YAHOO.util.Easing.easeIn
    );

    var outputModsAnim = new YAHOO.util.ColorAnim(selModsBdEl,
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

        var s = loader.sorted, l = s.length, m, url, out = [], comboJsUrl = [], comboCssUrl = [], i, cssPushed = false, jsPushed = false;

        if (l) {
            for (i=0; i < l; i++)  {
                m = loader.moduleInfo[s[i]];
                if (m.type == 'css') {

                    if (!cssPushed) {
                        out.push('<!-- CSS -->');
                        cssPushed = true;
                    }

                    if(current.combo) {
                        comboCssUrl.push(loader.root + m.path);
                    } else {
                        url = m.fullpath || loader._url(m.path);
                        out.push('<link rel="stylesheet" type="text/css" href="' + url + '">');
                    }
                }
            }
            

            if(current.combo && comboCssUrl.length) {
                var cssSrc = loader.comboBase + comboCssUrl.join("&");
                out.push('<link rel="stylesheet" type="text/css" href="' + cssSrc + '">');
            }

            for (i=0; i <l; i=i+1)  {
                m = loader.moduleInfo[s[i]];
                if (m.type == 'js') {

                    if (!jsPushed) {
                        out.push('<!-- JS -->');
                        jsPushed = true;
                    }

                    if(current.combo) {
                        var filter = loader.FILTERS[current.filter.toUpperCase()];
                        var filteredPath = (filter) ? m.path.replace(new RegExp(filter.searchExp), filter.replaceStr) : m.path; 
                        comboJsUrl.push(loader.root + filteredPath);
                    } else {
                        url = m.fullpath || loader._url(m.path);
                        out.push('<script type="text/javascript" src="' + url + '"></scr' + 'ipt>');
                    }
                }
            }

            if(current.combo && comboJsUrl.length) {
                var jsSrc = loader.comboBase + comboJsUrl.join("&");
                out.push('<script type="text/javascript" src="' + jsSrc + '"></scr' + 'ipt>');
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
                if (moduleData[mod]) {
                    req[mod] = true;
                }
            }
        }
        return req;
    }

    function toSizeArray(modList) {
        var sizes = [];

        for (var i = 0; i < modList.length; i++) {
            var cfg = moduleData[modList[i]];
            if (cfg) {
                sizes[sizes.length] = { 
                    name: modList[i], 
                    size: cfg.sizes[current.filter],
                    sizegz: cfg.sizes[current.filter+"gz"]
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
        updateRequiredModsUI(current.selected, current.required);
        updateWeightUI(current.sizes);
    }

    function updateSizeUI() {
        var sizeEls = Dom.getElementsByClassName("size", "span", modInfoEl), name, el;
        for (var i = 0, l = sizeEls.length; i < l; i++) {
           el = sizeEls[i];
           name = el.id.replace("size_", "");
           el.innerHTML = "(" + prettySize(moduleData[name].sizes[current.filter]) + ", " + current.filter + ")";
        }
    }

    function updateChartUI(sizes, gz) {

        var data = new YAHOO.util.DataSource(sizes);
        data.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        data.responseSchema = { fields: [ "name", (gz) ? "sizegz" : "size" ] };

        YAHOO.widget.Chart.SWFURL = "http:/"+"/yui.yahooapis.com/2.5.2/build/charts/assets/charts.swf";

        // Unfortunately, resetting pie chart data set is buggy
        chart = new YAHOO.widget.PieChart( "chart", data, {
                dataField: (gz) ? "sizegz" : "size",
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
            outputFilesAnim.stop();
            outputFilesAnim.animate();
        }
    }

    function updateRequiredModsUI(selected, required) {

        var bd = ["<ol>"], ft = [], className, m, sm, submodsHTML, sizeHTML, sizes, size, sizegz, totals = {selected:{s:0,gz:0}, dependency:{s:0,gz:0}};

        for (m in required) {
            if (Lang.hasOwnProperty(required, m)) {
                submodsHTML = "";
                className = (selected[m]) ? "selected" : "dependency";

                if (moduleData[m].rollup !== undefined) {

                    className += " rollup";

                    if (moduleData[m].submodules) {
                        submodsHTML = [];
                        for (sm in moduleData[m].submodules) {
                            submodsHTML[submodsHTML.length] = sm;
                        }
                        submodsHTML = ' <p class="submods">' + submodsHTML.join(", ") + '</p>';
                    }
                }

                sizes = moduleData[m].sizes;

                size = sizes[current.filter];
                sizegz = sizes[current.filter + "gz"];

                if (selected[m]) {
                    totals.selected.s += size;
                    totals.selected.gz += sizegz;
                } else {
                    totals.dependency.s += size;
                    totals.dependency.gz += sizegz;
                }

                sizeHTML = prettySize(size) + " (" + current.filter + ")";
                // sizeHTML += ", " + prettySize(sizegz) + " (" + current.filter + ", gzipped)";

                bd[bd.length] = '<li class="';
                bd[bd.length] = className;
                bd[bd.length] = '" title="';
                bd[bd.length] = className;
                bd[bd.length] = '"><p><span>';
                bd[bd.length] = m;
                bd[bd.length] = '</span><span class="size">';
                bd[bd.length] = sizeHTML;
                bd[bd.length] = '</span></p>';

                if (submodsHTML) {
                    bd[bd.length] = submodsHTML;
                }

                bd[bd.length] = '</li>';
            }
        }

        bd[bd.length] =["</ol>"];

        selModsBdEl.innerHTML = bd.join("");

        ft[ft.length] = '<p class="totals">';
        ft[ft.length] = '<span class="dependency">&nbsp;</span> Dependencies';
        if (current.rollup) {
            ft[ft.length] = '/Rollups';
        }
        ft[ft.length] = ' : <span class="total">'
        ft[ft.length] = prettySize(totals.dependency.s);
        ft[ft.length] = '</span> (';
        ft[ft.length] = current.filter;
        ft[ft.length] = ') <span class="selected">&nbsp;</span> Selected : <span class="total">';
        ft[ft.length] = prettySize(totals.selected.s);
        ft[ft.length] = '</span> (';
        ft[ft.length] = current.filter;
        ft[ft.length] = ')</p>';

        selModsFtEl.innerHTML = ft.join("");

        if (!current.initialLoad) {
            outputModsAnim.stop();
            outputModsAnim.animate();
        }
    }

    function updateWeightUI(sizes) {
        var total = 0, totalGz = 0, prettyTotal, prettyTotalGz;

        for (var i = 0; i < sizes.length; i++) {
            total += sizes[i].size;
            totalGz += sizes[i].sizegz;
        }

        var prettyTotal = prettySize(total);
        var prettyTotalGz = prettySize(totalGz);

        var totalHtml = '<span class="yui-' + current.filter + '">' + prettyTotal + ' (' + current.filter + ')</span>, <span class="' + current.filter + '-gz">' + prettyTotalGz + ' (' + current.filter  + ', gzipped)</span>';

        totalEl.innerHTML = "Total Weight - " + totalHtml;
        totalWeightEl.innerHTML = ' - ' + totalHtml;

        var weightTab = tabView.get("tabs")[1];
        weightTab.set("label", "Page Weight Analysis - " + totalHtml);

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
        var cfg = moduleData[name];
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
                parentCfg = moduleData[parentName],
                submodules = parentCfg.submodules,
                submodCfg;

            for (var sm in submodules) {
                submodCfg = moduleData[sm];
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

            parentCfg._selectionEl.set("checked", false, true);
            delete current.selected[parentName];
        }
    }

    function updateStateFromModule(name, cfg, stateChange) {
        var li, submods, submod, submodcfg, recreate, isChecked;
 
        subModsHeaderEl.innerHTML = "Sub Modules: " + name;

        recreate = (!current.subModulesDisplayed || current.subModulesDisplayed != name);

        current.subModulesDisplayed = name;

        if (cfg.submodules) {
            submods = cfg.submodules;

            if (recreate) {
                Event.purgeElement(subModsEl, true);
                subModsEl.innerHTML = "";
            }

            for (submod in submods) {
                submodcfg = moduleData[submod];

                if (submodcfg) {
                    isChecked = (stateChange === undefined && (current.selected[submod] || current.selected[name]) || stateChange);

                    if (recreate) {
                        li = createModuleListEntry(submod, submodcfg, subModsEl);
                        createModuleSelectionElement(submod, submodcfg, li);
                        createSizeElement(submod, submodcfg, li);
                    }

                    submodcfg._selectionEl.set("checked", isChecked, true);

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
            t = Dom.hasClass(t, "modentry") ? t : Dom.getAncestorByClassName(t, "modentry");
            if (t) {
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
                cfg = moduleData[name];

                Dom.addClass(t, "yui-hover");
 
                desc = moduleData[name].info.desc;
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
                cfg = moduleData[name];

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
            current.rollup = rollupEl.checked = !this.checked;
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
                    fn: function(e) {
                        Event.stopPropagation(e);
                    }
                }
            });

            btn.on("checkedChange", function(e) {
                handleModuleSelection(this._moduleName, e.newValue);
            });

            cfg._selectionEl = btn;
            btn._moduleName = name;

            return btn;
    }

    function createSizeElement(name, cfg, parent) {

        var s = document.createElement("span");
        var size = cfg.sizes[current.filter]; 

        s.className = "size";
        s.id = "size_" + name;
        parent.appendChild(s);

        s.innerHTML = '(' + prettySize(size) + ', ' + current.filter +')';

        return s;
    }

    function createCategory(cat, mods) {

        var name, cfg, i, li, div, ul, className, listId = "mods_" + cat;

        div = document.createElement("div");
        div.className = "modGroupHd";
        div.innerHTML = categoryData[cat].name;
        
        ul = document.createElement("ul");
        ul.id = listId;
        ul.className = "modList";

        modsBdEl.appendChild(div);
        modsBdEl.appendChild(ul);

        var modsList = Dom.get(listId);

        for (i = 0; i < mods.length; i++) {

            name = mods[i];
            cfg = moduleData[name];

            li = createModuleListEntry(name, cfg, modsList);
            createModuleSelectionElement(name, cfg, li);
            createSizeElement(name, cfg, li);
        }
    }

    function createModuleListEntry(name, cfg, parent) {
        var li = document.createElement("li"),
            className = "modentry";

            if (cfg.submodules) {
                className += " hasSubModules";
            }
            li.className = className;
            li.id = "mod_" + name;

            parent.appendChild(li);

            return li;
    }

    function hackYuiConfigData() {

        var yuiCfg = moduleData["yui"];

        hackSubModule(yuiCfg, moduleData["yui-base"]);
        hackSubModule(yuiCfg, moduleData["get"]);
        hackSubModule(yuiCfg, moduleData["loader"]);
    }

    function hackSubModule(moduleCfg, submoduleCfg) {
        if (moduleCfg && submoduleCfg) {
           submoduleCfg.isSubMod = true;
           moduleCfg.rollup = true;
           if (!moduleCfg.submodules) {
               moduleCfg.submodules = {};
           }
           moduleCfg.submodules[submoduleCfg.name] = submoduleCfg;
        }
    }

    function addModules() {

        var split = {}, i, l, cfg, name, cat;

        for (name in moduleData) {
            if (Lang.hasOwnProperty(moduleData, name)) {
                cfg = moduleData[name];
                if (!cfg.isSubMod && name !== "yui") {
                    cat = cfg.info.cat;
                    (split[cat] = split[cat] || []).push(name);
                }
            }
        }

        for (i = 0, l = categoryOrder.length; i < l; i++) {
            cat = categoryOrder[i];
            if (Lang.hasOwnProperty(split, cat)) {
                split[cat].sort();
                if (cat == "core") {
                    split[cat].splice(0,0,"yui");
                }
            }
            createCategory(cat, split[cat]);
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
