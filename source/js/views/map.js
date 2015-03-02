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
            news.pubsub.on('map:reset', this.reset.bind(this));
            news.pubsub.on('map:pan', this.pan.bind(this));
            news.pubsub.on('map:zoomClicked', this.zoomClicked.bind(this));
        },
        initMap: function () {
            this.width = 375;
            this.height = 375;
            this.initScale = this.mapModel.get('scale');
            this.bounds = this.mapModel.get('bounds');

            this.projection = d3.geo.mercator()
                .scale(this.mapModel.get('mapScale'))
                .translate(this.mapModel.get('translate'));

            this.path = d3.geo.path()
                .projection(this.projection);

            this.zoom = d3.behavior.zoom()
                .scaleExtent([this.mapModel.get('maxScaleOut'), Infinity])
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
                .on('click', _.debounce(this.handleConstituencyClick.bind(this), 350, true));
            
            this.svg
                .call(this.zoom)
                .call(this.zoom.event)
                .on('dblclick.zoom', null);

            if (this.mapModel.get('pulloutShetland') === true) {
                this.pulloutShetland();
            }

            this.loadRepIreland();

            this.loadLocator();
            this.positionMap();

            return this.$el;
        },
        setTranslationAndScale: function (translation, scale, animated) {
            var group = (animated)? this.group.transition().duration(1000) : this.group;
            group.attr('transform', 'translate(' + translation[0] + ',' + translation[1] + ') scale(' + scale + ')');
            
            this.zoom.translate([translation[0], translation[1]]).scale(scale);
            this.scale = scale;
            this.translation = translation;

            this.emitZoomBoundingBox(animated);
        },
        getTranslationFromCentroid: function (centroid, scale) {
            return [((this.width /2) - (centroid[0] * scale)), ((this.height /2) - (centroid[1] * scale))]
        },
        positionMap: function () {
            var gssidCenter = this.mapModel.get('gssid'),
                centroid = this.mapModel.get('center'),
                scale = this.mapModel.get('scale');

            var translation;

            if (gssidCenter) {
                // Center to GSSID HERE.
            } else if (centroid && scale) {
                translation = this.getTranslationFromCentroid(centroid, scale);
            }

            if (translation && scale) {
                this.setTranslationAndScale(translation, scale);
            }
        },
        zoomHandler: function () {
            this.isPanningOrZoom = true;
            var scale = d3.event.scale,
                translation = this.applyBounds(d3.event.translate, scale);
            
            this.setTranslationAndScale(translation, scale);
            this.toggleShetland((scale <= this.initScale));   

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

                var scale = (xDiff > yDiff)? (this.width * 0.6 / xDiff) : (this.height * 0.6 / yDiff);

                // If already zoomed into what user clicked, zoom out.
                if (this.lastNode && this.lastNode === node) {
                    this.lastNode = null;
                    scale = this.mapModel.get('scale');
                    centroid = this.mapModel.get('center');
                }else{
                    this.lastNode = node;
                    this.toggleShetland(false);                 
                }

                var translation = this.getTranslationFromCentroid(centroid, scale);
                this.setTranslationAndScale(translation, scale, true);

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
                

            this.shetlandPullout.on('click', function () {
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
                    .each('end', function() {
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
        },
        /* Ensures a translation doesn't take the map out of the specified bounds */
        applyBounds: function (translation, scale) {
            translation[0] = Math.min(-this.bounds[0][0] * scale, Math.max(-this.bounds[1][0] * scale + this.width, translation[0]));
            translation[1] = Math.min(-this.bounds[0][1] * scale, Math.max(-this.bounds[1][1] * scale + this.height, translation[1]));
            return translation;
        },
        reset: function () {
            var scale = this.mapModel.get('scale'),
                centroid = this.mapModel.get('center'),
                translation = this.getTranslationFromCentroid(centroid, scale);

            this.setTranslationAndScale(translation, scale, true);
        },
        pan: function (direction) {
            var translation = this.translation;
            switch (direction) {
                case 'left':
                translation[0] += this.width / 3;
                break
                case 'right':
                translation[0] -= this.width / 3;
                break               
                case 'up':
                translation[1] += this.height / 3;
                break
                case 'down':
                translation[1] -= this.height / 3;
                break;
            }
            this.setTranslationAndScale(this.applyBounds(translation, this.scale), this.scale, true);
        },
        zoomClicked: function (direction) { 
            var scale = this.scale,
                translation = this.translation,
                center = [this.width / 2, this.height / 2],
                scaleFactor;

            switch (direction) {
                case 'in':
                scaleFactor = 1.7;
                break;
                case 'out':
                scaleFactor = 1 / 1.7;
                break;
            }

            var scale = scale * scaleFactor,
                maxScale = this.mapModel.get('maxScaleOut');

            if (scale < maxScale) {
                scale = maxScale;
                scaleFactor = scale / this.scale;
            }

            translation[0] = (translation[0] - center[0]) * scaleFactor + center[0];
            translation[1] = (translation[1] - center[1]) * scaleFactor + center[1];

            this.setTranslationAndScale(this.applyBounds(translation, scale), scale, true);
            if(scale > this.initScale) {
                this.toggleShetland(false);
            }
        }
    });
});