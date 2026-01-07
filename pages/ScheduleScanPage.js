// pages/ScheduleScanPage.js

const { BasePage } = require('./BasePage');

class ScheduleScanPage extends BasePage {
  constructor(page) {
    super(page);
    this.continueButton = page.locator('[data-test="submit"]');
  }

  /**
   * Select a scan location from the list
   * @param {string} locationName - Name of the location (e.g., 'AMRIC')
   */
  async selectLocation(locationName = 'AMRIC') {
    console.log(`Selecting location: ${locationName}`);
    await this.page.waitForTimeout(2000);
    
    const locationElement = this.page.locator(`text=${locationName}`).first();
    await locationElement.waitFor({ state: 'visible', timeout: 10000 });
    await locationElement.click();
    
    console.log(`✓ Selected location: ${locationName}`);
    await this.page.waitForTimeout(3000);
  }

  /**
   * Select a random date from January 20 onwards
   * @param {number} startDate - Minimum date to select from (default: 20)
   */
  async selectRandomDateFromJan20(startDate = 20) {
    console.log(`Selecting random date from Jan ${startDate}, 2026 onwards...`);
    
    await this.page.waitForTimeout(2000);
    
    // Find all date buttons from Jan 20 onwards using data-testid
    // Format: data-testid="1-{day}-cal-day-content" where 1 = January
    const availableDates = [];
    
    for (let day = startDate; day <= 31; day++) {
      try {
        const dateButton = this.page.getByTestId(`1-${day}-cal-day-content`).first();
        const isVisible = await dateButton.isVisible({ timeout: 1000 }).catch(() => false);
        
        if (isVisible) {
          const isEnabled = await dateButton.isEnabled().catch(() => false);
          if (isEnabled) {
            availableDates.push({ day, button: dateButton });
            console.log(`  ✓ Date ${day} is available`);
          }
        }
      } catch (error) {
        // Date doesn't exist or not visible, skip
        continue;
      }
    }
    
    if (availableDates.length === 0) {
      throw new Error(`No available dates found from Jan ${startDate} onwards`);
    }
    
    console.log(`✓ Found ${availableDates.length} available dates from Jan ${startDate} onwards`);
    
    // Select a random date from the available dates
    const randomIndex = Math.floor(Math.random() * availableDates.length);
    const selectedDate = availableDates[randomIndex];
    
    await selectedDate.button.scrollIntoViewIfNeeded();
    await selectedDate.button.click();
    console.log(`✓ Clicked random date: Jan ${selectedDate.day}, 2026`);
    
    await this.page.waitForTimeout(5000);
  }

  /**
   * Select a date in January 2026 (simplified - no month navigation)
   * @param {number} dateNumber - Day of the month (default: 20)
   */
  async selectDate(dateNumber = 20) {
    console.log(`Selecting date: Jan ${dateNumber}, 2026`);
    
    await this.page.waitForTimeout(2000);
    
    // Scroll calendar into view
    try {
      const calendarButton = this.page.locator('button:has-text("2026")');
      await calendarButton.scrollIntoViewIfNeeded({ timeout: 5000 });
    } catch {
      await this.page.keyboard.press('PageDown');
      await this.page.waitForTimeout(2000);
    }
    
    await this.page.locator('button:has-text("2026")').waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ Calendar visible');
    
    // Select random date from specified start date onwards
    await this.selectRandomDateFromJan20(dateNumber);
  }

  /**
   * Select a time slot for the appointment
   * @param {string} preferredTime - Preferred time (e.g., '3:00 PM')
   */
  async selectTimeSlot(preferredTime = '3:00 PM') {
    console.log(`Attempting to select time slot: ${preferredTime}`);
    
    // Wait for time slots container to be visible
    // Time slots are in a generic container with clickable div elements
    await this.page.waitForTimeout(2000);
    
    // Find clickable time slot elements - they have cursor=pointer attribute
    // and contain time text like "3:00 PM"
    const timeSlotContainer = this.page.locator('text=The time(s) are displayed').locator('..');
    await timeSlotContainer.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ Time slot container loaded');
    
    // Get all clickable time slots (generic elements with cursor=pointer)
    const availableSlots = timeSlotContainer.locator('[class]').filter({ hasText: /^\d{1,2}:\d{2}\s*(AM|PM)$/ });
    
    const count = await availableSlots.count();
    if (count === 0) {
      throw new Error('No time slots available for selected date');
    }
    
    console.log(`✓ Found ${count} available time slots`);
    
    // Try to find and click the preferred time
    const timeSlot = availableSlots.filter({ hasText: preferredTime }).first();
    const isVisible = await timeSlot.isVisible().catch(() => false);
    
    if (isVisible) {
      await timeSlot.scrollIntoViewIfNeeded();
      await timeSlot.click();
      console.log(`✓ Selected time: ${preferredTime}`);
    } else {
      // Click first available slot
      console.log(`⚠️ ${preferredTime} not available, selecting first available slot`);
      const firstSlot = availableSlots.first();
      await firstSlot.scrollIntoViewIfNeeded();
      await firstSlot.click();
      const selectedTime = await firstSlot.textContent();
      console.log(`✓ Selected time: ${selectedTime.trim()}`);
    }
    
    // Wait for selection to register
    await this.page.waitForTimeout(2000);
  }

  /**
   * Click the Continue button to proceed to next step
   */
  async clickContinue() {
    await this.page.waitForTimeout(1000);
    
    // Ensure continue button is enabled before clicking
    await this.continueButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.continueButton.scrollIntoViewIfNeeded();
    
    const isDisabled = await this.continueButton.isDisabled();
    if (isDisabled) {
      throw new Error('Continue button is still disabled - time slot may not have been selected properly');
    }
    
    await this.continueButton.click();
    console.log('✓ Clicked Continue button');
    
    await this.page.waitForURL(/\/(sign-up|book-scan)\/reserve-appointment/, { timeout: 15000 });
    console.log('✓ Navigated to payment page');
  }
}

module.exports = { ScheduleScanPage };
