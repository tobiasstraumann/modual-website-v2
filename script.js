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
// INITIALIZATION
// ===========================

window.addEventListener('load', () => {
    // Initialize energy chart
    energyChart = new EnergyChart('energyCanvas');
    
    // Initialize cost calculator
    updateCostCalculator();
    
    // Fade in body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('modual website loaded successfully! 🚀');
});
