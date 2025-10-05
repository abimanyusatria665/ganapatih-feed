# API Documentation

Base URL: `http://localhost:3001`

This document describes the REST API endpoints for the Newsfeed Application backend.

---

## 1. Authentication

### POST /auth/register
Registers a new user.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "12345"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "createdAt": "2025-10-05T10:00:00Z"
}
```

---

### POST /auth/login
Authenticates the user and returns a JWT access token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "12345"
}
```

**Response:**
```json
{
  "accessToken": "<jwt_token>"
}
```

---

## 2. Posts

### GET /post/timeline?page={page}
Fetches posts from followed users, paginated.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "content": "My first post",
      "createdAt": "2025-10-05T09:00:00Z",
      "user": { "id": 1, "username": "johndoe" }
    }
  ]
}
```

---

### POST /post/create
Creates a new post.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "This is a new post"
}
```

**Response:**
```json
{
  "message": "Post created successfully",
  "data": { "id": 10, "content": "This is a new post" }
}
```

---

## 3. Follow System

### POST /users/follow/:targetId
Follow another user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "You are now following jane"
}
```

---

### POST /users/unfollow/:targetId
Unfollow a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Now you are unfollowing jane"
}
```

---

### GET /users/profile/:username
Get profile data for a user, including posts, followers, and following count.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 2,
  "username": "jane",
  "followers": 5,
  "following": 10,
  "isFollowing": true,
  "posts": [
    {
      "id": 3,
      "content": "My photo from yesterday",
      "createdAt": "2025-10-04T13:00:00Z"
    }
  ]
}
```

---

## 4. Error Responses

All endpoints return proper HTTP status codes:

| Code | Description |
|------|--------------|
| 400  | Bad Request (invalid input) |
| 401  | Unauthorized (missing or invalid token) |
| 404  | Not Found (resource not found) |
| 409  | Conflict (duplicate data) |
| 500  | Internal Server Error |

---

## 5. Notes

- All authenticated routes require a valid JWT token in the `Authorization` header.  
- Tokens expire based on the configuration in `JwtConfig.user_expired`.  
- Database uses PostgreSQL with Prisma ORM for migrations and queries.
