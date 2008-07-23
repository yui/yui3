var Y = YUI().use('dd-drop', 'dd-proxy', 'dd-constrain', 'animation', 'easing', 'io', 'cookie', 'json', function(Y) {
    var goingUp = false, lastY = 0, crossList = false;
    //Y.DD.DDM._debugShim = true;
    
    var trans = {};

    var feeds = {
        'ynews': {
            id: 'ynews',
            url: 'rss.news.yahoo.com/rss/us',
            title: 'Yahoo! US News',
            icon: 'yahoo.com/favicon.ico'
        },
        'yui': {
            id: 'yui',
            url: 'feeds.yuiblog.com/YahooUserInterfaceBlog',
            title: 'YUI Blog',
            icon: 'yahoo.com/favicon.ico'
        },
        'slashdot': {
            id: 'slashdot',
            title: 'Slashdot',
            url: 'rss.slashdot.org/Slashdot/slashdot',
            icon: 'slashdot.org/favicon.ico'
        },
        'ajaxian': {
            id: 'ajaxian',
            title: 'Ajaxian',
            url: 'feeds.feedburner.com/ajaxian',
            icon: 'ajaxian.com/favicon.ico'
        },
        'daringfireball': {
            id: 'daringfireball',
            title: 'Daring Fireball',
            url: 'daringfireball.net/index.xml',
            icon: 'daringfireball.net/favicon.ico'
        },
        'wiredtech': {
            id: 'wiredtech',
            title: 'Wire: Tech Biz',
            url: 'www.wired.com/rss/techbiz.xml',
            icon: 'www.wired.com/favicon.ico'
        },
        'techcrunch': {
            id: 'techcrunch',
            title: 'TechCrunch',
            url: 'feeds.feedburner.com/Techcrunch',
            icon: 'techcrunch.com/favicon.ico'
        },
        'smashing': {
            id: 'smashing',
            title: 'Smashing Magazine',
            url: 'www.smashingmagazine.com/wp-rss.php',
            icon: 'www.smashingmagazine.com/favicon.ico'
        }
    };

	Y.io.transport({
		id: 'flash',
		yid: Y.id,
		src: 'assets/io.swf'
    });

    var stopper = function(e) {
        e.stopPropagation();
    };


    var _setCookies = function() {
        var dds = Y.DD.DDM._drags;
        var list = {};
        Y.each(dds, function(v, k) {
            var par = v.get('node').get('parentNode');
            if (par.test('ul.list')) {
                if (!list[par.get('id')]) {
                    list[par.get('id')] = [];
                }
            }
        });
        Y.each(list, function(v, k) {
            var lis = Y.Node.get('#' + k).queryAll('li.item');
            lis.each(function(v2, k2) {
                var dd = Y.DD.DDM.getDrag('#' + v2.get('id'));
                var mod = dd.get('node').query('div.mod');
                var min = (mod.hasClass('minned')) ? true : false;
                list[k][list[k].length] = { id: dd.get('data').id, min: min };
            });
        });
        var cookie = Y.JSON.stringify(list);
        Y.Cookie.setSub('yui', 'portal', cookie);
    };


    //Handle the node:click event
    /* {{{ */
    var _nodeClick = function(e) {
        if (e.target.test('a')) {
            //e.halt();
            var a = e.target;
            var anim = null;
            var div = a.get('parentNode').get('parentNode');
            if (a.hasClass('min')) {
                var ul = div.query('ul'),
                    h2 = div.query('h2'),
                h = h2.get('offsetHeight'),
                hUL = ul.get('offsetHeight'),
                inner = div.query('div.inner');

                anim = new Y.Anim({
                    node: inner
                });
                if (!div.hasClass('minned')) {
                    anim.setAtts({
                        to: {
                            height: 0
                        },
                        duration: '.25',
                        easing: Y.Easing.easeOut,
                        iteration: 1
                    });
                    anim.on('end', function() {
                        div.toggleClass('minned');
                        _setCookies();
                    });
                } else {
                    anim.setAtts({
                        to: {
                            height: (hUL)
                        },
                        duration: '.25',
                        easing: Y.Easing.easeOut,
                        iteration: 1
                    });
                    div.toggleClass('minned');
                    _setCookies();
                }
                anim.run();

            }
            if (a.hasClass('close')) {
                var li = div.get('parentNode');
                var id = li.get('id');
                var dd = Y.DD.DDM.getDrag('#' + id);
                var data = dd.get('data');
                var item = Y.Node.get('#' + data.id);


                dd.destroy();
                anim = new Y.Anim({
                    node: div,
                    to: {
                        opacity: 0
                    },
                    duration: '.25',
                    easing: Y.Easing.easeOut
                });
                anim.on('end', function() {
                    var anim = new Y.Anim({
                        node: div,
                        to: {
                            height: 0
                        },
                        duration: '.25',
                        easing: Y.Easing.easeOut
                    });
                    anim.on('end', function() {
                        li.get('parentNode').removeChild(li);
                        item.removeClass('disabled');

                        var dd2 = new Y.DD.Drag({
                            node: item,
                            proxy: true,
                            moveOnEnd: false,
                            data: data
                        });
                        dd2.on('drag:start', stopper);
                        dd2.on('drag:end', stopper);
                        dd2.on('drag:drophit', stopper);
                        _setCookies();

                    });
                    anim.run();
                });
                anim.run();
            }
            e.halt();
        }
    };
    /* }}} */
    
    
    var setupModDD = function(mod, data, dd) {
        var node = mod;
        node.query('h2').on('click', _nodeClick);
        
        dd.set('target', true);
        dd.unsubscribe('drag:start', stopper);
        dd.unsubscribe('drag:end', stopper);
        dd.unsubscribe('drag:drophit', stopper);

        dd.addHandle('h2').addInvalid('a');
        dd._unprep();
        dd.set('node', mod);
        dd._prep();

        
        var url = 'http:/'+'/pipes.yahooapis.com/pipes/pipe.run?_id=6b7b2c6a32f5a12e7259c36967052387&_render=json&url=http:/'+'/' + data.url;
        var id = Y.io(url, {
            method: 'GET',
            xdr: { 
			    use:'flash',
			    responseXML:false
		    },
		    on: { 
			    success: function(id, data) {
                    var d = feeds[trans[id]];
                    var inner = d.mod.query('div.inner');
                    var oRSS = Y.JSON.parse(data.responseText);
                    var html = '';
		            if (oRSS && oRSS.count) {
			            Y.each(oRSS.value.items, function(v, k) {
                            if (k < 5) {
                                html += '<li><a href="' + v.link + '" target="_blank">' + v.title + '</a>';//<p>' + v.description + '</p></li>';
                            }
                        });
		            }
                    inner.set('innerHTML', '<ul>' + html + '</ul>');
                    if (Y.DD.DDM.activeDrag) {
                        var proxy_inner = Y.DD.DDM.activeDrag.get('dragNode').query('div.inner');
                        proxy_inner.set('innerHTML', '<ul>' + html + '</ul>');
                        
                    }
                },
			    failure: function(id, data) {
                    alert('Feed failed to load..' + id + ' :: ' + data);
                }
		    }
        });
        feeds[data.id].trans = id;
        feeds[data.id].mod = mod;
        trans[id.id] = data.id;
        
    };
    


    var createMod = function(feed) {
        var str = '<li class="item">' +
                    '<div class="mod">' + 
                        '<h2>' + feed.title + ' <a title="minimize module" class="min" href="#"> </a>' +
                        '<a title="close module" class="close" href="#"></a></h2>' +
                        '<div class="inner">' +
                        '    <div class="loading">Feed loading, please wait..</div>' + 
                        '</div>' +
                    '</div>' +
                '</li>';
        return Y.Node.create(str);
    };

    var _handleStart = function(e) {
        stopper(e);
        var drag = this;
        var list3 = Y.Node.get('#list1');
        var mod = createMod(drag.get('data'));
        list3.appendChild(mod);
        drag.get('node').addClass('disabled');

        drag.set('node', mod);
        drag.get('dragNode').setStyles({
            opacity: '.5',
            border: 'none',
            width: '320px',
            height: '61px'
        });
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('node').query('div.mod').setStyle('visibility', 'hidden');
        drag.get('node').addClass('moving');
        setupModDD(mod, drag.get('data'), drag);

        this.unsubscribe('drag:start', _handleStart);
    };

    var feedList = Y.Node.get('#feeds ul');
    Y.each(feeds, function(v, k) {
        var li = Y.Node.create('<li id="' + k + '">' + v.title + '</li>');
        li.setStyle('backgroundImage', 'url(http:/'+'/' + v.icon + ')');
        feedList.appendChild(li);

        var dd = new Y.DD.Drag({
            node: li,
            proxy: true,
            moveOnEnd: false,
            borderStyle: 'none',
            data: v
        });
        dd.on('drag:start', _handleStart);
        dd.on('drag:end', stopper);
        dd.on('drag:drophit', stopper);
    });

 
    //Handle the drop:enter event
    Y.DD.DDM.on('drop:enter', function(e) {
        if (!e.drag || !e.drop || (e.drop !== e.target)) {
            return false;
        }
        if (e.drag.get('node').hasClass('item')) {
            var drag = e.drag, drop = e.drop,
                dragNode = drag.get('node'),
                dropNode = drop.get('node'),
                middle = drop.region.top + ((drop.region.bottom - drop.region.top) / 2);
            
            if (dropNode !== null) {
                if (!goingUp && (drag.mouseXY[1] < middle) && !crossList) {
                    dropNode = dropNode.get('nextSibling');
                }
                crossList = false;
                if (dropNode && dropNode.get('parentNode')) {
                    dropNode.get('parentNode').insertBefore(dragNode, dropNode);
                }
            }
            Y.Lang.later(50, Y, function() {
                Y.DD.DDM.syncActiveShims(true);
            });
        }
    });

    //Handle the drag:drag event
    Y.DD.DDM.on('drag:drag', function(e) {
        var y = e.target.mouseXY[1];
        if (y < lastY) {
            goingUp = true;
        } else {
            goingUp = false;
        }
        lastY = y;
    });

    //Handle the drop:hit event
    Y.DD.DDM.on('drag:drophit', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
            }
        }
    });

    //Handle the drag:start event
    Y.DD.DDM.on('drag:start', function(e) {
        var drag = e.target;
        if (drag.target) {
            drag.target.set('locked', true);
        }
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyle('opacity','.5');
        drag.get('node').query('div.mod').setStyle('visibility', 'hidden');
        drag.get('node').addClass('moving');
    });

    //Handle the drag:end event
    Y.DD.DDM.on('drag:end', function(e) {
        var drag = e.target;
        if (drag.target) {
            drag.target.set('locked', false);
        }
        drag.get('node').setStyle('visibility', '');
        drag.get('node').query('div.mod').setStyle('visibility', '');
        drag.get('node').removeClass('moving');
        drag.get('dragNode').set('innerHTML', '');
        _setCookies();
    });
    


    Y.DD.DDM.on('drop:over', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
            }
        }
    });

    //Create simple targets for the main lists..
    var uls = Y.Node.get('#play').queryAll('ul.list');
    Y.each(uls, function(v, k, items) {
        var tar = new Y.DD.Drop({
            node: items.item(k),
            padding: '10'
        });
        tar.on('drop:enter', function() {
            crossList = true;
        });
    });
    
    Y.Event.addListener(window, 'load', function() {
        Y.Lang.later(500, this, function() {
            var cookie = Y.Cookie.getSub('yui', 'portal');
            if (cookie) {
                var obj = Y.JSON.parse(cookie);
                Y.each(obj, function(v, k) {
                    var list = Y.Node.get('#' + k);
                    Y.each(v, function(v2, k2) {
                        var drag = Y.DD.DDM.getDrag('#' + v2.id);

                        var mod = createMod(drag.get('data'));
                        if (v2.min) {
                            
                            mod.query('div.mod').addClass('minned');
                            mod.query('div.inner').setStyle('height', '0px');
                        }
                        list.appendChild(mod);
                        drag.get('node').addClass('disabled');
                        drag.set('node', mod);
                        drag.set('dragNode', Y.DD.DDM._proxy);
                        drag.unsubscribe('drag:start', _handleStart);
                        drag.unsubscribe('drag:end', stopper);
                        drag.unsubscribe('drag:drophit', stopper);
                        drag._unprep();
                        
                        setupModDD(mod, drag.get('data'), drag);
                    });
                });
            }
        });
    });
    
    


});
