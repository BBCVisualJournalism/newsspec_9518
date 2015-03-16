define([
    'backbone',
    'lib/news_special/bootstrap'
], function (Backbone, news) {
    return Backbone.Model.extend({
        url: function () {
            if (this.mapModel.get('language') === 'english') {
                if (this.mapModel.get('isResultsMode')) {
                    /* ENGLISH RESULTS MODE */
                    return 'https://api.myjson.com/bins/u70v';
                } else {
                    /* ENGLISH CAMPAIGN MODE */
                    return 'https://api.myjson.com/bins/u70v';
                }
            } else {
                if (this.mapModel.get('isResultsMode')) {
                    /* WELSH RESULTS MODE */
                    return 'https://api.myjson.com/bins/u70v';
                } else {
                    /* WELSH CAMPAIGN MODE */
                    return 'https://api.myjson.com/bins/u70v';
                }
            }
        },
        initialize: function (options) {
            var _this = this;
            this.mapModel = options.mapModel;
            this.fetch().done(function () {
                news.pubsub.emit('map:fetchedData');
            });
        }
    });
});