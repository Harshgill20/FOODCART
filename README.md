# FoodMap (MERN) - setup

## 1. Backend
cd backend
npm install
copy .env.example to .env  -> put YOUR MongoDB Atlas connection string in MONGO_URI and set JWT_SECRET to any long random text
npm run seed     (run once - fills the menu)
npm run dev      (server on http://localhost:5000)
Check: http://localhost:5000/api/health  and  http://localhost:5000/api/foods

## 2. Frontend (second terminal)
cd frontend
npm install
npm run dev      (opens on http://localhost:5173)

## API
POST /api/auth/register    { name, email, password }
POST /api/auth/login       { email, password }
GET  /api/auth/me          (needs token)
GET  /api/health
GET  /api/foods            (?search=pizza)
POST /api/foods
POST /api/orders (login required)           { customerName, phone, address, items:[{name,platform,price,qty}] }
GET  /api/orders  (login required, own orders only)

## MongoDB Atlas checklist
- Network Access: allow your IP (or 0.0.0.0/0 for testing)
- Database user password must match your .env
