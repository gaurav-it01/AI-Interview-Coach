import mongoose from 'mongoose';
import 'dotenv/config';
import Resume from './models/Resume.js';

async function checkResumes() {
  await mongoose.connect(process.env.MONGO_URI);
  const resumes = await Resume.find({});
  console.log('Total Resumes:', resumes.length);
  resumes.forEach(r => {
    console.log(`- ${r.fileName}: Text Length = ${r.extractedText ? r.extractedText.length : 0}`);
    if (r.extractedText) {
      console.log(`  Preview: ${r.extractedText.substring(0, 100)}...`);
    }
  });
  await mongoose.disconnect();
}

checkResumes();
