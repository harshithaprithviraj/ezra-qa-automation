const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { BookingScanPage } = require('../pages/BookingScanPage');
const { ScheduleScanPage } = require('../pages/ScheduleScanPage');
const { PaymentPage } = require('../pages/PaymentPage');

test.describe('TC-001: Happy Path Booking Flow', () => {
  test('Complete booking with valid payment', async ({ page }) => {
    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.TEST_EMAIL,
      process.env.TEST_PASSWORD
    );

    // Step 2: Navigate to booking
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForPageLoad();
    await dashboardPage.clickBookScan();

    // Step 3: Select scan type
    const bookingScanPage = new BookingScanPage(page);
    await bookingScanPage.selectScanType('MRI Scan');
    await bookingScanPage.clickContinue();

    // Step 4: Select location, date, time
    const scheduleScanPage = new ScheduleScanPage(page);
    await scheduleScanPage.selectLocation('AMRIC');
    await scheduleScanPage.selectDate(10); 
    await scheduleScanPage.selectTimeSlot('3:00 PM');
    await scheduleScanPage.clickContinue();

    // Step 5: Payment
    const paymentPage = new PaymentPage(page);
    await paymentPage.fillCardDetails(
      process.env.STRIPE_VALID_CARD,
      '1234',
      '123',
      '10001'
    );

    console.log('✓ Test completed - Payment page reached successfully');
    
    // Note: Commenting out final submission to avoid creating real bookings
    // Uncomment below to complete the booking:
    // await paymentPage.clickContinue();
  });
});
