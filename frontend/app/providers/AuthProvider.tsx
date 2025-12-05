// frontend/app/providers/AuthProvider.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Types
export type UserRole = 
  | 'super_admin' 
  | 'hospital_admin' 
  | 'doctor' 
  | 'nurse' 
  | 'department_staff' 
  | 'patient' 
  | 'pending_approval';

export interface Hospital {
  _id: string;
  name: string;
  email: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  subscriptionStatus: 'pending' | 'active' | 'suspended' | 'expired';
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  type?: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  hospitalId?: Hospital;
  departmentId?: Department;
  departmentRole?: 'lab_technician' | 'radiologist' | 'pharmacist' | 'receptionist' | 'other';
  specialization?: string;
  phone?: string;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isSuperAdmin: boolean;
  isHospitalAdmin: boolean;
  isDoctor: boolean;
  isNurse: boolean;
  isDepartmentStaff: boolean;
  isPatient: boolean;
  hospitalId?: string;
  hospitalName?: string;
  departmentId?: string;
  departmentName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid, try refresh
        await refreshTokens();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh tokens
  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        await fetchUser();
      } else {
        throw new Error('Refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      router.push('/login');
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Set user
      setUser(data.user);

      // Redirect based on role
      redirectAfterLogin(data.user.role);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/login');
  };

  // Refresh user data
  const refreshUser = async () => {
    await fetchUser();
  };

  // Redirect after login based on role
  const redirectAfterLogin = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        router.push('/dashboard/super-admin');
        break;
      case 'hospital_admin':
        router.push('/dashboard/hospital-admin');
        break;
      case 'doctor':
        router.push('/dashboard/doctor');
        break;
      case 'nurse':
        router.push('/dashboard/nurse');
        break;
      case 'department_staff':
        router.push('/dashboard/department');
        break;
      case 'patient':
        router.push('/dashboard/patient');
        break;
      case 'pending_approval':
        router.push('/pending-approval');
        break;
      default:
        router.push('/dashboard');
    }
  };

  // Check if user has specific role(s)
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // Role helper functions
  const isSuperAdmin = user?.role === 'super_admin';
  const isHospitalAdmin = user?.role === 'hospital_admin';
  const isDoctor = user?.role === 'doctor';
  const isNurse = user?.role === 'nurse';
  const isDepartmentStaff = user?.role === 'department_staff';
  const isPatient = user?.role === 'patient';

  // Hospital and department helpers
  const hospitalId = typeof user?.hospitalId === 'object' ? user.hospitalId._id : user?.hospitalId;
  const hospitalName = typeof user?.hospitalId === 'object' ? user.hospitalId.name : undefined;
  const departmentId = typeof user?.departmentId === 'object' ? user.departmentId._id : user?.departmentId;
  const departmentName = typeof user?.departmentId === 'object' ? user.departmentId.name : undefined;

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    hasRole,
    isSuperAdmin,
    isHospitalAdmin,
    isDoctor,
    isNurse,
    isDepartmentStaff,
    isPatient,
    hospitalId,
    hospitalName,
    departmentId,
    departmentName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for role-based access
export function useRequireAuth(allowedRoles?: UserRole | UserRole[]) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !hasRole(allowedRoles)) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, allowedRoles, hasRole, router]);

  return { user, loading };
}
