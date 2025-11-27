



// DASHBOARD
// 'use client';

// import { useAuth } from '@/app/providers/AuthProvider';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { UserCircle, Stethoscope, Activity, Loader2, AlertCircle } from 'lucide-react';
// import {apiClient, RegisterData } from '@/lib/api';
// import { toast } from 'sonner';

// export default function DashboardRouter() {

//   const { user, isAuthenticated, loading: isLoading } = useAuth();
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [showRoleSelection, setShowRoleSelection] = useState(false);
//   const [registering, setRegistering] = useState(false);

//   // Setup API token



// useEffect(() => {
//   if (!isAuthenticated || isLoading) return;

//   const token = localStorage.getItem('accessToken');

//   if (!token) {
//     toast.error('Authentication required', {
//       description: 'Please log in again.',
//     });
//     router.replace('/login');
//     return;
//   }

//   apiClient.setAuthToken(token);
// }, [isAuthenticated, isLoading, router]);





//   // Fetch user profile
//  const { data: profile, isLoading: profileLoading, error, refetch } = useQuery({
//   queryKey: ['profile'],
//   queryFn: async () => {
//     const response = await apiClient.getProfile();
//     return response.data;
//   },
//   enabled: isAuthenticated && !isLoading,
//   retry: false,
// });

//   // Route based on role or show role selection
// useEffect(() => {
//   if (isLoading || profileLoading) return;

//   if (profile?.role) {
//     if (profile.role === 'pending_approval') {
//       toast.info('Account Pending Approval', {
//         description: 'Your healthcare worker application is being reviewed.',
//       });
//       router.replace('/pending-approval');
//       return;
//     }

//     if (profile.role === 'patient') {
//       router.replace('/patient');
//       return;
//     }

//     if (profile.role === 'admin') {
//       router.replace('/admin');
//       return;
//     }

//     if (['doctor', 'nurse'].includes(profile.role)) {
//       router.replace('/healthcare');
//       return;
//     }
//   }

//   // ✅ Only show role selection ONCE
//   if (!profile && error) {
//     setShowRoleSelection(true);
//   }
// }, [profile, error, isLoading, profileLoading, router]);





// useEffect(() => {
//   if (!user && !isLoading) {
//     toast.error('User not loaded', {
//       description: 'Please refresh the page and try again.',
//     });
//     setRegistering(false);
//   }
// }, [user, isLoading]);



//   const handleRoleSelection = async (role: 'patient' | 'doctor' | 'nurse') => {
//     console.log('🎯 Selected role:', role);
//     setRegistering(true);
    
//     try {
//       const registerData: RegisterData = {
//         email: user?.email || '',
//        firstName: user?.firstName || '',
//         lastName: user?.lastName || '',
//         role,
//       };

//       console.log('📤 Sending registration data:', registerData);

//       // Add role-specific fields
//       if (role === 'patient') {
//         registerData.dateOfBirth = '1990-01-01';
//         registerData.gender = 'Other';
//       } else {
//         registerData.licenseNumber = 'PENDING';
//         registerData.hospitalAffiliation = 'General Hospital';
//         if (role === 'doctor') {
//           registerData.specialization = 'General Practice';
//         }
//       }

//       const response = await apiClient.register(registerData);
//       console.log('✅ Registration response:', response.data);
      
//       // Check if pending approval
//       if (response.data.status === 'pending_approval') {
//         console.log('⏳ Healthcare worker pending approval');
//         toast.success('Application Submitted!', {
//           description: 'Your healthcare worker application is being reviewed. You will receive an email once approved.',
//           duration: 5000,
//         });
//         router.push('/pending-approval');
//         return;
//       }
      
//       console.log('✅ Registration successful, reloading...');
//       toast.success('Account Created!', {
//         description: 'Your account has been created successfully. Redirecting...',
//       });
      
//       // Refetch profile for normal flow
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
//     } catch (err: any) {
//       console.error('❌ Registration error:', err);
//       console.error('Error response:', err.response?.data);
//       console.error('Error status:', err.response?.status);
      
//       // ✅ HANDLE 409 - User already exists
//       if (err.response?.status === 409) {
//         console.log('⚠️ User already exists, fetching profile...');
//         toast.info('Account Already Exists', {
//           description: 'Loading your existing profile...',
//         });
        
//         // User already exists, just refetch their profile
//         try {
//           await queryClient.invalidateQueries({ queryKey: ['profile'] });
//           const result = await refetch();
          
//           if (result.data) {
//             console.log('✅ Profile fetched after 409:', result.data);
//             // Let the routing useEffect handle the redirect
//             setShowRoleSelection(false);
//             toast.success('Profile Loaded', {
//               description: 'Redirecting to your dashboard...',
//             });
//           } else {
//             toast.error('Profile Load Failed', {
//               description: 'Please try refreshing the page.',
//             });
//           }
//         } catch (refetchError) {
//           console.error('Failed to refetch profile:', refetchError);
//           toast.error('Profile Load Failed', {
//             description: 'Please try refreshing the page.',
//           });
//         }
        
//         setRegistering(false);
//         return;
//       }
      
//       // Handle other errors
//       const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed';
//       toast.error('Registration Failed', {
//         description: errorMsg,
//         duration: 5000,
//       });
//       setRegistering(false);
//     }
//   };

//   // Show loading while checking authentication or profile
//   if (isLoading || profileLoading) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="text-center"
//       >
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//           className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
//         />
//         <p className="text-gray-600 text-lg">Loading your dashboard...</p>
//       </motion.div>
//     </div>
//   );
// }


//   // Show role selection if user doesn't have a profile
//   if (showRoleSelection) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-4xl w-full"
//         >
//           <div className="text-center mb-12">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", duration: 0.5 }}
//               className="inline-block p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6"
//             >
//               <Activity className="w-12 h-12 text-white" />
//             </motion.div>
//             <h1 className="text-4xl font-bold mb-4">
//               Welcome to{' '}
//               <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Health Vault
//               </span>
//             </h1>
//             <p className="text-xl text-gray-600">
//               Please select your role to get started
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Patient Card */}
//             <motion.button
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               whileHover={{ y: -10, scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => handleRoleSelection('patient')}
//               disabled={registering}
//               className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-left overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
//               <div className="relative">
//                 <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4">
//                   <UserCircle className="w-8 h-8 text-white" />
//                 </div>
                
//                 <h3 className="text-2xl font-bold mb-2">I'm a Patient</h3>
//                 <p className="text-gray-600 mb-6">
//                   Access your medical records, prescriptions, and test results
//                 </p>

//                 <ul className="space-y-2 mb-6">
//                   {[
//                     'View medical history',
//                     'Track prescriptions',
//                     'Download test results',
//                     'Secure & private',
//                   ].map((feature, i) => (
//                     <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>

//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
//                     Continue as Patient →
//                   </span>
//                 </div>
//               </div>
//             </motion.button>

//             {/* Healthcare Provider Card */}
//             <motion.button
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               whileHover={{ y: -10, scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => handleRoleSelection('doctor')}
//               disabled={registering}
//               className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-left overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
//               <div className="relative">
//                 <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-4">
//                   <Stethoscope className="w-8 h-8 text-white" />
//                 </div>
                
//                 <h3 className="text-2xl font-bold mb-2">Healthcare Provider</h3>
//                 <p className="text-gray-600 mb-6">
//                   Manage patient records and provide better care
//                 </p>

//                 <ul className="space-y-2 mb-6">
//                   {[
//                     'Search & manage patients',
//                     'Create medical records',
//                     'Prescribe medications',
//                     'Upload test results',
//                   ].map((feature, i) => (
//                     <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>

//                 <div className="flex items-center justify-between">
//                   <span className="text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
//                     Continue as Provider →
//                   </span>
//                 </div>
//               </div>
//             </motion.button>
//           </div>

//           {registering && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//             >
//               <div className="bg-white rounded-2xl p-8 text-center">
//                 <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//                 <p className="text-lg font-semibold">Setting up your account...</p>
//                 <p className="text-sm text-gray-600 mt-2">This may take a few seconds</p>
//               </div>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     );
//   }

//   // Fallback loading state
//  if (isLoading || profileLoading) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//       <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
//     </div>
//   );
// }
// }































// I'm confused as to how this flow works, I navigated manually to healthcare after login in  using 
// auth0 social login and I got an interface for healthcare but only search and select a patient test interface. 
// Does that mean anyone can login and be both patient and healthcare because i'm able to redirect to any of it.





// // descriptions
// # 🔄 My Health Vault - Complete Software Flow

// ## 📊 Architecture Overview

// ```
// ┌─────────────────────────────────────────────────────────────┐
// │                         USER                                 │
// │                    (Browser/Mobile)                          │
// └────────────┬────────────────────────────────┬────────────────┘
//              │                                │
//              ▼                                ▼
//     ┌────────────────┐              ┌────────────────┐
//     │   PATIENT      │              │   HEALTHCARE   │
//     │   PORTAL       │              │   PROVIDER     │
//     └────────┬───────┘              └────────┬───────┘
//              │                                │
//              └────────────────┬───────────────┘
//                               │
//                     ┌─────────▼──────────┐
//                     │   NEXT.JS          │
//                     │   FRONTEND         │
//                     │   (Port 3000)      │
//                     └─────────┬──────────┘
//                               │
//                     ┌─────────▼──────────┐
//                     │   AUTH0            │
//                     │   Authentication   │
//                     └─────────┬──────────┘
//                               │
//                     ┌─────────▼──────────┐
//                     │   EXPRESS API      │
//                     │   BACKEND          │
//                     │   (Port 8000)      │
//                     └─────────┬──────────┘
//                               │
//             ┌─────────────────┼─────────────────┐
//             │                 │                 │
//     ┌───────▼────────┐ ┌─────▼──────┐  ┌──────▼────────┐
//     │   MONGODB      │ │   AWS S3   │  │  AUDIT LOGS   │
//     │   Database     │ │   Files    │  │  (MongoDB)    │
//     └────────────────┘ └────────────┘  └───────────────┘
// ```

// ---

// ## 🎭 Complete User Flow

// ### 1️⃣ **Landing Page (First Visit)**

// ```
// User visits http://localhost:3000
//         ↓
// ┌──────────────────────────────────────────────────┐
// │  LANDING PAGE (app/page.tsx)                    │
// │  - Beautiful hero section with animations        │
// │  - Features showcase                             │
// │  - Statistics display                            │
// │  - Two CTA buttons:                              │
// │    • "Get Started as Patient"                    │
// │    • "Healthcare Provider"                       │
// └──────────────────────────────────────────────────┘
//         ↓
// User clicks "Sign In" button
//         ↓
// Auth0 login page opens (popup/redirect)
//         ↓
// User enters email/password OR social login
//         ↓
// Auth0 validates credentials
//         ↓
// Auth0 redirects to /dashboard with token
// ```

// ### 2️⃣ **Role Selection (First Time Users)**

// ```
// User lands on /dashboard
//         ↓
// ┌──────────────────────────────────────────────────┐
// │  DASHBOARD ROUTER (app/dashboard/page.tsx)       │
// │                                                   │
// │  Frontend checks: Do we have user profile?       │
// │  - Makes API call: GET /api/users/me            │
// └──────────────────────────────────────────────────┘
//         ↓
//         ├─ Profile exists? ──► Route based on role
//         │                      - Patient → /patient
//         │                      - Doctor/Nurse → /healthcare
//         │
//         └─ No profile? ──► Show role selection
//                              ↓
// ┌──────────────────────────────────────────────────┐
// │  ROLE SELECTION SCREEN                           │
// │                                                   │
// │  Two beautiful cards:                            │
// │  ┌──────────────┐  ┌──────────────┐            │
// │  │  I'm a       │  │  Healthcare  │            │
// │  │  Patient     │  │  Provider    │            │
// │  └──────────────┘  └──────────────┘            │
// └──────────────────────────────────────────────────┘
//         ↓
// User selects role (clicks card)
//         ↓
// Frontend calls: POST /api/users/register
// {
//   email: "user@email.com",
//   firstName: "John",
//   lastName: "Doe",
//   role: "patient" or "doctor"
// }
//         ↓
// Backend creates user in MongoDB
//         ↓
// Page reloads → Routes to appropriate dashboard
// ```

// ### 3️⃣ **Patient Flow**

// ```
// Patient logs in
//         ↓
// Routed to /patient
//         ↓
// ┌──────────────────────────────────────────────────┐
// │  PATIENT DASHBOARD (app/patient/page.tsx)        │
// │                                                   │
// │  Header:                                         │
// │  - Profile avatar                                │
// │  - Notifications bell                            │
// │  - Logout button                                 │
// │                                                   │
// │  Navigation Tabs:                                │
// │  - Overview | Medical Records | Rx | Tests      │
// │                                                   │
// │  Overview Tab:                                   │
// │  ┌──────────────────────────────────────────┐   │
// │  │  Patient Info Card                       │   │
// │  │  - DOB, Gender, Blood Type, Phone        │   │
// │  └──────────────────────────────────────────┘   │
// │                                                   │
// │  ┌──────────────────────────────────────────┐   │
// │  │  Statistics Cards (4 cards)              │   │
// │  │  - Total Records                         │   │
// │  │  - Active Prescriptions                  │   │
// │  │  - Test Results                          │   │
// │  │  - Hospitals Visited                     │   │
// │  └──────────────────────────────────────────┘   │
// │                                                   │
// │  ┌──────────────────────────────────────────┐   │
// │  │  Recent Activity                         │   │
// │  │  - Last 5 medical records                │   │
// │  │  - Click to view details                 │   │
// │  └──────────────────────────────────────────┘   │
// └──────────────────────────────────────────────────┘
// ```

// **API Calls Made (Patient Dashboard):**
// ```
// 1. GET /api/users/me
//    → Gets patient profile

// 2. GET /api/patients/:patientId/medical-records
//    → Gets all medical records

// 3. GET /api/patients/:patientId/prescriptions
//    → Gets all prescriptions

// 4. GET /api/patients/:patientId/test-results
//    → Gets all test results
// ```

// **Data Flow Example:**
// ```javascript
// // Frontend (patient/page.tsx)
// const { data: profile } = useQuery({
//   queryKey: ['profile'],
//   queryFn: async () => {
//     const res = await apiClient.getProfile();
//     return res.data;
//   },
// });

// // Backend receives request
// // → Auth middleware verifies JWT token
// // → Routes to GET /api/users/me
// // → Finds user by Auth0 ID
// // → Returns user data
// // → Audit log created: "READ patient profile"

// // Frontend displays data
// ```

// ### 4️⃣ **Healthcare Worker Flow**

// ```
// Doctor/Nurse logs in
//         ↓
// Routed to /healthcare
//         ↓
// ┌──────────────────────────────────────────────────┐
// │  HEALTHCARE DASHBOARD (app/healthcare/page.tsx)  │
// │                                                   │
// │  LEFT PANEL: Patient Search                     │
// │  ┌────────────────────────────────────────────┐ │
// │  │  🔍 Search Input                           │ │
// │  │  "Search by name or email..."              │ │
// │  ├────────────────────────────────────────────┤ │
// │  │  Search Results:                           │ │
// │  │  ┌──────────────────────────────────────┐ │ │
// │  │  │  👤 John Doe                         │ │ │
// │  │  │     john@email.com                   │ │ │
// │  │  └──────────────────────────────────────┘ │ │
// │  │  ┌──────────────────────────────────────┐ │ │
// │  │  │  👤 Jane Smith                       │ │ │
// │  │  │     jane@email.com                   │ │ │
// │  │  └──────────────────────────────────────┘ │ │
// │  └────────────────────────────────────────────┘ │
// │                                                   │
// │  RIGHT PANEL: Patient Details                   │
// │  (Shows when patient selected)                   │
// │  ┌────────────────────────────────────────────┐ │
// │  │  Patient Header                            │ │
// │  │  - Name, Email, Avatar                     │ │
// │  │  - DOB, Gender, Blood Type, Phone          │ │
// │  ├────────────────────────────────────────────┤ │
// │  │  Quick Stats                               │ │
// │  │  - Medical Records: 5                      │ │
// │  │  - Active Rx: 2                            │ │
// │  │  - Test Results: 3                         │ │
// │  ├────────────────────────────────────────────┤ │
// │  │  Action Buttons                            │ │
// │  │  [+ Add Medical Record]                    │ │
// │  │  [+ Prescribe Medication]                  │ │
// │  │  [+ Add Test Result]                       │ │
// │  ├────────────────────────────────────────────┤ │
// │  │  Tabs: Overview | Records | Rx | Tests    │ │
// │  │  (Shows patient's data)                    │ │
// │  └────────────────────────────────────────────┘ │
// └──────────────────────────────────────────────────┘
// ```

// **Healthcare Worker Actions:**

// #### A. Search Patient
// ```
// 1. User types in search box: "John"
//         ↓
// 2. Frontend (debounced): GET /api/patients/search?q=John
//         ↓
// 3. Backend:
//    - Checks user role (must be doctor/nurse)
//    - Searches MongoDB: { role: 'patient', name: /John/i }
//    - Returns matching patients
//         ↓
// 4. Frontend displays results
//         ↓
// 5. User clicks on patient
//         ↓
// 6. Frontend loads patient data:
//    - GET /api/patients/:id
//    - GET /api/patients/:id/medical-records
//    - GET /api/patients/:id/prescriptions
//    - GET /api/patients/:id/test-results
// ```

// #### B. Add Medical Record
// ```
// 1. Doctor clicks "+ Add Medical Record"
//         ↓
// 2. Modal opens with form:
//    - Diagnosis *
//    - Visit Type (dropdown)
//    - Hospital Name *
//    - Visit Date *
//    - Symptoms
//    - Treatment
//    - Notes
//         ↓
// 3. Doctor fills form and submits
//         ↓
// 4. Frontend: POST /api/medical-records
//    {
//      patientId: "abc123",
//      diagnosis: "Annual checkup",
//      visitType: "checkup",
//      hospitalName: "General Hospital",
//      visitDate: "2024-01-15",
//      symptoms: "None",
//      treatment: "All normal"
//    }
//         ↓
// 5. Backend:
//    - Verifies user is doctor/admin (role check)
//    - Validates all required fields
//    - Automatically adds doctorId from logged-in user
//    - Creates record in MongoDB
//    - Creates audit log: "CREATE medical_record"
//         ↓
// 6. Frontend:
//    - Shows success message
//    - Refreshes patient data
//    - Closes modal
//         ↓
// 7. Patient can now see this record in their dashboard!
// ```

// #### C. Prescribe Medication
// ```
// 1. Doctor clicks "+ Prescribe Medication"
//         ↓
// 2. Modal opens with form:
//    - Medication Name *
//    - Dosage *
//    - Frequency *
//    - Duration *
//    - Hospital Name *
//    - Instructions
//         ↓
// 3. Doctor fills and submits
//         ↓
// 4. Frontend: POST /api/prescriptions
//         ↓
// 5. Backend:
//    - Verifies user is doctor/admin
//    - Creates prescription with doctorId
//    - Audit log created
//         ↓
// 6. Patient sees new prescription immediately!
// ```

// ---

// ## 🔐 Authentication Flow (Detailed)

// ### Initial Login
// ```
// 1. User clicks "Sign In"
//         ↓
// 2. Frontend calls: loginWithRedirect()
//    (from @auth0/auth0-react)
//         ↓
// 3. Browser redirects to Auth0:
//    https://your-tenant.auth0.com/authorize?
//    client_id=xxx&
//    redirect_uri=http://localhost:3000/dashboard&
//    audience=https://healthvault-api&
//    scope=openid profile email
//         ↓
// 4. Auth0 shows login page
//         ↓
// 5. User enters credentials
//         ↓
// 6. Auth0 validates
//         ↓
// 7. Auth0 redirects back with code:
//    http://localhost:3000/dashboard?code=abc123
//         ↓
// 8. Auth0 React SDK exchanges code for tokens:
//    - ID Token (user info)
//    - Access Token (API access)
//         ↓
// 9. Tokens stored in browser (localStorage)
//         ↓
// 10. User is now authenticated!
// ```

// ### Every API Call
// ```
// 1. Frontend needs to make API call
//         ↓
// 2. Gets token: await getAccessTokenSilently()
//         ↓
// 3. Sets token: apiClient.setAuthToken(token)
//         ↓
// 4. Makes request with header:
//    Authorization: Bearer eyJhbGc...
//         ↓
// 5. Backend receives request
//         ↓
// 6. Auth middleware (src/middleware/auth.js):
//    a. Extracts token from header
//    b. Verifies with Auth0 public key
//    c. Checks expiration
//    d. Gets user from MongoDB
//    e. Checks if user.isActive
//    f. Attaches user to req.user
//         ↓
// 7. Route handler executes
//         ↓
// 8. Response sent back
// ```

// ---

// ## 🔒 Role-Based Access Control (RBAC)

// ### Permission Matrix
// ```
// ┌─────────────────────┬─────────┬───────┬────────┬───────┐
// │ Action              │ Patient │ Nurse │ Doctor │ Admin │
// ├─────────────────────┼─────────┼───────┼────────┼───────┤
// │ View own data       │    ✅   │  ✅   │   ✅   │  ✅   │
// │ Search patients     │    ❌   │  ✅   │   ✅   │  ✅   │
// │ View any patient    │    ❌   │  ✅   │   ✅   │  ✅   │
// │ Add medical record  │    ❌   │  ❌   │   ✅   │  ✅   │
// │ Prescribe meds      │    ❌   │  ❌   │   ✅   │  ✅   │
// │ Add test result     │    ❌   │  ✅   │   ✅   │  ✅   │
// │ Upload files        │    ❌   │  ✅   │   ✅   │  ✅   │
// │ Update prescription │    ❌   │  ✅*  │   ✅   │  ✅   │
// │ View all audit logs │    ❌   │  ❌   │   ❌   │  ✅   │
// └─────────────────────┴─────────┴───────┴────────┴───────┘
// * Nurses can only update status (active/inactive)
// ```

// ### How It Works
// ```javascript
// // Example: Creating Medical Record

// // 1. Route definition (backend)
// router.post('/medical-records', 
//   authenticate,                    // ← Must be logged in
//   requireRole('doctor', 'admin'),  // ← Must be doctor or admin
//   async (req, res) => {
//     // Only doctors and admins reach here!
//   }
// );

// // 2. Middleware checks (src/middleware/auth.js)
// function requireRole(...allowedRoles) {
//   return (req, res, next) => {
//     const userRole = req.user.role;
    
//     if (!allowedRoles.includes(userRole)) {
//       return res.status(403).json({
//         error: 'Forbidden',
//         message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
//       });
//     }
    
//     next(); // User has correct role!
//   };
// }

// // 3. What happens:
// // - Patient tries to create record → 403 Forbidden
// // - Nurse tries to create record → 403 Forbidden
// // - Doctor tries to create record → ✅ Success
// // - Admin tries to create record → ✅ Success
// ```

// ---

// ## 📊 Data Flow Examples

// ### Example 1: Patient Views Their Records

// ```
// ┌─────────────────────────────────────────────────┐
// │ FRONTEND (Patient Dashboard)                    │
// └─────────────────────────────────────────────────┘
//                     │
//                     │ useQuery: 'medicalRecords'
//                     ▼
// ┌─────────────────────────────────────────────────┐
// │ API CLIENT (lib/api.ts)                         │
// │ getMedicalRecords(patientId)                    │
// └─────────────────────────────────────────────────┘
//                     │
//                     │ GET /api/patients/123/medical-records
//                     │ Authorization: Bearer token
//                     ▼
// ┌─────────────────────────────────────────────────┐
// │ BACKEND (src/routes/index.js)                   │
// └─────────────────────────────────────────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ authenticate()        │
//          │ - Verify JWT          │
//          │ - Get user from DB    │
//          └──────────┬────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ canAccessPatient()    │
//          │ - Is this their data? │
//          │ - Or are they doctor? │
//          └──────────┬────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ Query MongoDB         │
//          │ MedicalRecord.find()  │
//          └──────────┬────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ logAudit()            │
//          │ "READ medical_records"│
//          └──────────┬────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ Return JSON response  │
//          │ [ {...}, {...} ]      │
//          └──────────┬────────────┘
//                     │
//                     ▼
// ┌─────────────────────────────────────────────────┐
// │ FRONTEND                                         │
// │ - React Query caches data                       │
// │ - Component renders records                     │
// │ - User sees their medical history! 🎉          │
// └─────────────────────────────────────────────────┘
// ```

// ### Example 2: Doctor Searches for Patient

// ```
// ┌─────────────────────────────────────────────────┐
// │ FRONTEND (Healthcare Dashboard)                 │
// │ User types: "John"                              │
// └─────────────────────────────────────────────────┘
//                     │
//                     │ Debounced (500ms delay)
//                     ▼
// ┌─────────────────────────────────────────────────┐
// │ API CLIENT                                       │
// │ searchPatients("John")                          │
// └─────────────────────────────────────────────────┘
//                     │
//                     │ GET /api/patients/search?q=John
//                     ▼
// ┌─────────────────────────────────────────────────┐
// │ BACKEND                                          │
// └─────────────────────────────────────────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ authenticate()        │
//          └──────────┬────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ requireHealthcareWorker() │
//          │ - Check if doctor/nurse    │
//          └──────────┬────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ Query MongoDB:        │
//          │ User.find({           │
//          │   role: 'patient',    │
//          │   $or: [              │
//          │     {firstName: /John/i}, │
//          │     {lastName: /John/i},  │
//          │     {email: /John/i}      │
//          │   ]                   │
//          │ }).limit(20)          │
//          └──────────┬────────────┘
//                     │
//                     ▼
//          ┌──────────────────────┐
//          │ Return matches        │
//          │ [{name, email}, ...]  │
//          └──────────┬────────────┘
//                     │
//                     ▼
// ┌─────────────────────────────────────────────────┐
// │ FRONTEND                                         │
// │ - Displays search results                       │
// │ - Doctor clicks on patient                      │
// │ - Loads full patient data                       │
// └─────────────────────────────────────────────────┘
// ```

// ---

// ## 🗄️ Database Structure

// ### Users Collection
// ```javascript
// {
//   _id: ObjectId("507f1f77bcf86cd799439011"),
//   auth0Id: "auth0|abc123",
//   email: "john@example.com",
//   firstName: "John",
//   lastName: "Doe",
//   role: "patient",  // or "doctor", "nurse", "admin"
  
//   // Patient-specific fields
//   dateOfBirth: ISODate("1990-01-15"),
//   gender: "Male",
//   bloodType: "O+",
//   phone: "+1234567890",
  
//   // Healthcare worker fields (null for patients)
//   licenseNumber: null,
//   specialization: null,
//   hospitalAffiliation: null,
  
//   isActive: true,
//   createdAt: ISODate("2024-01-01"),
//   updatedAt: ISODate("2024-01-01")
// }
// ```

// ### MedicalRecords Collection
// ```javascript
// {
//   _id: ObjectId("..."),
//   patientId: ObjectId("507f1f77bcf86cd799439011"),  // Links to User
//   doctorId: ObjectId("607f1f77bcf86cd799439022"),   // Who created it
  
//   hospitalName: "General Hospital",
//   visitDate: ISODate("2024-01-15"),
//   visitType: "checkup",  // checkup, emergency, followup, etc.
  
//   diagnosis: "Annual physical examination",
//   symptoms: "None reported",
//   treatment: "All vitals normal. Continue healthy lifestyle.",
//   notes: "Patient in excellent health",
  
//   vitalSigns: {
//     bloodPressure: "120/80",
//     heartRate: 72,
//     temperature: 98.6,
//     weight: 70,
//     height: 175
//   },
  
//   status: "completed",  // active, completed, followup_needed
  
//   createdAt: ISODate("2024-01-15"),
//   updatedAt: ISODate("2024-01-15")
// }
// ```

// ### Prescriptions Collection
// ```javascript
// {
//   _id: ObjectId("..."),
//   patientId: ObjectId("..."),
//   doctorId: ObjectId("..."),
  
//   medicationName: "Ibuprofen",
//   dosage: "200mg",
//   frequency: "Twice daily",
//   duration: "7 days",
//   route: "oral",
  
//   prescribedDate: ISODate("2024-01-15"),
//   hospitalName: "General Hospital",
  
//   isActive: true,
//   refillsAllowed: 2,
//   instructions: "Take with food",
//   notes: "For pain management",
  
//   createdAt: ISODate("2024-01-15"),
//   updatedAt: ISODate("2024-01-15")
// }
// ```

// ### TestResults Collection
// ```javascript
// {
//   _id: ObjectId("..."),
//   patientId: ObjectId("..."),
//   orderedBy: ObjectId("..."),  // Doctor who ordered
  
//   testName: "Complete Blood Count",
//   testType: "Blood Test",
//   testDate: ISODate("2024-01-15"),
  
//   result: "All values within normal range",
//   normalRange: "WBC: 4.5-11.0, RBC: 4.5-5.5",
//   status: "normal",  // normal, abnormal, critical, pending
  
//   hospitalName: "General Hospital",
//   labName: "City Lab",
  
//   fileUrl: "https://s3.amazonaws.com/...",  // PDF report
  
//   reviewedBy: ObjectId("..."),  // Doctor who reviewed
//   reviewedAt: ISODate("2024-01-16"),
//   reviewNotes: "Results look good",
  
//   createdAt: ISODate("2024-01-15"),
//   updatedAt: ISODate("2024-01-16")
// }
// ```

// ### AuditLogs Collection
// ```javascript
// {
//   _id: ObjectId("..."),
//   userId: ObjectId("..."),  // Who did the action
//   userRole: "doctor",
  
//   action: "CREATE",  // CREATE, READ, UPDATE, DELETE, UPLOAD
//   resourceType: "medical_record",
//   resourceId: "507f...",
  
//   affectedPatientId: ObjectId("..."),  // Which patient was affected
  
//   ipAddress: "192.168.1.1",
//   userAgent: "Mozilla/5.0...",
//   details: "Created annual checkup record",
  
//   timestamp: ISODate("2024-01-15T10:30:00")
// }
// ```

// ---

// ## 🔄 State Management Flow

// ### React Query (TanStack Query)

// ```javascript
// // How data flows in the frontend:

// // 1. Component mounts
// <PatientDashboard />

// // 2. useQuery hook fires
// const { data: medicalRecords } = useQuery({
//   queryKey: ['medicalRecords', patientId],
//   queryFn: async () => {
//     const res = await apiClient.getMedicalRecords(patientId);
//     return res.data;
//   },
//   enabled: !!patientId,  // Only run if we have patientId
// });

// // 3. React Query automatically:
// // - Shows loading state while fetching
// // - Caches the result
// // - Refetches on window focus (optional)
// // - Handles errors
// // - Provides data to component

// // 4. When doctor adds new record:
// const mutation = useMutation({
//   mutationFn: (data) => apiClient.createMedicalRecord(data),
//   onSuccess: () => {
//     // Invalidate cache - forces refetch
//     queryClient.invalidateQueries(['medicalRecords']);
//   },
// });

// // 5. Data automatically updates in UI!
// ```

// ---

// ## 📱 Mobile Responsiveness Flow

// ```
// Desktop (> 1024px):
// ┌─────────────────────────────────────────────────┐
// │ Header                                           │
// ├────────────────┬────────────────────────────────┤
// │  Sidebar       │  Main Content                  │
// │  - Navigation  │  - Dashboard                   │
// │  - Stats       │  - Tables                      │
// │                │  - Forms                       │
// └────────────────┴────────────────────────────────┘

// Tablet (768px - 1024px):
// ┌─────────────────────────────────────────────────┐
// │ Header                                           │
// ├─────────────────────────────────────────────────┤
// │  Main Content (Full Width)                      │
// │  - Cards stack in 2 columns                     │
// │  - Tables scroll horizontally                   │
// └─────────────────────────────────────────────────┘

// Mobile (< 768px):
// ┌─────────────────┐
// │ Header          │
// │ (Hamburger)     │
// ├─────────────────┤
// │ Main Content    │
// │ - Cards stack   │
// │ - 1 column      │
// │ - Touch friendly│
// └─────────────────┘
// ```

// ---

// ## ⚡ Performance Optimizations

// ### 1. Code Splitting
// ```javascript
// // Next.js automatically splits code by route
// app/page.tsx → page.js
// app/patient/page.tsx → patient.page.js
// app/healthcare/page.tsx → healthcare.page.js
// ```

// ### 2. Data Caching
// ```javascript
// // React Query caches API responses
// queryClient.setDefaultOptions({
//   queries: {
//     staleTime: 60 * 1000,  // Data fresh for 1 minute
//     cacheTime: 5 * 60 * 1000,  // Keep in cache for 5 minutes
//   },
// });
// ```

// ### 3. Lazy Loading
// ```javascript
// // Images only load when visible
// <Image loading="lazy" ... />

// // Components load on demand
// const Modal = dynamic(() => import('./Modal'));
// ```

// ---

// ## 🎯 Summary

// ### Complete Flow in One Sentence:
// **User logs in → Selects role → Frontend calls API with JWT → Backend verifies token, checks permissions, queries MongoDB, logs audit trail → Returns data → Frontend displays beautifully with animations.**

// ### Key Principles:
// 1. **Security First**: Every request authenticated and logged
// 2. **Role-Based**: Different users see different things
// 3. **Real-Time**: React Query keeps data fresh
// 4. **Responsive**: Works on any device
// 5. **Beautiful**: Smooth animations and modern UI

// ---

// **That's the complete software flow!** 🎉



// //app/dashboard/page.tsx
// 'use client';

// import { useAuth0 } from '@auth0/auth0-react';
// import { useQuery } from '@tanstack/react-query';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { UserCircle, Stethoscope, Activity, Loader2 } from 'lucide-react';
// import apiClient, { RegisterData } from '@/lib/api';

// export default function DashboardRouter() {
//   const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
//   const router = useRouter();
//   const [showRoleSelection, setShowRoleSelection] = useState(false);
//   const [registering, setRegistering] = useState(false);

//   // Setup API token
//   useEffect(() => {
//     const setupAuth = async () => {
//       if (isAuthenticated) {
//         try {
//           const token = await getAccessTokenSilently();
//           apiClient.setAuthToken(token);
//         } catch (err) {
//           console.error('Failed to get token:', err);
//         }
//       }
//     };
//     setupAuth();
//   }, [isAuthenticated, getAccessTokenSilently]);

//   // Fetch user profile
//   const { data: profile, isLoading: profileLoading, error } = useQuery({
//     queryKey: ['profile'],
//     queryFn: async () => {
//       const response = await apiClient.getProfile();
//       return response.data;
//     },
//     enabled: isAuthenticated,
//     retry: false,
//   });

//   // Route based on role
//   useEffect(() => {
//     if (profile?.role) {
//       if (profile.role === 'patient') {
//         router.push('/patient');
//       } else if (['doctor', 'nurse', 'admin'].includes(profile.role)) {
//         router.push('/healthcare');
//       }
//     } else if (error && !showRoleSelection) {
//       // User doesn't have a profile yet, show role selection
//       setShowRoleSelection(true);
//     }
//   }, [profile, error, router, showRoleSelection]);

//   const handleRoleSelection = async (role: 'patient' | 'doctor' | 'nurse') => {
//     setRegistering(true);
//     try {
//       const registerData: RegisterData = {
//         email: user?.email || '',
//         firstName: user?.given_name || user?.name?.split(' ')[0] || '',
//         lastName: user?.family_name || user?.name?.split(' ')[1] || '',
//         role,
//       };

//       // Add role-specific fields
//       if (role === 'patient') {
//         registerData.dateOfBirth = '1990-01-01'; // This should be collected in a form
//         registerData.gender = 'Other';
//       } else {
//         registerData.licenseNumber = 'PENDING'; // This should be verified
//         registerData.hospitalAffiliation = 'General Hospital';
//         if (role === 'doctor') {
//           registerData.specialization = 'General Practice';
//         }
//       }

//       await apiClient.register(registerData);
      
//       // Refetch profile
//       window.location.reload();
//     } catch (err) {
//       console.error('Registration error:', err);
//       setRegistering(false);
//     }
//   };

//   if (isLoading || profileLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center"
//         >
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
//           />
//           <p className="text-gray-600 text-lg">Loading your dashboard...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (showRoleSelection) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-4xl w-full"
//         >
//           <div className="text-center mb-12">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", duration: 0.5 }}
//               className="inline-block p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6"
//             >
//               <Activity className="w-12 h-12 text-white" />
//             </motion.div>
//             <h1 className="text-4xl font-bold mb-4">
//               Welcome to{' '}
//               <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 Health Vault
//               </span>
//             </h1>
//             <p className="text-xl text-gray-600">
//               Please select your role to get started
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {/* Patient Card */}
//             <motion.button
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               whileHover={{ y: -10, scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => handleRoleSelection('patient')}
//               disabled={registering}
//               className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-left overflow-hidden group"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
//               <div className="relative">
//                 <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mb-4">
//                   <UserCircle className="w-8 h-8 text-white" />
//                 </div>
                
//                 <h3 className="text-2xl font-bold mb-2">I'm a Patient</h3>
//                 <p className="text-gray-600 mb-6">
//                   Access your medical records, prescriptions, and test results
//                 </p>

//                 <ul className="space-y-2 mb-6">
//                   {[
//                     'View medical history',
//                     'Track prescriptions',
//                     'Download test results',
//                     'Secure & private',
//                   ].map((feature, i) => (
//                     <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>

//                 <div className="flex items-center justify-between">
//                   <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
//                     Continue as Patient →
//                   </span>
//                 </div>
//               </div>
//             </motion.button>

//             {/* Healthcare Provider Card */}
//             <motion.button
//               initial={{ x: 50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               whileHover={{ y: -10, scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => handleRoleSelection('doctor')}
//               disabled={registering}
//               className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-left overflow-hidden group"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
//               <div className="relative">
//                 <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-4">
//                   <Stethoscope className="w-8 h-8 text-white" />
//                 </div>
                
//                 <h3 className="text-2xl font-bold mb-2">Healthcare Provider</h3>
//                 <p className="text-gray-600 mb-6">
//                   Manage patient records and provide better care
//                 </p>

//                 <ul className="space-y-2 mb-6">
//                   {[
//                     'Search & manage patients',
//                     'Create medical records',
//                     'Prescribe medications',
//                     'Upload test results',
//                   ].map((feature, i) => (
//                     <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
//                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
//                       {feature}
//                     </li>
//                   ))}
//                 </ul>

//                 <div className="flex items-center justify-between">
//                   <span className="text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
//                     Continue as Provider →
//                   </span>
//                 </div>
//               </div>
//             </motion.button>
//           </div>

//           {registering && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//             >
//               <div className="bg-white rounded-2xl p-8 text-center">
//                 <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//                 <p className="text-lg font-semibold">Setting up your account...</p>
//               </div>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//       <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
//     </div>
//   );
// }


// //app/healthcare/page/tsx
// 'use client';

// import { useAuth0 } from '@auth0/auth0-react';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { useState, useEffect } from 'react';
// import apiClient from '@/lib/api';
// import HealthcareHeader from './components/HealthcareHeader';
// import PatientSearch from './components/PatientSearch';
// import PatientDetails from './components/PatientDetails';
// import PatientStats from './components/PatientStats';
// import ActionButtons from './components/ActionButtons';
// import PatientTabs from './components/PatientTabs';
// import AddRecordModal from './components/modals/AddRecordModal';
// import AddPrescriptionModal from './components/modals/AddPrescriptionModal';
// import AddTestModal from './components/modals/AddTestModal';
// import { motion } from 'framer-motion';
// import { Users } from 'lucide-react';

// export default function HealthcareDashboard() {
//   const { getAccessTokenSilently } = useAuth0();
//   const queryClient = useQueryClient();
  
//   // State management
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedPatient, setSelectedPatient] = useState<any>(null);
//   const [showAddRecordModal, setShowAddRecordModal] = useState(false);
//   const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);
//   const [showAddTestModal, setShowAddTestModal] = useState(false);
//   const [activeView, setActiveView] = useState('overview');

//   // Setup authentication
//   useEffect(() => {
//     const setupAuth = async () => {
//       const token = await getAccessTokenSilently();
//       apiClient.setAuthToken(token);
//     };
//     setupAuth();
//   }, [getAccessTokenSilently]);

//   // Fetch user profile
//   const { data: profile } = useQuery({
//     queryKey: ['profile'],
//     queryFn: async () => {
//       const res = await apiClient.getProfile();
//       return res.data;
//     },
//   });

//   // Search patients
//   const { data: searchResults = [], isLoading: searching } = useQuery({
//     queryKey: ['patientSearch', searchQuery],
//     queryFn: async () => {
//       if (searchQuery.length < 2) return [];
//       const res = await apiClient.searchPatients(searchQuery);
//       return res.data;
//     },
//     enabled: searchQuery.length >= 2,
//   });

//   // Fetch selected patient's data
//   const { data: patientRecords = [] } = useQuery({
//     queryKey: ['patientRecords', selectedPatient?._id],
//     queryFn: async () => {
//       const res = await apiClient.getMedicalRecords(selectedPatient._id);
//       return res.data;
//     },
//     enabled: !!selectedPatient?._id,
//   });

//   const { data: patientPrescriptions = [] } = useQuery({
//     queryKey: ['patientPrescriptions', selectedPatient?._id],
//     queryFn: async () => {
//       const res = await apiClient.getPrescriptions(selectedPatient._id);
//       return res.data;
//     },
//     enabled: !!selectedPatient?._id,
//   });

//   const { data: patientTests = [] } = useQuery({
//     queryKey: ['patientTests', selectedPatient?._id],
//     queryFn: async () => {
//       const res = await apiClient.getTestResults(selectedPatient._id);
//       return res.data;
//     },
//     enabled: !!selectedPatient?._id,
//   });

//   // Handlers
//   const handleSelectPatient = (patient: any) => {
//     setSelectedPatient(patient);
//     setActiveView('overview');
//   };

//   const handleClosePatient = () => {
//     setSelectedPatient(null);
//   };

//   const handleRecordSuccess = () => {
//     queryClient.invalidateQueries({ queryKey: ['patientRecords'] });
//     setShowAddRecordModal(false);
//   };

//   const handlePrescriptionSuccess = () => {
//     queryClient.invalidateQueries({ queryKey: ['patientPrescriptions'] });
//     setShowAddPrescriptionModal(false);
//   };

//   const handleTestSuccess = () => {
//     queryClient.invalidateQueries({ queryKey: ['patientTests'] });
//     setShowAddTestModal(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
//       {/* Header */}
//       <HealthcareHeader profile={profile} />

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Left Panel - Patient Search */}
//           <PatientSearch
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             searchResults={searchResults}
//             searching={searching}
//             selectedPatient={selectedPatient}
//             onSelectPatient={handleSelectPatient}
//           />

//           {/* Right Panel - Patient Details */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="lg:col-span-2"
//           >
//             {!selectedPatient ? (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
//                 <div className="inline-block p-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-6">
//                   <Users className="w-12 h-12 text-emerald-600" />
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Patient</h3>
//                 <p className="text-gray-600">Search and select a patient to view their records</p>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {/* Patient Details Header */}
//                 <PatientDetails 
//                   patient={selectedPatient}
//                   onClose={handleClosePatient}
//                 />

//                 {/* Quick Stats */}
//                 <PatientStats
//                   recordsCount={patientRecords.length}
//                   activePrescriptionsCount={patientPrescriptions.filter((p: any) => p.isActive).length}
//                   testsCount={patientTests.length}
//                 />

//                 {/* Action Buttons */}
//                 <ActionButtons
//                   onAddRecord={() => setShowAddRecordModal(true)}
//                   onPrescribe={() => setShowAddPrescriptionModal(true)}
//                   onAddTest={() => setShowAddTestModal(true)}
//                 />

//                 {/* Tabs with Patient Data */}
//                 <PatientTabs
//                   activeView={activeView}
//                   setActiveView={setActiveView}
//                   patientRecords={patientRecords}
//                   patientPrescriptions={patientPrescriptions}
//                   patientTests={patientTests}
//                 />
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>

//       {/* Modals */}
//       <AddRecordModal
//         isOpen={showAddRecordModal}
//         onClose={() => setShowAddRecordModal(false)}
//         patientId={selectedPatient?._id}
//         onSuccess={handleRecordSuccess}
//       />

//       <AddPrescriptionModal
//         isOpen={showAddPrescriptionModal}
//         onClose={() => setShowAddPrescriptionModal(false)}
//         patientId={selectedPatient?._id}
//         onSuccess={handlePrescriptionSuccess}
//       />

//       <AddTestModal
//         isOpen={showAddTestModal}
//         onClose={() => setShowAddTestModal(false)}
//         patientId={selectedPatient?._id}
//         onSuccess={handleTestSuccess}
//       />
//     </div>
//   );
// }





// // healthcare/components/ActionButtons.tsx
// 'use client';

// import { motion } from 'framer-motion';
// import { FilePlus, Pill, FlaskConical } from 'lucide-react';

// interface ActionButtonsProps {
//   onAddRecord: () => void;
//   onPrescribe: () => void;
//   onAddTest: () => void;
// }

// export default function ActionButtons({
//   onAddRecord,
//   onPrescribe,
//   onAddTest,
// }: ActionButtonsProps) {
//   const buttons = [
//     {
//       label: 'Add Medical Record',
//       icon: FilePlus,
//       onClick: onAddRecord,
//       gradient: 'from-blue-600 to-indigo-600',
//       hoverGradient: 'from-blue-700 to-indigo-700',
//     },
//     {
//       label: 'Prescribe Medication',
//       icon: Pill,
//       onClick: onPrescribe,
//       gradient: 'from-emerald-600 to-teal-600',
//       hoverGradient: 'from-emerald-700 to-teal-700',
//     },
//     {
//       label: 'Add Test Result',
//       icon: FlaskConical,
//       onClick: onAddTest,
//       gradient: 'from-purple-600 to-pink-600',
//       hoverGradient: 'from-purple-700 to-pink-700',
//     },
//   ];

//   return (
//     <div className="grid md:grid-cols-3 gap-4">
//       {buttons.map((button, index) => (
//         <motion.button
//           key={button.label}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: index * 0.1 }}
//           whileHover={{ scale: 1.05, y: -2 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={button.onClick}
//           className={`bg-gradient-to-r ${button.gradient} hover:${button.hoverGradient} text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all`}
//         >
//           <div className="flex items-center justify-center gap-3">
//             <button.icon className="w-5 h-5" />
//             <span className="font-semibold">{button.label}</span>
//           </div>
//         </motion.button>
//       ))}
//     </div>
//   );
// }

// // healthcare/components/HealthcareHeader.tsx
// 'use client';

// import { useAuth0 } from '@auth0/auth0-react';
// import { motion } from 'framer-motion';
// import { Activity, Bell, LogOut, Stethoscope } from 'lucide-react';

// interface HealthcareHeaderProps {
//   profile: any;
// }

// export default function HealthcareHeader({ profile }: HealthcareHeaderProps) {
//   const { logout } = useAuth0();

//   return (
//     <motion.header
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm"
//     >
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo and Title */}
//           <div className="flex items-center gap-4">
//             <motion.div
//               whileHover={{ rotate: 360 }}
//               transition={{ duration: 0.5 }}
//               className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl"
//             >
//               <Activity className="w-6 h-6 text-white" />
//             </motion.div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">My Health Vault</h1>
//               <p className="text-sm text-gray-600">Healthcare Provider Portal</p>
//             </div>
//           </div>

//           {/* Right Side - Notification, Profile, Logout */}
//           <div className="flex items-center gap-4">
//             {/* Notification Bell */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
//             >
//               <Bell className="w-5 h-5 text-gray-600" />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
//             </motion.button>

//             {/* Profile Display */}
//             <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
//               <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
//                 <Stethoscope className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-gray-900">
//                   Dr. {profile?.firstName} {profile?.lastName}
//                 </p>
//                 <p className="text-xs text-gray-600 capitalize">{profile?.role}</p>
//               </div>
//             </div>

//             {/* Logout Button */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
//               className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
//             >
//               <LogOut className="w-4 h-4" />
//               <span className="hidden sm:inline">Logout</span>
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </motion.header>
//   );
// }



// // healthcare/components/PatientDetails.tsx
// 'use client';

// import { motion } from 'framer-motion';
// import { X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

// interface PatientDetailsProps {
//   patient: any;
//   onClose: () => void;
// }

// export default function PatientDetails({ patient, onClose }: PatientDetailsProps) {
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const calculateAge = (dob: string) => {
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
//     >
//       {/* Header */}
//       <div className="flex items-start justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
//             <span className="text-white font-bold text-xl">
//               {patient.firstName[0]}{patient.lastName[0]}
//             </span>
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">
//               {patient.firstName} {patient.lastName}
//             </h2>
//             <p className="text-gray-600">Patient ID: {patient._id.slice(-8)}</p>
//           </div>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.1, rotate: 90 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={onClose}
//           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <X className="w-5 h-5 text-gray-600" />
//         </motion.button>
//       </div>

//       {/* Patient Information Grid */}
//       <div className="grid md:grid-cols-2 gap-4">
//         {/* Email */}
//         <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//           <div className="p-2 bg-emerald-100 rounded-lg">
//             <Mail className="w-4 h-4 text-emerald-600" />
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 font-medium">Email</p>
//             <p className="text-sm text-gray-900">{patient.email}</p>
//           </div>
//         </div>

//         {/* Phone */}
//         {patient.phone && (
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//             <div className="p-2 bg-teal-100 rounded-lg">
//               <Phone className="w-4 h-4 text-teal-600" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 font-medium">Phone</p>
//               <p className="text-sm text-gray-900">{patient.phone}</p>
//             </div>
//           </div>
//         )}

//         {/* Date of Birth & Age */}
//         {patient.dateOfBirth && (
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Calendar className="w-4 h-4 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
//               <p className="text-sm text-gray-900">
//                 {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} years)
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Address */}
//         {patient.address && (
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <MapPin className="w-4 h-4 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 font-medium">Address</p>
//               <p className="text-sm text-gray-900">{patient.address}</p>
//             </div>
//           </div>
//         )}

//         {/* Gender */}
//         {patient.gender && (
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//             <div className="p-2 bg-pink-100 rounded-lg">
//               <User className="w-4 h-4 text-pink-600" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 font-medium">Gender</p>
//               <p className="text-sm text-gray-900 capitalize">{patient.gender}</p>
//             </div>
//           </div>
//         )}

//         {/* Blood Type */}
//         {patient.bloodType && (
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//             <div className="p-2 bg-red-100 rounded-lg">
//               <span className="text-red-600 font-bold text-xs">ABO</span>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 font-medium">Blood Type</p>
//               <p className="text-sm text-gray-900 font-semibold">{patient.bloodType}</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Emergency Contact */}
//       {patient.emergencyContact && (
//         <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
//           <h3 className="text-sm font-bold text-gray-900 mb-2">Emergency Contact</h3>
//           <div className="grid md:grid-cols-2 gap-2 text-sm">
//             <p className="text-gray-700">
//               <span className="font-medium">Name:</span> {patient.emergencyContact.name}
//             </p>
//             <p className="text-gray-700">
//               <span className="font-medium">Phone:</span> {patient.emergencyContact.phone}
//             </p>
//             <p className="text-gray-700 md:col-span-2">
//               <span className="font-medium">Relationship:</span> {patient.emergencyContact.relationship}
//             </p>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// }


// // healthcare/components/PatientSearch.tsx
// 'use client';

// import { motion } from 'framer-motion';
// import { Search, Users, ChevronRight, Loader2 } from 'lucide-react';

// interface PatientSearchProps {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   searchResults: any[];
//   searching: boolean;
//   selectedPatient: any;
//   onSelectPatient: (patient: any) => void;
// }

// export default function PatientSearch({
//   searchQuery,
//   setSearchQuery,
//   searchResults,
//   searching,
//   selectedPatient,
//   onSelectPatient,
// }: PatientSearchProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="lg:col-span-1"
//     >
//       <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
//         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//           <Users className="w-6 h-6 text-emerald-600" />
//           Find Patient
//         </h2>

//         {/* Search Input */}
//         <div className="relative mb-4">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search by name or email..."
//             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//           />
//           {searching && (
//             <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 animate-spin" />
//           )}
//         </div>

//         {/* Search Results */}
//         <div className="space-y-2 max-h-[500px] overflow-y-auto">
//           {searchResults.map((patient: any) => (
//             <motion.button
//               key={patient._id}
//               whileHover={{ x: 5 }}
//               onClick={() => onSelectPatient(patient)}
//               className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
//                 selectedPatient?._id === patient._id
//                   ? 'border-emerald-500 bg-emerald-50'
//                   : 'border-gray-200 hover:border-emerald-300 bg-white'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
//                   <span className="text-white font-bold text-sm">
//                     {patient.firstName[0]}{patient.lastName[0]}
//                   </span>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-gray-900 truncate">
//                     {patient.firstName} {patient.lastName}
//                   </p>
//                   <p className="text-sm text-gray-600 truncate">{patient.email}</p>
//                 </div>
//                 <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
//               </div>
//             </motion.button>
//           ))}

//           {/* No Results */}
//           {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
//             <div className="text-center py-8">
//               <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
//                 <Search className="w-8 h-8 text-gray-400" />
//               </div>
//               <p className="text-gray-600">No patients found</p>
//             </div>
//           )}

//           {/* Initial State */}
//           {searchQuery.length < 2 && (
//             <div className="text-center py-8">
//               <div className="inline-block p-4 bg-emerald-100 rounded-full mb-3">
//                 <Search className="w-8 h-8 text-emerald-600" />
//               </div>
//               <p className="text-gray-600">Type to search patients</p>
//               <p className="text-sm text-gray-500 mt-2">At least 2 characters</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// }


// // healthcare/components/PatientStats.tsx
// 'use client';

// import { motion } from 'framer-motion';
// import { FileText, Pill, FlaskConical } from 'lucide-react';

// interface PatientStatsProps {
//   recordsCount: number;
//   activePrescriptionsCount: number;
//   testsCount: number;
// }

// export default function PatientStats({
//   recordsCount,
//   activePrescriptionsCount,
//   testsCount,
// }: PatientStatsProps) {
//   const stats = [
//     {
//       label: 'Medical Records',
//       value: recordsCount,
//       icon: FileText,
//       gradient: 'from-blue-500 to-indigo-500',
//       bg: 'from-blue-50 to-indigo-50',
//     },
//     {
//       label: 'Active Prescriptions',
//       value: activePrescriptionsCount,
//       icon: Pill,
//       gradient: 'from-emerald-500 to-teal-500',
//       bg: 'from-emerald-50 to-teal-50',
//     },
//     {
//       label: 'Test Results',
//       value: testsCount,
//       icon: FlaskConical,
//       gradient: 'from-purple-500 to-pink-500',
//       bg: 'from-purple-50 to-pink-50',
//     },
//   ];

//   return (
//     <div className="grid md:grid-cols-3 gap-4">
//       {stats.map((stat, index) => (
//         <motion.div
//           key={stat.label}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: index * 0.1 }}
//           whileHover={{ y: -5, scale: 1.02 }}
//           className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border border-gray-100 shadow-lg`}
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
//               <motion.p
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
//                 className="text-4xl font-bold text-gray-900"
//               >
//                 {stat.value}
//               </motion.p>
//             </div>
//             <motion.div
//               whileHover={{ rotate: 360 }}
//               transition={{ duration: 0.5 }}
//               className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}
//             >
//               <stat.icon className="w-8 h-8 text-white" />
//             </motion.div>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }


// // healthcare/components/PatientTabs.tsx
// 'use client';

// import { motion } from 'framer-motion';
// import { useState } from 'react';
// import { FileText, Pill, FlaskConical, Calendar, Building, User, CheckCircle, XCircle, Download, Eye } from 'lucide-react';

// interface PatientTabsProps {
//   activeView: string;
//   setActiveView: (view: string) => void;
//   patientRecords: any[];
//   patientPrescriptions: any[];
//   patientTests: any[];
// }

// export default function PatientTabs({
//   activeView,
//   setActiveView,
//   patientRecords,
//   patientPrescriptions,
//   patientTests,
// }: PatientTabsProps) {
//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: FileText },
//     { id: 'records', label: 'Medical Records', icon: FileText, count: patientRecords.length },
//     { id: 'prescriptions', label: 'Prescriptions', icon: Pill, count: patientPrescriptions.length },
//     { id: 'tests', label: 'Test Results', icon: FlaskConical, count: patientTests.length },
//   ];

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const formatDateTime = (dateString: string) => {
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//       {/* Tab Navigation */}
//       <div className="border-b border-gray-200 bg-gray-50">
//         <div className="flex overflow-x-auto">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveView(tab.id)}
//               className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all relative whitespace-nowrap ${
//                 activeView === tab.id
//                   ? 'text-emerald-600'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <tab.icon className="w-5 h-5" />
//               <span>{tab.label}</span>
//               {tab.count !== undefined && (
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   activeView === tab.id
//                     ? 'bg-emerald-100 text-emerald-700'
//                     : 'bg-gray-200 text-gray-700'
//                 }`}>
//                   {tab.count}
//                 </span>
//               )}
//               {activeView === tab.id && (
//                 <motion.div
//                   layoutId="activeTab"
//                   className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600"
//                 />
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div className="p-6">
//         {/* Overview Tab */}
//         {activeView === 'overview' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-6"
//           >
//             <div>
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Summary</h3>
//               <div className="grid md:grid-cols-3 gap-4">
//                 <div className="p-4 bg-blue-50 rounded-xl">
//                   <p className="text-sm text-gray-600 mb-1">Total Records</p>
//                   <p className="text-2xl font-bold text-blue-600">{patientRecords.length}</p>
//                 </div>
//                 <div className="p-4 bg-emerald-50 rounded-xl">
//                   <p className="text-sm text-gray-600 mb-1">Active Prescriptions</p>
//                   <p className="text-2xl font-bold text-emerald-600">
//                     {patientPrescriptions.filter((p: any) => p.isActive).length}
//                   </p>
//                 </div>
//                 <div className="p-4 bg-purple-50 rounded-xl">
//                   <p className="text-sm text-gray-600 mb-1">Test Results</p>
//                   <p className="text-2xl font-bold text-purple-600">{patientTests.length}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div>
//               <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
//               <div className="space-y-3">
//                 {patientRecords.slice(0, 3).map((record: any) => (
//                   <div key={record._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <FileText className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-semibold text-gray-900">{record.diagnosis}</p>
//                       <p className="text-sm text-gray-600">{formatDate(record.visitDate)}</p>
//                     </div>
//                   </div>
//                 ))}
//                 {patientRecords.length === 0 && (
//                   <p className="text-center text-gray-500 py-8">No medical records yet</p>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Medical Records Tab */}
//         {activeView === 'records' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-4"
//           >
//             {patientRecords.length === 0 ? (
//               <div className="text-center py-12">
//                 <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No medical records found</p>
//               </div>
//             ) : (
//               patientRecords.map((record: any) => (
//                 <motion.div
//                   key={record._id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h4 className="text-lg font-bold text-gray-900 mb-1">{record.diagnosis}</h4>
//                       <div className="flex flex-wrap gap-2">
//                         <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
//                           {record.visitType}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm text-gray-600 flex items-center gap-1">
//                         <Calendar className="w-4 h-4" />
//                         {formatDate(record.visitDate)}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4 mb-4">
//                     <div className="flex items-center gap-2 text-sm text-gray-700">
//                       <Building className="w-4 h-4 text-gray-500" />
//                       <span className="font-medium">Hospital:</span>
//                       <span>{record.hospitalName}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-700">
//                       <User className="w-4 h-4 text-gray-500" />
//                       <span className="font-medium">Doctor:</span>
//                       <span>Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}</span>
//                     </div>
//                   </div>

//                   {record.symptoms && (
//                     <div className="mb-3">
//                       <p className="text-sm font-semibold text-gray-700 mb-1">Symptoms:</p>
//                       <p className="text-sm text-gray-600">{record.symptoms}</p>
//                     </div>
//                   )}

//                   {record.treatment && (
//                     <div className="mb-3">
//                       <p className="text-sm font-semibold text-gray-700 mb-1">Treatment:</p>
//                       <p className="text-sm text-gray-600">{record.treatment}</p>
//                     </div>
//                   )}

//                   {record.notes && (
//                     <div className="mb-3">
//                       <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
//                       <p className="text-sm text-gray-600">{record.notes}</p>
//                     </div>
//                   )}

//                   {record.followUpDate && (
//                     <div className="mt-3 pt-3 border-t border-gray-200">
//                       <p className="text-sm text-gray-600">
//                         <span className="font-medium">Follow-up:</span> {formatDate(record.followUpDate)}
//                       </p>
//                     </div>
//                   )}
//                 </motion.div>
//               ))
//             )}
//           </motion.div>
//         )}

//         {/* Prescriptions Tab */}
//         {activeView === 'prescriptions' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-4"
//           >
//             {patientPrescriptions.length === 0 ? (
//               <div className="text-center py-12">
//                 <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No prescriptions found</p>
//               </div>
//             ) : (
//               patientPrescriptions.map((prescription: any) => (
//                 <motion.div
//                   key={prescription._id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h4 className="text-lg font-bold text-gray-900 mb-1">{prescription.medication}</h4>
//                       <p className="text-sm text-gray-600">{prescription.dosage}</p>
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       {prescription.isActive ? (
//                         <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1">
//                           <CheckCircle className="w-3 h-3" />
//                           Active
//                         </span>
//                       ) : (
//                         <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium flex items-center gap-1">
//                           <XCircle className="w-3 h-3" />
//                           Inactive
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Frequency</p>
//                       <p className="text-sm font-medium text-gray-900">{prescription.frequency}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Duration</p>
//                       <p className="text-sm font-medium text-gray-900">{prescription.duration}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Prescribed By</p>
//                       <p className="text-sm font-medium text-gray-900">
//                         Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Prescribed On</p>
//                       <p className="text-sm font-medium text-gray-900">{formatDate(prescription.createdAt)}</p>
//                     </div>
//                   </div>

//                   {prescription.instructions && (
//                     <div className="mb-3 p-3 bg-blue-50 rounded-lg">
//                       <p className="text-xs font-semibold text-blue-900 mb-1">Instructions:</p>
//                       <p className="text-sm text-blue-800">{prescription.instructions}</p>
//                     </div>
//                   )}

//                   {prescription.sideEffects && (
//                     <div className="mb-3 p-3 bg-orange-50 rounded-lg">
//                       <p className="text-xs font-semibold text-orange-900 mb-1">Possible Side Effects:</p>
//                       <p className="text-sm text-orange-800">{prescription.sideEffects}</p>
//                     </div>
//                   )}
//                 </motion.div>
//               ))
//             )}
//           </motion.div>
//         )}

//         {/* Test Results Tab */}
//         {activeView === 'tests' && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-4"
//           >
//             {patientTests.length === 0 ? (
//               <div className="text-center py-12">
//                 <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No test results found</p>
//               </div>
//             ) : (
//               patientTests.map((test: any) => (
//                 <motion.div
//                   key={test._id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h4 className="text-lg font-bold text-gray-900 mb-1">{test.testName}</h4>
//                       <p className="text-sm text-gray-600">{test.testType}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm text-gray-600">{formatDateTime(test.testDate)}</p>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Status</p>
//                       <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
//                         test.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
//                         test.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
//                         'bg-gray-100 text-gray-700'
//                       }`}>
//                         {test.status}
//                       </span>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Ordered By</p>
//                       <p className="text-sm font-medium text-gray-900">
//                         {test.orderedBy?.firstName} {test.orderedBy?.lastName}
//                       </p>
//                     </div>
//                   </div>

//                   {test.result && (
//                     <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//                       <p className="text-xs font-semibold text-gray-700 mb-2">Results:</p>
//                       <p className="text-sm text-gray-900">{test.result}</p>
//                     </div>
//                   )}

//                   {test.normalRange && (
//                     <div className="mb-4">
//                       <p className="text-xs text-gray-500 mb-1">Normal Range</p>
//                       <p className="text-sm font-medium text-gray-700">{test.normalRange}</p>
//                     </div>
//                   )}

//                   {test.notes && (
//                     <div className="mb-4">
//                       <p className="text-xs text-gray-500 mb-1">Notes</p>
//                       <p className="text-sm text-gray-700">{test.notes}</p>
//                     </div>
//                   )}

//                   {test.fileUrl && (
//                     <div className="flex gap-2">
//                       <motion.a
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         href={test.fileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View Document
//                       </motion.a>
//                       <motion.a
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         href={test.fileUrl}
//                         download
//                         className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-700 transition-colors"
//                       >
//                         <Download className="w-4 h-4" />
//                         Download
//                       </motion.a>
//                     </div>
//                   )}
//                 </motion.div>
//               ))
//             )}
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }



// //healthcare/modals/AddPrescriptionModal.tsx
// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Pill, Loader2 } from 'lucide-react';
// import { useMutation } from '@tanstack/react-query';
// import apiClient from '@/lib/api';

// interface AddPrescriptionModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   patientId: string;
//   onSuccess: () => void;
// }

// export default function AddPrescriptionModal({
//   isOpen,
//   onClose,
//   patientId,
//   onSuccess,
// }: AddPrescriptionModalProps) {
//   const [formData, setFormData] = useState({
//     medication: '',
//     dosage: '',
//     frequency: '',
//     duration: '',
//     instructions: '',
//     sideEffects: '',
//     isActive: true,
//   });

//   const createPrescriptionMutation = useMutation({
//     mutationFn: async (data: any) => {
//       return await apiClient.createPrescription(data);
//     },
//     onSuccess: () => {
//       onSuccess();
//       resetForm();
//     },
//   });

//   const resetForm = () => {
//     setFormData({
//       medication: '',
//       dosage: '',
//       frequency: '',
//       duration: '',
//       instructions: '',
//       sideEffects: '',
//       isActive: true,
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     createPrescriptionMutation.mutate({
//       ...formData,
//       patientId,
//     });
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
//     setFormData({
//       ...formData,
//       [e.target.name]: value,
//     });
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//           >
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//               {/* Header */}
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-emerald-100 rounded-lg">
//                     <Pill className="w-6 h-6 text-emerald-600" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">Prescribe Medication</h2>
//                     <p className="text-sm text-gray-600">Add a new prescription for the patient</p>
//                   </div>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.1, rotate: 90 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </motion.button>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                 {/* Medication Name */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Medication Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="medication"
//                     value={formData.medication}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                     placeholder="Enter medication name"
//                   />
//                 </div>

//                 {/* Dosage & Frequency */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Dosage <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="dosage"
//                       value={formData.dosage}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                       placeholder="e.g., 500mg"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Frequency <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="frequency"
//                       value={formData.frequency}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                     >
//                       <option value="">Select frequency</option>
//                       <option value="Once daily">Once daily</option>
//                       <option value="Twice daily">Twice daily</option>
//                       <option value="Three times daily">Three times daily</option>
//                       <option value="Four times daily">Four times daily</option>
//                       <option value="Every 4 hours">Every 4 hours</option>
//                       <option value="Every 6 hours">Every 6 hours</option>
//                       <option value="Every 8 hours">Every 8 hours</option>
//                       <option value="Every 12 hours">Every 12 hours</option>
//                       <option value="As needed">As needed</option>
//                       <option value="Before meals">Before meals</option>
//                       <option value="After meals">After meals</option>
//                       <option value="At bedtime">At bedtime</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Duration */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Duration <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                     placeholder="e.g., 7 days, 2 weeks, 1 month"
//                   />
//                 </div>

//                 {/* Instructions */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Instructions <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     name="instructions"
//                     value={formData.instructions}
//                     onChange={handleChange}
//                     required
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                     placeholder="Detailed instructions for taking the medication..."
//                   />
//                 </div>

//                 {/* Side Effects */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Possible Side Effects
//                   </label>
//                   <textarea
//                     name="sideEffects"
//                     value={formData.sideEffects}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                     placeholder="List potential side effects..."
//                   />
//                 </div>

//                 {/* Active Status */}
//                 <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
//                   <input
//                     type="checkbox"
//                     id="isActive"
//                     name="isActive"
//                     checked={formData.isActive}
//                     onChange={handleChange}
//                     className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
//                   />
//                   <label htmlFor="isActive" className="text-sm font-semibold text-gray-900">
//                     Mark as active prescription
//                   </label>
//                 </div>

//                 {/* Error Message */}
//                 {createPrescriptionMutation.isError && (
//                   <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
//                     <p className="text-sm text-red-600">
//                       Failed to create prescription. Please try again.
//                     </p>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-4">
//                   <motion.button
//                     type="button"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={onClose}
//                     className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     type="submit"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     disabled={createPrescriptionMutation.isPending}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {createPrescriptionMutation.isPending ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Creating...
//                       </>
//                     ) : (
//                       'Create Prescription'
//                     )}
//                   </motion.button>
//                 </div>
//               </form>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }

// //healthcare/modals/AddRecordModal.tsx
// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, FileText, Loader2 } from 'lucide-react';
// import { useMutation } from '@tanstack/react-query';
// import apiClient from '@/lib/api';

// interface AddRecordModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   patientId: string;
//   onSuccess: () => void;
// }

// export default function AddRecordModal({
//   isOpen,
//   onClose,
//   patientId,
//   onSuccess,
// }: AddRecordModalProps) {
//   const [formData, setFormData] = useState({
//     diagnosis: '',
//     symptoms: '',
//     treatment: '',
//     hospitalName: '',
//     visitDate: '',
//     visitType: 'checkup',
//     notes: '',
//     followUpDate: '',
//   });

//   const createRecordMutation = useMutation({
//     mutationFn: async (data: any) => {
//       return await apiClient.createMedicalRecord(data);
//     },
//     onSuccess: () => {
//       onSuccess();
//       resetForm();
//     },
//   });

//   const resetForm = () => {
//     setFormData({
//       diagnosis: '',
//       symptoms: '',
//       treatment: '',
//       hospitalName: '',
//       visitDate: '',
//       visitType: 'checkup',
//       notes: '',
//       followUpDate: '',
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     createRecordMutation.mutate({
//       ...formData,
//       patientId,
//     });
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//           >
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//               {/* Header */}
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <FileText className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">Add Medical Record</h2>
//                     <p className="text-sm text-gray-600">Enter patient's medical information</p>
//                   </div>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.1, rotate: 90 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </motion.button>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                 {/* Diagnosis */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Diagnosis <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="diagnosis"
//                     value={formData.diagnosis}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="Enter diagnosis"
//                   />
//                 </div>

//                 {/* Hospital Name & Visit Type */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Hospital Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="hospitalName"
//                       value={formData.hospitalName}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                       placeholder="Enter hospital name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Visit Type <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="visitType"
//                       value={formData.visitType}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     >
//                       <option value="checkup">Checkup</option>
//                       <option value="emergency">Emergency</option>
//                       <option value="followup">Follow-up</option>
//                       <option value="consultation">Consultation</option>
//                       <option value="surgery">Surgery</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Visit Date & Follow-up Date */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Visit Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="datetime-local"
//                       name="visitDate"
//                       value={formData.visitDate}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Follow-up Date
//                     </label>
//                     <input
//                       type="date"
//                       name="followUpDate"
//                       value={formData.followUpDate}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     />
//                   </div>
//                 </div>

//                 {/* Symptoms */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Symptoms
//                   </label>
//                   <textarea
//                     name="symptoms"
//                     value={formData.symptoms}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="Describe symptoms..."
//                   />
//                 </div>

//                 {/* Treatment */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Treatment
//                   </label>
//                   <textarea
//                     name="treatment"
//                     value={formData.treatment}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="Describe treatment provided..."
//                   />
//                 </div>

//                 {/* Notes */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Additional Notes
//                   </label>
//                   <textarea
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     placeholder="Any additional notes..."
//                   />
//                 </div>

//                 {/* Error Message */}
//                 {createRecordMutation.isError && (
//                   <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
//                     <p className="text-sm text-red-600">
//                       Failed to create medical record. Please try again.
//                     </p>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-4">
//                   <motion.button
//                     type="button"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={onClose}
//                     className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     type="submit"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     disabled={createRecordMutation.isPending}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {createRecordMutation.isPending ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Creating...
//                       </>
//                     ) : (
//                       'Create Record'
//                     )}
//                   </motion.button>
//                 </div>
//               </form>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }


// //healthcare/modals/AddTestModal.tsx
// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, FlaskConical, Loader2, Upload, FileText } from 'lucide-react';
// import { useMutation } from '@tanstack/react-query';
// import apiClient from '@/lib/api';

// interface AddTestModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   patientId: string;
//   onSuccess: () => void;
// }

// export default function AddTestModal({
//   isOpen,
//   onClose,
//   patientId,
//   onSuccess,
// }: AddTestModalProps) {
//   const [formData, setFormData] = useState({
//     testName: '',
//     testType: '',
//     testDate: '',
//     result: '',
//     normalRange: '',
//     status: 'completed',
//     notes: '',
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const createTestMutation = useMutation({
//     mutationFn: async (data: any) => {
//       // First create the test result
//       const response = await apiClient.createTestResult(data);
      
//       // If a file is selected, upload it
//       if (selectedFile && response.data._id) {
//         await apiClient.uploadTestFile(response.data._id, selectedFile);
//       }
      
//       return response;
//     },
//     onSuccess: () => {
//       onSuccess();
//       resetForm();
//     },
//   });

//   const resetForm = () => {
//     setFormData({
//       testName: '',
//       testType: '',
//       testDate: '',
//       result: '',
//       normalRange: '',
//       status: 'completed',
//       notes: '',
//     });
//     setSelectedFile(null);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     createTestMutation.mutate({
//       ...formData,
//       patientId,
//     });
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 20 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//           >
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//               {/* Header */}
//               <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-purple-100 rounded-lg">
//                     <FlaskConical className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">Add Test Result</h2>
//                     <p className="text-sm text-gray-600">Record a new lab test or diagnostic result</p>
//                   </div>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.1, rotate: 90 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-600" />
//                 </motion.button>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="p-6 space-y-4">
//                 {/* Test Name & Type */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Test Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="testName"
//                       value={formData.testName}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                       placeholder="e.g., Complete Blood Count"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Test Type <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="testType"
//                       value={formData.testType}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     >
//                       <option value="">Select type</option>
//                       <option value="Blood Test">Blood Test</option>
//                       <option value="Urine Test">Urine Test</option>
//                       <option value="X-Ray">X-Ray</option>
//                       <option value="MRI">MRI</option>
//                       <option value="CT Scan">CT Scan</option>
//                       <option value="Ultrasound">Ultrasound</option>
//                       <option value="ECG">ECG</option>
//                       <option value="Biopsy">Biopsy</option>
//                       <option value="Culture">Culture</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Test Date & Status */}
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Test Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="datetime-local"
//                       name="testDate"
//                       value={formData.testDate}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Status <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="status"
//                       value={formData.status}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="completed">Completed</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Result */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Test Result <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     name="result"
//                     value={formData.result}
//                     onChange={handleChange}
//                     required
//                     rows={4}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     placeholder="Enter the test results..."
//                   />
//                 </div>

//                 {/* Normal Range */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Normal Range
//                   </label>
//                   <input
//                     type="text"
//                     name="normalRange"
//                     value={formData.normalRange}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     placeholder="e.g., 4.5-5.5 million cells/mcL"
//                   />
//                 </div>

//                 {/* Notes */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Additional Notes
//                   </label>
//                   <textarea
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                     placeholder="Any additional observations or notes..."
//                   />
//                 </div>

//                 {/* File Upload */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Attach Document (Optional)
//                   </label>
//                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
//                     <input
//                       type="file"
//                       id="fileUpload"
//                       onChange={handleFileChange}
//                       accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                       className="hidden"
//                     />
//                     <label htmlFor="fileUpload" className="cursor-pointer">
//                       {selectedFile ? (
//                         <div className="flex items-center justify-center gap-2 text-purple-600">
//                           <FileText className="w-5 h-5" />
//                           <span className="font-medium">{selectedFile.name}</span>
//                           <button
//                             type="button"
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setSelectedFile(null);
//                             }}
//                             className="ml-2 text-red-500 hover:text-red-700"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex flex-col items-center gap-2">
//                           <Upload className="w-8 h-8 text-gray-400" />
//                           <p className="text-sm text-gray-600">
//                             Click to upload or drag and drop
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             PDF, JPG, PNG, DOC (Max 10MB)
//                           </p>
//                         </div>
//                       )}
//                     </label>
//                   </div>
//                 </div>

//                 {/* Error Message */}
//                 {createTestMutation.isError && (
//                   <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
//                     <p className="text-sm text-red-600">
//                       Failed to create test result. Please try again.
//                     </p>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-4">
//                   <motion.button
//                     type="button"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={onClose}
//                     className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//                   >
//                     Cancel
//                   </motion.button>
//                   <motion.button
//                     type="submit"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     disabled={createTestMutation.isPending}
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {createTestMutation.isPending ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Creating...
//                       </>
//                     ) : (
//                       'Create Test Result'
//                     )}
//                   </motion.button>
//                 </div>
//               </form>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }