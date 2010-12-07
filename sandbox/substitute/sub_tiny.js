var SEARCH  = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;

Y.Lang.sub = function (s, o) {
    return ((s.replace) ? s.replace(SEARCH, function (match, key) {
        console.log('SUB: ' + key);
        return o[key] || match;
    } : s);
};
