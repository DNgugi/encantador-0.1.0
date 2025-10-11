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
    it("should initialize with light theme by default", () => {
      expect(themeSwitcher.theme).toBe("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should detect system dark mode preference", () => {
      window.matchMedia.mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      themeSwitcher = new ThemeSwitcher();
      expect(themeSwitcher.getPreferredTheme()).toBe("dark");
    });

    it("should use stored theme preference over system preference", () => {
      localStorage.getItem.mockReturnValue("dark");
      themeSwitcher = new ThemeSwitcher();
      expect(themeSwitcher.theme).toBe("dark");
    });
  });

  describe("Theme Setting", () => {
    it("should apply dark theme correctly", () => {
      themeSwitcher.setTheme("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should apply light theme correctly", () => {
      document.documentElement.classList.add("dark");
      themeSwitcher.setTheme("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
    });

    it("should toggle between themes", () => {
      themeSwitcher.setTheme("light");
      themeSwitcher.toggleTheme();
      expect(themeSwitcher.theme).toBe("dark");

      themeSwitcher.toggleTheme();
      expect(themeSwitcher.theme).toBe("light");
    });
  });

  describe("UI Updates", () => {
    it("should update toggle button icons correctly", () => {
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

    it("should update aria-label for accessibility", () => {
      document.body.innerHTML =
        '<button id="theme-toggle" aria-label="Switch theme"></button>';

      themeSwitcher.setTheme("dark");
      themeSwitcher.updateToggleButton();

      const button = document.getElementById("theme-toggle");
      expect(button.getAttribute("aria-label")).toBe("Switch to light mode");
    });
  });

  describe("Event Handling", () => {
    it("should bind toggle button click event", () => {
      document.body.innerHTML = '<button id="theme-toggle"></button>';

      themeSwitcher.bindEvents();

      const toggleButton = document.getElementById("theme-toggle");
      const initialTheme = themeSwitcher.theme;

      toggleButton.click();

      expect(themeSwitcher.theme).not.toBe(initialTheme);
    });

    it("should respond to system theme changes", () => {
      const mockMediaQuery = {
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      window.matchMedia.mockReturnValue(mockMediaQuery);
      themeSwitcher.bindEvents();

      // Simulate system theme change
      const changeHandler = mockMediaQuery.addEventListener.mock.calls[0][1];
      changeHandler({ matches: true });

      expect(themeSwitcher.theme).toBe("dark");
    });
  });
});
