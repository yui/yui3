YUI().use('*', function(Y) {
	var
		firstPage = 1,
		pageNumber = firstPage,
		base_url = 'http://' + location.host + location.pathname,
		draw_page = function(n){
			pageNumber = n;
			Y.one('#page-number').set('innerHTML', n);
			Y.one('a').set('href', '#page=' + (n + 1));
			
			// don't set anchor when firstPage is visited w/o an anchor
			if (n === firstPage && location.href === base_url) return

			// the `true` arguments means "don't fire a history change event"
			Y.HistoryLite.add({page: n}, true);
			
		},
		draw_anchor = function(){
			var	page = parseInt(Y.HistoryLite.get('page'));
			if (page) {	draw_page(page); }
		},
		next = function(){ draw_page(pageNumber + 1); };
	
	draw_anchor();
	Y.one('#next').on('click', function(e){	e.halt(); next(); });
	Y.on('key', next, Y.UA.gecko ? document : document.body, 'down:39');
	Y.on('history-lite:change', function(){
		console.log('history-lite:change event fired');
        draw_anchor();
	});
	
});
