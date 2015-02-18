define([
    'lib/news_special/bootstrap',
    'backbone'
], function (news, Backbone) {
    return Backbone.View.extend({
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

            _.defer(this.setDimensions.bind(this));
        },
        setDimensions: function () {
            this.width = this.$el.width();
            this.height = this.$el.height();

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

            return this.$el;
        },
        handleConstituencyClick: function (d){
            var centroid = this.path.centroid(d);
            var bounds = this.path.bounds(d);

            var xDiff =  bounds[1][0] - bounds[0][0];
                yDiff =  bounds[1][1] - bounds[0][1];

            var scaleDiff;

            if (xDiff > yDiff) {
                scaleDiff = this.width * 0.8 / xDiff; 
            } else {
                scaleDiff = this.height * 0.8 / yDiff; 
            }

            this.group.transition()
                .duration(750)
                .attr('transform', 'translate(' + (this.width /2) + ',' + (this.height /2)  + ') scale(' + scaleDiff + ') translate(-' + (centroid[0]) + ',-' + (centroid[1]) + ')')
        },
        getDataGssIdFrom: function (feature) {
            return feature.properties.PCON12CD;
        }
    });
});