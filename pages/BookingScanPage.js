const { BasePage } = require('./BasePage');

class BookingScanPage extends BasePage {
  constructor(page) {
    super(page);
    this.mriScanOption = page.locator('text=MRI Scan').first();
    this.continueButton = page.locator('button:has-text("Continue")');
  }

  async selectScanType(scanType = 'MRI Scan') {
    console.log(`Selecting scan type: ${scanType}`);
    await this.mriScanOption.click();
    await this.page.waitForTimeout(1000);
  }

  async clickContinue() {
    await this.continueButton.click();
    await this.page.waitForTimeout(2000);
  }
}

module.exports = { BookingScanPage };
