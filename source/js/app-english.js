define([
    'lib/news_special/bootstrap',
    'lib/news_special/iframemanager__frame',
    'lib/vendors/d3/topojson',
    'backbone',
    'models/map',
    'views/mapWrapper',
    'data/uk.topojson',
    'data/constituencyNamesEnglish.json.js',
    'models/constituencyNames'
], function (news, iframeManager, Topojson, Backbone, MapModel, MapWrapper, mapTopoJson, constituencyNames, ConstituencyNamesModel) {
    /* Values passed from parent on load. (Query string) */
    var isResultsMode = (iframeManager.getValueFromQueryString('isResultsMode').toLowerCase() === 'true'),
        delayLoadingQS = iframeManager.getValueFromQueryString('delayLoading'),
        delayLoading = (delayLoadingQS === true || delayLoadingQS === 'true');

    var mapConfig = {
        'language': 'english',
        'isResultsMode': isResultsMode,
        'translate': [365, 2377],
        'mapScale': 1993,
        'bounds': [[-300, -400], [775, 575]],
        'pulloutShetland': true,
        'locator': true,
        'tooltip': true
    };

    var Router = Backbone.Router.extend({
        routes: {
            'nation/:nation/:parentWidth': 'nation',
            'constituency/:gssid/:parentWidth': 'constituency',
            '*default': 'ukMap'
        },

        ukMap: function (parentWidth) {
            this.loadMap(mapConfig, parentWidth);
        },
        nation: function (nation, parentWidth) {
            var nationInfo;
            if (nation === 'england') {
                nationInfo = {
                    'scale': 1.55,
                    'center': [277, 207],
                    'pulloutShetland': false
                };
            } else if (nation === 'northernIreland') {
                nationInfo = {
                    'scale': 4.48,
                    'center': [130, 92],
                    'pulloutShetland': false
                };
            } else if (nation === 'scotland') {
                nationInfo = {
                    'scale': 1.2,
                    'center': [217, -101],
                    'pulloutShetland': false,
                    'locator': false
                };
            } else if (nation === 'wales') {
                nationInfo = {
                    'scale': 4,
                    'center': [235, 225],
                    'pulloutShetland': false
                };
            }

            this.loadMap(_.extend(mapConfig, nationInfo), parentWidth);
        },
        constituency: function (constituency, parentWidth) {
            var constituencyInfo = {
                'gssid': constituency
            };

            this.loadMap(_.extend(mapConfig, constituencyInfo), parentWidth);
        },

        loadMap: function (config, parentWidth) {
            var features = Topojson.feature(mapTopoJson, mapTopoJson.objects['boundaries']).features;
            
            config.features = features;
            config.interactive =  (parentWidth > 700);

            this.addMapWrapper(config);
        },
        addMapWrapper: function (config) {
            var container = news.$('.main'),
                mapModel = new MapModel(config);

            mapModel.set('constituencyNames', new ConstituencyNamesModel(constituencyNames));
            
            function renderMap() {
                var mapWrapper = new MapWrapper({mapModel: mapModel});
                news.sendMessageToremoveLoadingImage();
                container.html(mapWrapper.render());
            }

            news.pubsub.on('map:hasRequiredData', renderMap);

            /* Don't need to wait for data in campaign mode, so generate */
            if (!isResultsMode) {
                renderMap();
            }
        }
    });

    var initialize = _.once(function () {
        new Router();
        Backbone.history.start();
        news.pubsub.emit('app:inititalised');
    });

    if (delayLoading) {
        news.pubsub.on('app:should:init', initialize);
        setTimeout(initialize, 7000);
    } else {
        initialize();
    }
});
