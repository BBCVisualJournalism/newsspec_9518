define(['lib/news_special/bootstrap', 'lib/vendors/d3/topojson', 'backbone', 'models/map', 'views/mapWrapper', 'text!maps/wales.topojson'], function (news, Topojson, Backbone, MapModel, MapWrapper, mapTopoJson) {

    mapTopoJson = JSON.parse(mapTopoJson);

    var mapConfig = {
        'translate': [75, 372],
        'mapScale': 465,
        'maxScaleOut': 4,
        'bounds': [[110, 213], [230, 333]],
        'pulloutShetland': false,
        'repIreland': false,
        'locator': true,
        'scale': 4,
        'center': [170, 273]
    };

    var Router = Backbone.Router.extend({
        routes: {
            'constituency/:gssid': 'constituency',
            '*default': 'welshMap'
        },

        welshMap: function () {
            this.loadMap(mapConfig);
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