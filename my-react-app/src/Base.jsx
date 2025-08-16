import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

function Base({ onLogout }) {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages] = useState([
    { id: 1, text: "Hello, how are you?", time: "10:15 AM", type: "received" },
    { id: 2, text: "I'm good, thanks! What about you?", time: "10:16 AM", type: "sent" },
    { id: 3, text: "Doing well, just working on a project.", time: "10:17 AM", type: "received" },
    { id: 4, text: "Nice! Let me know if you need any help.", time: "10:18 AM", type: "sent" }
  ]);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-light fixed-top navbar-dark bg-danger">
        <div className="container-fluid">
          <h3>
            <Link className="navbar-brand" to="/admin/dash-board">HR Work Sphere</Link>
          </h3>
          <form className="d-flex">
            <input 
              className="form-control me-2 d-none d-md-block" 
              type="search" 
              placeholder="🔍 Search" 
              aria-label="Search" 
            />
            
            <div className="btn-group dropstart">
              <img 
                src="/assets/img/default.png" 
                className="me-2" 
                data-bs-toggle="dropdown" 
                aria-expanded="false" 
                style={{ width: 35, height: 35, cursor: 'pointer', borderRadius: '50%' }}
                alt="Profile"
              />
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="fas fa-user"></i> &nbsp;&nbsp; 
                    <span>{user.name || "Admin"}</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="fas fa-laptop-code"></i>&nbsp; 
                    <span>{user.designation || "Role"}</span>
                  </a>
                </li>
                <hr />
                <li>
                  <button className="dropdown-item" onClick={onLogout}>
                    <i className="fas fa-sign-out-alt"></i>&nbsp; Log out
                  </button>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container-fluid" style={{ position: 'fixed', top: 0, bottom: 0, height: '100vh' }}>
        <div className="row">
          {/* Sidebar */}
          <nav className="col-md-2 sidebar d-none d-md-block">
            <Link to="/admin/dash-board">
              <i className="fas fa-tachometer-alt"></i> <span>Dash Board</span>
            </Link>
            <Link to="/admin/add-employee">
              <i className="fas fa-user-plus"></i> <span>Add Employee</span>
            </Link>
            <Link to="/admin/all-employee">
              <i className="fas fa-users"></i> <span>All Employee</span>
            </Link>
            <Link to="/admin/create-post">
              <i className="fas fa-pencil-alt"></i> <span>Create Post</span>
            </Link>
            <Link to="/admin/status">
              <i className="fas fa-tasks"></i> <span>Status</span>
            </Link>
            <Link to="/admin/payroll-generation">
              <i className="fas fa-money-check-alt"></i> <span>Payroll Generation</span>
            </Link>
            <Link to="/admin/my-profile">
              <i className="fas fa-user"></i> <span>My Profile</span>
            </Link>
            <Link to="/admin/setting">
              <i className="fas fa-cog"></i> <span>Setting</span>
            </Link>
          </nav>

          {/* Main Content */}
          <main className="col-md-10" style={{ paddingTop: 60, backgroundColor: '#f2f3f4', height: '100vh', overflowY: 'auto' }}>
            <Outlet />
            
            {/* Chat Button for Desktop */}
            <i 
              style={{ float: 'right', fontSize: 45, position: 'fixed', bottom: 10, right: 25, cursor: 'pointer' }} 
              className="fa-regular d-none d-md-block"
              onClick={() => setShowChat(true)}
            >
              <img src="/assets/img/chat.gif" alt="Chat" style={{ width: 55, height: 55 }} />
            </i>
            
            {/* Chat Button for Mobile */}
            <i 
              style={{ float: 'right', fontSize: 45, position: 'fixed', bottom: 50, right: 10, cursor: 'pointer' }} 
              className="fa-regular d-block d-md-none"
              onClick={() => setShowChat(true)}
            >
              <img src="/assets/img/chat.gif" alt="Chat" style={{ width: 55, height: 55 }} />
            </i>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="navbar navbar-light fixed-bottom d-block d-md-none" style={{ backgroundColor: '#e3f2fd' }}>
        <div className="d-flex justify-content-around w-100">
          <Link to="/admin/dash-board" className="flex-fill text-center">
            <i className="fas fa-tachometer-alt"></i>
          </Link>
          <Link to="/admin/add-employee" className="flex-fill text-center">
            <i className="fas fa-user-plus"></i>
          </Link>
          <Link to="/admin/all-employee" className="flex-fill text-center">
            <i className="fas fa-users"></i>
          </Link>
          <Link to="/admin/create-post" className="flex-fill text-center">
            <i className="fas fa-pencil-alt"></i>
          </Link>
          <Link to="/admin/status" className="flex-fill text-center">
            <i className="fas fa-tasks"></i>
          </Link>
          <Link to="/admin/my-profile" className="flex-fill text-center">
            <i className="fas fa-user"></i>
          </Link>
          <Link to="/admin/setting" className="flex-fill text-center">
            <i className="fas fa-cog"></i>
          </Link>
        </div>
      </nav>

      {/* Chat Offcanvas */}
      {showChat && (
        <>
          <div className="offcanvas-backdrop fade show" onClick={() => setShowChat(false)}></div>
          <div className="offcanvas offcanvas-end show" tabIndex="-1">
            <div className="offcanvas-header" style={{ paddingTop: 100 }}>
              <h5>Chat</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowChat(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <div className="chat-container" style={{ maxHeight: 400, overflowY: 'auto' }}>
                {chatMessages.map(message => (
                  <div key={message.id} className={message.type === 'received' ? 'received-message' : 'sent-message'} style={message.type === 'sent' ? { textAlign: 'right' } : {}}>
                    <p 
                      className="message" 
                      style={{
                        backgroundColor: message.type === 'received' ? '#e0e0e0' : '#007bff',
                        color: message.type === 'sent' ? 'white' : 'black',
                        padding: 10,
                        borderRadius: 10,
                        maxWidth: '75%',
                        marginBottom: 10,
                        marginLeft: message.type === 'sent' ? 'auto' : '0',
                        marginRight: message.type === 'received' ? 'auto' : '0'
                      }}
                    >
                      {message.text}
                    </p>
                    <small style={{ color: 'gray' }}>{message.time}</small>
                  </div>
                ))}
              </div>
              
              {/* Chat input */}
              <div className="chat-input mt-3">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Type a message..." aria-label="Message" />
                  <button className="btn btn-primary" type="button">Send</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Base;
