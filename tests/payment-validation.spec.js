const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { BookingScanPage } = require('../pages/BookingScanPage');
const { ScheduleScanPage } = require('../pages/ScheduleScanPage');
const { PaymentPage } = require('../pages/PaymentPage');

test.describe('TC-002: Payment Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(process.env.TEST_EMAIL, process.env.TEST_PASSWORD);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForPageLoad();
    await dashboardPage.clickBookScan();

    const bookingScanPage = new BookingScanPage(page);
    await bookingScanPage.selectScanType('MRI Scan');
    await bookingScanPage.clickContinue();

    const scheduleScanPage = new ScheduleScanPage(page);
    await scheduleScanPage.selectLocation('AMRIC');
    await scheduleScanPage.selectDate(20); // Jan 20 @ 5:00 PM - unique to validation tests
    await scheduleScanPage.selectTimeSlot('5:00 PM');
    await scheduleScanPage.clickContinue();
  });

   test('Payment Failure Handling with Declined Card', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    
    await paymentPage.fillCardDetails('4000000000000002','1234','123', '10001');
    await page.waitForTimeout(2000);

     // Click Continue to trigger validation
    await page.locator('button:has-text("Continue")').click();
    await page.waitForTimeout(8000);
    
    const errorMessage = await paymentPage.getValidationError();
    expect(errorMessage).toContain('Your card was declined.');
    console.log('✅ Validation error shown for empty card number');
  });


  test('Empty card number shows validation error', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    
    await paymentPage.fillOtherFieldsOnly('1234', '123', '10001');
    await page.waitForTimeout(2000);

     // Click Continue to trigger validation
    await page.locator('button:has-text("Continue")').click();
    await page.waitForTimeout(2000);
    
    const errorMessage = await paymentPage.getValidationError();
    expect(errorMessage).toContain('incomplete');
    console.log('✅ Validation error shown for empty card number');
  });

  test('Invalid card number shows validation error', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    
    await paymentPage.fillCardDetails('5678 8889 9990 0000', '1234', '123', '10001');
    await page.waitForTimeout(2000);
    
    const errorMessage = await paymentPage.getValidationError();
    expect(errorMessage).toContain('invalid');
    console.log('✅ Validation error shown for invalid card');
  });

  test('Expired card date shows validation error', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    
    await paymentPage.fillCardDetails('4242424242424242', '0120', '123', '10001');
    await page.waitForTimeout(2000);
    
    const errorMessage = await paymentPage.getValidationError();
    expect(errorMessage.toLowerCase()).toMatch(/expir|past/);
    console.log('✅ Validation error shown for expired card');
  });

  test('Invalid CVC shows validation error', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    
    await paymentPage.fillCardDetails('4242424242424242', '1234', '1', '10001');
    await page.waitForTimeout(2000);
    
    const errorMessage = await paymentPage.getValidationError();
    expect(errorMessage.toLowerCase()).toMatch(/security code|cvc|incomplete/);
    console.log('✅ Validation error shown for invalid CVC');
  });

  test('Empty postal code shows validation error', async ({ page }) => {
    const paymentPage = new PaymentPage(page);
    
    await paymentPage.fillCardDetailsExceptPostal('4242424242424242', '1234', '123');
    await page.waitForTimeout(2000);

     // Click Continue to trigger validation
    await page.locator('button:has-text("Continue")').click();
    await page.waitForTimeout(2000);
    
    const errorMessage = await paymentPage.getValidationError();
    expect(errorMessage).toContain('invalid');
    console.log('✅ Validation error shown for empty postal code');
  });
});
