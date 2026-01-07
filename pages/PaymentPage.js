// pages/PaymentPage.js

const { BasePage } = require('./BasePage');

class PaymentPage extends BasePage {
  constructor(page) {
    super(page);
    this.continueButton = page.locator('button:has-text("Continue")');
    this.totalPrice = page.locator('text=/Total.*\\$/');
    this.stripeIframe = page.frameLocator('iframe[title*="Secure payment input"]');
  }

  async fillCardDetails(cardNumber, expiry, cvc, postalCode, country = 'United States') {
    console.log('Filling card details in Stripe iframe...');
    
    await this.page.waitForTimeout(3000);
    
    try {
      const cardField = this.stripeIframe.locator('input[name="cardnumber"], #Field-numberInput');
      await cardField.waitFor({ state: 'visible', timeout: 10000 });
      await cardField.fill(cardNumber);
      
      await this.stripeIframe.locator('input[name="exp-date"], #Field-expiryInput').fill(expiry);
      await this.stripeIframe.locator('input[name="cvc"], #Field-cvcInput').fill(cvc);
      
      const countryDropdown = this.stripeIframe.locator('select[name="country"], #Field-countryInput');
      if (await countryDropdown.isVisible()) {
        await countryDropdown.selectOption(country);
        await this.page.waitForTimeout(500);
      }
      
      await this.stripeIframe.locator('input[name="postal"], #Field-postalCodeInput').fill(postalCode);
      
      console.log('✓ Card details filled successfully');
    } catch (error) {
      console.error('Error filling card details:', error.message);
      throw error;
    }
  }

  async fillOtherFieldsOnly(expiry, cvc, postalCode) {
    console.log('Filling payment fields except card number');
    await this.page.waitForTimeout(3000);
    
    await this.stripeIframe.locator('input[name="exp-date"], #Field-expiryInput').fill(expiry);
    await this.stripeIframe.locator('input[name="cvc"], #Field-cvcInput').fill(cvc);
    
    const countryDropdown = this.stripeIframe.locator('select[name="country"], #Field-countryInput');
    if (await countryDropdown.isVisible()) {
      await countryDropdown.selectOption('United States');
      await this.page.waitForTimeout(500);
    }
    
    await this.stripeIframe.locator('input[name="postal"], #Field-postalCodeInput').fill(postalCode);
  }

  async fillCardDetailsExceptPostal(cardNumber, expiry, cvc) {
    console.log('Filling card details except postal code');
    await this.page.waitForTimeout(3000);
    
    const cardField = this.stripeIframe.locator('input[name="cardnumber"], #Field-numberInput');
    await cardField.waitFor({ state: 'visible', timeout: 10000 });
    await cardField.fill(cardNumber);
    await this.stripeIframe.locator('input[name="exp-date"], #Field-expiryInput').fill(expiry);
    await this.stripeIframe.locator('input[name="cvc"], #Field-cvcInput').fill(cvc);
    
    const countryDropdown = this.stripeIframe.locator('select[name="country"], #Field-countryInput');
    if (await countryDropdown.isVisible()) {
      await countryDropdown.selectOption('United States');
    }
  }

  async getValidationError() {
    await this.page.waitForTimeout(1000);
    
    const errorSelectors = [
      '[role="alert"]',
      '.error-message',
      '[class*="error"]',
      'text=/invalid|required|incomplete|past/i'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = this.page.locator(selector).first();
      if (await errorElement.isVisible()) {
        return await errorElement.textContent();
      }
    }
    
    const iframeError = this.stripeIframe.locator('[role="alert"], .error').first();
    if (await iframeError.isVisible()) {
      return await iframeError.textContent();
    }
    
    return '';
  }

  async clickContinue() {
    await this.continueButton.click();
    
    // Handle navigation gracefully, ignore if context/page closes
    try {
      await Promise.race([
        this.page.waitForURL(/\/(home|dashboard|confirmation)/, { timeout: 10000 }),
        this.page.waitForLoadState('networkidle', { timeout: 10000 })
      ]);
    } catch (error) {
      // Ignore "closed" errors (expected in multi-context tests)
      if (!error.message.includes('closed') && !error.message.includes('Target')) {
        console.log('⚠️ Post-payment wait:', error.message);
      }
    }
  }

  async getTotalPrice() {
    const priceText = await this.totalPrice.textContent();
    return priceText.match(/\$\d+/)?.[0];
  }
}

module.exports = { PaymentPage };
