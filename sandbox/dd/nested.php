<html>
<head>
	<title></title>
	<style type="text/css">
	body {
		font: 1em Arial, sans-serif;
	}

	.portlet {
		border: 1px solid #ccc;
		float: left;
		margin: 10px;
		width: 100%;
	}

	.portlet .portlet {
		height: 300px;
		width: 300px;
	}

	h1 {
		font-size: 16px;
		background-color: #ccc;
		cursor: move;
	}
	</style>
</head>
<body>
	<div id="wrapper">
		<div class="portlet">
			<h1>Handle</h1>
			Drag Container 1<br />

			<div class="portlet">
				<h1>Handle</h1>
				Nested Drag Container A
			</div>

			<div class="portlet">
				<h1>Handle</h1>
				Nested Drag Container B
			</div>

			<div class="portlet">
				<h1>Handle</h1>
				Nested Drag Container C
			</div>
		</div>	
	</div>
<script type="text/javascript" src="http://yui.yahooapis.com/3.2.0/build/yui/yui-min.js"></script>
<!--script type="text/javascript" src="http://yui.yahooapis.com/3.1.0/build/event/event-delegate.js"></script-->

	<script type="text/javascript">
        YUI({ allowRollup: false}).use('event-delegate', function(Y) {
            Y.delegate('mousedown', function(e) {
                console.log('Delegate Mousedown');
                e.halt();
                console.log('Delegate event halted..');
            }, '#wrapper', '.portlet');
		});
	</script>

</body>
</html>
