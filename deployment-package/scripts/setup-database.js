
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up Canal del Congreso CMS Database...');

  // Read environment variables
  const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

  const client = new Client(config);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating database schema...');
    await client.query(schema);
    console.log('✅ Database schema created successfully');

    // Read and execute radio schema
    const radioSchemaPath = path.join(__dirname, '..', 'radio-database-schema.sql');
    if (fs.existsSync(radioSchemaPath)) {
      const radioSchema = fs.readFileSync(radioSchemaPath, 'utf8');
      console.log('📻 Creating radio database schema...');
      await client.query(radioSchema);
      console.log('✅ Radio database schema created successfully');
    }

    // Apply latest changes
    const changesPath = path.join(__dirname, '..', 'latest-database-changes.sql');
    if (fs.existsSync(changesPath)) {
      const changes = fs.readFileSync(changesPath, 'utf8');
      console.log('🔄 Applying latest database changes...');
      await client.query(changes);
      console.log('✅ Latest changes applied successfully');
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Copy .env.example to .env and configure your environment variables');
    console.log('2. Run "npm install" to install dependencies');
    console.log('3. Run "npm run build" to build the application');
    console.log('4. Run "npm start" to start the application');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
