# usful

npx prisma migrate dev --name init

to know where prisma is running : sudo ss -nltp | grep postgres

Perfect ✅ — since they asked for **SQLite or PostgreSQL**, let’s go with **PostgreSQL**, because:

- it’s more production-ready,
- it integrates well with **Node.js + Prisma**,
- and it’s easy to switch later if you use **Docker** or **Supabase**.

Below is a **complete Node.js backend** using **Express + Prisma + PostgreSQL + JWT**, matching your React Native frontend requirements:

---

## 🏗️ Project Setup

### 1. Create a new folder for your backend:

```bash
mkdir ecommerce-backend
cd ecommerce-backend
npm init -y
npm install express bcryptjs jsonwebtoken prisma @prisma/client cors dotenv
npx prisma init
```

---

### 2. Configure your PostgreSQL connection

Edit the `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
PORT=5000
```

Make sure PostgreSQL is running locally (or use Supabase).

---

### 3. Create your Prisma schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  isAdmin   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Float
  image       String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then run:

```bash
npx prisma migrate dev --name init
```

---

### 4. Create folder structure

```
ecommerce-backend/
│
├── prisma/
├── src/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   └── prismaClient.js
├── .env
└── package.json
```

---

### 5. Prisma client (src/prismaClient.js)

```js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;
```

---

### 6. Authentication middleware (src/middleware/authMiddleware.js)

```js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin)
    return res.status(403).json({ message: "Admin access only" });
  next();
};
```

---

### 7. Auth routes (src/routes/authRoutes.js)

```js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.json({ message: "Registration successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
});

export default router;
```

---

### 8. Product routes (src/routes/productRoutes.js)

```js
import express from "express";
import prisma from "../prismaClient.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - get all products
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Admin routes
router.post("/", authenticate, isAdmin, async (req, res) => {
  const { name, description, price, image } = req.body;
  const product = await prisma.product.create({
    data: { name, description, price: parseFloat(price), image },
  });
  res.json(product);
});

router.put("/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;

  const updated = await prisma.product.update({
    where: { id: parseInt(id) },
    data: { name, description, price: parseFloat(price), image },
  });

  res.json(updated);
});

router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Product deleted" });
});

export default router;
```

---

### 9. Main server file (src/server.js)

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("E-commerce API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### ✅ Testing API routes

Start the server:

```bash
node src/server.js
```

#### Register

POST → `http://localhost:5000/api/auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password"
}
```

#### Login

POST → `http://localhost:5000/api/auth/login`

#### Create Product (Admin)

POST → `http://localhost:5000/api/products`
Headers → `Authorization: Bearer <your_jwt_token>`

```json
{
  "name": "Cool T-shirt",
  "description": "Comfortable cotton shirt",
  "price": 19.99,
  "image": "https://example.com/image.jpg"
}
```

---

### ⚙️ Connect to your React Native Frontend

Use `fetch` or `axios` to call:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products` (admin only)

---

Would you like me to add **database seeding (demo data script)** and **backend tests (using Jest)** next?
That would fully meet the requirements your professor listed.

## turtorial

create a new db : CREATE DATABASE microStation;

create my own POSTGRES USER role :CREATE ROLE w3b WITH LOGIN SUPERUSER PASSWORD 'myp@$$word';

give all access to myself : GRANT ALL PRIVILEGES ON DATABASE ecommerce TO w3b;

to login : psql -U w3b -W
. Switching to postgres system user : `sudo -i -u postgres`. you should get this : postgres@kali:~$

. entering the sql shell `psql` . you should get this : postgres=#

# tutorial to connect to postgres in Linux dist

`remember do not use the vscode terminal , use you terminal`

- psql -U postgres -W
  enter password : myp@$$word
- postgres=# \l : list all db available
- postgres=# \c microStation enter password and you in
