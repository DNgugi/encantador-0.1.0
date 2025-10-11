class LanguageSwitcher {
  constructor() {
    this.supportedLanguages = ["en", "zh-hk", "zh-cn"];
    this.defaultLanguage = "en";
    this.currentLanguage = this.detectLanguage();
    this.translations = {};
    this.init();
  }

  init() {
    this.initializeUI();
    this.loadTranslations(this.currentLanguage);
  }

  detectLanguage() {
    // Check localStorage first
    const stored = localStorage.getItem("preferred-language");
    if (stored && this.supportedLanguages.includes(stored)) {
      return stored;
    }

    // Check browser language
    const browserLang = (navigator.language || "en").toLowerCase();
    if (browserLang.startsWith("zh-hk")) {
      return "zh-hk";
    }
    if (browserLang.startsWith("zh-cn") || browserLang.startsWith("zh-tw")) {
      return "zh-cn";
    }
    if (browserLang.startsWith("en")) {
      return "en";
    }

    return this.defaultLanguage;
  }

  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
      localStorage.setItem("preferred-language", lang);
      this.updateContent();
      this.updateURL();
    }
  }

  updateURL() {
    const currentPath = window.location.pathname;
    const newPath = `/${this.currentLanguage}/`;
    if (currentPath !== newPath) {
      window.history.pushState({}, "", newPath);
    }
  }

  async loadTranslations(lang) {
    try {
      const response = await fetch(`/assets/translations/${lang}.json`);
      if (!response.ok) throw new Error("Translation file not found");
      this.translations[lang] = await response.json();
      return this.translations[lang];
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      return null;
    }
  }

  async updateContent() {
    const translations = await this.loadTranslations(this.currentLanguage);
    if (!translations) return;

    // Update meta tags
    document.title = translations.meta?.title || document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && translations.meta?.description) {
      metaDescription.setAttribute("content", translations.meta.description);
    }

    // Update content using data attributes
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.dataset.translate;
      const value = this.getNestedValue(translations, key);
      if (value) {
        element.textContent = value;
      }
    });
  }

  getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  initializeUI() {
    const dropdown = document.getElementById("lang-dropdown");
    const menu = document.getElementById("lang-menu");
    const langLinks = document.querySelectorAll("[data-lang]");

    if (dropdown && menu) {
      dropdown.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          menu.classList.add("hidden");
        }
      });
    }

    langLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const lang = e.currentTarget.dataset.lang;
        this.setLanguage(lang);
        if (menu) menu.classList.add("hidden");
      });
    });
  }
}

// Export for Node.js testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = LanguageSwitcher;
}

// Initialize when DOM is loaded
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    window.languageSwitcher = new LanguageSwitcher();
  });
}
