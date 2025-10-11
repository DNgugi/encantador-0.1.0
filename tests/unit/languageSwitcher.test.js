const {
  beforeAll,
  beforeEach,
  describe,
  it,
  expect,
} = require("@jest/globals");

describe("Language Switcher", () => {
  let LanguageSwitcher;
  let switcher;

  beforeAll(() => {
    LanguageSwitcher = require("../../assets/js/languageSwitcher.js");
  });

  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
    // Reset navigator.language to a default
    Object.defineProperty(navigator, "language", {
      writable: true,
      value: "en-US",
    });
  });

  describe("Language Detection", () => {
    it("should detect English as default language", () => {
      switcher = new LanguageSwitcher();
      expect(switcher.detectLanguage()).toBe("en");
    });

    it("should detect Traditional Chinese from Hong Kong browser setting", () => {
      Object.defineProperty(navigator, "language", {
        writable: true,
        value: "zh-HK",
      });
      switcher = new LanguageSwitcher();
      expect(switcher.detectLanguage()).toBe("zh-hk");
    });

    it("should detect Simplified Chinese from mainland browser setting", () => {
      Object.defineProperty(navigator, "language", {
        writable: true,
        value: "zh-CN",
      });
      switcher = new LanguageSwitcher();
      expect(switcher.detectLanguage()).toBe("zh-cn");
    });

    it("should use stored language preference over browser detection", () => {
      jest.spyOn(Storage.prototype, "getItem").mockReturnValue("zh-hk");
      switcher = new LanguageSwitcher();
      expect(switcher.detectLanguage()).toBe("zh-hk");
    });

    it("should fallback to English for unsupported languages", () => {
      jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
      Object.defineProperty(navigator, "language", {
        writable: true,
        value: "fr-FR",
      });
      switcher = new LanguageSwitcher();
      expect(switcher.detectLanguage()).toBe("en");
    });
  });

  describe("Language Setting", () => {
    it("should set language and store preference", () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      switcher = new LanguageSwitcher();
      switcher.setLanguage("zh-hk");
      expect(switcher.currentLanguage).toBe("zh-hk");
      expect(setItemSpy).toHaveBeenCalledWith("preferred-language", "zh-hk");
    });

    it("should reject invalid language codes", () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
      switcher = new LanguageSwitcher();
      const initialLang = switcher.currentLanguage;
      switcher.setLanguage("invalid");
      expect(switcher.currentLanguage).toBe(initialLang);
      expect(setItemSpy).not.toHaveBeenCalledWith(
        "preferred-language",
        "invalid"
      );
    });

    it("should update URL when language changes", () => {
      switcher = new LanguageSwitcher();
      const pushStateSpy = jest
        .spyOn(window.history, "pushState")
        .mockImplementation();
      switcher.setLanguage("zh-cn");
      expect(pushStateSpy).toHaveBeenCalledWith({}, "", "/zh-cn/");
      pushStateSpy.mockRestore();
    });
  });

  describe("Translation Loading", () => {
    it("should load translation files successfully", async () => {
      switcher = new LanguageSwitcher();
      const mockTranslations = { hero: { title: "Test Title" } };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations,
      });

      const translations = await switcher.loadTranslations("en");
      expect(fetch).toHaveBeenCalledWith("/assets/translations/en.json");
      expect(translations).toEqual(mockTranslations);
    });

    it("should handle translation loading errors gracefully", async () => {
      switcher = new LanguageSwitcher();
      fetch.mockRejectedValueOnce(new Error("Network error"));
      const translations = await switcher.loadTranslations("en");
      expect(translations).toBeNull();
    });
  });

  describe("Content Updates", () => {
    it("should update page content with translations", async () => {
      switcher = new LanguageSwitcher();
      document.body.innerHTML =
        '<h1 data-translate="hero.title">Original Title</h1>';
      const mockTranslations = { hero: { title: "Translated Title" } };

      // Mock fetch to return the translations
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations,
      });

      await switcher.updateContent();

      const titleElement = document.querySelector(
        '[data-translate="hero.title"]'
      );
      expect(titleElement.textContent).toBe("Translated Title");
    });

    it("should update meta tags with translated content", async () => {
      switcher = new LanguageSwitcher();
      document.head.innerHTML = `
        <title>Original Title</title>
        <meta name="description" content="Original Description">
      `;

      const mockTranslations = {
        meta: {
          title: "Translated Title",
          description: "Translated Description",
        },
      };

      // Mock fetch to return the translations
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTranslations,
      });

      await switcher.updateContent();

      expect(document.title).toBe("Translated Title");
      expect(document.querySelector('meta[name="description"]').content).toBe(
        "Translated Description"
      );
    });
  });

  describe("UI Integration", () => {
    it("should initialize UI components correctly", () => {
      switcher = new LanguageSwitcher();
      document.body.innerHTML = `
        <button id="lang-dropdown">Language</button>
        <div id="lang-menu" class="hidden">
          <a href="#" data-lang="en">English</a>
          <a href="#" data-lang="zh-hk">繁體中文</a>
        </div>
      `;

      switcher.initializeUI();

      const dropdown = document.getElementById("lang-dropdown");
      const menu = document.getElementById("lang-menu");

      // Test dropdown click
      dropdown.click();
      expect(menu.classList.contains("hidden")).toBe(false);
    });

    test("should handle language selection from UI", () => {
      switcher = new LanguageSwitcher();
      document.body.innerHTML = `
        <div id="lang-menu">
          <a href="#" data-lang="zh-hk">繁體中文</a>
        </div>
      `;

      switcher.initializeUI();

      const langLink = document.querySelector('[data-lang="zh-hk"]');
      langLink.click();

      expect(switcher.currentLanguage).toBe("zh-hk");
    });
  });
});
