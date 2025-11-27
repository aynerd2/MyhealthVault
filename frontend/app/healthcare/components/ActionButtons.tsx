'use client';

import { motion } from 'framer-motion';
import { FilePlus, Pill, FlaskConical } from 'lucide-react';

interface ActionButtonsProps {
  onAddRecord: () => void;
  onPrescribe: () => void;
  onAddTest: () => void;
}

export default function ActionButtons({
  onAddRecord,
  onPrescribe,
  onAddTest,
}: ActionButtonsProps) {
  const buttons = [
    {
      label: 'Add Medical Record',
      icon: FilePlus,
      onClick: onAddRecord,
      gradient: 'from-blue-600 to-indigo-600',
      hoverGradient: 'from-blue-700 to-indigo-700',
    },
    {
      label: 'Prescribe Medication',
      icon: Pill,
      onClick: onPrescribe,
      gradient: 'from-emerald-600 to-teal-600',
      hoverGradient: 'from-emerald-700 to-teal-700',
    },
    {
      label: 'Add Test Result',
      icon: FlaskConical,
      onClick: onAddTest,
      gradient: 'from-purple-600 to-pink-600',
      hoverGradient: 'from-purple-700 to-pink-700',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {buttons.map((button, index) => (
        <motion.button
          key={button.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={button.onClick}
          className={`bg-gradient-to-r ${button.gradient} hover:${button.hoverGradient} text-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all`}
        >
          <div className="flex items-center justify-center gap-3">
            <button.icon className="w-5 h-5" />
            <span className="font-semibold">{button.label}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}