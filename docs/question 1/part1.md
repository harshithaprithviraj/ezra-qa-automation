
## 📝 QUESTION 1 - PART 1: Manual Test Cases (15 Total)

### Prioritization: P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)

---

### P0 - CRITICAL PRIORITY (Test Cases 1-3)

#### **TC-001: End-to-End Happy Path Booking with Valid Payment** ⭐ AUTOMATED
**Priority**: P0 - Critical  
**Description**: Verify complete booking flow from scan selection through payment completion  
**Preconditions**: User logged in (ezraharshi@gmail.com / A4!pN8$SxM2qE9)

**Test Steps**:
1. Navigate to https://myezra-staging.ezra.com/
2. Click "Book a scan" button
3. Select "MRI Scan" ($499)
4. Click Continue
5. Select location "AMRIC" (New York, NY 10022)
6. Select date (Jan 30, 2026)
7. Select time slot (11:00 AM)
8. Click Continue
9. Enter payment: Card 4242 4242 4242 4242, Exp 12/34, CVC 123, ZIP 10001
10. Click Continue

**Expected Result**: Payment succeeds, confirmation page shown, booking in dashboard, confirmation email sent

---

#### **TC-002: Payment Failure Handling with Declined Card** ⭐ AUTOMATED
**Priority**: P0 - Critical  
**Description**: Verify system gracefully handles declined payment and prevents ghost bookings  
**Preconditions**: User at payment page (completed TC-001 steps 1-7)

**Test Steps**:
1. Enter declined card: 4000 0000 0000 0002
2. Enter Exp 12/34, CVC 123, ZIP 10001
3. Click Continue

**Expected Result**: Clear error message, user remains on payment page, no booking created, slot still available, user can retry

---

#### **TC-003: Appointment Slot Availability & Double Booking Prevention**
**Priority**: P0 - Critical  
**Description**: Verify system prevents two users from booking same slot  
**Preconditions**: Two users logged in simultaneously in different sessions

**Test Steps**:
1. User A: Select MRI, AMRIC, Jan 30, 11:00 AM, go to payment (don't submit)
2. User B: Select MRI, AMRIC, Jan 30, verify 11:00 AM still visible
3. User A: Complete payment
4. User B: Refresh or attempt to book 11:00 AM

**Expected Result**: After User A books, slot becomes unavailable for User B, no double booking occurs

---

### P1 - HIGH PRIORITY (Test Cases 4-8)

#### **TC-004: Navigation Between Booking Steps with Data Persistence**
**Priority**: P1 - High  
**Test Steps**: Select scan → Select location/time → Go to payment → Click Back → Verify data persisted → Navigate forward

**Expected Result**: All selections preserved when navigating backward/forward, no data loss

---

#### **TC-005: Payment Form Field Validation**
**Priority**: P1 - High  
**Test Scenarios**:
- Empty card → Error: "Card number is required"
- Invalid card "1234" → Error: "Your card number is invalid"
- Expired date "01/20" → Error: "Expiration year is in the past"
- CVC "1" → Error: "Security code is incomplete"
- Empty ZIP → Error: "Postal code is required"

**Expected Result**: Clear inline error messages, Continue disabled until valid

---

#### **TC-006: Promo Code Application**
**Priority**: P1 - High  
**Test Steps**: 
- Enter valid promo code → Verify discount applied
- Enter invalid code "INVALID123" → Verify error shown

**Expected Result**: Valid code reduces price, invalid code shows error

---

#### **TC-007: Scan Type Selection & Pricing Accuracy**
**Priority**: P1 - High  
**Test Steps**: Verify all scans show correct pricing (MRI: $499, MRI+Spine: $1,499, MRI+Full: $3,999, CT: $349), select each, verify price carries to payment

**Expected Result**: Prices accurate, selection highlighted, price matches at payment

---

#### **TC-008: Alternative Payment Method (Affirm)**
**Priority**: P1 - High  
**Test Steps**: Select Affirm payment option, complete Affirm flow, verify booking confirmed

**Expected Result**: Affirm payment succeeds, booking created

---

### P2 - MEDIUM PRIORITY (Test Cases 9-12)

#### **TC-009: Location Filtering by State**
**Priority**: P2 - Medium  
**Test Steps**: Select "California" dropdown → Verify only CA locations shown

---

#### **TC-010: Date Selection Validation (Past Dates)**
**Priority**: P2 - Medium  
**Test Steps**: Verify past dates disabled/not selectable, only future dates clickable

---

#### **TC-011: Session Timeout During Booking**
**Priority**: P2 - Medium  
**Test Steps**: Wait 30 minutes mid-booking, verify redirect to login with "Session expired" message

---

#### **TC-012: Mobile Responsiveness**
**Priority**: P2 - Medium  
**Test Steps**: Complete booking on mobile viewport (<768px), verify all elements usable

---

### P3 - LOW PRIORITY (Test Cases 13-15)

#### **TC-013: Geolocation "Find Closest Centers to Me"**
**Priority**: P3 - Low  
**Test Steps**: Click button, test with allowed/denied geolocation permission

---

#### **TC-014: External FAQ Link**
**Priority**: P3 - Low  
**Test Steps**: Click "here" link, verify opens https://ezra.com/faq in new tab

---

#### **TC-015: Cancel Button Functionality**
**Priority**: P3 - Low  
**Test Steps**: Click "Cancel" after selecting scan, verify return to dashboard without booking

---