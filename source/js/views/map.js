define([
    'lib/news_special/bootstrap',
    'backbone',
    'd3',
    'views/locator',
], function (news, Backbone, d3, LocatorView) {
    return Backbone.View.extend({
        className: 'main-map--container',
        initialize: function (options) {
            this.mapModel = options.mapModel;
            this.features = this.mapModel.get('features');
            this.d3El = d3.select(this.el);

            this.initMap();

            /* LISTENERS */
            news.pubsub.on('map:toggleShetland', this.toggleShetland.bind(this));
        },
        initMap: function () {
            this.width = 375;
            this.height = 375;

            this.projection = d3.geo.mercator()
                .scale(this.mapModel.get('mapScale'))
                .translate(this.mapModel.get('translate'));

            this.path = d3.geo.path()
                .projection(this.projection);

            this.svg = d3.select(this.el)
                .append('svg')
                .attr('class', 'main-map--svg')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

            this.group = this.svg.append('g');

            this.scale = 1;
        },
        render: function () {
            this.group
                .selectAll('path')
                .data(this.features)
                .enter().append('path')
                .attr('class', 'constituency-path')
                .attr('data-gssid', this.getDataGssIdFrom)
                .attr('d', this.path)
                .on("click", _.debounce(this.handleConstituencyClick.bind(this), 350, true));

            if (this.mapModel.get('pulloutShetland') === true) {
                this.pulloutShetland();
            }

            this.loadRepIreland();
            this.loadLocator();
            this.positionMap();

            return this.$el;
        },
        positionMap: function () {
            var gssidCenter = this.mapModel.get('gssid'),
                center = this.mapModel.get('center'),
                scale = this.mapModel.get('scale');

            var translation;

            if (gssidCenter) {
                // Center to GSSID HERE.
            } else if (center && scale) {
                this.centroid = center;
                this.scale = scale;
                translation = [((this.width /2) - (this.centroid [0] * this.scale)), ((this.height /2) - (this.centroid [1] * this.scale))];
            }

            if (translation) {
                this.emitZoomBoundingBox(false);

                this.group
                    .attr('transform', 'translate(' + translation[0] + ',' + translation[1] + ') scale(' + this.scale + ')');
            }
        },
        handleConstituencyClick: function (d){
            var centroid = this.path.centroid(d);
            var bounds = this.path.bounds(d);

            var xDiff =  bounds[1][0] - bounds[0][0];
                yDiff =  bounds[1][1] - bounds[0][1];

            var scaleDiff = (xDiff > yDiff)? (this.width * 0.6 / xDiff) : (this.height * 0.6 / yDiff);


            if (scaleDiff !== this.scale || centroid !== centroid) {
                this.centroid = centroid;
                this.scale = scaleDiff;
                this.toggleShetland(false);

            } else {
                this.scale = this.mapModel.get('scale');
                this.centroid = this.mapModel.get('center');

                if (!this.mapModel.get('locator')) {
                    this.toggleShetland(true);
                }
            }

            var translation = [((this.width /2) - (this.centroid[0] * this.scale)), ((this.height /2) - (this.centroid[1] * this.scale))];

            this.emitZoomBoundingBox(true);

            this.group.transition()
                .duration(1000)
                .attr('transform', 'translate(' + translation[0] + ',' + translation[1] + ') scale(' + this.scale + ')');
        },
        getDataGssIdFrom: function (feature) {
            return feature.properties.PCON12CD;
        },
        loadRepIreland: function () {
            if (this.mapModel.get('repIreland') === true) {
                this.group.insert('image', ':first-child')
                    .attr({
                        'xlink:href': 'img/niOutline.png',
                        'x': 27,
                        'y': 144,
                        'width': 98,
                        'height': 155
                    });
            }
        },
        loadLocator: function () {
            if (this.mapModel.get('locator') === true) {
                var locatorView = new LocatorView({mapModel: this.mapModel});
                this.$el.append(locatorView.render());
            }
        },
        pulloutShetland: function () {
            this.shetlandPullout = this.svg.append('svg')
                .attr({
                    'class': 'shetland--pullout',
                    'x': 295,
                    'y': 0,
                    'width': 81,
                    'height': 150
                });

            this.shetlandPullout.append('rect')
                .attr({
                    'class': 'shetland-pullout--box',
                    'x': 2,
                    'y': 2,
                    'width': 77,
                    'height': 146
                });

            this.shetlandGroup = this.shetlandPullout.append('g');

            var shetlandsPath = this.group.select('[data-gssid="S14000051"]')

            this.shetlandGroup.append('path')
                .attr('class', 'constituency-path')
                .attr('data-gssid', 'S14000051')
                .attr('d', shetlandsPath.attr('d'));
                

            this.shetlandPullout.on("click", function () {
                shetlandsPath.on('click').call(shetlandsPath.node(), shetlandsPath.datum());
            });

            this.shetlandGroup.attr('transform', 'translate(-175, 135)');
        },
        toggleShetland: function (show) {
            if (this.shetlandPullout) {
                var _this = this;
                var opacityValue = show? 1 : 0;
                this.shetlandPullout.attr('display', 'block');
                this.shetlandPullout.transition()
                    .duration(500)
                    .attr('opacity', opacityValue)
                    .each("end", function() {
                        var displayValue = show? 'block' : 'none';
                        _this.shetlandPullout.attr('display', displayValue);
                    });
            }
        },
        emitZoomBoundingBox: function (animate) {
            var zoomBox = {
                left: this.centroid[0] - (this.width / this.scale / 2),
                top: this.centroid[1] - (this.height / this.scale / 2),
                right: this.centroid[0] + (this.width / this.scale / 2),
                bottom: this.centroid[1] + (this.height / this.scale / 2)
            }
            news.pubsub.emit('map:zoom-box', [zoomBox, this.scale, animate]);
        }
    });
});