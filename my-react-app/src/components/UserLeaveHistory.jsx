import React, { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import { showErrorMessage } from '../utils/utils';

function UserLeaveHistory() {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState({
    pending: 0,
    approved: 0,
    canceled: 0,
    denied: 0,
    total: 0,
    remaining: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchLeaveHistory();
    fetchLeaveSummary();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id;

      if (userId) {
        const data = await leaveAPI.getByUser(userId);
        setLeaveHistory(data);
      }
    } catch (error) {
      console.error('Error fetching leave history:', error);
      showErrorMessage('Error!', 'Failed to fetch leave history');
      setLeaveHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveSummary = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userData.id;

      if (userId) {
        const response = await fetch(`/api/employee/${userId}/leave-summary`);
        const data = await response.json();
        setLeaveSummary(data);
      }
    } catch (error) {
      console.error('Error fetching leave summary:', error);
    }
  };

  const parseLeaveDetails = (text) => {
    if (!text) return null;

    // Check if this is structured data (new format)
    if (text.includes('Leave Type:') && text.includes('From:') && text.includes('To:')) {
      const lines = text.split('\n');
      const details = {};
      
      lines.forEach(line => {
        const [key, ...valueParts] = line.split(': ');
        if (key && valueParts.length > 0) {
          details[key.trim()] = valueParts.join(': ').trim();
        }
      });
      
      return {
        type: details['Leave Type'] || 'N/A',
        fromDate: details['From'] || 'N/A',
        toDate: details['To'] || 'N/A',
        days: details['Days'] || 'N/A',
        reason: details['Reason'] || 'N/A',
        structured: true
      };
    }
    
    return {
      type: 'Legacy',
      reason: text,
      structured: false
    };
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { class: 'bg-warning text-dark', icon: 'fa-clock' },
      'APPROVED': { class: 'bg-success', icon: 'fa-check' },
      'REJECTED': { class: 'bg-danger', icon: 'fa-times' },
      'CANCELLED': { class: 'bg-secondary', icon: 'fa-ban' }
    };
    
    const statusInfo = statusMap[status] || { class: 'bg-secondary', icon: 'fa-question' };
    return (
      <span className={`badge ${statusInfo.class} d-flex align-items-center gap-1`}>
        <i className={`fas ${statusInfo.icon}`}></i>
        {status}
      </span>
    );
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      'sick': '#dc3545',
      'casual': '#28a745',
      'annual': '#007bff',
      'emergency': '#fd7e14',
      'maternity': '#e83e8c',
      'paternity': '#6f42c1',
      'other': '#6c757d'
    };
    return colors[type?.toLowerCase()] || '#6c757d';
  };

  const sortAndFilterHistory = () => {
    let filtered = [...leaveHistory];

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(leave => leave.status?.toLowerCase() === filter.toLowerCase());
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedDate) - new Date(a.addedDate);
        case 'oldest':
          return new Date(a.addedDate) - new Date(b.addedDate);
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'type':
          const aDetails = parseLeaveDetails(a.text);
          const bDetails = parseLeaveDetails(b.text);
          return (aDetails?.type || '').localeCompare(bDetails?.type || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredHistory = sortAndFilterHistory();

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading leave history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="user-leave-history">
      <style jsx>{`
        .user-leave-history {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
        }
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .history-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        
        .history-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .control-label {
          font-size: 0.8rem;
          color: #666;
          margin: 0;
        }
        
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }
        
        .summary-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .summary-card.approved {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .summary-card.pending {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        
        .summary-card.rejected {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        }
        
        .summary-card.remaining {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }
        
        .summary-number {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .summary-label {
          font-size: 0.8rem;
          opacity: 0.9;
        }
        
        .summary-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 1.5rem;
          opacity: 0.3;
        }
        
        .history-list {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
        }
        
        .leave-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .leave-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .leave-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .leave-title {
          font-weight: bold;
          color: #495057;
          margin: 0;
          flex: 1;
        }
        
        .leave-date {
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .leave-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .detail-icon {
          width: 20px;
          color: #6c757d;
        }
        
        .detail-label {
          font-weight: 500;
          color: #495057;
          min-width: 60px;
        }
        
        .detail-value {
          color: #6c757d;
        }
        
        .leave-type-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
        }
        
        .leave-reason {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 6px;
          border-left: 4px solid #007bff;
          margin-top: 10px;
        }
        
        .leave-reason-label {
          font-weight: 500;
          color: #495057;
          margin-bottom: 5px;
        }
        
        .leave-reason-text {
          color: #6c757d;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .no-history {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }
        
        .no-history-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.3;
        }
        
        .stats-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 15px;
          background: #e3f2fd;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1976d2;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: #666;
          margin-top: 5px;
        }
        
        @media (max-width: 768px) {
          .history-header {
            flex-direction: column;
            text-align: center;
          }
          
          .history-controls {
            width: 100%;
            justify-content: center;
          }
          
          .summary-cards {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .leave-details {
            grid-template-columns: 1fr;
          }
          
          .stats-row {
            flex-wrap: wrap;
            gap: 15px;
          }
        }
      `}</style>

      <div className="history-header">
        <h2 className="history-title">My Leave History</h2>
        <div className="history-controls">
          <div className="control-group">
            <label className="control-label">Filter by Status</label>
            <select 
              className="form-select form-select-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ minWidth: '120px' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="control-group">
            <label className="control-label">Sort by</label>
            <select 
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ minWidth: '120px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="status">By Status</option>
              <option value="type">By Type</option>
            </select>
          </div>
          
          <button className="btn btn-sm btn-outline-primary" onClick={fetchLeaveHistory}>
            <i className="fas fa-refresh me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Leave Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <i className="fas fa-clipboard-list summary-icon"></i>
          <div className="summary-number">{leaveSummary.total}</div>
          <div className="summary-label">Total Requests</div>
        </div>
        
        <div className="summary-card approved">
          <i className="fas fa-check-circle summary-icon"></i>
          <div className="summary-number">{leaveSummary.approved}</div>
          <div className="summary-label">Approved</div>
        </div>
        
        <div className="summary-card pending">
          <i className="fas fa-clock summary-icon"></i>
          <div className="summary-number">{leaveSummary.pending}</div>
          <div className="summary-label">Pending</div>
        </div>
        
        <div className="summary-card rejected">
          <i className="fas fa-times-circle summary-icon"></i>
          <div className="summary-number">{leaveSummary.denied}</div>
          <div className="summary-label">Rejected</div>
        </div>
        
        <div className="summary-card remaining">
          <i className="fas fa-calendar-plus summary-icon"></i>
          <div className="summary-number">{leaveSummary.remaining}</div>
          <div className="summary-label">Days Remaining</div>
        </div>
      </div>

      {/* Leave History List */}
      <div className="history-list">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((leave) => {
            const details = parseLeaveDetails(leave.text);
            return (
              <div key={leave.id} className="leave-card">
                <div className="leave-header">
                  <h6 className="leave-title">
                    {leave.subject || 'Leave Request'}
                  </h6>
                  <div className="d-flex align-items-center gap-2">
                    {getStatusBadge(leave.status)}
                    <span className="leave-date">
                      {formatDate(leave.addedDate)}
                    </span>
                  </div>
                </div>
                
                {details && details.structured ? (
                  <div className="leave-details">
                    <div className="detail-item">
                      <i className="fas fa-tag detail-icon"></i>
                      <span className="detail-label">Type:</span>
                      <span 
                        className="leave-type-badge"
                        style={{ backgroundColor: getLeaveTypeColor(details.type) }}
                      >
                        {details.type}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <i className="fas fa-calendar-alt detail-icon"></i>
                      <span className="detail-label">From:</span>
                      <span className="detail-value">{details.fromDate}</span>
                    </div>
                    
                    <div className="detail-item">
                      <i className="fas fa-calendar-check detail-icon"></i>
                      <span className="detail-label">To:</span>
                      <span className="detail-value">{details.toDate}</span>
                    </div>
                    
                    <div className="detail-item">
                      <i className="fas fa-clock detail-icon"></i>
                      <span className="detail-label">Days:</span>
                      <span className="detail-value">
                        <strong>{details.days}</strong> day{details.days !== '1' ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="leave-details">
                    <div className="detail-item">
                      <i className="fas fa-tag detail-icon"></i>
                      <span className="detail-label">Type:</span>
                      <span className="leave-type-badge" style={{ backgroundColor: '#6c757d' }}>
                        Legacy Format
                      </span>
                    </div>
                  </div>
                )}
                
                {details && details.reason && details.reason !== 'N/A' && (
                  <div className="leave-reason">
                    <div className="leave-reason-label">Reason:</div>
                    <div className="leave-reason-text">{details.reason}</div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-history">
            <i className="fas fa-calendar-times no-history-icon"></i>
            <h5>No Leave History Found</h5>
            <p>
              {filter === 'all' 
                ? "You haven't submitted any leave requests yet." 
                : `No leave requests found with status: ${filter}`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLeaveHistory;
