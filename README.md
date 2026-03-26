# Booka Room - Backend API 🏢

This repository contains the *source code* for the **Backend API** of the **Booka Room** application (Meeting Room Management System). This portfolio project is built using Node.js and Express.js to provide a fast and efficient RESTful API, and is designed to integrate seamlessly with a Vue.js-based *frontend* application.

This system supports *user* management, meeting room management, as well as booking and room *approval* workflows, complete with authentication and role-based authorization (Admin & User).

---

## 🚀 Technologies Used

* **Runtime:** Node.js
* **Framework:** Express.js (v5.2.1)
* **Database:** MySQL (with `mysql2` & *Connection Pool*)
* **Authentication:** JSON Web Token (JWT) & `bcryptjs` for *password* encryption
* **Other Utilities:** `cors`, `dotenv` (Environment Variables), `nodemailer` (Email Notifications)

---

## ⚙️ Prerequisites

Before running this application, make sure you have installed:

* [Node.js](https://nodejs.org/) (Version 18 or later is recommended)
* [MySQL Server](https://www.mysql.com/)

---

## 🛠️ Installation & Running the Application Locally

1. **Clone this repository:**

   ```bash
   git clone https://github.com/username-anda/booka-room-backend.git
   cd booka-room-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**

   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_database_password
   DB_NAME=bookaroom_database_name
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret
   ```

4. **Run the Development Server:**

   ```bash
   npm start
   ```

---

## 📌 Main API Endpoints

Below is a summary of the available REST API routes. Each route (except `/login` and root) requires a JWT Token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### 🔑 Authentication

* `POST /login` → Log in and obtain a JWT Token.

### 👥 Users Management

* `GET /users` → Retrieve all users (Admin)
* `GET /users/:id` → Retrieve details of a specific user (Admin, User)
* `POST /users` → Create a new user (Admin)
* `PUT /users/:id` → Update user data (Admin)
* `DELETE /users/:id` → Delete a user (Admin)

### 🚪 Rooms Management

* `GET /rooms` → Retrieve all available meeting rooms (All Authenticated Users)
* `GET /rooms/:id` → Retrieve details of a specific room (All Authenticated Users)
* `POST /rooms` → Create a new meeting room (Admin)
* `PUT /rooms/:id` → Update room data (Admin)
* `DELETE /rooms/:id` → Delete a meeting room (Admin)

### 📅 Bookings & Approval

* `GET /bookings` → Retrieve all booking records
* `GET /bookings/:id` → Retrieve details of a specific booking
* `GET /bookings/user/:id` → Retrieve booking history by User ID (Admin, User)
* `POST /bookings` → Create a new booking (Admin, User)
* `PUT /bookings/approval/:id` → Approve or reject a booking (Admin)
* `DELETE /bookings/:id` → Cancel/delete a booking (Admin)

---

## 📂 Project Structure

```text
booka-room-backend/
├── src/
│   ├── config/        # Database configuration (MySQL connection)
│   ├── controllers/   # Business logic / API controllers (Auth, User, Room, Booking)
│   ├── middlewares/   # Middleware (JWT validation & role authorization)
│   ├── routes/        # API endpoint definitions
│   ├── utils/         # Utility functions (e.g., SMTP email sender)
│   └── server.js      # Main entry point (Express app configuration)
├── .env.example       # Example environment file
├── .gitignore         # Git ignored files
├── package.json       # NPM dependencies and scripts
└── README.md          # Project documentation
```

## 📝 Database Schema
<img width="493" height="425" alt="booka-room" src="https://github.com/user-attachments/assets/2bc7d444-3ecc-41f6-99b3-0bbace9e5b81" />

