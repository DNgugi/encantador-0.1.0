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
    it("should have all translation files", () => {
      languages.forEach((lang) => {
        expect(fs.existsSync(translationPaths[lang])).toBe(true);
      });
    });

    it("should contain valid JSON for all translation files", () => {
      languages.forEach((lang) => {
        if (fs.existsSync(translationPaths[lang])) {
          const content = fs.readFileSync(translationPaths[lang], "utf8");
          expect(() => JSON.parse(content)).not.toThrow();
          translationFiles[lang] = JSON.parse(content);
        }
      });
    });

    it("should have the same translation keys for all languages ", () => {
      const englishKeys = getAllKeys(translationFiles.en || {});

      languages.slice(1).forEach((lang) => {
        const langKeys = getAllKeys(translationFiles[lang] || {});
        expect(langKeys).toEqual(englishKeys);
      });
    });

    it("should have no empty translation values", () => {
      languages.forEach((lang) => {
        const emptyValues = findEmptyValues(translationFiles[lang] || {});
        expect(emptyValues).toEqual([]);
      });
    });
  });

  describe("Required Translation Sections", () => {
    it("should contain meta section with title and description", () => {
      languages.forEach((lang) => {
        const translations = translationFiles[lang] || {};
        expect(translations.meta).toBeDefined();
        expect(translations.meta.title).toBeDefined();
        expect(translations.meta.description).toBeDefined();
        expect(typeof translations.meta.title).toBe("string");
        expect(typeof translations.meta.description).toBe("string");
      });
    });

    it("should contain hero section with required fields", () => {
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

    it("should contain services section with all service types", () => {
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

    it("should contain contact section with Hong Kong details", () => {
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
    it("should contain appropriate characters in Chinese translations", () => {
      const zhHkTranslations = translationFiles["zh-hk"] || {};
      const zhCnTranslations = translationFiles["zh-cn"] || {};

      // Traditional Chinese should contain traditional characters
      const traditionalText = JSON.stringify(zhHkTranslations);
      expect(traditionalText).toMatch(/[繁體]/); // Should contain traditional characters

      // Simplified Chinese should contain simplified characters
      const simplifiedText = JSON.stringify(zhCnTranslations);
      expect(simplifiedText).toMatch(/[简体]/); // Should contain simplified characters
    });

    it("should have appropriate length for all translations ", () => {
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
  let emptyValues = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      emptyValues = emptyValues.concat(findEmptyValues(obj[key], fullKey));
    } else if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
      emptyValues.push(fullKey);
    }
  }
  return emptyValues;
}
