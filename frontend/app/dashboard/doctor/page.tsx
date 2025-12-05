// frontend/app/dashboard/doctor/page.tsx

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { motion } from 'framer-motion';
import { Users, FileText, TestTube, Clock, Search, Plus } from 'lucide-react';

export default function DoctorDashboard() {
  return (
    <ProtectedRoute allowedRoles={['doctor']}>
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
                Doctor Dashboard
              </h1>
              <p className="text-gray-600">Manage your patients and medical records</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Record
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="My Patients"
              value="45"
              icon={Users}
              color="from-blue-500 to-blue-600"
              subtitle="Active patients"
              index={0}
            />
            <StatCard
              title="Records Today"
              value="8"
              icon={FileText}
              color="from-green-500 to-green-600"
              subtitle="Created today"
              index={1}
            />
            <StatCard
              title="Pending Tests"
              value="12"
              icon={TestTube}
              color="from-orange-500 to-orange-600"
              subtitle="Awaiting results"
              index={2}
            />
            <StatCard
              title="Appointments"
              value="6"
              icon={Clock}
              color="from-purple-500 to-purple-600"
              subtitle="Today's schedule"
              index={3}
            />
          </div>

          {/* Patient Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Find Patient</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Schedule</h2>
              <div className="space-y-4">
                {[
                  { time: '09:00 AM', patient: 'John Doe', type: 'Check-up', color: 'blue' },
                  { time: '10:30 AM', patient: 'Jane Smith', type: 'Follow-up', color: 'green' },
                  { time: '02:00 PM', patient: 'Bob Johnson', type: 'Consultation', color: 'purple' },
                ].map((appointment, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className={`w-1 h-16 bg-${appointment.color}-500 rounded-full`} />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{appointment.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Created medical record', patient: 'John Doe', time: '10 min ago' },
                  { action: 'Ordered blood test', patient: 'Jane Smith', time: '1 hour ago' },
                  { action: 'Updated prescription', patient: 'Bob Johnson', time: '3 hours ago' },
                ].map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl"
                  >
                    <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.patient}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}