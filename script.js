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
        this.currentScenario = 'self-consumption'; // Default scenario
        
        // Colors (updated with dark grey instead of green)
        this.colors = {
            solar: '#fbba00',
            battery: '#2e5efc',
            consumption: '#404042', // Dark grey instead of green
            grid: '#cccccc'
        };
        
        // Initialize scenario data
        this.loadScenario(this.currentScenario);
        
        this.init();
    }
    
    loadScenario(scenario) {
        this.currentScenario = scenario;
        
        switch(scenario) {
            case 'self-consumption':
                this.solarData = this.generateSolarData();
                this.consumptionData = this.generateConsumptionData();
                this.batteryData = this.generateBatteryData();
                break;
            case 'peak-shaving':
                this.solarData = this.generateSolarData();
                this.consumptionData = this.generatePeakShavingConsumption();
                this.batteryData = this.generatePeakShavingBattery();
                break;
            case 'blackout':
                this.solarData = this.generateBlackoutSolar();
                this.consumptionData = this.generateBlackoutConsumption();
                this.batteryData = this.generateBlackoutBattery();
                break;
        }
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
    
    // Peak-Shaving Scenario: Reduce peak demand
    generatePeakShavingConsumption() {
        // Industrial load with high peaks at business hours
        const data = [15, 15, 15, 15, 20, 30, 60, 85, 95, 100, 95, 90,
                      85, 95, 100, 95, 85, 70, 45, 30, 25, 20, 15, 15];
        return data;
    }
    
    generatePeakShavingBattery() {
        // Battery discharges during peak hours to reduce load
        const data = [];
        for (let hour = 0; hour < 24; hour++) {
            const consumption = this.consumptionData[hour];
            const solar = this.solarData[hour];
            
            // Charge when solar available, discharge during peaks
            if (consumption > 80 && hour >= 8 && hour <= 17) {
                // Discharge during peak hours
                data.push(-40);
            } else if (solar > consumption && solar > 50) {
                // Charge when excess solar
                data.push(30);
            } else {
                data.push(0);
            }
        }
        return data;
    }
    
    // Blackout Scenario: Emergency backup power
    generateBlackoutSolar() {
        // Solar still producing during day (if sunny)
        const data = [];
        for (let hour = 0; hour < 24; hour++) {
            if (hour >= 6 && hour <= 20) {
                const peak = 13;
                const distance = Math.abs(hour - peak);
                const value = Math.max(0, 90 - (distance * distance * 2));
                data.push(value);
            } else {
                data.push(0);
            }
        }
        return data;
    }
    
    generateBlackoutConsumption() {
        // Emergency load: Critical appliances only (reduced consumption)
        // Blackout occurs at hour 14
        const data = [30, 25, 20, 18, 18, 22, 40, 55, 45, 38, 35, 35,
                      38, 35, 25, 25, 25, 25, 28, 30, 28, 35, 30, 28];
        return data;
    }
    
    generateBlackoutBattery() {
        // Battery provides backup power during blackout (hour 14 onwards)
        const data = [];
        for (let hour = 0; hour < 24; hour++) {
            const solar = this.solarData[hour];
            const consumption = this.consumptionData[hour];
            
            if (hour >= 14) {
                // During blackout: battery provides power + solar helps if available
                if (solar > 0) {
                    const diff = solar - consumption;
                    data.push(Math.max(-45, Math.min(30, diff)));
                } else {
                    // Night: battery discharges
                    data.push(-25);
                }
            } else {
                // Before blackout: normal charging
                const diff = solar - consumption;
                data.push(Math.max(-30, Math.min(50, diff)));
            }
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
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw line segments with smooth opacity fade-in
        for (let i = 0; i < this.currentHour; i++) {
            const x1 = padding + (barWidth * i) + barWidth / 2;
            const y1 = canvas.height - padding - (data[i] / maxValue) * chartHeight;
            const x2 = padding + (barWidth * (i + 1)) + barWidth / 2;
            const y2 = canvas.height - padding - (data[i + 1] / maxValue) * chartHeight;
            
            // Smooth opacity for current segment being drawn
            const segmentOpacity = i < this.currentHour - 1 ? 1 : (this.barOpacity[i + 1] || 0);
            
            ctx.globalAlpha = segmentOpacity;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        
        // Draw points with smooth fade-in
        ctx.fillStyle = color;
        for (let i = 0; i <= this.currentHour; i++) {
            const x = padding + (barWidth * i) + barWidth / 2;
            const y = canvas.height - padding - (data[i] / maxValue) * chartHeight;
            const pointOpacity = this.barOpacity[i] || 0;
            
            ctx.globalAlpha = pointOpacity;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
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
            
            // Use barOpacity for current hour
            const opacity = this.barOpacity[i] || 0;
            
            if (Math.abs(value) > 0) {
                ctx.globalAlpha = 0.4 * opacity;
                
                if (value > 0) {
                    // Charging: bar goes upward
                    ctx.fillRect(x, centerY - barHeight, barWidth - 2, barHeight);
                } else {
                    // Discharging: bar goes downward
                    ctx.fillRect(x, centerY, barWidth - 2, barHeight);
                }
            }
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
        
        // Start smooth fade-in animation
        let fadeProgress = 0;
        const fadeSteps = 10; // Number of fade-in steps per hour
        const fadeInterval = this.animationSpeed / fadeSteps;
        
        this.animationInterval = setInterval(() => {
            fadeProgress++;
            
            if (fadeProgress >= fadeSteps) {
                // Move to next hour
                fadeProgress = 0;
                this.currentHour++;
                
                if (this.currentHour >= 24) {
                    // Animation complete - trigger scenario change
                    this.pause();
                    this.onAnimationComplete();
                    return;
                }
                
                // Start fading in the new hour
                this.barOpacity[this.currentHour] = 0;
            }
            
            // Smooth fade-in for current hour
            if (this.currentHour < 24) {
                this.barOpacity[this.currentHour] = Math.min(1, fadeProgress / fadeSteps);
            }
            
            this.draw();
            this.updateTimeDisplay();
        }, fadeInterval);
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
        const pauseBtn = document.getElementById('pauseChart');
        
        // Pause button toggles play/pause
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.pause();
                    pauseBtn.classList.remove('playing');
                    pauseBtn.innerHTML = '<span class="pause-icon">▶</span> Fortsetzen';
                } else {
                    this.play();
                    pauseBtn.classList.add('playing');
                    pauseBtn.innerHTML = '<span class="pause-icon">⏸</span> Pause';
                }
            });
            
            // Set initial state
            if (this.isPlaying) {
                pauseBtn.classList.add('playing');
            }
        }
        
        // Setup scenario tabs (manual switching disabled during auto-loop)
        const tabButtons = document.querySelectorAll('.chart-tab');
        tabButtons.forEach(tab => {
            tab.addEventListener('click', () => {
                const scenario = tab.dataset.scenario;
                
                // Stop auto-loop when user manually selects
                this.autoLoopEnabled = false;
                this.updateScenarioIndex(scenario);
                this.switchScenario(scenario);
                
                // Update active tab
                this.updateActiveTabs();
            });
        });
        
        // Setup arrow navigation buttons
        const prevBtn = document.getElementById('prevScenario');
        const nextBtn = document.getElementById('nextScenario');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                // Stop auto-loop when user manually navigates
                this.autoLoopEnabled = false;
                this.navigateToPreviousScenario();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Stop auto-loop when user manually navigates
                this.autoLoopEnabled = false;
                this.navigateToNextScenario();
            });
        }
        
        // Enable auto-loop through scenarios
        this.autoLoopEnabled = true;
        this.scenarios = ['self-consumption', 'peak-shaving', 'blackout'];
        this.currentScenarioIndex = 0;
    }
    
    updateScenarioIndex(scenario) {
        this.currentScenarioIndex = this.scenarios.indexOf(scenario);
    }
    
    navigateToPreviousScenario() {
        this.currentScenarioIndex = (this.currentScenarioIndex - 1 + this.scenarios.length) % this.scenarios.length;
        const prevScenario = this.scenarios[this.currentScenarioIndex];
        this.switchScenario(prevScenario);
        this.updateActiveTabs();
    }
    
    navigateToNextScenario() {
        this.currentScenarioIndex = (this.currentScenarioIndex + 1) % this.scenarios.length;
        const nextScenario = this.scenarios[this.currentScenarioIndex];
        this.switchScenario(nextScenario);
        this.updateActiveTabs();
    }
    
    updateActiveTabs() {
        const currentScenario = this.scenarios[this.currentScenarioIndex];
        const tabButtons = document.querySelectorAll('.chart-tab');
        tabButtons.forEach(tab => {
            if (tab.dataset.scenario === currentScenario) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update scenario description
        this.updateScenarioDescription(currentScenario);
    }
    
    updateScenarioDescription(scenario) {
        const scenarioTexts = document.querySelectorAll('.scenario-text');
        scenarioTexts.forEach(text => {
            if (text.dataset.scenario === scenario) {
                text.style.display = 'block';
                // Restart animation
                text.style.animation = 'none';
                text.offsetHeight; // Trigger reflow
                text.style.animation = 'fadeInText 0.5s ease-out forwards';
            } else {
                text.style.display = 'none';
            }
        });
    }
    
    switchScenario(scenario, isAutoLoop = false) {
        // Pause current animation
        this.pause();
        
        // Load new scenario data
        this.loadScenario(scenario);
        
        // Reset animation
        this.currentHour = 0;
        for (let i = 0; i < 24; i++) {
            this.barOpacity[i] = 0;
        }
        
        // Redraw and restart
        this.draw();
        this.updateTimeDisplay();
        
        // Update pause button
        const pauseBtn = document.getElementById('pauseChart');
        if (pauseBtn) {
            pauseBtn.classList.add('playing');
            pauseBtn.innerHTML = '<span class="pause-icon">⏸</span> Pause';
        }
        
        // Auto-play new scenario
        setTimeout(() => this.play(), 500);
    }
    
    onAnimationComplete() {
        // Called when animation reaches hour 23
        if (this.autoLoopEnabled) {
            // Move to next scenario
            this.currentScenarioIndex = (this.currentScenarioIndex + 1) % this.scenarios.length;
            const nextScenario = this.scenarios[this.currentScenarioIndex];
            
            // Update active tab and description
            this.updateActiveTabs();
            
            // Switch to next scenario after brief pause
            setTimeout(() => {
                this.switchScenario(nextScenario, true);
            }, 1500);
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
// PROGRESSIVE CONTACT FORM
// ===========================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formToggle = document.getElementById('formToggle');
    const expandableFields = document.getElementById('expandableFields');
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const submitBtn = document.getElementById('submitBtn');
    const toggleText = document.getElementById('toggleText');
    const formIcon = document.querySelector('.contact-icon-large i');
    
    // Progressive form toggle
    if (formToggle && expandableFields) {
        formToggle.addEventListener('click', function() {
            const currentState = form.dataset.state;
            
            if (currentState === 'newsletter') {
                // Switch to contact mode
                form.dataset.state = 'contact';
                expandableFields.style.display = 'flex';
                
                // Trigger reflow for animation
                expandableFields.offsetHeight;
                expandableFields.classList.add('expanded');
                
                // Update header
                formTitle.textContent = 'Direkt kontaktieren';
                formSubtitle.textContent = 'Haben Sie Fragen? Schreiben Sie uns direkt';
                
                // Update submit button
                submitBtn.textContent = 'Nachricht senden';
                
                // Update icon
                if (formIcon) {
                    formIcon.setAttribute('data-feather', 'message-circle');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                }
                
                // Make name and message required in contact mode
                document.getElementById('name').required = true;
                document.getElementById('message').required = true;
                
            } else {
                // Switch back to newsletter mode
                form.dataset.state = 'newsletter';
                expandableFields.classList.remove('expanded');
                
                setTimeout(() => {
                    expandableFields.style.display = 'none';
                }, 400); // Match CSS transition duration
                
                // Update header
                formTitle.textContent = 'Bleiben Sie auf dem Laufenden';
                formSubtitle.textContent = 'Erhalten Sie Updates zu neuen Produkten und Angeboten';
                
                // Update submit button
                submitBtn.textContent = 'Anmelden';
                
                // Update icon
                if (formIcon) {
                    formIcon.setAttribute('data-feather', 'mail');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                }
                
                // Remove required from extra fields
                document.getElementById('name').required = false;
                document.getElementById('message').required = false;
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentState = form.dataset.state;
        const email = document.getElementById('email').value;
        
        let formData = {
            email: email,
            type: currentState
        };
        
        // Add extra fields if in contact mode
        if (currentState === 'contact') {
            formData.name = document.getElementById('name').value;
            formData.phone = document.getElementById('phone').value || '';
            formData.message = document.getElementById('message').value;
            formData.newsletter = document.getElementById('newsletter').checked;
        } else {
            formData.newsletter = true;
        }
        
        // Disable submit button
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
            
            if (currentState === 'newsletter') {
                successMessage.textContent = '✓ Vielen Dank! Sie wurden erfolgreich für unseren Newsletter angemeldet.';
            } else {
                successMessage.textContent = '✓ Vielen Dank! Wir haben Ihre Nachricht erhalten und melden uns in Kürze.';
            }
            
            // Insert success message before form
            form.parentNode.insertBefore(successMessage, form);
            
            // Hide form
            form.style.display = 'none';
            
            // Remove success message after 5 seconds and show form again
            setTimeout(() => {
                successMessage.remove();
                form.style.display = 'flex';
                form.reset();
                
                // Reset to newsletter mode
                if (currentState === 'contact') {
                    expandableFields.classList.remove('expanded');
                    expandableFields.style.display = 'none';
                    form.dataset.state = 'newsletter';
                    formTitle.textContent = 'Bleiben Sie auf dem Laufenden';
                    formSubtitle.textContent = 'Erhalten Sie Updates zu neuen Produkten und Angeboten';
                    submitBtn.textContent = 'Anmelden';
                    if (formIcon) {
                        formIcon.setAttribute('data-feather', 'mail');
                        if (typeof feather !== 'undefined') {
                            feather.replace();
                        }
                    }
                }
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 5000);
            
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
        this.isAnimating = false; // Animation lock
        
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
        allCards.forEach(card => {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateX(0)';
        });
        
        // Show only visible cards with animation
        this.visibleCards.forEach((card, index) => {
            card.style.display = 'block';
            // Trigger animation
            setTimeout(() => {
                card.style.opacity = '1';
            }, 50);
        });
    }
    
    slideLeft() {
        if (this.isAnimating) return; // Prevent multiple animations
        this.isAnimating = true;
        
        // Disable buttons during animation
        if (this.prevBtn) this.prevBtn.style.pointerEvents = 'none';
        if (this.nextBtn) this.nextBtn.style.pointerEvents = 'none';
        
        // Store current height before animation
        const trackHeight = this.track.offsetHeight;
        this.track.style.minHeight = trackHeight + 'px';
        
        // Animate out to left
        this.visibleCards.forEach(card => {
            card.style.transform = 'translateX(-100%)';
            card.style.opacity = '0';
        });
        
        setTimeout(() => {
            this.swapRandomProduct('left');
            
            // Reset height and re-enable buttons after animation completes
            setTimeout(() => {
                this.track.style.minHeight = '';
                if (this.prevBtn) this.prevBtn.style.pointerEvents = 'auto';
                if (this.nextBtn) this.nextBtn.style.pointerEvents = 'auto';
                this.isAnimating = false;
            }, 100);
        }, 500);
    }
    
    slideRight() {
        if (this.isAnimating) return; // Prevent multiple animations
        this.isAnimating = true;
        
        // Disable buttons during animation
        if (this.prevBtn) this.prevBtn.style.pointerEvents = 'none';
        if (this.nextBtn) this.nextBtn.style.pointerEvents = 'none';
        
        // Store current height before animation
        const trackHeight = this.track.offsetHeight;
        this.track.style.minHeight = trackHeight + 'px';
        
        // Animate out to right
        this.visibleCards.forEach(card => {
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';
        });
        
        setTimeout(() => {
            this.swapRandomProduct('right');
            
            // Reset height and re-enable buttons after animation completes
            setTimeout(() => {
                this.track.style.minHeight = '';
                if (this.prevBtn) this.prevBtn.style.pointerEvents = 'auto';
                if (this.nextBtn) this.nextBtn.style.pointerEvents = 'auto';
                this.isAnimating = false;
            }, 100);
        }, 500);
    }
    
    swapRandomProduct(direction = 'left') {
        // Determine which product to swap based on current view
        const isSwappingDC = Math.random() < 0.5;
        const productType = isSwappingDC ? 'dc' : 'ac';
        const productPool = isSwappingDC ? this.dcProducts : this.acProducts;
        
        // Find current visible product of this type
        const currentProductIndex = this.visibleCards.findIndex(card => 
            card.dataset.type === productType
        );
        
        if (currentProductIndex === -1) return;
        
        // Get a random different product
        const availableProducts = productPool.filter(p => !this.visibleCards.includes(p));
        if (availableProducts.length === 0) return;
        
        const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        
        // Swap the products
        this.visibleCards[currentProductIndex] = randomProduct;
        
        // Prepare new card for slide in from opposite direction
        randomProduct.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
        randomProduct.style.opacity = '0';
        
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
            this.prevBtn.addEventListener('click', () => this.slideRight());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.slideLeft());
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
                if (diff > 0) {
                    // Swiped left - show next
                    this.slideLeft();
                } else {
                    // Swiped right - show previous
                    this.slideRight();
                }
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
