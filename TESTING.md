# Testing Guide

## Overview
This document explains the manual testing performed on the Newsfeed Application.

## Test Cases

### 1. Authentication
- **Scenario:** User logs in with correct credentials  
  **Expected Result:** Redirected to `/timeline` and token stored in localStorage.
- **Scenario:** User logs in with wrong password  
  **Expected Result:** Error message “Login failed” shown above form.

### 2. Profile Page
- **Scenario:** User visits `/profile/:username`  
  **Expected Result:** User data, follower/following counts, and posts appear.
- **Scenario:** Visiting another user's profile  
  **Expected Result:** “Follow/Unfollow” button visible.

### 3. Protected Routes
- **Scenario:** User tries to open `/timeline` without token  
  **Expected Result:** Redirected to `/auth/login?error=unauthorized`.

### 4. Create Post
- **Scenario:** User creates a new post with valid text  
  **Expected Result:** Post appears at top of timeline.
- **Scenario:** User submits empty post  
  **Expected Result:** Error message shown.

