define(['lib/news_special/bootstrap', 'lib/vendors/d3/topojson', 'backbone', 'models/map', 'views/mapWrapper', 'text!maps/uk.topojson'], function (news, Topojson, Backbone, MapModel, MapWrapper, mapTopoJson) {

    mapTopoJson = JSON.parse(mapTopoJson);

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
                'repIreland': true,
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
                    'scale': 1.2,
                    'center': [180, 30]
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
            var features = Topojson.feature(mapTopoJson, mapTopoJson.objects['boundaries']).features;
            config.features = features;

            this.addMapWrapper(config);
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