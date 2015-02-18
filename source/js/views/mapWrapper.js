define([
    'lib/news_special/bootstrap',
    'backbone',
    'views/map',
    'views/controls',
], function (news, Backbone, MapView, ControlsView) {
    return Backbone.View.extend({
        initialize: function (options) {
            this.container = options.container;
            this.mapModel = options.mapModel;
        },
        render: function () {
            this.$el.append(
                this.getMap(),
                this.getControls()
            );
            return this.$el;
        },
        getMap: function () {
            return new MapView({mapModel: this.mapModel}).render();
        },
        getControls: function () {
            return new ControlsView().render();
        }
    });
});