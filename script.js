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
    
    // Separate footer selectors for better targeting
    const footerSelectors = [
      '.footer-column h3',
      '.footer-column ul li a',
      '.copyright',
      '.site-footer p:not(.copyright)', // Avoid duplicate selection
      'footer h3',
      'footer ul li a',
      'footer p'
    ];
    
    // Specific selectors for nested content like business segments
    const nestedContentSelectors = [
      '.segment-item', // Individual business segment spans
      '.business-segments-list span' // Backup selector
    ];
    
    // Combine all selectors
    const allSelectors = [...primarySelectors, ...footerSelectors, ...nestedContentSelectors];
    const elementsToTranslate = document.querySelectorAll(allSelectors.join(', '));
    let savedCount = 0;
    
    // Process main elements
    elementsToTranslate.forEach((element) => {
      if (this.shouldSkipElement(element)) return;
      
      // Handle different types of text content
      let textContent = '';
      
      // For business segments and similar nested structures
      if (element.classList.contains('segment-item') || element.matches('.business-segments-list span')) {
        textContent = element.textContent.trim();
      } else {
        textContent = this.getDirectTextContent(element);
      }
      
      if (!textContent || textContent.length < 2) return;
      
      const key = `element_${savedCount}`;
      element.setAttribute('data-translate-key', key);
      
      this.originalContent.set(key, {
        text: textContent,
        element: element,
        needsTranslation: this.needsTranslation(textContent)
      });
      
      savedCount++;
    });
    
    // Additional pass for footer elements that might be missed
    this.addFooterElementsManually(savedCount);
    
    console.log(`Optimized: Saved ${savedCount} elements for translation`);
    
    // Debug: Log footer elements specifically
    this.debugFooterElements();
  }
  
  addFooterElementsManually(currentCount) {
    // Manual check for footer elements that might be missed
    const footerContainer = document.querySelector('.site-footer, footer');
    if (!footerContainer) return currentCount;
    
    // Find all text-containing elements in footer
    const footerTextElements = footerContainer.querySelectorAll('*');
    
    footerTextElements.forEach((element) => {
      // Skip if already processed
      if (element.hasAttribute('data-translate-key')) return;
      if (this.shouldSkipElement(element)) return;
      
      const directText = this.getDirectTextContent(element);
      if (!directText || directText.length < 2) return;
      if (!this.needsTranslation(directText)) return;
      
      const key = `footer_element_${currentCount}`;
      element.setAttribute('data-translate-key', key);
      
      this.originalContent.set(key, {
        text: directText,
        element: element,
        needsTranslation: true
      });
      
      currentCount++;
      console.log(`Added footer element: "${directText.substring(0, 30)}..."`);
    });
    
    return currentCount;
  }
  
  debugFooterElements() {
    const footerElements = document.querySelectorAll('footer *, .site-footer *');
    console.log('Footer elements found:', footerElements.length);
    
    footerElements.forEach((el, index) => {
      if (el.textContent && el.textContent.trim().length > 1) {
        const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(el.textContent);
        if (hasJapanese) {
          console.log(`Footer element ${index}:`, {
            tagName: el.tagName,
            className: el.className,
            text: el.textContent.trim().substring(0, 50),
            hasTranslateKey: el.hasAttribute('data-translate-key')
          });
        }
      }
    });
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
    // Special handling for segment items and other span elements that contain full text
    if (element.classList.contains('segment-item') || 
        element.matches('.business-segments-list span') ||
        element.tagName.toLowerCase() === 'span') {
      element.textContent = newText;
      return;
    }
    
    // Optimized text node replacement for other elements
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



// Initialize both carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Recruit Section Carousel
    const recruitSwiper = new Swiper('.main-carousel', {
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        loopAdditionalSlides: 1, // Prevent loop warnings
        
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        breakpoints: {
            320: {
                slidesPerView: 1.3,
                spaceBetween: 20,
                centeredSlides: true,
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 30,
                centeredSlides: true,
            },
            1024: {
                slidesPerView: 'auto',
                spaceBetween: 30,
                centeredSlides: true,
            }
        }
    });

    // Country Cards Carousel (Mobile Only) - Fixed infinite loop
    const countrySwiper = new Swiper('.locations-carousel', {
        slidesPerView: 1, // Reduced to 1 to eliminate loop warnings
        centeredSlides: true,
        spaceBetween: 15,
        
        // Fixed loop configuration for 4 slides
        loop: true,
        loopAdditionalSlides: 2,
        
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.locations-carousel .swiper-button-next',
            prevEl: '.locations-carousel .swiper-button-prev',
        },
        
        pagination: {
            el: '.locations-carousel .swiper-pagination',
            clickable: true,
        },
        
        // Smooth transitions
        speed: 600,
        effect: 'slide',
        
        // Only enable on mobile
        breakpoints: {
            769: {
                enabled: false,
            }
        }
    });

    // Disable country carousel on desktop resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            countrySwiper.disable();
        } else {
            countrySwiper.enable();
        }
    });
});

// SCROLL ANIMATIONS - Add this to your script.js file

// Intersection Observer for scroll animations
class ScrollAnimationManager {
  constructor() {
    this.elements = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Set up intersection observer
    this.setupObserver();
    
    // Add animation classes to elements
    this.setupAnimations();
    
    // Add parallax and other effects
    this.setupParallax();
    
    // Add navbar scroll effect
    this.setupNavbarScroll();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startObserving());
    } else {
      this.startObserving();
    }
  }

  setupObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, options);
  }

  setupAnimations() {
    // ===== GLOBAL NETWORK SECTION =====
    const networkHeader = document.querySelector('.network-header2 h2');
    const networkSubtitle = document.querySelector('.network-header2 .subtitle');
    if (networkHeader) {
      networkHeader.classList.add('scroll-animate');
      networkHeader.setAttribute('data-animation', 'animate-fade-right');
    }
    if (networkSubtitle) {
      networkSubtitle.classList.add('scroll-animate');
      networkSubtitle.setAttribute('data-animation', 'animate-fade-right');
      networkSubtitle.setAttribute('data-delay', '0.2');
    }

    // Country cards
    const countryCards = document.querySelectorAll('.card');
    countryCards.forEach((card, index) => {
      card.classList.add('scroll-animate', 'card-hover-enhance');
      card.setAttribute('data-animation', 'animate-scale');
      card.setAttribute('data-delay', (index % 4) * 0.15);
    });

    // ===== NEWS SECTION =====
    const newsHeader = document.querySelector('.news-left h2');
    const newsSubtitle = document.querySelector('.news-left p');
    const newsButton = document.querySelector('.read-more-button');
    
    if (newsHeader) {
      newsHeader.classList.add('scroll-animate');
      newsHeader.setAttribute('data-animation', 'animate-fade-left');
    }
    if (newsSubtitle) {
      newsSubtitle.classList.add('scroll-animate');
      newsSubtitle.setAttribute('data-animation', 'animate-fade-left');
      newsSubtitle.setAttribute('data-delay', '0.2');
    }
    if (newsButton) {
      newsButton.classList.add('scroll-animate');
      newsButton.setAttribute('data-animation', 'animate-fade-left');
      newsButton.setAttribute('data-delay', '0.4');
    }

    // News items
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach((item, index) => {
      item.classList.add('scroll-animate');
      item.setAttribute('data-animation', 'animate-fade-right');
      item.setAttribute('data-delay', index * 0.1);
    });

    // ===== RECRUIT SECTION =====
    const recruitHeader = document.querySelector('.recruit-header h1');
    const recruitSubtitle = document.querySelector('.recruit-header p');
    
    if (recruitHeader) {
      recruitHeader.classList.add('scroll-animate');
      recruitHeader.setAttribute('data-animation', 'animate-fade-up');
    }
    if (recruitSubtitle) {
      recruitSubtitle.classList.add('scroll-animate');
      recruitSubtitle.setAttribute('data-animation', 'animate-fade-up');
      recruitSubtitle.setAttribute('data-delay', '0.3');
    }

    // Recruit images
    const recruitImages = document.querySelectorAll('.image-card, .swiper-slide .image-card');
    recruitImages.forEach((img, index) => {
      img.classList.add('scroll-animate');
      img.setAttribute('data-animation', 'animate-scale');
      img.setAttribute('data-delay', (index % 5) * 0.1);
    });
  }

  animateElement(element) {
    const animation = element.getAttribute('data-animation');
    const delay = parseFloat(element.getAttribute('data-delay')) || 0;
    
    if (animation) {
      setTimeout(() => {
        element.classList.add(animation);
      }, delay * 1000);
    }
    
    // Remove from observer after animation
    this.observer.unobserve(element);
  }

  startObserving() {
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(element => {
      this.observer.observe(element);
    });
  }

  setupParallax() {
    // Parallax disabled to prevent layout issues
    // If you want parallax later, we can add it without affecting layout
  }

  setupNavbarScroll() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
  }
}

// Enhanced hover effects for cards
function setupEnhancedHovers() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
    });
  });
  
  // Enhanced button hovers
  const buttons = document.querySelectorAll('.read-more-button, .lang-btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      if (!this.classList.contains('lang-btn')) {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }
    });
    
    button.addEventListener('mouseleave', function() {
      if (!this.classList.contains('lang-btn')) {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
      }
    });
  });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Loading animation for images
function setupImageLoading() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete) {
      img.classList.add('image-loading');
      img.addEventListener('load', function() {
        this.classList.remove('image-loading');
      });
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll animations
  window.scrollAnimationManager = new ScrollAnimationManager();
  
  // Setup other enhancements
  setupEnhancedHovers();
  setupSmoothScroll();
  setupImageLoading();
  
  console.log('Scroll animations initialized successfully!');
});


// PRELOADER - Add this to your script.js

class PreloaderManager {
  constructor() {
    this.preloader = document.getElementById('preloader');
    this.progressFill = document.getElementById('progress-fill');
    this.percentageText = document.getElementById('loading-percentage');
    this.minLoadingTime = 2000; // Minimum 2 seconds
    this.startTime = Date.now();
    this.progress = 0;
    
    this.init();
  }

  init() {
    // Start the preloader
    this.simulateLoading();
    
    // Hide existing skeleton loader since we have a full preloader now
    const skeletonLoader = document.getElementById('skeleton-loader');
    if (skeletonLoader) {
      skeletonLoader.style.display = 'none';
    }
  }

  simulateLoading() {
    // Simulate realistic loading progress
    const progressSteps = [
      { progress: 20, delay: 300 },   // Initial resources
      { progress: 40, delay: 500 },   // CSS loaded
      { progress: 60, delay: 400 },   // JavaScript loaded
      { progress: 80, delay: 600 },   // Images loading
      { progress: 95, delay: 400 },   // Final assets
      { progress: 100, delay: 300 }   // Complete
    ];

    let currentStep = 0;

    const updateProgress = () => {
      if (currentStep < progressSteps.length) {
        const step = progressSteps[currentStep];
        
        setTimeout(() => {
          this.updateProgress(step.progress);
          currentStep++;
          updateProgress();
        }, step.delay);
      } else {
        // Ensure minimum loading time
        this.checkAndHide();
      }
    };

    updateProgress();
  }

  updateProgress(newProgress) {
    this.progress = newProgress;
    
    // Update progress bar if it exists
    if (this.progressFill) {
      this.progressFill.style.width = `${this.progress}%`;
    }
    
    // Update percentage text if it exists
    if (this.percentageText) {
      this.percentageText.textContent = `${this.progress}%`;
    }
  }

  checkAndHide() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
    
    setTimeout(() => {
      this.hidePreloader();
    }, remainingTime);
  }

  hidePreloader() {
    if (this.preloader) {
      // Add fade out class
      this.preloader.classList.add('fade-out');
      
      // Remove from DOM after animation
      setTimeout(() => {
        if (this.preloader && this.preloader.parentNode) {
          this.preloader.remove();
        }
        
        // Initialize scroll animations after preloader is gone
        if (window.scrollAnimationManager) {
          window.scrollAnimationManager.startObserving();
        }
        
        console.log('Preloader hidden, site ready');
      }, 600);
    }
  }

  // Method to manually hide preloader (useful for testing)
  forceHide() {
    this.hidePreloader();
  }
}

// Alternative: Real Progress Tracking (More Advanced)
class RealProgressPreloader {
  constructor() {
    this.preloader = document.getElementById('preloader');
    this.progressFill = document.getElementById('progress-fill');
    this.percentageText = document.getElementById('loading-percentage');
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.minLoadingTime = 1500;
    this.startTime = Date.now();
    
    this.init();
  }

  init() {
    // Count total assets to load
    this.countAssets();
    
    // Track actual loading
    this.trackAssetLoading();
    
    // Hide existing skeleton loader
    const skeletonLoader = document.getElementById('skeleton-loader');
    if (skeletonLoader) {
      skeletonLoader.style.display = 'none';
    }
  }

  countAssets() {
    // Count images
    const images = document.querySelectorAll('img');
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    const scripts = document.querySelectorAll('script[src]');
    
    this.totalAssets = images.length + stylesheets.length + scripts.length;
    console.log(`Total assets to track: ${this.totalAssets}`);
  }

  trackAssetLoading() {
    // Track images
    document.querySelectorAll('img').forEach(img => {
      if (img.complete) {
        this.assetLoaded();
      } else {
        img.onload = () => this.assetLoaded();
        img.onerror = () => this.assetLoaded(); // Count errors as loaded
      }
    });

    // Track stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      link.onload = () => this.assetLoaded();
      link.onerror = () => this.assetLoaded();
    });

    // Track scripts
    document.querySelectorAll('script[src]').forEach(script => {
      script.onload = () => this.assetLoaded();
      script.onerror = () => this.assetLoaded();
    });

    // Fallback timeout
    setTimeout(() => {
      if (this.loadedAssets < this.totalAssets) {
        console.log('Forcing preloader completion due to timeout');
        this.completeLoading();
      }
    }, 10000); // 10 second timeout
  }

  assetLoaded() {
    this.loadedAssets++;
    const progress = Math.min(100, Math.round((this.loadedAssets / this.totalAssets) * 100));
    this.updateProgress(progress);

    if (this.loadedAssets >= this.totalAssets) {
      this.completeLoading();
    }
  }

  updateProgress(progress) {
    if (this.progressFill) {
      this.progressFill.style.width = `${progress}%`;
    }
    
    if (this.percentageText) {
      this.percentageText.textContent = `${progress}%`;
    }
  }

  completeLoading() {
    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
    
    setTimeout(() => {
      this.hidePreloader();
    }, remainingTime);
  }

  hidePreloader() {
    if (this.preloader) {
      this.preloader.classList.add('fade-out');
      
      setTimeout(() => {
        if (this.preloader && this.preloader.parentNode) {
          this.preloader.remove();
        }
        console.log('Real progress preloader hidden');
      }, 600);
    }
  }
}

// Initialize preloader when DOM starts loading
document.addEventListener('DOMContentLoaded', function() {
  // Choose which preloader to use:
  
  // Option 1: Simulated progress (Recommended for most sites)
  window.preloaderManager = new PreloaderManager();
  
  // Option 2: Real progress tracking (Uncomment to use instead)
  // window.preloaderManager = new RealProgressPreloader();
});

// Debugging: Add to browser console to manually hide preloader
// window.preloaderManager.forceHide();
