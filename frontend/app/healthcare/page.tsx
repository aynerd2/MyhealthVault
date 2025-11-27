'use client';

import { useRoleProtection } from '@/lib/useRoleProtection';
import { useAuth } from '@/app/providers/AuthProvider'; 
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'; 
import {apiClient} from '@/lib/api';
import HealthcareHeader from './components/HealthcareHeader';
import PatientSearch from './components/PatientSearch';
import PatientDetails from './components/PatientDetails';
import PatientStats from './components/PatientStats';
import ActionButtons from './components/ActionButtons';
import PatientTabs from './components/PatientTabs';
import AddRecordModal from './components/modals/AddRecordModal';
import AddPrescriptionModal from './components/modals/AddPrescriptionModal';
import AddTestModal from './components/modals/AddTestModal';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function HealthcareDashboard() {

 // ⚠️ CRITICAL: Role protection - only allow healthcare workers
  const { isAuthorized, isChecking } = useRoleProtection(['doctor', 'nurse', 'admin']);



  const { user } = useAuth(); 
  
  const queryClient = useQueryClient();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [activeView, setActiveView] = useState('overview');

 

   // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await apiClient.getProfile();
      return res.data;
    },
  });

  // Search patients
  const { data: searchResults = [], isLoading: searching } = useQuery({
    queryKey: ['patientSearch', searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 2) return [];
      const res = await apiClient.searchPatients(searchQuery);
      return res.data;
    },
    enabled: searchQuery.length >= 2,
  });

  // Fetch selected patient's data
  const { data: patientRecords = [] } = useQuery({
    queryKey: ['patientRecords', selectedPatient?._id],
    queryFn: async () => {
      const res = await apiClient.getMedicalRecords(selectedPatient._id);
      return res.data;
    },
    enabled: !!selectedPatient?._id,
  });

  const { data: patientPrescriptions = [] } = useQuery({
    queryKey: ['patientPrescriptions', selectedPatient?._id],
    queryFn: async () => {
      const res = await apiClient.getPrescriptions(selectedPatient._id);
      return res.data;
    },
    enabled: !!selectedPatient?._id,
  });

  const { data: patientTests = [] } = useQuery({
    queryKey: ['patientTests', selectedPatient?._id],
    queryFn: async () => {
      const res = await apiClient.getTestResults(selectedPatient._id);
      return res.data;
    },
    enabled: !!selectedPatient?._id,
  });

  // Handlers
  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setActiveView('overview');
  };

  const handleClosePatient = () => {
    setSelectedPatient(null);
  };

  const handleRecordSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['patientRecords'] });
    setShowAddRecordModal(false);
  };

  const handlePrescriptionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['patientPrescriptions'] });
    setShowAddPrescriptionModal(false);
  };

  const handleTestSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['patientTests'] });
    setShowAddTestModal(false);
  };

  // Show loading state while checking authorization
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <HealthcareHeader profile={profile} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Patient Search */}
          <PatientSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            searching={searching}
            selectedPatient={selectedPatient}
            onSelectPatient={handleSelectPatient}
          />

          {/* Right Panel - Patient Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {!selectedPatient ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="inline-block p-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-6">
                  <Users className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select a Patient</h3>
                <p className="text-gray-600">Search and select a patient to view their records</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Patient Details Header */}
                <PatientDetails 
                  patient={selectedPatient}
                  onClose={handleClosePatient}
                />

                {/* Quick Stats */}
                <PatientStats
                  recordsCount={patientRecords.length}
                  activePrescriptionsCount={patientPrescriptions.filter((p: any) => p.isActive).length}
                  testsCount={patientTests.length}
                />

                {/* Action Buttons */}
                <ActionButtons
                  onAddRecord={() => setShowAddRecordModal(true)}
                  onPrescribe={() => setShowAddPrescriptionModal(true)}
                  onAddTest={() => setShowAddTestModal(true)}
                />

                {/* Tabs with Patient Data */}
                <PatientTabs
                  activeView={activeView}
                  setActiveView={setActiveView}
                  patientRecords={patientRecords}
                  patientPrescriptions={patientPrescriptions}
                  patientTests={patientTests}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AddRecordModal
        isOpen={showAddRecordModal}
        onClose={() => setShowAddRecordModal(false)}
        patientId={selectedPatient?._id}
        onSuccess={handleRecordSuccess}
      />

      <AddPrescriptionModal
        isOpen={showAddPrescriptionModal}
        onClose={() => setShowAddPrescriptionModal(false)}
        patientId={selectedPatient?._id}
        onSuccess={handlePrescriptionSuccess}
      />

      <AddTestModal
        isOpen={showAddTestModal}
        onClose={() => setShowAddTestModal(false)}
        patientId={selectedPatient?._id}
        onSuccess={handleTestSuccess}
      />
    </div>
  );
}