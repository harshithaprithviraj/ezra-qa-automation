# Ezra Booking Flow - QA Assessment

## 📋 Overview
Comprehensive QA assessment for Ezra's booking flow, including manual test cases and automated test suite using Playwright with JavaScript. This project demonstrates production-level test automation architecture using the Page Object Model (POM) pattern.

**Assessment Date**: January 6, 2026  
**Candidate**: Harshitha Prithvi Raj  
**Position**: Senior QA Engineer

---
## Assessment Mapping

| Assessment Section | Location |
|-------------------|----------|
| Q1 Part 1 – 15 Manual Test Cases | docs/question1/part1.md |
| Q1 Part 2 – Top 3 Justification | docs/question1/part2.md |
| Q2 Part 1 – Privacy/Security Test Case | docs/question2/part1.md |
| Q2 Part 2 – HTTP Requests | docs/question2/part2.md |
| Q2 Part 3 – Security Strategy | docs/question2/part3.md |
| Automation (Playwright) | tests/ |

## 🎯 Test Environment

| Portal | URL | Purpose |
|--------|-----|---------|
| Member Portal | https://myezra-staging.ezra.com/ | Primary booking interface |
| User Portal | https://staging-hub.ezra.com/sign-in/ | Admin/management interface |
| Payment Testing | [Stripe Test Mode](https://docs.stripe.com/testing) | Payment integration testing |

---

## 🤖 QUESTION 1 - PART 2: Test Automation

### Selected Test Cases for Automation

I automated **2 critical test cases** (TC-001, TC-002) with additional validation scenarios.

#### **1. TC-001: End-to-End Happy Path Booking** 
**Why Automated**:
- ✅ **Highest Business Impact**: Core revenue-generating flow
- ✅ **Integration Testing**: Validates all components together
- ✅ **Regression Safety**: Quick validation after deployments
- ✅ **Customer Experience**: Direct impact on satisfaction

**Automation Value**: Provides fast, reliable validation of the most critical business path after changes

---

#### **2. TC-002: Payment Decline Handling**
**Why Automated**:
- ✅ **Error Handling Validation**: Ensures graceful failure
- ✅ **Edge Case Coverage**: Often missed in manual testing
- ✅ **Fast Feedback**: Quick payment integration validation
- ✅ **User Experience**: Verifies clear error messaging

**Automation Value**: Ensures payment failures are handled safely and consistently.

---

### Technology Stack

{
  "framework": "Playwright",
  "language": "JavaScript",
  "testRunner": "Playwright Test",
  "designPattern": "Page Object Model (POM)",
  "reporting": "Playwright HTML Reporter"
}
---
### 🚀 Setup Instructions
Prerequisites:
Node.js v18+
npm or yarn
Git

### Installation
# 1. Clone repository
git clone https://github.com/harshithaprithviraj/ezra-qa-automation.git
cd ezra-qa-automation

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

---
### Running tests
# Run all tests
npx playwright test

# Run specific test

 npx playwright test tests/payment-validation.spec.js     # Payment tests

# Run in headed mode
npx playwright test --headed

# Generate HTML report
npx playwright show-report

---

### Trade-offs & Assumptions

| Decision               | Trade-off             | Rationale                                     |
| ---------------------- | --------------------- | --------------------------------------------- |
| Automate 2 of 15 tests | Coverage vs speed     | Focus on highest-impact paths                 |
| UI E2E tests           | Slower than API tests | Validates real user behavior and integrations |
| POM architecture       | Initial setup time    | Long-term maintainability and scalability     |
| Real integrations      | Less isolation        | Higher confidence in production behavior      |

Assumptions
✅ Environment: Staging stable 24/7, test data persists, Stripe test mode enabled
✅ Authentication: Test credentials remain valid, no MFA/2FA
✅ Booking System: At least one slot always available
✅ Payment: Stripe test cards behave per documentation
✅ Data: Tests can create bookings without manual cleanup

### Architectural Decisions
Why Page Object Model?

Centralized selectors and actions

Cleaner, more readable tests

Easier updates when UI changes

Scales well as coverage grows

Why Playwright?

Built-in auto-waiting reduces flakiness

Strong support for modern web apps

Cross-browser support when needed

First-class reporting and debugging tools

### Future Improvements
Phase 1: Next Sprint
 CI/CD pipeline (GitHub Actions)

 Additional test cases

 Visual regression testing

 Test data management

Phase 2: Next Quarter
 API testing layer

 Performance testing

 Cross-browser expansion

 Accessibility testing

Phase 3: Long Term
 AI-powered testing (self-healing locators)

 Load testing

 Real-time monitoring dashboards


## Submission Details

Author: Harshitha Prithvi Raj
Email: harshithaptiwari@gmail.com

GitHub: https://github.com/harshithaprithviraj/ezra-qa-automation

Date: January 6, 2026
Author: Harshitha Prithvi Raj
Email: [harshithaptiwari@gmail.com]
GitHub: https://github.com/harshithaprithviraj/ezra-qa-automation



