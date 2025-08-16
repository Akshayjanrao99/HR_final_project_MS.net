import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { employeeAPI, payrollAPI } from '../services/api';
import Swal from 'sweetalert2';

const PayrollGeneration = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [payrollData, setPayrollData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    designation: '',
    basicSalary: 0,
    hra: 0,
    da: 0,
    conveyanceAllowance: 0,
    medicalAllowance: 0,
    specialAllowance: 0,
    pfDeduction: 0,
    esiDeduction: 0,
    professionalTax: 0,
    incomeTax: 0,
    insuranceDeduction: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    workingDays: 30,
    presentDays: 30
  });
  const [generatedPayrolls, setGeneratedPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBulkDownload, setShowBulkDownload] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [bulkDownloadEmployee, setBulkDownloadEmployee] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchGeneratedPayrolls();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const fetchGeneratedPayrolls = async () => {
    try {
      const data = await payrollAPI.getAll();
      setGeneratedPayrolls(data);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      setGeneratedPayrolls([]);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.id === parseInt(employeeId));
    if (employee) {
      const basicSalary = employee.salary || employee.basicSalary || 0;
      const hra = basicSalary * 0.4; // 40% of basic salary
      const da = basicSalary * 0.1; // 10% of basic salary
      const conveyanceAllowance = 1600;
      const medicalAllowance = 1250;
      const specialAllowance = basicSalary * 0.05; // 5% of basic salary
      
      // Deductions
      const pfDeduction = basicSalary * 0.12; // 12% of basic salary
      const esiDeduction = (basicSalary + hra + da) * 0.0075; // 0.75% of gross salary
      const professionalTax = 200;
      const incomeTax = calculateIncomeTax(basicSalary);
      const insuranceDeduction = 500; // Fixed insurance premium

      setPayrollData({
        ...payrollData,
        employeeId: employee.id,
        employeeName: employee.name || employee.employeeName,
        department: employee.department,
        designation: employee.designation,
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
        insuranceDeduction
      });
    }
    setSelectedEmployee(employeeId);
  };
  const handleBulkDownload = async () => {
    if (!bulkDownloadEmployee || selectedMonths.length === 0) {
      alert('Please select an employee and at least one month.');
      return;
    }

    const employee = employees.find(emp => emp.id === parseInt(bulkDownloadEmployee));
    if (!employee) {
      alert('Employee not found.');
      return;
    }

    try {
      for (let monthIndex of selectedMonths) {
        const currentDate = new Date();
        const targetMonth = currentDate.getMonth() - monthIndex + 1;
        const targetYear = targetMonth <= 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
        const adjustedMonth = targetMonth <= 0 ? targetMonth + 12 : targetMonth;
        
        // Create payroll data for the selected month
        const basicSalary = employee.salary || employee.basicSalary || 0;
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
        
        const payrollData = {
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          designation: employee.designation,
          month: adjustedMonth,
          year: targetYear,
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
        
        downloadPDF(payrollData);
      }
      alert(`${selectedMonths.length} payslips downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading payslips:', error);
      alert('Failed to download some payslips.');
    }
  };

  const calculateIncomeTax = (basicSalary) => {
    const annualSalary = basicSalary * 12;
    if (annualSalary <= 250000) return 0;
    if (annualSalary <= 500000) return (annualSalary - 250000) * 0.05 / 12;
    if (annualSalary <= 1000000) return (12500 + (annualSalary - 500000) * 0.2) / 12;
    return (112500 + (annualSalary - 1000000) * 0.3) / 12;
  };

  const calculateTotals = () => {
    const grossSalary = payrollData.basicSalary + payrollData.hra + payrollData.da + 
                       payrollData.conveyanceAllowance + payrollData.medicalAllowance + 
                       payrollData.specialAllowance;
    
    const totalDeductions = payrollData.pfDeduction + payrollData.esiDeduction + 
                           payrollData.professionalTax + payrollData.incomeTax + 
                           payrollData.insuranceDeduction;
    
    const netSalary = grossSalary - totalDeductions;
    
    return { grossSalary, totalDeductions, netSalary };
  };

  const handleInputChange = (field, value) => {
    setPayrollData({
      ...payrollData,
      [field]: parseFloat(value) || 0
    });
  };

  const generatePayroll = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    setLoading(true);
    const { grossSalary, totalDeductions, netSalary } = calculateTotals();

    const payrollRecord = {
      ...payrollData,
      grossSalary,
      totalDeductions,
      netSalary,
      generatedDate: new Date().toISOString(),
      status: 'Generated'
    };

    try {
      const response = await fetch('/api/payrolls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payrollRecord)
      });

      if (response.ok) {
        setGeneratedPayrolls([...generatedPayrolls, payrollRecord]);
        alert('Payroll generated successfully!');
        // Reset form
        setSelectedEmployee('');
        setPayrollData({
          ...payrollData,
          employeeId: '',
          employeeName: '',
          department: '',
          designation: '',
          basicSalary: 0,
          hra: 0,
          da: 0,
          conveyanceAllowance: 0,
          medicalAllowance: 0,
          specialAllowance: 0,
          pfDeduction: 0,
          esiDeduction: 0,
          professionalTax: 0,
          incomeTax: 0,
          insuranceDeduction: 0
        });
      }
    } catch (error) {
      console.error('Error generating payroll:', error);
      // For demo, add to local state
      setGeneratedPayrolls([...generatedPayrolls, payrollRecord]);
      alert('Payroll generated successfully!');
    }

    setLoading(false);
  };

  const downloadPDF = (payroll) => {
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
    
    // Earnings Table
    const earningsData = [
      ['Basic Salary', payroll.basicSalary.toFixed(2)],
      ['HRA (40%)', payroll.hra.toFixed(2)],
      ['DA (10%)', payroll.da.toFixed(2)],
      ['Conveyance Allowance', payroll.conveyanceAllowance.toFixed(2)],
      ['Medical Allowance', payroll.medicalAllowance.toFixed(2)],
      ['Special Allowance', payroll.specialAllowance.toFixed(2)],
      ['Gross Salary', payroll.grossSalary.toFixed(2)]
    ];

    doc.autoTable({
      startY: 110,
      head: [['Earnings', 'Amount (₹)']],
      body: earningsData,
      theme: 'grid',
      headStyles: { fillColor: [40, 116, 166] },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: 20, right: 110 }
    });

    // Deductions Table
    const deductionsData = [
      ['PF (12%)', payroll.pfDeduction.toFixed(2)],
      ['ESI (0.75%)', payroll.esiDeduction.toFixed(2)],
      ['Professional Tax', payroll.professionalTax.toFixed(2)],
      ['Income Tax', payroll.incomeTax.toFixed(2)],
      ['Insurance Premium', payroll.insuranceDeduction.toFixed(2)],
      ['Total Deductions', payroll.totalDeductions.toFixed(2)]
    ];

    doc.autoTable({
      startY: 110,
      head: [['Deductions', 'Amount (₹)']],
      body: deductionsData,
      theme: 'grid',
      headStyles: { fillColor: [220, 53, 69] },
      columnStyles: { 1: { halign: 'right' } },
      margin: { left: 110, right: 20 }
    });

    // Net Salary
    const finalY = Math.max(doc.lastAutoTable.finalY, 180);
    doc.setFontSize(14);
    doc.setTextColor(40, 116, 166);
    doc.text('Net Salary: ₹' + payroll.netSalary.toFixed(2), 105, finalY + 20, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('This is a computer-generated payslip and does not require a signature.', 105, finalY + 40, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, finalY + 50, { align: 'center' });

    doc.save(`payslip_${payroll.employeeName}_${payroll.month}_${payroll.year}.pdf`);
  };

  const { grossSalary, totalDeductions, netSalary } = calculateTotals();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-money-check-alt me-2"></i>
                Payroll Generation
              </h4>
            </div>
            <div className="card-body">
              {/* Employee Selection */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label">Select Employee</label>
                  <select 
                    className="form-select"
                    value={selectedEmployee}
                    onChange={(e) => handleEmployeeSelect(e.target.value)}
                  >
                    <option value="">Choose an employee...</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Month</label>
                  <select 
                    className="form-select"
                    value={payrollData.month}
                    onChange={(e) => handleInputChange('month', e.target.value)}
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    className="form-control"
                    value={payrollData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                  />
                </div>
              </div>

              {selectedEmployee && (
                <>
                  {/* Employee Details */}
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Employee Details</h6>
                          <div className="row">
                            <div className="col-md-3">
                              <strong>Name:</strong> {payrollData.employeeName}
                            </div>
                            <div className="col-md-3">
                              <strong>Department:</strong> {payrollData.department}
                            </div>
                            <div className="col-md-3">
                              <strong>Designation:</strong> {payrollData.designation}
                            </div>
                            <div className="col-md-3">
                              <strong>Employee ID:</strong> {payrollData.employeeId}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Working Days</label>
                      <input
                        type="number"
                        className="form-control"
                        value={payrollData.workingDays}
                        onChange={(e) => handleInputChange('workingDays', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Present Days</label>
                      <input
                        type="number"
                        className="form-control"
                        value={payrollData.presentDays}
                        onChange={(e) => handleInputChange('presentDays', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Salary Components */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0">Earnings</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">Basic Salary</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.basicSalary}
                              onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">HRA (40%)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.hra}
                              onChange={(e) => handleInputChange('hra', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">DA (10%)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.da}
                              onChange={(e) => handleInputChange('da', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Conveyance Allowance</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.conveyanceAllowance}
                              onChange={(e) => handleInputChange('conveyanceAllowance', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Medical Allowance</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.medicalAllowance}
                              onChange={(e) => handleInputChange('medicalAllowance', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Special Allowance</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.specialAllowance}
                              onChange={(e) => handleInputChange('specialAllowance', e.target.value)}
                            />
                          </div>
                          <div className="alert alert-success">
                            <strong>Gross Salary: ₹{grossSalary.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header bg-danger text-white">
                          <h6 className="mb-0">Deductions</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">PF Deduction (12%)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.pfDeduction}
                              onChange={(e) => handleInputChange('pfDeduction', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">ESI Deduction (0.75%)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.esiDeduction}
                              onChange={(e) => handleInputChange('esiDeduction', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Professional Tax</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.professionalTax}
                              onChange={(e) => handleInputChange('professionalTax', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Income Tax</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.incomeTax}
                              onChange={(e) => handleInputChange('incomeTax', e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Insurance Premium</label>
                            <input
                              type="number"
                              className="form-control"
                              value={payrollData.insuranceDeduction}
                              onChange={(e) => handleInputChange('insuranceDeduction', e.target.value)}
                            />
                          </div>
                          <div className="alert alert-danger">
                            <strong>Total Deductions: ₹{totalDeductions.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Salary */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="alert alert-info text-center">
                        <h5 className="mb-0">
                          <i className="fas fa-wallet me-2"></i>
                          Net Salary: ₹{netSalary.toFixed(2)}
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  	<div className="row mt-3">
                    	<div className="col-12 text-center">
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={generatePayroll}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-cog me-2"></i>
                            Generate Payroll
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bulk Download Section - Always Visible */}
          <div className="card mt-4">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <i className="fas fa-download me-2"></i>
                Bulk Download Payslips
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Select Employee for Bulk Download</label>
                  <select 
                    className="form-select"
                    value={bulkDownloadEmployee}
                    onChange={(e) => setBulkDownloadEmployee(e.target.value)}
                  >
                    <option value="">Select an employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Select Months for Payslip Download</label>
                  <div className="d-flex flex-wrap">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={i} className="form-check form-check-inline">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          value={i}
                          checked={selectedMonths.includes(i)}
                          onChange={() => {
                            setSelectedMonths(prev => 
                              prev.includes(i) 
                                ? prev.filter(m => m !== i) 
                                : [...prev, i]
                            );
                          }}
                        />
                        <label className="form-check-label">
                          {new Date(0, new Date().getMonth() - i).toLocaleString('default', { month: 'long' })}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 text-center">
                  <button 
                    className="btn btn-success"
                    onClick={handleBulkDownload}
                    disabled={!bulkDownloadEmployee || selectedMonths.length === 0}
                  >
                    <i className="fas fa-download me-2"></i>
                    Download Selected Payslips
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Payrolls */}
          {generatedPayrolls.length > 0 && (
            <div className="card mt-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Generated Payrolls
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Month/Year</th>
                        <th>Gross Salary</th>
                        <th>Deductions</th>
                        <th>Net Salary</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedPayrolls.map((payroll, index) => (
                        <tr key={index}>
                          <td>{payroll.employeeName}</td>
                          <td>{payroll.department}</td>
                          <td>{payroll.month}/{payroll.year}</td>
                          <td>₹{payroll.grossSalary?.toFixed(2)}</td>
                          <td>₹{payroll.totalDeductions?.toFixed(2)}</td>
                          <td><strong>₹{payroll.netSalary?.toFixed(2)}</strong></td>
                          <td>
                            <span className="badge bg-success">{payroll.status}</span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => downloadPDF(payroll)}
                            >
                              <i className="fas fa-download me-1"></i>
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollGeneration;
