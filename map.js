document.addEventListener('DOMContentLoaded', function() {
    const map = new jsVectorMap({
        selector: '#world-map',
        map: 'world',
        zoomButtons: true,
        zoomButtonsPos: {
            right: 10,
            top: 10
        },
        markers: [
            // Industrial Centers
            { name: 'Trofa', coords: [41.3391, -8.6174], content: 'Cereals & Bars', style: { initial: { fill: '#006837' } } },
            { name: 'Maia', coords: [41.2329, -8.6209], content: 'Semolina, Pasta & Cookies', style: { initial: { fill: '#006837' } } },
            { name: 'Lisboa', coords: [38.7223, -9.1393], content: 'Soft Wheat', style: { initial: { fill: '#006837' } } },
            { name: 'Porto', coords: [41.1579, -8.6291], content: 'Soft Wheat & Rye', style: { initial: { fill: '#006837' } } },
            { name: 'Litovel', coords: [49.7016, 17.0760], content: 'Pasta Production', style: { initial: { fill: '#006837' } } }
        ],
        markerStyle: {
            initial: {
                stroke: '#fff',
                r: 6
            },
            hover: {
                stroke: '#fff',
                r: 8
            }
        },
        series: {
            regions: [{
                attribute: 'fill',
                scale: {
                    production: '#006837',
                    export: '#ffcc00',
                    default: '#e4e4e4'
                },
                values: {
                    PT: 'production',
                    CZ: 'production',
                    US: 'export',
                    ES: 'export',
                    FR: 'export',
                    BE: 'export',
                    AO: 'export',
                    MZ: 'export',
                    CV: 'export'
                }
            }]
        },
        regionStyle: {
            initial: {
                fill: '#e4e4e4'
            },
            hover: {
                fill: function(element, code) {
                    const values = map.series.regions[0].values;
                    return values[code] === 'production' ? '#004d29' : 
                           values[code] === 'export' ? '#e6b800' : 
                           '#d4d4d4';
                }
            }
        },
        backgroundColor: 'transparent',
        zoomOnScroll: true,
        zoomMax: 12,
        zoomMin: 0.2,
        zoomStep: 1.5,
        zoomAnimate: true,
        // Focus on Europe initially
        focusOn: {
            regions: ['PT', 'CZ'],
            animate: true,
            scale: 3
        },
        onMarkerTipShow: function(event, tip, code) {
            const marker = this.markers[code];
            if (marker.content) {
                tip.html(tip.html() + ': ' + marker.content);
            }
        }
    });

    // Make map instance globally available for the USA pill
    window.mapInstance = map;

    // Add interaction between list and map
    document.querySelectorAll('.location-item, .export-market, .main-market').forEach(item => {
        item.addEventListener('click', function() {
            const country = this.dataset.country;
            if (country === 'USA') {
                map.setFocus({
                    scale: 2,
                    lat: 37.0902,
                    lng: -95.7129,
                    animate: true
                });
            } else if (country === 'PRT') {
                map.setFocus({
                    scale: 6,
                    lat: 39.5,
                    lng: -8.5,
                    animate: true
                });
            } else if (country === 'CZE') {
                map.setFocus({
                    scale: 6,
                    lat: 49.7,
                    lng: 17.0,
                    animate: true
                });
            } else {
                map.setFocus(country, { animate: true, scale: 3 });
            }
        });
    });
}); 