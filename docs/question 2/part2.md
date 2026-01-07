# Question 2 - Part 2: HTTP Request Implementation

## Overview
HTTP request specifications for implementing the security test case from Part 1. These requests test authorization controls to prevent unauthorized access to medical questionnaire data.

**Date**: January 6, 2026  
**Prepared by**: Harshitha Prithvi Raj  
**Test Environment**: https://myezra-staging.ezra.com/

---

## Test Setup: Authentication

### Request 1: Login as Member A (Attacker)

**Purpose**: Obtain authentication token for Member A to simulate an authenticated attacker.

POST /api/auth/login HTTP/1.1
Host: myezra-staging.ezra.com
Content-Type: application/json
Accept: application/json

{
  "email": "ezraharshi@gmail.com",
  "password": "A4!pN8$SxM2qE9"
}
Expected Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "memberId": "member_123",
  "email": "ezraharshi@gmail.com"
}

Save: memberA_token and memberA_id
---

### Request 2: Login as Member B (Victim)

**Purpose**: Obtain valid credentials for Member B, whose questionnaire data must be protected

POST /api/auth/login HTTP/1.1
Host: myezra-staging.ezra.com
Content-Type: application/json
Accept: application/json

{
  "email": "test.memberb@ezra.com",
  "password": "SecurePass123!"
}
Expected Response (200 OK):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "memberId": "member_456",
  "email": "test.memberb@ezra.com"
}
Save: memberB_token, memberB_id
---

### Request 3: Get Member B's Questionnaire ID

**Purpose**: Retrieve Member B's questionnaire ID using their valid token

GET /api/members/member_456/questionnaire HTTP/1.1
Host: myezra-staging.ezra.com
Authorization: Bearer {memberB_token}
Accept: application/json
Expected Response (200 OK):
{
  "questionnaireId": "questionnaire_789",
  "memberId": "member_456",
  "status": "completed"
}
Save: memberB_questionnaire_id
---

### Request 4: Member B Accesses Their Own Questionnaire

**Purpose**: Confirm that the rightful owner can access their questionnaire.

GET /api/questionnaire/questionnaire_789 HTTP/1.1
Host: myezra-staging.ezra.com
Authorization: Bearer {memberB_token}
Accept: application/json

Expected Response (200 OK):
{
  Full questionnaire data is returned.
}
Test Status: [ ] Pass [ ] Fail
---

## Scenario 1: Unauthorized Access (Primary Security Test)

### Request 5: Member A Attempts to Access Member B's Questionnaire

**Purpose**:Verify that an authenticated user cannot access another member’s questionnaire.
GET /api/questionnaire/questionnaire_789 HTTP/1.1
Host: myezra-staging.ezra.com
Authorization: Bearer {memberA_token}
Accept: application/json
Expected Response (403 Forbidden) ✅:
{
  "error": "AUTHORIZATION_ERROR",
  "message": "You do not have permission to access this questionnaire",
  "statusCode": 403
}
Test Status: [ ] Pass [ ] Fail
---

## Scenario 2: Missing/Invalid Authentication

### Request 6: Access Without Authentication

**Purpose**: Verify authentication is required to access questionnaire data

GET /api/questionnaire/questionnaire_789 HTTP/1.1
Host: myezra-staging.ezra.com
Accept: application/json
Expected Response (401 Unauthorized) ✅:
{
  "error": "AUTHENTICATION_ERROR",
  "message": "Authentication token is required",
  "statusCode": 401
}
Test Status: [ ] Pass [ ] Fail
---

### Request 6: Invalid Token

**Purpose**:Purpose: Test token validation

GET /api/questionnaire/questionnaire_789 HTTP/1.1
Host: myezra-staging.ezra.com
Authorization: Bearer invalid_token_12345
Accept: application/json
Expected Response (401 Unauthorized) ✅:
{
  "error": "INVALID_TOKEN",
  "message": "Invalid or expired authentication token",
  "statusCode": 401
}
Test Status: [ ] Pass [ ] Fail
---

## Scenario 3: SQL Injection Protection

### Request 7: SQL Injection Attempt in Questionnaire ID

**Purpose**: Validate strict input validation on questionnaire identifiers.

GET /api/questionnaire/123' OR '1'='1 HTTP/1.1
Host: myezra-staging.ezra.com
Authorization: Bearer {memberA_token}
Accept: application/json
URL Encoded Version:
GET /api/questionnaire/123%27%20OR%20%271%27%3D%271 HTTP/1.1
Host: myezra-staging.ezra.com
Authorization: Bearer {memberA_token}
Accept: application/json
Expected Response (400 Bad Request) ✅:
{
  "error": "INVALID_INPUT",
  "message": "Invalid questionnaire ID format",
  "statusCode": 400
}
Test Status: [ ] Pass [ ] Fail