define([
    'lib/news_special/bootstrap',
    'backbone',
    'd3',
    'views/locator',
], function (news, Backbone, d3, LocatorView) {
    return Backbone.View.extend({
        className: 'map-container',
        initialize: function (options) {
            this.mapModel = options.mapModel;
            this.features = this.mapModel.get('topoJson');
            this.d3El = d3.select(this.el);

            this.projection = d3.geo.mercator()
                .scale(this.mapModel.get('scale'))
                .translate(this.mapModel.get('translate'));

            this.path = d3.geo.path()
                .projection(this.projection);

            this.svg = d3.select(this.el)
                .append('svg')
                .attr('class', 'election-map-svg');

            this.group = this.svg.append('g');

            this.scale = 1;

            _.defer(this.setDimensions.bind(this));
        },
        setDimensions: function () {
            this.width = 750;
            this.height = 750;

            d3.select('.election-map-svg')
                .attr('width', this.width)
                .attr('height', this.height);
        },
        render: function () {
            this.group
                .selectAll('path')
                .data(this.features)
                .enter().append('path')
                .attr('class', 'election-path')
                .attr('data-gssid', this.getDataGssIdFrom)
                .attr('d', this.path)
                .on("click", this.handleConstituencyClick.bind(this));

            
            this.loadLocator();
    

            return this.$el;
        },
        handleConstituencyClick: function (d){
            this.centroid = this.path.centroid(d);
            var bounds = this.path.bounds(d);

            var xDiff =  bounds[1][0] - bounds[0][0];
                yDiff =  bounds[1][1] - bounds[0][1];

            var scaleDiff = (xDiff > yDiff)? (this.width * 0.6 / xDiff) : (this.height * 0.6 / yDiff);

            var transform;

            if (scaleDiff !== this.scale) {
                this.translation = [((this.width /2) - (this.centroid [0] * scaleDiff)), ((this.height /2) - (this.centroid [1] * scaleDiff))];
                this.scale = scaleDiff;
            } else {
                this.translation = [0, 0];
                this.centroid = [(this.width / 2), (this.height / 2)]
                this.scale = 1;
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
        emitZoomBoundingBox: function () {
            var zoomBox = {
                left: this.centroid[0] - (this.width / this.scale / 2),
                top: this.centroid[1] - (this.height / this.scale / 2),
                right: this.centroid[0] + (this.width / this.scale / 2),
                bottom: this.centroid[1] + (this.height / this.scale / 2)
            }
            news.pubsub.emit('map:zoom-box', zoomBox);
        }
    });
});