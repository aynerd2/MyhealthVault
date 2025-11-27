
// seed-database-express.js
// Seed script for Express authentication (with password hashing)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User.model.js');
const {
  MedicalRecord,
  Prescription,
  TestResult
} = require('./src/models/index.js');


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthvault';


// -----------------------------------------------------
// USERS (plain passwords — they will be hashed below)
// -----------------------------------------------------

const dummyUsers = [
  {
    email: 'admin@healthvault.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    approvalStatus: 'approved',
    dateOfBirth: new Date('1980-01-01'),
    gender: 'Male',
    licenseNumber: 'ADMIN-001',
    specialization: 'Administration',
    hospitalAffiliation: 'Health Vault System',
    isActive: true,
    isEmailVerified: true,
  },

  {
    email: 'dr.smith@healthvault.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Smith',
    role: 'doctor',
    approvalStatus: 'approved',
    dateOfBirth: new Date('1985-05-15'),
    gender: 'Female',
    licenseNumber: 'MD-12345',
    specialization: 'Cardiology',
    hospitalAffiliation: 'City General Hospital',
    phone: '+1234567890',
    isActive: true,
    isEmailVerified: true,
  },

  {
    email: 'dr.johnson@healthvault.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Johnson',
    role: 'doctor',
    approvalStatus: 'approved',
    dateOfBirth: new Date('1982-08-20'),
    gender: 'Male',
    licenseNumber: 'MD-67890',
    specialization: 'General Practice',
    hospitalAffiliation: 'Metropolitan Health Center',
    phone: '+1234567891',
    isActive: true,
    isEmailVerified: true,
  },

  {
    email: 'nurse.williams@healthvault.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Williams',
    role: 'nurse',
    approvalStatus: 'approved',
    dateOfBirth: new Date('1990-03-10'),
    gender: 'Female',
    licenseNumber: 'RN-54321',
    specialization: 'Emergency Care',
    hospitalAffiliation: 'City General Hospital',
    phone: '+1234567892',
    isActive: true,
    isEmailVerified: true,
  },

  {
    email: 'dr.pending@healthvault.com',
    password: 'password123',
    firstName: 'James',
    lastName: 'Brown',
    role: 'pending_approval',
    appliedRole: 'doctor',
    approvalStatus: 'pending',
    dateOfBirth: new Date('1988-11-25'),
    gender: 'Male',
    licenseNumber: 'MD-99999',
    specialization: 'Pediatrics',
    hospitalAffiliation: 'Children\'s Hospital',
    appliedAt: new Date(),
    isActive: true,
    isEmailVerified: true,
  },

  // Patients
  {
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'patient',
    approvalStatus: 'approved',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'Male',
    bloodType: 'O+',
    phone: '+1234567893',
    address: '123 Main St, New York, NY 10001, USA',
    emergencyContact: 'Jane Doe - +1234567894',
    isActive: true,
    isEmailVerified: true,
  },
  {
    email: 'mary.jones@example.com',
    password: 'password123',
    firstName: 'Mary',
    lastName: 'Jones',
    role: 'patient',
    approvalStatus: 'approved',
    dateOfBirth: new Date('1990-07-22'),
    gender: 'Female',
    bloodType: 'A+',
    phone: '+1234567895',
    address: '456 Oak Ave, Los Angeles, CA 90001, USA',
    emergencyContact: 'Robert Jones - +1234567896',
    isActive: true,
    isEmailVerified: true,
  },
  {
    email: 'robert.taylor@example.com',
    password: 'password123',
    firstName: 'Robert',
    lastName: 'Taylor',
    role: 'patient',
    approvalStatus: 'approved',
    dateOfBirth: new Date('1978-11-30'),
    gender: 'Male',
    bloodType: 'B+',
    phone: '+1234567896',
    address: '789 Elm St, Chicago, IL 60601, USA',
    emergencyContact: 'Susan Taylor - +1234567897',
    isActive: true,
    isEmailVerified: true,
  },
];


// -----------------------------------------------------
//  DATABASE SEED FUNCTION
// -----------------------------------------------------

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected\n');

    console.log('🗑 Clearing existing collections...');
    await User.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Prescription.deleteMany({});
    await TestResult.deleteMany({});
    console.log('✅ Cleared\n');


    // ------------------------------------------
    // HASH ALL PASSWORDS BEFORE INSERTING
    // ------------------------------------------
    console.log('🔐 Hashing passwords...');

    const hashedUsers = await Promise.all(
      dummyUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    console.log('👥 Creating users...');
    const users = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${users.length} users\n`);


    // ------------------------------------------
    // FETCH USERS BY EMAIL
    // ------------------------------------------
    const doctor1 = users.find(u => u.email === 'dr.smith@healthvault.com');
    const doctor2 = users.find(u => u.email === 'dr.johnson@healthvault.com');
    const nurse = users.find(u => u.email === 'nurse.williams@healthvault.com');
    const patient1 = users.find(u => u.email === 'john.doe@example.com');
    const patient2 = users.find(u => u.email === 'mary.jones@example.com');
    const patient3 = users.find(u => u.email === 'robert.taylor@example.com');


    // ------------------------------------------
    // Insert Medical Records
    // ------------------------------------------
    console.log('📋 Creating medical records...');

    const records = await MedicalRecord.insertMany([
      {
        patientId: patient1._id,
        doctorId: doctor1._id,
        hospitalName: 'City General Hospital',
        visitDate: new Date('2024-01-15'),
        visitType: 'checkup',
        diagnosis: 'Hypertension',
        symptoms: 'Headache, Dizziness, Blurred vision',
        treatment: 'Prescribed Lisinopril 10mg daily.',
        status: 'followup_needed',
      },
      {
        patientId: patient2._id,
        doctorId: doctor2._id,
        hospitalName: 'Metropolitan Health Center',
        visitDate: new Date('2024-01-20'),
        visitType: 'consultation',
        diagnosis: 'Type 2 Diabetes',
        treatment: 'Prescribed Metformin.',
        status: 'followup_needed',
      }
    ]);

    console.log(`✅ Created ${records.length} medical records\n`);


    // ------------------------------------------
    // Insert Prescriptions
    // ------------------------------------------
    console.log('💊 Creating prescriptions...');

  const presc = await Prescription.insertMany([
  {
    patientId: patient1._id,
    doctorId: doctor1._id,
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: '30 days',
    route: 'oral',
    hospitalName: 'City General Hospital',
    prescribedDate: new Date(),
    isActive: true,
  },
  {
    patientId: patient2._id,
    doctorId: doctor2._id,
    medicationName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '90 days',
    route: 'oral',
    hospitalName: 'Metropolitan Health Center',
    prescribedDate: new Date(),
    isActive: true,
  }
]);


    console.log(`✅ Created ${presc.length} prescriptions\n`);


    // ------------------------------------------
    // Insert Test Results
    // ------------------------------------------
    console.log('🧪 Creating test results...');

   const tests = await TestResult.insertMany([
  {
    patientId: patient1._id,
    orderedBy: doctor1._id,
    testName: 'Lipid Panel',
    testType: 'blood_test',
    hospitalName: 'City General Hospital',
    testDate: new Date('2024-01-10'),
    result: 'High LDL Cholesterol',
    status: 'abnormal',
  },
  {
    patientId: patient2._id,
    orderedBy: doctor2._id,
    testName: 'HbA1c Test',
    testType: 'blood_test',
    hospitalName: 'Metropolitan Health Center',
    testDate: new Date('2024-01-18'),
    result: 'HbA1c 8.2%',
    status: 'abnormal',
  }
]);


    console.log(`✅ Created ${tests.length} test results\n`);


    // ------------------------------------------
    // SUMMARY
    // ------------------------------------------
    console.log('==================================================');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('==================================================');

    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📋 Medical Records: ${records.length}`);
    console.log(`   💊 Prescriptions: ${presc.length}`);
    console.log(`   🧪 Test Results: ${tests.length}\n`);

    console.log('👥 Test Accounts (password: password123)');
    console.log('   👑 Admin: admin@healthvault.com');
    console.log('   👨‍⚕️ Doctor: dr.smith@healthvault.com');
    console.log('   👩‍⚕️ Nurse: nurse.williams@healthvault.com');
    console.log('   🧑 Patient: john.doe@example.com');
    console.log('==================================================\n');

  } catch (err) {
    console.error('❌ ERROR:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();







