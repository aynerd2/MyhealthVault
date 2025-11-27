'use client';

import { useAuth } from '@/app/providers/AuthProvider'; 
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Activity, FileText, Pill, ClipboardList, Calendar, 
  LogOut, User, Heart, TrendingUp, AlertCircle,
  Download, Eye, ChevronRight, Bell, Settings, Search,
  Phone, Mail, MapPin, Droplet, X
} from 'lucide-react';
import {apiClient} from '@/lib/api';
import { useRoleProtection } from '@/lib/useRoleProtection';



export default function PatientDashboard() {

  const { user, isAuthenticated, loading, logout } = useAuth();
  const { isAuthorized, isChecking } = useRoleProtection(['patient']);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);



 const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.getProfile();
      return res.data;
    },
  });

  const { data: medicalRecords = [] } = useQuery({
    queryKey: ['medicalRecords', profile?._id],
    queryFn: async () => {
      const res = await apiClient.getMedicalRecords(profile._id);
      return res.data;
    },
    enabled: !!profile?._id,
  });

  const { data: prescriptions = [] } = useQuery({
    queryKey: ['prescriptions', profile?._id],
    queryFn: async () => {
      const res = await apiClient.getPrescriptions(profile._id);
      return res.data;
    },
    enabled: !!profile?._id,
  });

  const { data: testResults = [] } = useQuery({
    queryKey: ['testResults', profile?._id],
    queryFn: async () => {
      const res = await apiClient.getTestResults(profile._id);
      return res.data;
    },
    enabled: !!profile?._id,
  });

  const stats = [
    {
      label: 'Medical Records',
      value: medicalRecords.length,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Active Prescriptions',
      value: prescriptions.filter((p: any) => p.isActive).length,
      icon: Pill,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Test Results',
      value: testResults.length,
      icon: ClipboardList,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Hospitals Visited',
      value: new Set(medicalRecords.map((r: any) => r.hospitalName)).size,
      icon: ClipboardList,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'tests', label: 'Test Results', icon: ClipboardList },
  ];

  // Show loading state while checking authorization
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 text-lg">Verifying access...</p>
        </motion.div>
      </div>
    );
  }

  // Only render if authorized
  if (!isAuthorized) {
    return null; // Already redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl"
              >
                <Activity className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Health Vault</h1>
                <p className="text-sm text-gray-600">Patient Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {profile?.firstName} {profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-600">{profile?.email}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <nav className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Patient Info Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Welcome back, {profile?.firstName}! 👋
                    </h2>
                    <p className="text-gray-600">Here's your health overview</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date of Birth
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {profile?.dateOfBirth ? format(new Date(profile.dateOfBirth), 'MMM dd, yyyy') : 'Not set'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Gender
                    </p>
                    <p className="text-base font-semibold text-gray-900">{profile?.gender || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Droplet className="w-4 h-4" />
                      Blood Type
                    </p>
                    <p className="text-base font-semibold text-gray-900">{profile?.bloodType || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </p>
                    <p className="text-base font-semibold text-gray-900">{profile?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-blue-600 font-semibold text-sm flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {medicalRecords.slice(0, 5).map((record: any, index: number) => (
                    <motion.div
                      key={record._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl cursor-pointer"
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{record.diagnosis}</p>
                        <p className="text-sm text-gray-600">
                          {record.hospitalName} • Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(record.visitDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  ))}
                  {medicalRecords.length === 0 && (
                    <div className="text-center py-12">
                      <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600">No medical records yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Medical Records</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search records..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {medicalRecords.map((record: any) => (
                  <motion.div
                    key={record._id}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{record.diagnosis}</h3>
                        <p className="text-sm text-gray-600">{record.hospitalName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                          {record.visitType}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                          {format(new Date(record.visitDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Doctor:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}
                        </span>
                      </div>
                      {record.treatment && (
                        <div>
                          <span className="text-gray-600">Treatment:</span>
                          <span className="ml-2 font-medium text-gray-900">{record.treatment}</span>
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ x: 5 }}
                      className="mt-4 text-blue-600 font-semibold text-sm flex items-center gap-2"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <motion.div
              key="prescriptions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {prescriptions.map((prescription: any) => (
                  <motion.div
                    key={prescription._id}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-xl border-2 ${
                      prescription.isActive 
                        ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
                        : 'border-gray-200 bg-gray-50'
                    } shadow-lg`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${prescription.isActive ? 'bg-green-100' : 'bg-gray-200'}`}>
                          <Pill className={`w-6 h-6 ${prescription.isActive ? 'text-green-600' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{prescription.medicationName}</h3>
                          <p className="text-sm text-gray-600">{prescription.dosage}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        prescription.isActive 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {prescription.isActive ? 'Active' : 'Completed'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Frequency</span>
                        <span className="font-semibold text-gray-900">{prescription.frequency}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-semibold text-gray-900">{prescription.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Prescribed by</span>
                        <span className="font-semibold text-gray-900">
                          Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Prescribed on {format(new Date(prescription.prescribedDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Test Results Tab */}
          {activeTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Results</h2>
              
              <div className="space-y-4">
                {testResults.map((test: any) => (
                  <motion.div
                    key={test._id}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{test.testName}</h3>
                        <p className="text-sm text-gray-600">{test.testType}</p>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                        {format(new Date(test.testDate), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Result:</p>
                      <p className="font-medium text-gray-900">{test.result}</p>
                    </div>

                    {test.fileUrl && (
                      <motion.a
                        whileHover={{ x: 5 }}
                        href={test.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                      </motion.a>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Record Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-2xl font-bold text-gray-900">Medical Record Details</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedRecord.diagnosis}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(selectedRecord.visitDate), 'MMMM dd, yyyy')}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hospital</p>
                    <p className="font-semibold text-gray-900">{selectedRecord.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Doctor</p>
                    <p className="font-semibold text-gray-900">
                      Dr. {selectedRecord.doctorId?.firstName} {selectedRecord.doctorId?.lastName}
                    </p>
                  </div>
                </div>

                {selectedRecord.symptoms && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Symptoms</p>
                    <p className="text-gray-900">{selectedRecord.symptoms}</p>
                  </div>
                )}

                {selectedRecord.treatment && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Treatment</p>
                    <p className="text-gray-900">{selectedRecord.treatment}</p>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Notes</p>
                    <p className="text-gray-900">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}