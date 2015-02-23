define([
    'lib/news_special/bootstrap',
    'backbone',
    'd3'
], function (news, Backbone, d3) {
    return Backbone.View.extend({
        className: 'locator-map--container',
        initialize: function (options) {
            this.mapModel = options.mapModel;
            this.features = this.mapModel.get('topoJson');
            this.d3El = d3.select(this.el);

            this.width = 75;
            this.height = 75;

            this.initMap();

            /* Listeners */
            news.pubsub.on('map:zoom-box', this.zoomBoxUpdate.bind(this));
        },
        initMap: function () {
            var translate = this.mapModel.get('translate');
            translate[0] *= 0.2;
            translate[1] *= 0.2;

            this.projection = d3.geo.mercator()
                .scale(this.mapModel.get('mapScale') * 0.2)
                .translate(translate);

            this.path = d3.geo.path()
                .projection(this.projection);

            this.svg = d3.select(this.el)
                .append('svg')
                .attr('class', 'locator-map--svg')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', '0 0 ' + this.width  + ' ' + this.height);

            this.group = this.svg.append('g');

            this.addLocatorBox();

            this.scale = 1;
        },
        render: function () {
            this.group
                .selectAll('path')
                .data(this.features)
                .enter().append('path')
                .attr('class', 'constituency-path')
                .attr('d', this.path);

            return this.$el;
        },
        addLocatorBox: function () {
            this.svg.append('rect')
                .attr({
                    'x' : 0,
                    'y' : 0,
                    'width' : this.width,
                    'height' : this.height,
                    'fill' : 'transparent',
                    'class' : 'locator-box',
                    'display': 'none'
                });
        },
        zoomBoxUpdate: function (zoomBox, scale, animate) {
            var _this = this;

            var x =(zoomBox.left / 5) , 
                y = (zoomBox.top / 5),
                width = (zoomBox.right / 5) - x,
                height = (zoomBox.bottom / 5) - y;

            /* Check if box to small, if it is enlarge around center*/
            if(width < 14 || height < 14) {
                x -= ((14 - width) / 2);
                y -= ((14 - height) / 2);
                width = 14;
                height = 14;
            }

            var locatorEl = this.svg.select('.locator-box');

            this.$el.show();

            var attr = {
                'x' : x,
                'y' : y,
                'width' : width,
                'height' : height,
            };

            if (animate) {
                locatorEl.transition()
                    .attr(attr)
                    .duration(1000)
                .each("end", function() {
                    if (scale === 1) {
                        _this.$el.fadeOut();
                        news.pubsub.emit('map:toggleShetland', true);
                    } else {
                        _this.$el.fadeIn();
                    }
                });
            } else {
                locatorEl.attr(attr);
                if (scale === 1) {
                    this.$el.hide();
                } else {
                    this.$el.show();
                }
            }


        }
    });
});