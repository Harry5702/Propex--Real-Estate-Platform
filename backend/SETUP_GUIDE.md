# Backend Setup & Testing Guide

## ✅ Environment Files Created

Your backend is now configured with:
- `.env` file with database credentials and configuration
- `package.json` with all required dependencies  
- `server.js` with basic API endpoints and database connection

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Update .env File
Edit `backend/.env` and update the database password to match your setup:
```env
DB_PASSWORD=your_actual_password_here
DATABASE_URL=postgresql://realestate_user:your_actual_password_here@localhost:5432/pakistani_real_estate
```

### 3. Test Database Connection
```bash
npm run dev
```

The server will start on `http://localhost:5000` and you should see:
- ✅ Database connected successfully
- 🚀 Server running on port 5000

### 4. Test API Endpoints

Open your browser or use curl to test:

**Health Check:**
```
http://localhost:5000/health
```

**Database Health:**
```
http://localhost:5000/api/health/db
```

**Properties API:**
```
http://localhost:5000/api/properties
```

**Property Analytics:**
```
http://localhost:5000/api/analytics/properties
```

## 📊 Database Connection Test

If everything is working correctly, you should see:
```json
{
  "status": "OK",
  "message": "Database connection is healthy",
  "data": {
    "current_time": "2024-10-11T...",
    "db_version": "PostgreSQL 17..."
  }
}
```

## 🔧 Environment Variables

### Backend (.env)
- Database credentials and connection string
- JWT secrets for authentication
- File upload configuration
- Email settings for notifications
- Security and rate limiting settings

### Frontend (.env)
- API base URL configuration
- Admin credentials (for demo)
- Google Maps API key
- Social media links
- Feature flags

## 🛠️ Next Steps

Once the backend is running successfully:

1. **Start Frontend:**
   ```bash
   cd ../frontend
   npm start
   ```

2. **Test Admin Panel:**
   - Visit: `http://localhost:3000`
   - Click profile icon (⭐) in navbar
   - Login with: `admin` / `admin123`

3. **Add Sample Properties:**
   - Use the admin panel to add properties
   - Properties will be stored in your PostgreSQL database

4. **View Analytics:**
   - Browse properties to generate view data
   - Check analytics in admin dashboard

## 📝 Configuration Notes

### Database Password
Make sure to update the password in `.env` to match what you set when creating the `realestate_user`:

```env
DB_PASSWORD=your_actual_password
DATABASE_URL=postgresql://realestate_user:your_actual_password@localhost:5432/pakistani_real_estate
```

### CORS Origin
The backend is configured to accept requests from `http://localhost:3000`. If your frontend runs on a different port, update:

```env
CORS_ORIGIN=http://localhost:3001
```

### File Uploads
For production, configure Cloudinary or AWS S3 for image storage:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🔒 Security Notes

- The JWT secret should be changed in production
- Database passwords should be strong and unique
- Rate limiting is configured for API protection
- CORS is properly configured for frontend access

## 📈 Monitoring

The server includes:
- Health check endpoints
- Request logging with Morgan
- Database connection monitoring
- Error handling and reporting

Your backend is now ready to support the admin panel with full database integration!