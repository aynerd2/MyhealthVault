// frontend/app/dashboard/patient/page.tsx

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/app/providers/AuthProvider';
import { motion } from 'framer-motion';
import { FileText, TestTube, Pill, Clock, Download, Eye, Calendar, Heart } from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['patient']}>
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
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600">Your health dashboard and records</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Medical Records"
              value="12"
              icon={FileText}
              color="from-blue-500 to-blue-600"
              subtitle="From all hospitals"
              index={0}
            />
            <StatCard
              title="Test Results"
              value="8"
              icon={TestTube}
              color="from-green-500 to-green-600"
              subtitle="2 new results"
              index={1}
            />
            <StatCard
              title="Prescriptions"
              value="3"
              icon={Pill}
              color="from-purple-500 to-purple-600"
              subtitle="Active medications"
              index={2}
            />
            <StatCard
              title="Upcoming"
              value="2"
              icon={Clock}
              color="from-orange-500 to-orange-600"
              subtitle="Appointments"
              index={3}
            />
          </div>

          {/* Health Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Health Summary</h2>
                <p className="text-blue-100">Your latest vital signs</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Blood Pressure', value: '120/80', unit: 'mmHg' },
                { label: 'Heart Rate', value: '72', unit: 'bpm' },
                { label: 'Temperature', value: '98.6', unit: '°F' },
                { label: 'Weight', value: '70', unit: 'kg' },
              ].map((vital, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="p-4 bg-white/10 backdrop-blur-xl rounded-xl"
                >
                  <p className="text-xs text-blue-100 mb-1">{vital.label}</p>
                  <p className="text-2xl font-bold">{vital.value}</p>
                  <p className="text-xs text-blue-100">{vital.unit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Test Results */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Test Results</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  2 New
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { 
                    test: 'Complete Blood Count', 
                    date: 'Today',
                    hospital: 'General City Hospital',
                    status: 'new',
                    color: 'blue'
                  },
                  { 
                    test: 'X-Ray Chest', 
                    date: 'Yesterday',
                    hospital: 'General City Hospital',
                    status: 'new',
                    color: 'blue'
                  },
                  { 
                    test: 'Lipid Profile', 
                    date: '3 days ago',
                    hospital: 'Metropolitan Health',
                    status: 'viewed',
                    color: 'gray'
                  },
                ].map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${result.color}-500 rounded-lg`}>
                        <TestTube className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{result.test}</p>
                        <p className="text-xs text-gray-600">{result.hospital}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-600">{result.date}</p>
                        {result.status === 'new' && (
                          <span className="text-xs text-blue-600 font-semibold">New</span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Active Prescriptions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Active Prescriptions</h2>
              <div className="space-y-4">
                {[
                  { 
                    medication: 'Amoxicillin 500mg', 
                    dosage: '3 times daily',
                    remaining: '7 days',
                    doctor: 'Dr. Smith',
                    color: 'purple'
                  },
                  { 
                    medication: 'Lisinopril 10mg', 
                    dosage: 'Once daily',
                    remaining: '23 days',
                    doctor: 'Dr. Johnson',
                    color: 'green'
                  },
                  { 
                    medication: 'Metformin 850mg', 
                    dosage: 'Twice daily',
                    remaining: '15 days',
                    doctor: 'Dr. Smith',
                    color: 'blue'
                  },
                ].map((prescription, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${prescription.color}-500 rounded-lg`}>
                          <Pill className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{prescription.medication}</p>
                          <p className="text-sm text-gray-600">{prescription.dosage}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">Prescribed by {prescription.doctor}</p>
                      </div>
                      <span className={`px-2 py-1 bg-${prescription.color}-100 text-${prescription.color}-700 text-xs font-semibold rounded-full`}>
                        {prescription.remaining} left
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  doctor: 'Dr. Sarah Johnson', 
                  specialty: 'Cardiologist',
                  date: 'Tomorrow',
                  time: '10:00 AM',
                  hospital: 'General City Hospital',
                  type: 'Follow-up'
                },
                { 
                  doctor: 'Dr. Michael Chen', 
                  specialty: 'General Physician',
                  date: 'Dec 15, 2025',
                  time: '2:30 PM',
                  hospital: 'Metropolitan Health',
                  type: 'Check-up'
                },
              ].map((appointment, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900 mb-1">{appointment.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      {appointment.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {appointment.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appointment.time}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{appointment.hospital}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}