define([
    'backbone'
], function (Backbone) {
    return Backbone.Model.extend({
        url: function () {
            return (this.mapModel.get('isResultsMode')) ? 'https://api.myjson.com/bins/3xbsn' : 'https://api.myjson.com/bins/3xbsn';
        },
        initialize: function (options) {
            var _this = this;
            this.mapModel = options.mapModel;
            this.fetch();
        }
    });
});