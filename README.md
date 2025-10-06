github repo : https://github.com/urah001/micro-station

# Micro-Station

This project is a simple e-commerce API built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.
It was developed as part of an assessment to demonstrate backend API creation, database interaction, and user management.
The frontend (built with React Native) and backend were developed separately due to time constraints.

---

## Technology Stack Used

- **React Native** – for building the mobile application interface
- **Node.js** – Used for building the backend server.
- **Express.js** – Used for setting up routes and handling requests.
- **Prisma ORM** – Used to connect and interact with the PostgreSQL database.
- **PostgreSQL** – The main database used for storing user and product information.
- **dotenv** – For managing environment variables securely.
- **Nodemon** – To automatically restart the server during development.

---

## Setup and Run Instructions

Follow the steps below to set up and run the backend project:

### Step 1: Clone the repository

```bash
git clone https://github.com/urah001/micro-station.git
cd micro-station
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up environment variables

Create a `.env` file in the project root and add the following details:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/micro_station"
PORT=5000
```

Replace `USER` and `PASSWORD` with your PostgreSQL details.

### Step 4: Initialize the database

Run the Prisma commands below:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 5: Start the server

```bash
node src/server.js
```

Once the server starts successfully, it will be available at:

```
http://localhost:5000
```

---

## API Endpoints

The backend exposes several API endpoints to handle authentication and product management.

### Authentication Routes

#### Register a new user

**POST** `/api/auth/register`

Example request:

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

Example response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

#### Login a user

**POST** `/api/auth/login`

Example request:

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "password123"}'
```

Example response:

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

### Product Routes

#### Get all products

**GET** `/api/products`

Example request:

```bash
curl http://localhost:5000/api/products
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 5000
  },
  {
    "id": 2,
    "name": "Smart Watch",
    "price": 8000
  }
]
```

---

#### Add a new product

**POST** `/api/products`

Example request:

```bash
curl -X POST http://localhost:5000/api/products \
-H "Content-Type: application/json" \
-d '{"name": "Laptop", "price": 150000}'
```

Example response:

```json
{
  "message": "Product created successfully",
  "product": {
    "id": 3,
    "name": "Laptop",
    "price": 150000
  }
}
```

---

## Known Limitations

- The frontend (React Native) and backend (Node.js) were not connected due to limited time.
- The project was completed within one week.
- An admin page was not created.
- Some advanced validation and authentication features were not fully implemented.

---

## Summary

The Micro-Station project demonstrates the use of Express.js with Prisma ORM for creating a backend API connected to a PostgreSQL database.
It supports basic user registration, login, and product management features, with room for future improvements such as admin controls, frontend integration, and authentication tokens.
