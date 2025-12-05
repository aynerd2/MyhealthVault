// frontend/app/dashboard/doctor/tests/page.tsx

'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  TestTube, 
  Plus, 
  Search, 
  Loader2, 
  User,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  Eye
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/app/providers/AuthProvider';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
}

interface Department {
  _id: string;
  name: string;
  code: string;
  type: string;
}

interface TestOrder {
  paymentAmount: number;
  _id: string;
  patientId: Patient;
  doctorId: any;
  departmentId: Department;
  testType: string;
  description?: string;
  amount: number;
  paymentStatus: string;
  status: string;
  resultFileUrl?: string;
  notes?: string;
  createdAt: string;
}

export default function DoctorTestOrdersPage() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
const [paymentLoading, setPaymentLoading] = useState(false);



  useEffect(() => {
    fetchTestOrders();
  }, []);


  const fetchTestOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ count: number; data: TestOrder[] }>('/test-orders/doctor/my-orders');
      setTestOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch test orders:', error);
    } finally {
      setLoading(false);
    }
  };


const handleConfirmPayment = async () => {
  if (!selectedOrder) return;

  setPaymentLoading(true);
  try {
    await api.post(`/test-orders/${selectedOrder._id}/payment`, {
      paymentMethod: 'cash',
      transactionId: `TXN-${Date.now()}`,
    });

    // Refresh orders
    await fetchTestOrders();
    
    setShowPaymentModal(false);
    setSelectedOrder(null);
  } catch (error: any) {
    console.error('Payment confirmation failed:', error);
    alert(error.message || 'Payment confirmation failed');
  } finally {
    setPaymentLoading(false);
  }
};




  const filteredOrders = testOrders.filter(order => 
    order.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${order.patientId.firstName} ${order.patientId.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Test Orders
              </h1>
              <p className="text-gray-600">Create and manage patient test orders</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Test Order
            </motion.button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search test orders by patient name or test type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <StatCard
              title="Total Orders"
              value={testOrders.length}
              icon={TestTube}
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Pending Payment"
              value={testOrders.filter(o => o.paymentStatus === 'pending').length}
              icon={Clock}
              color="from-orange-500 to-orange-600"
            />
            <StatCard
              title="In Progress"
              value={testOrders.filter(o => o.status === 'in_progress').length}
              icon={Loader2}
              color="from-purple-500 to-purple-600"
            />
            <StatCard
              title="Completed"
              value={testOrders.filter(o => o.status === 'completed').length}
              icon={CheckCircle}
              color="from-green-500 to-green-600"
            />
          </motion.div>

          {/* Test Orders List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredOrders.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {filteredOrders.map((order, index) => (
                <TestOrderCard
                  key={order._id}
                  order={order}
                  index={index}
                  onPayment={() => {
                    setSelectedOrder(order);
                    setShowPaymentModal(true);
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No test orders yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first test order to get started
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create First Test Order
              </motion.button>
            </motion.div>
          )}

          {/* Create Modal */}
          <AnimatePresence>
            {showCreateModal && (
              <CreateTestOrderModal
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                  setShowCreateModal(false);
                  fetchTestOrders();
                }}
              />
            )}
          </AnimatePresence>


          <AnimatePresence>
            {showPaymentModal && selectedOrder && (
              <PaymentModal
                order={selectedOrder}
                onClose={() => {
                  setShowPaymentModal(false);
                  setSelectedOrder(null);
                }}
                onConfirm={handleConfirmPayment}
                loading={paymentLoading}
              />
            )}
          </AnimatePresence>



        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-3 bg-gradient-to-br ${color} rounded-xl`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}


function TestOrderCard({
  order,
  index,
  onPayment
}: {
  order: TestOrder;
  index: number;
  onPayment?: () => void; // ✅ Add this
}) {
  const statusColors = {
    ordered: 'bg-blue-100 text-blue-700 border-blue-300',
    payment_pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    payment_failed: 'bg-red-100 text-red-700 border-red-300',
    ready_for_test: 'bg-blue-100 text-blue-700 border-blue-300',
    in_progress: 'bg-purple-100 text-purple-700 border-purple-300',
    completed: 'bg-green-100 text-green-700 border-green-300',
    cancelled: 'bg-red-100 text-red-700 border-red-300',
  };

  const paymentColors = {
    pending: 'bg-orange-100 text-orange-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
    waived: 'bg-blue-100 text-blue-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <TestTube className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{order.testType}</h3>
            <p className="text-sm text-gray-600 mb-2">
              Patient: {order.patientId.firstName} {order.patientId.lastName}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {order.departmentId.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 mb-2">
            ${order.paymentAmount || order.amount}
          </p>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentColors[order.paymentStatus as keyof typeof paymentColors]
              }`}>
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${statusColors[order.status as keyof typeof statusColors]
          }`}>
          {order.status.replace(/_/g, ' ').toUpperCase()}
        </span>

        {/* ✅ ADD: Action buttons */}
        <div className="flex items-center gap-2">
          {order.paymentStatus === 'pending' && onPayment && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPayment}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Confirm Payment
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentModal({
  order,
  onClose,
  onConfirm,
  loading,
}: {
  order: TestOrder;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Payment</h2>
          <p className="text-gray-600">
            Are you sure you want to confirm payment for this test order?
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Test Type:</span>
            <span className="text-sm font-semibold text-gray-900">{order.testType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Patient:</span>
            <span className="text-sm font-semibold text-gray-900">
              {order.patientId.firstName} {order.patientId.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Department:</span>
            <span className="text-sm font-semibold text-gray-900">
              {order.departmentId.name}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-lg font-bold text-green-600">
              ${order.paymentAmount || order.amount}
            </span>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                Demo Payment Simulation
              </p>
              <p className="text-xs text-yellow-700">
                This is a simulated payment. In production, this would integrate with a real payment gateway.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirm Payment
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}


// Create Test Order Modal Component
function CreateTestOrderModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1); // 1: Search Patient, 2: Order Details
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    testType: '',
    departmentId: '',
    amount: '',
    description: '',
    urgency: 'routine' as 'routine' | 'urgent' | 'emergency',
  });

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get<{ count: number; data: Department[] }>('/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  // Search patients
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError('');

    try {
      const response = await api.searchPatients(searchQuery);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setError('No patients found');
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  // Select patient and move to step 2
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setStep(2);
  };

  // Submit test order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.createTestOrder({
        patientId: selectedPatient?._id,
        testType: formData.testType,
        departmentId: formData.departmentId,
        amount: parseFloat(formData.amount),
        description: formData.description,
        urgency: formData.urgency,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create test order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Test Order</h2>
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1. Select Patient
            </div>
            <div className="flex-1 h-1 bg-gray-200 rounded" />
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2. Order Details
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Search Patient */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Patient
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((patient) => (
                  <motion.button
                    key={patient._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPatient(patient)}
                    className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                        {patient.phone && (
                          <p className="text-xs text-gray-500">{patient.phone}</p>
                        )}
                      </div>
                      {patient.bloodType && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                          {patient.bloodType}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Cancel Button */}
            <div className="flex justify-end pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}

        {/* Step 2: Order Details */}
        {step === 2 && selectedPatient && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected Patient Info */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Patient:</p>
              <p className="font-bold text-gray-900">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </p>
              <p className="text-sm text-gray-600">{selectedPatient.email}</p>
            </div>

            {/* Test Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Test Type *
              </label>
              <select
                required
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select test type...</option>
                <option value="Blood Test">Complete Blood Count (CBC)</option>
                <option value="X-Ray">X-Ray</option>
                <option value="CT Scan">CT Scan</option>
                <option value="MRI">MRI</option>
                <option value="Ultrasound">Ultrasound</option>
                <option value="ECG">ECG (Electrocardiogram)</option>
                <option value="Urinalysis">Urinalysis</option>
                <option value="Lipid Profile">Lipid Profile</option>
                <option value="Blood Sugar">Blood Sugar Test</option>
                <option value="Liver Function">Liver Function Test</option>
                <option value="Kidney Function">Kidney Function Test</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department *
              </label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select department...</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Urgency *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['routine', 'urgent', 'emergency'].map((level) => (
                  <motion.button
                    key={level}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, urgency: level as any })}
                    className={`px-4 py-3 rounded-xl font-semibold capitalize transition-all ${
                      formData.urgency === level
                        ? level === 'emergency'
                          ? 'bg-red-600 text-white'
                          : level === 'urgent'
                          ? 'bg-orange-600 text-white'
                          : 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes / Instructions
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Any special instructions or notes..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Order
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}