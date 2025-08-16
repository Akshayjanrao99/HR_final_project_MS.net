import React, { useEffect, useState } from 'react';
import LeaveCalendar from './components/LeaveCalendar';
import { postsAPI, dashboardAPI, leaveAPI } from './services/api';

function DashBoard() {
  const [summary, setSummary] = useState({
    totalEmployees: 0, activeProjects: 0, pendingRequests: 0, completedTasks: 0,
    development: 0, qaTesting: 0, networking: 0,
    hrTeam: 0, security: 0, sealsMarket: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState({
    pending: 0, approved: 0, canceled: 0, denied: 0, total: 0, remaining: 0
  });
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Remove mock data for dashboard statistics as it will be fetched dynamically
  // const stats = {
  //   totalEmployees: 156,
  //   activeProjects: 23,
  //   pendingRequests: 8,
  //   completedTasks: 342
  // };

  const recentActivities = [
    { id: 1, action: 'New employee added', user: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Project updated', user: 'Jane Smith', time: '4 hours ago' },
    { id: 3, action: 'Leave request approved', user: 'Mike Johnson', time: '6 hours ago' },
    { id: 4, action: 'Task completed', user: 'Sarah Wilson', time: '1 day ago' }
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.id; // Get user ID from localStorage

    // Fetch dashboard statistics using proper API
    const fetchDashboardData = async () => {
      try {
        const dashboardStats = await dashboardAPI.getStats();
        setSummary(prevSummary => ({ ...prevSummary, ...dashboardStats }));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Use fallback data if API fails
        setSummary({
          totalEmployees: 156,
          activeProjects: 23,
          pendingRequests: 8,
          completedTasks: 342,
          development: 15,
          qaTesting: 8,
          networking: 12,
          hrTeam: 5,
          security: 7,
          sealsMarket: 10
        });
      }
    };

    // Fetch department summary
    const fetchDepartmentSummary = async () => {
      try {
        const departmentData = await dashboardAPI.getDepartmentSummary();
        setSummary(prevSummary => ({ ...prevSummary, ...departmentData }));
      } catch (error) {
        console.error('Error fetching department summary:', error);
      }
    };

    // Fetch leave summary for the logged-in user
    const fetchLeaveSummary = async () => {
      if (userId) {
        try {
          const leaveData = await leaveAPI.getSummary(userId);
          setLeaveSummary(leaveData);
        } catch (error) {
          console.error('Error fetching leave summary:', error);
          // Use fallback data
          setLeaveSummary({
            pending: 3,
            approved: 12,
            canceled: 2,
            denied: 1,
            total: 18,
            remaining: 12
          });
        }
      }
    };

    fetchDashboardData();
    fetchDepartmentSummary();
    fetchLeaveSummary();

    // Fetch posts from backend
    const fetchPosts = async () => {
      try {
        setPostsLoading(true);
        const postsData = await postsAPI.getAll();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Fallback to demo data
        setPosts([
          { id: 1, title: 'Welcome to HR Portal', content: 'Welcome to our HR Management System!', author: 'Admin', addedDate: new Date().toDateString() }
        ]);
      } finally {
        setPostsLoading(false);
      }
    };
    
    fetchPosts();

    // Fetch upcoming events (keep mock for now)
    const mockEvents = [
      { name: "Sonu Kumar", imgUrl: "/assets/img/skp.jpg", type: "birthday", date: "13-02-2025" },
      { name: "Mona Kumari", imgUrl: "/assets/img/g1.jpg", type: "anniversary", date: "18-01-2025" }
    ];
    setUpcomingEvents(mockEvents);
  }, []);

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Dashboard</h2>
      
      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Employees
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{summary.totalEmployees}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Active Projects
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{summary.activeProjects}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-project-diagram fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending Requests
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{summary.pendingRequests}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-clock fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Completed Tasks
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{summary.completedTasks}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department-wise Summary */}
      <div className="row mb-4">
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body">
              <b>Development [{summary.development}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body">
              <b>QA Testing [{summary.qaTesting}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body">
              <b>Networking [{summary.networking}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body">
              <b>HR Team [{summary.hrTeam}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body">
              <b>Security [{summary.security}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body">
              <b>Seals Market [{summary.sealsMarket}]</b>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Summary for Admin */}
      <div className="row">
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body bg-warning">
              <b>Pending [{leaveSummary.pending}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body bg-success">
              <b style={{ color: 'white' }}>Approved [{leaveSummary.approved}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body bg-info">
              <b style={{ color: 'white' }}>Canceled [{leaveSummary.canceled}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body bg-danger">
              <b style={{ color: 'white' }}>Denied [{leaveSummary.denied}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body bg-primary">
              <b style={{ color: 'white' }}>Total Leave [{leaveSummary.total}]</b>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-2 mt-2">
          <div className="card" style={{ cursor: 'pointer' }}>
            <div className="card-body bg-secondary">
              <b style={{ color: 'white' }}>Remaining Leave [{leaveSummary.remaining}]</b>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Recent Activities</h6>
            </div>
            <div className="card-body">
              {recentActivities.map(activity => (
                <div key={activity.id} className="d-flex align-items-center mb-3">
                  <div className="mr-3">
                    <i className="fas fa-bell text-primary"></i>
                  </div>
                  <div>
                    <div className="font-weight-bold">{activity.action}</div>
                    <div className="text-muted small">by {activity.user} • {activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Up Coming Birthday, Anniversary</h6>
            </div>
            <div className="card-body">
              {upcomingEvents.map((event, idx) => (
                <div className="d-flex justify-content-around w-100 mt-2" key={idx}>
                  <img alt="img" src={event.imgUrl} style={{ height: 35, width: 35, borderRadius: '50%' }} />
                  <b className="mt-1">{event.name}</b>
                  <i className={`fa-solid ${event.type === 'birthday' ? 'fa-cake-candles' : 'fa-gift'} mt-1`} style={{ color: event.type === 'birthday' ? 'red' : 'green' }}></i>
                  <span className="mt-1">{event.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Leave Calendar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-calendar-alt mr-2"></i>
                Leave Calendar Overview
              </h6>
            </div>
            <div className="card-body">
              <LeaveCalendar />
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section - Full Width */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="fas fa-bullhorn mr-2"></i>
                Recent Posts
              </h6>
            </div>
            <div className="card-body">
              {postsLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading posts...</p>
                </div>
              ) : posts.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="mb-3 p-3 border-left border-primary bg-light">
                      <h6 className="font-weight-bold text-dark mb-1">{post.title}</h6>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        {post.content || post.comment}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-user mr-1"></i>
                          {post.author || 'Admin'}
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-calendar mr-1"></i>
                          {new Date(post.addedDate).toLocaleDateString() || 'Today'}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No posts available. Create your first post!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
