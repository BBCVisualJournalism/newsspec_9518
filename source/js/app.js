define(['lib/news_special/bootstrap', 'd3', 'lib/vendors/d3/topojson', 'lib/vendors/d3/queue', 'backbone', 'models/map', 'views/mapWrapper'], function (news, d3, Topojson, queue, Backbone, MapModel, MapWrapper) {

    var mapConfig = {
        'translate': [75, 372],
        'mapScale': 465
    };

    var Router = Backbone.Router.extend({
        routes: {
            'nation/:nation': 'nation',
            'constituency/:gssid': 'constituency',
            '*default': 'ukMap'
        },

        ukMap: function () {
            var ukMapConfig = {
                'pulloutShetland': true,
                'locator': true
            };
            this.loadMap(_.extend(mapConfig, ukMapConfig));
        },
        nation: function (nation) {
            var nationInfo;
            switch (nation) {
            case 'england':
                nationInfo = {
                    'scale': 1.55,
                    'center': [220, 257]
                };
                break;
            case 'northernIreland':
                nationInfo = {
                    'scale': 5.5,
                    'center': [110, 180]
                };
                break;
            case 'scotland':
                nationInfo = {
                    'scale': 8,
                    'center': [-403.6396484375, -800.28466796875]
                };
                break;
            case 'wales':
                nationInfo = {
                    'scale': 4,
                    'center': [181, 273]
                };
                break;
            }

            this.loadMap(_.extend(mapConfig, nationInfo));
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
                        var features = Topojson.feature(mapTopoJson, mapTopoJson.objects['boundaries']).features;
                        config.topoJson = features;
                        // config.topoJson = _.filter(features, function (feature) {
                        //     return feature.properties.PCON12CD.match(/^W/)? true : false;
                        // });
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