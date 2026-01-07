// pages/DashboardPage.js

const { BasePage } = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.signOutButton = page.locator('button:has-text("Sign out")');
    this.bookScanButton = page.locator('button:has-text("Book a scan")').last();
  }

  async navigate() {
    await this.page.goto('/');
  }

  async clickBookScan() {
    console.log('Clicking Book a scan button');
    await this.bookScanButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.bookScanButton.click();
    
    // Accept both URLs (sign-up for new users, book-scan for existing)
    await this.page.waitForURL(/\/(sign-up|book-scan)\/select-plan/, { timeout: 10000 });
    
    console.log('✓ Navigated to booking page');
  }

  async waitForPageLoad() {
    await this.signOutButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.bookScanButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ Dashboard page loaded');
  }

  async getAppointmentDetails() {
    const appointmentText = await this.page.locator('text=/MRI Scan/').first().textContent();
    return appointmentText;
  }
}

module.exports = { DashboardPage };
