# Syncaura Backend 🚀

Syncaura Backend is a mono-repository that hosts multiple independent backend services built using Node.js and Express.  
Each service handles a specific domain such as authentication, CRUD operations, leave management, and real-time communication.

The project follows a modular microservice-style architecture to ensure scalability, maintainability, and smooth team collaboration.

---

## 📁 Repository Structure
Syncaura-Backend/
│
├── auth-api/ # Authentication & Authorization service
│ ├── src/
│ ├── server.js
│ ├── package.json
│ └── README.md
│
├── CRUD-operations-/ # Generic CRUD APIs
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── server.js
│
├── leave_management/ # Employee Leave Management System
│ ├── config/
│ ├── controller/
│ ├── middleware/
│ ├── model/
│ ├── router/
│ └── server.js
│
├── realtime-chat-final/ # Real-time chat application using Socket.IO
│ ├── public/
│ └── server.js
│
├── .gitignore
└── README.md

text

---

## 🧩 Services Overview

### 🔐 Auth API
- User registration and login
- JWT-based authentication
- Secure password handling
- Modular and scalable architecture

### 🧾 CRUD Operations
- Generic Create, Read, Update, Delete APIs
- Clean MVC structure
- Reusable controllers and routes

### 🗓 Leave Management System
- Employee leave request and approval workflow
- Role-based access control
- Middleware-driven request handling
- Business logic separation

### 💬 Real-time Chat Service
- Built using Socket.IO
- Supports real-time messaging
- Handles multiple concurrent users
- Event-driven communication

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB / SQL (service-dependent)
- Socket.IO
- JWT Authentication
- RESTful APIs

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Uptoskillssyncaura/Syncaura-backend.git
cd Syncaura-backend
2️⃣ Install Dependencies (Per Service)
Each service is independent. Navigate to the required folder and install dependencies:

bash
cd auth-api
npm install
Repeat the same steps for other services.

3️⃣ Environment Variables
Create a .env file inside each service directory using .env.example as reference.

Example:

env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
⚠️ Never commit .env files to GitHub.

4️⃣ Run a Service
bash
npm start
or

bash
npm run dev
👥 Team Collaboration Rules
Single Git repository for all backend services

Each developer works only in their assigned folder

Do NOT run git init inside subfolders

Always pull latest changes before pushing

bash
git pull origin main
🚫 Ignored Files
The following files are excluded using .gitignore:

node_modules/

.env

logs

IDE configuration files

📌 Future Enhancements
Docker and Docker Compose support

CI/CD pipeline integration

API Gateway setup

Centralized logging and monitoring

Microservices deployment readiness

📄 License
This project is developed for educational and internal purposes.
License information can be added if required.

🤝 Contributors
Developed and maintained by the Syncaura Backend Team.

⭐ If you find this project useful, consider starring the repository!

🔐 Role-Based Access Control (RBAC)
Syncaura Backend implements Role-Based Access Control (RBAC) to ensure secure and controlled access to APIs across services such as Auth API and Leave Management System.

RBAC restricts system access based on assigned user roles and enforces permissions at the API level.

👥 Supported Roles
Admin – Full system access

Co-Admin – Limited administrative access

Member – Standard user access

Roles are stored in the user model and embedded inside the JWT token for authorization checks.

🧠 RBAC Architecture Overview
User logs in successfully

JWT token is generated with user role

Auth middleware validates JWT

Role middleware verifies permissions

API access is granted or denied

🛡 RBAC Middleware
Auth Middleware

Verifies JWT token

Attaches user data to request object

Role Middleware

Checks user role against allowed roles

Prevents unauthorized access

🔐 Role & Permission Matrix
API Endpoint	Admin	Co-Admin	Member
View Profile	✅	✅	✅
Manage Users	✅	✅	❌
Admin Dashboard	✅	❌	❌
🧪 Testing RBAC
RBAC can be tested using:

Postman

Browser-based index.html test UI

Automated API tests

JWT tokens are required in the Authorization header:

text
Authorization: Bearer <JWT_TOKEN>
🚀 RBAC Benefits
Improved security

Clear permission boundaries

Easy role expansion

Scalable for enterprise systems

Production-ready access control

RBAC is a core security feature of Syncaura Backend and plays a critical role in ensuring safe and structured API access across all services.
