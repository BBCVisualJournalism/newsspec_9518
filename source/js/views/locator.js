define([
    'lib/news_special/bootstrap',
    'backbone',
    'd3'
], function (news, Backbone, d3) {
    return Backbone.View.extend({
        className: 'map-locator',
        initialize: function (options) {
            this.mapModel = options.mapModel;
            this.features = this.mapModel.get('topoJson');
            this.d3El = d3.select(this.el);

            this.initMap();

            _.defer(this.setDimensions.bind(this));

            /* Listeners */
            news.pubsub.on('map:zoom-box', this.zoomBoxUpdate.bind(this));
        },
        initMap: function () {
            var translate = this.mapModel.get('translate');
            translate[0] *= 0.2;
            translate[1] *= 0.2;

            this.projection = d3.geo.mercator()
                .scale(this.mapModel.get('scale') * 0.2)
                .translate(translate);

            this.path = d3.geo.path()
                .projection(this.projection);

            this.svg = d3.select(this.el)
                .append('svg')
                .attr('class', 'map-locator-svg');

            this.group = this.svg.append('g');

            this.scale = 1;
        },
        setDimensions: function () {
            this.width = 150;
            this.height = 150;

            d3.select('.map-locator-svg')
                .attr('width', this.width)
                .attr('height', this.height);
        },
        render: function () {
            this.group
                .selectAll('path')
                .data(this.features)
                .enter().append('path')
                .attr('class', 'election-path')
                .attr('d', this.path);

            return this.$el;
        },
        zoomBoxUpdate: function (zoomBox) {
            var x =(zoomBox.left / 5) , 
                y = (zoomBox.top / 5),
                width = (zoomBox.right / 5) - x,
                height = (zoomBox.bottom / 5) - y;

            console.log(x);
            console.log(y);
            console.log(width);
            console.log(height);

            var locatorEl = this.svg.select('.locator');
            if (!locatorEl.empty()) {
                locatorEl
                    .transition(1000)
                    .attr({
                        'x' : x,
                        'y' : y,
                        'width' : width,
                        'height' : height
                    });
            } else {
                this.svg.append('rect')
                    .attr({
                        'x' : x,
                        'y' : y,
                        'width' : width,
                        'height' : height,
                        'fill' : 'transparent',
                        'class' : 'locator'
                    });
            }
        }
    });
});