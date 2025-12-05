// frontend/lib/api.ts - ORGANIZED VERSION

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.accessToken;
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requireAuth = true, headers = {}, ...fetchOptions } = options;

    if (requireAuth) {
      const token = await this.getAccessToken();
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    let response = await fetch(`${this.baseURL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (response.status === 401 && requireAuth) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(`${this.baseURL}${endpoint}`, {
          ...fetchOptions,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        });
      }
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // ============================================
  // CORE HTTP METHODS
  // ============================================

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // ============================================
  // V2 API METHODS (Multi-Tenant)
  // We'll add these as we build features
  // ============================================

  // AUTH
  async getProfile() {
    return this.get<{ user: any }>('/auth/me');
  }

  // HOSPITALS
  async getMyHospital() {
    return this.get<{ data: any }>('/hospitals/my-hospital');
  }

  async getHospitalStats() {
    return this.get<{ data: any }>('/hospitals/my-hospital/stats');
  }

  // DEPARTMENTS
  async getDepartments() {
    return this.get<{ count: number; data: any[] }>('/departments');
  }

  async getDepartment(id: string) {
    return this.get<{ data: any }>(`/departments/${id}`);
  }

  // MEDICAL RECORDS (Updated for V2)
  async getPatientMedicalRecords(patientId: string, hospitalId?: string) {
    const query = hospitalId ? `?hospitalId=${hospitalId}` : '';
    return this.get<{ count: number; data: any[] }>(`/medical-records/patient/${patientId}${query}`);
  }

  // PRESCRIPTIONS (Updated for V2)
  async getPatientPrescriptions(patientId: string, hospitalId?: string) {
    const query = hospitalId ? `?hospitalId=${hospitalId}` : '';
    return this.get<{ count: number; data: any[] }>(`/prescriptions/patient/${patientId}${query}`);
  }

  // ADMIN
  async getPendingApprovals() {
    return this.get<{ count: number; data: any[] }>('/admin/pending-approvals');
  }

  async approveUser(userId: string, departmentId?: string) {
    return this.post<{ message: string; data: any }>(`/admin/approve/${userId}`, { departmentId });
  }

  async rejectUser(userId: string, reason: string) {
    return this.post<{ message: string; data: any }>(`/admin/reject/${userId}`, { reason });
  }

 
 // TEST ORDERS
  async getPatientTestOrders(patientId: string) {
    return this.get<{ count: number; data: any[] }>(`/test-orders/patient/${patientId}`);
  }

  async createTestOrder(data: any) {
    return this.post<{ message: string; data: any }>('/test-orders', data);
  }

  async updateTestOrderPayment(orderId: string, data: any) {
    return this.post<{ message: string; data: any }>(`/test-orders/${orderId}/payment`, data);
  }

  async uploadTestResult(orderId: string, formData: FormData) {
    const token = await this.getAccessToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/test-orders/${orderId}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  }

  async getDepartmentPendingTests() {
    return this.get<{ count: number; data: any[] }>('/test-orders/department/pending');
  }

  async getDepartmentReadyTests() {
    return this.get<{ count: number; data: any[] }>('/test-orders/department/ready');
  }

  async getDepartmentCompletedTests() {
    return this.get<{ count: number; data: any[] }>('/test-orders/department/completed');
  }

  // PATIENTS SEARCH
  async searchPatients(query: string) {
    return this.get<{ count: number; data: any[] }>(`/patients/search?q=${encodeURIComponent(query)}`);
  }

  async getPatient(patientId: string) {
    return this.get<{ data: any }>(`/patients/${patientId}`);
  }




}

export const api = new ApiClient(API_URL);
export default api;

















// // lib/api.ts
// // Complete API client with automatic token handling

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// interface RequestOptions extends RequestInit {
//   requireAuth?: boolean;
// }

// export interface RegisterData {
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: 'patient' | 'doctor' | 'nurse';

//   // Patient-only
//   dateOfBirth?: string;
//   gender?: string;

//   // Healthcare-only
//   licenseNumber?: string;
//   hospitalAffiliation?: string;
//   specialization?: string;
// }


// class ApiClient {
//   private authToken: string | null = null;

//   /**
//    * Set auth token manually (optional - normally uses localStorage)
//    */
//   setAuthToken(token: string) {
//     this.authToken = token;
//   }

//   /**
//    * Get auth token from localStorage or manual set
//    */
//   private getToken(): string | null {
//     if (this.authToken) return this.authToken;
//     if (typeof window === 'undefined') return null;
//     return localStorage.getItem('accessToken');
//   }

//   /**
//    * Main request method with auto token refresh
//    */
//   async request(endpoint: string, options: RequestOptions = {}) {
//     const { requireAuth = true, ...fetchOptions } = options;
    
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//       ...fetchOptions.headers,
//     };

//     // Add auth token if required
//     if (requireAuth) {
//       const token = this.getToken();
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }
//     }

//     let response = await fetch(`${API_URL}${endpoint}`, {
//       ...fetchOptions,
//       headers,
//     });

//     // Handle token expiration - auto refresh
//     if (response.status === 401 && requireAuth) {
//       const refreshed = await this.refreshToken();
      
//       if (refreshed) {
//         const token = this.getToken();
//         if (token) {
//           headers['Authorization'] = `Bearer ${token}`;
//         }
        
//         response = await fetch(`${API_URL}${endpoint}`, {
//           ...fetchOptions,
//           headers,
//         });
//       } else {
//         if (typeof window !== 'undefined') {
//           localStorage.removeItem('accessToken');
//           localStorage.removeItem('refreshToken');
//           window.location.href = '/login';
//         }
//       }
//     }

//     return response;
//   }

//   /**
//    * Refresh access token
//    */
//   async refreshToken(): Promise<boolean> {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
      
//       if (!refreshToken) {
//         return false;
//       }

//       const response = await fetch(`${API_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refreshToken }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('accessToken', data.accessToken);
//         localStorage.setItem('refreshToken', data.refreshToken);
//         return true;
//       }

//       return false;
//     } catch (error) {
//       console.error('Token refresh error:', error);
//       return false;
//     }
//   }

//   /**
//    * GET request
//    */
//   async get(endpoint: string, options: RequestOptions = {}) {
//     return this.request(endpoint, { ...options, method: 'GET' });
//   }

//   /**
//    * POST request
//    */
//   async post(endpoint: string, data?: any, options: RequestOptions = {}) {
//     return this.request(endpoint, {
//       ...options,
//       method: 'POST',
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   /**
//    * PUT request
//    */
//   async put(endpoint: string, data?: any, options: RequestOptions = {}) {
//     return this.request(endpoint, {
//       ...options,
//       method: 'PUT',
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   /**
//    * DELETE request
//    */
//   async delete(endpoint: string, options: RequestOptions = {}) {
//     return this.request(endpoint, { ...options, method: 'DELETE' });
//   }

//   /**
//    * Upload file (multipart/form-data)
//    */
//   async upload(endpoint: string, formData: FormData, options: RequestOptions = {}) {
//     const token = this.getToken();
//     const headers: HeadersInit = {};
    
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     const response = await fetch(`${API_URL}${endpoint}`, {
//       method: 'POST',
//       headers,
//       body: formData,
//       ...options,
//     });

//     return response;
//   }

//   // ============================================
//   // AUTH & PROFILE
//   // ============================================


//   async register(data: RegisterData) {
//   const response = await this.post('/auth/register', data);
//   return { data: await response.json() };
// }

//   /**
//    * Get user profile
//    */
// async getProfile() {
//   const response = await this.get('/auth/me');
//   const data = await response.json();
  
//   // ✅ CHANGED: Extract user from response
//   // Backend returns { user: {...} }
//   return { data: data.user || data };
// }

//   // ============================================
//   // PATIENTS
//   // ============================================

//   /**
//    * Search patients by name, email, or phone
//    */
//   async searchPatients(query: string) {
//     const response = await this.get(`/patients/search?q=${encodeURIComponent(query)}`);
//     return { data: await response.json() };
//   }

//   /**
//    * Get all patients (healthcare workers)
//    */
//   async getPatients() {
//     const response = await this.get('/patients');
//     return { data: await response.json() };
//   }

//   /**
//    * Get patient by ID
//    */
//   async getPatient(patientId: string) {
//     const response = await this.get(`/patients/${patientId}`);
//     return { data: await response.json() };
//   }

//   // ============================================
//   // MEDICAL RECORDS
//   // ============================================

//   /**
//    * Get medical records for a patient
//    */
//   async getMedicalRecords(patientId: string) {
//     const response = await this.get(`/medical-records/patient/${patientId}`);
//     return { data: await response.json() };
//   }

//   /**
//    * Create medical record
//    */
//   async createMedicalRecord(data: any) {
//     const response = await this.post('/medical-records', data);
//     return { data: await response.json() };
//   }

//   /**
//    * Update medical record
//    */
//   async updateMedicalRecord(recordId: string, data: any) {
//     const response = await this.put(`/medical-records/${recordId}`, data);
//     return { data: await response.json() };
//   }

//   /**
//    * Delete medical record
//    */
//   async deleteMedicalRecord(recordId: string) {
//     const response = await this.delete(`/medical-records/${recordId}`);
//     return { data: await response.json() };
//   }

//   // ============================================
//   // PRESCRIPTIONS
//   // ============================================

//   /**
//    * Get prescriptions for a patient
//    */
//   async getPrescriptions(patientId: string) {
//     const response = await this.get(`/prescriptions/patient/${patientId}`);
//     return { data: await response.json() };
//   }

//   /**
//    * Create prescription
//    */
//   async createPrescription(data: any) {
//     const response = await this.post('/prescriptions', data);
//     return { data: await response.json() };
//   }

//   /**
//    * Update prescription
//    */
//   async updatePrescription(prescriptionId: string, data: any) {
//     const response = await this.put(`/prescriptions/${prescriptionId}`, data);
//     return { data: await response.json() };
//   }

//   /**
//    * Delete prescription
//    */
//   async deletePrescription(prescriptionId: string) {
//     const response = await this.delete(`/prescriptions/${prescriptionId}`);
//     return { data: await response.json() };
//   }

//   // ============================================
//   // TEST RESULTS
//   // ============================================

//   /**
//    * Get test results for a patient
//    */
//   async getTestResults(patientId: string) {
//     const response = await this.get(`/test-results/patient/${patientId}`);
//     return { data: await response.json() };
//   }

//   /**
//    * Create test result
//    */
//   async createTestResult(data: any) {
//     const response = await this.post('/test-results', data);
//     return { data: await response.json() };
//   }

//   /**
//    * Upload test file
//    */
//   async uploadTestFile(file: File, selectedFile: File) {
//     const formData = new FormData();
//     formData.append('file', file);
    
//     const response = await this.upload('/test-results/upload', formData);
//     return { data: await response.json() };
//   }

//   /**
//    * Update test result
//    */
//   async updateTestResult(testId: string, data: any) {
//     const response = await this.put(`/test-results/${testId}`, data);
//     return { data: await response.json() };
//   }

//   /**
//    * Delete test result
//    */
//   async deleteTestResult(testId: string) {
//     const response = await this.delete(`/test-results/${testId}`);
//     return { data: await response.json() };
//   }

//   // ============================================
//   // ADMIN
//   // ============================================

//   /**
//    * Get pending approvals (admin)
//    */
//   async getPendingApprovals() {
//     const response = await this.get('/admin/pending-approvals');
//     return { data: await response.json() };
//   }

//   /**
//    * Approve user (admin)
//    */
//   async approveUser(userId: string, role: 'doctor' | 'nurse') {
//     const response = await this.post(`/admin/approve/${userId}`, { role });
//     return { data: await response.json() };
//   }

//   /**
//    * Reject user (admin)
//    */
//   async rejectUser(userId: string, reason: string) {
//     const response = await this.post(`/admin/reject/${userId}`, { reason });
//     return { data: await response.json() };
//   }

//   /**
//    * Get all users (admin)
//    */
//   async getAllUsers(params?: { role?: string; limit?: number; offset?: number }) {
//     const queryParams = new URLSearchParams();
//     if (params?.role) queryParams.append('role', params.role);
//     if (params?.limit) queryParams.append('limit', params.limit.toString());
//     if (params?.offset) queryParams.append('offset', params.offset.toString());
    
//     const queryString = queryParams.toString();
//     const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    
//     const response = await this.get(endpoint);
//     return { data: await response.json() };
//   }

//   /**
//    * Update user status (admin)
//    */
//   async updateUserStatus(userId: string, isActive: boolean) {
//     const response = await this.put(`/admin/users/${userId}/status`, { isActive });
//     return { data: await response.json() };
//   }

//   /**
//    * Delete user (admin)
//    */
//   async deleteUser(userId: string) {
//     const response = await this.delete(`/admin/users/${userId}`);
//     return { data: await response.json() };
//   }
// }

// // Export singleton instance
// export const apiClient = new ApiClient();

// /**
//  * Helper function to get auth token
//  */
// export function getAuthToken(): string | null {
//   if (typeof window === 'undefined') return null;
//   return localStorage.getItem('accessToken');
// }

// /**
//  * Helper function to check if user is authenticated
//  */
// export function isAuthenticated(): boolean {
//   return !!getAuthToken();
// }