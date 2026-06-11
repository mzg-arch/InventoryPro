# InventoryPro

InventoryPro is a full-stack inventory management web application built for small businesses to manage products, suppliers, stock levels, and inventory value.

The system includes authentication, user-specific data, product management, supplier management, dashboard analytics, search, filtering, and low-stock tracking.

## Features

- User registration and login
- JWT-based authentication
- Protected dashboard routes
- User-specific products and suppliers
- Product CRUD operations
- Supplier CRUD operations
- Product search by name, SKU, and category
- Product stock filtering
- Supplier search by name, email, phone, and address
- Dashboard analytics
- Low-stock product tracking
- Total inventory value calculation
- Responsive admin-style interface
- Logout functionality

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- ShadCN UI
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Supabase
- JWT
- bcryptjs

## Project Structure

inventorypro/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.ts
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── products/
│   │   ├── register/
│   │   └── suppliers/
│   ├── components/
│   ├── lib/
│   └── package.json
│
└── README.md

## Main Pages

- Register page
- Login page
- Dashboard page
- Products page
- Create product page
- Edit product page
- Suppliers page
- Create supplier page
- Edit supplier page

## API Routes

### Auth

POST /api/auth/register
POST /api/auth/login

### Dashboard

GET /api/dashboard/stats

### Products

GET /api/products
POST /api/products
GET /api/products/:id
PATCH /api/products/:id
DELETE /api/products/:id

### Suppliers

GET /api/suppliers
POST /api/suppliers
GET /api/suppliers/:id
PATCH /api/suppliers/:id
DELETE /api/suppliers/:id

## Environment Variables

Create a `.env` file inside the `backend` folder.

DATABASE_URL="your_supabase_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
PORT=5000

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/mzg-arch/InventoryPro.git
cd InventoryPro

### 2. Run the backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The backend runs on:


http://localhost:5000

### 3. Run the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:


http://localhost:3000


## Database Models

The main database models are:

- User
- Product
- Supplier

Each user has their own products and suppliers, so inventory data is separated between accounts.

## Screenshots

Screenshots will be added soon.

## Future Improvements

- Product image upload
- Export inventory to CSV
- Supplier-product assignment from the frontend
- Role-based admin permissions
- Pagination
- Deployment to Vercel and Render

## Author

Built by Micahel Biru.
