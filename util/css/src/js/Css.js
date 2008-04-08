YUI.add(function (Y) {

var sn = Y.node.create(['style',{type:'text/css'}]),
    ss,
    idx = {};

Y.onContentReady('head',function () {
    this.appendChild(sn);
    ss = sn.styleSheet || sn.sheet;

Y.css = ss.addRule ?
    function (sel,props) { // For IE and Safari
        if (!_idx[sel]) {
            idx[sel] = ss.rules.length;
            ss.addRule(sel,'clip:auto');
        }
        Y.mix(ss.rules[idx[sel]].style,props);
    } :
    function (sel,props) { // For W3C
        if (!idx[sel]) {
            idx[sel] = ss.cssRules.length;
            ss.insertRule(sel+' {}',idx[sel]);
        }
        Y.mix(ss.cssRules[idx[sel]].style,props);
    };

Y.mix(Y.css, {
    add    : Y.css,
    remove : ss.removeRule ?
        function (sel) {
            if (idx[sel] !== undefined) {
                ss.removeRule(_idx[sel]);
                idx[sel] = undefined;
            }
        } :
        function (sel) {
            if (idx[sel] !== undefined) {
                ss.deleteRule(idx[sel]);
                idx[sel] = undefined;
            }
        }
});

});

},'3.0.0');
