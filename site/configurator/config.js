(function() {

    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Sel = YAHOO.util.Selector,
        Lang = YAHOO.lang,

        chart = null,

        colors = ["#00b8bf", "#8dd5e7","#edff9f", "#ffa928", "#c0fff6", "#d00050",
                  "#c6c6c6", "#c3eafb","#fcffad", "#cfff83", "#444444", "#4d95dd",
                  "#b8ebff", "#60558f", "#737d7e", "#a64d9a", "#8e9a9b", "#803e77"];

        current = {
            required : [],
            sizes : [],
            selected : {
                yui: true
            },
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
        subModsHeaderEl = Sel.query('#subModPanel .hd')[0];

    var NO_SUBMODULES_MESSAGE = "This module does not have any sub-modules";

    function renderChart(sizes) {

        var total = 0;

        for (var i = 0; i < sizes.length; i++) {
            total += sizes[i].size;
        }

        totalEl.innerHTML = 'Total: ' + prettySize(total);

        var data = new YAHOO.util.DataSource(sizes);
        data.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        data.responseSchema = { fields: [ "name", "size" ] };
       
        YAHOO.widget.Chart.SWFURL = "http:/"+"/yui.yahooapis.com/2.5.2/build/charts/assets/charts.swf";

        chart = new YAHOO.widget.PieChart( "chart", data, {
                dataField: "size",
                categoryField: "name",
                /*
                seriesDef: [ {
                    style: {
                        colors: [
                            0x00b8bf, 0x8dd5e7, 0xedff9f, 0xffa928, 0xc0fff6, 0xd00050,
                            0xc6c6c6, 0xc3eafb, 0xfcffad, 0xcfff83, 0x444444, 0x4d95dd,
                            0xb8ebff, 0x60558f, 0x737d7e, 0xa64d9a, 0x8e9a9b, 0x803e77
                        ]
                    }
                    }
                ],
                */
                style: {
                    padding: 5, 
                    legend: {
                        display:"bottom"
                    }
                }
        });

        /*
        var sizes = current.sizes;
        var cl = colors.length;

        for (var j = 0; j < sizes.length; j++) {
            sizes[j].color = colors[j%cl];
            legendEl.innerHTML += '<li><div class="legendColor" style="float:left;width:1em;height:1em;background-color:' + 
                                    sizes[j].color + '">&nbsp;</div><span>' + sizes[j].name + '</span></li>'; 
        }
        */
    };

    function prettySize(size) {
        var gb = 1024 * 1024 * 1024;
        var mb = 1024 * 1024;
        if (size > gb) {
            mysize = Math.round(size / gb) + " GB";
        } else if (size > mb) {
            mysize = Math.round(size / mb) + " MB";
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
                        combourl.push(loader.root + m.path);
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

    function outputResources(buffer) {
        var oldout = Dom.getElementsByClassName('dp-highlighter', 'div', resourcesEl);
        if (oldout && oldout.length > 0) {
            var el = oldout[0];
            el.parentNode.removeChild(el);
        }

        outputEl.value = buffer.join('\n');
        dp.SyntaxHighlighter.HighlightAll(outputEl.id);
    }

    function primeLoader() {

        YUI().use(function(Y) {

            var mods = [];
            for (var i in current.selected) {
                if (Lang.hasOwnProperty(current.selected, i)) {
                    mods[mods.length] = i;
                }
            }
 
            if (window.console) {
                console.log('loader selected: ', mods);
                console.log('loader rollup: ', current.rollup);
                console.log('loader filter: ', current.filter);
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


            current.required = getRequired(loader.sorted);
            current.sizes = getSizes(loader.sorted);

            if (window.console) {
                console.log('loader sorted: ', loader.sorted);
                console.log('loader required: ', current.required);
                console.log('loader sizes: ', current.sizes);
            }

            updateState(loader);
        });
    }

    function getRequired(sortedList) {
        var req = {};
        for (var i = 0; i < sortedList.length; i++) {
            req[sortedList[i]] = true;
        }
        return req;
    }

    function getSizes(sortedList) {
        var sizes = [];

        for (var i = 0; i < sortedList.length; i++) {
            var cfg = configData[sortedList[i]];
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

    function updateState(loader) {
        outputResources(getIncludes(loader));
        renderChart(current.sizes);

        // No Longer feeding loader out back to checkboxes
        // updateCheckBoxes(current.selected);
    }

    /*
    function updateCheckBoxes(modsUsed) {

        var checks = Sel.query("li input[id^=check_]", "mods"); 

        for (var i = 0; i < checks.length; i++) {
            var mod = checks[i].id.replace("check_", "");
            checks[i].checked = modsUsed[mod];
        }
    }
    */

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
                handleSubModuleDependencies(name, cfg, stateChange);
            } else {
                handleModuleDependencies(name, cfg, stateChange);
            }

            if (stateChange !== undefined) {
                primeLoader();
            }
        }
    }

    function handleSubModuleDependencies(name, cfg, stateChange) {
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

    function handleModuleDependencies(name, cfg, stateChange) {
        subModsHeaderEl.innerHTML = "Sub Modules: " + name;

        if (cfg.submodules) {
            var submods = cfg.submodules;

            subModsEl.innerHTML = "";

            for (var submod in submods) {
                var submodcfg = configData[submod];
                if (submodcfg) {
                    var isChecked = (stateChange === undefined && (current.selected[submod] || current.selected[name]) || stateChange);

                    var li = document.createElement('li');
                    li.id = "mod_" + submod;
                    subModsEl.appendChild(li);
                    createModuleSelectionElement(submod, submodcfg, li);
                    submodcfg._selectionEl.set("checked", isChecked);
                    createSizeElement(submodcfg.sizes[current.filter], li);

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
            subModsEl.innerHTML = NO_SUBMODULES_MESSAGE;
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

        Event.on(modInfoEl, 'mouseover', function(e) {
            var t = Event.getTarget(e), name, desc, cfg, className;

            t = Dom.hasClass(t, "modentry") ? t : Dom.getAncestorByClassName(t, "modentry");
            if (t) {
                name = t.id.replace('mod_', '');
                cfg = configData[name];

                // className = (cfg.submodules) ? "yui-hover-submodules" : "yui-hover";
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

                // className = (cfg.submodules) ? "yui-hover-submodules" : "yui-hover";
                Dom.removeClass(t, "yui-hover");

                modDescHdEl.innerHTML = "";
                modDescBdEl.innerHTML = "";
                Dom.addClass(modDescEl, "yui-hidden");
            }
        });

        // TODO: Change does not seem to bubble in IE6. See if there are alternatives
        Event.on(fileTypeEl, 'change', function() {
            current.filter = this.options[this.selectedIndex].value;
            primeLoader();
        });

        Event.on(comboEl, 'change', function() {
            current.combo = this.checked;
            baseEl.disabled = this.checked;
            primeLoader();
        });

        Event.on(rollupEl, 'change', function() {
            current.rollup = this.checked;
            primeLoader();
        });

        Event.on(baseEl, 'change', function() {
            current.base = YAHOO.lang.trim(this.value);
            primeLoader();
        });

        Event.on(optionalEl, 'change', function() {
            current.optional = this.checked;
            primeLoader();
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
                checked: (name == "yui"),
                onclick: {
                    fn: function() {
                        handleModuleSelection(name, this.get("checked"));
                    }
                }
            });

            cfg._selectionEl = btn;
            btn._moduleName = name;
    }

    function createSizeElement(size, parent) {
        var s = document.createElement("span");
        parent.appendChild(s);
        s.className = "size";
        s.innerHTML = '(' + prettySize(size) + ')';
    }

    function addModules() {

        var js = [], css = [], i, li, cfg, name, className;

        for (name in configData) {
            if (Lang.hasOwnProperty(configData, name)) {
                cfg = configData[name];
                if (cfg.type == 'js' && !cfg.isSubMod && name !== 'yui' && name !== 'yui-base') {
                    js.push(name);
                }

                if (cfg.type == 'css') {
                    css.push(name);
                }
            }
        }

        js.sort();
        js.splice(0, 0, 'yui-base');
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
            createSizeElement(cfg.sizes[current.filter], li);
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
            createSizeElement(cfg.sizes[current.filter], li);
        }
    }

    Event.onDOMReady(function() {
        addModules();
        bindFormElements();
        primeLoader();
    });

})();
