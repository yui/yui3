function (Y) {
    var testFeature = Y.Features.test;

    ret =  (!testFeature('style', 'opacity') &&
            !testFeature('style', 'computedStyle'));

    return ret;
}

