define([
    'lib/news_special/bootstrap',
    'backbone',
    'views/map',
    'views/controls',
    'views/panel'
], function (news, Backbone, MapView, ControlsView, PanelView) {
    return Backbone.View.extend({
        className: 'map-wrapper',
        initialize: function (options) {
            this.container = options.container;
            this.mapModel = options.mapModel;
        },
        render: function () {
            this.$el.append(
                this.getMap(),
                this.getControls(),
                this.getPanel()
            );
            return this.$el;
        },
        getMap: function () {
            return new MapView({mapModel: this.mapModel}).render();
        },
        getControls: function () {
            return new ControlsView().render();
        },
        getPanel: function () {
            return new PanelView().render();
        }
    });
});