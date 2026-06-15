# Notes API

A production-ready REST API built with Node.js, Express.js, MongoDB, and JWT authentication.

This project includes authentication, authorization, notes CRUD, comments, file uploads, profile picture management, analytics, validation, centralized error handling, security hardening, testing, pagination, health checks, and graceful shutdown.

---

## Features

* User registration and login
* JWT authentication
* Role-based authorization
* Notes CRUD
* Comments on notes
* Profile picture upload and delete
* Note attachment upload and delete
* Cloudinary file storage
* Image compression using Sharp
* Request validation using Joi
* Centralized error handling
* Custom `AppError` class
* Consistent API responses
* Better HTTP status codes
* Rate limiting for login and registration
* Security headers using Helmet
* Restricted CORS configuration
* Request body size limits
* Secure authorization header validation
* Custom request sanitizer
* MongoDB indexes
* Pagination metadata
* Analytics endpoints
* Health check route
* Graceful shutdown
* Unit, middleware, route, service, and integration tests

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Joi
* Multer
* Sharp
* Cloudinary
* Helmet
* CORS
* Morgan
* Jest
* Supertest
* MongoDB Memory Server

---

## Project Structure

```text
notes-api/
│
├── config/
│   ├── db.js
│   ├── env.js
│   └── cloudinary.js
│
├── controllers/
│   ├── authController.js
│   ├── noteController.js
│   ├── commentController.js
│   ├── userController.js
│   ├── analyticsController.js
│   └── healthController.js
│
├── middleware/
│   ├── auth.js
│   ├── authorize.js
│   ├── asyncHandler.js
│   ├── errorHandler.js
│   ├── validate.js
│   ├── upload.js
│   ├── rateLimiter.js
│   ├── sanitizeRequest.js
│   └── requestLogger.js
│
├── models/
│   ├── User.js
│   ├── Note.js
│   └── Comment.js
│
├── routes/
│   ├── authRoutes.js
│   ├── noteRoutes.js
│   ├── commentRoutes.js
│   ├── userRoutes.js
│   ├── analyticsRoutes.js
│   └── healthRoutes.js
│
├── services/
│   ├── authService.js
│   ├── noteService.js
│   ├── commentService.js
│   ├── userService.js
│   ├── analyticsService.js
│   ├── uploadService.js
│   └── mediaService.js
│
├── tests/
│   ├── auth.integration.test.js
│   ├── note.integration.test.js
│   ├── authService.test.js
│   ├── noteService.test.js
│   ├── commentService.test.js
│   ├── authMiddleware.test.js
│   ├── errorHandler.test.js
│   └── ...
│
├── utils/
│   ├── AppError.js
│   └── apiResponse.js
│
├── validators/
│   ├── authValidator.js
│   └── noteValidator.js
│
├── app.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

---

## Installation

Clone the repository and install dependencies.

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

Use `.env.example` as a reference.

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your-mongodb-uri

JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

---

## Important Security Note

Do not commit your real `.env` file.

Only commit `.env.example`.

```text
.env              -> private, should not be committed
.env.example      -> public, safe to commit
```

---

## Run Development Server

```bash
npm run dev
```

Development server uses Nodemon.

---

## Run Production Server

```bash
node server.js
```

---

## Run Tests

Run all tests:

```bash
npm test
```

Run a specific test file:

```bash
npx jest tests/auth.integration.test.js --verbose
```

---

## Health Check

### Request

```http
GET /health
```

### Response

```json
{
  "success": true,
  "message": "Server is healthy",
  "uptime": 123.45,
  "timestamp": "2026-06-13T08:00:00.000Z",
  "environment": "development"
}
```

---

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Authentication

Protected routes require a JWT token in the Authorization header.

```http
Authorization: Bearer <token>
```

Invalid or missing tokens return:

```json
{
  "success": false,
  "message": "No token provided"
}
```

or:

```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

## API Routes

---

# Auth Routes

Base URL:

```text
/api/v1/auth
```

| Method | Endpoint    | Access  | Description               |
| ------ | ----------- | ------- | ------------------------- |
| POST   | `/register` | Public  | Register a new user       |
| POST   | `/login`    | Public  | Login user                |
| GET    | `/profile`  | Private | Get decoded token profile |

---

## Register User

```http
POST /api/v1/auth/register
```

### Body

```json
{
  "name": "Prem",
  "email": "prem@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "userId",
    "name": "Prem",
    "email": "prem@example.com"
  }
}
```

---

## Login User

```http
POST /api/v1/auth/login
```

### Body

```json
{
  "email": "prem@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token"
  }
}
```

---

# Notes Routes

Base URL:

```text
/api/v1/notes
```

| Method | Endpoint                             | Access  | Description             |
| ------ | ------------------------------------ | ------- | ----------------------- |
| GET    | `/`                                  | Private | Get notes               |
| POST   | `/`                                  | Private | Create note             |
| PUT    | `/:id`                               | Private | Update note             |
| DELETE | `/:id`                               | Private | Delete note             |
| GET    | `/:id/comments`                      | Private | Get note with comments  |
| POST   | `/:id/attachments`                    | Private | Upload note attachments |
| DELETE | `/:noteId/attachments/:attachmentId` | Private | Delete note attachment  |

---

## Get Notes

```http
GET /api/v1/notes
```

### Query Parameters

| Parameter | Description             | Default |
| --------- | ----------------------- | ------- |
| `page`    | Page number             | `1`     |
| `limit`   | Notes per page          | `10`    |
| `search`  | Search by title/content | Empty   |

### Example

```http
GET /api/v1/notes?page=1&limit=10&search=backend
```

### Success Response

```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "data": {
    "notes": [
      {
        "_id": "noteId",
        "title": "Learn Backend",
        "content": "Express and MongoDB",
        "completed": false
      }
    ],
    "pagination": {
      "totalNotes": 1,
      "currentPage": 1,
      "totalPages": 1,
      "limit": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

## Create Note

```http
POST /api/v1/notes
```

### Body

```json
{
  "title": "Learn Express",
  "content": "Practice REST API development",
  "completed": false
}
```

### Success Response

```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "_id": "noteId",
    "title": "Learn Express",
    "content": "Practice REST API development",
    "completed": false
  }
}
```

---

## Update Note

```http
PUT /api/v1/notes/:id
```

### Body

```json
{
  "title": "Updated Note",
  "content": "Updated content",
  "completed": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "_id": "noteId",
    "title": "Updated Note",
    "content": "Updated content",
    "completed": true
  }
}
```

---

## Delete Note

```http
DELETE /api/v1/notes/:id
```

### Success Response

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

## Upload Note Attachments

```http
POST /api/v1/notes/:id/attachments
```

### Form Data

| Field         | Type   | Description          |
| ------------- | ------ | -------------------- |
| `attachments` | File[] | Upload up to 5 files |

Allowed file types:

```text
JPG
PNG
WEBP
PDF
```

Maximum file size:

```text
5MB per file
```

### Success Response

```json
{
  "success": true,
  "message": "Attachment uploaded successfully",
  "data": {
    "_id": "noteId",
    "attachments": [
      {
        "url": "cloudinary-url",
        "publicId": "cloudinary-public-id",
        "fileName": "image.png",
        "fileType": "image/png",
        "size": 12345
      }
    ]
  }
}
```

---

## Delete Attachment

```http
DELETE /api/v1/notes/:noteId/attachments/:attachmentId
```

### Success Response

```json
{
  "success": true,
  "message": "Attachment deleted successfully",
  "data": {
    "_id": "noteId",
    "attachments": []
  }
}
```

---

# Comment Routes

Base URL:

```text
/api/v1/comments
```

| Method | Endpoint        | Access  | Description             |
| ------ | --------------- | ------- | ----------------------- |
| POST   | `/:noteId`      | Private | Create comment          |
| GET    | `/note/:noteId` | Private | Get comments for a note |

---

## Create Comment

```http
POST /api/v1/comments/:noteId
```

### Body

```json
{
  "text": "This is a comment"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "_id": "commentId",
    "text": "This is a comment",
    "note": "noteId",
    "user": "userId"
  }
}
```

---

## Get Comments By Note

```http
GET /api/v1/comments/note/:noteId
```

### Success Response

```json
{
  "success": true,
  "message": "Comments fetched successfully",
  "data": [
    {
      "_id": "commentId",
      "text": "This is a comment",
      "user": {
        "name": "Prem",
        "email": "prem@example.com"
      }
    }
  ]
}
```

---

# User Routes

Base URL:

```text
/api/v1/users
```

| Method | Endpoint           | Access  | Description            |
| ------ | ------------------ | ------- | ---------------------- |
| GET    | `/profile`         | Private | Get user profile       |
| POST   | `/profile-picture` | Private | Upload profile picture |
| DELETE | `/profile-picture` | Private | Delete profile picture |

---

## Get User Profile

```http
GET /api/v1/users/profile
```

### Success Response

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "userId",
    "name": "Prem",
    "email": "prem@example.com",
    "profilePicture": {
      "url": "cloudinary-url",
      "publicId": "cloudinary-public-id"
    }
  }
}
```

---

## Upload Profile Picture

```http
POST /api/v1/users/profile-picture
```

### Form Data

| Field            | Type |
| ---------------- | ---- |
| `profilePicture` | File |

### Success Response

```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "_id": "userId",
    "profilePicture": {
      "url": "cloudinary-url",
      "publicId": "cloudinary-public-id"
    }
  }
}
```

---

## Delete Profile Picture

```http
DELETE /api/v1/users/profile-picture
```

### Success Response

```json
{
  "success": true,
  "message": "Profile picture deleted successfully",
  "data": {
    "_id": "userId",
    "profilePicture": null
  }
}
```

---

# Analytics Routes

Base URL:

```text
/api/v1/analytics
```

These routes are intended for admin users.

| Method | Endpoint             | Access | Description                  |
| ------ | -------------------- | ------ | ---------------------------- |
| GET    | `/notes-per-user`    | Admin  | Get total notes per user     |
| GET    | `/comments-per-note` | Admin  | Get total comments per note  |
| GET    | `/most-active-user`  | Admin  | Get most active user         |
| GET    | `/monthly-notes`     | Admin  | Get notes created this month |

---

## Notes Per User

```http
GET /api/v1/analytics/notes-per-user
```

### Success Response

```json
{
  "success": true,
  "message": "Notes per user fetched successfully",
  "data": [
    {
      "userId": "userId",
      "name": "Prem",
      "email": "prem@example.com",
      "totalNotes": 10
    }
  ]
}
```

---

## Comments Per Note

```http
GET /api/v1/analytics/comments-per-note
```

### Success Response

```json
{
  "success": true,
  "message": "Comments per note fetched successfully",
  "data": [
    {
      "noteId": "noteId",
      "title": "Learn Express",
      "totalComments": 5
    }
  ]
}
```

---

## Most Active User

```http
GET /api/v1/analytics/most-active-user
```

### Success Response

```json
{
  "success": true,
  "message": "Most active user fetched successfully",
  "data": [
    {
      "userId": "userId",
      "name": "Prem",
      "email": "prem@example.com",
      "totalNotes": 10
    }
  ]
}
```

---

## Monthly Notes

```http
GET /api/v1/analytics/monthly-notes
```

### Success Response

```json
{
  "success": true,
  "message": "Monthly notes fetched successfully",
  "data": {
    "totalNotes": 5
  }
}
```

---

# HTTP Status Codes

| Status Code | Meaning                                       |
| ----------- | --------------------------------------------- |
| `200`       | Success                                       |
| `201`       | Resource created                              |
| `400`       | Bad request / validation error / invalid file |
| `401`       | Unauthenticated                               |
| `403`       | Forbidden / not authorized                    |
| `404`       | Resource not found                            |
| `409`       | Conflict / duplicate email                    |
| `429`       | Too many requests                             |
| `500`       | Internal server error                         |

---

# Error Examples

## Validation Error

```json
{
  "success": false,
  "message": "\"email\" must be a valid email"
}
```

## Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Unauthorized

```json
{
  "success": false,
  "message": "No token provided"
}
```

## Forbidden

```json
{
  "success": false,
  "message": "Not authorized"
}
```

## Not Found

```json
{
  "success": false,
  "message": "Note not found"
}
```

## Duplicate Email

```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

# Production Readiness Features

## Centralized Error Handling

The project uses a custom `AppError` class for operational errors.

```javascript
throw new AppError("Note not found", 404);
```

All errors are handled by centralized error middleware.

---

## Consistent API Responses

Success responses follow this structure:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

Error responses follow this structure:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Authentication Standard

Protected routes require a JWT token.

The token must be sent in the `Authorization` header using the Bearer format.

```http
Authorization: Bearer <token>
```

## Security Features

* Helmet security headers
* Disabled `x-powered-by`
* Restricted CORS
* Request body size limit
* URL encoded body size limit
* Strong Authorization header validation
* Rate limiting
* Joi validation
* Upload file type validation
* Upload file size limit
* Hidden unexpected 500 error details in production

---

## Database Performance

The Note model includes indexes for search and sorting.

```javascript
noteSchema.index({
  title: "text",
  content: "text",
});

noteSchema.index({
  user: 1,
  createdAt: -1,
});
```

---

## Graceful Shutdown

The server handles:

```text
SIGINT
SIGTERM
```

This allows the app to close the HTTP server and MongoDB connection cleanly.

---

## Testing

This project includes:

* Service unit tests
* Middleware tests
* Route tests
* Integration tests
* Auth integration tests
* Notes integration tests
* Upload middleware tests
* Error handler tests
* Security header tests
* Health route tests

Run tests:

```bash
npm test
```

---

# Common Commands

```bash
npm install
npm run dev
node server.js
npm test
```

---

# Production Checklist

Before deploying:

* [ ] `.env` configured
* [ ] `NODE_ENV=production`
* [ ] `MONGO_URI` configured
* [ ] Strong `JWT_SECRET` configured
* [ ] `CLIENT_URL` set to production frontend URL
* [ ] Cloudinary credentials configured
* [ ] `.env` ignored by Git
* [ ] Health route tested
* [ ] Tests passing
* [ ] CORS configured
* [ ] Rate limiting enabled
* [ ] Logs checked
* [ ] Graceful shutdown tested
* [ ] MongoDB indexes created

---

# License

This project is for learning and portfolio purposes.
