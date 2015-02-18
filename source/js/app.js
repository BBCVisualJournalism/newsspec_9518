define(['lib/news_special/bootstrap', 'd3', 'lib/vendors/d3/topojson', 'lib/vendors/d3/queue', 'backbone', 'models/map', 'views/mapWrapper'], function (news, d3, Topojson, queue, Backbone, MapModel, MapWrapper) {

   

    var Router = Backbone.Router.extend({
        routes: {
            'nation/:nation': 'nation',
            'constituency/:gssid': 'constituency',
            '*default': 'ukMap'
        },

        ukMap: function () {
            this.loadMap({
                'translate': [150, 700],
                'scale': 800
            });
        },
        nation: function (nation) {
            console.log('you are viewing the ' + nation + ' map');
        },
        constituency: function (constituency) {
            console.log('you are viewing the ' + constituency + ' constituency');
        },

        loadMap: function (config) {
            var _this = this;
            queue()
                .defer(d3.json, 'maps/uk.json')
                .await(function (error, mapTopoJson) {
                    if (!error) {
                        config.topoJson = Topojson.feature(mapTopoJson, mapTopoJson.objects['boundaries']).features;
                        _this.addMapWrapper(config);
                    } else {
                        throw 'Error: Unable to load one of the dependencies. (' + error.responseText + ')';
                    }
                });
        },
        addMapWrapper: function (config) {
            var container = news.$('.main'),
                mapModel = new MapModel(config),
                mapWrapper = new MapWrapper({mapModel: mapModel});

            container.html(mapWrapper.render());
        }
    });

    var appRouter = new Router();
    Backbone.history.start();

    news.sendMessageToremoveLoadingImage();
});