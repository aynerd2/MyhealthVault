'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Shield, 
  Zap,
  Users,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Stethoscope,
  UserCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {

    const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

 useEffect(() => {
    // ✅ CHANGED: Redirect based on user role
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'patient') {
        router.push('/patient');
      } else if (['doctor', 'nurse'].includes(user.role)) {
        router.push('/healthcare');
      } else if (user.role === 'pending_approval') {
        router.push('/pending-approval');
      }
    }
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Bank-level encryption keeps your health data safe and confidential',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Access your medical records anytime, anywhere in seconds',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Seamless Collaboration',
      description: 'Healthcare providers can securely share and update your records',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Clock,
      title: 'Complete History',
      description: 'All your medical records in one place, never lose track again',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Medical Records' },
    { value: '500+', label: 'Healthcare Providers' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Health Vault
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold text-blue-600"
            >
              Sign In
            </motion.button>
          </motion.div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full"
              >
                <span className="text-blue-600 font-semibold text-sm">
                  🎉 Trusted by 10,000+ Users
                </span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Health,
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  One Secure Place
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Access all your medical records, prescriptions, and test results instantly. 
                Empowering patients and healthcare providers with seamless, secure data management.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  <UserCircle className="w-5 h-5" />
                  Get Started as Patient
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                  className="group px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-5 h-5" />
                  Healthcare Provider
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">ISO Certified</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image/Illustration */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="h-3 w-32 bg-white/30 rounded mb-2"></div>
                      <div className="h-2 w-24 bg-white/20 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/20 rounded"></div>
                    <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold">Recent Records</span>
                    </div>
                    <span className="text-white/60 text-sm">8 items</span>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-2 w-32 bg-white/30 rounded mb-2"></div>
                          <div className="h-2 w-20 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, 0] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">All Systems Active</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Everything You Need for
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Better Healthcare
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Powerful features designed for both patients and healthcare providers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className={`inline-block p-3 bg-gradient-to-br ${feature.color} rounded-xl mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1 }}
        className="bg-white border-t border-gray-200 py-8 mt-20"
      >
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 My Health Vault. All rights reserved.</p>
          <p className="text-sm mt-2">
            Securing healthcare data with cutting-edge technology
          </p>
        </div>
      </motion.footer>
    </div>
  );
}