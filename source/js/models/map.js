define([
    'backbone',
    'models/dataFeed',
    'models/partyColours'
], function (Backbone, DataFeed, PartyColours) {
    return Backbone.Model.extend({
        defaults: {
            'isResultsMode': true,
            'width': 480,
            'height': 538,
            'locator': true,
            'pulloutShetland': false,
            'repIreland': false,
            'translate': [140, 150],
            'scale': 1,
            'maxScaleOut': 1,
            'maxScaleIn': 40,
            'center': [230, 107],
            'locatorCenter': [230, 107]
        },
        initialize: function () {
            this.set('dataFeed', new DataFeed({mapModel: this}));
            if (this.get('isResultsMode'))  {
                this.set('partyColours', new PartyColours());
            }
        }
    });
});