# Tested Scenarios

This document describes the test cases that have been manually tested for the **Newsfeed App** (both backend and frontend).

---

## TC-1: Registration & Login

### Positive Case
- **Input:** Register with a unique username and valid password.
- **Expected Result:** Returns `201 Created`, user saved to database, and login works successfully.

### Negative Case
- **Input:** Register with an existing username.
- **Expected Result:** Returns `409 Conflict` with message `Username already exists`.

---

## TC-2: Create Post

### Positive Case
- **Input:** Submit a post with content ≤ 200 characters.
- **Expected Result:** Returns `201 Created`, post appears in user’s feed.

### Negative Case
- **Input:** Submit a post with content > 200 characters.
- **Expected Result:** Returns `422 Unprocessable Entity` with message `Content too long`.

---

## TC-3: Follow / Unfollow

### Positive Case
- **Input:** Follow a valid user.
- **Expected Result:** Returns `200 OK`, new follow relationship created in database.

### Negative Case
- **Input:** Follow a non-existent user.
- **Expected Result:** Returns `404 Not Found`.

---

## TC-4: Feed

### Positive Case
- **Input:** View feed while following users with posts.
- **Expected Result:** Feed displays posts from followed users, sorted by newest first.

### Negative Case
- **Input:** View feed without following anyone.
- **Expected Result:** Returns an empty array or message `No posts found`.

---

## Notes
All test cases were manually verified using **Postman** for API testing and **browser testing** for frontend validation.
