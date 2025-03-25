# Chivito

Chivito is a service finder web app designed mainly for Puerto Rico, helping users connect with local service providers like plumbers, electricians, mechanics, and more. Users can search for services in their area, view provider listings with contact details, and leave reviews based on their experiences.

## 🚀 Tech Stack

### 🔧 Frontend

- **Framework:** Next.js (v15) using the **App Router**
- **Language:** TypeScript
- **Library:** React (v19)
- **Styling:** Tailwind CSS + PostCSS
- **Animation:** Framer Motion
- **Icons:** Lucide React

### 🔧 Backend

- **Framework:** Laravel (PHP)
- **Authentication:** Laravel Sanctum
- **Database:** MySQL / PostgreSQL

### 🔧 Tooling

- **Linting & Type Checking:** ESLint, TypeScript
- **Package Management:** npm
- **Deployment:** WIP

## 🛠 Getting Started

### Clone the repository

```bash
git clone https://github.com/yourusername/chivito.git
cd chivito
```

---

### 🔹 Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd chivito-frontend
npm install  # or yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

### 🔹 Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd chivito-backend
composer install
```

Set up the `.env` file:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Run database migrations:

```bash
php artisan migrate
```

Start the backend server:

```bash
php artisan serve
```

---

## 🔗 Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Laravel Documentation](https://laravel.com/docs)

---

## 🚀 Deployment

- WIP (Work in Progress)

---

## 📌 License

This project is licensed under the MIT License.
