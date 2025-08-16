import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

function BackendStatus() {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Checking backend connection...');

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      // Use the correct dashboard test endpoint
      const response = await axiosInstance.get('/dashboard/test');
      console.log('Backend test response:', response.data);
      
      if (response.data && response.data.success) {
        setStatus('connected');
        setMessage('Backend is connected and working!');
      } else {
        setStatus('error');
        setMessage('Backend responded but with unexpected format');
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        setStatus('disconnected');
        setMessage('Backend is not running. Please start the Spring Boot application.');
      } else if (error.response?.status >= 500) {
        setStatus('error');
        setMessage('Backend is running but not responding correctly.');
      } else {
        setStatus('error');
        setMessage('Backend connection issue. Please check the server status.');
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'disconnected': return 'text-danger';
      case 'error': return 'text-warning';
      default: return 'text-info';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return '✅';
      case 'disconnected': return '❌';
      case 'error': return '⚠️';
      default: return '🔍';
    }
  };

  return (
    <div className={`alert alert-${status === 'connected' ? 'success' : status === 'disconnected' ? 'danger' : 'warning'} d-flex align-items-center`} role="alert">
      <span className="me-2">{getStatusIcon()}</span>
      <div>
        <strong>Backend Status:</strong> <span className={getStatusColor()}>{message}</span>
        {status !== 'connected' && (
          <div className="mt-2">
            <small>
              To start the backend:
              <br />
              1. Open terminal in the HR-Work-Sphere directory
              <br />
              2. Run: <code>mvn spring-boot:run</code>
              <br />
              3. <button className="btn btn-sm btn-outline-primary ms-2" onClick={checkBackendStatus}>
                Recheck Status
              </button>
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

export default BackendStatus;
