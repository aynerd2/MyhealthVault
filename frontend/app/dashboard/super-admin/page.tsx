// frontend/app/dashboard/super-admin/page.tsx

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { motion } from 'framer-motion';
import { Building2, Users, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';

export default function SuperAdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
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
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600">Platform-wide overview and management</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Add Hospital
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Hospitals"
              value="24"
              icon={Building2}
              color="from-blue-500 to-blue-600"
              subtitle="2 hospitals registered"
              trend={{ value: '12%', isPositive: true }}
              index={0}
            />
            <StatCard
              title="Pending Approvals"
              value="3"
              icon={Clock}
              color="from-orange-500 to-orange-600"
              subtitle="Requires attention"
              index={1}
            />
            <StatCard
              title="Active Users"
              value="1,234"
              icon={Users}
              color="from-green-500 to-green-600"
              subtitle="Across all hospitals"
              trend={{ value: '8%', isPositive: true }}
              index={2}
            />
            <StatCard
              title="Sharing Requests"
              value="5"
              icon={CheckCircle}
              color="from-purple-500 to-purple-600"
              subtitle="Pending review"
              index={3}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Hospitals */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Hospitals</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All
                </motion.button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'General City Hospital', status: 'approved', date: '2 hours ago', color: 'green' },
                  { name: 'Metropolitan Health Center', status: 'pending', date: '5 hours ago', color: 'orange' },
                  { name: 'St. Mary\'s Medical Center', status: 'approved', date: '1 day ago', color: 'green' },
                ].map((hospital, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{hospital.name}</p>
                        <p className="text-xs text-gray-600">{hospital.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 bg-${hospital.color}-100 text-${hospital.color}-700 text-xs font-semibold rounded-full`}>
                      {hospital.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* System Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">System Alerts</h2>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                  3 New
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Hospital approval needed', message: 'Metropolitan Health Center awaiting review', type: 'warning', time: '10 min ago' },
                  { title: 'Sharing request', message: 'Hospital A requested access to Hospital B records', type: 'info', time: '1 hour ago' },
                  { title: 'Subscription expiring', message: 'City Medical Center subscription ends in 7 days', type: 'warning', time: '3 hours ago' },
                ].map((alert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-l-4 ${
                      alert.type === 'warning' 
                        ? 'bg-orange-50 border-orange-500' 
                        : 'bg-blue-50 border-blue-500'
                    } hover:shadow-md transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        alert.type === 'warning' ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">{alert.title}</p>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Activity Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Platform Activity
            </h2>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Activity chart coming soon...</p>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}