function(Y) {
    var DOCUMENT = Y.config.doc,
		canvas = DOCUMENT.createElement("canvas");
    return (!DOCUMENT.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && (!canvas || !canvas.getContext || !canvas.getContext("2d")));
}
