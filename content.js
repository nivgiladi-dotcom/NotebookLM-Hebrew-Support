(function() {
    'use strict';

    // Function to apply RTL styling to text elements
    function applyRTLStyles(element) {
        // Skip if element is a math/formula container or layout element
        if (element.classList.contains('katex') || 
            element.classList.contains('math') || 
            element.classList.contains('mjx-container') ||
            element.classList.contains('latex') ||
            element.tagName === 'CODE' ||
            element.tagName === 'PRE' ||
            element.classList.contains('math-inline') ||
            element.classList.contains('math-display') ||
            element.classList.contains('formula') ||
            element.classList.contains('icon') ||
            element.classList.contains('button') ||
            element.classList.contains('nav') ||
            element.classList.contains('header') ||
            element.classList.contains('sidebar') ||
            element.tagName === 'HEADER' ||
            element.tagName === 'NAV' ||
            element.tagName === 'MAIN' ||
            element.tagName === 'ASIDE') {
            return;
        }

        // Check if element contains significant Hebrew text (more than just a few characters)
        const text = element.textContent || element.innerText;
        if (text) {
            // Count Hebrew characters vs total characters
            const hebrewChars = (text.match(/[\u0590-\u05FF]/g) || []).length;
            const totalChars = text.replace(/\s/g, '').length;
            
            // Only apply RTL if Hebrew is the dominant language (>30% of text)
            if (hebrewChars > 0 && totalChars > 0 && (hebrewChars / totalChars) > 0.3) {
                element.style.direction = 'rtl';
                element.style.textAlign = 'right';
                element.style.unicodeBidi = 'isolate';
                
                // Add class for easier targeting
                element.classList.add('rtl-text');
                
                // Process child elements to protect math
                const mathElements = element.querySelectorAll('.katex, .math, .mjx-container, .latex, code, pre, [class*="math"], [class*="formula"], [class*="katex"]');
                mathElements.forEach(applyLTRStyles);
            }
        }
    }

    // Function to apply LTR styling to math elements
    function applyLTRStyles(element) {
        if (element.classList.contains('katex') || 
            element.classList.contains('math') || 
            element.classList.contains('mjx-container') ||
            element.classList.contains('latex') ||
            element.tagName === 'CODE' ||
            element.tagName === 'PRE' ||
            element.classList.contains('math-inline') ||
            element.classList.contains('math-display') ||
            element.classList.contains('formula')) {
            element.style.direction = 'ltr';
            element.style.display = 'inline-block';
            element.style.textAlign = 'left';
            element.style.unicodeBidi = 'isolate';
        }
    }

    // Function to process all elements in a container
    function processContainer(container) {
        if (!container) return;

        // Target specific text elements that might contain Hebrew
        const textElements = container.querySelectorAll('p, span, div, b, strong, em, i, td, th, li, h1, h2, h3, h4, h5, h6');
        
        textElements.forEach(element => {
            applyRTLStyles(element);
        });
        
        // Ensure math elements are protected
        const mathElements = container.querySelectorAll('.katex, .math, .mjx-container, .latex, code, pre, [class*="math"], [class*="formula"], [class*="katex"]');
        mathElements.forEach(applyLTRStyles);
    }

    // Function to handle new content dynamically
    function handleNewContent(mutations) {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Process the new element and its children
                    processContainer(node);
                    
                    // Also process any child elements that might contain math
                    const mathElements = node.querySelectorAll('.katex, .math, .mjx-container, .latex, code, pre, [class*="math"], [class*="formula"], [class*="katex"]');
                    mathElements.forEach(applyLTRStyles);
                }
            });
        });
    }

    // Initialize the extension
    function init() {
        console.log('NotebookLM Hebrew RTL Support initialized');
        
        // Process existing content
        processContainer(document.body);
        
        // Set up MutationObserver for dynamic content
        const observer = new MutationObserver(handleNewContent);
        
        // Observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: true
        });
        
        // Also observe the main content areas specifically
        const mainContentSelectors = [
            'main',
            '.main-content',
            '.content-area',
            '.chat-area',
            '.notes-area',
            '.workspace',
            '.editor',
            '[class*="main"]',
            '[class*="content"]:not([class*="nav"]):not([class*="sidebar"]):not([class*="header"])'
        ];
        
        mainContentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                observer.observe(element, {
                    childList: true,
                    subtree: true,
                    attributes: false,
                    characterData: true
                });
            });
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready
        init();
    }

    // Also run after a delay to catch dynamically loaded content
    setTimeout(init, 1000);
    setTimeout(init, 3000);

})();
