
const bcrypt = require('bcryptjs');

async function generateHashes() {
  try {
    const adminHash = await bcrypt.hash('admin123', 10);
    const cmsHash = await bcrypt.hash('hgqV&d3FJ!eDv#2Ji7v!kA', 10);
    
    console.log('Copy these hashes to your lib/auth.ts file:');
    console.log('');
    console.log('admin hash:', adminHash);
    console.log('cmscanal hash:', cmsHash);
    console.log('');
    console.log('Updated ADMIN_USERS array:');
    console.log(`const ADMIN_USERS = [
  {
    username: 'admin',
    passwordHash: '${adminHash}',
  },
  {
    username: 'cmscanal', 
    passwordHash: '${cmsHash}',
  }
]`);
  } catch (error) {
    console.error('Error generating hashes:', error);
  }
}

generateHashes();
