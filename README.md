# 🏥 My Health Vault

A comprehensive healthcare management system that enables secure storage and management of medical records, prescriptions, and test results. Built with modern technologies to ensure HIPAA compliance and data security.

![Landing Page](./screenshots/landing.png)

## ✨ Features

### For Patients
- 📋 **View Medical Records** - Access complete medical history
- 💊 **Track Prescriptions** - Monitor active and past prescriptions
- 🧪 **Test Results** - View and download lab test results
- 🔒 **Secure Access** - Bank-level encryption for all data
- 📱 **Responsive Design** - Works on all devices

### For Healthcare Workers (Doctors & Nurses)
- 🔍 **Patient Search** - Quick search across all patients
- 📝 **Create Records** - Add medical records, prescriptions, and test results
- 👥 **Patient Management** - Comprehensive view of patient data
- 📊 **Medical History** - Access complete patient medical timeline

### For Administrators
- ✅ **User Approval** - Review and approve healthcare worker applications
- 👤 **User Management** - Activate/deactivate user accounts
- 📈 **System Overview** - Monitor system statistics and usage
- 🔐 **Access Control** - Manage roles and permissions

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **State Management:** React Query (TanStack Query)
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Security:** Helmet, CORS, bcrypt
- **File Upload:** Multer

## 📸 Screenshots

### Patient Dashboard
![Patient Dashboard](./screenshots/patient-dashboard.png)

### Healthcare Worker Dashboard
![Healthcare Dashboard](./screenshots/healthcare-dashboard.png)

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/aynerd2/MyhealthVault.git
   cd health-vault
```

2. **Setup Backend**
```bash
   cd backend
   npm install
   cp .env.example .env
```
   
   Edit `.env` and add your configuration:
```env
   MONGODB_URI=mongodb://localhost:27017/healthvault
   JWT_SECRET=your-secret-key-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
```

3. **Setup Frontend**
```bash
   cd ../frontend
   npm install
   cp .env.local.example .env.local
```
   
   Edit `.env.local`:
```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. **Seed Database (Optional)**
```bash
   cd ../backend
   node src/seed.js
```

5. **Start Development Servers**
   
   Terminal 1 (Backend):
```bash
   cd backend
   npm run dev
```
   
   Terminal 2 (Frontend):
```bash
   cd frontend
   npm run dev
```

6. **Open Application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Test Accounts

After seeding the database, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@healthvault.com | password123 |
| Doctor | dr.smith@healthvault.com | password123 |
| Nurse | nurse.williams@healthvault.com | password123 |
| Patient | john.doe@example.com | password123 |

## 📁 Project Structure
```
health-vault/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   ├── seed.js           # Database seeder
│   │   └── server.js         # Express app entry
│   ├── .env.example          # Environment template
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── admin/            # Admin dashboard
│   │   ├── healthcare/       # Healthcare worker dashboard
│   │   ├── patient/          # Patient dashboard
│   │   ├── login/            # Login page
│   │   ├── providers/        # React context providers
│   │   └── layout.tsx        # Root layout
│   ├── components/           # Reusable components
│   ├── lib/                  # Utilities and API client
│   ├── .env.local.example    # Environment template
│   ├── package.json
│   └── README.md
│
├── screenshots/              # Application screenshots
├── .gitignore
└── README.md
```

## 🔐 Security Features

- **Password Hashing** - bcrypt with 10 salt rounds
- **JWT Authentication** - Access and refresh token system
- **Role-Based Access Control** - Patient, Doctor, Nurse, Admin roles
- **CORS Protection** - Configured for specific origins
- **Rate Limiting** - Prevents brute force attacks
- **Input Validation** - Express Validator for all inputs
- **Helmet Security Headers** - Additional HTTP security

## 🌐 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
POST   /api/auth/refresh       - Refresh access token
GET    /api/auth/me            - Get current user
POST   /api/auth/logout        - Logout user
POST   /api/auth/forgot-password    - Request password reset
POST   /api/auth/reset-password/:token - Reset password
POST   /api/auth/change-password     - Change password
```

### Patient Endpoints
```
GET    /api/medical-records/patient/:id    - Get patient records
GET    /api/prescriptions/patient/:id      - Get patient prescriptions
GET    /api/test-results/patient/:id       - Get patient test results
```

### Healthcare Worker Endpoints
```
GET    /api/patients/search?q=query        - Search patients
POST   /api/medical-records                - Create medical record
POST   /api/prescriptions                  - Create prescription
POST   /api/test-results                   - Create test result
POST   /api/test-results/upload            - Upload test file
```

### Admin Endpoints
```
GET    /api/admin/pending-approvals        - Get pending user approvals
POST   /api/admin/approve/:userId          - Approve user
POST   /api/admin/reject/:userId           - Reject user
GET    /api/admin/users                    - Get all users
PUT    /api/admin/users/:userId/status     - Update user status
```

## 🧑‍💻 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
node src/seed.js     # Seed database
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy!

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

**Backend:**
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=strong-production-secret
JWT_REFRESH_SECRET=strong-refresh-secret
FRONTEND_URL=https://your-frontend-url.com OR http://localhost:3000
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api OR http://localhost:8000/api
```

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/aynerd2/MyhealthVault.git](https://github.com/aynerd2/MyhealthVault.git)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the robust database
- Tailwind CSS for the utility-first styling
- Framer Motion for smooth animations

---

Made with ❤️ by Ayobami Ogunlade ($aynerd)