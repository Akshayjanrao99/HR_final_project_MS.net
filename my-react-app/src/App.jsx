import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import './assets/css/style.css';
import Home from './Home'
import About from './About'
import Login from './Login'
import Base from './Base'
import DashBoard from './DashBoard'
import AddEmployee from './AddEmployee'
import AllEmployee from './AllEmployee'
import CreatePost from './CreatePost'
import Status from './Status'
import MyProfile from './MyProfile'
import Setting from './Setting'
import EditRecord from './EditRecord'
import PayrollGeneration from './components/PayrollGeneration'

// User components
import UserBase from './UserBase'
import UserDashBoard from './UserDashBoard'
import UserProfile from './UserProfile'
import UserSetting from './UserSetting'
import UserCompose from './UserCompose'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState('admin') // 'admin' or 'user'
  const [loading, setLoading] = useState(true)

  // Check for existing authentication on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUserRole(user.role.toLowerCase());
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (role = 'admin') => {
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole('admin')
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        {/* Protected Admin Routes */}
        {isAuthenticated && userRole === 'admin' && (
          <Route path="/admin" element={<Base onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/admin/dash-board" replace />} />
            <Route path="dash-board" element={<DashBoard />} />
            <Route path="add-employee" element={<AddEmployee />} />
            <Route path="all-employee" element={<AllEmployee />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="status" element={<Status />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="setting" element={<Setting />} />
            <Route path="edit-record" element={<EditRecord />} />
            <Route path="payroll-generation" element={<PayrollGeneration />} />
          </Route>
        )}
        
        {/* Protected User Routes */}
        {isAuthenticated && userRole === 'user' && (
          <Route path="/user" element={<UserBase onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/user/dash-board" replace />} />
            <Route path="dash-board" element={<UserDashBoard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="setting" element={<UserSetting />} />
            <Route path="compose" element={<UserCompose />} />
          </Route>
        )}
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
