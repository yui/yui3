YUI.add('unicode-data-accentfold', function (Y) {

// This is an imperfect, incomplete reverse mapping of ASCII letters to
// case-insensitive regexes that match their most common accented forms. The
// goal here is to provide a pragmatic and generally useful set of accent
// folding data, since serving and performing lookups on a complete dataset 
// would be impractical.
//
// Whenever possible, accent folding should be done on the server, where it's
// possible to use tools that are both more complete and more performant. It
// should only be done on the client as an absolute last resort.
Y.namespace('Unicode.Data').AccentFold = {
    a: /[à-åāăąǎǟǡǻȁȃȧḁẚạảấầẩẫậắằẳẵặ]/gi,
    b: /[ḃḅḇ]/gi,
    c: /[çćĉċčḉ]/gi,
    d: /[ďḋḍḏḑḓ]/gi,
    e: /[è-ëēĕėęěȅȇȩḕḗḙḛḝẹẻẽếềểễệ]/gi,
    f: /ḟ/gi,
    g: /[ĝğġģǧǵḡ]/gi,
    h: /[ĥȟḣḥḧḩḫẖℎ]/gi,
    i: /[ì-ïĩīĭįǐȉȋḭḯỉị]/gi,
    j: /[ĵǰ]/gi,
    k: /[ķǩḱḳḵ]/gi,
    l: /[ĺļľŀḷḹḻḽ]/gi,
    m: /[ḿṁṃ]/gi,
    n: /[ñńņňǹṅṇṉṋ]/gi,
    o: /[ò-öōŏőơǒǫǭȍȏȫȭȯȱṍṏṑṓọỏốồổỗộớờởỡợ]/gi,
    p: /[ṕṗ]/gi,
    q: /ʠ/gi,
    r: /[ŕŗřȑȓṙṛṝṟ]/gi,
    s: /[śŝşšșṡṣṥṧṩ]/gi,
    t: /[ţťțṫṭṯṱẗ]/gi,
    u: /[ù-üũūŭůűųưǔǖǘǚǜȕȗṳṵṷṹṻụủứừửữự]/gi,
    v: /[ṽṿ]/gi,
    w: /[ŵẁẃẅẇẉẘ]/gi,
    x: /[ẋẍ]/gi,
    y: /[ýÿŷȳẏẙỳỵỷỹ]/gi,
    z: /[źżžẑẓẕ]/gi
};

}, '@VERSION@');
