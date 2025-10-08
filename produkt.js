// Product Page JavaScript
const API_URL = 'https://script.google.com/macros/s/AKfycbwrl8QQDJToFy6IWz8qVmJ8aQm3q33D4u2tv7ptuJV1TeQ-Sh9ck1gF32bU30KtdYU/exec';

let productsData = [];

// Load product data from API
async function loadProductData() {
    try {
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
        
        productsData = data;
        console.log('Products loaded successfully:', productsData.length, 'products');
        console.log('First product:', productsData[0]);
        
        return data;
    } catch (error) {
        console.error('Error loading product data:', error);
        return [];
    }
}

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Get product by name or index
function getProduct(identifier) {
    // Make sure we have data
    if (!productsData || productsData.length === 0) {
        console.warn('No products data available');
        return null;
    }
    
    // Default to first product if no identifier
    if (!identifier) {
        return productsData[1] || productsData[0];
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
    return productsData[1] || productsData[0]; // Default
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
        } else {
            productImage.src = 'assets/images/IMG_3814.jpg'; // AC image placeholder
        }
        productImage.alt = `modual ${product.product_name}`;
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
            tagline.textContent = 'Optimale Größe für neue PV-Anlagen';
        } else if (product.capacity_kwh <= 34.5) {
            tagline.textContent = 'Erweiterte Kapazität für höheren Bedarf';
        } else {
            tagline.textContent = 'Maximale Kapazität für große Haushalte';
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
    } else {
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
});
