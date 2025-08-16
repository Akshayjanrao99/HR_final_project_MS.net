import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import UserLeaveHistory from './components/UserLeaveHistory';
import { postsAPI, dashboardAPI, leaveAPI, payrollAPI } from './services/api';

function UserDashBoard() {
  const [summary, setSummary] = useState({
    development: 0, qaTesting: 0, networking: 0,
    hrTeam: 0, security: 0, sealsMarket: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState({
    pending: 0, approved: 0, canceled: 0, denied: 0, total: 0, remaining: 0
  });
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [downloading, setDownloading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.id; // Get user ID from localStorage

    // Fetch department summary using proper API
    const fetchDepartmentSummary = async () => {
      try {
        const departmentData = await dashboardAPI.getDepartmentSummary();
        setSummary(departmentData);
      } catch (error) {
        console.error('Error fetching department summary:', error);
        // Use fallback data if API fails
        setSummary({
          development: 15,
          qaTesting: 8,
          networking: 12,
          hrTeam: 5,
          security: 7,
          sealsMarket: 10
        });
      }
    };

    // Fetch leave summary using proper API
    const fetchLeaveSummary = async () => {
      if (userId) {
        try {
          const leaveData = await leaveAPI.getSummary(userId);
          setLeaveSummary(leaveData);
        } catch (error) {
          console.error('Error fetching leave summary:', error);
          // Use fallback data
          setLeaveSummary({
            pending: 2,
            approved: 8,
            canceled: 1,
            denied: 0,
            total: 11,
            remaining: 19
          });
        }
      }
    };

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

    // Mock data for upcoming events (keep as is for now)
    const mockEvents = [
      { name: "Sonu Kumar", imgUrl: "/assets/img/skp.jpg", type: "birthday", date: "13-02-2025" },
      { name: "Mona Kumari", imgUrl: "/assets/img/g1.jpg", type: "anniversary", date: "18-01-2025" }
    ];
    setUpcomingEvents(mockEvents);
  }, []);

  const calculateIncomeTax = (basicSalary) => {
    const annualSalary = basicSalary * 12;
    if (annualSalary <= 250000) return 0;
    if (annualSalary <= 500000) return (annualSalary - 250000) * 0.05 / 12;
    if (annualSalary <= 1000000) return (12500 + (annualSalary - 500000) * 0.2) / 12;
    return (112500 + (annualSalary - 1000000) * 0.3) / 12;
  };

  const downloadPayslip = async () => {
    if (!selectedMonth) {
      alert('Please select a month to download payslip.');
      return;
    }

    setDownloading(true);
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User data:', userData);
      
      // Try to fetch payroll data using proper API
      try {
        const payrollData = await payrollAPI.getByEmployeeAndMonth(
          userData.id, 
          selectedMonth, 
          selectedYear
        );
        console.log('Payroll data received:', payrollData);
        generatePDF(payrollData);
        alert('Payslip downloaded successfully!');
      } catch (apiError) {
        console.error('API Error:', apiError);
        // If no payroll found, generate mock data
        const employeeData = {
          id: userData.id || 2,
          name: userData.name || 'Employee Name',
          department: userData.department || 'Development',
          designation: userData.designation || 'Software Developer',
          salary: userData.salary || 45000
        };

        const basicSalary = employeeData.salary;
        const hra = basicSalary * 0.4;
        const da = basicSalary * 0.1;
        const conveyanceAllowance = 1600;
        const medicalAllowance = 1250;
        const specialAllowance = basicSalary * 0.05;
        const pfDeduction = basicSalary * 0.12;
        const esiDeduction = (basicSalary + hra + da) * 0.0075;
        const professionalTax = 200;
        const incomeTax = calculateIncomeTax(basicSalary);
        const insuranceDeduction = 500;
        
        const grossSalary = basicSalary + hra + da + conveyanceAllowance + medicalAllowance + specialAllowance;
        const totalDeductions = pfDeduction + esiDeduction + professionalTax + incomeTax + insuranceDeduction;
        const netSalary = grossSalary - totalDeductions;

        const mockPayrollData = {
          employeeId: employeeData.id,
          employeeName: employeeData.name,
          department: employeeData.department,
          designation: employeeData.designation,
          month: parseInt(selectedMonth),
          year: selectedYear,
          basicSalary,
          hra,
          da,
          conveyanceAllowance,
          medicalAllowance,
          specialAllowance,
          pfDeduction,
          esiDeduction,
          professionalTax,
          incomeTax,
          insuranceDeduction,
          grossSalary,
          totalDeductions,
          netSalary,
          workingDays: 30,
          presentDays: 30,
          status: 'Generated'
        };

        generatePDF(mockPayrollData);
        alert('Payslip downloaded successfully! (Demo data)');
      }
    } catch (error) {
      console.error('Error downloading payslip:', error);
      alert('Failed to download payslip.');
    } finally {
      setDownloading(false);
    }
  };

  const generatePDF = (payroll) => {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(20);
    doc.setTextColor(40, 116, 166);
    doc.text('HR SPHERE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Payroll Slip', 105, 30, { align: 'center' });
    
    // Employee Information
    doc.setFontSize(14);
    doc.setTextColor(40, 116, 166);
    doc.text('Employee Information', 20, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Employee ID: ${payroll.employeeId}`, 20, 60);
    doc.text(`Name: ${payroll.employeeName}`, 20, 70);
    doc.text(`Department: ${payroll.department}`, 20, 80);
    doc.text(`Designation: ${payroll.designation}`, 20, 90);
    doc.text(`Pay Period: ${payroll.month}/${payroll.year}`, 120, 60);
    doc.text(`Working Days: ${payroll.workingDays}`, 120, 70);
    doc.text(`Present Days: ${payroll.presentDays}`, 120, 80);
    
    // Earnings Section
    doc.setFontSize(14);
    doc.setTextColor(40, 116, 166);
    doc.text('Earnings', 20, 110);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let yPos = 120;
    doc.text(`Basic Salary:`, 20, yPos);
    doc.text(`₹${payroll.basicSalary.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`HRA (40%):`, 20, yPos);
    doc.text(`₹${payroll.hra.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`DA (10%):`, 20, yPos);
    doc.text(`₹${payroll.da.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`Conveyance Allowance:`, 20, yPos);
    doc.text(`₹${payroll.conveyanceAllowance.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`Medical Allowance:`, 20, yPos);
    doc.text(`₹${payroll.medicalAllowance.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`Special Allowance:`, 20, yPos);
    doc.text(`₹${payroll.specialAllowance.toFixed(2)}`, 150, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(40, 116, 166);
    doc.text(`Gross Salary:`, 20, yPos);
    doc.text(`₹${payroll.grossSalary.toFixed(2)}`, 150, yPos);
    
    // Deductions Section
    yPos += 20;
    doc.setFontSize(14);
    doc.text('Deductions', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`PF (12%):`, 20, yPos);
    doc.text(`₹${payroll.pfDeduction.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`ESI (0.75%):`, 20, yPos);
    doc.text(`₹${payroll.esiDeduction.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`Professional Tax:`, 20, yPos);
    doc.text(`₹${payroll.professionalTax.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`Income Tax:`, 20, yPos);
    doc.text(`₹${payroll.incomeTax.toFixed(2)}`, 150, yPos);
    yPos += 10;
    doc.text(`Insurance Premium:`, 20, yPos);
    doc.text(`₹${payroll.insuranceDeduction.toFixed(2)}`, 150, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(220, 53, 69);
    doc.text(`Total Deductions:`, 20, yPos);
    doc.text(`₹${payroll.totalDeductions.toFixed(2)}`, 150, yPos);
    
    // Net Salary
    yPos += 20;
    doc.setFontSize(16);
    doc.setTextColor(40, 116, 166);
    doc.text(`Net Salary: ₹${payroll.netSalary.toFixed(2)}`, 105, yPos, { align: 'center' });
    
    // Footer
    yPos += 20;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('This is a computer-generated payslip and does not require a signature.', 105, yPos, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos + 10, { align: 'center' });

    doc.save(`payslip_${payroll.employeeName}_${payroll.month}_${payroll.year}.pdf`);
  };
  return (
    <section>
      <div className="row">
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
      {/* Posts and Upcoming Events */}
      <div className="row mb-5">
        <div className="col-md-8 mt-3">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-bullhorn mr-2"></i>
                Company Posts & Announcements
              </h5>
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
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {posts.map((post) => (
                    <div key={post.id} className="mb-3 p-3 border-left border-primary bg-light rounded">
                      <h6 className="font-weight-bold text-dark mb-2">{post.title}</h6>
                      <p className="text-muted mb-2" style={{ fontSize: '0.95rem' }}>
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
                  <p className="text-muted">No posts available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4 mt-3">
          <div className="card">
            <div className="card-body">
              <h5>Up Coming Birthday, Anniversary</h5>
              <hr />
              {upcomingEvents.length === 0 ? (
                <div>No upcoming events found.</div>
              ) : (
                upcomingEvents.map((event, idx) => (
                  <div className="d-flex justify-content-around w-100 mt-2" key={idx}>
                    <img alt="img" src={event.imgUrl} style={{ height: 35, width: 35, borderRadius: '50%' }} />
                    <b className="mt-1">{event.name}</b>
                    <i className={`fa-solid ${event.type === 'birthday' ? 'fa-cake-candles' : 'fa-gift'} mt-1`} style={{ color: event.type === 'birthday' ? 'red' : 'green' }}></i>
                    <span className="mt-1">{event.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Payslip Download Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-download me-2"></i>
                Download My Payslip
              </h5>
            </div>
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Select Month</label>
                  <select 
                    className="form-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Choose a month...</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Year</label>
                  <select 
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {Array.from({length: 5}, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-5">
                  <button 
                    className="btn btn-success"
                    onClick={downloadPayslip}
                    disabled={!selectedMonth || downloading}
                  >
                    {downloading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-download me-2"></i>
                        Download Payslip
                      </>
                    )}
                  </button>
                </div>
              </div>
              <small className="text-muted mt-2 d-block">
                Select a month and year to download your payslip as PDF.
              </small>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Leave History Section */}
      <div className="row mt-4">
        <div className="col-12">
          <UserLeaveHistory />
        </div>
      </div>
    </section>
  );
}

export default UserDashBoard; 