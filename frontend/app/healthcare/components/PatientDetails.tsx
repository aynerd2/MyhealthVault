'use client';

import { motion } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface PatientDetailsProps {
  patient: any;
  onClose: () => void;
}

export default function PatientDetails({ patient, onClose }: PatientDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {patient.firstName[0]}{patient.lastName[0]}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-gray-600">Patient ID: {patient._id.slice(-8)}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Patient Information Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Mail className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Email</p>
            <p className="text-sm text-gray-900">{patient.email}</p>
          </div>
        </div>

        {/* Phone */}
        {patient.phone && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Phone className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Phone</p>
              <p className="text-sm text-gray-900">{patient.phone}</p>
            </div>
          </div>
        )}

        {/* Date of Birth & Age */}
        {patient.dateOfBirth && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
              <p className="text-sm text-gray-900">
                {formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} years)
              </p>
            </div>
          </div>
        )}

        {/* Address */}
        {patient.address && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Address</p>
              <p className="text-sm text-gray-900">{patient.address}</p>
            </div>
          </div>
        )}

        {/* Gender */}
        {patient.gender && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-pink-100 rounded-lg">
              <User className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Gender</p>
              <p className="text-sm text-gray-900 capitalize">{patient.gender}</p>
            </div>
          </div>
        )}

        {/* Blood Type */}
        {patient.bloodType && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-red-600 font-bold text-xs">ABO</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Blood Type</p>
              <p className="text-sm text-gray-900 font-semibold">{patient.bloodType}</p>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      {patient.emergencyContact && (
        <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Emergency Contact</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {patient.emergencyContact.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Phone:</span> {patient.emergencyContact.phone}
            </p>
            <p className="text-gray-700 md:col-span-2">
              <span className="font-medium">Relationship:</span> {patient.emergencyContact.relationship}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}