define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            'width': 480,
            'height': 538,
            'locator': true,
            'pulloutShetland': false,
            'repIreland': false,
            'translate': [140, 150],
            'scale': 1,
            'maxScaleOut': 1,
            'center': [230, 107],
            'locatorCenter': [230, 107]
        }
    });
});