define(['lib/news_special/bootstrap', 'lib/news_special/iframemanager__frame', 'lib/vendors/d3/topojson', 'backbone', 'models/map', 'views/mapWrapper', 'text!maps/uk.topojson'], function (news, iframeManager, Topojson, Backbone, MapModel, MapWrapper, mapTopoJson) {
    var isResultsMode = (iframeManager.getValueFromQueryString('isResultsMode').toLowerCase() === 'true');

    mapTopoJson = JSON.parse(mapTopoJson);

    var mapConfig = {
        'width': 375,
        'height': 420,
        'isResultsMode': isResultsMode,
        'translate': [75, 372],
        'mapScale': 465,
        'bounds': [[-100, -300], [475, 475]],
        'pulloutShetland': true,
        'repIreland': true,
        'locator': false,
        'tooltip': true
    };

    var Router = Backbone.Router.extend({
        routes: {
            'nation/:nation': 'nation',
            'constituency/:gssid': 'constituency',
            '*default': 'ukMap'
        },

        ukMap: function () {
            this.loadMap(mapConfig);
        },
        nation: function (nation) {
            var nationInfo;
            switch (nation) {
            case 'england':
                nationInfo = {
                    'scale': 1.55,
                    'center': [220, 257],
                    'pulloutShetland': false
                };
                break;
            case 'northernIreland':
                nationInfo = {
                    'scale': 5.5,
                    'center': [110, 180],
                    'pulloutShetland': false
                };
                break;
            case 'scotland':
                nationInfo = {
                    'scale': 1.2,
                    'center': [180, 30],
                    'pulloutShetland': false
                };
                break;
            case 'wales':
                nationInfo = {
                    'scale': 4,
                    'center': [181, 273],
                    'pulloutShetland': false
                };
                break;
            }

            this.loadMap(_.extend(mapConfig, nationInfo));
        },
        constituency: function (constituency) {
            var constituencyInfo = {
                'gssid': constituency
            };

            this.loadMap(_.extend(mapConfig, constituencyInfo));
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