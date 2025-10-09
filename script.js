// ===========================
// INTERACTIVE ENERGY CHART
// ===========================

class EnergyChart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.currentHour = 0;
        this.isPlaying = false;
        this.animationSpeed = 500; // ms per hour - smoother
        this.animationInterval = null;
        this.barOpacity = {}; // Track opacity for each hour
        this.autoPlay = true; // Auto-play on load
        
        // Colors
        this.colors = {
            solar: '#fbba00',
            battery: '#2e5efc',
            consumption: '#00c896',
            grid: '#cccccc'
        };
        
        // Data for 24 hours (0-23)
        this.solarData = this.generateSolarData();
        this.consumptionData = this.generateConsumptionData();
        this.batteryData = this.generateBatteryData();
        
        this.init();
    }
    
    generateSolarData() {
        // Solar production peaks at midday
        const data = [];
        for (let hour = 0; hour < 24; hour++) {
            if (hour >= 6 && hour <= 20) {
                const peak = 12;
                const distance = Math.abs(hour - peak);
                const value = Math.max(0, 100 - (distance * distance * 2));
                data.push(value);
            } else {
                data.push(0);
            }
        }
        return data;
    }
    
    generateConsumptionData() {
        // Consumption pattern: higher in morning and evening
        const data = [30, 25, 20, 15, 15, 20, 45, 60, 50, 40, 35, 35, 
                      40, 35, 35, 40, 45, 60, 70, 65, 55, 45, 40, 35];
        return data;
    }
    
    generateBatteryData() {
        // Battery charges during day, discharges at night
        const data = [];
        for (let hour = 0; hour < 24; hour++) {
            const solar = this.solarData[hour];
            const consumption = this.consumptionData[hour];
            const diff = solar - consumption;
            data.push(Math.max(-50, Math.min(50, diff)));
        }
        return data;
    }
    
    init() {
        // Initialize all bars with 0 opacity
        for (let i = 0; i < 24; i++) {
            this.barOpacity[i] = 0;
        }
        this.draw();
        this.setupControls();
        this.updateTimeDisplay();
        
        // Auto-start animation
        if (this.autoPlay) {
            setTimeout(() => this.play(), 1000);
        }
    }
    
    draw() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Check if dark mode is active
        const chartContainer = document.querySelector('.energy-chart-container');
        const isDarkMode = chartContainer && chartContainer.classList.contains('dark-mode');
        
        // Draw grid
        ctx.strokeStyle = isDarkMode ? '#555' : '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw axes
        ctx.strokeStyle = isDarkMode ? '#fff' : '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw data
        this.drawLine(this.solarData, this.colors.solar, 'Solarproduktion');
        this.drawLine(this.consumptionData, this.colors.consumption, 'Verbrauch');
        this.drawBatteryBars();
        
        // Draw current time indicator
        this.drawTimeIndicator();
        
        // Draw labels
        this.drawLabels();
    }
    
    drawLine(data, color, label) {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const maxValue = 100;
        const barWidth = chartWidth / 24;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i <= this.currentHour; i++) {
            const x = padding + (barWidth * i) + barWidth / 2;
            const y = canvas.height - padding - (data[i] / maxValue) * chartHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = color;
        for (let i = 0; i <= this.currentHour; i++) {
            const x = padding + (barWidth * i) + barWidth / 2;
            const y = canvas.height - padding - (data[i] / maxValue) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawBatteryBars() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const centerY = canvas.height - padding;
        const barWidth = chartWidth / 24;
        const maxValue = 50;
        
        ctx.fillStyle = this.colors.battery;
        
        for (let i = 0; i <= this.currentHour; i++) {
            const x = padding + (barWidth * i);
            const value = this.batteryData[i];
            const barHeight = (Math.abs(value) / maxValue) * (chartHeight / 3);
            const y = value > 0 ? centerY - barHeight : centerY;
            
            // Fade in effect for new bars
            if (this.barOpacity[i] < 1) {
                this.barOpacity[i] = Math.min(1, this.barOpacity[i] + 0.1);
            }
            
            ctx.globalAlpha = 0.3 * this.barOpacity[i];
            ctx.fillRect(x, y, barWidth - 2, Math.abs(value) > 0 ? barHeight : 0);
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawTimeIndicator() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const barWidth = chartWidth / 24;
        const x = padding + (barWidth * this.currentHour) + barWidth / 2;
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    drawLabels() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const barWidth = chartWidth / 24;
        
        // Check if dark mode is active
        const chartContainer = document.querySelector('.energy-chart-container');
        const isDarkMode = chartContainer && chartContainer.classList.contains('dark-mode');
        
        ctx.fillStyle = isDarkMode ? '#ffffff' : '#666';
        ctx.font = '12px Montserrat';
        ctx.textAlign = 'center';
        
        // Hour labels
        for (let i = 0; i < 24; i += 3) {
            const x = padding + (barWidth * i) + barWidth / 2;
            const y = canvas.height - padding + 20;
            ctx.fillText(`${i}:00`, x, y);
        }
        
        // Y-axis labels
        ctx.textAlign = 'right';
        const maxValue = 100;
        for (let i = 0; i <= 4; i++) {
            const value = maxValue - (maxValue / 4) * i;
            const y = padding + (canvas.height - padding * 2) / 4 * i + 5;
            ctx.fillText(`${value.toFixed(0)} kW`, padding - 10, y);
        }
    }
    
    updateTimeDisplay() {
        const currentTimeEl = document.getElementById('currentTime');
        const timeOfDayEl = document.getElementById('timeOfDay');
        const chartContainer = document.querySelector('.energy-chart-container');
        
        if (currentTimeEl) {
            currentTimeEl.textContent = `${this.currentHour.toString().padStart(2, '0')}:00`;
        }
        
        if (timeOfDayEl) {
            if (this.currentHour >= 6 && this.currentHour < 12) {
                timeOfDayEl.textContent = '🌅 Morgen';
            } else if (this.currentHour >= 12 && this.currentHour < 18) {
                timeOfDayEl.textContent = '☀️ Tag';
            } else if (this.currentHour >= 18 && this.currentHour < 22) {
                timeOfDayEl.textContent = '🌆 Abend';
            } else {
                timeOfDayEl.textContent = '🌙 Nacht';
            }
        }
        
        // Dark mode transition
        if (chartContainer) {
            if (this.currentHour >= 20 || this.currentHour < 6) {
                chartContainer.classList.add('dark-mode');
            } else {
                chartContainer.classList.remove('dark-mode');
            }
        }
    }
    
    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        this.animationInterval = setInterval(() => {
            this.currentHour++;
            if (this.currentHour >= 24) {
                // Loop back to start
                this.currentHour = 0;
                // Reset bar opacities for smooth fade-in on next cycle
                for (let i = 0; i < 24; i++) {
                    this.barOpacity[i] = 0;
                }
            }
            this.draw();
            this.updateTimeDisplay();
        }, this.animationSpeed);
    }
    
    pause() {
        this.isPlaying = false;
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
    
    reset() {
        this.pause();
        this.currentHour = 0;
        // Reset bar opacities
        for (let i = 0; i < 24; i++) {
            this.barOpacity[i] = 0;
        }
        this.draw();
        this.updateTimeDisplay();
    }
    
    setupControls() {
        const playBtn = document.getElementById('playChart');
        const pauseBtn = document.getElementById('pauseChart');
        const resetBtn = document.getElementById('resetChart');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => this.play());
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }
}

// Initialize chart when DOM is loaded
let energyChart;

// ===========================
// NAVIGATION
// ===========================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ===========================
// FAQ ACCORDION
// ===========================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    }
});

// ===========================
// SCROLL ANIMATIONS
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll('.usp-card, .feature-card, .use-case-card, .info-card, .testimonial-card, .feature-item, .sl-feature, .about-feature');

animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ===========================
// SMOOTH SCROLLING
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// SCROLL INDICATOR
// ===========================

window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.scrollY > 200) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    }
});

// ===========================
// TESTIMONIALS
// ===========================

let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    if (testimonials.length <= 1) return;
    
    testimonials.forEach((card, index) => {
        if (window.innerWidth <= 768) {
            card.style.display = index === currentTestimonial ? 'block' : 'none';
        } else {
            card.style.display = 'block';
        }
    });
    
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
}

if (window.innerWidth <= 768 && testimonials.length > 0) {
    setInterval(rotateTestimonials, 5000);
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        testimonials.forEach(card => {
            card.style.display = 'block';
        });
    }
});

// ===========================
// COST CALCULATOR
// ===========================

function updateCostCalculator() {
    const slider = document.getElementById('energySlider');
    const energyValue = document.getElementById('energyValue');
    const costWithout = document.getElementById('costWithout');
    const costWith = document.getElementById('costWith');
    const savings = document.getElementById('savings');
    
    if (!slider) return;
    
    slider.addEventListener('input', (e) => {
        const kWh = parseInt(e.target.value);
        energyValue.textContent = kWh.toLocaleString('de-CH');
        
        // Calculate costs
        const pricePerKWh = 0.32; // CHF per kWh
        const costWithoutBattery = kWh * pricePerKWh;
        
        // With battery: assume 50% savings (self-consumption optimization)
        const costWithBattery = costWithoutBattery * 0.5;
        const yearlySavings = costWithoutBattery - costWithBattery;
        
        // Update display
        costWithout.textContent = `CHF ${Math.round(costWithoutBattery).toLocaleString('de-CH')}`;
        costWith.textContent = `CHF ${Math.round(costWithBattery).toLocaleString('de-CH')}`;
        savings.textContent = `Ersparnis: CHF ${Math.round(yearlySavings).toLocaleString('de-CH')}/Jahr`;
    });
}

// ===========================
// PRODUCT CAROUSEL (OLD - REMOVED)
// ===========================
// Removed duplicate class definition - see line 731 for active implementation

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
            
            // Insert success message before form
            form.parentNode.insertBefore(successMessage, form);
            
            // Hide form
            form.style.display = 'none';
            
            // Remove success message after 5 seconds and show form again
            setTimeout(() => {
                successMessage.remove();
                form.style.display = 'flex';
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 5000);
            
            // TODO: If using a real backend, replace the above with:
            /*
            const response = await fetch('YOUR_FORM_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Show success message
            } else {
                throw new Error('Form submission failed');
            }
            */
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'form-error';
            errorMessage.textContent = '✗ Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.';
            
            form.parentNode.insertBefore(errorMessage, form);
            
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
            
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ===========================
// MEGA MENU
// ===========================

function initMegaMenu() {
    const megaMenuTrigger = document.querySelector('.has-megamenu');
    const megaMenu = document.querySelector('.megamenu');
    const overlay = document.querySelector('.megamenu-overlay');
    
    if (!megaMenuTrigger || !megaMenu || !overlay) return;
    
    let menuTimeout;
    
    // Show mega menu
    megaMenuTrigger.addEventListener('mouseenter', () => {
        clearTimeout(menuTimeout);
        overlay.style.pointerEvents = 'auto';
    });
    
    // Hide mega menu with delay
    megaMenuTrigger.addEventListener('mouseleave', () => {
        menuTimeout = setTimeout(() => {
            overlay.style.pointerEvents = 'none';
        }, 300);
    });
    
    megaMenu.addEventListener('mouseenter', () => {
        clearTimeout(menuTimeout);
    });
    
    megaMenu.addEventListener('mouseleave', () => {
        overlay.style.pointerEvents = 'none';
    });
    
    // Close mega menu when clicking overlay
    overlay.addEventListener('click', () => {
        overlay.style.pointerEvents = 'none';
    });
    
    // Prevent default on trigger
    const trigger = document.querySelector('.megamenu-trigger');
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
        });
    }
}

// ===========================
// PRODUCT CAROUSEL
// ===========================

class ProductCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.dotsContainer = document.querySelector('.carousel-dots');
        
        if (!this.track) return;
        
        // Get all cards and separate by type
        const allCards = Array.from(this.track.children);
        this.dcProducts = allCards.filter(card => card.dataset.type === 'dc');
        this.acProducts = allCards.filter(card => card.dataset.type === 'ac');
        
        // Initialize with default visible products
        this.visibleCards = allCards.filter(card => card.dataset.default === 'true');
        this.currentIndex = 0;
        this.cardsToShow = this.getCardsToShow();
        
        this.init();
    }
    
    getCardsToShow() {
        const width = window.innerWidth;
        if (width >= 1200) return 2;
        if (width >= 768) return 1;
        return 1;
    }
    
    init() {
        // Show only default cards initially
        this.showVisibleCards();
        this.updateCarousel();
        this.setupEventListeners();
        
        // Update on resize
        window.addEventListener('resize', () => {
            const newCardsToShow = this.getCardsToShow();
            if (newCardsToShow !== this.cardsToShow) {
                this.cardsToShow = newCardsToShow;
                this.updateCarousel();
            }
        });
    }
    
    showVisibleCards() {
        // Hide all cards first
        const allCards = Array.from(this.track.children);
        allCards.forEach(card => card.style.display = 'none');
        
        // Show only visible cards
        this.visibleCards.forEach(card => card.style.display = 'block');
    }
    
    swapRandomProduct() {
        // Determine which product to swap based on current view
        const isSwappingDC = Math.random() < 0.5;
        const productType = isSwappingDC ? 'dc' : 'ac';
        const productPool = isSwappingDC ? this.dcProducts : this.acProducts;
        
        // Find current visible product of this type
        const currentProductIndex = this.visibleCards.findIndex(card => 
            card.dataset.type === productType && card.style.display !== 'none'
        );
        
        if (currentProductIndex === -1) return;
        
        // Get a random different product
        const availableProducts = productPool.filter(p => !this.visibleCards.includes(p));
        if (availableProducts.length === 0) return;
        
        const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        const currentProduct = this.visibleCards[currentProductIndex];
        
        // Swap the products
        this.visibleCards[currentProductIndex] = randomProduct;
        
        // Update display
        this.showVisibleCards();
        this.updateCarousel();
        
        // Reinitialize feather icons for the new card
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.swapRandomProduct());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.swapRandomProduct());
        }
        
        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                this.swapRandomProduct();
            }
        });
    }
    
    updateCarousel() {
        // No sliding - cards are swapped in place
        // Just ensure buttons are always enabled for random swapping
        if (this.prevBtn) {
            this.prevBtn.disabled = false;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = false;
        }
    }
}

// ===========================
// INITIALIZATION
// ===========================

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

window.addEventListener('load', () => {
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Initialize energy chart
    energyChart = new EnergyChart('energyCanvas');
    
    // Initialize cost calculator
    updateCostCalculator();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize mega menu
    initMegaMenu();
    
    // Initialize emergency toggle
    initEmergencyToggle();
    
    // Initialize product carousel
    new ProductCarousel();
    
    // Fade in body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('modual website loaded successfully! 🚀');
});
