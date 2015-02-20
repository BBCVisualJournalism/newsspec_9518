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
            this.features = this.mapModel.get('topoJson');
            this.d3El = d3.select(this.el);

            this.initMap();

            /* LISTNERS */
            news.pubsub.on('map:toggleShetland', this.toggleShetland.bind(this));
        },
        initMap: function () {
            this.width = 375;
            this.height = 375;

            this.projection = d3.geo.mercator()
                .scale(this.mapModel.get('scale'))
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
                .on("click", this.handleConstituencyClick.bind(this));

            this.pulloutShetland();

            this.loadLocator();
    

            return this.$el;
        },
        handleConstituencyClick: function (d){
            var centroid = this.path.centroid(d);
            var bounds = this.path.bounds(d);

            var xDiff =  bounds[1][0] - bounds[0][0];
                yDiff =  bounds[1][1] - bounds[0][1];

            var scaleDiff = (xDiff > yDiff)? (this.width * 0.6 / xDiff) : (this.height * 0.6 / yDiff);

            var transform;

            if (scaleDiff !== this.scale || centroid !== centroid) {
                this.centroid = centroid;
                this.scale = scaleDiff;
                this.toggleShetland(false);

                this.translation = [((this.width /2) - (this.centroid [0] * scaleDiff)), ((this.height /2) - (this.centroid [1] * scaleDiff))];
            } else {
                this.centroid = [(this.width / 2), (this.height / 2)]
                this.scale = 1;

                if (!this.mapModel.get('locator')) {
                    this.toggleShetland(true);
                }

                this.translation = [0, 0];
            }

            this.emitZoomBoundingBox();

            this.group.transition()
                .duration(1000)
                .attr('transform', 'translate(' + this.translation[0] + ',' + this.translation[1] + ') scale(' + this.scale + ')');
        },
        getDataGssIdFrom: function (feature) {
            return feature.properties.PCON12CD;
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
                var diplayValue = show? 1 : 0;
                this.shetlandPullout.transition()
                    .duration(500)
                    .attr('opacity', diplayValue);
            }
        },
        emitZoomBoundingBox: function () {
            var zoomBox = {
                left: this.centroid[0] - (this.width / this.scale / 2),
                top: this.centroid[1] - (this.height / this.scale / 2),
                right: this.centroid[0] + (this.width / this.scale / 2),
                bottom: this.centroid[1] + (this.height / this.scale / 2)
            }
            news.pubsub.emit('map:zoom-box', [zoomBox, this.scale]);
        }
    });
});