// ===================================================================================
// GLENAEON WEBSITE SEARCH FUNCTIONALITY
// ===================================================================================
// This script provides comprehensive website search functionality that searches
// through all pages on the Glenaeon website. It includes both header search button
// functionality and footer search input functionality with real-time suggestions.
// The search covers page titles, content, meta descriptions, and navigation items.
// ===================================================================================

(function() {
  'use strict';

  // ===================================================================================
  // CONFIGURATION AND SEARCH DATA
  // ===================================================================================
  
  // Define searchable content across the website
  const searchableContent = [
    {
      title: "Home",
      url: "/",
      path: "index.html",
      description: "Glenaeon Rudolf Steiner School - A place where children flourish",
      keywords: ["home", "main", "school", "education", "steiner", "rudolf", "glenaeon"],
      content: "Welcome to Glenaeon Rudolf Steiner School. We are a vibrant learning community that nurtures the whole child."
    },
    {
      title: "Learning at Glenaeon",
      url: "/learning",
      path: "internal-page.html#learning",
      description: "Discover our unique approach to education",
      keywords: ["learning", "education", "curriculum", "approach", "teaching", "development"],
      content: "Our educational approach is based on Rudolf Steiner's insights into child development, recognizing that children learn differently at different stages."
    },
    {
      title: "Early Childhood (Birth - Age 7)",
      url: "/early-childhood",
      path: "learning-preschool.html#early-childhood",
      description: "Nurturing young children through play-based learning",
      keywords: ["early", "childhood", "young", "children", "play", "development", "kindergarten"],
      content: "In our early childhood programs, we provide a warm, homelike environment where young children can develop through imitation, rhythm, and creative play."
    },
    {
      title: "Playgroups",
      url: "/playgroups",
      path: "learning-preschool.html#playgroups",
      description: "Parent and child programs for the youngest learners",
      keywords: ["playgroups", "toddlers", "parents", "early", "development", "social"],
      content: "Our playgroups offer a gentle introduction to community life for children and parents."
    },
    {
      title: "Preschool",
      url: "/preschool",
      path: "learning-preschool.html#preschool",
      description: "Preparing children for formal learning through creative play",
      keywords: ["preschool", "preparation", "creative", "play", "imagination", "development"],
      content: "Our preschool program honors the developmental needs of young children through storytelling, creative play, and artistic activities."
    },
    {
      title: "Primary School (Kindergarten-Class 6)",
      url: "/primary-school",
      path: "internal-page.html#primary-school",
      description: "Building strong foundations in academics and character",
      keywords: ["primary", "elementary", "kindergarten", "class", "academics", "foundation"],
      content: "Primary school years focus on developing literacy, numeracy, and critical thinking skills through engaging, hands-on learning."
    },
    {
      title: "High School (Year 7-12)",
      url: "/high-school",
      path: "internal-page.html#high-school",
      description: "Preparing students for their future with comprehensive education",
      keywords: ["high", "secondary", "senior", "year", "university", "preparation", "graduation"],
      content: "Our high school program challenges students academically while supporting their personal growth and development."
    },
    {
      title: "Admissions",
      url: "/admissions",
      path: "internal-page.html#admissions",
      description: "Join our school community",
      keywords: ["admissions", "enrolment", "application", "join", "community", "process"],
      content: "Learn about our admissions process and how to become part of the Glenaeon community."
    },
    {
      title: "About Us",
      url: "/about",
      path: "internal-page.html#about",
      description: "Our history, philosophy, and community",
      keywords: ["about", "history", "philosophy", "community", "story", "mission", "values"],
      content: "Discover the history and philosophy behind Glenaeon Rudolf Steiner School."
    },
    {
      title: "News & Events",
      url: "/news",
      path: "internal-page.html#news",
      description: "Stay updated with school news and upcoming events",
      keywords: ["news", "events", "updates", "announcements", "calendar", "happenings"],
      content: "Keep up to date with the latest news, events, and announcements from our school community."
    },
    {
      title: "Contact Us",
      url: "/contact",
      path: "internal-page.html#contact",
      description: "Get in touch with our school",
      keywords: ["contact", "phone", "email", "address", "location", "touch"],
      content: "Find our contact information and location details to get in touch with us."
    },
    {
      title: "Wellbeing",
      url: "/wellbeing",
      path: "internal-page.html#wellbeing",
      description: "Supporting student mental health and wellbeing",
      keywords: ["wellbeing", "mental", "health", "support", "pastoral", "care"],
      content: "We prioritize student wellbeing through comprehensive pastoral care and support programs."
    },
    {
      title: "Student Stories",
      url: "/student-stories",
      path: "internal-page.html#student-stories",
      description: "Hear from our current and former students",
      keywords: ["student", "stories", "experiences", "testimonials", "graduates", "alumni"],
      content: "Read inspiring stories from our students about their learning journey and experiences at Glenaeon."
    },
    {
      title: "Outdoor Education",
      url: "/outdoor-education",
      path: "internal-page.html#outdoor-education",
      description: "Learning beyond the classroom",
      keywords: ["outdoor", "education", "nature", "adventure", "experiential", "learning"],
      content: "Our outdoor education program connects students with nature and provides hands-on learning experiences."
    },
    {
      title: "Sport",
      url: "/sport",
      path: "internal-page.html#sport",
      description: "Physical development and team building",
      keywords: ["sport", "physical", "education", "teams", "fitness", "health", "games"],
      content: "Our sports program promotes physical development, teamwork, and healthy competition."
    }
  ];

  // ===================================================================================
  // SEARCH FUNCTIONALITY
  // ===================================================================================
  
  function performSearch(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const results = [];

    searchableContent.forEach(item => {
      let score = 0;
      let matchType = '';
      const targetUrl = item.path || item.url || 'index.html';

      // Check title match (highest priority)
      if (item.title.toLowerCase().includes(searchTerm)) {
        score += 100;
        matchType = 'title';
      }

      // Check keyword match (high priority)
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm) || searchTerm.includes(keyword.toLowerCase())
      );
      if (keywordMatch) {
        score += 80;
        if (!matchType) matchType = 'keyword';
      }

      // Check description match (medium priority)
      if (item.description.toLowerCase().includes(searchTerm)) {
        score += 60;
        if (!matchType) matchType = 'description';
      }

      // Check content match (lower priority)
      if (item.content.toLowerCase().includes(searchTerm)) {
        score += 40;
        if (!matchType) matchType = 'content';
      }

      // Add partial matches for better UX
      const words = searchTerm.split(' ');
      words.forEach(word => {
        if (word.length > 2) {
          if (item.title.toLowerCase().includes(word)) score += 20;
          if (item.keywords.some(k => k.toLowerCase().includes(word))) score += 15;
          if (item.description.toLowerCase().includes(word)) score += 10;
        }
      });

      if (score > 0) {
        results.push({
          ...item,
          targetUrl,
          score,
          matchType,
          snippet: generateSnippet(item, searchTerm)
        });
      }
    });

    // Sort by score (highest first) and limit results
    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }

  function generateSnippet(item, searchTerm) {
    const text = item.content || item.description;
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    
    if (index === -1) return item.description;
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + searchTerm.length + 50);
    let snippet = text.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    // Highlight search term
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');
    
    return snippet;
  }

  // ===================================================================================
  // SEARCH UI COMPONENTS
  // ===================================================================================
  
  function createSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'glenaeon-search-modal';
    modal.innerHTML = `
      <div class="search-modal-backdrop"></div>
      <div class="search-modal-content">
        <div class="search-modal-header">
          <div class="search-input-container">
            <input type="text" class="search-modal-input" placeholder="Search Glenaeon..." autocomplete="off">
            <button class="search-modal-close" aria-label="Close search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="search-modal-body">
          <div class="search-results"></div>
          <div class="search-no-results" style="display: none;">
            <p>No results found. Try searching for:</p>
            <div class="search-suggestions">
              <button type="button" data-search="learning">Learning</button>
              <button type="button" data-search="admissions">Admissions</button>
              <button type="button" data-search="early childhood">Early Childhood</button>
              <button type="button" data-search="high school">High School</button>
              <button type="button" data-search="contact">Contact</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  function displayResults(results, container) {
    const noResults = container.closest('.search-modal-body')?.querySelector('.search-no-results');
    if (results.length === 0) {
      container.innerHTML = '';
      if (noResults) {
        noResults.style.display = 'block';
      }
      return;
    }

    if (noResults) {
      noResults.style.display = 'none';
    }
    
    container.innerHTML = results.map(result => `
      <div class="search-result-item" data-url="${result.targetUrl}">
        <h3 class="search-result-title">${result.title}</h3>
        <p class="search-result-snippet">${result.snippet}</p>
        <span class="search-result-url">${result.targetUrl}</span>
      </div>
    `).join('');
  }

  // ===================================================================================
  // EVENT HANDLERS AND INITIALIZATION
  // ===================================================================================
  
  function initializeSearch() {
    let searchModal;
    let searchInput;
    let resultsContainer;
    let debounceTimer;

    // Create and append search modal to document
    function createModal() {
      searchModal = createSearchModal();
      document.body.appendChild(searchModal);
      
      searchInput = searchModal.querySelector('.search-modal-input');
      resultsContainer = searchModal.querySelector('.search-results');
      
      // Event listeners for modal
      setupModalEventListeners();
    }

    function setupModalEventListeners() {
      // Close modal events
      const closeButton = searchModal.querySelector('.search-modal-close');
      const backdrop = searchModal.querySelector('.search-modal-backdrop');
      
      closeButton.addEventListener('click', closeModal);
      backdrop.addEventListener('click', closeModal);
      
      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
          closeModal();
        }
      });

      // Search input events
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const results = performSearch(e.target.value);
          displayResults(results, resultsContainer);
        }, 200);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const firstResult = resultsContainer.querySelector('.search-result-item');
          if (firstResult) {
            window.location.href = firstResult.dataset.url;
          }
        }
      });

      // Result click handlers
      resultsContainer.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
          window.location.href = resultItem.dataset.url;
        }
      });

      // Suggestion clicks
      const suggestions = searchModal.querySelectorAll('[data-search]');
      suggestions.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const term = e.target.dataset.search;
          searchInput.value = term;
          const results = performSearch(term);
          displayResults(results, resultsContainer);
        });
      });
    }

    const modalTransitionDuration = 350;

    function openModal() {
      if (!searchModal) createModal();
      if (!searchModal.classList.contains('active')) {
        searchModal.classList.add('active');
      }
      requestAnimationFrame(() => {
        searchModal.classList.add('is-visible');
      });

      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput?.focus(), 200);
    }

    function closeModal() {
      if (!searchModal || !searchModal.classList.contains('active')) return;

      searchModal.classList.remove('is-visible');
      setTimeout(() => {
        if (!searchModal.classList.contains('is-visible')) {
          searchModal.classList.remove('active');
          document.body.style.overflow = '';
          if (searchInput) {
            searchInput.value = '';
          }
          if (resultsContainer) {
            resultsContainer.innerHTML = '';
          }
          const noResults = searchModal.querySelector('.search-no-results');
          if (noResults) {
            noResults.style.display = 'none';
          }
        }
      }, modalTransitionDuration);
    }

    // Initialize all search triggers
    function initializeSearchTriggers() {
      // Header search buttons
      const headerSearchButtons = document.querySelectorAll('.header-search');
      headerSearchButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
      });

      // Footer search inputs
      const footerSearchInputs = document.querySelectorAll('.mega-menu__footer .form-control');
      footerSearchInputs.forEach(input => {
        input.addEventListener('focus', openModal);
        input.addEventListener('click', openModal);
        
        // Also handle direct typing in footer input
        input.addEventListener('input', (e) => {
          if (!searchModal || !searchModal.classList.contains('active')) {
            openModal();
          }
          if (searchInput && e.target.value) {
            searchInput.value = e.target.value;
            const results = performSearch(e.target.value);
            displayResults(results, resultsContainer);
          }
        });
      });
    }

    // Initialize when DOM is ready
    initializeSearchTriggers();
  }

  // ===================================================================================
  // CSS STYLES FOR SEARCH MODAL
  // ===================================================================================
  
  function addSearchStyles() {
    const styles = `
      .glenaeon-search-modal {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 6vh 1rem 2rem;
        background: rgba(7, 12, 26, 0.55);
        backdrop-filter: blur(8px);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      .glenaeon-search-modal.active {
        visibility: visible;
      }

      .glenaeon-search-modal.is-visible {
        opacity: 1;
        pointer-events: auto;
      }

      .search-modal-backdrop {
        display: none;
      }

      .search-modal-content {
        position: relative;
        width: min(680px, 100%);
        background: #fff;
        border-radius: 1rem;
        border: 1px solid #e4e7ef;
        box-shadow: 0 25px 65px rgba(8, 13, 28, 0.18);
        overflow: hidden;
        transform: translateY(24px);
        opacity: 0;
        transition: transform 0.35s ease, opacity 0.35s ease;
      }

      .glenaeon-search-modal.is-visible .search-modal-content {
        transform: translateY(0);
        opacity: 1;
      }

      .search-modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #eef1f7;
        background: #fdfdfd;
      }

      .search-input-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .search-modal-input {
        flex: 1;
        height: 3.25rem;
        border-radius: 999px;
        padding: 0 1.25rem;
        font-size: 1rem;
        color: #16223b;
        border: 1px solid #d5dae6;
        background: #f6f7fb;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }

      .search-modal-input::placeholder {
        color: #8b93a7;
      }

      .search-modal-input:focus {
        outline: none;
        border-color: #db574e;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(219, 87, 78, 0.15);
      }

      .search-modal-close {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 50%;
        border: 1px solid #e4e7ef;
        background: #fff;
        color: #6a7285;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
      }

      .search-modal-close:hover {
        background: #172444;
        color: #fff;
        border-color: #172444;
        transform: translateY(-1px);
      }

      .search-modal-body {
        max-height: min(50vh, 440px);
        overflow-y: auto;
        padding: 1.25rem 1.5rem;
        background: #fff;
      }

      .search-results {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .search-result-item {
        padding: 1rem 1.15rem;
        border-radius: 0.9rem;
        border: 1px solid #eef0f6;
        background: #fdfdfd;
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
      }

      .search-result-item:hover {
        border-color: rgba(219, 87, 78, 0.7);
        background: #fff;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
        transform: translateY(-2px);
      }

      .search-result-title {
        margin: 0 0 0.35rem 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: #15213a;
      }

      .search-result-snippet {
        margin: 0 0 0.45rem 0;
        font-size: 0.92rem;
        color: #5c6480;
        line-height: 1.5;
      }

      .search-result-snippet mark {
        background: rgba(219, 87, 78, 0.15);
        color: #15213a;
        padding: 0.05rem 0.2rem;
        border-radius: 0.4rem;
      }

      .search-result-url {
        font-size: 0.82rem;
        color: #8b93a7;
        letter-spacing: 0.03em;
      }

      .search-no-results {
        text-align: center;
        padding: 2rem 1rem;
        color: #5c6480;
      }

      .search-no-results p {
        margin-bottom: 1rem;
        font-size: 1rem;
        color: #1b2742;
      }

      .search-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
      }

      .search-suggestions button {
        padding: 0.45rem 1rem;
        border-radius: 999px;
        border: 1px solid #e4e7ef;
        background: #f6f7fb;
        color: #4b5675;
        cursor: pointer;
        font-size: 0.9rem;
        transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
      }

      .search-suggestions button:hover {
        border-color: #db574e;
        background: rgba(219, 87, 78, 0.12);
        color: #15213a;
      }

      .search-modal-body::-webkit-scrollbar {
        width: 6px;
      }

      .search-modal-body::-webkit-scrollbar-thumb {
        background: rgba(21, 33, 58, 0.25);
        border-radius: 999px;
      }

      @media (max-width: 768px) {
        .glenaeon-search-modal {
          padding: 4vh 0.5rem 1.5rem;
        }

        .search-modal-content {
          border-radius: 0.85rem;
        }

        .search-modal-header {
          padding: 1.25rem;
        }

        .search-modal-input {
          height: 3rem;
          font-size: 0.95rem;
        }

        .search-modal-body {
          max-height: calc(100vh - 11rem);
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // ===================================================================================
  // INITIALIZE ON DOM READY
  // ===================================================================================
  
  document.addEventListener('DOMContentLoaded', function() {
    addSearchStyles();
    initializeSearch();
  });

})();

// ===================================================================================
// END OF GLENAEON WEBSITE SEARCH FUNCTIONALITY
// ===================================================================================
