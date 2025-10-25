# Todo List Application

Aplikasi Todo List yang elegan dan modern dengan Next.js, TypeScript, Tailwind CSS, dan MySQL.

## Features

- ✨ UI yang elegan dan modern dengan Tailwind CSS
- 📝 CRUD operations (Create, Read, Update, Delete)
- ✅ Mark todos sebagai completed/uncompleted
- 🔍 Filter todos (All, Active, Completed)
- 📊 Statistics dashboard
- 🎨 Responsive design
- ⚡ Real-time updates

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MySQL
- **ORM**: Prisma
- **API**: Next.js API Routes

## Prerequisites

- Node.js 18+ dan npm
- MySQL Server (lokal atau remote)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install mysql2 @prisma/client
npm install -D prisma
```

### 2. Setup MySQL Database

Buat database baru di MySQL:

```sql
CREATE DATABASE todolist_db;
```

### 3. Configure Environment Variables

Salin file `.env.example` menjadi `.env`:

```bash
copy .env.example .env
```

Edit file `.env` dan sesuaikan dengan kredensial MySQL Anda:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/todolist_db"
```

Contoh:
```env
DATABASE_URL="mysql://root:password123@localhost:3306/todolist_db"
```

### 4. Initialize Prisma dan Migrate Database

```bash
npx prisma generate
npx prisma db push
```

Perintah `prisma db push` akan membuat tabel `todos` di database MySQL Anda.

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Database Schema

Struktur tabel `todos`:

```prisma
model Todo {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(255)
  description String?  @db.Text
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### Get All Todos
```
GET /api/todos
```

### Create Todo
```
POST /api/todos
Body: { "title": "string", "description": "string" }
```

### Update Todo
```
PUT /api/todos/[id]
Body: { "title": "string", "description": "string", "completed": boolean }
```

### Delete Todo
```
DELETE /api/todos/[id]
```

## Prisma Studio (Optional)

Untuk melihat dan mengelola data di database secara visual:

```bash
npx prisma studio
```

Prisma Studio akan terbuka di [http://localhost:5555](http://localhost:5555).

## Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### Error: Can't connect to MySQL server

- Pastikan MySQL server sudah running
- Cek kredensial di file `.env` sudah benar
- Pastikan database `todolist_db` sudah dibuat

### Error: Prisma Client tidak ditemukan

Jalankan:
```bash
npx prisma generate
```

### Error: Table doesn't exist

Jalankan:
```bash
npx prisma db push
```

## License

MIT

