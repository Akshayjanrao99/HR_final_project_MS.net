import React, { useState, useEffect } from 'react';
import { leaveAPI } from './services/api';
import { handleApproval, showSuccessMessage, showErrorMessage } from './utils/utils';

function Status() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch leave requests on component mount
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await leaveAPI.getAll();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      showErrorMessage('Error!', 'Failed to fetch leave requests');
      // Fallback to demo data
      setLeaveRequests([
        {
          id: 1,
          empName: 'Mahima Devi',
          position: 'System Architect',
          subject: 'Sick Leave Request',
          text: 'Hello Sir, I want 10 days leave because I am going for training.',
          addedDate: '2024-04-01',
          status: 'PENDING'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await leaveAPI.updateStatus(id, newStatus);
      
      if (response.success) {
        // Update the local state
        setLeaveRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === id ? { ...request, status: newStatus.toUpperCase() } : request
          )
        );
        showSuccessMessage('Success!', `Leave request ${newStatus.toLowerCase()} successfully`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showErrorMessage('Error!', error.message || 'Failed to update status');
    }
  };

  const handleApprove = (id) => {
    handleApproval(id, 'approve', () => handleStatusUpdate(id, 'APPROVED'));
  };

  const handleReject = (id) => {
    handleApproval(id, 'reject', () => handleStatusUpdate(id, 'REJECTED'));
  };

  const handleCancel = (id) => {
    handleApproval(id, 'cancel', () => handleStatusUpdate(id, 'CANCELLED'));
  };

  // Filter requests based on status
  const filteredRequests = leaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { class: 'bg-warning', text: 'Pending' },
      'APPROVED': { class: 'bg-success', text: 'Approved' },
      'REJECTED': { class: 'bg-danger', text: 'Rejected' },
      'CANCELLED': { class: 'bg-secondary', text: 'Cancelled' }
    };
    
    const statusInfo = statusMap[status] || { class: 'bg-secondary', text: status };
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <section>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Leave Request Status</h2>
          <div className="d-flex gap-2">
            <select 
              className="form-select" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="btn btn-outline-primary" onClick={fetchLeaveRequests}>
              <i className="fas fa-refresh me-2"></i>
              Refresh
            </button>
          </div>
        </div>

        <div className="card shadow">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              Leave Requests ({filteredRequests.length} requests)
            </h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Subject</th>
                    <th style={{ minWidth: '250px' }}>Leave Details</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          <div className="spinner-border" role="status" aria-hidden="true"></div>
                          <p className="mt-2">Loading requests...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRequests.length > 0 ? (
                    filteredRequests.map((request, index) => (
                      <tr key={request.id}>
                        <td>{index + 1}</td>
                        <td className="fw-bold">{request.empName}</td>
                        <td>{request.position}</td>
                        <td>{request.subject}</td>
                        <td style={{ minWidth: '200px' }}>
                          {(() => {
                            // Parse the text field to extract leave details
                            const text = request.text || '';
                            
                            // Check if this is structured data (new format) or old format
                            if (text.includes('Leave Type:') && text.includes('From:') && text.includes('To:')) {
                              // New structured format
                              const lines = text.split('\n');
                              const details = {};
                              
                              lines.forEach(line => {
                                const [key, ...valueParts] = line.split(': ');
                                if (key && valueParts.length > 0) {
                                  details[key.trim()] = valueParts.join(': ').trim();
                                }
                              });
                              
                              return (
                                <div className="leave-details">
                                  <div className="mb-1">
                                    <strong>Type:</strong> <span className="badge bg-primary">{details['Leave Type'] || 'N/A'}</span>
                                  </div>
                                  <div className="mb-1">
                                    <strong>From:</strong> {details['From'] || 'N/A'}
                                  </div>
                                  <div className="mb-1">
                                    <strong>To:</strong> {details['To'] || 'N/A'}
                                  </div>
                                  <div className="mb-1">
                                    <strong>Days:</strong> <span className="badge bg-info">{details['Days'] || 'N/A'}</span>
                                  </div>
                                  <div className="small text-muted" title={details['Reason'] || 'No reason provided'}>
                                    <strong>Reason:</strong> {details['Reason'] ? (details['Reason'].length > 30 ? `${details['Reason'].substring(0, 30)}...` : details['Reason']) : 'N/A'}
                                  </div>
                                </div>
                              );
                            } else {
                              // Old format - display as simple text
                              return (
                                <div className="leave-details">
                                  <div className="mb-1">
                                    <strong>Type:</strong> <span className="badge bg-secondary">Legacy</span>
                                  </div>
                                  <div className="mb-1">
                                    <strong>Details:</strong> {text || 'No details available'}
                                  </div>
                                  <div className="small text-muted">
                                    <em>This is an old format leave request</em>
                                  </div>
                                </div>
                              );
                            }
                          })()} 
                        </td>
                        <td>{new Date(request.addedDate).toLocaleDateString()}</td>
                        <td>{getStatusBadge(request.status)}</td>
                        <td>
                          {request.status === 'PENDING' ? (
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(request.id)}
                                title="Approve"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(request.id)}
                                title="Reject"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleCancel(request.id)}
                                title="Cancel"
                              >
                                <i className="fas fa-ban"></i>
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted">No actions available</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="text-muted">
                          <i className="fas fa-inbox fa-3x mb-3"></i>
                          <p>No leave requests found for the selected filter.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="h4 mb-0">{leaveRequests.length}</div>
                    <div>Total Requests</div>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-clipboard-list fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="h4 mb-0">{leaveRequests.filter(r => r.status === 'PENDING').length}</div>
                    <div>Pending</div>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-clock fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="h4 mb-0">{leaveRequests.filter(r => r.status === 'APPROVED').length}</div>
                    <div>Approved</div>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-check-circle fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-danger text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="h4 mb-0">{leaveRequests.filter(r => r.status === 'REJECTED').length}</div>
                    <div>Rejected</div>
                  </div>
                  <div className="align-self-center">
                    <i className="fas fa-times-circle fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Status; 