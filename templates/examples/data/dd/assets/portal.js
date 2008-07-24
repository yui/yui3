//Use loader to grab the modules needed
YUI({
    base: '../../build/',
    timeout: 1000
}).use('dd-drop', 'dd-proxy', 'dd-constrain', 'animation', 'io', 'cookie', 'json', function(Y) {
    //TODO - Pending loader fix
    Y.use('easing');

    //Setup some private variables..
    var goingUp = false, lastY = 0, crossList = false, trans = {};

    //The list of feeds that we are going to use
    var feeds = {
        'ynews': {
            id: 'ynews',
            title: 'Yahoo! US News',
            url: 'rss.news.yahoo.com/rss/us'
        },
        'yui': {
            id: 'yui',
            title: 'YUI Blog',
            url: 'feeds.yuiblog.com/YahooUserInterfaceBlog'
        },
        'slashdot': {
            id: 'slashdot',
            title: 'Slashdot',
            url: 'rss.slashdot.org/Slashdot/slashdot'
        },
        'ajaxian': {
            id: 'ajaxian',
            title: 'Ajaxian',
            url: 'feeds.feedburner.com/ajaxian'
        },
        'daringfireball': {
            id: 'daringfireball',
            title: 'Daring Fireball',
            url: 'daringfireball.net/index.xml'
        },
        'wiredtech': {
            id: 'wiredtech',
            title: 'Wire: Tech Biz',
            url: 'www.wired.com/rss/techbiz.xml'
        },
        'techcrunch': {
            id: 'techcrunch',
            title: 'TechCrunch',
            url: 'feeds.feedburner.com/Techcrunch'
        },
        'smashing': {
            id: 'smashing',
            title: 'Smashing Magazine',
            url: 'www.smashingmagazine.com/wp-rss.php'
        }
    };

    //Setup the config for IO to use flash
	Y.io.transport({
		id: 'flash',
		yid: Y.id,
		src: 'assets/io.swf'
    });
    
    //Simple method for stopping event propagation
    //Using this so we can unsubscribe it later
    var stopper = function(e) {
        e.stopPropagation();
    };

    //Get the order, placement and minned state of the modules and save them to a cookie
    var _setCookies = function() {
        var dds = Y.DD.DDM._drags;
        var list = {};
        //Walk all the drag elements
        Y.each(dds, function(v, k) {
            var par = v.get('node').get('parentNode');
            //Find all the lists with drag items in them
            if (par.test('ul.list')) {
                if (!list[par.get('id')]) {
                    list[par.get('id')] = [];
                }
            }
        });
        //Walk the list
        Y.each(list, function(v, k) {
            //Get all the li's in the list
            var lis = Y.Node.get('#' + k).queryAll('li.item');
            lis.each(function(v2, k2) {
                //Get the drag instance for the list item
                var dd = Y.DD.DDM.getDrag('#' + v2.get('id'));
                //Get the mod node
                var mod = dd.get('node').query('div.mod');
                //Is it minimized
                var min = (mod.hasClass('minned')) ? true : false;
                //Setup the cookie data
                list[k][list[k].length] = { id: dd.get('data').id, min: min };
            });
        });
        //JSON encode the cookie data
        var cookie = Y.JSON.stringify(list);
        //Set the sub-cookie
        Y.Cookie.setSub('yui', 'portal', cookie);
    };

    //Helper method for creating the feed DD on the left
    var _createFeedDD = function(node, data) {
        //Create the DD instance
        var dd = new Y.DD.Drag({
            node: node,
            proxy: true,
            moveOnEnd: false,
            borderStyle: 'none',
            data: data
        });
        //Setup some stopper events
        dd.on('drag:start', _handleStart);
        dd.on('drag:end', stopper);
        dd.on('drag:drophit', stopper);
    };

    //Handle the node:click event
    /* {{{ */
    var _nodeClick = function(e) {
        //Is the target an href?
        if (e.target.test('a')) {
            var a = e.target, anim = null, div = a.get('parentNode').get('parentNode');
            //Did they click on the min button
            if (a.hasClass('min')) {
                //Get some node references
                var ul = div.query('ul'),
                    h2 = div.query('h2'),
                h = h2.get('offsetHeight'),
                hUL = ul.get('offsetHeight'),
                inner = div.query('div.inner');
                
                //Create an anim instance on this node.
                anim = new Y.Anim({
                    node: inner
                });
                //Is it expanded?
                if (!div.hasClass('minned')) {
                    //Set the vars for collapsing it
                    anim.setAtts({
                        to: {
                            height: 0
                        },
                        duration: '.25',
                        easing: Y.Easing.easeOut,
                        iteration: 1
                    });
                    //On the end, toggle the minned class
                    //Then set the cookies for state
                    anim.on('end', function() {
                        div.toggleClass('minned');
                        _setCookies();
                    });
                } else {
                    //Set the vars for expanding it
                    anim.setAtts({
                        to: {
                            height: (hUL)
                        },
                        duration: '.25',
                        easing: Y.Easing.easeOut,
                        iteration: 1
                    });
                    //Toggle the minned class
                    //Then set the cookies for state
                    div.toggleClass('minned');
                    _setCookies();
                }
                //Run the animation
                anim.run();

            }
            //Was close clicked?
            if (a.hasClass('close')) {
                //Get some Node references..
                var li = div.get('parentNode'),
                    id = li.get('id'),
                    dd = Y.DD.DDM.getDrag('#' + id),
                    data = dd.get('data'),
                    item = Y.Node.get('#' + data.id);

                //Destroy the DD instance.
                dd.destroy();
                //Setup the animation for making it disappear
                anim = new Y.Anim({
                    node: div,
                    to: {
                        opacity: 0
                    },
                    duration: '.25',
                    easing: Y.Easing.easeOut
                });
                anim.on('end', function() {
                    //On end of the first anim, setup another to make it collapse
                    var anim = new Y.Anim({
                        node: div,
                        to: {
                            height: 0
                        },
                        duration: '.25',
                        easing: Y.Easing.easeOut
                    });
                    anim.on('end', function() {
                        //Remove it from the document
                        li.get('parentNode').removeChild(li);
                        item.removeClass('disabled');
                        //Setup a drag instance on the feed list
                        _createFeedDD(item, data);
                        _setCookies();

                    });
                    //Run the animation
                    anim.run();
                });
                //Run the animation
                anim.run();
            }
            //Stop the click
            e.halt();
        }
    };
    /* }}} */
    
    //This creates the module, either from a drag event or from the cookie load
    var setupModDD = function(mod, data, dd) {
        var node = mod;
        //Listen for the click so we can react to the buttons
        node.query('h2').on('click', _nodeClick);
        
        //It's a target
        dd.set('target', true);
        //Remove the event's on the original drag instance
        dd.unsubscribe('drag:start', stopper);
        dd.unsubscribe('drag:end', stopper);
        dd.unsubscribe('drag:drophit', stopper);
        
        //Setup the handles
        dd.addHandle('h2').addInvalid('a');
        //Remove the mouse listeners on this node
        dd._unprep();
        //Update a new node
        dd.set('node', mod);
        //Reset the mouse handlers
        dd._prep();

        //The Yahoo! Pipes URL
        var url = 'http:/'+'/pipes.yahooapis.com/pipes/pipe.run?_id=6b7b2c6a32f5a12e7259c36967052387&_render=json&url=http:/'+'/' + data.url;
        //Start the XDR request
        var id = Y.io(url, {
            method: 'GET',
            xdr: { 
			    use:'flash'
		    },
            //XDR Listeners
		    on: { 
			    success: function(id, data) {
                    //On success get the feed data
                    var d = feeds[trans[id]],
                    //Node reference
                    inner = d.mod.query('div.inner'),
                    //Parse the JSON data
                    oRSS = Y.JSON.parse(data.responseText),
                    html = '';
                    
                    //Did we get data?
		            if (oRSS && oRSS.count) {
                        //Walk the list and create the news list
			            Y.each(oRSS.value.items, function(v, k) {
                            if (k < 5) {
                                html += '<li><a href="' + v.link + '" target="_blank">' + v.title + '</a>';
                            }
                        });
		            }
                    //Set the innerHTML of the module
                    inner.set('innerHTML', '<ul>' + html + '</ul>');
                    if (Y.DD.DDM.activeDrag) {
                        //If we are still dragging, update the proxy element too..
                        var proxy_inner = Y.DD.DDM.activeDrag.get('dragNode').query('div.inner');
                        proxy_inner.set('innerHTML', '<ul>' + html + '</ul>');
                        
                    }
                },
			    failure: function(id, data) {
                    //Something failed..
                    alert('Feed failed to load..' + id + ' :: ' + data);
                }
		    }
        });
        //Keep track of the transaction
        feeds[data.id].trans = id;
        feeds[data.id].mod = mod;
        trans[id.id] = data.id;
    };
    

    //Helper method to create the markup for the module..
    var createMod = function(feed) {
        var str = '<li class="item">' +
                    '<div class="mod">' + 
                        '<h2><strong>' + feed.title + '</strong> <a title="minimize module" class="min" href="#"> </a>' +
                        '<a title="close module" class="close" href="#"></a></h2>' +
                        '<div class="inner">' +
                        '    <div class="loading">Feed loading, please wait..</div>' + 
                        '</div>' +
                    '</div>' +
                '</li>';
        return Y.Node.create(str);
    };
    
    //Handle the start Drag event on the left side
    var _handleStart = function(e) {
        //Stop the event
        stopper(e);
        //Some private vars
        var drag = this,
            list3 = Y.Node.get('#list1'),
            mod = createMod(drag.get('data'));
        
        //Add it to the first list
        list3.appendChild(mod);
        //Set the item on the left column disabled.
        drag.get('node').addClass('disabled');
        //Set the node on the instance
        drag.set('node', mod);
        //Add some styles to the proxy node.
        drag.get('dragNode').setStyles({
            opacity: '.5',
            borderStyle: 'none',
            width: '320px',
            height: '61px'
        });
        //Update the innerHTML of the proxy with the innerHTML of the module
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        //set the inner module to hidden
        drag.get('node').query('div.mod').setStyle('visibility', 'hidden');
        //add a class for styling
        drag.get('node').addClass('moving');
        //Setup the DD instance
        setupModDD(mod, drag.get('data'), drag);

        //Remove the listener
        this.unsubscribe('drag:start', _handleStart);
    };
    
    //Walk through the feeds list and create the list on the left
    var feedList = Y.Node.get('#feeds ul');
    Y.each(feeds, function(v, k) {
        var li = Y.Node.create('<li id="' + k + '">' + v.title + '</li>');
        feedList.appendChild(li);
        //Create the DD instance for this item
        _createFeedDD(li, v);
    });

 
    /*
    Handle the drop:enter event
    Now when we get a drop enter event, we check to see if the target is an LI, then we know it's out module.
    Here is where we move the module around in the DOM.    
    */
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
    //On drag we need to know if they are moved up or down so we can place the module in the proper DOM location.
    Y.DD.DDM.on('drag:drag', function(e) {
        var y = e.target.mouseXY[1];
        if (y < lastY) {
            goingUp = true;
        } else {
            goingUp = false;
        }
        lastY = y;
    });

    /*
    Handle the drop:hit event
    Now that we have a drop on the target, we check to see if the drop was not on a LI.
    This means they dropped on the empty space of the UL.
    */
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
    //Use some CSS here to make our dragging better looking.
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
    //Replace some of the styles we changed on start drag.
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
    

    //Handle going over a UL, for empty lists
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
    
    Y.on('io:xdrReady', function() {
        //Get the cookie data
        var cookie = Y.Cookie.getSub('yui', 'portal');
        if (cookie) {
            //JSON parse the stored data
            var obj = Y.JSON.parse(cookie);

            //Walk the data
            Y.each(obj, function(v, k) {
                //Get the node for the list
                var list = Y.Node.get('#' + k);
                //Walk the items in this list
                Y.each(v, function(v2, k2) {
                    //Get the drag for it
                    var drag = Y.DD.DDM.getDrag('#' + v2.id);
                    //Create the module
                    var mod = createMod(drag.get('data'));
                    if (v2.min) {
                        //If it's minned add some CSS
                        mod.query('div.mod').addClass('minned');
                        mod.query('div.inner').setStyle('height', '0px');
                    }
                    //Add it to the list
                    list.appendChild(mod);
                    //Set the drag listeners
                    drag.get('node').addClass('disabled');
                    drag.set('node', mod);
                    drag.set('dragNode', Y.DD.DDM._proxy);
                    drag.unsubscribe('drag:start', _handleStart);
                    drag.unsubscribe('drag:end', stopper);
                    drag.unsubscribe('drag:drophit', stopper);
                    drag._unprep();
                    //Setup the new Drag listeners
                    setupModDD(mod, drag.get('data'), drag);
                });
            });
        }
    });

});
