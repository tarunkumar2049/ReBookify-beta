# ReBookify — Book Exchange Platform for Students

**Buy. Sell. Exchange. Reuse.**
*Find the books you need. Give your old books a new home.*

3-tier MERN marketplace: `React (presentation)` → `Node + Express API (application)` → `MongoDB (data)`.

## Quick start

### 1. Database
Install & start MongoDB locally, or use Atlas and set `MONGO_URI` in `.env`.

### 2. Backend
```bash
cd server
npm install
npm run seed   # creates categories, demo user, admin, sample books
npm run dev    # API on http://localhost:5000
```
Seed accounts:
- Admin: `admin@rebookify.com / admin123`
- Student: `demo@student.com / demo1234`

### 3. Frontend
```bash
cd client
npm install
npm run dev    # app on http://localhost:5173
```
Set `VITE_API_URL=http://localhost:5000/api` in `client/.env` for production, or rely on the Vite `/api` proxy in dev.

## API routes

```
POST /api/auth/register   POST /api/auth/login   GET /api/auth/me
GET  /api/books  GET /api/books/:id  POST /api/books  PUT /api/books/:id  DELETE /api/books/:id
GET  /api/categories  POST /api/categories  PUT /api/categories/:id  DELETE /api/categories/:id
POST /api/requests  GET /api/requests?type=sent|received  PUT /api/requests/:id
GET  /api/transactions
GET  /api/admin/stats  GET /api/admin/users  DELETE /api/admin/users/:id
GET  /api/admin/books  DELETE /api/admin/books/:id
GET  /api/admin/requests  GET /api/admin/transactions
```

## Security
JWT + bcrypt, helmet, rate-limiting on `/api/auth`, mongo-sanitize, input validation (express-validator), RBAC (user/admin), token expiry, `.env` secrets, no passwords sent to client.

## User journeys
Buyer: Homepage → Search/Browse → Details → Login → Send Request → Status → Accepted → Completed.
Seller: Register → Dashboard → List a Book → Receive Request → Accept/Reject → Complete.

## Limitations (v1)
No payment gateway, delivery, AI recommendations, realtime chat, i18n, KYC, or advanced analytics — see **Future Scope** page in the app.
