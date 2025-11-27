// // lib/useRoleProtection.ts

'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRoleProtection(allowedRoles: string[]) {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Still loading auth
    if (authLoading) {
      setIsChecking(true);
      return;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      setIsChecking(false);
      router.push('/login');
      return;
    }

    // Check if user has allowed role
    if (allowedRoles.includes(user.role)) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Unauthorized - redirect to correct dashboard
    setIsChecking(false);
    
    if (user.role === 'admin') {
      router.push('/admin');
    } else if (user.role === 'patient') {
      router.push('/patient');
    } else if (['doctor', 'nurse'].includes(user.role)) {
      router.push('/healthcare');
    } else if (user.role === 'pending_approval') {
      router.push('/pending-approval');
    } else {
      router.push('/login');
    }

  }, [isAuthenticated, authLoading, user, allowedRoles, router]);

  return {
    isAuthorized,
    isChecking,
    profile: user, // Return user from AuthProvider
  };
}

