import React from 'react';
import { Link } from 'react-router-dom';

// Import team member images from src/assets/img
import shubhamImg from './assets/img/shubham.jpg';
import arpitImg from './assets/img/as.jpg';
import abhishekImg from './assets/img/av.jpeg';
import rajeshImg from './assets/img/rj.jpeg';
import newMemberImg from './assets/img/aj.jpeg'; // 5th team member image

// Import other images for hero and story sections
import aboutHeroImg from './assets/img/aj.jpg'; // Using aj.jpeg for hero
import ourStoryImg from './assets/img/aj.jpg'; // Using aj.jpeg for story section

function About() {
  const teamMembers = [
    {
      name: "Shubham kumar",
      role: "CEO & Founder",
      image: shubhamImg,
      description: "Visionary leader with 15+ years in HR technology"
    },
    {
      name: "Arpit Sharma",
      role: "Head of Product",
      image: arpitImg,
      description: "Product strategist focused on user-centric design"
    },
    {
      name: "Abhishek Verma",
      role: "CTO",
      image: abhishekImg,
      description: "Tech expert driving innovation in HR solutions"
    },
    {
      name: "Rajesh Kumar",
      role: "Head of HR",
      image: rajeshImg,
      description: "HR professional ensuring best practices implementation"
    },
    {
      name: "Akshay Janrao",
      role: "HOD",
      image: newMemberImg,
      description: ""
    }
 
  ];

  return (
    <div className="about-page">
      {/* Header */}
      <header className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <i className="fas fa-building me-2"></i>
            HR Sphere
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
                <Link className="nav-link" to="/">
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
                <Link className="nav-link active" to="/about">
                  <i className="fas fa-info-circle me-1"></i>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-info text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                About HR Sphere
              </h1>
              <p className="lead mb-4">
                We are passionate about transforming human resource management 
                through innovative technology solutions that empower organizations 
                and their employees to thrive in the modern workplace.
              </p>
              <div className="d-flex gap-3">
                <Link to="/login" className="btn btn-light btn-lg">
                  <i className="fas fa-rocket me-2"></i>
                  Join Us Today
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src={aboutHeroImg} 
                alt="About HR Sphere" 
                className="img-fluid rounded shadow-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400/17a2b8/ffffff?text=About+HR+Sphere";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2 className="display-6 fw-bold text-primary mb-4">Our Story</h2>
              <p className="lead mb-4">
                Founded in 2020, HR Sphere emerged from a simple vision: to make 
                human resource management more efficient, transparent, and employee-friendly.
              </p>
              <p className="mb-4">
                Our journey began when our founders, experienced HR professionals and 
                technology experts, recognized the challenges organizations face in 
                managing their most valuable asset - their people. Traditional HR 
                processes were often time-consuming, paper-heavy, and disconnected.
              </p>
              <p className="mb-4">
                We set out to create a comprehensive digital solution that would 
                streamline HR operations while enhancing the employee experience. 
                Today, HR Sphere serves organizations across India, helping them 
                build better workplaces through technology.
              </p>
            </div>
            <div className="col-lg-6">
              <img 
                src={ourStoryImg} 
                alt="Our Story" 
                className="img-fluid rounded shadow"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400/28a745/ffffff?text=Our+Journey";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-primary mb-3">
              Our Mission & Vision
            </h2>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="fas fa-bullseye fa-3x text-primary"></i>
                  </div>
                  <h3 className="card-title text-primary mb-4">Our Mission</h3>
                  <p className="card-text lead">
                    To revolutionize human resource management by providing 
                    intuitive, comprehensive, and scalable solutions that 
                    empower organizations to build thriving workplace cultures 
                    and unlock their team's full potential.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-5 text-center">
                  <div className="mb-4">
                    <i className="fas fa-eye fa-3x text-info"></i>
                  </div>
                  <h3 className="card-title text-info mb-4">Our Vision</h3>
                  <p className="card-text lead">
                    To become the leading HR technology platform in India, 
                    known for innovation, reliability, and exceptional user 
                    experience, while helping organizations create workplaces 
                    where every employee can succeed and grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-primary mb-3">
              Our Core Values
            </h2>
            <p className="lead text-muted">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="mb-3">
                  <i className="fas fa-users fa-3x text-primary"></i>
                </div>
                <h5 className="fw-bold text-primary">People First</h5>
                <p className="text-muted">
                  We believe in putting people at the center of everything we do, 
                  creating solutions that genuinely improve lives.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="mb-3">
                  <i className="fas fa-lightbulb fa-3x text-warning"></i>
                </div>
                <h5 className="fw-bold text-warning">Innovation</h5>
                <p className="text-muted">
                  We continuously innovate to stay ahead of changing needs and 
                  deliver cutting-edge HR solutions.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="mb-3">
                  <i className="fas fa-handshake fa-3x text-success"></i>
                </div>
                <h5 className="fw-bold text-success">Integrity</h5>
                <p className="text-muted">
                  We operate with complete transparency and honesty in all 
                  our interactions and business practices.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="mb-3">
                  <i className="fas fa-star fa-3x text-danger"></i>
                </div>
                <h5 className="fw-bold text-danger">Excellence</h5>
                <p className="text-muted">
                  We strive for excellence in every aspect of our products 
                  and services, never settling for mediocrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold text-primary mb-3">
              Meet Our Team
            </h2>
            <p className="lead text-muted">
              The passionate individuals driving HR Sphere forward
            </p>
          </div>
          
          {/* First row - 3 members */}
          <div className="row g-4 justify-content-center mb-4">
            {teamMembers.slice(0, 3).map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="rounded-circle mb-3"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/120x120/007bff/ffffff?text=${member.name.charAt(0)}`;
                        }}
                      />
                    </div>
                    <h5 className="card-title text-primary fw-bold">{member.name}</h5>
                    <h6 className="card-subtitle mb-3 text-muted">{member.role}</h6>
                    <p className="card-text text-muted small">
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - 2 members */}
          <div className="row g-4 justify-content-center">
            {teamMembers.slice(3, 5).map((member, index) => (
              <div key={index + 3} className="col-lg-4 col-md-6">
                <div className="card h-100 border-0 shadow-sm hover-shadow">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="rounded-circle mb-3"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/120x120/007bff/ffffff?text=${member.name.charAt(0)}`;
                        }}
                      />
                    </div>
                    <h5 className="card-title text-primary fw-bold">{member.name}</h5>
                    <h6 className="card-subtitle mb-3 text-muted">{member.role}</h6>
                    <p className="card-text text-muted small">
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">
              HR Sphere by Numbers
            </h2>
          </div>
          
          <div className="row g-4 text-center">
            <div className="col-lg-3 col-md-6">
              <div className="mb-2">
                <i className="fas fa-building fa-2x"></i>
              </div>
              <h3 className="display-5 fw-bold">500+</h3>
              <p className="lead">Organizations Served</p>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="mb-2">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="display-5 fw-bold">50,000+</h3>
              <p className="lead">Employees Managed</p>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="mb-2">
                <i className="fas fa-calendar-check fa-2x"></i>
              </div>
              <h3 className="display-5 fw-bold">1M+</h3>
              <p className="lead">Leave Requests Processed</p>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="mb-2">
                <i className="fas fa-smile fa-2x"></i>
              </div>
              <h3 className="display-5 fw-bold">98%</h3>
              <p className="lead">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="display-6 fw-bold text-primary mb-4">
            Ready to Join the HR Revolution?
          </h2>
          <p className="lead text-muted mb-4">
            Experience the difference that modern HR management can make for your organization
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg">
              <i className="fas fa-rocket me-2"></i>
              Get Started Today
            </Link>
            <Link to="/" className="btn btn-outline-primary btn-lg">
              <i className="fas fa-home me-2"></i>
              Back to Home
            </Link>
          </div>
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
                <a href="#" className="text-white">
                  <i className="fab fa-facebook fa-lg"></i>
                </a>
                <a href="#" className="text-white">
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
                <a href="#" className="text-white">
                  <i className="fab fa-linkedin fa-lg"></i>
                </a>
                <a href="#" className="text-white">
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link 
                    to="/" 
                    className="text-white-50 text-decoration-none footer-link"
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    <i className="fas fa-home me-2"></i>
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/about" 
                    className="text-white-50 text-decoration-none footer-link"
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    <i className="fas fa-info-circle me-2"></i>
                    About Us
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/login" 
                    className="text-white-50 text-decoration-none footer-link"
                    style={{ transition: 'color 0.3s ease' }}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Link>
                </li>
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
              © 2025 HR Sphere. All rights reserved. | Built with ❤️ for better HR management
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .bg-gradient-info {
          background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
        }
        
        .hover-shadow:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .hero-section {
          min-height: 70vh;
          display: flex;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .hero-section {
            min-height: 50vh;
          }
          
          .display-4 {
            font-size: 2rem;
          }
          
          .display-5 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default About;
