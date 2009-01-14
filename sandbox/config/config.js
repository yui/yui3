(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Sel = YAHOO.util.Selector,
        fileSizes = [];

    var renderChart = function(sizes) {
        sizes = sizes || fileSizes;
        var total = 0;
        for (var i = 0; i < sizes.length; i++) {
            total += sizes[i].size;
        }
        Dom.get('total').innerHTML = 'Total: ' + prettySize(total);

        YAHOO.widget.Chart.SWFURL = "http:/"+"/yui.yahooapis.com/2.5.2/build/charts/assets/charts.swf";
        var data = new YAHOO.util.DataSource(sizes);
        data.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        data.responseSchema = { fields: [ "name", "size" ] };
        
        mychart = new YAHOO.widget.PieChart( "chart", data, {
            dataField: "size",
            categoryField: "name",
            style: {
                padding: 20
            }
        });
        console.log(mychart);
    };

    var prettySize = function(size) {
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

    var comp = Dom.get('comp'), type = 'min', currentUse = [];

    Event.on('fileType', 'change', function() {
        type = this.options[this.selectedIndex].value;
        updateList();
    });

    var loaderPrep = function() {
        console.log('loader: ', currentUse);
        YUI().use(function(Y) {
            var loader = new Y.Loader({
                require: currentUse
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
            updateList(true);
        });
    };

    var loaderPrepMods = function(subUse) {
        console.log('loader2: ', subUse);
        YUI().use(function(Y) {
            var loader = new Y.Loader({
                require: subUse
            });
            loader.calculate();

            var s = loader.sorted, l = s.length, m, url, out = [], combo = [];

            if (l) {
                for (i=0; i<l; i=i+1)  {
                    m = loader.moduleInfo[s[i]];
                    if (m.type == 'js') {
                        if (Dom.get('mod_' + m.name)) {
                            Dom.get('mod_' + m.name).checked = true;
                        }
                    }
                }
            }
            console.log(loader);
            console.log(fileSizes);
        });
    };

    var updateModList = function(check) {
        console.info('updateModList: ', check);
        var mods = {};
        var ins = Sel.query('#mods li input');
        var subUse = [];
        for (var i = 0; i < ins.length; i++) {
            if (ins[i].checked) {
                var mod = ins[i].id.replace('mod_', '');
                subUse[subUse.length] = mod;
                mods[mod] = true;
            }
        }
        loaderPrepMods(subUse);
        var sizes = [];
        console.log('mods: ', mods);
        console.log('sizes: ', fileSizes);
        for (var i = 0; i < fileSizes.length; i++) {
            if (mods[fileSizes[i].name]) {
                sizes[sizes.length] = fileSizes[i];
            }
        }
        console.log(sizes);
        renderChart(sizes);
    };

    var updateList = function(check) {
        console.info('updateList: ', check);
        fileSizes = [];
        currentUse = [];
        var ins = Sel.query('#comp li input');
        Dom.get('mods').innerHTML = '';
        for (var i = 0; i < ins.length; i++) {
            if (ins[i].checked) {
                var mod = ins[i].id.replace('check_', '');
                var module = configData[mod];
                if (module.info) {
                    currentUse[currentUse.length] = mod;
                    //No Subs
                    var li = document.createElement('li');
                    li.innerHTML = '<input type="checkbox" id="mod_' + module.info.name + '" checked> <label for="mod_' + module.info.name + '">' + module.info.name + ': ' + prettySize(module.sizes[type]) + '</label>';
                    fileSizes[fileSizes.length] = { name: mod, size: module.sizes[type] };
                    Dom.get('mods').appendChild(li);
                } else {
                    for (var m in module.submodules) {
                        currentUse[currentUse.length] = m;
                        if (module.submodules[m] && module.submodules[m].info) {
                            var li = document.createElement('li');
                            //console.log(module.submodules[m]);
                            li.innerHTML = '<input type="checkbox" id="mod_' + module.submodules[m].info.name + '" checked> <label for="mod_' + module.submodules[m].info.name + '">' + module.submodules[m].info.name + ': ' + prettySize(module.submodules[m].sizes[type]);
                            fileSizes[fileSizes.length] = { name: module.submodules[m].info.name, size: module.submodules[m].sizes[type] };
                            Dom.get('mods').appendChild(li);
                        }
                        
                    }
                }
            }
        }
        if (!check) {
            loaderPrep();
        } else {
            renderChart();
        }
    };


    Event.on(comp, 'click', function(e) {
        var tar = Event.getTarget(e);
        if (tar.tagName.toLowerCase() == 'input') {
            updateList();
        }
    });
    
    Event.on('mods', 'click', function(e) {
        var tar = Event.getTarget(e);
        if (tar.tagName.toLowerCase() == 'input') {
            updateModList();
        }
    });
    
    for (var i in configData) {
        var li = document.createElement('li');
        li.innerHTML = '<input type="checkbox" id="check_' + i + '" value="' + i + '"' + ((i == 'yui') ? ' checked disabled' : '') + '> <label for="check_' + i + '">' + i + '</label>';
        li.id = 'comp_' + i;
        comp.appendChild(li);
    }
    updateList();

})();
