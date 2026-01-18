# Syncaura Backend API

Node.js + Express + MongoDB backend with JWT auth, role-based access, and file attachments.

## Quick Start

### 1. Install & Setup
```bash
npm install
mkdir -p public/uploads
npm run dev
```

### 2. Start
```bash
npm start
```
Server runs on `http://localhost:5000`

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/change-password` - Change password (auth required)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Notices (Admin/Co-admin only except GET)
- `GET /api/notices` - Get all notices
- `GET /api/notices/{id}` - Get single notice
- `POST /api/notices` - Create notice with attachments (form-data)
- `PUT /api/notices/{id}` - Update notice with new files (form-data)
- `DELETE /api/notices/{id}` - Delete notice & all attachments

### Attachments
- `GET /api/notices/{id}/attachments/{fileName}/view` - View inline
- `GET /api/notices/{id}/attachments/{fileName}/download` - Download file
- `DELETE /api/notices/{id}/attachments/{fileName}` - Delete attachment

---

## Usage

### Authentication
Get token: Login → Use `accessToken` in `Authorization: Bearer <TOKEN>` header

### Create Notice with Files
```
POST /api/notices
Headers: Authorization: Bearer <TOKEN>
Body (form-data):
  title, description, createdBy, attachments (file)
```

### File Upload
- **Max**: 5 files, 10MB each
- **Types**: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF, WEBP
- **Location**: `public/uploads/`

---

## Key Features

- ✅ JWT Authentication (15m access, 7d refresh)
- ✅ Role-based Authorization (admin, co-admin, user)
- ✅ File upload with multer (5 files, 10MB limit)
- ✅ Notice CRUD operations
- ✅ File view/download/delete
- ✅ Input validation

---

## Response Format

All responses:
```json
{
  "success": true/false,
  "data": {},
  "message": "optional"
}


## Project Structure

```
src/
├── app.js
├── server.js
├── config/ (db, roles, socket)
├── controllers/ (auth, notice, etc)
├── middlewares/ (auth, role, upload, errorHandler)
├── models/ (User, Notice, etc)
├── routes/ (authRoutes, notice.routes, etc)
├── utils/ (email, generateTokens, otp)
└── validators/ (authValidators)
