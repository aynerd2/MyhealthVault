// frontend/app/dashboard/department/page.tsx

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/app/providers/AuthProvider';
import { motion } from 'framer-motion';
import { Clock, TestTube, CheckCircle, Upload, AlertCircle, DollarSign } from 'lucide-react';

export default function DepartmentDashboard() {
  const { departmentName } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['department_staff']}>
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
                Department Dashboard
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                {departmentName || 'Loading...'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Result
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Pending Payment"
              value="5"
              icon={Clock}
              color="from-orange-500 to-orange-600"
              subtitle="Awaiting payment"
              index={0}
            />
            <StatCard
              title="Ready for Upload"
              value="2"
              icon={Upload}
              color="from-blue-500 to-blue-600"
              subtitle="Payment confirmed"
              index={1}
            />
            <StatCard
              title="In Progress"
              value="3"
              icon={TestTube}
              color="from-purple-500 to-purple-600"
              subtitle="Currently testing"
              index={2}
            />
            <StatCard
              title="Completed Today"
              value="8"
              icon={CheckCircle}
              color="from-green-500 to-green-600"
              subtitle="Tests uploaded"
              trend={{ value: '20%', isPositive: true }}
              index={3}
            />
          </div>

          {/* Test Queue Priority */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ready for Upload</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                2 Tests Ready
              </span>
            </div>
            <div className="space-y-4">
              {[
                { 
                  patient: 'John Doe', 
                  test: 'Complete Blood Count (CBC)', 
                  ordered: 'Dr. Smith', 
                  time: '2 hours ago',
                  paymentStatus: 'paid',
                  urgency: 'routine'
                },
                { 
                  patient: 'Jane Smith', 
                  test: 'X-Ray Chest', 
                  ordered: 'Dr. Johnson', 
                  time: '1 hour ago',
                  paymentStatus: 'paid',
                  urgency: 'urgent'
                },
              ].map((test, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className={`p-5 rounded-xl border-l-4 ${
                    test.urgency === 'urgent' 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-blue-50 border-blue-500'
                  } hover:shadow-lg transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{test.patient}</h3>
                        {test.urgency === 'urgent' && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                            URGENT
                          </span>
                        )}
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          PAID
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-semibold mb-1">{test.test}</p>
                      <p className="text-xs text-gray-600">Ordered by {test.ordered} • {test.time}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Payment */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pending Payment</h2>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">
                  5 Tests
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { patient: 'Bob Johnson', test: 'Lipid Profile', amount: '$45', time: '30 min ago' },
                  { patient: 'Alice Brown', test: 'Urinalysis', amount: '$20', time: '1 hour ago' },
                  { patient: 'Charlie Davis', test: 'Blood Sugar', amount: '$30', time: '2 hours ago' },
                ].map((test, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border border-orange-200"
                  >
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{test.patient}</p>
                      <p className="text-xs text-gray-600">{test.test}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-700">{test.amount}</p>
                      <p className="text-xs text-gray-500">{test.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recently Completed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recently Completed</h2>
              <div className="space-y-3">
                {[
                  { patient: 'Emma Wilson', test: 'CT Scan', time: '10 min ago', status: 'uploaded' },
                  { patient: 'David Lee', test: 'MRI Brain', time: '30 min ago', status: 'uploaded' },
                  { patient: 'Sarah Miller', test: 'ECG', time: '1 hour ago', status: 'uploaded' },
                ].map((test, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200"
                  >
                    <div className="p-2 bg-green-500 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{test.patient}</p>
                      <p className="text-xs text-gray-600">{test.test}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-green-700 font-semibold">{test.status}</span>
                      <p className="text-xs text-gray-500">{test.time}</p>
                    </div>
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