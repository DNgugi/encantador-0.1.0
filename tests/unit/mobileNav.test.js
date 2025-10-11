describe("Mobile Navigation", () => {
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
    it("should open mobile menu when toggle button is clicked", () => {
      const toggleButton = document.getElementById("mobile-menu-toggle");
      const mobileMenu = document.getElementById("mobile-menu");

      toggleButton.click();

      expect(mobileMenu.classList.contains("open")).toBe(true);
      expect(mobileMenu.classList.contains("closed")).toBe(false);
    });

    it("should close mobile menu when toggle button is clicked again", () => {
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

    it("should update hamburger icon when menu opens", () => {
      const toggleButton = document.getElementById("mobile-menu-toggle");

      toggleButton.click();

      expect(toggleButton.classList.contains("active")).toBe(true);
    });

    it("should close menu when navigation link is clicked", () => {
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
    it("should set proper ARIA attributes", () => {
      const toggleButton = document.getElementById("mobile-menu-toggle");
      const mobileMenu = document.getElementById("mobile-menu");

      expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
      expect(toggleButton.getAttribute("aria-controls")).toBe("mobile-menu");
      expect(mobileMenu.getAttribute("aria-hidden")).toBe("true");
    });

    it("should update ARIA attributes when menu opens", () => {
      const toggleButton = document.getElementById("mobile-menu-toggle");
      const mobileMenu = document.getElementById("mobile-menu");

      toggleButton.click();

      expect(toggleButton.getAttribute("aria-expanded")).toBe("true");
      expect(mobileMenu.getAttribute("aria-hidden")).toBe("false");
    });

    it("should trap focus within mobile menu when open", () => {
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

    it("should close menu when Escape key is pressed", () => {
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
    it("should close mobile menu when window is resized to desktop", () => {
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

    it("should prevent body scroll when mobile menu is open", () => {
      const toggleButton = document.getElementById("mobile-menu-toggle");

      toggleButton.click();

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should restore body scroll when mobile menu is closed", () => {
      const toggleButton = document.getElementById("mobile-menu-toggle");

      // Open and close menu
      toggleButton.click();
      toggleButton.click();

      expect(document.body.style.overflow).toBe("");
    });
  });
});
