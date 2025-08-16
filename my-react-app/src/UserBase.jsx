import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function UserBase({ onLogout }) {
  const navigate = useNavigate();
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = (e) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };
  return (
    <>
      <nav className="navbar navbar-light fixed-top navbar-dark bg-success">
        <div className="container-fluid">
          <h3>
            <Link className="navbar-brand" to="/user/dash-board">HR Work Sphere</Link>
          </h3>
          <form className="d-flex">
            <Link to="/user/dash-board" className="btn btn-primary"><b>Dash Board</b></Link>
            <Link to="/user/compose" className="btn btn-primary ms-4"><b>Compose</b></Link>
            <Link to="/user/profile" className="btn btn-primary ms-4"><b>My Profile</b></Link>
            <Link to="/user/setting" className="btn btn-primary ms-4 me-4"><b>Setting</b></Link>
            <div className="btn-group dropstart">
              <img src="/assets/img/default.png" className="me-2" data-bs-toggle="dropdown" aria-expanded="false" style={{ width: 35, height: 35, cursor: 'pointer', borderRadius: '50%' }} alt="profile" />
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#"><i className="fas fa-user"></i> &nbsp;&nbsp; <span>{user.name || "User"}</span></a></li>
                <li><a className="dropdown-item" href="#"><i className="fas fa-laptop-code"></i>&nbsp; <span>{user.designation || "Role"}</span></a></li><hr />
                <li><a className="dropdown-item" href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i>&nbsp; Log out</a></li>
              </ul>
            </div>
          </form>
        </div>
      </nav>
      <div className="container-fluid" style={{ position: 'fixed', top: 0, bottom: 0, height: '100vh' }}>
        <div className="row">
        <main style={{ paddingTop: 60, backgroundColor: '#f2f3f4', height: '100vh', overflowY: 'auto' }}>
            {/* Content injection point */}
            <Outlet />
            <i style={{ float: 'right', fontSize: 45, position: 'fixed', bottom: 10, right: 25, cursor: 'pointer' }} className="fa-regular d-none d-md-block" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
              <img src="/assets/img/chat.gif" alt="chat" style={{ width: 55, height: 55 }} />
            </i>
            <i style={{ float: 'right', fontSize: 45, position: 'fixed', bottom: 50, right: 10, cursor: 'pointer' }} className="fa-regular d-block d-md-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
              <img src="/assets/img/chat.gif" alt="chat" style={{ width: 55, height: 55 }} />
            </i>
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
              <div className="offcanvas-header" style={{ paddingTop: 100 }}>
                <h5 id="offcanvasRightLabel">Chat</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <div className="chat-container" style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {/* Example chat messages */}
                  <div className="received-message">
                    <p className="message" style={{ backgroundColor: '#e0e0e0', padding: 10, borderRadius: 10, maxWidth: '75%', marginBottom: 10 }}>
                      Hello, how are you?
                    </p>
                    <small style={{ color: 'gray' }}>10:15 AM</small>
                  </div>
                  <div className="sent-message" style={{ textAlign: 'right' }}>
                    <p className="message" style={{ backgroundColor: '#007bff', color: 'white', padding: 10, borderRadius: 10, maxWidth: '75%', marginBottom: 10 }}>
                      I'm good, thanks! What about you?
                    </p>
                    <small style={{ color: 'gray' }}>10:16 AM</small>
                  </div>
                  <div className="received-message">
                    <p className="message" style={{ backgroundColor: '#e0e0e0', padding: 10, borderRadius: 10, maxWidth: '75%', marginBottom: 10 }}>
                      Doing well, just working on a project.
                    </p>
                    <small style={{ color: 'gray' }}>10:17 AM</small>
                  </div>
                  <div className="sent-message" style={{ textAlign: 'right' }}>
                    <p className="message" style={{ backgroundColor: '#007bff', color: 'white', padding: 10, borderRadius: 10, maxWidth: '75%', marginBottom: 10 }}>
                      Nice! Let me know if you need any help.
                    </p>
                    <small style={{ color: 'gray' }}>10:18 AM</small>
                  </div>
                </div>
                <div className="chat-input mt-3">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Type a message..." aria-label="Message" />
                    <button className="btn btn-primary" type="button">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default UserBase; 