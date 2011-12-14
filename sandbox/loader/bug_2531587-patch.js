(function() {

    YUI.Env.core.push('loader-patch');

    YUI.add('loader-patch', function(Y) {

        var resolve = function(calc, s) {

            var len, i, m, url, fn, msg, attr, group, groupName, j, frag,
                comboSource, comboSources, mods, comboBase,
                base, urls, u = [], tmpBase, baseLen, resCombos = {},
                self = this,
                singles = [],
                L = Y.Lang,
                JS = 'js', CSS = 'css',
                resolved = { js: [], jsMods: [], css: [], cssMods: [] },
                type = self.loadType || 'js';

            if (calc) {
                self.calculate();
            }
            s = s || self.sorted;

            if (self.combine) {

                len = s.length;

                // the default combo base
                comboBase = self.comboBase;

                url = comboBase;

                comboSources = {};

                for (i = 0; i < len; i++) {
                    comboSource = comboBase;
                    m = self.getModule(s[i]);
                    groupName = m && m.group;
                    if (groupName) {

                        group = self.groups[groupName];

                        if (!group.combine) {
                            m.combine = false;
                            //This is not a combo module, skip it and load it singly later.
                            singles.push(s[i]);
                            continue;
                        }
                        m.combine = true;
                        if (group.comboBase) {
                            comboSource = group.comboBase;
                        }

                        if ("root" in group && L.isValue(group.root)) {
                            m.root = group.root;
                        }

                    }

                    comboSources[comboSource] = comboSources[comboSource] || [];
                    comboSources[comboSource].push(m);
                }

                for (j in comboSources) {
                    if (comboSources.hasOwnProperty(j)) {
                        resCombos[j] = resCombos[j] || { js: [], jsMods: [], css: [], cssMods: [] };
                        url = j;
                        mods = comboSources[j];
                        len = mods.length;
                        
                        if (len) {
                            for (i = 0; i < len; i++) {
                                m = mods[i];
                                // Do not try to combine non-yui JS unless combo def
                                // is found
                                if (m && (m.combine || !m.ext)) {

                                    frag = ((L.isValue(m.root)) ? m.root : self.root) + m.path;
                                    frag = self._filter(frag, m.name);
                                    resCombos[j][m.type].push(frag);
                                    resCombos[j][m.type + 'Mods'].push(m);
                                }

                            }
                        }
                    }
                }

                for (j in resCombos) {
                    base = j;
                    for (type in resCombos[base]) {
                        if (type === JS || type === CSS) {
                            urls = resCombos[base][type];
                            mods = resCombos[base][type + 'Mods'];
                            len = urls.length;
                            tmpBase = base + urls.join(self.comboSep);
                            baseLen = tmpBase.length;
                            
                            if (len) {
                                if (baseLen > self.maxURLLength) {
                                    Y.log('Exceeded maxURLLength for ' + type + ', splitting', 'info', 'loader');
                                    u = [];
                                    m = [];
                                    for (s = 0; s < len; s++) {
                                        tmpBase = base + u.join(self.comboSep);
                                        if (tmpBase.length < self.maxURLLength) {
                                            u.push(urls[s]);
                                            m.push(mods[s]);
                                        } else {
                                            resolved[type].push(tmpBase);
                                            u = [];
                                            m = [];
                                        }
                                    }
                                } else {
                                    resolved[type].push(tmpBase);
                                    resolved[type + 'Mods'] = mods;
                                }
                            }
                        }
                    }
                }

                resCombos = null;
                
            }

            if (!self.combine || singles.length) {

                s = singles.length ? singles : self.sorted;
                len = s.length;

                for (i = 0; i < len; i = i + 1) {

                    m = self.getModule(s[i]);

                    if (!m) {
                        if (!self.skipped[s[i]]) {
                            msg = 'Undefined module ' + s[i] + ' skipped';
                            Y.log(msg, 'warn', 'loader');
                        }
                        continue;

                    }

                    group = (m.group && self.groups[m.group]) || NOT_FOUND;

                    url = (m.fullpath) ? self._filter(m.fullpath, s[i]) :
                          self._url(m.path, s[i], group.base || m.base);
                    
                    resolved[m.type].push(url);
                    resolved[m.type + 'Mods'].push(m);
                }
            }

            return resolved;
        };
        
        Y.Loader.prototype.resolve = resolve;

    });

}());


