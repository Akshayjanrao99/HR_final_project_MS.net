import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import authService from './services/authService';
import BackendStatus from './components/BackendStatus';

function Login({ onLogin }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(formData);
      
      if (response.success) {
        const userRole = response.user.role.toLowerCase();
        onLogin(userRole);
        
        // Setup automatic token refresh
        authService.setupTokenRefresh();
        
        navigate(userRole === 'admin' ? '/admin' : '/user');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already authenticated on component mount
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const userRole = authService.getUserRole()?.toLowerCase();
      if (userRole) {
        onLogin(userRole);
        navigate(userRole === 'admin' ? '/admin' : '/user');
      }
    }
  }, [navigate, onLogin]);

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-md-4 col-sm-6 col-10">
          <div className="card shadow" style={{ borderRadius: 10 }}>
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <img alt="image" src="/assets/img/emp-login.png" style={{ height: 60, width: 60 }} className="mb-3" />
                <h3 className="fw-bold text-primary">HR Work Sphere</h3>
                <p className="text-muted">Please login to continue</p>
              </div>
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error!</strong> {error}
                  <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Employee ID</label>
                  <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    className="form-control" 
                    placeholder="Enter your employee ID"
                    value={formData.username}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    className="form-control" 
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="d-grid gap-2 mb-3">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <small className="text-muted">
                    Demo: admin/admin or user/user
                  </small>
                </div>
              </form>
              
              <hr className="my-4" />
              
              <div className="text-center">
                <p className="mb-2">Connect with us:</p>
                <div className="social-icons" style={{ fontSize: 24 }}>
                  <i style={{ color: '#1877f2', margin: '0 8px', cursor: 'pointer' }} className="fab fa-facebook"></i>
                  <i style={{ color: '#ea4335', margin: '0 8px', cursor: 'pointer' }} className="fab fa-google"></i>
                  <i style={{ color: '#333', margin: '0 8px', cursor: 'pointer' }} className="fab fa-github"></i>
                  <i style={{ color: '#000', margin: '0 8px', cursor: 'pointer' }} className="fab fa-apple"></i>
                  <i style={{ color: '#e4405f', margin: '0 8px', cursor: 'pointer' }} className="fab fa-instagram"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 