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

// class UniversalTranslationManager {
//   constructor() {
//     this.currentLanguage = 'ja';
//     this.isTranslating = false;
//     this.originalContent = new Map();
//     this.translationCache = new Map();
    
//     // Using MyMemory Translation API (free, no API key required)
//     this.apiEndpoint = 'https://api.mymemory.translated.net/get';
    
//     this.init();
//   }
  
//   init() {
//     this.saveOriginalContent();
//     this.setupEventListeners();
//     this.hideError();
//     this.detectInitialLanguage();
//   }
  
//   saveOriginalContent() {
//     // Universal selector that works on any page structure
//     const elementsToTranslate = document.querySelectorAll(`
//       [class*="text"], 
//       [class*="content"], 
//       [class*="title"], 
//       [class*="subtitle"],
//       [class*="label"],
//       [class*="description"],
//       h1, h2, h3, h4, h5, h6,
//       p, span, div, li, td, th,
//       .subtext, .content, .news-content, .feature-content,
//       .video-subtitle, .subtitle, .tag, .news-date,
//       .image-overlay p, .footer-column h3,
//       .footer-column ul li a, nav ul li a,
//       .info-item .label, .info-item .content,
//       .feature-row .feature-label, .feature-row .feature-content,
//       .card-content h2, .card-content p,
//       .read-more-button, button, .btn, a
//     `);
    
//     let savedCount = 0;
    
//     elementsToTranslate.forEach((element) => {
//       // Skip elements that shouldn't be translated
//       if (this.shouldSkipElement(element)) return;
      
//       // Only process elements with direct text content (avoid nesting issues)
//       const directText = this.getDirectTextContent(element);
//       if (!directText || directText.length < 2) return;
      
//       const key = `element_${savedCount}`;
//       element.setAttribute('data-translate-key', key);
      
//       // Store both text and HTML structure
//       this.originalContent.set(key, {
//         text: directText,
//         html: element.innerHTML,
//         element: element,
//         tagName: element.tagName.toLowerCase()
//       });
      
//       savedCount++;
//     });
    
//     console.log(`Saved ${savedCount} elements for translation`);
//   }
  
//   shouldSkipElement(element) {
//     // Skip elements that shouldn't be translated
//     const skipSelectors = [
//       'script', 'style', 'noscript', 'meta', 'link', 'title',
//       '.no-translate', '[data-no-translate]', '.lang-btn',
//       '#google_translate_element', '#lang-error'
//     ];
    
//     // Check if element matches skip selectors
//     if (skipSelectors.some(selector => element.matches(selector))) return true;
    
//     // Skip if element is inside a skip zone
//     if (element.closest('.no-translate, [data-no-translate], script, style')) return true;
    
//     // Skip if element has no visible text
//     if (element.offsetParent === null && element.style.display === 'none') return true;
    
//     // Skip if element only contains other elements (no direct text)
//     const directText = this.getDirectTextContent(element);
//     if (!directText.trim()) return true;
    
//     return false;
//   }
  
//   getDirectTextContent(element) {
//     // Get only the direct text content, excluding child elements
//     let text = '';
//     for (let node of element.childNodes) {
//       if (node.nodeType === Node.TEXT_NODE) {
//         text += node.textContent;
//       }
//     }
//     return text.trim();
//   }
  
//   setupEventListeners() {
//     document.querySelectorAll('.lang-btn').forEach(btn => {
//       btn.addEventListener('click', (e) => {
//         e.preventDefault();
//         const targetLang = btn.dataset.lang;
//         this.switchLanguage(targetLang);
//       });
//     });
//   }
  
//   detectInitialLanguage() {
//     // Check if page was loaded with a specific language preference
//     const urlParams = new URLSearchParams(window.location.search);
//     const langParam = urlParams.get('lang');
    
//     if (langParam && (langParam === 'en' || langParam === 'ja')) {
//       this.currentLanguage = langParam;
//       this.updateButtonStates(langParam);
      
//       if (langParam === 'en') {
//         // Translate to English on page load
//         setTimeout(() => this.switchLanguage('en'), 500);
//       }
//     }
//   }
  
//   async switchLanguage(targetLang) {
//     if (this.isTranslating || this.currentLanguage === targetLang) {
//       return;
//     }
    
//     this.isTranslating = true;
//     this.updateButtonStates(targetLang);
//     this.hideError();
//     this.showLoadingState(true);
    
//     try {
//       if (targetLang === 'ja') {
//         // Switch back to Japanese (original)
//         this.restoreOriginalContent();
//       } else {
//         // Translate to target language
//         await this.translatePage(targetLang);
//       }
      
//       this.currentLanguage = targetLang;
      
//       // Update URL to remember language preference
//       this.updateURL(targetLang);
      
//       console.log(`Successfully switched to ${targetLang}`);
//     } catch (error) {
//       console.error('Translation failed:', error);
//       this.showError('Translation failed. Please check your internet connection and try again.');
//       this.updateButtonStates(this.currentLanguage);
//     } finally {
//       this.isTranslating = false;
//       this.showLoadingState(false);
//     }
//   }
  
//   restoreOriginalContent() {
//     this.originalContent.forEach((content) => {
//       if (content.element && content.element.isConnected) {
//         // Preserve structure by only replacing text nodes
//         this.replaceTextNodes(content.element, content.text);
//       }
//     });
//   }
  
//   replaceTextNodes(element, originalText) {
//     // Replace only text nodes to preserve HTML structure
//     const walker = document.createTreeWalker(
//       element,
//       NodeFilter.SHOW_TEXT,
//       null,
//       false
//     );
    
//     const textNodes = [];
//     let node;
//     while (node = walker.nextNode()) {
//       textNodes.push(node);
//     }
    
//     // If there's only one text node, replace it directly
//     if (textNodes.length === 1) {
//       textNodes[0].textContent = originalText;
//     }
//   }
  
//   async translatePage(targetLang) {
//     const elementsToTranslate = [];
    
//     // Collect elements that need translation
//     this.originalContent.forEach((content, key) => {
//       if (content.element && 
//           content.element.isConnected && 
//           this.needsTranslation(content.text)) {
//         elementsToTranslate.push({ key, content });
//       }
//     });
    
//     if (elementsToTranslate.length === 0) {
//       console.log('No elements need translation');
//       return;
//     }
    
//     console.log(`Translating ${elementsToTranslate.length} elements`);
    
//     // Process translations in smaller batches
//     const batchSize = 3; // Smaller batches to avoid rate limits
//     const totalBatches = Math.ceil(elementsToTranslate.length / batchSize);
    
//     for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
//       const batch = elementsToTranslate.slice(i, i + batchSize);
//       const batchNumber = Math.floor(i / batchSize) + 1;
      
//       console.log(`Processing batch ${batchNumber}/${totalBatches}`);
      
//       // Process batch with individual API calls
//       const promises = batch.map(({ key, content }) => 
//         this.translateText(content.text, targetLang, key)
//       );
      
//       const results = await Promise.allSettled(promises);
      
//       // Apply successful translations while preserving structure
//       results.forEach((result, index) => {
//         if (result.status === 'fulfilled' && result.value) {
//           const { content } = batch[index];
//           const translation = result.value;
          
//           if (content.element && content.element.isConnected) {
//             this.replaceTextNodes(content.element, translation);
//           }
//         }
//       });
      
//       // Delay between batches
//       if (i + batchSize < elementsToTranslate.length) {
//         await this.delay(500); // Longer delay to be respectful to free API
//       }
//     }
//   }
  
//   needsTranslation(text) {
//     if (!text || text.trim().length < 2) return false;
    
//     // Check if text contains Japanese characters
//     const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
//     const containsJapanese = japaneseRegex.test(text);
    
//     // Skip URLs, emails, numbers, and common patterns
//     const skipRegex = /^[\d\s\-\.\/]+$|@|http|www\.|\.com|\.jp|\.png|\.jpg|\.gif|^\d{4}\.\d{2}\.\d{2}$/;
//     if (skipRegex.test(text.trim())) return false;
    
//     return containsJapanese;
//   }
  
//   async translateText(text, targetLang, key) {
//     // Check cache first
//     const cacheKey = `${key}_${targetLang}`;
//     if (this.translationCache.has(cacheKey)) {
//       return this.translationCache.get(cacheKey);
//     }
    
//     try {
//       const cleanText = text.trim();
//       if (!cleanText) return text;
      
//       // MyMemory Translation API call
//       const url = `${this.apiEndpoint}?q=${encodeURIComponent(cleanText)}&langpair=ja|${targetLang}`;
      
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.responseStatus === 200 && data.responseData) {
//         const translation = data.responseData.translatedText;
        
//         // Cache the translation
//         this.translationCache.set(cacheKey, translation);
        
//         return translation;
//       } else {
//         console.warn(`Translation API returned error for text: "${cleanText}"`);
//         return text;
//       }
      
//     } catch (error) {
//       console.error(`Translation failed for text: "${text}"`, error);
//       return text;
//     }
//   }
  
//   updateURL(lang) {
//     // Update URL without page reload to remember language preference
//     const url = new URL(window.location);
//     if (lang === 'ja') {
//       url.searchParams.delete('lang');
//     } else {
//       url.searchParams.set('lang', lang);
//     }
//     window.history.replaceState({}, '', url);
//   }
  
//   updateButtonStates(activeLang) {
//     document.querySelectorAll('.lang-btn').forEach(btn => {
//       btn.classList.remove('active');
//       if (btn.dataset.lang === activeLang) {
//         btn.classList.add('active');
//       }
//     });
//   }
  
//   showError(message) {
//     const errorDiv = document.getElementById('lang-error');
//     if (errorDiv) {
//       errorDiv.textContent = message;
//       errorDiv.style.display = 'block';
//     }
//   }
  
//   hideError() {
//     const errorDiv = document.getElementById('lang-error');
//     if (errorDiv) {
//       errorDiv.style.display = 'none';
//     }
//   }
  
//   showLoadingState(isLoading) {
//     const buttons = document.querySelectorAll('.lang-btn');
//     buttons.forEach(btn => {
//       if (isLoading) {
//         btn.style.opacity = '0.6';
//         btn.style.pointerEvents = 'none';
//         if (btn.classList.contains('active')) {
//           btn.textContent = btn.dataset.lang === 'ja' ? 'Japanese...' : 'Translating...';
//         }
//       } else {
//         btn.style.opacity = '1';
//         btn.style.pointerEvents = 'auto';
//         btn.textContent = btn.dataset.lang === 'ja' ? 'Japanese' : 'English';
//       }
//     });
//   }
  
//   delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
// }

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//   window.translationManager = new UniversalTranslationManager();
//   console.log('Universal Translation Manager initialized');
// });

// Optimized Universal Translation Manager
class OptimizedTranslationManager {
  constructor() {
    this.currentLanguage = 'ja';
    this.isTranslating = false;
    this.originalContent = new Map();
    this.translationCache = new Map();
    
    // Use Google Translate API for batch translation (requires API key)
    // Fallback to MyMemory for demo
    this.useGoogleTranslate = false; // Set to true if you have API key
    this.googleApiKey = ''; // Add your API key here
    
    this.init();
  }
  
  init() {
    this.saveOriginalContent();
    this.setupEventListeners();
    this.hideError();
    this.detectInitialLanguage();
  }
  
  saveOriginalContent() {
    // More targeted selectors to reduce overhead
    const primarySelectors = [
      'h1, h2, h3, h4, h5, h6',
      'p:not(:empty)',
      '.video-subtitle, .subtitle, .subtext',
      '.content:not(:has(*))', // Only leaf content elements
      '.label, .feature-label, .feature-content',
      '.news-content, .tag',
      'nav a, .read-more, button:not(.lang-btn)',
      '.card-content h2, .card-content p'
    ];
    
    const elementsToTranslate = document.querySelectorAll(primarySelectors.join(', '));
    let savedCount = 0;
    
    // Use DocumentFragment for batch DOM operations
    elementsToTranslate.forEach((element) => {
      if (this.shouldSkipElement(element)) return;
      
      const directText = this.getDirectTextContent(element);
      if (!directText || directText.length < 2) return;
      
      const key = `element_${savedCount}`;
      element.setAttribute('data-translate-key', key);
      
      this.originalContent.set(key, {
        text: directText,
        element: element,
        needsTranslation: this.needsTranslation(directText)
      });
      
      savedCount++;
    });
    
    console.log(`Optimized: Saved ${savedCount} elements for translation`);
  }
  
  shouldSkipElement(element) {
    // Faster skip check using classList and attributes
    if (element.hasAttribute('data-no-translate') || 
        element.classList.contains('no-translate') ||
        element.classList.contains('lang-btn')) {
      return true;
    }
    
    // Skip common non-translatable tags
    const skipTags = new Set(['script', 'style', 'noscript', 'meta', 'link', 'title']);
    if (skipTags.has(element.tagName.toLowerCase())) return true;
    
    return false;
  }
  
  getDirectTextContent(element) {
    // Optimized text extraction
    return Array.from(element.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join('')
      .trim();
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
  
  async switchLanguage(targetLang) {
    if (this.isTranslating || this.currentLanguage === targetLang) {
      return;
    }
    
    this.isTranslating = true;
    this.updateButtonStates(targetLang);
    this.hideError();
    this.showLoadingState(true);
    
    const startTime = performance.now();
    
    try {
      if (targetLang === 'ja') {
        this.restoreOriginalContentFast();
      } else {
        await this.translatePageFast(targetLang);
      }
      
      this.currentLanguage = targetLang;
      this.updateURL(targetLang);
      
      const endTime = performance.now();
      console.log(`Translation completed in ${(endTime - startTime).toFixed(2)}ms`);
      
    } catch (error) {
      console.error('Translation failed:', error);
      this.showError('Translation failed. Please try again.');
      this.updateButtonStates(this.currentLanguage);
    } finally {
      this.isTranslating = false;
      this.showLoadingState(false);
    }
  }
  
  restoreOriginalContentFast() {
    // Batch DOM updates using requestAnimationFrame
    const updates = [];
    
    this.originalContent.forEach((content) => {
      if (content.element && content.element.isConnected) {
        updates.push(() => {
          this.replaceTextNodes(content.element, content.text);
        });
      }
    });
    
    // Execute all updates in batches
    this.executeBatchUpdates(updates);
  }
  
  async translatePageFast(targetLang) {
    // Filter elements that actually need translation
    const elementsToTranslate = [];
    const textsToTranslate = [];
    
    this.originalContent.forEach((content, key) => {
      if (content.element && 
          content.element.isConnected && 
          content.needsTranslation) {
        elementsToTranslate.push({ key, content });
        textsToTranslate.push(content.text);
      }
    });
    
    if (textsToTranslate.length === 0) {
      console.log('No elements need translation');
      return;
    }
    
    console.log(`Fast translating ${textsToTranslate.length} elements`);
    
    // Batch translate all texts at once
    const translations = await this.batchTranslate(textsToTranslate, targetLang);
    
    // Apply all translations in one DOM update batch
    const updates = [];
    translations.forEach((translation, index) => {
      if (translation) {
        const { content } = elementsToTranslate[index];
        if (content.element && content.element.isConnected) {
          updates.push(() => {
            this.replaceTextNodes(content.element, translation);
          });
        }
      }
    });
    
    this.executeBatchUpdates(updates);
  }
  
  async batchTranslate(texts, targetLang) {
    if (this.useGoogleTranslate && this.googleApiKey) {
      return this.googleBatchTranslate(texts, targetLang);
    } else {
      return this.myMemoryBatchTranslate(texts, targetLang);
    }
  }
  
  async googleBatchTranslate(texts, targetLang) {
    // Google Translate API supports batch translation
    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          source: 'ja',
          target: targetLang,
          format: 'text'
        })
      });
      
      const data = await response.json();
      return data.data.translations.map(t => t.translatedText);
      
    } catch (error) {
      console.error('Google Translate batch failed:', error);
      return this.myMemoryBatchTranslate(texts, targetLang);
    }
  }
  
  async myMemoryBatchTranslate(texts, targetLang) {
    // For MyMemory, we still need individual calls but optimize them
    const batchSize = 5; // Increased batch size
    const results = new Array(texts.length);
    
    // Process in parallel batches
    const promises = [];
    
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchPromise = this.processBatch(batch, i, targetLang);
      promises.push(batchPromise);
    }
    
    // Wait for all batches to complete
    const batchResults = await Promise.allSettled(promises);
    
    // Flatten results
    batchResults.forEach((result, batchIndex) => {
      if (result.status === 'fulfilled') {
        const batchStartIndex = batchIndex * batchSize;
        result.value.forEach((translation, index) => {
          results[batchStartIndex + index] = translation;
        });
      }
    });
    
    return results;
  }
  
  async processBatch(batch, startIndex, targetLang) {
    // Process batch items in parallel (no delay between requests in same batch)
    const promises = batch.map((text, index) => {
      const cacheKey = `${startIndex + index}_${targetLang}`;
      
      // Check cache first
      if (this.translationCache.has(cacheKey)) {
        return Promise.resolve(this.translationCache.get(cacheKey));
      }
      
      return this.translateSingleText(text, targetLang, cacheKey);
    });
    
    const results = await Promise.allSettled(promises);
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.warn(`Translation failed for: "${batch[index]}"`);
        return batch[index]; // Return original text on failure
      }
    });
  }
  
  async translateSingleText(text, targetLang, cacheKey) {
    try {
      const cleanText = text.trim();
      if (!cleanText) return text;
      
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=ja|${targetLang}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData) {
        const translation = data.responseData.translatedText;
        this.translationCache.set(cacheKey, translation);
        return translation;
      } else {
        return text;
      }
      
    } catch (error) {
      console.error(`Translation failed for: "${text}"`, error);
      return text;
    }
  }
  
  executeBatchUpdates(updates) {
    // Use requestAnimationFrame for smooth DOM updates
    if (updates.length === 0) return;
    
    const batchSize = 20; // Update 20 elements per frame
    let index = 0;
    
    const updateBatch = () => {
      const endIndex = Math.min(index + batchSize, updates.length);
      
      for (let i = index; i < endIndex; i++) {
        updates[i]();
      }
      
      index = endIndex;
      
      if (index < updates.length) {
        requestAnimationFrame(updateBatch);
      }
    };
    
    requestAnimationFrame(updateBatch);
  }
  
  replaceTextNodes(element, newText) {
    // Optimized text node replacement
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNode = walker.nextNode();
    if (textNode && walker.nextNode() === null) {
      // Only one text node, replace directly
      textNode.textContent = newText;
    } else {
      // Multiple text nodes, replace first and remove others
      const nodes = [];
      let node = walker.firstChild();
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          nodes.push(node);
        }
        node = walker.nextNode();
      }
      
      if (nodes.length > 0) {
        nodes[0].textContent = newText;
        nodes.slice(1).forEach(n => n.remove());
      }
    }
  }
  
  needsTranslation(text) {
    if (!text || text.trim().length < 2) return false;
    
    // Cached regex for better performance
    if (!this.japaneseRegex) {
      this.japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
      this.skipRegex = /^[\d\s\-\.\/]+$|@|http|www\.|\.com|\.jp|\.png|\.jpg|\.gif|^\d{4}\.\d{2}\.\d{2}$/;
    }
    
    if (this.skipRegex.test(text.trim())) return false;
    return this.japaneseRegex.test(text);
  }
  
  // ... (other helper methods remain the same)
  
  detectInitialLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && (langParam === 'en' || langParam === 'ja')) {
      this.currentLanguage = langParam;
      this.updateButtonStates(langParam);
      
      if (langParam === 'en') {
        setTimeout(() => this.switchLanguage('en'), 100); // Reduced delay
      }
    }
  }
  
  updateURL(lang) {
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
      btn.classList.toggle('active', btn.dataset.lang === activeLang);
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
      btn.style.opacity = isLoading ? '0.6' : '1';
      btn.style.pointerEvents = isLoading ? 'none' : 'auto';
      
      if (isLoading && btn.classList.contains('active')) {
        btn.textContent = btn.dataset.lang === 'ja' ? 'Japanese...' : 'Translating...';
      } else {
        btn.textContent = btn.dataset.lang === 'ja' ? 'Japanese' : 'English';
      }
    });
  }
}

// Initialize optimized version
document.addEventListener('DOMContentLoaded', () => {
  window.translationManager = new OptimizedTranslationManager();
  console.log('Optimized Universal Translation Manager initialized');
});
