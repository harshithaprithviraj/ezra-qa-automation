const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.locator('input[id="email"], input[type="email"]');
    this.passwordInput = page.locator('input[id="password"], input[type="password"]');
    this.submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
    this.errorMessage = page.locator('text=/invalid|incorrect|wrong|failed/i');
    this.cookieAcceptButton = page.locator('button:has-text("Accept")');
  }

  async navigate() {
    await this.page.goto('/sign-in');
    await this.handleCookieConsent();
  }

  async handleCookieConsent() {
    try {
      await this.cookieAcceptButton.waitFor({ state: 'visible', timeout: 3000 });
      await this.cookieAcceptButton.click();
      console.log('✓ Cookie consent accepted');
    } catch {
      // Cookie dialog not present, continue
    }
  }

  async login(email, password) {
    console.log(`Attempting login with: ${email}`);
    
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    
    try {
      await this.page.waitForURL('/', { timeout: 15000 });
      console.log('✓ Login successful');
    } catch (error) {
      const errorVisible = await this.errorMessage.isVisible();
      if (errorVisible) {
        const errorText = await this.errorMessage.textContent();
        throw new Error(`Login failed: ${errorText}`);
      }
      throw error;
    }
  }
}

module.exports = { LoginPage };
