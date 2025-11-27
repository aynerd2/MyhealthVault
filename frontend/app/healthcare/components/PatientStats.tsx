'use client';

import { motion } from 'framer-motion';
import { FileText, Pill, FlaskConical } from 'lucide-react';

interface PatientStatsProps {
  recordsCount: number;
  activePrescriptionsCount: number;
  testsCount: number;
}

export default function PatientStats({
  recordsCount,
  activePrescriptionsCount,
  testsCount,
}: PatientStatsProps) {
  const stats = [
    {
      label: 'Medical Records',
      value: recordsCount,
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'from-blue-50 to-indigo-50',
    },
    {
      label: 'Active Prescriptions',
      value: activePrescriptionsCount,
      icon: Pill,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'from-emerald-50 to-teal-50',
    },
    {
      label: 'Test Results',
      value: testsCount,
      icon: FlaskConical,
      gradient: 'from-purple-500 to-pink-500',
      bg: 'from-purple-50 to-pink-50',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border border-gray-100 shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className="text-4xl font-bold text-gray-900"
              >
                {stat.value}
              </motion.p>
            </div>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}
            >
              <stat.icon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}