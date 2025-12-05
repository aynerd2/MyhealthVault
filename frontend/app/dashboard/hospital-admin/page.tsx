// frontend/app/dashboard/hospital-admin/page.tsx

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/app/providers/AuthProvider';
import { motion } from 'framer-motion';
import { Building2, Users, TestTube, FileText, Plus, Clock } from 'lucide-react';

export default function HospitalAdminDashboard() {
  const { hospitalName } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['hospital_admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Hospital Dashboard
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {hospitalName || 'Loading...'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Staff
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Departments"
              value="4"
              icon={Building2}
              color="from-blue-500 to-blue-600"
              subtitle="Active departments"
              index={0}
            />
            <StatCard
              title="Total Staff"
              value="45"
              icon={Users}
              color="from-green-500 to-green-600"
              subtitle="Doctors, nurses, staff"
              trend={{ value: '5%', isPositive: true }}
              index={1}
            />
            <StatCard
              title="Patients"
              value="238"
              icon={FileText}
              color="from-purple-500 to-purple-600"
              subtitle="Active patients"
              trend={{ value: '12%', isPositive: true }}
              index={2}
            />
            <StatCard
              title="Pending Tests"
              value="12"
              icon={TestTube}
              color="from-orange-500 to-orange-600"
              subtitle="Awaiting results"
              index={3}
            />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Manage Departments', icon: Building2, color: 'from-blue-500 to-blue-600', href: '/dashboard/hospital-admin/departments' },
                { title: 'Staff Directory', icon: Users, color: 'from-green-500 to-green-600', href: '/dashboard/hospital-admin/staff' },
                { title: 'Pending Approvals', icon: Clock, color: 'from-orange-500 to-orange-600', badge: '5', href: '/dashboard/hospital-admin/approvals' },
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-lg transition-all text-left"
                >
                  <div className={`p-3 bg-gradient-to-br ${action.color} rounded-xl inline-flex mb-4 shadow-lg`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  {action.badge && (
                    <span className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {action.badge}
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage and configure</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'New staff member approved', user: 'Dr. Sarah Johnson', time: '10 minutes ago', type: 'success' },
                { action: 'Department created', user: 'Radiology Department', time: '2 hours ago', type: 'info' },
                { action: 'Staff approval pending', user: 'John Smith - Lab Tech', time: '5 hours ago', type: 'warning' },
              ].map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:shadow-md transition-all"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}