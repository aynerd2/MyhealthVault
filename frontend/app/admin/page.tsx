'use client';
import { useAuth } from '@/app/providers/AuthProvider'; 
import { useRoleProtection } from '@/lib/useRoleProtection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Shield,
  Activity,
  TrendingUp,
  Loader2,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  FileText,
  AlertCircle,
  LogOut
} from 'lucide-react';
import {apiClient} from '@/lib/api';

export default function AdminDashboard() {

 const {logout} = useAuth();
    const { isAuthorized, isChecking, profile } = useRoleProtection(['admin']);
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'users'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');


  // Fetch pending approvals
  const { data: pendingData } = useQuery({
    queryKey: ['pendingApprovals'],
    queryFn: async () => {
      const res = await apiClient.getPendingApprovals();
      return res.data;
    },
    enabled: isAuthorized,
  });

  // Fetch all users
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['allUsers', filterRole],
    queryFn: async () => {
      const params: any = { limit: 100 };
      if (filterRole !== 'all') {
        params.role = filterRole;
      }
      const res = await apiClient.getAllUsers(params);
      return res.data;
    },
    enabled: isAuthorized && activeTab === 'users',
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'doctor' | 'nurse' }) => {
      return await apiClient.approveUser(userId, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      return await apiClient.rejectUser(userId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setRejectingUserId(null);
      setRejectionReason('');
    },
  });

  // Toggle user status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      return await apiClient.updateUserStatus(userId, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });

  const handleApprove = (userId: string, appliedRole: 'doctor' | 'nurse') => {
    if (confirm(`Approve this ${appliedRole}?`)) {
      approveMutation.mutate({ userId, role: appliedRole });
    }
  };

  const handleRejectConfirm = (userId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    rejectMutation.mutate({ userId, reason: rejectionReason });
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      toggleStatusMutation.mutate({ userId, isActive: !currentStatus });
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  const pendingUsers = pendingData?.users || [];
  const allUsers = usersData?.users || [];
  
  // Calculate stats
  const totalUsers = allUsers.length;
  const totalPatients = allUsers.filter((u: any) => u.role === 'patient').length;
  const totalDoctors = allUsers.filter((u: any) => u.role === 'doctor').length;
  const totalNurses = allUsers.filter((u: any) => u.role === 'nurse').length;
  const pendingCount = pendingUsers.length;

  // Filter users by search
  const filteredUsers = allUsers.filter((user: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">System Management & User Approvals</p>
              </div>

              
            

            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="text-xs text-gray-600">Administrator</p>
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

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'approvals', label: 'Pending Approvals', icon: Clock, badge: pendingCount },
              { id: 'users', label: 'All Users', icon: Users, badge: totalUsers },
            ].map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all relative ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Statistics</h2>
                
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Users', value: totalUsers, icon: Users, color: 'blue' },
                    { label: 'Patients', value: totalPatients, icon: Users, color: 'emerald' },
                    { label: 'Doctors', value: totalDoctors, icon: Activity, color: 'purple' },
                    { label: 'Pending', value: pendingCount, icon: Clock, color: 'yellow' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl p-6 border border-${stat.color}-200`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                        <TrendingUp className={`w-5 h-5 text-${stat.color}-500`} />
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('approvals')}
                      className="p-4 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 transition-all text-left"
                    >
                      <Clock className="w-6 h-6 text-yellow-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Review Approvals</h4>
                      <p className="text-sm text-gray-600">{pendingCount} pending applications</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all text-left"
                    >
                      <Users className="w-6 h-6 text-blue-600 mb-2" />
                      <h4 className="font-semibold text-gray-900">Manage Users</h4>
                      <p className="text-sm text-gray-600">{totalUsers} total users</p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* APPROVALS TAB */}
            {activeTab === 'approvals' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
                
                {pendingUsers.length === 0 ? (
                  <div className="text-center py-12 bg-green-50 rounded-xl border border-green-200">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600">No pending approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingUsers.map((user: any) => (
                      <div key={user._id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {user.firstName[0]}{user.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{user.firstName} {user.lastName}</h4>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                {user.appliedRole.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                              <p><span className="font-medium">License:</span> {user.licenseNumber}</p>
                              <p><span className="font-medium">Hospital:</span> {user.hospitalAffiliation}</p>
                              {user.specialization && (
                                <p><span className="font-medium">Specialization:</span> {user.specialization}</p>
                              )}
                              <p><span className="font-medium">Applied:</span> {new Date(user.appliedAt).toLocaleDateString()}</p>
                            </div>

                            {rejectingUserId === user._id && (
                              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <h5 className="font-semibold text-red-900 mb-2">Rejection Reason</h5>
                                <textarea
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="Provide reason..."
                                  rows={2}
                                  className="w-full px-3 py-2 border border-red-300 rounded-lg mb-2"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setRejectingUserId(null)}
                                    className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleRejectConfirm(user._id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {rejectingUserId !== user._id && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(user._id, user.appliedRole)}
                                disabled={approveMutation.isPending}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectingUserId(user._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Filters */}
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[250px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="patient">Patients</option>
                    <option value="doctor">Doctors</option>
                    <option value="nurse">Nurses</option>
                    <option value="admin">Admins</option>
                    <option value="pending_approval">Pending</option>
                  </select>
                </div>

                {/* Users List */}
                {loadingUsers ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user: any) => (
                      <div key={user._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                            user.role === 'nurse' ? 'bg-green-100 text-green-700' :
                            user.role === 'patient' ? 'bg-gray-100 text-gray-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.role}
                          </span>
                          {!user.isActive && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                              Inactive
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isActive)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm ${
                            user.isActive
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}