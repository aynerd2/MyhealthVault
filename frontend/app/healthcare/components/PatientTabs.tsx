'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Pill, FlaskConical, Calendar, Building, User, CheckCircle, XCircle, Download, Eye } from 'lucide-react';

interface PatientTabsProps {
  activeView: string;
  setActiveView: (view: string) => void;
  patientRecords: any[];
  patientPrescriptions: any[];
  patientTests: any[];
}

export default function PatientTabs({
  activeView,
  setActiveView,
  patientRecords,
  patientPrescriptions,
  patientTests,
}: PatientTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'records', label: 'Medical Records', icon: FileText, count: patientRecords.length },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, count: patientPrescriptions.length },
    { id: 'tests', label: 'Test Results', icon: FlaskConical, count: patientTests.length },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all relative whitespace-nowrap ${
                activeView === tab.id
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeView === tab.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              )}
              {activeView === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeView === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Summary</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-blue-600">{patientRecords.length}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {patientPrescriptions.filter((p: any) => p.isActive).length}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Test Results</p>
                  <p className="text-2xl font-bold text-purple-600">{patientTests.length}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {patientRecords.slice(0, 3).map((record: any) => (
                  <div key={record._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{record.diagnosis}</p>
                      <p className="text-sm text-gray-600">{formatDate(record.visitDate)}</p>
                    </div>
                  </div>
                ))}
                {patientRecords.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No medical records yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Medical Records Tab */}
        {activeView === 'records' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {patientRecords.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No medical records found</p>
              </div>
            ) : (
              patientRecords.map((record: any) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{record.diagnosis}</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {record.visitType}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(record.visitDate)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Hospital:</span>
                      <span>{record.hospitalName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Doctor:</span>
                      <span>Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}</span>
                    </div>
                  </div>

                  {record.symptoms && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Symptoms:</p>
                      <p className="text-sm text-gray-600">{record.symptoms}</p>
                    </div>
                  )}

                  {record.treatment && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Treatment:</p>
                      <p className="text-sm text-gray-600">{record.treatment}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                      <p className="text-sm text-gray-600">{record.notes}</p>
                    </div>
                  )}

                  {record.followUpDate && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Follow-up:</span> {formatDate(record.followUpDate)}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Prescriptions Tab */}
        {activeView === 'prescriptions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {patientPrescriptions.length === 0 ? (
              <div className="text-center py-12">
                <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No prescriptions found</p>
              </div>
            ) : (
              patientPrescriptions.map((prescription: any) => (
                <motion.div
                  key={prescription._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{prescription.medication}</h4>
                      <p className="text-sm text-gray-600">{prescription.dosage}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {prescription.isActive ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Frequency</p>
                      <p className="text-sm font-medium text-gray-900">{prescription.frequency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-sm font-medium text-gray-900">{prescription.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Prescribed By</p>
                      <p className="text-sm font-medium text-gray-900">
                        Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Prescribed On</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(prescription.createdAt)}</p>
                    </div>
                  </div>

                  {prescription.instructions && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Instructions:</p>
                      <p className="text-sm text-blue-800">{prescription.instructions}</p>
                    </div>
                  )}

                  {prescription.sideEffects && (
                    <div className="mb-3 p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs font-semibold text-orange-900 mb-1">Possible Side Effects:</p>
                      <p className="text-sm text-orange-800">{prescription.sideEffects}</p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Test Results Tab */}
        {activeView === 'tests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {patientTests.length === 0 ? (
              <div className="text-center py-12">
                <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No test results found</p>
              </div>
            ) : (
              patientTests.map((test: any) => (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{test.testName}</h4>
                      <p className="text-sm text-gray-600">{test.testType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatDateTime(test.testDate)}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                        test.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        test.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {test.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ordered By</p>
                      <p className="text-sm font-medium text-gray-900">
                        {test.orderedBy?.firstName} {test.orderedBy?.lastName}
                      </p>
                    </div>
                  </div>

                  {test.result && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Results:</p>
                      <p className="text-sm text-gray-900">{test.result}</p>
                    </div>
                  )}

                  {test.normalRange && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Normal Range</p>
                      <p className="text-sm font-medium text-gray-700">{test.normalRange}</p>
                    </div>
                  )}

                  {test.notes && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{test.notes}</p>
                    </div>
                  )}

                  {test.fileUrl && (
                    <div className="flex gap-2">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={test.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Document
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={test.fileUrl}
                        download
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </motion.a>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}