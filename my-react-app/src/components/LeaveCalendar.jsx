import React, { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';

function LeaveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month'); // month, week

  useEffect(() => {
    fetchLeaveRequests();
  }, [currentDate]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const data = await leaveAPI.getAll();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getLeaveForDate = (date) => {
    return leaveRequests.filter(leave => {
      if (!leave.text || !leave.text.includes('From:') || !leave.text.includes('To:')) {
        return false;
      }

      try {
        const lines = leave.text.split('\n');
        let fromDate = null, toDate = null;

        lines.forEach(line => {
          if (line.startsWith('From:')) {
            fromDate = new Date(line.split(': ')[1].trim());
          }
          if (line.startsWith('To:')) {
            toDate = new Date(line.split(': ')[1].trim());
          }
        });

        if (fromDate && toDate) {
          const checkDate = new Date(date);
          return checkDate >= fromDate && checkDate <= toDate;
        }
      } catch (error) {
        console.error('Error parsing leave dates:', error);
      }
      return false;
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'REJECTED': return '#dc3545';
      case 'CANCELLED': return '#6c757d';
      default: return '#e9ecef';
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const leavesForDay = getLeaveForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? 'today' : ''}`}
          title={leavesForDay.length > 0 ? `${leavesForDay.length} leave request(s)` : ''}
        >
          <div className="day-number">{day}</div>
          {leavesForDay.length > 0 && (
            <div className="leave-indicators">
              {leavesForDay.slice(0, 3).map((leave, idx) => (
                <div
                  key={idx}
                  className="leave-indicator"
                  style={{ backgroundColor: getStatusColor(leave.status) }}
                  title={`${leave.empName} - ${leave.status}`}
                ></div>
              ))}
              {leavesForDay.length > 3 && (
                <span className="more-indicator">+{leavesForDay.length - 3}</span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="leave-calendar">
      <style jsx>{`
        .leave-calendar {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
        }
        
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .calendar-nav {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .nav-btn {
          background: #007bff;
          color: white;
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
        }
        
        .nav-btn:hover {
          background: #0056b3;
        }
        
        .current-month {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          min-width: 180px;
          text-align: center;
        }
        
        .calendar-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .view-toggle {
          display: flex;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .view-btn {
          padding: 6px 12px;
          background: white;
          border: none;
          cursor: pointer;
          font-size: 12px;
        }
        
        .view-btn.active {
          background: #007bff;
          color: white;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .calendar-header-day {
          background: #f8f9fa;
          padding: 10px 5px;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
          color: #666;
        }
        
        .calendar-day {
          background: white;
          min-height: 80px;
          padding: 5px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .calendar-day:hover {
          background: #f8f9fa;
        }
        
        .calendar-day.empty {
          background: #f5f5f5;
          cursor: default;
        }
        
        .calendar-day.today {
          background: #e3f2fd;
          border: 2px solid #2196f3;
        }
        
        .day-number {
          font-weight: bold;
          margin-bottom: 3px;
          font-size: 14px;
        }
        
        .leave-indicators {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          align-items: center;
        }
        
        .leave-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        
        .more-indicator {
          font-size: 10px;
          color: #666;
          margin-left: 2px;
        }
        
        .legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
        }
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }
        
        @media (max-width: 768px) {
          .calendar-header {
            flex-direction: column;
            text-align: center;
          }
          
          .current-month {
            font-size: 1.2rem;
          }
          
          .calendar-day {
            min-height: 60px;
            font-size: 12px;
          }
          
          .legend {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={() => navigateMonth(-1)}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="current-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button className="nav-btn" onClick={() => navigateMonth(1)}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="calendar-controls">
          <button className="btn btn-sm btn-outline-primary" onClick={fetchLeaveRequests}>
            <i className="fas fa-refresh me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="calendar-grid">
            {weekDays.map(day => (
              <div key={day} className="calendar-header-day">{day}</div>
            ))}
            {renderCalendarDays()}
          </div>
          
          <div className="legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#28a745' }}></div>
              <span>Approved</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ffc107' }}></div>
              <span>Pending</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#dc3545' }}></div>
              <span>Rejected</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#6c757d' }}></div>
              <span>Cancelled</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LeaveCalendar;
