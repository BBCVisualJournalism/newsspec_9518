define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            'locator': true,
            'pulloutShetland': false,
            'repIreland': false,
            'translate': [140, 150],
            'scale': 1,
            'maxScaleOut': 1,
            'center': [187, 168]
        }
    });
});