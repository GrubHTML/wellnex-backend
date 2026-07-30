# 💊 Wellnex eCommerce

> A modern, full-stack eCommerce platform dedicated to medicines and treatment-based online sales. Built using the robust **MERN (MySQL, Express, React, Node.js)** stack.

---

## 🛠️ Tech Stack

| Layer              | Technology                           |
| :----------------- | :----------------------------------- |
| **Frontend**       | React, React Router, Axios, Tailwind |
| **Backend**        | Node.js, Express                     |
| **Database**       | MySQL (Sequelize ORM)                |
| **Authentication** | JWT (JSON Web Tokens) / LocalStorage |

### Day1: Backend runs + DB connection

- Goal
  - Backend runs + DB connected

### Day2: User registration using sequelize model

- Goal
  - User registration works (sequelize model)

### Day3: User login + receive a jwt tokenand also protected routes worked

- Goal
  - User can login and recieve a token
  - Protected route works

### Day4: Auth cleanup (Error handling)

- Global Error middleware
- AppError (Later)
- AsyncHandler (Later)

- Goal
  - Stable auth system

### Day5: Products System (part-1)

- Goal
  - Product model
  - Add product
  - Get all products

### Day6: Full Product CRUD

- Goal
  - Get single product
  - Update product
  - Delete product
  - Test everything

### Day7: Category System

- Add Global sequelize error handler for unique constraint and validation
- Goal
  - Category exixts
  - Product links to category

### OffDay: Refresh token added

### Day14:

- Make product name unique

### Day16: Cart Integration

- Goal:
  - Store cart in database
  - Fetch cart from backend
  - Handle sync properly

- Flow
  - Cart database design
  - Create cart APIs
  - Auth protection
  - Add product validation
  - Frontend cart service
  - Sync strategy

### Day18: Order Backend

- Goal:
  - Real order system

- Flow
  - Understand the database design
  - Create orderModel
  - Create orderItemsModel
  - Setup associations
  - Create placeOrder controller
  - Create order
  - Create orderItems
  - Clear cart
  - Send response
  - Create routes
  - Test

### Day20: Order History

- Goal: User should be able to
  - View all their orders
  - Click an order
  - View order details

- Flow
  - Backend API (GET /orders)
  - Order details API
  - Frontend service (getOrders(), getOrdersById(id))
  - Testing
