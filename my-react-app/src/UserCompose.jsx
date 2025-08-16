import React, { useState } from 'react';
import { leaveAPI } from './services/api';
import { showSuccessMessage, showErrorMessage } from './utils/utils';

function UserCompose() {
  const [form, setForm] = useState({ 
    subject: '',
    text: '',
    leaveType: 'sick',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave' },
    { value: 'casual', label: 'Casual Leave' },
    { value: 'annual', label: 'Annual Leave' },
    { value: 'emergency', label: 'Emergency Leave' },
    { value: 'maternity', label: 'Maternity Leave' },
    { value: 'paternity', label: 'Paternity Leave' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Calculate number of days
      const fromDate = new Date(form.fromDate);
      const toDate = new Date(form.toDate);
      const timeDiff = toDate - fromDate;
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      if (daysDiff <= 0) {
        showErrorMessage('Error', 'To date must be after from date');
        return;
      }
      
      // Validate user data
      if (!userData.name && !userData.id) {
        showErrorMessage('Error', 'User information not found. Please login again.');
        return;
      }
      
      const leaveRequest = {
        EmpName: userData.name || `User ${userData.id}`,  // Use PascalCase to match backend DTO
        Subject: form.subject || `${form.leaveType.charAt(0).toUpperCase() + form.leaveType.slice(1)} Leave Request`,
        LeaveType: form.leaveType,
        FromDate: new Date(form.fromDate).toISOString(),  // Proper ISO date conversion
        ToDate: new Date(form.toDate).toISOString(),      // Proper ISO date conversion
        LeaveDays: daysDiff,
        Reason: form.text || form.reason,
        Text: form.text || form.reason,                   // Use PascalCase
        ParentUkid: (userData.id || 1).toString(),        // Use PascalCase
        Position: userData.designation || 'Employee',      // Use PascalCase
        AddedDate: new Date().toISOString(),              // Use PascalCase
        Status: 'PENDING'                                 // Use PascalCase
      };
      
      console.log('Leave Request Data being sent:', leaveRequest);
      console.log('User Data from localStorage:', userData);
      
      const response = await leaveAPI.create(leaveRequest);
      
      if (response.success) {
        showSuccessMessage('Success!', 'Leave request submitted successfully');
        
        // Reset form
        setForm({
          subject: '',
          text: '',
          leaveType: 'sick',
          fromDate: '',
          toDate: '',
          reason: ''
        });
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      showErrorMessage('Error!', error.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="row mt-3">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-body">
              <h4 style={{ textAlign: 'center' }}>Compose</h4>
              <hr />
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="leaveType" className="form-label"><b>Leave Type *</b></label>
                      <select 
                        name="leaveType" 
                        id="leaveType"
                        className="form-select" 
                        required 
                        value={form.leaveType} 
                        onChange={handleChange}
                      >
                        {leaveTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label"><b>Subject *</b></label>
                      <input 
                        type="text" 
                        name="subject" 
                        id="subject"
                        className="form-control" 
                        placeholder="Enter subject or leave it auto-generated"
                        value={form.subject} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="fromDate" className="form-label"><b>From Date *</b></label>
                      <input 
                        type="date" 
                        name="fromDate" 
                        id="fromDate"
                        className="form-control" 
                        required 
                        value={form.fromDate} 
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="toDate" className="form-label"><b>To Date *</b></label>
                      <input 
                        type="date" 
                        name="toDate" 
                        id="toDate"
                        className="form-control" 
                        required 
                        value={form.toDate} 
                        onChange={handleChange}
                        min={form.fromDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
                
                {form.fromDate && form.toDate && (
                  <div className="alert alert-info mb-3">
                    <strong>Duration:</strong> {Math.ceil((new Date(form.toDate) - new Date(form.fromDate)) / (1000 * 3600 * 24)) + 1} days
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="text" className="form-label"><b>Reason/Description *</b></label>
                  <textarea 
                    name="text" 
                    id="text"
                    className="form-control"
                    rows="4"
                    placeholder="Please provide detailed reason for your leave request..."
                    required 
                    value={form.text} 
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Submit Leave Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserCompose; 