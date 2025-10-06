# Micro-Station Backend (E-Commerce API)

This is an APP and API built with **Node.js**, **Express**, and **Prisma ORM** that connects to a **PostgreSQL** database **REACT NATIVE**.
It supposed to handles **user authentication** and **product management** features.
but the time given was to small to complete the project 100%.

--

## 1. Setup and Run Instructions

### Prerequisites

Before running the project, user/tester should make sure to have installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [PostgreSQL](https://www.postgresql.org/download/) database
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) package manager

---

### Steps to Run

1. **Clone the project**

   ```bash
   git clone https://github.com/urah001/micro-station.git
   cd micro-station/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   or

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root of your backend folder and add:

   ```env
   DATABASE_URL="postgresql://postgres:yourPassword@localhost:5432/microstation"
   PORT=5000
   ```

4. **Start your PostgreSQL server**

   ```bash
   sudo service postgresql start
   ```

5. **Run Prisma migrations and generate client**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

6. **Start the server**

   ```bash
   npm run dev
   ```

   or

   ```bash
   node src/server.js
   ```

7. Once running, open your browser or Postman and go to:

   ```
   http://localhost:5000
   ```

---

## 🔗 2. API Endpoints and Example Requests

### Auth Routes (`/api/auth`)

#### 1️ Register User

**POST** `/api/auth/register`

**Request Example (JSON):**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Response Example:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "john@example.com"
  }
}
```

---

#### 2️Login User

**POST** `/api/auth/login`

**Request Example (JSON):**

```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Response Example:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Product Routes (`/api/products`)

#### 3️ Get All Products

**GET** `/api/products`

**Response Example:**

```json
[
  {
    "id": 1,
    "name": "iPhone 15",
    "price": 999.99,
    "description": "Latest Apple smartphone",
    "category": "Electronics"
  }
]
```

---

#### 4️ Add a New Product

**POST** `/api/products`

**Request Example (JSON):**

```json
{
  "name": "Samsung TV",
  "price": 450,
  "description": "42 inch Smart TV",
  "category": "Electronics"
}
```

**Response Example:**

```json
{
  "message": "Product added successfully",
  "product": {
    "id": 2,
    "name": "Samsung TV",
    "price": 450
  }
}
```

---

#### 5️ Get a Single Product

**GET** `/api/products/:id`

Example:

```
GET /api/products/2
```

**Response Example:**

```json
{
  "id": 2,
  "name": "Samsung TV",
  "price": 450,
  "description": "42 inch Smart TV",
  "category": "Electronics"
}
```

---

## 3. Tech Stack

| Technology       | Purpose                                       |
| ---------------- | --------------------------------------------- |
| **Node.js**      | JavaScript runtime environment for the server |
| **Express.js**   | Framework for building RESTful APIs           |
| **PostgreSQL**   | Database for storing user and product data    |
| **Prisma ORM**   | Database modeling and query tool              |
| **dotenv**       | Loads environment variables from `.env` file  |
| **CORS**         | Enables secure cross-origin requests          |
| **REACT NATIVE** | for the frontend and visual part              |

---

## 4. Known Limitations

- The project currently uses **basic authentication** (JWT can be added later for better security).
- the project was not connected to the frontend UI so you would have to run the frontend and backend individually to see them

---

## 5. Testing

- To view your database visually, run:

  ```bash
  npx prisma studio
  ```

  It will open Prisma Studio in your browser to manage your tables.

- You can use Postman to test all the routes listed above.

---
