# Question 2 - Part 1: Privacy & Security Test Case

## Overview
Integration test case to prevent members from accessing other members' medical data, ensuring HIPAA compliance and protecting patient privacy.

**Date**: January 6, 2026  
**Prepared by**: Harshitha Prithvi Raj  
**Test Environment**: https://myezra-staging.ezra.com/  
**Priority**: P0 - Critical (Security & Compliance)

---

## Why This Test is Critical

- 🏥 **HIPAA Compliance**: Violations = $100K-$1.5M fines per incident
- 🔒 **Privacy-First Culture**: Core to Ezra's business model
- ⚖️ **Legal Liability**: Data breaches expose company to lawsuits
- 💔 **Brand Trust**: Single privacy breach = permanent damage

---

## Test Case: TC-SEC-001 - Medical Questionnaire Access Control

### Test Objective
Verify that **Member A cannot access Member B's medical questionnaire data** through any attack vector.

---

## Test Preconditions

### Test Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Member A (Attacker)** | ezraharshi@gmail.com | A4!pN8$SxM2qE9 | User attempting unauthorized access |
| **Member B (Victim)** | [Create new test account] | [Set password] | Target of unauthorized access |

### Setup Steps
1. Create Member B test account (if not exists)
2. Both members complete medical questionnaire
3. Capture both member IDs and questionnaire IDs

---

## Test Scenarios

### Scenario 1: Direct URL Manipulation Attack

**Steps**:
1. Login as Member A (ezraharshi@gmail.com)
2. Click "Begin Medical Questionnaire" on dashboard
3. Observe URL: `/questionnaire?id={memberA_questionnaire_id}`
4. Capture Member A's questionnaire ID
5. Login as Member B in incognito window
6. Capture Member B's questionnaire ID from URL
7. In Member A's session, manually change URL to Member B's questionnaire ID
8. Press Enter to navigate

**Expected Result**:
- ✅ HTTP Status: **403 Forbidden** or **404 Not Found**
- ✅ User redirected to error page or own dashboard
- ✅ Error message: "You do not have permission to access this resource"
- ✅ Security event logged in audit trail

**Actual Result**: 

**Status**: [ ] Pass  [ ] Fail  [ ] Not Tested

---

### Scenario 2: API Authorization Bypass

**Steps**:
1. Login as Member A
2. Open Browser DevTools (F12) → Network tab
3. Navigate to Member A's questionnaire
4. Find API call: `GET /api/questionnaire/{questionnaire_id}`
5. Copy Authorization header/token from request
6. Use Postman or cURL to call API with Member B's ID but Member A's token:

curl -X GET 'https://myezra-staging.ezra.com/api/questionnaire/{memberB_id}' \
  -H 'Authorization: Bearer {memberA_token}' \
  -H 'Content-Type: application/json'

**Expected Result**:

✅ HTTP Status: 403 Forbidden

✅ Response:
{
  "error": "Access denied",
  "message": "You do not have permission to access this questionnaire"
}
**Actual Result**: 

**Status**: [ ] Pass  [ ] Fail  [ ] Not Tested

---

### Scenario 3: SQL Injection Attack
**Steps**:

1. Login as Member A
2. In URL or API request, inject SQL:
3. /questionnaire?id=123' OR '1'='1
4. /questionnaire?id=123 UNION SELECT * FROM questionnaires

**Expected Result**:

✅ HTTP Status: 400 Bad Request

✅ Input sanitization prevents SQL injection

✅ Parameterized queries used (not string concatenation)

Status: [ ] Pass [ ] Fail [ ] Not Tested