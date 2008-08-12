YAHOO.util.Event.onDOMReady(function() {

    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Sel = YAHOO.util.Selector,

        chart = null,

        current = {
            sizes : [],
            used : {
                yui: true
            },

            filter : 'min',
            rollup : true,
            combo : true,
            optional : true,
            base: ""

        },

        modsEl = Dom.get('mods'), 
        subModsEl = Dom.get('subMods'), 
        comboEl = Dom.get('combo'), 
        fileTypeEl = Dom.get('fileType'),
        rollupEl = Dom.get('rollup'),
        optionalEl = Dom.get('optional'), 
        baseEl = Dom.get('base'),
        outputEl = Dom.get('loaderOutput'),
        resourcesEl = Dom.get('resources'),
        chartEl = Dom.get('chart'),
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
       
//        if (!chart) {

            YAHOO.widget.Chart.SWFURL = "http:/"+"/yui.yahooapis.com/2.5.2/build/charts/assets/charts.swf";

            chart = new YAHOO.widget.PieChart( "chart", data, {
                dataField: "size",
                categoryField: "name",
                style: {
                    padding: 10, 
                    legend: {
                        display:"right"
                    }
                },
            });
            
//        } else {
//            chart.set("dataSource", data);
//        }
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

    /*
    function loaderPrep() {

        console.log('loader: ', currentUse);
 
        YUI().use(function(Y) {
            var loader = new Y.Loader({
                require: currentUse,
                force: currentUse,
                filter: type 
            });
            loader.calculate();

            var s = loader.sorted, l = s.length, m, url, out = [], combo = [];

            if (l) {
                for (i=0; i<l; i=i+1)  {
                    m = loader.moduleInfo[s[i]];
                    if (m.type == 'js') {
                        if (Dom.get('check_' + m.name)) {
                            Dom.get('check_' + m.name).checked = true;
                        }
                    }
                }
            }
            updateModList(true);
            outputIncludes(loader);
        });
    };
    */

    function primeLoader() {

        YUI().use(function(Y) {

            mods = [];
            for (var i in current.used) {
                if (YAHOO.lang.hasOwnProperty(current.used, i)) {
                    mods[mods.length] = i;
                }
            }

            console.log('loader require: ', mods);
            console.log('loader rollup: ', current.rollup);
            console.log('loader filter: ', current.filter);
 
            var loader = new Y.Loader({
                require: mods,
                force: mods,

                allowRollup: current.rollup, 
                filter: current.filter,
                loadOptional: current.optional,
 
                combo: current.combo,
            });

            if (current.base != "") {
                loader.base = current.base;
            }

            loader.calculate();

            var s = loader.sorted, l = s.length, m, url, out = [], combo = [];

            console.log('loader sorted: ', loader.sorted);

            current.used = getUsed(loader.sorted);
            current.sizes = getSizes(loader.sorted);

            updateState(loader);
        });
    }

    function getUsed(sortedList) {
        var used = {};
        for (var i = 0; i < sortedList.length; i++) {
            used[sortedList[i]] = true;
        }
        return used;
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
        return sizes;
    }

    function updateState(loader) {
        outputResources(getIncludes(loader));
        renderChart(current.sizes);
        updateCheckBoxes(current.used);
    }

    function updateCheckBoxes(modsUsed) {

        var checks = Sel.query("li input[id^=check_]", "mods"); 

        for (var i = 0; i < checks.length; i++) {
            var mod = checks[i].id.replace("check_", "");
            checks[i].checked = modsUsed[mod];
        }
    }

    function handleModuleSelection(name, stateChange) {
        var cfg = configData[name];

        if (stateChange != undefined) {
            if (stateChange) {
                current.used[name] = true;
            } else {
                delete current.used[name];
            }
        }

        if (cfg && !cfg.isSubMod) {
            subModsHeaderEl.innerHTML = "Sub Modules: " + name;

            if (cfg.submodules) {
                var submods = cfg.submodules;

                subModsEl.innerHTML = "";

                for (var submod in submods) {
                    var submodcfg = configData[submod];
                    if (submodcfg) {
                        var isChecked = (stateChange === undefined && (current.used[submod] || current.used[name]) || stateChange) ? "checked" : "";

                        var li = document.createElement('li');
                        li.innerHTML = '<input type="checkbox" id="check_' + submodcfg.info.name + 
                                       '" ' + isChecked + '> <label for="check_' + submodcfg.info.name + 
                                       '">' + submodcfg.info.name + ': <span class="size">(' + 
                                       prettySize(submodcfg.sizes[current.filter]) + ')</span></label>';
                        subModsEl.appendChild(li);
 
                        if (stateChange !== undefined) {
                            if (isChecked) {
                                current.used[submod] = true;
                            } else {
                                delete current.used[submod];
                            }
                        }
                    }
                }
            } else {
                subModsEl.innerHTML = NO_SUBMODULES_MESSAGE;
            }
        }

        if (stateChange !== undefined) {
            primeLoader();
        }
    }
/*
    function updateModList(currList) {

        // console.info('updateModList: ', check);

        var modEls = Sel.query('#modlist li input');

        var sizes = [],
            used = [];

        subModsEl.innerHTML = '';

        for (var i = 0; i < modEls.length; i++) {

            var modEl = modEls[i];
            var mod = modEl.id.replace('check_', '');
            var modcfg = configData[mod];

            if (currList) {
                modEl.checked = currList[modcfg.info.name];
            }

            if (modEl.checked) {

                if (!modcfg.submodules) {

                    used[used.length] = mod;
                    sizes[sizes.length] = { 
                        name: mod, 
                        size: modcfg.sizes[current.filter] 
                    };

                    var li = document.createElement('li');
                    li.innerHTML = '<input type="checkbox" id="mod_' + modcfg.info.name + 
                                  '" checked> <label for="mod_' + modcfg.info.name + '">' + 
                                  modcfg.info.name + ': (' + prettySize(modcfg.sizes[current.filter]) + ')</label>';
                    subModsEl.appendChild(li);
 
                } else {

                    var submods = modcfg.submodules;

                    for (var m in submods) {
                            var submodcfg = submods[m];
                            if (submodcfg) {

                                used[used.length] = m;
                                sizes[sizes.length] = { 
                                    name: submodcfg.info.name, 
                                    size: submodcfg.sizes[current.filter] 
                                };

                                var isChecked = !currList || currList[m];

                                var li = document.createElement('li');
                                li.innerHTML = '<input type="checkbox" id="mod_' + submodcfg.info.name + 
                                               '" ' + isChecked + '> <label for="mod_' + submodcfg.info.name + 
                                               '">' + submodcfg.info.name + ': (' + prettySize(submodcfg.sizes[current.filter]) +
                                               ')</label>';
                                subModsEl.appendChild(li);
                            }
                    }
                }
            }
        }
        
        if (!currList) {
            primeLoader(used);
        }
        renderChart(sizes);

        fileSizes = sizes;
    };
*/

    function bindFormElements() {

        Event.on(modsEl, 'click', function(e) {
            var t = Event.getTarget(e), name;

            if (t.tagName.toLowerCase() == 'input' && t.id.indexOf("check_") !== -1) {
                name = t.id.replace('check_', '');
                handleModuleSelection(name, t.checked);
            } else if (t.id.indexOf("mod_") !== -1) {
                name = t.id.replace('mod_', '');
                handleModuleSelection(name);
            }
        });

        Event.on(subModsEl, 'click', function(e) {
            var t = Event.getTarget(e), name;
            if (t.tagName.toLowerCase() == 'input' && t.id.indexOf("check_") !== -1) {
                name = t.id.replace('check_', '');
                handleModuleSelection(name, t.checked);
            }
        });

        Event.on(modsEl, 'mouseover', function(e) {
            var t = Event.getTarget(e), name;
            if (t.tagName.toLowerCase() == 'li') {
                Dom.addClass(t, "yui-hover");
            }
        });

        Event.on(modsEl, 'mouseout', function(e) {
            var t = Event.getTarget(e), name;
            if (t.tagName.toLowerCase() == 'li') {
                Dom.removeClass(t, "yui-hover");
            }
        });

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

    function initModules() {

        var sorted = [], cfg, name;

        for (var name in configData) {
            cfg = configData[name];
            if (!cfg.isSubMod && name !== 'yui' && name !== 'yui-base') {
                sorted.push(name);
            }
        }

        sorted.sort();
        sorted.splice(0, 0, 'yui-base');
        sorted.splice(0, 0, 'yui');

        for (var i=0; i < sorted.length; i++) {

            name = sorted[i];
            cfg = configData[name];

            var li = document.createElement('li');
            li.innerHTML = '<input type="checkbox" id="check_' + name + '" value="' + name + '"' 
                         + ((name == 'yui') ? ' checked' : '') + 
                         '> <label for="check_' + name + '">' + name + 
                         ': <span class="size">(' + prettySize(cfg.sizes[current.filter]) + ')</span></label>';
            li.id = 'mod_' + name;
            modsEl.appendChild(li);
        }
    }

    initModules();
    bindFormElements();
    primeLoader();

});
