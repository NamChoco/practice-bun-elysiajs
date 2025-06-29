# 🦊 ElysiaJS Auth API with Bun + SQLite

A lightweight RESTful API built with [ElysiaJS](https://elysiajs.com/), [Bun](https://bun.sh/), and SQLite. It includes user registration, login with JWT, cookie-based authentication, and basic CRUD operations for members.

---

## 🚀 Features

- ✅ **User registration** with hashed passwords (`bcrypt`)
- ✅ **User login** with JWT token issued and stored in `httpOnly` signed cookie
- ✅ **Cookie-based authentication** using Elysia’s built-in `cookie` support
- ✅ **JWT verification** using `@elysiajs/jwt`
- ✅ **Member CRUD APIs** (Create, Read, Update, Delete)
- ✅ **Swagger documentation** powered by `@elysiajs/swagger`
- ✅ Fast and simple — runs on Bun with zero dependencies beyond plugins

---

## 🧱 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **Database**: SQLite (via `bun:sqlite`)
- **Auth**: JWT + Signed Cookies
- **Docs**: Swagger (OpenAPI)

---

## 📦 Install & Run

### 1. Clone the repo

```bash
git clone https://github.com/your-user/elysia-auth-api.git
cd elysia-auth-api
```

### 2. Install dependencies

```bash
bun install
```

### 3. Create `.env` file

```env
JWT_SECRET=your-super-secret-key
```

### 4. Run the server

```bash
bun run dev
```

Server will start at: `http://localhost:8080`

---

## 🧪 API Endpoints

### 🔐 Auth

| Method | Endpoint    | Description            |
|--------|-------------|------------------------|
| POST   | `/register` | Register a new user    |
| POST   | `/login`    | Login and get cookie   |

### 👤 Members

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | `/`              | Get all members      |
| GET    | `/member/:id`    | Get member by ID     |
| POST   | `/member`        | Create new member    |
| PUT    | `/member/:id`    | Update member        |
| DELETE | `/member/:id`    | Delete member        |

---

## 🔒 How Auth Works

- On login, server signs a JWT using the configured `JWT_SECRET`
- JWT is stored in a signed `httpOnly` cookie: `token`
- On subsequent requests, Elysia automatically verifies the cookie
- You can access JWT info via `await jwt.verify(cookie.token.value)`

---

## 📚 Folder Structure

```
src/
├── index.ts      # Main entry point (Elysia app)
├── model.ts      # DB access layer
.env              # Secret keys, environment variables
bunfig.toml       # Bun config
```

---

## 📘 API Docs

After running the server, open:

```
http://localhost:8080/swagger
```

To see the live Swagger UI.

---

## 🙏 Credits

- [ElysiaJS](https://elysiajs.com/)
- [Bun](https://bun.sh/)
- [JWT.io](https://jwt.io/)
- [SQLite](https://sqlite.org/)
