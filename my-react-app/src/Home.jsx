import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      {/* Header */}
      <header className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="fas fa-building me-2"></i>
            HR Work Sphere
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  <i className="fas fa-home me-1"></i>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  <i className="fas fa-info-circle me-1"></i>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4 single-line-title">
                Welcome to Human Resource Work Sphere
              </h1>
              <p className="lead mb-4">
                Streamline your human resource management with our comprehensive 
                HR portal. Manage employees, track leave requests, handle payroll, 
                and much more - all in one place.
              </p>
              <div className="d-flex gap-3">
                <Link to="/login" className="btn btn-light btn-lg">
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Get Started
                </Link>
                <Link to="/about" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-info-circle me-2"></i>
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="/assets/img/src/assets/img/hr.webp" 
                alt="HR Management" 
                className="img-fluid rounded shadow-lg"
                onError={(e) => {
                 // e.target.src = "https://via.placeholder.com/600x400/007bff/ffffff?text=HR+Management+System";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Gallery */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              Our HR Work Sphere Solutions
            </h2>
            <p className="lead text-muted">
              Discover the power of modern HR Work Sphere with our feature-rich platform
            </p>
          </div>
          
          <div className="row g-4">
            {/* Feature 1 - Employee Management */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm hover-shadow">
                <img 
                  src="/assets/img/EM.jpg" 
                  className="card-img-top feature-image" 
                  alt="Employee Management"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x250/28a745/ffffff?text=Employee+Management";
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    <i className="fas fa-users me-2"></i>
                    Employee Management
                  </h5>
                  <p className="card-text">
                    Efficiently manage your workforce with comprehensive employee profiles, 
                    department organization, and role management capabilities.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 - Leave Management */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm hover-shadow">
                <img 
                  src="/assets/img/LM.jpg" 
                  className="card-img-top feature-image" 
                  alt="Leave Management"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x250/17a2b8/ffffff?text=Leave+Management";
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title text-info">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Leave Management
                  </h5>
                  <p className="card-text">
                    Streamline leave requests, approvals, and tracking with our 
                    intuitive calendar system and automated workflow processes.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 - Payroll System */}
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm hover-shadow">
                <img 
                  src="/assets/img/PM.jpg" 
                  className="card-img-top feature-image" 
                  alt="Payroll Management"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x250/ffc107/000000?text=Payroll+System";
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title text-warning">
                    <i className="fas fa-rupee-sign me-2"></i>
                    Payroll Management
                  </h5>
                  <p className="card-text">
                    Handle salary calculations, generate pay slips, and manage 
                    compensation packages with our robust payroll system.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 - Analytics Dashboard */}
            <div className="col-lg-6 col-md-6">
              <div className="card h-100 shadow-sm hover-shadow">
                <img 
                  src="/assets/img/AR.jpg" 
                  className="card-img-top feature-image" 
                  alt="Analytics & Reporting"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x250/dc3545/ffffff?text=Analytics+Dashboard";
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title text-danger">
                    <i className="fas fa-chart-bar me-2"></i>
                    Analytics & Reporting
                  </h5>
                  <p className="card-text">
                    Get insights into your organization with comprehensive analytics, 
                    reports, and data visualization tools for better decision making.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 - Communication Hub */}
            <div className="col-lg-6 col-md-6">
              <div className="card h-100 shadow-sm hover-shadow">
                <img 
                  src="/assets/img/CH.jpg" 
                  className="card-img-top feature-image" 
                  alt="Communication Hub"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x250/6f42c1/ffffff?text=Communication+Hub";
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title text-purple">
                    <i className="fas fa-comments me-2"></i>
                    Communication Hub
                  </h5>
                  <p className="card-text">
                    Foster team collaboration with internal messaging, announcements, 
                    and company-wide communication tools integrated into your workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="display-6 fw-bold mb-4">
            Ready to Transform Your HR System?
          </h2>
          <p className="lead mb-4">
            Join thousands of organizations already using HR Sphere to streamline their operations
          </p>
          <Link to="/login" className="btn btn-light btn-lg">
            <i className="fas fa-rocket me-2"></i>
            Start Your Journey Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h5 className="fw-bold mb-3">
                <i className="fas fa-building me-2"></i>
                HR Sphere
              </h5>
              <p className="mb-3">
                Empowering organizations with comprehensive human resource management 
                solutions for the modern workplace.
              </p>
              <div className="d-flex gap-3">
                <a href="https://www.facebook.com/" className="text-white">
                  <i className="fab fa-facebook fa-lg"></i>
                </a>
                <a href="http://x.com/" className="text-white">
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
                <a href="https://www.linkedin.com/" className="text-white">
                  <i className="fab fa-linkedin fa-lg"></i>
                </a>
                <a href="https://www.instagram.com/" className="text-white">
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white-50 text-decoration-none">Home</Link></li>
                <li><Link to="/about" className="text-white-50 text-decoration-none">About Us</Link></li>
                <li><Link to="/login" className="text-white-50 text-decoration-none">Login</Link></li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Contact Info</h6>
              <p className="text-white-50 mb-1">
                <i className="fas fa-envelope me-2"></i>
                info@hrsphere.com
              </p>
              <p className="text-white-50 mb-1">
                <i className="fas fa-phone me-2"></i>
                +91 9876543210
              </p>
              <p className="text-white-50">
                <i className="fas fa-map-marker-alt me-2"></i>
                India
              </p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center">
            <p className="mb-0 text-white-50">
              © 2025 HR Work Sphere. All rights reserved. | Built with ❤️ for better HR Work
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        
        .hover-shadow:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .text-purple {
          color: #6f42c1 !important;
        }
        
        .hero-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
        }
        
        .single-line-title {
          white-space: nowrap;
          font-size: clamp(1.2rem, 4vw, 3.5rem);
          line-height: 1.2;
        }
        
        .feature-image {
          height: 250px;
          width: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.3s ease;
        }
        
        .hover-shadow:hover .feature-image {
          transform: scale(1.05);
        }
        
        @media (max-width: 992px) {
          .single-line-title {
            font-size: clamp(1.1rem, 3.5vw, 2.5rem);
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            min-height: 60vh;
          }
          
          .single-line-title {
            font-size: clamp(1rem, 3vw, 2rem);
            white-space: normal;
            word-break: break-word;
          }
        }
        
        @media (max-width: 576px) {
          .single-line-title {
            font-size: clamp(0.9rem, 2.5vw, 1.5rem);
            white-space: normal;
            word-break: break-word;
            line-height: 1.1;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
