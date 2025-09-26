// Toggle Mobile Navigation Menu
function toggleMobileMenu() {
  const nav = document.querySelector('.main-nav');
  if (nav) {
    nav.classList.toggle('open');
  }
}

// Handle Dropdown Click on Mobile
document.addEventListener('DOMContentLoaded', function () {
  const dropdownLinks = document.querySelectorAll('.dropdown > a');

  dropdownLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = this.parentElement;
        parent.classList.toggle('open');
      }
    });
  });

  // Language toggle buttons
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      langButtons.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
      // You can add language switching logic here
    });
  });
});

// Google Translate Init Function (fallback support)
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'ja',
      includedLanguages: 'en,ja',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    'google_translate_element'
  );
}



// script.js - Universal Auto Translation (Works on any page)

class UniversalTranslationManager {
  constructor() {
    this.currentLanguage = 'ja';
    this.isTranslating = false;
    this.originalContent = new Map();
    this.translationCache = new Map();
    
    // Using MyMemory Translation API (free, no API key required)
    this.apiEndpoint = 'https://api.mymemory.translated.net/get';
    
    this.init();
  }
  
  init() {
    this.saveOriginalContent();
    this.setupEventListeners();
    this.hideError();
    this.detectInitialLanguage();
  }
  
  saveOriginalContent() {
    // Universal selector that works on any page structure
    const elementsToTranslate = document.querySelectorAll(`
      [class*="text"], 
      [class*="content"], 
      [class*="title"], 
      [class*="subtitle"],
      [class*="label"],
      [class*="description"],
      h1, h2, h3, h4, h5, h6,
      p, span, div, li, td, th,
      .subtext, .content, .news-content, .feature-content,
      .video-subtitle, .subtitle, .tag, .news-date,
      .image-overlay p, .footer-column h3,
      .footer-column ul li a, nav ul li a,
      .info-item .label, .info-item .content,
      .feature-row .feature-label, .feature-row .feature-content,
      .card-content h2, .card-content p,
      .read-more-button, button, .btn, a
    `);
    
    let savedCount = 0;
    
    elementsToTranslate.forEach((element) => {
      // Skip elements that shouldn't be translated
      if (this.shouldSkipElement(element)) return;
      
      // Only process elements with direct text content (avoid nesting issues)
      const directText = this.getDirectTextContent(element);
      if (!directText || directText.length < 2) return;
      
      const key = `element_${savedCount}`;
      element.setAttribute('data-translate-key', key);
      
      // Store both text and HTML structure
      this.originalContent.set(key, {
        text: directText,
        html: element.innerHTML,
        element: element,
        tagName: element.tagName.toLowerCase()
      });
      
      savedCount++;
    });
    
    console.log(`Saved ${savedCount} elements for translation`);
  }
  
  shouldSkipElement(element) {
    // Skip elements that shouldn't be translated
    const skipSelectors = [
      'script', 'style', 'noscript', 'meta', 'link', 'title',
      '.no-translate', '[data-no-translate]', '.lang-btn',
      '#google_translate_element', '#lang-error'
    ];
    
    // Check if element matches skip selectors
    if (skipSelectors.some(selector => element.matches(selector))) return true;
    
    // Skip if element is inside a skip zone
    if (element.closest('.no-translate, [data-no-translate], script, style')) return true;
    
    // Skip if element has no visible text
    if (element.offsetParent === null && element.style.display === 'none') return true;
    
    // Skip if element only contains other elements (no direct text)
    const directText = this.getDirectTextContent(element);
    if (!directText.trim()) return true;
    
    return false;
  }
  
  getDirectTextContent(element) {
    // Get only the direct text content, excluding child elements
    let text = '';
    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      }
    }
    return text.trim();
  }
  
  setupEventListeners() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.dataset.lang;
        this.switchLanguage(targetLang);
      });
    });
  }
  
  detectInitialLanguage() {
    // Check if page was loaded with a specific language preference
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && (langParam === 'en' || langParam === 'ja')) {
      this.currentLanguage = langParam;
      this.updateButtonStates(langParam);
      
      if (langParam === 'en') {
        // Translate to English on page load
        setTimeout(() => this.switchLanguage('en'), 500);
      }
    }
  }
  
  async switchLanguage(targetLang) {
    if (this.isTranslating || this.currentLanguage === targetLang) {
      return;
    }
    
    this.isTranslating = true;
    this.updateButtonStates(targetLang);
    this.hideError();
    this.showLoadingState(true);
    
    try {
      if (targetLang === 'ja') {
        // Switch back to Japanese (original)
        this.restoreOriginalContent();
      } else {
        // Translate to target language
        await this.translatePage(targetLang);
      }
      
      this.currentLanguage = targetLang;
      
      // Update URL to remember language preference
      this.updateURL(targetLang);
      
      console.log(`Successfully switched to ${targetLang}`);
    } catch (error) {
      console.error('Translation failed:', error);
      this.showError('Translation failed. Please check your internet connection and try again.');
      this.updateButtonStates(this.currentLanguage);
    } finally {
      this.isTranslating = false;
      this.showLoadingState(false);
    }
  }
  
  restoreOriginalContent() {
    this.originalContent.forEach((content) => {
      if (content.element && content.element.isConnected) {
        // Preserve structure by only replacing text nodes
        this.replaceTextNodes(content.element, content.text);
      }
    });
  }
  
  replaceTextNodes(element, originalText) {
    // Replace only text nodes to preserve HTML structure
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    // If there's only one text node, replace it directly
    if (textNodes.length === 1) {
      textNodes[0].textContent = originalText;
    }
  }
  
  async translatePage(targetLang) {
    const elementsToTranslate = [];
    
    // Collect elements that need translation
    this.originalContent.forEach((content, key) => {
      if (content.element && 
          content.element.isConnected && 
          this.needsTranslation(content.text)) {
        elementsToTranslate.push({ key, content });
      }
    });
    
    if (elementsToTranslate.length === 0) {
      console.log('No elements need translation');
      return;
    }
    
    console.log(`Translating ${elementsToTranslate.length} elements`);
    
    // Process translations in smaller batches
    const batchSize = 3; // Smaller batches to avoid rate limits
    const totalBatches = Math.ceil(elementsToTranslate.length / batchSize);
    
    for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
      const batch = elementsToTranslate.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      
      console.log(`Processing batch ${batchNumber}/${totalBatches}`);
      
      // Process batch with individual API calls
      const promises = batch.map(({ key, content }) => 
        this.translateText(content.text, targetLang, key)
      );
      
      const results = await Promise.allSettled(promises);
      
      // Apply successful translations while preserving structure
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          const { content } = batch[index];
          const translation = result.value;
          
          if (content.element && content.element.isConnected) {
            this.replaceTextNodes(content.element, translation);
          }
        }
      });
      
      // Delay between batches
      if (i + batchSize < elementsToTranslate.length) {
        await this.delay(500); // Longer delay to be respectful to free API
      }
    }
  }
  
  needsTranslation(text) {
    if (!text || text.trim().length < 2) return false;
    
    // Check if text contains Japanese characters
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    const containsJapanese = japaneseRegex.test(text);
    
    // Skip URLs, emails, numbers, and common patterns
    const skipRegex = /^[\d\s\-\.\/]+$|@|http|www\.|\.com|\.jp|\.png|\.jpg|\.gif|^\d{4}\.\d{2}\.\d{2}$/;
    if (skipRegex.test(text.trim())) return false;
    
    return containsJapanese;
  }
  
  async translateText(text, targetLang, key) {
    // Check cache first
    const cacheKey = `${key}_${targetLang}`;
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }
    
    try {
      const cleanText = text.trim();
      if (!cleanText) return text;
      
      // MyMemory Translation API call
      const url = `${this.apiEndpoint}?q=${encodeURIComponent(cleanText)}&langpair=ja|${targetLang}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        const translation = data.responseData.translatedText;
        
        // Cache the translation
        this.translationCache.set(cacheKey, translation);
        
        return translation;
      } else {
        console.warn(`Translation API returned error for text: "${cleanText}"`);
        return text;
      }
      
    } catch (error) {
      console.error(`Translation failed for text: "${text}"`, error);
      return text;
    }
  }
  
  updateURL(lang) {
    // Update URL without page reload to remember language preference
    const url = new URL(window.location);
    if (lang === 'ja') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url);
  }
  
  updateButtonStates(activeLang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.lang === activeLang) {
        btn.classList.add('active');
      }
    });
  }
  
  showError(message) {
    const errorDiv = document.getElementById('lang-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }
  
  hideError() {
    const errorDiv = document.getElementById('lang-error');
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
  }
  
  showLoadingState(isLoading) {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      if (isLoading) {
        btn.style.opacity = '0.6';
        btn.style.pointerEvents = 'none';
        if (btn.classList.contains('active')) {
          btn.textContent = btn.dataset.lang === 'ja' ? 'Japanese...' : 'Translating...';
        }
      } else {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.textContent = btn.dataset.lang === 'ja' ? 'Japanese' : 'English';
      }
    });
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.translationManager = new UniversalTranslationManager();
  console.log('Universal Translation Manager initialized');
});

