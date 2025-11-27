'use client';

import { motion } from 'framer-motion';
import { Search, Users, ChevronRight, Loader2 } from 'lucide-react';

interface PatientSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  searching: boolean;
  selectedPatient: any;
  onSelectPatient: (patient: any) => void;
}

export default function PatientSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  searching,
  selectedPatient,
  onSelectPatient,
}: PatientSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-600" />
          Find Patient
        </h2>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 animate-spin" />
          )}
        </div>

        {/* Search Results */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {searchResults.map((patient: any) => (
            <motion.button
              key={patient._id}
              whileHover={{ x: 5 }}
              onClick={() => onSelectPatient(patient)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedPatient?._id === patient._id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{patient.email}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </motion.button>
          ))}

          {/* No Results */}
          {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
            <div className="text-center py-8">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No patients found</p>
            </div>
          )}

          {/* Initial State */}
          {searchQuery.length < 2 && (
            <div className="text-center py-8">
              <div className="inline-block p-4 bg-emerald-100 rounded-full mb-3">
                <Search className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-gray-600">Type to search patients</p>
              <p className="text-sm text-gray-500 mt-2">At least 2 characters</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}