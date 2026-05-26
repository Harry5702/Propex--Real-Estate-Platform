# PostgreSQL Database Setup Instructions

## Prerequisites
1. Install PostgreSQL 14+ on your system
2. Install pgAdmin (optional, for GUI management)
3. Node.js and npm (for backend dependencies)

## Database Setup Steps

### 1. Install PostgreSQL
**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run the installer and note down the password for 'postgres' user
- Default port: 5432

**Alternative - Using Docker:**
```bash
docker run --name pakistani-real-estate-db -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=pakistani_real_estate -p 5432:5432 -d postgres:14
```

### 2. Create Database
Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
-- Connect as postgres user
CREATE DATABASE pakistani_real_estate;
CREATE USER realestate_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE pakistani_real_estate TO realestate_user;
```

### 3. Run Schema Script
Navigate to the database folder and execute the schema:

```bash
# Using psql command line
psql -U postgres -d pakistani_real_estate -f schema.sql

# Or if using the created user
psql -U realestate_user -d pakistani_real_estate -f schema.sql
```

### 4. Environment Configuration
Create a `.env` file in your backend/server directory:

```env
# Database Configuration
DATABASE_URL=postgresql://realestate_user:secure_password_123@localhost:5432/pakistani_real_estate
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pakistani_real_estate
DB_USER=realestate_user
DB_PASSWORD=secure_password_123

# Admin Credentials (these will be hardcoded in frontend)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# JWT Secret for admin authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration (for property images)
UPLOAD_PATH=./uploads/properties
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpeg,jpg,png,webp
```

### 5. Backend Dependencies
Install required Node.js packages:

```bash
cd backend
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken multer pg helmet express-rate-limit compression morgan uuid geoip-lite useragent
npm install -D nodemon
```

### 6. Database Connection Test
Create a simple test file to verify connection:

```javascript
// test-db-connection.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected successfully!');
    console.log('Current time:', result.rows[0].now);
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await pool.end();
  }
}

testConnection();
```

### 7. Verify Installation
Run these SQL queries to verify the schema was created correctly:

```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check admin user was inserted
SELECT username, email, full_name, created_at FROM admin_users;

-- Check property categories
SELECT name, slug, display_order FROM property_categories ORDER BY display_order;

-- Check indexes
SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
```

### 8. Sample Data (Optional)
You can insert some sample properties for testing:

```sql
-- Insert sample properties
INSERT INTO properties (
    title, description, price, property_type, bedrooms, bathrooms, area_sqft, 
    parking_spaces, address, area, agent_name, agent_phone, agent_email,
    features, main_image_url, created_by
) VALUES 
(
    'Luxury Villa in DHA Phase 6',
    'Beautiful 5 bedroom villa with modern amenities, swimming pool, and garden.',
    55000000.00,
    'villa',
    5,
    6,
    4500,
    3,
    'Street 12, DHA Phase 6, Islamabad',
    'DHA Phase 6',
    'Ahmed Hassan',
    '+92-300-1234567',
    'ahmed@realestate.pk',
    ARRAY['Swimming Pool', 'Garden', 'Gym', 'Security', 'Garage'],
    'https://example.com/villa1.jpg',
    (SELECT id FROM admin_users WHERE username = 'admin')
);
```

## Security Notes
1. **Change default passwords** in production
2. **Use strong JWT secrets**
3. **Enable SSL** for database connections in production
4. **Set up proper firewall rules**
5. **Regular database backups**

## Backup and Restore
```bash
# Create backup
pg_dump -U realestate_user -h localhost -d pakistani_real_estate > backup.sql

# Restore backup
psql -U realestate_user -h localhost -d pakistani_real_estate < backup.sql
```

## Monitoring
Consider setting up:
- Database connection pooling
- Query performance monitoring
- Regular health checks
- Log rotation

## Next Steps
After setting up the database:
1. Create backend API endpoints
2. Set up admin authentication
3. Implement property CRUD operations
4. Add analytics tracking
5. Test all functionality

The database schema includes:
- ✅ Admin authentication system
- ✅ Comprehensive property management
- ✅ Analytics and view tracking
- ✅ Inquiry management
- ✅ Activity logging
- ✅ Performance indexes
- ✅ Data integrity constraints