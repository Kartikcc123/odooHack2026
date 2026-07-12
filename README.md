# AssetFlow (OdooHack2026)

Welcome to **AssetFlow**, an Enterprise Asset Management (EAM) system designed to track, manage, and allocate company assets, resources, and maintenance requests efficiently.

## 🚀 Tech Stack

This project is a full-stack web application built using modern web technologies:
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript & JavaScript
- **Database**: MongoDB (managed via [Prisma ORM](https://www.prisma.io/))
- **Authentication**: [Clerk](https://clerk.com/) (Role-based access control)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Lucide React

## ✨ Core Features

### 🏢 Organization & User Management
- Hierarchical department structuring.
- Role-based access control with primary roles: `ADMIN`, `ASSET_MANAGER`, `DEPARTMENT_HEAD`, and `EMPLOYEE`.

### 💻 Asset Inventory
- Lifecycle management of assets including categorisation, conditions (New, Good, Fair), and tracking statuses (Available, Allocated, Maintenance, Disposed).
- Support for Asset Tags, Serial Numbers, and QR Codes.
- Detailed audit trails (`AssetHistory` and `ActivityLog`).

### 🔄 Allocations & Transfers
- Assign assets (like laptops or chairs) to specific employees with expected return dates.
- Request/approval workflow for transferring assets between employees.

### 📅 Resource Bookings
- Booking system for shared organizational resources such as Meeting Rooms, Projectors, and Vehicles.

### 🛠️ Maintenance & Audits
- Employees can report maintenance issues, and technicians can resolve them with tracking.
- Dedicated Audit Cycles to periodically verify asset presence and condition.

## 🏗️ Project Architecture

The application follows a structured layered architecture:
- **Frontend (`src/app`)**: UI components and pages using the Next.js App Router.
- **API Layer (`src/app/api`)**: Backend endpoints handling RESTful HTTP requests.
- **Service Layer (`src/services`)**: Core business logic and validation rules.
- **Repository Layer (`src/repositories`)**: Abstracts database operations and Prisma queries.
- **Data Access API (`src/lib/api.ts`)**: The frontend's dedicated API client fetching data from the backend routes.

## 🛠️ Getting Started

First, ensure your environment variables are configured in `.env` (including MongoDB and Clerk keys). Then, install dependencies:

```bash
npm install
```

Generate the Prisma Client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 Development Notes
- The Next.js `middleware.js` convention has been updated to `proxy.ts`.
- In `development` mode, the `requireAuth` middleware automatically provides a mock admin session so you can bypass the login requirements to quickly test the application and view backend data.
