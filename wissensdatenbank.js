// Wissensdatenbank JavaScript
const DOCS_API_URL = 'https://script.google.com/macros/s/AKfycbze2YcwvdF3DkglLEPcPdnBiMN0RNRhR6e-Mzekl7rZO8Y-010EvS62dCtOELgIV4a2jQ/exec';
const DOCS_CACHE_KEY = 'modual_docs_cache';
const DOCS_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

let docsData = null;
let currentArticle = null;
let fuseInstance = null;

// ===========================
// CACHE MANAGEMENT
// ===========================

function getDocsCachedData() {
    try {
        const cached = localStorage.getItem(DOCS_CACHE_KEY);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        
        if (age < DOCS_CACHE_DURATION) {
            console.log(`Using cached docs data (${Math.round(age / 1000)}s old)`);
            return data;
        }
        
        console.log('Docs cache expired, fetching fresh data...');
        return null;
    } catch (error) {
        console.error('Error reading docs cache:', error);
        return null;
    }
}

function setDocsCachedData(data) {
    try {
        const cacheObject = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(DOCS_CACHE_KEY, JSON.stringify(cacheObject));
        console.log('Docs data cached successfully');
    } catch (error) {
        console.error('Error saving docs cache:', error);
    }
}

// ===========================
// DATA LOADING
// ===========================

async function loadDocsData() {
    try {
        // Check cache first
        const cachedData = getDocsCachedData();
        if (cachedData) {
            docsData = cachedData;
            return cachedData;
        }
        
        // Fetch from API
        console.log('Fetching docs from API...');
        console.log('API URL:', DOCS_API_URL);
        const response = await fetch(DOCS_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get response as text first to check if it's HTML
        const responseText = await response.text();
        console.log('📄 Response preview:', responseText.substring(0, 200));
        
        // Check if response is HTML instead of JSON
        if (responseText.trim().startsWith('<!DOCTYPE') || 
            responseText.trim().startsWith('<html') || 
            responseText.trim().startsWith('<')) {
            throw new Error('API is returning HTML instead of JSON. Please check Google Apps Script deployment settings and ensure doGet() returns ContentService with JSON MIME type.');
        }
        
        const data = JSON.parse(responseText);
        console.log('✅ Docs data loaded successfully');
        console.log('📊 Raw API Response:', data);
        console.log('📚 Number of articles:', data?.articles?.length || 0);
        console.log('🏗️ Data structure:', {
            hasNavigation: !!data?.navigation,
            hasArticles: !!data?.articles,
            articlesCount: data?.articles?.length || 0,
            navigationSections: data?.navigation?.length || 0,
            dataKeys: Object.keys(data || {})
        });
        
        // Log first article as sample
        if (data?.articles && data.articles.length > 0) {
            console.log('📄 First article sample:', {
                id: data.articles[0].id,
                title: data.articles[0].title,
                category: data.articles[0].category,
                hasContent: !!data.articles[0].content
            });
        }
        
        // Validate data structure
        if (!data || !data.articles || !Array.isArray(data.articles)) {
            throw new Error('Invalid data structure received from API');
        }
        
        // Save to cache
        setDocsCachedData(data);
        
        docsData = data;
        return data;
    } catch (error) {
        console.error('Error loading docs data:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        // Show detailed error in UI
        showDetailedError(error);
        
        // Try to use expired cache as fallback
        const fallbackCache = localStorage.getItem(DOCS_CACHE_KEY);
        if (fallbackCache) {
            try {
                const { data } = JSON.parse(fallbackCache);
                console.warn('Using expired cache as fallback');
                docsData = data;
                return data;
            } catch (e) {
                console.error('Fallback cache also failed:', e);
            }
        }
        
        return null;
    }
}

function showDetailedError(error) {
    const articleContainer = document.getElementById('docsArticle');
    if (!articleContainer) return;
    
    articleContainer.innerHTML = `
        <div class="docs-empty">
            <i data-feather="alert-circle"></i>
            <h2>API Debug Information</h2>
            <div style="text-align: left; background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <p><strong>Error Message:</strong> ${error.message}</p>
                <p><strong>API URL:</strong> ${DOCS_API_URL}</p>
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Open browser console (F12) to see detailed logs</li>
                    <li>Check if API is accessible: <a href="${DOCS_API_URL}" target="_blank" style="color: var(--electric-blue);">Open API URL</a></li>
                    <li>Verify Google Apps Script deployment settings</li>
                </ol>
            </div>
            <button onclick="window.modualDocsDebug.reload()" class="btn btn-primary">Reload & Clear Cache</button>
        </div>
    `;
    
    feather.replace();
}

// ===========================
// NAVIGATION RENDERING
// ===========================

function renderNavigation(data) {
    const navContainer = document.getElementById('docsNav');
    if (!navContainer || !data || !data.navigation) return;
    
    let html = '';
    
    data.navigation.forEach(section => {
        html += `<div class="docs-nav-section">`;
        html += `<div class="docs-nav-title">${section.title}</div>`;
        html += `<ul class="docs-nav-list">`;
        
        if (section.children) {
            section.children.forEach(item => {
                const isActive = currentArticle && currentArticle.id === item.id;
                html += `
                    <li class="docs-nav-item">
                        <a href="#${item.id}" class="docs-nav-link ${isActive ? 'active' : ''}" data-article-id="${item.id}">
                            ${item.icon ? `<i data-feather="${item.icon}" class="docs-nav-icon"></i>` : ''}
                            <span>${item.title}</span>
                        </a>
                    </li>
                `;
            });
        }
        
        html += `</ul></div>`;
    });
    
    navContainer.innerHTML = html;
    feather.replace();
    
    // Add click handlers
    navContainer.querySelectorAll('.docs-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = link.getAttribute('data-article-id');
            loadArticle(articleId);
        });
    });
}

// ===========================
// ARTICLE RENDERING
// ===========================

function loadArticle(articleId) {
    if (!docsData || !docsData.articles) return;
    
    const article = docsData.articles.find(a => a.id === articleId);
    if (!article) {
        showError('Artikel nicht gefunden');
        return;
    }
    
    currentArticle = article;
    
    // Update URL without reload
    window.history.pushState({ articleId }, '', `#${articleId}`);
    
    // Render article
    renderArticle(article);
    
    // Update navigation active state
    updateNavigationActiveState(articleId);
    
    // Generate TOC
    generateTableOfContents();
    
    // Update breadcrumb
    updateBreadcrumb(article);
    
    // Update navigation footer
    updateNavigationFooter(articleId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderArticle(article) {
    const articleContainer = document.getElementById('docsArticle');
    if (!articleContainer) return;
    
    articleContainer.innerHTML = article.content;
    
    // Add IDs to headings for TOC
    const headings = articleContainer.querySelectorAll('h2, h3');
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
    });
    
    feather.replace();
}

function updateNavigationActiveState(articleId) {
    document.querySelectorAll('.docs-nav-link').forEach(link => {
        if (link.getAttribute('data-article-id') === articleId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function updateBreadcrumb(article) {
    const breadcrumb = document.getElementById('docsBreadcrumb');
    if (!breadcrumb) return;
    
    breadcrumb.innerHTML = `
        <a href="wissensdatenbank.html">Wissensdatenbank</a>
        <span> / ${article.category || ''} / ${article.title}</span>
    `;
}

function updateNavigationFooter(articleId) {
    const footer = document.getElementById('docsNavFooter');
    const prevLink = document.getElementById('docsPrevLink');
    const nextLink = document.getElementById('docsNextLink');
    
    if (!footer || !prevLink || !nextLink || !docsData) return;
    
    const allArticles = docsData.articles;
    const currentIndex = allArticles.findIndex(a => a.id === articleId);
    
    if (currentIndex === -1) {
        footer.style.display = 'none';
        return;
    }
    
    footer.style.display = 'flex';
    
    // Previous article
    if (currentIndex > 0) {
        const prevArticle = allArticles[currentIndex - 1];
        prevLink.href = `#${prevArticle.id}`;
        prevLink.querySelector('span').textContent = prevArticle.title;
        prevLink.style.display = 'flex';
        prevLink.onclick = (e) => {
            e.preventDefault();
            loadArticle(prevArticle.id);
        };
    } else {
        prevLink.style.display = 'none';
    }
    
    // Next article
    if (currentIndex < allArticles.length - 1) {
        const nextArticle = allArticles[currentIndex + 1];
        nextLink.href = `#${nextArticle.id}`;
        nextLink.querySelector('span').textContent = nextArticle.title;
        nextLink.style.display = 'flex';
        nextLink.onclick = (e) => {
            e.preventDefault();
            loadArticle(nextArticle.id);
        };
    } else {
        nextLink.style.display = 'none';
    }
    
    feather.replace();
}

// ===========================
// TABLE OF CONTENTS
// ===========================

function generateTableOfContents() {
    const tocContainer = document.getElementById('tocNav');
    const article = document.getElementById('docsArticle');
    
    if (!tocContainer || !article) return;
    
    const headings = article.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
        tocContainer.innerHTML = '<p class="docs-no-results">Keine Überschriften gefunden</p>';
        return;
    }
    
    let html = '<ul>';
    
    headings.forEach(heading => {
        const level = heading.tagName === 'H2' ? 2 : 3;
        const indent = level === 3 ? 'style="padding-left: 1rem;"' : '';
        
        html += `
            <li ${indent}>
                <a href="#${heading.id}" class="toc-link" data-heading-id="${heading.id}">
                    ${heading.textContent}
                </a>
            </li>
        `;
    });
    
    html += '</ul>';
    
    tocContainer.innerHTML = html;
    
    // Add click handlers
    tocContainer.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const headingId = link.getAttribute('data-heading-id');
            const heading = document.getElementById(headingId);
            if (heading) {
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Highlight active section on scroll
    observeHeadings(headings);
}

function observeHeadings(headings) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.toc-link').forEach(link => {
                    if (link.getAttribute('data-heading-id') === entry.target.id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-100px 0px -80% 0px'
    });
    
    headings.forEach(heading => observer.observe(heading));
}

// ===========================
// SEARCH FUNCTIONALITY
// ===========================

function initializeSearch() {
    if (!docsData || !docsData.articles) return;
    
    // Initialize Fuse.js
    fuseInstance = new Fuse(docsData.articles, {
        keys: ['title', 'content', 'category', 'searchKeywords'],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true
    });
    
    const searchInput = document.getElementById('docsSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            renderNavigation(docsData);
            return;
        }
        
        performSearch(query);
    });
}

function performSearch(query) {
    if (!fuseInstance) return;
    
    const results = fuseInstance.search(query);
    renderSearchResults(results);
}

function renderSearchResults(results) {
    const navContainer = document.getElementById('docsNav');
    if (!navContainer) return;
    
    if (results.length === 0) {
        navContainer.innerHTML = '<div class="docs-no-results">Keine Ergebnisse gefunden</div>';
        return;
    }
    
    let html = '<div class="docs-search-results">';
    
    results.slice(0, 10).forEach(result => {
        const article = result.item;
        const excerpt = getSearchExcerpt(article.content, 100);
        
        html += `
            <div class="docs-search-result" data-article-id="${article.id}">
                <div class="docs-search-result-title">${article.title}</div>
                <div class="docs-search-result-excerpt">${excerpt}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    navContainer.innerHTML = html;
    
    // Add click handlers
    navContainer.querySelectorAll('.docs-search-result').forEach(result => {
        result.addEventListener('click', () => {
            const articleId = result.getAttribute('data-article-id');
            loadArticle(articleId);
            
            // Clear search
            document.getElementById('docsSearch').value = '';
            renderNavigation(docsData);
        });
    });
}

function getSearchExcerpt(html, maxLength) {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ===========================
// COPY FOR LLM
// ===========================

function copyForLLM() {
    if (!currentArticle) return;
    
    // Create clean text version
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentArticle.content;
    
    // Remove images
    tempDiv.querySelectorAll('img').forEach(img => img.remove());
    
    // Format for LLM
    const text = `# ${currentArticle.title}\n\nKategorie: ${currentArticle.category || 'Allgemein'}\n\n${tempDiv.innerText}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        showToast('Inhalt kopiert!');
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('Kopieren fehlgeschlagen', 'error');
    });
}

// ===========================
// DOWNLOAD AS PDF
// ===========================

function downloadAsPDF() {
    if (!currentArticle) return;
    
    const element = document.getElementById('docsArticle');
    if (!element) return;
    
    const opt = {
        margin: 1,
        filename: `${currentArticle.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // Show loading state
    const btn = document.getElementById('downloadPDF');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i data-feather="loader"></i> <span>Erstelle PDF...</span>';
    btn.disabled = true;
    feather.replace();
    
    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        feather.replace();
        showToast('PDF heruntergeladen!');
    }).catch(err => {
        console.error('PDF generation failed:', err);
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        feather.replace();
        showToast('PDF-Erstellung fehlgeschlagen', 'error');
    });
}

// ===========================
// UTILITIES
// ===========================

function showToast(message, type = 'success') {
    const toast = document.getElementById('copyToast');
    if (!toast) return;
    
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showError(message) {
    const articleContainer = document.getElementById('docsArticle');
    if (!articleContainer) return;
    
    articleContainer.innerHTML = `
        <div class="docs-empty">
            <i data-feather="alert-circle"></i>
            <h2>Fehler</h2>
            <p>${message}</p>
            <a href="wissensdatenbank.html" class="btn btn-primary">Zurück zur Übersicht</a>
        </div>
    `;
    
    feather.replace();
}

function showLoading() {
    const articleContainer = document.getElementById('docsArticle');
    if (!articleContainer) return;
    
    articleContainer.innerHTML = `
        <div class="docs-loading">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 90%;"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
        </div>
    `;
}

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing Wissensdatenbank...');
    
    // Show loading state
    showLoading();
    
    // Load data
    const data = await loadDocsData();
    
    if (!data || !data.articles || data.articles.length === 0) {
        let errorMsg = '';
        
        if (!data) {
            errorMsg = 'Verbindung zur Dokumentations-API fehlgeschlagen. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es später erneut.';
        } else if (!data.articles) {
            errorMsg = `
                <strong>API Fehler: Keine Artikel gefunden</strong><br><br>
                Die API gibt keine Artikel zurück. Mögliche Ursachen:<br>
                <ul style="text-align: left; margin: 1rem 0;">
                    <li>Google Apps Script gibt HTML statt JSON zurück</li>
                    <li>Die Datenstruktur ist nicht korrekt</li>
                    <li>Das Script hat einen Laufzeitfehler</li>
                </ul>
                <br>
                👉 Siehe <strong>GOOGLE_APPS_SCRIPT_FIX.md</strong> für die Lösung
            `;
        } else {
            errorMsg = 'Keine Dokumentation verfügbar. Die API gibt keine Artikel zurück. Bitte überprüfen Sie die Google Apps Script Konfiguration.';
        }
        
        showError(errorMsg);
        
        // Show debug info in console
        console.error('Documentation load failed:', {
            hasData: !!data,
            hasArticles: !!data?.articles,
            articlesLength: data?.articles?.length,
            dataKeys: data ? Object.keys(data) : []
        });
        return;
    }
    
    // Render navigation
    renderNavigation(data);
    
    // Initialize search
    initializeSearch();
    
    // Load article from URL hash or first article
    const hash = window.location.hash.substring(1);
    const articleId = hash || data.articles[0].id;
    loadArticle(articleId);
    
    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
        const articleId = event.state?.articleId || data.articles[0].id;
        loadArticle(articleId);
    });
    
    // Copy button
    document.getElementById('copyForLLM')?.addEventListener('click', copyForLLM);
    
    // PDF button
    document.getElementById('downloadPDF')?.addEventListener('click', downloadAsPDF);
    
    console.log('Wissensdatenbank initialized successfully');
});

// Export for debugging
window.modualDocsDebug = {
    data: () => docsData,
    currentArticle: () => currentArticle,
    clearCache: () => {
        localStorage.removeItem(DOCS_CACHE_KEY);
        console.log('Docs cache cleared');
    },
    reload: () => {
        window.modualDocsDebug.clearCache();
        location.reload();
    }
};
