(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        txt = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas sit amet metus. Nunc quam elit, posuere nec, auctor in, rhoncus quis, dui. Aliquam erat volutpat. Ut dignissim, massa sit amet dignissim cursus, quam lacus feugiat.';

    YAHOO.CSSGridBuilder = {
        init: function() {
            this.headerStr = 'YUI: CSS Grid Builder';
            this.footerStr = 'Footer is here.';
            this.headerDefault = this.headerStr;
            this.footerDefault = this.footerStr;
            this.type = 'yui-t7';
            this.docType = 'doc';
            this.rows = [];
            this.rows[0] = Dom.get('splitBody0');
            this.storeCode = false;
            this.sliderData = false;

            this.bd = Dom.get('bd');
            this.doc = Dom.get('doc');
            this.template = Dom.get('which_grid');

            Event.on(this.template, 'change', YAHOO.CSSGridBuilder.changeType, YAHOO.CSSGridBuilder, true);
            Event.on('splitBody0', 'change', YAHOO.CSSGridBuilder.splitBody, YAHOO.CSSGridBuilder, true);
            Event.on('which_doc', 'change', YAHOO.CSSGridBuilder.changeDoc, YAHOO.CSSGridBuilder, true);
            Event.on(this.bd, 'mouseover', YAHOO.CSSGridBuilder.mouseOver, YAHOO.CSSGridBuilder, true);


            var header_button = new YAHOO.widget.Button('setHeader');
            header_button.on('click', YAHOO.CSSGridBuilder.setHeader, YAHOO.CSSGridBuilder, true);

            var footer_button = new YAHOO.widget.Button('setFooter');
            footer_button.on('click', YAHOO.CSSGridBuilder.setFooter, YAHOO.CSSGridBuilder, true);

            var code_button = new YAHOO.widget.Button('show_code');
            code_button.on('click', YAHOO.CSSGridBuilder.showCode, YAHOO.CSSGridBuilder, true);

            var reset_button = new YAHOO.widget.Button('resetBuilder');
            reset_button.on('click', YAHOO.CSSGridBuilder.reset, YAHOO.CSSGridBuilder, true);

            var about_button = new YAHOO.widget.Button('about');
            about_button.on('click', YAHOO.CSSGridBuilder.about, YAHOO.CSSGridBuilder, true);

            var add_button = new YAHOO.widget.Button('addRow');
            add_button.on('click', YAHOO.CSSGridBuilder.addRow, YAHOO.CSSGridBuilder, true);

            var doc_button = new YAHOO.widget.Button('doc_return');
            doc_button.on('click', function(ev) {
                location.href='http:/'+'/developer.yahoo.com/yui/grids/';
                Event.stopEvent(ev);
            });


            this.tooltip = new YAHOO.widget.Tooltip('classPath', { context: 'bd', showDelay:500 } );

        },
        about: function(ev) {
            var showAbout = new YAHOO.widget.Dialog('showAbout', {
                    close: true,
                    modal: true,
                    visible: true,
                    fixedcenter: true,
                    height: '230px',
                    width: '250px',
                    zindex: 9001
                }
            );
            showAbout.hideEvent.subscribe(function() {
                this.destroy();
            }, showAbout, true);
            showAbout.setHeader('CSS Grid Builder v 0.6');
            var content = '<p>Written by Dav Glass &lt;dav.glass@yahoo.com&gt;</p>';
            content += '<p><a href="http:/'+'/blog.davglass.com/" target="_blank">blog.davglass.com</a></p>';
            content += '<p>The Grids Builder is designed to work with the Yahoo User Interface (YUI)  CSS Grids tools. They are freely available and you can download a copy from their developer site here:<br><a href="http:/'+'/developer.yahoo.com/yui/grids/" target="_blank">http:/'+'/developer.yahoo.com/yui/grids</a></p>';
            content += '<p>Last Updated: YUI Version ' + YAHOO.VERSION + '</p>';
            showAbout.setBody(content);
            showAbout.setFooter('&nbsp;');
            showAbout.render(document.body);
            Event.stopEvent(ev);
        },
        reset: function(ev) {
            for (var i = 1; i < this.rows.length; i++) {
                if (this.rows[i]) {
                    if (Dom.get('splitBody' + i)) {
                        Dom.get('splitBody' + i).parentNode.parentNode.removeChild(Dom.get('splitBody' + i).parentNode);
                    }
                }
            }
            this.rows = [];
            this.rows[0] = Dom.get('splitBody0');
            Dom.get('which_doc').options.selectedIndex = 0;
            Dom.get('which_grid').options.selectedIndex = 0;
            Dom.get('splitBody0').options.selectedIndex = 0;

            Dom.get('hd').innerHTML = '<h1>' + this.headerDefault + '</h1>';
            Dom.get('ft').innerHTML = this.footerDefault;
            this.headerStr = this.headerDefault;
            this.footerStr = this.footerDefault;
            this.changeDoc();
            this.changeType();
            this.splitBody();
            Event.stopEvent(ev);
        },
        addRow: function(ev) {
            var tmp = Dom.get('splitBody0').cloneNode(true);
            tmp.id = 'splitBody' + this.rows.length;
            this.rows[this.rows.length] = tmp;
            this.rowCounter++;
            var p = document.createElement('p');
            p.innerHTML = 'Row:<a href="#" class="rowDel" id="gridRowDel' + this.rows.length + '" title="Remove this row">[X]</a><br>';
            p.appendChild(tmp);
            Dom.get('splitBody0').parentNode.parentNode.appendChild(p);
            Event.on(tmp, 'change', YAHOO.CSSGridBuilder.splitBody, YAHOO.CSSGridBuilder, true);
            Event.on('gridRowDel' + this.rows.length, 'click', YAHOO.CSSGridBuilder.delRow, YAHOO.CSSGridBuilder, true);
            this.splitBody();
            Event.stopEvent(ev);
        },
        delRow: function(ev) {
            var tar = Event.getTarget(ev);
            var id = tar.id.replace('gridRowDel', '');
            Dom.get('splitBody0').parentNode.parentNode.removeChild(tar.parentNode);
            this.rows[id] = false;
            this.splitBody();
            Event.stopEvent(ev);
        },
        changeCustomDoc: function(ev) {
            var tar = Event.getTarget(ev);
                docType = Dom.get('which_doc').options[Dom.get('which_doc').selectedIndex].value;
                Event.stopEvent(ev);
        },
        changeDoc: function(ev) {
            this.docType = Dom.get('which_doc').options[Dom.get('which_doc').selectedIndex].value;
            if (this.docType == 'custom-doc') {
                this.showSlider();
            } else {
                this.doc.style.width = '';
                this.doc.style.minWidth = '';
                this.sliderData = false;
                this.doc.id = this.docType;
                this.doTemplate();
            }
            if (ev) {
                Event.stopEvent(ev);
            }
        },
        changeType: function() {
            this.type = this.template.options[this.template.selectedIndex].value;
            this.doc.className = this.type;
            this.doTemplate();
        },
        doTemplate: function(lorem) {
            if (this.storeCode) {
                this.splitBody();
            }
            var html = '';
            var str = '<p>' + (new Array(4).join(txt)) + '</p>';
            var navStr = '<p class="nav">Navigation Pane</p>';
            if (lorem) {
                str = txt;
                navStr = 'Navigation Pane';
            } else if (this.storeCode) {
                str = '<!-- YOUR DATA GOES HERE -->';
                navStr = '<!-- YOUR NAVIGATION GOES HERE -->';
            }
            if (this.bodySplit) {
                if (lorem) {
                    str = this.bodySplit.replace(/\{0\}/g, txt);
                } else if (this.storeCode) {
                    str = this.bodySplit.replace(/\{0\}/g, "\t" + '<!-- YOUR DATA GOES HERE -->' + "\n\t");
                } else {
                    str = this.bodySplit.replace(/\{0\}/g, '<p>' + txt + '</p>');
                }
            }
            switch (this.type) {
                case 'yui-t7':
                    html = str;
                    break;
                default:
                    html = '<div id="yui-main">' + "\n\t" + '<div class="yui-b">' + str + '</div>' + "\n\t" + '</div>' + "\n\t" + '<div class="yui-b">' + navStr + '</div>' + "\n\t";
                    break;
            }
            if (this.storeCode) {
                return html;
            } else {
                this.bd.innerHTML = html;
            }
        },
        PixelToEmStyle: function(size, prop) {
            var data = '';
            var prop = ((prop) ? prop.toLowerCase() : 'width');
            var sSize = (size / 13);
            data += prop + ':' + (Math.round(sSize * 100) / 100) + 'em;';
            data += '*' + prop + ':' + (Math.round((sSize * 0.9759) * 100) / 100) + 'em;';
            if ((prop == 'width') || (prop == 'height')) {
                data += 'min-' + prop + ':' + size + 'px;';
            }
            return data;
        },
        getCode: function(lorem) {
            this.storeCode = true;
            var css = false;
            if (this.sliderData) {
                if (this.sliderData.indexOf('px') != -1) {
                    var css = '#custom-doc { ' + this.PixelToEmStyle(parseInt(this.sliderData)) + ' margin:auto; text-align:left; }';
                } else {
                    var css = '#custom-doc { width: ' + this.sliderData + '; min-width: 250px; }';
                }
            }
            var code = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"' + "\n" + ' "http://www.w3.org/TR/html4/strict.dtd">' + "\n";
            code += '<html>' + "\n";
            code += '<head>' + "\n";
            code += '   <title>YUI Base Page</title>' + "\n";
            code += '   <link rel="stylesheet" href="http:/'+'/yui.yahooapis.com/' + YAHOO.VERSION + '/build/reset-fonts-grids/reset-fonts-grids.css" type="text/css">' + "\n";
            if (css) {
                code += '   <style type="text/css">' + "\n";
                code += '   ' + css + "\n";
                code += '   </style>' + "\n";
            }
            code += '</head>' + "\n";
            code += '<body>' + "\n";
            code += '<div id="' + this.docType + '" class="' + this.type + '">' + "\n";
            code += '   <div id="hd"><h1>' + this.headerStr + '</h1></div>' + "\n";
            code += '   <div id="bd">' + "\n\t" + this.doTemplate(lorem) + "\n\t" + '</div>' + "\n";
            code += '   <div id="ft">' + this.footerStr + '</div>' + "\n";
            code += '</div>' + "\n";
            code += '</body>' + "\n";
            code += '</html>' + "\n";

            this.storeCode = false;

            return code;
        },
        showCode: function(ev) {
            var code = this.getCode();
            var showCode = new YAHOO.widget.Dialog('showCode', {
                    close: true,
                    draggable: true,
                    modal: true,
                    visible: true,
                    fixedcenter: true,
                    height: '382px',
                    width: '650px',
                    zindex: 9001
                }
            );
            showCode.setHeader('CSSGridBuilder Code');
            showCode.setBody('<form><textarea name="code" id="codeHolder" class="HTML">' + code + '</textarea></form>');
            showCode.setFooter('<input type="checkbox" id="includeLorem" value="1"> <label for="includeLorem">Include Lorem Ipsum text</label>');
            showCode.hideEvent.subscribe(function() {
                this.destroy();
            }, showCode, true);
            showCode.showEvent.subscribe(function() {
                var el = showCode.body;
                //Fix the scrollbars..
                window.setTimeout(function() {
                    YAHOO.util.Dom.setStyle(el, 'overflow', 'auto');
                }, 50);
            }, showCode, true);
            showCode.render(document.body);

            Event.onAvailable('includeLorem', function() {
                Event.on('includeLorem', 'click', function(ev) {
                    var check = Dom.get('includeLorem');
                    var holder = Dom.get('codeHolder');
                    var table = holder.previousSibling;
                    table.parentNode.removeChild(table);
                    var code = this.getCode(check.checked);
                    holder.style.visibility = 'hidden';
                    holder.style.display = 'block';
                    holder.value = code;
                    window.setTimeout(function() {
                        dp.SyntaxHighlighter.HighlightAll('code');
                    }, 5);
                },this, true);
            }, this, true);
            dp.SyntaxHighlighter.HighlightAll('code');
            Event.stopEvent(ev);
        },
        setHeader: function(ev) {
            var str = prompt('Set header value to: ', this.headerStr);
            if (str != null) {
                this.headerStr = str;
                Dom.get('hd').innerHTML = '<h1>' + str + '</h1>';
            }
            Event.stopEvent(ev);
        },
        setFooter: function(ev) {
            var str = prompt('Set footer value to: ', this.footerStr);
            if (str != null) {
                this.footerStr = str;
                Dom.get('ft').innerHTML = str;
            }
            Event.stopEvent(ev);
        },
        splitBody: function() {
            this.bodySplit = '';
            for (var i = 0; i < this.rows.length; i++) {
                this.splitBodyTemplate(Dom.get('splitBody' + i));
            }
            if (!this.storeCode) {
                this.doTemplate();
            }
        },
        splitBodyTemplate: function(tar) {
            if (tar) {
                var bSplit  = tar.options[tar.selectedIndex].value;
                var str = '';
                switch (bSplit) {
                    case '1':
                        str += '<div class="yui-g">' + "\n";
                        str += '{0}';
                        str += '</div>' + "\n";
                        break;
                    case '2':
                        str += '<div class="yui-g">' + "\n";
                        str += '    <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '    <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '</div>' + "\n";
                        break;
                    case '3':
                        str += '    <div class="yui-gb">' + "\n";
                        str += '        <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '        <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '        <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '    </div>' + "\n";
                        break;
                    case '4':
                        str += '<div class="yui-g">' + "\n";
                        str += '    <div class="yui-g first">' + "\n";
                        str += '        <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '        <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '    </div>' + "\n";
                        str += '    <div class="yui-g">' + "\n";
                        str += '        <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '        <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '    </div>' + "\n";
                        str += '</div>' + "\n";
                        break;
                    case '5':
                        str += '<div class="yui-g">' + "\n";
                        str += '    <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '    <div class="yui-g">' + "\n";
                        str += '        <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '        <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '    </div>' + "\n";
                        str += '</div>' + "\n";
                        break;
                    case '6':
                        str += '<div class="yui-g">' + "\n";
                        str += '    <div class="yui-g first">' + "\n";
                        str += '        <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '        <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '        </div>' + "\n";
                        str += '    </div>' + "\n";
                        str += '    <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '</div>' + "\n";
                        break;
                    case '7':
                        str += '<div class="yui-gc">' + "\n";
                        str += '    <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '    <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '</div>' + "\n";
                        break;
                    case '8':
                        str += '<div class="yui-gd">' + "\n";
                        str += '    <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '    <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '</div>' + "\n";
                        break;
                    case '9':
                        str += '<div class="yui-ge">' + "\n";
                        str += '    <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '    <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '</div>' + "\n";
                        break;
                    case '10':
                        str += '<div class="yui-gf">' + "\n";
                        str += '    <div class="yui-u first">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '    <div class="yui-u">' + "\n";
                        str += '{0}';
                        str += '    </div>' + "\n";
                        str += '</div>' + "\n";
                        break;
                }
                if (!this.storeCode) {
                    this.bodySplit += '<div id="gridBuilder' + (this.rows.length - 1) + '">' + str + '</div>';
                } else {
                    this.bodySplit += str;
                }
            }
        },
        mouseOver: function(ev) {
            var elm = Event.getTarget(ev);
            var path = [];
            var cont = true;
            while (cont) {
                if (elm.tagName.toLowerCase() == 'body') {
                    cont = false;
                    break;
                }
                if (elm.className) {
                    path[path.length] = elm.className;
                }
                if (elm.parentNode) {
                    elm = elm.parentNode;
                } else {
                    cont = false;
                }
            }
            this.tooltip.cfg.setProperty('text','body.' + document.body.className + ' #' + this.docType + ': ' + path.reverse().join(' : '));
        },
        showSlider: function() {
            var handleCancel = function() {
                showSlider.hide();
                return false;
            }
            var handleSubmit = function() {
                YAHOO.CSSGridBuilder.sliderData = Dom.get('sliderValue').value;

                showSlider.hide();
            }

            var myButtons = [
                { text:'Save', handler: handleSubmit, isDefault: true },
                { text:'Cancel', handler: handleCancel }
            ];

            var showSlider = new YAHOO.widget.Dialog('showSlider', {
                    close: true,
                    draggable: true,
                    modal: true,
                    visible: true,
                    fixedcenter: true,
                    width: '275px',
                    zindex: 9001,
                    postmethod: 'none',
                    buttons: myButtons
                }
            );
            showSlider.hideEvent.subscribe(function() {
                this.destroy();
            }, showSlider, true);
            showSlider.setHeader('CSSGridBuilder Custom Body Size');
            var body = '<p>Adjust the slider below to adjust your body size or set it manually with the text input. <i>(Be sure to include the % or px in the text input)</i></p>';
            body += '<form name="customBodyForm" method="POST" action="">';
            body += '<p>Current Setting: <input type="text" id="sliderValue" value="100%" size="8" onfocus="this.select()" /></p>';
            body += '<span>Unit: ';
            body += '<input type="radio" name="movetype" id="moveTypePercent" value="percent" checked> <label for="moveTypePercent">Percent</label>&nbsp;';
            body += '<input type="radio" name="movetype" id="moveTypePixel" value="pixel"> <label for="moveTypePixel">Pixel</label></span>';
            body += '</form>';
            body += '<div id="sliderbg"><div id="sliderthumb"><img src="thumb-n.gif" /></div>';
            body += '</div>';
            showSlider.setBody(body);

            
            var handleChange = function(f) {
                if (typeof f == 'object') { f = slider.getValue(); }
                if (Dom.get('moveTypePercent').checked) {
                    var w = Math.round(f / 2);
                    Dom.get('custom-doc').style.width = w + '%';
                    Dom.get('sliderValue').value = w + '%';
                } else {
                    var w = Math.round(f / 2);
                    var pix = Math.round(Dom.getViewportWidth() * (w / 100));
                    Dom.get('custom-doc').style.width = pix + 'px';
                    Dom.get('sliderValue').value = pix + 'px';
                }
                Dom.get('custom-doc').style.minWidth = '250px';
            }

            var handleBlur = function() {
                f = Dom.get('sliderValue').value;
                if (f.indexOf('%') != -1) {
                    Dom.get('moveTypePercent').checked = true;
                    f = (parseInt(f) * 2);
                } else if (f.indexOf('px') != -1) {
                    Dom.get('moveTypePixel').checked = true;
                    f = (((parseInt(f) / Dom.getViewportWidth()) * 100) * 2);
                } else {
                    Dom.get('sliderValue').value = '100%';
                    f = 200;
                }
                slider.setValue(f);
            }

            showSlider.render(document.body);
            var slider = YAHOO.widget.Slider.getHorizSlider('sliderbg', 'sliderthumb', 0, 200, 1);
            slider.setValue(200);
            slider.onChange = handleChange;
            
            Event.on(['moveTypePercent', 'moveTypePixel'], 'click', handleChange);
            Event.on('sliderValue', 'blur', handleBlur);

            this.doc.id = this.docType;
            this.doc.style.width = '100%';
            this.doTemplate();
        }
    };
})();
