function(Y) {
    var Win = Y.config.win;
    return !(Win && Win.File && Win.FormData && Win.XMLHttpRequest);
}