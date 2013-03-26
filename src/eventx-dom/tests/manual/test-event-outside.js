YUI({ filter: 'raw' }).use('gallery-event-konami', 'event-focus', 'event-outside', function (Y) {
    var selectors = [
            'blur','change','click','dblclick','focus','keydown','keypress',
            'keyup','mousedown','mousemove','mouseout','mouseover','mouseup',
            'select','submit','konami'
        ],
        timers = {};
    
    function setup(selector) {
        var node = Y.one('#' + selector);
        
        node.on(selector + 'outside', function (e) {
            clearTimeout(timers[selector]);
            
            var t    = e.target,
                id   = t.get('id'),
                text = t.get('tagName').toLowerCase() + (id ? '#' + id : '');
            
            this.addClass('outside');
            this.one('span').set('innerHTML', text);
            
            if (id === 'link' || selector === 'submit') {
                e.preventDefault();
            }
            
            timers[selector] = setTimeout(function () {
                node.removeClass('outside');
                node.one('span').set('innerHTML', '');
            }, 700);
        });
    }
    
    Y.Event.defineOutside('konami');
    
    Y.each(selectors, setup);
});
