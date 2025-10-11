# Implementation Plan - Test-Driven Development

## Overview

This implementation plan follows strict Test-Driven Development (TDD) practices using the Red-Green-Refactor cycle. Each feature is implemented by first writing failing tests (Red), then writing minimal code to pass the tests (Green), and finally refactoring for quality (Refactor). A junior developer will write tests before any functionality.

## TDD Methodology

- **Red**: Write a failing test that defines the desired functionality
- **Green**: Write the minimal code needed to make the test pass
- **Refactor**: Improve the code while keeping tests passing

## Development Setup and Testing Framework

- [x] 1. Set up complete testing environment before any development

  - **What**: Establish comprehensive testing framework with all test files before writing any functionality
  - **Why**: TDD requires tests to exist before implementation - this ensures we follow Red-Green-Refactor
  - _Requirements: All requirements depend on proper TDD setup_

- [x] 1.1 Create main project directory and initialize testing environment

  - [ ] Open terminal and navigate to your desired parent directory
  - [ ] Run `mkdir encantador-website` to create the main project folder
  - [ ] Run `cd encantador-website` to enter the project directory
  - [ ] Run `git init` to initialize version control
  - [ ] Run `git branch -M main` to set main branch
  - [ ] Create `.gitignore` file: `touch .gitignore`
  - [ ] Add to `.gitignore`: `echo -e "node_modules/\n.DS_Store\n*.log\ndist/\n.env\ncoverage/" > .gitignore`

- [x] 1.2 Set up Node.js and comprehensive testing tools

  - [ ] Run `npm init -y` to create package.json
  - [ ] Install testing dependencies: `npm install --save-dev jest @jest/globals jsdom @axe-core/cli html-validator-cli lighthouse-ci puppeteer`
  - [ ] Install development tools: `npm install --save-dev live-server concurrently imagemin imagemin-mozjpeg imagemin-pngquant`
  - [ ] Install Tailwind CSS: `npm install -D tailwindcss @tailwindcss/forms @tailwindcss/typography postcss autoprefixer`
  - [ ] Create Jest configuration file `jest.config.js`:
    ```javascript
    module.exports = {
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
      collectCoverageFrom: [
        "assets/js/**/*.js",
        "!assets/js/**/*.test.js",
        "!**/node_modules/**",
      ],
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      testMatch: ["<rootDir>/tests/**/*.test.js"],
    };
    ```

- [x] 1.3 Create complete folder structure for TDD workflow

  - [ ] Create language directories: `mkdir -p {en,zh-hk,zh-cn}`
  - [ ] Create assets structure: `mkdir -p assets/{css,js,images,translations,fonts}`
  - [ ] Create image subdirectories: `mkdir -p assets/images/{hero,team,portfolio,icons}`
  - [ ] Create comprehensive testing structure: `mkdir -p tests/{unit,integration,e2e,accessibility,performance}`
  - [ ] Create tools directory: `mkdir tools`
  - [ ] Create CSS dist directory: `mkdir -p assets/css/dist`

- [x] 1.4 Write ALL test files before any implementation (TDD Red Phase)

  - **What**: Create all failing tests that define the complete functionality
  - **Why**: TDD requires tests to exist before implementation - this is the "Red" phase
  - **How**: Write comprehensive test suites that will initially fail, then implement code to make them pass

- [x] 1.4.1 Create test setup and utilities

  - [ ] Create `tests/setup.js`:

    ```javascript
    // Global test setup
    import "jest-dom/extend-expect";

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock;

    // Mock sessionStorage
    global.sessionStorage = localStorageMock;

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    // Mock fetch
    global.fetch = jest.fn();

    // Reset all mocks before each test
    beforeEach(() => {
      jest.clearAllMocks();
      localStorageMock.getItem.mockClear();
      localStorageMock.setItem.mockClear();
      localStorageMock.removeItem.mockClear();
      localStorageMock.clear.mockClear();
      fetch.mockClear();
    });
    ```

- [x] 1.4.2 Create language switcher tests (RED - These will fail initially)

  - [ ] Create `tests/unit/language-switcher.test.js`:

    ```javascript
    /**
     * Language Switcher Tests - TDD Red Phase
     * These tests define the expected behavior before implementation
     */

    describe("LanguageSwitcher", () => {
      let LanguageSwitcher;
      let switcher;

      beforeAll(() => {
        // This will fail initially - we haven't created the class yet
        LanguageSwitcher = require("../../assets/js/language-switcher.js");
      });

      beforeEach(() => {
        document.body.innerHTML = "";
        switcher = new LanguageSwitcher();
      });

      describe("Language Detection", () => {
        test("should detect English as default language", () => {
          expect(switcher.detectLanguage()).toBe("en");
        });

        test("should detect Traditional Chinese from Hong Kong browser setting", () => {
          window.navigator.language = "zh-HK";
          switcher = new LanguageSwitcher();
          expect(switcher.detectLanguage()).toBe("zh-hk");
        });

        test("should detect Simplified Chinese from mainland browser setting", () => {
          window.navigator.language = "zh-CN";
          switcher = new LanguageSwitcher();
          expect(switcher.detectLanguage()).toBe("zh-cn");
        });

        test("should use stored language preference over browser detection", () => {
          localStorage.getItem.mockReturnValue("zh-hk");
          switcher = new LanguageSwitcher();
          expect(switcher.detectLanguage()).toBe("zh-hk");
        });

        test("should fallback to English for unsupported languages", () => {
          window.navigator.language = "fr-FR";
          switcher = new LanguageSwitcher();
          expect(switcher.detectLanguage()).toBe("en");
        });
      });

      describe("Language Setting", () => {
        test("should set language and store preference", () => {
          switcher.setLanguage("zh-hk");
          expect(switcher.currentLanguage).toBe("zh-hk");
          expect(localStorage.setItem).toHaveBeenCalledWith(
            "preferred-language",
            "zh-hk"
          );
        });

        test("should reject invalid language codes", () => {
          const initialLang = switcher.currentLanguage;
          switcher.setLanguage("invalid");
          expect(switcher.currentLanguage).toBe(initialLang);
          expect(localStorage.setItem).not.toHaveBeenCalledWith(
            "preferred-language",
            "invalid"
          );
        });

        test("should update URL when language changes", () => {
          const pushStateSpy = jest
            .spyOn(window.history, "pushState")
            .mockImplementation();
          switcher.setLanguage("zh-cn");
          expect(pushStateSpy).toHaveBeenCalledWith({}, "", "/zh-cn/");
          pushStateSpy.mockRestore();
        });
      });

      describe("Translation Loading", () => {
        test("should load translation files successfully", async () => {
          const mockTranslations = { hero: { title: "Test Title" } };
          fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTranslations,
          });

          const translations = await switcher.loadTranslations("en");
          expect(fetch).toHaveBeenCalledWith("/assets/translations/en.json");
          expect(translations).toEqual(mockTranslations);
        });

        test("should handle translation loading errors gracefully", async () => {
          fetch.mockRejectedValueOnce(new Error("Network error"));
          const translations = await switcher.loadTranslations("en");
          expect(translations).toBeNull();
        });
      });

      describe("Content Updates", () => {
        test("should update page content with translations", async () => {
          document.body.innerHTML =
            '<h1 data-translate="hero.title">Original Title</h1>';
          const mockTranslations = { hero: { title: "Translated Title" } };

          switcher.translations = { en: mockTranslations };
          switcher.currentLanguage = "en";

          await switcher.updateContent();

          const titleElement = document.querySelector(
            '[data-translate="hero.title"]'
          );
          expect(titleElement.textContent).toBe("Translated Title");
        });

        test("should update meta tags with translated content", async () => {
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

          switcher.translations = { en: mockTranslations };
          switcher.currentLanguage = "en";

          await switcher.updateContent();

          expect(document.title).toBe("Translated Title");
          expect(
            document.querySelector('meta[name="description"]').content
          ).toBe("Translated Description");
        });
      });

      describe("UI Integration", () => {
        test("should initialize UI components correctly", () => {
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
    ```

- [x] 1.4.3 Create theme switcher tests (RED - These will fail initially)

  - [ ] Create `tests/unit/theme-switcher.test.js`:

    ```javascript
    /**
     * Theme Switcher Tests - TDD Red Phase
     * These tests define the expected behavior before implementation
     */

    describe("ThemeSwitcher", () => {
      let ThemeSwitcher;
      let themeSwitcher;

      beforeAll(() => {
        // This will fail initially - we haven't created the class yet
        ThemeSwitcher = require("../../assets/js/theme-switcher.js");
      });

      beforeEach(() => {
        document.documentElement.className = "";
        document.body.innerHTML = "";
        themeSwitcher = new ThemeSwitcher();
      });

      describe("Theme Detection", () => {
        test("should initialize with light theme by default", () => {
          expect(themeSwitcher.theme).toBe("light");
          expect(document.documentElement.classList.contains("dark")).toBe(
            false
          );
        });

        test("should detect system dark mode preference", () => {
          window.matchMedia.mockImplementation((query) => ({
            matches: query === "(prefers-color-scheme: dark)",
            media: query,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          }));

          themeSwitcher = new ThemeSwitcher();
          expect(themeSwitcher.getPreferredTheme()).toBe("dark");
        });

        test("should use stored theme preference over system preference", () => {
          localStorage.getItem.mockReturnValue("dark");
          themeSwitcher = new ThemeSwitcher();
          expect(themeSwitcher.theme).toBe("dark");
        });
      });

      describe("Theme Setting", () => {
        test("should apply dark theme correctly", () => {
          themeSwitcher.setTheme("dark");
          expect(document.documentElement.classList.contains("dark")).toBe(
            true
          );
          expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
        });

        test("should apply light theme correctly", () => {
          document.documentElement.classList.add("dark");
          themeSwitcher.setTheme("light");
          expect(document.documentElement.classList.contains("dark")).toBe(
            false
          );
          expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
        });

        test("should toggle between themes", () => {
          themeSwitcher.setTheme("light");
          themeSwitcher.toggleTheme();
          expect(themeSwitcher.theme).toBe("dark");

          themeSwitcher.toggleTheme();
          expect(themeSwitcher.theme).toBe("light");
        });
      });

      describe("UI Updates", () => {
        test("should update toggle button icons correctly", () => {
          document.body.innerHTML = `
            <button id="theme-toggle">
              <svg class="sun-icon" style="display: none;"></svg>
              <svg class="moon-icon" style="display: block;"></svg>
            </button>
          `;

          themeSwitcher.setTheme("dark");
          themeSwitcher.updateToggleButton();

          const sunIcon = document.querySelector(".sun-icon");
          const moonIcon = document.querySelector(".moon-icon");

          expect(sunIcon.style.display).toBe("block");
          expect(moonIcon.style.display).toBe("none");
        });

        test("should update aria-label for accessibility", () => {
          document.body.innerHTML =
            '<button id="theme-toggle" aria-label="Switch theme"></button>';

          themeSwitcher.setTheme("dark");
          themeSwitcher.updateToggleButton();

          const button = document.getElementById("theme-toggle");
          expect(button.getAttribute("aria-label")).toBe(
            "Switch to light mode"
          );
        });
      });

      describe("Event Handling", () => {
        test("should bind toggle button click event", () => {
          document.body.innerHTML = '<button id="theme-toggle"></button>';

          themeSwitcher.bindEvents();

          const toggleButton = document.getElementById("theme-toggle");
          const initialTheme = themeSwitcher.theme;

          toggleButton.click();

          expect(themeSwitcher.theme).not.toBe(initialTheme);
        });

        test("should respond to system theme changes", () => {
          const mockMediaQuery = {
            matches: true,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
          };

          window.matchMedia.mockReturnValue(mockMediaQuery);

          themeSwitcher.bindEvents();

          // Simulate system theme change
          const changeHandler =
            mockMediaQuery.addEventListener.mock.calls[0][1];
          changeHandler({ matches: true });

          expect(themeSwitcher.theme).toBe("dark");
        });
      });
    });
    ```

- [x] 1.4.4 Create translation system tests (RED - These will fail initially)

  - [x] Create `tests/unit/translations.test.js`:

    ```javascript
    /**
     * Translation System Tests - TDD Red Phase
     * These tests define the expected behavior before implementation
     */

    const fs = require("fs");
    const path = require("path");

    describe("Translation System", () => {
      const languages = ["en", "zh-hk", "zh-cn"];
      const translationFiles = {};
      const translationPaths = {
        en: path.join(__dirname, "../../assets/translations/en.json"),
        "zh-hk": path.join(__dirname, "../../assets/translations/zh-hk.json"),
        "zh-cn": path.join(__dirname, "../../assets/translations/zh-cn.json"),
      };

      describe("Translation File Structure", () => {
        test("all translation files should exist", () => {
          languages.forEach((lang) => {
            expect(fs.existsSync(translationPaths[lang])).toBe(true);
          });
        });

        test("all translation files should contain valid JSON", () => {
          languages.forEach((lang) => {
            if (fs.existsSync(translationPaths[lang])) {
              const content = fs.readFileSync(translationPaths[lang], "utf8");
              expect(() => JSON.parse(content)).not.toThrow();
              translationFiles[lang] = JSON.parse(content);
            }
          });
        });

        test("all languages should have the same translation keys", () => {
          const englishKeys = getAllKeys(translationFiles.en || {});

          languages.slice(1).forEach((lang) => {
            const langKeys = getAllKeys(translationFiles[lang] || {});
            expect(langKeys).toEqual(englishKeys);
          });
        });

        test("no translation values should be empty", () => {
          languages.forEach((lang) => {
            const emptyValues = findEmptyValues(translationFiles[lang] || {});
            expect(emptyValues).toEqual([]);
          });
        });
      });

      describe("Required Translation Sections", () => {
        test("should contain meta section with title and description", () => {
          languages.forEach((lang) => {
            const translations = translationFiles[lang] || {};
            expect(translations.meta).toBeDefined();
            expect(translations.meta.title).toBeDefined();
            expect(translations.meta.description).toBeDefined();
            expect(typeof translations.meta.title).toBe("string");
            expect(typeof translations.meta.description).toBe("string");
          });
        });

        test("should contain hero section with required fields", () => {
          const requiredHeroFields = [
            "title",
            "subtitle",
            "cta_primary",
            "cta_secondary",
          ];

          languages.forEach((lang) => {
            const translations = translationFiles[lang] || {};
            expect(translations.hero).toBeDefined();

            requiredHeroFields.forEach((field) => {
              expect(translations.hero[field]).toBeDefined();
              expect(typeof translations.hero[field]).toBe("string");
              expect(translations.hero[field].length).toBeGreaterThan(0);
            });
          });
        });

        test("should contain services section with all service types", () => {
          const requiredServices = ["strategy", "web", "team"];

          languages.forEach((lang) => {
            const translations = translationFiles[lang] || {};
            expect(translations.services).toBeDefined();

            requiredServices.forEach((service) => {
              expect(translations.services[service]).toBeDefined();
              expect(translations.services[service].title).toBeDefined();
              expect(translations.services[service].description).toBeDefined();
            });
          });
        });

        test("should contain contact section with Hong Kong details", () => {
          const requiredContactFields = [
            "title",
            "subtitle",
            "phone",
            "email",
            "address",
            "hours",
          ];

          languages.forEach((lang) => {
            const translations = translationFiles[lang] || {};
            expect(translations.contact).toBeDefined();

            requiredContactFields.forEach((field) => {
              expect(translations.contact[field]).toBeDefined();
              expect(typeof translations.contact[field]).toBe("string");
            });

            // Hong Kong specific validations
            expect(translations.contact.phone).toMatch(/\+852/);
            expect(translations.contact.hours).toMatch(/HKT|香港時間|香港时间/);
          });
        });
      });

      describe("Translation Quality", () => {
        test("Chinese translations should contain appropriate characters", () => {
          const zhHkTranslations = translationFiles["zh-hk"] || {};
          const zhCnTranslations = translationFiles["zh-cn"] || {};

          // Traditional Chinese should contain traditional characters
          const traditionalText = JSON.stringify(zhHkTranslations);
          expect(traditionalText).toMatch(/[繁體]/); // Should contain traditional characters

          // Simplified Chinese should contain simplified characters
          const simplifiedText = JSON.stringify(zhCnTranslations);
          expect(simplifiedText).toMatch(/[简体]/); // Should contain simplified characters
        });

        test("all translations should be appropriate length", () => {
          languages.forEach((lang) => {
            const translations = translationFiles[lang] || {};

            // Hero title should not be too long for mobile display
            if (translations.hero?.title) {
              expect(translations.hero.title.length).toBeLessThan(100);
            }

            // Service descriptions should be substantial but not too long
            if (translations.services) {
              Object.values(translations.services).forEach((service) => {
                if (service.description) {
                  expect(service.description.length).toBeGreaterThan(50);
                  expect(service.description.length).toBeLessThan(300);
                }
              });
            }
          });
        });
      });
    });

    // Helper functions
    function getAllKeys(obj, prefix = "") {
      let keys = [];
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          keys = keys.concat(getAllKeys(obj[key], fullKey));
        } else {
          keys.push(fullKey);
        }
      }
      return keys.sort();
    }

    function findEmptyValues(obj, prefix = "") {
      let emptyKeys = [];
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          emptyKeys = emptyKeys.concat(findEmptyValues(obj[key], fullKey));
        } else if (!obj[key] || obj[key].toString().trim() === "") {
          emptyKeys.push(fullKey);
        }
      }
      return emptyKeys;
    }
    ```

- [x] 1.4.5 Create contact form tests (RED - These will fail initially)

  - [ ] Create `tests/unit/contact-forms.test.js`:

    ```javascript
    /**
     * Contact Forms Tests - TDD Red Phase
     * These tests define the expected behavior before implementation
     */

    describe("ContactForms", () => {
      let ContactForms;
      let contactForms;

      beforeAll(() => {
        // This will fail initially - we haven't created the class yet
        ContactForms = require("../../assets/js/contact-forms.js");
      });

      beforeEach(() => {
        document.body.innerHTML = `
          <form id="contact-form">
            <input type="text" id="name" name="name" required>
            <input type="email" id="email" name="email" required>
            <input type="tel" id="phone" name="phone">
            <input type="text" id="company" name="company">
            <select id="service" name="service">
              <option value="">Select a service</option>
              <option value="strategy">Business Strategy</option>
              <option value="web-dev">Web Development</option>
            </select>
            <textarea id="message" name="message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        `;

        contactForms = new ContactForms();
      });

      describe("Form Validation", () => {
        test("should validate required fields", () => {
          const form = document.getElementById("contact-form");
          const formData = new FormData(form);

          expect(contactForms.validateForm(formData)).toBe(false);

          // Fill required fields
          formData.set("name", "John Doe");
          formData.set("email", "john@example.com");
          formData.set("message", "Test message");

          expect(contactForms.validateForm(formData)).toBe(true);
        });

        test("should validate email format", () => {
          const validEmails = ["test@example.com", "user+tag@domain.co.uk"];
          const invalidEmails = ["invalid-email", "@domain.com", "user@"];

          validEmails.forEach((email) => {
            expect(contactForms.validateEmail(email)).toBe(true);
          });

          invalidEmails.forEach((email) => {
            expect(contactForms.validateEmail(email)).toBe(false);
          });
        });

        test("should validate Hong Kong phone number format", () => {
          const validPhones = ["+852 1234 5678", "+85212345678", "1234 5678"];
          const invalidPhones = ["+86 123 456 789", "123", "+852 123"];

          validPhones.forEach((phone) => {
            expect(contactForms.validateHongKongPhone(phone)).toBe(true);
          });

          invalidPhones.forEach((phone) => {
            expect(contactForms.validateHongKongPhone(phone)).toBe(false);
          });
        });

        test("should show validation errors for invalid fields", () => {
          const nameInput = document.getElementById("name");

          contactForms.showFieldError("name", "Name is required");

          const errorElement = document.querySelector(
            '.error-message[data-field="name"]'
          );
          expect(errorElement).toBeTruthy();
          expect(errorElement.textContent).toBe("Name is required");
          expect(nameInput.classList.contains("error")).toBe(true);
        });

        test("should clear validation errors when field becomes valid", () => {
          contactForms.showFieldError("email", "Invalid email");
          contactForms.clearFieldError("email");

          const errorElement = document.querySelector(
            '.error-message[data-field="email"]'
          );
          const emailInput = document.getElementById("email");

          expect(errorElement).toBeFalsy();
          expect(emailInput.classList.contains("error")).toBe(false);
        });
      });

      describe("Form Submission", () => {
        test("should prevent submission of invalid form", async () => {
          const form = document.getElementById("contact-form");
          const submitEvent = new Event("submit");

          const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

          form.dispatchEvent(submitEvent);

          expect(preventDefaultSpy).toHaveBeenCalled();
        });

        test("should submit valid form data", async () => {
          fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              success: true,
              message: "Form submitted successfully",
            }),
          });

          const form = document.getElementById("contact-form");

          // Fill form with valid data
          document.getElementById("name").value = "John Doe";
          document.getElementById("email").value = "john@example.com";
          document.getElementById("message").value = "Test message";

          const result = await contactForms.submitForm(form);

          expect(fetch).toHaveBeenCalledWith(
            "/api/contact",
            expect.objectContaining({
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: expect.stringContaining("John Doe"),
            })
          );

          expect(result.success).toBe(true);
        });

        test("should handle submission errors gracefully", async () => {
          fetch.mockRejectedValueOnce(new Error("Network error"));

          const form = document.getElementById("contact-form");
          document.getElementById("name").value = "John Doe";
          document.getElementById("email").value = "john@example.com";
          document.getElementById("message").value = "Test message";

          const result = await contactForms.submitForm(form);

          expect(result.success).toBe(false);
          expect(result.error).toBeDefined();
        });

        test("should show success message after successful submission", async () => {
          fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
          });

          const form = document.getElementById("contact-form");
          document.getElementById("name").value = "John Doe";
          document.getElementById("email").value = "john@example.com";
          document.getElementById("message").value = "Test message";

          await contactForms.submitForm(form);

          const successMessage = document.querySelector(".success-message");
          expect(successMessage).toBeTruthy();
          expect(successMessage.textContent).toContain("successfully");
        });

        test("should reset form after successful submission", async () => {
          fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
          });

          const form = document.getElementById("contact-form");
          document.getElementById("name").value = "John Doe";
          document.getElementById("email").value = "john@example.com";

          await contactForms.submitForm(form);

          expect(document.getElementById("name").value).toBe("");
          expect(document.getElementById("email").value).toBe("");
        });
      });

      describe("Real-time Validation", () => {
        test("should validate fields on blur", () => {
          const emailInput = document.getElementById("email");
          emailInput.value = "invalid-email";

          const blurEvent = new Event("blur");
          emailInput.dispatchEvent(blurEvent);

          const errorElement = document.querySelector(
            '.error-message[data-field="email"]'
          );
          expect(errorElement).toBeTruthy();
        });

        test("should clear errors when field becomes valid", () => {
          const emailInput = document.getElementById("email");

          // First make it invalid
          emailInput.value = "invalid";
          emailInput.dispatchEvent(new Event("blur"));

          // Then make it valid
          emailInput.value = "valid@example.com";
          emailInput.dispatchEvent(new Event("input"));

          const errorElement = document.querySelector(
            '.error-message[data-field="email"]'
          );
          expect(errorElement).toBeFalsy();
        });
      });
    });
    ```

- [x] 1.4.6 Create mobile navigation tests (RED - These will fail initially)

  - [ ] Create `tests/unit/mobile-nav.test.js`:

    ```javascript
    /**
     * Mobile Navigation Tests - TDD Red Phase
     * These tests define the expected behavior before implementation
     */

    describe("MobileNavigation", () => {
      let MobileNavigation;
      let mobileNav;

      beforeAll(() => {
        // This will fail initially - we haven't created the class yet
        MobileNavigation = require("../../assets/js/mobile-nav.js");
      });

      beforeEach(() => {
        document.body.innerHTML = `
          <header>
            <nav class="hidden md:flex">
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
            <button id="mobile-menu-toggle" class="md:hidden">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </header>
          <div id="mobile-menu" class="mobile-nav closed">
            <nav>
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        `;

        mobileNav = new MobileNavigation();
      });

      describe("Menu Toggle", () => {
        test("should open mobile menu when toggle button is clicked", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");

          toggleButton.click();

          expect(mobileMenu.classList.contains("open")).toBe(true);
          expect(mobileMenu.classList.contains("closed")).toBe(false);
        });

        test("should close mobile menu when toggle button is clicked again", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");

          // Open menu
          toggleButton.click();
          expect(mobileMenu.classList.contains("open")).toBe(true);

          // Close menu
          toggleButton.click();
          expect(mobileMenu.classList.contains("closed")).toBe(true);
          expect(mobileMenu.classList.contains("open")).toBe(false);
        });

        test("should update hamburger icon when menu opens", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");

          toggleButton.click();

          expect(toggleButton.classList.contains("active")).toBe(true);
        });

        test("should close menu when navigation link is clicked", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");
          const navLink = mobileMenu.querySelector('a[href="#services"]');

          // Open menu first
          toggleButton.click();
          expect(mobileMenu.classList.contains("open")).toBe(true);

          // Click nav link
          navLink.click();

          expect(mobileMenu.classList.contains("closed")).toBe(true);
        });
      });

      describe("Accessibility", () => {
        test("should set proper ARIA attributes", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");

          expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
          expect(toggleButton.getAttribute("aria-controls")).toBe(
            "mobile-menu"
          );
          expect(mobileMenu.getAttribute("aria-hidden")).toBe("true");
        });

        test("should update ARIA attributes when menu opens", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");

          toggleButton.click();

          expect(toggleButton.getAttribute("aria-expanded")).toBe("true");
          expect(mobileMenu.getAttribute("aria-hidden")).toBe("false");
        });

        test("should trap focus within mobile menu when open", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");

          toggleButton.click();

          // Simulate tab key press
          const tabEvent = new KeyboardEvent("keydown", { key: "Tab" });
          document.dispatchEvent(tabEvent);

          // Focus should be trapped within mobile menu
          const focusedElement = document.activeElement;
          expect(mobileMenu.contains(focusedElement)).toBe(true);
        });

        test("should close menu when Escape key is pressed", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");

          // Open menu
          toggleButton.click();
          expect(mobileMenu.classList.contains("open")).toBe(true);

          // Press Escape
          const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
          document.dispatchEvent(escapeEvent);

          expect(mobileMenu.classList.contains("closed")).toBe(true);
        });
      });

      describe("Responsive Behavior", () => {
        test("should close mobile menu when window is resized to desktop", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");
          const mobileMenu = document.getElementById("mobile-menu");

          // Open menu
          toggleButton.click();
          expect(mobileMenu.classList.contains("open")).toBe(true);

          // Simulate window resize to desktop size
          Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024,
          });

          window.dispatchEvent(new Event("resize"));

          expect(mobileMenu.classList.contains("closed")).toBe(true);
        });

        test("should prevent body scroll when mobile menu is open", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");

          toggleButton.click();

          expect(document.body.style.overflow).toBe("hidden");
        });

        test("should restore body scroll when mobile menu is closed", () => {
          const toggleButton = document.getElementById("mobile-menu-toggle");

          // Open and close menu
          toggleButton.click();
          toggleButton.click();

          expect(document.body.style.overflow).toBe("");
        });
      });
    });
    ```

- [x] 1.5 Set up package.json scripts for TDD workflow

  - [x] Update `package.json` with comprehensive TDD scripts:
    ```json
    {
      "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "test:unit": "jest tests/unit",
        "test:integration": "jest tests/integration",
        "test:e2e": "jest tests/e2e",
        "tdd": "jest --watch --verbose",
        "dev": "concurrently \"npm run css:watch\" \"npm run test:watch\" \"live-server --port=3000\"",
        "build": "npm run css:build && npm run test:coverage",
        "css:build": "tailwindcss -i ./assets/css/main.css -o ./assets/css/dist/main.min.css --minify",
        "css:watch": "tailwindcss -i ./assets/css/main.css -o ./assets/css/dist/main.min.css --watch",
        "validate": "npm run validate:html && npm run validate:css && npm run validate:a11y",
        "validate:html": "node tools/validate-html.js",
        "validate:css": "node tools/validate-css.js",
        "validate:a11y": "axe http://localhost:3000",
        "lighthouse": "lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html"
      }
    }
    ```

- [x] 1.6 Run initial test suite to confirm RED phase
  - [ ] Run all tests to confirm they fail (RED phase): `npm test`
  - [ ] Verify that all tests fail as expected - this confirms we're starting with proper TDD
  - [ ] Document failing tests in a file: `npm test 2>&1 | tee test-failures.log`
  - [ ] Commit the failing tests: `git add . && git commit -m "RED: Add all failing tests for TDD implementation"`

**🔴 RED PHASE COMPLETE**
All tests are now written and failing. This is the proper TDD starting point. The next tasks will implement the minimal code needed to make these tests pass (GREEN phase), followed by refactoring (REFACTOR phase).

## GREEN Phase - Implementation to Pass Tests

Now that all tests are written and failing (RED phase), we implement the minimal code needed to make each test pass.

- [ ] 2. Implement Language Switcher (GREEN Phase)

  - **What**: Create the LanguageSwitcher class to make language-switcher.test.js pass
  - **Why**: This implements the core internationalization functionality
  - _Requirements: 5.1, 5.2_

- [ ] 2.1 Create basic LanguageSwitcher class structure

  - [ ] Create `assets/js/language-switcher.js`:

    ```javascript
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
        const browserLang = navigator.language.toLowerCase();
        if (
          browserLang.startsWith("zh-hk") ||
          browserLang.startsWith("zh-tw")
        ) {
          return "zh-hk";
        }
        if (browserLang.startsWith("zh-cn") || browserLang.startsWith("zh")) {
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
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription && translations.meta?.description) {
          metaDescription.setAttribute(
            "content",
            translations.meta.description
          );
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
    ```

  - [ ] Run tests to verify language switcher tests pass: `npm test -- language-switcher.test.js`

- [ ] 2.2 Create translation JSON files to support the language switcher

  - [ ] Create `assets/translations/en.json`:

    ```json
    {
      "meta": {
        "title": "Studio Encantador - Business Consulting & Web Development in Hong Kong",
        "description": "Professional business consulting and web development services for Hong Kong businesses. Expert strategy, elegant websites, and team building solutions."
      },
      "hero": {
        "title": "AI-Powered Business Transformation in Hong Kong",
        "subtitle": "We help Hong Kong businesses thrive through intelligent automation, AI consulting, and cutting-edge web development. Your trusted partner for digital transformation.",
        "cta_primary": "Start AI Journey",
        "cta_secondary": "View AI Solutions",
        "trust_indicator": "AI-First Agency • Launching in Hong Kong • January 2025"
      },
      "services": {
        "title": "Our Services",
        "subtitle": "We offer comprehensive business development and web services tailored for Hong Kong's dynamic market.",
        "strategy": {
          "title": "Business Strategy",
          "description": "We analyze your Hong Kong business needs and create comprehensive strategies for local market entry, growth, and regulatory compliance."
        },
        "web": {
          "title": "Web Development",
          "description": "Our team builds elegant, responsive websites optimized for Hong Kong users, with local hosting and mobile-first design."
        },
        "team": {
          "title": "Team Building & Workshops",
          "description": "Interactive sessions designed for Hong Kong's business culture, available both indoors and outdoors to suit the climate."
        }
      },
      "about": {
        "title": "About Us",
        "subtitle": "We're a dynamic duo launching in Hong Kong, combining technical expertise with business acumen.",
        "mission": "To empower Hong Kong businesses with elegant, effective solutions that enhance performance and create lasting value.",
        "vision": "To become the trusted partner for Hong Kong businesses seeking digital transformation and operational excellence."
      },
      "contact": {
        "title": "Get in Touch",
        "subtitle": "Ready to transform your Hong Kong business? Let's discuss your needs.",
        "phone": "+852 XXXX XXXX",
        "whatsapp": "+852 XXXX XXXX",
        "email": "hello@encantador.co",
        "address": "Central, Hong Kong",
        "hours": "Monday - Friday: 9:00 AM - 6:00 PM HKT",
        "response_time": "We respond within 2 hours during business hours"
      }
    }
    ```

  - [ ] Create `assets/translations/zh-hk.json` and `assets/translations/zh-cn.json` with corresponding Chinese translations
  - [ ] Run translation tests to verify they pass: `npm test -- translations.test.js`

- [ ] 3. Implement Theme Switcher (GREEN Phase)

  - [ ] Create `assets/js/theme-switcher.js` with complete ThemeSwitcher class
  - [ ] Run tests to verify theme switcher tests pass: `npm test -- theme-switcher.test.js`

- [ ] 4. Implement Contact Forms (GREEN Phase)

  - [ ] Create `assets/js/contact-forms.js` with complete ContactForms class
  - [ ] Run tests to verify contact forms tests pass: `npm test -- contact-forms.test.js`

- [ ] 5. Implement Mobile Navigation (GREEN Phase)

  - [ ] Create `assets/js/mobile-nav.js` with complete MobileNavigation class
  - [ ] Run tests to verify mobile navigation tests pass: `npm test -- mobile-nav.test.js`

- [ ] 6. Create Tailwind CSS Configuration and Styling (GREEN Phase)

  - [ ] Initialize Tailwind CSS with custom configuration
  - [ ] Create main CSS file with custom components and utilities
  - [ ] Build CSS and update HTML files
  - [ ] Run CSS validation tests

- [ ] 7. Update HTML files with proper structure and data attributes

  - [ ] Add language switcher to HTML header
  - [ ] Add mobile navigation structure
  - [ ] Add data-translate attributes to content
  - [ ] Add theme toggle button with proper icons

- [ ] 8. Run comprehensive test suite to verify GREEN phase
  - [ ] Run all tests to verify they pass: `npm test`
  - [ ] Run test coverage to ensure adequate coverage: `npm run test:coverage`
  - [ ] Fix any remaining failing tests by adjusting implementation
  - [ ] Commit the working implementation: `git add . && git commit -m "GREEN: Implement all functionality to pass tests"`

**🟢 GREEN PHASE COMPLETE**

## REFACTOR Phase - Improve Code Quality

Now that all tests pass, we refactor the code for better quality, maintainability, and performance while keeping tests passing.

- [ ] 9. Refactor Language Switcher for better performance and maintainability

  - **What**: Improve code structure, add error handling, optimize performance
  - **Why**: Better code quality while maintaining functionality
  - _Requirements: 5.1, 5.2_

- [ ] 9.1 Add performance optimizations

  - [ ] Implement translation caching to avoid repeated API calls
  - [ ] Add debouncing for rapid language switches
  - [ ] Optimize DOM queries by caching elements
  - [ ] Add lazy loading for translation files
  - [ ] Run tests to ensure functionality still works: `npm test -- language-switcher.test.js`

- [ ] 9.2 Improve error handling and user feedback

  - [ ] Add loading states during translation loading
  - [ ] Implement fallback content for failed translations
  - [ ] Add user-friendly error messages
  - [ ] Implement retry logic for failed requests
  - [ ] Run tests to ensure error handling works: `npm test -- language-switcher.test.js`

- [ ] 9.3 Enhance accessibility and user experience

  - [ ] Add keyboard navigation for language dropdown
  - [ ] Implement proper ARIA labels and descriptions
  - [ ] Add visual feedback for language changes
  - [ ] Improve mobile touch targets
  - [ ] Run accessibility tests: `npm run validate:a11y`

- [ ] 10. Refactor Theme Switcher for better performance

  - **What**: Optimize theme switching performance and add smooth transitions
  - **Why**: Better user experience and code quality
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 10.1 Add smooth theme transitions

  - [ ] Implement CSS transitions for theme changes
  - [ ] Add loading states for theme switching
  - [ ] Optimize DOM manipulation for better performance
  - [ ] Add prefers-reduced-motion support
  - [ ] Run tests to ensure functionality: `npm test -- theme-switcher.test.js`

- [ ] 10.2 Improve system integration

  - [ ] Better system theme change detection
  - [ ] Add support for custom theme preferences
  - [ ] Implement theme persistence across sessions
  - [ ] Add theme change event dispatching
  - [ ] Run tests to verify improvements: `npm test -- theme-switcher.test.js`

- [ ] 11. Refactor Contact Forms for better validation and UX

  - **What**: Improve form validation, error handling, and user experience
  - **Why**: Better conversion rates and user satisfaction
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 11.1 Enhance form validation

  - [ ] Add real-time validation with debouncing
  - [ ] Implement progressive validation (validate as user types)
  - [ ] Add custom validation rules for Hong Kong context
  - [ ] Improve error message clarity and localization
  - [ ] Run tests to ensure validation works: `npm test -- contact-forms.test.js`

- [ ] 11.2 Improve form submission experience

  - [ ] Add loading states during form submission
  - [ ] Implement optimistic UI updates
  - [ ] Add form submission analytics
  - [ ] Improve success/error message presentation
  - [ ] Run tests to verify improvements: `npm test -- contact-forms.test.js`

- [ ] 12. Refactor Mobile Navigation for better performance

  - **What**: Optimize mobile navigation performance and accessibility
  - **Why**: Better mobile user experience
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 12.1 Optimize mobile navigation performance

  - [ ] Implement touch gesture support
  - [ ] Add smooth animations and transitions
  - [ ] Optimize for different screen sizes
  - [ ] Add swipe-to-close functionality
  - [ ] Run tests to ensure functionality: `npm test -- mobile-nav.test.js`

- [ ] 12.2 Enhance mobile accessibility

  - [ ] Improve focus management
  - [ ] Add better screen reader support
  - [ ] Implement proper touch targets
  - [ ] Add haptic feedback support
  - [ ] Run accessibility tests: `npm run validate:a11y`

- [ ] 13. Optimize CSS and styling system

  - **What**: Improve CSS performance, reduce bundle size, enhance maintainability
  - **Why**: Faster loading times and better developer experience
  - _Requirements: 3.3, 3.4_

- [ ] 13.1 Optimize CSS performance

  - [ ] Remove unused CSS classes
  - [ ] Implement critical CSS extraction
  - [ ] Add CSS minification and compression
  - [ ] Optimize font loading strategy
  - [ ] Run performance tests: `npm run lighthouse`

- [ ] 13.2 Improve CSS maintainability

  - [ ] Organize CSS into logical modules
  - [ ] Add CSS custom properties for better theming
  - [ ] Implement consistent naming conventions
  - [ ] Add CSS documentation and comments
  - [ ] Run CSS validation: `npm run validate:css`

- [ ] 14. Add comprehensive error handling and monitoring

  - **What**: Implement global error handling, logging, and monitoring
  - **Why**: Better debugging and user experience
  - _Requirements: All requirements_

- [ ] 14.1 Implement global error handling

  - [ ] Add global JavaScript error handlers
  - [ ] Implement graceful degradation for failed features
  - [ ] Add user-friendly error messages
  - [ ] Create error reporting system
  - [ ] Run tests to verify error handling: `npm test`

- [ ] 14.2 Add performance monitoring

  - [ ] Implement Core Web Vitals tracking
  - [ ] Add user interaction analytics
  - [ ] Monitor translation loading performance
  - [ ] Track form submission success rates
  - [ ] Run performance validation: `npm run lighthouse`

- [ ] 15. Final optimization and cleanup

  - **What**: Final code cleanup, documentation, and optimization
  - **Why**: Production-ready code with excellent maintainability
  - _Requirements: All requirements_

- [ ] 15.1 Code cleanup and documentation

  - [ ] Add comprehensive JSDoc comments
  - [ ] Clean up console.log statements
  - [ ] Optimize bundle size
  - [ ] Add README documentation
  - [ ] Run final test suite: `npm test`

- [ ] 15.2 Performance optimization

  - [ ] Implement code splitting where beneficial
  - [ ] Optimize image loading and compression
  - [ ] Add service worker for caching (optional)
  - [ ] Minimize JavaScript bundle size
  - [ ] Run final performance audit: `npm run lighthouse`

- [ ] 15.3 Final validation and testing
  - [ ] Run comprehensive test suite: `npm run test:coverage`
  - [ ] Validate HTML across all pages: `npm run validate:html`
  - [ ] Check accessibility compliance: `npm run validate:a11y`
  - [ ] Verify mobile responsiveness across devices
  - [ ] Test all functionality in different browsers
  - [ ] Commit final refactored code: `git add . && git commit -m "REFACTOR: Optimize code quality and performance"`

**🔵 REFACTOR PHASE COMPLETE**

## TDD Cycle Summary

✅ **RED Phase**: All tests written and failing - defines expected behavior
✅ **GREEN Phase**: Minimal implementation to make all tests pass - working functionality  
✅ **REFACTOR Phase**: Code optimization while maintaining passing tests - production quality

The junior developer now has a complete, test-driven implementation of a professional Hong Kong agency website with:

- Multi-language support (English, Traditional Chinese, Simplified Chinese)
- Dark/light theme switching
- Mobile-optimized responsive design
- Professional contact forms with validation
- Comprehensive accessibility features
- High performance and SEO optimization
- 80%+ test coverage
- Production-ready code quality

All functionality is thoroughly tested and optimized for the Hong Kong market.
