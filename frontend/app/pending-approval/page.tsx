'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { motion } from 'framer-motion';
import { Clock, Mail, CheckCircle, LogOut } from 'lucide-react';

export default function PendingApprovalScreen() {

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Clock className="w-10 h-10" />
          </motion.div>
          <h1 className="text-3xl font-bold text-center mb-2">Application Submitted!</h1>
          <p className="text-center text-yellow-100">Your account is being reviewed</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">We'll notify you at:</p>
                <p className="text-blue-700 font-semibold">{user?.email}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
            
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Application Review',
                  description: 'Our admin team will verify your credentials and license information.',
                  icon: Clock,
                  color: 'blue',
                },
                {
                  step: 2,
                  title: 'Verification Process',
                  description: 'We may contact your hospital or verify your license number with relevant authorities.',
                  icon: CheckCircle,
                  color: 'purple',
                },
                {
                  step: 3,
                  title: 'Email Notification',
                  description: "You'll receive an email once your account is approved (usually within 24-48 hours).",
                  icon: Mail,
                  color: 'green',
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.step * 0.1 }}
                  className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Step {item.step}: {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
            <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
              {/* <AlertCircle className="w-5 h-5" /> */}
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-orange-800">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Please ensure the email address you provided is correct and check your spam folder.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Your application includes your license number and hospital affiliation for verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Processing time is typically 1-2 business days, but may vary depending on verification requirements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>You will not be able to access the healthcare portal until your account is approved.</span>
              </li>
            </ul>
          </div>

          {/* Timeline Estimate */}
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4">Typical Timeline</h3>
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-blue-200"></div>
              <div className="space-y-6">
                {[
                  { time: '0-24 hours', event: 'Initial review by admin team' },
                  { time: '24-48 hours', event: 'License verification (if required)' },
                  { time: '48-72 hours', event: 'Final approval and email notification' },
                ].map((milestone, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10">
                      {idx + 1}
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold text-gray-900">{milestone.time}</p>
                      <p className="text-sm text-gray-600">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="flex-1 px-6 py-4 bg-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Check Status
            </motion.button>
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Questions about your application?</p>
            <a href="mailto:support@healthvault.com" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}