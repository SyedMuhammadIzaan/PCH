# Pakistan Cloth House - Python Flask Database & REST API

This folder provides a complete **Python Flask Database Backend** for Pakistan Cloth House using **SQLAlchemy** and connecting either to **Cloud SQL PostgreSQL** or local **SQLite**.

---

## 📁 Architecture Overview

- **`models.py`**: Relational SQLAlchemy models (`User`, `Category`, `Product`, `Order`, `Review`, `FAQ`) matching the exact schema of the database.
- **`database.py`**: Connection manager that dynamically reads Cloud SQL PostgreSQL environment variables (`SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`) with automatic fallback to SQLite.
- **`app.py`**: Flask REST API server implementing all endpoints:
  - Authentication (`/api/auth/google`, `/api/auth/login`, `/api/auth/register`, `/api/auth/me`)
  - Products & Collections (`/api/products`, `/api/products/<slug_or_id>`)
  - Categories (`/api/categories`, `/api/categories/<slug_or_id>`)
  - Orders & COD Checkout (`/api/orders`)
  - Reviews & Ratings (`/api/reviews`)
  - Admin KPI Statistics (`/api/admin/stats`)
- **`seed.py`**: Automated seeding script with Pakistani luxury lawn and pret catalog.

---

## 🚀 How to Run the Flask Database Backend

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment (Optional)
If connecting to Cloud SQL PostgreSQL:
```bash
export SQL_HOST="localhost"
export SQL_USER="ai_studio_user"
export SQL_PASSWORD="your_password"
export SQL_DB_NAME="ai_studio"
```
*If left unset, Flask automatically creates and runs against `pch_store.db` (SQLite).*

### 3. Seed the Database
```bash
python seed.py
```

### 4. Start the Flask Server
```bash
python app.py
```
The server will start on port `5000` (or `FLASK_PORT` env variable) ready to receive requests!

---

## 🔐 Authentication Flow

1. **Google Sign-In**: Send `{ "email": "user@gmail.com", "name": "User Name" }` to `POST /api/auth/google`.
2. **Email & Password**: Send `{ "email": "admin@pch.pk", "password": "..." }` to `POST /api/auth/login`.
3. **Session Token**: All authenticated requests pass `Authorization: Bearer <token>` in the header.
