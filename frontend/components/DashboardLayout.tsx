// frontend/components/DashboardLayout.tsx - UPDATED WITH CONSISTENT DESIGN

'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  TestTube, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Activity,
  Stethoscope,
  FlaskConical,
  UserCircle,
  Shield,
  Clock,
  Tablets,
  Calendar
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, hospitalName, departmentName } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    const baseItems: NavItem[] = [
      { label: 'Dashboard', href: `/dashboard/${user.role.replace('_', '-')}`, icon: LayoutDashboard },
    ];

    switch (user.role) {
      case 'super_admin':
        return [
          ...baseItems,
          { label: 'Hospitals', href: '/dashboard/super-admin/hospitals', icon: Building2 },
          { label: 'Pending Approvals', href: '/dashboard/super-admin/approvals', icon: Clock, badge: '3', badgeColor: 'bg-orange-500' },
          { label: 'Sharing Requests', href: '/dashboard/super-admin/sharing', icon: Users, badge: '2', badgeColor: 'bg-blue-500' },
          { label: 'System Settings', href: '/dashboard/super-admin/settings', icon: Settings },
        ];

      case 'hospital_admin':
        return [
          ...baseItems,
          { label: 'Departments', href: '/dashboard/hospital-admin/departments', icon: Building2 },
          { label: 'Staff', href: '/dashboard/hospital-admin/staff', icon: Users },
          { label: 'Pending Approvals', href: '/dashboard/hospital-admin/approvals', icon: Clock, badge: '5', badgeColor: 'bg-orange-500' },
          { label: 'Settings', href: '/dashboard/hospital-admin/settings', icon: Settings },
        ];

      case 'doctor':
        return [
          ...baseItems,
          { label: 'Patients', href: '/dashboard/doctor/patients', icon: Users },
          { label: 'Medical Records', href: '/dashboard/doctor/records', icon: FileText },
          { label: 'Test Orders', href: '/dashboard/doctor/tests', icon: TestTube, badge: '8', badgeColor: 'bg-blue-500' },
          { label: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: Tablets },
        ];

      case 'nurse':
        return [
          ...baseItems,
          { label: 'Patients', href: '/dashboard/nurse/patients', icon: Users },
          { label: 'Records', href: '/dashboard/nurse/records', icon: FileText },
          { label: 'Schedules', href: '/dashboard/nurse/schedules', icon: Calendar },
        ];

      case 'department_staff':
        return [
          ...baseItems,
          { label: 'Pending Tests', href: '/dashboard/department/pending', icon: Clock, badge: '5', badgeColor: 'bg-orange-500' },
          { label: 'Ready for Upload', href: '/dashboard/department/ready', icon: TestTube, badge: '2', badgeColor: 'bg-green-500' },
          { label: 'Completed', href: '/dashboard/department/completed', icon: FlaskConical },
        ];

      case 'patient':
        return [
          ...baseItems,
          { label: 'Medical Records', href: '/dashboard/patient/records', icon: FileText },
          { label: 'Test Results', href: '/dashboard/patient/tests', icon: TestTube, badge: '2', badgeColor: 'bg-blue-500' },
          { label: 'Prescriptions', href: '/dashboard/patient/prescriptions', icon: Tablets },
          { label: 'Appointments', href: '/dashboard/patient/appointments', icon: Calendar },
        ];

      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'super_admin': return <Shield className="w-5 h-5" />;
      case 'hospital_admin': return <Shield className="w-5 h-5" />;
      case 'doctor': return <Stethoscope className="w-5 h-5" />;
      case 'nurse': return <Activity className="w-5 h-5" />;
      case 'department_staff': return <FlaskConical className="w-5 h-5" />;
      case 'patient': return <UserCircle className="w-5 h-5" />;
      default: return <UserCircle className="w-5 h-5" />;
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      case 'super_admin': return 'Super Admin';
      case 'hospital_admin': return 'Hospital Admin';
      case 'doctor': return 'Doctor';
      case 'nurse': return 'Nurse';
      case 'department_staff': return 'Department Staff';
      case 'patient': return 'Patient';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-white/20">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg"
              >
                <Activity className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HealthVault
              </span>
            </div>

            {/* Hospital/Department Info */}
            {(hospitalName || departmentName) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-3 mt-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50"
              >
                {hospitalName && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    {/* <Hospital className="w-4 h-4 text-blue-600" /> */}
                    <span className="font-semibold truncate">{hospitalName}</span>
                  </div>
                )}
                {departmentName && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Building2 className="w-3 h-3 text-purple-600" />
                    <span className="truncate">{departmentName}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                        : 'text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`px-2 py-0.5 ${item.badgeColor || 'bg-red-500'} text-white text-xs font-bold rounded-full shadow-lg`}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* User Profile in Sidebar */}
            <div className="p-4 border-t border-white/20">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 mb-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"
              >
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl text-white shadow-lg">
                  {getRoleIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{getRoleName()}</p>
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:pl-64 relative">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
            >
              <Menu className="w-6 h-6" />
            </motion.button>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients, records..."
                  className="w-full pl-12 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all"
              >
                <Bell className="w-5 h-5" />
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-lg"
                />
              </motion.button>

              {/* Profile Dropdown */}
              <div className="hidden lg:block relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-3 py-2 bg-white/50 hover:bg-white/80 rounded-xl transition-all"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{getRoleName()}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: profileOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </motion.div>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 overflow-hidden"
                    >
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        onClick={() => {
                          router.push('/profile');
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-gray-900 flex items-center gap-3 transition-all"
                      >
                        <UserCircle className="w-4 h-4" />
                        Profile Settings
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        onClick={() => {
                          router.push('/settings');
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-gray-900 flex items-center gap-3 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </motion.button>
                      <div className="my-2 border-t border-gray-200" />
                      <motion.button
                        whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:text-red-700 flex items-center gap-3 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}