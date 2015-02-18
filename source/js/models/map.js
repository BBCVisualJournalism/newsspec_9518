define([
    'backbone',
], function (Backbone) {
    return Backbone.Model.extend({
        defaults: {
            'translate': [140, 150]
        }
    });
});