// Data
const INDUSTRIAL_CENTERS = [
    { name: 'Trofa', coords: [41.3391, -8.6174], content: 'Cereals & Bars' },
    { name: 'Maia', coords: [41.2329, -8.6209], content: 'Semolina, Pasta & Cookies' },
    { name: 'Lisboa', coords: [38.7223, -9.1393], content: 'Soft Wheat' },
    { name: 'Porto', coords: [41.1579, -8.6291], content: 'Soft Wheat & Rye' },
    { name: 'Litovel', coords: [49.7016, 17.0760], content: 'Pasta Production' }
];

const EXPORT_MARKETS = [
    { country: 'US', flag: '🇺🇸', name: 'United States' },
    { country: 'ES', flag: '🇪🇸', name: 'Spain' },
    { country: 'FR', flag: '🇫🇷', name: 'France' },
    { country: 'BE', flag: '🇧🇪', name: 'Belgium' },
    { country: 'AO', flag: '🇦🇴', name: 'Angola' },
    { country: 'MZ', flag: '🇲🇿', name: 'Mozambique' },
    { country: 'CV', flag: '🇨🇻', name: 'Cape Verde' },
    { country: 'GA', flag: '🇬🇦', name: 'Gabon' },
    { country: 'GH', flag: '🇬🇭', name: 'Ghana' },
    { country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
    { country: 'GW', flag: '🇬🇼', name: 'Guinea-Bissau' },
    { country: 'HT', flag: '🇭🇹', name: 'Haiti' },
    { country: 'NL', flag: '🇳🇱', name: 'Netherlands' },
    { country: 'IE', flag: '🇮🇪', name: 'Ireland' },
    { country: 'JO', flag: '🇯🇴', name: 'Jordan' },
    { country: 'LY', flag: '🇱🇾', name: 'Libya' },
    { country: 'LU', flag: '🇱🇺', name: 'Luxembourg' },
    { country: 'MO', flag: '🇲🇴', name: 'Macau' },
    { country: 'MY', flag: '🇲🇾', name: 'Malaysia' },
    { country: 'MV', flag: '🇲🇻', name: 'Maldives' },
    { country: 'YT', flag: '🇾🇹', name: 'Mayotte' }
];

// Map configuration
const MAP_CONFIG = {
    selector: '#world-map',
    map: 'world',
    backgroundColor: 'transparent',
    zoomButtons: true,
    zoomOnScroll: false,
    zoomButtonsPos: { right: 10, top: 10 },
    markers: INDUSTRIAL_CENTERS.map(center => ({
        ...center,
        style: { initial: { fill: '#006837' } }
    })),
    markerStyle: {
        initial: { stroke: '#fff', r: 6 },
        hover: { stroke: '#fff', r: 8 }
    },
    series: {
        regions: [{
            attribute: 'fill',
            scale: {
                production: '#006837',
                export: '#ffcc00',
                default: '#e4e4e4'
            },
            values: Object.fromEntries([
                ...['PT', 'CZ'].map(code => [code, 'production']),
                ...EXPORT_MARKETS.map(market => [market.country, 'export'])
            ])
        }]
    },
    regionStyle: {
        initial: { fill: '#e4e4e4' },
        hover: {
            fill: function(element, code) {
                const values = this.series.regions[0].values;
                return values[code] === 'production' ? '#004d29' : 
                       values[code] === 'export' ? '#e6b800' : 
                       '#d4d4d4';
            }
        }
    },
    onMarkerTipShow: function(event, tip, code) {
        const marker = this.markers[code];
        if (marker.content) {
            tip.html(`${tip.html()}: ${marker.content}`);
        }
    }
};

// Initialize map
document.addEventListener('DOMContentLoaded', function() {
    const map = new jsVectorMap(MAP_CONFIG);
    window.mapInstance = map;

    // Add view controls
    initializeViewControls(map);
    
    // Initialize with export markets view
    updateView('export', map);
});

// View management
function initializeViewControls(map) {
    const mapContainer = document.querySelector('#world-map');
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = 'position: absolute; top: 20px; left: 20px; z-index: 100;';

    const exportBtn = createViewButton('Export Markets', 'export', 'fa-globe');
    const industrialBtn = createViewButton('Industrial Centers', 'industrial', 'fa-industry');
    
    controlsContainer.appendChild(exportBtn);
    controlsContainer.appendChild(industrialBtn);
    mapContainer.appendChild(controlsContainer);

    // Event listeners
    exportBtn.addEventListener('click', () => updateView('export', map));
    industrialBtn.addEventListener('click', () => updateView('industrial', map));
}

function createViewButton(text, type, icon) {
    const button = document.createElement('button');
    button.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
    button.className = `zoom-button ${type === 'export' ? 'active' : ''}`;
    button.dataset.view = type;
    return button;
}

function updateView(type, map) {
    // Update buttons
    document.querySelectorAll('.zoom-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === type);
    });

    // Update map focus
    if (type === 'export') {
        map.setFocus({
            regions: EXPORT_MARKETS.map(market => market.country),
            animate: true,
            scale: 1
        });
    } else {
        map.setFocus({
            regions: ['PT', 'CZ'],
            animate: true,
            scale: 3
        });
    }

    // Update location list
    updateLocationList(type);
}

// Location list management
function updateLocationList(type) {
    const locationList = document.querySelector('.location-list');
    locationList.innerHTML = '';

    if (type === 'export') {
        renderExportMarkets(locationList);
    } else {
        renderIndustrialCenters(locationList);
    }
}

function renderExportMarkets(container) {
    container.innerHTML = '<h3>Export Markets</h3><div class="export-markets"></div>';
    const marketsContainer = container.querySelector('.export-markets');
    
    let currentPage = 0;
    const getItemsPerPage = () => window.innerWidth > 768 ? 8 : 5;
    let itemsPerPage = getItemsPerPage();

    // Handle window resize
    window.addEventListener('resize', () => {
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            renderPage(currentPage);
        }
    });
    
    function renderPage(page) {
        const start = page * itemsPerPage;
        const end = Math.min(start + itemsPerPage, EXPORT_MARKETS.length);
        const pageItems = EXPORT_MARKETS.slice(start, end);

        marketsContainer.innerHTML = pageItems
            .map(item => `
                <div class="export-market" data-country="${item.country}">
                    <span class="flag">${item.flag}</span> ${item.name}
                </div>
            `).join('');

        // Remove any existing pagination
        const existingPagination = container.querySelector('.pagination');
        if (existingPagination) {
            existingPagination.remove();
        }

        // Add pagination if needed
        if (EXPORT_MARKETS.length > itemsPerPage) {
            renderPagination(container, page, Math.ceil(EXPORT_MARKETS.length / itemsPerPage), renderPage);
        }

        // Add click handlers
        marketsContainer.querySelectorAll('.export-market').forEach(el => {
            el.addEventListener('click', () => {
                const country = el.dataset.country;
                if (country === 'US') {
                    window.mapInstance.setFocus({ scale: 2, lat: 37.0902, lng: -95.7129, animate: true });
                } else {
                    window.mapInstance.setFocus(country, { animate: true, scale: 3 });
                }
            });
        });

        // Update current page
        currentPage = page;
    }

    renderPage(currentPage);
}

function renderPagination(container, currentPage, totalPages, onPageChange) {
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    paginationDiv.innerHTML = `
        <button ${currentPage === 0 ? 'disabled' : ''} id="prevPage">
            <i class="fas fa-chevron-left"></i> Previous
        </button>
        <button ${currentPage >= totalPages - 1 ? 'disabled' : ''} id="nextPage">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;

    container.appendChild(paginationDiv);

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 0) onPageChange(currentPage - 1);
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
    });
}

function renderIndustrialCenters(container) {
    container.innerHTML = `
        <h3>Industrial Centers</h3>
        <div class="location-item" data-country="PT">
            <div class="location-header">
                <span class="flag">🇵🇹</span>
                <span class="name">Portugal</span>
            </div>
            <div class="industrial-centers">
                ${INDUSTRIAL_CENTERS
                    .filter(center => center.name !== 'Litovel')
                    .map(center => `<p><strong>${center.name}:</strong> ${center.content}</p>`)
                    .join('')}
            </div>
        </div>
        <div class="location-item" data-country="CZ">
            <div class="location-header">
                <span class="flag">🇨🇿</span>
                <span class="name">Czech Republic</span>
            </div>
            <div class="industrial-centers">
                <p><strong>Litovel:</strong> Pasta Production</p>
            </div>
        </div>
    `;

    // Add click handlers
    container.querySelectorAll('.location-item').forEach(el => {
        el.addEventListener('click', () => {
            const country = el.dataset.country;
            window.mapInstance.setFocus(country, { animate: true, scale: 6 });
        });
    });
} 