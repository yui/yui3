YUI.add('recordset-sort-tests', function(Y){

	var suite = new Y.Test.Suite('recordset-sort Examples Test'),
		isTrue = Y.Assert.isTrue,
		isNotNull = Y.Assert.isNotNull,
		areSame = Y.Assert.areSame,
		areNotSame = Y.Assert.areNotSame,
		azStates = ['alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'florida', 'georgia'],
		customStates = ['california', 'florida', 'georgia', 'arizona', 'colorado', 'alabama', 'connecticut', 'arkansas', 'alaska', 'delaware'];

	suite.add(new Y.Test.Case({
		name: 'testing recordset sort plugin',

		'should have a table and 6 buttons': function() {
			var table = Y.one('#demo table'),
				buttons = Y.all('#buttonControl input[type=button]');

			isNotNull(table, 'Table doesn\'t exist.');
			areSame(6, buttons.size(), 'There are not six buttons');
		},

		'should reverse the rows in the table': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#reverseButton'),
				states = [],
				revStates = [];

			table.all('tr').each( function(row){
				var state = row.one('td').getContent();
				states.push(state.toLowerCase());
			});

			btn.simulate('click');

			this.wait(function() {
				table.all('tr').each( function(row){
					var state = row.one('td').getContent();
					revStates.push(state.toLowerCase());
				});

				areSame(states.length, revStates.length, 'Not all rows are accounted for.');

				Y.Array.each(states, function(state, index) {
					var revState = revStates[revStates.length - index - 1];
					areSame(state, revState, state + ' is not the same as ' + revState + '.');
				});
			}, 200);

		},

		'should sort rows in a specific order': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#customButton'),
				states = customStates,
				sortedStates = [];

			btn.simulate('click');

			this.wait(function() {
				table.all('tr').each( function(row){
					var state = row.one('td').getContent();
					sortedStates.push(state.toLowerCase());
				});

				areSame(states.length, sortedStates.length, 'Not all rows are accounted for.');

				Y.Array.each(states, function(state, index) {
					var sortedState = sortedStates[index];
					areSame(state, sortedState, state + ' is not the same as ' + sortedState + '.');
				});
			}, 500);

		},

		'should sort rows in a-z order': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#sortButton'),
				states = azStates,
				sortedStates = [];

			btn.simulate('click');

			this.wait(function() {
				table.all('tr').each( function(row){
					var state = row.one('td').getContent();
					sortedStates.push(state.toLowerCase());
				});

				areSame(states.length, sortedStates.length, 'Not all rows are accounted for.');

				Y.Array.each(states, function(state, index) {
					var sortedState = sortedStates[index];
					areSame(state, sortedState, state + ' is not the same as ' + sortedState + '.');
				});
			}, 500);

		},

		'shuffle everything up': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#shuffleButton'),
				rowCount = table.all('tr').size();

			btn.simulate('click');

			this.wait(function() {
				areSame(rowCount, table.all('tr').size(), 'Not all rows are accounted for.');
			}, 500);
		},

		'resort records': function() {
			var table = Y.one('#demo table tbody'),
				resortBtn = Y.one('#resortButton'),
				shuffleBtn = Y.one('#shuffleButton'),
				sortBtn = Y.one('#sortButton'),
				rowCount = table.all('tr').size(),
				states = azStates,
				sortedStates = [],
				test = this;

			sortBtn.simulate('click');
			shuffleBtn.simulate('click');

			test.wait(function() {

				areSame(rowCount, table.all('tr').size(), 'Not all rows are accounted for.');

				resortBtn.simulate('click');

				test.wait(function() {

					table.all('tr').each( function(row){
						var state = row.one('td').getContent();
						sortedStates.push(state.toLowerCase());
					});

					areSame(states.length, sortedStates.length, 'Not all rows are accounted for.');

					Y.Array.each(states, function(state, index) {
						var sortedState = sortedStates[index];
						areSame(state, sortedState, state + ' is not the same as ' + sortedState + '.');
					});
				}, 500);
			}, 500);

		},

		'flip records': function() {
			var table = Y.one('#demo table tbody'),
				btn = Y.one('#flipButton'),
				states = [],
				revStates = [];

			table.all('tr').each( function(row){
				var state = row.one('td').getContent();
				states.push(state.toLowerCase());
			});

			btn.simulate('click');

			this.wait(function() {
				table.all('tr').each( function(row){
					var state = row.one('td').getContent();
					revStates.push(state.toLowerCase());
				});

				areSame(states.length, revStates.length, 'Not all rows are accounted for.');

				Y.Array.each(states, function(state, index) {
					var revState = revStates[revStates.length - index - 1];
					areSame(state, revState, state + ' is not the same as ' + revState + '.');
				});
			}, 200);
		}


	}));

	Y.Test.Runner.add(suite);

}, '', {requires: ['recordset', 'test', 'node-event-simulate']});