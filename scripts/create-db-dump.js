
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function createDatabaseDump() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dumpFileName = `database-dump-${timestamp}.sql`;
  const dumpPath = path.join(process.cwd(), dumpFileName);

  console.log('Creating database dump...');
  console.log(`Output file: ${dumpFileName}`);

  // Use pg_dump with the DATABASE_URL
  const command = `pg_dump "${databaseUrl}" > "${dumpPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error creating dump:', error);
      console.error('Make sure pg_dump is installed and accessible');
      return;
    }

    if (stderr) {
      console.warn('Warnings:', stderr);
    }

    // Check if file was created and has content
    try {
      const stats = fs.statSync(dumpPath);
      if (stats.size > 0) {
        console.log(`✅ Database dump created successfully!`);
        console.log(`📁 File: ${dumpFileName}`);
        console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log('\nTo restore this dump to another database:');
        console.log(`psql "your_database_url" < ${dumpFileName}`);
      } else {
        console.error('❌ Dump file was created but is empty');
      }
    } catch (err) {
      console.error('❌ Error checking dump file:', err);
    }
  });
}

// Run the dump creation
createDatabaseDump();
