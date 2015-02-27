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
            this.initScale = this.mapModel.get('scale');

            this.projection = d3.geo.mercator()
                .scale(this.mapModel.get('mapScale'))
                .translate(this.mapModel.get('translate'));

            this.path = d3.geo.path()
                .projection(this.projection);

            this.zoom = d3.behavior.zoom()
              .scaleExtent([this.initScale * 0.8, 200])
              .on('zoom', this.zoomHandler.bind(this));

            this.svg = d3.select(this.el)
                .append('svg')
                .attr('class', 'main-map--svg')
                .attr('preserveAspectRatio', 'xMinYMin meet')
                .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);
                
            this.group = this.svg.append('g');
        },
        render: function () {
            this.group
                .selectAll('path')
                .data(this.features)
                .enter().append('path')
                .attr('class', function (d) {
                    return (d.properties.constituency_name)? 'constituency-path' : 'outline-path';
                })
                .attr('data-gssid', this.getDataGssIdFrom)
                .attr('d', this.path)
                .on("click", _.debounce(this.handleConstituencyClick.bind(this), 350, true));
            
            this.svg
                .call(this.zoom)
                .call(this.zoom.event)
                .on("dblclick.zoom", null);

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
                centroid = this.mapModel.get('center'),
                scale = this.mapModel.get('scale');

            var translation;

            if (gssidCenter) {
                // Center to GSSID HERE.
            } else if (centroid && scale) {
                this.scale = scale;
                translation = [((this.width /2) - (centroid [0] * this.scale)), ((this.height /2) - (centroid [1] * this.scale))];
            }

            if (translation) {
                this.translation = translation;
                this.emitZoomBoundingBox(false);


                this.zoom.translate([translation[0], translation[1]]).scale(this.scale);
                this.group.attr('transform', 'translate(' + translation[0] + ',' + translation[1] + ') scale(' + this.scale + ')');
            }
        },
        zoomHandler: function () {
            this.isPanningOrZoom = true;

            this.group.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

            this.scale = d3.event.scale;
            this.translation = d3.event.translate;

            this.emitZoomBoundingBox(false);
            this.toggleShetland((this.scale <= this.initScale));   

            var _this = this;
            clearTimeout(this.panningTimeout);
            this.panningTimeout = setTimeout(function () {
                _this.isPanningOrZoom = false;            
            }.bind(this), 300);
        },
        handleConstituencyClick: function (d, node){
            if (!this.isPanningOrZoom && d.properties.constituency_name) {
                var centroid = this.path.centroid(d);
                var bounds = this.path.bounds(d);

                var xDiff =  bounds[1][0] - bounds[0][0];
                    yDiff =  bounds[1][1] - bounds[0][1];

                var scaleDiff = (xDiff > yDiff)? (this.width * 0.6 / xDiff) : (this.height * 0.6 / yDiff);


                if (scaleDiff !== this.scale || centroid !== centroid) {
                    this.scale = scaleDiff;
                    this.toggleShetland(false);

                } else {
                    this.scale = this.mapModel.get('scale');
                    centroid = this.mapModel.get('center');

                    if (!this.mapModel.get('locator')) {
                        this.toggleShetland(true);
                    }
                }

                this.translation = [((this.width /2) - (centroid[0] * this.scale)), ((this.height /2) - (centroid[1] * this.scale))];
                this.emitZoomBoundingBox(true);

                this.zoom.translate([this.translation[0], this.translation[1]]).scale(this.scale);
                this.group.transition()
                    .duration(1000)
                    .attr('transform', 'translate(' + this.translation[0] + ',' + this.translation[1] + ') scale(' + this.scale + ')');
            }
        },
        getDataGssIdFrom: function (feature) {
            return feature.properties.constituency_name? feature.properties.constituency_name : 'outline';
        },
        loadRepIreland: function () {/*
            if (this.mapModel.get('repIreland') === true) {
                this.group.insert('svg', ':first-child')
                    .attr({
                        'class': 'repIre-svg',
                        'x': -250,
                        'y': -200,
                        'width': 98,
                        'height': 155,
                        'viewbox': '0 0 841.89 595.28'
                    })
                    .append('g')
                        .html($('#northern_ireland_path').html());
            }*/
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
                    'x': 288,
                    'y': 7,
                    'width': 81,
                    'height': 150
                });

            this.shetlandPullout.append('rect')
                .attr({
                    'class': 'shetland-pullout--box',
                    'x': 2,
                    'y': 2,
                    'width': 76,
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
            if (this.shetlandPullout && this.shetlandShown !== show) {
                /* Stops us hitting the DOM, if it's already the current value */
                this.shetlandShown = show;

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
                left: -(this.translation[0] / this.scale),
                top: -(this.translation[1] / this.scale),
                right: (this.width - this.translation[0]) / this.scale,
                bottom: (this.height - this.translation[1]) / this.scale
            }
            news.pubsub.emit('map:zoom-box', [zoomBox, this.scale, animate])
        }
    });
});