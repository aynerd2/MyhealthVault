// inspect-models.js
// This script will show you the exact schema requirements for your models

const mongoose = require('mongoose');
require('dotenv').config();

const { User, MedicalRecord, Prescription, TestResult } = require('./src/models');

function inspectModel(model, modelName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${modelName} Schema`);
  console.log('='.repeat(60));
  
  const schema = model.schema;
  const paths = schema.paths;
  
  for (const [path, schemaType] of Object.entries(paths)) {
    // Skip internal mongoose fields
    if (path === '_id' || path === '__v') continue;
    
    const info = {
      type: schemaType.instance,
      required: schemaType.isRequired || false,
      enum: schemaType.enumValues || null,
      default: schemaType.defaultValue,
    };
    
    console.log(`\n${path}:`);
    console.log(`  Type: ${info.type}`);
    if (info.required) console.log(`  Required: ✅ YES`);
    if (info.enum && info.enum.length > 0) {
      console.log(`  Enum values: [${info.enum.map(v => `'${v}'`).join(', ')}]`);
    }
    if (info.default !== undefined) {
      console.log(`  Default: ${info.default}`);
    }
  }
}

async function inspectAllModels() {
  try {
    console.log('🔍 Inspecting Health Vault Models\n');
    
    inspectModel(User, 'USER');
    inspectModel(MedicalRecord, 'MEDICAL RECORD');
    inspectModel(Prescription, 'PRESCRIPTION');
    inspectModel(TestResult, 'TEST RESULT');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Inspection complete!');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

inspectAllModels();