# HR Work Sphere - React Frontend Setup

This document provides comprehensive setup instructions for connecting the React frontend with the Spring Boot backend.

## Overview of Changes Made

### 1. **Axios Integration**
- **Installed axios**: `npm install axios`
- **Replaced all fetch calls** with axios for better error handling and request/response management
- **Created axios configuration** in `src/config/axios.js` with interceptors for:
  - Request logging
  - Authentication token management
  - Comprehensive error handling
  - Response processing

### 2. **API Configuration**
- **Updated `src/services/api.js`**: Replaced fetch-based requests with axios
- **Updated `src/utils/apiClient.js`**: Complete axios integration
- **Updated `src/components/BackendStatus.jsx`**: Axios-based backend connectivity check

### 3. **Proxy Configuration**
- **Enhanced Vite config** (`vite.config.js`) with improved proxy settings:
  - Better error handling for backend unavailability
  - Path rewriting to avoid `/api` prefix issues
  - CORS headers for cross-origin requests
  - Detailed logging for debugging

## Project Structure

```
my-react-app/
├── src/
│   ├── config/
│   │   └── axios.js          # Axios configuration with interceptors
│   ├── services/
│   │   └── api.js            # API service functions using axios
│   ├── utils/
│   │   └── apiClient.js      # Comprehensive API client class
│   ├── components/
│   │   └── BackendStatus.jsx # Backend connectivity checker
│   └── ...
├── vite.config.js            # Vite configuration with proxy settings
└── package.json              # Dependencies including axios
```

## Setup Instructions

### Prerequisites
1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Spring Boot backend** running on `http://localhost:8080`

### 1. Install Dependencies
```bash
cd my-react-app
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The React app will start on `http://localhost:3000`

### 3. Backend Connection
The frontend is configured to connect to the Spring Boot backend at `http://localhost:8080` through a proxy.

**Important**: Make sure your Spring Boot application is running before starting the React app.

## Configuration Details

### Axios Configuration (`src/config/axios.js`)
- **Base URL**: `/api` (proxied to `http://localhost:8080`)
- **Timeout**: 10 seconds
- **Authentication**: Automatic Bearer token handling
- **Error Handling**: Comprehensive error messages for different scenarios

### Vite Proxy (`vite.config.js`)
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, ''),
    // ... error handling and logging
  }
}
```

### API Endpoints
The frontend expects the following Spring Boot endpoints:

#### Authentication
- `POST /login` - User authentication

#### Employee Management
- `GET /employees` - Get all employees
- `GET /employees/{id}` - Get employee by ID
- `POST /employees` - Create new employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

#### Additional Endpoints
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `GET /compose` - Get compose data
- `PUT /compose/{id}/status` - Update compose status
- `GET /test` - Backend health check

## Error Handling

### Connection Issues
The app handles various connection scenarios:
- **Backend not running**: Clear error message with instructions
- **Network timeouts**: Timeout notifications
- **Server errors**: Appropriate error messages based on status codes

### Authentication
- **Automatic token management**: Tokens stored in localStorage
- **401 errors**: Automatic logout and redirect to login
- **403 errors**: Permission denied messages

## Development Features

### Backend Status Checker
The `BackendStatus` component automatically checks backend connectivity and displays:
- ✅ **Connected**: Backend is running and responding
- ❌ **Disconnected**: Backend is not running
- ⚠️ **Error**: Backend has issues

### Debug Logging
All API requests and responses are logged to the browser console for debugging:
```
API Request: POST /api/login
API Response: 200 /api/login
```

## Troubleshooting

### Common Issues

1. **"Cannot connect to backend server"**
   - Ensure Spring Boot app is running on port 8080
   - Check if the backend has CORS configured properly

2. **"No static resource api/login"**
   - This issue is resolved with the new proxy configuration
   - The `/api` prefix is properly rewritten to avoid conflicts

3. **401 Authentication errors**
   - Check if the backend expects specific authentication headers
   - Verify token format and expiration

### Backend Requirements
Your Spring Boot application should:
1. **Run on port 8080**
2. **Accept JSON requests**
3. **Return JSON responses**
4. **Handle CORS** for `http://localhost:3000`

### CORS Configuration (Spring Boot)
Add this to your Spring Boot application:
```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class YourController {
    // ... your endpoints
}
```

Or configure globally:
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## Testing the Connection

1. **Start the Spring Boot backend** on port 8080
2. **Start the React frontend**: `npm run dev`
3. **Open browser** to `http://localhost:3000`
4. **Check the login page** - you should see the backend status indicator
5. **Try logging in** with demo credentials: `admin/admin` or `user/user`

## Production Deployment

For production deployment:
1. **Update axios baseURL** in `src/config/axios.js` to your production backend URL
2. **Build the React app**: `npm run build`
3. **Deploy the `dist` folder** to your web server
4. **Configure your backend** to serve the React app for unknown routes

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify the backend is running and accessible
3. Ensure all dependencies are installed correctly
4. Check the network tab in browser dev tools for failed requests

The configuration is now complete and should provide a seamless connection between your React frontend and Spring Boot backend with proper error handling and debugging capabilities.
