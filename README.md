# 💸 Digital Wallet Backend API

A secure, modular, and role-based backend API system for a digital wallet (similar to **Bkash** or **Nagad**), built using **Node.js**, **Express**, **TypeScript**, and **MongoDB**. This system enables users, agents, and admins to perform financial operations with robust authentication, wallet handling, and transaction tracking.

---

## 🚀 Project Overview

The Digital Wallet API simulates a mobile wallet service that allows:
- Users to manage their own wallets and perform transactions
- Agents to assist users via cash-in/cash-out
- Admins to manage users, wallets, and oversee all operations

It follows best practices in modular backend architecture, authentication, and validation with complete CRUD and transactional support.

---

## ✨ Features

### ✅ Authentication & Authorization
- JWT-based login system
- Role-based access control: `admin`, `user`, and `agent`
- Secure password hashing using **bcrypt**

### 👤 User & Agent Functionalities
- Register (User/Agent)
- Wallet automatically created with ৳50 balance
- Add money (top-up), withdraw, send money
- View personal transaction history
- Agent cash-in/cash-out support

### 🛠 Admin Functionalities
- View all users, agents, wallets, and transactions
- Block/unblock wallets
- Approve or suspend agents
- Create new admin accounts

### 🔁 Transaction Logging
- All transactions are stored with metadata
- Atomic operations to ensure wallet consistency

---

## 🛠 Tech Stack

| Technology | Description           |
|------------|-----------------------|
| Node.js    | Server runtime        |
| Express.js | Web framework         |
| TypeScript | Typed JavaScript      |
| MongoDB    | Database              |
| Mongoose   | ODM for MongoDB       |
| JWT        | Authentication        |
| bcrypt     | Password hashing      |
| Zod        | Input validation      |
| Postman    | API testing           |

---

## 📦 API Endpoints

> 🔐 All protected routes require a valid JWT token in the `Authorization` header.

---

### 🔐 Auth Routes

| Method | Endpoint             | Description                        | Access       |
|--------|----------------------|------------------------------------|--------------|
| `POST` | `/auth/login`    | Login with credentials             | Public       |
| `POST` | `/auth/logout`   | Logout current session             | Authenticated |

---

### 👤 User Routes

| Method | Endpoint                 | Description                            | Access               |
|--------|--------------------------|----------------------------------------|----------------------|
| `POST` | `/user/register`    | Register a new user or agent           | Public               |
| `POST` | `/user/create-admin`| Create a new admin                      | SUPER_ADMIN only     |
| `GET`  | `/user/me`          | Get logged-in user's profile           | All Roles            |
| `GET`  | `/user/all-users`   | Get all users and agents               | ADMIN, SUPER_ADMIN   |
| `GET`  | `/user/:id`         | Get single user by ID                  | ADMIN, SUPER_ADMIN   |
| `PATCH`| `/user/block/:id`   | Block a user account                   | ADMIN, SUPER_ADMIN   |
| `PATCH`| `/user/unblock/:id` | Unblock a user account                 | ADMIN, SUPER_ADMIN   |
| `PATCH`| `/user/approve/:id` | Approve an agent                       | ADMIN, SUPER_ADMIN   |
| `PATCH`| `/user/suspend/:id` | Suspend an agent                       | ADMIN, SUPER_ADMIN   |

---

### 🏦 Wallet Routes

| Method | Endpoint                     | Description                                 | Access               |
|--------|------------------------------|---------------------------------------------|----------------------|
| `GET`  | `/wallet`               | Get all wallets                             | ADMIN, SUPER_ADMIN   |
| `GET`  | `/wallet/my-wallet`     | Get own wallet info                         | USER, AGENT          |
| `GET`  | `/wallet/:id`           | Get wallet info by user ID                  | ADMIN, SUPER_ADMIN   |
| `POST` | `/wallet/send`          | Send money to another user                  | USER only            |
| `POST` | `/wallet/cash-in`       | Agent deposits money into user's wallet     | AGENT only           |
| `POST` | `/wallet/cash-out`      | User withdraws money from wallet            | USER only            |
| `PATCH`| `/wallet/block/:id`     | Block a wallet                              | ADMIN, SUPER_ADMIN   |
| `PATCH`| `/wallet/unblock/:id`   | Unblock a wallet                            | ADMIN, SUPER_ADMIN   |

---

### 💳 Transaction Routes

| Method | Endpoint                     | Description                                 | Access             |
|--------|------------------------------|---------------------------------------------|--------------------|
| `GET`  | `/transaction`          | Get all transaction records                 | ADMIN, SUPER_ADMIN |
| `GET`  | `/transaction/me`       | Get logged-in user's or agent's transactions| USER, AGENT        |

---

## 🧪 Testing Instructions

1. Import the provided **Postman collection** into Postman.
2. Set `{{base_url}}` to your API root (e.g., `https://digital-wallet-backend-plum.vercel.app`).
3. Use `/login` to retrieve your JWT token.
4. Attach the token to the `Authorization` header in subsequent requests.

---

## 📁 Folder Structure

src/
├── modules/
│ ├── auth/
│ ├── user/
│ ├── wallet/
│ └── transaction/
├── middlewares/
├── config/
├── utils/
├── app.ts


---

## 📽️ Demo Video (📎 Link)
[▶️ Watch Project Demo]--- https://www.youtube.com/watch?v=C9LHLOmUMjY

---

## 📄 Project Status

✅ Core features implemented  
✅ Role-based access with JWT  
✅ Modular folder structure  
✅ Zod validation and error handling  
✅ Postman-tested endpoints  










