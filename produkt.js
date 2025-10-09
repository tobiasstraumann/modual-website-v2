// Product Page JavaScript
const API_URL = 'https://script.google.com/macros/s/AKfycbwrl8QQDJToFy6IWz8qVmJ8aQm3q33D4u2tv7ptuJV1TeQ-Sh9ck1gF32bU30KtdYU/exec';
const CACHE_KEY = 'modual_products_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 Stunde in Millisekunden

let productsData = [];

// Check if cached data is still valid
function getCachedData() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        if (age < CACHE_DURATION) {
            console.log(`Using cached data (${Math.round(age / 1000)}s old)`);
            return data;
        }
        
        console.log('Cache expired, fetching fresh data...');
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

// Save data to cache
function setCachedData(data) {
    try {
        const cacheObject = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
        console.log('Data cached successfully');
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
}

// Load product data from API with caching
async function loadProductData() {
    try {
        // Check if force refresh is requested
        if (shouldForceRefresh()) {
            console.log('Force refresh requested, clearing cache...');
            clearCache();
        }
        
        // Try to get cached data first
        const cachedData = getCachedData();
        if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
            productsData = cachedData;
            console.log('Products loaded from cache:', productsData.length, 'products');
            return cachedData;
        }
        
        // Fetch from API if no valid cache
        console.log('Fetching products from API...');
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw API data:', data);
        
        // Check if data is array
        if (!Array.isArray(data)) {
            console.error('API did not return an array:', data);
            return [];
        }
        
        // Save to cache
        setCachedData(data);
        
        productsData = data;
        console.log('Products loaded from API:', productsData.length, 'products');
        console.log('First product:', productsData[0]);
        
        return data;
    } catch (error) {
        console.error('Error loading product data:', error);
        
        // Try to use expired cache as fallback
        const fallbackCache = localStorage.getItem(CACHE_KEY);
        if (fallbackCache) {
            try {
                const { data } = JSON.parse(fallbackCache);
                console.warn('Using expired cache as fallback');
                productsData = data;
                return data;
            } catch (e) {
                console.error('Fallback cache also failed');
            }
        }
        
        return [];
    }
}

// Clear cache (für Debugging oder manuelles Update)
function clearCache() {
    try {
        localStorage.removeItem(CACHE_KEY);
        console.log('Cache cleared successfully');
        return true;
    } catch (error) {
        console.error('Error clearing cache:', error);
        return false;
    }
}

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Check if force refresh is requested
function shouldForceRefresh() {
    return window.location.search.includes('refresh=true');
}

// Show loading skeleton
function showLoadingSkeleton() {
    const heroSection = document.querySelector('.product-hero-new');
    if (heroSection) {
        heroSection.classList.add('loading');
    }
    
    // Add skeleton elements
    const productInfo = document.querySelector('.product-info-main');
    if (productInfo && !productInfo.querySelector('.skeleton')) {
        const skeletonHTML = `
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-tagline"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
        `;
        productInfo.insertAdjacentHTML('afterbegin', skeletonHTML);
    }
    
    // Add skeleton to image
    const imageContainer = document.querySelector('.product-image-main');
    if (imageContainer && !imageContainer.querySelector('.skeleton-image')) {
        const skeletonImage = document.createElement('div');
        skeletonImage.className = 'skeleton skeleton-image';
        skeletonImage.style.position = 'absolute';
        skeletonImage.style.top = '0';
        skeletonImage.style.left = '0';
        skeletonImage.style.zIndex = '1';
        imageContainer.style.position = 'relative';
        imageContainer.insertBefore(skeletonImage, imageContainer.firstChild);
    }
}

// Hide loading skeleton
function hideLoadingSkeleton() {
    const heroSection = document.querySelector('.product-hero-new');
    if (heroSection) {
        heroSection.classList.remove('loading');
    }
    
    // Remove skeleton elements
    document.querySelectorAll('.skeleton').forEach(el => el.remove());
}

// Get product by name or index
function getProduct(identifier) {
    // Make sure we have data
    if (!productsData || productsData.length === 0) {
        console.warn('No products data available');
        return null;
    }
    
    // If no identifier provided, return null to show error instead of default
    if (!identifier) {
        console.warn('No product ID specified in URL');
        return null;
    }
    
    // Try to find by product_name
    const product = productsData.find(p => p.product_name === identifier);
    if (product) return product;
    
    // Try to find by index
    const index = parseInt(identifier);
    if (!isNaN(index) && index >= 0 && index < productsData.length && productsData[index]) {
        return productsData[index];
    }
    
    console.warn(`Product not found for identifier: ${identifier}`);
    return null;
}

// Update page with product data
function updateProductPage(product) {
    if (!product) return;
    
    // Update title and meta
    document.title = `${product.product_name} - modual`;
    
    // Update meta description for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
    }
    metaDesc.content = `modual ${product.product_name} - ${product.product_type === 'DC' ? 'DC-Batteriespeicher ohne Wechselrichter' : 'AC-Batteriespeicher mit Wechselrichter'} - ${product.capacity_kwh} kWh Kapazität, ${product.max_charge_power_kw} kW Leistung. Swiss Made Qualität.`;
    
    // Update breadcrumb
    const breadcrumbSpan = document.querySelector('.breadcrumb-nav span');
    if (breadcrumbSpan) breadcrumbSpan.textContent = product.product_name;
    
    // Update product badge
    const badge = document.querySelector('.product-type-badge');
    if (badge) badge.textContent = product.product_type + '-Speicher';
    
    // Update product image based on type
    const productImage = document.querySelector('.product-image-main img');
    if (productImage) {
        if (product.product_type === 'DC') {
            productImage.src = 'assets/images/modual_basic_dc_1x3_isolated_v01-Back_side_close.png';
        } else if (product.product_type === 'AC') {
            productImage.src = 'assets/images/modual_basic_ac_1x2_isolated_v01-Back_side_close.png';
        } else {
            productImage.src = 'assets/images/modual_basic_dc_1x3_isolated_v01-Back_side_close.png'; // Fallback
        }
        productImage.alt = `modual ${product.product_name}`;
        productImage.style.opacity = '1'; // Make image visible
    }
    
    // Update main heading
    const h1 = document.querySelector('.product-info-main h1');
    if (h1) h1.textContent = product.product_name;
    
    // Update tagline based on capacity
    const tagline = document.querySelector('.product-tagline');
    if (tagline) {
        if (product.capacity_kwh <= 11.5) {
            tagline.textContent = 'Kompakt und effizient';
        } else if (product.capacity_kwh <= 23) {
            tagline.textContent = 'Optimale Grösse für neue PV-Anlagen';
        } else if (product.capacity_kwh <= 34.5) {
            tagline.textContent = 'Erweiterte Kapazität für höheren Bedarf';
        } else {
            tagline.textContent = 'Maximale Kapazität für grosse Haushalte';
        }
    }
    
    // Update key stats
    const statBoxes = document.querySelectorAll('.stat-box');
    console.log('Updating stat boxes, found:', statBoxes.length);
    if (statBoxes.length >= 3) {
        const capacityText = statBoxes[0].querySelector('strong');
        const powerText = statBoxes[1].querySelector('strong');
        const warrantyText = statBoxes[2].querySelector('strong');
        
        if (capacityText) capacityText.textContent = product.capacity_kwh + ' kWh';
        if (powerText) powerText.textContent = product.max_charge_power_kw + ' kW';
        if (warrantyText) warrantyText.textContent = (product.warranty_years || '10') + ' Jahre';
        
        console.log('Stats updated:', product.capacity_kwh, product.max_charge_power_kw);
    }
    
    // Update intro text
    const intro = document.querySelector('.product-intro');
    if (intro) {
        intro.textContent = `Der modual ${product.product_name} ist ${product.product_type === 'DC' ? 'die ideale Lösung für Einfamilienhäuser mit Photovoltaik-Anlagen' : 'eine Plug & Play Komplettlösung mit integriertem Wechselrichter'}.`;
    }
    
    // Update meta info
    const metaInfo = document.querySelector('.product-meta-info');
    if (metaInfo) {
        metaInfo.innerHTML = `
            <p><strong>Typ:</strong> ${product.product_type}-Speicher ${product.product_type === 'DC' ? '(ohne Wechselrichter)' : '(mit Wechselrichter)'}</p>
            <p><strong>Geeignet für:</strong> ${product.suitable_for || 'Einfamilienhäuser'}</p>
            <p><strong>Made in:</strong> 🇨🇭 Switzerland</p>
        `;
    }
    
    // Update technical specs
    updateTechnicalSpecs(product);
    
    // Update comparison table
    updateComparisonTable(product);
    
    // Update use cases
    updateUseCases(product);
    
    // Update compatible products
    updateCompatibleProducts(product);
}

// Update technical specifications
function updateTechnicalSpecs(product) {
    const specsLayout = document.querySelector('.specs-layout');
    if (!specsLayout) return;
    
    specsLayout.innerHTML = `
        <div class="spec-group">
            <h3>Allgemein</h3>
            <div class="spec-item"><span>Typ</span><strong>${product.product_type}-Batteriespeicher</strong></div>
            <div class="spec-item"><span>Serie</span><strong>${product.product_series}</strong></div>
            <div class="spec-item"><span>Kapazität</span><strong>${product.capacity_kwh} kWh</strong></div>
            <div class="spec-item"><span>Nennspannung</span><strong>${product.nominal_voltage_v} V DC</strong></div>
            <div class="spec-item"><span>Technologie</span><strong>${product.battery_technology}</strong></div>
        </div>
        <div class="spec-group">
            <h3>Leistung</h3>
            <div class="spec-item"><span>Max. Ladeleistung</span><strong>${product.max_charge_power_kw} kW</strong></div>
            <div class="spec-item"><span>Max. Entladeleistung</span><strong>${product.max_discharge_power_kw} kW</strong></div>
            <div class="spec-item"><span>Wirkungsgrad</span><strong>${product.efficiency_percent ? product.efficiency_percent + '%' : '>95%'}</strong></div>
            <div class="spec-item"><span>Betriebstemp.</span><strong>${product.operating_temp_min}°C bis +${product.operating_temp_max}°C</strong></div>
        </div>
        <div class="spec-group">
            <h3>Abmessungen</h3>
            <div class="spec-item"><span>Höhe</span><strong>${product.height_mm} mm</strong></div>
            <div class="spec-item"><span>Breite</span><strong>${product.width_mm} mm</strong></div>
            <div class="spec-item"><span>Tiefe</span><strong>${product.depth_mm} mm</strong></div>
            <div class="spec-item"><span>Gewicht</span><strong>~${product.weight_kg} kg</strong></div>
        </div>
        <div class="spec-group">
            <h3>Garantie</h3>
            <div class="spec-item"><span>Produktgarantie</span><strong>${product.warranty_years || '10'} Jahre</strong></div>
            <div class="spec-item"><span>Zyklen</span><strong>${product.cycles ? '>' + product.cycles : '>6000'}</strong></div>
            <div class="spec-item"><span>Zertifizierung</span><strong>${product.certifications || 'CE, Swiss Made'}</strong></div>
            <div class="spec-item"><span>Schutzklasse</span><strong>${product.protection_class || 'IP54'}</strong></div>
        </div>
    `;
}

// Update comparison table
function updateComparisonTable(currentProduct) {
    const comparisonTable = document.querySelector('.comparison-scroll table tbody');
    if (!comparisonTable) return;
    
    // Filter products by type (DC or AC)
    const sameTypeProducts = productsData.filter(p => p.product_type === currentProduct.product_type);
    if (sameTypeProducts.length === 0) return;
    
    // Sort by capacity
    sameTypeProducts.sort((a, b) => a.capacity_kwh - b.capacity_kwh);
    
    // Build table rows
    let html = '<tr><td>Kapazität</td>';
    sameTypeProducts.forEach(p => {
        const isActive = p.product_name === currentProduct.product_name;
        html += `<td class="${isActive ? 'active' : ''}"><strong>${p.capacity_kwh} kWh</strong></td>`;
    });
    html += '</tr>';
    
    html += '<tr><td>Geeignet für</td>';
    sameTypeProducts.forEach(p => {
        const isActive = p.product_name === currentProduct.product_name;
        html += `<td class="${isActive ? 'active' : ''}">${p.suitable_for || getSuitableFor(p.capacity_kwh)}</td>`;
    });
    html += '</tr>';
    
    html += '<tr><td>Max. Leistung</td>';
    sameTypeProducts.forEach(p => {
        const isActive = p.product_name === currentProduct.product_name;
        html += `<td class="${isActive ? 'active' : ''}"><strong>${p.max_charge_power_kw} kW</strong></td>`;
    });
    html += '</tr>';
    
    html += '<tr><td>Autarkie</td>';
    sameTypeProducts.forEach(p => {
        const isActive = p.product_name === currentProduct.product_name;
        html += `<td class="${isActive ? 'active' : ''}">${p.autonomy_percent ? '~' + p.autonomy_percent + '%' : getAutonomy(p.capacity_kwh)}</td>`;
    });
    html += '</tr>';
    
    html += '<tr><td>Preis ab</td>';
    sameTypeProducts.forEach(p => {
        const isActive = p.product_name === currentProduct.product_name;
        html += `<td class="${isActive ? 'active' : ''}">${p.price_chf ? 'CHF ' + p.price_chf.toLocaleString('de-CH') : 'Auf Anfrage'}</td>`;
    });
    html += '</tr>';
    
    comparisonTable.innerHTML = html;
    
    // Update table header
    const thead = document.querySelector('.comparison-scroll table thead tr');
    if (thead) {
        let headerHtml = '<th>Eigenschaft</th>';
        sameTypeProducts.forEach(p => {
            const isActive = p.product_name === currentProduct.product_name;
            headerHtml += `<th class="${isActive ? 'active' : ''}">${p.capacity_kwh} kWh</th>`;
        });
        thead.innerHTML = headerHtml;
    }
}

// Update use cases based on product type
function updateUseCases(product) {
    const useCasesLayout = document.querySelector('.usecases-layout');
    if (!useCasesLayout) return;
    
    // DC = neue PV-Anlagen, AC = bestehende PV-Anlagen (Retrofit)
    const isDC = product.product_type === 'DC';
    const isSmallCapacity = product.capacity_kwh <= 23;
    
    let html = '';
    
    if (isSmallCapacity) {
        // 11-23 kWh: Einfamilienhaus
        if (isDC) {
            // DC-Systeme: Ideal für NEUE PV-Anlagen
            html = `
                <div class="usecase-item">
                    <img src="assets/images/einfamilienhaus-ohne-solaranlage.png" alt="Einfamilienhaus neue PV-Anlage">
                    <h3>Neue PV-Anlage</h3>
                    <p>DC-Speicher ideal für Neuinstallationen im Einfamilienhaus.</p>
                    <ul>
                        <li>✓ Bis zu ${product.capacity_kwh <= 11.5 ? '50-60' : '70'}% Autarkie</li>
                        <li>✓ Optimale Systemintegration</li>
                        <li>✓ Maximaler Eigenverbrauch</li>
                    </ul>
                </div>
                <div class="usecase-item">
                    <img src="assets/images/einfamilienhaus-mit-solaranlage.png" alt="Einfamilienhaus Erweiterung">
                    <h3>Anlagenerweiterung</h3>
                    <p>Perfekt für die Erweiterung bestehender Systeme.</p>
                    <ul>
                        <li>✓ Flexible Integration</li>
                        <li>✓ Erhöht Eigenverbrauch</li>
                        <li>✓ Zukunftssicher</li>
                    </ul>
                </div>
            `;
        } else {
            // AC-Systeme: Ideal für BESTEHENDE PV-Anlagen (Retrofit)
            html = `
                <div class="usecase-item">
                    <img src="assets/images/einfamilienhaus-mit-solaranlage.png" alt="Einfamilienhaus bestehende PV-Anlage">
                    <h3>Bestehende PV-Anlage</h3>
                    <p>AC-Speicher perfekt für Retrofit bei bestehenden Photovoltaik-Anlagen.</p>
                    <ul>
                        <li>✓ Retrofit-fähig</li>
                        <li>✓ Plug & Play Lösung</li>
                        <li>✓ Unabhängig vom bestehenden Wechselrichter</li>
                    </ul>
                </div>
                <div class="usecase-item">
                    <img src="assets/images/einfamilienhaus-ohne-solaranlage.png" alt="Einfamilienhaus ohne PV">
                    <h3>Ohne PV-Anlage</h3>
                    <p>Auch ohne Solaranlage nutzbar für Lastspitzenoptimierung.</p>
                    <ul>
                        <li>✓ Netzunabhängigkeit</li>
                        <li>✓ Stromkosten senken</li>
                        <li>✓ Notstromfähig</li>
                    </ul>
                </div>
            `;
        }
    } else {
        // 34-46 kWh: Gewerbe
        if (isDC) {
            // DC-Systeme: Ideal für NEUE PV-Anlagen
            html = `
                <div class="usecase-item">
                    <img src="assets/images/gewerbe-ohne-solaranlage.png" alt="Gewerbe neue Installation">
                    <h3>Gewerbe - Neuinstallation</h3>
                    <p>DC-Speicher für gewerbliche Neubauten und Grossprojekte.</p>
                    <ul>
                        <li>✓ Bis zu ${product.capacity_kwh >= 46 ? '85' : '80'}% Autarkie</li>
                        <li>✓ Optimale Systemintegration</li>
                        <li>✓ Skalierbare Lösung</li>
                    </ul>
                </div>
                <div class="usecase-item">
                    <img src="assets/images/gewerbe-mit-solaranlage.png" alt="Gewerbe Erweiterung">
                    <h3>Gewerbe - Anlagenerweiterung</h3>
                    <p>Erweiterung bestehender gewerblicher Systeme.</p>
                    <ul>
                        <li>✓ Hohe Kapazität</li>
                        <li>✓ Lastspitzenoptimierung</li>
                        <li>✓ Reduktion der Netzkosten</li>
                    </ul>
                </div>
            `;
        } else {
            // AC-Systeme: Ideal für BESTEHENDE PV-Anlagen (Retrofit)
            html = `
                <div class="usecase-item">
                    <img src="assets/images/gewerbe-mit-solaranlage.png" alt="Gewerbe bestehende PV-Anlage">
                    <h3>Gewerbe - Bestehende PV</h3>
                    <p>AC-Speicher für Retrofit bei gewerblichen Anwendungen.</p>
                    <ul>
                        <li>✓ Retrofit-fähig</li>
                        <li>✓ Plug & Play Installation</li>
                        <li>✓ Lastspitzenoptimierung</li>
                    </ul>
                </div>
                <div class="usecase-item">
                    <img src="assets/images/gewerbe-ohne-solaranlage.png" alt="Gewerbe ohne PV">
                    <h3>Gewerbe - Ohne PV</h3>
                    <p>Energiemanagement auch ohne Solaranlage.</p>
                    <ul>
                        <li>✓ Netzoptimierung</li>
                        <li>✓ Reduktion der Netzkosten</li>
                        <li>✓ Notstromfähig</li>
                    </ul>
                </div>
            `;
        }
    }
    
    useCasesLayout.innerHTML = html;
}

// Update compatible products based on product type
function updateCompatibleProducts(product) {
    const interopGrid = document.querySelector('.interop-grid');
    if (!interopGrid) return;
    
    const isDC = product.product_type === 'DC';
    
    // Common products for all types
    let html = `
        <div class="interop-item">
            <div class="interop-image">
                <img src="assets/images/solarmanager-app.png" alt="Solarmanager App">
            </div>
            <h3>Solarmanager App</h3>
            <p>Intelligentes Energiemanagement und Monitoring</p>
        </div>
        <div class="interop-item">
            <div class="interop-image">
                <img src="assets/images/smart-me-zähler.jpg" alt="Smart-me Zähler">
            </div>
            <h3>Smart-me Zähler</h3>
            <p>Präzise Energiemessung in Echtzeit</p>
        </div>
        <div class="interop-item">
            <div class="interop-image">
                <img src="assets/images/pico-ladestation.jpg" alt="Pico EV-Ladestation">
            </div>
            <h3>Pico EV-Ladestation</h3>
            <p>Intelligentes Laden mit Solarenergie</p>
        </div>
    `;
    
    // Add inverters only for DC products
    if (isDC) {
        html += `
            <div class="interop-item">
                <div class="interop-image">
                    <img src="assets/images/solis-wechselrichter-S6-EH3P(8-15)K02-NV-YD-L.png" alt="Solis Wechselrichter">
                </div>
                <h3>Solis Wechselrichter</h3>
                <p>Hybridwechselrichter für optimale Systemintegration</p>
            </div>
            <div class="interop-item">
                <div class="interop-image">
                    <img src="assets/images/victron-wechselrichter.png" alt="Victron Wechselrichter">
                </div>
                <h3>Victron Wechselrichter</h3>
                <p>Leistungsstarke Off-Grid Lösungen</p>
            </div>
            <div class="interop-item">
                <div class="interop-image">
                    <img src="assets/images/studer-next3.png" alt="Studer Wechselrichter">
                </div>
                <h3>Studer Wechselrichter</h3>
                <p>Professionelle Energiespeichersysteme</p>
            </div>
        `;
    }
    
    interopGrid.innerHTML = html;
}

// Helper functions
function getSuitableFor(capacity) {
    if (capacity <= 11.5) return '1-2 Pers.';
    if (capacity <= 23) return '3-4 Pers.';
    if (capacity <= 34.5) return '4-5 Pers.';
    return '5+ Pers.';
}

function getAutonomy(capacity) {
    if (capacity <= 11.5) return '~50%';
    if (capacity <= 23) return '~70%';
    if (capacity <= 34.5) return '~80%';
    return '~85%';
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Page loading started...');
    
    // Show loading skeleton immediately
    showLoadingSkeleton();
    
    // Load products from API
    await loadProductData();
    
    console.log('Products loaded:', productsData.length);
    
    // Get product ID from URL
    const productId = getUrlParameter('id') || getUrlParameter('product');
    
    console.log('Requested product ID:', productId);
    
    // Get product data
    const product = getProduct(productId);
    
    console.log('Selected product:', product);
    
    // Update page
    if (product) {
        updateProductPage(product);
        console.log('Page updated with product:', product.product_name);
        
        // Hide skeleton after content is loaded
        hideLoadingSkeleton();
    } else {
        hideLoadingSkeleton();
        
        // Show error message if no product found
        const productInfo = document.querySelector('.product-info-main');
        if (productInfo) {
            productInfo.innerHTML = `
                <h1>Produkt nicht gefunden</h1>
                <p class="product-tagline">Bitte wählen Sie ein Produkt aus der Navigation.</p>
                <div class="product-cta-group">
                    <a href="index.html#produkte" class="btn btn-primary">Zurück zur Übersicht</a>
                </div>
            `;
        }
        console.error('No product found to display');
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('.faq-btn');
        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faqItem => faqItem.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#kontakt') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('=== modual product page loaded! 🚀 ===');
    console.log('Total products loaded:', productsData.length);
    console.log('Product ID from URL:', productId);
    console.log('Current product:', product);
    console.log('All products:', productsData);
    
    // Make clearCache available globally for debugging
    window.modualClearCache = clearCache;
    console.log('Tip: Use modualClearCache() in console to clear cache, or add ?refresh=true to URL');
    
    // Initialize contact form
    initContactForm();
    
    // Initialize emergency toggle
    initEmergencyToggle();
});

// ===========================
// CONTACT FORM
// ===========================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            newsletter: document.getElementById('newsletter').checked
        };
        
        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet...';
        
        try {
            // TODO: Replace with your actual form endpoint
            // For now, simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Log to console (for development)
            console.log('Form submitted:', formData);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.textContent = '✓ Vielen Dank! Wir haben Ihre Nachricht erhalten und melden uns in Kürze.';
            successMessage.style.padding = '1.5rem';
            successMessage.style.marginBottom = '2rem';
            successMessage.style.backgroundColor = '#00c896';
            successMessage.style.color = 'white';
            successMessage.style.borderRadius = '8px';
            successMessage.style.textAlign = 'center';
            
            // Insert success message before form
            form.parentNode.insertBefore(successMessage, form);
            
            // Hide form
            form.style.display = 'none';
            
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            alert('Es gab einen Fehler beim Senden. Bitte versuchen Sie es später erneut.');
        }
    });
}

// ===========================
// EMERGENCY TOGGLE
// ===========================
function initEmergencyToggle() {
    const toggleBtn = document.getElementById('emergencyToggle');
    const numberLink = document.getElementById('emergencyNumber');
    
    if (toggleBtn && numberLink) {
        toggleBtn.addEventListener('click', function() {
            if (numberLink.style.display === 'none') {
                numberLink.style.display = 'inline-flex';
                toggleBtn.style.display = 'none';
            }
        });
    }
}
