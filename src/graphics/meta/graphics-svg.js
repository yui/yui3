function(Y) {
    var DOCUMENT = Y.config.doc;
	return (DOCUMENT && DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));
}
