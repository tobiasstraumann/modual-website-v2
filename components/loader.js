// Component Loader - Dynamically load header and footer components

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Failed to load component: ${componentPath}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

async function loadComponents() {
    // Load header
    await loadComponent('header-placeholder', 'components/header.html');
    
    // Load footer
    await loadComponent('footer-placeholder', 'components/footer.html');
    
    // Initialize Feather icons after components are loaded
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Reinitialize mega menu and hamburger after header loads
    if (typeof initMegaMenu === 'function') {
        initMegaMenu();
    }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}
