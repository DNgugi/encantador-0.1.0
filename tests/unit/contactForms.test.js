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
    it("should validate required fields", () => {
      const form = document.getElementById("contact-form");
      const formData = new FormData(form);

      expect(contactForms.validateForm(formData)).toBe(false);

      // Fill required fields
      formData.set("name", "John Doe");
      formData.set("email", "john@example.com");
      formData.set("message", "Test message");

      expect(contactForms.validateForm(formData)).toBe(true);
    });

    it("should validate email format", () => {
      const validEmails = ["test@example.com", "user+tag@domain.co.uk"];
      const invalidEmails = ["invalid-email", "@domain.com", "user@"];

      validEmails.forEach((email) => {
        expect(contactForms.validateEmail(email)).toBe(true);
      });

      invalidEmails.forEach((email) => {
        expect(contactForms.validateEmail(email)).toBe(false);
      });
    });

    it("should validate Hong Kong phone number format", () => {
      const validPhones = ["+852 1234 5678", "+85212345678", "1234 5678"];
      const invalidPhones = ["+86 123 456 789", "123", "+852 123"];

      validPhones.forEach((phone) => {
        expect(contactForms.validateHongKongPhone(phone)).toBe(true);
      });

      invalidPhones.forEach((phone) => {
        expect(contactForms.validateHongKongPhone(phone)).toBe(false);
      });
    });

    it("should show validation errors for invalid fields", () => {
      const nameInput = document.getElementById("name");

      contactForms.showFieldError("name", "Name is required");

      const errorElement = document.querySelector(
        '.error-message[data-field="name"]'
      );
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toBe("Name is required");
      expect(nameInput.classList.contains("error")).toBe(true);
    });

    it("should clear validation errors when field becomes valid", () => {
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
    it("should prevent submission of invalid form", async () => {
      const form = document.getElementById("contact-form");
      const submitEvent = new Event("submit");

      const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

      form.dispatchEvent(submitEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should submit valid form data", async () => {
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

    it("should handle submission errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const form = document.getElementById("contact-form");
      document.getElementById("name").value = "John Doe";
      document.getElementById("email").value = "john@example.com";
      document.getElementById("message").value = "Test message";

      const result = await contactForms.submitForm(form);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should show success message after successful submission", async () => {
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

    it("should reset form after successful submission", async () => {
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
    it("should validate fields on blur", () => {
      const emailInput = document.getElementById("email");
      emailInput.value = "invalid-email";

      const blurEvent = new Event("blur");
      emailInput.dispatchEvent(blurEvent);

      const errorElement = document.querySelector(
        '.error-message[data-field="email"]'
      );
      expect(errorElement).toBeTruthy();
    });

    it("should clear errors when field becomes valid", () => {
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
